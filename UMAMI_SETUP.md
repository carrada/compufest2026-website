# Umami Analytics Setup

Guia practica para usar Umami self-hosted en este proyecto.

## Estado actual

- Umami corre en `http://localhost:3001`.
- Stack local: Umami + PostgreSQL con Docker Compose.
- Compose file: `infra/umami/docker-compose.yml`.

## Comandos utiles

Desde la raiz del proyecto:

```bash
npm run umami:up
npm run umami:logs
npm run umami:down
```

## Primer acceso

1. Abre `http://localhost:3001`.
2. Inicia sesion con el usuario inicial de Umami.
3. Crea un website nuevo para compufest.
4. Copia el `Website ID`.

## Integracion en el sitio

En `.env.local` define:

```env
NEXT_PUBLIC_UMAMI_SCRIPT_URL=http://localhost:3001/script.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID=<TU_WEBSITE_ID_DE_UMAMI>
```

Despues reinicia Next.js (`npm run dev` o `npm run start`).

## Produccion para compufest.cc

Para monitorear el dominio principal, no debe usarse `localhost` en produccion.

Configura variables de entorno en tu proveedor de despliegue (por ejemplo Vercel):

```env
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://analytics.compufest.cc/script.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID=<WEBSITE_ID_DE_COMPUEST_CC_EN_UMAMI>
```

En Umami, el website debe tener como dominio permitido: `compufest.cc`.

## Verificacion rapida

1. Abre tu sitio en `http://localhost:3000`.
2. Navega entre varias rutas (`/`, `/faq`, `/hackathon`).
3. Ve al dashboard de Umami y confirma que suben pageviews y visitantes.

## Como abrirlo manana

1. En terminal del proyecto:

```bash
npm run umami:up
npm run dev
```

- Dashboard analytics: `http://localhost:3001`
- Sitio: `http://localhost:3000`

Si no ves datos, revisa que `NEXT_PUBLIC_UMAMI_WEBSITE_ID` tenga el ID correcto del website en Umami.
