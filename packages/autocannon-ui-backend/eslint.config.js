import js from '@eslint/js'
import { importX } from 'eslint-plugin-import-x'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  {
    ignores: ['node_modules/**', '.test_results/**']
  },
  js.configs.recommended,
  importX.flatConfigs.recommended,
  prettier,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    },
    rules: {
      'import-x/order': [
        'error',
        {
          'newlines-between': 'always'
        }
      ]
    }
  }
]
