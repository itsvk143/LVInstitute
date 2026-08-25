import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Homework } from '@/lib/models/Homework';
import { Student } from '@/lib/models/Student';
import { Subject } from '@/lib/models/Subject';
import { Teacher } from '@/lib/models/Teacher';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('student');
    const subjectId = searchParams.get('subject');

    const filter: Record<string, unknown> = {};
    if (studentId) filter.student = studentId;
    if (subjectId) filter.subject = subjectId;

    const homework = await Homework.find(filter)
      .populate('student', 'name admissionNumber')
      .populate('subject', 'name color')
      .populate('teacher', 'name')
      .sort({ assignedDate: -1 })
      .lean();

    return NextResponse.json({ success: true, data: homework });
  } catch (error) {
    console.error('Homework GET error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch homework' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();

    const body = await req.json();
    if (!body.student || !body.subject || !body.title || !body.dueDate) {
      return NextResponse.json({ success: false, message: 'Student, subject, title, and due date are required' }, { status: 400 });
    }

    const homework = await Homework.create(body);
    return NextResponse.json({ success: true, data: homework }, { status: 201 });
  } catch (error) {
    console.error('Homework POST error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create homework' }, { status: 500 });
  }
}
