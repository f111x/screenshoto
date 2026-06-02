'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { compressImage, generateId } from '@/lib/utils';
import type { Framework } from '@/types';

export interface BatchItem {
  id: string;
  file: File;
  previewUrl: string;
  status: 'pending' | 'compressing' | 'generating' | 'done' | 'error';
  code?: string;
  error?: string;
}

interface BatchUploaderProps {
  framework: Framework;
  onBatchComplete: (results: BatchItem[]) => void;
}

export default function BatchUploader({ framework, onBatchComplete }: BatchUploaderProps) {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [processing, setProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const newItems: BatchItem[] = acceptedFiles.map((file) => ({
      id: generateId(),
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'pending' as const,
    }));

    setItems((prev) => [...prev, ...newItems]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxSize: 10 * 1024 * 1024,
    disabled: processing,
  });

  const handleProcessAll = useCallback(async () => {
    if (processing || items.length === 0) return;
    setProcessing(true);

    const updated = [...items];
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';

    for (let i = 0; i < updated.length; i++) {
      if (updated[i].status === 'done') continue;

      updated[i].status = 'generating';
      updated[i].error = undefined;
      setItems([...updated]);

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: updated[i].previewUrl,
            framework,
          }),
        });

        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || '生成失败');

        updated[i].code = data.code;
        updated[i].status = 'done';
      } catch (err: any) {
        updated[i].error = err.message || '生成失败';
        updated[i].status = 'error';
      }
      setItems([...updated]);
    }

    setProcessing(false);
    onBatchComplete(updated.filter((item) => item.status === 'done'));
  }, [items, framework, processing, onBatchComplete]);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  const stats = {
    total: items.length,
    done: items.filter((i) => i.status === 'done').length,
    error: items.filter((i) => i.status === 'error').length,
    pending: items.filter((i) => i.status === 'pending').length,
  };

  return (
    <div className="space-y-3">
      {/* Upload zone */}
      <div
        {...getRootProps()}
        className={`
          p-4 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all
          ${isDragActive
            ? 'border-violet-500 bg-violet-50/50 dark:bg-violet-950/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-violet-400 dark:hover:border-violet-500'
          }
          ${processing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isDragActive ? '松开上传截图' : '📸 拖拽截图到此处，或点击选择多个文件'}
        </p>
        <p className="text-xs text-gray-400 mt-1">支持 PNG / JPG / WebP · 最大 10MB/个</p>
      </div>

      {/* Stats bar */}
      {items.length > 0 && (
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
          <span>共 {stats.total} 张 · 完成 {stats.done} · 失败 {stats.error}</span>
          {!processing && <button onClick={clearAll} className="text-red-500 hover:underline">清空</button>}
        </div>
      )}

      {/* Item list */}
      {items.length > 0 && (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
            >
              <img
                src={item.previewUrl}
                alt=""
                className="w-12 h-12 rounded object-cover border border-gray-200 dark:border-gray-600 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                  {item.file.name}
                </p>
                <p className="text-[10px] text-gray-400">
                  {(item.file.size / 1024).toFixed(0)} KB
                </p>
              </div>
              <div className="shrink-0">
                {item.status === 'pending' && (
                  <span className="text-xs text-gray-400">等待</span>
                )}
                {item.status === 'generating' && (
                  <svg className="animate-spin w-4 h-4 text-violet-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {item.status === 'done' && (
                  <span className="text-xs text-green-500">✅</span>
                )}
                {item.status === 'error' && (
                  <span className="text-xs text-red-400" title={item.error}>❌</span>
                )}
                {!processing && item.status === 'pending' && (
                  <button onClick={() => removeItem(item.id)} className="text-xs text-gray-400 hover:text-red-500">✕</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Process button */}
      {items.length > 0 && stats.done < items.length && (
        <button
          onClick={handleProcessAll}
          disabled={processing}
          className={`
            w-full py-2.5 rounded-xl font-medium text-sm transition-all
            ${processing
              ? 'bg-violet-400 text-white cursor-wait'
              : 'bg-violet-600 text-white hover:bg-violet-700 active:scale-[0.98]'
            }
          `}
        >
          {processing
            ? `正在生成 (${stats.done + stats.error}/${stats.total})...`
            : `🚀 批量生成 ${stats.pending} 个`}
        </button>
      )}
    </div>
  );
}
