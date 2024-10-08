import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Providers from "./providers";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import Footer from "@/components/Footer";
import NavBar from "../components/NavBar";

const JakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], fallback: ["sans-serif"] });

export const metadata: Metadata = {
  title: "Hiimart Store - Your Trusted Source for Fast & Easy Online Shopping",
  description: "Shop a wide range of products quickly and easily at Hiimart. Discover exclusive deals and fast delivery services.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <SessionProvider session={session} refetchInterval={120}>
        <body className={JakartaSans.className}>
          {/* <NavBar /> */}
          <Providers>{children}</Providers>
          <Footer />
        </body>
      </SessionProvider>
    </html>
  );
}
