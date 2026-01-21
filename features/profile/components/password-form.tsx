'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

interface PasswordFormData {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

interface PasswordFormProps {
	action: (data: PasswordFormData) => Promise<{ error?: string; success?: boolean }>;
}

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button type='submit' disabled={pending}>
			{pending ? 'Changing...' : 'Change Password'}
		</Button>
	);
}

export function PasswordForm({ action }: PasswordFormProps) {
	const [error, setError] = useState<string | null>(null);
	const formRef = useRef<HTMLFormElement>(null);

	async function handleSubmit(formData: FormData) {
		setError(null);

		const data: PasswordFormData = {
			currentPassword: formData.get('currentPassword') as string,
			newPassword: formData.get('newPassword') as string,
			confirmPassword: formData.get('confirmPassword') as string,
		};

		const result = await action(data);

		if (result.error) {
			setError(result.error);
			toast.error('Failed to change password', {
				description: result.error,
			});
		} else if (result.success) {
			toast.success('Password changed successfully', {
				description: 'Your password has been updated.',
			});
			// Reset form
			formRef.current?.reset();
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Change Password</CardTitle>
				<CardDescription>Update your password to keep your account secure</CardDescription>
			</CardHeader>
			<CardContent>
				<form ref={formRef} action={handleSubmit} className='space-y-4'>
					{error && (
						<div className='rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-500'>
							{error}
						</div>
					)}

					<div className='space-y-2'>
						<Label htmlFor='currentPassword'>Current Password</Label>
						<Input id='currentPassword' name='currentPassword' type='password' required />
					</div>

					<div className='space-y-2'>
						<Label htmlFor='newPassword'>New Password</Label>
						<Input id='newPassword' name='newPassword' type='password' required minLength={8} />
						<p className='text-muted-foreground text-xs'>Must be at least 8 characters</p>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='confirmPassword'>Confirm New Password</Label>
						<Input id='confirmPassword' name='confirmPassword' type='password' required />
					</div>

					<div className='flex justify-end'>
						<SubmitButton />
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
