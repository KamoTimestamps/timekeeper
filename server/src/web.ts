import { readFileSync } from 'node:fs';
import cookie from '@fastify/cookie';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import type { Config } from './config.ts';
import type { GoogleVerifier } from './google.ts';
import type { Hub } from './hub.ts';
import type { Store } from './store.ts';

/**
 * The landing page: sign in with Google, see stats and sessions, log out everywhere.
 *
 * Unlike the userscript, this page is first-party on the server's own origin, so its session is an
 * HttpOnly cookie that page scripts can't read. Requests that change state must carry this
 * server's own Origin, on top of SameSite=Strict, so other sites can't drive the cookie.
 */
export interface WebDeps {
  config: Config;
  store: Store;
  verifyGoogle: GoogleVerifier;
  hub: Hub;
}

const PUBLIC_DIR = new URL('../public/', import.meta.url);
const LoginBody = z.object({ idToken: z.string().min(1) });

// Only what Google's sign-in button needs: https://developers.google.com/identity/gsi/web/guides/client-library
const CSP = [
  "default-src 'none'",
  "script-src 'self' https://accounts.google.com/gsi/client",
  // The hash is the one inline stylesheet Google's button script injects.
  "style-src 'self' https://accounts.google.com/gsi/style 'sha256-RU4sU0AaS8IBGZx8XrGt/pa9A5SLA3dQszGeqT5L3Kw='",
  // Google's button sets inline style attributes; this allows those only, never <style> blocks.
  "style-src-attr 'unsafe-inline'",
  "frame-src https://accounts.google.com/gsi/",
  "connect-src 'self' https://accounts.google.com/gsi/",
  "img-src 'self' data:",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
].join('; ');

const STATIC_FILES: Record<string, { file: string; type: string }> = {
  '/': { file: 'index.html', type: 'text/html; charset=utf-8' },
  '/assets/app.js': { file: 'app.js', type: 'text/javascript; charset=utf-8' },
  '/assets/style.css': { file: 'style.css', type: 'text/css; charset=utf-8' },
};

export async function registerWeb(app: FastifyInstance, { config, store, verifyGoogle, hub }: WebDeps) {
  await app.register(cookie);

  const secure = config.publicOrigin.startsWith('https://');
  // The __Host- prefix makes browsers refuse the cookie unless it is Secure, Path=/ and has no Domain.
  const cookieName = secure ? '__Host-tk_web' : 'tk_web';

  for (const [path, { file, type }] of Object.entries(STATIC_FILES)) {
    const body = readFileSync(new URL(file, PUBLIC_DIR));
    app.get(path, async (_req, reply) =>
      reply
        .header('Content-Type', type)
        .header('Cache-Control', 'no-cache')
        .header('Content-Security-Policy', CSP)
        .header('X-Content-Type-Options', 'nosniff')
        .header('Referrer-Policy', 'no-referrer')
        .send(body),
    );
  }

  const currentSession = (req: FastifyRequest) => {
    const token = req.cookies[cookieName];
    return token ? store.findWebSession(token) : null;
  };

  const clearSessionCookie = (reply: FastifyReply) => reply.clearCookie(cookieName, { path: '/' });

  // State-changing requests only come from this server's own pages.
  const requireSameOrigin = async (req: FastifyRequest, reply: FastifyReply) => {
    if (req.headers.origin !== config.publicOrigin) return reply.code(403).send({ error: 'bad_origin' });
  };

  app.get('/web/config', async (_req, reply) => {
    reply.header('Cache-Control', 'no-store');
    return { googleClientId: config.googleClientId };
  });

  app.post('/web/login', { preHandler: requireSameOrigin }, async (req, reply) => {
    const body = LoginBody.safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: 'invalid_request' });

    let identity;
    try {
      identity = await verifyGoogle(body.data.idToken);
    } catch (err) {
      req.log.info({ err: (err as Error).message }, 'google token rejected (web)');
      return reply.code(401).send({ error: 'invalid_google_token' });
    }

    const { user } = store.upsertGoogleUser(identity);
    const token = store.createWebSession(
      user.id,
      config.webSessionTtlSeconds,
      req.headers['user-agent']?.slice(0, 300) ?? null,
    );
    reply.setCookie(cookieName, token, {
      httpOnly: true,
      secure,
      sameSite: 'strict',
      path: '/',
      maxAge: config.webSessionTtlSeconds,
    });
    return { user };
  });

  app.get('/web/overview', async (req, reply) => {
    reply.header('Cache-Control', 'no-store');
    const session = currentSession(req);
    const account = session ? store.getAccount(session.userId) : null;
    if (!session || !account) {
      clearSessionCookie(reply);
      return reply.code(401).send({ error: 'unauthorized' });
    }

    return {
      account,
      stats: store.getStats(session.userId),
      sessions: store.listSessions(session.userId).map((s) => ({ ...s, current: s.id === session.sessionId })),
    };
  });

  app.post('/web/logout', { preHandler: requireSameOrigin }, async (req, reply) => {
    const session = currentSession(req);
    if (session) store.revokeSession(session.userId, session.sessionId);
    clearSessionCookie(reply);
    return reply.code(204).send();
  });

  app.post('/web/logout-all', { preHandler: requireSameOrigin }, async (req, reply) => {
    const session = currentSession(req);
    if (!session) return reply.code(401).send({ error: 'unauthorized' });

    const revoked = store.revokeAllSessions(session.userId);
    hub.closeSessions(session.userId); // live sync connections of every device
    clearSessionCookie(reply);
    return { revoked };
  });
}
