/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../../../lib/egrid-client.d.ts"/>

module egrid.app {
  export class CollaboratorCreateController {
    public static $inject : string[] = ['$q', '$stateParams', '$state', '$timeout', 'showAlert'];
    public projectKey : string;
    public data : model.Collaborator;

    constructor(private $q, $stateParams, private $state, private $timeout, private showAlert) {
      this.projectKey = $stateParams.projectKey;
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
