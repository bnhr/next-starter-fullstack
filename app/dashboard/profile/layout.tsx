import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect('/');
	}

	const navItems = [
		{ href: '/dashboard/profile', label: 'Profile', icon: User },
		{ href: '/dashboard/profile/password', label: 'Password', icon: Settings },
	];

	return (
		<div className='space-y-6'>
			<nav className='bg-muted/50 flex space-x-1 rounded-lg p-1'>
				{navItems.map((item) => (
					<Link
						key={item.href}
						href={item.href}
						className={cn(
							'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
							'hover:bg-background hover:text-foreground',
						)}
					>
						<item.icon className='size-4' />
						{item.label}
					</Link>
				))}
			</nav>
			<div className='overflow-y-auto'>{children}</div>
		</div>
	);
}
