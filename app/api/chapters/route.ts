import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Chapter } from '@/lib/models/Chapter';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get('subject');

    const filter: Record<string, unknown> = { isActive: true };
    if (subjectId) filter.subject = subjectId;

    const chapters = await Chapter.find(filter).sort({ chapterNumber: 1 }).populate('subject', 'name color').lean();
    return NextResponse.json({ success: true, data: chapters });
  } catch (error) {
    console.error('Chapters GET error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch chapters' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();

    const body = await req.json();
    if (!body.name || !body.subject || !body.chapterNumber) {
      return NextResponse.json({ success: false, message: 'Name, subject, and chapter number are required' }, { status: 400 });
    }

    const chapter = await Chapter.create(body);
    return NextResponse.json({ success: true, data: chapter }, { status: 201 });
  } catch (error) {
    console.error('Chapter POST error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create chapter' }, { status: 500 });
  }
}
