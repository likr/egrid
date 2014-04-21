/// <reference path="../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../utils/storage.ts"/>
/// <reference path="modules/app.ts"/>
/// <reference path="collaborator-create.ts"/>
/// <reference path="collaborator-list.ts"/>
/// <reference path="participant.ts"/>
/// <reference path="participant-create.ts"/>
/// <reference path="participant-grid.ts"/>
/// <reference path="participant-grid-edit.ts"/>
/// <reference path="participant-list.ts"/>
/// <reference path="project.ts"/>
/// <reference path="project-create.ts"/>
/// <reference path="project-grid-create.ts"/>
/// <reference path="project-grid-edit.ts"/>
/// <reference path="project-grid-list.ts"/>
/// <reference path="project-list.ts"/>
/// <reference path="sem-project.ts"/>
/// <reference path="sem-project-analysis.ts"/>
/// <reference path="sem-project-create.ts"/>
/// <reference path="sem-project-questionnaire-edit.ts"/>
/// <reference path="sem-project-list.ts"/>
/// <reference path="url.ts"/>

module egrid.app {
  angular.module('collaboegm', ['paginator', 'ui.router', "ui.bootstrap", "pascalprecht.translate"])
    .directive('focusMe', ['$timeout', function($timeout) {
      return {
         link: function (scope, element, attrs, model) {
            $timeout(function () {
              element[0].focus();
            }, 10);
          }
      };
    }])
    .config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
      $stateProvider
        .state('projects', {
          abstract: true,
        })
        .state('projects.all', {
          abstract: true,
          url: Url.projectListUrlBase + '/all',
          views: {
            '@': {
              templateUrl: '/partials/projects/projects.html',
            },
          },
        })
        .state('projects.all.create', {
          url: '/create',
          views: {
            'content@projects.all': {
              controller: 'ProjectCreateController as newProject',
              templateUrl: '/partials/projects/create.html',
            },
          },
        })
        .state('projects.all.list', {
          url: '/list',
          views: {
            'content@projects.all': {
              controller: 'ProjectListController as ctrl',
              templateUrl: '/partials/projects/list.html',
            },
          },
        })
        .state('projects.get', {
          abstract: true,
          url: Url.projectUrlBase,
          views: {
            '@': {
              controller: 'ProjectController as ctrl',
              templateUrl: '/partials/project/project.html',
            },
          },
        })
        .state('projects.get.analyses', {
          abstract: true,
          url: '/sem-projects',
        })
        .state('projects.get.analyses.all', {
          abstract: true,
          url: '/all',
          views: {
            'content@projects.get': {
              templateUrl: '/partials/project/analyses/analyses.html',
            },
          },
        })
        .state('projects.get.analyses.all.create', {
          url: '/create',
          views: {
            'content@projects.get.analyses.all': {
              templateUrl: '/partials/project/analyses/create.html',
            },
          },
        })
        .state('projects.get.analyses.all.list', {
          url: '/list',
          views: {
            'content@projects.get.analyses.all': {
              controller: 'SemProjectListController as ctrl',
              templateUrl: '/partials/project/analyses/list.html',
            },
          },
        })
        .state('projects.get.analyses.get', {
          abstract: true,
          url: '/:semProjectId',
          views: {
            '@': {
              controller: 'SemProjectController as semProject',
              templateUrl: '/partials/project/analyses/analysis/analysis.html',
            },
            'content@projects.get.analyses.get': {
              controller: 'SemProjectQuestionnaireEditController as questionnaire',
            },
          },
        })
        .state('projects.get.analyses.get.analysis', {
          url: '/analysis',
          views: {
            'content@projects.get.analyses.get': {
              templateUrl: '/partials/project/analyses/analysis/analyses.html',
            },
          },
        })
        .state('projects.get.analyses.get.design', {
          url: '/design',
          views: {
            'content@projects.get.analyses.get': {
              templateUrl: '/partials/project/analyses/analysis/design.html',
            },
          },
        })
        .state('projects.get.analyses.get.questionnaire', {
          url: '/questionnaire',
          views: {
            'content@projects.get.analyses.get': {
              templateUrl: '/partials/project/analyses/analysis/questionnaire.html',
            },
          },
        })
        .state('projects.get.collaborators', {
          abstract: true,
          url: '/collaborators',
        })
        .state('projects.get.collaborators.all', {
          abstract: true,
          url: '/all',
          views: {
            'content@projects.get': {
              templateUrl: '/partials/project/collaborators/collaborators.html',
            },
          },
        })
        .state('projects.get.collaborators.all.create', {
          url: '/create',
          views: {
            'c@projects.get.collaborators.all': {
              controller: 'CollaboratorCreateController as newCollaborator',
              templateUrl: '/partials/project/collaborators/create.html',
            },
          },
        })
        .state('projects.get.collaborators.all.list', {
          url: '/list',
          views: {
            'c@projects.get.collaborators.all': {
              controller: 'CollaboratorListController as collaborators',
              templateUrl: '/partials/project/collaborators/list.html',
            },
          },
        })
        .state('projects.get.detail', {
          url: '/detail',
          views: {
            'content@projects.get': {
              templateUrl: '/partials/project/detail.html',
            },
          },
        })
        .state('projects.get.evaluation', {
          url: '/evaluation',
          views: {
            'content@projects.get': {
              templateUrl: '/partials/project/evaluation.html',
            },
          },
        })
        .state('projects.get.grids', {
          abstract: true,
          url: '/grids',
        })
        .state('projects.get.grids.all', {
          abstract: true,
          url: '/all',
          views: {
            'content@projects.get': {
              templateUrl: '/partials/project/participants/participants.html',
            },
          },
        })
        .state('projects.get.grids.all.list', {
          abstract: true,
          url: '/list',
          views: {
            'content@projects.get.grid.all': {
              controller: 'ProjectGridEditController as projectGrid',
              templateUrl: '/partials/project-grid-edit.html',
            },
          },
        })
        .state('projects.get.grids.get', {
          abstract: true,
          url: '/:projectGridKey',
        })
        .state('projects.get.grids.get.detail', {
          url: '/detail',
          views: {
            '@': {
              controller: 'ProjectGridEditController as projectGrid',
              templateUrl: '/partials/project-grid-edit.html',
            },
          },
        })
        .state('projects.get.participants', {
          abstract: true,
          url: '/participants',
        })
        .state('projects.get.participants.all', {
          abstract: true,
          url: '/all',
          views: {
            'content@projects.get': {
              templateUrl: '/partials/project/participants/participants.html',
            },
          },
        })
        .state('projects.get.participants.all.create', {
          url: '/create',
          views: {
            'content@projects.get.participants.all': {
              controller: 'ParticipantCreateController as newParticipant',
              templateUrl: '/partials/project/participants/create.html',
            },
          },
        })
        .state('projects.get.participants.all.list', {
          url: '/list',
          views: {
            'content@projects.get.participants.all': {
              controller: 'ParticipantListController as ctrl',
              templateUrl: '/partials/project/participants/list.html',
            },
          },
        })
        .state('projects.get.participants.get', {
          abstract: true,
          url: '/:participantId',
          views: {
            '@': {
              controller: 'ParticipantController as ctrl',
              templateUrl: '/partials/project/participants/participant/participant.html',
            },
          },
        })
        .state('projects.get.participants.get.detail', {
          url: '/detail',
          views: {
            'content@projects.get.participants.get': {
              templateUrl: '/partials/project/participants/participant/detail.html',
            },
          },
        })
        .state('projects.get.participants.get.evaluation', {
          url: '/evaluation',
          views: {
            'content@projects.get.participants.get': {
              templateUrl: '/partials/project/participants/participant/evaluation.html',
            },
          },
        })
        .state('projects.get.participants.get.grid', {
          url: '/grid?disableCompletion',
          views: {
            '@': {
              controller: 'ParticipantGridEditController as participantGrid',
              templateUrl: '/partials/egm-edit.html',
            },
          },
        })
        .state("help", {
          templateUrl: '/partials/help.html',
          url: '/help',
        })
        .state("about", {
          templateUrl: '/partials/about.html',
          url: '/about',
        });

