import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemPrompt = (framework: string) => `You are a front-end code generator. Given a screenshot of a UI, generate the corresponding code using Tailwind CSS.

Rules:
1. Output ONLY the code block, no explanations or markdown wrappers.
2. Use modern, clean semantic HTML5.
3. The code MUST be self-contained and renderable in a browser.
4. If text is visible in the image, use the exact same text.
5. Match colors, spacing, layout, and fonts as closely as possible.
6. Use responsive design (mobile-first).
7. Framework: ${framework}
   - "html" → plain HTML with Tailwind CDN (<script src="https://cdn.tailwindcss.com"></script>)
   - "react" → React functional component with Tailwind classes (React 18+, export default function App)
   - "vue" → Vue single-file component with <template> and <script setup>
   - "tailwind" → plain HTML with Tailwind CDN
8. For React: export default function App() { return (...); }, no imports.
9. For Vue: use <template> with one root element, <script setup lang="ts">.
10. Include placeholder images using https://placehold.co/400x300/EEE/999?text=Placeholder if needed.`;

export async function POST(request: NextRequest) {
  try {
    const { image, framework } = await request.json();

    if (!image) {
      return NextResponse.json({ error: '缺少截图数据' }, { status: 400 });
    }

    if (!framework) {
      return NextResponse.json({ error: '请选择输出框架' }, { status: 400 });
    }

    // Get API key from environment variable
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: '服务器 OpenAI API Key 未配置。请在 .env.local 中设置 OPENAI_API_KEY' },
        { status: 500 }
      );
    }

    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt(framework) },
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
      temperature: 0.2,
    });

    let code = response.choices[0]?.message?.content || '';

    // Clean up markdown code fences
    code = code
      .replace(/^```[\w]*\n?/gm, '')
      .replace(/\n?```$/gm, '')
      .trim();

    if (!code) {
      return NextResponse.json({ error: 'AI 返回为空，请重试' }, { status: 500 });
    }

    return NextResponse.json({ code });
  } catch (error: any) {
    console.error('Generate error:', error);

    // Handle specific OpenAI errors
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
