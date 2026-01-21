'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className='bg-muted/30 flex min-h-screen flex-col items-center justify-center p-4'>
			<Card className='w-full max-w-md'>
				<CardHeader>
					<div className='flex items-center gap-2'>
						<AlertCircle className='text-destructive h-6 w-6' />
						<CardTitle className='text-2xl'>Something went wrong</CardTitle>
					</div>
					<CardDescription>
						An unexpected error occurred while processing your request.
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='bg-destructive/10 border-destructive/20 rounded-md border p-4'>
						<p className='text-destructive font-mono text-sm'>
							{error.message || 'An unknown error occurred'}
						</p>
						{error.digest && (
							<p className='text-muted-foreground mt-2 text-xs'>Error ID: {error.digest}</p>
						)}
					</div>
					<p className='text-muted-foreground text-sm'>
						If this problem persists, please contact support with the error ID above.
					</p>
				</CardContent>
				<CardFooter className='flex gap-2'>
					<Button onClick={() => reset()} variant='default'>
						Try Again
					</Button>
					<Button asChild variant='outline'>
						<Link href='/'>Go Home</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
