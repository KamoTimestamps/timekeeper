import type { FastifyRequest } from 'fastify';
import type { Config } from './config.ts';

export interface ClientInfo {
  ip: string | null;
  /** ISO 3166-1 alpha-2, upper case; null when unknown. */
  country: string | null;
}

// Cloudflare reports "XX" for unknown and "T1" for Tor; neither is a country.
const COUNTRY = /^[A-Z]{2}$/;
const NOT_A_COUNTRY = new Set(['XX', 'T1']);

const header = (req: FastifyRequest, name: string): string | undefined => {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] : value;
};

/** "::ffff:1.2.3.4" -> "1.2.3.4"; anything that isn't a plausible IP address -> null. */
function cleanIp(raw: string | undefined): string | null {
  const ip = raw?.trim().replace(/^::ffff:/i, '');
  return ip && ip.length <= 45 && /^[0-9a-f:.]+$/i.test(ip) ? ip : null;
}

/**
 * Where a request came from. Behind the reverse proxy (trustProxyHeaders) the proxy supplies the
 * real client IP and the country; otherwise it is the socket address and the country is unknown.
 */
export function clientInfo(req: FastifyRequest, config: Pick<Config, 'trustProxyHeaders'>): ClientInfo {
  if (!config.trustProxyHeaders) return { ip: cleanIp(req.ip), country: null };

  const country = header(req, 'x-client-country')?.trim().toUpperCase();
  return {
    ip: cleanIp(header(req, 'x-client-ip')) ?? cleanIp(req.ip),
    country: country && COUNTRY.test(country) && !NOT_A_COUNTRY.has(country) ? country : null,
  };
}
