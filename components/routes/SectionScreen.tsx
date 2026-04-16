/**
 * SectionScreen Component - Single Responsibility
 * Solo responsable de renderizar pantallas de sección
 */

'use client';

import { CSSProperties, useEffect, useState } from 'react';
import Image from 'next/image';
import { COLORS, TYPOGRAPHY, LAYOUT } from "@/lib/constants/theme";
import dynamic from 'next/dynamic';
import { Terminal } from "@/components/ui/terminal";
import { GalleryDemo } from "@/components/GalleryDemo";
import { LinkPreview } from "@/components/ui/link-preview";
import { CometCard } from "@/components/ui/comet-card";
import PixelTransition from "@/components/ui/PixelTransition";

// Dynamic import with ssr: false for component that accesses document/window
const ASCIIText = dynamic(
  () => import("@/components/ui/ASCIIText"),
  { ssr: false, loading: () => <div style={{ minHeight: '200px' }} /> }
);

const CounterPage = dynamic(
  () => import("@/app/dev/CounterPage"),
  { ssr: false, loading: () => <div style={{ minHeight: '100vh' }} /> }
);

interface SectionScreenProps {
  title: string;
  subtitle: string;
}

export function SectionScreen({ title, subtitle }: SectionScreenProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [selectedDay, setSelectedDay] = useState("20 Abril");

  const agendaData = {
    "20-Online": [
      { time: "11:30 - 13:00", title: "Product Lifecycle con IA: Construye y lanza tu primer MVP, app o landing page", speaker: "Karen Valle", org: "KETHERLABS" },
      { time: "13:00 - 14:30", title: "Fundamentos de programación de sistemas con Rust", speaker: "Gustavo de la Cruz", org: "RustMX" },
    ],
    "21-Online": [
      { time: "12:00 - 13:30", title: "Python y el Diseño de Interfaces Gráficas Modernas", speaker: "Arato Aragón", org: null },
    ],
    "22-Online": [
      { time: "8:00 - 8:30", title: "Introducción a Open Payments con Interledger", speaker: "Marian Villa", org: "Interledger Foundation" },
      { time: "15:00 - 16:00", title: "De lo técnico al escenario: aprende a pichar como ganador", speaker: "Fernanda Osorio", org: "Ixalli" },
    ],
    "23-E1": [
      { time: "9:00 - 9:30", title: "Registro y Bienvenida", speaker: null, org: null },
      { time: "9:30 - 10:10", title: "De la curiosidad al código", speaker: "Luisa Jaimes", org: "Women Tech Makers" },
      { time: "10:10 - 10:50", title: "Querida, encogí el clúster", speaker: "Alex Callejas", org: "Fedora México" },
      { time: "10:50 - 11:30", title: "Principos fundamentales: La cultura del testing", speaker: "Erick Islas", org: "PythonCDMX" },
      { time: "11:30 - 12:10", title: "¿Cuánto puedo optimizar? De cotas teóricas a decisiones de ingeniería", speaker: "Karla Vargas", org: null },
      { time: "12:10 - 12:20", title: "Conociendo Interledger", speaker: "Jessica Thurlbourn", org: "Interledger Foundation" },
      { time: "12:20 - 13:00", title: "IA aplicada al mundo real: De la teoría de agentes a migrar una farmacéutica", speaker: "Hugo Ramirez", org: "PythonCDMX" },
      { time: "13:00 - 13:10", title: "Lightning Talk", speaker: null, org: "DGTIC" },
      { time: "13:10 - 13:50", title: "Cosas sobre el mundo laboral que no nos dicen en la escuela", speaker: "Andrés Hernández", org: "LIDSOL" },
      { time: "13:50 - 14:30", title: "Domina tu próxima entrevista técnica: lo que nadie te dice (y si importa)", speaker: "Manuel Alcántara", org: null },
    ],
    "23-E2": [
      { time: "10:00 - 11:00", title: "¿Cómo empezar en la nube?", speaker: "David Sol", org: "AWS UG Ajolotes en la Nube" },
      { time: "11:00 - 12:00", title: "El Umbral de los Autómatas Pensantes: Iniciación a los Laberintos de LangChain, LangGraph y DeepAgents", speaker: "Iván Castañeda", org: "PythonCDMX" },
      { time: "12:00 - 13:00", title: "Desarrolla tu primera pipeline de ML en producción", speaker: "Yhary Arias", org: null },
      { time: "13:00 - 14:00", title: "Tu primer agente de IA en 45 minutos (sin saber de IA)", speaker: "Brenda Bravo", org: null },
      { time: "14:00 - 15:00", title: "De Bare-Metal a Cloud Native: Arquitectura híbrida con KVM, libvirt y K3s", speaker: "Julio Vázquez", org: "Sudo FCiencias" },
      { time: "15:00 - 16:00", title: "¡Deja de usar notebooks! Prepara tus modelos para funcionar en el mundo real", speaker: "Carlos Sánchez", org: null },
    ],
    "23-E3": [
      { time: "10:00 - 10:40", title: "Desarrollando apps robustas con AWS", speaker: "John Kleinad", org: "AWS Cloud Club UNAM" },
      { time: "10:40 - 11:20", title: "De usuario a dueño: cómo tener control sobre tus servicios digitales y divertirte en el proceso", speaker: "Diego Bravo", org: null },
      { time: "11:20 - 12:00", title: "Open Source en el Monitoreo", speaker: "Victor Ledesma", org: "Axopunk" },
      { time: "12:00 - 12:40", title: "De la teoría a la blockchain: construyendo sobre Stellar", speaker: "Fernanda Tello + Gerardo Vela", org: "CriptoUNAM" },
      { time: "12:40 - 13:20", title: "¿La nube está matando al Hardware?", speaker: "Alexa Joaquin", org: "AWS Cloud Club IPN" },
      { time: "13:20 - 14:00", title: "Cualquier videojuego es un Rubik", speaker: "Gadiel Guillen", org: "Godot Engine" },
    ],
    "24-E1": [
      { time: "9:00 - 9:30", title: "Registro y Bienvenida", speaker: null, org: null },
      { time: "9:30 - 10:10", title: "Anatomía de un ataque en memoria", speaker: "Lilith Diaz", org: null },
      { time: "10:10 - 10:50", title: "Nube & Proyectos OSS", speaker: "Manuel Ortiz", org: "GitTogether CDMX" },
      { time: "10:50 - 11:30", title: "Software Libre como Trampolín: de LIDSOL a GSoC a Internship", speaker: "Enrique Calderon", org: "LIDSOL" },
      { time: "11:30 - 12:10", title: "Despierta tu ímpetu empresarial", speaker: "Emmanuel Zamora", org: "e-Study" },
      { time: "12:10 - 12:50", title: "No te van a contratar por saber AI: te van a contratar por lo que construyas con ella", speaker: "Ana Cifuentes", org: "Women Diversity + Chidas Tech" },
      { time: "12:50 - 13:10", title: "Pitches Finalistas WeirdUI[1]", speaker: null, org: null },
      { time: "13:10 - 13:50", title: "Intro a Spec Driven Development con Kiro", speaker: "Alex Espinosa + Ramses Mata", org: "AWS" },
      { time: "13:50 - 14:20", title: "Resultados y Premiación WeirdUI[1]", speaker: null, org: null },
      { time: "14:20 - 14:20", title: "Despedida", speaker: null, org: null },
    ],
    "24-E2": [
      { time: "10:00 - 11:00", title: "Over-Engineering: Cómo quemar crédito de AWS para validar tu comida", speaker: "Josafat Jimenez", org: "Guayaba Devs" },
      { time: "11:00 - 12:00", title: "Análisis de vulnerabilidad a una cámara WiFi", speaker: "Jesus Barajas", org: null },
      { time: "12:00 - 13:00", title: "Mapeo colaborativo de transporte público con herramientas libres", speaker: "Oscar Hernández", org: "Codeando México" },
    ],
  };

  const ponentes = [
    { name: "Karen Valle", talk: "Product Lifecycle con IA: Construye y lanza tu primer MVP, app o landing page", date: "20 Abril", stage: "En Línea", photo: "/fotosponentes/karenvalle.jpeg", gender: "f", semblanzaPersonal: "MBA, fundadora KETHERLABS (automatización contable con IA). Certificaciones MIT.", semblanzaCharla: "Sesión diseñada para guiar a los participantes desde una idea inicial hasta un prototipo funcional, utilizando herramientas de IA y diseño de vanguardia. Cubriremos estrategia de producto, diseño de interfaz inteligente y desarrollo express, resultando en un flujo de trabajo replicable que reduce drásticamente tiempos y costos." },
    { name: "Gustavo de la Cruz", talk: "Fundamentos de programación de sistemas con Rust", date: "20 Abril", stage: "En Línea", photo: "/fotosponentes/gustavodelacruz.jpeg", gender: "m", semblanzaPersonal: "Arquitecto empresarial con 20+ años. Consultor senior AWS. PMP, AWS, TOGAF, ITIL.", semblanzaCharla: "Temas de transformación organizacional, inteligencia artificial y futuro del trabajo, donde combina experiencia práctica con reflexión estratégica. Facilitador certificado en metodologías de innovación como Lego Serious Play." },
    { name: "Arato Aragón", talk: "Python y el Diseño de Interfaces Gráficas Modernas", date: "21 Abril", stage: "En Línea", photo: null, gender: "m" },
    { name: "Marian Villa", talk: "Introducción a Open Payments con Interledger", date: "22 Abril", stage: "En Línea", photo: "/fotosponentes/marianvilla.jpeg", gender: "f", semblanzaPersonal: "Full-stack developer, Google Developer Expert. Cofounder @pionerasdev. IBM Open Source Award 2020.", semblanzaCharla: "Exploración del funcionamiento de proyectos de Open Source Software dentro del ecosistema tecnológico y el impacto global que pueden alcanzar. Se explicará el alcance en cloud computing e innovación, y formas prácticas para comenzar a contribuir." },
    { name: "Fernanda Osorio", talk: "De lo técnico al escenario: aprende a pichar como ganador", date: "22 Abril", stage: "En Línea", photo: "/fotosponentes/ferosorio.jpeg", gender: "f", semblanzaPersonal: "Estudiante CS UNAM, co-fundadora Mexiverse Hub (Web3). Organizadora Doors.OP.", semblanzaCharla: "Aprende a presentar tus ideas y proyectos técnicos de manera convincente en el escenario. De lo técnico al escenario: técnicas, storytelling y confianza para pichar como ganador en hackathones y presentaciones profesionales." },
    { name: "Luisa Jaimes", talk: "De la curiosidad al código", date: "23 Abril", stage: "Escenario #1", photo: "/fotosponentes/FotoLuisaJaimes.jpg", gender: "f", semblanzaPersonal: "Senior Data Engineer, Maestría CS. Lidera ingeniería en Nyvia. Fundadora Talys, Women Techmakers.", semblanzaCharla: "Cómo pasar de la curiosidad por la tecnología a construir una carrera sólida en inteligencia artificial dentro del mundo corporativo. A través de su experiencia, habla sobre cómo crecer rápidamente, tomar decisiones estratégicas y desarrollar habilidades clave no enseñadas en escuela." },
    { name: "Alex Callejas", talk: "Querida, encogí el clúster", date: "23 Abril", stage: "Escenario #1", photo: "/fotosponentes/alexcallejas.jpeg", gender: "m", semblanzaPersonal: "Content Architect en Red Hat, miembro del Proyecto Fedora con 25+ años en Unix/Linux. Autor certificado en administración Fedora. Experto en Ansible y SELinux, diseña laboratorios para certificaciones Red Hat.", semblanzaCharla: "Una travesía técnica sobre reducir Kubernetes con MicroShift. Ejecutar orquestación en 2GB de RAM con RHEL 10 sobre RHEL 9. Automación con Ansible confirmando miniaturización del clúster en Edge Computing." },
    { name: "Erick Islas", talk: "Principos fundamentales: La cultura del testing", date: "23 Abril", stage: "Escenario #1", photo: "/fotosponentes/erickislas.jpeg", gender: "m", semblanzaPersonal: "Fullstack SDE Netflix. Pythonist 2013+, Java, TypeScript. Experiencia: finanzas, retail.", semblanzaCharla: "Principios fundamentales de la cultura del testing. Cómo seguir core principles de simplicity, scalability y maintainability para construir software de calidad. Un enfoque práctico a testing y code craftsmanship." },
    { name: "Karla Vargas", talk: "¿Cuánto puedo optimizar? De cotas teóricas a decisiones de ingeniería", date: "23 Abril", stage: "Escenario #1", photo: "/fotosponentes/karlavargas.jpg", gender: "f", semblanzaPersonal: "Doctora IIMAS-UNAM. Especialista sistemas distribuidos. SDE II AWS, ex-Lyft.", semblanzaCharla: "La complejidad de los algoritmos nos da una cota teórica pero en la vida real ¿Realmente el algoritmo con mejor cota superior es el mejor? Muestra ejemplos de cómo no necesariamente es el caso, incluyendo el diseño de algoritmos pensando en la cota inferior." },
    { name: "Jessica Thurlbourn", talk: "Conociendo Interledger", date: "23 Abril", stage: "Escenario #1", photo: "/fotosponentes/jessicathurlborn.jpeg", gender: "f", semblanzaPersonal: "Marketing & Communications Director, Interledger. 10+ años nonprofits tech. CDMX.", semblanzaCharla: "Exploración de Interledger, protocolos abiertos e interoperables para pagos digitales. Cómo la tecnología abierta y la infraestructura inclusiva pueden crear valor público duradero a escala. Traducción de iniciativas complejas en historias claras y creíbles." },
    { name: "Hugo Ramirez", talk: "IA aplicada al mundo real: De la teoría de agentes a migrar una farmacéutica", date: "23 Abril", stage: "Escenario #1", photo: "/fotosponentes/hugoramirez.JPG", gender: "m", semblanzaPersonal: "Físico e informático. Tech desde 2013 Venezuela. Especialista deuda técnica.", semblanzaCharla: "¿Qué pasa cuando una farmacéutica tiene miles de reportes en SQL Server y necesita migrarlos a una plataforma moderna? Comparte experiencia construyendo un motor de migración impulsado por agentes de IA (LangChain, MCP, Claude) que aceleró 3x el proceso. Verá arquitectura real, lecciones y demo en vivo." },
    { name: "Andrés Hernández", talk: "Cosas sobre el mundo laboral que no nos dicen en la escuela", date: "23 Abril", stage: "Escenario #1", photo: "/fotosponentes/Andres_Hernandez-square.jpg", gender: "m", semblanzaPersonal: "Ingeniero UNAM. Seguridad, networking, servidores. Instructor UNAM-CERT. Cursos Kubernetes.", semblanzaCharla: "Temas sobre el mundo laboral que muchas veces no queremos hablar: modalidades de contratación (nómina, esquema mixto, honorarios), cuestiones de pago, tarjetas bancarias, impuestos, entrevistas. Contenido derivado de experiencia personal para reflexionar sobre cambios laborales y decisiones profesionales." },
    { name: "Manuel Alcántara", talk: "Domina tu próxima entrevista técnica: lo que nadie te dice (y si importa)", date: "23 Abril", stage: "Escenario #1", photo: "/fotosponentes/ManuelAlcantara.png", gender: "m", semblanzaPersonal: "Doctorado IIMAS. Profesor 13+ años. Coach ICPC finales. SDE Zillow.", semblanzaCharla: "Las entrevistas técnicas desmistiticadas desde el primer contacto con reclutadores hasta la entrevista en sí. A través de ejemplos reales, analízaremos qué buscan los entrevistadores, errores comunes y cómo destacar. Herramientas concretas y mayor claridad del proceso para enfrentar tu próxima entrevista con ventaja." },
    { name: "David Sol", talk: "¿Cómo empezar en la nube?", date: "23 Abril", stage: "Escenario #2", photo: "/fotosponentes/DavidSolYouSquare1000 Clean.jpg", gender: "m", semblanzaPersonal: "Cloud Architect en Caylent. Fundador 'Ajolotes en la Nube' y PythonCDMX. AWS Community Builder.", semblanzaCharla: "La nube es pieza clave de tecnologías de información. ¿Cómo empezar? ¿Cuáles son los mejores recursos? Hay excelentes recursos gratuitos para aprender teoría y práctica, así como comunidades como AWS Cloud Club Ciencias. Hablamos sobre qué es la nube, cómo se usa y cómo aprender." },
    { name: "Iván Castañeda", talk: "El Umbral de los Autómatas Pensantes: Iniciación a los Laberintos de LangChain, LangGraph y DeepAgents", date: "23 Abril", stage: "Escenario #2", photo: "/fotosponentes/ivancastañeda.png", gender: "m", semblanzaPersonal: "BackEnd Developer Python, 15 años. Embajador Notion, AWS Community Builder. Content creator.", semblanzaCharla: "Exploración del fascinante mundo de los agentes de IA usando frameworks y herramientas modernas. Desde conceptos fundamentales hasta arquitecturas complejas con LangChain y GraphQL. Un viaje por la mente de un pensador que cree que el verdadero poder no está en las máquinas, sino en quienes las hacen pensar." },
    { name: "Yhary Arias", talk: "Desarrolla tu primera pipeline de ML en producción", date: "23 Abril", stage: "Escenario #2", photo: "/fotosponentes/yharyarias.JPG", gender: "f", semblanzaPersonal: "ML Engineer especialista en producción. Google Cloud. Mentora LATAM.", semblanzaCharla: "Entrenar un modelo es fácil. Hacer que funcione en producción, no tanto. Toma ese modelo que 'funciona perfecto en el notebook' y enféntalo al mundo real: datos incompletos, pipelines rotos, features inconsistentes. Construiremos un flujo completo de ML desde preparación hasta monitoring usando Google Cloud." },
    { name: "Brenda Bravo", talk: "Tu primer agente de IA en 45 minutos (sin saber de IA)", date: "23 Abril", stage: "Escenario #2", photo: "/fotosponentes/foto_perfil_brendabravo.png", gender: "f", semblanzaPersonal: "Ingeniera UNAM, consultora integración empresarial. IBM, Banorte, Actinver. Creadora Inge.Brendy.", semblanzaCharla: "¿Alguna vez quisiste construir algo con IA pero sentiste que necesitabas un doctorado para empezar? En 45 minutos de contenido hands-on, construiremos un agente de IA funcional desde cero. Comprenderás qué es un agente, cómo piensa y tendrás herramientas para seguir explorando por tu cuenta." },
    { name: "Julio Vázquez", talk: "De Bare-Metal a Cloud Native: Arquitectura híbrida con KVM, libvirt y K3s", date: "23 Abril", stage: "Escenario #2", photo: "/fotosponentes/juliovazquez.jpeg", gender: "m", semblanzaPersonal: "SDE McDonald's, GCP Associate Cloud Engineer. Defensor FLOSS.", semblanzaCharla: "Cómo transformar infraestructura en un clúster de Kubernetes y virtualizar entornos con KVM y libvirt. Un enfoque que permite aprovechar ventajas de virtualización y orquestación. Incluso levantaremos un servidor de Minecraft en K3s para experimentar en un entorno bare-metal fácilmente replicable en Cloud." },
    { name: "Carlos Sánchez", talk: "¡Deja de usar notebooks! Prepara tus modelos para funcionar en el mundo real", date: "23 Abril", stage: "Escenario #2", photo: "/fotosponentes/carlossanchez.jpeg", gender: "m", semblanzaPersonal: "ML Engineer Mercado Libre. MLOps, pipelines. Profesor Coderhouse.", semblanzaCharla: "Cómo tomar ese modelo que solo funciona en Jupyter y desplegarlo correctamente en producción. Desde pipelines de datos hasta monitoreo continuo, exploraremos las herramientas y prácticas necesarias para que tus modelos funcionen confiablemente en el mundo real." },
    { name: "John Kleinad", talk: "Desarrollando apps robustos con AWS", date: "23 Abril", stage: "Escenario #3", photo: "/fotosponentes/johnkleinad.png", gender: "m", semblanzaPersonal: "Arquitecto Experiencias Digitales. Experto: AWS, Next.js, React, TypeScript, GraphQL.", semblanzaCharla: "Desarrollo de aplicaciones robustas en AWS. Aprenderemos arquitecturas escalables, buenas prácticas de seguridad y cómo desplegar aplicaciones que puedan soportar tráfico en producción. Combinaremos teoría con ejemplos prácticos de aplicaciones reales construidas en la nube." },
    { name: "Diego Bravo", talk: "De usuario a dueño: cómo tener control sobre tus servicios digitales y divertirte en el proceso", date: "23 Abril", stage: "Escenario #3", photo: "/fotosponentes/diegobravo.jpeg", gender: "m", semblanzaPersonal: "Estudiante 6to sem CS. Intereses: teoría, desarrollo, ciberseguridad.", semblanzaCharla: "Análisis de cómo los usuarios pueden tener mayor control sobre sus servicios digitales. Exploración de herramientas open source, privacidad y seguridad digital. Una invitación a ser dueño de tu tecnología en lugar de solo consumidor." },
    { name: "Victor Ledesma", talk: "Open Source en el Monitoreo", date: "23 Abril", stage: "Escenario #3", photo: "/fotosponentes/victorledesma.jpeg", gender: "m", semblanzaPersonal: "Ingeniero en Sistemas, APL Harvard 2024. Community Leader AxoPunk, Zabbix.", semblanzaCharla: "Exploración del ecosistema de herramientas open source para monitoreo y observabilidad de sistemas. C ómo implementar soluciones escalables y confiables sin depender de software propietario. Casos de uso reales y mejores prácticas en monitoreo de infraestructura." },
    { name: "Fernanda Tello", talk: "De la teoría a la blockchain: construyendo sobre Stellar", date: "23 Abril", stage: "Escenario #3", photo: "/fotosponentes/Fer Tello.jpeg", gender: "f", semblanzaPersonal: "Economista, 8+ años finanzas, 5 blockchain. Fundadora CriptoUNAM. México Lead BAF.", semblanzaCharla: "De la teoría económica a la práctica blockchain. Cómo la tecnología Stellar está revolucionando pagos e inclusión financiera. Exploración de casos de uso reales, arquitectura de la red y cómo construir aplicaciones financieras descentralizadas." },
    { name: "Gerardo Vela", talk: "De la teoría a la blockchain: construyendo sobre Stellar", date: "23 Abril", stage: "Escenario #3", photo: "/fotosponentes/gerardovela.jpeg", gender: "m", semblanzaPersonal: "Economista UNAM, Full-Stack Web3. Fundador CriptoUNAM. 3er ETH Global Argentina 2025.", semblanzaCharla: "De la teoría económica a la práctica blockchain. Cómo la tecnología Stellar está revolucionando pagos e inclusión financiera. Exploración de casos de uso reales, arquitectura de la red y cómo construir aplicaciones financieras descentralizadas usando tecnologías de vanguardia." },
    { name: "Alexa Joaquin", talk: "¿La nube está matando al Hardware?", date: "23 Abril", stage: "Escenario #3", photo: "/fotosponentes/alexajoaquin.jpg", gender: "f", semblanzaPersonal: "Técnica Sistemas Digitales, estudiante Data Science ESCOM IPN. AWS Cloud Club. Docente robótica.", semblanzaCharla: "Exploración sobre si la nube está matando al hardware. Durante décadas, el hardware fue el corazón de la computación, pero con la expansión cloud las empresas dependen de servicios remotos. El auge de IA genera demanda masiva de cómputo especializado. ¿Será este el final del hardware? Analizaremos cómputo paralelo, IA y sus nuevas áreas profesionales." },
    { name: "Gadiel Guillen", talk: "Cualquier videojuego es un Rubik", date: "23 Abril", stage: "Escenario #3", photo: "/fotosponentes/gadielguillen.jpg", gender: "m", semblanzaPersonal: "Data Analyst YXKN, FullStack Blumy, SDE CONACYT. Apasionado game dev con Godot.", semblanzaCharla: "¿Un cubo Rubik puede enseñarte a hacer videojuegos? Resulta que sí. Exploraremos colisionadores, estados, nodos, vectores, eventos y triggers usando un cubo Rubik funcional construido en Godot, todo en tiempo real. Sin tanta teoría abstracta, probando que el gamedev es mucho más accesible de lo que te han hecho creer." },
    { name: "Lilith Diaz", talk: "Anatomía de un ataque en memoria", date: "24 Abril", stage: "Escenario #1", photo: "/fotosponentes/lilithdiaz.jpg", gender: "f", semblanzaPersonal: "Estudiante CS UNAM, pentester eJPT. Primera LATAM Positive Hack Camp 2025. Analista Websec.", semblanzaCharla: "La mayoría de desarrolladores escriben código sin pensar en qué pasa por debajo. Exploramos la anatomía de un proceso en memoria y construimos intuición para entender un buffer overflow, byte a byte. Usando GDB, veremos cómo se sobreescribe un return address y cómo desviar la ejecución de un programa a voluntad." },
    { name: "Manuel Ortiz", talk: "Nube & Proyectos OSS", date: "24 Abril", stage: "Escenario #1", photo: "/fotosponentes/ManuelOrtiz_Picture.jpg", gender: "m", semblanzaPersonal: "Microsoft MVP, GitHub Community Leader. ESCOM IPN. Líder GitTogether CDMX.", semblanzaCharla: "Cómo funcionan los proyectos de Open Source Software dentro del ecosistema tecnológico y el impacto global que pueden alcanzar. Explicaremos el alcance en cloud computing e innovación, y compartiremos formas prácticas en que cualquier persona puede comenzar a contribuir a comunidades abiertas." },
    { name: "Enrique Calderon", talk: "Software Libre como Trampolín: de LIDSOL a GSoC a Internship", date: "24 Abril", stage: "Escenario #1", photo: "/fotosponentes/enriquecalderon.jpeg", gender: "m", semblanzaPersonal: "Ingeniero UNAM, LIDSoL. GSoC Apache Beam. Backend Intern Lyft CDMX.", semblanzaCharla: "Comparte su experiencia desde educación y cómo la participación en comunidades y proyectos de software libre proporcionó oportunidad de llegar a la industria. Desde formación de contactos hasta participación en proyectos de organizaciones grandes, preparando un currículum que abre puertas a entrevistas y trabajos." },
    { name: "Emmanuel Zamora", talk: "Despierta tu ímpetu empresarial", date: "24 Abril", stage: "Escenario #1", photo: "/fotosponentes/emmanuelzamora.jpeg", gender: "m", semblanzaPersonal: "Ingeniero en Sistemas, abogado en formación. 12+ años tech. Fundador e-Study.", semblanzaCharla: "Inspiración y herramientas para despertar tu espíritu empresarial. Desde identificar oportunidades hasta construir un MVP, exploraremos cómo transformar ideas en negocios sostenibles usando tecnología. Lecciones de experiencia real en ecosistemas de emprendimiento y escalamiento." },
    { name: "Ana Cifuentes", talk: "No te van a contratar por saber AI: te van a contratar por lo que construyas con ella", date: "24 Abril", stage: "Escenario #1", photo: "/fotosponentes/anacifuentes.JPG", gender: "f", semblanzaPersonal: "TAM Google, Cloud Support, DevOps. Fundadora CHIDASTECH. Organizadora AWS & KCD.", semblanzaCharla: "Todos aprenden IA hoy, pero saber usar ChatGPT ya no te diferencia. Lo que realmente importa es tu capacidad de construir soluciones reales con AI. Aprende cómo pasar de ser consumidor de tecnología a crear proyectos con impacto, incluso desde la universidad. No necesitas ser experto, necesitas cambiar tu enfoque." },
    { name: "Alex Espinosa", talk: "Intro a Spec Driven Development con Kiro", date: "24 Abril", stage: "Escenario #1", photo: "/fotosponentes/axel-espinosa-perfil.jpeg", gender: "m", semblanzaPersonal: "Developer Advocate AWS. Consultoría, startups, finanzas. Content creator.", semblanzaCharla: "¿Quieres construir un juego sin sufrir? En este workshop crearás uno desde cero con IA usando Kiro. Aprenderás Spec-Driven Development: le dices a la IA qué quieres y ella te ayuda a construirlo. Verás cómo Kiro convierte tus ideas en código funcional sin importar tu nivel. Trae laptop e ideas, nosotros ponemos la IA." },
    { name: "Ramses Mata", talk: "Intro a Spec Driven Development con Kiro", date: "24 Abril", stage: "Escenario #1", photo: "/fotosponentes/ramses-mata-perfil.jpg", gender: "m", semblanzaPersonal: "Developer Advocate AWS. Cloud, dev, educación comunitaria. Mentor LATAM.", semblanzaCharla: "¿Quieres construir un juego sin sufrir? En este workshop crearás uno desde cero con IA usando Kiro. Aprenderás Spec-Driven Development: le dices a la IA qué quieres y ella te ayuda a construirlo. Verás cómo Kiro convierte tus ideas en código funcional sin importar tu nivel. Trae laptop e ideas, nosotros ponemos la IA." },
    { name: "Josafat Jimenez", talk: "Over-Engineering: Cómo quemar crédito de AWS para validar tu comida", date: "24 Abril", stage: "Escenario #2", photo: "/fotosponentes/josafatjimenez.jpeg", gender: "m", semblanzaPersonal: "Full Stack DevOps. Next.js, Django, Node.js, TypeScript. HackRush organizer, mentor.", semblanzaCharla: "¿Para qué hacer las cosas simples cuando puedes usar la nube? Aprende a conectar Telegram con AWS S3, visión artificial (Rekognition) y síntesis de voz neuronal (Polly) usando n8n, solo para responder la pregunta más importante de la humanidad: ¿Es esto un hot dog?" },
    { name: "Jesus Barajas", talk: "Análisis de vulnerabilidad a una cámara WiFi", date: "24 Abril", stage: "Escenario #2", photo: "/fotosponentes/jesusbarajas.jpg", gender: "m", semblanzaPersonal: "Egresado CS, 6 años ciberseguridad. Líder SOC. Especialista vulnerabilidades automotriz.", semblanzaCharla: "Basada en su tesis de licenciatura, exploración de un ejercicio de análisis de vulnerabilidades siguiendo metodología SANS. Identificación de fallos en sistema de IoT que simula red doméstica. Temas de hacking ético y vulnerabilidades en entornos reales, destacando cómo Ciencias de la Computación sirve como base para ciberseguridad." },
    { name: "Oscar Hernández", talk: "Mapeo colaborativo de transporte público con herramientas libres", date: "24 Abril", stage: "Escenario #2", photo: "/fotosponentes/oscarhernandez.png", gender: "m", semblanzaPersonal: "Especialista Tecnología Cívica, Codeando México. Arquitecto software, infraestructura digital pública.", semblanzaCharla: "Introducción al ecosistema de tecnología cívica y datos abiertos aplicados a movilidad. Ciclo de vida de datos abiertos: desde captura en calle hasta integración en estándares globales (GTFS). Cómo el mapeo colaborativo genera infraestructura digital pública de forma soberana. Oportunidad para unirse a comunidad de mapeo colaborativo." },
  ];

  // Helper function to get talk description based on talk title
  const getTalkDescription = (talkTitle: string | null) => {
    if (!talkTitle) return null;
    const talk = ponentes.find(p => p.talk === talkTitle);
    return talk?.semblanzaCharla || null;
  };

  // Helper function for responsive agenda item styles
  const getAgendaItemStyle = (): CSSProperties => ({
    borderLeft: isMobile ? "2px solid #26D968" : "3px solid #26D968",
    paddingLeft: isMobile ? "1rem" : "1.5rem",
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
  });

  // Helper function for responsive time text style
  const getAgendaTimeStyle = (): CSSProperties => ({
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: isMobile ? "0.8rem" : "0.9rem",
    color: "#26D968",
    fontWeight: 600,
  });

  // Helper function for responsive title text style
  const getAgendaTitleStyle = (): CSSProperties => ({
    fontFamily: "'Red Hat Display', sans-serif",
    fontSize: isMobile ? "0.95rem" : "1.1rem",
    fontWeight: 600,
    color: "#fff",
    marginTop: "0.3rem",
  });

  // Helper function for responsive description text style
  const getAgendaDescriptionStyle = (): CSSProperties => ({
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: isMobile ? "0.75rem" : "0.8rem",
    color: "#aaa",
    marginTop: "0.5rem",
    fontStyle: "italic",
    lineHeight: "1.5",
  });

  useEffect(() => {
    let debounceTimer: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        setIsMobile(window.innerWidth < 640);
        setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
      }, 150);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    setIsClient(true);
    
    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isClient) {
    return <section style={{ minHeight: LAYOUT.section.minHeight }} />;
  }

  const showASCII = false;
  const asciiFontSize = isMobile ? 6 : isTablet ? 7 : 8;
  const textFontSize = isMobile ? 44 : isTablet ? 96 : 200;
  const planeBaseHeight = isMobile ? 5 : isTablet ? 6.5 : 8;

  const sectionStyle: CSSProperties = {
    minHeight: LAYOUT.section.minHeight,
    display: "grid",
    placeItems: "center",
    padding: LAYOUT.section.padding,
    position: "relative",
  };

  const containerStyle: CSSProperties = {
    textAlign: "center",
    maxWidth: LAYOUT.section.maxWidth,
    width: "100%",
  };

  const contentMaxWidthStyle: CSSProperties = {
    width: "100%",
    maxWidth: "1120px",
    margin: "0 auto",
  };

  const responsiveGridStyle = (mobileColumns: string, desktopColumns: string): CSSProperties => ({
    display: "grid",
    gridTemplateColumns: isMobile ? mobileColumns : desktopColumns,
    gap: isMobile ? "0.75rem" : "1rem",
  });

  const responsiveSectionStyle = (bottomMargin = "3rem"): CSSProperties => ({
    marginBottom: isMobile ? "2rem" : bottomMargin,
  });

  const cardPadding = isMobile ? "1rem" : "1.1rem";
  const panelPadding = isMobile ? "1rem" : "1.5rem";

  return (
    <section style={sectionStyle}>
      {showASCII ? (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <ASCIIText
            text="..."
            asciiFontSize={asciiFontSize}
            textFontSize={textFontSize}
            textColor="#fdf9f3"
            planeBaseHeight={planeBaseHeight}
            enableWaves={false}
          />
        </div>
      ) : title === "WeirdUI" || title === "WeirdUI[1]" ? (
        <div className="w-full px-4 md:px-8 lg:px-16" style={contentMaxWidthStyle}>
          <div style={{ marginTop: isMobile ? "1rem" : "2rem", marginBottom: isMobile ? "1.75rem" : "3rem", textAlign: "center", display: "flex", justifyContent: "center" }}>
            <Image
              src="/logo_weirdui1.png"
              alt="WeirdUI[1]"
              width={isMobile ? 200 : isTablet ? 400 : 600}
              height={isMobile ? 100 : isTablet ? 200 : 300}
              style={{ width: "auto", height: "auto", maxWidth: "100%" }}
              priority
              unoptimized
            />
          </div>

          {/* Visión */}
          <section style={responsiveSectionStyle()}>
            <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 600, color: COLORS.primary, marginBottom: "1rem" }}>
              Visión
            </h2>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.9rem" : "clamp(0.9rem, 2vw, 1rem)", color: "#ccc", lineHeight: isMobile ? "1.7" : "1.8", marginBottom: "1rem" }}>
              Cuando participamos en hackatones, es casi inevitable que llegue el momento de crear una interfaz de usuario. Y normalmente, esa UI está hecha en React, Vue o algún framework popular creado para la web.
            </p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.9rem" : "clamp(0.9rem, 2vw, 1rem)", color: "#ccc", lineHeight: isMobile ? "1.7" : "1.8" }}>
              Pero en WeirdUI[1] tenemos otra visión. Queremos hacerlo de manera diferente. Queremos que sea raro, desafiante, fuera de lo normal. Aquí no usamos los frameworks clásicos ni el stack convencional. Nada de React, nada de JavaScript, ni de TypeScript…nada web. Queremos ver interfaces creadas con Python, Rust, Java, C++, o cualquier otro lenguaje que se te ocurra, siempre y cuando no sea lo "normal".
            </p>
          </section>

          {/* El Reto */}
          <section style={responsiveSectionStyle()}>
            <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 600, color: COLORS.primary, marginBottom: "1rem" }}>
              El Reto
            </h2>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.9rem" : "clamp(0.9rem, 2vw, 1rem)", color: "#ccc", lineHeight: isMobile ? "1.7" : "1.8", marginBottom: "1rem" }}>
              Y que seriá un stack poco convencional sin un reto del mismo nivel? En WeirdUI no buscamos resolver un problema masivo, queremos que enfoques tu creatividad en algo más específico, algo de nicho. El reto de WeirdUI[1] será crear una interfaz para gestionar la cava de un restaurante.
            </p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "1rem" : "clamp(1rem, 2.5vw, 1.25rem)", color: COLORS.primary, fontWeight: 600, lineHeight: "1.8" }}>
              ¿Aceptas el reto?
            </p>
          </section>

          {/* Requisitos */}
          <section style={responsiveSectionStyle()}>
            <div style={{ backgroundColor: "rgba(38, 217, 104, 0.05)", padding: panelPadding, borderLeft: "3px solid #26D968", borderRadius: "4px" }}>
              <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 600, color: COLORS.primary, marginBottom: "1rem", marginTop: 0 }}>
                Requisitos
              </h2>
              <div style={responsiveGridStyle("1fr", "repeat(auto-fit, minmax(220px, 1fr))")}>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.7", margin: 0, overflowWrap: "anywhere" }}>
                    Para participar necesitas tener un equipo de hasta 5 personas.
                  </p>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.7", margin: 0, overflowWrap: "anywhere" }}>
                    Cada equipo deberá elegir un nombre con el que serán identificados en el concurso. Ese nombre no debe ser altisonante ni irrespetuoso.
                  </p>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.7", margin: 0, overflowWrap: "anywhere" }}>
                    Cada integrante del equipo debe de tener una cuenta de GitHub y una cuenta de correo para el registro.
                  </p>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.7", margin: 0, overflowWrap: "anywhere" }}>
                    Asegúrate de usar tu nombre completo legal para inscribirte.
                  </p>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.7", margin: 0, overflowWrap: "anywhere" }}>
                    El hackathon busca una interfaz como solución: tú decides qué tipo de interfaz entregas.
                  </p>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.7", margin: 0, overflowWrap: "anywhere" }}>
                    Tu solución no debe incluir ningún archivo .ts ni .js. Puedes tener archivos de cualquier otro tipo.
                  </p>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.7", margin: 0, overflowWrap: "anywhere" }}>
                    Tú eliges el tipo de base de datos y dónde se aloja. Al final debes explicar por qué elegiste esa base de datos.
                  </p>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.7", margin: 0, overflowWrap: "anywhere" }}>
                    Tendrás que implementar control de usuarios y de salidas y entradas de insumos (en este caso, los vinos).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Entregables */}
          <section style={responsiveSectionStyle()}>
            <div style={{ backgroundColor: "rgba(38, 217, 104, 0.05)", padding: panelPadding, borderLeft: "3px solid #26D968", borderRadius: "4px" }}>
              <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 600, color: COLORS.primary, marginBottom: "1rem", marginTop: 0 }}>
                Entregables
              </h2>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.9rem" : "clamp(0.9rem, 2vw, 1rem)", color: "#ccc", lineHeight: isMobile ? "1.7" : "1.8", marginBottom: "1rem" }}>
                Al final debes mostrar tres cosas:
              </p>
              <div style={responsiveGridStyle("1fr", "repeat(auto-fit, minmax(240px, 1fr))")}>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.05rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.6rem", marginTop: 0 }}>
                    Repositorio
                  </h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.7", margin: 0, overflowWrap: "anywhere" }}>
                    El repositorio de tu solución. Necesitamos revisar el código, por lo que se te asignará un repositorio para alojar tu código.
                  </p>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.05rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.6rem", marginTop: 0 }}>
                    Prueba
                  </h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.7", margin: 0, overflowWrap: "anywhere" }}>
                    Una forma de probar tu solución: cómo la instalamos? cómo la ejecutamos?
                  </p>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.05rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.6rem", marginTop: 0 }}>
                    Reporte
                  </h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.7", margin: 0, overflowWrap: "anywhere" }}>
                    Un reporte de tu solución. Queremos conocer cual fue la ruta que tomó tu equipo, el por que decidieron tomar ciertas decisiones, etc, todo lo que nos explique su creatividad y acercamiento al reto.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Reglas */}
          <section style={responsiveSectionStyle()}>
            <div style={{ backgroundColor: "rgba(38, 217, 104, 0.05)", padding: panelPadding, borderLeft: "3px solid #26D968", borderRadius: "4px" }}>
              <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 600, color: COLORS.primary, marginBottom: "1rem", marginTop: 0 }}>
                Reglas
              </h2>
              <div style={responsiveGridStyle("1fr", "repeat(auto-fit, minmax(240px, 1fr))")}>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.75rem", marginTop: 0 }}>
                    Permitido
                  </h3>
                  <ul style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.7", paddingLeft: "1rem", margin: 0, overflowWrap: "anywhere" }}>
                    <li>Bibliotecas wrappers (mientras el código fuente no sea .js ni .ts)</li>
                    <li>Python: PySide6/PyQt6, Reflex, Flet, TKinter, Textual, Streamlit, Anvil, Typer, Click</li>
                    <li>Rust: Iced, Slint, Ratatui, Druid, GTK-rs, tui-rs</li>
                    <li>Java/Kotlin: Picocli, Compose Multiplatform, JavaFX, Spring Shell, Vaadin</li>
                    <li>Dart: Flutter; Go: Fyne, Bubble Tea, Wails, Cobra</li>
                    <li>Elixir: Owl, Phoenix, Ratatouille; C++: Qt, FLTK, wxWidgets</li>
                    <li>Repositorio con historial de commits consistente durante los días del hackathon</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: "rgba(239, 68, 68, 0.08)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: "#ff8a8a", marginBottom: "0.75rem", marginTop: 0 }}>
                    Prohibido
                  </h3>
                  <ul style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#f1b3b3", lineHeight: "1.7", paddingLeft: "1rem", margin: 0, overflowWrap: "anywhere" }}>
                    <li>JavaScript, TypeScript, React, Vite, Angular, Next.js, Astro, Vue, Svelte</li>
                    <li>Cualquier framework web JS/TS de manera general</li>
                    <li>Código generado con IA</li>
                    <li>Código escrito fuera del tiempo oficial del hackathon (excepto librerías de terceros)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Fases */}
          <section style={responsiveSectionStyle()}>
            <div style={{ backgroundColor: "rgba(38, 217, 104, 0.05)", padding: panelPadding, borderLeft: "3px solid #26D968", borderRadius: "4px" }}>
              <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 600, color: COLORS.primary, marginBottom: "1rem", marginTop: 0 }}>
                Fases del Hackathon
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "1rem" : "1.25rem" }}>
                <div>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.5rem", marginTop: 0 }}>
                  Día 1: Arquitectura y Diseño
                  </h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", color: "#bbb", lineHeight: "1.6", margin: 0, overflowWrap: "anywhere" }}>
                  20 de Abril. Define lenguaje, bibliotecas, base de datos. Diagrama de relaciones. Diseño de interfaz.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.5rem", marginTop: 0 }}>
                  Día 2: Avances
                  </h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", color: "#bbb", lineHeight: "1.6", margin: 0, overflowWrap: "anywhere" }}>
                  21 de Abril. Esqueleto del proyecto. Al menos una funcionalidad. Base de datos implementada.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.5rem", marginTop: 0 }}>
                  Día 3: Entrega Final
                  </h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", color: "#bbb", lineHeight: "1.6", margin: 0, overflowWrap: "anywhere" }}>
                  22 de Abril. Código completo. Instrucciones de ejecución. Reporte de solución.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.5rem", marginTop: 0 }}>
                  Día 4: Pitch Day
                  </h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", color: "#bbb", lineHeight: "1.6", margin: 0, overflowWrap: "anywhere" }}>
                  24 de Abril. Para equipos en top 5. Presentación de 5 minutos. Demo en vivo.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Jueces */}
          <section style={responsiveSectionStyle()}>
            <div style={{ backgroundColor: "rgba(38, 217, 104, 0.05)", padding: panelPadding, borderLeft: "3px solid #26D968", borderRadius: "4px" }}>
              <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 600, color: COLORS.primary, marginBottom: "1rem", marginTop: 0 }}>
                Jueces
              </h2>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.9rem" : "clamp(0.9rem, 2vw, 1rem)", color: "#ccc", lineHeight: isMobile ? "1.7" : "1.8", marginBottom: "1rem" }}>
                Tu solución será evaluada por profesionales con experiencia en investigación, ingeniería y ciberseguridad.
              </p>
              <div style={responsiveGridStyle("1fr", "repeat(auto-fit, minmax(240px, 1fr))")}>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.05rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.6rem", marginTop: 0 }}>
                    Karla Ramirez Pulido
                  </h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.6", margin: 0, overflowWrap: "anywhere" }}>
                    Doctora en Ciencia e Ingeniería de la Computación, auditora de riesgos tecnológicos e investigadora de sesgos de género en IA.
                  </p>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.05rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.6rem", marginTop: 0 }}>
                    Alicia Margarita De La Mora Cebada
                  </h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.6", margin: 0, overflowWrap: "anywhere" }}>
                    Doctora en Ciencias de la Tierra y Técnica Académica en el Departamento de Supercómputo de la UNAM.
                  </p>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.05rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.6rem", marginTop: 0 }}>
                    Manuel Soto Romero
                  </h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.6", margin: 0, overflowWrap: "anywhere" }}>
                    Maestro en Ciencia e Ingeniería de la Computación e investigador sobre Teoría de Lenguajes de Programación.
                  </p>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.05rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.6rem", marginTop: 0 }}>
                    Virgilio Castro Rendón
                  </h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.6", margin: 0, overflowWrap: "anywhere" }}>
                    Fundador y mentor de Hackers Fight Club, especialista en ciberseguridad ofensiva y defensiva.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Premios */}
          <section style={{ marginBottom: isMobile ? "2rem" : "3rem", paddingBottom: isMobile ? "1.5rem" : "2rem" }}>
            <div style={{ backgroundColor: "rgba(38, 217, 104, 0.05)", padding: panelPadding, borderLeft: "3px solid #26D968", borderRadius: "4px" }}>
              <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 600, color: COLORS.primary, marginBottom: "1rem", marginTop: 0 }}>
                Premios
              </h2>
              <div style={responsiveGridStyle("1fr", "repeat(auto-fit, minmax(240px, 1fr))")}>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.75rem", marginTop: 0 }}>
                    1er Lugar
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1rem" }}>
                    <img src="/nswitch2.svg" alt="NSwitch Logo" style={{ width: "80px", height: "80px", objectFit: "contain", marginBottom: "0.5rem" }} />
                  </div>
                  <ul style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.6", paddingLeft: "1rem", margin: 0, overflowWrap: "anywhere" }}>
                    <li>Nintendo Switch 2, patrocinado por AWS.</li>
                    <li>Beca de 6 meses en Platzi para cada integrante, patrocinado por Interledger Foundation</li>
                    <li>Paquete de libros, patrocinado por Interledger Foundation</li>
                    <li>Beca de 3 meses en Pentesterlab, patrocinada por Hackers Fight Club.</li>
                    <li>Reconocimiento oficial como ganadorx de WeirdUI[1]</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: "rgba(38, 217, 104, 0.1)", padding: cardPadding, borderRadius: "6px", border: "1px solid rgba(38, 217, 104, 0.2)" }}>
                  <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: COLORS.primary, marginBottom: "0.75rem", marginTop: 0 }}>
                    2do y 3er Lugar
                  </h3>
                  <ul style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#bbb", lineHeight: "1.6", paddingLeft: "1rem", margin: 0, overflowWrap: "anywhere" }}>
                    <li>Paquete de libros para cada integrante, patrocinado por Interledger Foundation</li>
                    <li>Beca de 3 meses en Platzi (tras completar curso "Open Payments"), patrocinada por Interledger Foundation</li>
                    <li>Reconocimiento oficial por parte de la Facultad de Ciencias como ganadorx de WeirdUI[1]</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Registro */}
          <section>
            <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 600, color: COLORS.primary, marginBottom: "1rem" }}>
              Registro
            </h2>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.9rem" : "clamp(0.9rem, 2vw, 1rem)", color: "#ccc", lineHeight: isMobile ? "1.7" : "1.8" }}>
              El registro estará abierto del 06 al 16 de abril de 2026 a las 23:59 hrs. Conecta tu cuenta de GitHub en la parte superior de la página para crear un equipo o unirte a uno con su código. Una vez que cierre el registro, se te asignará un repositorio en la comunidad Sudo FCiencias para subir tus avances.
            </p>
          </section>
        </div>
      ) : title === "Agenda" ? (
        <div className="w-full px-4 md:px-8 lg:px-16 min-h-96">
          <div className="mb-12 text-center">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-center"
              style={{
                fontFamily: "'Red Hat Display', sans-serif",
                fontWeight: 700,
                letterSpacing: "-1px",
                color: "#26D968",
                marginBottom: "1rem",
              }}
            >
              Agenda del Evento
            </h1>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", color: "#999", lineHeight: "1.6", marginBottom: "3rem" }}>
              (Presiona el título en color verde para ir al link de la transmisión en vivo)
            </p>
          </div>

          {/* Days Tabs */}
          <div className="flex gap-2 sm:gap-4 justify-center mb-8 overflow-x-auto no-scrollbar">
            {["20 Abril", "21 Abril", "22 Abril", "23 Abril", "24 Abril"].map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                style={{
                  fontFamily: "'Red Hat Display', sans-serif",
                  fontSize: isMobile ? "0.9rem" : "1.1rem",
                  fontWeight: selectedDay === day ? 700 : 500,
                  color: selectedDay === day ? "#26D968" : "#999",
                  borderBottom: selectedDay === day ? "2px solid #26D968" : "2px solid transparent",
                  padding: isMobile ? "0.4rem 0.75rem" : "0.5rem 1rem",
                  background: "transparent",
                  cursor: "pointer",
                  transition: "color 0.3s ease, border-color 0.3s ease",
                  whiteSpace: "nowrap",
                  minWidth: "fit-content",
                  flex: "0 0 auto",
                }}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Agenda Grid */}
          <div className="space-y-8">
            {selectedDay === "20 Abril" && (
              <div>
                <LinkPreview url="https://youtube.com/live/uHDLR-iSCCY" isStatic imageSrc="/youtube-thumbnail.jpg">
                  <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "#26D968", marginBottom: "1rem", cursor: "pointer", transition: "color 0.3s ease" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#1f9e4d")} onMouseLeave={(e) => (e.currentTarget.style.color = "#26D968")}>Escenario #0 - En Línea</h2>
                </LinkPreview>
                <div className="space-y-4">
                  {agendaData["20-Online"].map((item: any, idx: number) => {
                    const description = getTalkDescription(item.title);
                    return (
                      <div key={idx} style={getAgendaItemStyle()}>
                        <div style={getAgendaTimeStyle()}>{item.time}</div>
                        <div style={getAgendaTitleStyle()}>{item.title}</div>
                        {item.speaker && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.75rem" : "0.85rem", color: "#ccc", marginTop: "0.3rem" }}>{item.speaker}</div>}
                        {item.org && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.7rem" : "0.8rem", color: "#999", marginTop: "0.2rem" }}>{item.org}</div>}
                        {description && <div style={getAgendaDescriptionStyle()}>{description}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedDay === "21 Abril" && (
              <div>
                <LinkPreview url="https://youtube.com/live/nvOXItnD_OI" isStatic imageSrc="/youtube-thumbnail.jpg">
                  <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "#26D968", marginBottom: "1rem", cursor: "pointer", transition: "color 0.3s ease" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#1f9e4d")} onMouseLeave={(e) => (e.currentTarget.style.color = "#26D968")}>Escenario #0 - En Línea</h2>
                </LinkPreview>
                <div className="space-y-4">
                  {agendaData["21-Online"].map((item: any, idx: number) => {
                    const description = getTalkDescription(item.title);
                    return (
                      <div key={idx} style={getAgendaItemStyle()}>
                        <div style={getAgendaTimeStyle()}>{item.time}</div>
                        <div style={getAgendaTitleStyle()}>{item.title}</div>
                        {item.speaker && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.75rem" : "0.85rem", color: "#ccc", marginTop: "0.3rem" }}>{item.speaker}</div>}
                        {item.org && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.7rem" : "0.8rem", color: "#999", marginTop: "0.2rem" }}>{item.org}</div>}
                        {description && <div style={getAgendaDescriptionStyle()}>{description}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedDay === "22 Abril" && (
              <div>
                <LinkPreview url="https://youtube.com/live/1XvX4L5aVwU" isStatic imageSrc="/youtube-thumbnail.jpg">
                  <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "#26D968", marginBottom: "1rem", cursor: "pointer", transition: "color 0.3s ease" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#1f9e4d")} onMouseLeave={(e) => (e.currentTarget.style.color = "#26D968")}>Escenario #0 - En Línea</h2>
                </LinkPreview>
                <div className="space-y-4">
                  {agendaData["22-Online"].map((item: any, idx: number) => {
                    const description = getTalkDescription(item.title);
                    return (
                      <div key={idx} style={getAgendaItemStyle()}>
                        <div style={getAgendaTimeStyle()}>{item.time}</div>
                        <div style={getAgendaTitleStyle()}>{item.title}</div>
                        {item.speaker && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.75rem" : "0.85rem", color: "#ccc", marginTop: "0.3rem" }}>{item.speaker}</div>}
                        {item.org && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.7rem" : "0.8rem", color: "#999", marginTop: "0.2rem" }}>{item.org}</div>}
                        {description && <div style={getAgendaDescriptionStyle()}>{description}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedDay === "23 Abril" && (
              <>
                {/* E1 */}
                <div>
                  <LinkPreview url="https://youtube.com/live/5c71IWPEBf8" isStatic imageSrc="/abccelis.webp">
                    <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "#26D968", marginBottom: "1rem", cursor: "pointer", transition: "color 0.3s ease" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#1f9e4d")} onMouseLeave={(e) => (e.currentTarget.style.color = "#26D968")}>Escenario #1 - Auditorio Barajas Celis</h2>
                  </LinkPreview>
                  <div className="space-y-4">
                    {agendaData["23-E1"].map((item: any, idx: number) => {
                      const description = getTalkDescription(item.title);
                      return (
                        <div key={idx} style={getAgendaItemStyle()}>
                          <div style={getAgendaTimeStyle()}>{item.time}</div>
                          <div style={getAgendaTitleStyle()}>{item.title}</div>
                          {item.speaker && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.75rem" : "0.85rem", color: "#ccc", marginTop: "0.3rem" }}>{item.speaker}</div>}
                          {item.org && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.7rem" : "0.8rem", color: "#999", marginTop: "0.2rem" }}>{item.org}</div>}
                          {description && <div style={getAgendaDescriptionStyle()}>{description}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* E2 */}
                <div>
                  <LinkPreview url="https://youtube.com/live/3S3OGkZAMcE" isStatic imageSrc="/aulaGoogle.jpg">
                    <div style={{ cursor: "pointer", transition: "color 0.3s ease" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#1f9e4d")} onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}>
                      <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "#26D968", marginBottom: "0.5rem" }}>Escenario #2 - Aula Google</h2>
                    </div>
                  </LinkPreview>
                  <div className="space-y-4">
                    {agendaData["23-E2"].map((item: any, idx: number) => {
                      const description = getTalkDescription(item.title);
                      return (
                        <div key={idx} style={getAgendaItemStyle()}>
                          <div style={getAgendaTimeStyle()}>{item.time}</div>
                          <div style={getAgendaTitleStyle()}>{item.title}</div>
                          {item.speaker && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.75rem" : "0.85rem", color: "#ccc", marginTop: "0.3rem" }}>{item.speaker}</div>}
                          {item.org && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.7rem" : "0.8rem", color: "#999", marginTop: "0.2rem" }}>{item.org}</div>}
                          {description && <div style={getAgendaDescriptionStyle()}>{description}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* E3 */}
                <div>
                  <LinkPreview url="https://youtube.com/live/aylkt-TakIg" isStatic imageSrc="/LDP.jpg">
                    <div style={{ cursor: "pointer", transition: "color 0.3s ease" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#1f9e4d")} onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}>
                      <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "#26D968", marginBottom: "0.5rem" }}>Escenario #3 - Lab. Leng. Programación</h2>
                    </div>
                  </LinkPreview>
                  <div className="space-y-4">
                    {agendaData["23-E3"].map((item: any, idx: number) => {
                      const description = getTalkDescription(item.title);
                      return (
                        <div key={idx} style={getAgendaItemStyle()}>
                          <div style={getAgendaTimeStyle()}>{item.time}</div>
                          <div style={getAgendaTitleStyle()}>{item.title}</div>
                          {item.speaker && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.75rem" : "0.85rem", color: "#ccc", marginTop: "0.3rem" }}>{item.speaker}</div>}
                          {item.org && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.7rem" : "0.8rem", color: "#999", marginTop: "0.2rem" }}>{item.org}</div>}
                          {description && <div style={getAgendaDescriptionStyle()}>{description}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {selectedDay === "24 Abril" && (
              <>
                {/* E1 */}
                <div>
                  <LinkPreview url="https://youtube.com/live/jgEbvFdK5lM" isStatic imageSrc="/abccelis.webp">
                    <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "#26D968", marginBottom: "1rem", cursor: "pointer", transition: "color 0.3s ease" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#1f9e4d")} onMouseLeave={(e) => (e.currentTarget.style.color = "#26D968")}>Escenario #1 - Auditorio Barajas Celis</h2>
                  </LinkPreview>
                  <div className="space-y-4">
                    {agendaData["24-E1"].map((item: any, idx: number) => {
                      const description = getTalkDescription(item.title);
                      return (
                        <div key={idx} style={getAgendaItemStyle()}>
                          <div style={getAgendaTimeStyle()}>{item.time}</div>
                          <div style={getAgendaTitleStyle()}>{item.title}</div>
                          {item.speaker && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.75rem" : "0.85rem", color: "#ccc", marginTop: "0.3rem" }}>{item.speaker}</div>}
                          {item.org && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.7rem" : "0.8rem", color: "#999", marginTop: "0.2rem" }}>{item.org}</div>}
                          {description && <div style={getAgendaDescriptionStyle()}>{description}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* E2 */}
                <div>
                  <LinkPreview url="https://youtube.com/live/gL4j1BmPNNY" isStatic imageSrc="/aulaGoogle.jpg">
                    <div style={{ cursor: "pointer", transition: "color 0.3s ease" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#1f9e4d")} onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}>
                      <h2 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "#26D968", marginBottom: "0.5rem" }}>Escenario #2 - Aula Google</h2>
                    </div>
                  </LinkPreview>
                  <div className="space-y-4">
                    {agendaData["24-E2"].map((item: any, idx: number) => {
                      const description = getTalkDescription(item.title);
                      return (
                        <div key={idx} style={getAgendaItemStyle()}>
                          <div style={getAgendaTimeStyle()}>{item.time}</div>
                          <div style={getAgendaTitleStyle()}>{item.title}</div>
                          {item.speaker && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.75rem" : "0.85rem", color: "#ccc", marginTop: "0.3rem" }}>{item.speaker}</div>}
                          {item.org && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.7rem" : "0.8rem", color: "#999", marginTop: "0.2rem" }}>{item.org}</div>}
                          {description && <div style={getAgendaDescriptionStyle()}>{description}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="w-full mt-12 md:mt-16 lg:mt-20 px-4 md:px-0 flex items-center justify-center flex-col">
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", color: "#ccc", lineHeight: "1.8" }}>
              Contaremos con charlas y talleres de empleados que trabajan en
            </p>
            
            {/* Comet Cards Grid */}
            <div className="w-full mt-8 px-4 md:px-0 flex justify-center">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-7xl">
                <CometCard disableGlare className="w-full h-full">
                  <div className="p-6 rounded-xl h-40 flex items-center justify-center" style={{ backgroundColor: "#0E1115" }}>
                    <img src="/logoscharlas/Amazon_Web_Services-Logo.wine.svg" alt="AWS" className="w-28 h-28 object-contain hover:opacity-80 transition-opacity" />
                  </div>
                </CometCard>
                
                <CometCard disableGlare className="w-full h-full">
                  <div className="p-6 rounded-xl h-40 flex items-center justify-center" style={{ backgroundColor: "#0E1115" }}>
                    <img src="/logoscharlas/Google_Favicon_2025.svg.png" alt="Google" className="w-28 h-28 object-contain hover:opacity-80 transition-opacity" />
                  </div>
                </CometCard>
                
                <CometCard disableGlare className="w-full h-full">
                  <div className="p-6 rounded-xl h-40 flex items-center justify-center" style={{ backgroundColor: "#0E1115" }}>
                    <img src="/logoscharlas/microsoft-logo.webp" alt="Microsoft" className="w-28 h-28 object-contain hover:opacity-80 transition-opacity" />
                  </div>
                </CometCard>
                
                <CometCard disableGlare className="w-full h-full">
                  <div className="p-6 rounded-xl h-40 flex items-center justify-center" style={{ backgroundColor: "#0E1115" }}>
                    <img src="/logoscharlas/Mercado-Libre-Logo-2013.png" alt="Mercado Libre" className="w-28 h-28 object-contain hover:opacity-80 transition-opacity" />
                  </div>
                </CometCard>
                
                <CometCard disableGlare className="w-full h-full">
                  <div className="p-6 rounded-xl h-40 flex items-center justify-center" style={{ backgroundColor: "#0E1115" }}>
                    <img src="/logoscharlas/netflix_logo_icon_170919.webp" alt="Netflix" className="w-28 h-28 object-contain hover:opacity-80 transition-opacity" />
                  </div>
                </CometCard>
                
                <CometCard disableGlare className="w-full h-full">
                  <div className="p-6 rounded-xl h-40 flex items-center justify-center" style={{ backgroundColor: "#0E1115" }}>
                    <img src="/logoscharlas/Red_Hat-Logo.png" alt="Red Hat" className="w-28 h-28 object-contain hover:opacity-80 transition-opacity" />
                  </div>
                </CometCard>
                
                <CometCard disableGlare className="w-full h-full">
                  <div className="p-6 rounded-xl h-40 flex items-center justify-center" style={{ backgroundColor: "#0E1115" }}>
                    <img src="/logoscharlas/mdonalds.svg" alt="Mcdonalds" className="w-28 h-28 object-contain hover:opacity-80 transition-opacity" />
                  </div>
                </CometCard>
                
                <CometCard disableGlare className="w-full h-full">
                  <div className="p-6 rounded-xl h-40 flex items-center justify-center" style={{ backgroundColor: "#0E1115" }}>
                    <img src="/logoscharlas/github.svg" alt="GitHub" className="w-28 h-28 object-contain hover:opacity-80 transition-opacity" />
                  </div>
                </CometCard>
              </div>
            </div>

            {/* Ponentes Title */}
            <div className="w-full mt-20 px-4 md:px-0 flex flex-col items-center justify-center">
              <h2
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-center"
                style={{
                  fontFamily: "'Red Hat Display', sans-serif",
                  fontWeight: 700,
                  letterSpacing: "-1px",
                  color: "#26D968",
                }}
              >
                Ponentes
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-400 mt-4 text-center" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                (Presiona la foto de cada ponente para ver su semblanza)
              </p>
            </div>

            {/* Ponentes Grid */}
            <div className="w-full mt-16 px-3 sm:px-4 md:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {ponentes.map((ponente, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-full">
                      <PixelTransition
                        firstContent={
                          ponente.photo ? (
                            <img 
                              src={ponente.photo} 
                              alt={ponente.name} 
                              className="w-full h-full object-cover"
                              style={["Karla Vargas", "Fernanda Tello", "Ana Cifuentes"].includes(ponente.name) ? { objectPosition: "center top" } : {}}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#26D968] to-[#1a8a45] flex items-center justify-center">
                              <div className="text-center">
                                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: "#fff" }}>
                                  Foto próximamente
                                </div>
                              </div>
                            </div>
                          )
                        }
                        secondContent={
                          ponente.semblanzaPersonal ? (
                            <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center p-3">
                              <div className="text-center">
                                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.75rem" : "0.8rem", color: "#ccc", lineHeight: "1.5" }}>
                                  {ponente.semblanzaPersonal}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
                              <div className="text-center p-4">
                                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.75rem" : "0.85rem", color: "#ccc", lineHeight: "1.6" }}>
                                  {ponente.talk}
                                </p>
                              </div>
                            </div>
                          )
                        }
                        gridSize={8}
                        pixelColor="#26D968"
                        animationStepDuration={0.4}
                        once={false}
                      />
                    </div>
                    <div className="mt-3 sm:mt-4 text-center w-full">
                      <h3 style={{ fontFamily: "'Red Hat Display', sans-serif", fontSize: isMobile ? "1rem" : "1.1rem", fontWeight: 600, color: "#26D968", marginBottom: "0.5rem" }}>
                        {ponente.name}
                      </h3>
                      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.7rem" : "0.8rem", color: "#999", lineHeight: "1.5" }}>
                        <strong>{ponente.gender === "f" ? "La podrás ver" : "Lo podrás ver"} en:</strong>
                        <br />
                        {ponente.talk}
                        <br />
                        <span style={{ color: "#ccc" }}>{ponente.date} • {ponente.stage}</span>
                      </p>
                      {ponente.semblanzaCharla && (
                        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "0.65rem" : "0.7rem", color: "#888", lineHeight: "1.4", marginTop: "0.75rem", fontStyle: "italic" }}>
                          {ponente.semblanzaCharla}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : title === "Nosotros" ? (
        <div className="w-full px-4 md:px-8 lg:px-16">
          <div className="mb-12 text-center">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-center"
              style={{
                fontFamily: "'Red Hat Display', sans-serif",
                fontWeight: 700,
                letterSpacing: "-1px",
                color: "#26D968",
                marginBottom: "1rem",
              }}
            >
              ¿Quienes Somos?
            </h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left side - Title and Description */}
            <div className="flex flex-col justify-center">
              <h2
                style={{
                  fontFamily: "'Red Hat Display', sans-serif",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: "#26D968",
                  marginBottom: "1rem",
                }}
              >
                Guayaba Devs
              </h2>
              <p
                style={{
                  fontFamily: "'JetBrainsMono', monospace",
                  fontSize: "1.1rem",
                  color: "#ffffff",
                  lineHeight: "1.8",
                }}
              >
                Guayaba Devs surge de una comunidad estudiantil en 2022 que encontró en la colaboración la mejor forma de aprender. Hoy operamos como una red abierta que une sedes, capítulos y aliados para impulsar proyectos de tecnología y compartir conocimiento sin costo.
              </p>
            </div>

            {/* Right side - Terminal style image */}
            <div
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              {/* Terminal Title Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#262626",
                  padding: "12px 16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#ef4444",
                    }}
                  />
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#eab308",
                    }}
                  />
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#22c55e",
                    }}
                  />
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#a3a3a3",
                    }}
                  >
                    Guayaba Devs — Image
                  </span>
                </div>
              </div>

              {/* Terminal Content */}
              <div
                style={{
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #262626",
                  borderTop: "none",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "300px",
                }}
              >
                <img
                  src="/guayabaDev.jpg"
                  alt="Guayaba Devs"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "350px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left side - Title and Description */}
            <div className="flex flex-col justify-center">
              <h2
                style={{
                  fontFamily: "'Red Hat Display', sans-serif",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: "#26D968",
                  marginBottom: "1rem",
                }}
              >
                Ixalli
              </h2>
              <p
                style={{
                  fontFamily: "'JetBrainsMono', monospace",
                  fontSize: "1.1rem",
                  color: "#ffffff",
                  lineHeight: "1.8",
                }}
              >
                Ixalli es una iniciativa universitaria surgida en la UNAM, enfocada en cerrar la brecha de género en áreas STEM. Constituye una comunidad creada por y para mujeres en tecnología, diseñada para potenciar el desarrollo profesional y académico a través de cuatro pilares fundamentales: mentoría estratégica, talleres especializados, networking de alto valor y creación de redes de apoyo. Su objetivo principal es conectar, inspirar y empoderar a las futuras líderes del sector tech.
              </p>
            </div>

            {/* Right side - Terminal style image */}
            <div
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              {/* Terminal Title Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#262626",
                  padding: "12px 16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#ef4444",
                    }}
                  />
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#eab308",
                    }}
                  />
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#22c55e",
                    }}
                  />
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#a3a3a3",
                    }}
                  >
                    Ixalli — Image
                  </span>
                </div>
              </div>

              {/* Terminal Content */}
              <div
                style={{
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #262626",
                  borderTop: "none",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "300px",
                }}
              >
                <img
                  src="/ixalli_web.jpeg"
                  alt="Ixalli"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "350px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left side - Title and Description */}
            <div className="flex flex-col justify-center">
              <h2
                style={{
                  fontFamily: "'Red Hat Display', sans-serif",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: "#26D968",
                  marginBottom: "1rem",
                }}
              >
                Hackers Fight Club
              </h2>
              <p
                style={{
                  fontFamily: "'JetBrainsMono', monospace",
                  fontSize: "1.1rem",
                  color: "#ffffff",
                  lineHeight: "1.8",
                }}
              >
                Hackers Fight Club (HFC) es una agrupación dedicada a la capacitación de estudiantes de la UNAM en ciberseguridad. Nuestro objetivo más importante es crear comunidad: fortalecer la identidad, el sentido de pertenencia y la unidad entre quienes comparten esta pasión, dentro y fuera de la UNAM. Entre nuestros proyectos más destacados se encuentran la difusión con contenido educativo, la organización de talleres prácticos, la investigación en ciberseguridad y la participación en competencias nacionales, regionales e internacionales.
              </p>
            </div>

            {/* Right side - Terminal style image */}
            <div
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              {/* Terminal Title Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#262626",
                  padding: "12px 16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#ef4444",
                    }}
                  />
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#eab308",
                    }}
                  />
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#22c55e",
                    }}
                  />
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#a3a3a3",
                    }}
                  >
                    Hackers Fight Club — Image
                  </span>
                </div>
              </div>

              {/* Terminal Content */}
              <div
                style={{
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #262626",
                  borderTop: "none",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "300px",
                }}
              >
                <img
                  src="/hfc_web.jpg"
                  alt="Hackers Fight Club"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "350px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left side - Title and Description */}
            <div className="flex flex-col justify-center">
              <h2
                style={{
                  fontFamily: "'Red Hat Display', sans-serif",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: "#26D968",
                  marginBottom: "1rem",
                }}
              >
                Sudo
              </h2>
              <p
                style={{
                  fontFamily: "'JetBrainsMono', monospace",
                  fontSize: "1.1rem",
                  color: "#ffffff",
                  lineHeight: "1.8",
                }}
              >
                Sudo es una comunidad estudiantil destinada a llenar lagunas técnicas, sociales y académicas en el ámbito de la tecnología. No solo buscamos poder crear una comunidad para fortalecer nuestros conocimientos tecnológicos, si no también crear espacios en donde podamos compartirlos y estar en continuo aprendizaje, sin importar el nivel técnico, experiencia, carrera, escuela o recorrido profesional.
                <br />
                <br />
                Nuestro nombre proviene del comando de terminal del mismo nombre, que significa super user do. Por ello, nuestro slogan es No somos expertxs, somos Sudo.
              </p>
            </div>

            {/* Right side - Terminal style image */}
            <div
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              {/* Terminal Title Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#262626",
                  padding: "12px 16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#ef4444",
                    }}
                  />
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#eab308",
                    }}
                  />
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#22c55e",
                    }}
                  />
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#a3a3a3",
                    }}
                  >
                    Sudo — Image
                  </span>
                </div>
              </div>

              {/* Terminal Content */}
              <div
                style={{
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #262626",
                  borderTop: "none",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "300px",
                }}
              >
                <img
                  src="/sudo_web.jpg"
                  alt="Sudo"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "350px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left side - Title and Description */}
            <div className="flex flex-col justify-center">
              <h2
                style={{
                  fontFamily: "'Red Hat Display', sans-serif",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: "#26D968",
                  marginBottom: "1rem",
                }}
              >
                Pu++
              </h2>
              <p
                style={{
                  fontFamily: "'JetBrainsMono', monospace",
                  fontSize: "1.1rem",
                  color: "#ffffff",
                  lineHeight: "1.8",
                }}
              >
                En Pu++, somos la comunidad de programación competitiva de la Facultad de Ciencias. Transformamos tu curiosidad en una ventaja competitiva, llevando tu lógica desde los fundamentos hasta el podio.
              </p>
            </div>

            {/* Right side - Terminal style image */}
            <div
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              {/* Terminal Title Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#262626",
                  padding: "12px 16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#ef4444",
                    }}
                  />
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#eab308",
                    }}
                  />
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#22c55e",
                    }}
                  />
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#a3a3a3",
                    }}
                  >
                    Pu++ — Image
                  </span>
                </div>
              </div>

              {/* Terminal Content */}
              <div
                style={{
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #262626",
                  borderTop: "none",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "300px",
                }}
              >
                <img
                  src="/pumasmas_web.jpg"
                  alt="Pu++"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "350px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left side - Title and Description */}
            <div className="flex flex-col justify-center">
              <h2
                style={{
                  fontFamily: "'Red Hat Display', sans-serif",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: "#26D968",
                  marginBottom: "1rem",
                }}
              >
                AWS Cloud Club UNAM
              </h2>
              <p
                style={{
                  fontFamily: "'JetBrainsMono', monospace",
                  fontSize: "1.1rem",
                  color: "#ffffff",
                  lineHeight: "1.8",
                }}
              >
                El AWS Cloud Club UNAM es un grupo de usuarios dirigido e impulsado por estudiantes que se enfoca en aprender sobre la Nube a través de las tecnologías de AWS.
              </p>
            </div>

            {/* Right side - Terminal style image */}
            <div
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              {/* Terminal Title Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#262626",
                  padding: "12px 16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#ef4444",
                    }}
                  />
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#eab308",
                    }}
                  />
                  <div
                    style={{
                      height: "12px",
                      width: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#22c55e",
                    }}
                  />
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#a3a3a3",
                    }}
                  >
                    AWS Cloud Club UNAM — Image
                  </span>
                </div>
              </div>

              {/* Terminal Content */}
              <div
                style={{
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #262626",
                  borderTop: "none",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "300px",
                }}
              >
                <img
                  src="/awsccunam_web.jpeg"
                  alt="AWS Cloud Club UNAM"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "350px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="w-full mt-20 px-0">
            <div className="w-full px-4 md:px-8 lg:px-16 mb-8 flex items-center justify-center">
              <h3
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-center text-white"
                style={{
                  fontFamily: "'Red Hat Display', sans-serif",
                  fontWeight: 700,
                  letterSpacing: "-1px",
                  color: "#26D968",
                }}
              >
                CompuFest[0]
              </h3>
            </div>
            <GalleryDemo />
          </div>
        </div>
      ) : title === "FAQ" ? (
        <div style={containerStyle}>
          <h1 style={TYPOGRAPHY.heading}>FAQ</h1>
          <p style={TYPOGRAPHY.subtitle}>Preguntas Frecuentes</p>
        </div>
      ) : title === "Contador" ? (
        <CounterPage />
      ) : (
        <div style={containerStyle}>
          <h1 style={TYPOGRAPHY.heading}>{title}</h1>
          <p style={TYPOGRAPHY.subtitle}>{subtitle}</p>
        </div>
      )}
    </section>
  );
}
