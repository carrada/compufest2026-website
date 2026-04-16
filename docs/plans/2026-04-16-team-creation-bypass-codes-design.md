# Diseño: bloqueo de creación de equipos con bypass por código privado

**Fecha:** 2026-04-16
**Branch base:** `backend`
**Contexto:** El cupo de equipos está completo. Se debe cerrar la creación de equipos para participantes generales (a nivel servidor y UI), pero permitir a un grupo específico crear equipos vía un código privado de un solo uso. Las uniones a equipos existentes vía código de invitación deben seguir funcionando sin cambios.

## Restricciones clave

- **Server-side enforcement obligatorio** — RLS no debe permitir `INSERT` directo sobre `teams` para no-admins.
- **Discreción total** — los participantes generales no deben ver pista alguna de que existe un mecanismo para crear equipos.
- **Trazabilidad** — cada código se consume una sola vez y queda registrado quién lo usó y para qué equipo.
- **Cero impacto en datos existentes** — las migraciones no deben tocar `profiles`, `teams`, `team_members`.
- **Plan Supabase NANO** — sin auto-backups; se requiere backup manual antes de migrar.

## Arquitectura

### Capa 1 — Base de datos

#### Nueva tabla `team_creation_codes`

```sql
CREATE TABLE public.team_creation_codes (
  code        TEXT PRIMARY KEY,
  note        TEXT,
  used_by     UUID REFERENCES public.profiles(id),
  used_at     TIMESTAMPTZ,
  team_id     UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.team_creation_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "team_creation_codes_admin_all" ON public.team_creation_codes
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
```

- Código disponible ⇔ `used_by IS NULL`.
- Solo admins ven/manipulan vía RLS. Participantes interactúan únicamente vía RPCs `SECURITY DEFINER`.

#### Restricción sobre `teams_insert`

```sql
DROP POLICY "teams_insert" ON public.teams;

CREATE POLICY "teams_insert" ON public.teams
  FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = created_by
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

Único camino de INSERT directo: admins. No-admins deben pasar por la RPC.

#### RPC `create_team_with_code(p_name, p_code)`

`SECURITY DEFINER`. Valida en orden:
1. `auth.uid()` no nulo.
2. `p_name` no vacío.
3. Usuario no es ya miembro de un equipo.
4. Código existe (con `FOR UPDATE` para evitar race conditions) y no consumido.
5. Inserta `teams`. El trigger existente `on_team_created` añade al creador a `team_members`.
6. Marca el código como usado: `used_by`, `used_at`, `team_id`.

Errores con etiquetas cortas (`codigo_invalido`, `codigo_usado`, `nombre_duplicado`, `ya_en_equipo`) que el frontend mapea a mensajes en español.

#### RPC `validate_team_creation_code(p_code) → boolean`

`SECURITY DEFINER STABLE`. Devuelve solo bool. Requiere autenticación. Usado por la ruta privada para decidir entre mostrar formulario o silent-redirect.

Ambas RPCs: `GRANT EXECUTE TO authenticated`.

### Capa 2 — Frontend

#### Nueva ruta `/dashboard/crear-equipo`

Componente `CreateTeamWithCodeRoute.tsx`. Lógica de mount:

| Caso | Acción |
|------|--------|
| Sin `?code=` en URL | `<Navigate to="/dashboard" replace />` silencioso |
| No autenticado | Guarda `pendingCreationCode` en `localStorage`, muestra botón GitHub login |
| Autenticado, ya en equipo | Redirect silencioso a `/dashboard` |
| Autenticado, sin equipo, código inválido/usado | Redirect silencioso a `/dashboard` |
| Autenticado, sin equipo, código válido | Muestra formulario "Nombre del equipo" + botón crear |

Submit → `supabase.rpc('create_team_with_code', { p_name, p_code })` → `navigate('/dashboard')`.

#### Modificación a `DashboardRoute.tsx`

- Añadir al `useEffect` de `pendingInviteCode` un hermano que lea `pendingCreationCode` y `navigate` a `/dashboard/crear-equipo?code=XYZ`.
- En `NoTeam` (línea ~411): eliminar `handleCreate`, `teamName`, y el primer `<form>`. Dejar solo el form de unirse. Cambiar el copy a:
  > El cupo de equipos está completo. Si alguien te invitó a su equipo, ingresa el código de invitación aquí.
- El bloque `if (isCompetitionStarted())` se mantiene sin cambios.

#### Sin cambios

- `InviteRoute.tsx` — flujo de unirse vía link queda intacto.
- `team_members_insert` policy — sin cambios.
- `AdminSection` / `JudgeSection` — sin cambios visuales (la administración de códigos se hace insertando filas directamente en `team_creation_codes` desde Supabase Studio).

## Generación y entrega de códigos

El admin (tú) inserta códigos directo en Supabase Studio:

```sql
INSERT INTO team_creation_codes (code, note) VALUES
  ('encode-aqui-codigo-aleatorio', 'Equipo Acme — Juan Pérez'),
  ('otro-codigo-aleatorio', 'Equipo Beta — María López');
```

Para cada persona, le envías por canal privado:
`https://<dominio>/dashboard/crear-equipo?code=<su-código>`

Trazabilidad post-uso: `SELECT code, note, used_by, used_at, team_id FROM team_creation_codes WHERE used_by IS NOT NULL`.

## Plan de migración (orden)

1. **Backup manual** del proyecto Supabase vinculado — `supabase db dump` antes de aplicar.
2. Conteo de filas pre-migración: `profiles`, `teams`, `team_members` (para verificar después).
3. Aplicar migración `20260416XXXXXX_team_creation_codes_and_bypass.sql`.
4. Conteo post-migración: confirmar que `profiles`, `teams`, `team_members` tienen los mismos counts.
5. Smoke test: con cuenta no-admin, intento de INSERT directo a `teams` → debe fallar por RLS.
6. Insertar 1 código de prueba, probar flujo completo end-to-end.

## Rollback

Si algo falla:

```sql
DROP FUNCTION IF EXISTS public.create_team_with_code;
DROP FUNCTION IF EXISTS public.validate_team_creation_code;
DROP TABLE IF EXISTS public.team_creation_codes;
DROP POLICY "teams_insert" ON public.teams;
CREATE POLICY "teams_insert" ON public.teams
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
```

(Las migraciones no tocan datos existentes, así que rollback solo elimina lo agregado.)
