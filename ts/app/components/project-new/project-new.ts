/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/egrid-client/egrid-client.d.ts"/>

module egrid.app {
  class ProjectNewController implements model.ProjectData {
    public static $inject : string[] = ['$q', 'navigateTo', 'showAlert'];
    name : string;
    note : string;

    constructor(private $q, private navigateTo, private showAlert) {
    }

    submit() {
      var project = new model.Project(this);
      this.$q.when(project.save())
        .then((project) => {
          this.showAlert('MESSAGES.SAVED');
          this.navigateTo('tabContent:projectDetail', {
            projectKey: project.key
          });
        }, (...reasons: any[]) => {
          var k: string = reasons[0].status === 401
            ? 'MESSAGES.NOT_AUTHENTICATED'
            : 'MESSAGES.DESTINATION_IS_NOT_REACHABLE';
          this.showAlert(k, 'danger');
        })
        ;
    }
  }

  angular.module('egrid')
    .controller('ProjectNewController', ProjectNewController);
}
