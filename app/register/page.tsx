import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { RegisterForm } from '@/features/auth/register-form';

export default async function RegisterPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session) {
		redirect('/dashboard');
	}

	return (
		<div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
			<div className='w-full max-w-sm'>
				<RegisterForm />
			</div>
		</div>
	);
}
