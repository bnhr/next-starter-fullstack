import * as v from 'valibot';

const EmailSchema = v.pipe(
	v.string(),
	v.nonEmpty('Please enter your email.'),
	v.email('The email is badly formatted.'),
	v.maxLength(30, 'Your email is too long.'),
);

export const LoginSchema = v.pipe(
	v.object({
		email: v.pipe(
			v.string(),
			v.nonEmpty('Please enter your email or username.'),
			v.minLength(3, 'Your email or username is too short.'),
		),
		password: v.pipe(
			v.string(),
			v.nonEmpty('Please enter your password.'),
			v.minLength(8, 'Your password is too short.'),
			v.maxLength(18, 'Your password is too long.'),
		),
	}),
);

export const RegisterSchema = v.pipe(
	v.object({
		name: v.pipe(
			v.string(),
			v.nonEmpty('Please enter your full name.'),
			v.minLength(2, 'Your name is too short.'),
			v.maxLength(50, 'Your name is too long.'),
		),
		username: v.pipe(
			v.string(),
			v.nonEmpty('Please enter your username.'),
			v.minLength(3, 'Your username is too short.'),
			v.maxLength(20, 'Your username is too long.'),
			v.regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.'),
		),
		email: EmailSchema,
		password: v.pipe(
			v.string(),
			v.nonEmpty('Please enter your password.'),
			v.minLength(8, 'Your password is too short.'),
			v.maxLength(18, 'Your password is too long.'),
		),
	}),
);
