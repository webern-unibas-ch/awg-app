import eslintJs from '@eslint/js';
import angularEslint from 'angular-eslint';
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
    ...[...typescriptEslint.configs.strictTypeChecked, ...typescriptEslint.configs.stylisticTypeChecked].map(
        config => ({
            ...config,
            files: ['**/*.ts'],
        })
    ),
    {
        files: ['**/*.ts'],

        languageOptions: {
            ecmaVersion,
            sourceType: 'module',

            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        linterOptions: { reportUnusedDisableDirectives: 'error' },
        processor: angularEslint.processInlineTemplates,

        plugins: {
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
            '@angular-eslint/sort-lifecycle-methods': 'error',
            '@angular-eslint/use-lifecycle-interface': 'error',
            '@angular-eslint/use-pipe-transform-interface': 'error',
            '@typescript-eslint/consistent-type-definitions': 'error',
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
            '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
            '@typescript-eslint/no-deprecated': 'warn',
            '@typescript-eslint/no-inferrable-types': [
                'error',
                {
                    ignoreParameters: true,
                },
            ],
            '@typescript-eslint/no-misused-new': 'error',
            '@typescript-eslint/no-non-null-assertion': 'error',
            // Conflicts with no-non-null-assertion (it would turn assertions into `!`)
            '@typescript-eslint/non-nullable-type-assertion-style': 'off',
            '@typescript-eslint/no-shadow': [
                'error',
                {
                    hoist: 'all',
                },
            ],
            // Defensive checks are deliberate: the edition data is unvalidated static JSON despite non-nullable types
            '@typescript-eslint/no-unnecessary-condition': 'off',
            '@typescript-eslint/no-unused-expressions': 'error',
            '@typescript-eslint/no-use-before-define': 'error',
            '@typescript-eslint/prefer-function-type': 'error',
            // Strict preset options, but numbers are allowed in template literals
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                {
                    allowAny: false,
                    allowBoolean: false,
                    allowNever: false,
                    allowNullish: false,
                    allowNumber: true,
                    allowRegExp: false,
                },
            ],
            '@typescript-eslint/unified-signatures': 'error',
            'arrow-body-style': 'error',
            'capitalized-comments': [
                'error',
                'always',
                {
                    ignorePattern: 'console',
                },
            ],
            'constructor-super': 'error',
            curly: 'error',
            eqeqeq: ['error', 'smart'],
            'guard-for-in': 'error',
            'jsdoc/sort-tags': 'error',
            'jsdoc/tag-lines': ['error', 'never', { startLines: 1 }],
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
            'no-undef-init': 'error',
            'no-unused-labels': 'error',
            'no-var': 'error',
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

    // TODO(lint-audit): transitional warnings for preset rules that still have findings;
    // each entry is removed together with the commit that fixes its findings
    {
        files: ['**/*.ts'],
        rules: {
            '@typescript-eslint/adjacent-overload-signatures': 'warn',
            '@typescript-eslint/no-empty-object-type': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-extraneous-class': 'warn',
            '@typescript-eslint/no-implied-eval': 'warn',
            '@typescript-eslint/no-misused-spread': 'warn',
            '@typescript-eslint/no-unsafe-argument': 'warn',
            '@typescript-eslint/no-unsafe-assignment': 'warn',
            '@typescript-eslint/no-unsafe-call': 'warn',
            '@typescript-eslint/no-unsafe-function-type': 'warn',
            '@typescript-eslint/no-unsafe-member-access': 'warn',
            '@typescript-eslint/no-unsafe-return': 'warn',
            '@typescript-eslint/prefer-promise-reject-errors': 'warn',
            '@typescript-eslint/related-getter-setter-pairs': 'warn',
            '@typescript-eslint/unbound-method': 'warn',
        },
    },

    // Specs and test helpers: test doubles are loosely typed, mock data is copied by spread,
    // and methods are referenced unbound in expectations
    {
        files: ['**/*.spec.ts', 'src/testing/**/*.ts'],
        rules: {
            // Bracket access to private and protected members is the test convention (`component['_method']`)
            '@typescript-eslint/dot-notation': [
                'error',
                { allowPrivateClassPropertyAccess: true, allowProtectedClassPropertyAccess: true },
            ],
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-misused-spread': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/unbound-method': 'off',
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
