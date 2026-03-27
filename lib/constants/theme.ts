/**
 * Theme Configuration - DRY Principle
 * Centraliza toda la configuración visual para consistencia
 */

export const COLORS = {
  primary: "#26D968",
  secondary: "#000000",
  white: "#ffffff",
  dark: "#000",
  accentGreen: "#26D968",
} as const;

export const GRADIENTS = {
  grid: {
    horizontal: "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
    vertical: "linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
    size: "60px 60px",
  },
} as const;

export const TYPOGRAPHY = {
  heading: {
    color: COLORS.primary,
    fontSize: "clamp(2rem, 8vw, 5rem)",
    margin: 0,
  },
  subtitle: {
    color: COLORS.white,
    opacity: 0.85,
    marginTop: "1rem",
    fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
  },
  uiText: {
    color: COLORS.primary,
    fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
    fontWeight: 600,
    margin: 0,
    textShadow: "0 0 20px rgba(38, 217, 104, 0.5)",
  },
} as const;

export const LAYOUT = {
  section: {
    minHeight: "100vh",
    padding: "8rem 1.5rem 3rem",
    maxWidth: "70ch",
  },
  fullScreen: {
    width: "100%",
    height: "100vh",
  },
} as const;

export const MENU_CONFIG = {
  position: "right" as const,
  colors: [COLORS.primary, COLORS.secondary],
  logoUrl: "/logo.svg",
  accentColor: COLORS.primary,
  displaySocials: true,
  displayItemNumbering: true,
  menuButtonColor: COLORS.white,
  openMenuButtonColor: COLORS.white,
  changeMenuColorOnOpen: true,
  isFixed: true,
} as const;
