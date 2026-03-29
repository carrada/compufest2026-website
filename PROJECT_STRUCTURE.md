# Estructura del Proyecto CompuFest 2026

## 📁 Organización de Carpetas

```
compufest2026-website/
├── app/
│   ├── [[...slug]]/          # Ruta dinámica principal del sitio
│   ├── dev/                  # 🔧 Rutas de desarrollo y pruebas
│   │   ├── contador/
│   │   └── pruebaconfeti/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                   # Componentes UI reutilizables
│   │   ├── ASCIIText.tsx
│   │   ├── CountdownTimer.tsx
│   │   ├── StaggeredMenu.tsx
│   │   ├── Terminal.tsx
│   │   ├── comet-card.tsx
│   │   ├── draggable-card.tsx
│   │   ├── link-preview.tsx
│   │   ├── loader.tsx
│   │   └── Lanyard.tsx
│   ├── layout/               # Componentes de layout
│   │   ├── Background.tsx
│   │   ├── Footer.tsx
│   │   └── RoutesRenderer.tsx
│   ├── routes/               # Componentes de rutas principales
│   │   ├── HomeRoute.tsx
│   │   └── SectionScreen.tsx
│   ├── demos/                # 🎨 Componentes de demostración (no activos)
│   │   ├── comet-card-demo.tsx
│   │   ├── draggable-card-demo-2.tsx
│   │   ├── terminal-demo.tsx
│   │   ├── sticky-scroll-reveal-demo.tsx
│   │   ├── Folder.tsx & .jsx
│   │   ├── Masonry.tsx
│   │   ├── StickerPeel.jsx
│   │   └── [otros demos]
│   ├── AppRouterShell.tsx    # Shell principal del router
│   ├── canvas-text-demo.tsx  # Componente principal de inicio
│   ├── draggable-card-gallery.tsx
│   └── DraggableCardGallery.tsx
├── lib/
│   ├── constants/
│   │   ├── navigation.ts
│   │   └── theme.ts
│   ├── types.ts
│   ├── utils.ts
│   └── confetti.ts
├── public/                   # Assets estáticos
│   ├── *.svg                 # Logos y stickers (67-89)
│   ├── compu-fest-images/
│   └── [fuentes y assets]
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```

## 📝 Guía de Uso

### Componentes Principales
- **HomeRoute.tsx** - Página de inicio
- **SectionScreen.tsx** - Pantallas dinámicas de secciones
- **canvas-text-demo.tsx** - Contenedor principal con hackathon, patrocinadores y comunidades

### Componentes UI
Los componentes en `ui/` son reutilizables y pueden usarse en múltiples lugares.

### Demos (Experimentos)
Los componentes en `demos/` son experimentales y no están en actividad. Útiles para referencia futura.

### Rutas de Desarrollo
En `app/dev/` encontrarás rutas de prueba durante el desarrollo. Estas no se despliegan en producción.

## 🚀 Deployment

El proyecto se despliega automáticamente desde `main` a Vercel. 
- Sitio principal: https://www.compufest.cc
- Ruta dinámica: [[...slug]] maneja todas las rutas secundarias

## 🛠️ Mantenimiento

- Evita añadir componentes en la raíz de `components/`, organízalos por subcarpetas
- Los demos experimentales van en `components/demos/`
- Las rutas de prueba van en `app/dev/`
- Mantén `lib/constants/` para configuraciones globales
