/**
 * SectionScreen Component - Single Responsibility
 * Solo responsable de renderizar pantallas de sección
 */

"use client";

import { CSSProperties } from "react";
import { COLORS, TYPOGRAPHY, LAYOUT } from "@/lib/constants/theme";

interface SectionScreenProps {
  title: string;
  subtitle: string;
}

export function SectionScreen({ title, subtitle }: SectionScreenProps) {
  const sectionStyle: CSSProperties = {
    minHeight: LAYOUT.section.minHeight,
    display: "grid",
    placeItems: "center",
    padding: LAYOUT.section.padding,
  };

  const containerStyle: CSSProperties = {
    textAlign: "center",
    maxWidth: LAYOUT.section.maxWidth,
  };

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <h1 style={TYPOGRAPHY.heading}>{title}</h1>
        <p style={TYPOGRAPHY.subtitle}>{subtitle}</p>
      </div>
    </section>
  );
}
