import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

// basePath is "" in dev, "/portfolio" in the static export (GitHub Pages).
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
// Canonical GitHub Pages URL — used for absolute OG/Twitter card image URLs
// so social scrapers (which need absolute URLs) resolve the cover correctly.
const SITE_URL = "https://shadishafiee1-glitch.github.io/portfolio";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Shadi Shafiee — Visual Designer & Artist",
  description:
    "Portfolio of Shadi Shafiee — magazine, catalog & brochure, logo, banner, social media, poster design and digital painting.",
  keywords: [
    "Shadi Shafiee",
    "portfolio",
    "graphic design",
    "magazine design",
    "logo design",
    "poster design",
    "digital painting",
    "brand identity",
  ],
  authors: [{ name: "Shadi Shafiee" }],
  icons: {
    icon: `${BASE}/favicon.svg`,
    shortcut: `${BASE}/favicon.svg`,
  },
  openGraph: {
    title: "Shadi Shafiee — Visual Designer & Artist",
    description:
      "A portfolio of editorial, identity, print and digital painting work by Shadi Shafiee.",
    type: "website",
    url: SITE_URL,
    siteName: "Shadi Shafiee — Portfolio",
    images: [
      {
        url: `${BASE}/og.png`,
        width: 1344,
        height: 768,
        alt: "Shadi Shafiee — Visual Designer & Artist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shadi Shafiee — Visual Designer & Artist",
    description:
      "A portfolio of editorial, identity, print and digital painting work by Shadi Shafiee.",
    images: [`${BASE}/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
