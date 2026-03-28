'use client';

import { cn } from "@/lib/utils";
import { CanvasText } from "@/components/ui/canvas-text";
import { useEffect, useState, memo } from "react";
import Masonry from "./Masonry.tsx";
import { masonryItems } from "./masonry-data";

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
        en la UNAM
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
      <p 
        className={cn(
          "text-center font-bold text-neutral-300",
          "text-xl leading-snug sm:text-2xl sm:leading-relaxed md:text-3xl md:leading-relaxed lg:text-4xl lg:leading-relaxed xl:text-5xl xl:leading-relaxed"
        )}
        style={{
          fontFamily: "'Red Hat Display', sans-serif",
        }}
      >
        UNAM Facultad de Ciencias
      </p>

      {/* Galería Masonry */}
      <div 
        className="w-full mt-12 md:mt-16 lg:mt-20"
        style={{
          background: "radial-gradient(circle at 20% 50%, rgba(38, 217, 104, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(138, 43, 226, 0.05) 0%, transparent 50%), #0a0a0a",
          padding: "20px",
          borderRadius: "12px",
          height: "100%",
          minHeight: "900px",
          display: "block"
        }}
      >
        <Masonry items={masonryItems} />
      </div>
    </div>
  );
});

export default CanvasTextDemo;
