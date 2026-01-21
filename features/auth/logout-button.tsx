'use client';

import { signOut } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useTransition } from 'react';

export function LogoutButton() {
	const [isPending, startTransition] = useTransition();

	const handleLogout = () => {
		startTransition(async () => {
			await signOut();
		});
	};

	return (
		<Button
			type='button'
			variant='outline'
			className='w-full'
			onClick={handleLogout}
			disabled={isPending}
		>
			{isPending && <Spinner />}
			{isPending ? 'Logging out...' : 'Logout'}
		</Button>
	);
}
