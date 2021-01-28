module.exports = {
  purge: ['./src/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
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
