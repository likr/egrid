/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/egrid-client/egrid-client.d.ts"/>
/// <reference path="../../../lib/angular-new-router.d.ts"/>

module egrid.app {
  class ProjectGetController {
    public static $inject: string[] = [];
    public static $routeConfig: Route[] = [
      {
        path: '/detail',
        components: {
          tabContent: 'projectDetail'
        }
      },
      {
        path: '/participants',
        as: 'participantAll',
        components: {
          tabContent: 'participantAll'
        }
      },
      {
        path: '/analyses',
        as: 'analysisAll',
        components: {
          tabContent: 'analysisAll'
        }
      },
      {
        path: 'collaborators',
        as: 'collaboratorAll',
        components: {
          tabContent: 'collaboratorAll'
        }
      }
    ];
    public project: model.Project;

    constructor() {
    }

    activate($routeParams) {
      return model.Project.get($routeParams.projectKey)
        .then(project => {
          this.project = project;
        });
    }
  }

  angular.module('egrid')
    .controller('ProjectGetController', ProjectGetController);
}
