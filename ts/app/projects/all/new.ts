/// <reference path="../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../lib/egrid-client.d.ts"/>

module egrid.app {
  export class ProjectCreateController implements model.ProjectData {
    public static $inject : string[] = ['$q', '$timeout', '$state', 'showAlert'];
    name : string;
    note : string;

    constructor(private $q, private $timeout, private $state, private showAlert) {
    }

    submit() {
      var project = new model.Project(this);
      this.$q.when(project.save())
        .then(() => {
          this.$timeout(() => {
            this.$state.go('egrid.projects.get.detail', {projectKey: project.key}, {reload: true});

            this.showAlert('MESSAGES.OPERATION_SUCCESSFULLY_COMPLETED');
          }, 200); // なぜか即時反映されない
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
