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
  const isDev = process.env.NODE_ENV !== "production";
  if (!isDev && (await tooMany(id)))
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

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const profiles = await prisma.birthdayProfile.findMany({
      select: { slug: true, displayName: true, birthday: true },
    });
    const letterCount = await prisma.letter.count();
    return NextResponse.json({
      ok: true,
      users: userCount,
      profiles: profiles.length,
      letters: letterCount,
      list: profiles,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

