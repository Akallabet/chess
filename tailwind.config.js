/* eslint-disable no-undef */

module.exports = {
  purge: ['./src/**/*.js'],
  darkMode: false,
  theme: {
    colors: {
      primary: {
        light: '#f0d9b5',
        DEFAULT: '#f0d9b5',
        dark: '#bbb5ab',
      },
      secondary: {
        light: '#b58863',
        DEFAULT: '#b58863',
        dark: '#81756b',
      },
    },
    extend: {
      maxWidth: {
        452: '452px',
      },
      width: {
        452: '452px',
        '1/8': '12.5%',
      },
      height: {
        452: '452px',
        '1/8': '12.5%',
        'full-w': 'calc(100vw - 1.5rem)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
