'use client';

import { useEffect, useState } from 'react';
import CodePreview from '@/components/CodePreview';
import Link from 'next/link';
import type { ShareData } from '@/types';

export default function ShareViewer({ id }: { id: string }) {
  const [data, setData] = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/share/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('NOT_FOUND');
        return res.json();
      })
      .then(setData)
      .catch(() => setError('分享不存在或已过期'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-3">
          <div className="animate-spin w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <div className="text-5xl">🔗</div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">分享不存在</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {error || '该分享链接可能已过期或已被删除'}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors"
          >
            返回首页创建新代码 →
          </Link>
        </div>
      </div>
    );
  }

  const frameLabel = { html: 'HTML', tailwind: 'Tailwind', react: 'React', vue: 'Vue' }[data.framework] || data.framework;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Nav */}
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-sm">
            <span className="w-6 h-6 rounded-md bg-violet-600 text-white flex items-center justify-center text-xs font-bold">
              S
            </span>
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Screensho.to
            </span>
          </Link>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>分享代码</span>
            <Link
              href="/app"
              className="px-3 py-1.5 rounded-md bg-violet-600 text-white text-xs font-medium hover:bg-violet-700 transition-colors"
            >
              创建自己的 →
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-mono text-gray-400">#{id.slice(0, 8)}</span>
          <span className="px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-900/30 text-xs font-medium text-violet-700 dark:text-violet-300">
            {frameLabel}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(data.createdAt).toLocaleDateString('zh-CN', {
              year: 'numeric', month: 'short', day: 'numeric',
            })}
          </span>
        </div>

        {/* Preview + Code */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 text-xs font-medium text-gray-500">
              👁️ 预览
            </div>
            <div className="h-[400px] lg:h-[600px]">
              <CodePreview code={data.code} framework={data.framework} />
            </div>
          </div>

          <div className="bg-[#1e1e1e] rounded-xl overflow-hidden border border-gray-700">
            <div className="px-3 py-2 border-b border-gray-700 text-xs font-medium text-gray-400 flex items-center justify-between">
              <span>💻 代码</span>
              <span className="text-gray-500">{frameLabel}</span>
            </div>
            <pre className="p-4 text-sm font-mono text-[#d4d4d4] overflow-auto max-h-[600px] leading-relaxed">
              <code>{data.code}</code>
            </pre>
          </div>
        </div>

        {/* Share prompt */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400 mb-3">
            通过 Screensho.to 由 AI 生成 · 截图即代码
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors"
          >
            🚀 我也要生成
          </Link>
        </div>
      </main>
    </div>
  );
}
