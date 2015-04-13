/// <reference path="../../../typings/angularjs/angular.d.ts"/>

angular.module('egrid')
  .factory('showAlert', ['$rootScope', '$timeout', '$filter', 'alertLifeSpan',
                         ($rootScope, $timeout, $filter, alertLifeSpan) => {
    return (key: string, type: string = 'success') => {
      $rootScope.alerts.push({
        type: type,
        msg: $filter('translate')(key)
      });

      $timeout(() => {
        $rootScope.alerts.pop();
      }, alertLifeSpan);
    };
  }]);
