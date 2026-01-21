'use client';

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

export function PageBreadcrumb() {
	const pathname = usePathname();
	const segments = pathname.split('/').filter(Boolean);

	if (segments.length === 0) return null;

	const breadcrumbs = segments.map((segment, index) => {
		const href = '/' + segments.slice(0, index + 1).join('/');
		const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
		const isLast = index === segments.length - 1;

		return { href, label, isLast };
	});

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{breadcrumbs.map((crumb) => (
					<Fragment key={crumb.href}>
						<BreadcrumbItem>
							{crumb.isLast ? (
								<BreadcrumbPage>{crumb.label}</BreadcrumbPage>
							) : (
								<BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
							)}
						</BreadcrumbItem>
						{!crumb.isLast && <BreadcrumbSeparator />}
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
