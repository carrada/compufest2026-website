-- Fix: team_members_insert policy was counting ALL members across all teams
-- instead of only counting members of the target team.
-- The subquery lacked a table alias, causing team_members.team_id to
-- self-reference the FROM table instead of the NEW row.

DROP POLICY "team_members_insert" ON public.team_members;

CREATE POLICY "team_members_insert" ON public.team_members
  FOR INSERT TO authenticated WITH CHECK (
    user_id = auth.uid()
    AND NOT EXISTS (SELECT 1 FROM public.team_members tm WHERE tm.user_id = auth.uid())
    AND (SELECT COUNT(*) FROM public.team_members tm WHERE tm.team_id = team_members.team_id) < 5
  );
