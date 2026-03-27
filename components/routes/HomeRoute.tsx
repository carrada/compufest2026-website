/**
 * HomeRoute Component - Single Responsibility
 * Solo responsable de renderizar la página de inicio
 */

"use client";

import { CSSProperties } from "react";
import ASCIIText from "@/components/ui/ASCIIText";
import { LoaderFourDemo } from "@/components/ui/loader-four";
import { LAYOUT } from "@/lib/constants/theme";

export function HomeRoute() {
  const containerStyle: CSSProperties = {
    position: "relative",
    ...LAYOUT.fullScreen,
  };

  return (
    <>
      <div style={containerStyle}>
        <ASCIIText text="[1]" enableWaves={false} asciiFontSize={8} />
      </div>
      <LoaderFourDemo />
    </>
  );
}
