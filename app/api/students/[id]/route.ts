import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Student } from '@/lib/models/Student';
import { requireAdmin } from '@/lib/auth';

// GET /api/students/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { id } = await params;
    const student = await Student.findOne({ _id: id, deletedAt: null })
      .populate('school', 'name city country')
      .populate('class', 'name grade')
      .populate('board', 'name code')
      .populate('country', 'name code flag')
      .populate('batch', 'name year timing')
      .populate('course', 'name code')
      .populate('teacher', 'name email phone photo')
      .lean();

    if (!student) return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: student });
  } catch {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/students/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const student = await Student.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: body },
      { new: true, runValidators: true }
    ).populate(['school', 'class', 'board', 'country', 'batch', 'course', 'teacher']);

    if (!student) return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Student updated', data: student });
  } catch {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/students/[id] — soft delete
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { id } = await params;
    const student = await Student.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date(), isActive: false },
      { new: true }
    );
    if (!student) return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Student deleted' });
  } catch {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
