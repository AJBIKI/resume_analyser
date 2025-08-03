import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes (accessible without authentication)
const isPublicRoute = createRouteMatcher([
  '/',
  '/api/auth/signin',
]);

export default clerkMiddleware(async(auth, req) => {
  // Skip auth if it's a public route
  if (isPublicRoute(req)) return;

  // For protected routes, redirect to sign-in if not authenticated
   await auth.protect();
});

export const config = {
  matcher: [
    // Run middleware on all routes except static files and internal paths
    '/((?!_next/static|_next/image|favicon.ico|.*\\.\\w+$).*)',
  ],
};


