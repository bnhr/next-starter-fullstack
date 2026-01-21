'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import * as v from 'valibot';
import { auth } from '@/lib/auth';
import { LoginSchema, RegisterSchema } from '@/features/auth/schema';

export type ActionState = {
	errors?: {
		name?: string[];
		username?: string[];
		email?: string[];
		password?: string[];
	};
	message?: string;
};

export async function SignUpAction(
	prevState: ActionState | null,
	formData: FormData,
): Promise<ActionState> {
	const name = formData.get('name') as string;
	const username = formData.get('username') as string;
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;

	try {
		const validatedData = v.parse(RegisterSchema, {
			name,
			username,
			email,
			password,
		});

		await auth.api.signUpEmail({
			body: {
				name: validatedData.name,
				username: validatedData.username,
				email: validatedData.email,
				password: validatedData.password,
			},
		});
	} catch (error) {
		if (error instanceof v.ValiError) {
			return {
				errors: error.issues.reduce(
					(acc, issue) => {
						const field = issue.path?.[0]?.key as keyof ActionState['errors'];
						if (field && !acc[field]) {
							acc[field] = [];
						}
						if (field) {
							acc[field]!.push(issue.message);
						}
						return acc;
					},
					{} as NonNullable<ActionState['errors']>,
				),
			};
		}

		console.error('Unexpected error in SignUpAction:', error);
		return {
			message: 'An unexpected error occurred. Please try again.',
		};
	}

	redirect('/');
}

export async function SignInAction(
	prevState: ActionState | null,
	formData: FormData,
): Promise<ActionState> {
	const emailOrUsername = formData.get('email') as string;
	const password = formData.get('password') as string;

	try {
		const validatedData = v.parse(LoginSchema, { email: emailOrUsername, password });

		// Check if input is email or username
		const isEmail = emailOrUsername.includes('@');

		if (isEmail) {
			await auth.api.signInEmail({
				body: {
					email: validatedData.email,
					password: validatedData.password,
				},
			});
		} else {
			await auth.api.signInUsername({
				body: {
					username: validatedData.email,
					password: validatedData.password,
				},
			});
		}
	} catch (error) {
		if (error instanceof v.ValiError) {
			return {
				errors: error.issues.reduce(
					(acc, issue) => {
						const field = issue.path?.[0]?.key as keyof ActionState['errors'];
						if (field && !acc[field]) {
							acc[field] = [];
						}
						if (field) {
							acc[field]!.push(issue.message);
						}
						return acc;
					},
					{} as NonNullable<ActionState['errors']>,
				),
			};
		}

		console.error('Unexpected error in SignInAction:', error);
		return {
			message: 'Invalid email or username. Please try again.',
		};
	}

	redirect('/dashboard');
}

export async function signOut() {
	try {
		await auth.api.signOut({
			headers: await headers(),
		});
	} catch (error) {
		console.error('Error in signOut:', error);
	}
	redirect('/');
}
