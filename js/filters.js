angular.module('prototypeApp.filters', []);

app.filter('highlight', function() {
    return function(text, phrase) {
        if (text && phrase) {
            text = text.toString().replace(new RegExp('(' + phrase + ')', 'gi'), '<span class="highlighted">$1</span>');
        };
        return text;
    };
});
