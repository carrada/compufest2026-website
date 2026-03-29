'use client';

import React, { memo } from "react";
import Image from "next/image";
import CountdownTimer from "@/components/ui/CountdownTimer";

const CounterPage = memo(function CounterPage() {

  return (
    <div 
      className="flex flex-col min-h-screen items-center justify-center w-full px-4 py-8 sm:px-6 md:px-8 lg:py-12 gap-8 md:gap-12 relative"
      style={{
        backgroundColor: "#000",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        position: 'relative'
      }}
    >
      {/* Logo Section - Absolutely positioned and independent */}
      <div style={{
        position: 'absolute',
        top: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img
          src="/logo.svg"
          alt="CompuFest 2026"
          style={{
            width: '400px',
            height: 'auto',
            maxWidth: '90vw',
            opacity: 1
          }}
        />
      </div>

      {/* Contador Section - Independent and centered */}
      <div className="w-full flex flex-col items-center gap-6 md:gap-8">
        <style>{`
          .counter-page-countdown {
            --fcc-flip-duration: 0.6s;
            --fcc-spacing: 14px;
            --fcc-digit-block-width: 70px;
            --fcc-digit-block-height: 85px;
            --fcc-digit-block-radius: 10px;
            --fcc-digit-block-spacing: 8px;
            --fcc-digit-font-size: 45px;
            --fcc-label-font-size: 10px;
            --fcc-label-color: #ffffff;
            --fcc-background: #1a1a1a;
            --fcc-divider-color: #ffffff;
            --fcc-divider-height: 2px;
            --fcc-separator-size: 8px;
            --fcc-separator-color: #ffffff;
          }

          .counter-page-countdown .flip-clock__divider {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.4), 
                        inset 0 -2px 4px rgba(0, 0, 0, 0.6);
            background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 50%, #ffffff 100%);
          }

          .counter-page-countdown .flip-clock__card {
            border: 3px solid #ffffff;
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5),
                        0 4px 12px rgba(255, 255, 255, 0.15),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3);
            background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #0f0f0f 100%);
            position: relative;
            overflow: hidden;
          }

          .counter-page-countdown .flip-clock__card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
          }

          .counter-page-countdown .flip-clock__card::after {
            content: '';
            position: absolute;
            bottom: 2px;
            left: 0;
            right: 0;
            height: 1px;
            background: rgba(0, 0, 0, 0.5);
          }

          .counter-page-countdown .flip-clock__card-digit {
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8),
                         0 0 20px rgba(255, 255, 255, 0.3);
            font-family: 'JetBrains Mono', 'Courier New', monospace;
            font-weight: bold;
            letter-spacing: 2px;
          }

          .counter-page-countdown .flip-clock__card-bottom {
            background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
          }

          .counter-page-countdown .flip-clock__card-top {
            background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
          }

          .counter-page-countdown .flip-clock__label {
            font-weight: 600;
            letter-spacing: 1.5px;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
            margin-top: 14px;
          }

          .counter-page-countdown .flip-clock__separator {
            text-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
            font-weight: bold;
          }

          /* Tablet */
          @media (max-width: 1024px) {
            .counter-page-countdown {
              --fcc-digit-block-width: 65px;
              --fcc-digit-block-height: 80px;
              --fcc-digit-font-size: 40px;
              --fcc-label-font-size: 9px;
              --fcc-spacing: 12px;
            }
          }

          /* Tablet pequeño */
          @media (max-width: 768px) {
            .counter-page-countdown {
              --fcc-digit-block-width: 60px;
              --fcc-digit-block-height: 72px;
              --fcc-digit-font-size: 35px;
              --fcc-label-font-size: 8px;
              --fcc-spacing: 10px;
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
          }

          /* Phone landscape */
          @media (max-width: 640px) {
            .counter-page-countdown {
              --fcc-digit-block-width: 50px;
              --fcc-digit-block-height: 60px;
              --fcc-digit-font-size: 28px;
              --fcc-label-font-size: 7px;
              --fcc-spacing: 8px;
              --fcc-digit-block-radius: 8px;
              --fcc-separator-size: 6px;
              display: flex;
              flex-direction: column;
              gap: 6px;
            }
          }

          /* Phone pequeño */
          @media (max-width: 480px) {
            .counter-page-countdown {
              --fcc-digit-block-width: 42px;
              --fcc-digit-block-height: 50px;
              --fcc-digit-font-size: 24px;
              --fcc-label-font-size: 6px;
              --fcc-spacing: 6px;
              --fcc-digit-block-radius: 6px;
              --fcc-separator-size: 5px;
              display: flex;
              flex-direction: column;
              gap: 5px;
            }
          }

          /* Phone muy pequeño */
          @media (max-width: 380px) {
            .counter-page-countdown {
              --fcc-digit-block-width: 36px;
              --fcc-digit-block-height: 44px;
              --fcc-digit-font-size: 20px;
              --fcc-label-font-size: 5px;
              --fcc-spacing: 5px;
              --fcc-digit-block-spacing: 4px;
              --fcc-digit-block-radius: 5px;
              display: flex;
              flex-direction: column;
              gap: 4px;
            }
          }
        `}</style>

        <div className="w-full flex justify-center">
          <CountdownTimer className="counter-page-countdown" showTitle={false} />
        </div>
      </div>

      {/* Left hand SVG - Desktop only */}
      <div
        style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '380px',
          height: '380px',
          display: typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}
      >
        <Image
          src="/manoizquierda.svg"
          alt="Mano izquierda"
          width={380}
          height={380}
          unoptimized
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Right hand SVG - Desktop only */}
      <div
        style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '380px',
          height: '380px',
          display: typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}
      >
        <Image
          src="/manoderecha.svg"
          alt="Mano derecha"
          width={380}
          height={380}
          unoptimized
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Sponsors Section - Bottom aligned */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          width: '90%',
          maxWidth: '800px'
        }}
      >
        <Image
          src="/awslogowhite.svg"
          alt="AWS"
          width={110}
          height={110}
          unoptimized
        />
        <Image
          src="/githublogowhite.svg"
          alt="GitHub"
          width={110}
          height={110}
          unoptimized
        />
        <Image
          src="/interleadgersvg.svg"
          alt="InterLedger"
          width={110}
          height={110}
          unoptimized
        />
        <Image
          src="/chiikosvg.svg"
          alt="Chiiko"
          width={110}
          height={110}
          unoptimized
        />
        <Image
          src="/ketherlabssvg.svg"
          alt="Kether Labs"
          width={110}
          height={110}
          unoptimized
        />
        <Image
          src="/notionsvg.svg"
          alt="Notion"
          width={110}
          height={110}
          unoptimized
        />
      </div>
    </div>
  );
});

export default CounterPage;
