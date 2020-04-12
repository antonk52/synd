module.exports = {
    root: true,
    extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier/@typescript-eslint',
    ],
    plugins: ['@typescript-eslint', 'prettier'],
    parser: '@typescript-eslint/parser',
    rules: {
        '@typescript-eslint/no-var-requires': 0,
    },
    overrides: [
        {
            files: ['*.spec.ts', '*.spec.js'],
            rules: {
                'global-require': 'off',
            },
        },
    ],
};
