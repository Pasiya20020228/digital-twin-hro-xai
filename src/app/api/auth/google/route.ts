import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const baseUrl = req.nextUrl.origin;
  const redirectUri = `${baseUrl}/api/auth/callback/google`;

  if (!clientId || clientId.trim() === '') {
    // When Google OAuth credentials are not yet supplied in .env
    const url = new URL('/auth/login', req.url);
    url.searchParams.set('error', 'google_config_missing');
    url.searchParams.set('message', 'Google Workspace SSO requires NEXT_PUBLIC_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to be configured in .env.');
    return NextResponse.redirect(url);
  }

  // Construct standard Google OAuth 2.0 authorization URL
  const state = Buffer.from(JSON.stringify({ returnTo: '/dashboard', ts: Date.now() })).toString('base64url');
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('state', state);
  googleAuthUrl.searchParams.set('prompt', 'select_account');

  return NextResponse.redirect(googleAuthUrl.toString());
}

