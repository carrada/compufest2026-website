/**
 * HomeRoute Component - Single Responsibility
 * Solo responsable de renderizar la página de inicio
 */

'use client';

import { CSSProperties } from 'react';
import dynamic from 'next/dynamic';
import ASCIIText from '@/components/ui/ASCIIText';
import CanvasTextDemo from '@/components/canvas-text-demo';
import { LAYOUT } from "@/lib/constants/theme";

// Lazy load LoaderFourDemo to optimize initial page load
const LoaderFourDemo = dynamic(
  () => import("@/components/ui/loader-four").then(mod => ({default: mod.LoaderFourDemo})),
  { loading: () => null }
);

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
      <CanvasTextDemo />
      <LoaderFourDemo />
    </>
  );
}
