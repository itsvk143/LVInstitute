import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Teacher } from '@/lib/models/Teacher';
import { requireAdmin } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const teacher = await Teacher.findOne({ _id: id, deletedAt: null })
      .populate('subjects')
      .lean();

    if (!teacher) {
      return NextResponse.json(
        { success: false, message: 'Teacher not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: teacher });
  } catch (error) {
    console.error('Teacher GET by ID error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch teacher profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { id } = await params;

    const body = await req.json();

    const teacher = await Teacher.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: body },
      { new: true, runValidators: true }
    ).populate('subjects');

    if (!teacher) {
      return NextResponse.json(
        { success: false, message: 'Teacher not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: teacher });
  } catch (error: unknown) {
    console.error('Teacher PATCH error:', error);
    const err = error as { message?: string };
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to update teacher profile' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PATCH(req, { params });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { id } = await params;

    const teacher = await Teacher.findOneAndUpdate(
      { _id: id },
      { $set: { deletedAt: new Date(), isActive: false } },
      { new: true }
    );

    if (!teacher) {
      return NextResponse.json(
        { success: false, message: 'Teacher not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Teacher DELETE error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete teacher' },
      { status: 500 }
    );
  }
}
