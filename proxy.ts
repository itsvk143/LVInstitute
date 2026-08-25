import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const PUBLIC_PATHS = [
  '/api/auth/login',
  '/api/auth/parent-login',
  '/api/auth/logout',
  '/api/students/public',
  '/api/lookups',
  '/api/notices',
  '/login',
  '/parent-login',
  '/student',
];

const ADMIN_API_PREFIX = '/api/';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public student portal
  if (pathname.startsWith('/student/')) {
    return NextResponse.next();
  }

  // Allow public API paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow public student API
  if (pathname.match(/^\/api\/students\/[^/]+\/public$/)) {
    return NextResponse.next();
  }

  // Protect all /api/* and /(admin)/* routes
  if (pathname.startsWith(ADMIN_API_PREFIX) || pathname.startsWith('/dashboard') || pathname.startsWith('/students') || pathname.startsWith('/teachers') || pathname.startsWith('/schools') || pathname.startsWith('/subjects') || pathname.startsWith('/attendance') || pathname.startsWith('/marks') || pathname.startsWith('/homework') || pathname.startsWith('/examinations') || pathname.startsWith('/notices') || pathname.startsWith('/reports') || pathname.startsWith('/analytics') || pathname.startsWith('/progress') || pathname.startsWith('/additional-topics')) {
    const token = req.cookies.get('auth-token')?.value ||
      req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const user = await verifyToken(token);
    if (!user) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Attach user info to request headers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', user.userId);
    requestHeaders.set('x-user-role', user.role);
    requestHeaders.set('x-user-name', user.name);

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};
