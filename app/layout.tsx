import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import ModalWrapper from "@/components/ModalWrapper";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { SessionProvider } from "next-auth/react";
import Providers from "./providers";
import Footer from "@/components/Footer";

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
        <ProfileProvider>
          <body className={JakartaSans.className}>
            <ModalWrapper>
              <Providers>{children}</Providers>
            </ModalWrapper>
          </body>
        </ProfileProvider>
      </SessionProvider>
    </html>
  );
}
