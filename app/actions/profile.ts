import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { createAuditLog } from '@/lib/audit';

export interface UpdateProfileInput {
	name: string;
	email: string;
	username: string;
}

export async function updateProfile(input: UpdateProfileInput) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error('Unauthorized');
	}

	const existingUser = await db.query.users.findFirst({
		where: (fields, { eq }) => eq(fields.id, session.user.id),
	});

	if (!existingUser) {
		throw new Error('User not found');
	}

	await db
		.update(users)
		.set({
			name: input.name,
			email: input.email,
			username: input.username,
		})
		.where(eq(users.id, session.user.id));

	await createAuditLog({
		userId: session.user.id,
		action: 'profile.update',
		entityType: 'profile',
		oldValues: {
			name: existingUser.name,
			email: existingUser.email,
		},
		newValues: input as unknown as Record<string, unknown>,
	});

	return { success: true };
}

export interface ChangePasswordInput {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

export async function changePassword(data: ChangePasswordInput) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error('Unauthorized');
	}

	if (data.newPassword !== data.confirmPassword) {
		throw new Error('Passwords do not match');
	}

	if (data.newPassword.length < 8) {
		throw new Error('Password must be at least 8 characters');
	}

	await auth.api.changePassword({
		headers: await headers(),
		body: {
			newPassword: data.newPassword,
			currentPassword: data.currentPassword,
		},
	});

	await createAuditLog({
		userId: session.user.id,
		action: 'password.change',
		entityType: 'user',
	});

	return { success: true };
}
