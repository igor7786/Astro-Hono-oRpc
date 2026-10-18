/** @type {import("prettier").Config} */
export default {
  plugins: [
    'prettier-plugin-astro',
    'prettier-plugin-classnames',
    'prettier-plugin-merge',
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],

  printWidth: 105,
  proseWrap: 'preserve',
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
  jsxSingleQuote: false,

  // Tailwind (used by prettier-plugin-tailwindcss)
  tailwindStylesheet: './src/styles/global.css',
  tailwindFunctions: ['clsx', 'cn', 'cva'],

  // ✅ Astro-specific:
  astroAllowShorthand: true,
  htmlWhitespaceSensitivity: 'ignore',

  // 👇 better import structure
  importOrder: [
    '<BUILTIN_MODULES>',
    '^bun$',
    '^react$',
    '^react-dom$',
    '^@tanstack/(.*)$',
    '^@acomp/(.*)$',
    '^@rcomp/(.*)$',
    '^astro:(.*)$',
    '^@/(.*)$',
    '^@db/(.*)$',
    '^[./]',
  ],

  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,

  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
