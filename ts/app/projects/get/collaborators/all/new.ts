/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../../../lib/egrid-client.d.ts"/>

module egrid.app {
  export class CollaboratorCreateController {
    public static $inject : string[] = ['$q', '$stateParams', '$state', 'showAlert'];
    public projectKey : string;
    public data : model.Collaborator;

    constructor(private $q, $stateParams, private $state, private showAlert) {
      this.projectKey = $stateParams.projectKey;
      this.data = new model.Collaborator({ projectKey: this.projectKey });
    }

    submit() {
      this.$q.when(this.data.save())
        .then(() => {
          this.showAlert('MESSAGES.OPERATION_SUCCESSFULLY_COMPLETED');
          this.$state.go('egrid.projects.get.collaborators.all.list',
                         null, {reload: true});
        }, (...reasons: any[]) => {
          var k: string = reasons[0].status === 401
            ? 'MESSAGES.NOT_AUTHENTICATED'
            : 'MESSAGES.DESTINATION_IS_NOT_REACHABLE';
          this.showAlert(k, 'danger');
        });
    }
  }
}
