/**
 * Types y Interfaces - Single Responsibility
 * Centraliza todas las definiciones de tipos para mejorar mantenibilidad
 */

export interface MenuItem {
  label: string;
  ariaLabel?: string;
  link: string;
  openInNewTab?: boolean;
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

// Auth & Teams types
export interface Profile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  github_username: string | null;
  avatar_url: string | null;
  role: 'admin' | 'judge' | 'participant';
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  invite_code: string;
  repository_url: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  joined_at: string;
  profile?: Profile;
}

export interface TeamCreationCode {
  code: string;
  note: string | null;
  used_by: string | null;
  used_at: string | null;
  team_id: string | null;
  created_at: string;
}
