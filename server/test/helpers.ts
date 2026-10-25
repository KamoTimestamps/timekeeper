import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT, type JWK } from 'jose';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app.ts';
import type { Config } from '../src/config.ts';
import { createGoogleVerifier } from '../src/google.ts';
import { Store, type TimestampRecord } from '../src/store.ts';
import type { SubscriptionsLookup } from '../src/subscriptions.ts';
import type { VideoLookup } from '../src/youtube.ts';

process.env.NODE_ENV = 'test';

export const CLIENT_ID = 'test-client.apps.googleusercontent.com';

export const testConfig: Config = {
  host: '127.0.0.1',
  port: 0,
  databasePath: ':memory:',
  googleClientId: CLIENT_ID,
  jwtSecret: 'x'.repeat(48),
  allowedOrigins: ['https://www.youtube.com'],
  accessTokenTtlSeconds: 900,
  refreshTokenTtlSeconds: 3600,
  refreshFamilyMaxSeconds: 7200,
  refreshReuseGraceSeconds: 60,
  publicOrigin: 'https://sync.test',
  webSessionTtlSeconds: 3600,
  trustProxyHeaders: true,
  youtubeApiKey: null,
  features: { miniPlayer: true },
};

export interface TestHarness {
  app: FastifyInstance;
  store: Store;
  /** Signs a Google-style ID token with the key the app's verifier trusts. */
  idToken(claims?: { sub?: string; email?: string; name?: string; email_verified?: boolean; aud?: string; iss?: string; expiresIn?: string }): Promise<string>;
  login(sub?: string, email?: string, headers?: Record<string, string>): Promise<{ accessToken: string; refreshToken: string; userId: string }>;
}

export async function createHarness(overrides: Partial<Config> = {}, youtube?: VideoLookup, subscriptions?: SubscriptionsLookup): Promise<TestHarness> {
  const { publicKey, privateKey } = await generateKeyPair('RS256');
  const jwk: JWK = { ...(await exportJWK(publicKey)), kid: 'k1', alg: 'RS256', use: 'sig' };
  const verifyGoogle = createGoogleVerifier(CLIENT_ID, createLocalJWKSet({ keys: [jwk] }));

  const store = new Store(':memory:');
  const app = await buildApp({ config: { ...testConfig, ...overrides }, store, verifyGoogle, youtube, subscriptions });

  const idToken: TestHarness['idToken'] = async (claims = {}) =>
    new SignJWT({
      email: claims.email ?? 'ada@example.com',
      email_verified: claims.email_verified ?? true,
      name: claims.name ?? 'Ada',
    })
      .setProtectedHeader({ alg: 'RS256', kid: 'k1' })
      .setSubject(claims.sub ?? 'google-sub-1')
      .setIssuer(claims.iss ?? 'https://accounts.google.com')
      .setAudience(claims.aud ?? CLIENT_ID)
      .setIssuedAt()
      .setExpirationTime(claims.expiresIn ?? '5m')
      .sign(privateKey);

  const login: TestHarness['login'] = async (sub = 'google-sub-1', email = 'ada@example.com', headers = {}) => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/google',
      headers,
      payload: { idToken: await idToken({ sub, email }) },
    });
    const body = res.json();
    return { accessToken: body.accessToken, refreshToken: body.refreshToken, userId: body.user.id };
  };

  return { app, store, idToken, login };
}

export const record = (guid: string, write_counter: number, extra: Partial<TimestampRecord> = {}): TimestampRecord => ({
  guid,
  video_id: 'vid1',
  start: 12.5,
  comment: `comment ${guid}`,
  write_counter,
  ...extra,
});

export const bearer = (token: string) => ({ authorization: `Bearer ${token}` });
