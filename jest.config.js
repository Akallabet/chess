/* eslint-disable no-undef */

module.exports = {
  moduleNameMapper: {
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/file-mock.js',
    '.+\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
  },
  testPathIgnorePatterns: ['node_modules', '\\.cache', '<rootDir>.*/public', '<rootDir>.*/cypress'],
  transformIgnorePatterns: ['node_modules'],
  setupFilesAfterEnv: ['<rootDir>/setup-tests.js'],
  globals: {
    __PATH_PREFIX__: '',
  },
}
