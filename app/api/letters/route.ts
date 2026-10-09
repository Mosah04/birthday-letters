import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { anonId, tooMany } from "@/lib/spam";

const Body = z.object({
  slug: z.string().min(1).max(40),
  senderName: z.string().trim().min(1).max(60),
  content: z.string().trim().min(1).max(5000),
  signature: z.string().trim().max(120).optional(),
  showDate: z.boolean().default(true),
  website: z.string().max(0).optional(), // honeypot : doit rester vide
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  const d = parsed.data;

  const id = anonId(
    req.headers.get("x-forwarded-for") ?? "?",
    req.headers.get("user-agent") ?? "?",
  );
  if (await tooMany(id))
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const profile = await prisma.birthdayProfile.findUnique({
    where: { slug: d.slug },
  });
  if (!profile)
    return NextResponse.json({ error: "not_found" }, { status: 404 });

  await prisma.letter.create({
    data: {
      profileId: profile.id,
      senderName: d.senderName,
      content: d.content,
      signature: d.signature,
      showDate: d.showDate,
      date: d.showDate ? new Date() : null,
      anonymousId: id,
    },
  });
  return NextResponse.json({ ok: true, unlockAt: profile.birthday });
}
