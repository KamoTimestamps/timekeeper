import { SignJWT, jwtVerify } from 'jose';

const ISSUER = 'timekeeper-sync';
const encode = (secret: string) => new TextEncoder().encode(secret);

export interface AccessClaims {
  userId: string;
  /** The session this token was issued for; revoking the session invalidates the token at once. */
  sessionId: string;
}

export async function signAccessToken(
  secret: string,
  userId: string,
  sessionId: string,
  ttlSeconds: number,
): Promise<string> {
  return new SignJWT({ sid: sessionId })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(encode(secret));
}

/** Returns the claims, or null for any invalid or expired token (including ones without a session id). */
export async function verifyAccessToken(secret: string, token: string): Promise<AccessClaims | null> {
  try {
    const { payload } = await jwtVerify(token, encode(secret), { issuer: ISSUER, algorithms: ['HS256'] });
    return typeof payload.sub === 'string' && typeof payload.sid === 'string'
      ? { userId: payload.sub, sessionId: payload.sid }
      : null;
  } catch {
    return null;
  }
}
