import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Error',
};

export default function ErrorPage() {
	return (
		<div className='bg-muted flex min-h-screen flex-col items-center justify-center'>
			<div className='bg-card w-full max-w-md rounded-lg p-8 shadow-md'>
				<h1 className='text-destructive mb-4 text-2xl font-bold'>Oops! Something went wrong</h1>
				<p className='text-card-foreground mb-4'>
					We encountered an error while processing your request. This could be a 4xx client error or
					a 5xx server error.
				</p>
				<p className='text-card-foreground mb-6'>
					Please try again later or contact support if the problem persists.
				</p>
				<Link
					href='/'
					className='bg-primary text-primary-foreground hover:bg-primary/90 inline-block rounded px-4 py-2 font-bold'
				>
					Go Home
				</Link>
			</div>
		</div>
	);
}
