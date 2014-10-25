var egrid;
(function (egrid) {
    (function (model) {
        var Entity = (function () {
            function Entity() {
            }
            Object.defineProperty(Entity.prototype, "key", {
                get: function () {
                    return this.key_;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Entity.prototype, "createdAt", {
                get: function () {
                    return this.createdAt_;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Entity.prototype, "updatedAt", {
                get: function () {
                    return this.updatedAt_;
                },
                enumerable: true,
                configurable: true
            });

            Entity.prototype.persisted = function () {
                return !!this.key;
            };
            return Entity;
        })();
        model.Entity = Entity;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        (function (storage) {
            storage.API_URL_BASE = '';

            var Uri;
            (function (Uri) {
                function Analysis(projectKey, analysisKey) {
                    var url = storage.API_URL_BASE + '/api/projects/' + projectKey + '/analyses';
                    if (analysisKey !== undefined) {
                        url += '/' + analysisKey;
                    }
                    return url;
                }
                Uri.Analysis = Analysis;

                function Collaborator(projectKey, collaboratorKey) {
                    var url = storage.API_URL_BASE + '/api/projects/' + projectKey + '/collaborators';
                    if (collaboratorKey !== undefined) {
                        url += '/' + collaboratorKey;
                    }
                    return url;
                }
                Uri.Collaborator = Collaborator;

                function Participant(projectKey, participantKey) {
                    var url = storage.API_URL_BASE + '/api/projects/' + projectKey + '/participants';
                    if (participantKey !== undefined) {
                        url += '/' + participantKey;
                    }
                    return url;
                }
                Uri.Participant = Participant;

                function ParticipantGrid(projectKey, participantKey) {
                    return storage.API_URL_BASE + '/api/projects/' + projectKey + '/participants/' + participantKey + '/grid';
                }
                Uri.ParticipantGrid = ParticipantGrid;

                function Project(projectKey) {
                    var url = storage.API_URL_BASE + '/api/projects';
                    if (projectKey !== undefined) {
                        url += '/' + projectKey;
                    }
                    return url;
                }
                Uri.Project = Project;

                function ProjectGrid(projectKey, analysisKey) {
                    return '/api/projects/' + projectKey + '/analyses/' + analysisKey + '/grid';
                }
                Uri.ProjectGrid = ProjectGrid;

                function Questionnaire(projectKey, analysisKey) {
                    return '/api/projects/' + projectKey + '/analyses/' + analysisKey + '/questionnaire';
                }
                Uri.Questionnaire = Questionnaire;

                function Sem(projectKey, analysisKey) {
                    return '/api/projects/' + projectKey + '/analyses/' + analysisKey + '/sem';
                }
                Uri.Sem = Sem;
            })(Uri || (Uri = {}));

            (function (Api) {
                function get(name, projectKey, key) {
                    return $.ajax({
                        url: Uri[name](projectKey, key),
                        type: 'GET',
                        contentType: 'application/json'
                    }).then(function (r) {
                        return JSON.parse(r);
                    });
                }
                Api.get = get;

                function post(data, name, projectKey) {
                    return $.ajax({
                        url: Uri[name](projectKey),
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(data)
                    }).then(function (r) {
                        return JSON.parse(r);
                    });
                }
                Api.post = post;

                function put(data, name, projectKey, key) {
                    return $.ajax({
                        url: Uri[name](projectKey, key),
                        type: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify(data)
                    }).then(function (r) {
                        return JSON.parse(r);
                    });
                }
                Api.put = put;

                function remove(name, projectKey, key) {
                    return $.ajax({
                        url: Uri[name](projectKey, key),
                        type: 'DELETE'
                    }).then(function (response) {
                        return response;
                    }, function () {
                        var reasons = [];
                        for (var _i = 0; _i < (arguments.length - 0); _i++) {
                            reasons[_i] = arguments[_i + 0];
                        }
                        return reasons[0];
                    });
                }
                Api.remove = remove;

                function retrieve(name, projectKey) {
                    return $.ajax({
                        url: Uri[name](projectKey),
                        type: 'GET',
                        contentType: 'application/json'
                    }).then(function (r) {
                        return JSON.parse(r);
                    }).then(function (values) {
                        var o = {};

                        for (var i = 0, l = values.length; i < l; i++) {
                            o[values[i].key] = values[i];
                        }

                        return o;
                    });
                }
                Api.retrieve = retrieve;
            })(storage.Api || (storage.Api = {}));
            var Api = storage.Api;
        })(model.storage || (model.storage = {}));
        var storage = model.storage;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        (function (storage) {
            var KEY = 'lindo_de_remedio';
            var OUT_OF_SERVICE = 'unsavedItems';
            var STORE = JSON.parse(localStorage.getItem(KEY)) || {};
            flush();

            function flush() {
                var $deferred = $.Deferred();
                var $promises = [];
                var n = OUT_OF_SERVICE;

                if (STORE[n]) {
                    for (var type in STORE[n]) {
                        if (STORE[n].hasOwnProperty(type)) {
                            var v = STORE[n][type];
                            var w;

                            for (var unsaved in v) {
                                if (v.hasOwnProperty(unsaved)) {
                                    w = v[unsaved];

                                    if (w.key && w.createdAt) {
                                        $promises.push(storage.Api.put(w, type, w.key));
                                    } else {
                                        if (w.projectKey) {
                                            $promises.push(storage.Api.post(w, type, w.projectKey));
                                        } else {
                                            $promises.push(storage.Api.post(w, type));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                $.when.apply($, $promises).then(function (v) {
                    if (Array.isArray(v) && !v.length) {
                        $deferred.reject(false);
                    } else {
                        delete STORE[OUT_OF_SERVICE];

                        $deferred.resolve(true);
                    }
                }, function () {
                    $deferred.reject(false);
                });

                return $deferred.promise();
            }

            function add(value, name, projectId, participantId) {
                var $deferred = $.Deferred();
                var $promise;
                var alreadyStored = !!value.key;

                if (alreadyStored) {
                    $promise = storage.Api.put(value, name, projectId, participantId);
                } else {
                    if (projectId) {
                        $promise = storage.Api.post(value, name, projectId);
                    } else {
                        $promise = storage.Api.post(value, name);
                    }
                }

                $promise.then(function (v) {
                    var r;

                    if (!STORE[name]) {
                        STORE[name] = {};
                    }

                    r = Miscellaneousness.merge(STORE[name][v.key], v);

                    if (participantId) {
                        STORE[name][projectId][v.key] = r;
                    } else {
                        STORE[name][v.key] = r;
                    }

                    localStorage.setItem(KEY, JSON.stringify(STORE));

                    $deferred.resolve(v);
                }, function () {
                    var reasons = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        reasons[_i] = arguments[_i + 0];
                    }
                    var k;

                    if (reasons[2] === 'Not authorized') {
                        $deferred.reject(reasons[0]);
                    }

                    STORE = JSON.parse(localStorage.getItem(KEY)) || {};

                    k = (value.key) ? value.key : OUT_OF_SERVICE + Object.keys(STORE[name]).length.valueOf();

                    if (!STORE[OUT_OF_SERVICE]) {
                        STORE[OUT_OF_SERVICE] = Miscellaneousness.construct(name);
                    }

                    if (!value.key) {
                        value.key = k;
                    }

                    STORE[OUT_OF_SERVICE][name][k] = value;

                    localStorage.setItem(KEY, JSON.stringify(STORE));

                    if (projectId && /^unsavedItems[0-9]+$/.test(projectId)) {
                        STORE[name][k] = value;
                    } else if (participantId) {
                        STORE[name][projectId][k] = value;
                    } else {
                        STORE[name][k] = value;
                    }

                    $deferred.reject(reasons[0]);
                });

                return $deferred.promise();
            }
            storage.add = add;

            function get(name, projectId, participantId) {
                var $deferred = $.Deferred();
                var $promise = storage.Api.get(name, projectId, participantId);

                STORE = JSON.parse(localStorage.getItem(KEY)) || {};

                $promise.then(function (value) {
                    if (!STORE[name]) {
                        STORE[name] = {};
                    }

                    if (participantId) {
                        STORE[name][projectId] = Miscellaneousness.construct(participantId);

                        STORE[name][projectId][participantId] = value;
                    } else {
                        STORE[name][projectId] = value;
                    }

                    localStorage.setItem(KEY, JSON.stringify(STORE));

                    $deferred.resolve(participantId ? STORE[name][projectId][participantId] : STORE[name][projectId]);
                }, function () {
                    var reasons = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        reasons[_i] = arguments[_i + 0];
                    }
                    var r = {};

                    if (/^[4-5][0-9]{2}$/.test(reasons[0]['status'])) {
                        $deferred.reject(reasons[0]);
                    }

                    if (!STORE[name]) {
                        $deferred.reject(new Error('Storage is empty'));
                    }

                    if (STORE[OUT_OF_SERVICE]) {
                        r = STORE[OUT_OF_SERVICE][name];
                    }

                    if (STORE[name]) {
                        if (participantId) {
                            r = Miscellaneousness.merge(STORE[name][projectId][participantId], r);
                        } else {
                            r = Miscellaneousness.merge(STORE[name][projectId], r);
                        }
                    }

                    $deferred.resolve(r);
                });

                return $deferred.promise();
            }
            storage.get = get;

            function remove(name, projectId, participantId) {
                return storage.Api.remove(name, projectId, participantId);
            }
            storage.remove = remove;

            function retrieve(name, projectId) {
                var $deferred = $.Deferred();
                var $promise = storage.Api.retrieve(name, projectId);

                $promise.then(function (values) {
                    if (!STORE[name]) {
                        STORE[name] = {};
                    }

                    if (projectId) {
                        STORE[name][projectId] = values;
                    } else {
                        STORE[name] = values;
                    }

                    localStorage.setItem(KEY, JSON.stringify(STORE));

                    $deferred.resolve(projectId ? STORE[name][projectId] : STORE[name]);
                }, function () {
                    var reasons = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        reasons[_i] = arguments[_i + 0];
                    }
                    var r = {};

                    if (/^[4-5][0-9]{2}$/.test(reasons[0]['status'])) {
                        $deferred.reject(reasons[0]);
                    }

                    if (!STORE[name]) {
                        $deferred.reject(new Error('Storeage is empty'));
                    }

                    if (STORE[OUT_OF_SERVICE]) {
                        r = STORE[OUT_OF_SERVICE][name];
                    }

                    if (STORE[name]) {
                        if (projectId) {
                            r = Miscellaneousness.merge(STORE[name][projectId], r);
                        } else {
                            r = Miscellaneousness.merge(STORE[name], r);
                        }
                    }

                    $deferred.resolve(r);
                });

                return $deferred.promise();
            }
            storage.retrieve = retrieve;

            var Miscellaneousness;
            (function (Miscellaneousness) {
                function merge(o, b) {
                    if (typeof o === "undefined") { o = {}; }
                    if (typeof b === "undefined") { b = {}; }
                    var j = o;

                    for (var i = 0, t = Object.keys(b), l = t.length; i < l; i++) {
                        j[t[i]] = b[t[i]];
                    }

                    return j;
                }
                Miscellaneousness.merge = merge;

                function construct() {
                    var properties = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        properties[_i] = arguments[_i + 0];
                    }
                    return properties.reduceRight(function (p, c) {
                        var o = {};

                        o[c] = p;

                        return o;
                    }, {});
                }
                Miscellaneousness.construct = construct;
            })(Miscellaneousness || (Miscellaneousness = {}));
        })(model.storage || (model.storage = {}));
        var storage = model.storage;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var egrid;
(function (egrid) {
    (function (model) {
        var TYPE = 'Project';

        function load(obj, project) {
            var loaded = project === undefined ? new Project(obj) : project;
            loaded.key_ = obj.key;
            loaded.createdAt_ = new Date(obj.createdAt);
            loaded.updatedAt_ = new Date(obj.updatedAt);
            return loaded;
        }

        var Project = (function (_super) {
            __extends(Project, _super);
            function Project(obj) {
                _super.call(this);

                if (obj) {
                    this.name = obj.name;
                    this.note = obj.note;
                }
            }
            Project.get = function (key) {
                return model.storage.get(TYPE, key).then(function (data) {
                    return load(data);
                });
            };

            Project.query = function () {
                return model.storage.retrieve(TYPE).then(function (data) {
                    var result = [];
                    var key;
                    for (key in data) {
                        result.push(load(data[key]));
                    }
                    return result;
                });
            };

            Project.prototype.save = function () {
                var _this = this;
                return model.storage.add(this, TYPE, this.key).done(function (v) {
                    load(v, _this);
                });
            };

            Project.prototype.remove = function () {
                var _this = this;
                return model.storage.remove(TYPE, this.key).then(function () {
                    _this.key_ = undefined;
                    _this.createdAt_ = undefined;
                    _this.updatedAt_ = undefined;
                });
            };
            return Project;
        })(model.Entity);
        model.Project = Project;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var TYPE = 'Analysis';

        function load(obj) {
            var analysis = new Analysis(obj);
            analysis.key_ = obj.key;
            analysis.createdAt_ = new Date(obj.createdAt);
            analysis.updatedAt_ = new Date(obj.updatedAt);
            return analysis;
        }

        var Analysis = (function (_super) {
            __extends(Analysis, _super);
            function Analysis(obj) {
                _super.call(this);
                this.name = obj.name;
                this.project = obj.project;
                this.projectKey = obj.projectKey;
            }
            Analysis.get = function (projectKey, key) {
                return model.storage.get(TYPE, projectKey, key).then(function (data) {
                    return load(data);
                });
            };

            Analysis.query = function (projectKey) {
                return model.storage.retrieve(TYPE, projectKey).then(function (data) {
                    var result = [];
                    var key;
                    for (key in data) {
                        result.push(load(data[key]));
                    }
                    return result;
                });
            };

            Analysis.prototype.save = function () {
                return model.storage.add(this, TYPE, this.projectKey, this.key);
            };

            Analysis.prototype.remove = function () {
                return model.storage.remove(TYPE, this.projectKey, this.key);
            };
            return Analysis;
        })(model.Entity);
        model.Analysis = Analysis;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var User = (function () {
            function User() {
            }
            return User;
        })();
        model.User = User;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var Collaborator = (function (_super) {
            __extends(Collaborator, _super);
            function Collaborator(obj) {
                _super.call(this);

                if (obj) {
                    this.isManager = obj.isManager;
                    this.project = obj.project;
                    this.projectKey = obj.projectKey;
                    this.user = obj.user;
                    this.userEmail = obj.userEmail;
                }
            }
            Collaborator.prototype.load = function (o) {
                this.key = o.key;

                this.project = o.project;

                return this;
            };

            Collaborator.prototype.get = function (key) {
                throw new Error('NotSupportedException');
            };

            Collaborator.query = function (projectKey) {
                return model.storage.retrieve(Collaborator.type, projectKey);
            };

            Collaborator.prototype.save = function () {
                return model.storage.add(this, Collaborator.type, this.projectKey, this.key);
            };

            Collaborator.prototype.remove = function () {
                return model.storage.remove(Collaborator.type, this.projectKey, this.key);
            };
            Collaborator.type = 'Collaborator';
            Collaborator.url = '/api/projects/:projectId/collaborators/:collaboratorId';
            return Collaborator;
        })(model.Entity);
        model.Collaborator = Collaborator;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var TYPE = 'Participant';

        function load(obj) {
            var participant = new Participant(obj);
            participant.key_ = obj.key;
            participant.createdAt_ = new Date(obj.createdAt);
            participant.updatedAt_ = new Date(obj.updatedAt);
            return participant;
        }

        var Participant = (function (_super) {
            __extends(Participant, _super);
            function Participant(obj) {
                _super.call(this);

                if (obj) {
                    this.name = obj.name;
                    this.note = obj.note;
                    this.project = obj.project;
                    this.projectKey = obj.projectKey;
                }
            }
            Participant.get = function (projectKey, key) {
                return model.storage.get(TYPE, projectKey, key).then(function (data) {
                    return load(data);
                });
            };

            Participant.query = function (projectKey) {
                return model.storage.retrieve(TYPE, projectKey).then(function (data) {
                    var result = [];
                    var key;
                    for (key in data) {
                        result.push(load(data[key]));
                    }
                    return result;
                });
            };

            Participant.prototype.save = function () {
                return model.storage.add(this, TYPE, this.projectKey, this.key);
            };

            Participant.prototype.remove = function () {
                return model.storage.remove(TYPE, this.projectKey, this.key);
            };
            return Participant;
        })(model.Entity);
        model.Participant = Participant;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var ParticipantGrid = (function (_super) {
            __extends(ParticipantGrid, _super);
            function ParticipantGrid(obj) {
                _super.call(this);
                this.projectKey = obj.projectKey;
                this.participantKey = this.key_ = obj.participantKey;
                this.nodes = obj.nodes;
                this.links = obj.links;
            }
            ParticipantGrid.prototype.update = function () {
                return model.storage.add(this, ParticipantGrid.type, this.projectKey, this.participantKey);
            };

            ParticipantGrid.get = function (projectKey, participantKey) {
                return model.storage.get(ParticipantGrid.type, projectKey, participantKey).then(function (pg) {
                    return new ParticipantGrid(pg);
                });
            };
            ParticipantGrid.type = 'ParticipantGrid';
            return ParticipantGrid;
        })(model.Entity);
        model.ParticipantGrid = ParticipantGrid;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var ProjectGrid = (function (_super) {
            __extends(ProjectGrid, _super);
            function ProjectGrid(obj) {
                _super.call(this);

                this.projectKey = obj.projectKey;
                this.nodes = obj.nodes;
                this.links = obj.links;
                this.name = obj.name;
                this.note = obj.note;
            }
            ProjectGrid.prototype.save = function () {
                return model.storage.add(this, ProjectGrid.type, this.projectKey, this.key);
            };

            ProjectGrid.prototype.load = function (obj) {
                this.name = obj.name;
                this.note = obj.note;
                this.projectKey = obj.projectKey;
                this.nodes = obj.nodes;
                this.links = obj.links;
                this.key_ = obj.key;
                this.createdAt_ = new Date(obj.createdAt);
                this.updatedAt_ = new Date(obj.updatedAt);
                return this;
            };

            ProjectGrid.get = function (projectKey, key) {
                return model.storage.get(ProjectGrid.type, projectKey, key).then(function (projectGrid) {
                    return ProjectGrid.load(projectGrid);
                });
            };

            ProjectGrid.query = function (projectKey) {
                return model.storage.retrieve(ProjectGrid.type, projectKey);
            };

            ProjectGrid.load = function (obj) {
                var projectGrid = new ProjectGrid({
                    projectKey: obj.projectKey
                });
                return projectGrid.load(obj);
            };
            ProjectGrid.type = 'ProjectGrid';
            return ProjectGrid;
        })(model.Entity);
        model.ProjectGrid = ProjectGrid;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var Questionnaire = (function (_super) {
            __extends(Questionnaire, _super);
            function Questionnaire() {
                _super.apply(this, arguments);
            }
            Questionnaire.prototype.save = function () {
                return model.storage.add(this, 'Questionnaire', this.projectKey, this.key);
            };

            Questionnaire.get = function (projectKey, key) {
                return model.storage.get('Questionnaire', projectKey, key).then(function (data) {
                    var questionnaire = new Questionnaire;
                    questionnaire.key_ = data.key;
                    questionnaire.createdAt_ = new Date(data.createdAt);
                    questionnaire.updatedAt_ = new Date(data.updatedAt);
                    questionnaire.projectKey = data.projectKey;
                    questionnaire.items = data.items;
                    return questionnaire;
                });
            };
            return Questionnaire;
        })(model.Entity);
        model.Questionnaire = Questionnaire;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        function load(obj) {
            var semProject = new SemProject(obj);
            semProject.key_ = obj.key;
            semProject.createdAt_ = new Date(obj.createdAt);
            semProject.updatedAt_ = new Date(obj.updatedAt);
            return semProject;
        }

        var SemProject = (function (_super) {
            __extends(SemProject, _super);
            function SemProject(obj) {
                _super.call(this);

                if (obj) {
                    this.name = obj.name;
                    this.project = obj.project;
                    this.projectKey = obj.projectKey;
                }
            }
            SemProject.prototype.get = function (key) {
                return model.storage.get(SemProject.type, this.projectKey, key).then(function (data) {
                    return load(data);
                });
            };

            SemProject.query = function (projectKey) {
                return model.storage.retrieve(SemProject.type, projectKey);
            };

            SemProject.prototype.save = function () {
                return $.ajax({
                    url: this.key ? this.url(this.key) : SemProject.listUrl(this.projectKey),
                    type: this.key ? 'PUT' : 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        key: this.key,
                        name: this.name
                    }),
                    dataFilter: function (data) {
                        var obj = JSON.parse(data);
                        return load(obj);
                    }
                });
            };

            SemProject.listUrl = function (key) {
                return '/api/projects/' + key + '/sem-projects';
            };

            SemProject.prototype.url = function (key) {
                return SemProject.listUrl(this.projectKey) + '/' + key;
            };
            SemProject.type = 'SemProject';
            SemProject.url = '/api/projects/:projectId/sem-projects/:semProjectId';
            return SemProject;
        })(model.Entity);
        model.SemProject = SemProject;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
