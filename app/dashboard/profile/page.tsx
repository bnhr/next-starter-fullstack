import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserById } from '@/app/actions/admin';
import { notFound } from 'next/navigation';
import { ProfileForm } from '@/features/profile/components/profile-form';
import { updateProfile } from '@/app/actions/profile';

export default async function ProfilePage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect('/');
	}

	const user = await getUserById(session.user.id);

	if (!user) {
		notFound();
	}

	async function handleUpdateProfile(
		data: Parameters<typeof updateProfile>[0],
	): Promise<{ error?: string; success?: boolean }> {
		'use server';

		try {
			await updateProfile(data);
			return { success: true };
		} catch (error) {
			return {
				error: error instanceof Error ? error.message : 'Failed to update profile',
			};
		}
	}

	return (
		<div className='max-w-2xl space-y-6'>
			<div>
				<h1 className='text-3xl font-bold'>Profile</h1>
				<p className='text-muted-foreground'>Manage your account information</p>
			</div>

			<ProfileForm
				defaultValues={{
					name: user.name,
					email: user.email,
					username: user.username || '',
				}}
				action={handleUpdateProfile}
			/>
		</div>
	);
}
