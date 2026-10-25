import Fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import { z } from 'zod';
import type { Config } from './config.ts';
import type { GoogleVerifier } from './google.ts';
import { Hub } from './hub.ts';
import { Store, type User } from './store.ts';
import { signAccessToken, verifyAccessToken } from './tokens.ts';

export interface AppDeps {
  config: Config;
  store: Store;
  verifyGoogle: GoogleVerifier;
}

const MAX_RECORDS_PER_PUSH = 500;
const MAX_PULL_LIMIT = 1000;
const WS_AUTH_TIMEOUT_MS = 10_000;

const RecordSchema = z.object({
  guid: z.string().min(1).max(128),
  video_id: z.string().min(1).max(64),
  start: z.number().finite().nonnegative(),
  comment: z.string().max(100_000),
  write_counter: z.number().int().positive(),
  deleted_at: z.number().optional(),
});

const GoogleLoginBody = z.object({ idToken: z.string().min(1) });
const RefreshBody = z.object({ refreshToken: z.string().min(1) });
const PushBody = z.object({
  deviceId: z.string().min(1).max(128),
  records: z.array(RecordSchema).max(MAX_RECORDS_PER_PUSH),
});
const PullQuery = z.object({
  since: z.coerce.number().int().nonnegative().default(0),
  limit: z.coerce.number().int().positive().max(MAX_PULL_LIMIT).default(MAX_PULL_LIMIT),
});
const WsAuthMessage = z.object({
  type: z.literal('auth'),
  token: z.string().min(1),
  deviceId: z.string().min(1).max(128),
});

declare module 'fastify' {
  interface FastifyRequest {
    userId: string;
  }
}

export async function buildApp({ config, store, verifyGoogle }: AppDeps): Promise<FastifyInstance> {
  const app = Fastify({ logger: process.env.NODE_ENV !== 'test', bodyLimit: 5 * 1024 * 1024 });
  const hub = new Hub();

  await app.register(cors, { origin: config.allowedOrigins });
  await app.register(websocket);
  app.decorateRequest('userId', '');
  app.addHook('onClose', async () => hub.close());

  const authenticate = async (req: FastifyRequest, reply: FastifyReply) => {
    const header = req.headers.authorization;
    const userId = header?.startsWith('Bearer ')
      ? await verifyAccessToken(config.jwtSecret, header.slice(7))
      : null;
    if (!userId) return reply.code(401).send({ error: 'unauthorized' });
    req.userId = userId;
  };

  const issueSession = async (user: User, refreshToken: string) => ({
    accessToken: await signAccessToken(config.jwtSecret, user.id, config.accessTokenTtlSeconds),
    accessTokenExpiresAt: Date.now() + config.accessTokenTtlSeconds * 1000,
    refreshToken,
    user,
  });

  app.get('/healthz', async () => ({ ok: true }));

  // --- auth ---

  // One endpoint for both sign-up and sign-in: the first valid Google login creates the account.
  app.post('/auth/google', async (req, reply) => {
    const body = GoogleLoginBody.safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: 'invalid_request' });

    let identity;
    try {
      identity = await verifyGoogle(body.data.idToken);
    } catch (err) {
      req.log.info({ err: (err as Error).message }, 'google token rejected');
      return reply.code(401).send({ error: 'invalid_google_token' });
    }

    const { user, isNewUser } = store.upsertGoogleUser(identity);
    const refreshToken = store.createRefreshToken(user.id, config.refreshTokenTtlSeconds);
    return { ...(await issueSession(user, refreshToken)), isNewUser };
  });

  app.post('/auth/refresh', async (req, reply) => {
    const body = RefreshBody.safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: 'invalid_request' });

    const result = store.rotateRefreshToken(body.data.refreshToken, {
      ttlSeconds: config.refreshTokenTtlSeconds,
      familyMaxSeconds: config.refreshFamilyMaxSeconds,
      graceSeconds: config.refreshReuseGraceSeconds,
    });
    if (result.status === 'reuse') req.log.warn('refresh token reuse detected; session revoked');
    if (result.status !== 'ok') return reply.code(401).send({ error: 'invalid_refresh_token' });
    return issueSession(result.user, result.refreshToken);
  });

  app.post('/auth/logout', async (req, reply) => {
    const body = RefreshBody.safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: 'invalid_request' });
    store.revokeRefreshToken(body.data.refreshToken);
    return reply.code(204).send();
  });

  app.get('/me', { preHandler: authenticate }, async (req, reply) => {
    const user = store.getUser(req.userId);
    return user ?? reply.code(401).send({ error: 'unauthorized' });
  });

  // --- sync ---

  app.post('/sync/push', { preHandler: authenticate }, async (req, reply) => {
    const body = PushBody.safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: 'invalid_request', detail: z.prettifyError(body.error) });

    const result = store.applyPush(req.userId, body.data.deviceId, body.data.records);
    if (result.accepted.length > 0) {
      hub.broadcast(req.userId, body.data.deviceId, {
        type: 'changes',
        fromSeq: result.fromSeq,
        seq: result.seq,
        records: result.accepted,
      });
    }
    return result;
  });

  app.get('/sync/pull', { preHandler: authenticate }, async (req, reply) => {
    const query = PullQuery.safeParse(req.query);
    if (!query.success) return reply.code(400).send({ error: 'invalid_request' });
    return store.pullSince(req.userId, query.data.since, query.data.limit);
  });

  // Browsers can't set headers on a WebSocket, so the access token arrives as the first message
  // instead of in the URL (which would end up in access logs).
  app.get('/sync/ws', { websocket: true }, (socket) => {
    const authTimer = setTimeout(() => socket.close(4401, 'auth timeout'), WS_AUTH_TIMEOUT_MS);
    let authenticated = false;

    socket.on('close', () => clearTimeout(authTimer));
    socket.on('message', async (raw) => {
      if (authenticated) return; // server -> client only after the handshake

      try {
        const message = WsAuthMessage.safeParse(JSON.parse(raw.toString()));
        if (!message.success) return socket.close(4400, 'bad auth message');

        authenticated = true; // set before awaiting so a second message can't start a second handshake
        const userId = await verifyAccessToken(config.jwtSecret, message.data.token);
        if (!userId) return socket.close(4401, 'unauthorized');
        if (socket.readyState !== socket.OPEN) return;

        clearTimeout(authTimer);
        hub.add(userId, message.data.deviceId, socket);
        socket.send(JSON.stringify({ type: 'ready', seq: store.currentSeq(userId) }));
      } catch (err) {
        app.log.warn({ err }, 'websocket handshake failed');
        socket.close(4400, 'bad auth message');
      }
    });
  });

  return app;
}
