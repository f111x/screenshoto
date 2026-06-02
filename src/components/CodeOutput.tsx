'use client';

import { useState, useCallback, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';

interface CodeOutputProps {
  code: string;
  framework: string;
  onCodeChange?: (code: string) => void;
}

const languageMap: Record<string, string> = {
  html: 'html',
  tailwind: 'html',
  react: 'typescript',
  vue: 'html',
};

export default function CodeOutput({ code, framework, onCodeChange }: CodeOutputProps) {
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleEditorMount: OnMount = useCallback((editor) => {
    editorRef.current = editor;
  }, []);

  const handleCopy = useCallback(async () => {
    const text = editorRef.current?.getValue() || code;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  const handleDownload = useCallback(() => {
    const ext = framework === 'react' ? 'tsx' : framework === 'vue' ? 'vue' : 'html';
    const text = editorRef.current?.getValue() || code;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `component.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [code, framework]);

  if (!code) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
        <div className="text-center space-y-2">
          <div className="text-4xl">💻</div>
          <p className="text-sm">生成的代码将显示在这里</p>
        </div>
      </div>
    );
  }

  const language = languageMap[framework] || 'html';
  const lineCount = code.split('\n').length;

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
            {lineCount} 行
          </span>
          {onCodeChange && (
            <span className="text-[10px] text-violet-500 dark:text-violet-400 border border-violet-200 dark:border-violet-700 px-1.5 py-0.5 rounded">
              可编辑
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleDownload}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            ⬇ 下载
          </button>
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-violet-600 text-white hover:bg-violet-700 transition-colors"
          >
            {copied ? '✅ 已复制' : '📋 复制'}
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          defaultLanguage={language}
          language={language}
          value={code}
          onChange={(val) => onCodeChange?.(val || '')}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            wrappingStrategy: 'advanced',
            tabSize: 2,
            automaticLayout: true,
            folding: true,
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            padding: { top: 8 },
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
        />
      </div>
    </div>
  );
}
