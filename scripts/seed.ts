import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';
import 'dotenv/config';
import { db } from '../db';
import { accounts, users } from '../db/schema';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';

async function seed() {
	console.log('🌱 Starting seed...');

	try {
		const existingUser = await db.query.users.findFirst({
			where: (fields, { eq }) => eq(fields.email, ADMIN_EMAIL),
		});

		if (existingUser) {
			console.log('✅ Admin user already exists:', existingUser.email);
			console.log('🌱 Seed completed!');
			return;
		}

		const userId = randomUUID();
		const hashedPassword = await hash(ADMIN_PASSWORD, 12);

		await db.insert(users).values({
			id: userId,
			name: ADMIN_NAME,
			email: ADMIN_EMAIL,
			emailVerified: true,
			username: 'admin',
			displayUsername: 'Admin',
			role: 'admin',
			banned: false,
		});

		await db.insert(accounts).values({
			id: randomUUID(),
			accountId: randomUUID(),
			providerId: 'email-password',
			userId: userId,
			password: hashedPassword,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		console.log('✅ Admin user created successfully!');
		console.log('   Email:', ADMIN_EMAIL);
		console.log('   Password:', ADMIN_PASSWORD);
		console.log('   Role: admin');
		console.log('🌱 Seed completed!');
	} catch (error) {
		console.error('❌ Seed failed:', error);
		process.exit(1);
	}
}

seed();
