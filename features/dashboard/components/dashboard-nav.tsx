'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
	LayoutDashboard,
	User,
	Settings,
	LogOut,
	Menu,
	X,
	Shield,
	Users,
	FileText,
} from 'lucide-react';
import { useState } from 'react';
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

interface DashboardNavProps {
	user: {
		name: string | null;
		email: string;
		image: string | null;
		role: string | null;
	};
}

const userNavigation = [
	{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
	{ name: 'Profile', href: '/dashboard/profile', icon: User },
];

const adminNavigation = [
	{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
	{ name: 'Profile', href: '/dashboard/profile', icon: User },
	{ name: 'Admin Panel', href: '/admin', icon: Shield },
	{ name: 'Users', href: '/admin/users', icon: Users },
	{ name: 'Audit Logs', href: '/admin/audit', icon: FileText },
];

export function DashboardNav({ user }: DashboardNavProps) {
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const isAdmin = user.role === 'admin';
	const navigation = isAdmin ? adminNavigation : userNavigation;

	return (
		<div className='flex flex-col'>
			<header className='bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur'>
				<div className='container flex h-16 items-center justify-between px-4'>
					<div className='flex items-center gap-6'>
						<Link href='/dashboard' className='flex items-center gap-2 font-semibold'>
							<LayoutDashboard className='h-6 w-6' />
							<span className='hidden sm:inline'>Dashboard</span>
						</Link>

						<nav className='hidden items-center gap-1 md:flex'>
							{navigation.map((item) => {
								const isActive =
									pathname === item.href ||
									(item.href !== '/dashboard' && pathname.startsWith(item.href));
								return (
									<Link
										key={item.name}
										href={item.href}
										className={cn(
											'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
											isActive
												? 'bg-primary text-primary-foreground'
												: 'text-muted-foreground hover:bg-muted hover:text-foreground',
										)}
									>
										<item.icon className='h-4 w-4' />
										<span className='hidden lg:inline'>{item.name}</span>
									</Link>
								);
							})}
						</nav>
					</div>

					<div className='flex items-center gap-4'>
						{isAdmin && (
							<Link
								href='/admin'
								className='text-muted-foreground hover:text-foreground hidden items-center gap-2 text-sm sm:flex'
							>
								<Shield className='h-4 w-4' />
								<span>Admin Panel</span>
							</Link>
						)}

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant='ghost' className='relative h-10 w-10 rounded-full'>
									<Avatar className='h-10 w-10'>
										<AvatarImage src={user.image || undefined} />
										<AvatarFallback>{user.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end' className='w-56'>
								<DropdownMenuLabel>
									<div className='flex flex-col'>
										<span>{user.name}</span>
										<span className='text-muted-foreground text-xs'>{user.email}</span>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link href='/dashboard/profile'>
										<User className='mr-2 h-4 w-4' />
										Profile
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href='/dashboard/profile/password'>
										<Settings className='mr-2 h-4 w-4' />
										Settings
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link href='/api/auth/sign-out' className='text-red-600'>
										<LogOut className='mr-2 h-4 w-4' />
										Log out
									</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						<Button
							variant='ghost'
							size='icon'
							className='md:hidden'
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						>
							{mobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
						</Button>
					</div>
				</div>

				{mobileMenuOpen && (
					<div className='border-t md:hidden'>
						<nav className='container space-y-2 px-4 py-4'>
							{navigation.map((item) => {
								const isActive =
									pathname === item.href ||
									(item.href !== '/dashboard' && pathname.startsWith(item.href));
								return (
									<Link
										key={item.name}
										href={item.href}
										onClick={() => setMobileMenuOpen(false)}
										className={cn(
											'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
											isActive
												? 'bg-primary text-primary-foreground'
												: 'text-muted-foreground hover:bg-muted hover:text-foreground',
										)}
									>
										<item.icon className='h-4 w-4' />
										{item.name}
									</Link>
								);
							})}
						</nav>
					</div>
				)}
			</header>
		</div>
	);
}
