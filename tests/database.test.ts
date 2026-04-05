import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';

const env = loadEnv('', process.cwd(), '');
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
}

let admin: SupabaseClient;

// We'll store dynamically created user IDs
const testUserIds: string[] = [];
let teamId: string;
let inviteCode: string;

async function createTestUser(email: string, username: string): Promise<string> {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { user_name: username, avatar_url: `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 99999)}` },
  });
  if (error) throw new Error(`Failed to create test user ${email}: ${error.message}`);
  testUserIds.push(data.user.id);
  return data.user.id;
}

beforeAll(async () => {
  admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
});

afterAll(async () => {
  // Clean up: delete team members, teams, profiles, then auth users
  if (testUserIds.length > 0) {
    await admin.from('team_members').delete().in('user_id', testUserIds);
    await admin.from('teams').delete().in('created_by', testUserIds);
    await admin.from('profiles').delete().in('id', testUserIds);
    for (const id of testUserIds) {
      await admin.auth.admin.deleteUser(id).catch(() => {});
    }
  }
});

// ─── Schema Tests ───────────────────────────────────────────

describe('Schema: Tables exist', () => {
  it('profiles table is accessible', async () => {
    const { error } = await admin.from('profiles').select('*').limit(0);
    expect(error).toBeNull();
  });

  it('teams table is accessible', async () => {
    const { error } = await admin.from('teams').select('*').limit(0);
    expect(error).toBeNull();
  });

  it('team_members table is accessible', async () => {
    const { error } = await admin.from('team_members').select('*').limit(0);
    expect(error).toBeNull();
  });
});

// ─── Profile Trigger + CRUD ─────────────────────────────────

describe('Profiles (via auth trigger)', () => {
  let userId: string;

  it('creating an auth user auto-creates a profile via trigger', async () => {
    userId = await createTestUser('trigger-test@compufest.dev', 'triggeruser');

    const { data, error } = await admin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data!.email).toBe('trigger-test@compufest.dev');
    expect(data!.github_username).toBe('triggeruser');
    expect(data!.role).toBe('participant');
    expect(data!.first_name).toBeNull();
    expect(data!.last_name).toBeNull();
  });

  it('can update first_name and last_name', async () => {
    const { error } = await admin
      .from('profiles')
      .update({ first_name: 'Test', last_name: 'User' })
      .eq('id', userId);
    expect(error).toBeNull();

    const { data } = await admin
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', userId)
      .single();
    expect(data!.first_name).toBe('Test');
    expect(data!.last_name).toBe('User');
  });

  it('updated_at changes on profile update', async () => {
    const { data: before } = await admin
      .from('profiles')
      .select('updated_at')
      .eq('id', userId)
      .single();

    await new Promise((r) => setTimeout(r, 150));

    await admin
      .from('profiles')
      .update({ first_name: 'TestUpdated' })
      .eq('id', userId);

    const { data: after } = await admin
      .from('profiles')
      .select('updated_at')
      .eq('id', userId)
      .single();

    expect(new Date(after!.updated_at).getTime()).toBeGreaterThan(
      new Date(before!.updated_at).getTime()
    );
  });

  it('rejects invalid role values via CHECK constraint', async () => {
    const { error } = await admin
      .from('profiles')
      .update({ role: 'superadmin' })
      .eq('id', userId);
    expect(error).not.toBeNull();
    expect(error!.code).toBe('23514'); // check_violation
  });

  it('accepts all valid role values', async () => {
    for (const role of ['admin', 'judge', 'participant']) {
      const { error } = await admin
        .from('profiles')
        .update({ role })
        .eq('id', userId);
      expect(error).toBeNull();
    }
    // Reset
    await admin.from('profiles').update({ role: 'participant' }).eq('id', userId);
  });
});

// ─── Teams ──────────────────────────────────────────────────

describe('Teams', () => {
  let creatorId: string;

  beforeAll(async () => {
    creatorId = await createTestUser('team-creator@compufest.dev', 'teamcreator');
  });

  it('can create a team', async () => {
    const { data, error } = await admin
      .from('teams')
      .insert({ name: 'Test Team Vitest', created_by: creatorId })
      .select()
      .single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data!.name).toBe('Test Team Vitest');
    expect(data!.created_by).toBe(creatorId);

    teamId = data!.id;
    inviteCode = data!.invite_code;
  });

  it('auto-generates an 8-char hex invite_code', () => {
    expect(inviteCode).toBeTruthy();
    expect(inviteCode.length).toBe(8);
    expect(/^[a-f0-9]{8}$/.test(inviteCode)).toBe(true);
  });

  it('rejects duplicate team names', async () => {
    const otherId = await createTestUser('dup-team@compufest.dev', 'dupteam');
    const { error } = await admin
      .from('teams')
      .insert({ name: 'Test Team Vitest', created_by: otherId });
    expect(error).not.toBeNull();
    expect(error!.code).toBe('23505'); // unique_violation
  });

  it('trigger auto-adds creator as first team member', async () => {
    const { data, error } = await admin
      .from('team_members')
      .select('*')
      .eq('team_id', teamId)
      .eq('user_id', creatorId);

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data!.length).toBe(1);
  });

  it('can find team by invite_code', async () => {
    const { data, error } = await admin
      .from('teams')
      .select('*')
      .eq('invite_code', inviteCode)
      .single();

    expect(error).toBeNull();
    expect(data!.id).toBe(teamId);
    expect(data!.name).toBe('Test Team Vitest');
  });

  it('repository_url defaults to null', async () => {
    const { data } = await admin
      .from('teams')
      .select('repository_url')
      .eq('id', teamId)
      .single();
    expect(data!.repository_url).toBeNull();
  });

  it('can update repository_url', async () => {
    const { error } = await admin
      .from('teams')
      .update({ repository_url: 'https://github.com/test/repo' })
      .eq('id', teamId);
    expect(error).toBeNull();

    const { data } = await admin
      .from('teams')
      .select('repository_url')
      .eq('id', teamId)
      .single();
    expect(data!.repository_url).toBe('https://github.com/test/repo');

    // Reset
    await admin.from('teams').update({ repository_url: null }).eq('id', teamId);
  });
});

