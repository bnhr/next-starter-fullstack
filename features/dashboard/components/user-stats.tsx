import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconUser, IconClock, IconShieldCheck } from '@tabler/icons-react';
import { format } from 'date-fns';

interface UserStatsProps {
	user: {
		name: string | null;
		email: string;
		createdAt: Date;
		role: string;
	};
	daysSince: number;
}

export function UserStats({ user, daysSince }: UserStatsProps) {
	const memberSince = format(user.createdAt, 'MMMM yyyy');

	return (
		<div className='grid gap-4 md:grid-cols-3'>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>Account Type</CardTitle>
					<IconShieldCheck className='text-muted-foreground h-4 w-4' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold capitalize'>{user.role}</div>
					<p className='text-muted-foreground text-xs'>Your current role</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>Member Since</CardTitle>
					<IconClock className='text-muted-foreground h-4 w-4' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{memberSince}</div>
					<p className='text-muted-foreground text-xs'>{daysSince} days ago</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>Profile</CardTitle>
					<IconUser className='text-muted-foreground h-4 w-4' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>Active</div>
					<p className='text-muted-foreground text-xs'>Account status</p>
				</CardContent>
			</Card>
		</div>
	);
}
