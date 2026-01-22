'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function getUserDashboardData(userId: string) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session || session.user.id !== userId) {
		throw new Error('Unauthorized');
	}

	const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

	if (!user) {
		return null;
	}

	// Calculate days since account creation
	const daysSince = Math.floor(
		(new Date().getTime() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24),
	);

	return {
		user: {
			name: user.name,
			email: user.email,
			createdAt: user.createdAt,
			role: user.role || 'user',
		},
		daysSince,
	};
}
