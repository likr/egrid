/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/egrid-client/egrid-client.d.ts"/>
/// <reference path="../../../lib/angular-new-router.d.ts"/>
/// <reference path="../../pagination.ts"/>

module egrid.app {
  class ProjectListController extends PaginationController {
    public static $inject: string[] = ['$q'];
    public projects: model.Project[];

    constructor(private $q: ng.IQService) {
      super();

      this.itemsPerPage = 5;
      this.predicate = 'updatedAt';
      this.reverse = true;
    }

    canActivate() {
      return <any>model.Project.query()
        .then(projects => {
          this.projects = projects;
        });
    }
  }

  angular.module('egrid')
    .controller('ProjectListController', ProjectListController);
}
