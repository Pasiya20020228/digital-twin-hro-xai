import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSignedSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = (body.emailOrStaffId || body.email || body.staffId || '').trim();
    const password = body.password;
    const rememberWorkstation = body.rememberWorkstation;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/Staff ID and Passcode are required.' },
        { status: 400 }
      );
    }

    // Lookup user by email or staffId
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { staffId: identifier.toUpperCase() },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials. Clinical identity not recognized in registry.' },
        { status: 401 }
      );
    }

    // Check account status
    if (user.status === 'DISABLED') {
      return NextResponse.json(
        { error: 'Account disabled. Clinical access permissions have been revoked by Administrator.', status: 'DISABLED' },
        { status: 403 }
      );
    }

    if (user.status === 'PENDING') {
      return NextResponse.json(
        { error: 'Registration pending verification by Medical Directorate / Admin.', status: 'PENDING' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid authentication passcode. Terminal access denied.' },
        { status: 401 }
      );
    }

    // Create signed session token
    const token = createSignedSessionToken({
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    // Determine redirect path based on role
    let redirectPath = '/dashboard';
    if (user.role === 'SYSTEM_ADMIN' || user.role === 'HOSPITAL_ADMIN') {
      redirectPath = '/dashboard';
    } else if (user.role === 'DOCTOR' || user.role === 'NURSE') {
      redirectPath = '/patients';
    }

    // Log login audit
    await prisma.auditLog.create({
      data: {
        action: 'USER_LOGIN_SUCCESS',
        entityType: 'User',
        entityId: user.id,
        performedBy: user.email,
        details: JSON.stringify({ role: user.role, staffId: user.staffId }),
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        userId: user.id,
      },
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        staffId: user.staffId,
        role: user.role,
        department: user.department,
        designation: user.designation,
        hospital: user.hospital,
        status: user.status,
      },
      redirectPath,
    });

    // Set HTTP-only session cookie
    const maxAge = rememberWorkstation ? 60 * 60 * 12 : 60 * 60 * 4; // 12h or 4h
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error during authentication.' },
      { status: 500 }
    );
  }
}

