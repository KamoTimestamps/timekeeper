import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose';

export interface GoogleIdentity {
  sub: string;
  email: string;
  name?: string;
}

export type GoogleVerifier = (idToken: string) => Promise<GoogleIdentity>;

const GOOGLE_JWKS_URL = new URL('https://www.googleapis.com/oauth2/v3/certs');
const GOOGLE_ISSUERS = ['https://accounts.google.com', 'accounts.google.com'];

/** Verifies a Google ID token's signature, issuer, audience and expiry, and requires a verified email. */
export function createGoogleVerifier(
  clientId: string,
  keys: JWTVerifyGetKey = createRemoteJWKSet(GOOGLE_JWKS_URL),
): GoogleVerifier {
  return async (idToken) => {
    const { payload } = await jwtVerify(idToken, keys, {
      issuer: GOOGLE_ISSUERS,
      audience: clientId,
    });

    if (typeof payload.sub !== 'string' || typeof payload.email !== 'string') {
      throw new Error('ID token is missing sub or email');
    }
    if (payload.email_verified !== true) throw new Error('Google email is not verified');

    return {
      sub: payload.sub,
      email: payload.email,
      name: typeof payload.name === 'string' ? payload.name : undefined,
    };
  };
}
