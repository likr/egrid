/// <reference path="../lib/egrid-client.d.ts"/>
/// <reference path="controller-base.ts"/>
/// <reference path="url.ts"/>

module egrid.app {
  export class SemProjectCreateController extends ControllerBase implements model.SemProjectData {
    name : string;
    projectKey : string;

    constructor(private $q, $rootScope, $stateParams, private $state, $timeout, $filter, alertLifeSpan) {
      super($rootScope, $timeout, $filter, alertLifeSpan);

      this.projectKey = $stateParams.projectId;
    }

    submit() {
      var semProject = new model.SemProject(this);
      this.$q.when(semProject.save())
        .then(() => {
          this.$timeout(() => {
            this.$state.go('projects.get.analyses.all.list');

            this.showAlert('MESSAGES.OPERATION_SUCCESSFULLY_COMPLETED');
          }, 200);
        }, (...reasons: any[]) => {
          var k: string = reasons[0].status === 401
            ? 'MESSAGES.NOT_AUTHENTICATED'
            : 'MESSAGES.DESTINATION_IS_NOT_REACHABLE';

          this.showAlert(k, 'danger');
        })
        ;
    }
  }
}
