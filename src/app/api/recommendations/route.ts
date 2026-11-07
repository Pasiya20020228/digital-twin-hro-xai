import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const recommendations = await prisma.recommendation.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, recommendations });
  } catch (error) {
    console.error('Fetch recommendations error:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { id, decision, overrideNotes } = await req.json(); // decision: 'APPROVED' | 'REJECTED' | 'OVERRIDDEN'

    if (!id || !decision) {
      return NextResponse.json({ error: 'Recommendation ID and clinical decision required.' }, { status: 400 });
    }

    const updated = await prisma.recommendation.update({
      where: { id },
      data: {
        status: decision,
        reviewedAt: new Date(),
        reviewedBy: user ? `${user.name} (${user.designation})` : 'Clinical Reviewer',
        overrideNotes: overrideNotes || null,
      },
    });

    // Log immutable review audit
    await prisma.auditLog.create({
      data: {
        action: `RECOMMENDATION_${decision}`,
        entityType: 'Recommendation',
        entityId: updated.id,
        performedBy: user ? user.email : 'system',
        details: JSON.stringify({
          code: updated.recommendationCode,
          decision,
          overrideNotes,
        }),
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        userId: user ? user.id : null,
      },
    });

    return NextResponse.json({ success: true, recommendation: updated });
  } catch (error) {
    console.error('Update recommendation error:', error);
    return NextResponse.json({ error: 'Failed to record recommendation review.' }, { status: 500 });
  }
}

