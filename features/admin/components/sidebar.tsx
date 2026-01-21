'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SidebarProps {
	user: {
		name: string | null;
		email: string;
		image: string | null;
		role: string | null;
	};
}

const navigation = [
	{ name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
	{ name: 'Users', href: '/admin/users', icon: Users },
	{ name: 'Audit Logs', href: '/admin/audit', icon: FileText },
];

export function AdminSidebar({ user }: SidebarProps) {
	const pathname = usePathname();

	return (
		<div className='bg-card flex h-full w-64 flex-col border-r'>
			<div className='flex h-16 items-center border-b px-6'>
				<Shield className='mr-2 h-6 w-6' />
				<span className='text-lg font-semibold'>Admin</span>
			</div>

			<nav className='flex-1 space-y-1 p-4'>
				{navigation.map((item) => {
					const isActive =
						pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
					return (
						<Link
							key={item.name}
							href={item.href}
							className={cn(
								'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
								isActive
									? 'bg-primary text-primary-foreground'
									: 'text-muted-foreground hover:bg-muted hover:text-foreground',
							)}
						>
							<item.icon className='mr-3 h-4 w-4' />
							{item.name}
						</Link>
					);
				})}
			</nav>

			<div className='border-t p-4'>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='w-full justify-start px-2'>
							<Avatar className='mr-2 h-8 w-8'>
								<AvatarImage src={user.image || undefined} />
								<AvatarFallback>{user.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
							</Avatar>
							<div className='flex flex-col items-start text-left'>
								<span className='text-sm font-medium'>{user.name}</span>
								<span className='text-muted-foreground text-xs'>{user.email}</span>
							</div>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end' className='w-56'>
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link href='/dashboard/profile'>
								<Settings className='mr-2 h-4 w-4' />
								Profile
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<form action='/api/auth/sign-out' method='post'>
								<button className='flex w-full items-center'>
									<LogOut className='mr-2 h-4 w-4' />
									Log out
								</button>
							</form>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
