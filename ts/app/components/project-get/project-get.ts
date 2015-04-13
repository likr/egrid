/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-ui-router/angular-ui-router.d.ts"/>
/// <reference path="../../../../typings/egrid-client/egrid-client.d.ts"/>

module egrid.app {
  class ProjectGetController {
    public static $inject : string[] = [
      '$window',
      '$q',
      '$state',
      'showAlert',
      'showConfirmDialog',
      'authorization',
      'project'
    ];

    constructor(
        private $window,
        private $q,
        private $state,
        private showAlert,
        private showConfirmDialog,
        private authorization,
        public project: model.Project) {
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
            this.$window.location.href = this.authorization.logoutUrl;
          }

          if (reason.status === 404 || reason.status === 500) {
            this.$state.go('egrid.projects.all.list');

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
          this.$state.go('egrid.projects.all.list', null, {reload: true});
        }, (reason) => {
          if (reason.status === 401) {
            this.$window.location.href = this.authorization.logoutUrl;
          }

          if (reason.status === 404 || reason.status === 500) {
            this.$state.go('egrid.projects.all.list');

            this.showAlert('MESSAGES.ITEM_NOT_FOUND', 'warning');
          }
        });
    }
  }

  angular.module('egrid')
    .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
      $stateProvider
        .state('egrid.projects.get.detail', {
          url: '/detail',
          views: {
            'tab-content@egrid.projects.get': {
              controller: 'ProjectGetController as ctrl',
              templateUrl: '/partials/projects/get/detail.html',
            },
          },
        })
    }])
    .controller('ProjectGetController', ProjectGetController);
}
