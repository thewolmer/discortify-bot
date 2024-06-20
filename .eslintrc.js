const errorLevel = 'error';

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
  ],
  plugins: ['prefer-arrow', '@typescript-eslint', 'import'],
  rules: {
    'arrow-body-style': [errorLevel, 'as-needed'],
    'prefer-destructuring': [errorLevel, { object: true, array: false }],
    'prefer-const': [errorLevel],
    'prefer-rest-params': [errorLevel],
    'import/newline-after-import': ['error'],
    'import/order': [
      errorLevel,
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        pathGroups: [
          { pattern: '@event/**', group: 'internal' },
          { pattern: '@command/**', group: 'internal' },
          { pattern: '@button/**', group: 'internal' },
          { pattern: '@selectMenu/**', group: 'internal' },
          { pattern: '@embed/**', group: 'internal' },
          { pattern: '@modal/**', group: 'internal' },
          { pattern: '@service/**', group: 'internal' },
          { pattern: '@api/**', group: 'internal' },
          { pattern: '@app/**', group: 'internal' },
          { pattern: '@util/**', group: 'internal' },
          { pattern: '@interface/**', group: 'internal' },
        ],
        'newlines-between': 'always',
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/first': 'error',
    'import/no-duplicates': 'error',
    'sort-imports': [
      errorLevel,
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],
  },
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.d.ts'],
    },
  },
};
