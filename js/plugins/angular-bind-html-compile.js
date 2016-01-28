(function (angular) {
    /*
                Angular directive that calls $compile on trusted HTML,
                    allowing directives in an API response.

                            by Incuna Ltd, Oxford, Uk
                  https://github.com/incuna/angular-bind-html-compile
                                (2014-2015)

                    This plugin is in the public domain.
    */

    'use strict';

    var module = angular.module('angular-bind-html-compile', []);

    module.directive('dirBindHtmlCompile', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return scope.$eval(attrs.dirBindHtmlCompile);
                }, function (value) {
                    // In case value is a TrustedValueHolderType, sometimes it
                    // needs to be explicitly called into a string in order to
                    // get the HTML string.
                    element.html(value && value.toString());
                    // If scope is provided use it, otherwise use parent scope
                    var compileScope = scope;
                    if (attrs.bindHtmlScope) {
                        compileScope = scope.$eval(attrs.bindHtmlScope);
                    }
                    $compile(element.contents())(compileScope);
                });
            }
        };
    }]);
}(window.angular));
