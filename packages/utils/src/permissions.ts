export const PERMISSIONS = {
  USERS_READ: 'users.read',
  USERS_WRITE: 'users.write',
  USERS_DELETE: 'users.delete',
  CONTENT_READ: 'content.read',
  CONTENT_WRITE: 'content.write',
  SETTINGS_MANAGE: 'settings.manage',
  AUDIT_READ: 'audit.read',
} as const;

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export function hasPermission(
  userPermissions: string[] | undefined | null,
  requiredPermission: string
): boolean {
  if (!userPermissions) return false;
  return userPermissions.includes(requiredPermission) || userPermissions.includes('*');
}

export function isAdmin(userRole: string | undefined | null): boolean {
  return userRole?.toLowerCase() === ROLES.ADMIN;
}
