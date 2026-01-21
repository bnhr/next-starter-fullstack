'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export interface UserFormData {
	name: string;
	email: string;
	username: string;
	password?: string;
	role: 'admin' | 'user';
	banned: boolean;
}

interface UserFormProps {
	defaultValues?: Partial<UserFormData>;
	action: (data: UserFormData) => Promise<{ error?: string; success?: boolean }>;
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
	const { pending } = useFormStatus();

	return (
		<Button type='submit' disabled={pending}>
			{pending ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
		</Button>
	);
}

export function UserForm({ defaultValues, action }: UserFormProps) {
	const isEdit = !!defaultValues?.email;
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(formData: FormData) {
		setError(null);

		const data: UserFormData = {
			name: formData.get('name') as string,
			email: formData.get('email') as string,
			username: formData.get('username') as string,
			role: (formData.get('role') as 'admin' | 'user') || 'user',
			banned: formData.get('banned') === 'on',
		};

		if (!isEdit) {
			data.password = formData.get('password') as string;
		}

		const result = await action(data);

		if (result.error) {
			setError(result.error);
		}
	}

	return (
		<form action={handleSubmit} className='space-y-6'>
			<Card>
				<CardHeader>
					<CardTitle>{isEdit ? 'Edit User' : 'Create User'}</CardTitle>
					<CardDescription>
						{isEdit
							? "Update the user's information below"
							: 'Fill in the details to create a new user'}
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					{error && <div className='rounded-md bg-red-50 p-3 text-sm text-red-500'>{error}</div>}

					<div className='space-y-2'>
						<Label htmlFor='name'>Name</Label>
						<Input id='name' name='name' defaultValue={defaultValues?.name} required />
					</div>

					<div className='space-y-2'>
						<Label htmlFor='email'>Email</Label>
						<Input
							id='email'
							name='email'
							type='email'
							defaultValue={defaultValues?.email}
							required
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='username'>Username</Label>
						<Input id='username' name='username' defaultValue={defaultValues?.username} required />
					</div>

					{!isEdit && (
						<div className='space-y-2'>
							<Label htmlFor='password'>Password</Label>
							<Input id='password' name='password' type='password' required />
						</div>
					)}

					<div className='grid gap-4 md:grid-cols-2'>
						<div className='space-y-2'>
							<Label htmlFor='role'>Role</Label>
							<Select name='role' defaultValue={defaultValues?.role || 'user'}>
								<SelectTrigger>
									<SelectValue placeholder='Select role' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='user'>User</SelectItem>
									<SelectItem value='admin'>Admin</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className='flex items-center space-x-3 pt-6'>
							<Checkbox id='banned' name='banned' defaultChecked={defaultValues?.banned ?? false} />
							<Label htmlFor='banned'>Banned</Label>
						</div>
					</div>

					<div className='flex justify-end gap-4'>
						<Button type='button' variant='outline' asChild>
							<Link href='/admin/users'>Cancel</Link>
						</Button>
						<SubmitButton isEdit={isEdit} />
					</div>
				</CardContent>
			</Card>
		</form>
	);
}
