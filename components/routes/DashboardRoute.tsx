"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Team, TeamMember, TeamCreationCode } from "@/lib/types";

// Competition starts April 20, 2026 at 9:00 AM CDMX (UTC-6)
const COMPETITION_START = new Date("2026-04-20T15:00:00Z");
function isCompetitionStarted() {
  return new Date() >= COMPETITION_START;
}

const CODE_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateRandomCode(length = 12): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return out;
}

type ViewAs = "admin" | "judge" | "participant";

function readStoredViewAs(realRole: Profile["role"]): ViewAs {
  if (realRole !== "admin") return realRole;
  if (typeof window === "undefined") return "admin";
  const stored = localStorage.getItem("dashboard-view-as");
  if (stored === "admin" || stored === "judge" || stored === "participant") {
    return stored;
  }
  return "admin";
}

export function DashboardRoute() {
  const { user, profile, loading, signInWithGitHub, refreshProfile } =
    useAuth();

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
          <p style={{ marginBottom: "1.5rem" }}>
            Inicia sesion con GitHub para registrarte y gestionar tu equipo.
          </p>
          <button
            className="dashboard-btn dashboard-btn--primary"
            onClick={onLogin}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            Iniciar sesion con GitHub
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Form ───────────────────────────────────────────

function ProfileForm({
  profile,
  onSaved,
}: {
  profile: Profile | null;
  onSaved: () => Promise<void>;
}) {
  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    setSaving(true);
    setError("");

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ first_name: firstName.trim(), last_name: lastName.trim() })
      .eq("id", profile?.id);

    if (updateError) {
      setError("Error al guardar el perfil. Intenta de nuevo.");
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
            <img
              src={profile.avatar_url}
              alt=""
              className="profile-form-avatar"
            />
          )}
          <div>
            <h1 className="dashboard-title" style={{ marginBottom: "0.15rem" }}>
              Completa tu perfil
            </h1>
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
                <span className="profile-form-readonly-value">
                  {profile?.email || "—"}
                </span>
              </div>
              <div className="profile-form-readonly-item">
                <span className="profile-form-readonly-label">github</span>
                <span className="profile-form-readonly-value">
                  {profile?.github_username
                    ? `@${profile.github_username}`
                    : "—"}
                </span>
              </div>
            </div>

            {error && <p className="dashboard-error">{error}</p>}
            <button
              className="dashboard-btn dashboard-btn--primary dashboard-btn--full"
              type="submit"
              disabled={saving}>
              {saving ? "Guardando..." : "Guardar perfil"}
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
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<(TeamMember & { profile: Profile })[]>(
    [],
  );
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [pendingInviteStatus, setPendingInviteStatus] = useState<string | null>(
    null,
  );

  // View-switcher (admins only). Only affects rendering, never queries.
  const [viewAs, setViewAsState] = useState<ViewAs>(profile.role);
  useEffect(() => {
    setViewAsState(readStoredViewAs(profile.role));
  }, [profile.role]);
  const setViewAs = useCallback(
    (next: ViewAs) => {
      if (profile.role !== "admin") return;
      localStorage.setItem("dashboard-view-as", next);
      setViewAsState(next);
    },
    [profile.role],
  );
  const effectiveRole: Profile["role"] =
    profile.role === "admin" ? viewAs : profile.role;

  // Post-OAuth: if user came from /dashboard/crear-equipo, redirect back.
  // Runs before other effects so we leave this route quickly.
  useEffect(() => {
    const pendingCode = localStorage.getItem("pendingCreationCode");
    if (!pendingCode) return;
    localStorage.removeItem("pendingCreationCode");
    navigate(`/dashboard/crear-equipo?code=${encodeURIComponent(pendingCode)}`, {
      replace: true,
    });
  }, [navigate]);

  // Auto-join from pending invite
  useEffect(() => {
    const processPendingInvite = async () => {
      const pendingCode = localStorage.getItem("pendingInviteCode");
      if (!pendingCode) return;

      localStorage.removeItem("pendingInviteCode");

      // Check if already in a team
      const { data: existing } = await supabase
        .from("team_members")
        .select("id")
        .eq("user_id", profile.id)
        .single();

      if (existing) {
        setPendingInviteStatus("Ya eres parte de un equipo.");
        return;
      }

      // Find team by invite code
      const { data: teamData } = await supabase
        .from("teams")
        .select("id, name")
        .eq("invite_code", pendingCode)
        .single();

      if (!teamData) {
        setPendingInviteStatus("El codigo de invitacion no es valido.");
        return;
      }

      // Check team capacity
      const { count } = await supabase
        .from("team_members")
        .select("*", { count: "exact", head: true })
        .eq("team_id", teamData.id);

      if ((count || 0) >= 5) {
        setPendingInviteStatus(`El equipo ${teamData.name} ya esta lleno.`);
        return;
      }

      // Join the team
      const { error: joinError } = await supabase
        .from("team_members")
        .insert({ team_id: teamData.id, user_id: profile.id });

      if (joinError) {
        setPendingInviteStatus("Error al unirse al equipo.");
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
      .from("team_members")
      .select("team_id")
      .eq("user_id", profile.id)
      .single();

    if (!membership) {
      setTeam(null);
      setMembers([]);
      setLoadingTeam(false);
      return;
    }

    // Fetch team
    const { data: teamData } = await supabase
      .from("teams")
      .select("*")
      .eq("id", membership.team_id)
      .single();

    setTeam(teamData as Team | null);

    // Fetch members with profiles
    const { data: membersData } = await supabase
      .from("team_members")
      .select("*, profile:profiles(*)")
      .eq("team_id", membership.team_id);

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
      .channel("team-members-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "team_members",
          filter: `team_id=eq.${team.id}`,
        },
        () => {
          fetchTeamData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, team, fetchTeamData]);

  const isPreviewing = profile.role === "admin" && viewAs !== "admin";
  const viewLabel: Record<ViewAs, string> = {
    admin: "admin",
    judge: "juez",
    participant: "participante",
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h1 className="dashboard-title">Dashboard</h1>

        {/* View-as banner (admins previewing as another role) */}
        {isPreviewing && (
          <div
            className="dashboard-card"
            style={{
              borderColor: "rgba(234, 179, 8, 0.4)",
              background: "rgba(234, 179, 8, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              flexWrap: "wrap",
            }}>
            <p style={{ color: "#eab308", fontSize: "0.9rem", margin: 0, lineHeight: "1.4" }}>
              Estás viendo el dashboard como <strong>{viewLabel[viewAs]}</strong>.
              Tus permisos reales siguen siendo <strong>{profile.role}</strong>.
            </p>
            <button
              className="dashboard-btn dashboard-btn--secondary dashboard-btn--small"
              onClick={() => setViewAs("admin")}>
              Volver a vista admin
            </button>
          </div>
        )}

        {/* Pending invite status */}
        {pendingInviteStatus && (
          <div
            className="dashboard-card"
            style={{
              borderColor: pendingInviteStatus.includes("unido")
                ? "rgba(38, 217, 104, 0.4)"
                : "rgba(239, 68, 68, 0.3)",
            }}>
            <p
              style={{
                color: pendingInviteStatus.includes("unido")
                  ? "#26D968"
                  : "#ccc",
                fontSize: "0.95rem",
                margin: 0,
              }}>
              {pendingInviteStatus}
            </p>
          </div>
        )}

        {/* Profile Section */}
        <ProfileSection profile={profile} viewAs={viewAs} setViewAs={setViewAs} />

        {/* Team Section (judges don't participate in teams) */}
        {effectiveRole === 'judge' ? (
          <div className="dashboard-card">
            <h3 className="dashboard-card-title">Mi equipo</h3>
            <p style={{ color: '#999', fontSize: '0.95rem', margin: 0, lineHeight: '1.5' }}>
              Como juez no participas en equipos. Tu rol es evaluar los proyectos.
            </p>
          </div>
        ) : loadingTeam ? (
          <div className="dashboard-card">
            <p style={{ color: "#bbb", fontSize: "0.9rem" }}>
              Cargando equipo...
            </p>
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
        {effectiveRole === "admin" && <AdminSection />}

        {/* Judge Section */}
        {effectiveRole === "judge" && <JudgeSection />}
      </div>
    </div>
  );
}

// ─── Profile Section ────────────────────────────────────────

function ProfileSection({
  profile,
  viewAs,
  setViewAs,
}: {
  profile: Profile;
  viewAs: ViewAs;
  setViewAs: (next: ViewAs) => void;
}) {
  const isAdmin = profile.role === "admin";
  return (
    <div className="dashboard-card">
      <div className="dashboard-profile-header">
        {profile.avatar_url && (
          <img
            src={profile.avatar_url}
            alt={profile.first_name || ""}
            className="dashboard-profile-avatar"
          />
        )}
        <div className="dashboard-profile-info">
          <p className="dashboard-profile-name">
            {profile.first_name} {profile.last_name}
          </p>
          <p className="dashboard-profile-meta">{profile.email}</p>
          <p className="dashboard-profile-meta">@{profile.github_username}</p>
        </div>
        {isAdmin ? (
          <ViewAsSelect viewAs={viewAs} onChange={setViewAs} />
        ) : (
          <span className="dashboard-badge">{profile.role}</span>
        )}
      </div>
    </div>
  );
}

const VIEW_AS_OPTIONS: { value: ViewAs; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "judge", label: "Juez" },
  { value: "participant", label: "Partic." },
];

function ViewAsSelect({
  viewAs,
  onChange,
}: {
  viewAs: ViewAs;
  onChange: (next: ViewAs) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const isPreview = viewAs !== "admin";
  const accent = isPreview ? "#eab308" : "#26D968";
  const bgColor = isPreview ? "rgba(234,179,8,0.12)" : "rgba(38,217,104,0.12)";
  const borderColor = isPreview ? "rgba(234,179,8,0.5)" : "rgba(38,217,104,0.45)";
  const current = VIEW_AS_OPTIONS.find((o) => o.value === viewAs)!;

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title="Cambiar vista (solo admin)"
        style={{
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: "999px",
          color: accent,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.7rem",
          padding: "0.3rem 0.65rem",
          cursor: "pointer",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          outline: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          lineHeight: 1,
        }}>
        <span>{current.label}</span>
        <svg
          width="9"
          height="9"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          style={{
            transition: "transform 0.15s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}>
          <path d="M2 4l3 3 3-3" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 0.4rem)",
            backgroundColor: "#0a0a0a",
            border: "1px solid #222",
            borderRadius: "8px",
            padding: "0.25rem",
            display: "flex",
            flexDirection: "column",
            minWidth: "140px",
            zIndex: 50,
            boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
          }}>
          {VIEW_AS_OPTIONS.map((o) => {
            const isCurrent = o.value === viewAs;
            return (
              <button
                key={o.value}
                role="menuitem"
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                style={{
                  backgroundColor: isCurrent ? "rgba(255,255,255,0.05)" : "transparent",
                  border: "none",
                  color: isCurrent ? "#fff" : "#bbb",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.72rem",
                  padding: "0.45rem 0.65rem",
                  textAlign: "left",
                  borderRadius: "5px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "0.5rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}>
                <span>{o.value === "admin" ? "Admin (real)" : o.label}</span>
                {isCurrent && (
                  <span style={{ color: accent, fontSize: "0.7rem", lineHeight: 1 }}>●</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── No Team ────────────────────────────────────────────────

function NoTeam({
  profile,
  onTeamCreated,
}: {
  profile: Profile;
  onTeamCreated: () => void;
}) {
  const [inviteCode, setInviteCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setJoining(true);
    setError("");

    const supabase = createClient();

    // Find team by invite code
    const { data: teamData } = await supabase
      .from("teams")
      .select("id")
      .eq("invite_code", inviteCode.trim())
      .single();

    if (!teamData) {
      setError("Codigo de invitacion no valido.");
      setJoining(false);
      return;
    }

    const { error: joinError } = await supabase
      .from("team_members")
      .insert({ team_id: teamData.id, user_id: profile.id });

    if (joinError) {
      if (joinError.message.includes("unique")) {
        setError("Ya eres miembro de este equipo.");
      } else if (joinError.message.includes("policy")) {
        setError(
          "No puedes unirte. El equipo puede estar lleno o ya estas en otro equipo.",
        );
      } else {
        setError("Error al unirse al equipo.");
      }
      setJoining(false);
      return;
    }

    onTeamCreated();
    setJoining(false);
  };

  if (isCompetitionStarted()) {
    return (
      <div className="dashboard-card">
        <h3 className="dashboard-card-title">Mi equipo</h3>
        <p
          style={{
            color: "#999",
            fontSize: "0.95rem",
            margin: 0,
            lineHeight: "1.5",
          }}>
          El registro de equipos ha cerrado. La competencia ya inicio.
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <h3 className="dashboard-card-title">Mi equipo</h3>
      <p
        style={{
          color: "#bbb",
          fontSize: "0.95rem",
          marginBottom: "1.25rem",
          lineHeight: "1.5",
        }}>
        El cupo de equipos está completo. Si alguien te invitó a su equipo,
        ingresa el código de invitación aquí.
      </p>

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
          <button
            className="dashboard-btn dashboard-btn--secondary"
            type="submit"
            disabled={joining}>
            {joining ? "..." : "Unirse"}
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
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button
            className="dashboard-btn dashboard-btn--secondary"
            onClick={onCancel}
            type="button">
            Cancelar
          </button>
          <button
            className="dashboard-btn dashboard-btn--danger"
            onClick={onConfirm}
            disabled={loading}
            type="button">
            {loading ? "Saliendo..." : confirmText}
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
    await supabase
      .from("team_members")
      .delete()
      .eq("team_id", team.id)
      .eq("user_id", profile.id);
    onTeamUpdated();
    setLeaving(false);
    setShowLeaveModal(false);
  };

  return (
    <div className="dashboard-card">
      <h3 className="dashboard-card-title" style={{ fontSize: "1.4rem" }}>
        {team.name}
      </h3>
      <p className="dashboard-capacity">{members.length}/5 miembros</p>

      {members.length < 5 && !isCompetitionStarted() && (
        <div style={{ marginBottom: "1.25rem" }}>
          <div
            className="dashboard-invite-box"
            style={{ marginBottom: "0.5rem" }}>
            <span className="dashboard-invite-url">{inviteUrl}</span>
            <button
              className="dashboard-btn dashboard-btn--secondary dashboard-btn--small"
              onClick={handleCopyUrl}>
              {copiedUrl ? "Copiado!" : "Copiar URL"}
            </button>
          </div>
          <div className="dashboard-invite-box">
            <span
              style={{
                color: "#ccc",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.8rem",
                flex: 1,
                letterSpacing: "0.05em",
              }}>
              {team.invite_code}
            </span>
            <button
              className="dashboard-btn dashboard-btn--secondary dashboard-btn--small"
              onClick={handleCopyCode}>
              {copiedCode ? "Copiado!" : "Copiar codigo"}
            </button>
          </div>
        </div>
      )}

      <ul className="dashboard-member-list">
        {members.map((m) => (
          <li key={m.id} className="dashboard-member-item">
            {m.profile?.avatar_url && (
              <img
                src={m.profile.avatar_url}
                alt={m.profile.first_name || ""}
                className="dashboard-member-avatar"
              />
            )}
            <div>
              <p className="dashboard-member-name">
                {m.profile?.first_name} {m.profile?.last_name}
                {m.user_id === team.created_by && (
                  <span
                    style={{
                      color: "#26D968",
                      marginLeft: "0.4rem",
                      fontSize: "0.75rem",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                    creador
                  </span>
                )}
              </p>
              <p className="dashboard-member-gh">
                @{m.profile?.github_username}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Repository link (visible to team members when assigned) */}
      {team.repository_url && (
        <a
          href={team.repository_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            marginTop: "1rem",
            padding: "0.7rem 0.9rem",
            backgroundColor: "rgba(38,217,104,0.08)",
            border: "1px solid rgba(38,217,104,0.3)",
            borderRadius: "8px",
            color: "#26D968",
            textDecoration: "none",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.82rem",
            transition: "all 0.15s ease",
          }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}>
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
          <span
            style={{
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
            {team.repository_url.replace(/^https?:\/\//, "")}
          </span>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0, opacity: 0.7 }}>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      )}

      {!isCompetitionStarted() && (
        <div className="dashboard-actions">
          <button
            className="dashboard-btn dashboard-btn--danger dashboard-btn--small"
            onClick={() => setShowLeaveModal(true)}
            disabled={leaving}>
            Salir del equipo
          </button>
        </div>
      )}

      <ConfirmModal
        open={showLeaveModal}
        title="Salir del equipo"
        message={
          isCreator
            ? "Al salir del equipo, si eres el unico miembro, el equipo seguira existiendo. ¿Deseas continuar?"
            : "¿Seguro que quieres salir del equipo?"
        }
        confirmText="Salir"
        onConfirm={handleLeave}
        onCancel={() => setShowLeaveModal(false)}
        loading={leaving}
      />
    </div>
  );
}

// ─── Role Select ────────────────────────────────────────────

function RoleSelect({ userId, currentRole, isInTeam, onChanged }: { userId: string; currentRole: string; isInTeam: boolean; onChanged: () => void }) {
  const [saving, setSaving] = useState(false);

  // Admins cannot be demoted
  if (currentRole === 'admin') {
    return (
      <span style={{
        color: '#26D968',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
      }}>admin</span>
    );
  }

  const handleChange = async (newRole: string) => {
    if (newRole === currentRole) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    onChanged();
    setSaving(false);
  };

  return (
    <select
      value={currentRole}
      onChange={(e) => handleChange(e.target.value)}
      disabled={saving}
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid #333',
        borderRadius: '6px',
        color: currentRole === 'admin' ? '#26D968' : currentRole === 'judge' ? '#eab308' : '#bbb',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.7rem',
        padding: '0.2rem 0.4rem',
        cursor: 'pointer',
        flexShrink: 0,
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
        outline: 'none',
      }}
    >
      <option value="participant">Participant</option>
      {!isInTeam && <option value="judge">Judge</option>}
      {!isInTeam && <option value="admin">Admin</option>}
    </select>
  );
}

// ─── Code Manager Modal (admin only) ────────────────────────

type CodeRow = TeamCreationCode & {
  used_by_profile: Pick<Profile, "github_username"> | null;
  team: Pick<Team, "name"> | null;
};

function CodeManagerModal({ onClose }: { onClose: () => void }) {
  const supabase = createClient();
  const [codes, setCodes] = useState<CodeRow[]>([]);
  const [loadingCodes, setLoadingCodes] = useState(true);
  const [note, setNote] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  const fetchCodes = useCallback(async () => {
    setLoadingCodes(true);
    const { data, error: fetchError } = await supabase
      .from("team_creation_codes")
      .select(
        "code, note, used_by, used_at, team_id, created_at, used_by_profile:profiles!team_creation_codes_used_by_fkey(github_username), team:teams(name)",
      )
      .order("created_at", { ascending: false });
    if (fetchError) {
      setError("Error al cargar códigos.");
    } else {
      setCodes((data || []) as unknown as CodeRow[]);
      setError("");
    }
    setLoadingCodes(false);
  }, [supabase]);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    const newCode = generateRandomCode(12);
    const { error: insertError } = await supabase
      .from("team_creation_codes")
      .insert({ code: newCode, note: note.trim() || null });
    if (insertError) {
      setError("Error al crear el código. Intenta de nuevo.");
      setCreating(false);
      return;
    }
    setNote("");
    await fetchCodes();
    setCreating(false);
  };

  const handleCopy = async (code: string) => {
    const url = `${window.location.origin}/dashboard/crear-equipo?code=${code}`;
    await navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode((c) => (c === code ? null : c)), 1800);
  };

  const handleDelete = async (code: string) => {
    setDeletingCode(code);
    const { error: deleteError } = await supabase
      .from("team_creation_codes")
      .delete()
      .eq("code", code);
    if (deleteError) {
      setError("No se pudo eliminar el código.");
    } else {
      await fetchCodes();
    }
    setDeletingCode(null);
  };

  const available = codes.filter((c) => !c.used_by).length;
  const used = codes.length - available;

  const dividerStyle: React.CSSProperties = {
    height: "1px",
    backgroundColor: "rgba(255,255,255,0.06)",
    margin: 0,
    border: "none",
  };

  return (
    <div className="confirm-overlay" onClick={onClose}>
      <div
        className="confirm-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "min(620px, 92vw)",
          width: "620px",
          padding: 0,
          textAlign: "left",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
        {/* Header */}
        <div
          style={{
            padding: "1.1rem 1.35rem 0.95rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "0.5rem",
          }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3
              className="confirm-title"
              style={{ margin: 0, textAlign: "left", fontSize: "1.05rem" }}>
              Códigos de creación
            </h3>
            <div
              style={{
                display: "flex",
                gap: "0.65rem",
                marginTop: "0.35rem",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.7rem",
                color: "#999",
                alignItems: "center",
                flexWrap: "wrap",
              }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "#26D968",
                    display: "inline-block",
                  }}
                />
                {available} {available === 1 ? "disponible" : "disponibles"}
              </span>
              <span style={{ color: "#444" }}>·</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "#555",
                    display: "inline-block",
                  }}
                />
                {used} {used === 1 ? "usado" : "usados"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#777",
              cursor: "pointer",
              fontSize: "1.5rem",
              lineHeight: 1,
              padding: "0 0.2rem",
              flexShrink: 0,
              transition: "color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#777")}>
            ×
          </button>
        </div>

        <hr style={dividerStyle} />

        {/* Create form */}
        <form
          onSubmit={handleCreate}
          style={{ display: "flex", gap: "0.5rem", padding: "0.95rem 1.35rem" }}>
          <input
            className="dashboard-input"
            type="text"
            placeholder="Nota (opcional, ej: Para Juan Pérez)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ flex: 1 }}
            maxLength={120}
          />
          <button
            type="submit"
            className="dashboard-btn dashboard-btn--secondary dashboard-btn--small"
            disabled={creating}
            style={{ flexShrink: 0 }}>
            {creating ? "..." : "+ Generar"}
          </button>
        </form>

        {error && (
          <p className="dashboard-error" style={{ margin: "0 1.35rem 0.75rem" }}>
            {error}
          </p>
        )}

        <hr style={dividerStyle} />

        {/* List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0.6rem 0.85rem",
          }}>
          {loadingCodes ? (
            <p
              style={{
                color: "#999",
                fontSize: "0.85rem",
                textAlign: "center",
                padding: "1.5rem",
                fontFamily: "'JetBrains Mono', monospace",
              }}>
              Cargando...
            </p>
          ) : codes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem 1rem", color: "#666" }}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ margin: "0 auto 0.6rem", display: "block", opacity: 0.6 }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <p style={{ color: "#888", fontSize: "0.85rem", margin: 0 }}>
                Aún no hay códigos.
              </p>
              <p
                style={{
                  color: "#666",
                  fontSize: "0.75rem",
                  margin: "0.2rem 0 0",
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                Genera el primero arriba.
              </p>
            </div>
          ) : (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
              }}>
              {codes.map((c) => {
                const isUsed = !!c.used_by;
                const accentColor = isUsed ? "#666" : "#26D968";
                return (
                  <li
                    key={c.code}
                    style={{
                      backgroundColor: isUsed
                        ? "rgba(255,255,255,0.015)"
                        : "rgba(255,255,255,0.025)",
                      borderRadius: "8px",
                      padding: "0.7rem 0.85rem",
                      border: "1px solid rgba(255,255,255,0.05)",
                      borderLeft: `2px solid ${
                        isUsed ? "rgba(255,255,255,0.08)" : "rgba(38,217,104,0.6)"
                      }`,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.85rem",
                      opacity: isUsed ? 0.75 : 1,
                    }}>
                    {/* Status dot */}
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: accentColor,
                        flexShrink: 0,
                        boxShadow: isUsed ? "none" : "0 0 8px rgba(38,217,104,0.4)",
                      }}
                      aria-label={isUsed ? "usado" : "disponible"}
                    />

                    {/* Main info */}
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p
                        style={{
                          color: isUsed ? "#999" : "#fff",
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.85rem",
                          margin: 0,
                          wordBreak: "break-all",
                          textDecoration: isUsed ? "line-through" : "none",
                          textDecorationColor: "rgba(255,255,255,0.2)",
                        }}>
                        {c.code}
                      </p>
                      {(c.note || isUsed) && (
                        <p
                          style={{
                            color: "#888",
                            fontSize: "0.72rem",
                            margin: "0.2rem 0 0",
                            fontFamily: c.note
                              ? "inherit"
                              : "'JetBrains Mono', monospace",
                            lineHeight: 1.35,
                          }}>
                          {c.note && <span>{c.note}</span>}
                          {c.note && isUsed && (
                            <span style={{ color: "#555", margin: "0 0.4rem" }}>·</span>
                          )}
                          {isUsed && (
                            <span
                              style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                color: "#777",
                              }}>
                              @{c.used_by_profile?.github_username || "?"}
                              {c.team?.name ? ` → ${c.team.name}` : ""}
                            </span>
                          )}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "0.25rem", flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => handleCopy(c.code)}
                        title={
                          copiedCode === c.code ? "¡Copiado!" : "Copiar link"
                        }
                        aria-label="Copiar link"
                        style={{
                          backgroundColor:
                            copiedCode === c.code
                              ? "rgba(38,217,104,0.15)"
                              : "rgba(255,255,255,0.04)",
                          border: `1px solid ${
                            copiedCode === c.code
                              ? "rgba(38,217,104,0.4)"
                              : "rgba(255,255,255,0.08)"
                          }`,
                          borderRadius: "6px",
                          color: copiedCode === c.code ? "#26D968" : "#bbb",
                          cursor: "pointer",
                          padding: "0.4rem 0.5rem",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.15s ease",
                        }}>
                        {copiedCode === c.code ? (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        )}
                      </button>
                      {!isUsed && (
                        <button
                          type="button"
                          onClick={() => handleDelete(c.code)}
                          disabled={deletingCode === c.code}
                          title="Eliminar código"
                          aria-label="Eliminar código"
                          style={{
                            backgroundColor: "rgba(239,68,68,0.06)",
                            border: "1px solid rgba(239,68,68,0.2)",
                            borderRadius: "6px",
                            color: "#ef4444",
                            cursor: deletingCode === c.code ? "wait" : "pointer",
                            padding: "0.4rem 0.5rem",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: deletingCode === c.code ? 0.5 : 1,
                            transition: "all 0.15s ease",
                          }}>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <hr style={dividerStyle} />

        {/* Footer */}
        <div
          style={{
            padding: "0.85rem 1.35rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.5rem",
          }}>
          <button
            type="button"
            onClick={fetchCodes}
            className="dashboard-btn dashboard-btn--secondary dashboard-btn--small"
            disabled={loadingCodes}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
            }}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Refrescar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="dashboard-btn dashboard-btn--secondary dashboard-btn--small">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Repo URL Editor (admin only, inline per team) ──────────

function RepoUrlEditor({
  team,
  onChanged,
}: {
  team: Team;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(team.repository_url || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setValue(team.repository_url || "");
  }, [team.repository_url]);

  const handleSave = async () => {
    const trimmed = value.trim();
    if (trimmed && !/^https?:\/\/.+/i.test(trimmed)) {
      setError("La URL debe empezar con http:// o https://");
      return;
    }
    setSaving(true);
    setError("");
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("teams")
      .update({ repository_url: trimmed || null })
      .eq("id", team.id);
    setSaving(false);
    if (updateError) {
      setError("No se pudo guardar. Intenta de nuevo.");
      return;
    }
    setEditing(false);
    onChanged();
  };

  const handleCancel = () => {
    setValue(team.repository_url || "");
    setError("");
    setEditing(false);
  };

  const containerStyle: React.CSSProperties = {
    marginTop: "0.7rem",
    paddingTop: "0.7rem",
    borderTop: "1px solid rgba(255,255,255,0.05)",
  };

  if (editing) {
    return (
      <div style={containerStyle}>
        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
          <input
            type="url"
            className="dashboard-input"
            placeholder="https://github.com/usuario/repo"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            style={{ flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" }}
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="dashboard-btn dashboard-btn--primary dashboard-btn--small"
            style={{ flexShrink: 0 }}>
            {saving ? "..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="dashboard-btn dashboard-btn--secondary dashboard-btn--small"
            style={{ flexShrink: 0 }}>
            Cancelar
          </button>
        </div>
        {error && (
          <p
            style={{
              color: "#ef4444",
              fontSize: "0.72rem",
              margin: "0.4rem 0 0",
              fontFamily: "'JetBrains Mono', monospace",
            }}>
            {error}
          </p>
        )}
      </div>
    );
  }

  // Compact inline row — same layout for both states.
  const hasRepo = !!team.repository_url;
  const accent = hasRepo ? "#26D968" : "#999";

  return (
    <div
      style={{
        ...containerStyle,
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
      }}>
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}>
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>

      {hasRepo ? (
        <a
          href={team.repository_url!}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#26D968",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.85rem",
            textDecoration: "none",
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
          {team.repository_url!.replace(/^https?:\/\//, "")}
        </a>
      ) : (
        <span
          style={{
            color: "#999",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.82rem",
            flex: 1,
          }}>
          sin repositorio asignado
        </span>
      )}

      <button
        type="button"
        onClick={() => setEditing(true)}
        title={hasRepo ? "Editar repositorio" : "Asignar repositorio"}
        aria-label={hasRepo ? "Editar repositorio" : "Asignar repositorio"}
        style={{
          backgroundColor: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "6px",
          color: "#ddd",
          cursor: "pointer",
          padding: "0.32rem 0.6rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.3rem",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.75rem",
          flexShrink: 0,
          transition: "all 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
          e.currentTarget.style.color = "#ddd";
        }}>
        {hasRepo ? (
          <>
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Editar
          </>
        ) : (
          <>+ Asignar</>
        )}
      </button>
    </div>
  );
}

// ─── Admin Section ──────────────────────────────────────────

function AdminSection() {
  const supabase = createClient();
  const [teams, setTeams] = useState<
    (Team & { members: (TeamMember & { profile: Profile })[] })[]
  >([]);
  const [soloUsers, setSoloUsers] = useState<Profile[]>([]);
  const [loadingAdmin, setLoadingAdmin] = useState(true);
  const [search, setSearch] = useState("");
  const [showCodesModal, setShowCodesModal] = useState(false);

  const fetchAll = useCallback(async () => {
    const { data: teamsData } = await supabase
      .from("teams")
      .select("*")
      .order("created_at");

    const teamsWithMembers = await Promise.all(
      (teamsData || []).map(async (t) => {
        const { data: membersData } = await supabase
          .from("team_members")
          .select("*, profile:profiles(*)")
          .eq("team_id", t.id);
        return {
          ...t,
          members: (membersData || []) as (TeamMember & {
            profile: Profile;
          })[],
        };
      }),
    );

    setTeams(
      teamsWithMembers as (Team & {
        members: (TeamMember & { profile: Profile })[];
      })[],
    );

    // Fetch users without a team
    const { data: allProfiles } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at");

    const { data: allMemberships } = await supabase
      .from("team_members")
      .select("user_id");

    const memberIds = new Set((allMemberships || []).map((m) => m.user_id));
    const usersWithoutTeam = (allProfiles || []).filter(
      (p) => !memberIds.has(p.id)
    ) as Profile[];
    setSoloUsers(usersWithoutTeam);

    setLoadingAdmin(false);
  }, [supabase]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const exportCSV = () => {
    const rows = [["equipo", "nombre", "apellido", "email", "github_username"]];
    teams.forEach((t) => {
      t.members.forEach((m) => {
        rows.push([
          t.name,
          m.profile?.first_name || "",
          m.profile?.last_name || "",
          m.profile?.email || "",
          m.profile?.github_username || "",
        ]);
      });
    });
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "compufest-equipos.csv";
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
              m.profile?.email?.toLowerCase().includes(q),
          )
        );
      })
    : teams;

  return (
    <div className="dashboard-card" style={{ padding: 0, overflow: "hidden" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid #222",
        }}>
        <div>
          <h3 className="dashboard-card-title" style={{ margin: 0 }}>
            Equipos registrados
          </h3>
          <p
            style={{
              color: "#999",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.78rem",
              margin: "0.2rem 0 0",
            }}>
            {teams.length} equipo{teams.length !== 1 ? "s" : ""} ·{" "}
            {totalMembers} participante{totalMembers !== 1 ? "s" : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
          <button
            className="dashboard-btn dashboard-btn--secondary dashboard-btn--small"
            onClick={() => setShowCodesModal(true)}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Códigos
          </button>
          <button
            className="dashboard-btn dashboard-btn--secondary dashboard-btn--small"
            onClick={exportCSV}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            CSV
          </button>
        </div>
      </div>

      {showCodesModal && (
        <CodeManagerModal onClose={() => setShowCodesModal(false)} />
      )}

      {/* Search */}
      {teams.length > 2 && (
        <div style={{ padding: "1rem 1.5rem 0" }}>
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
        <div style={{ padding: "2rem 1.5rem", textAlign: "center" }}>
          <p style={{ color: "#bbb", fontSize: "0.95rem", margin: 0 }}>
            No hay equipos registrados.
          </p>
        </div>
      ) : (
        <div
          style={{ maxHeight: "65vh", overflowY: "auto", padding: "0.75rem" }}>
          {filtered.map((t, i) => (
            <div
              key={t.id}
              style={{
                background: "rgba(255,255,255,0.02)",
                borderRadius: "10px",
                padding: "1rem 1.15rem",
                marginBottom: i < filtered.length - 1 ? "0.75rem" : 0,
              }}>
              {/* Team header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.75rem",
                }}>
                <div>
                  <p
                    style={{
                      color: "#fff",
                      fontFamily: "'Red Hat Display', sans-serif",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      margin: 0,
                    }}>
                    {t.name}
                  </p>
                  <span
                    style={{
                      color: "#555",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.7rem",
                    }}>
                    {t.invite_code}
                  </span>
                </div>
                <span
                  style={{
                    color: "#bbb",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.8rem",
                    background: "rgba(255,255,255,0.05)",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "5px",
                    flexShrink: 0,
                  }}>
                  {t.members.length}/5
                </span>
              </div>

              {/* Members */}
              <ul className="dashboard-member-list">
                {t.members.map((m) => (
                  <li key={m.id} className="dashboard-member-item">
                    {m.profile?.avatar_url && (
                      <img
                        src={m.profile.avatar_url}
                        alt=""
                        className="dashboard-member-avatar"
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="dashboard-member-name">
                        {m.profile?.first_name} {m.profile?.last_name}
                        {m.user_id === t.created_by && (
                          <span
                            style={{
                              color: "#26D968",
                              marginLeft: "0.35rem",
                              fontSize: "0.7rem",
                              fontFamily: "'JetBrains Mono', monospace",
                            }}>
                            creador
                          </span>
                        )}
                      </p>
                      <p className="dashboard-member-gh">
                        @{m.profile?.github_username}
                      </p>
                    </div>
                    <RoleSelect userId={m.user_id} currentRole={m.profile?.role || 'participant'} isInTeam={true} onChanged={fetchAll} />
                  </li>
                ))}
              </ul>

              {/* Repo (admin can assign / edit / clear) */}
              <RepoUrlEditor team={t} onChanged={fetchAll} />
            </div>
          ))}

          {search && filtered.length === 0 && (
            <p
              style={{
                color: "#999",
                fontSize: "0.9rem",
                padding: "1rem",
                textAlign: "center",
                margin: 0,
              }}>
              Sin resultados para "{search}"
            </p>
          )}
        </div>
      )}

      {/* Users without team */}
      {soloUsers.length > 0 && (
        <>
          <div style={{ padding: '1rem 1.5rem 0.5rem', borderTop: '1px solid #222' }}>
            <p style={{ color: '#999', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              Sin equipo · {soloUsers.length} usuario{soloUsers.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div style={{ padding: '0 0.75rem 0.75rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '0.75rem' }}>
              <ul className="dashboard-member-list">
                {soloUsers.map((u) => (
                  <li key={u.id} className="dashboard-member-item">
                    {u.avatar_url && (
                      <img src={u.avatar_url} alt="" className="dashboard-member-avatar" />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="dashboard-member-name">
                        {u.first_name} {u.last_name}
                      </p>
                      <p className="dashboard-member-gh">@{u.github_username}</p>
                    </div>
                    <RoleSelect userId={u.id} currentRole={u.role} isInTeam={false} onChanged={fetchAll} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Judge Section ──────────────────────────────────────────

function JudgeSection() {
  const supabase = createClient();
  const [teams, setTeams] = useState<
    (Team & { members: (TeamMember & { profile: Profile })[] })[]
  >([]);
  const [loadingJudge, setLoadingJudge] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const { data: teamsData } = await supabase
        .from("teams")
        .select("*")
        .order("name");

      if (!teamsData) {
        setLoadingJudge(false);
        return;
      }

      const teamsWithMembers = await Promise.all(
        teamsData.map(async (t) => {
          const { data: membersData } = await supabase
            .from("team_members")
            .select("*, profile:profiles(*)")
            .eq("team_id", t.id);
          return {
            ...t,
            members: (membersData || []) as (TeamMember & {
              profile: Profile;
            })[],
          };
        }),
      );

      setTeams(
        teamsWithMembers as (Team & {
          members: (TeamMember & { profile: Profile })[];
        })[],
      );
      setLoadingJudge(false);
    };
    fetchAll();
  }, [supabase]);

  if (loadingJudge) return null;

  const totalMembers = teams.reduce((sum, t) => sum + t.members.length, 0);

  return (
    <div className="dashboard-card" style={{ padding: 0, overflow: "hidden" }}>
      <div
        style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #222" }}>
        <h3 className="dashboard-card-title" style={{ margin: 0 }}>
          Equipos participantes
        </h3>
        <p
          style={{
            color: "#999",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.78rem",
            margin: "0.2rem 0 0",
          }}>
          {teams.length} equipo{teams.length !== 1 ? "s" : ""} ·{" "}
          {totalMembers} participante{totalMembers !== 1 ? "s" : ""}
        </p>
      </div>

      {teams.length === 0 ? (
        <div style={{ padding: "2rem 1.5rem", textAlign: "center" }}>
          <p style={{ color: "#bbb", fontSize: "0.95rem", margin: 0 }}>
            No hay equipos registrados.
          </p>
        </div>
      ) : (
        <div
          style={{ maxHeight: "65vh", overflowY: "auto", padding: "0.75rem" }}>
          {teams.map((t, i) => (
            <div
              key={t.id}
              style={{
                background: "rgba(255,255,255,0.02)",
                borderRadius: "10px",
                padding: "1rem 1.15rem",
                marginBottom: i < teams.length - 1 ? "0.75rem" : 0,
              }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.75rem",
                }}>
                <p
                  style={{
                    color: "#fff",
                    fontFamily: "'Red Hat Display', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    margin: 0,
                  }}>
                  {t.name}
                </p>
                <span
                  style={{
                    color: "#bbb",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.8rem",
                    background: "rgba(255,255,255,0.05)",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "5px",
                  }}>
                  {t.members.length}/5
                </span>
              </div>
              {/* Repo (read-only for judges) */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.55rem",
                  padding: "0.55rem 0.7rem",
                  marginBottom: "0.75rem",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "7px",
                }}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={t.repository_url ? "#26D968" : "#777"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0 }}>
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                {t.repository_url ? (
                  <a
                    href={t.repository_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#26D968",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.8rem",
                      textDecoration: "none",
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}>
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}>
                      {t.repository_url.replace(/^https?:\/\//, "")}
                    </span>
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ flexShrink: 0, opacity: 0.65 }}>
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                ) : (
                  <span
                    style={{
                      color: "#888",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.78rem",
                      flex: 1,
                    }}>
                    sin repositorio asignado
                  </span>
                )}
              </div>
              <ul className="dashboard-member-list">
                {t.members.map((m) => (
                  <li key={m.id} className="dashboard-member-item">
                    {m.profile?.avatar_url && (
                      <img
                        src={m.profile.avatar_url}
                        alt=""
                        className="dashboard-member-avatar"
                      />
                    )}
                    <div>
                      <p className="dashboard-member-name">
                        {m.profile?.first_name} {m.profile?.last_name}
                      </p>
                      <p className="dashboard-member-gh">
                        @{m.profile?.github_username}
                      </p>
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
