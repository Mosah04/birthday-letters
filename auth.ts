import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const u = await prisma.user.upsert({
          where: { providerId: account.providerAccountId },
          update: {
            name: profile.name,
            avatar: profile.picture as string | undefined,
          },
          create: {
            providerId: account.providerAccountId,
            name: profile.name,
            email: profile.email,
            avatar: profile.picture as string | undefined,
          },
        });
        token.uid = u.id;
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: { ...session.user, id: token.uid as string },
    }),
  },
});
