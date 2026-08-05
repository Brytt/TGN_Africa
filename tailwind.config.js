/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'midnight-navy': '#30445A',
        'parchment-ivory': '#FFFFFF',
        'heritage-gold': '#C5A059',
        'charcoal-text': '#3C434A',
        'slate-gray': '#69727A',
        'surface-container-low': '#F6F3F2',
        'surface-container': '#F0EDED',
        'surface-container-high': '#EAE7E7',
      },
      fontFamily: {
        display: ['"EB Garamond"', 'Georgia', 'serif'],
        body: ['"EB Garamond"', 'Georgia', 'serif'],
      },
      maxWidth: {
        editorial: '1200px',
      },
      spacing: {
        section: '10rem',
      },
      letterSpacing: {
        editorial: '0.18em',
      },
      transitionDuration: {
        900: '900ms',
      },
    },
  },
  plugins: [],
}
