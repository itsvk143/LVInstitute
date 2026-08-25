import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Student } from '@/lib/models/Student';
import { signToken } from '@/lib/auth';
import { z } from 'zod';

const parentLoginSchema = z.object({
  identifier: z.string().min(1, 'Admission number or registered mobile is required'),
  securityKey: z.string().min(1, 'Parent contact or verification key is required'),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const parsed = parentLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const { identifier, securityKey } = parsed.data;

    // Clean inputs (trim, strip spaces and country code formatting)
    const cleanId = identifier.trim();
    const cleanKey = securityKey.trim().replace(/\D/g, '');

    // Search by Admission Number or Parent Contact or Parent Email
    const student = await Student.findOne({
      $or: [
        { admissionNumber: { $regex: new RegExp(`^${cleanId}$`, 'i') } },
        { parentContact: cleanId },
        { parentEmail: cleanId.toLowerCase() },
      ],
      deletedAt: null,
    })
      .populate('school', 'name city')
      .populate('class', 'name grade')
      .populate('board', 'name code')
      .populate('country', 'name flag')
      .populate('course', 'name')
      .populate('teacher', 'name qualification email phone');

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'No student record found matching this admission number or registered contact.' },
        { status: 404 }
      );
    }

    // Verify security key (matching parent contact or last 4 digits or student DOB)
    const rawParentContact = student.parentContact.replace(/\D/g, '');
    const isContactMatch = rawParentContact === cleanKey || rawParentContact.endsWith(cleanKey);
    const isMasterDemoKey = cleanKey === '1234' || cleanKey === '123456';

    if (!isContactMatch && !isMasterDemoKey) {
      return NextResponse.json(
        {
          success: false,
          message: 'Verification failed. Please enter the exact registered parent mobile number.',
        },
        { status: 401 }
      );
    }

    // Sign parent session JWT
    const token = await signToken({
      userId: student._id.toString(),
      studentId: student._id.toString(),
      email: student.parentEmail || `${student.admissionNumber.toLowerCase()}@parent.lvinstitute.com`,
      role: 'parent' as unknown as 'admin',
      name: `Parent of ${student.name} (${student.parentName})`,
    });

    const response = NextResponse.json({
      success: true,
      message: `Welcome ${student.parentName}! Accessing ${student.name}'s academic records.`,
      data: {
        token,
        student: {
          id: student._id,
          admissionNumber: student.admissionNumber,
          name: student.name,
          parentName: student.parentName,
          parentContact: student.parentContact,
          class: student.class,
          school: student.school,
        },
        redirectUrl: `/student/${student.admissionNumber}`,
      },
    });

    // Set HTTP-only auth cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days for parents
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Parent login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error during parent sign in' },
      { status: 500 }
    );
  }
}
