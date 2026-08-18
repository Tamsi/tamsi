import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Figtree, Inter } from "next/font/google";
import { SyncLocaleFromUrl } from "@/components/i18n/sync-locale-from-url";
import { SkipToContent } from "@/components/seo/skip-to-content";
import { StickyAudienceToggle } from "@/components/ui/sticky-audience-toggle";
import { WelcomeOverlay } from "@/components/ui/welcome-overlay";
import { LocaleProvider } from "@/i18n/locale-context";
import { dictionaries } from "@/i18n/dictionaries";
import { getServerLocale } from "@/i18n/locale.server";
import { buildSharedMetadata } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#fafafa",
  width: "device-width",
  initialScale: 1,
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return buildSharedMetadata(locale);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialLocale = await getServerLocale();
  const t = dictionaries[initialLocale];

  return (
    <html lang={initialLocale} suppressHydrationWarning>
      <head>
        <link
          rel="alternate"
          type="text/plain"
          href="/llms.txt"
          title="LLM-oriented site summary"
        />
        <link
          rel="alternate"
          type="text/plain"
          href="/llms-full.txt"
          title="Full LLM-oriented dump"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          href="/feed.xml"
          title="Blog RSS"
        />
        <link
          rel="alternate"
          type="application/feed+json"
          href="/feed.json"
          title="Blog JSON Feed"
        />
        <link rel="author" href="/humans.txt" />
      </head>
      <body
        className={`${inter.variable} ${figtree.variable} portfolio-page antialiased`}
        suppressHydrationWarning
      >
        <LocaleProvider initialLocale={initialLocale}>
          <SkipToContent label={t.a11y.skipToContent} />
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
