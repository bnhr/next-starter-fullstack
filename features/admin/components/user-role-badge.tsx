import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface UserRoleBadgeProps {
	role: string;
	className?: string;
}

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
	const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
		admin: 'default',
		user: 'secondary',
	};

	return (
		<Badge variant={variants[role] || 'secondary'} className={cn('', className)}>
			{role}
		</Badge>
	);
}
