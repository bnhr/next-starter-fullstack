import { db } from '@/db';
import { users, auditLogs, accounts } from '@/db/schema';
import { eq, desc, gte, sql, like, and, or } from 'drizzle-orm';
import { subDays } from 'date-fns';
import { randomUUID } from 'crypto';
import { hash } from 'bcryptjs';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { createAuditLog } from '@/lib/audit';
import type { CreateUserInput, UpdateUserInput } from '@/features/admin/schema';

export interface AdminStats {
	totalUsers: number;
	activeUsers: number;
	adminUsers: number;
	recentSignups: number;
	totalAuditLogs: number;
}

export async function getAdminStats(): Promise<AdminStats> {
	const now = new Date();
	const sevenDaysAgo = subDays(now, 7);

	const [
		totalUsersResult,
		activeUsersResult,
		adminUsersResult,
		recentSignupsResult,
		totalAuditLogsResult,
	] = await Promise.all([
		db.select({ count: sql<number>`count(*)` }).from(users),
		db
			.select({ count: sql<number>`count(*)` })
			.from(users)
			.where(eq(users.banned, false)),
		db
			.select({ count: sql<number>`count(*)` })
			.from(users)
			.where(eq(users.role, 'admin')),
		db
			.select({ count: sql<number>`count(*)` })
			.from(users)
			.where(gte(users.createdAt, sevenDaysAgo)),
		db.select({ count: sql<number>`count(*)` }).from(auditLogs),
	]);

	return {
		totalUsers: totalUsersResult[0]?.count || 0,
		activeUsers: activeUsersResult[0]?.count || 0,
		adminUsers: adminUsersResult[0]?.count || 0,
		recentSignups: recentSignupsResult[0]?.count || 0,
		totalAuditLogs: totalAuditLogsResult[0]?.count || 0,
	};
}

export interface RecentActivity {
	id: string;
	action: string;
	entityType: string;
	createdAt: Date;
	user: {
		name: string | null;
		email: string;
	};
}

export async function getRecentActivity(limit = 5): Promise<RecentActivity[]> {
	const logs = await db
		.select({
			id: auditLogs.id,
			action: auditLogs.action,
			entityType: auditLogs.entityType,
			createdAt: auditLogs.createdAt,
			user: {
				name: users.name,
				email: users.email,
			},
		})
		.from(auditLogs)
		.leftJoin(users, eq(auditLogs.userId, users.id))
		.orderBy(desc(auditLogs.createdAt))
		.limit(limit);

	return logs.map((log) => ({
		...log,
		user: log.user || { name: null, email: 'Unknown' },
	}));
}

export interface GetUsersParams {
	page?: number;
	limit?: number;
	search?: string;
	role?: string;
	banned?: string;
}

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export interface UserListItem {
	id: string;
	name: string;
	email: string;
	username: string | null;
	role: string;
	banned: boolean;
	createdAt: Date;
}

export async function getUsers(params: GetUsersParams = {}) {
	const { page = 1, search, role, banned } = params;
	// Validate and constrain limit
	const limit = Math.min(Math.max(params.limit || DEFAULT_LIMIT, 1), MAX_LIMIT);
	const offset = (page - 1) * limit;

	let conditions = undefined;
	const conditionList = [];

	if (search) {
		conditionList.push(
			or(
				like(users.name, `%${search}%`),
				like(users.email, `%${search}%`),
				like(users.username, `%${search}%`),
			),
		);
	}

	if (role && role !== 'all') {
		conditionList.push(eq(users.role, role));
	}

	if (banned && banned !== 'all') {
		conditions = banned === 'true' ? eq(users.banned, true) : eq(users.banned, false);
	}

	const len = conditionList.length;
	if (len > 0 && conditions) {
		conditions = and(conditions, ...conditionList);
	} else if (len > 0) {
		conditions = and(...conditionList);
	}

	const [usersResult, totalResult] = await Promise.all([
		db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				username: users.username,
				role: users.role,
				banned: users.banned,
				createdAt: users.createdAt,
			})
			.from(users)
			.where(conditions)
			.orderBy(desc(users.createdAt))
			.limit(limit)
			.offset(offset),
		db
			.select({ count: sql<number>`count(*)` })
			.from(users)
			.where(conditions),
	]);

	return {
		users: usersResult,
		total: totalResult[0]?.count || 0,
		page,
		limit,
		totalPages: Math.ceil((totalResult[0]?.count || 0) / limit),
	};
}

