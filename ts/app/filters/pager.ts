/// <reference path="../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>

angular.module('egrid')
  .filter('pager', () => {
    return (input: any[], currentPage: number, itemsPerPage: number) => {
      var begin = (currentPage - 1) * itemsPerPage;
      return input.slice(begin, begin + itemsPerPage);
    };
  });
