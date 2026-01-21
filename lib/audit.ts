import { db } from '@/db';
import { auditLogs, users } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export type AuditAction =
	| 'user.create'
	| 'user.update'
	| 'user.delete'
	| 'user.login'
	| 'user.logout'
	| 'profile.update'
	| 'password.change'
	| 'role.change'
	| 'status.change';

export type AuditEntityType = 'user' | 'profile' | 'session' | 'account';

export interface CreateAuditLogParams {
	userId: string;
	action: AuditAction;
	entityType: AuditEntityType;
	entityId?: string;
	oldValues?: Record<string, unknown>;
	newValues?: Record<string, unknown>;
	ipAddress?: string;
	userAgent?: string;
}

export async function createAuditLog(params: CreateAuditLogParams) {
	await db.insert(auditLogs).values({
		id: randomUUID(),
		userId: params.userId,
		action: params.action,
		entityType: params.entityType,
		entityId: params.entityId,
		oldValues: params.oldValues || null,
		newValues: params.newValues || null,
		ipAddress: params.ipAddress || null,
		userAgent: params.userAgent || null,
	});
}

export interface GetAuditLogsParams {
	userId?: string;
	entityType?: AuditEntityType;
	action?: AuditAction;
	limit?: number;
	offset?: number;
}

export async function getAuditLogs(params: GetAuditLogsParams = {}) {
	const { userId, entityType, action, limit = 50, offset = 0 } = params;

	let conditions = undefined;
	const conditionList = [];

	if (userId) conditionList.push(eq(auditLogs.userId, userId));
	if (entityType) conditionList.push(eq(auditLogs.entityType, entityType));
	if (action) conditionList.push(eq(auditLogs.action, action));

	if (conditionList.length > 0) {
		conditions = and(...conditionList);
	}

	const logs = await db
		.select({
			id: auditLogs.id,
			userId: auditLogs.userId,
			action: auditLogs.action,
			entityType: auditLogs.entityType,
			entityId: auditLogs.entityId,
			oldValues: auditLogs.oldValues,
			newValues: auditLogs.newValues,
			ipAddress: auditLogs.ipAddress,
			userAgent: auditLogs.userAgent,
			createdAt: auditLogs.createdAt,
			user: {
				id: users.id,
				name: users.name,
				email: users.email,
			},
		})
		.from(auditLogs)
		.leftJoin(users, eq(auditLogs.userId, users.id))
		.where(conditions)
		.orderBy(desc(auditLogs.createdAt))
		.limit(limit)
		.offset(offset);

	return logs;
}

export async function getAuditLogsByUser(userId: string, limit = 50) {
	return db
		.select({
			id: auditLogs.id,
			action: auditLogs.action,
			entityType: auditLogs.entityType,
			entityId: auditLogs.entityId,
			oldValues: auditLogs.oldValues,
			newValues: auditLogs.newValues,
			createdAt: auditLogs.createdAt,
		})
		.from(auditLogs)
		.where(eq(auditLogs.userId, userId))
		.orderBy(desc(auditLogs.createdAt))
		.limit(limit);
}
