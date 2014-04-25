/// <reference path="../lib/egrid-client.d.ts"/>
/// <reference path="controller-base.ts"/>

module egrid.app {
  export class ProjectGridListController extends ControllerBase {
    projectKey : string;
    list: model.ProjectGrid[];

    constructor($window, $q, $rootScope, $stateParams, $state, $timeout, $filter, alertLifeSpan) {
      super($rootScope, $timeout, $filter, alertLifeSpan);

      this.projectKey = $stateParams.projectId;

      $q.when(model.ProjectGrid.query(this.projectKey))
        .then((grids : model.ProjectGrid[]) => {
          this.list = grids;
        }, (...reasons: any[]) => {
          if (reasons[0]['status'] === 401) {
            $window.location.href = $rootScope.logoutUrl;
          }

          if (reasons[0]['status'] === 404 || reasons[0]['status'] === 500) {
            $state.go('projects.get.detail');

            this.showAlert('MESSAGES.ITEM_NOT_FOUND', 'warning');
          }
        })
        ;
    }
  }
}
