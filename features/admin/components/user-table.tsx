'use client';

import { Badge } from '@/components/ui/badge';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { format } from 'date-fns';
import { UserActions } from './user-actions';
import { UserRoleBadge } from './user-role-badge';

export interface UserListItem {
	id: string;
	name: string;
	email: string;
	username: string | null;
	role: 'user' | 'admin';
	banned: boolean;
	createdAt: Date;
}

interface UserTableProps {
	data: UserListItem[];
}

export function UserTable({ data }: UserTableProps) {
	const columns: ColumnDef<UserListItem>[] = [
		{
			accessorKey: 'name',
			header: 'Name',
			cell: ({ row }) => {
				const username = row.getValue('username') as string | null;
				return (
					<div>
						<p className='font-medium'>{row.getValue('name')}</p>
						{username && <p className='text-muted-foreground text-sm'>@{username}</p>}
					</div>
				);
			},
		},
		{
			accessorKey: 'username',
			header: 'Username',
		},
		{
			accessorKey: 'email',
			header: 'Email',
		},
		{
			accessorKey: 'role',
			header: 'Role',
			cell: ({ row }) => <UserRoleBadge role={row.getValue('role')} />,
		},
		{
			accessorKey: 'banned',
			header: 'Status',
			cell: ({ row }) => (
				<Badge
					variant={!row.getValue('banned') ? 'default' : 'destructive'}
					className={cn(
						'transition-colors duration-200',
						!row.getValue('banned')
							? 'bg-green-500/10 text-green-700 hover:bg-green-500/20'
							: 'bg-red-500/10 text-red-700 hover:bg-red-500/20',
					)}
				>
					{row.getValue('banned') ? 'Banned' : 'Active'}
				</Badge>
			),
		},
		{
			accessorKey: 'createdAt',
			header: 'Joined',
			cell: ({ row }) => format(row.getValue('createdAt'), 'MMM d, yyyy'),
		},
		{
			id: 'actions',
			cell: ({ row }) => <UserActions user={row.original} />,
		},
	];

	// eslint-disable-next-line react-hooks/incompatible-library
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className='rounded-md border'>
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(header.column.columnDef.header, header.getContext())}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && 'selected'}
								className='hover:bg-muted/50 transition-colors'
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className='h-24 text-center'>
								No users found.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
