angular.module('prototypeApp.directives', []);

// NAVBAR
app.directive('awgNavbar', function($route){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/navbar.html',
        // controller: function ($scope) {
        //     $scope.activeRoute = $route.current.activeRoute;
        //     $scope.routes = routeNavigation.routes;
        //     $scope.activeRoute = routeNavigation.activeRoute;
        //     console.log($scope.activeRoute);
        //
        //}
    };
});


// SIDENAV ON EDITION PAGES
app.directive('awgEditionSidenav', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/sidenav_edition.html',
        // controller: function ($scope) {
        //     // $scope.version_date = "31. März 2015";
        //     // $scope.editors = "Thomas Ahrend";
        // }
    };
});


// SIDENAV ON SEARCH PAGE
app.directive('awgSearchSidenav', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/sidenav_search.html',
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
        templateUrl: 'partials/footer.html',
        controller: function ($scope) {
            $scope.year_start = '2015';
            $scope.year_recent = (new Date()).getFullYear();
        }
    };
});


//MODALS
//DIRECTIVE BY alexsuch, SEE CREDITS
app.directive('awgModal', function () {
    return {
        template: '<div class="modal fade">' +
                    '<div class="modal-dialog">' +
                        '<div class="modal-content">' +
                            '<div class="modal-header">' +
                                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                                '<h4 class="modal-title">Hinweis</h4>' +
                            '</div>' +
                            '<div class="modal-body" ng-transclude></div>' +
                            '<div class="modal-footer">' +
                                '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>',
        restrict: 'E',
        transclude: true,
        replace:true,
        scope:true,
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
