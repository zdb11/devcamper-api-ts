module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: 'standard-with-typescript',
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        '@typescript-eslint/semi': 'off',
        semi: 'off',
        '@typescript-eslint/indent': ['error', 4],
        indent: ['error', 4],
        '@typescript-eslint/member-delimiter-style': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/quotes': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off'
    }
};