// ─── Team Members (limit of 5, one team per user) ───────────

describe('Team Members: limits & constraints', () => {
  it('can add members 2-5 to the team', async () => {
    for (let i = 2; i <= 5; i++) {
      const uid = await createTestUser(`member${i}@compufest.dev`, `member${i}`);
      const { error } = await admin
        .from('team_members')
        .insert({ team_id: teamId, user_id: uid });
      expect(error).toBeNull();
    }
  });

  it('team now has exactly 5 members', async () => {
    const { count } = await admin
      .from('team_members')
      .select('*', { count: 'exact', head: true })
      .eq('team_id', teamId);
    expect(count).toBe(5);
  });

  it('prevents duplicate membership (unique constraint)', async () => {
    // Try adding the creator again
    const { data: firstMember } = await admin
      .from('team_members')
      .select('user_id')
      .eq('team_id', teamId)
      .limit(1)
      .single();

    const { error } = await admin
      .from('team_members')
      .insert({ team_id: teamId, user_id: firstMember!.user_id });
    expect(error).not.toBeNull();
    expect(error!.code).toBe('23505'); // unique_violation
  });

  it('can remove a member and re-add them', async () => {
    // Get last member
    const { data: members } = await admin
      .from('team_members')
      .select('user_id')
      .eq('team_id', teamId)
      .order('joined_at', { ascending: false })
      .limit(1);

    const lastUserId = members![0].user_id;

    // Remove
    const { error: delError } = await admin
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', lastUserId);
    expect(delError).toBeNull();

    // Verify count is now 4
    const { count: afterDel } = await admin
      .from('team_members')
      .select('*', { count: 'exact', head: true })
      .eq('team_id', teamId);
    expect(afterDel).toBe(4);

    // Re-add
    const { error: reAddError } = await admin
      .from('team_members')
      .insert({ team_id: teamId, user_id: lastUserId });
    expect(reAddError).toBeNull();

    // Back to 5
    const { count: afterReAdd } = await admin
      .from('team_members')
      .select('*', { count: 'exact', head: true })
      .eq('team_id', teamId);
    expect(afterReAdd).toBe(5);
  });

  it('can query members with profile data (join)', async () => {
    const { data, error } = await admin
      .from('team_members')
      .select('*, profile:profiles(*)')
      .eq('team_id', teamId);

    expect(error).toBeNull();
    expect(data!.length).toBe(5);

    // Each member should have a profile with email
    for (const m of data!) {
      expect(m.profile).toBeDefined();
      expect(m.profile.email).toBeTruthy();
      expect(m.profile.github_username).toBeTruthy();
    }
  });
});

// ─── Cascade Deletes ────────────────────────────────────────

describe('Cascade deletes', () => {
  it('deleting a team cascades to team_members', async () => {
    const uid = await createTestUser('cascade-test@compufest.dev', 'cascadeuser');
    const { data: tempTeam } = await admin
      .from('teams')
      .insert({ name: 'Cascade Delete Team', created_by: uid })
      .select()
      .single();

    // Verify member exists (trigger)
    const { count: before } = await admin
      .from('team_members')
      .select('*', { count: 'exact', head: true })
      .eq('team_id', tempTeam!.id);
    expect(before).toBe(1);

    // Delete team
    await admin.from('teams').delete().eq('id', tempTeam!.id);

    // Members should be gone
    const { count: after } = await admin
      .from('team_members')
      .select('*', { count: 'exact', head: true })
      .eq('team_id', tempTeam!.id);
    expect(after).toBe(0);
  });

  it('invite codes are unique across all teams', async () => {
    const { data: teams } = await admin.from('teams').select('invite_code');
    if (teams && teams.length > 1) {
      const codes = teams.map((t) => t.invite_code);
      const unique = new Set(codes);
      expect(unique.size).toBe(codes.length);
    }
  });
});
