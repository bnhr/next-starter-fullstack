import { PasswordForm } from '@/features/profile/components/password-form';
import { changePassword } from '@/app/actions/profile';

export default function PasswordPage() {
	async function handleChangePassword(
		data: Parameters<typeof changePassword>[0],
	): Promise<{ error?: string; success?: boolean }> {
		'use server';

		try {
			await changePassword(data);
			return { success: true };
		} catch (error) {
			return {
				error: error instanceof Error ? error.message : 'Failed to change password',
			};
		}
	}

	return (
		<div className='max-w-2xl space-y-6'>
			<div>
				<h1 className='text-3xl font-bold'>Change Password</h1>
				<p className='text-muted-foreground'>Update your password to keep your account secure</p>
			</div>

			<PasswordForm action={handleChangePassword} />
		</div>
	);
}
