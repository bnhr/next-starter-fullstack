'use client';

import { Card, CardContent } from '@/components/ui/card';
import { UserActions } from './user-actions';
import { UserRoleBadge } from './user-role-badge';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { UserListItem } from './user-table';

interface UserCardMobileProps {
	users: UserListItem[];
}

export function UserCardMobile({ users }: UserCardMobileProps) {
	if (users.length === 0) {
		return (
			<Card>
				<CardContent className='text-muted-foreground py-8 text-center'>
					No users found.
				</CardContent>
			</Card>
		);
	}

	return (
		<div className='space-y-4'>
			{users.map((user) => (
				<Card key={user.id} className='transition-all hover:shadow-md'>
					<CardContent className='p-4'>
						<div className='mb-3 flex items-start justify-between'>
							<div className='flex-1'>
								<h3 className='text-base font-semibold'>{user.name}</h3>
								{user.username && <p className='text-muted-foreground text-sm'>@{user.username}</p>}
								<p className='text-muted-foreground mt-1 text-sm'>{user.email}</p>
							</div>
							<UserActions
								user={{
									...user,
									role: user.role as 'user' | 'admin',
								}}
							/>
						</div>

						<div className='flex flex-wrap items-center gap-2'>
							<UserRoleBadge role={user.role} />
							<Badge
								variant={!user.banned ? 'default' : 'destructive'}
								className={cn(
									'transition-colors duration-200',
									!user.banned
										? 'bg-green-500/10 text-green-700 hover:bg-green-500/20'
										: 'bg-red-500/10 text-red-700 hover:bg-red-500/20',
								)}
							>
								{user.banned ? 'Banned' : 'Active'}
							</Badge>
							<span className='text-muted-foreground ml-auto text-xs'>
								Joined {format(user.createdAt, 'MMM d, yyyy')}
							</span>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
