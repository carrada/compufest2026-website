"use client";

import React, { memo, useEffect, useRef } from "react";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import { triggerCountdownConfetti } from "@/lib/confetti";

interface CountdownTimerProps {
  className?: string;
  showTitle?: boolean;
}

const CountdownTimer = memo(function CountdownTimer({ className = "flip-clock-compufest", showTitle = true }: CountdownTimerProps) {
  // Fecha objetivo: 23 de abril de 2026 a las 9:30 AM
  const targetDate = new Date(2026, 3, 23, 9, 30, 0).getTime();
  const confettiTriggeredRef = useRef(false);

  useEffect(() => {
    const checkCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      // Si la diferencia es menor a 1 segundo y no se ha disparado confetti
      if (difference < 1000 && difference > -5000 && !confettiTriggeredRef.current) {
        confettiTriggeredRef.current = true;
        triggerCountdownConfetti();
      }

      // Reiniciar la bandera si el contador se reinicia
      if (difference > 5000) {
        confettiTriggeredRef.current = false;
      }
    };

    const interval = setInterval(checkCountdown, 100);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="w-full flex flex-col items-center gap-8 md:gap-12">
      {showTitle && (
        <h2
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-center text-white"
          style={{
            fontFamily: "'Red Hat Display', sans-serif",
            fontWeight: 700,
            letterSpacing: "-1px",
          }}
        >
          Tiempo Restante
        </h2>
      )}

      <style>{`
        .flip-clock-compufest {
          --fcc-flip-duration: 0.6s;
          --fcc-spacing: 20px;
          --fcc-digit-block-width: 110px;
          --fcc-digit-block-height: 130px;
          --fcc-digit-block-radius: 14px;
          --fcc-digit-block-spacing: 12px;
          --fcc-digit-font-size: 70px;
          --fcc-digit-color: #ffffff;
          --fcc-label-font-size: 15px;
          --fcc-label-color: #ffffff;
          --fcc-background: #1a1a1a;
          --fcc-divider-color: #ffffff;
          --fcc-divider-height: 3px;
          --fcc-separator-size: 12px;
          --fcc-separator-color: #ffffff;
        }

        .flip-clock-compufest .flip-clock__divider {
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.4), 
                      inset 0 -2px 4px rgba(0, 0, 0, 0.6);
          background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 50%, #ffffff 100%);
        }

        .flip-clock-compufest .flip-clock__card {
          border: 3px solid #ffffff;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5),
                      0 4px 12px rgba(255, 255, 255, 0.15),
                      inset 0 1px 0 rgba(255, 255, 255, 0.3);
          background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #0f0f0f 100%);
          position: relative;
          overflow: hidden;
        }

        .flip-clock-compufest .flip-clock__card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
        }

        .flip-clock-compufest .flip-clock__card::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(0, 0, 0, 0.5);
        }

        .flip-clock-compufest .flip-clock__card-digit {
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8),
                       0 0 20px rgba(255, 255, 255, 0.3);
          font-family: 'JetBrains Mono', 'Courier New', monospace;
          font-weight: bold;
          letter-spacing: 2px;
        }

        .flip-clock-compufest .flip-clock__card-bottom {
          background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
        }

        .flip-clock-compufest .flip-clock__card-top {
          background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
        }

        .flip-clock-compufest .flip-clock__label {
          font-weight: 600;
          letter-spacing: 1.5px;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
          margin-top: 12px;
        }

        .flip-clock-compufest .flip-clock__separator {
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
          font-weight: bold;
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .flip-clock-compufest {
            --fcc-digit-block-width: 95px;
            --fcc-digit-block-height: 115px;
            --fcc-digit-font-size: 58px;
            --fcc-label-font-size: 14px;
            --fcc-spacing: 16px;
          }
        }

        /* Tablet pequeño */
        @media (max-width: 768px) {
          .flip-clock-compufest {
            --fcc-digit-block-width: 80px;
            --fcc-digit-block-height: 100px;
            --fcc-digit-font-size: 48px;
            --fcc-label-font-size: 12px;
            --fcc-spacing: 12px;
          }
        }

        /* Phone landscape */
        @media (max-width: 640px) {
          .flip-clock-compufest {
            --fcc-digit-block-width: 65px;
            --fcc-digit-block-height: 80px;
            --fcc-digit-font-size: 38px;
            --fcc-label-font-size: 11px;
            --fcc-spacing: 10px;
            --fcc-digit-block-radius: 10px;
            --fcc-separator-size: 8px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
        }

        /* Phone pequeño */
        @media (max-width: 480px) {
          .flip-clock-compufest {
            --fcc-digit-block-width: 50px;
            --fcc-digit-block-height: 65px;
            --fcc-digit-font-size: 28px;
            --fcc-label-font-size: 9px;
            --fcc-spacing: 8px;
            --fcc-digit-block-radius: 8px;
            --fcc-separator-size: 6px;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
        }

        /* Phone muy pequeño */
        @media (max-width: 380px) {
          .flip-clock-compufest {
            --fcc-digit-block-width: 42px;
            --fcc-digit-block-height: 55px;
            --fcc-digit-font-size: 22px;
            --fcc-label-font-size: 8px;
            --fcc-spacing: 6px;
            --fcc-digit-block-spacing: 6px;
            --fcc-digit-block-radius: 6px;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>

      <FlipClockCountdown
        to={targetDate}
        labels={["DÍAS", "HORAS", "MINUTOS", "SEGUNDOS"]}
        className={className}
        duration={0.6}
      >
        <div
          style={{
            fontSize: "28px",
            color: "#ffffff",
            fontFamily: "'Red Hat Display', sans-serif",
            fontWeight: "bold",
            letterSpacing: "1px",
            textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
          }}
        >
          ¡El CompuFest ha llegado!
        </div>
      </FlipClockCountdown>
    </div>
  );
});

export default CountdownTimer;
