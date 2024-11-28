import { FlatCompat } from '@eslint/eslintrc';
import eslintJs from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import angularEslint from 'angular-eslint';
import importPlugin from 'eslint-plugin-import';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import globals from 'globals';
import url from 'node:url';
import typescriptEslint from 'typescript-eslint';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

export default typescriptEslint.config(
    {
        plugins: {
            import: importPlugin,
            jsdoc: jsdocPlugin,
            '@typescript-eslint': typescriptEslint.plugin,
            '@angular-eslint': angularEslint.tsPlugin,
        },
    },
    {
        ignores: [
            'projects/**/*',
            '**/.angular/',
            '**/.cache/',
            '**/.github/',
            '**/.idea/',
            '**/.husky/',
            '**/.vscode/',
            '**/.yarn/',
            '**/coverage/',
            '**/dist/',
            '**/node_modules/',
            '**/tmp/',
        ],
    },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jasmine,
            },
        },
    },
    {
        files: ['**/*.js'],

        languageOptions: {
            ecmaVersion: 2015,
            sourceType: 'module',
        },
    },
    // extends ...
    eslintJs.configs.recommended,
    // ...tseslint.configs.recommended,
    // ...angularEslint.configs.tsRecommended,

    // ts config
    {
        files: ['**/*.ts'],

        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2015,
            sourceType: 'module',

            parserOptions: {
                project: ['tsconfig.eslint.json'],
                createDefaultProgram: true,
            },
        },
        linterOptions: { reportUnusedDisableDirectives: 'off' },
        processor: angularEslint.processInlineTemplates,

        rules: {
            '@angular-eslint/component-class-suffix': 'error',
            '@angular-eslint/directive-class-suffix': 'error',
            '@angular-eslint/no-host-metadata-property': 'error',
            '@angular-eslint/no-input-rename': 'error',
            '@angular-eslint/no-inputs-metadata-property': 'error',
            '@angular-eslint/no-output-on-prefix': 'error',
            '@angular-eslint/no-output-rename': 'error',
            '@angular-eslint/no-outputs-metadata-property': 'error',
            '@angular-eslint/use-lifecycle-interface': 'error',
            '@angular-eslint/use-pipe-transform-interface': 'error',
            '@typescript-eslint/consistent-type-definitions': 'error',
            '@typescript-eslint/dot-notation': 'off',
            '@typescript-eslint/explicit-member-accessibility': [
                'off',
                {
                    accessibility: 'explicit',
                },
            ],
            '@typescript-eslint/indent': 'off',
            '@typescript-eslint/member-delimiter-style': [
                'off',
                {
                    multiline: {
                        delimiter: 'semi',
                        requireLast: true,
                    },
                    singleline: {
                        delimiter: 'semi',
                        requireLast: false,
                    },
                },
            ],
            '@typescript-eslint/member-ordering': 'error',
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: ['default'],
                    format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
                    leadingUnderscore: 'allow',
                    trailingUnderscore: 'allow',
                },
                {
                    selector: ['classProperty'],
                    modifiers: ['private', 'readonly'],
                    format: ['camelCase', 'UPPER_CASE'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: ['classProperty', 'classMethod'],
                    modifiers: ['private'],
                    format: ['camelCase'],
                    leadingUnderscore: 'require',
                },
                {
                    selector: ['classProperty'],
                    modifiers: ['readonly'],
                    format: ['UPPER_CASE'],
                    trailingUnderscore: 'allow',
                },
                {
                    selector: 'objectLiteralProperty',
                    format: ['camelCase', 'UPPER_CASE', 'snake_case'],
                    leadingUnderscore: 'allow',
                    trailingUnderscore: 'allow',
                },
            ],
            '@typescript-eslint/no-deprecated': 'warn',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/no-inferrable-types': [
                'error',
                {
                    ignoreParameters: true,
                },
            ],
            '@typescript-eslint/no-misused-new': 'error',
            '@typescript-eslint/no-non-null-assertion': 'error',
            '@typescript-eslint/no-shadow': [
                'error',
                {
                    hoist: 'all',
                },
            ],
            '@typescript-eslint/no-unused-expressions': 'error',
            '@typescript-eslint/no-use-before-define': 'error',
            '@typescript-eslint/prefer-function-type': 'error',
            '@typescript-eslint/quotes': [
                'off',
                'single',
                {
                    avoidEscape: true,
                },
            ],
            '@typescript-eslint/semi': 'off',
            '@typescript-eslint/type-annotation-spacing': 'off',
            '@typescript-eslint/unified-signatures': 'error',
            'arrow-body-style': 'error',
            'brace-style': 'off',
            'capitalized-comments': [
                'error',
                'always',
                {
                    ignorePattern: 'console',
                },
            ],
            'constructor-super': 'error',
            curly: 'error',
            'eol-last': 'off',
            eqeqeq: ['error', 'smart'],
            'guard-for-in': 'error',
            'id-blacklist': 'off',
            'id-match': 'off',
            'import/no-cycle': 'error',
            'import/no-deprecated': 'warn',
            'jsdoc/no-types': 'off',
            'max-len': [
                'off',
                {
                    code: 200,
                },
            ],
            'no-bitwise': 'error',
            'no-caller': 'error',
            'no-console': [
                'warn',
                {
                    allow: [
                        'info',
                        'warn',
                        'error',
                        'dir',
                        'timeLog',
                        'assert',
                        'clear',
                        'count',
                        'countReset',
                        'group',
                        'groupEnd',
                        'table',
                        'dirxml',
                        'groupCollapsed',
                        'Console',
                        'profile',
                        'profileEnd',
                        'timeStamp',
                        'context',
                    ],
                },
            ],
            'no-debugger': 'error',
            'no-empty': 'off',
            'no-eval': 'error',
            'no-fallthrough': 'error',
            'no-new-wrappers': 'error',
            'no-restricted-imports': ['error', 'rxjs/Rx'],
            'no-throw-literal': 'error',
            'no-trailing-spaces': 'off',
            'no-undef-init': 'error',
            'no-underscore-dangle': 'off',
            'no-unused-labels': 'error',
            'no-var': 'error',
            'object-curly-spacing': 'off',
            'prefer-const': 'error',
            radix: 'error',
            'spaced-comment': [
                'error',
                'always',
                {
                    markers: [',/'],
                },
            ],
        },
    },

    // html config
    {
        extends: [angularEslint.configs.templateRecommended, angularEslint.configs.templateAccessibility],
        files: ['**/*.html'],
        rules: {},
    },
    ...compat.extends('plugin:prettier/recommended').map(config => ({
        ...config,
        files: ['**/*.html'],
        ignores: ['**/*inline-template-*.component.html'],
    })),
    {
        files: ['**/*.html'],
        ignores: ['**/*inline-template-*.component.html'],
        rules: {
            'prettier/prettier': [
                'error',
                {
                    parser: 'angular',
                },
                {
                    usePrettierrc: true,
                },
            ],
        },
    }
);
