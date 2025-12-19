/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // TrueLife colors
        'truelife-lavender': '#DFDAEE',
        'truelife-wine': '#462A3F',
        'truelife-mauve': '#BFA2CD',
        // LAMAX colors
        'lamax-turquoise': '#00B9B4',
        'lamax-charcoal': '#0E1716',
        // Lauben colors
        'lauben-orange': '#FF9509',
        'lauben-brown': '#281414',
      },
    },
  },
  plugins: [],
}
