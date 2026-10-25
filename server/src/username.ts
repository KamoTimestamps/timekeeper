/**
 * Username rules, following YouTube's handle policy:
 * https://support.google.com/youtube/answer/11585688 (requirements)
 * https://support.google.com/youtube/answer/15920820 (changing: twice per 14 days, old name held 14 days)
 */

/** A name can be changed this many times within the window; the replaced name is held for the window. */
export const NAME_CHANGE_LIMIT = 2;
export const NAME_CHANGE_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

export type UsernameProblem = 'length' | 'characters' | 'edges' | 'mixed_direction' | 'looks_like_url' | 'looks_like_phone';

export type UsernameCheck = { ok: true; name: string; key: string } | { ok: false; problem: UsernameProblem };

const ALLOWED = /^[\p{L}\p{N}\p{M}_.·-]+$/u;
const EDGE = /^[\p{L}\p{N}\p{M}]$/u; // what the first and last character must be
const LETTER = /\p{L}/u;
const HAN_OR_HANGUL = /^(?:\p{scx=Hani}|\p{scx=Hang})$/u;
const ETHIOPIC_OR_KANA = /^(?:\p{scx=Ethi}|\p{scx=Hira}|\p{scx=Kana})$/u;
const RIGHT_TO_LEFT = /^(?:\p{scx=Arab}|\p{scx=Hebr}|\p{scx=Syrc}|\p{scx=Thaa})$/u;
const URL_LIKE = /^(?:https?|www\.)|\.(?:com|net|org|io|co|tv|gg|me|app|dev|xyz|info|ly|to)$/i;

/** [min, max] length in characters: YouTube's range depends on the script. */
function lengthRange(letters: string[]): [number, number] {
  if (letters.length > 0 && letters.every((c) => HAN_OR_HANGUL.test(c))) return [1, 10];
  if (letters.length > 0 && letters.every((c) => ETHIOPIC_OR_KANA.test(c))) return [2, 20];
  return [3, 30];
}

/**
 * Checks a name as typed. `key` is the form names are compared by (case-insensitive, compatibility
 * forms folded together), so "Fox" and "fox" are the same name.
 *
 * Not enforced: YouTube also restricts mixing some other scripts "in certain circumstances" without
 * saying which, and bans offensive names; neither is decidable here.
 */
export function checkUsername(raw: string): UsernameCheck {
  const name = raw.normalize('NFC').trim();
  const chars = [...name];
  if (chars.length === 0) return { ok: false, problem: 'length' };
  if (!ALLOWED.test(name)) return { ok: false, problem: 'characters' };
  if (!EDGE.test(chars[0]) || !EDGE.test(chars[chars.length - 1])) return { ok: false, problem: 'edges' };

  const letters = chars.filter((c) => LETTER.test(c));
  const [min, max] = lengthRange(letters);
  if (chars.length < min || chars.length > max) return { ok: false, problem: 'length' };

  // Left-to-right and right-to-left scripts don't mix; digits (which aren't letters) may follow.
  const rtl = letters.filter((c) => RIGHT_TO_LEFT.test(c)).length;
  if (rtl > 0 && rtl < letters.length) return { ok: false, problem: 'mixed_direction' };

  if (URL_LIKE.test(name)) return { ok: false, problem: 'looks_like_url' };
  const withoutSeparators = chars.filter((c) => !/[_.·-]/u.test(c));
  if (withoutSeparators.length >= 7 && withoutSeparators.every((c) => /\p{N}/u.test(c))) return { ok: false, problem: 'looks_like_phone' };

  return { ok: true, name, key: name.normalize('NFKC').toLowerCase() };
}
