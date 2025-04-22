import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { client } from "./sanity/lib/client";
import { AUTHUR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries";
import { wrtieClient } from "./sanity/lib/write-client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user: { name, email, image }, account, profile }) {
      if (!profile?.id) {
        return false; // Ensure profile.id exists
      }

      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHUR_BY_GITHUB_ID_QUERY, {
          id: profile?.id,
        });

      if (!existingUser) {
        await wrtieClient.create({
          _type: "author",
          id: profile?.id,
          name,
          username: profile.login,
          email,
          image,
          bio: profile.bio || "",
        });
      }

      return true; // Ensure a valid boolean return
    },
    async jwt({ account, profile, token }) {
      if (account && profile) {
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHUR_BY_GITHUB_ID_QUERY, {
            id: profile?.id,
          });

        token.id = user?._id;
      }

      return token;
    },
    async session({ token, session }) {
      await Object.assign(session, { id: token.id });
      return session;
    },
  },
});
