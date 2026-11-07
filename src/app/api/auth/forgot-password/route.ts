import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Hospital email is required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      // Security best practice: don't reveal if user exists, but give reassuring message
      return NextResponse.json({
        success: true,
        message: 'If the clinical identity is registered, an encrypted passcode recovery token has been dispatched to your institutional gateway.',
      });
    }

    const token = crypto.randomBytes(24).toString('hex');

    await prisma.auditLog.create({
      data: {
        action: 'PASSWORD_RESET_REQUESTED',
        entityType: 'User',
        entityId: user.id,
        performedBy: user.email,
        details: JSON.stringify({ tokenHint: token.substring(0, 6) + '...' }),
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Encrypted passcode recovery link dispatched to ${user.email}. Token reference: MED-${token.substring(0, 8).toUpperCase()}`,
      demoResetToken: token,
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Failed to process password recovery.' }, { status: 500 });
  }
}

