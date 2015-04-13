/// <reference path="../../../typings/angularjs/angular.d.ts"/>

angular.module('egrid')
  .directive('fileModel', ['$parse', ($parse) => {
    return {
      restrict: 'A',
      link: (scope, element, attrs) => {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;
        element.bind('change', () => {
          scope.$apply(() => {
            modelSetter(scope, element[0].files[0]);
          });
        });
      }
    };
  }]);
