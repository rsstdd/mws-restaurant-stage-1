const ERROR = 'ERROR';
const WARN = 'WARN';
const OFF = 'OFF';

// eslint in javascript format so that we can have comments
module.exports = {
  plugins: ['prettier', 'jsx-a11y'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
  },
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  extends: ['eslint:recommended', 'prettier', 'plugin:jsx-a11y/recommended'],
  rules: {
    'prettier/prettier': 'error',
    quotes: ['error', 'single'],
  },
};
