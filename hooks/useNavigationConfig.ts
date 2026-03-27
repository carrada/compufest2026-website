/**
 * Navigation Configuration Hook - Dependency Inversion
 * Centraliza la lógica de configuración de navegación
 */

"use client";

import { useMemo } from "react";
import { MENU_ITEMS, SOCIAL_ITEMS, SECTION_ROUTES } from "@/lib/constants/navigation";
import { MENU_CONFIG } from "@/lib/constants/theme";
import type { MenuItem, SocialItem, SectionRoute } from "@/lib/types";

export interface NavigationConfig {
  menuItems: MenuItem[];
  socialItems: SocialItem[];
  sectionRoutes: SectionRoute[];
  menuConfig: typeof MENU_CONFIG;
}

/**
 * Hook que proporciona la configuración de navegación
 * Permite inyectar configuración custom sin modificar el hook
 */
export function useNavigationConfig(
  customMenuItems?: MenuItem[],
  customSocialItems?: SocialItem[],
  customSectionRoutes?: SectionRoute[]
): NavigationConfig {
  return useMemo(
    () => ({
      menuItems: customMenuItems ?? MENU_ITEMS,
      socialItems: customSocialItems ?? SOCIAL_ITEMS,
      sectionRoutes: customSectionRoutes ?? SECTION_ROUTES,
      menuConfig: MENU_CONFIG,
    }),
    [customMenuItems, customSocialItems, customSectionRoutes]
  );
}
