/// <reference path="../../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../..//lib/egrid-client.d.ts"/>

module egrid.app {
export class AnalysisController {
  public static $inject: string[] = ['analysis'];
  public static resolve = {
    analysis: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
      return $q.when(model.Analysis.get($stateParams['projectKey'], $stateParams['analysisKey']));
    }],
  };

  constructor(private analysis) {
  }
}
}
