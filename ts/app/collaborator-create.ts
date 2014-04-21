/// <reference path="../model/collaborator.ts"/>
/// <reference path="controller-base.ts"/>
/// <reference path="url.ts"/>

module egrid.app {
  export class CollaboratorCreateController extends ControllerBase {
    private static $inject : string[] = ['$q', '$rootScope', '$stateParams', '$state', '$timeout', '$filter', 'alertLifeSpan'];
    public projectKey : string;
    public data : model.Collaborator;

    constructor(private $q, $rootScope, $stateParams, private $state, $timeout, $filter, alertLifeSpan) {
      super($rootScope, $timeout, $filter, alertLifeSpan);

      this.projectKey = $stateParams.projectId;
      this.data = new model.Collaborator({ projectKey: this.projectKey });
    }

    submit() {
      this.$q.when(this.data.save())
        .then(
            () => {
              this.$timeout(() => {
                this.$state.go('projects.get.collaborators.all.list', null, { reload: true });

                this.showAlert('MESSAGES.OPERATION_SUCCESSFULLY_COMPLETED');
              }, 200); // なぜか即時反映されない
            },
            (...reasons: any[]) => {
              var k: string = reasons[0].status === 401
                ? 'MESSAGES.NOT_AUTHENTICATED'
                : 'MESSAGES.DESTINATION_IS_NOT_REACHABLE';

              this.showAlert(k, 'danger');
            }
        )
        ;
    }
  }
}
