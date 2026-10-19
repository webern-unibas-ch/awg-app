import eslintJs from '@eslint/js';
import angularEslint from 'angular-eslint';
import importPlugin from 'eslint-plugin-import';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import prettierPlugin from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';

const ecmaVersion = 2022;

export default defineConfig(
    // Global ignore
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

    // Global language options
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.vitest,
            },
        },
    },

    // TS config
    eslintJs.configs.recommended,
    ...angularEslint.configs.tsRecommended.map(config => ({
        ...config,
        files: ['**/*.ts'],
    })),
    {
        files: ['**/*.ts'],

        languageOptions: {
            ecmaVersion,
            sourceType: 'module',

            parserOptions: {
                project: ['tsconfig.eslint.json'],
                createDefaultProgram: true,
                projectService: false,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        linterOptions: { reportUnusedDisableDirectives: 'off' },
        processor: angularEslint.processInlineTemplates,

        plugins: {
            import: importPlugin,
            jsdoc: jsdocPlugin,
            '@typescript-eslint': typescriptEslint.plugin,
            '@angular-eslint': angularEslint.tsPlugin,
        },

        rules: {
            '@angular-eslint/component-class-suffix': 'error',
            '@angular-eslint/directive-class-suffix': 'error',
            '@angular-eslint/inject-at-top': 'error',
            '@angular-eslint/no-input-rename': 'error',
            '@angular-eslint/no-inputs-metadata-property': 'error',
            '@angular-eslint/no-output-on-prefix': 'error',
            '@angular-eslint/no-output-rename': 'error',
            '@angular-eslint/no-outputs-metadata-property': 'error',
            '@angular-eslint/no-uncalled-signals': 'error',
            '@angular-eslint/prefer-output-readonly': 'error',
            '@angular-eslint/prefer-signals': 'error',
            '@angular-eslint/prefer-standalone': 'off',
            '@angular-eslint/sort-lifecycle-methods': 'error',
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
            // Class layout: fields (inject → input/model → output → queries → state) → constructor → accessors → methods
            '@typescript-eslint/member-ordering': [
                'error',
                {
                    default: {
                        memberTypes: [
                            'signature',
                            'call-signature',
                            'static-field',
                            'static-initialization',
                            ['static-get', 'static-set'],
                            'field',
                            'constructor',
                            ['get', 'set'],
                            'static-method',
                            'public-method',
                            'protected-method',
                            'private-method',
                            '#private-method',
                        ],
                    },
                },
            ],
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: ['default'],
                    format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
                    leadingUnderscore: 'allow',
                    trailingUnderscore: 'allow',
                },
                {
                    selector: 'classProperty',
                    format: ['camelCase'],
                },
                {
                    selector: 'classProperty',
                    modifiers: ['protected'],
                    format: ['camelCase'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'classProperty',
                    modifiers: ['static', 'readonly'],
                    format: ['UPPER_CASE'],
                },
                {
                    selector: 'classicAccessor',
                    modifiers: ['static'],
                    format: ['UPPER_CASE'],
                },
                {
                    selector: ['classProperty', 'classMethod'],
                    modifiers: ['private'],
                    format: ['camelCase'],
                    leadingUnderscore: 'require',
                },
                {
                    selector: 'classProperty',
                    modifiers: ['private', 'static', 'readonly'],
                    format: ['UPPER_CASE'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'objectLiteralProperty',
                    format: ['camelCase', 'UPPER_CASE', 'snake_case'],
                    leadingUnderscore: 'allow',
                    trailingUnderscore: 'allow',
                },
                {
                    selector: 'objectLiteralProperty',
                    modifiers: ['requiresQuotes'],
                    format: null,
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
            'jsdoc/sort-tags': 'error',
            'jsdoc/tag-lines': ['error', 'never', { startLines: 1 }],
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
            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        { name: 'rxjs/Rx' },
                        ...['data', 'models', 'services'].map(barrel => ({
                            name: `@awg-views/edition-view/${barrel}`,
                            message: 'Import from the concrete file instead of the barrel.',
                        })),
                    ],
                },
            ],
            'no-restricted-syntax': [
                'error',
                {
                    selector: "PropertyDefinition :not(PropertyDefinition) > CallExpression[callee.name='inject']",
                    message: 'Inject as a separate field at the top of the class.',
                },
            ],
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

    // JS config
    {
        files: ['**/*.js'],

        languageOptions: {
            ecmaVersion,
            sourceType: 'module',
        },
    },

    // HTML config
    ...angularEslint.configs.templateRecommended.map(config => ({
        ...config,
        files: ['**/*.html'],
    })),
    ...angularEslint.configs.templateAccessibility.map(config => ({
        ...config,
        files: ['**/*.html'],
    })),
    {
        files: ['**/*.html'],
        ignores: ['**/*inline-template-*.component.html'],
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            '@angular-eslint/template/prefer-self-closing-tags': 'error',
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
