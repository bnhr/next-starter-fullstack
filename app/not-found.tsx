'use client';

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
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
	return (
		<div className='bg-muted/30 flex min-h-screen flex-col items-center justify-center p-4'>
			<Card className='w-full max-w-md text-center'>
				<CardHeader>
					<div className='mb-4 flex justify-center'>
						<div className='bg-muted rounded-full p-6'>
							<FileQuestion className='text-muted-foreground h-12 w-12' />
						</div>
					</div>
					<CardTitle className='text-4xl font-bold'>404</CardTitle>
					<CardDescription className='text-lg'>Page Not Found</CardDescription>
				</CardHeader>
				<CardContent>
					<p className='text-muted-foreground'>
						The page you&apos;re looking for doesn&apos;t exist or has been moved. Please check the
						URL or return to the homepage.
					</p>
				</CardContent>
				<CardFooter className='flex flex-col justify-center gap-2 sm:flex-row'>
					<Button asChild variant='default'>
						<Link href='/'>
							<Home className='mr-2 h-4 w-4' />
							Go Home
						</Link>
					</Button>
					<Button variant='outline' onClick={() => window.history.back()}>
						<ArrowLeft className='mr-2 h-4 w-4' />
						Go Back
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
