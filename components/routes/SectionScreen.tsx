/**
 * SectionScreen Component - Single Responsibility
 * Solo responsable de renderizar pantallas de sección
 */

'use client';

import { CSSProperties, useEffect, useState } from 'react';
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
  const textFontSize = isMobile ? 60 : isTablet ? 140 : 200;
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
      ) : title === "Nosotros" ? (
        <div className="w-full px-4 md:px-8 lg:px-16">
          <div className="mb-12 text-center">
            <h1
              style={{
                fontFamily: "'Red Hat Display', sans-serif",
                fontSize: "3.5rem",
                fontWeight: 700,
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
