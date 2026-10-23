import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { SITE } from "@/lib/constants";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | Luxury Caravan Rentals`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "caravan rental Pune",
    "luxury caravan Maharashtra",
    "Go Cozy Caravan",
    "motorhome India",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="flex min-h-dvh flex-col bg-background text-foreground antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-charcoal"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="flex-1 pb-20 sm:pb-6">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
