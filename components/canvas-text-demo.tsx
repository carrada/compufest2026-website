'use client';

import { cn } from "@/lib/utils";
import { CanvasText } from "@/components/ui/canvas-text";
import { useEffect, useState, memo } from "react";
import dynamic from "next/dynamic";
import { masonryItems } from "./masonry-data";
import Terminal from "@/components/ui/Terminal";
import CountdownTimer from "@/components/ui/CountdownTimer";

const Masonry = dynamic(() => import("./Masonry.tsx"), {
  loading: () => <div style={{ minHeight: "600px", backgroundColor: "#0a0a0a", borderRadius: "12px" }} />,
  ssr: false
});

// Lazy load LinkPreview component
const LinkPreview = dynamic(() => import("@/components/ui/link-preview").then(mod => ({ default: mod.LinkPreview })), {
  loading: () => <span className="underline cursor-pointer">loading...</span>,
  ssr: true
});

const CanvasTextDemo = memo(function CanvasTextDemo() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
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
        <LinkPreview
          url="https://www.unam.mx"
          className="font-bold"
          imageSrc="/unam(1).webp"
          isStatic={true}
          style={{ color: "#D59F0F" }}
        >
          UNAM
        </LinkPreview>
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
        }}
      >
        <LinkPreview
          url="https://www.fciencias.unam.mx"
          className="font-bold"
          imageSrc="/Facultad_de_Ciencias(1).webp"
          isStatic={true}
          style={{ color: "#063C61" }}
        >
          UNAM Facultad de Ciencias
        </LinkPreview>
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

      {/* Fondo grid debajo del Terminal */}
      <div 
        className="w-full mt-0 -mx-4 px-4"
        style={{
          backgroundColor: "#000",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          minHeight: "400px",
          marginTop: "-1px"
        }}
      />
    </div>
  );
});

export default CanvasTextDemo;
