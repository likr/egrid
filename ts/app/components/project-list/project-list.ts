/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-ui-router/angular-ui-router.d.ts"/>
/// <reference path="../../../../typings/egrid-client/egrid-client.d.ts"/>
/// <reference path="../../pagination.ts"/>

module egrid.app {
  class ProjectListController extends PaginationController {
    public static $inject : string[] = ['projects'];

    constructor(private projects : model.Project[]) {
      super();

      this.itemsPerPage = 5;
      this.predicate = 'updatedAt';
      this.reverse = true;
    }
  }

  angular.module('egrid')
    .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
      $stateProvider
        .state('egrid.projects.all.list', {
          url: '/list',
          views: {
            'tab-content@egrid.projects.all': {
              controller: 'ProjectListController as ctrl',
              templateUrl: '/partials/projects/all/list.html',
            },
          },
        })
    }])
    .controller('ProjectListController', ProjectListController);
}
