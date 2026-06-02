import { NextRequest, NextResponse } from 'next/server';
import { saveShare } from '@/lib/store';
import { generateId } from '@/lib/utils';
import type { ShareData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, framework, code } = await request.json();

    if (!code || !framework) {
      return NextResponse.json({ error: '缺少代码或框架参数' }, { status: 400 });
    }

    const share: ShareData = {
      id: generateId(),
      imageUrl: imageUrl || '',
      framework,
      code,
      createdAt: Date.now(),
    };

    await saveShare(share);

    return NextResponse.json({
      id: share.id,
      url: `${request.nextUrl.origin}/s/${share.id}`,
    });
  } catch (error: any) {
    console.error('Share create error:', error);
    return NextResponse.json({ error: '创建分享失败' }, { status: 500 });
  }
}
