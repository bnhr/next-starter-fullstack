import { getUsers } from '@/app/actions/admin';
import { UserTable, UserListItem } from '@/features/admin/components/user-table';
import { UserCardMobile } from '@/features/admin/components/user-card-mobile';
import { UserFilters } from '@/features/admin/components/user-filters';
import { UserPagination } from '@/features/admin/components/user-pagination';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { SearchParams } from '@/types';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface UsersPageProps {
	searchParams: Promise<SearchParams>;
}

function getStringParam(param: string | string[] | undefined, defaultValue: string): string {
	if (Array.isArray(param)) return param[0] || defaultValue;
	return param || defaultValue;
}

function getNumberParam(param: string | string[] | undefined, defaultValue: number): number {
	const value = Array.isArray(param) ? param[0] : param;
	const parsed = Number(value);
	return isNaN(parsed) ? defaultValue : parsed;
}

function UserTableSkeleton() {
	return (
		<div className='space-y-4'>
			<div className='rounded-md border'>
				<div className='space-y-3 p-4'>
					{[...Array(5)].map((_, i) => (
						<Skeleton key={i} className='h-16 w-full' />
					))}
				</div>
			</div>
		</div>
	);
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
	const params = await searchParams;
	const page = getNumberParam(params.page, 1);
	const limit = getNumberParam(params.limit, 10);
	const search = getStringParam(params.search, '');
	const role = getStringParam(params.role, 'all');
	const banned = getStringParam(params.banned, 'all');

	const { users, total, totalPages } = await getUsers({
		page,
		limit,
		search,
		role,
		banned,
	});

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold'>Users</h1>
					<p className='text-muted-foreground'>Manage user accounts and permissions</p>
				</div>
				<Button asChild className='btn-press'>
					<Link href='/admin/users/new'>
						<Plus className='mr-2 h-4 w-4' />
						Add User
					</Link>
				</Button>
			</div>

			<UserFilters defaultSearch={search} defaultRole={role} defaultBanned={banned} />

			<Suspense fallback={<UserTableSkeleton />}>
				{/* Desktop view */}
				<div className='hidden md:block'>
					<UserTable data={users as UserListItem[]} />
				</div>

				{/* Mobile view */}
				<div className='md:hidden'>
					<UserCardMobile users={users as UserListItem[]} />
				</div>
			</Suspense>

			<UserPagination currentPage={page} totalPages={totalPages} total={total} limit={limit} />
		</div>
	);
}
