/**
 * SectionScreen Component - Single Responsibility
 * Solo responsable de renderizar pantallas de sección
 */

'use client';

import { CSSProperties, useEffect, useState } from 'react';
import { COLORS, TYPOGRAPHY, LAYOUT } from "@/lib/constants/theme";
import dynamic from 'next/dynamic';

// Dynamic import with ssr: false for component that accesses document/window
const ASCIIText = dynamic(
  () => import("@/components/ui/ASCIIText"),
  { ssr: false, loading: () => <div style={{ minHeight: '200px' }} /> }
);

interface SectionScreenProps {
  title: string;
  subtitle: string;
}

export function SectionScreen({ title, subtitle }: SectionScreenProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    let debounceTimer: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        setIsMobile(window.innerWidth < 640);
        setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
      }, 150);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const showASCII = (title === "Talleres" || title === "Charlas") && isClient;
  const asciiFontSize = isMobile ? 4 : isTablet ? 6 : 8;
  const textFontSize = isMobile ? 40 : isTablet ? 100 : 180;
  const planeBaseHeight = isMobile ? 4 : isTablet ? 6 : 8;

  const sectionStyle: CSSProperties = {
    minHeight: LAYOUT.section.minHeight,
    display: "grid",
    placeItems: "center",
    padding: LAYOUT.section.padding,
    position: "relative",
  };

  const containerStyle: CSSProperties = {
    textAlign: "center",
    maxWidth: LAYOUT.section.maxWidth,
    width: "100%",
  };

  return (
    <section style={sectionStyle}>
      {showASCII ? (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <ASCIIText
            text="..."
            asciiFontSize={asciiFontSize}
            textFontSize={textFontSize}
            textColor="#fdf9f3"
            planeBaseHeight={planeBaseHeight}
            enableWaves={false}
          />
        </div>
      ) : (
        <div style={containerStyle}>
          <h1 style={TYPOGRAPHY.heading}>{title}</h1>
          <p style={TYPOGRAPHY.subtitle}>{subtitle}</p>
        </div>
      )}
    </section>
  );
}
