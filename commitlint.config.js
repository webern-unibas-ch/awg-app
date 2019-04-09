module.exports = {
    extends: ['@commitlint/config-angular'],
    rules: {
        'scope-case': [2, 'always', ['lower-case', 'upper-case']],
        'scope-empty': [2, 'never'],
        'scope-enum': [
            2,
            'always',
            [
                'app',
                'core',
                'shared',
                'side-info',
                'home',
                'edition',
                'search',
                'structure',
                'contact',
                'README',
                'CHANGELOG',
                'LICENSE',
                'travis'
            ]
        ]
    }
};
