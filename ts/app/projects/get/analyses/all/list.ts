/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../../../lib/egrid-client.d.ts"/>

module egrid.app {
  export class AnalysisListController {
    public static $inject : string[] = ['grids'];
    public static resolve = {
      grids: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
        return $q.when(model.Analysis.query($stateParams['projectKey']));
      }],
    };

    constructor(private list) {
    }
  }
}
