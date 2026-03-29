'use client';

import React, { useState, useEffect } from 'react';
import { triggerCelebrationConfetti } from '@/lib/confetti';

export default function ConfettiTestPage() {
  const [timeLeft, setTimeLeft] = useState(5);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          
          // Trigger confetti when countdown reaches 0
          if (newTime === 0) {
            triggerCelebrationConfetti();
            // Use a small timeout to avoid setState within effect warning
            Promise.resolve().then(() => setIsActive(false));
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleStart = () => {
    if (!isActive) {
      setIsActive(true);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(5);
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        backgroundColor: '#000',
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }}
    >
      <div className="flex flex-col items-center gap-12">
        {/* Title */}
        <h1
          className="text-4xl sm:text-6xl md:text-7xl font-bold text-center text-white"
          style={{
            fontFamily: "'Red Hat Display', sans-serif",
            fontWeight: 700,
            letterSpacing: '-1px',
          }}
        >
          Prueba de Confeti
        </h1>

        {/* Countdown Display */}
        <div
          className="text-8xl sm:text-9xl font-bold text-white"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            textShadow: '0 0 40px rgba(38, 217, 104, 0.5)',
            letterSpacing: '10px',
          }}
        >
          {timeLeft}
        </div>

        {/* Status Text */}
        <p
          className="text-2xl sm:text-3xl text-center"
          style={{
            fontFamily: "'Red Hat Display', sans-serif",
            color: isActive ? '#26D968' : '#ffffff',
          }}
        >
          {isActive ? 'Cuenta regresiva en progreso...' : 'Presiona iniciar para empezar'}
          {timeLeft === 0 && isActive === false && ' ¡CONFETI DISPUESTO!'}
        </p>

        {/* Controls */}
        <div className="flex gap-6 sm:gap-8">
          <button
            onClick={handleStart}
            disabled={isActive}
            className="px-8 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            style={{
              backgroundColor: isActive ? '#555' : '#26D968',
              color: '#000',
              fontFamily: "'Red Hat Display', sans-serif",
            }}
          >
            Iniciar
          </button>

          <button
            onClick={handleReset}
            className="px-8 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl font-bold rounded-xl transition-all hover:scale-105"
            style={{
              backgroundColor: '#ce4676',
              color: '#fff',
              fontFamily: "'Red Hat Display', sans-serif",
            }}
          >
            Reiniciar
          </button>
        </div>

        {/* Info Box */}
        <div
          className="mt-12 p-6 rounded-lg max-w-md text-center"
          style={{
            backgroundColor: 'rgba(38, 217, 104, 0.1)',
            border: '2px solid #26D968',
          }}
        >
          <p
            className="text-white text-sm"
            style={{ fontFamily: "'Red Hat Display', sans-serif" }}
          >
            El confeti se disparará cuando el contador llegue a 0. Usa el botón Reiniciar para volver a empezar.
          </p>
        </div>
      </div>
    </div>
  );
}
