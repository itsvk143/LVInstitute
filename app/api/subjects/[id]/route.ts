import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Subject } from '@/lib/models/Subject';
import { Chapter } from '@/lib/models/Chapter';
import { School } from '@/lib/models/School';
import '@/lib/models/Lookup';
import { requireAdmin } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    await connectDB();
    void School;
    const { id } = await params;

    const subject = await Subject.findById(id)
      .populate('class', 'name grade')
      .populate('board', 'name code')
      .populate('school', 'name code city')
      .lean();

    if (!subject) {
      return NextResponse.json({ success: false, message: 'Subject not found' }, { status: 404 });
    }

    const chapters = await Chapter.find({ subject: id, isActive: true })
      .sort({ chapterNumber: 1 })
      .lean();

    return NextResponse.json({ success: true, data: { ...subject, chapters } });
  } catch (error) {
    console.error('Subject GET error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch subject' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const updatePayload: Record<string, unknown> = { ...body };
    if ('school' in body) {
      updatePayload.school = body.school && body.school.trim() !== '' ? body.school : null;
    }

    const updated = await Subject.findByIdAndUpdate(id, updatePayload, { new: true })
      .populate('class', 'name grade')
      .populate('board', 'name code')
      .populate('school', 'name code city');

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Subject not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Subject PUT error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update subject' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { id } = await params;

    const subject = await Subject.findByIdAndDelete(id);
    if (!subject) {
      return NextResponse.json({ success: false, message: 'Subject not found' }, { status: 404 });
    }

    // Delete associated chapters
    await Chapter.deleteMany({ subject: id });

    return NextResponse.json({ success: true, message: 'Subject and its chapters deleted' });
  } catch (error) {
    console.error('Subject DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete subject' }, { status: 500 });
  }
}
