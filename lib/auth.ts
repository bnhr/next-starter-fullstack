import { betterAuth } from 'better-auth';
import { username, admin } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { db } from '@/db';
// import * as schema from '@/db/schema';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		usePlural: true,
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		username(),
		admin({
			defaultRole: 'user',
			adminRoles: ['admin'],
		}),
		nextCookies(),
	],
});
