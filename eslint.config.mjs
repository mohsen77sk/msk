import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: 'scope:sahebzaman-app',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:sahebzaman'],
            },
            {
              sourceTag: 'scope:mirza-app',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:mirza'],
            },
            {
              sourceTag: 'scope:docs-app',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:docs'],
            },
            {
              sourceTag: 'scope:sahebzaman',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:sahebzaman'],
            },
            {
              sourceTag: 'scope:mirza',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:mirza'],
            },
            {
              sourceTag: 'scope:docs',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:docs'],
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts', '**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
    // Override or add rules here
    rules: {},
  },
];
