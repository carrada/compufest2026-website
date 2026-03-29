'use client';

import confetti from 'canvas-confetti';

export function triggerConfetti() {
  if (typeof window !== 'undefined') {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#26D968', '#ffffff', '#ce4676', '#00FF7E', '#0D6F5E']
    });
  }
}

export function triggerCelebrationConfetti() {
  if (typeof window !== 'undefined') {
    // Primera ráfaga
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#26D968', '#ffffff', '#ce4676']
    });
    
    // Segunda ráfaga después de 300ms
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { x: 0.1, y: 0.5 },
        colors: ['#00FF7E', '#0D6F5E', '#26D968']
      });
    }, 300);
    
    // Tercera ráfaga desde la derecha
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { x: 0.9, y: 0.5 },
        colors: ['#ffffff', '#ce4676', '#00FF7E']
      });
    }, 600);
  }
}

export function triggerCountdownConfetti() {
  if (typeof window !== 'undefined') {
    // Primera ráfaga - verde y blanco
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#26D968', '#ffffff']
    });
    
    // Segunda ráfaga después de 300ms
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { x: 0.1, y: 0.5 },
        colors: ['#26D968', '#ffffff']
      });
    }, 300);
    
    // Tercera ráfaga desde la derecha
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { x: 0.9, y: 0.5 },
        colors: ['#ffffff', '#26D968']
      });
    }, 600);
  }
}
