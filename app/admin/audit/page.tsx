import { getAuditLogs } from '@/app/actions/admin';
import type { AuditEntityType, AuditAction } from '@/lib/audit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { SearchParams } from '@/types';

interface AuditPageProps {
	searchParams: Promise<SearchParams>;
}

function getStringParam(param: string | string[] | undefined, defaultValue: string): string {
	if (Array.isArray(param)) return param[0] || defaultValue;
	return param || defaultValue;
}

export default async function AuditPage({ searchParams }: AuditPageProps) {
	const params = await searchParams;
	const userId = getStringParam(params.userId, '');
	const entityType = getStringParam(params.entityType, '');
	const action = getStringParam(params.action, '');
	const page = Number(getStringParam(params.page, '1'));
	const limit = 20;

	const logs = await getAuditLogs({
		userId: userId || undefined,
		entityType: (entityType as AuditEntityType) || undefined,
		action: (action as AuditAction) || undefined,
		limit,
		offset: (page - 1) * limit,
	});

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold'>Audit Logs</h1>
				<p className='text-muted-foreground'>Track all system activities</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Activity Log</CardTitle>
				</CardHeader>
				<CardContent>
					{logs.length === 0 ? (
						<p className='text-muted-foreground py-8 text-center'>No audit logs found</p>
					) : (
						<div className='space-y-4'>
							{logs.map((log) => (
								<div
									key={log.id}
									className='flex items-start justify-between border-b pb-4 last:border-0 last:pb-0'
								>
									<div className='space-y-1'>
										<div className='flex items-center gap-2'>
											<Badge variant='outline'>{log.action}</Badge>
											<Badge variant='secondary'>{log.entityType}</Badge>
										</div>
										<p className='text-sm'>
											<span className='font-medium'>{log.user?.name || 'Unknown'}</span>
											<span className='text-muted-foreground'> ({log.user?.email || 'N/A'})</span>
										</p>
										{log.entityId && (
											<p className='text-muted-foreground text-xs'>Entity ID: {log.entityId}</p>
										)}
									</div>
									<div className='text-muted-foreground text-right text-sm'>
										{format(log.createdAt, 'MMM d, yyyy HH:mm:ss')}
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
