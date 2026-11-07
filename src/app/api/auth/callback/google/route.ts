import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSignedSessionToken, SESSION_COOKIE_NAME, hashPassword } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const error = req.nextUrl.searchParams.get('error');

  if (error || !code) {
    const errorUrl = new URL('/auth/login', req.url);
    errorUrl.searchParams.set('error', error || 'oauth_failed');
    return NextResponse.redirect(errorUrl);
  }

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const baseUrl = req.nextUrl.origin;
  const redirectUri = `${baseUrl}/api/auth/callback/google`;

  try {
    // Exchange authorization code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId || '',
        client_secret: clientSecret || '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || 'Failed to exchange Google OAuth code');
    }

    // Fetch user info from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userRes.json();

    if (!googleUser.email) {
      throw new Error('Google identity did not return an email');
    }

    // Match or provision user in DB
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email.toLowerCase() },
    });

    if (!user) {
      // Provision with default DOCTOR/STAFF role, pending review or auto-approved
      const randomStaffNum = Math.floor(1000 + Math.random() * 9000);
      user = await prisma.user.create({
        data: {
          name: googleUser.name || 'Google SSO Clinical User',
          email: googleUser.email.toLowerCase(),
          staffId: `SSO-${randomStaffNum}`,
          passwordHash: hashPassword(Math.random().toString(36)),
          role: 'DOCTOR',
          department: 'Emergency Treatment Unit (ETU)',
          designation: 'Clinical Officer (SSO)',
          preferredWorkArea: 'ETU Complex',
          hospital: 'National Hospital of Sri Lanka (NHSL), Colombo',
          status: 'APPROVED',
        },
      });
    }

    // Check status
    if (user.status === 'DISABLED') {
      return NextResponse.redirect(new URL('/auth/login?error=account_disabled', req.url));
    }
    if (user.status === 'PENDING') {
      return NextResponse.redirect(new URL('/auth/login?error=pending_approval', req.url));
    }

    // Create session token
    const token = createSignedSessionToken({
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    const redirectPath = user.role === 'SYSTEM_ADMIN' || user.role === 'HOSPITAL_ADMIN' ? '/dashboard' : '/patients';
    const response = NextResponse.redirect(new URL(redirectPath, req.url));
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch (err: any) {
    console.error('Google OAuth callback error:', err);
    const errorUrl = new URL('/auth/login', req.url);
    errorUrl.searchParams.set('error', 'oauth_error');
    errorUrl.searchParams.set('message', err.message || 'Authentication failed');
    return NextResponse.redirect(errorUrl);
  }
}

