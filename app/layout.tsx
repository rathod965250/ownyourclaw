import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ownyourclaw - Your AI agent on WhatsApp",
  description:
    "Launch your personal AI assistant on WhatsApp in 60 seconds. Powered by Claude and connected to 20+ integrations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${figtree.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
          {children}
        </ThemeProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
