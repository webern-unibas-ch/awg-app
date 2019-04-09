module.exports = {
    extends: ['@commitlint/config-angular'],
    rules: {
        'scope-empty': [2, 'never'],
        'scope-case': [2, 'always', ['lowerCase', 'upperCase']],
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
