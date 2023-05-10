module.exports = {
  env: {
    node: true,
    //es6: true,
    browser: true,
  },
  parserOptions: {
    sourceType: "module",
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  root: true,
  plugins: ['@typescript-eslint'],
  rules: {
    'import/no-unresolved': 'off',
    "import/extensions": [2, "always", { ignorePackages: true }], // This is required for proper ESM use
    "@typescript-eslint/no-non-null-assertion": 0,
  },
};
