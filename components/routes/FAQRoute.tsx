'use client';

import { CSSProperties, useEffect, useState } from 'react';
import { COLORS, LAYOUT } from "@/lib/constants/theme";
import { FAQItem } from "@/components/ui/faq-item";

// Gallery gray color from comet cards
const CARD_GRAY = "#1F2121";
const FAQ_GREEN = COLORS.primary; // #26D968

// FAQ data structure - Single Responsibility: data management
const FAQ_DATA = [
  {
    question: "¿Cuando será el compufest[1]?",
    answer: "El evento será en dos partes. WeirdUI[1] (el hackathon) será del 20 al 22 de Abril mientras que las charlas y talleres serán el 23 y 24 de Abril de 2026.",
  },
  {
    question: "¿Donde será el compufest[1]?",
    answer: "El evento se celebrará en la Facultad de Ciencias, en Ciudad Universitaria, en la Ciudad de México. No te preocupes si no sabes llegar, te haremos llegar instrucciones al correo con el que te registres para que puedas ubicarte.",
  },
  {
    question: "¿Qué modalidad sera el hackathon?",
    answer: "El hackathon será completamente en línea, la premiación será presencial en la Facultad de Ciencias.",
  },
  {
    question: "¿Qué modalidad serán las charlas y talleres?",
    answer: "De momento, serán presenciales. Estamos trabajando para poder transmitir y grabar las conferencias y talleres. Nosotros les avisaremos sobre cualquier cambio.",
  },
  {
    question: "¿Tiene algún costo el compufest[1]?",
    answer: "El compufest[1] es un evento completamente gratuito.",
  },
  {
    question: "¿Puedo asistir/participar si soy de otra carrera/universidad/ciudad?",
    answer: "Por supuesto! Este es un evento por y para la comunidad. No nos importa ni nos fijamos en tu background escolar, profesional, o nada de eso. Si quieres aprender, eres más que bienvenidx!",
  },
  {
    question: "¿Puedo invitar a más gente a asistir?",
    answer: "Claro que si! Solo es necesario que cada quién tenga su registro.",
  },
  {
    question: "¿Cuales serán los horarios del evento?",
    answer: "Jueves 23 - 9:00 - 16:00 hrs (según el escenario). Viernes 24 - 9:00 - 14:30 hrs. Puedes llegar a la hora a la que tu gustes, solo ten en cuenta esas horas.",
  },
  {
    question: "¿Cómo me registro?",
    answer: "Despliegua el menú lateral en la página y haz click en \"Registro\". Eso te llevará a Luma, donde podrás obtener tu acceso general.",
  },
  {
    question: "¿Que incluye mi acceso general?",
    answer: "Acceso a charlas, talleres, merch, actividades y dinámicas durante el evento. Este acceso no garantiza tu entrada a WeirdUI[1].",
  },
  {
    question: "¿Cómo me registro a WeirdUI[1]?",
    answer: "Revisa la sección del hackathon haciendo click en el menú para ver toda la información de WeirdUI[1].",
  },
  {
    question: "¿Cúales son las reglas de WeirdUI[1]?",
    answer: "Revisa la sección del hackathon haciendo click en el menú para ver toda la información de WeirdUI[1].",
  },
  {
    question: "¿Habrá premios para los ganadores del hackathon?",
    answer: "Totalmente! Los premios serán publicados junto a las reglas de WeirdUI dentro de poco.",
  },
  {
    question: "¿Debo llevar algo el dia del evento?",
    answer: "Ganas de aprender, algo en que anotar, tu laptop (si asistes a los talleres), y tu botella de agua para poder llenar durante el evento.",
  },
  {
    question: "¿Cuál será la agenda del evento?",
    answer: "Revisa las secciones de \"Charlas\" y \"Talleres\" en el menú desplegable para concocer horarios, talleristas, speakers y escenarios donde se realizaran las actividades del compufest[1].",
  },
  {
    question: "¿Habra merch durante el evento?",
    answer: "Claro que si! Habrá merch y regalos sorpresa a lo largo del evento.",
  },
];

export function FAQRoute() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isClient) {
    return <section style={{ minHeight: LAYOUT.section.minHeight }} />;
  }

  const sectionStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    paddingTop: isMobile ? '8rem' : '6rem',
    paddingBottom: isMobile ? '2rem' : '3rem',
    paddingLeft: isMobile ? '1rem' : '1rem',
    paddingRight: isMobile ? '1rem' : '1rem',
    width: '100%',
    boxSizing: 'border-box',
  };

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(1.5rem, 4vw, 2rem)',
    maxWidth: isMobile ? '100%' : '56rem',
    width: '100%',
    margin: '0 auto',
    padding: isMobile ? '1.5rem 0' : '2rem 0',
    boxSizing: 'border-box',
  };

  const headerStyle: CSSProperties = {
    textAlign: 'center',
    marginBottom: isMobile ? '1rem' : '2rem',
  };

  const titleStyle: CSSProperties = {
    fontFamily: 'var(--font-red-hat-display), sans-serif',
    fontSize: 'clamp(2.25rem, 5vw, 8rem)',
    fontWeight: 700,
    marginBottom: 'clamp(0.5rem, 2vw, 1rem)',
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    color: FAQ_GREEN,
    lineHeight: '1.1',
    letterSpacing: '-1px',
  };

  const subtitleStyle: CSSProperties = {
    fontFamily: 'var(--font-jetbrains-mono), monospace',
    fontSize: isMobile ? 'clamp(0.875rem, 3vw, 1rem)' : '1rem',
    color: '#ffffff',
    lineHeight: '1.5rem',
    margin: 0,
    marginTop: '0.5rem',
  };

  const faqListStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '0.75rem' : '1rem',
    width: '100%',
  };

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>Preguntas y Respuestas</h1>
          <p style={subtitleStyle}>
            Respuestas a las dudas más comunes sobre compufest[1]
          </p>
        </div>

        {/* Info Box */}
        <div
          style={{
            borderRadius: '1.5rem',
            padding: isMobile ? '1rem' : '1.5rem',
            backgroundColor: CARD_GRAY,
            borderLeft: `4px solid ${FAQ_GREEN}`,
            marginBottom: isMobile ? '1rem' : '2rem',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: isMobile ? '0.8rem' : '0.875rem',
              lineHeight: '1.4rem',
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              color: FAQ_GREEN,
            }}
          >
            <strong>¿No encuentras tu pregunta?</strong> Contacta a los organizadores
            en nuestras redes sociales o envía un email a sudofciencias@gmail.com
          </p>
        </div>

        {/* FAQ Items - Surface component variant */}
        <div style={faqListStyle}>
          {FAQ_DATA.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              cardColor={CARD_GRAY}
              textColor={FAQ_GREEN}
              isOpen={expandedIndex === index}
              onToggle={(isOpen) => setExpandedIndex(isOpen ? index : null)}
            />
          ))}
        </div>

        {/* Footer Note */}
        <div
          style={{
            textAlign: 'center',
            marginTop: isMobile ? '1.5rem' : '2rem',
            width: '100%',
          }}
        >
          <p
            style={{
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              color: '#ffffff',
              opacity: 0.7,
              margin: 0,
              fontFamily: 'var(--font-jetbrains-mono), monospace',
            }}
          >
            Ultima Actualización 4 de Abril de 2026
          </p>
        </div>
      </div>
    </section>
  );
}
