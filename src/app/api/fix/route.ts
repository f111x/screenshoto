import { NextRequest, NextResponse } from 'next/server';
import { createAIClient, getProviderConfig, getProviderName } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { code, framework } = await request.json();

    if (!code) {
      return NextResponse.json({ error: '缺少代码' }, { status: 400 });
    }

    let config;
    try {
      config = getProviderConfig();
    } catch {
      return NextResponse.json({ issues: [], summary: 'AI 未配置，无法分析' });
    }

    const client = createAIClient(config);

    const response = await client.chat.completions.create({
      model: config.model,
      messages: [
        {
          role: 'system',
          content: `You are a code quality reviewer for front-end code. Given a piece of ${framework} code using Tailwind CSS, analyze it and suggest improvements.

Respond with a JSON object in this exact format:
{
  "issues": [
    {
      "type": "accessibility" | "performance" | "best-practice" | "responsive" | "semantic",
      "title": "Short issue title",
      "description": "Brief explanation",
      "line": <line number or null>,
      "fix": "<fixed code snippet>"
    }
  ],
  "summary": "Brief summary of overall code quality"
}

Rules:
- Return 1-4 issues maximum
- Only flag real issues
- Each fix should be a minimal change
- If code is clean: {"issues": [], "summary": "Code looks good, no improvements needed"}
- Fix should be the complete replacement for the affected section`,
        },
        { role: 'user', content: code.slice(0, 4000) },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2048,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || '{"issues":[],"summary":"Analysis failed"}';
    const result = JSON.parse(content);

    return NextResponse.json({ ...result, provider: getProviderName() });
  } catch (error: any) {
    return NextResponse.json(
      { issues: [], summary: 'AI 分析暂时不可用: ' + (error.message || '') },
      { status: 500 }
    );
  }
}
