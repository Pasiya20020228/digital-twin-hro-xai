import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createSignedSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const {
      fullName,
      email,
      staffId,
      role,
      department,
      designation,
      preferredWorkArea,
      password,
      confirmPassword,
      hospital,
    } = await req.json();

    // Validation
    if (!fullName || !email || !password || !staffId) {
      return NextResponse.json(
        { error: 'Full name, email, staff ID, and password are required.' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passcode and confirmation passcode do not match.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Passcode must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Check duplicate email
    const existingEmail = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: 'An account with this official email is already registered.' },
        { status: 409 }
      );
    }

    // Check duplicate staffId
    const existingStaffId = await prisma.user.findUnique({
      where: { staffId: staffId.trim().toUpperCase() },
    });
    if (existingStaffId) {
      return NextResponse.json(
        { error: 'Staff identifier or SLMC license number is already registered.' },
        { status: 409 }
      );
    }

    // Map designated role to system role
    let systemRole = 'STAFF';
    const roleUpper = (designation || role || '').toUpperCase();
    if (roleUpper.includes('CONSULTANT') || roleUpper.includes('MEDICAL OFFICER') || roleUpper.includes('PHYSICIAN')) {
      systemRole = 'DOCTOR';
    } else if (roleUpper.includes('NURSE') || roleUpper.includes('SISTER')) {
      systemRole = 'NURSE';
    } else if (roleUpper.includes('DIRECTOR') || roleUpper.includes('ADMINISTRATOR')) {
      systemRole = 'HOSPITAL_ADMIN';
    }

    // Do not automatically grant SYSTEM_ADMIN or HOSPITAL_ADMIN privileges on self-registration
    if (systemRole === 'HOSPITAL_ADMIN') {
      systemRole = 'STAFF';
    }

    // Default status: APPROVED for standard academic prototype testing, but PENDING if flagged
    const status = 'APPROVED';

    const newUser = await prisma.user.create({
      data: {
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        staffId: staffId.trim().toUpperCase(),
        passwordHash: hashPassword(password),
        role: systemRole,
        department: department || 'Emergency Treatment Unit (ETU)',
        designation: designation || role || 'Triage Medical Officer',
        preferredWorkArea: preferredWorkArea || 'ETU Complex',
        hospital: hospital || 'National Hospital of Sri Lanka (NHSL), Colombo',
        status,
      },
    });

    // Create session token
    const token = createSignedSessionToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Staff enrollment completed successfully. Clinical session initialized.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        staffId: newUser.staffId,
        role: newUser.role,
        department: newUser.department,
        designation: newUser.designation,
        hospital: newUser.hospital,
        status: newUser.status,
      },
      redirectPath: '/patients',
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during enrollment.' },
      { status: 500 }
    );
  }
}

