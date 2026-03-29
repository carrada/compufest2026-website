/**
 * Navigation Configuration - Open/Closed Principle
 * Centraliza la configuración de navegación para fácil extensión sin modificación
 */

import type { MenuItem, SocialItem, SectionRoute } from "@/lib/types";

export const MENU_ITEMS: MenuItem[] = [
  { label: "Inicio", ariaLabel: "Ir al inicio", link: "/" },
  { label: "Registro", ariaLabel: "Ir al registro", link: "https://luma.com/nlyxj7sm", openInNewTab: true },
  { label: "WeirdUI", ariaLabel: "Ver la hackathon", link: "/hackathon" },
  { label: "Charlas", ariaLabel: "Ver charlas", link: "/charlas" },
  { label: "Talleres", ariaLabel: "Ver talleres", link: "/talleres" },
  { label: "Nosotros", ariaLabel: "Conoce al equipo", link: "/nosotros" },
  { label: "FAQ", ariaLabel: "Preguntas frecuentes", link: "/faq" },
];

export const SOCIAL_ITEMS: SocialItem[] = [
  { label: "GuayabaDev", link: "https://guayabadev.com/", logo: "/guayabadevlogomenuext.svg" },
  { label: "Sudo", link: "https://linktr.ee/Sudo_FCiencias", logo: "/sudo_isologo.svg" },
  { label: "Ixalli", link: "https://www.instagram.com/ixalli_oficial/", logo: "/ixalli1-updated.svg" },
  { label: "PumasMás", link: "https://www.instagram.com/pumasmas.fcunam/", logo: "/pumasmas.svg" },
  { label: "Hackers Fight Club", link: "https://www.instagram.com/hackersfightclub/", logo: "/hfc.svg" },
  { label: "AWS UNAM", link: "https://linktr.ee/aws_unam", logo: "/awsunam.svg" },
];

export const SECTION_ROUTES: SectionRoute[] = [
  {
    path: "/hackathon",
    title: "WeirdUI",
    subtitle: "Reto creativo para construir interfaces fuera de lo común.",
  },
  {
    path: "/charlas",
    title: "Charlas",
    subtitle: "Conferencias con speakers invitados de tecnología y diseño.",
  },
  {
    path: "/talleres",
    title: "Talleres",
    subtitle: "Sesiones prácticas para aprender construyendo.",
  },
  {
    path: "/nosotros",
    title: "Nosotros",
    subtitle: "Equipo organizador de COMPUFEST 2026.",
  },
  {
    path: "/faq",
    title: "FAQ",
    subtitle: "Respuestas rápidas a las dudas más comunes.",
  },
];
