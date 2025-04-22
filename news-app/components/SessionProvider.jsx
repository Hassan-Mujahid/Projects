"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children, session }) {
  return (
    <NextAuthSessionProvider
      session={session}
      refetchInterval={0} // Disable automatic refetching
      refetchOnWindowFocus={false} // Disable refetch on window focus
    >
      {children}
    </NextAuthSessionProvider>
  );
}
