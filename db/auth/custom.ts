import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, index, jsonb } from 'drizzle-orm/pg-core';
import { users } from './generated';

export const profiles = pgTable(
	'profiles',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		phone: text('phone'),
		address: text('address'),
		city: text('city'),
		state: text('state'),
		zipCode: text('zip_code'),
		country: text('country'),
		companyName: text('company_name'),
		jobTitle: text('job_title'),
		bio: text('bio'),
		avatarUrl: text('avatar_url'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index('profiles_userId_idx').on(table.userId)],
);

export const auditLogs = pgTable(
	'audit_logs',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		action: text('action').notNull(),
		entityType: text('entity_type').notNull(),
		entityId: text('entity_id'),
		oldValues: jsonb('old_values'),
		newValues: jsonb('new_values'),
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => [
		index('audit_logs_userId_idx').on(table.userId),
		index('audit_logs_entityType_idx').on(table.entityType),
		index('audit_logs_createdAt_idx').on(table.createdAt),
	],
);

export const profilesRelations = relations(profiles, ({ one }) => ({
	user: one(users, {
		fields: [profiles.userId],
		references: [users.id],
	}),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
	user: one(users, {
		fields: [auditLogs.userId],
		references: [users.id],
	}),
}));
