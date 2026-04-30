//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  {
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'public/**/*.js',
      'scripts/**/*.js',
      'server-entry.js',
      'eslint.config.js',
      'prettier.config.js',
      'vite.config.ts',
    ],
  },
  ...tanstackConfig,
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/consistent-type-specifier-style': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/require-await': 'off',
      'import/consistent-type-specifier-style': 'off',
      'import/first': 'off',
      'import/newline-after-import': 'off',
      'import/order': 'off',
      'no-constant-condition': 'off',
      'no-control-regex': 'off',
      'no-duplicate-case': 'off',
      'no-irregular-whitespace': 'off',
      'no-useless-escape': 'off',
      'prefer-const': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'sort-imports': 'off',
    },
  },
]
