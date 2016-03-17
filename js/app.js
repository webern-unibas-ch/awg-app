var app = angular.module('prototypeApp', [
    'prototypeApp.controllers',
    'prototypeApp.directives',
    'prototypeApp.filters',
    'prototypeApp.services',
    'ngRoute',
    'ngSanitize',
    'angular-bind-html-compile'
]);

// routeConfiguration
app.config(function($routeProvider){
    $routeProvider

        //route for the home page
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'mainCtrl',
            name: 'Home',
            activeRoute: '/'
        })

        //route for the search page
        .when('/search', {
            templateUrl: 'partials/search.html',
            controller: 'searchCtrl',
            name: 'Suche',
            activeRoute: 'search'
        })

        //route for the intro page
        .when('/intro', {
            templateUrl: 'partials/intro.html',
            controller: 'introCtrl',
            name: 'Einleitung',
            activeRoute: 'intro'
        })

        //route for the edition page
        .when('/edition', {
            templateUrl: 'partials/edition.html',
            controller: 'editionCtrl',
            name: 'Edierter Notentext',
            activeRoute: 'edition'
        })

        //route for the report page
        .when('/report', {
            templateUrl: 'partials/report_panel.html',
            controller: 'reportCtrl',
            name: 'Kritischer Bericht',
            activeRoute: 'report'
        })

        //route for the structure page
        .when('/structure', {
            templateUrl: 'partials/structure.html',
            controller: 'structureCtrl',
            name: 'Struktur',
            activeRoute: 'structure'
        })

        //route for the contact page
        .when('/contact', {
            templateUrl: 'partials/contact.html',
            controller: 'contactCtrl',
            name: 'Kontakt',
            activeRoute: 'contact'
        })

        //otherwise route to home page
        .otherwise({
            redirectTo: '/'
        });

});

app.run(function($rootScope, $location, $route, $anchorScroll, $timeout) {
    $rootScope.$location = $location;

    //when route changes & anchorHash is set, set timeout so page can completely load/render before scrolling to anchorHash
    $rootScope.$on("$routeChangeSuccess", function (event) {
        if ($location.hash()) {
            $timeout(function(){
                $anchorScroll();
            }, 750);
        };
    });
});
