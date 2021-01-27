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
      whiteCell: {
        light: '#f0d9b5',
        DEFAULT: '#f0d9b5',
        dark: '#f0d9b5',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
