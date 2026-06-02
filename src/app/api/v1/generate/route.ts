import { NextRequest, NextResponse } from 'next/server';
import { createAIClient, getProviderConfig, cleanCodeOutput } from '@/lib/ai';

export const runtime = 'edge';

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute

const ipCounters = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipCounters.get(ip);
  if (!entry || now > entry.resetAt) {
    ipCounters.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

function validateApiKey(key: string | null): boolean {
  if (!key) return false;
  const validKey = process.env.API_KEY;
  return validKey ? key === validKey : false;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: '速率限制已达 (10次/分钟)' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    // API Key validation (optional — skip if env not set)
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      const auth = request.headers.get('authorization')?.replace('Bearer ', '') || null;
      if (!validateApiKey(auth)) {
        return NextResponse.json({ error: 'API Key 无效，请提供有效的 Bearer token' }, { status: 401 });
      }
    }

    const { image, framework } = await request.json();

    if (!image) {
      return NextResponse.json({ error: '缺少 image 字段 (base64 data URL)' }, { status: 400 });
    }
    if (!framework || !['html', 'react', 'vue', 'tailwind'].includes(framework)) {
      return NextResponse.json({ error: 'framework 必须为 html/react/vue/tailwind 之一' }, { status: 400 });
    }

    // Get provider config
    let config;
    try {
      config = getProviderConfig();
    } catch {
      return NextResponse.json({ error: 'AI API Key 未配置' }, { status: 500 });
    }

    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');
    const client = createAIClient(config);

    const response = await client.chat.completions.create({
      model: config.model,
      messages: [
        {
          role: 'system',
          content: `You are a front-end code generator. Given a screenshot of a UI, generate the corresponding code using Tailwind CSS.
Output ONLY the code block. Framework: ${framework}.
- "html" / "tailwind" → plain HTML with Tailwind CDN
- "react" → React functional component (export default function App)
- "vue" → Vue SFC with <template> and <script setup>`,
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Generate code from this UI screenshot:' },
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${base64Image}`, detail: 'high' },
            },
          ],
        },
      ],
      max_tokens: 4096,
      temperature: 0.2,
    });

    let code = response.choices[0]?.message?.content || '';
    code = cleanCodeOutput(code);

    return NextResponse.json({
      success: true,
      data: { code, framework },
      usage: { tokens: response.usage?.total_tokens },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || '生成失败' },
      { status: 500 }
    );
  }
}
