import { ReactNode } from "react";
import Navbar from "../../components/Navbar";
import "../globals.css";

type layoutProp = {
  children: Readonly<ReactNode>;
};

export default function RootLayout({ children }: layoutProp) {
  return (
    <main className="font-work-sans">
      <Navbar />
      {children}
    </main>
  );
}
