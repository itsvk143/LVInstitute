import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Attendance } from '@/lib/models/Attendance';
import { Student } from '@/lib/models/Student';
import '@/lib/models/Lookup';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('student');
    const dateStr = searchParams.get('date');

    const filter: Record<string, unknown> = {};
    if (studentId) filter.student = studentId;
    if (dateStr) {
      const d = new Date(dateStr);
      const startOfDay = new Date(d.setHours(0, 0, 0, 0));
      const endOfDay = new Date(d.setHours(23, 59, 59, 999));
      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const attendance = await Attendance.find(filter)
      .populate('student', 'name admissionNumber photo class')
      .sort({ date: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({ success: true, data: attendance });
  } catch (error) {
    console.error('Attendance GET error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch attendance' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();

    const body = await req.json();

    // Support single or bulk attendance entry
    if (Array.isArray(body)) {
      const operations = body.map((record) => ({
        updateOne: {
          filter: {
            student: record.student,
            date: {
              $gte: new Date(new Date(record.date).setHours(0, 0, 0, 0)),
              $lte: new Date(new Date(record.date).setHours(23, 59, 59, 999)),
            },
          },
          update: { $set: record },
          upsert: true,
        },
      }));
      await Attendance.bulkWrite(operations);
      return NextResponse.json({ success: true, message: `Marked attendance for ${body.length} students` });
    }

    const attendance = await Attendance.create(body);
    return NextResponse.json({ success: true, data: attendance }, { status: 201 });
  } catch (error) {
    console.error('Attendance POST error:', error);
    return NextResponse.json({ success: false, message: 'Failed to record attendance' }, { status: 500 });
  }
}
