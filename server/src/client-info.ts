import type { FastifyRequest } from 'fastify';
import type { Config } from './config.ts';

export interface ClientInfo {
  ip: string | null;
  /** ISO 3166-1 alpha-2, upper case; null when unknown. */
  country: string | null;
  /** "Astoria, NY" (city, plus the state/province where that is how people write addresses); null when unknown. */
  place: string | null;
}

// Cloudflare reports "XX" for unknown and "T1" for Tor; neither is a country.
const COUNTRY = /^[A-Z]{2}$/;
const NOT_A_COUNTRY = new Set(['XX', 'T1']);

// Countries whose region code (NY, ON, NSW) is how a place is normally written. Elsewhere Cloudflare's
// codes are opaque (e.g. "IDF"), so only the city is kept.
const REGION_COUNTRIES = new Set(['US', 'CA', 'AU']);
const REGION = /^[A-Z0-9]{1,3}$/;

const header = (req: FastifyRequest, name: string): string | undefined => {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] : value;
};

/** "::ffff:1.2.3.4" -> "1.2.3.4"; anything that isn't a plausible IP address -> null. */
function cleanIp(raw: string | undefined): string | null {
  const ip = raw?.trim().replace(/^::ffff:/i, '');
  return ip && ip.length <= 45 && /^[0-9a-f:.]+$/i.test(ip) ? ip : null;
}

/** Node hands header bytes over as latin1; Cloudflare sends city names as UTF-8 ("São Paulo"). */
function cleanCity(raw: string | undefined): string | null {
  if (!raw) return null;
  let city = raw;
  try {
    city = new TextDecoder('utf-8', { fatal: true }).decode(Buffer.from(raw, 'latin1'));
  } catch {
    // Not UTF-8 after all; keep what Node gave us.
  }
  city = city.trim();
  return city && city.length <= 100 && !/[\p{C}<>]/u.test(city) ? city : null;
}

function placeOf(req: FastifyRequest, country: string | null): string | null {
  const city = cleanCity(header(req, 'x-client-city'));
  if (!city) return null;
  const region = header(req, 'x-client-region')?.trim().toUpperCase();
  return country && REGION_COUNTRIES.has(country) && region && REGION.test(region) ? `${city}, ${region}` : city;
}

/**
 * Where a request came from. Behind the reverse proxy (trustProxyHeaders) the proxy supplies the
 * real client IP, country and city; otherwise it is the socket address and the country is unknown.
 */
export function clientInfo(req: FastifyRequest, config: Pick<Config, 'trustProxyHeaders'>): ClientInfo {
  if (!config.trustProxyHeaders) return { ip: cleanIp(req.ip), country: null, place: null };

  const country = header(req, 'x-client-country')?.trim().toUpperCase();
  const known = country && COUNTRY.test(country) && !NOT_A_COUNTRY.has(country) ? country : null;
  return {
    ip: cleanIp(header(req, 'x-client-ip')) ?? cleanIp(req.ip),
    country: known,
    place: placeOf(req, known),
  };
}
