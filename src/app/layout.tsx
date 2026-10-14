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

export const metadata: Metadata = {
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
  openGraph: {
    title: "Shadi Shafiee — Visual Designer & Artist",
    description:
      "A portfolio of editorial, identity, print and digital painting work by Shadi Shafiee.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shadi Shafiee — Visual Designer & Artist",
    description:
      "A portfolio of editorial, identity, print and digital painting work by Shadi Shafiee.",
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
