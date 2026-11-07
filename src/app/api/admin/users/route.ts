import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !['SYSTEM_ADMIN', 'HOSPITAL_ADMIN'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized. Administrative credentials required.' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        staffId: true,
        role: true,
        department: true,
        designation: true,
        preferredWorkArea: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !['SYSTEM_ADMIN', 'HOSPITAL_ADMIN'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized. Administrative credentials required.' }, { status: 403 });
    }

    const { userId, role, status, designation, department } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // System admin role can only be assigned by another System Admin
    if (role === 'SYSTEM_ADMIN' && currentUser.role !== 'SYSTEM_ADMIN') {
      return NextResponse.json({ error: 'Only a System Administrator can grant System Administrator privileges.' }, { status: 403 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        role: role || targetUser.role,
        status: status || targetUser.status,
        designation: designation || targetUser.designation,
        department: department || targetUser.department,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: 'USER_ROLE_OR_STATUS_MODIFIED',
        entityType: 'User',
        entityId: targetUser.id,
        performedBy: currentUser.email,
        details: JSON.stringify({
          targetUser: targetUser.email,
          previous: { role: targetUser.role, status: targetUser.status },
          updated: { role: updated.role, status: updated.status },
        }),
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        userId: currentUser.id,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

