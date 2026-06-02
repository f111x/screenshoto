import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { code, framework } = await request.json();

    if (!code) {
      return NextResponse.json({ error: '缺少代码' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key 未配置' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a code quality reviewer for front-end code. Given a piece of ${framework} code using Tailwind CSS, analyze it and suggest improvements.

Respond with a JSON object in this exact format:
{
  "issues": [
    {
      "type": "accessibility" | "performance" | "best-practice" | "responsive" | "semantic",
      "title": "Short issue title in Chinese",
      "description": "Brief explanation in Chinese",
      "line": <line number or null>,
      "fix": "<the fixed code snippet for just this issue>"
    }
  ],
  "summary": "Brief Chinese summary of overall code quality"
}

Rules:
- Return 1-4 issues maximum
- Only flag real issues, don't make things up
- Each fix should be a minimal code change
- If the code is clean, return {"issues": [], "summary": "代码质量良好，无需改进"}
- The fix should be the complete replacement for the affected section`,
        },
        {
          role: 'user',
          content: code.slice(0, 4000),
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2048,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || '{"issues":[],"summary":"分析失败"}';
    const result = JSON.parse(content);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { issues: [], summary: 'AI 分析暂时不可用: ' + (error.message || '') },
      { status: 500 }
    );
  }
}
