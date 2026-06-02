'use client';

import type { Framework } from '@/types';

interface FrameworkSelectorProps {
  selected: Framework;
  onChange: (framework: Framework) => void;
  disabled?: boolean;
}

const frameworks: { value: Framework; label: string; icon: string }[] = [
  { value: 'html', label: 'HTML', icon: '🌐' },
  { value: 'tailwind', label: 'Tailwind', icon: '🎨' },
  { value: 'react', label: 'React', icon: '⚛️' },
  { value: 'vue', label: 'Vue', icon: '💚' },
];

export default function FrameworkSelector({ selected, onChange, disabled }: FrameworkSelectorProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-1">输出框架:</span>
      {frameworks.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          disabled={disabled}
          className={`
            px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150
            ${selected === value
              ? 'bg-violet-600 text-white shadow-sm ring-1 ring-violet-500'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {icon} {label}
        </button>
      ))}
    </div>
  );
}
