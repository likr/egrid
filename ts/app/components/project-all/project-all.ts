/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../lib/angular-new-router.d.ts"/>

module egrid.app {
  class ProjectAllController {
    public static $routeConfig: Route[] = [
      {
        path: '/list',
        components: {
          tabContent: 'projectList'
        }
      },
      {
        path: '/new',
        components: {
          tabContent: 'projectNew'
        },
      }
    ];
  }

  angular.module('egrid')
    .controller('ProjectAllController', ProjectAllController);
}
