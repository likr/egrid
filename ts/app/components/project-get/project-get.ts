/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-ui-router/angular-ui-router.d.ts"/>
/// <reference path="../../../../typings/egrid-client/egrid-client.d.ts"/>

module egrid.app {
  class ProjectGetController {
    public static $inject: string[] = ['project'];

    constructor(private project) {
    }
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
              controller: 'ProjectGetController as projectGet',
              templateUrl: '/components/project-get/project-get.html',
            },
          },
        })
    }])
    .controller('ProjectGetController', ProjectGetController);
}
