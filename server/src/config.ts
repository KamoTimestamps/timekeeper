export interface Config {
  host: string;
  port: number;
  databasePath: string;
  googleClientId: string;
  jwtSecret: string;
  allowedOrigins: string[];
  accessTokenTtlSeconds: number;
  /** Lifetime of one refresh token; each rotation issues a fresh one (sliding expiry). */
  refreshTokenTtlSeconds: number;
  /** A session (token family) is cut off this long after sign-in, however active. */
  refreshFamilyMaxSeconds: number;
  /** A just-rotated token presented again within this window is treated as a lost response, not theft. */
  refreshReuseGraceSeconds: number;
  /** Public origin of this server (e.g. https://sync.example.com); the landing page only accepts requests from it. */
  publicOrigin: string;
  /** Lifetime of a landing-page (cookie) session. */
  webSessionTtlSeconds: number;
  /**
   * Read the client's IP and country from X-Client-IP / X-Client-Country. Only enable behind a
   * reverse proxy that sets (and strips client-supplied copies of) those headers, with the app
   * reachable only through it.
   */
  trustProxyHeaders: boolean;
  /** YouTube Data API key used to show video titles and thumbnails on the landing page; null disables that. */
  youtubeApiKey: string | null;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const googleClientId = env.GOOGLE_CLIENT_ID?.trim();
  if (!googleClientId) throw new Error('GOOGLE_CLIENT_ID is required');

  const jwtSecret = env.JWT_SECRET ?? '';
  if (jwtSecret.length < 32) throw new Error('JWT_SECRET must be at least 32 characters');

  const port = Number(env.PORT ?? 8787);
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('PORT must be a valid port number');

  return {
    host: env.HOST ?? '0.0.0.0',
    port,
    databasePath: env.DATABASE_PATH ?? './data/timekeeper.db',
    googleClientId,
    jwtSecret,
    allowedOrigins: (env.ALLOWED_ORIGINS ?? 'https://www.youtube.com')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    accessTokenTtlSeconds: 15 * 60,
    refreshTokenTtlSeconds: 30 * 24 * 60 * 60,
    refreshFamilyMaxSeconds: 90 * 24 * 60 * 60,
    refreshReuseGraceSeconds: 60,
    publicOrigin: (env.PUBLIC_ORIGIN ?? `http://localhost:${port}`).replace(/\/+$/, ''),
    webSessionTtlSeconds: 7 * 24 * 60 * 60,
    trustProxyHeaders: env.TRUST_PROXY_HEADERS === 'true',
    youtubeApiKey: env.YOUTUBE_API_KEY?.trim() || null,
  };
}
