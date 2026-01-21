import { StatsCardSkeleton } from '@/components/ui/stats-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AdminLoading() {
	return (
		<div className='space-y-8'>
			<div className='grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6'>
				<StatsCardSkeleton />
				<StatsCardSkeleton />
				<StatsCardSkeleton />
				<StatsCardSkeleton />
			</div>

			<div className='grid gap-4 px-4 md:grid-cols-2 lg:px-6'>
				<Card>
					<CardHeader>
						<Skeleton className='h-6 w-32' />
					</CardHeader>
					<CardContent>
						<Skeleton className='h-12 w-24' />
						<Skeleton className='mt-2 h-3 w-40' />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<Skeleton className='h-6 w-32' />
					</CardHeader>
					<CardContent className='space-y-4'>
						{[...Array(5)].map((_, i) => (
							<div key={i} className='flex items-center justify-between border-b pb-2'>
								<div className='space-y-1'>
									<Skeleton className='h-4 w-32' />
									<Skeleton className='h-3 w-24' />
								</div>
								<Skeleton className='h-3 w-16' />
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
