/**
 * Types y Interfaces - Single Responsibility
 * Centraliza todas las definiciones de tipos para mejorar mantenibilidad
 */

export interface MenuItem {
  label: string;
  ariaLabel?: string;
  link: string;
}

export interface SocialItem {
  label: string;
  link: string;
  logo: string;
}

export interface SectionRoute {
  path: string;
  title: string;
  subtitle: string;
}

export interface MenuConfig {
  items: MenuItem[];
  socialItems: SocialItem[];
  position: "left" | "right";
  colors: [string, string];
  logoUrl: string;
  accentColor: string;
}

export interface BackgroundConfig {
  color: string;
  gridSize: number;
  gridOpacity: number;
}

export interface RouteConfig {
  mainRoutes: SectionRoute[];
  homeRoute: {
    path: string;
  };
}
