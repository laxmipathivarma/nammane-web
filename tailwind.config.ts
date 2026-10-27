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
        ink: '#0a0908',
        ink2: '#15110b',
        card: '#201a12',
        gold: {
          light: '#ead9ae',
          DEFAULT: '#cda858',
          dark: '#8a661f',
          text: '#d9bd7a',
        },
        muted: '#b8ab98',
        muted2: '#9c8f78',
        felt: '#1e6e4a',
        ruby: '#b23a4a',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
