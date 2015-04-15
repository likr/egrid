/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/egrid-client/egrid-client.d.ts"/>

module egrid.app {
  class AnalysisNewController {
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

  angular.module('egrid')
    // .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
    //   $stateProvider
    //     .state('egrid.projects.get.analyses.all.new', {
    //       url: '/new',
    //       views: {
    //         'sub-tab-content@egrid.projects.get.analyses.all': {
    //           controller: 'AnalysisNewController as analysisNew',
    //           templateUrl: '/components/analysis-new/analysis-new.html',
    //         },
    //       },
    //     })
    // }])
    .controller('AnalysisNewController', AnalysisNewController);
}
