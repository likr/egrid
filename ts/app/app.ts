/// <reference path="../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../lib/egrid-client.d.ts"/>
/// <reference path="modules/app.ts"/>
/// <reference path="projects/all/list.ts"/>
/// <reference path="projects/all/new.ts"/>
/// <reference path="projects/get.ts"/>
/// <reference path="projects/get/analyses/all/list.ts"/>
/// <reference path="projects/get/analyses/all/new.ts"/>
/// <reference path="projects/get/analyses/get.ts"/>
/// <reference path="projects/get/analyses/get/grid.ts"/>
/// <reference path="projects/get/analyses/get/grid/detail.ts"/>
/// <reference path="projects/get/analyses/get/sem.ts"/>
/// <reference path="projects/get/analyses/get/questionnaire.ts"/>
/// <reference path="projects/get/collaborators/all/list.ts"/>
/// <reference path="projects/get/collaborators/all/new.ts"/>
/// <reference path="projects/get/participants/all/list.ts"/>
/// <reference path="projects/get/participants/all/new.ts"/>
/// <reference path="projects/get/participants/get.ts"/>
/// <reference path="projects/get/participants/get/grid.ts"/>
/// <reference path="projects/get/participants/get/grid/detail.ts"/>

module egrid.app {
  interface EgridScope extends ng.IScope {
    logoutUrl: string;
  }


  angular.module('collaboegm', ['paginator', 'ui.router', "ui.bootstrap", "pascalprecht.translate"])
    .directive('focusMe', ['$timeout', function($timeout: ng.ITimeoutService) {
      return {
        link: (scope: any, element: any) => {
          $timeout(function () {
            element[0].focus();
          }, 10);
        }
      };
    }])
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
            logoutUrl: ['$q', '$http', ($q: ng.IQService, $http: ng.IHttpService) => {
              var deferred = $q.defer();
              var dest_url = '/';
              $http
                .get('/api/users/logout?dest_url=' + encodeURIComponent(dest_url))
                .success((data: any) => {
                  deferred.resolve(data.logout_url);
                })
                .error(() => {
                  deferred.resolve('');
                });
              return deferred.promise;
            }],
          },
          url: '/app',
          views: {
            'base@': {
              controller: ['$scope', 'logoutUrl', ($scope: EgridScope, logoutUrl: string) => {
                $scope.logoutUrl = logoutUrl;
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
        .state('egrid.projects.all.list', {
          resolve: ProjectListController.resolve,
          url: '/list',
          views: {
            'tab-content@egrid.projects.all': {
              controller: 'ProjectListController as ctrl',
              templateUrl: '/partials/projects/all/list.html',
            },
          },
        })
        .state('egrid.projects.all.new', {
          url: '/new',
          views: {
            'tab-content@egrid.projects.all': {
              controller: 'ProjectCreateController as newProject',
              templateUrl: '/partials/projects/all/new.html',
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
              templateUrl: '/partials/projects/get/collaborators/all/new.html',
            },
          },
        })
        ;

      $stateProvider
        .state('egrid.projects.get.participants.get', {
          abstract: true,
          resolve: ParticipantController.resolve,
          url: '/{participantKey}',
          views: {
            'content@egrid': {
              controller: 'ParticipantController as ctrl',
              templateUrl: '/partials/projects/get/participants/get.html',
            },
          },
        })
        .state('egrid.projects.get.participants.get.detail', {
          url: '/detail',
          views: {
            'tab-content@egrid.projects.get.participants.get': {
              templateUrl: '/partials/projects/get/participants/get/detail.html',
            },
          },
        })
        .state('egrid.projects.get.participants.get.grid', {
          resolve: ParticipantGridController.resolve,
          url: '/grid',
          views: {
            'tab-content@egrid.projects.get.participants.get': {
              controller: 'ParticipantGridController as participantGrid',
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
              controller: 'ParticipantGridEditController as participantGrid',
              templateUrl: '/partials/projects/get/participants/get/grid/detail.html',
            },
          },
        })
        ;

      $stateProvider
        .state('egrid.projects.get.analyses.get', {
          resolve: AnalysisController.resolve,
          url: '/{analysisKey}',
          views: {
            'content@egrid': {
              controller: 'AnalysisController as analysis',
              templateUrl: '/partials/projects/get/analyses/get.html',
            },
          },
        })
        .state('egrid.projects.get.analyses.get.detail', {
          url: '/detail',
          views: {
            'tab-content@egrid.projects.get.analyses.get': {
              templateUrl: '/partials/projects/get/analyses/get/detail.html',
            },
          },
        })
        .state('egrid.projects.get.analyses.get.grid', {
          resolve: ProjectGridController.resolve,
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
          url: '/sem',
          views: {
            'tab-content@egrid.projects.get.analyses.get': {
              controller: 'SemController',
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
              controller: 'ProjectGridEditController as projectGrid',
              templateUrl: '/partials/projects/get/analyses/get/grid/detail.html',
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
    .controller('AnalysisController', AnalysisController)
    .controller('AnalysisCreateController', AnalysisCreateController)
    .controller('AnalysisListController', AnalysisListController)
    .controller('CollaboratorCreateController', CollaboratorCreateController)
    .controller('CollaboratorListController', CollaboratorListController)
    .controller('ParticipantController', ParticipantController)
    .controller('ParticipantCreateController', ParticipantCreateController)
    .controller('ParticipantGridController', ParticipantGridController)
    .controller('ParticipantGridEditController', ParticipantGridEditController)
    .controller('ParticipantListController', ParticipantListController)
    .controller('ProjectController', ProjectController)
    .controller('ProjectCreateController', ProjectCreateController)
    .controller('ProjectListController', ProjectListController)
    .controller('ProjectGridController', ProjectGridController)
    .controller('ProjectGridEditController', ProjectGridEditController)
    .controller('SemController', SemProjectAnalysisController)
    .controller('QuestionnaireController', SemProjectQuestionnaireEditController)
    .run(['$rootScope', '$translate', '$http', ($rootScope: any, $translate: any, $http: any) => {
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

      $http.get("/api/users")
        .success((user: any) => {
          $rootScope.user = user;
          $translate.use(user.location);
        });
    }])
    ;
}
