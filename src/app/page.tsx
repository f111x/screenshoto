'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col flex-1">
      {/* Nav */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="w-7 h-7 rounded-lg bg-violet-600 text-white flex items-center justify-center text-sm font-bold">
              S
            </span>
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Screensho.to
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              开始使用
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 text-xs font-medium text-violet-700 dark:text-violet-300 mb-8">
          🚀 AI 驱动的截图转代码工具
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl leading-tight">
          截图任意 UI，
          <br />
          <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            AI 秒生成前端代码
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl">
          上传一张截图 → 选择输出框架 → 3 秒获得可直接运行的
          HTML / Tailwind / React / Vue 代码
        </p>

        <div className="mt-10 flex items-center gap-4">
          <button
            onClick={() => router.push('/app')}
            className="px-8 py-3.5 rounded-xl bg-violet-600 text-white font-semibold text-base hover:bg-violet-700 active:scale-[0.97] transition-all shadow-lg shadow-violet-200 dark:shadow-violet-900/30"
          >
            免费开始使用 →
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 font-medium text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </span>
          </a>
        </div>

        {/* Supported frameworks */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 dark:text-gray-500">
          <span className="font-medium text-gray-500 dark:text-gray-400">支持框架:</span>
          {[
            { icon: '🌐', label: 'HTML' },
            { icon: '🎨', label: 'Tailwind CSS' },
            { icon: '⚛️', label: 'React' },
            { icon: '💚', label: 'Vue' },
          ].map(({ icon, label }) => (
            <span key={label} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              {icon} {label}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-xs text-gray-400 dark:text-gray-500">
        <p>Screensho.to — 截图即代码。开源 MIT License。</p>
      </footer>
    </div>
  );
}
