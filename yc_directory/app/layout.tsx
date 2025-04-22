import { type ReactNode } from "react";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Work_Sans } from "next/font/google";
import "easymde/dist/easymde.min.css";
import "./globals.css";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-work-sans",
});

export const metadata: Metadata = {
  title: "YC_Directory",
  description: "Pitch, Vote and Grow",
};

type layoutProp = {
  children: Readonly<ReactNode>;
};

export default function RootLayout({ children }: layoutProp) {
  return (
    <html lang="en">
      <body className={workSans.variable}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
