import { signOut } from "next-auth/react";

export default async function handleSignOut() {
  try {
    await signOut({
      redirect: true,
      callbackUrl: "/sign-in",
    });
  } catch (error) {
    console.error("Sign out error:", error);
  }
}
