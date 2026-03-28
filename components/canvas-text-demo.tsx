'use client';

import { cn } from "@/lib/utils";
import { CanvasText } from "@/components/ui/canvas-text";
import { useEffect, useState, memo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { masonryItems } from "./masonry-data";
import Terminal from "@/components/ui/Terminal";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { CometCard } from "@/components/ui/comet-card";

const Masonry = dynamic(() => import("./Masonry"), {
  loading: () => <div style={{ minHeight: "600px", backgroundColor: "#0a0a0a", borderRadius: "12px" }} />,
  ssr: false
});

const CanvasTextDemo = memo(function CanvasTextDemo() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Valores responsivos para CanvasText
  const lineWidth = isMobile ? 1 : isTablet ? 1.5 : 2;
  const lineGap = isMobile ? 2 : isTablet ? 2.5 : 3;
  const animationDuration = 15;
  const curveIntensity = isMobile ? 30 : isTablet ? 40 : 50;

  return (
    <div 
      className="flex flex-col min-h-auto items-center justify-center w-full px-4 py-8 sm:px-6 md:px-8 lg:py-12 gap-6"
      style={{
        backgroundColor: "#000",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    >
      <h2
        className={cn(
          "group relative mx-auto text-center font-bold tracking-tight text-balance text-neutral-300 dark:text-neutral-200",
          "text-3xl leading-snug sm:text-4xl sm:leading-relaxed md:text-5xl md:leading-relaxed lg:text-6xl lg:leading-relaxed xl:text-7xl xl:leading-relaxed",
          "max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl"
        )}
        style={{
          fontFamily: "'Red Hat Display', sans-serif",
        }}
      >
        <span className="block md:inline">El evento estudiantil más grande de</span>
        <br className="hidden md:block" />
        {" "}
        <CanvasText
          text="computación y programación"
          backgroundClassName="bg-black"
          colors={[
            "rgba(38, 217, 104, 1)",
            "rgba(138, 43, 226, 1)",
            "rgba(38, 217, 104, 0.9)",
            "rgba(138, 43, 226, 0.9)",
            "rgba(38, 217, 104, 0.8)",
            "rgba(138, 43, 226, 0.8)",
            "rgba(38, 217, 104, 0.7)",
            "rgba(138, 43, 226, 0.7)",
            "rgba(38, 217, 104, 0.6)",
            "rgba(138, 43, 226, 0.6)",
          ]}
          lineWidth={lineWidth}
          lineGap={lineGap}
          animationDuration={animationDuration}
          curveIntensity={curveIntensity}
        />
        <br className="hidden md:block" />
        {" "}
        en la{" "}
        <span style={{ color: "#D59F0F" }}>UNAM</span>
      </h2>

      {/* Fecha con estilo CanvasText */}
      <div className="mx-auto text-center w-full">
        <h3 
          className={cn(
            "group relative mx-auto text-center font-bold tracking-tight text-neutral-300 dark:text-neutral-200",
            "text-2xl leading-snug sm:text-3xl sm:leading-relaxed md:text-4xl md:leading-relaxed lg:text-5xl lg:leading-relaxed xl:text-6xl xl:leading-relaxed"
          )}
          style={{
            fontFamily: "'Red Hat Display', sans-serif",
          }}
        >
          <CanvasText
            text="23 y 24 de abril de 2026"
            backgroundClassName="bg-black"
            colors={[
              "rgba(38, 217, 104, 1)",
              "rgba(138, 43, 226, 1)",
              "rgba(38, 217, 104, 0.9)",
              "rgba(138, 43, 226, 0.9)",
              "rgba(38, 217, 104, 0.8)",
              "rgba(138, 43, 226, 0.8)",
              "rgba(38, 217, 104, 0.7)",
              "rgba(138, 43, 226, 0.7)",
              "rgba(38, 217, 104, 0.6)",
              "rgba(138, 43, 226, 0.6)",
            ]}
            lineWidth={lineWidth}
            lineGap={lineGap}
            animationDuration={animationDuration}
            curveIntensity={curveIntensity}
          />
        </h3>
      </div>

      {/* Ubicación con texto normal */}
      <div 
        className={cn(
          "text-center font-bold text-neutral-300",
          "text-xl leading-snug sm:text-2xl sm:leading-relaxed md:text-3xl md:leading-relaxed lg:text-4xl lg:leading-relaxed xl:text-5xl xl:leading-relaxed"
        )}
        style={{
          fontFamily: "'Red Hat Display', sans-serif",
          color: "#063C61",
        }}
      >
        UNAM Facultad de Ciencias
      </div>

      {/* Galería Masonry */}
      <div 
        className="w-full mt-12 md:mt-16 lg:mt-20"
        style={{
          background: "radial-gradient(circle at 20% 50%, rgba(38, 217, 104, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(138, 43, 226, 0.05) 0%, transparent 50%), #0a0a0a",
          borderRadius: "12px",
          display: "block",
          overflow: "hidden"
        }}
      >
        <Masonry items={masonryItems} />
      </div>

      {/* Terminal con información sobre Compufest */}
      <div 
        className="w-full mt-12 md:mt-16 lg:mt-20 px-4 md:px-0"
      >
        <Terminal
          title="$ compufest --info"
          content={`¿Qué es el compufest?

El compufest es el evento estudiantil de computación y programación más grande de la UNAM. Este evento existe no solo para dar foco en las carreras de computación que existen en la UNAM sino también para que alumnxs, profesorxs, investigadorxs y comunidades tecnológicas puedan intercambiar conocimientos y conectar entre sí, en un espacio tanto físico como digital.

En esta segunda edición, estilizada como compufest[1], se celebrará los próximos 23 y 24 de abril del 2026. Nuevamente se realizará en su lugar de origen, la Facultad de Ciencias, en Ciudad Universitaria.`}
          speed={25}
        />
      </div>

      {/* Countdown Timer */}
      <div 
        className="w-full mt-12 md:mt-16 lg:mt-20 px-4 md:px-0"
      >
        <CountdownTimer />
      </div>

      {/* Hackathon Weird-UI Title */}
      <div 
        className="w-full mt-12 md:mt-16 lg:mt-20 px-4 md:px-0 flex items-center justify-center"
      >
        <h3
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center text-white"
          style={{
            fontFamily: "'Red Hat Display', sans-serif",
            fontWeight: 700,
            letterSpacing: "-1px",
          }}
        >
          Hackathon WeirdUI[1]
        </h3>
      </div>

      {/* Terminal con información sobre el Hackathon */}
      <div 
        className="w-full mt-12 md:mt-16 lg:mt-20 px-4 md:px-0"
      >
        <Terminal
          title="$ cat hackathon-info.txt"
          content={`¡PRIMERA VEZ EN LA FACULTAD DE CIENCIAS!
En ésta edición tendremos una primicia en la Facultad de Ciencias: su primer hackathon.

Mientras en los hackatones tradicionales se busca llegar a una solución de mercado general, el reto de este hackathon será más particular y orientado a la creatividad y aprendizaje de los equipos participantes.

$ echo reto.md

El reto será crear una interfaz para la gestión de una cava en un restaurante, con la particularidad de que la solución debe ser creada utilizando bibliotecas y lenguajes fuera de lo común: sin nada de diseño web tradicional.`}
          speed={25}
        />
      </div>

      {/* Patrocinadores Title */}
      <div 
        className="w-full mt-12 md:mt-16 lg:mt-20 px-4 md:px-0 flex items-center justify-center"
      >
        <h3
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center text-white"
          style={{
            fontFamily: "'Red Hat Display', sans-serif",
            fontWeight: 700,
            letterSpacing: "-1px",
          }}
        >
          Patrocinadores
        </h3>
      </div>

      {/* Patrocinadores Cards */}
      <div className="w-full mt-20 md:mt-24 px-4 md:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 md:gap-16 justify-items-center" style={{ marginTop: "40px" }}>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <CometCard key={`sponsor-${num}`}>
              {num === 1 ? (
                <a
                  href="https://aws.amazon.com/es/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-80 cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-2 md:p-4 hover:scale-105 transition-transform no-underline"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="mx-2 flex-1">
                    <div className="relative mt-2 aspect-[3/4] w-full">
                      <div
                        className="absolute inset-0 h-full w-full rounded-[16px] bg-white object-cover contrast-75 flex items-center justify-center"
                        style={{
                          boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                        }}
                      >
                        <Image
                          src="/awslogosvg.svg"
                          alt="AWS Logo"
                          width={220}
                          height={220}
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-shrink-0 items-center justify-between p-4 font-mono text-white">
                    <div className="text-xs">AWS</div>
                    <div className="text-xs text-gray-300 opacity-50">Amazon Web Services</div>
                  </div>
                </a>
              ) : num === 2 ? (
                <a
                  href="https://www.chiiko.design"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-80 cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-2 md:p-4 hover:scale-105 transition-transform no-underline"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="mx-2 flex-1">
                    <div className="relative mt-2 aspect-[3/4] w-full">
                      <div
                        className="absolute inset-0 h-full w-full rounded-[16px] object-cover contrast-75 flex items-center justify-center"
                        style={{
                          backgroundColor: "#ce4676",
                          boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                        }}
                      >
                        <Image
                          src="/chiikologosvg.svg"
                          alt="Chiikö Logo"
                          width={280}
                          height={280}
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-shrink-0 items-center justify-between p-4 font-mono text-white">
                    <div className="text-xs">Chiikö</div>
                    <div className="text-xs text-gray-300 opacity-50">Chiikö</div>
                  </div>
                </a>
              ) : num === 3 ? (
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-80 cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-2 md:p-4 hover:scale-105 transition-transform no-underline"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="mx-2 flex-1">
                    <div className="relative mt-2 aspect-[3/4] w-full">
                      <div
                        className="absolute inset-0 h-full w-full rounded-[16px] object-cover contrast-75 flex items-center justify-center"
                        style={{
                          backgroundColor: "#ffffff",
                          boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                        }}
                      >
                        <Image
                          src="/github-icon.svg"
                          alt="GitHub Logo"
                          width={220}
                          height={220}
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-shrink-0 items-center justify-between p-4 font-mono text-white">
                    <div className="text-xs">GitHub</div>
                    <div className="text-xs text-gray-300 opacity-50">GitHub</div>
                  </div>
                </a>
              ) : num === 4 ? (
                <a
                  href="https://interledger.org/es"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-80 cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-2 md:p-4 hover:scale-105 transition-transform no-underline"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="mx-2 flex-1">
                    <div className="relative mt-2 aspect-[3/4] w-full">
                      <div
                        className="absolute inset-0 h-full w-full rounded-[16px] object-cover contrast-75 flex items-center justify-center"
                        style={{
                          backgroundColor: "#C9C6BD",
                          boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                        }}
                      >
                        <Image
                          src="/interleadgersvg.svg"
                          alt="Interledger Logo"
                          width={220}
                          height={220}
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-shrink-0 items-center justify-between p-4 font-mono text-white">
                    <div className="text-xs">Interledger</div>
                    <div className="text-xs text-gray-300 opacity-50">Interledger Foundation</div>
                  </div>
                </a>
              ) : num === 5 ? (
                <a
                  href="https://www.notion.com/es"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-80 cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-2 md:p-4 hover:scale-105 transition-transform no-underline"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="mx-2 flex-1">
                    <div className="relative mt-2 aspect-[3/4] w-full">
                      <div
                        className="absolute inset-0 h-full w-full rounded-[16px] object-cover contrast-75 flex items-center justify-center"
                        style={{
                          backgroundColor: "#ffffff",
                          boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                        }}
                      >
                        <Image
                          src="/notionsvg.svg"
                          alt="Notion Logo"
                          width={220}
                          height={220}
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-shrink-0 items-center justify-between p-4 font-mono text-white">
                    <div className="text-xs">Notion</div>
                    <div className="text-xs text-gray-300 opacity-50">Notion</div>
                  </div>
                </a>
              ) : num === 6 ? (
                <a
                  href="https://www.ketherlabs.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-80 cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-2 md:p-4 hover:scale-105 transition-transform no-underline"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="mx-2 flex-1">
                    <div className="relative mt-2 aspect-[3/4] w-full">
                      <div
                        className="absolute inset-0 h-full w-full rounded-[16px] object-cover contrast-75 flex items-center justify-center"
                        style={{
                          backgroundColor: "#00FF7E",
                          boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                        }}
                      >
                        <Image
                          src="/ketherlabssvg.svg"
                          alt="Ketherlabs Logo"
                          width={220}
                          height={220}
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-shrink-0 items-center justify-between p-4 font-mono text-white">
                    <div className="text-xs">Ketherlabs</div>
                    <div className="text-xs text-gray-300 opacity-50">Ketherlabs</div>
                  </div>
                </a>
              ) : (
                <button
                  type="button"
                  className="flex w-80 cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-2 md:p-4 hover:scale-105 transition-transform"
                  aria-label={`Sponsor ${num}`}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="mx-2 flex-1">
                    <div className="relative mt-2 aspect-[3/4] w-full">
                      <div
                        className="absolute inset-0 h-full w-full rounded-[16px] bg-gradient-to-br from-blue-600 to-blue-900 object-cover contrast-75 flex items-center justify-center"
                        style={{
                          boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                        }}
                      >
                        <span className="text-white text-2xl font-bold opacity-50">Sponsor {num}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-shrink-0 items-center justify-between p-4 font-mono text-white">
                    <div className="text-xs">Patrocinador</div>
                    <div className="text-xs text-gray-300 opacity-50">#{num.toString().padStart(2, '0')}</div>
                  </div>
                </button>
              )}
            </CometCard>
          ))}
        </div>
      </div>

      {/* Comunidades Aliadas Title */}
      <div 
        className="w-full mt-12 md:mt-16 lg:mt-20 px-4 md:px-0 flex flex-col items-center justify-center gap-1"
      >
        <h3
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center text-white"
          style={{
            fontFamily: "'Red Hat Display', sans-serif",
            fontWeight: 700,
            letterSpacing: "-1px",
          }}
        >
          Comunidades Aliadas
        </h3>
        <p className="text-sm md:text-base text-white/60 font-light">
          (Orden Alfabetico)
        </p>
      </div>

      {/* Comunidades Aliadas Cards */}
      <div className="w-full mt-20 md:mt-24 px-4 md:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 md:gap-16 justify-items-center" style={{ marginTop: "40px" }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((num) => (
            <CometCard key={`community-${num}`}>
              {num === 1 ? (
                <a
                  href="https://www.instagram.com/awsclub.ipn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-80 cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-2 md:p-4 hover:scale-105 transition-transform no-underline"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="mx-2 flex-1">
                    <div className="relative mt-2 aspect-[3/4] w-full">
                      <div
                        className="absolute inset-0 h-full w-full rounded-[16px] object-cover contrast-75 flex items-center justify-center"
                        style={{
                          backgroundColor: "#9333ea",
                          boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                        }}
                      >
                        <Image
                          src="/ipnawssvg.svg"
                          alt="AWS IPN Logo"
                          width={220}
                          height={220}
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-shrink-0 items-center justify-between p-4 font-mono text-white">
                    <div className="text-xs">AWS IPN</div>
                    <div className="text-xs text-gray-300 opacity-50">AWS Cloud Club IPN</div>
                  </div>
                </a>
              ) : num === 2 ? (
                <a
                  href="https://www.instagram.com/aws.ajolotes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-80 cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-2 md:p-4 hover:scale-105 transition-transform no-underline"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="mx-2 flex-1">
                    <div className="relative mt-2 aspect-[3/4] w-full">
                      <div
                        className="absolute inset-0 h-full w-full rounded-[16px] object-cover contrast-75 flex items-center justify-center"
                        style={{
                          backgroundColor: "#9333ea",
                          boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                        }}
                      >
                        <Image
                          src="/awsAjolote.svg"
                          alt="AWS Ajolotes Logo"
                          width={220}
                          height={220}
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-shrink-0 items-center justify-between p-4 font-mono text-white">
                    <div className="text-xs">AWS Ajolotes</div>
                    <div className="text-xs text-gray-300 opacity-50">AWS UG Ajolotes en la nube</div>
                  </div>
                </a>
              ) : num === 3 ? (
                <a
                  href="https://www.instagram.com/chidastech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-80 cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-2 md:p-4 hover:scale-105 transition-transform no-underline"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="mx-2 flex-1">
                    <div className="relative mt-2 aspect-[3/4] w-full">
                      <div
                        className="absolute inset-0 h-full w-full rounded-[16px] object-cover contrast-75 flex items-center justify-center"
                        style={{
                          backgroundColor: "#ffffff",
                          boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                        }}
                      >
                        <Image
                          src="/chidastechsvg.svg"
                          alt="Chidas Tech Logo"
                          width={220}
                          height={220}
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-shrink-0 items-center justify-between p-4 font-mono text-white">
                    <div className="text-xs">Chidas Tech</div>
                    <div className="text-xs text-gray-300 opacity-50">Chidas Tech</div>
                  </div>
                </a>
              ) : (
                <button
                  type="button"
                  className="flex w-80 cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-2 md:p-4 hover:scale-105 transition-transform"
                  aria-label={`Comunidad ${num}`}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="mx-2 flex-1">
                    <div className="relative mt-2 aspect-[3/4] w-full">
                      <div
                        className="absolute inset-0 h-full w-full rounded-[16px] bg-gradient-to-br from-cyan-600 to-cyan-900 object-cover contrast-75 flex items-center justify-center"
                        style={{
                          boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                        }}
                      >
                        <span className="text-white text-2xl font-bold opacity-50">Comunidad {num}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-shrink-0 items-center justify-between p-4 font-mono text-white">
                    <div className="text-xs">Comunidad</div>
                    <div className="text-xs text-gray-300 opacity-50">#{num.toString().padStart(2, '0')}</div>
                  </div>
                </button>
              )}
            </CometCard>
          ))}
        </div>
      </div>

      {/* Comunidades Organizadoras Title */}
      <div 
        className="w-full mt-12 md:mt-16 lg:mt-20 px-4 md:px-0 flex items-center justify-center"
      >
        <h3
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center text-white"
          style={{
            fontFamily: "'Red Hat Display', sans-serif",
            fontWeight: 700,
            letterSpacing: "-1px",
          }}
        >
          Comunidades Organizadoras
        </h3>
      </div>

      {/* Comunidades Organizadoras Cards */}
      <div className="w-full mt-20 md:mt-24 px-4 md:px-0 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 md:gap-16 justify-items-center" style={{ marginTop: "40px" }}>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <CometCard key={`organizer-${num}`}>
              <button
                type="button"
                className="flex w-80 cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-2 md:p-4 hover:scale-105 transition-transform"
                aria-label={`Comunidad Organizadora ${num}`}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="mx-2 flex-1">
                  <div className="relative mt-2 aspect-[3/4] w-full">
                    <div
                      className="absolute inset-0 h-full w-full rounded-[16px] bg-gradient-to-br from-purple-600 to-purple-900 object-cover contrast-75 flex items-center justify-center"
                      style={{
                        boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                      }}
                    >
                      <span className="text-white text-2xl font-bold opacity-50">Organizadora {num}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex flex-shrink-0 items-center justify-between p-4 font-mono text-white">
                  <div className="text-xs">Organizadora</div>
                  <div className="text-xs text-gray-300 opacity-50">#{num.toString().padStart(2, '0')}</div>
                </div>
              </button>
            </CometCard>
          ))}
        </div>
      </div>
    </div>
  );
});

export default CanvasTextDemo;
