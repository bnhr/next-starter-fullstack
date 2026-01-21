'use client';

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

interface UserPaginationProps {
	currentPage: number;
	totalPages: number;
	total: number;
	limit: number;
}

export function UserPagination({ currentPage, totalPages, total, limit }: UserPaginationProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const startItem = (currentPage - 1) * limit + 1;
	const endItem = Math.min(currentPage * limit, total);

	const buildUrl = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', page.toString());
		return `/admin/users?${params.toString()}`;
	};

	const navigateToPage = (page: number, e: React.MouseEvent) => {
		e.preventDefault();
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', page.toString());

		startTransition(() => {
			router.push(`/admin/users?${params.toString()}`);
		});
	};

	const handleLimitChange = (newLimit: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('limit', newLimit);
		params.set('page', '1');

		startTransition(() => {
			router.push(`/admin/users?${params.toString()}`);
		});
	};

	// Generate page numbers to display
	const getPageNumbers = () => {
		const pages: (number | 'ellipsis')[] = [];
		const maxVisible = 7;

		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1);

			if (currentPage > 3) {
				pages.push('ellipsis');
			}

			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (currentPage < totalPages - 2) {
				pages.push('ellipsis');
			}

			pages.push(totalPages);
		}

		return pages;
	};

	if (totalPages <= 1) {
		return (
			<div className='flex items-center justify-between'>
				<p className='text-muted-foreground text-sm'>
					Showing {total} {total === 1 ? 'user' : 'users'}
				</p>
				<div className='flex items-center gap-2'>
					<span className='text-muted-foreground text-sm'>Items per page:</span>
					<Select value={limit.toString()} onValueChange={handleLimitChange}>
						<SelectTrigger className='w-[100px]'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='10'>10</SelectItem>
							<SelectItem value='25'>25</SelectItem>
							<SelectItem value='50'>50</SelectItem>
							<SelectItem value='100'>100</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		);
	}

	return (
		<div className='flex items-center justify-between'>
			<p className='text-muted-foreground text-sm'>
				Showing {startItem} to {endItem} of {total} users
			</p>

			<div className='flex items-center gap-6'>
				<div className='flex items-center gap-2'>
					<span className='text-muted-foreground text-sm'>Items per page:</span>
					<Select value={limit.toString()} onValueChange={handleLimitChange} disabled={isPending}>
						<SelectTrigger className='w-[100px]'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='10'>10</SelectItem>
							<SelectItem value='25'>25</SelectItem>
							<SelectItem value='50'>50</SelectItem>
							<SelectItem value='100'>100</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								href={buildUrl(currentPage - 1)}
								onClick={(e) => navigateToPage(currentPage - 1, e)}
								aria-disabled={currentPage === 1 || isPending}
								className={
									currentPage === 1 || isPending ? 'pointer-events-none opacity-50' : undefined
								}
							/>
						</PaginationItem>

						{getPageNumbers().map((page, index) =>
							page === 'ellipsis' ? (
								<PaginationItem key={`ellipsis-${index}`}>
									<PaginationEllipsis />
								</PaginationItem>
							) : (
								<PaginationItem key={page}>
									<PaginationLink
										href={buildUrl(page)}
										onClick={(e) => navigateToPage(page, e)}
										isActive={currentPage === page}
										aria-disabled={isPending}
										className={isPending ? 'pointer-events-none opacity-50' : undefined}
									>
										{page}
									</PaginationLink>
								</PaginationItem>
							),
						)}

						<PaginationItem>
							<PaginationNext
								href={buildUrl(currentPage + 1)}
								onClick={(e) => navigateToPage(currentPage + 1, e)}
								aria-disabled={currentPage === totalPages || isPending}
								className={
									currentPage === totalPages || isPending
										? 'pointer-events-none opacity-50'
										: undefined
								}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	);
}
