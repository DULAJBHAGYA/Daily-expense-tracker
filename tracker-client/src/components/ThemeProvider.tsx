"use client";
import React, { useEffect, useState } from 'react';
import { useThemeStore } from '@/utils/theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const body = document.body;
    
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Also handle body background
    if (theme === 'dark') {
      body.classList.remove('bg-gray-50');
      body.classList.add('bg-gray-900');
    } else {
      body.classList.remove('bg-gray-900');
      body.classList.add('bg-gray-50');
    }
  }, [theme]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}; 