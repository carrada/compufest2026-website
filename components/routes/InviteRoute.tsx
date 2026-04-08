'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import type { Team } from '@/lib/types';

const COMPETITION_START = new Date('2026-04-20T15:00:00Z');
function isCompetitionStarted() {
  return new Date() >= COMPETITION_START;
}

export function InviteRoute() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, signInWithGitHub } = useAuth();

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const [alreadyInTeam, setAlreadyInTeam] = useState(false);
  const [teamFull, setTeamFull] = useState(false);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!code) { setLoading(false); return; }

      const supabase = createClient();

      // Find team by invite code
      const { data: teamData } = await supabase
        .from('teams')
        .select('*')
        .eq('invite_code', code)
        .single();

      if (!teamData) {
        setTeam(null);
        setLoading(false);
        return;
      }

      setTeam(teamData as Team);

      // Get member count
      const { count } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', teamData.id);

      setMemberCount(count || 0);
      setTeamFull((count || 0) >= 5);

      // Check if current user is already in a team
      if (user) {
        const { data: existing } = await supabase
          .from('team_members')
          .select('id')
          .eq('user_id', user.id)
          .single();

        setAlreadyInTeam(!!existing);
      }

      setLoading(false);
    };

    if (!authLoading) {
      fetchTeam();
    }
  }, [code, user, authLoading]);

  const handleJoin = async () => {
    if (!team || !user) return;
    setJoining(true);
    setError('');

    const supabase = createClient();
    const { error: joinError } = await supabase
      .from('team_members')
      .insert({ team_id: team.id, user_id: user.id });

    if (joinError) {
      if (joinError.message.includes('policy')) {
        setError('No es posible unirse. El equipo puede estar lleno o ya eres parte de otro equipo.');
      } else {
        setError('Error al unirse al equipo.');
      }
      setJoining(false);
      return;
    }

    navigate('/dashboard');
  };

  if (loading || authLoading) {
    return (
      <div className="invite-page">
        <div className="invite-card">
          <p style={{ color: '#999' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="invite-page">
        <div className="invite-card">
          <h2 className="invite-team-name">Invitacion no valida</h2>
          <p className="invite-subtitle">Este codigo de invitacion no existe o ha expirado.</p>
          <button className="dashboard-btn dashboard-btn--secondary" onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (isCompetitionStarted()) {
    return (
      <div className="invite-page">
        <div className="invite-card">
          <h2 className="invite-team-name">{team.name}</h2>
          <p className="invite-subtitle">El registro de equipos ha cerrado. La competencia ya inicio.</p>
          <button className="dashboard-btn dashboard-btn--secondary" onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    const handleLoginFromInvite = () => {
      if (code) {
        localStorage.setItem('pendingInviteCode', code);
      }
      signInWithGitHub();
    };

    return (
      <div className="invite-page">
        <div className="invite-card">
          <h2 className="invite-team-name">{team.name}</h2>
          <p className="invite-subtitle">Te han invitado a unirte a este equipo. Inicia sesion para continuar.</p>
          <button className="dashboard-btn dashboard-btn--primary" onClick={handleLoginFromInvite}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            Iniciar sesion con GitHub
          </button>
        </div>
      </div>
    );
  }

  if (alreadyInTeam) {
    return (
      <div className="invite-page">
        <div className="invite-card">
          <h2 className="invite-team-name">{team.name}</h2>
          <p className="invite-subtitle">Ya eres parte de un equipo. Solo puedes estar en un equipo a la vez.</p>
          <button className="dashboard-btn dashboard-btn--secondary" onClick={() => navigate('/dashboard')}>
            Ir al dashboard
          </button>
        </div>
      </div>
    );
  }

  if (teamFull) {
    return (
      <div className="invite-page">
        <div className="invite-card">
          <h2 className="invite-team-name">{team.name}</h2>
          <p className="invite-subtitle">Este equipo ya tiene el maximo de 5 miembros.</p>
          <button className="dashboard-btn dashboard-btn--secondary" onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="invite-page">
      <div className="invite-card">
        <h2 className="invite-team-name">{team.name}</h2>
        <p className="invite-subtitle">
          Te han invitado a unirte a este equipo ({memberCount}/5 miembros).
        </p>
        {error && <p className="dashboard-error" style={{ marginBottom: '1rem' }}>{error}</p>}
        <button className="dashboard-btn dashboard-btn--primary" onClick={handleJoin} disabled={joining}>
          {joining ? 'Uniendose...' : 'Unirme al equipo'}
        </button>
      </div>
    </div>
  );
}
