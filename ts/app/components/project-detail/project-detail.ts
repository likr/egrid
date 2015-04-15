/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/egrid-client/egrid-client.d.ts"/>

module egrid.app {
  class ProjectDetailController {
    public static $inject : string[] = [
      '$window',
      '$q',
      '$router',
      'navigateTo',
      'showAlert',
      'showConfirmDialog'
    ];
    public project: model.Project;

    constructor(
        private $window,
        private $q,
        private $router,
        private navigateTo,
        private showAlert,
        private showConfirmDialog) {
    }

    canActivate() {
      return true;
    }

    activate($routeParams) {
      return model.Project.get($routeParams.projectKey)
        .then(project => {
          this.project = project;
        });
    }

    public update() {
      this.$q.when(this.project.save())
        .then((project: model.Project) => {
          // バインドしてるから要らない気はする
          this.project.name = project.name;
          this.project.note = project.note;
          this.showAlert('MESSAGES.UPDATED');
        }, (reason) => {
          if (reason.status === 401) {
            // this.$scope.$emit('egrid.authorization.error');
          }

          if (reason.status === 404 || reason.status === 500) {
            this.navigateTo('projectList');
            this.showAlert('MESSAGES.ITEM_NOT_FOUND', 'warning');
          }
        });
    }

    public confirm() {
      this.showConfirmDialog('MESSAGES.CONFIRM_REMOVE')
        .result
        .then(() => {
          this.remove();
        });
    }

    private remove() {
      this.$q.when(this.project.remove())
        .then(() => {
          this.showAlert('MESSAGES.REMOVED');
          this.navigateTo('projectList');
        }, (reason) => {
          if (reason.status === 401) {
            // this.$scope.$emit('egrid.authorization.error');
          }

          if (reason.status === 404 || reason.status === 500) {
            this.navigateTo('projectList');
            this.showAlert('MESSAGES.ITEM_NOT_FOUND', 'warning');
          }
        });
    }
  }

  angular.module('egrid')
    .controller('ProjectDetailController', ProjectDetailController);
}
