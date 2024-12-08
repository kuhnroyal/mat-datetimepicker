// @ts-check
const tseslint = require('typescript-eslint');
const rootConfig = require('../../eslint.config.js');

module.exports = tseslint.config(
  ...rootConfig,
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'matDatetimepicker',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'mat-datetimepicker',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/prefer-standalone': ['off'],
    },
  },
  {
    files: ['**/*.html'],
    rules: {},
  }
);
