'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { useActionState } from 'react';
import { SignInAction } from '@/app/actions/auth';
import { LogIn } from 'lucide-react';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
	const [state, formAction, pending] = useActionState(SignInAction, null);

	return (
		<div className={cn('animate-fade-in flex flex-col gap-6', className)} {...props}>
			<Card className='card-hover'>
				<CardHeader className='text-center'>
					<div className='mb-2 flex justify-center'>
						<div className='bg-primary/10 rounded-full p-3'>
							<LogIn className='text-primary h-6 w-6' />
						</div>
					</div>
					<CardTitle>Welcome back</CardTitle>
					<CardDescription>Enter your credentials to access your account</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={formAction}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor='email'>Email or Username</FieldLabel>
								<Input
									id='email'
									name='email'
									type='text'
									placeholder='m@example.com or username'
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
									{/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
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
									{pending ? 'Signing in...' : 'Sign In'}
								</Button>
								<FieldDescription className='text-center'>
									Don&apos;t have an account?{' '}
									<Link href='/register' className='text-primary font-medium hover:underline'>
										Sign up
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