export async function getUserById(id: string) {
	const result = await db
		.select({
			id: users.id,
			name: users.name,
			email: users.email,
			username: users.username,
			role: users.role,
			banned: users.banned,
			banReason: users.banReason,
			banExpires: users.banExpires,
			createdAt: users.createdAt,
			updatedAt: users.updatedAt,
		})
		.from(users)
		.where(eq(users.id, id))
		.then((rows) => rows[0]);

	return result;
}

export async function createUser(data: CreateUserInput) {
	let session;
	try {
		session = await auth.api.getSession({
			headers: await headers(),
		});
	} catch (error) {
		if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
			throw new Error('Unauthorized: Please log in again');
		}
		throw error;
	}

	if (!session) {
		throw new Error('Unauthorized');
	}

	const existingUser = await db.query.users.findFirst({
		where: (fields, { eq }) => eq(fields.email, data.email),
	});

	if (existingUser) {
		throw new Error('User with this email already exists');
	}

	const userId = randomUUID();
	const hashedPassword = await hash(data.password, 12);

	await db.transaction(async (tx) => {
		await tx.insert(users).values({
			id: userId,
			name: data.name,
			email: data.email,
			username: data.username,
			role: data.role,
			banned: data.banned,
		});

		await tx.insert(accounts).values({
			id: randomUUID(),
			accountId: randomUUID(),
			providerId: 'email',
			userId: userId,
			password: hashedPassword,
		});
	});

	await createAuditLog({
		userId: session.user.id,
		action: 'user.create',
		entityType: 'user',
		entityId: userId,
		newValues: { name: data.name, email: data.email, role: data.role },
	});

	return { id: userId };
}

export async function updateUser(id: string, data: UpdateUserInput) {
	let session;
	try {
		session = await auth.api.getSession({
			headers: await headers(),
		});
	} catch (error) {
		if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
			throw new Error('Unauthorized: Please log in again');
		}
		throw error;
	}

	if (!session) {
		throw new Error('Unauthorized');
	}

	const existingUser = await db.query.users.findFirst({
		where: (fields, { eq }) => eq(fields.id, id),
	});

	if (!existingUser) {
		throw new Error('User not found');
	}

	const emailChanged = existingUser.email !== data.email;
	if (emailChanged) {
		const emailInUse = await db.query.users.findFirst({
			where: (fields, { and, eq }) => and(eq(fields.email, data.email), eq(fields.id, id)),
		});
		if (emailInUse) {
			throw new Error('Email is already in use');
		}
	}

	await db
		.update(users)
		.set({
			name: data.name,
			email: data.email,
			username: data.username,
			role: data.role,
			banned: data.banned,
		})
		.where(eq(users.id, id));

	await createAuditLog({
		userId: session.user.id,
		action: 'user.update',
		entityType: 'user',
		entityId: id,
		oldValues: {
			name: existingUser.name,
			email: existingUser.email,
			role: existingUser.role,
			banned: existingUser.banned,
		},
		newValues: data as unknown as Record<string, unknown>,
	});

	return { success: true };
}

export async function deleteUser(id: string) {
	let session;
	try {
		session = await auth.api.getSession({
			headers: await headers(),
		});
	} catch (error) {
		if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
			throw new Error('Unauthorized: Please log in again');
		}
		throw error;
	}

	if (!session) {
		throw new Error('Unauthorized');
	}

	const existingUser = await db.query.users.findFirst({
		where: (fields, { eq }) => eq(fields.id, id),
	});

	if (!existingUser) {
		throw new Error('User not found');
	}

	await db.delete(users).where(eq(users.id, id));

	await createAuditLog({
		userId: session.user.id,
		action: 'user.delete',
		entityType: 'user',
		entityId: id,
		oldValues: { name: existingUser.name, email: existingUser.email },
	});

	return { success: true };
}

export { getAuditLogs } from '@/lib/audit';
