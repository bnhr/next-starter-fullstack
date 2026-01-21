import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { canAccessAdmin } from '@/lib/permissions';
import { SharedSidebar } from '@/features/admin/shared-layout/app-sidebar';
import { SiteHeader } from '@/features/admin/shared-layout/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

interface SessionUser {
	id: string;
	name: string | null;
	email: string;
	image: string | null;
	role?: string | null;
	isAdmin?: boolean | null;
	banned?: boolean | null;
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect('/');
	}

	const user = session.user as SessionUser;

	if (!canAccessAdmin(user)) {
		redirect('/');
	}

	return (
		<SidebarProvider
			style={
				{
					'--sidebar-width': 'calc(var(--spacing) * 72)',
					'--header-height': 'calc(var(--spacing) * 12)',
				} as React.CSSProperties
			}
		>
			<SharedSidebar
				user={{
					name: user.name || 'Admin',
					email: user.email,
					avatar: user.image || undefined,
					role: user.role || null,
				}}
				isAdmin={true}
				variant='inset'
			/>
			<SidebarInset>
				<SiteHeader />
				<div className='flex flex-1 flex-col'>
					<div className='@container/main flex flex-1 flex-col gap-2'>
						<div className='flex flex-col gap-4 p-4 md:gap-6 md:p-6'>{children}</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
