'use client';

import { signOut } from '@/app/actions/auth';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SignOutButton() {
	return (
		<form
			action={async () => {
				'use server';
				await signOut();
			}}
		>
			<Button type='submit' variant='ghost' className='w-full justify-start'>
				<LogOut className='mr-2 h-4 w-4' />
				Log out
			</Button>
		</form>
	);
}
