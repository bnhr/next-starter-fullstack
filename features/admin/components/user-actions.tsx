'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, Edit, Shield, Trash2, Ban, UserCheck, Eye } from 'lucide-react';
import { useState, useTransition } from 'react';
import { deleteUserById, toggleUserBan } from '@/app/actions/user-management';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface User {
	id: string;
	name: string;
	email: string;
	username: string | null;
	role: 'user' | 'admin';
	banned: boolean;
}

interface UserActionsProps {
	user: User;
}

export function UserActions({ user }: UserActionsProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showBanDialog, setShowBanDialog] = useState(false);

	const handleDelete = () => {
		startTransition(async () => {
			try {
				await deleteUserById(user.id);
				toast.success('User deleted successfully');
				router.refresh();
				setShowDeleteDialog(false);
			} catch (error) {
				toast.error(error instanceof Error ? error.message : 'Failed to delete user');
			}
		});
	};

	const handleBanToggle = () => {
		startTransition(async () => {
			try {
				await toggleUserBan(user.id, {
					name: user.name,
					email: user.email,
					username: user.username || '',
					role: user.role,
					banned: !user.banned,
				});
				toast.success(user.banned ? 'User unbanned successfully' : 'User banned successfully');
				router.refresh();
				setShowBanDialog(false);
			} catch (error) {
				toast.error(error instanceof Error ? error.message : 'Failed to update user');
			}
		});
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='ghost'
						className='transition-smooth hover:bg-muted h-8 w-8 p-0'
						aria-label={`Actions for ${user.name}`}
					>
						<span className='sr-only'>Open menu</span>
						<MoreHorizontal className='h-4 w-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<a href={`/admin/users/${user.id}`} aria-label={`View details for ${user.name}`}>
							<Eye className='mr-2 h-4 w-4' />
							View Details
						</a>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<a href={`/admin/users/${user.id}`} aria-label={`Edit ${user.name}`}>
							<Edit className='mr-2 h-4 w-4' />
							Edit User
						</a>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => setShowBanDialog(true)}
						disabled={isPending}
						aria-label={user.banned ? `Unban ${user.name}` : `Ban ${user.name}`}
					>
						{user.banned ? (
							<>
								<UserCheck className='mr-2 h-4 w-4' />
								Unban User
							</>
						) : (
							<>
								<Ban className='mr-2 h-4 w-4' />
								Ban User
							</>
						)}
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<a
							href={`/admin/audit?userId=${user.id}`}
							aria-label={`View audit logs for ${user.name}`}
						>
							<Shield className='mr-2 h-4 w-4' />
							View Audit Logs
						</a>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => setShowDeleteDialog(true)}
						disabled={isPending}
						className='text-destructive focus:text-destructive'
						aria-label={`Delete ${user.name}`}
					>
						<Trash2 className='mr-2 h-4 w-4' />
						Delete User
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete <strong>{user.name}</strong> ({user.email}). This action
							cannot be undone and will remove all associated data including sessions, accounts, and
							audit logs.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={isPending}
							className='bg-destructive hover:bg-destructive/90 btn-press text-white'
						>
							{isPending ? 'Deleting...' : 'Delete User'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog open={showBanDialog} onOpenChange={setShowBanDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{user.banned ? 'Unban User' : 'Ban User'}</AlertDialogTitle>
						<AlertDialogDescription>
							{user.banned ? (
								<>
									This will restore access for <strong>{user.name}</strong> ({user.email}). They
									will be able to log in and use the application again.
								</>
							) : (
								<>
									This will revoke access for <strong>{user.name}</strong> ({user.email}). They will
									not be able to log in until unbanned.
								</>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleBanToggle} disabled={isPending} className='btn-press'>
							{isPending ? 'Processing...' : user.banned ? 'Unban User' : 'Ban User'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
