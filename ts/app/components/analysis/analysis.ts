/// <reference path="../../../../typings/angularjs/angular.d.ts"/>

module egrid.app {
  class AnalysisController {
  }


  angular.module('egrid')
    // .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
    //   $stateProvider
    //     .state('egrid.projects.get.analyses', {
    //       abstract: true,
    //       url: '/analyses',
    //     });
    // }])
    .controller('AnalysisController', AnalysisController);
}
