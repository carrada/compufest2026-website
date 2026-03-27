/**
 * RoutesRenderer Component - Open/Closed Principle
 * Renderiza dinámicamente las rutas basadas en configuración
 * Se puede extender sin modificación agregando más rutas a la configuración
 */

"use client";

import { Route, Routes, Navigate } from "react-router-dom";
import { HomeRoute } from "@/components/routes/HomeRoute";
import { SectionScreen } from "@/components/routes/SectionScreen";
import type { SectionRoute } from "@/lib/types";

interface RoutesRendererProps {
  sectionRoutes: SectionRoute[];
}

export function RoutesRenderer({ sectionRoutes }: RoutesRendererProps) {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      {sectionRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<SectionScreen title={route.title} subtitle={route.subtitle} />}
        />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
