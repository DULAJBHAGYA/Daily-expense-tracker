"use client";
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/utils/theme';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-300 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-300 dark:text-gray-900" />
      ) : (
        <Sun className="w-5 h-5 text-gray-300" />
      )}
    </button>
  );
};

export default ThemeToggle; 