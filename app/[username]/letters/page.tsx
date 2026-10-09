import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isUnlocked } from "@/lib/lock";
import LetterReader from "./LetterReader"; // client : navigation « 3 / 12 »

export default async function LettersPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const session = await auth();
  const profile = await prisma.birthdayProfile.findUnique({ where: { slug: username } });
  if (!profile) notFound();
  // Propriétaire uniquement + date vérifiée serveur AVANT toute lecture du contenu
  if (!session?.user?.id || session.user.id !== profile.userId) redirect(`/${username}`);
  if (!isUnlocked(profile.birthday)) redirect("/dashboard");

  const letters = await prisma.letter.findMany({
    where: { profileId: profile.id }, orderBy: { createdAt: "asc" },
    select: { id: true, senderName: true, content: true, signature: true, date: true },
  });
  return <LetterReader letters={letters} name={profile.displayName} />;
}
