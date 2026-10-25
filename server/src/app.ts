import Fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import { z } from 'zod';
import { clientInfo } from './client-info.ts';
import type { Config } from './config.ts';
import type { GoogleVerifier } from './google.ts';
import { Hub } from './hub.ts';
import { Store, type User } from './store.ts';
import { createSubscriptionsClient, SubscriptionsAuthError, type SubscriptionsLookup } from './subscriptions.ts';
import { signAccessToken, verifyAccessToken } from './tokens.ts';
import { createVideoPrefetcher, VIDEO_INFO_TTL_MS, type VideoLookup } from './youtube.ts';
import { registerWeb } from './web.ts';

export interface AppDeps {
  config: Config;
  store: Store;
  verifyGoogle: GoogleVerifier;
  youtube?: VideoLookup;
  /** Lists a Google account's subscribed channels; defaults to the real YouTube Data API. */
  subscriptions?: SubscriptionsLookup;
  /** Also look up videos that are already synced but were never cached (once, at startup). */
  backfillVideoInfo?: boolean;
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

const SubscriptionsSyncBody = z.object({ accessToken: z.string().min(1).max(4096) });
const VideoIdParam = z.string().regex(/^[\w-]{1,64}$/);
const VideoAccessReport = z.object({
  videoId: VideoIdParam,
  channelId: z.string().regex(/^[\w-]{1,64}$/),
  membersOnly: z.boolean(),
});
const GoogleLoginBody = z.object({ idToken: z.string().min(1) });
const RefreshBody = z.object({ refreshToken: z.string().min(1) });
const PushBody = z.object({
  deviceId: z.string().min(1).max(128),
  records: z.array(RecordSchema).max(MAX_RECORDS_PER_PUSH),
  /** What the userscript saw on the watch pages of videos in `records`. Optional extras: a bad entry is skipped, never a reason to refuse the timestamps. */
  videos: z.array(z.unknown()).max(MAX_RECORDS_PER_PUSH).optional(),
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

export async function buildApp({ config, store, verifyGoogle, youtube, subscriptions = createSubscriptionsClient(), backfillVideoInfo }: AppDeps): Promise<FastifyInstance> {
  const app = Fastify({ logger: process.env.NODE_ENV !== 'test', bodyLimit: 5 * 1024 * 1024 });
  const hub = new Hub();

  await app.register(cors, { origin: config.allowedOrigins });
  await app.register(websocket);
  app.decorateRequest('userId', '');
  // preClose, not onClose: Fastify waits for open connections before running onClose hooks, and the
  // overview event streams never end on their own, so shutdown would hang until systemd killed it.
  app.addHook('preClose', async () => hub.close());

  // A page showing a video should pick up its title, thumbnail and length once they are cached.
  const notifyVideoViewers = (videoIds: string[]) => {
    for (const userId of store.userIdsWithVideos(videoIds)) hub.notifyOverview(userId);
  };
  const prefetcher = youtube && createVideoPrefetcher(store, youtube, app.log, notifyVideoViewers);
  if (prefetcher) {
    app.addHook('onClose', () => prefetcher.idle()); // finish writing before the caller closes the store
    if (backfillVideoInfo) {
      const uncached = store.uncachedVideoIds();
      const stale = store.staleVideoIds(Date.now() - VIDEO_INFO_TTL_MS);
      app.log.info({ uncached: uncached.length, stale: stale.length }, 'video info backfill');
      prefetcher.enqueue(uncached);
      // Cached details past their TTL, which includes everything cached before video lengths were stored.
      prefetcher.enqueue(stale, true);
    }
  }

  await registerWeb(app, { config, store, verifyGoogle, hub, youtube });

  // A valid signature isn't enough: the session the token was issued for must still exist, so
  // signing out (or "log out all sessions") takes effect immediately instead of after 15 minutes.
  const authenticateToken = async (token: string | undefined) => {
    const claims = token ? await verifyAccessToken(config.jwtSecret, token) : null;
    return claims && store.sessionExists(claims.userId, claims.sessionId) ? claims : null;
  };

  const authenticate = async (req: FastifyRequest, reply: FastifyReply) => {
    const header = req.headers.authorization;
    const claims = await authenticateToken(header?.startsWith('Bearer ') ? header.slice(7) : undefined);
    if (!claims) return reply.code(401).send({ error: 'unauthorized' });
    req.userId = claims.userId;
  };

  const issueSession = async (user: User, refreshToken: string, sessionId: string) => ({
    accessToken: await signAccessToken(config.jwtSecret, user.id, sessionId, config.accessTokenTtlSeconds),
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
    const { token, sessionId } = store.createRefreshToken(user.id, config.refreshTokenTtlSeconds, {
      userAgent: req.headers['user-agent']?.slice(0, 300),
      client: clientInfo(req, config),
    });
    hub.notifyOverview(user.id);
    return { ...(await issueSession(user, token, sessionId)), isNewUser };
  });

  app.post('/auth/refresh', async (req, reply) => {
    const body = RefreshBody.safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: 'invalid_request' });

    const result = store.rotateRefreshToken(body.data.refreshToken, {
      ttlSeconds: config.refreshTokenTtlSeconds,
      familyMaxSeconds: config.refreshFamilyMaxSeconds,
      graceSeconds: config.refreshReuseGraceSeconds,
      client: clientInfo(req, config),
    });
    if (result.status === 'reuse') {
      req.log.warn('refresh token reuse detected; session revoked');
      hub.closeSessions(result.userId, result.sessionId);
    }
    if (result.status !== 'ok') return reply.code(401).send({ error: 'invalid_refresh_token' });
    hub.notifyOverview(result.user.id);
    return issueSession(result.user, result.refreshToken, result.sessionId);
  });

  app.post('/auth/logout', async (req, reply) => {
    const body = RefreshBody.safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: 'invalid_request' });
    const ended = store.revokeRefreshToken(body.data.refreshToken);
    if (ended) {
      hub.closeSessions(ended.userId, ended.sessionId);
      hub.notifyOverview(ended.userId);
    }
    return reply.code(204).send();
  });

  app.get('/me', { preHandler: authenticate }, async (req, reply) => {
    const user = store.getUser(req.userId);
    return user ?? reply.code(401).send({ error: 'unauthorized' });
  });

  // --- members-only access ---

  /**
   * Whether this user can see a video, by the rule "a members-only video is open to subscribers of
   * its channel". `canAccess` is null while either half is unknown: no userscript has reported the
   * video yet, or the user hasn't shared their subscriptions. Subscribing is not paying for a
   * membership, so this is a stand-in until a real membership signal exists.
   */
  const videoAccess = (userId: string, videoId: string) => {
    const video = store.getVideoAccess(videoId);
    if (!video) {
      return { videoId, known: false, membersOnly: null, channelId: null, subscribed: null, subscriptionsSyncedAt: null, canAccess: null };
    }
    const { syncedAt, subscribed } = store.getSubscriptionState(userId, video.channelId);
    const subscribedKnown = syncedAt !== null;
    return {
      videoId,
      known: true,
      membersOnly: video.membersOnly,
      channelId: video.channelId,
      subscribed: subscribedKnown ? subscribed : null,
      subscriptionsSyncedAt: syncedAt,
      canAccess: !video.membersOnly ? true : subscribedKnown ? subscribed : null,
    };
  };

  // The userscript runs the OAuth flow for the read-only YouTube scope and hands over the resulting
  // access token once. It is used for this one listing and never stored.
  app.post('/subscriptions/sync', { preHandler: authenticate }, async (req, reply) => {
    const body = SubscriptionsSyncBody.safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: 'invalid_request' });

    let channelIds: string[];
    try {
      channelIds = await subscriptions(body.data.accessToken);
    } catch (err) {
      if (err instanceof SubscriptionsAuthError) return reply.code(400).send({ error: 'invalid_youtube_token' });
      req.log.warn({ err: (err as Error).message }, 'subscriptions lookup failed');
      return reply.code(502).send({ error: 'youtube_unavailable' });
    }
    const syncedAt = Date.now();
    store.replaceSubscriptions(req.userId, channelIds, syncedAt);
    return { count: channelIds.length, syncedAt };
  });

  // Members-only status isn't in the YouTube Data API and the server can't look it up (YouTube
  // challenges datacenter IPs), so it only learns it from userscripts: they attach what the watch page
  // shows to the pushes that carry timestamps for that video. Nothing is enforced on it yet, and the
  // latest report wins.
  app.get('/videos/:videoId/access', { preHandler: authenticate }, async (req, reply) => {
    const videoId = VideoIdParam.safeParse((req.params as { videoId: string }).videoId);
    if (!videoId.success) return reply.code(400).send({ error: 'invalid_request' });
    return videoAccess(req.userId, videoId.data);
  });

  // --- sync ---

  app.post('/sync/push', { preHandler: authenticate }, async (req, reply) => {
    const body = PushBody.safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: 'invalid_request', detail: z.prettifyError(body.error) });

    const result = store.applyPush(req.userId, body.data.deviceId, body.data.records);
    const pushedVideoIds = new Set(body.data.records.map((r) => r.video_id));
    const changedVideoIds: string[] = [];
    for (const entry of body.data.videos ?? []) {
      const video = VideoAccessReport.safeParse(entry);
      if (!video.success || !pushedVideoIds.has(video.data.videoId)) continue;
      const before = store.getVideoAccess(video.data.videoId);
      store.saveVideoAccess(video.data.videoId, video.data.channelId, video.data.membersOnly, Date.now());
      if (before?.membersOnly !== video.data.membersOnly || before?.channelId !== video.data.channelId) changedVideoIds.push(video.data.videoId);
    }
    if (changedVideoIds.length > 0) notifyVideoViewers(changedVideoIds);
    if (result.accepted.length > 0) {
      hub.notifyOverview(req.userId);
      prefetcher?.enqueue([...new Set(result.accepted.filter((r) => !r.deleted_at).map((r) => r.video_id))]);
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
        const claims = await authenticateToken(message.data.token);
        if (!claims) return socket.close(4401, 'unauthorized');
        if (socket.readyState !== socket.OPEN) return;

        clearTimeout(authTimer);
        hub.add(claims.userId, claims.sessionId, message.data.deviceId, socket);
        socket.send(JSON.stringify({ type: 'ready', seq: store.currentSeq(claims.userId) }));
      } catch (err) {
        app.log.warn({ err }, 'websocket handshake failed');
        socket.close(4400, 'bad auth message');
      }
    });
  });

  return app;
}
