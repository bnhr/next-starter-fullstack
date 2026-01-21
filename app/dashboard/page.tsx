import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { UserStats } from '@/features/dashboard/components/user-stats';
import { QuickActions } from '@/features/dashboard/components/quick-actions';
import { getUserDashboardData } from '@/app/actions/dashboard';

export default async function DashboardPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect('/');
	}

	const dashboardData = await getUserDashboardData(session.user.id);

	if (!dashboardData) {
		redirect('/');
	}

	const { user, daysSince } = dashboardData;

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold'>Dashboard</h1>
				<p className='text-muted-foreground'>Welcome back, {user.name || user.email}</p>
			</div>

			<UserStats user={user} daysSince={daysSince} />

			<QuickActions />
		</div>
	);
}
