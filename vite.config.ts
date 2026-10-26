import { defineConfig } from 'vite-plus';

const TAILWIND_CSS = 'src/styles/global.css'; // ← your real Tailwind entry CSS

export default defineConfig({
  lint: {
    ignorePatterns: ['dist/**', '.astro/**', 'src/components/reactcomp/ui'],
    jsPlugins: ['oxlint-tailwindcss'],
    settings: {
      tailwindcss: { entryPoint: TAILWIND_CSS },
    },
    plugins: ['typescript', 'unicorn', 'oxc', 'import', 'jsx-a11y'],
    rules: {
      'tailwindcss/no-unknown-classes': 'warn',
      'tailwindcss/no-duplicate-classes': 'warn',
      'tailwindcss/no-conflicting-classes': 'warn',
      'tailwindcss/no-deprecated-classes': 'warn',
      'tailwindcss/no-unnecessary-whitespace': 'warn',
      'unicorn/prefer-node-protocol': 'warn',
      'import/no-duplicates': 'warn',
    },
    // Later, once the basics are clean:
    options: { typeAware: true, typeCheck: true },
  },

  fmt: {
    printWidth: 105,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
    bracketSpacing: true,
    arrowParens: 'always',
    jsxSingleQuote: false,
    ignorePatterns: ['dist/**', '.astro/**', '**/*.astro', 'src/components/reactcomp/ui'],
    sortPackageJson: false,
    sortImports: {
      customGroups: [
        { groupName: 'bun', elementNamePattern: ['bun'] },
        { groupName: 'react', elementNamePattern: ['react', 'react-dom'] },
        { groupName: 'tanstack', elementNamePattern: ['@tanstack/**'] },
        { groupName: 'ui', elementNamePattern: ['@acomp/**', '@rcomp/**'] },
        { groupName: 'astro', elementNamePattern: ['astro:**'] },
        { groupName: 'app', elementNamePattern: ['@/**'] },
      ],
      groups: [
        'value-builtin',
        'bun',
        'react',
        'tanstack',
        'value-external',
        'ui',
        'astro',
        'app',
        ['value-parent', 'value-sibling', 'value-index'],
        'unknown',
      ],
    },
    sortTailwindcss: {
      stylesheet: TAILWIND_CSS,
      functions: ['clsx', 'cn', 'cva'],
    },
  },
});
