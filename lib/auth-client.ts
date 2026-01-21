import { createAuthClient } from 'better-auth/react';
import { adminClient, usernameClient } from 'better-auth/client/plugins';
import { env } from '@/lib/env';

export const authClient = createAuthClient({
	baseURL: env.NEXT_PUBLIC_API_URL,
	plugins: [usernameClient(), adminClient()],
});
