import js from '@eslint/js'
import babelParser from '@babel/eslint-parser'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import importPlugin from 'eslint-plugin-import'
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
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react']
        },
        ecmaVersion: 2021,
        sourceType: 'module'
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        TextDecoderStream: 'readonly'
      }
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        node: { extensions: ['.js', '.jsx'] }
      }
    }
  },
  reactPlugin.configs.flat.recommended,
  reactHooksPlugin.configs.flat.recommended,
  importPlugin.flatConfigs.recommended,
  prettier,
  {
    // vite 8 and @vitejs/plugin-react 6 expose only an "exports" map with no
    // "main", which eslint-plugin-import's legacy node resolver cannot follow.
    files: ['vite.config.js'],
    rules: {
      'import/no-unresolved': 'off'
    }
  }
]