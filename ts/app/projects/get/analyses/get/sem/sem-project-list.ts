/// <reference path="../../../../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../../../../lib/egrid-client.d.ts"/>

module egrid.app {
  export class SemProjectListController {
    public static $inject : string[] = ['$window', '$q', '$rootScope', '$stateParams', '$state'];
    public projectId: string;
    public semProjects: model.SemProject[];

    constructor(
        $window: ng.IWindowService,
        $q: ng.IQService,
        $rootScope: ng.IRootScopeService,
        $stateParams: ng.ui.IStateParamsService,
        $state: ng.ui.IStateService) {
      this.projectId = $stateParams['projectId'];

      $q.when(<any>model.SemProject.query(this.projectId))
        .then((semProjects: model.SemProject[]) => {
          this.semProjects = semProjects;
        }, (...reasons: any[]) => {
          if (reasons[0]['status'] === 401) {
            $window.location.href = (<any>$rootScope).logoutUrl;
          }
        });
    }
  }
}
