import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Student } from '@/lib/models/Student';
import { Mark } from '@/lib/models/Mark';
import { Attendance } from '@/lib/models/Attendance';
import { ChapterProgress } from '@/lib/models/ChapterProgress';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'overview';

    if (type === 'performance') {
      const marks = await Mark.find().populate('subject', 'name').lean();
      return NextResponse.json({ success: true, data: marks });
    }

    // Default overview report data
    const [totalStudents, marks, attendance, progress] = await Promise.all([
      Student.countDocuments({ deletedAt: null }),
      Mark.find().populate('subject', 'name').lean(),
      Attendance.find().lean(),
      ChapterProgress.find().lean(),
    ]);

    const report = {
      totalStudents,
      totalTestsConducted: marks.length,
      averageMark: marks.length ? Math.round(marks.reduce((acc, m) => acc + (m.percentage || 0), 0) / marks.length) : 0,
      totalAttendanceRecords: attendance.length,
      overallAttendanceRate: attendance.length
        ? Math.round((attendance.filter((a) => a.status === 'present').length / attendance.length) * 100)
        : 0,
      completedChaptersCount: progress.filter((p) => p.status === 'completed').length,
    };

    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    console.error('Reports API error:', error);
    return NextResponse.json({ success: false, message: 'Failed to generate report' }, { status: 500 });
  }
}
