'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import type { Profile, Team, TeamMember } from '@/lib/types';

export function DashboardRoute() {
  const { user, profile, loading, signInWithGitHub, refreshProfile } = useAuth();

  if (loading) {
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

  if (!user) {
    return <LoginPrompt onLogin={signInWithGitHub} />;
  }

  if (!profile?.first_name || !profile?.last_name) {
    return <ProfileForm profile={profile} onSaved={refreshProfile} />;
  }

  return <DashboardContent profile={profile} />;
}

// ─── Login Prompt ───────────────────────────────────────────

function LoginPrompt({ onLogin }: { onLogin: () => Promise<void> }) {
  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-message">
          <h2 className="dashboard-message-title">Hackathon WeirdUI[1]</h2>
          <p style={{ marginBottom: '1.5rem' }}>Inicia sesion con GitHub para registrarte y gestionar tu equipo.</p>
          <button className="dashboard-btn dashboard-btn--primary" onClick={onLogin}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            Iniciar sesion con GitHub
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Form ───────────────────────────────────────────

function ProfileForm({ profile, onSaved }: { profile: Profile | null; onSaved: () => Promise<void> }) {
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    setSaving(true);
    setError('');

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ first_name: firstName.trim(), last_name: lastName.trim() })
      .eq('id', profile?.id);

    if (updateError) {
      setError('Error al guardar el perfil. Intenta de nuevo.');
      setSaving(false);
      return;
    }

    await onSaved();
    setSaving(false);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="profile-form-header">
          {profile?.avatar_url && (
            <img src={profile.avatar_url} alt="" className="profile-form-avatar" />
          )}
          <div>
            <h1 className="dashboard-title" style={{ marginBottom: '0.15rem' }}>Completa tu perfil</h1>
            <p className="profile-form-subtitle">
              {profile?.github_username && `@${profile.github_username}`}
            </p>
          </div>
        </div>

        <div className="dashboard-card">
          <form onSubmit={handleSubmit}>
            <div className="profile-form-grid">
              <div className="dashboard-form-group">
                <label className="dashboard-label">Nombre</label>
                <input
                  className="dashboard-input"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div className="dashboard-form-group">
                <label className="dashboard-label">Apellido</label>
                <input
                  className="dashboard-input"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Tu apellido"
                  required
                />
              </div>
            </div>

            <div className="profile-form-readonly">
              <div className="profile-form-readonly-item">
                <span className="profile-form-readonly-label">email</span>
                <span className="profile-form-readonly-value">{profile?.email || '—'}</span>
              </div>
              <div className="profile-form-readonly-item">
                <span className="profile-form-readonly-label">github</span>
                <span className="profile-form-readonly-value">
                  {profile?.github_username ? `@${profile.github_username}` : '—'}
                </span>
              </div>
            </div>

            {error && <p className="dashboard-error">{error}</p>}
            <button className="dashboard-btn dashboard-btn--primary dashboard-btn--full" type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar perfil'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Content ──────────────────────────────────────

function DashboardContent({ profile }: { profile: Profile }) {
  const supabase = createClient();
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<(TeamMember & { profile: Profile })[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [pendingInviteStatus, setPendingInviteStatus] = useState<string | null>(null);

  // Auto-join from pending invite
  useEffect(() => {
    const processPendingInvite = async () => {
      const pendingCode = localStorage.getItem('pendingInviteCode');
      if (!pendingCode) return;

      localStorage.removeItem('pendingInviteCode');

      // Check if already in a team
      const { data: existing } = await supabase
        .from('team_members')
        .select('id')
        .eq('user_id', profile.id)
        .single();

      if (existing) {
        setPendingInviteStatus('Ya eres parte de un equipo.');
        return;
      }

      // Find team by invite code
      const { data: teamData } = await supabase
        .from('teams')
        .select('id, name')
        .eq('invite_code', pendingCode)
        .single();

      if (!teamData) {
        setPendingInviteStatus('El codigo de invitacion no es valido.');
        return;
      }

      // Check team capacity
      const { count } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', teamData.id);

      if ((count || 0) >= 5) {
        setPendingInviteStatus(`El equipo ${teamData.name} ya esta lleno.`);
        return;
      }

      // Join the team
      const { error: joinError } = await supabase
        .from('team_members')
        .insert({ team_id: teamData.id, user_id: profile.id });

      if (joinError) {
        setPendingInviteStatus('Error al unirse al equipo.');
        return;
      }

      setPendingInviteStatus(`Te has unido a ${teamData.name}`);
      fetchTeamData();
    };

    processPendingInvite();
  }, [supabase, profile.id]);

  const fetchTeamData = useCallback(async () => {
    setLoadingTeam(true);

    // Find user's team membership
    const { data: membership } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', profile.id)
      .single();

    if (!membership) {
      setTeam(null);
      setMembers([]);
      setLoadingTeam(false);
      return;
    }

    // Fetch team
    const { data: teamData } = await supabase
      .from('teams')
      .select('*')
      .eq('id', membership.team_id)
      .single();

    setTeam(teamData as Team | null);

    // Fetch members with profiles
    const { data: membersData } = await supabase
      .from('team_members')
      .select('*, profile:profiles(*)')
      .eq('team_id', membership.team_id);

    setMembers((membersData || []) as (TeamMember & { profile: Profile })[]);
    setLoadingTeam(false);
  }, [supabase, profile.id]);

  useEffect(() => {
    fetchTeamData();
  }, [fetchTeamData]);

  // Subscribe to realtime changes on team_members
  useEffect(() => {
    if (!team) return;
    const channel = supabase
      .channel('team-members-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'team_members',
        filter: `team_id=eq.${team.id}`,
      }, () => {
        fetchTeamData();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase, team, fetchTeamData]);

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h1 className="dashboard-title">Dashboard</h1>

        {/* Pending invite status */}
        {pendingInviteStatus && (
          <div className="dashboard-card" style={{ borderColor: pendingInviteStatus.includes('unido') ? 'rgba(38, 217, 104, 0.4)' : 'rgba(239, 68, 68, 0.3)' }}>
            <p style={{ color: pendingInviteStatus.includes('unido') ? '#26D968' : '#ccc', fontSize: '0.95rem', margin: 0 }}>
              {pendingInviteStatus}
            </p>
          </div>
        )}

        {/* Profile Section */}
        <ProfileSection profile={profile} />

        {/* Team Section */}
        {loadingTeam ? (
          <div className="dashboard-card">
            <p style={{ color: '#bbb', fontSize: '0.9rem' }}>Cargando equipo...</p>
          </div>
        ) : team ? (
          <TeamView
            team={team}
            members={members}
            profile={profile}
            onTeamUpdated={fetchTeamData}
          />
        ) : (
          <NoTeam profile={profile} onTeamCreated={fetchTeamData} />
        )}

        {/* Admin Section */}
        {profile.role === 'admin' && <AdminSection />}

        {/* Judge Section */}
        {profile.role === 'judge' && <JudgeSection />}
      </div>
    </div>
  );
}

// ─── Profile Section ────────────────────────────────────────

function ProfileSection({ profile }: { profile: Profile }) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-profile-header">
        {profile.avatar_url && (
          <img src={profile.avatar_url} alt={profile.first_name || ''} className="dashboard-profile-avatar" />
        )}
        <div className="dashboard-profile-info">
          <p className="dashboard-profile-name">{profile.first_name} {profile.last_name}</p>
          <p className="dashboard-profile-meta">{profile.email}</p>
          <p className="dashboard-profile-meta">@{profile.github_username}</p>
        </div>
        <span className="dashboard-badge">{profile.role}</span>
      </div>
    </div>
  );
}

