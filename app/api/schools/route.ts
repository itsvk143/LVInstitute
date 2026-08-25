import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { School } from '@/lib/models/School';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    const filter: Record<string, unknown> = { deletedAt: null };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    const schools = await School.find(filter).sort({ name: 1 }).lean();
    return NextResponse.json({ success: true, data: schools });
  } catch (error) {
    console.error('Schools GET error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch schools' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();

    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ success: false, message: 'School name is required' }, { status: 400 });
    }

    const school = await School.create(body);
    return NextResponse.json({ success: true, data: school }, { status: 201 });
  } catch (error) {
    console.error('School POST error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create school' }, { status: 500 });
  }
}
