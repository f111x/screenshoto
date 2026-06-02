import { NextRequest, NextResponse } from 'next/server';
import { getShare } from '@/lib/store';

export const runtime = 'edge';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const share = await getShare(id);

  if (!share) {
    return NextResponse.json({ error: '分享不存在或已过期' }, { status: 404 });
  }

  return NextResponse.json(share);
}
