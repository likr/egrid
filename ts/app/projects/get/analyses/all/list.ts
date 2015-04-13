/// <reference path="../../../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../../../typings/angular-ui-router/angular-ui-router.d.ts"/>
/// <reference path="../../../../../../typings/egrid-client/egrid-client.d.ts"/>

module egrid.app {
  export class AnalysisListController {
    public static $inject : string[] = ['grids'];
    public static resolve = {
      grids: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
        return $q.when(<any>model.Analysis.query($stateParams['projectKey']));
      }],
    };

    constructor(private list) {
    }
  }
}
