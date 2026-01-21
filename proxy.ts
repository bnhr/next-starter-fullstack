import { NextResponse } from 'next/server';

export async function proxy() {
	// Auth checks are handled in individual pages/routes as recommended
	// Removed optimistic redirect to avoid security issues
	return NextResponse.next();
}

export const config = {
	matcher: ['/dashboard'], // Specify the routes the middleware applies to
};
