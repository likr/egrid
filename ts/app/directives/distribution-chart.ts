/// <reference path="../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>

declare var nv: any;

interface IDistributionChartScope extends ng.IScope {
  data: number[];
  key: (v: number) => number;
}

angular.module('egrid')
  .directive('distributionChart', () => {
    return {
      restrict: 'E',
      scope: {
        data: '=data',
        key: '=key',
      },
      link: (scope: IDistributionChartScope, element: any) => {
        var svg = d3.select(element[0])
          .append('svg')
          .attr('height', 300);
        var data = (() => {
          var data = {};
          scope.data.forEach((d) => {
            var k = scope.key(d);
            data[k] = (data[k] || 0) + 1;
          });
          var extent = d3.extent(Object.keys(data), (k) => +k);
          for (var i = extent[0], n = extent[1]; i < n; ++i) {
            if (data[i] === undefined) {
              data[i] = 0;
            }
          }
          return Object.keys(data).map((k) => {
            return {
              label: k,
              value: data[k]
            };
          });
        })();

        nv.addGraph(function() {
          var chart = nv.models.discreteBarChart()
            .x(function(d) {
              return d.label;
            })
            .y(function(d) {
              return d.value;
            })
            .staggerLabels(true)
            .tooltips(false)
            .showValues(true)
            .transitionDuration(350)
            ;
          chart.yAxis
            .tickFormat(d3.format('d'));

          svg
            .datum([
              {
                values: data
              }
            ])
            .call(chart);

          nv.utils.windowResize(chart.update);
          return chart;
        });
      }
    };
  });
