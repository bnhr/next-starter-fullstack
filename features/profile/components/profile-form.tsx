'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export interface ProfileFormData {
	name: string;
	email: string;
	username: string;
}

interface ProfileFormProps {
	defaultValues?: Partial<ProfileFormData>;
	action: (data: ProfileFormData) => Promise<{ error?: string; success?: boolean }>;
}

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button type='submit' disabled={pending}>
			{pending ? 'Saving...' : 'Save Changes'}
		</Button>
	);
}

export function ProfileForm({ defaultValues, action }: ProfileFormProps) {
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(formData: FormData) {
		setError(null);

		const data: ProfileFormData = {
			name: formData.get('name') as string,
			email: formData.get('email') as string,
			username: formData.get('username') as string,
		};

		const result = await action(data);

		if (result.error) {
			setError(result.error);
			toast.error('Failed to update profile', {
				description: result.error,
			});
		} else if (result.success) {
			toast.success('Profile updated successfully', {
				description: 'Your changes have been saved.',
			});
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Personal Information</CardTitle>
				<CardDescription>Update your personal details and contact information</CardDescription>
			</CardHeader>
			<CardContent>
				<form action={handleSubmit} className='space-y-4'>
					{error && (
						<div className='rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-500'>
							{error}
						</div>
					)}

					<div className='space-y-2'>
						<Label htmlFor='name'>Full Name</Label>
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

					<div className='flex justify-end'>
						<SubmitButton />
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
