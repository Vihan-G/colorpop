import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "colorpop — drop an image, get its palette",
    template: "%s · colorpop",
  },
  description:
    "Drop any image and instantly extract its 8 dominant colors. Copy hex, RGB, HSL. Download the palette as a PNG. Pure client-side — no upload, no signup.",
  keywords: [
    "color palette",
    "image color extractor",
    "hex picker",
    "design tools",
    "palette generator",
    "median cut",
  ],
  authors: [{ name: "Vihan Goenka", url: "https://github.com/Vihan-G" }],
  creator: "Vihan Goenka",
  openGraph: {
    type: "website",
    title: "colorpop — drop an image, get its palette",
    description:
      "Drop any image and instantly extract its 8 dominant colors. The interface reacts to your image's mood.",
    siteName: "colorpop",
  },
  twitter: {
    card: "summary_large_image",
    title: "colorpop — drop an image, get its palette",
    description:
      "Drop any image and instantly extract its 8 dominant colors.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0c0c0c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0c0c0c] text-neutral-100">
        {children}
      </body>
    </html>
  );
}
