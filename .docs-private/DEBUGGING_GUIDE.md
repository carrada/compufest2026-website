# Debugging Guide - Compufest 2026

Guía completa de debugging, troubleshooting y resolución de problemas.

## 1. Problemas Comunes y Soluciones

### Problema: Build falla con errores de TypeScript

```bash
# Verificar errores específicos
npm run build 2>&1 | grep -A 5 "error TS"

# Solución: Verificar tipos
npx tsc --noEmit

# Ver tipos en línea específica
npx tsc --pretty false lib/types.ts
```

**Causas comunes:**
- Interfaz faltante en props
- Tipo incorrecto en configuración
- Variable sin tipado explícito

**Soluciones:**
```typescript
// ❌ Malo - Cualquier tipo
const item: any = configData;

// ✅ Bueno - Tipo explícito
const item: MenuItem = configData;

// ✅ Mejor - Con validación
const isMenuItem = (obj: unknown): obj is MenuItem => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "label" in obj &&
    "link" in obj
  );
};
```

---

### Problema: Componente no renderiza

```bash
# Ver errores en consola
# Abrir DevTools > Console > Buscar "error"

# Verificar en logs
npm run dev 2>&1 | grep -i "error\|warning"
```

**Checklist:**
- [ ] ¿Componente está exportado?
- [ ] ¿Props tienen los nombres correctos?
- [ ] ¿Tipos coinciden con la interfaz?
- [ ] ¿El path de importación es correcto?

```typescript
// ❌ Camino incorrecto
import { SectionScreen } from "@/routes/SectionScreen"; // No existe

// ✅ Camino correcto
import { SectionScreen } from "@/components/routes/SectionScreen";
```

---

### Problema: Rutas no funcionan

**Checklist:**
- [ ] ¿Route existe en SECTION_ROUTES?
- [ ] ¿El path coincide exactamente?
- [ ] ¿Element está especificado en Route?

```typescript
// Verificar SECTION_ROUTES
console.log("SECTION_ROUTES:", SECTION_ROUTES);

// Verificar en RoutesRenderer
console.log("Rendering routes:", sectionRoutes.map(r => r.path));
```

**Solución tipo:**
```typescript
// En lib/constants/navigation.ts
export const SECTION_ROUTES: SectionRoute[] = [
  // ✅ Verificar que path, title, subtitle existan
  {
    path: "/nueva-seccion",
    title: "Nueva Sección",
    subtitle: "Descripción aquí",
  },
];
```

---

### Problema: Estilos no aplican

```bash
# Verificar compilación de CSS
npm run build -- --verbose 2>&1 | grep -i "css\|tailwind"

# Verificar clases de Tailwind
grep -r "className=" app/ components/ | grep "text-" | head -5
```

**Checklist:**
- [ ] ¿Tailwind configurado en tailwind.config.js?
- [ ] ¿PostCSS correcto en postcss.config.mjs?
- [ ] ¿globals.css importado en layout?

```typescript
// ✅ En app/layout.tsx debe importarse
import "@/app/globals.css";
```

---

## 2. Herramientas de Debugging

### Browser DevTools

```javascript
// En DevTools Console
// Ver configuration en tiempo real
const { default: navigation } = await import("./lib/constants/navigation.js");
console.log(navigation.SECTION_ROUTES);

// Monitorear cambios de ruta
window.addEventListener("popstate", (e) => {
  console.log("Route changed:", window.location.pathname);
});
```

### Profiler de React

```typescript
// En componente específico
import { Profiler } from "react";

<Profiler id="MenuComponent"
  onRender={(id, phase, actualDuration) => {
    console.log(`${id} (${phase}) took ${actualDuration}ms`);
  }}
>
  <Menu items={MENU_ITEMS} />
</Profiler>
```

### Logger personalizado

```typescript
// En lib/logger.ts
export const logger = {
  debug: (msg: string, data?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEBUG] ${msg}`, data);
    }
  },
  error: (msg: string, error?: Error) => {
    console.error(`[ERROR] ${msg}`, error);
  },
  warn: (msg: string, data?: unknown) => {
    console.warn(`[WARN] ${msg}`, data);
  },
};

// Uso
import { logger } from "@/lib/logger";
logger.debug("Rendering section", { path: route.path });
```

---

## 3. Debugging por Componente

### AppRouterShell

```typescript
// Agregar logging
const AppRouterShell = () => {
  const config = useNavigationConfig();

  console.group("AppRouterShell Debug");
  console.log("Menu Items:", config.menuItems);
  console.log("Section Routes:", config.sectionRoutes);
  console.groupEnd();

  // Resto del componente
};
```

**Verificar:**
```bash
# Ver que config esté disponible
grep -n "useNavigationConfig" components/AppRouterShell.tsx

