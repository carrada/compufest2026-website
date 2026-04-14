# Load Testing Guide

Guia rapida para validar capacidad del sitio antes de picos de trafico.

## 1. Instalar k6

Linux (Debian/Ubuntu):

```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
printf "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main\n" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt update
sudo apt install -y k6
```

Alternativa (Snap):

```bash
sudo snap install k6
```

## 2. Levantar la aplicacion

En una terminal:

```bash
npm run build
npm run start
```

Por defecto se usa `http://localhost:3000`.

## 3. Ejecutar pruebas

En otra terminal:

```bash
npm run load:smoke
npm run load:stress
npm run load:spike
```

Para probar contra un dominio desplegado:

```bash
BASE_URL="https://tu-dominio.com" npm run load:stress
```

## 4. Que mide la prueba

Rutas incluidas:

- `/`
- `/faq`
- `/hackathon`
- `/agenda`
- `/nosotros`

Umbrales por escenario:

- `smoke`: p95 < 800 ms, errores < 1%
- `stress`: p95 < 1200 ms, errores < 2%
- `spike`: p95 < 2000 ms, errores < 3%

## 5. Como decidir si estamos listos

Tu limite operativo para manana es el maximo nivel donde:

- `http_req_failed` se mantiene debajo del umbral.
- `http_req_duration` (p95/p99) no se degrada de forma brusca.
- El servidor no muestra reinicios, timeouts o saturacion de CPU/RAM.

## 6. Recomendacion para hoy

Secuencia sugerida:

1. Correr `load:smoke` y confirmar baseline estable.
2. Correr `load:stress` al menos 2 veces.
3. Correr `load:spike` para simular llegada masiva de usuarios.
4. Repetir `load:stress` despues del spike para verificar recuperacion.

Si observas errores de autenticacion o latencia alta en middleware, revisa limites de Supabase (conexiones, rate limit, auth) porque cada request pasa por middleware.
