/// <reference path="../../typings/egrid-client/egrid-client.d.ts"/>
/// <reference path="app.ts"/>
/// <reference path="projects/get.ts"/>
/// <reference path="projects/get/analyses/all/list.ts"/>
/// <reference path="projects/get/analyses/all/new.ts"/>
/// <reference path="projects/get/analyses/get/grid.ts"/>
/// <reference path="projects/get/analyses/get/grid/detail.ts"/>
/// <reference path="projects/get/analyses/get/sem.ts"/>
/// <reference path="projects/get/analyses/get/questionnaire.ts"/>
/// <reference path="projects/get/collaborators/all/list.ts"/>
/// <reference path="projects/get/collaborators/all/new.ts"/>
/// <reference path="projects/get/participants/all/list.ts"/>
/// <reference path="projects/get/participants/all/new.ts"/>
/// <reference path="projects/get/participants/get/grid.ts"/>
/// <reference path="projects/get/participants/get/grid/detail.ts"/>

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
        .state('egrid.projects.get.detail', {
          url: '/detail',
          views: {
            'tab-content@egrid.projects.get': {
              controller: 'ProjectController as ctrl',
              templateUrl: '/partials/projects/get/detail.html',
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
        .state('egrid.projects.get.participants.all.list', {
          resolve: ParticipantListController.resolve,
          url: '/list',
          views: {
            'sub-tab-content@egrid.projects.get.participants.all': {
              controller: 'ParticipantListController as ctrl',
              templateUrl: '/partials/projects/get/participants/all/list.html',
            },
          },
        })
        .state('egrid.projects.get.participants.all.new', {
          url: '/new',
          views: {
            'sub-tab-content@egrid.projects.get.participants.all': {
              controller: 'ParticipantCreateController as newParticipant',
              templateUrl: '/partials/projects/get/participants/all/new.html',
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
        .state('egrid.projects.get.analyses.all.list', {
          resolve: AnalysisListController.resolve,
          url: '/list',
          views: {
            'sub-tab-content@egrid.projects.get.analyses.all': {
              controller: 'AnalysisListController as analyses',
              templateUrl: '/partials/projects/get/analyses/all/list.html',
            },
          },
        })
        .state('egrid.projects.get.analyses.all.new', {
          url: '/new',
          views: {
            'sub-tab-content@egrid.projects.get.analyses.all': {
              controller: 'AnalysisCreateController as analysis',
              templateUrl: '/partials/projects/get/analyses/all/new.html',
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
        .state('egrid.projects.get.collaborators.all.list', {
          resolve: CollaboratorListController.resolve,
          url: '/list',
          views: {
            'sub-tab-content@egrid.projects.get.collaborators.all': {
              controller: 'CollaboratorListController as collaborators',
              templateUrl: '/partials/projects/get/collaborators/all/list.html',
            },
          },
        })
        .state('egrid.projects.get.collaborators.all.new', {
          url: '/new',
          views: {
            'sub-tab-content@egrid.projects.get.collaborators.all': {
              controller: 'CollaboratorCreateController as newCollaborator',
              templateUrl: '/partials/projects/get/collaborators/all/new.html',
            },
          },
        })
        ;

      $stateProvider
        .state('egrid.projects.get.participants.get.grid', {
          resolve: ParticipantGridController.resolve,
          url: '/grid',
          views: {
            'tab-content@egrid.projects.get.participants.get': {
              controller: 'ParticipantGridController as grid',
              templateUrl: '/partials/projects/get/participants/get/grid.html',
            },
          },
        })
        ;

      $stateProvider
        .state('egrid.projects.get.participants.get.grid.detail', {
          resolve: ParticipantGridEditController.resolve,
          url: '/detail',
          views: {
            'base@': {
              controller: 'ParticipantGridEditController as grid',
              templateUrl: '/partials/projects/get/participants/get/grid/detail.html',
            },
          },
        })
        ;

      $stateProvider
        .state('egrid.projects.get.analyses.get.grid', {
          url: '/grid',
          views: {
            'tab-content@egrid.projects.get.analyses.get': {
              controller: 'ProjectGridController as grid',
              templateUrl: '/partials/projects/get/analyses/get/grid.html',
            },
          },
        })
        .state('egrid.projects.get.analyses.get.questionnaire', {
          resolve: SemProjectQuestionnaireEditController.resolve,
          url: '/questionnaire',
          views: {
            'tab-content@egrid.projects.get.analyses.get': {
              controller: 'QuestionnaireController as questionnaire',
              templateUrl: '/partials/projects/get/analyses/get/questionnaire.html',
            },
          },
        })
        .state('egrid.projects.get.analyses.get.sem', {
          resolve: SemProjectAnalysisController.resolve,
          url: '/sem',
          views: {
            'tab-content@egrid.projects.get.analyses.get': {
              controller: 'SemController as sem',
              templateUrl: '/partials/projects/get/analyses/get/sem.html',
            },
          },
        })
        ;

      $stateProvider
        .state('egrid.projects.get.analyses.get.grid.detail', {
          resolve: ProjectGridEditController.resolve,
          url: '/detail',
          views: {
            'base@': {
              controller: 'ProjectGridEditController as grid',
              templateUrl: '/partials/projects/get/analyses/get/grid/detail.html',
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
    .controller('AnalysisCreateController', AnalysisCreateController)
    .controller('AnalysisListController', AnalysisListController)
    .controller('CollaboratorCreateController', CollaboratorCreateController)
    .controller('CollaboratorListController', CollaboratorListController)
    .controller('ParticipantCreateController', ParticipantCreateController)
    .controller('ParticipantGridController', ParticipantGridController)
    .controller('ParticipantGridEditController', ParticipantGridEditController)
    .controller('ParticipantListController', ParticipantListController)
    .controller('ProjectController', ProjectController)
    .controller('ProjectGridController', ProjectGridController)
    .controller('ProjectGridEditController', ProjectGridEditController)
    .controller('SemController', SemProjectAnalysisController)
    .controller('QuestionnaireController', SemProjectQuestionnaireEditController)
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
