# compufest[1] Website

Sitio web oficial de **compufest[1]** - Evento académico de tecnología de la Facultad de Ciencias, UNAM.

## Descripción

compufest[1] es un evento que incluye:
- **WeirdUI[1]**: Hackathon completamente en línea (20-22 de Abril)
- **Charlas y Talleres**: Conferencias presenciales en la Facultad de Ciencias (23-24 de Abril)
- **Comunidad tech**: Espacio para desarrolladores, diseñadores y entusiastas de la tecnología

## Características

- Diseño moderno y responsivo
- Componentes interactivos (contador regresivo, galería dinámica, FAQ interactiva)
- Optimizado para móviles
- Accesibilidad mejorada
- Animaciones fluidas y atractivas
- Interfaz tipo terminal bash (tema hacker)

## Stack Tecnológico

- **Framework**: [Next.js 16.2.1](https://nextjs.org/) con Turbopack
- **Lenguaje**: TypeScript 5
- **Runtime**: React 19.2.4
- **Estilos**: CSS-in-JS y Tailwind CSS
- **Tipografía**: Red Hat Display y JetBrains Mono
- **Componentes**: HeroUI Surface Pattern
- **Animaciones**: Framer Motion

## Proyecto

- **Creador**: Chiikö
- **Contacto**: [chiiko.design](https://chiiko.design)
- **Email Jurídico**: juridico@chiiko.design

## Licencia

Este proyecto está protegido bajo licencia propietaria. Todos los derechos reservados © 2026 Chiikö.

Para más información sobre términos de uso, contacta a: juridico@chiiko.design

Ver [LICENSE](./LICENSE) para detalles completos.

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar servidor de producción
npm start
```

## Estructura del Proyecto

```
components/
├── routes/              # Rutas principales (FAQ, Secciones, etc.)
├── ui/                  # Componentes reutilizables
├── demos/               # Componentes demo
└── layout/              # Componentes de layout

app/
├── layout.tsx           # Layout raíz
└── [[...slug]]/         # Rutas dinámicas

lib/
├── constants/           # Constantes de tema y navegación
├── confetti.ts         # Utilerías de efectos
└── types.ts            # Tipos TypeScript

public/
├── logos/              # Assets de logos
└── images/             # Imágenes del evento
```

## Variables de Entorno

```env
# No se requieren variables de entorno para desarrollo local
```

## Navegación

- `/` - Página de inicio con contador regresivo
- `/faq` - Preguntas frecuentes sobre compufest[1]
- `/hackathon` - Información de WeirdUI[1]
- `/charlas` - Charlas y conferencistas (en construcción)
- `/talleres` - Talleres disponibles (en construcción)
- `/nosotros` - Información sobre los organizadores

## Contacto

- **Sitio Web**: https://chiiko.design
- **Email Jurídico**: juridico@chiiko.design
- **Evento**: sudofciencias@gmail.com

## Contribuciones y Pull Requests

Este proyecto es de código propietario y está protegido por licencia restrictiva. Sin embargo, si deseas contribuir:

### Permisos Requeridos

Debes tener autorización escrita de Chiikö para:
- Hacer cambios en el código
- Enviar pull requests
- Proponer nuevas características

### Proceso para Pull Requests (con Autorización)

1. **Forkea el repositorio** (si tienes acceso)
   ```bash
   git clone <repository-url>
   cd compufest2026-website
   ```

2. **Crea una rama para tu feature**
   ```bash
   git checkout -b feature/descripcion-cambio
   ```

3. **Instala dependencias y trabaja localmente**
   ```bash
   npm install
   npm run dev
   ```

4. **Realiza tus cambios siguiendo el código**
   - Respeta la estructura del proyecto
   - Mantén los estilos de código consistentes
   - Usa TypeScript para nuevos componentes

5. **Commit con mensajes descriptivos**
   ```bash
   git commit -m "feat: descripcion clara del cambio"
   ```

6. **Push a tu rama**
   ```bash
   git push origin feature/descripcion-cambio
   ```

7. **Crea un Pull Request**
   - Describe claramente qué cambios hiciste
   - Referencia cualquier issue relacionado
   - Espera aprobación de los mantenedores

### Pautas de Contribución

- Mantén la consistencia del código con el proyecto
- No modifiques archivos de licencia o documentación legal
- Prueba tus cambios localmente antes de hacer PR
- Respeta la estructura y patrones existentes

### Solicitar Permiso

Para solicitar permiso de contribución, contacta a:
- Email: juridico@chiiko.design
- Sitio: https://chiiko.design

Debes incluir:
- Tu nombre y experiencia
- Descripción de los cambios propuestos
- Justificación del cambio

## Derechos de Autor

**© 2026 Chiikö.** Todos los derechos reservados.

El código fuente, diseños, y contenido de este proyecto son propiedad intelectual de Chiikö y están protegidos bajo las leyes de derechos de autor internacionales.

---

*Última actualización: 4 de Abril de 2026*
