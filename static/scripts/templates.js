angular.module('collaboegm').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/partials/about.html',
    "<div egm-application-view>\n" +
    "<h2>E-Gridとは</h2>\n" +
    "E-Gridは評価グリッド法によるインタビュー・分析を支援するサービスです。\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-xs-4\">\n" +
    "    <img src=\"images/about/tiled.jpg\" class=\"img-responsive img-rounded\"/>\n" +
    "  </div>\n" +
    "  <div class=\"col-xs-4\">\n" +
    "    <img src=\"images/about/tiled.jpg\" class=\"img-responsive img-rounded\"/>\n" +
    "  </div>\n" +
    "  <div class=\"col-xs-4\">\n" +
    "    <img src=\"images/about/tiled.jpg\" class=\"img-responsive img-rounded\"/>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<h3>E-Gridによるインタビュー</h3>\n" +
    "<p>簡単と言われる評価グリッド法のインタビューにもたくさんのつまずくポイントがあります。</p>\n" +
    "<p>E-Gridは、はじめてインタビューをする人でもすぐにエキスパート並の調査が行えるように開発されました。</p>\n" +
    "<p>従来、評価グリッド法のインタビューは紙に図を記録しながら行われていました。</p>\n" +
    "<p>話を聞きながら記録するのは初心者にとっては非常に大変な作業です。</p>\n" +
    "<p>E-Gridを使うことで、インタビューの本質的ではない作業から解放され、効果的な調査が実施できます。</p>\n" +
    "\n" +
    "<h3>E-Gridによる分析</h3>\n" +
    "<p>E-Gridでは、インタビュー結果の分析にも着目しています。</p>\n" +
    "<p>インタビューをすることが目的ではなく、その結果を分析して意味ある結論を導きだすのが本当の目的です。</p>\n" +
    "<p>E-Gridは可視化の技術や対話的な操作を通じて、価値ある結論を導きだす手助けを行います。</p>\n" +
    "<div class=\"row\">\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-xs-6\">\n" +
    "    <img src=\"images/about/personal.png\" style=\"height: 150px;\" class=\"img-responsive img-thumbnail\"/>\n" +
    "  </div>\n" +
    "  <div class=\"col-xs-6\">\n" +
    "    <img src=\"images/about/overall.png\" style=\"height: 150px;\" class=\"img-responsive img-thumbnail\"/>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<h3>評価グリッド法とは</h3>\n" +
    "<p>評価グリッド法は、讃井教授によって開発された定性評価手法で、インタビューを通じて人間がものごとに対して抱いている評価構造を明らかにします。</p>\n" +
    "<p>昨今の価値観が多様化した世の中では、人々がどのようにものごとを考えて行動しているか定性的に理解した上で、意思決定を行うことが大切です。</p>\n" +
    "<p>しかし、自由な形式のインタビューから価値のある情報を導きだすためにはインタビューワーの熟練したスキルが必要になります。</p>\n" +
    "<p>評価グリッド法は、半構造化インタビューというある程度質問の流れの決まったインタビュー手法なので、高度なスキルは必要としません。</p>\n" +
    "<p>さらに、評価グリッド法は統計分析等の定量評価手法との相性が良いことから環境心理学、人間工学、感性工学、マーケティングリサーチなど様々な分野で活用されています。</p>\n" +
    "\n" +
    "<h3>参考文献</h3>\n" +
    "<ul>\n" +
    "  <li>讃井純一郎、乾正雄 『レパートリー・グリッド発展手法による住環境評価構造の抽出 : 認知心理学に基づく住環境評価に関する研究(1)』 日本建築学会計画系論文報告集 No.367 pp.15-22、1986年</li>\n" +
    "  <li>神田範明 他 『ヒットを生む商品企画七つ道具 よくわかる編 (商品企画七つ道具実践シリーズ) 』 日科技連出版社、2000年</li>\n" +
    "  <li>福田忠彦研究室 『増補版 人間工学ガイド - 感性を科学する方法』 サイエンティスト社、2009年</li>\n" +
    "</ul>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/base.html',
    "<div class=\"container\" style=\"padding-top: 50px;\">\n" +
    "  <div id=\"alerts\">\n" +
    "    <alert ng-repeat=\"alert in $root.alerts\" type=\"alert.type\" close=\"closeAlert($index)\">{{alert.msg}}</alert>\n" +
    "  </div>\n" +
    "\n" +
    "  <div ui-view=\"content\"></div>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/filter-participants-dialog.html',
    "<div class=\"modal-header\">\n" +
    "  <h3>{{'PARTICIPANT.FILTER' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <table class=\"table table-hover\">\n" +
    "    <tr ng-class=\"{'success':active[participant.key()]}\" ng-repeat=\"participant in participants\">\n" +
    "      <td>\n" +
    "        <label class=\"checkbox\">\n" +
    "          <input type=\"checkbox\" ng-model=\"results[participant.key()]\"/>{{participant.name}}\n" +
    "        </label>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </table>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button class=\"btn btn-default\" ng-click=\"close()\">{{ 'ACTION.CLOSE' | translate }}</button>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/help.html',
    "<div egm-application-view>\n" +
    "<h1>Help</h1>\n" +
    "<p>E-Gridによるインタビューについて説明します。</p>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-xs-9\">\n" +
    "  <div id=\"help-egm\">\n" +
    "    <h1>1. 評価グリッド法</h1>\n" +
    "  </div>\n" +
    "  <div id=\"help-preparation\">\n" +
    "    <h1>2. 調査の準備</h1>\n" +
    "    <div id=\"help-design\">\n" +
    "      <h2>2.1. リサーチデザイン</h2>\n" +
    "      <p>評価グリッド法による調査を開始する前に、調査の計画をしっかり立てましょう。</p>\n" +
    "      <p>検討するべき項目には以下のようなものがあります。</p>\n" +
    "      <ul>\n" +
    "        <li>調査によって明らかにしたいことは何か、事前にある程度仮説を立てておく</li>\n" +
    "        <li>どんな人に対して調査を行うか、回答者は調査対象にある程度の知識・関心を持っていることが望ましい</li>\n" +
    "        <li>エレメントを何にするか、実物や写真かあるいは回答者の記憶か、調査を通じて一貫していることが望ましい</li>\n" +
    "        <li>エレメントをどのように提示するか、全エレメントの組合わせを取れば網羅的な調査ができるがインタビューの負担は大きくなる</li>\n" +
    "        <li>インタビューをどのような形で行うか、対面以外にもビデオ通話やチャットで行う場合もある</li>\n" +
    "        <li>回答者は一度に一人かあるいは複数か、複数に同時に行う場合は質問の進め方に工夫がいる</li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "    <div id=\"help-new-project\">\n" +
    "      <h2>2.2. プロジェクトの作成</h2>\n" +
    "      <p>E-Gridでは、何人かへのインタビューを通じた一連の調査は「プロジェクト」として登録されます。</p>\n" +
    "      <p>プロジェクトの単位で共同調査者の設定や、インタビュー結果をまとめた分析が可能です。</p>\n" +
    "      <p>プロジェクト作成は以下の手順で行います。<p>\n" +
    "      <ol>\n" +
    "        <li>「新規」タブを選択します。</li>\n" +
    "        <li>プロジェクト名など必要な情報を入力します。</li>\n" +
    "        <li>「送信」ボタンを押します。</li>\n" +
    "      </ol>\n" +
    "      <p>作成したプロジェクトは一覧タブに表示されます。</p>\n" +
    "      <img src=\"images/help/new-project.png\" class=\"img-responsive img-thumbnail\"/>\n" +
    "    </div>\n" +
    "    <div id=\"help-new-participant\">\n" +
    "      <h2>2.3. 実験参加者(インタビュー回答者)の登録</h2>\n" +
    "      <p>1回のインタビュー毎に、「実験参加者」を登録します。</p>\n" +
    "      <p>実験参加者の登録は以下の手順で行います。</p>\n" +
    "      <ol>\n" +
    "        <li>「実験参加者」タブの「新規」タブを選択します。</li>\n" +
    "        <li>「氏名」など必要な情報を入力します。</li>\n" +
    "        <li>「送信」ボタンを押します。</li>\n" +
    "      </ol>\n" +
    "      <img src=\"images/help/new-participant.png\" class=\"img-responsive img-thumbnail\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div id=\"help-interview\">\n" +
    "    <h1>3. インタビュー</h1>\n" +
    "    <div id=\"help-origina\">\n" +
    "      <h2>3.1. オリジナル評価項目の抽出</h2>\n" +
    "      <p>回答者が対象に対して抱いている評価に関与する項目を「評価項目」と呼びます</p>\n" +
    "      <p>エレメント間の優劣を回答者に判断してもらい、その判断理由を訪ねることで、評価項目を抽出します。</p>\n" +
    "      <p>ここで得られる評価項目を特に「オリジナル評価項目」と呼びます。</p>\n" +
    "      <p>エレメントの提示方法には様々なバリエーションがありますが、ここでは讃井教授が初期に提案した方法に従います。</p>\n" +
    "      <p>まず、回答者に、エレメント群を「好ましい」ものから「好ましくない」ものまで5段階に分類してもらいます。</p>\n" +
    "      <p>説明のためこれらのグループを順番にA、B、C、D、Eと名付けます。</p>\n" +
    "      <p>エレメントの提示とオリジナル評価項目の抽出には以下のように質問をします。</p>\n" +
    "      <p>Q.「B〜EのエレメントよりもこちらのAのエレメントの方がより好ましいということですが、そう判断された理由のうちあなたにとって重要なものを、どんなものでもかまいませんので、思い付くまま、1つずつ言ってください。なお、これらのうち特定のものにだけあてはまる理由でもかまいません。」</p>\n" +
    "      <p>回答者が新しい評価項目を見いだせなくなったら次の組合わせに移り、「C〜EのエレメントよりもこちらのBのエレメントの方が〜」と質問を行います。</p>\n" +
    "      <p>「D、EのエレメントとCのエレメント」、「EのエレメントとDのエレメント」というように繰り返していきます。</p>\n" +
    "      <p>一連の質問を終えたら、最後に評価が高いグループの不満点を尋ねることで評価項目の補完を行うこともあります。</p>\n" +
    "      <p>抽出した評価項目は以下のような手順で逐一E-Gridに入力してください。</p>\n" +
    "      <ol>\n" +
    "        <li>インタビュー画面左上の「追加」ボタンを押します。</li>\n" +
    "        <li>評価項目入力ダイアログが開かれるので、抽出した評価項目を文章で入力する。この時、既に他の回答者から得られている評価項目のうち入力中の評価項目に近いものが一覧表示されるので、同じ内容を指す評価項目がある場合はそこから選択することで、分析時に類似評価項目を探索する手間が省けます。</li>\n" +
    "        <li>「送信」ボタン、またはリスト表示された評価項目の「選択」ボタンを押すことでオリジナル評価項目が追加されます。</li>\n" +
    "      </ol>\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-xs-6\">\n" +
    "          <img src=\"images/help/before-append-item.png\" class=\"img-responsive img-thumbnail\"/>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-6\">\n" +
    "          <img src=\"images/help/input-item.png\" class=\"img-responsive img-thumbnail\"/>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div id=\"help-laddering\">\n" +
    "      <h2>3.2. ラダーリング</h2>\n" +
    "      <h3>3.2.1. ラダーアップ</h3>\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-xs-6\">\n" +
    "          <img src=\"images/help/before-ladder-up.png\" class=\"img-responsive img-thumbnail\"/>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-6\">\n" +
    "          <img src=\"images/help/after-ladder-up.png\" class=\"img-responsive img-thumbnail\"/>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <h3>3.2.2. ラダーダウン</h3>\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-xs-6\">\n" +
    "          <img src=\"images/help/before-ladder-down.png\" class=\"img-responsive img-thumbnail\"/>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-6\">\n" +
    "          <img src=\"images/help/after-ladder-down.png\" class=\"img-responsive img-thumbnail\"/>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div id=\"help-analysis\">\n" +
    "    <h1>4. 分析</h1>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"col-xs-3\">\n" +
    "  <ul class=\"nav\">\n" +
    "    <a href=\"#help-interview\">インタビュー</a>\n" +
    "  </ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/input-text-dialog.html',
    "<div class=\"modal-header\">\n" +
    "  <h3>{{'EGM.APP.INPUT_EVALUATION_FACTOR' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <form class=\"form-horizontal\" ng-submit=\"close(result)\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <input type=\"text\" class=\"form-control\" ng-model=\"result\" focus-me/>\n" +
    "      </div>\n" +
    "      <div class=\"col-sm-2\">\n" +
    "        <input type=\"submit\" class=\"btn btn-primary\" value=\"{{'ACTION.SUBMIT' | translate}}\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "  <table class=\"table table-hover\">\n" +
    "    <tr ng-repeat=\"text in texts | filter:result\" ng-dblclick=\"close(text.text)\">\n" +
    "      <td>{{text.text}}</td>\n" +
    "      <td>{{text.weight}}</td>\n" +
    "      <td><button class=\"btn btn-default\" ng-click=\"close(text.text)\">{{'ACTION.SELECT' | translate}}</button></td>\n" +
    "    </li>\n" +
    "  </table>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button class=\"btn btn-primary\" ng-click=\"close()\">{{ 'ACTION.CLOSE' | translate }}</button>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/projects/all.html',
    "<h2>{{'PROJECT.PROJECTS' | translate}}</h2>\n" +
    "\n" +
    "<ol class=\"breadcrumb\">\n" +
    "  <li class=\"active\">{{'PROJECT.PROJECTS' | translate}}</li>\n" +
    "</ol>\n" +
    "\n" +
    "<ul class=\"nav nav-tabs\">\n" +
    "  <li ui-sref-active=\"active\">\n" +
    "    <a ui-sref=\"egrid.projects.all.list\">{{'ACTION.LIST' | translate}}</a>\n" +
    "  </li>\n" +
    "  <li ui-sref-active=\"active\">\n" +
    "    <a ui-sref=\"egrid.projects.all.new\">{{'ACTION.NEW' | translate}}</a>\n" +
    "  </li>\n" +
    "</ul>\n" +
    "\n" +
    "<div class=\"tab-content\">\n" +
    "  <div class=\"tab-pane active\">\n" +
    "    <div ui-view=\"tab-content\"></div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/projects/all/list.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <nav>\n" +
    "      <form class=\"form-inline col-sm-4 col-sm-offset-8 search-control\">\n" +
    "        <div class=\"input-group\">\n" +
    "          <input type=\"text\" class=\"form-control\" placeholder=\"{{'ACTION.SEARCH' | translate}}\" ng-model=\"ctrl.query.name\" />\n" +
    "          <span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-search\"></span></span>\n" +
    "        </div>\n" +
    "      </form>\n" +
    "    </nav>\n" +
    "  </div>\n" +
    "  <table class=\"table table-bordered\">\n" +
    "    <thead>\n" +
    "      <tr>\n" +
    "        <th class=\"col-sm-1\">#</th>\n" +
    "        <th class=\"col-sm-3\">\n" +
    "          <a href ng-click=\"ctrl.changeOrder('name')\">{{'PROJECT.ATTRIBUTES.NAME' | translate}}</a>\n" +
    "        </th>\n" +
    "        <th class=\"col-sm-3\">\n" +
    "          <a href ng-click=\"ctrl.changeOrder('createdAt')\">{{'PROJECT.ATTRIBUTES.CREATED_AT' | translate}}</a>\n" +
    "        </th>\n" +
    "        <th class=\"col-sm-3\">\n" +
    "          <a href ng-click=\"ctrl.changeOrder('updatedAt')\">{{'PROJECT.ATTRIBUTES.UPDATED_AT' | translate}}</a>\n" +
    "        </th>\n" +
    "        <th class=\"col-sm-2\">{{'ACTION.ACTION' | translate}}</th>\n" +
    "      </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "      <tr ng-repeat=\"project in ctrl.projects | filter:ctrl.query | orderBy:ctrl.predicate:ctrl.reverse | pager:ctrl.currentPage:ctrl.itemsPerPage\">\n" +
    "        <td>{{$index + 1 + ctrl.itemsPerPage * (ctrl.currentPage - 1)}}</td>\n" +
    "        <td>{{project.name}}</td>\n" +
    "        <td>{{project.createdAt | date:'yyyy/MM/dd HH:mm'}}</td>\n" +
    "        <td>{{project.updatedAt | date:'yyyy/MM/dd HH:mm'}}</td>\n" +
    "        <td><a ui-sref=\"egrid.projects.get.detail({ projectKey: project.key })\">{{'ACTION.SHOW' | translate}}</a>\n" +
    "      </tr>\n" +
    "    </tbody>\n" +
    "  </table>\n" +
    "  <pagination total-items=\"ctrl.projects | filter:ctrl.query | count\" page=\"ctrl.currentPage\" items-per-page=\"ctrl.itemsPerPage\"></pagination>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/projects/all/new.html',
    "<div>\n" +
    "  <form class=\"form-horizontal\" ng-submit=\"newProject.submit()\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\" for=\"name\">{{'PROJECT.ATTRIBUTES.NAME' | translate}}</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <input class=\"form-control\" type=\"text\" name=\"name\" placeholder=\"{{'PROJECT.ATTRIBUTES.PLACEHOLDERS.NAME' | translate}}\" ng-model=\"newProject.name\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\" for=\"note\">{{'PROJECT.ATTRIBUTES.NOTE' | translate}}</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <textarea class=\"form-control\" name=\"note\" rows=\"3\" placeholder=\"{{'PROJECT.ATTRIBUTES.PLACEHOLDERS.NOTE' | translate}}\" ng-model=\"newProject.note\">&nbsp;</textarea>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <div class=\"col-sm-offset-2 col-sm-10\">\n" +
    "        <input type=\"submit\" class=\"btn btn-default\" value=\"{{'ACTION.SUBMIT' | translate}}\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/projects/get.html',
    "<div>\n" +
    "  <h2>{{project.name}}</h2>\n" +
    "\n" +
    "  <ol class=\"breadcrumb\">\n" +
    "    <li><a href ui-sref=\"egrid.projects.all.list\">{{'PROJECT.PROJECTS' | translate}}</a></li>\n" +
    "    <li class=\"active\">{{project.name}}</li>\n" +
    "  </ol>\n" +
    "\n" +
    "  <ul class=\"nav nav-tabs\">\n" +
    "    <li ui-sref-active=\"active\">\n" +
    "      <a ui-sref=\"egrid.projects.get.detail\">{{'ACTION.DETAIL' | translate}}</a>\n" +
    "    </li>\n" +
    "    <li ng-class=\"{active: ('egrid.projects.get.participants.all' | includedByState)}\">\n" +
    "      <a ui-sref=\"egrid.projects.get.participants.all.list\">{{'PARTICIPANT.PARTICIPANTS' | translate}}</a>\n" +
    "    </li>\n" +
    "    <li ng-class=\"{active: ('egrid.projects.get.analyses.all' | includedByState)}\">\n" +
    "      <a ui-sref=\"egrid.projects.get.analyses.all.list\">{{'EGM.ANALYSIS' | translate}}</a>\n" +
    "    </li>\n" +
    "    <li ng-class=\"{active: ('egrid.projects.get.collaborators.all' | includedByState)}\">\n" +
    "      <a ui-sref=\"egrid.projects.get.collaborators.all.list\">{{'COLLABORATOR.COLLABORATOR' | translate}}</a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <div class=\"tab-content\">\n" +
    "    <div class=\"tab-pane active\">\n" +
    "      <div ui-view=\"tab-content\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/projects/get/analyses/all.html',
    "<div>\n" +
    "  <ul class=\"nav nav-tabs\">\n" +
    "    <li ui-sref-active=\"active\">\n" +
    "      <a ui-sref=\"egrid.projects.get.analyses.all.list\">{{'ACTION.LIST' | translate}}</a>\n" +
    "    </li>\n" +
    "    <li ui-sref-active=\"active\">\n" +
    "      <a ui-sref=\"egrid.projects.get.analyses.all.new\">{{'ACTION.NEW' | translate}}</a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <div class=\"tab-content\">\n" +
    "    <div class=\"tab-pane active\">\n" +
    "      <div ui-view=\"sub-tab-content\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/projects/get/analyses/all/list.html',
    "<div>\n" +
    "  <table class=\"table table-bordered\">\n" +
    "    <thead>\n" +
    "      <tr>\n" +
    "        <th class=\"col-sm-1\">#</th>\n" +
    "        <th class=\"col-sm-3\">{{'PROJECT_GRID.ATTRIBUTES.NAME' | translate}}</th>\n" +
    "        <th class=\"col-sm-3\">{{'PROJECT_GRID.ATTRIBUTES.CREATED_AT' | translate}}</th>\n" +
    "        <th class=\"col-sm-3\">{{'PROJECT_GRID.ATTRIBUTES.UPDATED_AT' | translate}}</th>\n" +
    "        <th class=\"col-sm-2\">{{'ACTION.ACTION' | translate}}</th>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "      <tr ng-repeat=\"analysis in analyses.list\">\n" +
    "        <td>{{$index + 1}}</td>\n" +
    "        <td>{{analysis.name}}</td>\n" +
    "        <td>{{analysis.createdAt | date:'yyyy/MM/dd HH:mm'}}</td>\n" +
    "        <td>{{analysis.updatedAt | date:'yyyy/MM/dd HH:mm'}}</td>\n" +
    "        <td><a ui-sref=\"egrid.projects.get.analyses.get.detail({analysisKey: analysis.key})\">{{'ACTION.SHOW' | translate}}</td>\n" +
    "      </tr>\n" +
    "    </tbody>\n" +
    "  </table>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/projects/get/analyses/all/new.html',
    "<div>\n" +
    "  <form class=\"form-horizontal\" ng-submit=\"analysis.submit()\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\" for=\"name\">{{'PROJECT.ATTRIBUTES.NAME' | translate}}</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <input class=\"form-control\" type=\"text\" name=\"name\" placeholder=\"{{'PROJECT.ATTRIBUTES.PLACEHOLDERS.NAME' | translate}}\" ng-model=\"analysis.data.name\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <div class=\"col-sm-offset-2 col-sm-10\">\n" +
    "        <input type=\"submit\" class=\"btn btn-default\" value=\"{{'ACTION.SUBMIT' | translate}}\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/projects/get/analyses/get.html',
    "<div>\n" +
    "  <h2>{{analysis.analysis.name}}</h2>\n" +
    "  <ol class=\"breadcrumb\">\n" +
    "    <li><a href ui-sref=\"egrid.projects.all.list\">{{'PROJECT.PROJECTS' | translate}}</a></li>\n" +
    "    <li><a href ui-sref=\"egrid.projects.get.detail\">{{analysis.analysis.project.name}}</a></li>\n" +
    "    <li><a href ui-sref=\"egrid.projects.get.analyses.all.list\">{{'EGM.ANALYSIS' | translate}}</a></li>\n" +
    "    <li class=\"active\">{{analysis.analysis.name}}</li>\n" +
    "  </ol>\n" +
    "\n" +
    "  <ul class=\"nav nav-tabs\">\n" +
    "    <li ui-sref-active=\"active\">\n" +
    "      <a ui-sref=\"egrid.projects.get.analyses.get.detail\">{{'ACTION.DETAIL' | translate}}</a>\n" +
    "    </li>\n" +
    "    <li ui-sref-active=\"active\">\n" +
    "      <a ui-sref=\"egrid.projects.get.analyses.get.grid\">評価構造</a>\n" +
    "    </li>\n" +
    "    <li ui-sref-active=\"active\">\n" +
    "      <a ui-sref=\"egrid.projects.get.analyses.get.questionnaire\">アンケート設定</a>\n" +
    "    </li>\n" +
    "    <li ui-sref-active=\"active\">\n" +
    "      <a ui-sref=\"egrid.projects.get.analyses.get.sem\">共分散構造分析</a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <div class=\"tab-content\">\n" +
    "    <div class=\"tab-pane active\">\n" +
    "      <div ui-view=\"tab-content\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/projects/get/analyses/get/detail.html',
    "<div>\n" +
    "  <form class=\"form-horizontal\" ng-submit=\"analysis.update()\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"control-label col-sm-2\" for=\"name\">{{'PROJECT.ATTRIBUTES.NAME' | translate}}</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <input class=\"form-control\" type=\"text\" name=\"name\" placeholder=\"{{'PROJECT.ATTRIBUTES.PLACEHOLDERS.NAME' | translate}}\" ng-model=\"analysis.analysis.name\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <div class=\"col-sm-offset-2 col-sm-1\">\n" +
    "        <input type=\"submit\" class=\"btn btn-default\" value=\"{{'ACTION.SUBMIT' | translate}}\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "  <form class=\"form-horizontal\" ng-submit=\"ctrl.confirm()\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <div class=\"col-sm-offset-11 col-sm-1\">\n" +
    "        <input type=\"submit\" class=\"btn btn-danger\" value=\"{{'ACTION.REMOVE' | translate}}\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/projects/get/analyses/get/grid.html',
    "<div>\n" +
    "  <h3>評価構造図</h3>\n" +
    "  <div class=\"navbar navbar-default\">\n" +
    "    <div class=\"navbar-collapse\">\n" +
    "      <form class=\"navbar-form\">\n" +
    "        <a ui-sref=\"egrid.projects.get.analyses.get.grid.detail\" class=\"btn btn-primary\">{{'ACTION.EDIT' | translate}}</a>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"thumbnail\" style=\"height: 500px;\">\n" +
    "    <svg id=\"display\" width=\"100%\" height=\"100%\"></svg>\n" +
    "  </div>\n" +
    "  <h3>サマリー</h3>\n" +
    "  <table class=\"table table-bordered\">\n" +
    "    <tr>\n" +
    "      <th class=\"col-xs-6\">評価項目数</th>\n" +
    "      <td class=\"col-xs-6\">{{grid.egm.nodes().length}}</td>\n" +
    "    </tr>\n" +
    "    <tr>\n" +
    "      <th>接続数</th>\n" +
    "      <td>{{grid.egm.links().length}}</td>\n" +
    "    </tr>\n" +
    "  </table>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/projects/get/analyses/get/grid/detail.html',
    "<div>\n" +
    "  <div class=\"navbar navbar-default navbar-fixed-top\" style=\"top: 50px;\">\n" +
    "    <div class=\"container\">\n" +
    "      <form class=\"navbar-form navbar-left\">\n" +
    "        <a class=\"btn btn-default\" id=\"filterButton\">{{'ACTION.FILTER' | translate}}</a>\n" +
    "        <a class=\"btn btn-default\" id=\"layoutButton\">{{'EGM.APP.LAYOUT_SETTINGS' | translate}}</a>\n" +
    "        <a class=\"btn btn-default\" id=\"appendNodeButton\"><i class=\"glyphicon glyphicon-pencil\"></i>{{'ACTION.APPEND' | translate}}</a>\n" +
    "      </form>\n" +
    "      <form class=\"navbar-form navbar-right\">\n" +
    "        <a class=\"btn btn-default pull-right\" id=\"saveButton\" ng-click=\"projectGrid.save()\"><i class=\"glyphicon glyphicon-share\"></i>{{'ACTION.SAVE' | translate}}</a>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div style=\"position: absolute; left: 0; top: 100px; overflow: hidden;\">\n" +
    "    <svg id=\"display\" style=\"display: block;\"></svg>\n" +
    "    <div id=\"nodeController\" class=\"btn-group invisible\" style=\"position: absolute; top: 0; left: 0;\">\n" +
    "      <button id=\"removeNodeButton\" class=\"btn btn-default\" title=\"{{'ACTION.REMOVE' | translate}}\"><span class=\"glyphicon glyphicon-remove\"></i></button>\n" +
    "      <button id=\"mergeNodeButton\" class=\"btn btn-default\" title=\"{{'ACTION.MERGE' | translate}}\"><span class=\"glyphicon glyphicon-plus\"></i></button>\n" +
    "      <button id=\"editNodeButton\" class=\"btn btn-default\" title=\"{{'ACTION.EDIT' | translate}}\"><span class=\"glyphicon glyphicon-pencil\"></span></button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"navbar navbar-default navbar-fixed-bottom\">\n" +
    "    <div class=\"container\">\n" +
    "      <form class=\"navbar-form navbar-left\">\n" +
    "        <a class=\"btn btn-default\" id=\"undoButton\"><i class=\"glyphicon glyphicon-arrow-left\"></i>{{'ACTION.UNDO' | translate}}</a>\n" +
    "        <a class=\"btn btn-default\" id=\"redoButton\"><i class=\"glyphicon glyphicon-arrow-right\"></i>{{'ACTION.REDO' | translate}}</a>\n" +
    "      </form>\n" +
    "      <form class=\"navbar-form navbar-right\">\n" +
    "        <a ng-click=\"projectGrid.exportJSON($event)\" class=\"btn btn-default\" id=\"exportJSON\" target=\"_blank\"><i class=\"glyphicon glyphicon-floppy-save\"></i>JSON {{'ACTION.EXPORT' | translate}}</a>\n" +
    "        <a class=\"btn btn-default\" id=\"exportSVG\" target=\"_blank\"><i class=\"glyphicon glyphicon-floppy-save\"></i>SVG {{'ACTION.EXPORT' | translate}}</a>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/projects/get/analyses/get/questionnaire.html',
    "<div class=\"tab-pane active\">\n" +
    "  <h2>アンケート設定</h2>\n" +
    "  <form class=\"form-horizontal\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\">アンケート題名</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <input class=\"form-control\" type=\"text\" placeholder=\"アンケート題名\" ng-model=\"questionnaire.data.title\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\">アンケート説明</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <textarea class=\"form-control\" placeholder=\"アンケート説明\" ng-model=\"questionnaire.data.description\"></textarea>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "\n" +
    "  <h3>質問項目設定</h3>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"span8\">\n" +
    "      <div id=\"sem-questionnaire-design-display\">\n" +
    "        <svg width=\"100%\" height=\"500px\"></svg>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"span4\" style=\"height: 500px; overflow: scroll;\">\n" +
    "      <table class=\"table\">\n" +
    "        <tr ng-repeat=\"item in questionnaire.items\">\n" +
    "          <td>\n" +
    "            <label class=\"checkbox\">\n" +
    "              <input type=\"checkbox\" ng-model=\"item.checked\" ng-change=\"questionnaire.updateItems()\"/>{{item.text}}\n" +
    "            </label>\n" +
    "          </td>\n" +
    "          <td>{{item.weight}}</td>\n" +
    "        </tr>\n" +
    "      </table>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div>\n" +
    "    <div ng-repeat=\"item in questionnaire.data.items\">\n" +
    "      <form class=\"form-horizontal\">\n" +
    "        <fieldset>\n" +
    "          <legend>{{item.text}}</legend>\n" +
    "          <div class=\"control-group\">\n" +
    "            <label class=\"control-label\">質問項目</label>\n" +
    "            <div class=\"controls\">\n" +
    "              <input class=\"span6\" type=\"text\" ng-model=\"item.title\"/>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"control-group\">\n" +
    "            <label class=\"control-label\">質問文</label>\n" +
    "            <div class=\"controls\">\n" +
    "              <textarea class=\"span6\" rows=\"3\" ng-model=\"item.description\"></textarea>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </fieldset>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div>\n" +
    "    <a class=\"btn btn-primary btn-large\">{{'ACTION.SAVE' | translate}}</a>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/projects/get/analyses/get/sem.html',
    "<div class=\"tab-pane active\" select=\"drawSemAnalysis()\">\n" +
    "  <div id=\"sem-analysis-display\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"span10\">\n" +
    "        <svg width=\"100%\" height=\"500px\"></svg>\n" +
    "      </div>\n" +
    "      <div class=\"span2\">\n" +
    "        <table class=\"table\">\n" +
    "          <tr ng-repeat=\"item in items\">\n" +
    "            <td>\n" +
    "              <label class=\"checkbox\">\n" +
    "                <input type=\"checkbox\" ng-model=\"item.active\" ng-change=\"removeNode()\"/>{{ item.text }}\n" +
    "              </label>\n" +
    "            </td>\n" +
    "          </tr>\n" +
    "        </table>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/projects/get/collaborators/all.html',
    "<div>\n" +
    "  <ul class=\"nav nav-tabs\">\n" +
    "    <li ui-sref-active=\"active\">\n" +
    "      <a ui-sref=\"egrid.projects.get.collaborators.all.list\">{{'ACTION.LIST' | translate}}</a>\n" +
    "    </li>\n" +
    "    <li ui-sref-active=\"active\">\n" +
    "      <a ui-sref=\"egrid.projects.get.collaborators.all.new\">{{'ACTION.NEW' | translate}}</a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <div class=\"tab-content\">\n" +
    "    <div class=\"tab-pane active\">\n" +
    "      <div ui-view=\"sub-tab-content\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/projects/get/collaborators/all/list.html',
    "<div>\n" +
    "  <table class=\"table\">\n" +
    "    <thead>\n" +
    "      <tr>\n" +
    "        <th>#</th>\n" +
    "        <th>{{'COLLABORATOR.ATTRIBUTES.USER' | translate}}</th>\n" +
    "        <th>{{'COLLABORATOR.ROLE.ROLE' | translate}}</th>\n" +
    "        <th>{{'ACTION.ACTION' | translate}}</th>\n" +
    "      </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "      <tr ng-repeat=\"collaborator in collaborators.collaborators.toArray()\">\n" +
    "        <td>{{ $index + 1 }}</td>\n" +
    "        <td>{{collaborator.user.nickname}}</td>\n" +
    "        <td ng-if=\"collaborator.isManager\">{{'COLLABORATOR.ROLE.MANAGER' | translate}}</td>\n" +
    "        <td ng-if=\"!collaborator.isManager\">{{'COLLABORATOR.ROLE.USER' | translate}}</td>\n" +
    "        <td><a href ng-click=\"collaborators.confirm(collaborator.key)\">{{'ACTION.REMOVE' | translate}}</td>\n" +
    "      </tr>\n" +
    "    </tbody>\n" +
    "  </table>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/projects/get/collaborators/all/new.html',
    "<div>\n" +
    "  <form class=\"form-horizontal\" ng-submit=\"newCollaborator.submit()\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\" for=\"name\">{{'COLLABORATOR.ATTRIBUTES.USER' | translate}}</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <input class=\"col-sm-10 form-control\" type=\"text\" name=\"name\" placeholder=\"{{'COLLABORATOR.ATTRIBUTES.PLACEHOLDERS.USER' | translate }}\" ng-model=\"newCollaborator.data.userEmail\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\" for=\"note\">{{'COLLABORATOR.ROLE.ROLE' | translate}}</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" ng-model=\"newCollaborator.data.isManager\"/>{{'COLLABORATOR.ROLE.MANAGER' | translate}}\n" +
    "          </label>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <div class=\"col-sm-offset-2 col-sm-10\">\n" +
    "        <input type=\"submit\" class=\"btn btn-default\" value=\"{{ 'ACTION.SUBMIT' | translate }}\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/projects/get/detail.html',
    "<div>\r" +
    "\n" +
    "  <form class=\"form-horizontal\" ng-submit=\"ctrl.update()\">\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <label class=\"control-label col-sm-2\" for=\"name\">{{'PROJECT.ATTRIBUTES.NAME' | translate}}</label>\r" +
    "\n" +
    "      <div class=\"col-sm-10\">\r" +
    "\n" +
    "        <input class=\"form-control\" type=\"text\" name=\"name\" placeholder=\"{{'PROJECT.ATTRIBUTES.PLACEHOLDERS.NAME' | translate}}\" ng-model=\"ctrl.project.name\"/>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <label class=\"control-label col-sm-2\" for=\"note\">{{'PROJECT.ATTRIBUTES.NOTE' | translate}}</label>\r" +
    "\n" +
    "      <div class=\"col-sm-10\">\r" +
    "\n" +
    "        <textarea class=\"form-control\" name=\"note\" rows=\"3\" placeholder=\"{{'PROJECT.ATTRIBUTES.PLACEHOLDERS.NOTE' | translate}}\" ng-model=\"ctrl.project.note\">&nbsp;</textarea>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <div class=\"col-sm-offset-2 col-sm-1\">\r" +
    "\n" +
    "        <input type=\"submit\" class=\"btn btn-default\" value=\"{{'ACTION.SUBMIT' | translate}}\"/>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </form>\r" +
    "\n" +
    "  <form class=\"form-horizontal\" ng-submit=\"ctrl.confirm()\">\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <div class=\"col-sm-offset-11 col-sm-1\">\r" +
    "\n" +
    "        <input type=\"submit\" class=\"btn btn-danger\" value=\"{{'ACTION.REMOVE' | translate}}\"/>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </form>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/projects/get/participants/all.html',
    "<div>\n" +
    "  <ul class=\"nav nav-tabs\">\n" +
    "    <li ui-sref-active=\"active\">\n" +
    "      <a ui-sref=\"egrid.projects.get.participants.all.list\">{{'ACTION.LIST' | translate}}</a>\n" +
    "    </li>\n" +
    "    <li ui-sref-active=\"active\">\n" +
    "      <a ui-sref=\"egrid.projects.get.participants.all.new\">{{'ACTION.NEW' | translate}}</a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <div class=\"tab-content\">\n" +
    "    <div class=\"tab-pane active\">\n" +
    "      <div ui-view=\"sub-tab-content\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/projects/get/participants/all/list.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <nav>\n" +
    "      <form class=\"form-inline col-sm-4 col-sm-offset-8 search-control\">\n" +
    "        <div class=\"input-group\">\n" +
    "          <input type=\"text\" class=\"form-control\" placeholder=\"{{'ACTION.SEARCH' | translate}}\" ng-model=\"ctrl.query.name\" />\n" +
    "          <span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-search\"></span></span>\n" +
    "        </div>\n" +
    "      </form>\n" +
    "    </nav>\n" +
    "  </div>\n" +
    "  <table class=\"table table-bordered\">\n" +
    "    <thead>\n" +
    "      <tr>\n" +
    "        <th class=\"col-sm-1\">#</th>\n" +
    "        <th class=\"col-sm-3\">\n" +
    "          <a href ng-click=\"ctrl.changeOrder('name')\">{{'PARTICIPANT.ATTRIBUTES.NAME' | translate}}</a>\n" +
    "        </th>\n" +
    "        <th class=\"col-sm-3\">\n" +
    "          <a href ng-click=\"ctrl.changeOrder('createdAt')\">{{'PARTICIPANT.ATTRIBUTES.CREATED_AT' | translate}}</a>\n" +
    "        </th>\n" +
    "        <th class=\"col-sm-3\">\n" +
    "          <a href ng-click=\"ctrl.changeOrder('updatedAt')\">{{'PARTICIPANT.ATTRIBUTES.UPDATED_AT' | translate}}</a>\n" +
    "        </th>\n" +
    "        <th class=\"col-sm-2\">{{'ACTION.ACTION' | translate}}</th>\n" +
    "      </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "      <tr ng-repeat=\"participant in ctrl.participants | filter:ctrl.query | orderBy:ctrl.predicate:ctrl.reverse | pager:ctrl.currentPage:ctrl.itemsPerPage\">\n" +
    "        <td>{{$index + 1 + ctrl.itemsPerPage * (ctrl.currentPage - 1)}}</td>\n" +
    "        <td>{{participant.name}}</td>\n" +
    "        <td>{{participant.createdAt | date:'yyyy/MM/dd HH:mm'}}</td>\n" +
    "        <td>{{participant.updatedAt | date:'yyyy/MM/dd HH:mm'}}</td>\n" +
    "        <td><a ui-sref=\"egrid.projects.get.participants.get.detail({participantKey: participant.key})\">{{'ACTION.SHOW' | translate}}</a>\n" +
    "      </tr>\n" +
    "    </tbody>\n" +
    "  </table>\n" +
    "  <pagination total-items=\"ctrl.participants | filter:ctrl.query | count\" page=\"ctrl.currentPage\" items-per-page=\"ctrl.itemsPerPage\"></pagination>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/projects/get/participants/all/new.html',
    "<div>\r" +
    "\n" +
    "  <form class=\"form-horizontal\" ng-submit=\"newParticipant.submit()\">\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <label class=\"control-label col-sm-2\" for=\"name\">{{'PARTICIPANT.ATTRIBUTES.NAME' | translate}}</label>\r" +
    "\n" +
    "      <div class=\"col-sm-10\">\r" +
    "\n" +
    "        <input class=\"form-control\" type=\"text\" name=\"name\" placeholder=\"{{'PARTICIPANT.ATTRIBUTES.PLACEHOLDERS.NAME' | translate}}\" ng-model=\"newParticipant.name\"/>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <label class=\"control-label col-sm-2\" for=\"note\">{{'PARTICIPANT.ATTRIBUTES.NOTE' | translate}}</label>\r" +
    "\n" +
    "      <div class=\"col-sm-10\">\r" +
    "\n" +
    "        <textarea class=\"form-control\" name=\"note\" rows=\"3\" placeholder=\"{{ 'PARTICIPANT.ATTRIBUTES.PLACEHOLDERS.NOTE' | translate }}\" ng-model=\"newParticipant.note\">&nbsp;</textarea>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <div class=\"col-sm-offset-2 col-sm-10\">\r" +
    "\n" +
    "        <input type=\"submit\" class=\"btn btn-default\" value=\"{{'ACTION.SUBMIT' | translate}}\"/>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </form>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/projects/get/participants/get.html',
    "<div>\n" +
    "  <h2>{{ctrl.participant.name}}</h2>\n" +
    "\n" +
    "  <ol class=\"breadcrumb\">\n" +
    "    <li>\n" +
    "      <a ui-sref=\"egrid.projects.all.list\">{{'PROJECT.PROJECTS' | translate}}</a>\n" +
    "    </li>\n" +
    "    <li>\n" +
    "      <a ui-sref=\"egrid.projects.get.detail\">{{ctrl.participant.project.name}}</a>\n" +
    "    </li>\n" +
    "    <li>\n" +
    "      <a ui-sref=\"egrid.projects.get.participants.all.list\">{{'PARTICIPANT.PARTICIPANTS' | translate}}</a>\n" +
    "    </li>\n" +
    "    <li class=\"active\">\n" +
    "      {{ctrl.participant.name}}\n" +
    "    </li>\n" +
    "  </ol>\n" +
    "\n" +
    "  <ul class=\"nav nav-tabs\">\n" +
    "    <li ui-sref-active=\"active\">\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"egrid.projects.get.participants.get.detail\">{{'ACTION.DETAIL' | translate}}</a>\n" +
    "    </li>\n" +
    "    <li ui-sref-active=\"active\">\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"egrid.projects.get.participants.get.grid\">{{'EGM.EVALUATION_STRUCTURE' | translate}}</a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <div class=\"tab-content\">\n" +
    "    <div class=\"tab-pane active\">\n" +
    "      <div ui-view=\"tab-content\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/projects/get/participants/get/detail.html',
    "<div>\r" +
    "\n" +
    "  <form class=\"form-horizontal\" ng-submit=\"ctrl.update()\">\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <label class=\"control-label col-sm-2\" for=\"name\">{{ 'PARTICIPANT.ATTRIBUTES.NAME' | translate }}</label>\r" +
    "\n" +
    "      <div class=\"col-sm-10\">\r" +
    "\n" +
    "        <input class=\"form-control\" type=\"text\" name=\"name\" placeholder=\"{{ 'PARTICIPANT.ATTRIBUTES.PLACEHOLDERS.NAME' | translate }}\" ng-model=\"ctrl.participant.name\"/>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <label class=\"control-label col-sm-2\" for=\"note\">{{ 'PARTICIPANT.ATTRIBUTES.NOTE' | translate }}</label>\r" +
    "\n" +
    "      <div class=\"col-sm-10\">\r" +
    "\n" +
    "        <textarea class=\"form-control\" name=\"note\" rows=\"3\" placeholder=\"{{ 'PARTICIPANT.ATTRIBUTES.PLACEHOLDERS.NOTE' | translate }}\" ng-model=\"ctrl.participant.note\">&nbsp;</textarea>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <div class=\"col-sm-offset-2 col-sm-1\">\r" +
    "\n" +
    "        <input type=\"submit\" class=\"btn btn-default\" value=\"{{'ACTION.SUBMIT' | translate}}\"/>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </form>\r" +
    "\n" +
    "  <form class=\"form-horizontal\" ng-submit=\"ctrl.confirm()\">\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <div class=\"col-sm-offset-11 col-sm-1\">\r" +
    "\n" +
    "        <input type=\"submit\" class=\"btn btn-danger\" value=\"{{'ACTION.REMOVE' | translate}}\"/>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </form>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/projects/get/participants/get/grid.html',
    "<div>\n" +
    "  <h3>評価構造図</h3>\n" +
    "  <div class=\"navbar navbar-default\">\n" +
    "    <div class=\"navbar-collapse\">\n" +
    "      <form class=\"navbar-form\">\n" +
    "        <a ui-sref=\"egrid.projects.get.participants.get.grid.detail\" class=\"btn btn-primary\">{{'ACTION.EDIT' | translate}}</a>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"thumbnail\" style=\"height: 500px;\">\n" +
    "    <svg id=\"display\" width=\"100%\" height=\"100%\"></svg>\n" +
    "  </div>\n" +
    "  <h3>サマリー</h3>\n" +
    "  <table class=\"table table-bordered\">\n" +
    "    <tr>\n" +
    "      <th class=\"span6\">評価項目数</th>\n" +
    "      <td class=\"span6\">{{participantGrid.egm.nodes().length}}</td>\n" +
    "    </tr>\n" +
    "    <tr>\n" +
    "      <th>接続数</th>\n" +
    "      <td>{{participantGrid.egm.links().length}}</td>\n" +
    "    </tr>\n" +
    "  </table>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/projects/get/participants/get/grid/detail.html',
    "<div>\n" +
    "  <div class=\"navbar navbar-default navbar-fixed-top\" style=\"top: 50px;\">\n" +
    "    <div class=\"container\">\n" +
    "      <form class=\"navbar-form navbar-left\">\n" +
    "        <a class=\"btn btn-default\" id=\"appendNodeButton\"><i class=\"glyphicon glyphicon-pencil\"></i>{{'ACTION.APPEND' | translate}}</a>\n" +
    "      </form>\n" +
    "      <form class=\"navbar-form navbar-right\">\n" +
    "        <a class=\"btn btn-default pull-right\" id=\"saveButton\"><i class=\"glyphicon glyphicon-share\"></i>{{'ACTION.SAVE' | translate}}</a>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div style=\"position: absolute; left: 0; top: 100px; overflow: hidden;\">\n" +
    "    <svg id=\"display\" style=\"display: block;\"></svg>\n" +
    "    <div id=\"nodeController\" class=\"btn-group invisible\" style=\"position: absolute; top: 0; left: 0;\">\n" +
    "      <button id=\"ladderUpButton\" class=\"btn btn-default\" title=\"{{'EGM.LADDER_UP' | translate}}\"><span class=\"glyphicon glyphicon-arrow-left\"></span></button>\n" +
    "      <button id=\"removeNodeButton\" class=\"btn btn-default\" title=\"{{'ACTION.REMOVE' | translate}}\"><span class=\"glyphicon glyphicon-remove\"></span></button>\n" +
    "      <button id=\"mergeNodeButton\" class=\"btn btn-default\" title=\"{{'ACTION.MERGE' | translate}}\"><span class=\"glyphicon glyphicon-plus\"></span></button>\n" +
    "      <button id=\"editNodeButton\" class=\"btn btn-default\" title=\"{{'ACTION.EDIT' | translate}}\"><span class=\"glyphicon glyphicon-pencil\"></span></button>\n" +
    "      <button id=\"ladderDownButton\" class=\"btn btn-default\" title=\"{{'EGM.LADDER_DOWN' | translate}}\"><span class=\"glyphicon glyphicon-arrow-right\"></span></button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"navbar navbar-default navbar-fixed-bottom\">\n" +
    "    <div class=\"container\">\n" +
    "      <form class=\"navbar-form navbar-left\">\n" +
    "        <a class=\"btn btn-default\" id=\"undoButton\"><i class=\"glyphicon glyphicon-arrow-left\"></i>{{'ACTION.UNDO' | translate}}</a>\n" +
    "        <a class=\"btn btn-default\" id=\"redoButton\"><i class=\"glyphicon glyphicon-arrow-right\"></i>{{'ACTION.REDO' | translate}}</a>\n" +
    "      </form>\n" +
    "      <form class=\"navbar-form navbar-right\">\n" +
    "        <a ng-click=\"participantGrid.exportJSON($event)\" class=\"btn btn-default\" id=\"exportJSON\" target=\"_blank\"><i class=\"glyphicon glyphicon-floppy-save\"></i>JSON {{'ACTION.EXPORT' | translate}}</a>\n" +
    "        <a class=\"btn btn-default\" id=\"exportSVG\" target=\"_blank\"><i class=\"glyphicon glyphicon-floppy-save\"></i>SVG {{'ACTION.EXPORT' | translate}}</a>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/remove-item-dialog.html',
    "<div class=\"modal-header\">\n" +
    "  <h3>{{'ACTION.DIALOG.REMOVE.HEADING' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <p>\n" +
    "    {{'ACTION.DIALOG.REMOVE.HEADING' | translate}}\n" +
    "  </p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button class=\"btn btn-default\" ng-click=\"cancel()\">{{ 'ACTION.DIALOG.REMOVE.CANCEL' | translate }}</button>\n" +
    "  <button class=\"btn btn-danger\" ng-click=\"ok()\">{{ 'ACTION.DIALOG.REMOVE.OK' | translate }}</button>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/setting-dialog.html',
    "<div class=\"modal-header\">\n" +
    "  <h3>{{ 'EGM.APP.LAYOUT_SETTINGS' | translate }}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <form class=\"form-horizontal\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-4 control-label\">{{ 'EGM.APP.VIEWS.VIEWS' | translate }}</label>\n" +
    "      <div class=\"col-sm-8\">\n" +
    "        <label class=\"radio\"><input type=\"radio\" ng-model=\"options.viewMode\" ng-value=\"ViewMode.Normal\"/>{{'EGM.APP.VIEWS.NORMAL' | translate}}</label>\n" +
    "        <label class=\"radio\"><input type=\"radio\" ng-model=\"options.viewMode\" ng-value=\"ViewMode.Edge\"/>{{'EGM.APP.VIEWS.EDGE' | translate}}</label>\n" +
    "        <label class=\"radio\"><input type=\"radio\" ng-model=\"options.viewMode\" ng-value=\"ViewMode.EdgeAndOriginal\"/>{{'EGM.APP.VIEWS.EDGE_AND_ORIGINAL' | translate}}</label>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-4 control-label\">{{ 'EGM.APP.INACTIVE_NODE.INACTIVE_NODE' | translate }}</label>\n" +
    "      <div class=\"col-sm-8\">\n" +
    "        <label class=\"radio\"><input type=\"radio\" ng-model=\"options.inactiveNode\" ng-value=\"InactiveNode.Hidden\"/>{{ 'EGM.APP.INACTIVE_NODE.HIDDEN' | translate }}</label>\n" +
    "        <label class=\"radio\"><input type=\"radio\" ng-model=\"options.inactiveNode\" ng-value=\"InactiveNode.Transparent\"/>{{ 'EGM.APP.INACTIVE_NODE.TRANSPARENT' | translate }}</label>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-4 control-label\">{{'EGM.APP.SCALING.SCALING' | translate}}</label>\n" +
    "      <div class=\"col-sm-8\">\n" +
    "        <label class=\"radio\"><input type=\"radio\" ng-model=\"options.scaleType\" ng-value=\"ScaleType.None\"/>{{'EGM.APP.SCALING.NONE' | translate}}</label>\n" +
    "        <label class=\"radio\"><input type=\"radio\" ng-model=\"options.scaleType\" ng-value=\"ScaleType.Connection\"/>{{'EGM.APP.SCALING.CONNECTION' | translate}}</label>\n" +
    "        <label class=\"radio\"><input type=\"radio\" ng-model=\"options.scaleType\" ng-value=\"ScaleType.Weight\"/>{{'EGM.APP.SCALING.WEIGHT' | translate}}</label>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-4 control-label\">{{'EGM.APP.SCALING.MAX' | translate}}</label>\n" +
    "      <div class=\"col-sm-8\">\n" +
    "        <input class=\"form-control\" type=\"number\" min=\"1\" ng-model=\"options.maxScale\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-4 control-label\">{{'EGM.APP.LINE_UP' | translate}}</label>\n" +
    "      <div class=\"col-sm-8\">\n" +
    "        <label class=\"checkbox\"><input type=\"checkbox\" ng-model=\"options.lineUpTop\"/>{{'EGM.UPPERMOST_EVALUATION_ITEM' | translate}}</label>\n" +
    "        <label class=\"checkbox\"><input type=\"checkbox\" ng-model=\"options.lineUpBottom\"/>{{'EGM.LOWERMOST_EVALUATION_ITEM' | translate}}</label>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-4 control-label\">{{'EGM.APP.RANK_DIRECTION.RANK_DIRECTION' | translate}}</label>\n" +
    "      <div class=\"col-sm-8\">\n" +
    "        <label class=\"radio\"><input type=\"radio\" ng-model=\"options.rankDirection\" ng-value=\"RankDirection.LR\"/>{{'EGM.APP.RANK_DIRECTION.LR' | translate}}</label>\n" +
    "        <label class=\"radio\"><input type=\"radio\" ng-model=\"options.rankDirection\" ng-value=\"RankDirection.TB\"/>{{'EGM.APP.RANK_DIRECTION.TB' | translate}}</label>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-4 control-label\">{{'EGM.APP.MINIMUM_WEIGHT' | translate}}</label>\n" +
    "      <div class=\"col-sm-8\">\n" +
    "        <input class=\"form-control\" type=\"number\" min=\"1\" ng-model=\"options.minimumWeight\"/>\n" +
    "      </div>\n" +
    "  </form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button class=\"btn btn-default\" ng-click=\"close()\">{{ 'ACTION.CLOSE' | translate }}</button>\n" +
    "</div>\n"
  );

}]);
