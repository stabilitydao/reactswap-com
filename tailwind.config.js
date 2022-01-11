const colors = require('tailwindcss/colors')
// import colors from 'tailiwind/colors'
module.exports = {
  darkMode: 'class',
  content: [
    './src/components/**/*.{ts,tsx,js,jsx}',
    './src/pages/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    colors: {
      darkblue: "#1A0296",
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      teal: colors.teal,
      indigo: colors.indigo,
      blue: colors.blue,
      green: colors.green,
      red: colors.rose,
      yellow: colors.amber,
      stone: colors.stone,
      neutral: colors.neutral,
      gray: colors.gray,
      zinc: colors.zinc,
      slate: colors.slate,
      slate: colors.slate,
      cyan: colors.cyan,
      pink: colors.pink,
    },
    extend: {
      fontFamily: {
        Roboto: ['Roboto'],
      },
    },
  },
  variants: {},
  plugins: [],
}
