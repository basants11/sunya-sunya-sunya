import { Footer } from "@/components/footer";
import { HeaderWrapper } from "@/components/header-wrapper";
import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";
import "./globals.css";

// Force dynamic rendering to avoid static generation issues in Next.js 16
export const dynamic = "force-dynamic";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sunya | Premium Dehydrated Fruits Nepal",
  description:
    "Premium dehydrated fruits with zero sugar, zero preservatives. Hand-selected, slow-dehydrated, export-grade quality from Nepal.",
  keywords: [
    "dehydrated fruits Nepal",
    "dried fruits Nepal",
    "premium dehydrated fruits",
    "healthy snacks Nepal",
    "no added sugar dried fruits",
  ].join(", "),
  authors: [{ name: "SUNYA", url: "https://sunya.com.np" }],
  creator: "SUNYA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          <HeaderWrapper />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
