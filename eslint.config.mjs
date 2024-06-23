import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'no-empty': 'warn',
            'no-constant-condition': 'warn',
        },
    },
    {
        ignores: ['deploy-commands.ts, jest.config.js', '**/.*'],
    }
);
