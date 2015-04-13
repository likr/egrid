/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-ui-router/angular-ui-router.d.ts"/>
/// <reference path="../../../../typings/egrid-client/egrid-client.d.ts"/>

module egrid.app {
  class ProjectNewController implements model.ProjectData {
    public static $inject : string[] = ['$q', '$state', 'showAlert'];
    name : string;
    note : string;

    constructor(private $q, private $state, private showAlert) {
    }

    submit() {
      var project = new model.Project(this);
      this.$q.when(project.save())
        .then((project) => {
          this.showAlert('MESSAGES.SAVED');
          this.$state.go('egrid.projects.get.detail',
                         {projectKey: project.key},
                         {reload: true});
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
    .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
      $stateProvider
        .state('egrid.projects.all.new', {
          url: '/new',
          views: {
            'tab-content@egrid.projects.all': {
              controller: 'ProjectNewController as newProject',
              templateUrl: '/partials/projects/all/new.html',
            },
          },
        })
    }])
    .controller('ProjectNewController', ProjectNewController);
}
