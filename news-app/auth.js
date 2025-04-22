import NextAuth from "next-auth";
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./lib/clientPromise";
import authConfig from "./auth.config";
import User from "./models/users";
import { verifyPassword, saltAndHashPassword } from "./utils/password";
import dbConnect from "./lib/mongodb";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { type: "email", required: true },
        password: { type: "password", required: true },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          await dbConnect();

          // logic to verify if the user exists
          const user = await User.findOne({
            email: email.toLowerCase(),
          }).exec();

          if (!user) {
            throw new Error("Invalid credentials.");
          }

          const passwordsMatch = await verifyPassword(password, user.password);
          console.log("passwordsMatch", passwordsMatch);

          if (!passwordsMatch) {
            throw new Error("Invalid credentials.");
          }

          // return JSON object with the user data
          return {
            id: user._id,
            username: user.username,
            email: user.email,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            throw new Error("Invalid credentials.");
            // Return `null` to indicate that the credentials are invalid
          }
          throw error;
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
    ...authConfig,
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        try {
          await dbConnect();
          const email = profile.email.toLowerCase();

          // Find existing user
          let dbUser = await User.findOne({ email });

          if (!dbUser) {
            // First time sign in - create new user
            dbUser = await User.create({
              email,
              username: email.split("@")[0],
              googleId: profile.sub,
              providers: ["google"],
              emailVerified: new Date(),
              name: profile.name, // Optional: store name from Google
              image: profile.picture, // Optional: store profile picture
            });
          } else {
            // Existing user - update Google info
            await User.findByIdAndUpdate(dbUser._id, {
              $set: {
                googleId: profile.sub,
              },
              $addToSet: {
                providers: "google",
              },
            });
          }

          // Update the user object that will be saved in the token
          user.id = dbUser._id;
          user.email = dbUser.email;
          user.username = dbUser.username;

          return true;
        } catch (error) {
          console.error("Google sign in error:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        await dbConnect();
        // Add user info to token on first sign in
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        await dbConnect();
        // Add user info to session
        session.user.id = token.id;
        session.user.username = token.username;

        // Optionally fetch latest user data
        const user = await User.findById(token.id);
        if (user) {
          session.user.providers = user.providers;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  allowDangerousEmailAccountLinking: true,
});
