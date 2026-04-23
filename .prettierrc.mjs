/** @type {import("prettier").Config} */
export default {
  plugins: [
    'prettier-plugin-astro',
    'prettier-plugin-classnames',
    'prettier-plugin-merge',
    'prettier-plugin-tailwindcss',
    '@trivago/prettier-plugin-sort-imports',
  ],

  printWidth: 105,
  proseWrap: 'always',
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
  jsxSingleQuote: false,

  // 👇 better import structure
  importOrder: [
    '<BUILTIN_MODULES>',

    // React ecosystem (UI state + query libs)
    '^react$',
    '^react-dom$',
    '^@tanstack/(.*)$',

    // UI libraries (ALL component systems)
    '^@acomp/(.*)$',
    '^@rcomp/(.*)$',

    // Astro
    '^astro:(.*)$',

    // App code (everything internal)
    '^@/(.*)$',

    // Relative imports last
    '^[./]',
  ],

  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,

  overrides: [
    {
      files: '*.astro',
      options: { parser: 'astro' },
    },
  ],
};
