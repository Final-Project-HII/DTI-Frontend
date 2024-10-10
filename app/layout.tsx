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
  keywords: ['shopping', 'Hiimart Store', 'online shopping', 'exclusive deals'],
  openGraph: {
    title: "Hiimart Store - Fast & Easy Online Shopping",
    description: "Discover exclusive deals and shop a wide range of products quickly and easily at Hiimart Store.",
    url: '/',
    siteName: 'Hiimart Store',
    images: [
      {
        url: '/hiimart v0.png',
        width: 1200,
        height: 630,
        alt: 'Welcome to Hiimart Store - Your Trusted Source for Fast & Easy Online Shopping',
      },
    ],
    type: 'website',
  },
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
