/// <reference path="../lib/egrid-client.d.ts"/>
/// <reference path="controller-base.ts"/>

module egrid.app {
  export class SemProjectController extends ControllerBase implements model.SemProjectData {
    private static $inject : string[] = ['$window', '$q', '$rootScope', '$stateParams', '$state', '$timeout', '$filter', 'alertLifeSpan'];
    name : string;
    project : model.ProjectData;
    projectKey : string;
    semProject : model.SemProject;

    constructor($window, $q, $rootScope, $stateParams, $state, $timeout, $filter, alertLifeSpan) {
      super($rootScope, $timeout, $filter, alertLifeSpan);

      this.semProject = new model.SemProject({ projectKey: $stateParams.projectId });

      $q.when(this.semProject.get($stateParams.semProjectId))
        .then((p: model.SemProject) => {
        }, (reason) => {
          if (reason.status === 401) {
            $window.location.href = $rootScope.logoutUrl;
          }

          if (reason.status === 404 || reason.status === 500) {
            $state.go('projects.get.analyses.all.list');

            this.showAlert('MESSAGES.ITEM_NOT_FOUND', 'warning');
          }
        });
    }
  }
}
