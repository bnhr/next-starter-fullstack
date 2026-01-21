import * as v from 'valibot';

export const userRoleSchema = v.picklist(['admin', 'user'], 'Invalid role');

export const createUserSchema = v.pipe(
	v.object({
		name: v.pipe(v.string(), v.nonEmpty('Name is required'), v.maxLength(100)),
		email: v.pipe(v.string(), v.nonEmpty('Email is required'), v.email('Invalid email')),
		password: v.pipe(v.string(), v.nonEmpty('Password is required'), v.minLength(8)),
		username: v.pipe(v.string(), v.nonEmpty('Username is required'), v.maxLength(50)),
		role: userRoleSchema,
		banned: v.boolean(),
	}),
);

export const updateUserSchema = v.pipe(
	v.object({
		name: v.pipe(v.string(), v.nonEmpty('Name is required'), v.maxLength(100)),
		email: v.pipe(v.string(), v.nonEmpty('Email is required'), v.email('Invalid email')),
		username: v.pipe(v.string(), v.nonEmpty('Username is required'), v.maxLength(50)),
		role: userRoleSchema,
		banned: v.boolean(),
	}),
);

export type CreateUserInput = v.InferOutput<typeof createUserSchema>;
export type UpdateUserInput = v.InferOutput<typeof updateUserSchema>;
