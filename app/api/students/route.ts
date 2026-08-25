import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Student } from '@/lib/models/Student';
import { Subject } from '@/lib/models/Subject';
import { Chapter } from '@/lib/models/Chapter';
import { ChapterProgress } from '@/lib/models/ChapterProgress';
import { requireAdmin } from '@/lib/auth';
import { School } from '@/lib/models/School';
import { Teacher } from '@/lib/models/Teacher';
import '@/lib/models/Lookup';
import { z } from 'zod';

const studentSchema = z.object({
  admissionNumber: z.string().min(1),
  name: z.string().min(2),
  gender: z.enum(['male', 'female', 'other']),
  parentName: z.string().min(2),
  parentContact: z.string().min(10),
  school: z.string(),
  class: z.string(),
  board: z.string(),
  country: z.string(),
  batch: z.string(),
  course: z.string(),
  teacher: z.string(),
  rollNumber: z.string().optional(),
  photo: z.string().optional(),
  dateOfBirth: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  parentEmail: z.string().email().optional().or(z.literal('')),
  section: z.string().optional(),
  joiningDate: z.string().optional(),
  notes: z.string().optional(),
  publicProfileEnabled: z.boolean().optional(),
});

// GET /api/students — list with filters, search, pagination
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));
    const skip = (page - 1) * limit;
    const search = searchParams.get('search') || '';
    const school = searchParams.get('school');
    const classId = searchParams.get('class');
    const board = searchParams.get('board');
    const country = searchParams.get('country');
    const batch = searchParams.get('batch');
    const course = searchParams.get('course');
    const teacher = searchParams.get('teacher');
    const isActive = searchParams.get('isActive');

    const filter: Record<string, unknown> = { deletedAt: null };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { admissionNumber: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
      ];
    }
    if (school) filter.school = school;
    if (classId) filter.class = classId;
    if (board) filter.board = board;
    if (country) filter.country = country;
    if (batch) filter.batch = batch;
    if (course) filter.course = course;
    if (teacher) filter.teacher = teacher;
    if (isActive !== null && isActive !== '') filter.isActive = isActive === 'true';

    const [students, total] = await Promise.all([
      Student.find(filter)
        .populate('school', 'name')
        .populate('class', 'name grade')
        .populate('board', 'name code')
        .populate('country', 'name code flag')
        .populate('batch', 'name')
        .populate('course', 'name')
        .populate('teacher', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Student.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: students,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === 'Unauthorized') return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/students — create
export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();

    const body = await req.json();
    const parsed = studentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Validation failed', errors: parsed.error.issues }, { status: 400 });
    }

    const existing = await Student.findOne({ admissionNumber: parsed.data.admissionNumber });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Admission number already exists' }, { status: 409 });
    }

    const student = await Student.create(parsed.data);

    // Auto-map curriculum chapters for student's school and class
    try {
      const subjectFilter: Record<string, unknown> = {
        isActive: true,
        class: student.class,
        $or: [{ school: student.school }, { school: null }, { school: { $exists: false } }],
      };
      const subjects = await Subject.find(subjectFilter).select('_id').lean();
      const subjectIds = subjects.map((s) => s._id);

      const chapters = await Chapter.find({ subject: { $in: subjectIds }, isActive: true }).select('_id subject').lean();
      if (chapters.length > 0) {
        const progressDocs = chapters.map((ch) => ({
          student: student._id,
          subject: ch.subject,
          chapter: ch._id,
          status: 'not_started',
          revisions: [],
        }));
        await ChapterProgress.insertMany(progressDocs, { ordered: false }).catch(() => {});
      }
    } catch (e) {
      console.warn('Auto chapter mapping warning:', e);
    }

    const populated = await student.populate(['school', 'class', 'board', 'country', 'batch', 'course', 'teacher']);

    return NextResponse.json({ success: true, message: 'Student created successfully', data: populated }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === 'Unauthorized') return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
