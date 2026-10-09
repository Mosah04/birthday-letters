import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LetterEditor from "@/components/LetterEditor";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const p = await prisma.birthdayProfile.findUnique({
    where: { slug: username },
    select: { displayName: true },
  });
  if (!p) return {};
  return {
    title: `Écris une lettre secrète à ${p.displayName} 💌`,
  };
}

export default async function WritePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const p = await prisma.birthdayProfile.findUnique({
    where: { slug: username },
    select: { slug: true, displayName: true, birthday: true },
  });
  if (!p) notFound();
  return (
    <LetterEditor
      slug={p.slug}
      name={p.displayName}
      unlockAt={p.birthday.toISOString()}
    />
  );
}
