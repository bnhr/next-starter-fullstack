'use client';

import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

interface UserFiltersProps {
	defaultSearch?: string;
	defaultRole?: string;
	defaultBanned?: string;
}

export function UserFilters({
	defaultSearch = '',
	defaultRole = 'all',
	defaultBanned = 'all',
}: UserFiltersProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const [search, setSearch] = useState(defaultSearch);
	const [role, setRole] = useState(defaultRole);
	const [banned, setBanned] = useState(defaultBanned);

	const hasActiveFilters = search || role !== 'all' || banned !== 'all';

	const updateFilters = (updates: Record<string, string>) => {
		const params = new URLSearchParams(searchParams.toString());

		// Reset to page 1 when filters change
		params.set('page', '1');

		Object.entries(updates).forEach(([key, value]) => {
			if (value && value !== 'all') {
				params.set(key, value);
			} else {
				params.delete(key);
			}
		});

		startTransition(() => {
			router.push(`/admin/users?${params.toString()}`);
		});
	};

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		updateFilters({ search, role, banned });
	};

	const handleRoleChange = (value: string) => {
		setRole(value);
		updateFilters({ search, role: value, banned: value });
	};

	const handleBannedChange = (value: string) => {
		setBanned(value);
		updateFilters({ search, role: value, banned: value });
	};

	const handleClearFilters = () => {
		setSearch('');
		setRole('all');
		setBanned('all');
		startTransition(() => {
			router.push('/admin/users');
		});
	};

	return (
		<div className='space-y-4'>
			<div className='flex gap-4'>
				<form onSubmit={handleSearchSubmit} className='flex flex-1 gap-2'>
					<div className='relative max-w-md flex-1'>
						<Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
						<Input
							name='search'
							placeholder='Search by name, email, or username...'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className='pl-9'
							disabled={isPending}
						/>
					</div>
					<Button type='submit' disabled={isPending}>
						Search
					</Button>
				</form>

				<Select value={role} onValueChange={handleRoleChange} disabled={isPending}>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='Select role' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All Roles</SelectItem>
						<SelectItem value='admin'>Admin</SelectItem>
						<SelectItem value='user'>User</SelectItem>
					</SelectContent>
				</Select>

				<Select value={banned} onValueChange={handleBannedChange} disabled={isPending}>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='Select status' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All Status</SelectItem>
						<SelectItem value='false'>Active</SelectItem>
						<SelectItem value='true'>Banned</SelectItem>
					</SelectContent>
				</Select>

				{hasActiveFilters && (
					<Button variant='outline' onClick={handleClearFilters} disabled={isPending}>
						<X className='mr-2 h-4 w-4' />
						Clear
					</Button>
				)}
			</div>

			{hasActiveFilters && (
				<div className='text-muted-foreground flex items-center gap-2 text-sm'>
					<span>Active filters:</span>
					{search && <span className='bg-muted rounded-md px-2 py-1'>Search: {search}</span>}
					{role !== 'all' && <span className='bg-muted rounded-md px-2 py-1'>Role: {role}</span>}
					{banned !== 'all' && (
						<span className='bg-muted rounded-md px-2 py-1'>
							Status: {banned === 'true' ? 'Banned' : 'Active'}
						</span>
					)}
				</div>
			)}
		</div>
	);
}
