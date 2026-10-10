import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      id: "credentials",
      name: "Demo",
      credentials: {
        name: { label: "Nom ou Prénom", type: "text" },
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        const rawName = (credentials?.name as string)?.trim() || "Clara";
        const cleanSlug =
          rawName.toLowerCase().replace(/[^a-z0-9]/g, "") || "demo";
        const email =
          (credentials?.email as string)?.trim() ||
          `${cleanSlug}@birthdayletters.com`;
        const providerId = `demo-${cleanSlug}`;

        const u = await prisma.user.upsert({
          where: { providerId },
          update: { name: rawName },
          create: {
            providerId,
            name: rawName,
            email,
            avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(rawName)}&backgroundColor=e5d5c5`,
          },
        });
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          image: u.avatar,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      const currentVersion = process.env?.AUTH_CURRENT_VERSION ?? "2";
      if (account?.provider === "google" && profile) {
        const providerId = account.providerAccountId;
        const existingUser = await prisma.user.findUnique({
          where: { providerId },
          select: { id: true },
        });
        const dbUser =
          existingUser ??
          (await prisma.user.create({
            data: {
              providerId,
              name: profile.name,
              email: profile.email,
              avatar:
                (profile.picture as string | undefined) ??
                (profile.avatar_url as string | undefined),
            },
            select: { id: true },
          }));
        token.uid = dbUser.id;
      } else if (user) {
        token.uid = user.id;
      }
      if (user) token.sessionVersion = currentVersion;
      if (token.sessionVersion !== currentVersion) return null;
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: { ...session.user, id: token.uid as string },
    }),
  },
});
