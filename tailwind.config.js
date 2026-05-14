/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          primary: '#2D6A4F',
          light: '#52B788',
          dark: '#1B4332',
        },
        amber: {
          accent: '#F4A261',
          light: '#FFEDD5',
          dark: '#E76F51',
        },
        bg: {
          light: '#FAFAF7',
          card: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
