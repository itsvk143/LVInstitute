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

export async function fetchStudentPublicData(id: string) {
  try {
    await connectDB();
    void School; void Teacher; void Subject; void Chapter;

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isObjectId
      ? { $or: [{ admissionNumber: id }, { _id: id }], deletedAt: null }
      : { admissionNumber: id, deletedAt: null };

    // Find student by admissionNumber or ObjectId
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
      return null;
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
          theoryCompleted: false,
          practiceCompleted: false,
          testCompleted: false,
          revisionCount: 0,
          completedPercentage: 0,
          confidenceLevel: 'medium',
        });
      }
    }

    // Append any extra progress records
    for (const remaining of existingChapterMap.values()) {
      chapterProgress.push(remaining);
    }

    const [additionalTopics, marks, attendance, examinations, notices] = await Promise.all([
      AdditionalTopic.find({ student: student._id, isActive: true })
        .populate('subject', 'name color')
        .sort({ date: -1 })
        .lean(),

      Mark.find({ student: student._id })
        .populate('subject', 'name color')
        .populate('examination', 'name examType totalMarks date')
        .sort({ testDate: -1 })
        .limit(20)
        .lean(),

      Attendance.find({ student: student._id })
        .sort({ date: -1 })
        .limit(60)
        .lean(),

      Examination.find({ isActive: true })
        .populate('subject', 'name color')
        .sort({ date: 1 })
        .lean(),

      Notice.find({ isActive: true, isPublic: true })
        .sort({ publishedAt: -1 })
        .limit(10)
        .lean(),
    ]);

    // Analytics summary
    const completedChapters = chapterProgress.filter((cp: any) => cp.status === 'completed').length;
    const inProgressChapters = chapterProgress.filter((cp: any) => cp.status === 'in_progress').length;
    const totalChapters = chapterProgress.length;

    const presentDays = attendance.filter((a) => a.status === 'present').length;
    const totalAttendanceDays = attendance.length;
    const attendancePercentage =
      totalAttendanceDays > 0 ? Math.round((presentDays / totalAttendanceDays) * 100) : 100;

    const marksWithPercentage = marks
      .filter((m) => m.totalMarks > 0)
      .map((m) => (m.marksObtained / m.totalMarks) * 100);

    const averageScore =
      marksWithPercentage.length > 0
        ? Math.round(marksWithPercentage.reduce((a, b) => a + b, 0) / marksWithPercentage.length)
        : null;

    return {
      student,
      chapterProgress,
      additionalTopics,
      marks,
      attendance,
      examinations,
      notices,
      analytics: {
        totalChapters,
        completedChapters,
        inProgressChapters,
        syllabusCompletionPercentage:
          totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0,
        attendancePercentage,
        averageScore,
        totalTestsTaken: marks.length,
      },
    };
  } catch (error) {
    console.error('fetchStudentPublicData error:', error);
    return null;
  }
}
