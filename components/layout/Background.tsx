/**
 * Background Component - Single Responsibility
 * Solo responsable de renderizar el fondo decorativo
 */

"use client";

import { CSSProperties } from "react";
import { COLORS, GRADIENTS } from "@/lib/constants/theme";

export function Background() {
  const backgroundStyle: CSSProperties = {
    position: "relative",
    minHeight: "100vh",
    backgroundColor: COLORS.dark,
    backgroundImage: `${GRADIENTS.grid.horizontal}, ${GRADIENTS.grid.vertical}`,
    backgroundSize: GRADIENTS.grid.size,
  };

  return <div style={backgroundStyle} />;
}
