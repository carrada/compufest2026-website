/**
 * SectionScreen Component - Single Responsibility
 * Solo responsable de renderizar pantallas de sección
 */

'use client';

import { CSSProperties, useEffect, useState } from 'react';
import Image from 'next/image';
import { COLORS, TYPOGRAPHY, LAYOUT } from "@/lib/constants/theme";
import dynamic from 'next/dynamic';
import { Terminal } from "@/components/ui/terminal";
import { GalleryDemo } from "@/components/GalleryDemo";

// Dynamic import with ssr: false for component that accesses document/window
const ASCIIText = dynamic(
  () => import("@/components/ui/ASCIIText"),
  { ssr: false, loading: () => <div style={{ minHeight: '200px' }} /> }
);

const CounterPage = dynamic(
  () => import("@/app/dev/CounterPage"),
  { ssr: false, loading: () => <div style={{ minHeight: '100vh' }} /> }
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
    setIsClient(true);
    
    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isClient) {
    return <section style={{ minHeight: LAYOUT.section.minHeight }} />;
  }

  const showASCII = false;
  const asciiFontSize = isMobile ? 6 : isTablet ? 7 : 8;
  const textFontSize = isMobile ? 44 : isTablet ? 96 : 200;
  const planeBaseHeight = isMobile ? 5 : isTablet ? 6.5 : 8;

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

  const contentMaxWidthStyle: CSSProperties = {
    width: "100%",
    maxWidth: "1120px",
    margin: "0 auto",
  };

  const responsiveGridStyle = (mobileColumns: string, desktopColumns: string): CSSProperties => ({
    display: "grid",
    gridTemplateColumns: isMobile ? mobileColumns : desktopColumns,
    gap: isMobile ? "0.75rem" : "1rem",
  });

  const responsiveSectionStyle = (bottomMargin = "3rem"): CSSProperties => ({
    marginBottom: isMobile ? "2rem" : bottomMargin,
  });

  const cardPadding = isMobile ? "1rem" : "1.1rem";
  const panelPadding = isMobile ? "1rem" : "1.5rem";

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
      ) : title === "WeirdUI" || title === "WeirdUI[1]" ? (
        <div className="w-full px-4 md:px-8 lg:px-16" style={contentMaxWidthStyle}>
          <div style={{ marginTop: isMobile ? "1rem" : "2rem", marginBottom: isMobile ? "1.75rem" : "3rem", textAlign: "center", display: "flex", justifyContent: "center" }}>
            <Image
              src="/logo_weirdui1.png"
              alt="WeirdUI[1]"
              width={isMobile ? 200 : isTablet ? 400 : 600}
              height={isMobile ? 100 : isTablet ? 200 : 300}
              style={{ width: "auto", height: "auto", maxWidth: "100%" }}
              priority
              unoptimized
            />
          </div>

          {/* Visión */}
          <section style={responsiveSectionStyle()}>
            <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 600, color: COLORS.primary, marginBottom: "1rem" }}>
              Visión
            </h2>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.9rem" : "clamp(0.9rem, 2vw, 1rem)", color: "#ccc", lineHeight: isMobile ? "1.7" : "1.8", marginBottom: "1rem" }}>
              Cuando participamos en hackatones, es casi inevitable que llegue el momento de crear una interfaz de usuario. Y normalmente, esa UI está hecha en React, Vue o algún framework popular creado para la web.
            </p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.9rem" : "clamp(0.9rem, 2vw, 1rem)", color: "#ccc", lineHeight: isMobile ? "1.7" : "1.8" }}>
              Pero en WeirdUI[1] tenemos otra visión. Queremos hacerlo de manera diferente. Queremos que sea raro, desafiante, fuera de lo normal. Aquí no usamos los frameworks clásicos ni el stack convencional. Nada de React, nada de JavaScript, ni de TypeScript…nada web. Queremos ver interfaces creadas con Python, Rust, Java, C++, o cualquier otro lenguaje que se te ocurra, siempre y cuando no sea lo "normal".
            </p>
          </section>

          {/* El Reto */}
          <section style={responsiveSectionStyle()}>
            <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 600, color: COLORS.primary, marginBottom: "1rem" }}>
              El Reto
            </h2>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.9rem" : "clamp(0.9rem, 2vw, 1rem)", color: "#ccc", lineHeight: isMobile ? "1.7" : "1.8", marginBottom: "1rem" }}>
              Y que seriá un stack poco convencional sin un reto del mismo nivel? En WeirdUI no buscamos resolver un problema masivo, queremos que enfoques tu creatividad en algo más específico, algo de nicho. El reto de WeirdUI[1] será crear una interfaz para gestionar la cava de un restaurante.
            </p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "1rem" : "clamp(1rem, 2.5vw, 1.25rem)", color: COLORS.primary, fontWeight: 600, lineHeight: "1.8" }}>
              ¿Aceptas el reto?
            </p>
          </section>

          {/* Requisitos */}
          <section style={responsiveSectionStyle()}>
            <div style={{ backgroundColor: "rgba(38, 217, 104, 0.05)", padding: panelPadding, borderLeft: "3px solid #26D968", borderRadius: "4px" }}>
              <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 600, color: COLORS.primary, marginBottom: "1rem", marginTop: 0 }}>
                Requisitos
              </h2>
              <div style={responsiveGridStyle("1fr", "repeat(auto-fit, minmax(220px, 1fr))")}>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.7", margin: 0, overflowWrap: "anywhere" }}>
                    Para participar necesitas tener un equipo de hasta 5 personas.
                  </p>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.7", margin: 0, overflowWrap: "anywhere" }}>
                    Cada equipo deberá elegir un nombre con el que serán identificados en el concurso. Ese nombre no debe ser altisonante ni irrespetuoso.
                  </p>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.7", margin: 0, overflowWrap: "anywhere" }}>
                    Cada integrante del equipo debe de tener una cuenta de GitHub y una cuenta de correo para el registro.
                  </p>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.7", margin: 0, overflowWrap: "anywhere" }}>
                    Asegúrate de usar tu nombre completo legal para inscribirte.
                  </p>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.7", margin: 0, overflowWrap: "anywhere" }}>
                    El hackathon busca una interfaz como solución: tú decides qué tipo de interfaz entregas.
                  </p>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.7", margin: 0, overflowWrap: "anywhere" }}>
                    Tu solución no debe incluir ningún archivo .ts ni .js. Puedes tener archivos de cualquier otro tipo.
                  </p>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.7", margin: 0, overflowWrap: "anywhere" }}>
                    Tú eliges el tipo de base de datos y dónde se aloja. Al final debes explicar por qué elegiste esa base de datos.
                  </p>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.7", margin: 0, overflowWrap: "anywhere" }}>
                    Tendrás que implementar control de usuarios y de salidas y entradas de insumos (en este caso, los vinos).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Entregables */}
          <section style={responsiveSectionStyle()}>
            <div style={{ backgroundColor: "rgba(38, 217, 104, 0.05)", padding: panelPadding, borderLeft: "3px solid #26D968", borderRadius: "4px" }}>
              <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 600, color: COLORS.primary, marginBottom: "1rem", marginTop: 0 }}>
                Entregables
              </h2>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.9rem" : "clamp(0.9rem, 2vw, 1rem)", color: "#ccc", lineHeight: isMobile ? "1.7" : "1.8", marginBottom: "1rem" }}>
                Al final debes mostrar tres cosas:
              </p>
              <div style={responsiveGridStyle("1fr", "repeat(auto-fit, minmax(240px, 1fr))")}>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.05rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.6rem", marginTop: 0 }}>
                    Repositorio
                  </h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.7", margin: 0, overflowWrap: "anywhere" }}>
                    El repositorio de tu solución. Necesitamos revisar el código, por lo que se te asignará un repositorio para alojar tu código.
                  </p>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.05rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.6rem", marginTop: 0 }}>
                    Prueba
                  </h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.7", margin: 0, overflowWrap: "anywhere" }}>
                    Una forma de probar tu solución: cómo la instalamos? cómo la ejecutamos?
                  </p>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.05rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.6rem", marginTop: 0 }}>
                    Reporte
                  </h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.7", margin: 0, overflowWrap: "anywhere" }}>
                    Un reporte de tu solución. Queremos conocer cual fue la ruta que tomó tu equipo, el por que decidieron tomar ciertas decisiones, etc, todo lo que nos explique su creatividad y acercamiento al reto.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Reglas */}
          <section style={responsiveSectionStyle()}>
            <div style={{ backgroundColor: "rgba(38, 217, 104, 0.05)", padding: panelPadding, borderLeft: "3px solid #26D968", borderRadius: "4px" }}>
              <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 600, color: COLORS.primary, marginBottom: "1rem", marginTop: 0 }}>
                Reglas
              </h2>
              <div style={responsiveGridStyle("1fr", "repeat(auto-fit, minmax(240px, 1fr))")}>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.75rem", marginTop: 0 }}>
                    Permitido
                  </h3>
                  <ul style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.7", paddingLeft: "1rem", margin: 0, overflowWrap: "anywhere" }}>
                    <li>Bibliotecas wrappers (mientras el código fuente no sea .js ni .ts)</li>
                    <li>Python: PySide6/PyQt6, Reflex, Flet, TKinter, Textual, Streamlit, Anvil, Typer, Click</li>
                    <li>Rust: Iced, Slint, Ratatui, Druid, GTK-rs, tui-rs</li>
                    <li>Java/Kotlin: Picocli, Compose Multiplatform, JavaFX, Spring Shell, Vaadin</li>
                    <li>Dart: Flutter; Go: Fyne, Bubble Tea, Wails, Cobra</li>
                    <li>Elixir: Owl, Phoenix, Ratatouille; C++: Qt, FLTK, wxWidgets</li>
                    <li>Repositorio con historial de commits consistente durante los días del hackathon</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: "rgba(239, 68, 68, 0.08)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: "#ff8a8a", marginBottom: "0.75rem", marginTop: 0 }}>
                    Prohibido
                  </h3>
                  <ul style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#f1b3b3", lineHeight: "1.7", paddingLeft: "1rem", margin: 0, overflowWrap: "anywhere" }}>
                    <li>JavaScript, TypeScript, React, Vite, Angular, Next.js, Astro, Vue, Svelte</li>
                    <li>Cualquier framework web JS/TS de manera general</li>
                    <li>Código generado con IA</li>
                    <li>Código escrito fuera del tiempo oficial del hackathon (excepto librerías de terceros)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Fases */}
          <section style={responsiveSectionStyle()}>
            <div style={{ backgroundColor: "rgba(38, 217, 104, 0.05)", padding: panelPadding, borderLeft: "3px solid #26D968", borderRadius: "4px" }}>
              <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 600, color: COLORS.primary, marginBottom: "1rem", marginTop: 0 }}>
                Fases del Hackathon
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "1rem" : "1.25rem" }}>
                <div>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.5rem", marginTop: 0 }}>
                  Día 1: Arquitectura y Diseño
                  </h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", color: "#bbb", lineHeight: "1.6", margin: 0, overflowWrap: "anywhere" }}>
                  20 de Abril. Define lenguaje, bibliotecas, base de datos. Diagrama de relaciones. Diseño de interfaz.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.5rem", marginTop: 0 }}>
                  Día 2: Avances
                  </h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", color: "#bbb", lineHeight: "1.6", margin: 0, overflowWrap: "anywhere" }}>
                  21 de Abril. Esqueleto del proyecto. Al menos una funcionalidad. Base de datos implementada.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.5rem", marginTop: 0 }}>
                  Día 3: Entrega Final
                  </h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", color: "#bbb", lineHeight: "1.6", margin: 0, overflowWrap: "anywhere" }}>
                  22 de Abril. Código completo. Instrucciones de ejecución. Reporte de solución.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.5rem", marginTop: 0 }}>
                  Día 4: Pitch Day
                  </h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", color: "#bbb", lineHeight: "1.6", margin: 0, overflowWrap: "anywhere" }}>
                  24 de Abril. Para equipos en top 5. Presentación de 5 minutos. Demo en vivo.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Jueces */}
          <section style={responsiveSectionStyle()}>
            <div style={{ backgroundColor: "rgba(38, 217, 104, 0.05)", padding: panelPadding, borderLeft: "3px solid #26D968", borderRadius: "4px" }}>
              <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 600, color: COLORS.primary, marginBottom: "1rem", marginTop: 0 }}>
                Jueces
              </h2>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.9rem" : "clamp(0.9rem, 2vw, 1rem)", color: "#ccc", lineHeight: isMobile ? "1.7" : "1.8", marginBottom: "1rem" }}>
                Tu solución será evaluada por profesionales con experiencia en investigación, ingeniería y ciberseguridad.
              </p>
              <div style={responsiveGridStyle("1fr", "repeat(auto-fit, minmax(240px, 1fr))")}>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.05rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.6rem", marginTop: 0 }}>
                    Karla Ramirez Pulido
                  </h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.6", margin: 0, overflowWrap: "anywhere" }}>
                    Doctora en Ciencia e Ingeniería de la Computación, auditora de riesgos tecnológicos e investigadora de sesgos de género en IA.
                  </p>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.05rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.6rem", marginTop: 0 }}>
                    Alicia Margarita De La Mora Cebada
                  </h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.6", margin: 0, overflowWrap: "anywhere" }}>
                    Doctora en Ciencias de la Tierra y Técnica Académica en el Departamento de Supercómputo de la UNAM.
                  </p>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.05rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.6rem", marginTop: 0 }}>
                    Manuel Soto Romero
                  </h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.6", margin: 0, overflowWrap: "anywhere" }}>
                    Maestro en Ciencia e Ingeniería de la Computación e investigador sobre Teoría de Lenguajes de Programación.
                  </p>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.05rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.6rem", marginTop: 0 }}>
                    Virgilio Castro Rendón
                  </h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.6", margin: 0, overflowWrap: "anywhere" }}>
                    Fundador y mentor de Hackers Fight Club, especialista en ciberseguridad ofensiva y defensiva.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Premios */}
          <section style={{ marginBottom: isMobile ? "2rem" : "3rem", paddingBottom: isMobile ? "1.5rem" : "2rem" }}>
            <div style={{ backgroundColor: "rgba(38, 217, 104, 0.05)", padding: panelPadding, borderLeft: "3px solid #26D968", borderRadius: "4px" }}>
              <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 600, color: COLORS.primary, marginBottom: "1rem", marginTop: 0 }}>
                Premios
              </h2>
              <div style={responsiveGridStyle("1fr", "repeat(auto-fit, minmax(240px, 1fr))")}>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.75rem", marginTop: 0 }}>
                    1er Lugar
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1rem" }}>
                    <img src="/nswitch2.svg" alt="NSwitch Logo" style={{ width: "80px", height: "80px", objectFit: "contain", marginBottom: "0.5rem" }} />
                  </div>
                  <ul style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.6", paddingLeft: "1rem", margin: 0, overflowWrap: "anywhere" }}>
                    <li>Nintendo Switch 2, patrocinado por AWS.</li>
                    <li>Beca de 6 meses en Platzi para cada integrante, patrocinado por Interledger Foundation</li>
                    <li>Paquete de libros, patrocinado por Interledger Foundation</li>
                    <li>Beca de 3 meses en Pentesterlab, patrocinada por Hackers Fight Club.</li>
                    <li>Reconocimiento oficial como ganadorx de WeirdUI[1]</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.75rem", marginTop: 0 }}>
                    2do y 3er Lugar
                  </h3>
                  <ul style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.6", paddingLeft: "1rem", margin: 0, overflowWrap: "anywhere" }}>
                    <li>Paquete de libros para cada integrante, patrocinado por Interledger Foundation</li>
                    <li>Beca de 3 meses en Platzi (tras completar curso "Open Payments"), patrocinada por Interledger Foundation</li>
                    <li>Reconocimiento oficial por parte de la Facultad de Ciencias como ganadorx de WeirdUI[1]</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Registro */}
          <section>
            <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 600, color: COLORS.primary, marginBottom: "1rem" }}>
              Registro
            </h2>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.9rem" : "clamp(0.9rem, 2vw, 1rem)", color: "#ccc", lineHeight: isMobile ? "1.7" : "1.8" }}>
              El registro estará abierto del 06 al 16 de abril de 2026 a las 23:59 hrs. Conecta tu cuenta de GitHub en la parte superior de la página para crear un equipo o unirte a uno con su código. Una vez que cierre el registro, se te asignará un repositorio en la comunidad Sudo FCiencias para subir tus avances.
            </p>
          </section>
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
      ) : title === "Nosotros" ? (
        <div className="w-full px-4 md:px-8 lg:px-16">
          <div className="mb-12 text-center">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-center"
              style={{
                fontFamily: "'Red Hat Display', sans-serif",
                fontWeight: 700,
                letterSpacing: "-1px",
                color: "#26D968",
                marginBottom: "1rem",
              }}
            >
              ¿Quienes Somos?
            </h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left side - Title and Description */}
            <div className="flex flex-col justify-center">
              <h2
                style={{
                  fontFamily: "'Red Hat Display', sans-serif",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: "#26D968",
                  marginBottom: "1rem",
                }}
              >
                Guayaba Devs
              </h2>
              <p
                style={{
                  fontFamily: "'JetBrainsMono', monospace",
                  fontSize: "1.1rem",
                  color: "#ffffff",
                  lineHeight: "1.8",
                }}
              >
                Guayaba Devs surge de una comunidad estudiantil en 2022 que encontró en la colaboración la mejor forma de aprender. Hoy operamos como una red abierta que une sedes, capítulos y aliados para impulsar proyectos de tecnología y compartir conocimiento sin costo.
              </p>
            </div>

            {/* Right side - Terminal style image */}
            <div
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              {/* Terminal Title Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#262626",
                  padding: "12px 16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#ef4444",
                    }}
                  />
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#eab308",
                    }}
                  />
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#22c55e",
                    }}
                  />
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#a3a3a3",
                    }}
                  >
                    Guayaba Devs — Image
                  </span>
                </div>
              </div>

              {/* Terminal Content */}
              <div
                style={{
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #262626",
                  borderTop: "none",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "300px",
                }}
              >
                <img
                  src="/guayabaDev.jpg"
                  alt="Guayaba Devs"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "350px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left side - Title and Description */}
            <div className="flex flex-col justify-center">
              <h2
                style={{
                  fontFamily: "'Red Hat Display', sans-serif",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: "#26D968",
                  marginBottom: "1rem",
                }}
              >
                Ixalli
              </h2>
              <p
                style={{
                  fontFamily: "'JetBrainsMono', monospace",
                  fontSize: "1.1rem",
                  color: "#ffffff",
                  lineHeight: "1.8",
                }}
              >
                Ixalli es una iniciativa universitaria surgida en la UNAM, enfocada en cerrar la brecha de género en áreas STEM. Constituye una comunidad creada por y para mujeres en tecnología, diseñada para potenciar el desarrollo profesional y académico a través de cuatro pilares fundamentales: mentoría estratégica, talleres especializados, networking de alto valor y creación de redes de apoyo. Su objetivo principal es conectar, inspirar y empoderar a las futuras líderes del sector tech.
              </p>
            </div>

            {/* Right side - Terminal style image */}
            <div
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              {/* Terminal Title Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#262626",
                  padding: "12px 16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#ef4444",
                    }}
                  />
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#eab308",
                    }}
                  />
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#22c55e",
                    }}
                  />
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#a3a3a3",
                    }}
                  >
                    Ixalli — Image
                  </span>
                </div>
              </div>

              {/* Terminal Content */}
              <div
                style={{
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #262626",
                  borderTop: "none",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "300px",
                }}
              >
                <img
                  src="/ixalli_web.jpeg"
                  alt="Ixalli"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "350px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left side - Title and Description */}
            <div className="flex flex-col justify-center">
              <h2
                style={{
                  fontFamily: "'Red Hat Display', sans-serif",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: "#26D968",
                  marginBottom: "1rem",
                }}
              >
                Hackers Fight Club
              </h2>
              <p
                style={{
                  fontFamily: "'JetBrainsMono', monospace",
                  fontSize: "1.1rem",
                  color: "#ffffff",
                  lineHeight: "1.8",
                }}
              >
                Hackers Fight Club (HFC) es una agrupación dedicada a la capacitación de estudiantes de la UNAM en ciberseguridad. Nuestro objetivo más importante es crear comunidad: fortalecer la identidad, el sentido de pertenencia y la unidad entre quienes comparten esta pasión, dentro y fuera de la UNAM. Entre nuestros proyectos más destacados se encuentran la difusión con contenido educativo, la organización de talleres prácticos, la investigación en ciberseguridad y la participación en competencias nacionales, regionales e internacionales.
              </p>
            </div>

            {/* Right side - Terminal style image */}
            <div
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              {/* Terminal Title Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#262626",
                  padding: "12px 16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#ef4444",
                    }}
                  />
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#eab308",
                    }}
                  />
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#22c55e",
                    }}
                  />
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#a3a3a3",
                    }}
                  >
                    Hackers Fight Club — Image
                  </span>
                </div>
              </div>

              {/* Terminal Content */}
              <div
                style={{
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #262626",
                  borderTop: "none",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "300px",
                }}
              >
                <img
                  src="/hfc_web.jpg"
                  alt="Hackers Fight Club"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "350px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left side - Title and Description */}
            <div className="flex flex-col justify-center">
              <h2
                style={{
                  fontFamily: "'Red Hat Display', sans-serif",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: "#26D968",
                  marginBottom: "1rem",
                }}
              >
                Sudo
              </h2>
              <p
                style={{
                  fontFamily: "'JetBrainsMono', monospace",
                  fontSize: "1.1rem",
                  color: "#ffffff",
                  lineHeight: "1.8",
                }}
              >
                Sudo es una comunidad estudiantil destinada a llenar lagunas técnicas, sociales y académicas en el ámbito de la tecnología. No solo buscamos poder crear una comunidad para fortalecer nuestros conocimientos tecnológicos, si no también crear espacios en donde podamos compartirlos y estar en continuo aprendizaje, sin importar el nivel técnico, experiencia, carrera, escuela o recorrido profesional.
                <br />
                <br />
                Nuestro nombre proviene del comando de terminal del mismo nombre, que significa super user do. Por ello, nuestro slogan es No somos expertxs, somos Sudo.
              </p>
            </div>

            {/* Right side - Terminal style image */}
            <div
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              {/* Terminal Title Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#262626",
                  padding: "12px 16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#ef4444",
                    }}
                  />
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#eab308",
                    }}
                  />
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#22c55e",
                    }}
                  />
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#a3a3a3",
                    }}
                  >
                    Sudo — Image
                  </span>
                </div>
              </div>

              {/* Terminal Content */}
              <div
                style={{
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #262626",
                  borderTop: "none",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "300px",
                }}
              >
                <img
                  src="/sudo_web.jpg"
                  alt="Sudo"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "350px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left side - Title and Description */}
            <div className="flex flex-col justify-center">
              <h2
                style={{
                  fontFamily: "'Red Hat Display', sans-serif",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: "#26D968",
                  marginBottom: "1rem",
                }}
              >
                Pu++
              </h2>
              <p
                style={{
                  fontFamily: "'JetBrainsMono', monospace",
                  fontSize: "1.1rem",
                  color: "#ffffff",
                  lineHeight: "1.8",
                }}
              >
                En Pu++, somos la comunidad de programación competitiva de la Facultad de Ciencias. Transformamos tu curiosidad en una ventaja competitiva, llevando tu lógica desde los fundamentos hasta el podio.
              </p>
            </div>

            {/* Right side - Terminal style image */}
            <div
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              {/* Terminal Title Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#262626",
                  padding: "12px 16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#ef4444",
                    }}
                  />
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#eab308",
                    }}
                  />
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#22c55e",
                    }}
                  />
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#a3a3a3",
                    }}
                  >
                    Pu++ — Image
                  </span>
                </div>
              </div>

              {/* Terminal Content */}
              <div
                style={{
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #262626",
                  borderTop: "none",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "300px",
                }}
              >
                <img
                  src="/pumasmas_web.jpg"
                  alt="Pu++"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "350px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left side - Title and Description */}
            <div className="flex flex-col justify-center">
              <h2
                style={{
                  fontFamily: "'Red Hat Display', sans-serif",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: "#26D968",
                  marginBottom: "1rem",
                }}
              >
                AWS Cloud Club UNAM
              </h2>
              <p
                style={{
                  fontFamily: "'JetBrainsMono', monospace",
                  fontSize: "1.1rem",
                  color: "#ffffff",
                  lineHeight: "1.8",
                }}
              >
                El AWS Cloud Club UNAM es un grupo de usuarios dirigido e impulsado por estudiantes que se enfoca en aprender sobre la Nube a través de las tecnologías de AWS.
              </p>
            </div>

            {/* Right side - Terminal style image */}
            <div
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              {/* Terminal Title Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#262626",
                  padding: "12px 16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#ef4444",
                    }}
                  />
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#eab308",
                    }}
                  />
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#22c55e",
                    }}
                  />
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#a3a3a3",
                    }}
                  >
                    AWS Cloud Club UNAM — Image
                  </span>
                </div>
              </div>

              {/* Terminal Content */}
              <div
                style={{
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #262626",
                  borderTop: "none",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "300px",
                }}
              >
                <img
                  src="/awsccunam_web.jpeg"
                  alt="AWS Cloud Club UNAM"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "350px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="w-full mt-20 px-0">
            <div className="w-full px-4 md:px-8 lg:px-16 mb-8 flex items-center justify-center">
              <h3
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-center text-white"
                style={{
                  fontFamily: "'Red Hat Display', sans-serif",
                  fontWeight: 700,
                  letterSpacing: "-1px",
                  color: "#26D968",
                }}
              >
                CompuFest[0]
              </h3>
            </div>
            <GalleryDemo />
          </div>
        </div>
      ) : title === "FAQ" ? (
        <div style={containerStyle}>
          <h1 style={TYPOGRAPHY.heading}>FAQ</h1>
          <p style={TYPOGRAPHY.subtitle}>Preguntas Frecuentes</p>
        </div>
      ) : title === "Contador" ? (
        <CounterPage />
      ) : (
        <div style={containerStyle}>
          <h1 style={TYPOGRAPHY.heading}>{title}</h1>
          <p style={TYPOGRAPHY.subtitle}>{subtitle}</p>
        </div>
      )}
    </section>
  );
}
