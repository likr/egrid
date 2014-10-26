/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../../../lib/egrid-client.d.ts"/>

module egrid.app {
  export class CollaboratorListController {
    public static $inject :string[] = [
      '$window',
      '$http',
      '$state',
      'showAlert',
      'showConfirmDialog',
      'authorization',
      'collaborators'
    ];
    public static resolve = {
      collaborators: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
        return $q.when(model.Collaborator.query($stateParams['projectKey']));
      }],
    };

    constructor(
        private $window,
        private $http,
        private $state,
        private showAlert,
        private showConfirmDialog,
        private authorization,
        private collaborators) {
    }

    public confirm(index: number) {
      this.showConfirmDialog('MESSAGES.CONFIRM_REMOVE')
        .result
        .then(() => {
          this.remove(this.collaborators[index]);
        });
    }

    private remove(collaborator) {
      this.$http.delete('/api/projects/' + collaborator.projectKey +'/collaborators/' + collaborator.key)
        .success((data, status) => {
          delete this.collaborators[collaborator.key];
          this.showAlert('MESSAGES.REMOVED');
        })
        .error((data, status) =>{
          if (status === 401) {
            this.$window.location.href = this.authorization.logoutUrl;
          }
        });
    }
  }
}
