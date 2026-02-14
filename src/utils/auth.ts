export type CookieSameSite = 'lax' | 'strict' | 'none';

export function parseBool(
  value: string | undefined,
  fallback = false,
): boolean {
  if (value === undefined) return fallback;
  return value === 'true';
}

export function parseNumber(
  value: string | undefined,
  fallback: number,
): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function parseSameSite(
  value: string | undefined,
  fallback: CookieSameSite = 'lax',
): CookieSameSite {
  if (value === 'lax' || value === 'strict' || value === 'none') return value;
  return fallback;
}
