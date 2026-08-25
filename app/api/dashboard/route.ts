import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Student } from '@/lib/models/Student';
import { ChapterProgress } from '@/lib/models/ChapterProgress';
import { Mark } from '@/lib/models/Mark';
import { Attendance } from '@/lib/models/Attendance';
import { Examination } from '@/lib/models/Examination';
import { Notice } from '@/lib/models/Notice';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const [
      totalStudents,
      activeStudents,
      upcomingExams,
      recentNotices,
      attendanceData,
      recentMarks,
      progressData,
    ] = await Promise.all([
      Student.countDocuments({ deletedAt: null }),
      Student.countDocuments({ deletedAt: null, isActive: true }),
      Examination.find({ date: { $gte: now }, isPublished: true }).sort({ date: 1 }).limit(5).populate('subjects', 'name').lean(),
      Notice.find({ isPublished: true, isArchived: false, deletedAt: null }).sort({ isPinned: -1, publishedAt: -1 }).limit(5).lean(),
      Attendance.find({ date: { $gte: thirtyDaysAgo } }).lean(),
      Mark.find({ examDate: { $gte: thirtyDaysAgo } }).populate('student', 'name admissionNumber').populate('subject', 'name').sort({ examDate: -1 }).limit(10).lean(),
      ChapterProgress.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const attendanceStats = {
      total: attendanceData.length,
      present: attendanceData.filter((a) => a.status === 'present').length,
      absent: attendanceData.filter((a) => a.status === 'absent').length,
      late: attendanceData.filter((a) => a.status === 'late').length,
      percentage: attendanceData.length
        ? Math.round((attendanceData.filter((a) => a.status === 'present').length / attendanceData.length) * 100)
        : 0,
    };

    const progressStats = {
      completed: progressData.find((p) => p._id === 'completed')?.count || 0,
      in_progress: progressData.find((p) => p._id === 'in_progress')?.count || 0,
      not_started: progressData.find((p) => p._id === 'not_started')?.count || 0,
    };

    const avgMarks = recentMarks.length
      ? Math.round(recentMarks.reduce((sum, m) => sum + (m.percentage || 0), 0) / recentMarks.length)
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalStudents,
          activeStudents,
          inactiveStudents: totalStudents - activeStudents,
          avgAttendance: attendanceStats.percentage,
          avgMarks,
        },
        attendance: attendanceStats,
        progress: progressStats,
        upcomingExams,
        recentNotices,
        recentMarks,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === 'Unauthorized') return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
