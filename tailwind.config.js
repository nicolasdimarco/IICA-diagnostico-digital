/** @type {import('tailwindcss').Config} */
const teal = '#009C8F'
const dark = '#083E70'
const light = '#EEEEEE'

// Espejo del override de paleta del HTML legacy: las clases de color
// emerald/blue/amber/rose/orange/slate apuntan a la paleta institucional.
const palette = {
  emerald: { 50: light, 100: light, 200: teal, 300: teal, 400: teal, 500: teal, 600: teal, 700: dark, 800: dark, 900: dark },
  blue:    { 50: light, 100: light, 200: dark, 300: dark, 400: dark, 500: dark, 600: dark, 700: dark, 800: dark, 900: dark },
  amber:   { 50: light, 100: light, 200: teal, 300: teal, 400: teal, 500: teal, 600: teal, 700: dark, 800: dark, 900: dark },
  rose:    { 50: light, 100: light, 200: dark, 300: dark, 400: dark, 500: dark, 600: dark, 700: dark, 800: dark, 900: dark },
  orange:  { 50: light, 100: light, 200: dark, 300: dark, 400: dark, 500: dark, 600: dark, 700: dark, 800: dark, 900: dark },
  slate:   { 50: light, 100: light, 200: dark, 300: dark, 400: dark, 500: dark, 600: dark, 700: dark, 800: dark, 900: dark },
}

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Fira Sans"', 'system-ui', 'sans-serif'] },
      colors: { brand: { teal, dark, light }, ...palette },
    },
  },
  plugins: [],
}
