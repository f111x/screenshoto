import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      name: 'Screensho.to API',
      version: 'v1',
      baseUrl: '/api/v1',
      endpoints: [
        {
          path: '/generate',
          method: 'POST',
          description: '将截图转换为前端代码',
          requestBody: {
            image: 'string (base64 data URL, required)',
            framework: 'string (html | react | vue | tailwind, required)',
          },
          response: {
            success: true,
            data: { code: 'string', framework: 'string' },
            usage: { tokens: 'number' },
          },
        },
      ],
      authentication: 'Bearer token in Authorization header (optional, configure API_KEY env var)',
      rateLimit: '10 requests/minute per IP',
    },
  });
}
