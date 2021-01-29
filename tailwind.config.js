const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      blue: colors.blue,
      primary: {
        light: colors.green[500],
        DEFAULT: colors.green[500],
        dark: colors.green[600],
      },
      secondary: {
        light: colors.white,
        DEFAULT: colors.white,
        dark: colors.white,
      },
      blackCell: {
        light: '#b58863',
        DEFAULT: '#b58863',
        dark: '#b58863',
      },
      blackCellHighlight: {
        light: '#81756b',
        DEFAULT: '#81756b',
        dark: '#81756b',
      },
      whiteCell: {
        light: '#f0d9b5',
        DEFAULT: '#f0d9b5',
        dark: '#f0d9b5',
      },
      whiteCellHighlight: {
        light: '#bbb5ab',
        DEFAULT: '#bbb5ab',
        dark: '#bbb5ab',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
