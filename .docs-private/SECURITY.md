# 🔒 Seguridad del Sitio CompuFest 2026

## Medidas de Seguridad Implementadas

Este documento describe todas las medidas de seguridad implementadas en el sitio para protegerlo contra vulnerabilidades comunes.

---

## 1. Security Headers HTTP

### Implemented Headers:

| Header | Valor | Propósito |
|--------|-------|----------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Forza HTTPS por 1 año |
| `X-Frame-Options` | `SAMEORIGIN` | Previene clickjacking |
| `X-Content-Type-Options` | `nosniff` | Evita MIME sniffing |
| `X-XSS-Protection` | `1; mode=block` | Protección contra XSS |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control de referrer |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Deshabilita permisos peligrosos |
| `Content-Security-Policy` | Configurada | Previene inyección de scripts |

---

## 2. Content Security Policy (CSP)

La CSP está configurada para:
- ✓ Bloquear scripts inline no autorizados
- ✓ Permitir solo scripts de fuentes confiables
- ✓ Restringir estilos a fuentes seguras
- ✓ Bloquear frames externos
- ✓ Prevenir clickjacking

---

## 3. Validación y Sanitización de Inputs

### Funciones de Seguridad:

```typescript
// Sanitiza strings para prevenir XSS
sanitizeString(input)

// Valida que URLs sean locales
isValidLocalUrl(url)

// Valida emails
validateEmail(email)

// Sanitiza y valida objetos
validateAndSanitize(data, schema)
```

---

## 4. Rate Limiting

Implementado para prevenir ataques de fuerza bruta:
- **Máximo intentos**: 5 intentos
- **Ventana de tiempo**: 60 segundos
- **Comportamiento**: Bloquea después de N intentos

---

## 5. CORS Configuration

Solo permite requests desde:
- `https://www.compufest.cc`
- `https://compufest.cc`

Métodos permitidos: GET, POST, PUT, DELETE, OPTIONS

---

## 6. File Upload Security

Validaciones para carga de archivos:
- **Tamaño máximo**: 50MB
- **Tipos MIME permitidos**:
  - `image/jpeg`
  - `image/png`
  - `image/webp`
  - `image/gif`
  - `application/pdf`
- **Extensiones permitidas**: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.pdf`

---

## 7. CSRF Protection

Implementado:
- Token CSRF generado al iniciar sesión
- Validación en cada request POST/PUT/DELETE
- Tokens almacenados en sessionStorage

---

## 8. Middleware de Seguridad

Archivo: `middleware.ts`

Aplica:
- Headers de seguridad en cada request
- Validación de origen
- Rate limiting global
- Logging de seguridad

---

## 9. Sesiones Seguras

Configuración de sesiones:
```typescript
{
  maxAge: 24 * 60 * 60,        // 24 horas
  secure: true,                 // Solo HTTPS
  httpOnly: true,               // No accesible desde JS
  sameSite: 'strict'            // Previene CSRF
}
```

---

## 10. Dependencias Actualizadas

Para mantener seguridad:
- Revisar regularmente `npm audit`
- Actualizar dependencias vulnerables
- Usar `npm audit fix`

---

## 11. Environment Variables Protegidas

Variables sensibles almacenadas en `.env.local`:
- ✓ No subidas a GitHub
- ✓ Accesibles solo en servidor
- ✓ No expuestas al cliente

---

## 12. Protecciones Implementadas Contra:

| Ataque | Protección |
|--------|-----------|
| **XSS** (Cross-Site Scripting) | CSP + Sanitización + `X-XSS-Protection` |
| **CSRF** (Cross-Site Request Forgery) | CSRF Tokens + SameSite Cookies |
| **Clickjacking** | `X-Frame-Options: SAMEORIGIN` |
| **MIME Sniffing** | `X-Content-Type-Options: nosniff` |
| **Fuerza Bruta** | Rate Limiting |
| **Inyección SQL** | (N/A - No hay backend DB directo) |
| **Exposición de archivos** | Validación de permisos |

---

## 13. Hooks Seguros

### `useSecureForm`
Hook para manejo seguro de formularios con:
- Sanitización automática
- Validación de inputs
- Prevención de rate limiting
- Manejo de errores

---

## 14. Deployment Security

### En Vercel:
- ✓ HTTPS automático
- ✓ DDoS protection
- ✓ WAF (Web Application Firewall)
- ✓ Certificados SSL/TLS actualizados
- ✓ Automatic security patches

---

## 15. Monitoreo y Auditoría

Para mantener seguridad:
1. Revisar logs regularmente
2. Monitorear cambios en dependencias
3. Hacer auditorías de seguridad periódicas
4. Actualizar Next.js y dependencias
5. Revisar cambios en CSP

---

## 16. Best Practices Seguidas

- ✓ Principio de menor privilegio
- ✓ Defense in depth (múltiples capas)
- ✓ Fail-safe defaults
- ✓ Input validation
- ✓ Output encoding
- ✓ Secure by default

---

## Próximos Pasos para Mayor Seguridad

1. **Implementar WAF (Web Application Firewall)**
   - Cloudflare WAF
   - AWS WAF

2. **Configurar Monitoring 24/7**
   - Sentry para error tracking
   - LogRocket para debugging

3. **Implement 2FA/MFA**
   - Para áreas administrativas

4. **Regular Security Audits**
   - Auditorías de terceros
   - Penetration testing

5. **Implement Logging**
   - Server-side logging
   - Security event logging

---

## Contacto para Reportar Vulnerabilidades

Si encuentras una vulnerabilidad:
1. **NO** la publiques públicamente
2. Contacta al equipo de desarrollo
3. Proporciona detalles de la vulnerabilidad
4. Espera a que sea parcheada

---

*Última actualización: 29 de marzo de 2026*
