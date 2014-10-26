/// <reference path="../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>

module egrid.app {
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
}
