import { readFileSync } from 'node:fs';
import cookie from '@fastify/cookie';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { clientInfo } from './client-info.ts';
import type { Config } from './config.ts';
import type { GoogleVerifier } from './google.ts';
import type { Hub } from './hub.ts';
import type { Store } from './store.ts';
import { resolveVideoInfo, type VideoLookup } from './youtube.ts';

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
  /** Absent when no YouTube API key is configured; the page then shows bare video IDs. */
  youtube?: VideoLookup;
}

const PUBLIC_DIR = new URL('../public/', import.meta.url);
const LoginBody = z.object({ idToken: z.string().min(1) });
const TIMESTAMPS_PAGE_SIZE = 50; // also the most video IDs one YouTube lookup accepts
const TimestampsQuery = z.object({
  q: z.string().max(200).default(''),
  video: z.string().min(1).max(64).optional(),
  channel: z.string().min(1).max(200).optional(),
  offset: z.coerce.number().int().min(0).default(0),
});

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
  // Video thumbnails come from YouTube's image host.
  "img-src 'self' data: https://i.ytimg.com",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
].join('; ');

const STATIC_FILES: Record<string, { file: string; type: string }> = {
  '/': { file: 'index.html', type: 'text/html; charset=utf-8' },
  '/assets/app.js': { file: 'app.js', type: 'text/javascript; charset=utf-8' },
  '/assets/style.css': { file: 'style.css', type: 'text/css; charset=utf-8' },
  '/assets/favicon.png': { file: 'favicon.png', type: 'image/png' }, // the client's Kamo header icon
};

export async function registerWeb(app: FastifyInstance, { config, store, verifyGoogle, hub, youtube }: WebDeps) {
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
    return token ? store.findWebSession(token, { client: clientInfo(req, config) }) : null;
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
    const token = store.createWebSession(user.id, config.webSessionTtlSeconds, {
      userAgent: req.headers['user-agent']?.slice(0, 300) ?? null,
      client: clientInfo(req, config),
    });
    hub.notifyOverview(user.id);
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

    const stats = store.getStats(session.userId);
    if (youtube && stats.topVideos.length > 0) {
      const info = await resolveVideoInfo(store, youtube, stats.topVideos.map((v) => v.videoId), req.log);
      stats.topVideos = stats.topVideos.map((v) => (info.has(v.videoId) ? { ...v, info: info.get(v.videoId) } : v));
    }

    return {
      account,
      stats,
      sessions: store.listSessions(session.userId).map((s) => ({ ...s, current: s.id === session.sessionId })),
    };
  });

  app.get('/web/timestamps', async (req, reply) => {
    reply.header('Cache-Control', 'no-store');
    const session = currentSession(req);
    if (!session) {
      clearSessionCookie(reply);
      return reply.code(401).send({ error: 'unauthorized' });
    }
    const query = TimestampsQuery.safeParse(req.query);
    if (!query.success) return reply.code(400).send({ error: 'invalid_request' });

    const { total, items } = store.searchTimestamps(session.userId, {
      query: query.data.q,
      videoId: query.data.video,
      channel: query.data.channel,
      offset: query.data.offset,
      limit: TIMESTAMPS_PAGE_SIZE,
    });
    const info = youtube && items.length > 0
      ? await resolveVideoInfo(store, youtube, [...new Set(items.map((i) => i.videoId))], req.log)
      : new Map();
    return { total, items: items.map((i) => (info.has(i.videoId) ? { ...i, info: info.get(i.videoId) } : i)) };
  });

  // Server-sent events: a bare "overview" signal whenever this user's counts or sessions change.
  // It carries no data; the page re-fetches /web/overview, which checks the cookie again.
  app.get('/web/events', async (req, reply) => {
    const session = currentSession(req);
    if (!session) {
      clearSessionCookie(reply);
      return reply.code(401).send({ error: 'unauthorized' });
    }

    reply.hijack();
    const res = reply.raw;
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    res.write('retry: 3000\n\n');

    const unwatch = hub.watchOverview(session.userId, {
      sessionId: session.sessionId,
      signal: () => res.write('event: overview\ndata: {}\n\n'),
      end: () => res.end(),
    });
    // A comment line every so often keeps proxies (Cloudflare drops idle connections after ~100s) from closing it.
    const keepAlive = setInterval(() => res.write(': ping\n\n'), 25_000);
    res.on('close', () => {
      clearInterval(keepAlive);
      unwatch();
    });
  });

  app.post('/web/logout', { preHandler: requireSameOrigin }, async (req, reply) => {
    const session = currentSession(req);
    if (session) {
      store.revokeSession(session.userId, session.sessionId);
      hub.closeSessions(session.userId, session.sessionId); // this page's own event stream
      hub.notifyOverview(session.userId);
    }
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
