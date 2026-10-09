"use server";
import { z } from "zod";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { nextBirthday, RESERVED } from "@/lib/birthday";

const S = z.object({
  displayName: z.string().trim().min(1).max(60),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]{3,30}$/)
    .refine((s) => !RESERVED.includes(s)),
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().trim().max(140).optional(),
});

export async function createProfile(
  _: string | null,
  fd: FormData,
): Promise<string | null> {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth");
  const r = S.safeParse(Object.fromEntries(fd));
  if (!r.success)
    return "Vérifie les champs (adresse : 3 à 30 lettres, chiffres ou tirets).";
  try {
    await prisma.birthdayProfile.create({
      data: {
        userId: session.user.id,
        slug: r.data.slug,
        displayName: r.data.displayName,
        birthday: nextBirthday(r.data.birthday),
        description: r.data.description || null,
      },
    });
  } catch {
    return "Cette adresse est déjà prise.";
  }
  redirect("/dashboard");
}
