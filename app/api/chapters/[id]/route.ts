import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Chapter } from '@/lib/models/Chapter';
import { ChapterProgress } from '@/lib/models/ChapterProgress';
import { requireAdmin } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { id } = await params;

    const chapter = await Chapter.findById(id).populate('subject', 'name color').lean();
    if (!chapter) {
      return NextResponse.json({ success: false, message: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: chapter });
  } catch (error) {
    console.error('Chapter GET error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch chapter' }, { status: 500 });
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

    const updated = await Chapter.findByIdAndUpdate(id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Chapter PUT error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update chapter' }, { status: 500 });
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

    const chapter = await Chapter.findByIdAndDelete(id);
    if (!chapter) {
      return NextResponse.json({ success: false, message: 'Chapter not found' }, { status: 404 });
    }

    // Clean up related progress
    await ChapterProgress.deleteMany({ chapter: id });

    return NextResponse.json({ success: true, message: 'Chapter deleted' });
  } catch (error) {
    console.error('Chapter DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete chapter' }, { status: 500 });
  }
}
