/// <reference path="../../../typings/angularjs/angular.d.ts"/>

angular.module('egrid')
  .directive('focusMe', ['$timeout', function($timeout: ng.ITimeoutService) {
    return {
      link: (scope: any, element: any) => {
        $timeout(function () {
          element[0].focus();
        }, 10);
      }
    };
  }]);
