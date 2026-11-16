import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import Script from "next/script";
import { SITE } from "@/lib/constants";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | Luxury Caravan Rentals`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "caravan rental India",
    "luxury caravan India",
    "Go Cozy Caravan",
    "motorhome India",
    "Urbania rental",
    "caravan rental Pune",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
};

/** Public site theme only. Admin uses fixed dark tokens via [data-admin]. */
const siteThemeBootScript = `
(function(){
  try {
    if (location.pathname.indexOf('/admin') === 0) {
      document.documentElement.dataset.siteTheme = 'dark';
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.style.colorScheme = 'dark';
      return;
    }
    var t = localStorage.getItem('gocozy-site-theme') || localStorage.getItem('gocozy-theme');
    if (t !== 'light' && t !== 'dark') t = 'dark';
    document.documentElement.dataset.siteTheme = t;
    document.documentElement.classList.add(t);
    document.documentElement.classList.remove(t === 'light' ? 'dark' : 'light');
    document.documentElement.style.colorScheme = t;
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh font-sans antialiased">
        <Script id="site-theme-boot" strategy="beforeInteractive">
          {siteThemeBootScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
