import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { originalImage, code, framework } = await request.json();

    if (!originalImage || !code) {
      return NextResponse.json({ error: '缺少截图或代码' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ score: null });
    }

    const base64Image = originalImage.replace(/^data:image\/\w+;base64,/, '');

    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a UI quality assessor. Given a screenshot of a UI and the code generated from it, rate how closely the generated code matches the original screenshot.

Respond with ONLY a number from 0 to 100, where:
- 100 = pixel-perfect match
- 80-99 = very close, minor differences in spacing/color
- 60-79 = recognizable but noticeable differences in layout
- 40-59 = rough approximation, layout or styling significantly different
- 0-39 = poor match, barely resembles the original

Output ONLY the number, no text.`,
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: `Original screenshot (${framework}):` },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: 'high',
              },
            },
            { type: 'text', text: `\nGenerated code:\n\`\`\`\n${code.slice(0, 2000)}\n\`\`\`` },
          ],
        },
      ],
      max_tokens: 10,
      temperature: 0.1,
    });

    const content = response.choices[0]?.message?.content?.trim();
    const score = parseInt(content || '0', 10);
    const validScore = isNaN(score) ? null : Math.min(100, Math.max(0, score));

    return NextResponse.json({ score: validScore });
  } catch {
    return NextResponse.json({ score: null });
  }
}
