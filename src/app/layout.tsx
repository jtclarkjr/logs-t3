import "@/app/globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MainNavigation } from "@/components/ui/navigation";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "Logs Dashboard",
  description:
    "A comprehensive dashboard for monitoring and analyzing application logs",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${geistSans.variable} ${geistMono.variable}`} lang="en">
      <body className="antialiased">
        <TRPCReactProvider>
          <MainNavigation />
          <main className="flex-1">{children}</main>
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
