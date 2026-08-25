import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Board, Class, Country, Batch, Course } from '@/lib/models/Lookup';
import { School } from '@/lib/models/School';
import { Teacher } from '@/lib/models/Teacher';
import { Subject } from '@/lib/models/Subject';

export async function GET(_req: NextRequest) {
  try {
    await connectDB();

    const [boards, classes, countries, batches, courses, schools, teachers, subjects] = await Promise.all([
      Board.find({ isActive: true }).sort({ name: 1 }).lean(),
      Class.find({ isActive: true }).sort({ grade: 1 }).lean(),
      Country.find({ isActive: true }).sort({ name: 1 }).lean(),
      Batch.find({ isActive: true }).sort({ year: -1, name: 1 }).lean(),
      Course.find({ isActive: true }).sort({ name: 1 }).lean(),
      School.find({ isActive: true, deletedAt: null }).sort({ name: 1 }).lean(),
      Teacher.find({ isActive: true, deletedAt: null }).sort({ name: 1 }).lean(),
      Subject.find({ isActive: true }).sort({ name: 1 }).populate('class', 'name grade').populate('board', 'code').lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        boards,
        classes,
        countries,
        batches,
        courses,
        schools,
        teachers,
        subjects,
      },
    });
  } catch (error) {
    console.error('Lookups API error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch lookups' }, { status: 500 });
  }
}
