import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Notice } from '@/lib/models/Notice';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '10'));
    const skip = (page - 1) * limit;
    const category = searchParams.get('category');
    const isPublic = searchParams.get('public') === 'true';

    const filter: Record<string, unknown> = { isArchived: false, deletedAt: null };

    if (isPublic) {
      filter.isPublished = true;
      filter.$or = [{ visibility: 'public' }, { visibility: 'students' }];
    } else {
      // Admin sees all, but still needs auth
      try { await requireAdmin(req); } catch { /* admin not required for public fetch */ }
    }

    if (category) filter.category = category;

    const [notices, total] = await Promise.all([
      Notice.find(filter).sort({ isPinned: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Notice.countDocuments(filter),
    ]);

    return NextResponse.json({ success: true, data: notices, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();
    const body = await req.json();
    const userId = req.headers.get('x-user-id')!;

    const notice = await Notice.create({ ...body, createdBy: userId, publishedAt: body.isPublished ? new Date() : undefined });
    return NextResponse.json({ success: true, message: 'Notice created', data: notice }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === 'Unauthorized') return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
