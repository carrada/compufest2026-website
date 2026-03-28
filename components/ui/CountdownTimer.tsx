"use client";

import React, { useEffect, useState, memo } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = memo(function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Fecha objetivo: 23 de abril de 2026 a las 9:30 AM
      const targetDate = new Date(2026, 3, 23, 9, 30, 0).getTime(); // Mes es 0-indexed, así que abril es 3
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const CountdownBox = ({
    value,
    label,
  }: {
    value: number;
    label: string;
  }) => (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 flex items-center justify-center rounded-lg font-mono font-bold border-2"
        style={{
          borderColor: "#26d968",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "#26d968",
          fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
          fontFamily: "'Courier New', monospace",
          textShadow: "0 0 10px rgba(38, 217, 104, 0.6)",
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <span
        className="text-xs sm:text-sm md:text-base font-mono font-bold uppercase"
        style={{
          color: "#26d968",
          fontFamily: "'Courier New', monospace",
          letterSpacing: "2px",
        }}
      >
        {label}
      </span>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center gap-8 md:gap-12">
      {/* Título */}
      <h2
        className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-center text-white"
        style={{
          fontFamily: "'Red Hat Display', sans-serif",
          fontWeight: 700,
          letterSpacing: "-1px",
        }}
      >
        Días Restantes para el Compufest[1]
      </h2>

      {/* Terminal wrapper */}
      <div
        className="w-full max-w-4xl p-6 md:p-8 lg:p-10 rounded-lg border-2"
        style={{
          borderColor: "#26d968",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          boxShadow: "0 0 20px rgba(38, 217, 104, 0.3), inset 0 0 20px rgba(38, 217, 104, 0.05)",
        }}
      >
        {/* Terminal header */}
        <div
          className="pb-4 mb-6 border-b-2"
          style={{
            borderColor: "#26d968",
            paddingBottom: "1rem"
          }}
        >
          <span
            className="text-sm font-mono"
            style={{
              color: "#26d968",
              fontFamily: "'Courier New', monospace",
            }}
          >
            $ compufest --countdown
          </span>
        </div>

        {/* Contador */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          <CountdownBox value={timeLeft.days} label="Días" />
          <CountdownBox value={timeLeft.hours} label="Horas" />
          <CountdownBox value={timeLeft.minutes} label="Minutos" />
          <CountdownBox value={timeLeft.seconds} label="Segundos" />
        </div>
      </div>

      {/* Texto decorativo */}
      <p
        className="text-center text-sm md:text-base font-mono"
        style={{
          color: "#26d968",
          fontFamily: "'Courier New', monospace",
          textShadow: "0 0 10px rgba(38, 217, 104, 0.4)",
        }}
      >
        Facultad de Ciencias, UNAM • 23 y 24 de abril de 2026
      </p>
    </div>
  );
});

export default CountdownTimer;
