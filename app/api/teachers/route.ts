import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Teacher } from '@/lib/models/Teacher';
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
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
      ];
    }

    const teachers = await Teacher.find(filter).sort({ name: 1 }).lean();
    return NextResponse.json({ success: true, data: teachers });
  } catch (error) {
    console.error('Teachers GET error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch teachers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();

    const body = await req.json();
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json({ success: false, message: 'Name, email and phone are required' }, { status: 400 });
    }

    const teacher = await Teacher.create(body);
    return NextResponse.json({ success: true, data: teacher }, { status: 201 });
  } catch (error: unknown) {
    const err = error as { code?: number };
    if (err.code === 11000) {
      return NextResponse.json({ success: false, message: 'Teacher with this email already exists' }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: 'Failed to create teacher' }, { status: 500 });
  }
}
