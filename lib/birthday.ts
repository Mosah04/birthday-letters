/** Prochain anniversaire (minuit UTC). Simplification : le fuseau par profil reste à affiner. */
export function nextBirthday(dateISO: string, now = new Date()) {
  const [, m, d] = dateISO.split("-").map(Number);
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  let t = Date.UTC(now.getUTCFullYear(), m - 1, d);
  if (t + 86_400_000 <= todayUTC) t = Date.UTC(now.getUTCFullYear() + 1, m - 1, d);
  return new Date(t);
}
export const RESERVED = ["auth", "dashboard", "api", "write", "letters", "_next", "admin"];
