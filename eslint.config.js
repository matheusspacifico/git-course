// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  // ignora pasta de build
  globalIgnores(['dist', 'build']),

  {
    files: ['**/*.{ts,tsx}'],
    // base configs
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.recommended,                // plugin:react/recommended
      jsxA11y.configs.recommended,              // plugin:jsx-a11y/recommended
      reactHooks.configs['recommended-latest'], // plugin:react-hooks
      reactRefresh.configs.vite,                // vite react fast-refresh
    ],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true }, // garante JSX
      },
    },

    settings: {
      react: { version: 'detect' }, // detecta versão do React
    },

    rules: {
      // suas preferências aqui
      // exemplo: permitir <img> normal (a11y ainda checa alt text)
      // 'jsx-a11y/alt-text': 'warn',
    },

    linterOptions: {
      // bom para limpar disables que não são usados
      reportUnusedDisableDirectives: 'warn',
    },
  },
])
