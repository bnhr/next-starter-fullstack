import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
	title: string;
	value: string | number;
	description?: string;
	icon?: LucideIcon;
	trend?: {
		value: number;
		isPositive: boolean;
	};
	className?: string;
}

export function StatsCard({
	title,
	value,
	description,
	icon: Icon,
	trend,
	className,
}: StatsCardProps) {
	return (
		<Card className={cn('', className)}>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<CardTitle className='text-sm font-medium'>{title}</CardTitle>
				{Icon && (
					<div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg'>
						<Icon className='text-primary h-4 w-4' />
					</div>
				)}
			</CardHeader>
			<CardContent>
				<div className='text-2xl font-bold'>{value}</div>
				{(description || trend) && (
					<div className='mt-1 flex items-center gap-2'>
						{trend && (
							<span
								className={cn(
									'text-xs font-medium',
									trend.isPositive ? 'text-green-600' : 'text-red-600',
								)}
							>
								{trend.isPositive ? '+' : ''}
								{trend.value}%
							</span>
						)}
						{description && <p className='text-muted-foreground text-xs'>{description}</p>}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
