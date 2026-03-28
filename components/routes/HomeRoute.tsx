/**
 * HomeRoute Component - Single Responsibility
 * Solo responsable de renderizar la página de inicio
 */

'use client';

import { CSSProperties } from 'react';
import dynamic from 'next/dynamic';
import { LAYOUT } from "@/lib/constants/theme";

// Dynamic imports with ssr: false for components that access document/window
const ASCIIText = dynamic(
  () => import('@/components/ui/ASCIIText'),
  { ssr: false, loading: () => <div style={{ ...LAYOUT.fullScreen, position: 'relative' }} /> }
);

const CanvasTextDemo = dynamic(
  () => import('@/components/canvas-text-demo'),
  { ssr: false, loading: () => <div style={{ minHeight: '500px' }} /> }
);

// Lazy load LoaderFourDemo to optimize initial page load
const LoaderFourDemo = dynamic(
  () => import("@/components/ui/loader-four").then(mod => ({default: mod.LoaderFourDemo})),
  { ssr: false, loading: () => null }
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
