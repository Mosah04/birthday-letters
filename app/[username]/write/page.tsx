import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LetterEditor from "@/components/LetterEditor";

export default async function WritePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  // Métadonnées uniquement : jamais de contenu de lettre ici.
  const p = await prisma.birthdayProfile.findUnique({
    where: { slug: username }, select: { slug: true, displayName: true, birthday: true },
  });
  if (!p) notFound();
  return <LetterEditor slug={p.slug} name={p.displayName} unlockAt={p.birthday.toISOString()} />;
}
