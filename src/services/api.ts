import { supabase } from '../lib/supabase';
import { UserProfile, AuditLogRow, SettingRow, SystemMetrics } from '@edukalyan/types';

// Mock Seed Data for Fallback/Offline/Demo Mode
const MOCK_USERS: UserProfile[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'admin@edukalyan.com',
    first_name: 'System',
    last_name: 'Administrator',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    phone: '+1 (555) 019-2834',
    timezone: 'America/New_York',
    locale: 'en-US',
    status: 'active',
    role_id: '11111111-1111-1111-1111-111111111111',
    last_login: new Date().toISOString(),
    metadata: { isSuperAdmin: true },
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    role: {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'admin',
      description: 'Full system administrator privilege',
      is_system: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'user@edukalyan.com',
    first_name: 'Jane',
    last_name: 'Doe',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
    phone: '+1 (555) 321-9876',
    timezone: 'Europe/London',
    locale: 'en-GB',
    status: 'active',
    role_id: '22222222-2222-2222-2222-222222222222',
    last_login: new Date(Date.now() - 3600000 * 2).toISOString(),
    metadata: { department: 'Engineering' },
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    role: {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'user',
      description: 'Standard platform user',
      is_system: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'alex.smith@example.com',
    first_name: 'Alex',
    last_name: 'Smith',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    phone: '+1 (555) 789-0123',
    timezone: 'Asia/Tokyo',
    locale: 'ja-JP',
    status: 'suspended',
    role_id: '22222222-2222-2222-2222-222222222222',
    last_login: new Date(Date.now() - 86400000 * 5).toISOString(),
    metadata: { reason: 'Policy violation review' },
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    role: {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'user',
      description: 'Standard platform user',
      is_system: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
];

const MOCK_AUDIT_LOGS: AuditLogRow[] = [
  {
    id: 'aud_1',
    actor_id: '11111111-1111-1111-1111-111111111111',
    actor_email: 'admin@edukalyan.com',
    action: 'profiles.update',
    resource: 'profiles',
    resource_id: '33333333-3333-3333-3333-333333333333',
    old_values: { status: 'active' },
    new_values: { status: 'suspended' },
    ip_address: '192.168.1.1',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'aud_2',
    actor_id: '22222222-2222-2222-2222-222222222222',
    actor_email: 'user@edukalyan.com',
    action: 'auth.login',
    resource: 'auth',
    resource_id: '22222222-2222-2222-2222-222222222222',
    old_values: null,
    new_values: { session_started: true },
    ip_address: '192.168.1.45',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

export const api = {
  // User Management
  async getUsers(search = '', statusFilter = 'all'): Promise<UserProfile[]> {
    try {
      let query = (supabase.from('profiles') as any).select('*, role:roles(*)').order('created_at', { ascending: false });
      
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as any);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        if (search) {
          const lower = search.toLowerCase();
          return (data as UserProfile[]).filter(
            (u) =>
              u.email.toLowerCase().includes(lower) ||
              (u.first_name || '').toLowerCase().includes(lower) ||
              (u.last_name || '').toLowerCase().includes(lower)
          );
        }
        return data as UserProfile[];
      }
    } catch (e) {
      console.warn('[API] Fetching users fallback to mock data');
    }

    // Fallback Mock Data
    return MOCK_USERS.filter((u) => {
      const matchSearch =
        !search ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.first_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.last_name || '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchSearch && matchStatus;
    });
  },

  async updateUserStatus(userId: string, newStatus: 'active' | 'suspended' | 'deactivated'): Promise<boolean> {
    try {
      const { error } = await (supabase.from('profiles') as any).update({ status: newStatus }).eq('id', userId);
      if (!error) return true;
    } catch (e) {
      console.warn('[API] Update user status fallback');
    }
    const idx = MOCK_USERS.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      MOCK_USERS[idx].status = newStatus;
    }
    return true;
  },

  async updateUserRole(userId: string, roleId: string): Promise<boolean> {
    try {
      const { error } = await (supabase.from('profiles') as any).update({ role_id: roleId }).eq('id', userId);
      if (!error) return true;
    } catch (e) {
      console.warn('[API] Update user role fallback');
    }
    return true;
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLogRow[]> {
    try {
      const { data, error } = await (supabase.from('audit_logs') as any).select('*').order('created_at', { ascending: false }).limit(50);
      if (!error && data && data.length > 0) return data as AuditLogRow[];
    } catch (e) {
      console.warn('[API] Fetching audit logs fallback');
    }
    return MOCK_AUDIT_LOGS;
  },

  // Settings
  async getSettings(): Promise<SettingRow[]> {
    try {
      const { data, error } = await (supabase.from('settings') as any).select('*');
      if (!error && data && data.length > 0) return data as SettingRow[];
    } catch (e) {
      console.warn('[API] Fetching settings fallback');
    }
    return [
      { key: 'site_title', value: 'Edukalyan Full-Stack App', description: 'Platform title', is_public: true, updated_by: null, updated_at: new Date().toISOString() },
      { key: 'maintenance_mode', value: false, description: 'Toggle maintenance mode', is_public: true, updated_by: null, updated_at: new Date().toISOString() },
      { key: 'max_upload_size_mb', value: 25, description: 'Max upload size MB', is_public: true, updated_by: null, updated_at: new Date().toISOString() },
    ];
  },

  async updateSetting(key: string, value: any): Promise<boolean> {
    try {
      const { error } = await (supabase.from('settings') as any).upsert({ key, value, updated_at: new Date().toISOString() });
      if (!error) return true;
    } catch (e) {
      console.warn('[API] Update setting fallback');
    }
    return true;
  },

  // Analytics Metrics
  async getSystemMetrics(): Promise<SystemMetrics> {
    return {
      totalUsers: MOCK_USERS.length + 12,
      activeUsers: MOCK_USERS.filter((u) => u.status === 'active').length + 10,
      suspendedUsers: 1,
      storageUsedBytes: 142589000, // ~142 MB
      storageFileCount: 48,
      apiRequestsToday: 1840,
      auditEventsCount: MOCK_AUDIT_LOGS.length + 24,
    };
  },
};
