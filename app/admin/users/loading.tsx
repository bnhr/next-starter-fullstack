import { TableSkeleton } from '@/components/ui/table-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function UsersLoading() {
	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div className='space-y-2'>
					<Skeleton className='h-9 w-32' />
					<Skeleton className='h-4 w-64' />
				</div>
				<Skeleton className='h-10 w-28' />
			</div>

			<div className='flex gap-4'>
				<Skeleton className='h-10 flex-1' />
				<Skeleton className='h-10 w-32' />
				<Skeleton className='h-10 w-32' />
			</div>

			<TableSkeleton rows={10} columns={7} />

			<div className='flex items-center justify-between'>
				<Skeleton className='h-4 w-40' />
				<Skeleton className='h-10 w-64' />
			</div>
		</div>
	);
}
