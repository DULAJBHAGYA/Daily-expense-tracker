import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
    }
  )
);

export const getThemeColors = (theme: Theme) => {
  if (theme === 'dark') {
    return {
      bg: 'bg-gray-900',
      bgSecondary: 'bg-gray-800',
      bgCard: 'bg-gray-700',
      text: 'text-gray-100',
      textSecondary: 'text-gray-300',
      border: 'border-gray-600',
      hover: 'hover:bg-gray-600',
      shadow: 'shadow-gray-900',
    };
  }
  return {
    bg: 'bg-gray-50',
    bgSecondary: 'bg-white',
    bgCard: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-200',
    hover: 'hover:bg-gray-50',
    shadow: 'shadow-gray-200',
  };
}; 