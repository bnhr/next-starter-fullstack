import { UserForm, type UserFormData } from '@/features/admin/components/user-form';
import { getUserById, updateUser } from '@/app/actions/admin';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

interface EditUserPageProps {
	params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
	const { id } = await params;
	const user = await getUserById(id);

	if (!user) {
		notFound();
	}

	async function handleUpdateUser(
		data: UserFormData,
	): Promise<{ error?: string; success?: boolean }> {
		'use server';

		try {
			await updateUser(id, {
				name: data.name,
				email: data.email,
				username: data.username,
				role: data.role,
				banned: data.banned,
			});
			redirect('/admin/users');
		} catch (error) {
			return {
				error: error instanceof Error ? error.message : 'Failed to update user',
			};
		}
	}

	return (
		<div className='max-w-2xl'>
			<UserForm
				defaultValues={{
					name: user.name,
					email: user.email,
					username: user.username || '',
					role: user.role as 'admin' | 'user',
					banned: user.banned ?? false,
				}}
				action={handleUpdateUser}
			/>
		</div>
	);
}
