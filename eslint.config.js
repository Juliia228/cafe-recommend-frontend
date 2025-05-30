// eslint.config.js
const js = require('@eslint/js');
const react = require('eslint-plugin-react');
const prettier = require('eslint-config-prettier');

module.exports = [
  js.configs.recommended,
  {
    plugins: {
      react,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-vars': 'error', // Помечает переменные, используемые в JSX
      'no-unused-vars': 'off', // Отключаем стандартное правило
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  prettier,
  {
    ignores: ['node_modules', 'dist', 'build'],
  },
];
