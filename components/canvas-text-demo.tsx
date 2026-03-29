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
        className="w-full mt-12 md:mt-16 lg:mt-20 px-4 md:px-0 flex items-center justify-center overflow-hidden"
      >
        <h3
          className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-center text-white whitespace-nowrap"
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

      {/* Patrocinadores Stickers Grid */}
      <div className="w-full mt-4 md:mt-1 px-4 md:px-0 flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-4 md:gap-0" style={{ maxWidth: "900px", rowGap: "-20px" }}>
          {/* AWS Sticker */}
          <a
            href="https://aws.amazon.com/es/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center p-2 hover:scale-110 transition-transform duration-300 cursor-pointer"
          >
            <Image
              src="/awssticker.svg"
              alt="AWS"
              width={280}
              height={280}
              unoptimized
            />
          </a>

          {/* Chiikö Sticker */}
          <a
            href="https://www.chiiko.design"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center p-2 hover:scale-110 transition-transform duration-300 cursor-pointer"
          >
            <Image
              src="/chiikostickerlogo.svg"
              alt="Chiikö"
              width={280}
              height={280}
              unoptimized
            />
          </a>

          {/* GitHub Sticker */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center p-2 hover:scale-110 transition-transform duration-300 cursor-pointer"
          >
            <Image
              src="/githubsticker.svg"
              alt="GitHub"
              width={280}
              height={280}
              unoptimized
            />
          </a>

          {/* Interledger Sticker */}
          <a
            href="https://interledger.org/es"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center p-2 hover:scale-110 transition-transform duration-300 cursor-pointer"
          >
            <Image
              src="/inteleadgerlogosvg.svg"
              alt="Interledger Foundation"
              width={280}
              height={280}
              unoptimized
            />
          </a>

          {/* Ketherlabs Sticker */}
          <a
            href="https://www.ketherlabs.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center p-2 hover:scale-110 transition-transform duration-300 cursor-pointer"
          >
            <Image
              src="/ketherlabslogosticker.svg"
              alt="Ketherlabs"
              width={280}
              height={280}
              unoptimized
            />
          </a>

          {/* Notion Sticker */}
          <a
            href="https://www.notion.com/es"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center p-2 hover:scale-110 transition-transform duration-300 cursor-pointer"
          >
            <Image
              src="/notionlogosvgsticker.svg"
              alt="Notion"
              width={280}
              height={280}
              unoptimized
            />
          </a>
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

      {/* Comunidades Aliadas Stickers Grid */}
      <div className="w-full mt-4 md:mt-1 px-4 md:px-0 flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-4 md:gap-0" style={{ maxWidth: "900px", rowGap: "-20px" }}>
          {[
            { num: 67, url: "https://www.instagram.com/awsclub.ipn/" },
            { num: 68, url: "https://www.instagram.com/aws.ajolotes/" },
            { num: 69, url: "https://www.instagram.com/chidastech/" },
            { num: 70, url: "https://www.instagram.com/embajadorascloud/" },
            { num: 71, url: "https://www.meetup.com/es-es/fedora-mexico/" },
            { num: 72, url: "https://githubcampus.expert/" },
            { num: 73, url: "https://www.instagram.com/lidsol_fi/" },
            { num: 74, url: "https://www.instagram.com/lnxzpn/" },
            { num: 75, url: "https://www.instagram.com/mobiledevelopercommunity/" },
            { num: 76, url: "https://www.instagram.com/nebursaturnacademy/" },
            { num: 77, url: "https://www.instagram.com/panteras.dev/" },
            { num: 78, url: "https://www.instagram.com/panteras.sec/" },
            { num: 79, url: "https://www.instagram.com/pythoncdmx/" },
            { num: 80, url: "https://rustmx.github.io/" },
            { num: 81, url: "https://www.instagram.com/techy_events_community/" },
            { num: 82, url: "https://www.instagram.com/technolatinas/" },
            { num: 83, url: "https://www.instagram.com/woman_diversity/" },
          ].map(({ num, url }) => (
            <a
              key={`community-${num}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center p-2 hover:scale-110 transition-transform duration-300 cursor-pointer"
            >
              <Image
                src={`/${num}.svg`}
                alt={`Community ${num}`}
                width={350}
                height={350}
                unoptimized
              />
            </a>
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

      {/* Comunidades Organizadoras Stickers Grid */}
      <div className="w-full mt-4 md:mt-1 px-4 md:px-0 flex justify-center pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-4 md:gap-0" style={{ maxWidth: "900px", rowGap: "-20px" }}>
          {[
            { num: 84, url: "https://guayabadev.com/" },
            { num: 85, url: "https://www.instagram.com/ixalli_oficial/" },
            { num: 86, url: "https://www.instagram.com/hackersfightclub/" },
            { num: 87, url: "https://linktr.ee/Sudo_FCiencias" },
            { num: 88, url: "https://www.instagram.com/pumasmas.fcunam/" },
            { num: 89, url: "https://linktr.ee/aws_unam" },
          ].map(({ num, url }) => (
            <a
              key={`organizer-${num}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center p-2 hover:scale-110 transition-transform duration-300 cursor-pointer"
            >
              <Image
                src={`/${num}.svg`}
                alt={`Organizadora ${num}`}
                width={350}
                height={350}
                unoptimized
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
});

export default CanvasTextDemo;
