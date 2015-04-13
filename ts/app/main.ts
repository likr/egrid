/// <reference path="../../typings/angular-ui-router/angular-ui-router.d.ts"/>
/// <reference path="../../typings/egrid-client/egrid-client.d.ts"/>
/// <reference path="app.ts"/>

module egrid.app {
  class AuthorizationError {
    constructor(public loginUrl: string) {
    }
  }


  interface EgridScope extends ng.IScope {
    logedIn: boolean;
    loginUrl: string;
    logoutUrl: string;
    user: any;
  }


  angular.module('egrid')
    .config(['$compileProvider', $compileProvider => {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|data):/);
    }])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        (
          $stateProvider: ng.ui.IStateProvider,
          $urlRouterProvider: ng.ui.IUrlRouterProvider) => {
      $stateProvider
        .state('egrid', {
          abstract: true,
          resolve: {
            authorization: ['$q', '$http', ($q: ng.IQService, $http: ng.IHttpService) => {
              var deferred = $q.defer();
              var destUrl = '/';
              $http.get('/api/public/auth?dest_url=' + encodeURIComponent(destUrl))
                .success((data: any) => {
                  if (data.logedIn) {
                    deferred.resolve(data);
                  } else {
                    deferred.reject(new AuthorizationError(data.loginUrl));
                  }
                })
                .error(() => {
                  deferred.reject();
                });
              return deferred.promise;
            }],
            user: ['$http', 'authorization', ($http: ng.IHttpService) => {
              return $http.get('/api/users');
            }],
            projects: ['authorization', () => {
              return model.Project.query();
            }],
          },
          url: '/app',
          views: {
            'base@': {
              controller: ['$rootScope', '$translate', 'authorization', 'user', ($rootScope: EgridScope, $translate: any, auth: any, user: any) => {
                $rootScope.logedIn = auth.logedIn;
                $rootScope.loginUrl = auth.loginUrl;
                $rootScope.logoutUrl = auth.logoutUrl;
                $rootScope.user = user.data;
                $translate.use(user.location);
              }],
              templateUrl: '/partials/base.html',
            },
          },
        })
        .state('egrid.projects', {
          abstract: true,
          url: '/projects',
        })
        .state('egrid.projects.get.collaborators', {
          abstract: true,
          url: '/collaborators',
        })
        .state('egrid.projects.get.analyses', {
          abstract: true,
          url: '/analyses',
        })
        .state('egrid.projects.get.participants', {
          abstract: true,
          url: '/participants',
        })
        ;

      $stateProvider
        .state('egrid.projects.all', {
          abstract: true,
          url: '/all',
          views: {
            'content@egrid': {
              templateUrl: '/partials/projects/all.html',
            },
          },
        })
        ;

      $stateProvider
        .state('egrid.projects.get', {
          abstract: true,
          resolve: {
            project: ['$stateParams', ($stateParams: ng.ui.IStateParamsService) => {
              return model.Project.get($stateParams['projectKey']);
            }],
          },
          url: '/{projectKey}',
          views: {
            'content@egrid': {
              controller: ['$scope', 'project', ($scope: any, project: any) => {
                $scope.project = project;
              }],
              templateUrl: '/partials/projects/get.html',
            },
          },
        })
        .state('egrid.projects.get.participants.all', {
          abstract: true,
          url: '/all',
          views: {
            'tab-content@egrid.projects.get': {
              templateUrl: '/partials/projects/get/participants/all.html',
            },
          },
        })
        .state('egrid.projects.get.analyses.all', {
          abstract: true,
          url: '/all',
          views: {
            'tab-content@egrid.projects.get': {
              templateUrl: '/partials/projects/get/analyses/all.html',
            },
          },
        })
        .state('egrid.projects.get.collaborators.all', {
          abstract: true,
          url: '/all',
          views: {
            'tab-content@egrid.projects.get': {
              templateUrl: '/partials/projects/get/collaborators/all.html',
            },
          },
        })
        ;

      $stateProvider
        .state('egrid.help', {
          url: '/help',
          views: {
            'content@egrid': {
              templateUrl: '/partials/help.html',
            },
          },
        })
        ;

      $stateProvider
        .state('egrid.about', {
          url: '/about',
          views: {
            'content@egrid': {
              templateUrl: '/partials/about.html',
            },
          },
        })
        ;

      $stateProvider
        .state('egrid.install', {
          url: '/install',
          views: {
            'content@egrid': {
              controller: ['$scope', '$window', ($scope, $window) => {
                $scope.installApp = function() {
                  var request = $window.navigator.mozApps.install($window.location.origin + '/egrid.webapp');
                  request.onsuccess = function() {
                    console.log('success', this.result);
                  };
                  request.onerror = function() {
                    console.log('error', this.error);
                  };
                };
              }],
              templateUrl: '/partials/install.html',
            },
          },
        })
        ;

      $urlRouterProvider.otherwise('/app/projects/all/list');
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
    .run(['$rootScope', '$translate', '$http', '$window', ($rootScope: any, $translate: any, $http: any, $window: any) => {
      $rootScope.alerts = [];

      $rootScope.changeLanguage = (langKey: any) => {
        $translate.use(langKey);
        $http({
          method: "POST",
          url: '/api/users',
          data: {
            location: langKey,
          },
        });
      };

      $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {
        if (error instanceof AuthorizationError) {
          $window.location.href = error.loginUrl;
        }
      })
    }])
    ;
}
