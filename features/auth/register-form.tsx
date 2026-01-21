'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { useActionState } from 'react';
import { SignUpAction } from '@/app/actions/auth';
import { UserPlus } from 'lucide-react';

export function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
	const [state, formAction, pending] = useActionState(SignUpAction, null);

	return (
		<div className={cn('animate-fade-in flex flex-col gap-6', className)} {...props}>
			<Card className='card-hover'>
				<CardHeader className='text-center'>
					<div className='mb-2 flex justify-center'>
						<div className='bg-primary/10 rounded-full p-3'>
							<UserPlus className='text-primary h-6 w-6' />
						</div>
					</div>
					<CardTitle>Create your account</CardTitle>
					<CardDescription>Enter your details below to get started</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={formAction}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor='name'>Full Name</FieldLabel>
								<Input
									id='name'
									name='name'
									type='text'
									placeholder='John Doe'
									required
									disabled={pending}
									className='transition-smooth'
								/>
								{state?.errors?.name && (
									<FieldDescription className='text-red-500'>
										{state.errors.name.join(', ')}
									</FieldDescription>
								)}
							</Field>
							<Field>
								<FieldLabel htmlFor='username'>Username</FieldLabel>
								<Input
									id='username'
									name='username'
									type='text'
									placeholder='johndoe'
									required
									disabled={pending}
									className='transition-smooth'
								/>
								{state?.errors?.username && (
									<FieldDescription className='text-red-500'>
										{state.errors.username.join(', ')}
									</FieldDescription>
								)}
							</Field>
							<Field>
								<FieldLabel htmlFor='email'>Email</FieldLabel>
								<Input
									id='email'
									name='email'
									type='email'
									placeholder='m@example.com'
									required
									disabled={pending}
									className='transition-smooth'
								/>
								{state?.errors?.email && (
									<FieldDescription className='text-red-500'>
										{state.errors.email.join(', ')}
									</FieldDescription>
								)}
							</Field>
							<Field>
								<div className='flex items-center'>
									<FieldLabel htmlFor='password'>Password</FieldLabel>
								</div>
								<Input
									id='password'
									name='password'
									type='password'
									required
									disabled={pending}
									className='transition-smooth'
								/>
								{state?.errors?.password && (
									<FieldDescription className='text-red-500'>
										{state.errors.password.join(', ')}
									</FieldDescription>
								)}
							</Field>
							{state?.message && (
								<FieldDescription className='text-center text-red-500'>
									{state.message}
								</FieldDescription>
							)}
							<Field>
								<Button type='submit' disabled={pending} className='btn-press w-full'>
									{pending && <Spinner />}
									{pending ? 'Creating account...' : 'Create Account'}
								</Button>
								<FieldDescription className='text-center'>
									Already have an account?{' '}
									<Link href='/' className='text-primary font-medium hover:underline'>
										Sign in
									</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
