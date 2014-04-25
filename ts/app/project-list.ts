/// <reference path="../lib/egrid-client.d.ts"/>
/// <reference path="pagination.ts"/>

module egrid.app {
  export class ProjectListController extends PaginationController {
    private static $inject : string[] = ['$window', '$q', '$rootScope'];
    public projects = new model.ProjectCollection();

    constructor($window, $q, $rootScope) {
      super();

      this.itemsPerPage = 5;
      this.predicate = 'updatedAt';
      this.reverse = true;

      $q
        .when(this.projects.query())
        .then((projects: model.Project[]) => {
          Object.keys(projects).forEach((v, i, ar) => {
              this.projects.addItem(projects[v]);
            });
        }, (...reasons: any[]) => {
          // 401
          if (reasons[0]['status'] === 401) {
            $window.location.href = $rootScope.logoutUrl;
          }
        });
    }
  }
}
