import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { AdditionalTopic } from '@/lib/models/AdditionalTopic';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('student');
    const subjectId = searchParams.get('subject');
    const filter: Record<string, unknown> = {};
    if (studentId) filter.student = studentId;
    if (subjectId) filter.subject = subjectId;

    const topics = await AdditionalTopic.find(filter)
      .populate('subject', 'name color')
      .populate('teacher', 'name')
      .sort({ dateTaught: -1 })
      .lean();

    return NextResponse.json({ success: true, data: topics });
  } catch {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();
    const body = await req.json();
    const topic = await AdditionalTopic.create(body);
    return NextResponse.json({ success: true, data: topic }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === 'Unauthorized') return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
