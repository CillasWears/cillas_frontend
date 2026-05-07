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
        'primary-black': '#000000',
        'primary-white': '#FFFFFF',
        'accent-gold': '#B8860B',
        'secondary-grey': '#A9A9A9',
      },
      fontFamily: {
        primary: ['var(--font-cormorant)', 'serif'],
        secondary: ['var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        'h1': ['clamp(48px, 5vw, 64px)', { lineHeight: '1.1', fontWeight: '700' }],
        'h2': ['clamp(32px, 4vw, 40px)', { lineHeight: '1.2', fontWeight: '600' }],
        'h3': ['clamp(24px, 3vw, 28px)', { lineHeight: '1.3', fontWeight: '500' }],
        'body': ['clamp(16px, 1.5vw, 18px)', { lineHeight: '1.6' }],
        'small': ['14px', { lineHeight: '1.5' }],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '40px',
        '2xl': '64px',
        '3xl': '96px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
      },
      maxWidth: {
        'container': '1280px',
      },
      transitionDuration: {
        '150': '150ms',
        '250': '250ms',
        '300': '300ms',
      },
      letterSpacing: {
        'wide': '0.05em',
        'wider': '0.1em',
      },
    },
  },
  plugins: [],
}

export default config