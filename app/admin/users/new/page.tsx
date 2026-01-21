import { UserForm, type UserFormData } from '@/features/admin/components/user-form';
import { createUser } from '@/app/actions/admin';
import { redirect } from 'next/navigation';

export default function NewUserPage() {
	async function handleCreateUser(
		data: UserFormData,
	): Promise<{ error?: string; success?: boolean }> {
		'use server';

		try {
			await createUser({
				name: data.name,
				email: data.email,
				username: data.username,
				password: data.password || '',
				role: data.role,
				banned: data.banned,
			});
			redirect('/admin/users');
		} catch (error) {
			return {
				error: error instanceof Error ? error.message : 'Failed to create user',
			};
		}
	}

	return (
		<div className='mx-auto max-w-2xl min-w-2xl'>
			<UserForm action={handleCreateUser} />
		</div>
	);
}
