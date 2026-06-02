'use client';

import Link from 'next/link';
import { useState } from 'react';

const codeExamples = {
  curl: `curl -X POST https://your-domain.com/api/v1/generate \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQ...",
    "framework": "html"
  }'`,
  node: `import fetch from 'node-fetch';

const response = await fetch('https://your-domain.com/api/v1/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY',
  },
  body: JSON.stringify({
    image: 'data:image/jpeg;base64,...',
    framework: 'react',
  }),
});

const data = await response.json();
console.log(data.data.code);`,
  python: `import requests
import base64

with open('screenshot.png', 'rb') as f:
    image = base64.b64encode(f.read()).decode()

resp = requests.post(
    'https://your-domain.com/api/v1/generate',
    headers={'Authorization': 'Bearer YOUR_API_KEY'},
    json={
        'image': f'data:image/jpeg;base64,{image}',
        'framework': 'tailwind',
    }
)
print(resp.json()['data']['code'])`,
};

export default function DocsPage() {
  const [lang, setLang] = useState<'curl' | 'node' | 'python'>('curl');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Nav */}
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-sm">
            <span className="w-6 h-6 rounded-md bg-violet-600 text-white flex items-center justify-center text-xs font-bold">S</span>
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Screensho.to</span>
          </Link>
          <Link href="/app" className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">← 返回应用</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2">API 文档</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          将截图转代码功能集成到你的工作流中
        </p>

        {/* Endpoint */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">端点</h2>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 font-mono text-sm">
            <span className="px-1.5 py-0.5 rounded bg-green-500 text-white text-xs font-bold">POST</span>
            <span className="text-gray-700 dark:text-gray-300">/api/v1/generate</span>
          </div>
        </section>

        {/* Auth */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">认证</h2>
          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-300 mb-3">
            可选。设置 <code className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-xs">API_KEY</code> 环境变量后需要 Bearer token。
          </div>
          <pre className="p-3 rounded-lg bg-gray-900 text-gray-100 text-sm font-mono overflow-x-auto">
            <code>Authorization: Bearer YOUR_API_KEY</code>
          </pre>
        </section>

        {/* Request body */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">请求参数</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 font-medium text-gray-500">参数</th>
                  <th className="text-left py-2 font-medium text-gray-500">类型</th>
                  <th className="text-left py-2 font-medium text-gray-500">必需</th>
                  <th className="text-left py-2 font-medium text-gray-500">说明</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 font-mono text-xs">image</td>
                  <td className="py-2 text-xs">string</td>
                  <td className="py-2 text-xs text-green-500">是</td>
                  <td className="py-2 text-xs text-gray-500">Base64 data URL of the screenshot</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">framework</td>
                  <td className="py-2 text-xs">string</td>
                  <td className="py-2 text-xs text-green-500">是</td>
                  <td className="py-2 text-xs text-gray-500">html | react | vue | tailwind</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Response */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">响应格式</h2>
          <pre className="p-3 rounded-lg bg-gray-900 text-gray-100 text-sm font-mono overflow-x-auto">
            <code>{JSON.stringify({
              success: true,
              data: { code: '<generated HTML/JSX/Vue code>', framework: 'html' },
              usage: { tokens: 1024 },
            }, null, 2)}</code>
          </pre>
        </section>

        {/* Code examples */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">示例代码</h2>
          <div className="flex gap-1 mb-3">
            {(['curl', 'node', 'python'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  lang === l
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {l === 'curl' ? 'cURL' : l === 'node' ? 'Node.js' : 'Python'}
              </button>
            ))}
          </div>
          <pre className="p-4 rounded-lg bg-gray-900 text-gray-100 text-sm font-mono overflow-x-auto leading-relaxed">
            <code>{codeExamples[lang]}</code>
          </pre>
        </section>

        {/* Rate limits */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">速率限制</h2>
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300">
            <p>免费 API 限制为 <strong>10 次/分钟</strong>（基于 IP）。</p>
            <p className="mt-1">如需更高额度，请联系或自部署。</p>
          </div>
        </section>

        {/* Error codes */}
        <section>
          <h2 className="text-lg font-semibold mb-3">错误码</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 font-medium text-gray-500">状态码</th>
                  <th className="text-left py-2 font-medium text-gray-500">说明</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 font-mono text-xs text-red-500">400</td>
                  <td className="py-2 text-xs text-gray-500">缺少必填参数</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 font-mono text-xs text-red-500">401</td>
                  <td className="py-2 text-xs text-gray-500">API Key 无效</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 font-mono text-xs text-red-500">429</td>
                  <td className="py-2 text-xs text-gray-500">速率限制已达</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs text-red-500">500</td>
                  <td className="py-2 text-xs text-gray-500">服务器内部错误</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
