module.exports = {
  env: {
    node: true,
    //es6: true,
    browser: true,
  },
  extends: ['eslint:recommended', 'plugin:import/recommended', 'prettier'],
  rules: {
    'import/no-unresolved': 'off',
  },
};