      // ほんとは $state.go にしたい
      $urlRouterProvider
        .otherwise(Url.projectListUrlBase + '/all/list');
    }])
    .filter('count', () => {
      return (input : any[]) => input.length;
    })
    .config(["$translateProvider", $translateProvider => {
      $translateProvider
        .useStaticFilesLoader({
          prefix: 'locations/',
          suffix: '.json'
        })
        .fallbackLanguage("en")
        .preferredLanguage("ja");
    }])
    .value('alertLifeSpan', 3200)
    .controller('CollaboratorCreateController', CollaboratorCreateController)
    .controller('CollaboratorListController', CollaboratorListController)
    .controller('ParticipantController', ParticipantController)
    .controller('ParticipantCreateController', ParticipantCreateController)
    .controller('ParticipantGridController', ParticipantGridController)
    .controller('ParticipantGridEditController', ParticipantGridEditController)
    .controller('ParticipantListController', ParticipantListController)
    .controller('ProjectController', ProjectController)
    .controller('ProjectCreateController', ProjectCreateController)
    .controller('ProjectGridCreateController', ProjectGridCreateController)
    .controller('ProjectGridEditController', ProjectGridEditController)
    .controller('ProjectGridListController', ProjectGridListController)
    .controller('ProjectListController', ProjectListController)
    .controller('SemProjectController', SemProjectController)
    .controller('SemProjectAnalysisController', SemProjectAnalysisController)
    .controller('SemProjectCreateController', SemProjectCreateController)
    .controller('SemProjectListController', SemProjectListController)
    .controller('SemProjectQuestionnaireEditController', SemProjectQuestionnaireEditController)
    .run(['$rootScope', '$translate', '$http', ($rootScope, $translate, $http) => {
      $rootScope.alerts = [];
      $rootScope.Url = Url;

      $rootScope.changeLanguage = function(langKey) {
        $translate.use(langKey);
        $http({
          method: "POST",
          url: '/api/users',
          data: {
            location: langKey,
          },
        });
      };

      $http.get("/api/users").success(user => {
        $rootScope.user = user;
        $translate.use(user.location);
      });

      var dest_url = "/";
      $http.get("/api/users/logout?dest_url=" + encodeURIComponent(dest_url)).success(data => {
        $rootScope.logoutUrl = data.logout_url;
      });
    }])
    ;
}
