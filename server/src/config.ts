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
  };
}
