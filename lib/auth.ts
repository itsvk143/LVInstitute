import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'lv-institute-secret-change-in-production'
);

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'admin' | 'superadmin' | 'parent';
  name: string;
  studentId?: string;
  admissionNumber?: string;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function getAuthUser(req?: NextRequest): Promise<JWTPayload | null> {
  try {
    let token: string | undefined;

    if (req) {
      // From request headers (API routes)
      const authHeader = req.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
      // Also check cookie
      if (!token) {
        token = req.cookies.get('auth-token')?.value;
      }
    } else {
      // From server component cookies
      const cookieStore = await cookies();
      token = cookieStore.get('auth-token')?.value;
    }

    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function requireAdmin(req: NextRequest): Promise<JWTPayload> {
  const user = await getAuthUser(req);
  if (!user) {
    throw new Error('Unauthorized');
  }
  if (!['admin', 'superadmin'].includes(user.role)) {
    throw new Error('Forbidden');
  }
  return user;
}
