/// <reference path="../../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../../typings/angular-ui-router/angular-ui-router.d.ts"/>
/// <reference path="../../../../../typings/egrid-client/egrid-client.d.ts"/>

module egrid.app {
export class AnalysisController {
  public static $inject: string[] = ['analysis'];
  public static resolve = {
    analysis: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
      return $q.when(<any>model.Analysis.get($stateParams['projectKey'], $stateParams['analysisKey']));
    }],
  };

  constructor(private analysis) {
  }
}
}
