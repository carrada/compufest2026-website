'use client';

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthProvider';
import { createClient } from '@/lib/supabase/client';

const COMPETITION_START = new Date('2026-04-20T15:00:00Z');
function isCompetitionStarted() {
  return new Date() >= COMPETITION_START;
}

type Phase = 'checking' | 'needs_login' | 'ready' | 'submitting';

export function CreateTeamWithCodeRoute() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const navigate = useNavigate();
  const { user, loading: authLoading, signInWithGitHub } = useAuth();

  const [phase, setPhase] = useState<Phase>('checking');
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState('');

  // Mount validation: silent redirect if anything is off.
  useEffect(() => {
    if (authLoading) return;

    // No code, or competition already started → silent redirect
    if (!code || isCompetitionStarted()) {
      navigate('/dashboard', { replace: true });
      return;
    }

    // Not authenticated → present minimal login UI
    if (!user) {
      setPhase('needs_login');
      return;
    }

    let cancelled = false;
    const validate = async () => {
      const supabase = createClient();

      // Already in a team → silent redirect
      const { data: existing } = await supabase
        .from('team_members')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (cancelled) return;
      if (existing) {
        navigate('/dashboard', { replace: true });
        return;
      }

      // Validate the code
      const { data: valid, error: rpcError } = await supabase.rpc(
        'validate_team_creation_code',
        { p_code: code },
      );

      if (cancelled) return;
      if (rpcError || !valid) {
        navigate('/dashboard', { replace: true });
        return;
      }

      setPhase('ready');
    };

    validate();
    return () => { cancelled = true; };
  }, [authLoading, user, code, navigate]);

  const handleLogin = () => {
    if (code) {
      localStorage.setItem('pendingCreationCode', code);
    }
    signInWithGitHub();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !code) return;
    setPhase('submitting');
    setError('');

    const supabase = createClient();
    const { error: rpcError } = await supabase.rpc('create_team_with_code', {
      p_name: teamName.trim(),
      p_code: code,
    });

    if (rpcError) {
      const map: Record<string, string> = {
        codigo_invalido: 'El código no es válido.',
        codigo_usado: 'Este código ya fue utilizado.',
        nombre_duplicado: 'Ese nombre de equipo ya existe.',
        nombre_requerido: 'Debes ingresar un nombre.',
        ya_en_equipo: 'Ya eres miembro de un equipo.',
        not_authenticated: 'Sesión expirada. Inicia sesión de nuevo.',
      };
      const key = Object.keys(map).find((k) => rpcError.message.includes(k));
      setError(key ? map[key] : 'No se pudo crear el equipo. Intenta de nuevo.');
      setPhase('ready');
      return;
    }

    navigate('/dashboard');
  };

  if (phase === 'checking' || authLoading) {
    return (
      <div className="dashboard">
        <div className="dashboard-container">
          <div className="dashboard-message">
            <p>Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'needs_login') {
    return (
      <div className="dashboard">
        <div className="dashboard-container">
          <div className="dashboard-message">
            <h2 className="dashboard-message-title">Continuar</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Inicia sesión con GitHub para continuar.
            </p>
            <button
              className="dashboard-btn dashboard-btn--primary"
              onClick={handleLogin}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              Iniciar sesión con GitHub
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h1 className="dashboard-title">Crear equipo</h1>
        <div className="dashboard-card">
          <form onSubmit={handleSubmit}>
            <div className="dashboard-form-group">
              <label className="dashboard-label">Nombre del equipo</label>
              <input
                className="dashboard-input"
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Nombre del equipo"
                required
                autoFocus
              />
            </div>

            {error && <p className="dashboard-error">{error}</p>}

            <button
              className="dashboard-btn dashboard-btn--primary dashboard-btn--full"
              type="submit"
              disabled={phase === 'submitting' || !teamName.trim()}>
              {phase === 'submitting' ? 'Creando...' : 'Crear equipo'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
