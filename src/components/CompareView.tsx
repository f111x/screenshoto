'use client';

import { useState } from 'react';
import CodePreview from './CodePreview';

interface CompareViewProps {
  originalImage: string;
  code: string;
  framework: string;
  onScoreReceived?: (score: number) => void;
}

export default function CompareView({ originalImage, code, framework, onScoreReceived }: CompareViewProps) {
  const [mode, setMode] = useState<'side-by-side' | 'overlay' | 'preview-only'>('side-by-side');
  const [scoring, setScoring] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleScore = async () => {
    if (scoring) return;
    setScoring(true);
    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalImage,
          code,
          framework,
        }),
      });
      const data = await res.json();
      if (data.score !== undefined) {
        setScore(data.score);
        onScoreReceived?.(data.score);
      }
    } catch {
      // Silently fail for scoring
    } finally {
      setScoring(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMode('side-by-side')}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
              mode === 'side-by-side'
                ? 'bg-violet-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            并排对比
          </button>
          <button
            onClick={() => setMode('preview-only')}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
              mode === 'preview-only'
                ? 'bg-violet-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            仅预览
          </button>
        </div>
        <button
          onClick={handleScore}
          disabled={scoring}
          className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
            scoring
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-wait'
              : score !== null
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {scoring ? '评分中...' : score !== null ? `相似度 ${score}%` : '🔍 AI 评分'}
        </button>
      </div>

      {/* Comparison views */}
      {mode === 'side-by-side' && (
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="px-2 py-1.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-500">
              原截图
            </div>
            <img
              src={originalImage}
              alt="Original screenshot"
              className="w-full h-auto max-h-[300px] object-contain bg-white"
            />
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="px-2 py-1.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-500">
              生成代码
            </div>
            <div className="h-[300px]">
              <CodePreview code={code} framework={framework} />
            </div>
          </div>
        </div>
      )}

      {mode === 'preview-only' && (
        <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="h-[400px]">
            <CodePreview code={code} framework={framework} />
          </div>
        </div>
      )}
    </div>
  );
}
