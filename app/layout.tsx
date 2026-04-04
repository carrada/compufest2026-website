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
  title: "CompuFest",
  description: "compufest[1] - Hackathon de Ciencias de la Computación",
  icons: {
    icon: "/Isologo.svg",
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
