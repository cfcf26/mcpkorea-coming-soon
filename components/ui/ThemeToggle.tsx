'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;
  
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={`p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-vscode-accent ${className}`}
      aria-label={`현재 테마: ${theme === 'dark' ? '다크' : '라이트'}, 클릭하여 전환`}
    >
      {theme === 'dark' ? (
        <span className="text-yellow-300">🔆</span> // 라이트 모드 아이콘
      ) : (
        <span className="text-gray-700">🌙</span> // 다크 모드 아이콘
      )}
    </button>
  );
};

export default ThemeToggle; 