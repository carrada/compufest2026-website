/**
 * AppRouterShell - Application Root Component
 *
 * SOLID Principles Applied:
 * - Single Responsibility: Solo coordina la estructura de la app
 * - Open/Closed: Extensible mediante configuración de routes
 * - Dependency Inversion: Inyecta configuración mediante hooks
 *
 * Esta es la raíz de la aplicación que orquesta todos los componentes
 */

"use client";

import { BrowserRouter } from "react-router-dom";
import StaggeredMenu from "@/components/ui/StaggeredMenu";
import { RoutesRenderer } from "@/components/layout/RoutesRenderer";
import { useNavigationConfig } from "@/hooks/useNavigationConfig";
import { CSSProperties } from "react";

export default function AppRouterShell() {
  // Inyectar configuración - Dependency Inversion
  const navigationConfig = useNavigationConfig();

  // Estilos base de la aplicación
  const mainStyle: CSSProperties = {
    position: "relative",
    minHeight: "100vh",
    backgroundColor: "#000",
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
    backgroundSize: "60px 60px",
  };

  return (
    <BrowserRouter>
      <main style={mainStyle}>
        {/* Menú de navegación */}
        <StaggeredMenu
          position={navigationConfig.menuConfig.position}
          items={navigationConfig.menuItems}
          socialItems={navigationConfig.socialItems}
          displaySocials={navigationConfig.menuConfig.displaySocials}
          displayItemNumbering={navigationConfig.menuConfig.displayItemNumbering}
          menuButtonColor={navigationConfig.menuConfig.menuButtonColor}
          openMenuButtonColor={navigationConfig.menuConfig.openMenuButtonColor}
          changeMenuColorOnOpen={navigationConfig.menuConfig.changeMenuColorOnOpen}
          colors={navigationConfig.menuConfig.colors}
          logoUrl={navigationConfig.menuConfig.logoUrl}
          accentColor={navigationConfig.menuConfig.accentColor}
          isFixed={navigationConfig.menuConfig.isFixed}
        />

        {/* Rutas renderizadas dinámicamente */}
        <RoutesRenderer sectionRoutes={navigationConfig.sectionRoutes} />
      </main>
    </BrowserRouter>
  );
}
