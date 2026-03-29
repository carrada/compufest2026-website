/**
 * SectionScreen Component - Single Responsibility
 * Solo responsable de renderizar pantallas de sección
 */

'use client';

import { CSSProperties, useEffect, useState } from 'react';
import { COLORS, TYPOGRAPHY, LAYOUT } from "@/lib/constants/theme";
import dynamic from 'next/dynamic';
import { Terminal } from "@/components/ui/terminal";

// Dynamic import with ssr: false for component that accesses document/window
const ASCIIText = dynamic(
  () => import("@/components/ui/ASCIIText"),
  { ssr: false, loading: () => <div style={{ minHeight: '200px' }} /> }
);

interface SectionScreenProps {
  title: string;
  subtitle: string;
}

export function SectionScreen({ title, subtitle }: SectionScreenProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    let debounceTimer: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        setIsMobile(window.innerWidth < 640);
        setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
      }, 150);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isClient) {
    return <section style={{ minHeight: LAYOUT.section.minHeight }} />;
  }

  const showASCII = false;
  const asciiFontSize = isMobile ? 4 : isTablet ? 6 : 8;
  const textFontSize = isMobile ? 40 : isTablet ? 100 : 180;
  const planeBaseHeight = isMobile ? 4 : isTablet ? 6 : 8;

  const sectionStyle: CSSProperties = {
    minHeight: LAYOUT.section.minHeight,
    display: "grid",
    placeItems: "center",
    padding: LAYOUT.section.padding,
    position: "relative",
  };

  const containerStyle: CSSProperties = {
    textAlign: "center",
    maxWidth: LAYOUT.section.maxWidth,
    width: "100%",
  };

  return (
    <section style={sectionStyle}>
      {showASCII ? (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <ASCIIText
            text="..."
            asciiFontSize={asciiFontSize}
            textFontSize={textFontSize}
            textColor="#fdf9f3"
            planeBaseHeight={planeBaseHeight}
            enableWaves={false}
          />
        </div>
      ) : title === "WeirdUI" ? (
        <div className="w-full px-4 md:px-8 lg:px-16 min-h-96">
          <Terminal
            commands={[
              "status --section",
              "hackathon --reto",
              "cat Primera_vez_Ciencias.txt",
              "echo interfaz-cava-restaurante",
              "status --proximi",
            ]}
            outputs={{
              0: [
                "⚠️ SECCIÓN EN CONSTRUCCIÓN",
                "Esta sección no está en funcionamiento en este momento.",
                "Pronto dispondremos información completa sobre:",
                "• Detalles del reto",
                "• Reglas y mecánica",
                "• Equipo de jueces",
                "• Cronograma del evento",
                "",
                "¡Vuelve pronto!",
              ],
              1: [
                "¡PRIMERA VEZ EN LA FACULTAD DE CIENCIAS!",
                "En esta edición tendremos una primicia en la Facultad de Ciencias: su primer hackathon.",
              ],
              2: [
                "Mientras en los hackatones tradicionales se busca llegar a una solución de mercado general,",
                "el reto de este hackathon será más particular y orientado a la creatividad y aprendizaje",
                "de los equipos participantes.",
              ],
              3: [
                "Crear una interfaz para la gestión de una cava en un restaurante",
                "Particularidad: usar bibliotecas y lenguajes fuera de lo común",
                "Sin nada de diseño web tradicional",
              ],
              4: [
                "Muy pronto sacaremos más información sobre:",
                "• Las reglas del hackathon",
                "• Los jueces",
                "• El mecanismo completo del evento",
                "¡Mantente atento a nuestras redes sociales!",
              ],
            }}
            typingSpeed={30}
            delayBetweenCommands={800}
          />
        </div>
      ) : title === "Charlas" ? (
        <div className="w-full px-4 md:px-8 lg:px-16 min-h-96">
          <Terminal
            commands={[
              "status --charlas",
              "charlas --info",
            ]}
            outputs={{
              0: [
                "⚠️ SECCIÓN EN CONSTRUCCIÓN",
                "Esta sección no está en funcionamiento en este momento.",
                "",
                "¡Pero pronto tendremos charlas increíbles!",
              ],
              1: [
                "📢 CHARLAS COMPUFEST 2026",
                "",
                "Contaremos con:",
                "• Líderes de opinión en la industria tech",
                "• Conferencias en diferentes locaciones",
                "• Oportunidad de networking con profesionales",
                "  con años de experiencia en la industria",
                "",
                "✨ Lo mejor: ¡TODO COMPLETAMENTE GRATIS!",
                "",
                "Mantente atento a nuestras redes sociales",
                "para conocer a los speakers y horarios.",
              ],
            }}
            typingSpeed={30}
            delayBetweenCommands={800}
          />
        </div>
      ) : title === "Talleres" ? (
        <div className="w-full px-4 md:px-8 lg:px-16 min-h-96">
          <Terminal
            commands={[
              "status --talleres",
              "talleres --info",
            ]}
            outputs={{
              0: [
                "⚠️ SECCIÓN EN CONSTRUCCIÓN",
                "Esta sección no está en funcionamiento en este momento.",
                "",
                "¡Pero pronto tendremos talleres increíbles!",
              ],
              1: [
                "🎓 TALLERES COMPUFEST 2026",
                "",
                "Talleres en locaciones exclusivas en la facultad",
                "",
                "Aprenderás:",
                "• Habilidades laborales para el mercado tech",
                "• Experiencia práctica en proyectos reales",
                "• Conocimiento directo de profesionales",
                "",
                "Perfecto si quieres meterte al mercado tech",
                "en un futuro. ¡Totalmente GRATIS!",
                "",
                "Síguenos en redes sociales para más detalles.",
              ],
            }}
            typingSpeed={30}
            delayBetweenCommands={800}
          />
        </div>
      ) : (
        <div style={containerStyle}>
          <h1 style={TYPOGRAPHY.heading}>{title}</h1>
          <p style={TYPOGRAPHY.subtitle}>{subtitle}</p>
        </div>
      )}
    </section>
  );
}
