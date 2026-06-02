'use client';

import { useState, useCallback } from 'react';

interface Issue {
  type: string;
  title: string;
  description: string;
  line: number | null;
  fix: string;
}

interface FixSuggestionProps {
  code: string;
  framework: string;
  onApplyFix: (newCode: string) => void;
}

const typeLabels: Record<string, { icon: string; color: string }> = {
  accessibility: { icon: '♿', color: 'text-blue-600 dark:text-blue-400' },
  performance: { icon: '⚡', color: 'text-amber-600 dark:text-amber-400' },
  'best-practice': { icon: '📐', color: 'text-violet-600 dark:text-violet-400' },
  responsive: { icon: '📱', color: 'text-green-600 dark:text-green-400' },
  semantic: { icon: '🏷️', color: 'text-cyan-600 dark:text-cyan-400' },
};

export default function CodeFixSuggestions({ code, framework, onApplyFix }: FixSuggestionProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null);

  const analyze = useCallback(async () => {
    if (!code || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, framework }),
      });
      const data = await res.json();
      setIssues(data.issues || []);
      setSummary(data.summary || '');
    } catch {
      setIssues([]);
      setSummary('分析失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [code, framework, loading]);

  const handleApply = useCallback((fix: string) => {
    // Replace old code with fixed code (full replacement for simplicity)
    onApplyFix(fix);
  }, [onApplyFix]);

  return (
    <div className="space-y-3">
      {/* Trigger button */}
      <button
        onClick={analyze}
        disabled={loading || !code}
        className={`
          w-full py-2 rounded-xl text-sm font-medium transition-all
          ${loading
            ? 'bg-violet-400 text-white cursor-wait'
            : !code
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              : issues.length > 0
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }
        `}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            AI 分析中...
          </span>
        ) : issues.length > 0 ? (
          `✅ 已发现 ${issues.length} 个改进建议`
        ) : (
          '🤖 AI 代码审查'
        )}
      </button>

      {/* Issues list */}
      {issues.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">{summary}</p>
          {issues.map((issue, i) => {
            const meta = typeLabels[issue.type] || { icon: '💡', color: 'text-gray-600' };
            return (
              <div
                key={i}
                className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedIssue(expandedIssue === i ? null : i)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <span className={`${meta.color} text-sm`}>{meta.icon}</span>
                  <span className="flex-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                    {issue.title}
                  </span>
                  <span className="text-[10px] text-gray-400">{issue.line ? `L${issue.line}` : ''}</span>
                  <svg
                    className={`w-3 h-3 text-gray-400 transition-transform ${expandedIssue === i ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedIssue === i && (
                  <div className="px-3 pb-3 space-y-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {issue.description}
                    </p>
                    {issue.fix && (
                      <div>
                        <pre className="p-2 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono text-gray-700 dark:text-gray-300 overflow-x-auto max-h-32">
                          <code>{issue.fix}</code>
                        </pre>
                        <button
                          onClick={() => handleApply(issue.fix)}
                          className="mt-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                        >
                          应用修复
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
