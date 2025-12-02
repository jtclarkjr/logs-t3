import "@/app/globals.css";

import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { MinimalSidebar } from "@/components/ui/minimal-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth/context";
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

const isDev = process.env.ENV === "dev";

// Enable native view transitions (Next.js 16)
export const experimental_viewTransition = true;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <AuthProvider>
            <TRPCReactProvider>
              <MinimalSidebar />
              <main className="flex-1 pb-16 md:pb-0 md:pl-16">{children}</main>
              <Toaster />
            </TRPCReactProvider>
          </AuthProvider>
        </ThemeProvider>
        {!isDev && <Analytics />}
      </body>
    </html>
  );
}
