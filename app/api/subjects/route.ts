import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Subject } from '@/lib/models/Subject';
import { Chapter } from '@/lib/models/Chapter';
import { School } from '@/lib/models/School';
import { Class, Board } from '@/lib/models/Lookup';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();
    void School;
    void Class;
    void Board;

    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get('school');
    const classId = searchParams.get('class');
    const boardId = searchParams.get('board');
    const search = searchParams.get('search');

    const filter: Record<string, unknown> = { isActive: true };

    if (schoolId) {
      if (schoolId === 'global') {
        filter.$or = [{ school: null }, { school: { $exists: false } }];
      } else {
        filter.$or = [{ school: schoolId }, { school: null }, { school: { $exists: false } }];
      }
    }
    if (classId) filter.class = classId;
    if (boardId) filter.board = boardId;
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const subjects = await Subject.find(filter)
      .populate('class', 'name grade')
      .populate('board', 'name code')
      .populate('school', 'name code city')
      .sort({ name: 1 })
      .lean();

    // Fetch chapters for each subject
    const subjectIds = subjects.map((s) => s._id);
    const chapters = await Chapter.find({ subject: { $in: subjectIds }, isActive: true })
      .sort({ chapterNumber: 1 })
      .lean();

    const result = subjects.map((sub) => ({
      ...sub,
      chapters: chapters.filter((ch) => ch.subject.toString() === sub._id.toString()),
    }));

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Subjects GET error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch subjects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();

    const body = await req.json();
    if (!body.name || !body.class || !body.board) {
      return NextResponse.json({ success: false, message: 'Name, class, and board are required' }, { status: 400 });
    }

    // Convert empty school string to undefined/null for global subjects
    const payload = {
      ...body,
      school: body.school && body.school.trim() !== '' ? body.school : undefined,
    };

    const subject = await Subject.create(payload);
    return NextResponse.json({ success: true, data: subject }, { status: 201 });
  } catch (error) {
    console.error('Subject POST error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create subject' }, { status: 500 });
  }
}
