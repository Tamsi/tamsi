import type { Metadata } from "next";
import { Suspense } from "react";
import { Figtree, Inter } from "next/font/google";
import { SyncLocaleFromUrl } from "@/components/i18n/sync-locale-from-url";
import { StickyAudienceToggle } from "@/components/ui/sticky-audience-toggle";
import { WelcomeOverlay } from "@/components/ui/welcome-overlay";
import { LocaleProvider } from "@/i18n/locale-context";
import { getServerLocale } from "@/i18n/locale.server";
import { buildPageMetadata } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return buildPageMetadata(locale, "/");
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialLocale = await getServerLocale();

  return (
    <html lang={initialLocale} suppressHydrationWarning>
      <head>
        <link
          rel="alternate"
          type="text/plain"
          href="/llms.txt"
          title="LLM-oriented site summary"
        />
      </head>
      <body
        className={`${inter.variable} ${figtree.variable} portfolio-page antialiased`}
        suppressHydrationWarning
      >
        <LocaleProvider initialLocale={initialLocale}>
          <Suspense fallback={null}>
            <SyncLocaleFromUrl />
          </Suspense>
          <WelcomeOverlay />
          {children}
          <StickyAudienceToggle />
        </LocaleProvider>
      </body>
    </html>
  );
}
