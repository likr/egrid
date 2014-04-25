var egrid;
(function (egrid) {
    (function (model) {
        var ValueObject = (function () {
            function ValueObject(v) {
                this.value_ = v;
            }
            Object.defineProperty(ValueObject.prototype, "value", {
                get: function () {
                    return this.value_;
                },
                enumerable: true,
                configurable: true
            });

            ValueObject.prototype.toString = function () {
                return this.value_.toString();
            };
            return ValueObject;
        })();
        model.ValueObject = ValueObject;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (utils) {
        utils.API_URL_BASE = '';

        var Uri = (function () {
            function Uri() {
            }
            Uri.collaborators = function (projectId) {
                return '/api/projects/:projectId/collaborators'.replace(':projectId', projectId);
            };

            Uri.collaborator = function (projectId, participantId) {
                return '/api/projects/:projectId/collaborators/:collaboratorId'.replace(':projectId', projectId).replace(':collaboratorId', participantId);
            };

            Uri.participants = function (projectId) {
                return '/api/projects/:projectId/participants'.replace(':projectId', projectId);
            };

            Uri.participant = function (projectId, participantId) {
                return '/api/projects/:projectId/participants/:participantId'.replace(':projectId', projectId).replace(':participantId', participantId);
            };

            Uri.participantGrid = function (projectId, participantId) {
                return '/api/projects/:projectId/participants/:participantId/grid'.replace(':projectId', projectId).replace(':participantId', participantId);
            };

            Uri.projects = function () {
                return utils.API_URL_BASE + '/api/projects';
            };

            Uri.project = function (projectId) {
                return utils.API_URL_BASE + '/api/projects/:projectId'.replace(':projectId', projectId);
            };

            Uri.projectGrids = function (projectId) {
                return '/api/projects/:projectId/grid'.replace(':projectId', projectId);
            };

            Uri.projectGrid = function (projectId, projectGridId) {
                return '/api/projects/:projectId/grid/:projectGridId'.replace(':projectId', projectId).replace(':projectGridId', projectGridId);
            };

            Uri.semProjects = function (projectId) {
                return '/api/projects/:projectId/sem-projects'.replace(':projectId', projectId);
            };

            Uri.semProject = function (projectId, participantId) {
                return '/api/projects/:projectId/sem-projects/:semProjectId'.replace(':projectId', projectId).replace(':semProjectId', participantId);
            };
            return Uri;
        })();

        var Api = (function () {
            function Api() {
            }
            Api.get = function (name, projectId, participantId) {
                var n = name.replace(/^[A-Z]/, function (m) {
                    return m.toLowerCase();
                });

                return $.ajax({
                    url: participantId ? Uri[n](projectId, participantId) : Uri[n](projectId),
                    type: 'GET',
                    contentType: 'application/json'
                }).then(function (r) {
                    return JSON.parse(r);
                });
            };

            Api.post = function (data, name, projectId) {
                var n = name.replace(/^[A-Z]/, function (m) {
                    return m.toLowerCase();
                }) + 's';

                return $.ajax({
                    url: projectId ? Uri[n](projectId) : Uri[n](),
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(data)
                }).then(function (r) {
                    return JSON.parse(r);
                });
            };

            Api.put = function (data, name, projectId, participantId) {
                var n = name.replace(/^[A-Z]/, function (m) {
                    return m.toLowerCase();
                });

                return $.ajax({
                    url: participantId ? Uri[n](projectId, participantId) : Uri[n](projectId),
                    type: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify(data)
                }).then(function (r) {
                    return JSON.parse(r);
                });
            };

            Api.remove = function (name, projectId, participantId) {
                var n = name.replace(/^[A-Z]/, function (m) {
                    return m.toLowerCase();
                });

                return $.ajax({
                    url: participantId ? Uri[n](projectId, participantId) : Uri[n](projectId),
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
            };

            Api.retrieve = function (name, projectId) {
                var n = name.replace(/^[A-Z]/, function (m) {
                    return m.toLowerCase();
                }) + 's';

                return $.ajax({
                    url: projectId ? Uri[n](projectId) : Uri[n](),
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
            };
            return Api;
        })();
        utils.Api = Api;

        var Storage = (function () {
            function Storage() {
                this.store = {};
                this.store = JSON.parse(localStorage.getItem(Storage.key)) || {};

                this.flush();
            }
            Storage.prototype.flush = function () {
                var _this = this;
                var $deferred = $.Deferred();
                var $promises = [];
                var n = Storage.outOfService;

                if (this.store[n])
                    for (var type in this.store[n])
                        if (this.store[n].hasOwnProperty(type)) {
                            var v = this.store[n][type];
                            var w;

                            for (var unsaved in v)
                                if (v.hasOwnProperty(unsaved)) {
                                    w = v[unsaved];

                                    if (w.key && w.createdAt) {
                                        $promises.push(Api.put(w, type, w.key));
                                    } else {
                                        if (w.projectKey) {
                                            $promises.push(Api.post(w, type, w.projectKey));
                                        } else {
                                            $promises.push(Api.post(w, type));
                                        }
                                    }
                                }
                        }

                $.when.apply($, $promises).then(function (v) {
                    if (Array.isArray(v) && !v.length) {
                        $deferred.reject(false);
                    } else {
                        delete _this.store[Storage.outOfService];

                        $deferred.resolve(true);
                    }
                }, function () {
                    $deferred.reject(false);
                });

                return $deferred.promise();
            };

            Storage.prototype.add = function (value, name, projectId, participantId) {
                var _this = this;
                var $deferred = $.Deferred();
                var $promise;
                var alreadyStored = !!value.key;

                if (alreadyStored) {
                    $promise = Api.put(value, name, projectId, participantId);
                } else {
                    if (projectId) {
                        $promise = Api.post(value, name, projectId);
                    } else {
                        $promise = Api.post(value, name);
                    }
                }

                $promise.then(function (v) {
                    var r;

                    if (!_this.store[name]) {
                        _this.store[name] = {};
                    }

                    r = Miscellaneousness.merge(_this.store[name][v.key], v);

                    if (participantId) {
                        _this.store[name][projectId][v.key] = r;
                    } else {
                        _this.store[name][v.key] = r;
                    }

                    localStorage.setItem(Storage.key, JSON.stringify(_this.store));

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

                    _this.store = JSON.parse(localStorage.getItem(Storage.key)) || {};

                    k = (value.key) ? value.key : Storage.outOfService + Object.keys(_this.store[name]).length.valueOf();

                    if (!_this.store[Storage.outOfService]) {
                        _this.store[Storage.outOfService] = Miscellaneousness.construct(name);
                    }

                    if (!value.key) {
                        value.key = k;
                    }

                    _this.store[Storage.outOfService][name][k] = value;

                    localStorage.setItem(Storage.key, JSON.stringify(_this.store));

                    if (projectId && /^unsavedItems[0-9]+$/.test(projectId)) {
                        _this.store[name][k] = value;
                    } else if (participantId) {
                        _this.store[name][projectId][k] = value;
                    } else {
                        _this.store[name][k] = value;
                    }

                    $deferred.reject(reasons[0]);
                });

                return $deferred.promise();
            };

            Storage.prototype.get = function (name, projectId, participantId) {
                var _this = this;
                var $deferred = $.Deferred();
                var $promise = Api.get(name, projectId, participantId);

                this.store = JSON.parse(localStorage.getItem(Storage.key)) || {};

                $promise.then(function (value) {
                    if (!_this.store[name]) {
                        _this.store[name] = {};
                    }

                    if (participantId) {
                        _this.store[name][projectId] = Miscellaneousness.construct(participantId);

                        _this.store[name][projectId][participantId] = value;
                    } else {
                        _this.store[name][projectId] = value;
                    }

                    localStorage.setItem(Storage.key, JSON.stringify(_this.store));

                    $deferred.resolve(participantId ? _this.store[name][projectId][participantId] : _this.store[name][projectId]);
                }, function () {
                    var reasons = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        reasons[_i] = arguments[_i + 0];
                    }
                    var r = {};

                    if (/^[4-5][0-9]{2}$/.test(reasons[0]['status'])) {
                        $deferred.reject(reasons[0]);
                    }

                    if (!_this.store[name]) {
                        $deferred.reject(new Error('Storage is empty'));
                    }

                    if (_this.store[Storage.outOfService]) {
                        r = _this.store[Storage.outOfService][name];
                    }

                    if (_this.store[name]) {
                        if (participantId) {
                            r = Miscellaneousness.merge(_this.store[name][projectId][participantId], r);
                        } else {
                            r = Miscellaneousness.merge(_this.store[name][projectId], r);
                        }
                    }

                    $deferred.resolve(r);
                });

                return $deferred.promise();
            };

            Storage.prototype.remove = function (name, projectId, participantId) {
                return Api.remove(name, projectId, participantId);
            };

            Storage.prototype.retrieve = function (name, projectId) {
                var _this = this;
                var $deferred = $.Deferred();
                var $promise = Api.retrieve(name, projectId);

                $promise.then(function (values) {
                    if (!_this.store[name]) {
                        _this.store[name] = {};
                    }

                    if (projectId) {
                        _this.store[name][projectId] = values;
                    } else {
                        _this.store[name] = values;
                    }

                    localStorage.setItem(Storage.key, JSON.stringify(_this.store));

                    $deferred.resolve(projectId ? _this.store[name][projectId] : _this.store[name]);
                }, function () {
                    var reasons = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        reasons[_i] = arguments[_i + 0];
                    }
                    var r = {};

                    if (/^[4-5][0-9]{2}$/.test(reasons[0]['status'])) {
                        $deferred.reject(reasons[0]);
                    }

                    if (!_this.store[name]) {
                        $deferred.reject(new Error('Storeage is empty'));
                    }

                    if (_this.store[Storage.outOfService]) {
                        r = _this.store[Storage.outOfService][name];
                    }

                    if (_this.store[name]) {
                        if (projectId) {
                            r = Miscellaneousness.merge(_this.store[name][projectId], r);
                        } else {
                            r = Miscellaneousness.merge(_this.store[name], r);
                        }
                    }

                    $deferred.resolve(r);
                });

                return $deferred.promise();
            };
            Storage.key = 'lindo_de_remedio';
            Storage.outOfService = 'unsavedItems';
            return Storage;
        })();
        utils.Storage = Storage;

        var Miscellaneousness = (function () {
            function Miscellaneousness() {
            }
            Miscellaneousness.merge = function (o, b) {
                if (typeof o === "undefined") { o = {}; }
                if (typeof b === "undefined") { b = {}; }
                var j = o;

                for (var i = 0, t = Object.keys(b), l = t.length; i < l; i++) {
                    j[t[i]] = b[t[i]];
                }

                return j;
            };

            Miscellaneousness.construct = function () {
                var properties = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    properties[_i] = arguments[_i + 0];
                }
                return properties.reduceRight(function (p, c) {
                    var o = {};

                    o[c] = p;

                    return o;
                }, {});
            };
            return Miscellaneousness;
        })();
        utils.Miscellaneousness = Miscellaneousness;
    })(egrid.utils || (egrid.utils = {}));
    var utils = egrid.utils;
})(egrid || (egrid = {}));

var egrid;
(function (egrid) {
    egrid.storage = new egrid.utils.Storage();
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var Entity = (function () {
            function Entity() {
            }

            Object.defineProperty(Entity.prototype, "key", {
                get: function () {
                    return (this.key_) ? this.key_.value : '';
                },
                set: function (key) {
                    if (!this.key_)
                        this.key_ = new model.ValueObject(key);
                },
                enumerable: true,
                configurable: true
            });

            Entity.prototype.load = function (o) {
                throw new Error('NotImplementedException');
            };

            Entity.prototype.get = function (key) {
                throw new Error('NotImplementedException');
            };

            Entity.prototype.save = function () {
                throw new Error('NotImplementedException');
            };

            Entity.listUrl = function (key) {
                throw new Error('NotImplementedException');
            };

            Entity.prototype.url = function (key) {
                throw new Error('NotImplementedException');
            };

            Entity.prototype.toJSON = function (t) {
                var replacement = {};

                for (var k in this) {
                    if (!(this[k] instanceof model.ValueObject)) {
                        replacement[k] = this[k];
                    }
                }

                return replacement;
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
        var Dictionary = (function () {
            function Dictionary() {
                this.pairs = {};
            }
            Dictionary.prototype.getItem = function (k) {
                return this.pairs[k];
            };

            Dictionary.prototype.removeItem = function (k) {
                delete this.pairs[k];
            };

            Dictionary.prototype.setItem = function (k, v) {
                this.pairs[k] = v;
            };

            Dictionary.prototype.toArray = function () {
                var _this = this;
                return Object.keys(this.pairs).map(function (v, i, ar) {
                    return _this.pairs[v];
                });
            };

            Dictionary.prototype.toJSON = function () {
                var _this = this;
                var replacement = {};

                Object.keys(this.pairs).forEach(function (k) {
                    replacement[k] = _this.pairs[k];
                });

                return replacement;
            };
            return Dictionary;
        })();
        model.Dictionary = Dictionary;

        var NotationDeserializer = (function () {
            function NotationDeserializer() {
            }
            NotationDeserializer.load = function (o) {
                var b = JSON.parse(o);

                return b ? Object.keys(b).map(function (v, i, ar) {
                    return b[v];
                }) : [];
            };
            return NotationDeserializer;
        })();
        model.NotationDeserializer = NotationDeserializer;

        var CollectionBase = (function () {
            function CollectionBase(pairs) {
                this.pairs_ = new model.ValueObject(pairs);
            }
            Object.defineProperty(CollectionBase.prototype, "pairs", {
                get: function () {
                    return this.pairs_;
                },
                enumerable: true,
                configurable: true
            });

            CollectionBase.prototype.addItem = function (item) {
                this.pairs.value.setItem(item.key, item);
            };

            CollectionBase.prototype.getItem = function (k) {
                return this.pairs.value.getItem(k);
            };

            CollectionBase.prototype.removeItem = function (k) {
                return this.pairs.value.removeItem(k);
            };

            CollectionBase.prototype.query = function (key) {
                throw new Error('NotImplementedException');
            };

            CollectionBase.prototype.toArray = function () {
                return this.pairs.value.toArray();
            };

            CollectionBase.pluralize = function (word) {
                return word + 's';
            };
            return CollectionBase;
        })();
        model.CollectionBase = CollectionBase;
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
        var Project = (function (_super) {
            __extends(Project, _super);
            function Project(obj) {
                _super.call(this);

                if (obj) {
                    this.name = obj.name;
                    this.note = obj.note;
                }
            }
            Object.defineProperty(Project.prototype, "createdAt", {
                get: function () {
                    return this.createdAt_ ? this.createdAt_.value : null;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Project.prototype, "updatedAt", {
                get: function () {
                    return this.updatedAt_ ? this.updatedAt_.value : null;
                },
                enumerable: true,
                configurable: true
            });

            Project.prototype.setCreatedAt = function (date) {
                if (!this.createdAt_)
                    this.createdAt_ = new model.ValueObject(date);
            };

            Project.prototype.setUpdatedAt = function (date) {
                if (!this.updatedAt_)
                    this.updatedAt_ = new model.ValueObject(date);
            };

            Project.prototype.load = function (o) {
                this.key = o.key;

                this.name = o.name;
                this.note = o.note;

                this.setCreatedAt(new Date(o.createdAt));
                this.setUpdatedAt(new Date(o.updatedAt));

                return this;
            };

            Project.load = function (o) {
                return new Project().load(o);
            };

            Project.prototype.get = function (key) {
                var _this = this;
                return egrid.storage.get(Project.type, key).then(function (data) {
                    return _this.load(data);
                });
            };

            Project.get = function (key) {
                var project = new Project();
                return project.get(key);
            };

            Project.prototype.save = function () {
                var _this = this;
                return egrid.storage.add(this, Project.type, this.key).done(function (v) {
                    _this.load(v);
                });
            };

            Project.listUrl = function () {
                return '/api/projects';
            };

            Project.prototype.url = function (key) {
                return Project.listUrl() + '/' + key;
            };

            Project.prototype.remove = function () {
                return egrid.storage.remove(Project.type, this.key);
            };
            Project.type = 'Project';
            return Project;
        })(model.Entity);
        model.Project = Project;
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

            Collaborator.prototype.save = function () {
                return egrid.storage.add(this, Collaborator.type, this.projectKey, this.key);
            };

            Collaborator.listUrl = function (key) {
                return model.Project.listUrl() + '/' + key + '/collaborators';
            };

            Collaborator.prototype.url = function (key) {
                return Collaborator.listUrl(this.projectKey) + '/' + key;
            };

            Collaborator.prototype.remove = function () {
                return egrid.storage.remove(Collaborator.type, this.projectKey, this.key);
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
        var CollaboratorCollection = (function (_super) {
            __extends(CollaboratorCollection, _super);
            function CollaboratorCollection() {
                _super.call(this, new model.Dictionary());
            }
            CollaboratorCollection.prototype.query = function (projectKey) {
                return egrid.storage.retrieve(model.Collaborator.type, projectKey);
            };

            CollaboratorCollection.prototype.getItem = function (k) {
                var o = _super.prototype.getItem.call(this, k);
                return new model.Collaborator(o).load(o);
            };
            return CollaboratorCollection;
        })(model.CollectionBase);
        model.CollaboratorCollection = CollaboratorCollection;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
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
            Object.defineProperty(Participant.prototype, "createdAt", {
                get: function () {
                    return this.createdAt_ ? this.createdAt_.value : null;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Participant.prototype, "updatedAt", {
                get: function () {
                    return this.updatedAt_ ? this.updatedAt_.value : null;
                },
                enumerable: true,
                configurable: true
            });

            Participant.prototype.setCreatedAt = function (date) {
                if (!this.createdAt_)
                    this.createdAt_ = new model.ValueObject(date);
            };

            Participant.prototype.setUpdatedAt = function (date) {
                if (!this.updatedAt_)
                    this.updatedAt_ = new model.ValueObject(date);
            };

            Participant.prototype.load = function (o) {
                this.key = o.key;

                this.name = o.name;
                this.note = o.note;

                this.project = o.project;

                this.setCreatedAt(o.createdAt);
                this.setUpdatedAt(o.updatedAt);

                return this;
            };

            Participant.prototype.get = function (key) {
                var _this = this;
                return egrid.storage.get(Participant.type, this.projectKey, key).then(function (participant) {
                    return _this.load(participant);
                });
            };

            Participant.prototype.save = function () {
                return egrid.storage.add(this, Participant.type, this.projectKey, this.key);
            };

            Participant.listUrl = function (key) {
                return model.Project.listUrl() + '/' + key + '/participants';
            };

            Participant.prototype.url = function (key) {
                return Participant.listUrl(this.projectKey) + '/' + key;
            };

            Participant.prototype.remove = function () {
                return egrid.storage.remove(Participant.type, this.projectKey, this.key);
            };
            Participant.type = 'Participant';
            Participant.url = '/api/projects/:projectId/participants/:participantId';
            return Participant;
        })(model.Entity);
        model.Participant = Participant;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var ParticipantCollection = (function (_super) {
            __extends(ParticipantCollection, _super);
            function ParticipantCollection() {
                _super.call(this, new model.Dictionary());
            }
            ParticipantCollection.prototype.query = function (projectKey) {
                return egrid.storage.retrieve(model.Participant.type, projectKey);
            };
            return ParticipantCollection;
        })(model.CollectionBase);
        model.ParticipantCollection = ParticipantCollection;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var ParticipantGrid = (function () {
            function ParticipantGrid(obj) {
                this.projectKey = obj.projectKey;
                this.participantKey = this.key = obj.participantKey;
                this.nodes = obj.nodes;
                this.links = obj.links;
            }
            ParticipantGrid.prototype.update = function () {
                return egrid.storage.add(this, ParticipantGrid.type, this.projectKey, this.key);
            };

            ParticipantGrid.prototype.url = function () {
                return ParticipantGrid.url(this.projectKey, this.key);
            };

            ParticipantGrid.get = function (projectKey, participantKey) {
                return egrid.storage.get(ParticipantGrid.type, projectKey, participantKey).then(function (pg) {
                    return new ParticipantGrid(pg);
                });
            };

            ParticipantGrid.url = function (projectKey, participantKey) {
                return '/api/projects/' + projectKey + '/participants/' + participantKey + '/grid';
            };
            ParticipantGrid.type = 'ParticipantGrid';
            return ParticipantGrid;
        })();
        model.ParticipantGrid = ParticipantGrid;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var ProjectCollection = (function (_super) {
            __extends(ProjectCollection, _super);
            function ProjectCollection() {
                _super.call(this, new model.Dictionary());
            }
            ProjectCollection.prototype.query = function (key) {
                return egrid.storage.retrieve(model.Project.type).then(function (data) {
                    var result = {};
                    for (key in data) {
                        result[key] = model.Project.load(data[key]);
                    }
                    return result;
                });
            };

            ProjectCollection.query = function () {
                var projects = new ProjectCollection();
                return projects.query();
            };
            return ProjectCollection;
        })(model.CollectionBase);
        model.ProjectCollection = ProjectCollection;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var ProjectGrid = (function () {
            function ProjectGrid(obj) {
                this.projectKey = obj.projectKey;
                this.nodes = obj.nodes;
                this.links = obj.links;
                this.name = obj.name;
                this.note = obj.note;
            }
            Object.defineProperty(ProjectGrid.prototype, "key", {
                get: function () {
                    return this.key_;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ProjectGrid.prototype, "createdAt", {
                get: function () {
                    return this.createdAt_;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ProjectGrid.prototype, "updatedAt", {
                get: function () {
                    return this.updatedAt_;
                },
                enumerable: true,
                configurable: true
            });

            ProjectGrid.prototype.save = function () {
                return egrid.storage.add(this, ProjectGrid.type, this.projectKey, this.key);
            };

            ProjectGrid.prototype.url = function () {
                return ProjectGrid.url(this.projectKey, this.key);
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

            ProjectGrid.get = function (projectKey, projectGridId) {
                var key = projectGridId ? projectGridId : 'current';

                return egrid.storage.get(ProjectGrid.type, projectKey, key).then(function (projectGrid) {
                    return ProjectGrid.load(projectGrid);
                });
            };

            ProjectGrid.query = function (projectKey) {
                return egrid.storage.retrieve(ProjectGrid.type, projectKey);
            };

            ProjectGrid.load = function (obj) {
                var projectGrid = new ProjectGrid({
                    projectKey: obj.projectKey
                });
                return projectGrid.load(obj);
            };

            ProjectGrid.url = function (projectKey, projectGridKey) {
                if (projectGridKey) {
                    return '/api/projects/' + projectKey + '/grid/' + projectGridKey;
                } else {
                    return '/api/projects/' + projectKey + '/grid';
                }
            };
            ProjectGrid.type = 'ProjectGrid';
            return ProjectGrid;
        })();
        model.ProjectGrid = ProjectGrid;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
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
            Object.defineProperty(SemProject.prototype, "createdAt", {
                get: function () {
                    return this.createdAt_ ? this.createdAt_.value : null;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SemProject.prototype, "updatedAt", {
                get: function () {
                    return this.updatedAt_ ? this.updatedAt_.value : null;
                },
                enumerable: true,
                configurable: true
            });

            SemProject.prototype.setCreatedAt = function (date) {
                if (!this.createdAt_)
                    this.createdAt_ = new model.ValueObject(date);
            };

            SemProject.prototype.setUpdatedAt = function (date) {
                if (!this.updatedAt_)
                    this.updatedAt_ = new model.ValueObject(date);
            };

            SemProject.prototype.load = function (o) {
                this.key = o.key;

                this.name = o.name;

                this.project = o.project;

                this.setCreatedAt(o.createdAt);
                this.setUpdatedAt(o.updatedAt);

                return this;
            };

            SemProject.prototype.get = function (key) {
                var _this = this;
                return egrid.storage.get(SemProject.type, this.projectKey, key).then(function (semProject) {
                    return _this.load(semProject);
                });
            };

            SemProject.prototype.save = function () {
                var _this = this;
                var $deferred = $.Deferred();
                var key = this.key;

                $.ajax({
                    url: key ? this.url(key) : SemProject.listUrl(this.projectKey),
                    type: key ? 'PUT' : 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        key: key,
                        name: this.name
                    }),
                    dataFilter: function (data) {
                        var obj = JSON.parse(data);

                        return _this.load(obj);
                    }
                }).then(function (p) {
                    return $deferred.resolve(p);
                }, function () {
                    var reasons = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        reasons[_i] = arguments[_i + 0];
                    }
                    var o = {};
                    var storageKey = 'unsavedItems.' + model.CollectionBase.pluralize(SemProject.type);
                    var unsavedItems = JSON.parse(window.localStorage.getItem(storageKey)) || {};
                    var irregulars;

                    if (_this.key) {
                        o[_this.key] = _this;
                    } else {
                        o[Object.keys(unsavedItems).length] = _this;
                    }

                    irregulars = $.extend({}, unsavedItems, o);

                    window.localStorage.setItem(storageKey, JSON.stringify(irregulars));

                    return $deferred.reject();
                });

                return $deferred.promise();
            };

            SemProject.listUrl = function (key) {
                return model.Project.listUrl() + '/' + key + '/sem-projects';
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
var egrid;
(function (egrid) {
    (function (model) {
        var SemProjectCollection = (function (_super) {
            __extends(SemProjectCollection, _super);
            function SemProjectCollection() {
                _super.call(this, new model.Dictionary());
            }
            SemProjectCollection.prototype.query = function (projectKey) {
                return egrid.storage.retrieve(model.SemProject.type, projectKey);
            };
            return SemProjectCollection;
        })(model.CollectionBase);
        model.SemProjectCollection = SemProjectCollection;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var SemProjectQuestionnaire = (function () {
            function SemProjectQuestionnaire(obj) {
                this.description = obj.description;
                this.items = obj.items;
                this.projectKey = obj.projectKey;
                this.semProjectKey = obj.semProjectKey;
                this.title = obj.title;
            }
            SemProjectQuestionnaire.prototype.save = function () {
                var _this = this;
                return $.ajax({
                    url: this.url(),
                    type: 'PUT',
                    dataFilter: function (data) {
                        return _this;
                    }
                });
            };

            SemProjectQuestionnaire.prototype.url = function () {
                return SemProjectQuestionnaire.url(this.projectKey, this.semProjectKey);
            };

            SemProjectQuestionnaire.get = function (projectKey, semProjectKey) {
                return $.ajax({
                    url: SemProjectQuestionnaire.url(projectKey, semProjectKey),
                    type: 'GET',
                    dataFilter: function (data) {
                        var obj = JSON.parse(data);
                        return new SemProjectQuestionnaire(obj);
                    }
                });
            };

            SemProjectQuestionnaire.url = function (projectKey, semProjectKey) {
                return '/api/projects/' + projectKey + '/sem-project/' + semProjectKey + '/questionnaire';
            };
            return SemProjectQuestionnaire;
        })();
        model.SemProjectQuestionnaire = SemProjectQuestionnaire;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
