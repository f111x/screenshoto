'use client';

import { useState, useCallback } from 'react';
import ImageUploader from '@/components/ImageUploader';
import FrameworkSelector from '@/components/FrameworkSelector';
import CodePreview from '@/components/CodePreview';
import CodeOutput from '@/components/CodeOutput';
import type { Framework, ConversionResult } from '@/types';
import { generateId, compressImage, addToHistory, getRemainingQuota, incrementQuota, hasQuota } from '@/lib/utils';

export default function AppPage() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [framework, setFramework] = useState<Framework>('html');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const handleImageReady = useCallback((dataUrl: string) => {
    setImageDataUrl(dataUrl);
    setCode('');
    setError('');
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!imageDataUrl) {
      setError('请先上传截图');
      return;
    }

    if (!hasQuota()) {
      setError('免费额度已用完。请稍后再试或使用自己的 API Key。');
      return;
    }

    setLoading(true);
    setError('');
    setStatusMsg('正在分析截图...');

    try {
      // Compress image to optimize token usage
      const compressed = await compressImage(
        await (await fetch(imageDataUrl)).blob() as File,
        1200
      );

      setStatusMsg('AI 正在生成代码...');

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: compressed,
          framework,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || '生成失败，请重试');
      }

      setCode(data.code);
      incrementQuota();

      // Save to history
      addToHistory({
        id: generateId(),
        imageUrl: imageDataUrl,
        framework,
        code: data.code,
        createdAt: Date.now(),
      });

      setStatusMsg('');
    } catch (err: any) {
      setError(err.message || '生成失败，请检查 API Key 是否正确');
      setStatusMsg('');
    } finally {
      setLoading(false);
    }
  }, [imageDataUrl, framework]);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  const handleReset = useCallback(() => {
    setImageDataUrl(null);
    setCode('');
    setError('');
    setStatusMsg('');
  }, []);

  const remaining = getRemainingQuota();

  return (
    <div className="flex flex-col flex-1 h-screen">
      {/* Top bar */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black shrink-0">
        <div className="px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 font-bold text-base">
              <span className="w-6 h-6 rounded-md bg-violet-600 text-white flex items-center justify-center text-xs font-bold">
                S
              </span>
              <span className="hidden sm:inline bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Screensho.to
              </span>
            </a>
            <FrameworkSelector
              selected={framework}
              onChange={setFramework}
              disabled={loading}
            />
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="hidden sm:inline">
              剩余次数: <span className="font-medium text-violet-600 dark:text-violet-400">{remaining}</span>
            </span>
            {imageDataUrl && (
              <button
                onClick={handleReset}
                className="px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                重新开始
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
        {/* Left: Upload + Controls */}
        <div className="w-full lg:w-[420px] xl:w-[480px] shrink-0 flex flex-col border-r border-gray-200 dark:border-gray-800">
          {/* Image upload area */}
          <div className="h-64 sm:h-80 p-3">
            <ImageUploader onImageReady={handleImageReady} disabled={loading} />
          </div>

          {/* Controls */}
          <div className="px-3 pb-3 space-y-3">
            <button
              onClick={handleGenerate}
              disabled={loading || !imageDataUrl}
              className={`
                w-full py-3 rounded-xl font-semibold text-sm transition-all
                ${loading
                  ? 'bg-violet-400 text-white cursor-wait'
                  : !imageDataUrl
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                    : 'bg-violet-600 text-white hover:bg-violet-700 active:scale-[0.98] shadow-sm'
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {statusMsg || '生成中...'}
                </span>
              ) : (
                `🚀 生成代码 (剩余 ${remaining} 次)`
              )}
            </button>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right: Preview + Code */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Preview pane */}
          <div className="flex-1 min-h-[300px] lg:min-h-0 p-3 flex flex-col">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
              <span>👁️ 预览</span>
              {code && <span className="text-green-500">(已生成)</span>}
            </div>
            <div className="flex-1 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <CodePreview code={code} framework={framework} />
            </div>
          </div>

          {/* Code pane */}
          <div className="flex-1 min-h-[300px] lg:min-h-0 p-3 flex flex-col">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
              <span>💻 代码</span>
              {code && (
                <span className="text-xs text-gray-400">
                  ({framework === 'react' ? '.jsx' : framework === 'vue' ? '.vue' : '.html'})
                </span>
              )}
            </div>
            <div className="flex-1 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <CodeOutput code={code} framework={framework} onCodeChange={handleCodeChange} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile quota warning */}
      {remaining <= 3 && (
        <div className="lg:hidden p-2 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-800 text-xs text-amber-600 dark:text-amber-400 text-center">
          免费额度剩余 {remaining} 次
        </div>
      )}
    </div>
  );
}
