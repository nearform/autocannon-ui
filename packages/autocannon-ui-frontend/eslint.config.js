import js from '@eslint/js'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import { importX } from 'eslint-plugin-import-x'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  {
    ignores: ['node_modules/**', 'dist/**']
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true }
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        TextDecoderStream: 'readonly'
      }
    },
    settings: {
      // 'detect' calls context.getFilename(), which was removed in ESLint 10
      // and crashes eslint-plugin-react 7.x. Keep in sync with the react dep.
      react: { version: '19.2' },
      'import-x/resolver': {
        node: { extensions: ['.js', '.jsx'] }
      }
    }
  },
  reactPlugin.configs.flat.recommended,
  reactHooksPlugin.configs.flat.recommended,
  importX.flatConfigs.recommended,
  prettier
]
