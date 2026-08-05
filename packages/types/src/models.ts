import { Database } from './database.types';

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type RoleRow = Database['public']['Tables']['roles']['Row'];
export type PermissionRow = Database['public']['Tables']['permissions']['Row'];
export type AuditLogRow = Database['public']['Tables']['audit_logs']['Row'];
export type ActivityLogRow = Database['public']['Tables']['activity_logs']['Row'];
export type SettingRow = Database['public']['Tables']['settings']['Row'];
export type NotificationRow = Database['public']['Tables']['notifications']['Row'];
export type UploadRow = Database['public']['Tables']['uploads']['Row'];

export interface UserProfile extends ProfileRow {
  role?: RoleRow;
  permissions?: string[];
}

export interface JWTCustomClaims {
  role: string;
  permissions: string[];
  user_id: string;
  email: string;
  organization_id?: string;
}

export interface AuthSessionUser {
  id: string;
  email: string;
  role: string;
  permissions: string[];
  profile: UserProfile | null;
}

export interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  storageUsedBytes: number;
  storageFileCount: number;
  apiRequestsToday: number;
  auditEventsCount: number;
}

export interface PaginatedResult<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
