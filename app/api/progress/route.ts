import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { ChapterProgress } from '@/lib/models/ChapterProgress';
import { Student } from '@/lib/models/Student';
import { Subject } from '@/lib/models/Subject';
import { Chapter } from '@/lib/models/Chapter';
import { requireAdmin } from '@/lib/auth';

// GET /api/progress?student=xxx
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('student');

    if (!studentId) {
      // Return all progress if no specific student requested
      const allProgress = await ChapterProgress.find({})
        .populate({ path: 'chapter', select: 'name chapterNumber difficulty' })
        .populate({ path: 'subject', select: 'name color icon' })
        .populate({ path: 'student', select: 'name admissionNumber' })
        .limit(100)
        .lean();
      return NextResponse.json({ success: true, data: allProgress });
    }

    const student = await Student.findOne({ _id: studentId, deletedAt: null }).lean();

    // Query existing progress
    const existingProgress = await ChapterProgress.find({ student: studentId })
      .populate({ path: 'chapter', select: 'name chapterNumber difficulty' })
      .populate({ path: 'subject', select: 'name color icon' })
      .lean();

    if (!student) {
      return NextResponse.json({ success: true, data: existingProgress });
    }

    // Auto-map all syllabus chapters for student's school and class
    const rawClassId = student.class;
    const rawSchoolId = student.school;

    const subjectFilter: Record<string, unknown> = { isActive: true };
    if (rawClassId) subjectFilter.class = rawClassId;
    if (rawSchoolId) {
      subjectFilter.$or = [{ school: rawSchoolId }, { school: null }, { school: { $exists: false } }];
    }

    const relevantSubjects = await Subject.find(subjectFilter).select('_id name color icon').lean();
    const relevantSubjectIds = relevantSubjects.map((s) => s._id);

    const relevantChapters = await Chapter.find({
      subject: { $in: relevantSubjectIds },
      isActive: true,
    })
      .sort({ chapterNumber: 1 })
      .lean();

    const existingChapterMap = new Map<string, any>();
    for (const p of existingProgress) {
      const chapterObj = p.chapter as { _id?: { toString(): string } } | null;
      if (chapterObj?._id) {
        existingChapterMap.set(chapterObj._id.toString(), p);
      }
    }

    const subjectLookupMap = new Map<string, any>();
    for (const sub of relevantSubjects) {
      subjectLookupMap.set(sub._id.toString(), sub);
    }

    const result: unknown[] = [];

    for (const ch of relevantChapters) {
      const chIdStr = (ch._id as { toString(): string }).toString();
      const chSubIdStr = (ch.subject as { toString(): string }).toString();
      if (existingChapterMap.has(chIdStr)) {
        result.push(existingChapterMap.get(chIdStr));
        existingChapterMap.delete(chIdStr);
      } else {
        const parentSubject = subjectLookupMap.get(chSubIdStr) || {
          _id: ch.subject,
          name: 'Subject',
          color: '#6366F1',
        };
        result.push({
          _id: `auto_${ch._id}`,
          student: studentId,
          subject: parentSubject,
          chapter: {
            _id: ch._id,
            name: ch.name,
            chapterNumber: ch.chapterNumber,
            difficulty: ch.difficulty,
          },
          status: 'not_started',
          revisions: [],
        });
      }
    }

    for (const remaining of existingChapterMap.values()) {
      result.push(remaining);
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error('Progress GET error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/progress — upsert chapter progress
export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();
    const body = await req.json();

    const progress = await ChapterProgress.findOneAndUpdate(
      { student: body.student, chapter: body.chapter },
      { $set: body },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: progress });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === 'Unauthorized') return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
