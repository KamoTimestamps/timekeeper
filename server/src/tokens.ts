import { SignJWT, jwtVerify } from 'jose';

const ISSUER = 'timekeeper-sync';
const encode = (secret: string) => new TextEncoder().encode(secret);

export async function signAccessToken(secret: string, userId: string, ttlSeconds: number): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(encode(secret));
}

/** Returns the user id, or null for any invalid or expired token. */
export async function verifyAccessToken(secret: string, token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, encode(secret), { issuer: ISSUER, algorithms: ['HS256'] });
    return typeof payload.sub === 'string' ? payload.sub : null;
  } catch {
    return null;
  }
}
