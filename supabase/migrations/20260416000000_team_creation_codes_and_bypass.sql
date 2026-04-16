-- ============================================================
-- CompuFest 2026 - Team Creation Codes (capacity-full bypass)
-- ============================================================
-- Purpose: lock direct INSERT on `teams` for non-admins, expose a
-- single SECURITY DEFINER RPC that consumes a single-use code from
-- a private `team_creation_codes` table to allow team creation by
-- invited participants only.
--
-- SAFETY: This migration creates new objects and replaces one
-- existing policy on `public.teams` (teams_insert). It does NOT
-- delete, truncate, or modify any existing rows in any table.
-- ============================================================

-- 1. New table: team_creation_codes
CREATE TABLE public.team_creation_codes (
  code        TEXT PRIMARY KEY,
  note        TEXT,
  used_by     UUID REFERENCES public.profiles(id),
  used_at     TIMESTAMPTZ,
  team_id     UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.team_creation_codes ENABLE ROW LEVEL SECURITY;

-- Only admins can SELECT/INSERT/UPDATE/DELETE codes directly.
-- Regular participants never touch this table; they go through RPCs.
CREATE POLICY "team_creation_codes_admin_all" ON public.team_creation_codes
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin')
  );

-- 2. Restrict direct teams INSERT: only admins
DROP POLICY "teams_insert" ON public.teams;

CREATE POLICY "teams_insert" ON public.teams
  FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = created_by
    AND EXISTS (SELECT 1 FROM public.profiles
                WHERE id = auth.uid() AND role = 'admin')
  );

-- 3. RPC: create_team_with_code
-- Single path for non-admins to create a team. SECURITY DEFINER
-- bypasses RLS legitimately after validating the access code.
CREATE OR REPLACE FUNCTION public.create_team_with_code(
  p_name TEXT,
  p_code TEXT
)
RETURNS TABLE (id UUID, name TEXT, invite_code TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id     UUID := auth.uid();
  v_code_record RECORD;
  v_new_team    RECORD;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  IF p_name IS NULL OR length(trim(p_name)) = 0 THEN
    RAISE EXCEPTION 'nombre_requerido';
  END IF;

  IF EXISTS (SELECT 1 FROM public.team_members WHERE user_id = v_user_id) THEN
    RAISE EXCEPTION 'ya_en_equipo';
  END IF;

  -- Lock the code row to prevent races between concurrent attempts
  SELECT * INTO v_code_record
  FROM public.team_creation_codes
  WHERE code = p_code
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'codigo_invalido';
  END IF;

  IF v_code_record.used_by IS NOT NULL THEN
    RAISE EXCEPTION 'codigo_usado';
  END IF;

  BEGIN
    INSERT INTO public.teams (name, created_by)
    VALUES (trim(p_name), v_user_id)
    RETURNING public.teams.id, public.teams.name, public.teams.invite_code
    INTO v_new_team;
  EXCEPTION WHEN unique_violation THEN
    RAISE EXCEPTION 'nombre_duplicado';
  END;

  -- Mark code as used (trace: who used it, when, and for which team)
  UPDATE public.team_creation_codes
  SET used_by = v_user_id,
      used_at = now(),
      team_id = v_new_team.id
  WHERE code = p_code;

  -- The on_team_created trigger already adds creator to team_members.

  RETURN QUERY SELECT v_new_team.id, v_new_team.name, v_new_team.invite_code;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_team_with_code(TEXT, TEXT) TO authenticated;

-- 4. RPC: validate_team_creation_code (boolean only)
-- Used by the private route to decide between showing the form or
-- silently redirecting. Returns no information beyond a boolean
-- and requires authentication to discourage brute-force probing.
CREATE OR REPLACE FUNCTION public.validate_team_creation_code(p_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.team_creation_codes
    WHERE code = p_code AND used_by IS NULL
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.validate_team_creation_code(TEXT) TO authenticated;
