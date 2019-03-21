module.exports = {
    extends: ['@commitlint/config-angular'],
    rules: {
        'scope-empty': [2, 'never'],
        'scope-case': [2, 'always', 'lowerCase'],
        'scope-enum': [2, 'always', ['app', 'home', 'edition', 'search', 'structure', 'contact']]
    }
};
