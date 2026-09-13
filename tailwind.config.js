/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#f7faf7',
        'surface-dim': '#d8dbd8',
        'surface-bright': '#f7faf7',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f1f4f1',
        'surface-container': '#ecefeb',
        'surface-container-high': '#eae6de',
        'surface-container-highest': '#e0e3e0',
        'on-surface': '#181c1b',
        'on-surface-variant': '#414942',
        'inverse-surface': '#2d312f',
        'inverse-on-surface': '#eef1ee',
        outline: '#717971',
        'outline-variant': '#c1c9bf',
        'surface-tint': '#376847',
        primary: {
          DEFAULT: '#316342',
          container: '#78a886',
          'on-container': '#e1ffe5',
          fixed: '#b9efc5',
          'fixed-dim': '#9dd3aa',
        },
        'on-primary': '#ffffff',
        secondary: {
          DEFAULT: '#655d52',
          container: '#e9ded0',
          'on-container': '#696156',
        },
        'on-secondary': '#ffffff',
        tertiary: {
          DEFAULT: '#6a572b',
          container: '#846f41',
          'on-container': '#fff6ec',
        },
        'on-tertiary': '#ffffff',
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
          'on-container': '#93000a',
        },
        'on-error': '#ffffff',
        'surface-warm': '#faf6f0',
        'success-green': '#4a7c59',
        'error-red': '#b83230',
      },
      fontFamily: {
        display: ['Literata', 'serif'],
        sans: ['"Nunito Sans"', 'sans-serif'],
      },
      borderRadius: {
        xl: '1.5rem',
        '2xl': '2rem',
      },
    },
  },
  plugins: [],
}
