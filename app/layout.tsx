import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetBrainsMenuTitle = localFont({
  src: "../JetBrainsMono-2.304/fonts/webfonts/JetBrainsMono-Bold.woff2",
  variable: "--font-jetbrains-menu-title",
  display: "swap",
});

const redHatDisplay = localFont({
  src: "../Red_Hat_Display/static/RedHatDisplay-Bold.ttf",
  variable: "--font-red-hat-display",
  display: "swap",
});

const jetBrainsMono = localFont({
  src: "../JetBrainsMono-2.304/fonts/webfonts/JetBrainsMono-Regular.woff2",
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "compufest[1]",
  description: "El evento estudiantil de computación y programación más grande de la UNAM. 20-24 de Abril 2026.",
  icons: {
    icon: "/Isologo.svg",
  },
  openGraph: {
    title: "compufest[1]",
    description: "El evento estudiantil de computación y programación más grande de la UNAM. 20-24 de Abril 2026.",
    images: [
      {
        url: "/Miniatura.webp",
        width: 1200,
        height: 630,
        alt: "compufest[1] - El evento estudiantil de computación y programación más grande de la UNAM",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "compufest[1]",
    description: "El evento estudiantil de computación y programación más grande de la UNAM. 20-24 de Abril 2026.",
    images: ["/Miniatura.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${jetBrainsMenuTitle.variable} ${redHatDisplay.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
