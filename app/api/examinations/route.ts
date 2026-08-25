import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Examination } from '@/lib/models/Examination';
import { Subject } from '@/lib/models/Subject';
import '@/lib/models/Lookup';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();

    const exams = await Examination.find({ isPublished: true })
      .populate('subjects', 'name color')
      .populate('targetStudents.class', 'name grade')
      .sort({ date: 1 })
      .lean();

    return NextResponse.json({ success: true, data: exams });
  } catch (error) {
    console.error('Examinations GET error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch examinations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();

    const body = await req.json();
    if (!body.name || !body.date || !body.examType) {
      return NextResponse.json({ success: false, message: 'Name, date, and exam type are required' }, { status: 400 });
    }

    const exam = await Examination.create(body);
    return NextResponse.json({ success: true, data: exam }, { status: 201 });
  } catch (error) {
    console.error('Examination POST error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create examination' }, { status: 500 });
  }
}
