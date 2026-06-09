const globals = require('globals');

module.exports = [
    {
        languageOptions: {
            ecmaVersion: 2022,
            globals: {
                ...globals.node,
            },
        },
        ignores: ['node_modules/**'],
        rules: {
            'no-console': 'warn',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'no-undef': 'error',
            'no-var': 'error',
            'prefer-const': 'warn',
            'eqeqeq': ['error', 'always'],
        },
    },
];
