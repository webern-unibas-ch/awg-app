angular.module('prototypeApp.directives', []);

/*

                LAYOUT

*/
    // NAVBAR
    app.directive('awgNavbar', function($route){
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/layout/navbar.html',
        };
    });

    // SIDENAV
    app.directive('awgSidenav', function(){
        return {
            restrict: 'E',
            replace: true,
            // GET TEMPLATE-URL FROM ATTRS
            templateUrl: function(elem, attrs){
                    return 'partials/layout/sidenav_' + attrs.templateUrl + '.html'
            },
            //INIT SEARCHTEXT
            controller: function ($scope) {
                 $scope.searchText = "Kantate";
            }
        };
    });

    // FOOTER
    app.directive('awgFooter', function(){
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/layout/footer.html',
            controller: function ($scope) {
                $scope.year_start = '2015';
                $scope.year_recent = (new Date()).getFullYear();
            }
        };
    });



/*

                REPORT (reportCtrl)

*/
    // sourceList
    app.directive('awgSourcelist', function(){
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/report/sourceList.html',
            controller: function ($scope, $http) {
                $http.get('data/sourcelist.json').then(function (response){
                    $scope.sourceList = response.data;
                });
            }
        };
    });

    // sourceDesc
    app.directive('awgSourcedesc', function(){
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/report/sourceDesc.html',
        };
    });

    // sourceEvaluation
    app.directive('awgSourceeval', function(){
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/report/sourceEval.html',
        };
    });

    // TKA
    app.directive('awgTka', function(){
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/report/tka.html',
            controller: function ($scope, $http) {
                $http.get('data/tka.json').then(function (response){
                    $scope.tka = response.data;
                });
            }
        };
    });



/*

                EDITION (editionCtrl)

*/

    // editionHeading
    app.directive('editionHeading', function(){
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/edition/heading.html',
            controller: function ($scope) {
                $scope.editionTitle = '<em>Vier Lieder</em> op. 12, Skizzen';
            }
        };
    });

    // editionImageControl
    app.directive('editionImageControl', function(){
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            templateUrl: 'partials/edition/image-control.html'
        };
    });

        

/*

                MODALS

*/
    //DIRECTIVE BY alexsuch, SEE CREDITS
    app.directive('awgModal', function () {
        return {
            templateUrl: 'partials/layout/modal.html',
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: true,
            link: function postLink(scope, element, attrs) {
                scope.$watch(attrs.visible, function(value){
                    if(value == true)
                    $(element).modal('show');
                    else
                    $(element).modal('hide');
                });

                $(element).on('shown.bs.modal', function(){
                    scope.$apply(function(){
                        scope.$parent[attrs.visible] = true;
                    });
                });

                $(element).on('hidden.bs.modal', function(){
                    scope.$apply(function(){
                        scope.$parent[attrs.visible] = false;

                    });
                });
            }
        };
    });
