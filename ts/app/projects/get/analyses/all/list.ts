/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../../../lib/egrid-client.d.ts"/>
/// <reference path="../../../../controller-base.ts"/>

module egrid.app {
  export class AnalysisListController extends ControllerBase {
    public static $inject : string[] = ['$rootScope', '$timeout', '$filter', 'alertLifeSpan', 'grids'];
    public static resolve = {
      grids: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
        return $q.when(model.Analysis.query($stateParams['projectKey']));
      }],
    };

    constructor($rootScope, $timeout, $filter, alertLifeSpan, private list) {
      super($rootScope, $timeout, $filter, alertLifeSpan);
    }
  }
}
