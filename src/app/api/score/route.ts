import { NextRequest, NextResponse } from 'next/server';
import { createAIClient, getProviderConfig, getProviderName } from '@/lib/ai';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { originalImage, code, framework } = await request.json();

    if (!originalImage || !code) {
      return NextResponse.json({ error: '缺少截图或代码' }, { status: 400 });
    }

    let config;
    try {
      config = getProviderConfig();
    } catch {
      // Scoring is optional — fail silently
      return NextResponse.json({ score: null });
    }

    const base64Image = originalImage.replace(/^data:image\/\w+;base64,/, '');
    const client = createAIClient(config);

    const response = await client.chat.completions.create({
      model: config.model,
      messages: [
        {
          role: 'system',
          content: `You are a UI quality assessor. Given a screenshot of a UI and the code generated from it, rate how closely the generated code matches the original screenshot.

Respond with ONLY a number from 0 to 100, where:
- 100 = pixel-perfect match
- 80-99 = very close, minor differences
- 60-79 = recognizable but noticeable differences
- 40-59 = rough approximation
- 0-39 = poor match

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
      temperature: 1.0,
    });

    const content = response.choices[0]?.message?.content?.trim();
    const score = parseInt(content || '0', 10);
    const validScore = isNaN(score) ? null : Math.min(100, Math.max(0, score));

    return NextResponse.json({ score: validScore, provider: getProviderName() });
  } catch {
    return NextResponse.json({ score: null });
  }
}
