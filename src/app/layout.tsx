import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LocaleProvider } from "@/i18n/locale-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tamsi Besson — Développeur Web / Web Developer",
  description:
    "Portfolio de Tamsi Besson, développeur web basé à Paris avec ~8 ans d'expérience. React, Next.js, TypeScript, Python.",
  metadataBase: new URL("https://tamsibesson.dev"),
  openGraph: {
    title: "Tamsi Besson — Développeur Web / Web Developer",
    description:
      "Portfolio de Tamsi Besson, développeur web basé à Paris.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
