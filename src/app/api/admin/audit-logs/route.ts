import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !['SYSTEM_ADMIN', 'HOSPITAL_ADMIN'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized. Administrative credentials required.' }, { status: 403 });
    }

    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50,
      include: {
        user: {
          select: { name: true, role: true, staffId: true },
        },
      },
    });

    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error('Audit logs error:', error);
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}

