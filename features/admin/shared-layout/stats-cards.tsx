'use client';

import {
	IconTrendingUp,
	IconUsers,
	IconUserCheck,
	IconShield,
	IconFileText,
	IconPlus,
} from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export interface DashboardStats {
	totalUsers: number;
	activeUsers: number;
	adminUsers: number;
	recentSignups: number;
	totalAuditLogs: number;
}

interface DashboardStatsCardsProps {
	stats: DashboardStats;
	isAdmin?: boolean;
}

export function DashboardStatsCards({ stats, isAdmin = false }: DashboardStatsCardsProps) {
	return (
		<div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
			<Card className='@container/card'>
				<CardHeader>
					<CardDescription>Total Users</CardDescription>
					<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
						{stats.totalUsers.toLocaleString()}
					</CardTitle>
					<CardAction>
						<Badge variant='outline'>
							<IconUsers className='size-3.5' />
							All
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className='flex-col items-start gap-1.5 text-sm'>
					<div className='line-clamp-1 flex gap-2 font-medium'>
						Registered users <IconTrendingUp className='size-4' />
					</div>
					<div className='text-muted-foreground'>Since account creation</div>
				</CardFooter>
			</Card>
			<Card className='@container/card'>
				<CardHeader>
					<CardDescription>Active Users</CardDescription>
					<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
						{stats.activeUsers.toLocaleString()}
					</CardTitle>
					<CardAction>
						<Badge variant='outline'>
							<IconUserCheck className='size-3.5' />
							Active
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className='flex-col items-start gap-1.5 text-sm'>
					<div className='line-clamp-1 flex gap-2 font-medium'>
						{stats.activeUsers > 0 ? 'Users not banned' : 'All users banned'}
					</div>
					<div className='text-muted-foreground'>Accounts with active status</div>
				</CardFooter>
			</Card>
			{isAdmin && (
				<Card className='@container/card'>
					<CardHeader>
						<CardDescription>Admins</CardDescription>
						<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
							{stats.adminUsers.toLocaleString()}
						</CardTitle>
						<CardAction>
							<Badge variant='outline'>
								<IconShield className='size-3.5' />
								Staff
							</Badge>
						</CardAction>
					</CardHeader>
					<CardFooter className='flex-col items-start gap-1.5 text-sm'>
						<div className='line-clamp-1 flex gap-2 font-medium'>
							Administrative access <IconTrendingUp className='size-4' />
						</div>
						<div className='text-muted-foreground'>Users with admin role</div>
					</CardFooter>
				</Card>
			)}
			<Card className='@container/card'>
				<CardHeader>
					<CardDescription>{isAdmin ? 'Audit Logs' : 'New Signups'}</CardDescription>
					<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
						{isAdmin ? stats.totalAuditLogs.toLocaleString() : stats.recentSignups.toLocaleString()}
					</CardTitle>
					<CardAction>
						<Badge variant='outline'>
							{isAdmin ? <IconFileText className='size-3.5' /> : <IconPlus className='size-3.5' />}
							{isAdmin ? 'Logs' : '7 days'}
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className='flex-col items-start gap-1.5 text-sm'>
					<div className='line-clamp-1 flex gap-2 font-medium'>
						{isAdmin ? 'Total system activity' : 'Joined this week'}{' '}
						<IconTrendingUp className='size-4' />
					</div>
					<div className='text-muted-foreground'>
						{isAdmin ? 'Complete audit trail' : 'New user registrations'}
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
