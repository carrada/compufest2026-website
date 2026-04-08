-- Auto-delete team when last member leaves
CREATE OR REPLACE FUNCTION public.handle_member_removed()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.team_members WHERE team_id = OLD.team_id) THEN
    DELETE FROM public.teams WHERE id = OLD.team_id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_team_member_removed
  AFTER DELETE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.handle_member_removed();
