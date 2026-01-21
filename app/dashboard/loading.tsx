import { StatsCardSkeleton } from '@/components/ui/stats-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function DashboardLoading() {
	return (
		<div className='space-y-6'>
			<div className='space-y-2'>
				<Skeleton className='h-9 w-48' />
				<Skeleton className='h-4 w-64' />
			</div>

			<div className='grid gap-4 md:grid-cols-3'>
				<StatsCardSkeleton />
				<StatsCardSkeleton />
				<StatsCardSkeleton />
			</div>

			<Card>
				<CardHeader>
					<Skeleton className='h-6 w-32' />
					<Skeleton className='h-4 w-48' />
				</CardHeader>
				<CardContent className='grid gap-4 md:grid-cols-2'>
					<Skeleton className='h-24 w-full' />
					<Skeleton className='h-24 w-full' />
				</CardContent>
			</Card>
		</div>
	);
}