# Verificar que RoutesRenderer lo reciba
grep -n "RoutesRenderer" components/AppRouterShell.tsx
```

### RoutesRenderer

```typescript
// Verificar que routes se mapeen
const RoutesRenderer = ({ sectionRoutes }: Props) => {
  console.log("RoutesRenderer received routes:", sectionRoutes);

  return (
    <Routes>
      {sectionRoutes.map((route) => {
        console.log("Adding route:", route.path);
        return (
          <Route
            key={route.path}
            path={route.path}
            element={<SectionScreen {...route} />}
          />
        );
      })}
    </Routes>
  );
};
```

### useNavigationConfig Hook

```typescript
// Verificar que hook retorna config correcta
export const useNavigationConfig = (
  customMenuItems?: MenuItem[],
  customSocialItems?: SocialItem[],
  customSectionRoutes?: SectionRoute[],
): NavigationConfig => {
  return useMemo(() => {
    const result = {
      menuItems: customMenuItems || MENU_ITEMS,
      socialItems: customSocialItems || SOCIAL_ITEMS,
      sectionRoutes: customSectionRoutes || SECTION_ROUTES,
    };

    console.log("useNavigationConfig result:", result);
    return result;
  }, [customMenuItems, customSocialItems, customSectionRoutes]);
};
```

---

## 4. Performance Profiling

### Identificar componentes lentos

```bash
# Usar Next.js Analytics
npm run build -- --profile

# Ver bundle size
npm run build -- --analyze
```

### Medir renders

```typescript
// Ver cuánto tarda SectionScreen
import { performance } from "perf_hooks";

export const SectionScreen = ({ title, subtitle }: Props) => {
  const startTime = performance.now();

  // Render logic

  const endTime = performance.now();
  console.log(`SectionScreen render: ${endTime - startTime}ms`);

  return {/* JSX */};
};
```

### Optimizar renders innecesarios

```typescript
// ✅ Usar React.memo para componentes puros
export const SectionScreen = React.memo(
  ({ title, subtitle }: Props) => {
    return {/* JSX */};
  },
  // Comparación personalizada si es necesario
  (prevProps, nextProps) => {
    return prevProps.title === nextProps.title &&
           prevProps.subtitle === nextProps.subtitle;
  }
);
```

---

## 5. Testing Estratégico

### Test unitario de tipos

```bash
# Verificar tipos
npx tsc --noEmit --listFiles
```

### Test de integración

```bash
# Ejecutar en aislamiento
npm run build -- --test app/layout.tsx
```

### Test E2E manual

```bash
# 1. Iniciar dev server
npm run dev

# 2. Verificar rutas
curl http://localhost:3000/
curl http://localhost:3000/hackathon
curl http://localhost:3000/charlas

# 3. Verificar Assets
curl -I http://localhost:3000/public/fonts/...
```

---

## 6. Errores Frecuentes

### Error: "Cannot find module"

```typescript
// ❌ Incorrecto
import { MENU_ITEMS } from "@/navigation";

// ✅ Correcto
import { MENU_ITEMS } from "@/lib/constants/navigation";
```

**Solución:** Verificar `baseUrl` y `paths` en tsconfig.json

```json
{
  "baseUrl": ".",
  "paths": {
    "@/*": ["./*"]
  }
}
```

### Error: "prop is not assignable"

```typescript
// ❌ Tipo incorrecto
const item: MenuItem = {
  label: "Home",
  // Falta 'link'
};

// ✅ Tipo correcto
const item: MenuItem = {
  label: "Home",
  link: "/",
};
```

### Error: "Expected 1 argument, got 0"

```typescript
// ❌ Componente sin props
<SectionScreen />

// ✅ Componente con props requeridas
<SectionScreen title="Hackathon" subtitle="Descripción" />
```

---

## 7. Checklist de Deployment

Antes de hacer deploy:

- [ ] `npm run build` compila sin errores
- [ ] `npm run build` ExitCode es 0
- [ ] No hay "warnings" en TypeScript
- [ ] Todos los imports son correctos
- [ ] No hay variables no usadas (_unused_)
- [ ] No hay console.log en producción
- [ ] Rutas funcionan en build preview

```bash
# Pre-deployment checks
echo "=== TypeScript Check ==="
npx tsc --noEmit

echo "=== Build Check ==="
npm run build

echo "=== Preview ==="
npm run start  # Verifica que build funciona
```

---

## 8. Recursos Útiles

- [Next.js Debugging](https://nextjs.org/docs/going-to-production/deployment-checklist)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Tailwind Docs](https://tailwindcss.com/docs)
