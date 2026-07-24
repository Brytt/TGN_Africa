import js from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  { ignores: ['dist', '.next'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      '@next/next': nextPlugin,
      'react-hooks': reactHooks,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...reactHooks.configs.recommended.rules,
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-img-element': 'off',
      '@next/next/no-page-custom-font': 'off',
      'no-unused-vars': ['error', { varsIgnorePattern: '^(motion|[A-Z_])' }],
    },
  },
]
