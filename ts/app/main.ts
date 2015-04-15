/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/egrid-client/egrid-client.d.ts"/>
/// <reference path="../lib/angular-new-router.d.ts"/>

module egrid.app {
  class AuthorizationError {
    constructor(public loginUrl: string) {
    }
  }

  class AppController {
    public static $routeConfig: Route[] = [
      {
        path: '/',
        redirectTo: '/app/projects/all/list'
      },
      {
        path: '/app',
        components: {
          base: 'base'
        },
        as: 'base'
      }
    ];
  }

  angular.module('egrid')
    .config(['$compileProvider', $compileProvider => {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|data):/);
    }])
    .filter('count', () => {
      return (input : any[]) => input.length;
    })
    .config(["$translateProvider", ($translateProvider: any) => {
      $translateProvider
        .useStaticFilesLoader({
          prefix: 'locations/',
          suffix: '.json'
        })
        .fallbackLanguage("en")
        .preferredLanguage("ja");
    }])
    .value('alertLifeSpan', 3200)
    .controller('AppController', AppController)
    .run(['$rootScope', '$window', ($rootScope: any, $window: any) => {
      $rootScope.alerts = [];

      $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {
        if (error instanceof AuthorizationError) {
          $window.location.href = error.loginUrl;
        }
      })
    }]);
}
