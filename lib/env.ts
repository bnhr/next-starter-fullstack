import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().regex(/^postgresql:\/\/.*/),
		BETTER_AUTH_SECRET: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_API_URL: z.string().default('http://localhost:3000'),
	},
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
	},
});
