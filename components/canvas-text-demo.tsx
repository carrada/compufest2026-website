'use client';

import { cn } from "@/lib/utils";
import { useEffect, useState, memo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { LinkPreview } from "@/components/ui/link-preview";
import { Terminal } from "@/components/ui/terminal";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { CometCard } from "@/components/ui/comet-card";
import { DraggableCardGallery } from "@/components/draggable-card-gallery";

const CanvasTextDemo = memo(function CanvasTextDemo() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isClient) {
    return <div style={{ minHeight: "100vh" }} />;
  }

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
          "text-3xl leading-tight xs:text-3xl sm:text-4xl sm:leading-snug md:text-5xl md:leading-relaxed lg:text-6xl lg:leading-relaxed xl:text-7xl xl:leading-relaxed",
          "max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-4xl"
        )}
        style={{
          fontFamily: "'Red Hat Display', sans-serif",
        }}
      >
        <span className="block md:inline">El evento estudiantil más grande de</span>
        <br className="hidden md:block" />
        {" "}
        <span style={{ color: "white" }}>computación y programación</span>
        <br className="hidden md:block" />
        {" "}
        en la{" "}
        <LinkPreview
          isStatic={true}
          imageSrc="/unam(1).jpg"
          url="https://www.unam.mx/"
          className="hover:underline"
          style={{ color: "#26D968" }}
          width={200}
          height={150}
        >
          UNAM
        </LinkPreview>
      </h2>

      {/* Fecha con estilo CanvasText */}
      <div className="mx-auto text-center w-full">
        <h3 
          className={cn(
            "group relative mx-auto text-center font-bold tracking-tight text-neutral-300 dark:text-neutral-200",
            "text-lg leading-tight xs:text-xl sm:text-2xl sm:leading-snug md:text-3xl md:leading-relaxed lg:text-4xl lg:leading-relaxed xl:text-5xl xl:leading-relaxed"
          )}
          style={{
            fontFamily: "'Red Hat Display', sans-serif",
          }}
        >
          <span style={{ color: "white" }}>23 y 24 de abril de 2026</span>
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
        }}
      >
        <LinkPreview
          isStatic={true}
          imageSrc="/Facultad_de_Ciencias(1).webp"
          url="https://share.google/mA4OiDb2h0jFh68JJ"
          className="hover:underline"
          style={{ color: "#26D968" }}
          width={200}
          height={150}
        >
          UNAM Facultad de Ciencias
        </LinkPreview>
      </div>

      {/* Eventos Anteriores Title */}
      <div 
        className="w-full mt-12 md:mt-16 lg:mt-20 px-4 md:px-0 flex items-center justify-center"
      >
        <h3
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-center text-white"
          style={{
            fontFamily: "'Red Hat Display', sans-serif",
            fontWeight: 700,
            letterSpacing: isMobile ? "0px" : "-1px",
          }}
        >
          Eventos Anteriores
        </h3>
      </div>

      {/* Galería Draggable Card */}
      <div className="w-full mt-12 md:mt-16 lg:mt-20">
        <DraggableCardGallery />
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
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-center text-white"
          style={{
            fontFamily: "'Red Hat Display', sans-serif",
            fontWeight: 700,
            letterSpacing: isMobile ? "0px" : "-1px",
          }}
        >
          Hackathon WeirdUI[1]
        </h3>
      </div>

      {/* Terminal con información sobre el Hackathon */}
      <div 
        className="w-full mt-12 md:mt-16 lg:mt-20 px-4 md:px-8 lg:px-16 min-h-96 md:max-w-6xl lg:max-w-7xl mx-auto"
      >
        <Terminal
          commands={[
            "hackathon --reto",
            "cat Primera_vez_Ciencias.txt",
            "echo interfaz-cava-restaurante",
            "status --proximi",
          ]}
          outputs={{
            0: [
              "¡PRIMERA VEZ EN LA FACULTAD DE CIENCIAS!",
              "En esta edición tendremos una primicia en la Facultad de Ciencias: su primer hackathon.",
            ],
            1: [
              "Mientras en los hackatones tradicionales se busca llegar a una solución de mercado general,",
              "el reto de este hackathon será más particular y orientado a la creatividad y aprendizaje",
              "de los equipos participantes.",
            ],
            2: [
              "Crear una interfaz para la gestión de una cava en un restaurante",
              "Particularidad: usar bibliotecas y lenguajes fuera de lo común",
              "Sin nada de diseño web tradicional",
            ],
            3: [
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

      {/* Patrocinadores Title */}
      <div 
        className="w-full mt-12 md:mt-16 lg:mt-20 px-4 md:px-0 flex items-center justify-center"
      >
        <h3
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-center text-white"
          style={{
            fontFamily: "'Red Hat Display', sans-serif",
            fontWeight: 700,
            letterSpacing: "-1px",
          }}
        >
          Patrocinadores
        </h3>
      </div>

      {/* Patrocinadores Grid */}
      <div className="w-full mt-8 px-4 md:px-0 flex justify-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-7xl">
          {[
            { id: 62, url: "https://aws.amazon.com/es/" },
            { id: 63, url: "https://www.chiiko.design/" },
            { id: 64, url: "https://github.com/" },
            { id: 65, url: "https://interledger.org/es" },
            { id: 66, url: "https://www.ketherlabs.com/" },
            { id: 67, url: "https://www.notion.com/es" },
            { id: 91, url: "https://zed.dev/" },
          ].map(({ id, url }) => (
            <a key={`sponsor-${id}`} href={url} target="_blank" rel="noopener noreferrer" className="w-full">
              <CometCard className="w-full h-full">
                <div className="p-6 rounded-xl h-40 flex items-center justify-center" style={{ backgroundColor: "#0E1115" }}>
                  <img
                    src={`/logos def/${id}.svg`}
                    alt={`Patrocinador ${id}`}
                    className="w-28 h-28 object-contain cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </div>
              </CometCard>
            </a>
          ))}
        </div>
      </div>

      {/* Comunidades Aliadas Title */}
      <div 
        className="w-full mt-12 md:mt-16 lg:mt-20 px-4 md:px-0 flex items-center justify-center"
      >
        <h3
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-center text-white"
          style={{
            fontFamily: "'Red Hat Display', sans-serif",
            fontWeight: 700,
            letterSpacing: "-1px",
          }}
        >
          Comunidades Aliadas
        </h3>
      </div>

      {/* Comunidades Aliadas Grid */}
      <div className="w-full mt-8 px-4 md:px-0 flex justify-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-7xl">
          {[
            { id: 68, url: "https://www.instagram.com/awsclub.ipn/" },
            { id: 69, url: "https://www.instagram.com/aws.ajolotes/" },
            { id: 70, url: "https://www.instagram.com/chidastech/" },
            { id: 71, url: "https://www.instagram.com/embajadorascloud/" },
            { id: 72, url: "https://www.meetup.com/es-es/fedora-mexico/" },
            { id: 73, url: "https://githubcampus.expert/" },
            { id: 74, url: "https://www.instagram.com/lidsol_fi/" },
            { id: 75, url: "https://www.instagram.com/lnxzpn/" },
            { id: 76, url: "https://www.instagram.com/nebursaturnacademy/" },
            { id: 77, url: "https://www.instagram.com/panteras.dev/" },
            { id: 78, url: "https://www.instagram.com/panteras.sec/" },
            { id: 79, url: "https://www.instagram.com/pythoncdmx/" },
            { id: 80, url: "https://rustmx.github.io/" },
            { id: 81, url: "https://www.instagram.com/techy_events_community/" },
            { id: 82, url: "https://www.instagram.com/technolatinas/" },
            { id: 83, url: "https://www.instagram.com/woman_diversity/" },
            { id: 84, url: "https://linktr.ee/0xCommunity?utm_source=linktree_profile_share&ltsid=de24dfa7-71e9-45b7-93bd-b716504a6fce" },
          ].map(({ id, url }) => (
            <a key={`allied-${id}`} href={url} target="_blank" rel="noopener noreferrer" className="w-full">
              <CometCard className="w-full h-full">
                <div className="p-6 rounded-xl h-40 flex items-center justify-center" style={{ backgroundColor: "#0E1115" }}>
                  <img
                    src={`/logos def/${id}.svg`}
                    alt={`Comunidad ${id}`}
                    className="w-28 h-28 object-contain cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </div>
              </CometCard>
            </a>
          ))}
        </div>
      </div>

      {/* Comunidades Organizadoras Title */}
      <div 
        className="w-full mt-12 md:mt-16 lg:mt-20 px-4 md:px-0 flex items-center justify-center"
      >
        <h3
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-center text-white"
          style={{
            fontFamily: "'Red Hat Display', sans-serif",
            fontWeight: 700,
            letterSpacing: "-1px",
          }}
        >
          Comunidades Organizadoras
        </h3>
      </div>

      {/* Comunidades Organizadoras Grid */}
      <div className="w-full mt-8 px-4 md:px-0 flex justify-center pb-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-7xl">
          {[
            { id: 85, url: "https://guayabadev.com/" },
            { id: 86, url: "https://www.instagram.com/ixalli_oficial/" },
            { id: 87, url: "https://www.instagram.com/hackersfightclub/" },
            { id: 88, url: "https://linktr.ee/Sudo_FCiencias" },
            { id: 89, url: "https://www.instagram.com/pumasmas.fcunam/" },
            { id: 90, url: "https://linktr.ee/aws_unam" },
          ].map(({ id, url }) => (
            <a key={`organizer-${id}`} href={url} target="_blank" rel="noopener noreferrer" className="w-full">
              <CometCard className="w-full h-full">
                <div className="p-6 rounded-xl h-40 flex items-center justify-center" style={{ backgroundColor: "#0E1115" }}>
                  <img
                    src={`/logos def/${id}.svg`}
                    alt={`Comunidad ${id}`}
                    className="w-28 h-28 object-contain cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </div>
              </CometCard>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
});

export default CanvasTextDemo;
