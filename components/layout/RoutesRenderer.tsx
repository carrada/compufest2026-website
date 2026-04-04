/**
 * RoutesRenderer Component - Open/Closed Principle
 * Renderiza dinámicamente las rutas basadas en configuración
 * Se puede extender sin modificación agregando más rutas a la configuración
 */

'use client';

import { Route, Routes, Navigate } from 'react-router-dom';
import { HomeRoute } from "@/components/routes/HomeRoute";
import { SectionScreen } from "@/components/routes/SectionScreen";
import { FAQRoute } from "@/components/routes/FAQRoute";
import type { SectionRoute } from "@/lib/types";

interface RoutesRendererProps {
  sectionRoutes: SectionRoute[];
}

export function RoutesRenderer({ sectionRoutes }: RoutesRendererProps) {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute key="/" />} />
      <Route path="/faq" element={<FAQRoute key="/faq" />} />
      {sectionRoutes.map((route) => {
        // Skip FAQ route as it's handled separately
        if (route.path === "/faq") return null;
        return (
          <Route
            key={route.path}
            path={route.path}
            element={<SectionScreen key={route.path} title={route.title} subtitle={route.subtitle} />}
          />
        );
      })}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
