/// <reference path="../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../lib/angular-new-router.d.ts"/>

angular.module('egrid')
  .factory('navigateTo', ['$router', ($router: IRouterService) => {
    return (name, params) => {
      console.log(name, params);
      console.log($router.generate(name, params));
      return $router.navigate($router.generate(name, params));
    };
  }]);
