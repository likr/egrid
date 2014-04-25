/// <reference path="../lib/egrid-client.d.ts"/>

module egrid.app {
  export class SemProjectListController {
    public projectId : string;
    public semProjects = new model.SemProjectCollection();

    constructor($window, private $q, $rootScope, $stateParams, private $state) {
      this.projectId = $stateParams.projectId;

      this.$q.when(this.semProjects.query(this.projectId))
        .then((semProjects : model.SemProject[]) => {
          Object.keys(semProjects).forEach((v, i, ar) => {
              this.semProjects.addItem(semProjects[v]);
            });
        }, (...reasons: any[]) => {
          if (reasons[0]['status'] === 401) {
            $window.location.href = $rootScope.logoutUrl;
          }
        });
    }
  }
}