// ─── No Team ────────────────────────────────────────────────

function NoTeam({ profile, onTeamCreated }: { profile: Profile; onTeamCreated: () => void }) {
  const [teamName, setTeamName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    setCreating(true);
    setError('');

    const supabase = createClient();
    const { error: createError } = await supabase
      .from('teams')
      .insert({ name: teamName.trim(), created_by: profile.id });

    if (createError) {
      setError(createError.message.includes('unique') ? 'Ese nombre de equipo ya existe.' : 'Error al crear el equipo.');
      setCreating(false);
      return;
    }

    onTeamCreated();
    setCreating(false);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setJoining(true);
    setError('');

    const supabase = createClient();

    // Find team by invite code
    const { data: teamData } = await supabase
      .from('teams')
      .select('id')
      .eq('invite_code', inviteCode.trim())
      .single();

    if (!teamData) {
      setError('Codigo de invitacion no valido.');
      setJoining(false);
      return;
    }

    const { error: joinError } = await supabase
      .from('team_members')
      .insert({ team_id: teamData.id, user_id: profile.id });

    if (joinError) {
      if (joinError.message.includes('unique')) {
        setError('Ya eres miembro de este equipo.');
      } else if (joinError.message.includes('policy')) {
        setError('No puedes unirte. El equipo puede estar lleno o ya estas en otro equipo.');
      } else {
        setError('Error al unirse al equipo.');
      }
      setJoining(false);
      return;
    }

    onTeamCreated();
    setJoining(false);
  };

  return (
    <div className="dashboard-card">
      <h3 className="dashboard-card-title">Mi equipo</h3>
      <p style={{ color: '#bbb', fontSize: '0.95rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
        No eres parte de ningun equipo. Crea uno o unete con un codigo de invitacion.
      </p>

      <form onSubmit={handleCreate}>
        <div className="dashboard-row">
          <div>
            <label className="dashboard-label">Crear equipo</label>
            <input
              className="dashboard-input"
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Nombre del equipo"
              required
            />
          </div>
          <button className="dashboard-btn dashboard-btn--primary" type="submit" disabled={creating}>
            {creating ? '...' : 'Crear'}
          </button>
        </div>
      </form>

      <hr className="dashboard-section-divider" />

      <form onSubmit={handleJoin}>
        <div className="dashboard-row">
          <div>
            <label className="dashboard-label">Unirse con codigo</label>
            <input
              className="dashboard-input"
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Codigo de invitacion"
              required
            />
          </div>
          <button className="dashboard-btn dashboard-btn--secondary" type="submit" disabled={joining}>
            {joining ? '...' : 'Unirse'}
          </button>
        </div>
      </form>

      {error && <p className="dashboard-error">{error}</p>}
    </div>
  );
}

// ─── Team View ──────────────────────────────────────────────

function ConfirmModal({
  open,
  title,
  message,
  confirmText,
  onConfirm,
  onCancel,
  loading,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="dashboard-btn dashboard-btn--secondary" onClick={onCancel} type="button">
            Cancelar
          </button>
          <button className="dashboard-btn dashboard-btn--danger" onClick={onConfirm} disabled={loading} type="button">
            {loading ? 'Saliendo...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function TeamView({
  team,
  members,
  profile,
  onTeamUpdated,
}: {
  team: Team;
  members: (TeamMember & { profile: Profile })[];
  profile: Profile;
  onTeamUpdated: () => void;
}) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const inviteUrl = `${window.location.origin}/invite/${team.invite_code}`;
  const isCreator = team.created_by === profile.id;

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(team.invite_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleLeave = async () => {
    setLeaving(true);
    const supabase = createClient();
    await supabase.from('team_members').delete().eq('team_id', team.id).eq('user_id', profile.id);
    onTeamUpdated();
    setLeaving(false);
    setShowLeaveModal(false);
  };

  return (
    <div className="dashboard-card">
      <h3 className="dashboard-card-title" style={{ fontSize: '1.4rem' }}>{team.name}</h3>
      <p className="dashboard-capacity">{members.length}/5 miembros</p>

      {members.length < 5 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div className="dashboard-invite-box" style={{ marginBottom: '0.5rem' }}>
            <span className="dashboard-invite-url">{inviteUrl}</span>
            <button className="dashboard-btn dashboard-btn--secondary dashboard-btn--small" onClick={handleCopyUrl}>
              {copiedUrl ? 'Copiado!' : 'Copiar URL'}
            </button>
          </div>
          <div className="dashboard-invite-box">
            <span style={{ color: '#ccc', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', flex: 1, letterSpacing: '0.05em' }}>{team.invite_code}</span>
            <button className="dashboard-btn dashboard-btn--secondary dashboard-btn--small" onClick={handleCopyCode}>
              {copiedCode ? 'Copiado!' : 'Copiar codigo'}
            </button>
          </div>
        </div>
      )}

      <ul className="dashboard-member-list">
        {members.map((m) => (
          <li key={m.id} className="dashboard-member-item">
            {m.profile?.avatar_url && (
              <img src={m.profile.avatar_url} alt={m.profile.first_name || ''} className="dashboard-member-avatar" />
            )}
            <div>
              <p className="dashboard-member-name">
                {m.profile?.first_name} {m.profile?.last_name}
                {m.user_id === team.created_by && <span style={{ color: '#26D968', marginLeft: '0.4rem', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace" }}>creador</span>}
              </p>
              <p className="dashboard-member-gh">@{m.profile?.github_username}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="dashboard-actions">
        <button className="dashboard-btn dashboard-btn--danger dashboard-btn--small" onClick={() => setShowLeaveModal(true)} disabled={leaving}>
          Salir del equipo
        </button>
      </div>

      <ConfirmModal
        open={showLeaveModal}
        title="Salir del equipo"
        message={isCreator
          ? 'Al salir del equipo, si eres el unico miembro, el equipo seguira existiendo. ¿Deseas continuar?'
          : '¿Seguro que quieres salir del equipo?'}
        confirmText="Salir"
        onConfirm={handleLeave}
        onCancel={() => setShowLeaveModal(false)}
        loading={leaving}
      />
    </div>
  );
}

// ─── Admin Section ──────────────────────────────────────────

function AdminSection() {
  const supabase = createClient();
  const [teams, setTeams] = useState<(Team & { members: (TeamMember & { profile: Profile })[] })[]>([]);
  const [loadingAdmin, setLoadingAdmin] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      const { data: teamsData } = await supabase.from('teams').select('*').order('created_at');

      if (!teamsData) { setLoadingAdmin(false); return; }

      const teamsWithMembers = await Promise.all(
        teamsData.map(async (t) => {
          const { data: membersData } = await supabase
            .from('team_members')
            .select('*, profile:profiles(*)')
            .eq('team_id', t.id);
          return { ...t, members: (membersData || []) as (TeamMember & { profile: Profile })[] };
        })
      );

      setTeams(teamsWithMembers as (Team & { members: (TeamMember & { profile: Profile })[] })[]);
      setLoadingAdmin(false);
    };
    fetchAll();
  }, [supabase]);

  const exportCSV = () => {
    const rows = [['equipo', 'nombre', 'apellido', 'email', 'github_username']];
    teams.forEach((t) => {
      t.members.forEach((m) => {
        rows.push([
          t.name,
          m.profile?.first_name || '',
          m.profile?.last_name || '',
          m.profile?.email || '',
          m.profile?.github_username || '',
        ]);
      });
    });
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compufest-equipos.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loadingAdmin) return null;

  const totalMembers = teams.reduce((sum, t) => sum + t.members.length, 0);

  const filtered = search.trim()
    ? teams.filter((t) => {
        const q = search.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.invite_code.toLowerCase().includes(q) ||
          t.members.some(
            (m) =>
              m.profile?.first_name?.toLowerCase().includes(q) ||
              m.profile?.last_name?.toLowerCase().includes(q) ||
              m.profile?.github_username?.toLowerCase().includes(q) ||
              m.profile?.email?.toLowerCase().includes(q)
          )
        );
      })
    : teams;

  return (
    <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid #222' }}>
        <div>
          <h3 className="dashboard-card-title" style={{ margin: 0 }}>Equipos registrados</h3>
          <p style={{ color: '#999', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', margin: '0.2rem 0 0' }}>
            {teams.length} equipo{teams.length !== 1 ? 's' : ''} · {totalMembers} participante{totalMembers !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="dashboard-btn dashboard-btn--secondary dashboard-btn--small" onClick={exportCSV} style={{ flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          CSV
        </button>
      </div>

      {/* Search */}
      {teams.length > 2 && (
        <div style={{ padding: '1rem 1.5rem 0' }}>
          <input
            className="dashboard-input"
            type="text"
            placeholder="Buscar equipo, nombre o GitHub..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Team list */}
      {teams.length === 0 ? (
        <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#bbb', fontSize: '0.95rem', margin: 0 }}>No hay equipos registrados.</p>
        </div>
      ) : (
        <div style={{ maxHeight: '65vh', overflowY: 'auto', padding: '0.75rem' }}>
          {filtered.map((t, i) => (
            <div key={t.id} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '1rem 1.15rem', marginBottom: i < filtered.length - 1 ? '0.75rem' : 0 }}>
              {/* Team header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div>
                  <p style={{ color: '#fff', fontFamily: "'Red Hat Display', sans-serif", fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>{t.name}</p>
                  <span style={{ color: '#555', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem' }}>{t.invite_code}</span>
                </div>
                <span style={{ color: '#bbb', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '5px', flexShrink: 0 }}>
                  {t.members.length}/5
                </span>
              </div>

              {/* Members */}
              <ul className="dashboard-member-list">
                {t.members.map((m) => (
                  <li key={m.id} className="dashboard-member-item">
                    {m.profile?.avatar_url && (
                      <img src={m.profile.avatar_url} alt="" className="dashboard-member-avatar" />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="dashboard-member-name">
                        {m.profile?.first_name} {m.profile?.last_name}
                        {m.user_id === t.created_by && <span style={{ color: '#26D968', marginLeft: '0.35rem', fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace" }}>creador</span>}
                      </p>
                      <p className="dashboard-member-gh">@{m.profile?.github_username}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Repo */}
              {t.repository_url && (
                <a href={t.repository_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#26D968', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', marginTop: '0.6rem', textDecoration: 'none' }}>
                  {t.repository_url.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
          ))}

          {search && filtered.length === 0 && (
            <p style={{ color: '#999', fontSize: '0.9rem', padding: '1rem', textAlign: 'center', margin: 0 }}>Sin resultados para "{search}"</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Judge Section ──────────────────────────────────────────

function JudgeSection() {
  const supabase = createClient();
  const [teams, setTeams] = useState<(Team & { members: (TeamMember & { profile: Profile })[] })[]>([]);
  const [loadingJudge, setLoadingJudge] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const { data: teamsData } = await supabase.from('teams').select('*').order('name');

      if (!teamsData) { setLoadingJudge(false); return; }

      const teamsWithMembers = await Promise.all(
        teamsData.map(async (t) => {
          const { data: membersData } = await supabase
            .from('team_members')
            .select('*, profile:profiles(*)')
            .eq('team_id', t.id);
          return { ...t, members: (membersData || []) as (TeamMember & { profile: Profile })[] };
        })
      );

      setTeams(teamsWithMembers as (Team & { members: (TeamMember & { profile: Profile })[] })[]);
      setLoadingJudge(false);
    };
    fetchAll();
  }, [supabase]);

  if (loadingJudge) return null;

  return (
    <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #222' }}>
        <h3 className="dashboard-card-title" style={{ margin: 0 }}>Equipos participantes</h3>
      </div>

      {teams.length === 0 ? (
        <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#bbb', fontSize: '0.95rem', margin: 0 }}>No hay equipos registrados.</p>
        </div>
      ) : (
        <div style={{ maxHeight: '65vh', overflowY: 'auto', padding: '0.75rem' }}>
          {teams.map((t, i) => (
            <div key={t.id} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '1rem 1.15rem', marginBottom: i < teams.length - 1 ? '0.75rem' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <p style={{ color: '#fff', fontFamily: "'Red Hat Display', sans-serif", fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>{t.name}</p>
                <span style={{ color: '#bbb', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '5px' }}>
                  {t.members.length}/5
                </span>
              </div>
              {t.repository_url && (
                <a href={t.repository_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#26D968', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', marginBottom: '0.6rem', textDecoration: 'none' }}>
                  {t.repository_url.replace(/^https?:\/\//, '')}
                </a>
              )}
              <ul className="dashboard-member-list">
                {t.members.map((m) => (
                  <li key={m.id} className="dashboard-member-item">
                    {m.profile?.avatar_url && (
                      <img src={m.profile.avatar_url} alt="" className="dashboard-member-avatar" />
                    )}
                    <div>
                      <p className="dashboard-member-name">{m.profile?.first_name} {m.profile?.last_name}</p>
                      <p className="dashboard-member-gh">@{m.profile?.github_username}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
