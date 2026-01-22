'use server';

import { deleteUser as deleteUserAction, updateUser as updateUserAction } from './admin';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function deleteUserById(userId: string) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		throw new Error('Unauthorized');
	}

	const result = await deleteUserAction(userId);
	revalidatePath('/admin/users');
	return result;
}

export async function toggleUserBan(
	userId: string,
	userData: {
		name: string;
		email: string;
		username: string;
		role: 'user' | 'admin';
		banned: boolean;
	},
) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		throw new Error('Unauthorized');
	}

	const result = await updateUserAction(userId, userData);
	revalidatePath('/admin/users');
	return result;
}
