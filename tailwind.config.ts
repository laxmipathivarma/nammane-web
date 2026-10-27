import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#05050f',
        ink2: '#120f26',
        card: '#1a1533',
        gold: {
          light: '#e4d4ff',
          DEFAULT: '#b968ff',
          dark: '#6d1fd1',
          text: '#c9a8ff',
        },
        muted: '#cfc9e6',
        muted2: '#9c93bd',
        felt: '#4cc9f0',
        ruby: '#ff4f9e',
      },
      fontFamily: {
        serif: ['Unbounded', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
