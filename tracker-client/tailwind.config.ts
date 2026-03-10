import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    fontSize: {
      'xs': '0.625rem',    // 10px
      'sm': '0.75rem',     // 12px
      'base': '0.875rem',  // 14px
      'lg': '1rem',        // 16px
      'xl': '1.125rem',    // 18px
      '2xl': '1.25rem',    // 20px
      '3xl': '1.5rem',     // 24px
      '4xl': '1.75rem',    // 28px
      '5xl': '2rem',       // 32px
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        emerald: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#15994e',  // Main green color
          600: '#127a3e',  // Darker shade
          700: '#0f6332',
          800: '#0d4f28',
          900: '#0a3d1f',
        },
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#15994e',  // Main green color
          600: '#127a3e',  // Darker shade
          700: '#0f6332',
          800: '#0d4f28',
          900: '#0a3d1f',
        },
      },
      fontFamily: {
        sans: ["var(--font-figtree)", "Figtree", "sans-serif"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  plugins: [],
};

export default config; 