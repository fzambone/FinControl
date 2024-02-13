module.exports = {
    root: true,
    env: {
      node: true,
    },
    extends: [
      'plugin:vue/vue3-recommended', // Use the recommended rules from the Vue.js eslint plugin
      'eslint:recommended', // Use the recommended rules from ESLint
      '@vue/typescript/recommended', // Use the recommended rules from the @vue/eslint-config-typescript
      'plugin:@typescript-eslint/recommended', // Use the recommended rules from the @typescript-eslint/eslint-plugin
    ],
    parserOptions: {
      ecmaVersion: 2020,
    },
    rules: {
      // Override/add rules settings here, such as:
      'vue/multi-word-component-names': 'off', // If you don't want to enforce multi-word component names
      '@typescript-eslint/explicit-module-boundary-types': 'off', // If you don't want to enforce returning types from functions
      '@typescript-eslint/no-explicit-any': 'warn', // Warn against usage of the `any` type
      'vue/no-unused-vars': 'warn', // Warn on unused variables in Vue templates
      'vue/no-unused-components': 'warn', // Warn on unused components
      'semi': ['error', 'never'], // Disallow semicolons as the terminator for statements
      '@typescript-eslint/semi': ['error', 'never'], // Disallow semicolons in Typescript files
      // ... more rules
    },
  };
  