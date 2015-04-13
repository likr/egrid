/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-ui-router/angular-ui-router.d.ts"/>
/// <reference path="../../../../typings/egrid-client/egrid-client.d.ts"/>

module egrid.app {
  class ProjectGetController {
  }

  angular.module('egrid')
    .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
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
    }])
    .controller('ProjectGetController', ProjectGetController);
}
