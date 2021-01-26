/* eslint-disable no-undef */

module.exports = {
  testPathIgnorePatterns: ['node_modules', '\\.cache', '<rootDir>.*/public', '<rootDir>.*/cypress'],
  transformIgnorePatterns: ['node_modules'],
  globals: {
    __PATH_PREFIX__: '',
  },
}
