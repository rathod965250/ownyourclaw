import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const SITE_URL = "https://ownyourclaw.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "ownyourclaw — Your AI Agent on WhatsApp, Live in 60 Seconds",
    template: "%s | ownyourclaw",
  },
  description:
    "ownyourclaw is an AI assistant that lives in your WhatsApp. Powered by Claude 3.5 Sonnet. Connects to Gmail, Notion, GitHub, Stripe, Shopify and 20+ more tools. No setup. No terminal. Ready in 60 seconds.",

  keywords: [
    "AI agent WhatsApp",
    "WhatsApp AI assistant",
    "Claude AI WhatsApp",
    "AI automation WhatsApp",
    "personal AI assistant",
    "AI agent Gmail",
    "AI agent Notion",
    "AI agent GitHub",
    "WhatsApp productivity",
    "no-code AI agent",
    "ownyourclaw",
  ],

  authors: [{ name: "ownyourclaw", url: SITE_URL }],
  creator: "ownyourclaw",
  publisher: "ownyourclaw",

  // Canonical
  alternates: {
    canonical: "/",
  },

  // Open Graph — controls how your link looks when shared on WhatsApp, Slack, Twitter etc
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "ownyourclaw",
    title: "ownyourclaw — Your AI Agent on WhatsApp, Live in 60 Seconds",
    description:
      "Powered by Claude 3.5 Sonnet. Connects to Gmail, Notion, GitHub, Stripe and 20+ tools. No setup, no terminal. Live in 60 seconds.",
    images: [
      {
        url: "/og-image.png",   // drop a 1200×630 image in /public
        width: 1200,
        height: 630,
        alt: "ownyourclaw — AI agent on WhatsApp",
      },
    ],
    locale: "en_US",
  },

  // Twitter / X card
  twitter: {
    card: "summary_large_image",
    title: "ownyourclaw — Your AI Agent on WhatsApp, Live in 60 Seconds",
    description:
      "Powered by Claude 3.5 Sonnet. Gmail, Notion, GitHub, Stripe + 20 more integrations. No technical skills needed.",
    images: ["/og-image.png"],
    creator: "@ownyourclaw",
    site: "@ownyourclaw",
  },

  // Crawler directives
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification (add your real tokens later)
  verification: {
    google: "YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN",
  },

  // App / PWA info
  applicationName: "ownyourclaw",
  category: "productivity",
  classification: "AI Tools, Productivity, Automation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* AI crawler hints */}
        <meta name="ai-content-declaration" content="This page describes ownyourclaw, a WhatsApp AI agent powered by Claude." />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://www.google.com" />
      </head>
      <body className={`${figtree.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
          {children}
        </ThemeProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
