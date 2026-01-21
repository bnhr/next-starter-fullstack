export type Role = 'admin' | 'user';

export type Permission = 'users:read' | 'users:write' | 'users:delete' | 'audit:read';

export const rolePermissions: Record<Role, Permission[]> = {
	admin: ['users:read', 'users:write', 'users:delete', 'audit:read'],
	user: [],
};

export interface AuthUser {
	id: string;
	role?: string | null;
	isAdmin?: boolean | null;
	banned?: boolean | null;
}

export function hasPermission(user: AuthUser | null | undefined, permission: Permission): boolean {
	if (!user || !user.role) return false;
	const permissions = rolePermissions[user.role as Role] || [];
	return permissions.includes(permission);
}

export function isAdmin(user: AuthUser | null | undefined): boolean {
	return hasPermission(user, 'users:read');
}

export function isNotBanned(user: AuthUser | null | undefined): boolean {
	if (!user) return false;
	return user.banned !== true;
}

export function canAccessAdmin(user: AuthUser | null | undefined): boolean {
	if (!user) return false;
	if (user.banned === true) return false;
	return user.role === 'admin' || user.isAdmin === true;
}
