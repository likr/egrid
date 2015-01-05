/// <reference path="../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>

angular.module('egrid')
  .factory('waiting', ['$rootScope', ($rootScope) => {
    return (status: boolean) => {
      $rootScope.waiting = status;
    };
  }]);
