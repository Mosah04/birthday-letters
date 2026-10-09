import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isUnlocked } from "@/lib/lock";
import LetterReader from "./LetterReader";

export default async function LettersPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { username } = await params;
  const { preview } = await searchParams;
  const session = await auth();
  const profile = await prisma.birthdayProfile.findUnique({
    where: { slug: username },
  });
  if (!profile) notFound();

  // Propriétaire uniquement + vérification sécurisée
  if (!session?.user?.id || session.user.id !== profile.userId) {
    redirect(`/${username}`);
  }

  const isDevPreview = preview === "true" && process.env.NODE_ENV !== "production";
  if (!isUnlocked(profile.birthday) && !isDevPreview) {
    redirect("/dashboard");
  }

  const letters = await prisma.letter.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      senderName: true,
      content: true,
      signature: true,
      date: true,
    },
  });

  return <LetterReader letters={letters} name={profile.displayName} />;
}
