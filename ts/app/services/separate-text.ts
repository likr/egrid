/// <reference path="../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>

declare var TinySegmenter: any;

angular.module('egrid')
  .factory('separateText', ['$translate', ($translate) => {
    return (text: string) : string[] => {
      var texts;
      if ($translate.preferredLanguage() === 'ja') {
        texts = splitJapanese(text);
      } else {
        texts = splitEnglish(text);
      }
      return d3.set(texts).values();
    };

    function splitEnglish(text: string) : string[] {
      return text.split(' ')
    }

    function splitJapanese(text: string) : string[] {
      var stopWords = d3.set([
        'が',
        'の',
        'を',
        'に',
        'で',
        'し',
        'て',
        'な',
        'だ',
        'ず',
        'も',
        'は',
        'れ',
        'う',
        'お',
        'か',
        'さ',
        'や',
        'た',
        'と',
        '(',
        ')',
        '（',
        '）',
        '※',
        '「',
        '」',
        'ない'
      ]);
      var segmenter = new TinySegmenter();
      var texts = segmenter.segment(text);
      return texts.filter(s => !stopWords.has(s));
    }
  }]);


