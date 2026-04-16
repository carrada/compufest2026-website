import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
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
    icon: "/favicon.png",
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
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const umamiScriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
  const isLocalUmamiScript = Boolean(
    umamiScriptUrl?.includes("localhost") || umamiScriptUrl?.includes("127.0.0.1")
  );
  const shouldLoadUmami = Boolean(umamiWebsiteId && umamiScriptUrl) && !(
    process.env.NODE_ENV === "production" && isLocalUmamiScript
  );

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${jetBrainsMenuTitle.variable} ${redHatDisplay.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {shouldLoadUmami ? (
          <Script
            src={umamiScriptUrl}
            data-website-id={umamiWebsiteId}
            strategy="afterInteractive"
          />
        ) : null}
        {children}
      </body>
    </html>
  );
}
