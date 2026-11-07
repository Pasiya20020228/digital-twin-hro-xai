import { cookies } from 'next/headers';
import crypto from 'crypto';
import { prisma } from './prisma';

export const SESSION_COOKIE_NAME = 'clinical_mesh_session_token';
const SESSION_SECRET = process.env.SESSION_SECRET || 'clinical_twin_mesh_default_secret_2027';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  staffId: string;
  role: string;
  department: string;
  designation: string;
  hospital: string;
  status: string;
  preferredWorkArea: string;
}

// Password Hashing using PBKDF2 with SHA-512
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(':')) {
    // Fallback for simple legacy hashes
    return password === storedHash;
  }
  const [salt, key] = storedHash.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return key === hash;
}

// Session Token Creation with HMAC signature
export function createSignedSessionToken(user: { id: string; email: string; role: string; status: string }): string {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
    iat: Date.now(),
    exp: Date.now() + 1000 * 60 * 60 * 12, // 12 hours shift session
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
}

// Session Token Verification
export function verifySessionToken(token: string): { sub: string; email: string; role: string; status: string } | null {
  try {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return null;

    const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(encodedPayload).digest('base64url');
    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

// Get Current Authenticated User (Server-Side)
export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return null;
    }

    const payload = verifySessionToken(sessionCookie.value);
    if (!payload?.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      staffId: user.staffId,
      role: user.role,
      department: user.department,
      designation: user.designation,
      hospital: user.hospital,
      status: user.status,
      preferredWorkArea: user.preferredWorkArea,
    };
  } catch (error) {
    console.error('Failed to get current user session:', error);
    return null;
  }
}

// Role Authorization Helpers
export function hasRole(userRole: string, allowedRoles: string[]): boolean {
  if (userRole === 'SYSTEM_ADMIN') return true; // System Admin has superset
  return allowedRoles.includes(userRole);
}

export function canAccessAdmin(userRole: string): boolean {
  return ['SYSTEM_ADMIN', 'HOSPITAL_ADMIN'].includes(userRole);
}

