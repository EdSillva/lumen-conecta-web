// eslint.config.mjs
import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfigWithVueTs(
  {
    ignores: ['**/dist/**', '**/.output/**', '**/.nuxt/**', '**/.vite/**', '**/coverage/**'],
  },
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-console': 'off', // Allow console.log in TypeScript files
      'vue/html-self-closing': 'off',
    },
  },
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommendedTypeChecked,
)
