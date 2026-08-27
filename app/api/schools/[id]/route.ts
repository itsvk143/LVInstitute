import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { School } from '@/lib/models/School';
import { requireAdmin } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { id } = await params;

    const school = await School.findById(id).lean();
    if (!school) {
      return NextResponse.json({ success: false, message: 'School not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: school });
  } catch (error) {
    console.error('School GET error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch school' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const updated = await School.findByIdAndUpdate(
      id,
      {
        name: body.name,
        code: body.code,
        city: body.city,
        state: body.state,
        country: body.country || 'India',
        address: body.address,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'School not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated, message: 'School updated successfully' });
  } catch (error) {
    console.error('School PUT error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update school' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { id } = await params;

    const school = await School.findByIdAndDelete(id);
    if (!school) {
      return NextResponse.json({ success: false, message: 'School not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'School deleted successfully' });
  } catch (error) {
    console.error('School DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete school' }, { status: 500 });
  }
}
