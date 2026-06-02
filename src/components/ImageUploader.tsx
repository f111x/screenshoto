'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
  onImageReady: (dataUrl: string, file: File) => void;
  disabled?: boolean;
}

export default function ImageUploader({ onImageReady, disabled }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setPreview(dataUrl);
        onImageReady(dataUrl, file);
      };
      reader.readAsDataURL(file);
    },
    [onImageReady]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled,
  });

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (!file) continue;
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result as string;
            setPreview(dataUrl);
            onImageReady(dataUrl, file);
          };
          reader.readAsDataURL(file);
          break;
        }
      }
    },
    [onImageReady]
  );

  return (
    <div onPaste={handlePaste} className="h-full flex flex-col">
      <div
        {...getRootProps()}
        className={`
          flex-1 flex flex-col items-center justify-center rounded-xl border-2 border-dashed
          transition-all duration-200 cursor-pointer p-8 text-center
          ${isDragActive
            ? 'border-violet-500 bg-violet-50/50 dark:bg-violet-950/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-violet-400 dark:hover:border-violet-500'
          }
          ${preview ? 'border-solid' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={preview}
              alt="Screenshot preview"
              className="max-w-full max-h-full rounded-lg object-contain shadow-md"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
              <span className="text-white bg-black/60 px-4 py-2 rounded-lg opacity-0 hover:opacity-100 transition-opacity text-sm">
                点击重新上传
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
                {isDragActive ? '松开上传截图' : '拖拽截图到此处'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                或点击选择文件 · 支持 PNG / JPG / WebP
              </p>
            </div>
            <div className="flex items-center gap-2 justify-center text-xs text-gray-400 dark:text-gray-500">
              <span>📋 也支持 Ctrl+V 粘贴截图</span>
            </div>
            <div className="text-[10px] text-gray-400 dark:text-gray-500">
              最大 10MB · 图片不会被保存到服务器
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
