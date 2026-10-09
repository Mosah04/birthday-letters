import { createHash } from "crypto";
import { prisma } from "./prisma";

export const anonId = (ip: string, ua: string) =>
  createHash("sha256")
    .update(`${ip}|${ua}|${process.env.AUTH_SECRET}`)
    .digest("hex");

/** 5 lettres/heure/visiteur. En prod : ajouter Upstash Ratelimit + Cloudflare Turnstile. */
export async function tooMany(id: string) {
  const since = new Date(Date.now() - 3_600_000);
  return (
    (await prisma.letter.count({
      where: { anonymousId: id, createdAt: { gte: since } },
    })) >= 5
  );
}
