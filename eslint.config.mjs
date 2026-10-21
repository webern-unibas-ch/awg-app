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
            // Angular rules on top of the recommended preset, listed one by one. Not adopted:
            // prefer-service-decorator (an API migration), no-input-prefix (no input prefixes to forbid),
            // require-localize-metadata and runtime-localize (single-language app)

            '@angular-eslint/component-class-suffix': 'error',
            '@angular-eslint/component-max-inline-declarations': 'error',
            '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'awg', style: 'kebab-case' }],
            '@angular-eslint/computed-must-return': 'error',
            '@angular-eslint/consistent-component-styles': 'error',
            '@angular-eslint/contextual-decorator': 'error',
            '@angular-eslint/directive-class-suffix': 'error',
            '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'awg', style: 'camelCase' }],
            '@angular-eslint/inject-at-top': 'error',
            '@angular-eslint/no-async-lifecycle-method': 'error',
            '@angular-eslint/no-attribute-decorator': 'error',
            // Experimental and developer preview APIs need a disable comment with a reason
            '@angular-eslint/no-developer-preview': 'error',
            '@angular-eslint/no-duplicates-in-metadata-arrays': 'error',
            '@angular-eslint/no-experimental': 'error',
            '@angular-eslint/no-forward-ref': 'error',
            '@angular-eslint/no-implicit-take-until-destroyed': 'error',
            '@angular-eslint/no-input-rename': 'error',
            '@angular-eslint/no-inputs-metadata-property': 'error',
            '@angular-eslint/no-lifecycle-call': 'error',
            '@angular-eslint/no-output-on-prefix': 'error',
            '@angular-eslint/no-output-rename': 'error',
            '@angular-eslint/no-outputs-metadata-property': 'error',
            '@angular-eslint/no-pipe-impure': 'error',
            '@angular-eslint/no-queries-metadata-property': 'error',
            '@angular-eslint/no-uncalled-signals': 'error',
            '@angular-eslint/pipe-prefix': ['error', { prefixes: ['awg'] }],
            '@angular-eslint/prefer-host-metadata-property': 'error',
            '@angular-eslint/prefer-output-emitter-ref': 'error',
            '@angular-eslint/prefer-output-readonly': 'error',
            '@angular-eslint/prefer-signal-model': 'error',
            '@angular-eslint/prefer-signals': 'error',
            '@angular-eslint/reactive-context-must-read-signal': 'error',
            '@angular-eslint/relative-url-prefix': 'error',
            '@angular-eslint/require-lifecycle-on-prototype': 'error',
            // Decorator keys: identity → view → host → behaviour → dependencies
            '@angular-eslint/sort-keys-in-type-decorator': [
                'error',
                {
                    Component: [
                        'selector',
                        'exportAs',
                        'template',
                        'templateUrl',
                        'styleUrl',
                        'styleUrls',
                        'styles',
                        'hostDirectives',
                        'host',
                        'encapsulation',
                        'changeDetection',
                        'providers',
                        'viewProviders',
                        'imports',
                    ],
                    Directive: ['selector', 'exportAs', 'hostDirectives', 'host', 'providers'],
                },
            ],
            '@angular-eslint/sort-lifecycle-methods': 'error',
            '@angular-eslint/use-component-selector': 'error',
            '@angular-eslint/use-component-view-encapsulation': 'error',
            '@angular-eslint/use-injectable-provided-in': 'error',
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
            // Angular decorators need a class, even if it is empty (e.g., routing shells or test hosts)
            '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
            '@typescript-eslint/no-inferrable-types': [
                'error',
                {
                    ignoreParameters: true,
                },
            ],
            '@typescript-eslint/no-misused-new': 'error',
            // Data classes without methods (JSON shapes): spread copies are intended
            '@typescript-eslint/no-misused-spread': [
                'error',
                { allow: [{ from: 'file', name: ['GraphQuery', 'IntroList', 'Textcritics'] }] },
            ],
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

    // Specs and test helpers: test doubles are loosely typed, mock data is copied by spread,
    // and methods are referenced unbound in expectations
    {
        files: ['**/*.spec.ts', 'src/testing/**/*.ts'],
        rules: {
            // Test hosts are declared inline and without a selector
            '@angular-eslint/component-max-inline-declarations': 'off',
            '@angular-eslint/use-component-selector': 'off',
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
            // Test doubles pass on rejection values of mocked APIs unchanged (typed unknown)
            '@typescript-eslint/prefer-promise-reject-errors': ['error', { allowThrowingUnknown: true }],
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
        rules: {
            // Template rules on top of the recommended presets, listed one by one. Not adopted:
            // no-call-expression (signals are called in templates), i18n (single-language app),
            // attributes-order (it sorts by binding kind only, see the template attribute convention in CLAUDE.md),
            // prefer-ngsrc (NgOptimizedImage needs explicit image sizes), use-track-by-function (`@for` requires `track`)

            // NgbAccordionButton sets `type="button"` as a host attribute
            '@angular-eslint/template/button-has-type': ['error', { ignoreWithDirectives: ['ngbAccordionButton'] }],
            '@angular-eslint/template/conditional-complexity': 'error',
            // Data-driven templates branch on optional fields; the limit guards against further growth
            '@angular-eslint/template/cyclomatic-complexity': ['error', { maxComplexity: 10 }],
            '@angular-eslint/template/no-any': 'error',
            // Static `class` next to `[class]` is merged by Angular
            '@angular-eslint/template/no-duplicate-attributes': ['error', { allowStylePrecedenceDuplicates: true }],
            '@angular-eslint/template/no-empty-control-flow': 'error',
            // Style bindings with computed values are allowed
            '@angular-eslint/template/no-inline-styles': ['error', { allowBindToStyle: 'dynamic' }],
            '@angular-eslint/template/no-interpolation-in-attributes': 'error',
            '@angular-eslint/template/no-nested-tags': 'error',
            '@angular-eslint/template/no-non-null-assertion': 'error',
            '@angular-eslint/template/no-outerhtml': 'error',
            '@angular-eslint/template/no-positive-tabindex': 'error',
            '@angular-eslint/template/prefer-at-else': 'error',
            '@angular-eslint/template/prefer-at-empty': 'error',
            '@angular-eslint/template/prefer-built-in-pipes': 'error',
            '@angular-eslint/template/prefer-class-binding': 'error',
            '@angular-eslint/template/prefer-contextual-for-variables': 'error',
            '@angular-eslint/template/prefer-static-string-properties': 'error',
            '@angular-eslint/template/prefer-style-binding': 'error',
            '@angular-eslint/template/prefer-template-literal': 'error',
            '@angular-eslint/template/require-switch-default': 'error',
        },
    },
    // Test hosts set layout styles inline, and the loading spinner sets its custom properties before the app starts
    {
        files: ['**/*.spec.ts/**', 'src/index.html'],
        rules: {
            '@angular-eslint/template/no-inline-styles': 'off',
        },
    },
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
