module.exports = {
    env: {
        commonjs: true,
        es6: true,
        node: true,
    },
    plugins: ['jest', 'prettier'],
    extends: ['airbnb-base', 'plugin:prettier/recommended'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    env: {
        'jest/globals': true,
    },
    parserOptions: {
        ecmaVersion: 2018,
    },
    rules: {
        'prettier/prettier': 'error',
    },
    overrides: [
        {
            files: ['*.spec.js'],
            rules: {
                'global-require': 'off',
            },
        },
    ],
};
