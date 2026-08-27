import { NextRequest, NextResponse } from 'next/server';
import { fetchStudentPublicData } from '@/lib/services/publicStudent';

// GET /api/students/[id]/public — NO AUTH REQUIRED
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await fetchStudentPublicData(id);

    if (!data) {
      return NextResponse.json({ success: false, message: 'Student profile not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Public student API error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
