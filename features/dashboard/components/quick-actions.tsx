import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconUser, IconLock } from '@tabler/icons-react';
import Link from 'next/link';

export function QuickActions() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Quick Actions</CardTitle>
				<CardDescription>Common tasks and settings</CardDescription>
			</CardHeader>
			<CardContent className='grid gap-4 md:grid-cols-2'>
				<Button variant='outline' className='h-auto flex-col items-start p-4' asChild>
					<Link href='/dashboard/profile'>
						<div className='mb-2 flex items-center gap-2'>
							<IconUser className='h-5 w-5' />
							<span className='font-semibold'>Edit Profile</span>
						</div>
						<p className='text-muted-foreground text-left text-xs'>
							Update your personal information
						</p>
					</Link>
				</Button>

				<Button variant='outline' className='h-auto flex-col items-start p-4' asChild>
					<Link href='/dashboard/profile/password'>
						<div className='mb-2 flex items-center gap-2'>
							<IconLock className='h-5 w-5' />
							<span className='font-semibold'>Change Password</span>
						</div>
						<p className='text-muted-foreground text-left text-xs'>Update your account security</p>
					</Link>
				</Button>
			</CardContent>
		</Card>
	);
}
