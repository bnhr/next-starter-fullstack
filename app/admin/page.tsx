import { getAdminStats } from '@/app/actions/admin';
import { DashboardStatsCards } from '@/features/admin/shared-layout/stats-cards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { format } from 'date-fns';
import { getRecentActivity } from '@/app/actions/admin';

export default async function AdminDashboardPage() {
	const [stats, recentActivity] = await Promise.all([getAdminStats(), getRecentActivity(5)]);

	return (
		<div className='space-y-8'>
			<DashboardStatsCards stats={stats} isAdmin={true} />

			<div className='grid gap-4 px-4 md:grid-cols-2 lg:px-6'>
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<Activity className='h-5 w-5' />
							Recent Signups
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-3xl font-bold'>{stats.recentSignups}</div>
						<p className='text-muted-foreground text-xs'>Users who signed up in the last 7 days</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
					</CardHeader>
					<CardContent>
						{recentActivity.length === 0 ? (
							<p className='text-muted-foreground text-sm'>No recent activity</p>
						) : (
							<div className='space-y-4'>
								{recentActivity.map((activity) => (
									<div
										key={activity.id}
										className='flex items-center justify-between border-b pb-2 last:border-0 last:pb-0'
									>
										<div>
											<p className='text-sm font-medium'>{activity.action}</p>
											<p className='text-muted-foreground text-xs'>
												{activity.user.name || activity.user.email}
											</p>
										</div>
										<span className='text-muted-foreground text-xs'>
											{format(activity.createdAt, 'MMM d, HH:mm')}
										</span>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
