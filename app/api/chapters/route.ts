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

    // 1. Bulk insertion via { chapters: [...], subject: '...' }
    if (body.chapters && Array.isArray(body.chapters) && body.subject) {
      if (body.chapters.length === 0) {
        return NextResponse.json({ success: false, message: 'No chapters provided' }, { status: 400 });
      }

      // Check existing max chapter number for this subject if not specified
      const existingCount = await Chapter.countDocuments({ subject: body.subject, isActive: true });

      const docs = body.chapters
        .filter((ch: { name?: string }) => ch.name && ch.name.trim() !== '')
        .map((ch: { name: string; chapterNumber?: number; difficulty?: string; estimatedHours?: number; description?: string }, idx: number) => ({
          name: ch.name.trim(),
          chapterNumber: ch.chapterNumber || (existingCount + idx + 1),
          difficulty: ch.difficulty || 'medium',
          estimatedHours: ch.estimatedHours || 10,
          description: ch.description || '',
          subject: body.subject,
          isActive: true,
        }));

      if (docs.length === 0) {
        return NextResponse.json({ success: false, message: 'No valid chapter names provided' }, { status: 400 });
      }

      const created = await Chapter.insertMany(docs);
      return NextResponse.json({ success: true, data: created, message: `${created.length} chapters added successfully` }, { status: 201 });
    }

    // 2. Direct array insertion [{ name, subject, chapterNumber }, ...]
    if (Array.isArray(body)) {
      const created = await Chapter.insertMany(body);
      return NextResponse.json({ success: true, data: created }, { status: 201 });
    }

    // 3. Single chapter insertion
    if (!body.name || !body.subject || !body.chapterNumber) {
      return NextResponse.json({ success: false, message: 'Name, subject, and chapter number are required' }, { status: 400 });
    }

    const chapter = await Chapter.create(body);
    return NextResponse.json({ success: true, data: chapter }, { status: 201 });
  } catch (error) {
    console.error('Chapter POST error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create chapters' }, { status: 500 });
  }
}
