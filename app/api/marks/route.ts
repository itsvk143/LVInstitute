import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Mark } from '@/lib/models/Mark';
import { Student } from '@/lib/models/Student';
import { Subject } from '@/lib/models/Subject';
import '@/lib/models/Lookup';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('student');
    const subjectId = searchParams.get('subject');
    const examType = searchParams.get('examType');

    const filter: Record<string, unknown> = {};
    if (studentId) filter.student = studentId;
    if (subjectId) filter.subject = subjectId;
    if (examType) filter.examType = examType;

    const marks = await Mark.find(filter)
      .populate('student', 'name admissionNumber class')
      .populate('subject', 'name color')
      .sort({ examDate: -1 })
      .lean();

    return NextResponse.json({ success: true, data: marks });
  } catch (error) {
    console.error('Marks GET error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch marks' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();

    const body = await req.json();
    if (!body.student || !body.subject || !body.testName || !body.maxMarks || body.obtainedMarks === undefined) {
      return NextResponse.json({ success: false, message: 'Student, subject, test name, max marks and obtained marks are required' }, { status: 400 });
    }

    const mark = await Mark.create(body);
    return NextResponse.json({ success: true, data: mark }, { status: 201 });
  } catch (error) {
    console.error('Marks POST error:', error);
    return NextResponse.json({ success: false, message: 'Failed to record marks' }, { status: 500 });
  }
}
