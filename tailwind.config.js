import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      screens: { m: { max: '879.98px' }, t: { min: '880px', max: '1439.98px' }, d: '880px' },
      fontFamily: {
        favorit: ['"ABC Favorit Light"', '"ABC Favorit Light Placeholder"', 'sans-serif'],
        inter: ['Inter', '"Inter Placeholder"', 'sans-serif'],
        plex: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        black: '#000000',
        band: '#080808',
        offwhite: '#fafafa',
        chip: '#f5f5f5',
        ink: { DEFAULT: '#171719', 900: '#141414', 700: '#393939', 600: '#494949', 500: '#4a4a4a', 400: '#6e6e6e', 300: '#777777' },
        accent: '#fc762f',
        card: '#141414',
      },
      borderRadius: { pill: '50px', card: '10.37px' },
    },
  },
  plugins: [
    // Footer-scoped layout variants: the footer sets data-fmode from per-route breakpoints (see Footer.jsx).
    plugin(({ addVariant }) => {
      addVariant('fm', ':where([data-fmode="m"]) &')
      addVariant('ft', ':where([data-fmode="t"]) &')
    }),
  ],
}
