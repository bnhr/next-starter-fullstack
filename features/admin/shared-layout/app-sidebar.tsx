'use client';

import { IconActivity, IconDashboard, IconUser, IconUsers } from '@tabler/icons-react';
import * as React from 'react';

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { NavUser } from './nav-user';

interface NavItem {
	title: string;
	url: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
	title: string;
	items: NavItem[];
}

interface User {
	name: string;
	email: string;
	avatar?: string;
	role: string | null;
}

interface SharedSidebarProps extends React.ComponentProps<typeof Sidebar> {
	user: User;
	isAdmin?: boolean;
}

export function SharedSidebar({ user, isAdmin = false, ...props }: SharedSidebarProps) {
	const pathname = usePathname();

	const overviewNav: NavGroup[] = [
		{
			title: 'Overview',
			items: [
				{
					title: 'Dashboard',
					url: isAdmin ? '/admin' : '/dashboard',
					icon: IconDashboard,
				},
				{
					title: 'Profile',
					url: '/dashboard/profile',
					icon: IconUser,
				},
			],
		},
	];

	const adminNav: NavGroup[] = [
		{
			title: 'Administration',
			items: [
				{
					title: 'Users',
					url: '/admin/users',
					icon: IconUsers,
				},
				{
					title: 'Audit Logs',
					url: '/admin/audit',
					icon: IconActivity,
				},
			],
		},
	];

	const allNavGroups: NavGroup[] = [...overviewNav, ...(isAdmin ? adminNav : [])];

	return (
		<Sidebar collapsible='offcanvas' {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild className='data-[slot=sidebar-menu-button]:p-1.5!'>
							<a href={isAdmin ? '/admin' : '/dashboard'}>
								<IconDashboard className='size-5!' />
								<span className='text-base font-semibold'>
									{isAdmin ? 'Admin Panel' : 'Dashboard'}
								</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				{allNavGroups.map((group) => (
					<SidebarGroup key={group.title}>
						<SidebarGroupLabel>{group.title}</SidebarGroupLabel>
						<SidebarGroupContent className='flex flex-col gap-2'>
							<SidebarMenu>
								{group.items.map((item, index) => {
									const isExactMatch = pathname === item.url;
									const isChildMatch = pathname.startsWith(item.url + '/');
									const isActive = isExactMatch || (index > 0 && isChildMatch);
									return (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton asChild isActive={isActive}>
												<a href={item.url}>
													{item.icon && <item.icon className='size-4' />}
													<span>{item.title}</span>
												</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	);
}
