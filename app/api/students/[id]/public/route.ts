import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Student } from '@/lib/models/Student';
import { ChapterProgress } from '@/lib/models/ChapterProgress';
import { AdditionalTopic } from '@/lib/models/AdditionalTopic';
import { Mark } from '@/lib/models/Mark';
import { Attendance } from '@/lib/models/Attendance';
import { Examination } from '@/lib/models/Examination';
import { Notice } from '@/lib/models/Notice';

import { School } from '@/lib/models/School';
import { Teacher } from '@/lib/models/Teacher';
import { Subject } from '@/lib/models/Subject';
import { Chapter } from '@/lib/models/Chapter';
import '@/lib/models/Lookup';

// GET /api/students/[id]/public — NO AUTH REQUIRED
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    // Reference imported models so bundler does not tree-shake
    void School; void Teacher; void Subject; void Chapter;
    const { id } = await params;

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isObjectId
      ? { $or: [{ admissionNumber: id }, { _id: id }], deletedAt: null, publicProfileEnabled: true }
      : { admissionNumber: id, deletedAt: null, publicProfileEnabled: true };

    // Find by admissionNumber or _id
    const student = await Student.findOne(query)
      .populate('school', 'name city')
      .populate('class', 'name grade')
      .populate('board', 'name code')
      .populate('country', 'name code flag')
      .populate('batch', 'name year')
      .populate('course', 'name')
      .populate('teacher', 'name photo qualification')
      .select('-phone -email -parentContact -parentEmail -notes -address -parentName')
      .lean();

    if (!student) {
      return NextResponse.json({ success: false, message: 'Student profile not found or not public' }, { status: 404 });
    }

    // Find all subjects matching student's class and school (or global curriculum for that class)
    const rawClassId = student.class?._id || student.class;
    const rawSchoolId = student.school?._id || student.school;

    const subjectFilter: Record<string, unknown> = { isActive: true };
    if (rawSchoolId && rawClassId) {
      subjectFilter.$or = [
        { school: rawSchoolId },
        { class: rawClassId, $or: [{ school: null }, { school: { $exists: false } }] },
      ];
    } else if (rawSchoolId) {
      subjectFilter.$or = [{ school: rawSchoolId }, { school: null }, { school: { $exists: false } }];
    } else if (rawClassId) {
      subjectFilter.class = rawClassId;
    }

    const relevantSubjects = await Subject.find(subjectFilter).select('_id name color icon').lean();
    const relevantSubjectIds = relevantSubjects.map((s) => s._id);

    // Fetch all active chapters for these subjects
    const relevantChapters = await Chapter.find({
      subject: { $in: relevantSubjectIds },
      isActive: true,
    })
      .sort({ chapterNumber: 1 })
      .lean();

    // Fetch existing chapter progress for this student
    const existingProgress = await ChapterProgress.find({ student: student._id })
      .populate({
        path: 'chapter',
        select: 'name chapterNumber difficulty',
      })
      .populate({
        path: 'subject',
        select: 'name color icon',
      })
      .lean();

    // Build unified map of chapters ensuring ALL syllabus chapters appear on student dashboard
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

    const chapterProgress: unknown[] = [];

    // First, add all relevant curriculum chapters for student's school and class
    for (const ch of relevantChapters) {
      const chIdStr = (ch._id as { toString(): string }).toString();
      const chSubIdStr = (ch.subject as { toString(): string }).toString();
      if (existingChapterMap.has(chIdStr)) {
        chapterProgress.push(existingChapterMap.get(chIdStr));
        existingChapterMap.delete(chIdStr);
      } else {
        // Automatically mapped chapter from admin curriculum
        const parentSubject = subjectLookupMap.get(chSubIdStr) || {
          _id: ch.subject,
          name: 'Subject',
          color: '#6366F1',
        };
        chapterProgress.push({
          _id: `auto_${ch._id}`,
          student: student._id,
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

    // Include any other existing progress items for legacy/custom subjects
    for (const remaining of existingChapterMap.values()) {
      chapterProgress.push(remaining);
    }

    // Fetch additional topics grouped by subject
    const additionalTopics = await AdditionalTopic.find({ student: student._id })
      .populate('subject', 'name')
      .populate('teacher', 'name')
      .lean();

    // Fetch recent marks (last 10)
    const marks = await Mark.find({ student: student._id })
      .populate('subject', 'name color')
      .sort({ examDate: -1 })
      .limit(20)
      .lean();

    // Attendance stats (last 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const attendance = await Attendance.find({
      student: student._id,
      date: { $gte: ninetyDaysAgo },
    }).lean();

    const attendanceStats = {
      total: attendance.length,
      present: attendance.filter((a) => a.status === 'present').length,
      absent: attendance.filter((a) => a.status === 'absent').length,
      late: attendance.filter((a) => a.status === 'late').length,
      leave: attendance.filter((a) => a.status === 'leave').length,
      percentage: attendance.length
        ? Math.round((attendance.filter((a) => a.status === 'present' || a.status === 'late').length / attendance.length) * 100)
        : 0,
    };

    // Upcoming exams
    const upcomingExams = await Examination.find({
      date: { $gte: new Date() },
      isPublished: true,
      $or: [
        { 'targetStudents.class': student.class },
        { 'targetStudents.batch': student.batch },
        { 'targetStudents.course': student.course },
        { targetStudents: { $size: 0 } },
        { targetStudents: null },
      ],
    })
      .populate('subjects', 'name')
      .sort({ date: 1 })
      .limit(5)
      .lean();

    // Public notices
    const notices = await Notice.find({
      isPublished: true,
      isArchived: false,
      deletedAt: null,
      $or: [
        { visibility: 'public' },
        { visibility: 'students' },
      ],
    })
      .sort({ isPinned: -1, publishedAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        student,
        chapterProgress,
        additionalTopics,
        marks,
        attendanceStats,
        upcomingExams,
        notices,
      },
    });
  } catch (error) {
    console.error('Public profile error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
