'use server';

import { deleteUser as deleteUserAction, updateUser as updateUserAction } from './admin';
import { revalidatePath } from 'next/cache';

export async function deleteUserById(userId: string) {
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
	const result = await updateUserAction(userId, userData);
	revalidatePath('/admin/users');
	return result;
}
