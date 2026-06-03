import { NextRequest, NextResponse } from 'next/server';
import { createAIClient, getProviderConfig, buildSystemPrompt, cleanCodeOutput, getProviderName } from '@/lib/ai';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { image, framework } = await request.json();

    if (!image) {
      return NextResponse.json({ error: '缺少截图数据' }, { status: 400 });
    }

    if (!framework) {
      return NextResponse.json({ error: '请选择输出框架' }, { status: 400 });
    }

    // Get provider config
    let config;
    try {
      config = getProviderConfig();
    } catch (e: any) {
      return NextResponse.json(
        { error: 'AI API Key 未配置。请在 .env.local 中设置 AI_API_KEY 或 OPENAI_API_KEY' },
        { status: 500 }
      );
    }

    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');
    const client = createAIClient(config);

    const response = await client.chat.completions.create({
      model: config.model,
      messages: [
        { role: 'system', content: buildSystemPrompt(framework) },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Generate code from this UI screenshot:' },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: 'high',
              },
            },
          ],
        },
      ],
      max_tokens: 4096,
      temperature: 1.0,
    });

    let code = response.choices[0]?.message?.content || '';
    code = cleanCodeOutput(code);

    if (!code) {
      return NextResponse.json({ error: 'AI 返回为空，请重试' }, { status: 500 });
    }

    return NextResponse.json({ code, provider: getProviderName(), model: config.model });
  } catch (error: any) {
    console.error('Generate error:', error);

    if (error?.status === 401) {
      return NextResponse.json({ error: 'API Key 无效' }, { status: 401 });
    }
    if (error?.status === 429) {
      return NextResponse.json({ error: 'API 速率限制已达，请稍后重试' }, { status: 429 });
    }
    if (error?.code === 'insufficient_quota') {
      return NextResponse.json({ error: 'API 配额不足' }, { status: 429 });
    }

    return NextResponse.json(
      { error: '生成失败: ' + (error.message || '未知错误') },
      { status: 500 }
    );
  }
}
