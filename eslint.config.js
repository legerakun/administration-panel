import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import { defineConfig } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';

export default defineConfig([
  tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: {
      js,
      prettier: eslintPluginPrettier,
      react,
      import: importPlugin,
      'react-hooks': reactHooks
    },
    ignores: [
      'node_modules/*',
      'dist/*',
      'build/*',
      'scripts/*',
      'vite.config.ts',
      'tsconfig.node.json',
      'tsconfig.json',
      'babel.config.cjs',
      'jest.config.cjs'
    ],
    languageOptions: {
      globals: { ...globals.browser, Swiper: 'readonly' },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      ecmaVersion: 'latest'
    },
    settings: {
      react: {
        version: 'detect'
      },
      'import/resolver': {
        node: {
          paths: ['src'],
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs']
        }
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.flat.recommended.rules,
      ...prettier.rules,
      ...reactHooks.configs.recommended.rules,
      eqeqeq: ['error', 'always'],
      indent: [
        'warn',
        2,
        {
          SwitchCase: 1
        }
      ],
      quotes: [
        'warn',
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: true
        }
      ],
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-curly-newline': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/camelcase': 'off',
      'react/prop-types': 'off',
      'react/jsx-props-no-spreading': 0,
      'react/jsx-one-expression-per-line': 'off',
      'react/jsx-uses-react': 'off',
      'import/no-cycle': ['error', { maxDepth: 1 }],
      'no-unused-vars': 'off',
      'max-len': [
        'warn',
        {
          code: 120,
          ignoreStrings: true,
          ignoreTemplateLiterals: true
        }
      ],
      'no-multiple-empty-lines': ['warn', { max: 1 }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',
      'prefer-arrow-callback': 'warn',
      'no-var': 'error',
      'no-undef': 'off',
      'prefer-spread': 'off',
      'prefer-rest-params': 'off',
      'prefer-template': 'error',
      'func-names': ['warn', 'as-needed'],
      'arrow-body-style': ['warn', 'as-needed']
    }
  }
]);
