/// <reference path="../../../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../../../typings/angular-ui-router/angular-ui-router.d.ts"/>
/// <reference path="../../../../../../typings/egrid-client/egrid-client.d.ts"/>

module egrid.app {
  export class AnalysisCreateController {
    public static $inject: string[] = ['$q', '$stateParams', '$state', 'showAlert'];
    projectKey: string;
    data: model.Analysis;

    constructor(private $q, $stateParams, private $state, private showAlert) {
      this.projectKey = $stateParams.projectKey;

      this.data = new model.Analysis({
        projectKey: this.projectKey
      });
    }

    submit() {
      this.$q.when(this.data.save())
        .then((analysis : model.Analysis) => {
          this.showAlert('MESSAGES.SAVED');
          this.$state.go('egrid.projects.get.analyses.get.detail',
                         {analysisKey: analysis.key});
        })
        ;
    }
  }
}
