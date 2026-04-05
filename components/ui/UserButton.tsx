'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

export function UserButton() {
  const { user, profile, loading, signInWithGitHub, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  if (loading) {
    return (
      <div className="user-button user-button--loading" aria-label="Cargando">
        <div className="user-button-skeleton" />
      </div>
    );
  }

  if (!user) {
    return (
      <button
        className="user-button"
        onClick={signInWithGitHub}
        aria-label="Iniciar sesión con GitHub"
        type="button"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>
    );
  }

  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;
  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : user.user_metadata?.user_name || 'Usuario';

  return (
    <div className="user-button-wrapper" ref={dropdownRef}>
      <button
        className="user-button user-button--logged"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-label={`Menú de usuario: ${displayName}`}
        aria-expanded={dropdownOpen}
        type="button"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="user-avatar" />
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )}
      </button>

      {dropdownOpen && (
        <div className="user-dropdown">
          <div className="user-dropdown-header">
            <span className="user-dropdown-name">{displayName}</span>
            {profile?.role && profile.role !== 'participant' && (
              <span className="user-dropdown-badge">{profile.role}</span>
            )}
          </div>
          <div className="user-dropdown-divider" />
          <button
            className="user-dropdown-item"
            onClick={() => { setDropdownOpen(false); navigate('/dashboard'); }}
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
            Dashboard
          </button>
          <button
            className="user-dropdown-item user-dropdown-item--danger"
            onClick={() => { setDropdownOpen(false); signOut(); }}
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            Cerrar sesion
          </button>
        </div>
      )}
    </div>
  );
}
