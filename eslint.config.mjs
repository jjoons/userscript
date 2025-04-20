import pluginJs from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import { globalIgnores } from 'eslint/config'
import globals from 'globals'
import tsEsLint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  { files: ['src/**/*.{ts}'] },
  { languageOptions: { globals: { ...globals.browser } } },
  pluginJs.configs.recommended,
  ...tsEsLint.configs.recommended,
  eslintConfigPrettier,
  globalIgnores(['dist/**/*.js', '{packages,shared}/*/dist/**/*.{js,cjs,mjs}']),
  {
    files: ['src/**/*.ts', '{packages,shared}/*/src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
    },
  },
  {
    files: [
      'src/**/*.{js,mjs,cjs}',
      './*.{js,mjs,cjs}',
      '{packages,shared}/*/src/**/*.{js,mjs,cjs}',
    ],
    rules: {
      'no-unused-vars': 'warn',
    },
  },
]

export default eslintConfig
