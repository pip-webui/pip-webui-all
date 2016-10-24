(function () {
    'use strict';
    angular.module('pipServices', [
        'pipScope',
        'pipTranslate',
        'pipRouting',
        'pipTimer',
        'pipSession',
        'pipIdentity',
        'pipSystemInfo',
        'pipFormat',
        'pipScroll',
        'pipPageReset',
        'pipTags'
    ]);
})();





var pip;
(function (pip) {
    var routing;
    (function (routing) {
        'use strict';
        captureStateTranslations.$inject = ['$rootScope'];
        decorateBackStateService.$inject = ['$delegate', '$window'];
        addBackStateDecorator.$inject = ['$provide'];
        function captureStateTranslations($rootScope) {
            "ngInject";
            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                pip.routing.CurrentState = {
                    name: toState.name,
                    url: toState.url,
                    params: toParams
                };
                pip.routing.PreviousState = {
                    name: fromState.name,
                    url: fromState.url,
                    params: fromParams
                };
            });
        }
        function decorateBackStateService($delegate, $window) {
            "ngInject";
            $delegate.goBack = goBack;
            $delegate.goBackAndSelect = goBackAndSelect;
            return $delegate;
            function goBack() {
                $window.history.back();
            }
            function goBackAndSelect(params) {
                if (pip.routing.PreviousState != null
                    && pip.routing.PreviousState.name != null) {
                    var state = _.cloneDeep(pip.routing.PreviousState);
                    state.params = _.extend(state.params, params);
                    $delegate.go(state.name, state.params);
                }
                else {
                    $window.history.back();
                }
            }
        }
        function addBackStateDecorator($provide) {
            $provide.decorator('$state', decorateBackStateService);
        }
        angular
            .module('pipRouting.Back', [])
            .config(addBackStateDecorator)
            .run(captureStateTranslations);
    })(routing = pip.routing || (pip.routing = {}));
})(pip || (pip = {}));

var pip;
(function (pip) {
    var routing;
    (function (routing) {
        'use strict';
        decorateRedirectStateProvider.$inject = ['$delegate'];
        addRedirectStateProviderDecorator.$inject = ['$provide'];
        decorateRedirectStateService.$inject = ['$delegate', '$timeout'];
        addRedirectStateDecorator.$inject = ['$provide'];
        routing.RedirectedStates = {};
        function decorateRedirectStateProvider($delegate) {
            "ngInject";
            $delegate.redirect = redirect;
            return $delegate;
            function redirect(fromState, toState) {
                pip.routing.RedirectedStates[fromState] = toState;
                return this;
            }
        }
        function addRedirectStateProviderDecorator($provide) {
            "ngInject";
            $provide.decorator('$state', decorateRedirectStateProvider);
        }
        function decorateRedirectStateService($delegate, $timeout) {
            "ngInject";
            $delegate.redirect = redirect;
            return $delegate;
            function redirect(event, state, params) {
                var toState = pip.routing.RedirectedStates[state.name];
                if (_.isFunction(toState)) {
                    toState = toState(state.name, params);
                    if (_.isNull(toState))
                        throw new Error('Redirected toState cannot be null');
                }
                if (!!toState) {
                    $timeout(function () {
                        event.preventDefault();
                        $delegate.transitionTo(toState, params, { location: 'replace' });
                    });
                    return true;
                }
                return false;
            }
        }
        function addRedirectStateDecorator($provide) {
            "ngInject";
            $provide.decorator('$state', decorateRedirectStateService);
        }
        angular
            .module('pipRouting.Redirect', ['ui.router'])
            .config(addRedirectStateProviderDecorator)
            .config(addRedirectStateDecorator);
    })(routing = pip.routing || (pip.routing = {}));
})(pip || (pip = {}));

var pip;
(function (pip) {
    var routing;
    (function (routing) {
        'use strict';
        angular.module('pipRouting', [
            'ui.router', 'pipRouting.Events', 'pipRouting.Back', 'pipRouting.Redirect'
        ]);
    })(routing = pip.routing || (pip.routing = {}));
})(pip || (pip = {}));

var pip;
(function (pip) {
    var routing;
    (function (routing) {
        'use strict';
        hookRoutingEvents.$inject = ['$log', '$rootScope', '$state'];
        routing.RoutingVar = "$routing";
        function hookRoutingEvents($log, $rootScope, $state) {
            "ngInject";
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                $rootScope[routing.RoutingVar] = true;
            });
            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                $rootScope[routing.RoutingVar] = false;
            });
            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                $rootScope[routing.RoutingVar] = false;
                $log.error('Error while switching route to ' + toState.name);
                $log.error(error);
                console.error('Error while switching route to ' + toState.name);
                console.error(error);
            });
            $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
                event.preventDefault();
                $rootScope[routing.RoutingVar] = false;
                $state.go('errors_missing_route', {
                    unfoundState: unfoundState,
                    fromState: {
                        to: fromState ? fromState.name : '',
                        fromParams: fromParams
                    }
                });
            });
        }
        angular
            .module('pipRouting.Events', [])
            .run(hookRoutingEvents);
    })(routing = pip.routing || (pip.routing = {}));
})(pip || (pip = {}));

var pip;
(function (pip) {
    var scope;
    (function (scope) {
        'use strict';
        angular.module('pipScope', ['pipTranslate', 'pipScope.Error', 'pipScope.Transaction']);
        angular.module('pipTransactions', ['pipScope']);
    })(scope = pip.scope || (pip.scope = {}));
})(pip || (pip = {}));

var pip;
(function (pip) {
    var scope;
    (function (scope_1) {
        'use strict';
        var thisModule = angular.module('pipScope.Error', []);
        thisModule.factory('pipError', ['$rootScope', function ($rootScope) {
            $rootScope.errors = {};
            return createError;
            function initError(scope) {
                $rootScope.errors[scope] = {
                    message: undefined,
                    code: undefined,
                    details: undefined
                };
            }
            ;
            function errorMessage(error) {
                if (_.isNull(error)) {
                    return null;
                }
                if (error.message) {
                    return error.message;
                }
                if (error.data) {
                    if (error.data.code) {
                        return 'ERROR_' + error.data.code;
                    }
                    if (error.data.message) {
                        return error.data.message;
                    }
                }
                if (error.statusText) {
                    return error.statusText;
                }
                if (error.status) {
                    return 'ERROR_' + error.status;
                }
                return error.data ? error.data : error;
            }
            ;
            function errorCode(error) {
                if (_.isNull(error)) {
                    return null;
                }
                if (error.data && error.data.code) {
                    return error.data.code;
                }
                if (error.status) {
                    return error.status;
                }
                return null;
            }
            ;
            function errorDetails(error) {
                return error && error.data ? error.data : error;
            }
            ;
            function createError(scope, scopeObject) {
                scope = scope || 'global';
                var error = {
                    reset: function () {
                        initError(scope);
                    },
                    empty: function () {
                        var error = $rootScope.errors[scope];
                        return _.isNull(error) || (_.isNull(error.message) && _.isNull(error.code));
                    },
                    get: function () {
                        if ($rootScope.errors[scope]) {
                            return $rootScope.errors[scope];
                        }
                        return '';
                    },
                    message: function () {
                        if ($rootScope.errors[scope]) {
                            return $rootScope.errors[scope].message;
                        }
                        return null;
                    },
                    code: function () {
                        if ($rootScope.errors[scope]) {
                            return $rootScope.errors[scope].code;
                        }
                        return null;
                    },
                    details: function () {
                        if ($rootScope.errors[scope]) {
                            return $rootScope.errors[scope].details;
                        }
                        return null;
                    },
                    set: function (error) {
                        if (error) {
                            $rootScope.errors[scope] = {
                                message: errorMessage(error),
                                code: errorCode(error),
                                details: errorDetails(error)
                            };
                            console.error($rootScope.errors[scope]);
                        }
                        else {
                            initError(scope);
                        }
                    }
                };
                if (_.isObject(scopeObject))
                    scopeObject.error = error;
                return error;
            }
            ;
        }]);
    })(scope = pip.scope || (pip.scope = {}));
})(pip || (pip = {}));

var pip;
(function (pip) {
    var scope;
    (function (scope_1) {
        'use strict';
        var thisModule = angular.module('pipScope.Transaction', ['pipTranslate']);
        thisModule.run(['$injector', function ($injector) {
            var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
            if (pipTranslate) {
                pipTranslate.setTranslations('en', {
                    'ENTERING': 'Entering...',
                    'PROCESSING': 'Processing...',
                    'LOADING': 'Loading...',
                    'SAVING': 'Saving...'
                });
                pipTranslate.setTranslations('ru', {
                    'ENTERING': 'Вход в систему...',
                    'PROCESSING': 'Обрабатывается...',
                    'LOADING': 'Загружается...',
                    'SAVING': 'Сохраняется...'
                });
            }
        }]);
        thisModule.factory('pipTransaction', ['$rootScope', 'pipError', function ($rootScope, pipError) {
            $rootScope.transactions = {};
            return createTransaction;
            function initTransaction(scope) {
                $rootScope.transactions[scope] = {
                    id: undefined,
                    operation: undefined
                };
            }
            function createTransaction(scope, scopeObject) {
                scope = scope || 'global';
                var error = pipError(scope);
                var transaction = {
                    error: error,
                    reset: function () {
                        initTransaction("");
                        error.reset();
                    },
                    busy: function () {
                        var transaction = $rootScope.transactions[scope];
                        return transaction != null && transaction.id;
                    },
                    failed: function () {
                        return !error.empty();
                    },
                    aborted: function (id) {
                        var transaction = $rootScope.transactions[scope];
                        return _.isNull(transaction) || transaction.id != id;
                    },
                    get: function () {
                        if (_.isNull($rootScope.transactions[scope])) {
                            initTransaction(scope);
                        }
                        return $rootScope.transactions[scope];
                    },
                    id: function () {
                        var transaction = $rootScope.transactions[scope];
                        return transaction ? transaction.id : null;
                    },
                    operation: function () {
                        var transaction = $rootScope.transactions[scope];
                        return transaction ? transaction.operation : null;
                    },
                    errorMessage: function () {
                        return error.message();
                    },
                    begin: function (operation) {
                        var transaction = $rootScope.transactions[scope];
                        if (transaction != null && transaction.id) {
                            return null;
                        }
                        transaction = $rootScope.transactions[scope] = {
                            id: new Date().getTime(),
                            operation: operation || 'PROCESSING'
                        };
                        error.reset();
                        return transaction.id;
                    },
                    abort: function () {
                        var transaction = $rootScope.transactions[scope];
                        if (transaction) {
                            transaction.id = null;
                        }
                        error.reset();
                    },
                    end: function (err) {
                        if (err)
                            error.set(err);
                        else
                            error.reset();
                        var transaction = $rootScope.transactions[scope];
                        if (transaction != null) {
                            transaction.id = null;
                        }
                    }
                };
                if (_.isObject(scopeObject)) {
                    scopeObject.error = error;
                    scopeObject.transaction = transaction;
                }
                return transaction;
            }
        }]);
    })(scope = pip.scope || (pip.scope = {}));
})(pip || (pip = {}));

var pip;
(function (pip) {
    var session;
    (function (session) {
        'use strict';
        session.IdentityRootVar = "$identity";
        session.IdentityChangedEvent = "pipIdentityChanged";
        var IdentityService = (function () {
            function IdentityService(setRootVar, identity, $rootScope) {
                this._setRootVar = setRootVar;
                this._identity = identity;
                this._rootScope = $rootScope;
                this.setRootVar();
            }
            IdentityService.prototype.setRootVar = function () {
                if (this._setRootVar)
                    this._rootScope[pip.session.IdentityRootVar] = this._identity;
            };
            Object.defineProperty(IdentityService.prototype, "identity", {
                get: function () {
                    return this._identity;
                },
                set: function (value) {
                    this._identity = value;
                    this.setRootVar();
                    this._rootScope.$broadcast(pip.session.IdentityChangedEvent, this._identity);
                },
                enumerable: true,
                configurable: true
            });
            return IdentityService;
        }());
        var IdentityProvider = (function () {
            function IdentityProvider() {
                this._setRootVar = true;
                this._identity = null;
                this._service = null;
            }
            Object.defineProperty(IdentityProvider.prototype, "setRootVar", {
                get: function () {
                    return this._setRootVar;
                },
                set: function (value) {
                    this._setRootVar = !!value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IdentityProvider.prototype, "identity", {
                get: function () {
                    return this._identity;
                },
                set: function (value) {
                    this._identity = value;
                },
                enumerable: true,
                configurable: true
            });
            IdentityProvider.prototype.$get = ['$rootScope', function ($rootScope) {
                "ngInject";
                if (this._service == null)
                    this._service = new IdentityService(this._setRootVar, this._identity, $rootScope);
                return this._service;
            }];
            return IdentityProvider;
        }());
        angular
            .module('pipIdentity', [])
            .provider('pipIdentity', IdentityProvider);
    })(session = pip.session || (pip.session = {}));
})(pip || (pip = {}));

var pip;
(function (pip) {
    var session;
    (function (session_1) {
        'use strict';
        session_1.SessionRootVar = "$session";
        session_1.SessionOpenedEvent = "pipSessionOpened";
        session_1.SessionClosedEvent = "pipSessionClosed";
        var SessionService = (function () {
            function SessionService(setRootVar, session, $rootScope) {
                this._setRootVar = setRootVar;
                this._session = session;
                this._rootScope = $rootScope;
                this.setRootVar();
            }
            SessionService.prototype.setRootVar = function () {
                if (this._setRootVar)
                    this._rootScope[pip.session.SessionRootVar] = this._session;
            };
            Object.defineProperty(SessionService.prototype, "session", {
                get: function () {
                    return this._session;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SessionService.prototype, "isOpened", {
                get: function () {
                    return this._session != null;
                },
                enumerable: true,
                configurable: true
            });
            SessionService.prototype.open = function (session, fullReset, partialReset) {
                if (fullReset === void 0) { fullReset = false; }
                if (partialReset === void 0) { partialReset = false; }
                if (session == null)
                    throw new Error("Session cannot be null");
                this._session = session;
                this.setRootVar();
                this._rootScope.$broadcast(pip.session.SessionOpenedEvent, session);
            };
            SessionService.prototype.close = function (fullReset, partialReset) {
                if (fullReset === void 0) { fullReset = false; }
                if (partialReset === void 0) { partialReset = false; }
                var oldSession = this._session;
                this._session = null;
                this.setRootVar();
                this._rootScope.$broadcast(pip.session.SessionClosedEvent, oldSession);
            };
            return SessionService;
        }());
        var SessionProvider = (function () {
            function SessionProvider() {
                this._setRootVar = true;
                this._session = null;
                this._service = null;
            }
            Object.defineProperty(SessionProvider.prototype, "setRootVar", {
                get: function () {
                    return this._setRootVar;
                },
                set: function (value) {
                    this._setRootVar = !!value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SessionProvider.prototype, "session", {
                get: function () {
                    return this._session;
                },
                set: function (value) {
                    this._session = value;
                },
                enumerable: true,
                configurable: true
            });
            SessionProvider.prototype.$get = ['$rootScope', function ($rootScope) {
                "ngInject";
                if (this._service == null)
                    this._service = new SessionService(this._setRootVar, this._session, $rootScope);
                return this._service;
            }];
            return SessionProvider;
        }());
        angular.module('pipSession', ['pipPageReset'])
            .provider('pipSession', SessionProvider);
    })(session = pip.session || (pip.session = {}));
})(pip || (pip = {}));

var pip;
(function (pip) {
    var translate;
    (function (translate) {
        'use strict';
        angular.module('pipTranslate', [
            'LocalStorageModule', 'pipTranslate.Service', 'pipTranslate.Filter', 'pipTranslate.Directive'
        ]);
    })(translate = pip.translate || (pip.translate = {}));
})(pip || (pip = {}));

var pip;
(function (pip) {
    var translate;
    (function (translate) {
        'use strict';
        pipTranslateDirective.$inject = ['pipTranslate'];
        pipTranslateHtmlDirective.$inject = ['pipTranslate'];
        function pipTranslateDirective(pipTranslate) {
            "ngInject";
            return {
                restrict: 'EA',
                scope: {
                    key1: '@pipTranslate',
                    key2: '@key'
                },
                link: function (scope, element, attrs) {
                    var key = scope.key1 || scope.key2;
                    var value = pipTranslate.translate(key);
                    element.text(value);
                }
            };
        }
        function pipTranslateHtmlDirective(pipTranslate) {
            "ngInject";
            return {
                restrict: 'EA',
                scope: {
                    key1: '@pipTranslateHtml',
                    key2: '@key'
                },
                link: function (scope, element, attrs) {
                    var key = scope.key1 || scope.key2;
                    var value = pipTranslate.translate(key);
                    element.html(value);
                }
            };
        }
        angular
            .module('pipTranslate.Directive', [])
            .directive('pipTranslate', pipTranslateDirective)
            .directive('pipTranslateHtml', pipTranslateHtmlDirective);
    })(translate = pip.translate || (pip.translate = {}));
})(pip || (pip = {}));

var pip;
(function (pip) {
    var translate;
    (function (translate) {
        'use strict';
        translateFilter.$inject = ['pipTranslate'];
        optionalTranslateFilter.$inject = ['$injector'];
        function translateFilter(pipTranslate) {
            "ngInject";
            return function (key) {
                return pipTranslate.translate(key) || key;
            };
        }
        function optionalTranslateFilter($injector) {
            "ngInject";
            var pipTranslate = $injector.has('pipTranslate')
                ? $injector.get('pipTranslate') : null;
            return function (key) {
                return pipTranslate ? pipTranslate.translate(key) || key : key;
            };
        }
        angular
            .module('pipTranslate.Filter', [])
            .filter('translate', translateFilter);
    })(translate = pip.translate || (pip.translate = {}));
})(pip || (pip = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pip;
(function (pip) {
    var translate;
    (function (translate) {
        'use strict';
        translate.LanguageRootVar = "$language";
        translate.LanguageChangedEvent = "pipLanguageChanged";
        var Translation = (function () {
            function Translation() {
                this._language = 'en';
                this._translations = {
                    en: {
                        'en': 'English',
                        'ru': 'Russian',
                        'es': 'Spanish',
                        'pt': 'Portuguese',
                        'de': 'German',
                        'fr': 'French'
                    },
                    ru: {
                        'en': 'Английский',
                        'ru': 'Русский',
                        'es': 'Испанский',
                        'pt': 'Португальский',
                        'de': 'Немецкий',
                        'fr': 'Французский'
                    }
                };
            }
            Object.defineProperty(Translation.prototype, "language", {
                get: function () { return this._language; },
                set: function (value) { this._language = value; },
                enumerable: true,
                configurable: true
            });
            Translation.prototype.use = function (language) {
                if (language != null)
                    this._language = language;
                return this._language;
            };
            Translation.prototype.setTranslations = function (language, translations) {
                var map = this._translations[language] || {};
                this._translations[language] = _.extend(map, translations);
            };
            Translation.prototype.translate = function (key) {
                if (_.isNull(key) || _.isUndefined(key))
                    return '';
                var translations = this._translations[this._language] || {};
                return translations[key] || key;
            };
            Translation.prototype.translateArray = function (keys) {
                if (_.isNull(keys) || keys.length == 0)
                    return [];
                var values = [];
                var translations = this._translations[this._language] || {};
                _.each(keys, function (k) {
                    var key = k || '';
                    values.push(translations[key] || key);
                });
                return values;
            };
            Translation.prototype.translateSet = function (keys, keyProp, valueProp) {
                if (_.isNull(keys) || keys.length == 0)
                    return [];
                keyProp = keyProp || 'id';
                valueProp = valueProp || 'name';
                var values = [];
                var translations = this._translations[this._language] || {};
                _.each(keys, function (key) {
                    var value = {};
                    key = key || '';
                    value[keyProp] = key;
                    value[valueProp] = translations[key] || key;
                    values.push(value);
                });
                return values;
            };
            Translation.prototype.translateObjects = function (items, keyProp, valueProp) {
                if (_.isNull(items) || items.length == 0)
                    return [];
                keyProp = keyProp || 'name';
                valueProp = valueProp || 'nameLocal';
                var translations = this._translations[this._language] || {};
                _.each(items, function (item) {
                    var key = item[keyProp] || '';
                    item[valueProp] = translations[key] || key;
                });
                return items;
            };
            Translation.prototype.translateWithPrefix = function (prefix, key) {
                prefix = prefix ? prefix + '_' : '';
                key = (prefix + key).replace(/ /g, '_').toUpperCase();
                if (key == null)
                    return '';
                var translations = this._translations[this._language] || {};
                return translations[key] || key;
            };
            ;
            Translation.prototype.translateSetWithPrefix = function (prefix, keys, keyProp, valueProp) {
                if (_.isNull(keys) || keys.length == 0)
                    return [];
                prefix = prefix ? prefix.replace(/ /g, '_').toUpperCase() : '';
                keyProp = keyProp || 'id';
                valueProp = valueProp || 'name';
                var values = [];
                var translations = this._translations[this._language] || {};
                _.each(keys, function (key) {
                    var value = {};
                    key = key || '';
                    value[keyProp] = key;
                    value[valueProp] = translations[prefix + '_' + key] || key;
                    values.push(value);
                });
                return values;
            };
            Translation.prototype.translateSetWithPrefix2 = function (prefix, keys, keyProp, valueProp) {
                if (_.isNull(keys) || keys.length == 0)
                    return [];
                keyProp = keyProp || 'id';
                valueProp = valueProp || 'name';
                prefix = prefix ? prefix.replace(/ /g, '_').toUpperCase() + '_' : '';
                var values = [];
                var translations = this._translations[this._language] || {};
                _.each(keys, function (key) {
                    var value = {};
                    key = key || '';
                    value[keyProp] = key;
                    value[valueProp] = translations[prefix + key.replace(/ /g, '_').toUpperCase()]
                        || (prefix + key.replace(/ /g, '_').toUpperCase());
                    values.push(value);
                });
                return values;
            };
            return Translation;
        }());
        var TranslateService = (function () {
            function TranslateService(translation, setRootVar, persist, $rootScope, localStorageService) {
                this._setRootVar = setRootVar;
                this._persist = persist;
                this._translation = translation;
                this._rootScope = $rootScope;
                this._storage = localStorageService;
                if (this._persist) {
                    this._translation.language = localStorageService.get('language')
                        || this._translation.language;
                }
                this.save();
            }
            TranslateService.prototype.save = function () {
                if (this._setRootVar)
                    this._rootScope[pip.translate.LanguageRootVar] = this._translation.language;
                if (this._persist)
                    this._storage.set('language', this._translation.language);
            };
            Object.defineProperty(TranslateService.prototype, "language", {
                get: function () {
                    return this._translation.language;
                },
                set: function (value) {
                    if (value != this._translation.language) {
                        this._translation.language = value;
                        this.save();
                        this._rootScope.$broadcast(pip.translate.LanguageChangedEvent, value);
                    }
                },
                enumerable: true,
                configurable: true
            });
            TranslateService.prototype.use = function (language) {
                if (language != null)
                    this.language = language;
                return this.language;
            };
            TranslateService.prototype.setTranslations = function (language, translations) {
                return this._translation.setTranslations(language, translations);
            };
            TranslateService.prototype.translate = function (key) {
                return this._translation.translate(key);
            };
            TranslateService.prototype.translateArray = function (keys) {
                return this._translation.translateArray(keys);
            };
            TranslateService.prototype.translateSet = function (keys, keyProp, valueProp) {
                return this._translation.translateSet(keys, keyProp, valueProp);
            };
            TranslateService.prototype.translateObjects = function (items, keyProp, valueProp) {
                return this._translation.translateObjects(items, keyProp, valueProp);
            };
            TranslateService.prototype.translateWithPrefix = function (prefix, key) {
                return this._translation.translateWithPrefix(prefix, key);
            };
            TranslateService.prototype.translateSetWithPrefix = function (prefix, keys, keyProp, valueProp) {
                return this._translation.translateSetWithPrefix(prefix, keys, keyProp, valueProp);
            };
            TranslateService.prototype.translateSetWithPrefix2 = function (prefix, keys, keyProp, valueProp) {
                return this._translation.translateSetWithPrefix2(prefix, keys, keyProp, valueProp);
            };
            return TranslateService;
        }());
        var TranslateProvider = (function (_super) {
            __extends(TranslateProvider, _super);
            function TranslateProvider() {
                _super.call(this);
            }
            Object.defineProperty(TranslateProvider.prototype, "setRootVar", {
                get: function () {
                    return this._setRootVar;
                },
                set: function (value) {
                    this._setRootVar = !!value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TranslateProvider.prototype, "persist", {
                get: function () {
                    return this._persist;
                },
                set: function (value) {
                    this._persist = !!value;
                },
                enumerable: true,
                configurable: true
            });
            TranslateProvider.prototype.$get = ['$rootScope', 'localStorageService', function ($rootScope, localStorageService) {
                "ngInject";
                if (this._service == null)
                    this._service = new TranslateService(this, this._setRootVar, this._persist, $rootScope, localStorageService);
                return this._service;
            }];
            return TranslateProvider;
        }(Translation));
        angular
            .module('pipTranslate.Service', [])
            .provider('pipTranslate', TranslateProvider);
    })(translate = pip.translate || (pip.translate = {}));
})(pip || (pip = {}));

(function () {
    'use strict';
    var thisModule = angular.module('pipCodes', []);
    thisModule.factory('pipCodes', function () {
        return {
            hash: hash,
            verification: verification
        };
        function hash(value) {
            if (value == null)
                return 0;
            var result = 0;
            for (var i = 0; i < value.length; i++) {
                result += value.charCodeAt(i);
            }
            return result;
        }
        function verification() {
            return Math.random().toString(36).substr(2, 10).toUpperCase();
        }
    });
})();



(function () {
    'use strict';
    var thisModule = angular.module('pipFormat', []);
    thisModule.factory('pipFormat', function () {
        function sample(value, maxLength) {
            if (!value || value == '')
                return '';
            var length = value.indexOf('\n');
            length = length >= 0 ? length : value.length;
            length = length < maxLength ? value.length : maxLength;
            return value.substring(0, length);
        }
        function strRepeat(str, qty) {
            if (qty < 1)
                return '';
            var result = '';
            while (qty > 0) {
                if (qty & 1)
                    result += str;
                qty >>= 1, str += str;
            }
            return result;
        }
        var sprintf = (function sprintf() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            function get_type(variable) {
                return toString.call(variable).slice(8, -1).toLowerCase();
            }
            var str_repeat = strRepeat;
            var str_format = function () {
                if (!str_format.cache.hasOwnProperty(arguments[0])) {
                    str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
                }
                return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
            };
            str_format.format = function (parse_tree, argv) {
                var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
                for (i = 0; i < tree_length; i++) {
                    node_type = get_type(parse_tree[i]);
                    if (node_type === 'string') {
                        output.push(parse_tree[i]);
                    }
                    else if (node_type === 'array') {
                        match = parse_tree[i];
                        if (match[2]) {
                            arg = argv[cursor];
                            for (k = 0; k < match[2].length; k++) {
                                if (!arg.hasOwnProperty(match[2][k])) {
                                    throw new Error(sprintf('[_.sprintf] property "%s" does not exist', match[2][k]));
                                }
                                arg = arg[match[2][k]];
                            }
                        }
                        else if (match[1]) {
                            arg = argv[match[1]];
                        }
                        else {
                            arg = argv[cursor++];
                        }
                        if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
                            throw new Error(sprintf('[_.sprintf] expecting number but found %s', get_type(arg)));
                        }
                        switch (match[8]) {
                            case 'b':
                                arg = arg.toString(2);
                                break;
                            case 'c':
                                arg = String.fromCharCode(arg);
                                break;
                            case 'd':
                                arg = parseInt(arg, 10);
                                break;
                            case 'e':
                                arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential();
                                break;
                            case 'f':
                                arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg);
                                break;
                            case 'o':
                                arg = arg.toString(8);
                                break;
                            case 's':
                                arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg);
                                break;
                            case 'u':
                                arg = Math.abs(arg);
                                break;
                            case 'x':
                                arg = arg.toString(16);
                                break;
                            case 'X':
                                arg = arg.toString(16).toUpperCase();
                                break;
                        }
                        arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+' + arg : arg);
                        pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
                        pad_length = match[6] - String(arg).length;
                        pad = match[6] ? str_repeat(pad_character, pad_length) : '';
                        output.push(match[5] ? arg + pad : pad + arg);
                    }
                }
                return output.join('');
            };
            str_format.cache = {};
            str_format.parse = function (fmt) {
                var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
                while (_fmt) {
                    if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
                        parse_tree.push(match[0]);
                    }
                    else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
                        parse_tree.push('%');
                    }
                    else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
                        if (match[2]) {
                            arg_names |= 1;
                            var field_list = [], replacement_field = match[2], field_match = [];
                            if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1]);
                                while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                                    if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                                        field_list.push(field_match[1]);
                                    }
                                    else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                                        field_list.push(field_match[1]);
                                    }
                                    else {
                                        throw new Error('[_.sprintf] huh?');
                                    }
                                }
                            }
                            else {
                                throw new Error('[_.sprintf] huh?');
                            }
                            match[2] = field_list;
                        }
                        else {
                            arg_names |= 2;
                        }
                        if (arg_names === 3) {
                            throw new Error('[_.sprintf] mixing positional and named placeholders is not (yet) supported');
                        }
                        parse_tree.push(match);
                    }
                    else {
                        throw new Error('[_.sprintf] huh?');
                    }
                    _fmt = _fmt.substring(match[0].length);
                }
                return parse_tree;
            };
            return str_format;
        })();
        return {
            sprintf: sprintf,
            format: sprintf,
            sample: sample
        };
    });
})();



(function () {
    'use strict';
    var thisModule = angular.module('pipPageReset', []);
    thisModule.factory('pipPageReset', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
        $rootScope.$on('pipResetPage', resetAll);
        return {
            resetPartial: resetPartial,
            resetFull: resetFull,
            resetAll: resetAll,
            reset: reset
        };
        function resetPartial() {
            reset(false, true);
        }
        function resetFull() {
            reset(true, false);
        }
        function resetAll() {
            reset(true, true);
        }
        function reset(full, partial) {
            full = full !== undefined ? !!full : true;
            partial = partial !== undefined ? !!partial : true;
            if (full || partial) {
                $rootScope.$reset = full;
                $rootScope.$partialReset = partial;
                $timeout(function () {
                    $rootScope.$reset = false;
                    $rootScope.$partialReset = false;
                }, 0);
            }
        }
    }]);
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipScroll', []);
    thisModule.factory('pipScroll', function () {
        return {
            scrollTo: scrollTo
        };
        function scrollTo(parentElement, childElement, animationDuration) {
            if (!parentElement || !childElement)
                return;
            if (animationDuration == undefined)
                animationDuration = 300;
            setTimeout(function () {
                if (!$(childElement).position())
                    return;
                var modDiff = Math.abs($(parentElement).scrollTop() - $(childElement).position().top);
                if (modDiff < 20)
                    return;
                var scrollTo = $(parentElement).scrollTop() + ($(childElement).position().top - 20);
                if (animationDuration > 0)
                    $(parentElement).animate({
                        scrollTop: scrollTo + 'px'
                    }, animationDuration);
            }, 100);
        }
    });
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipSystemInfo', []);
    thisModule.factory('pipSystemInfo', ['$rootScope', '$window', function ($rootScope, $window) {
        return {
            getBrowserName: getBrowserName,
            getBrowserVersion: getBrowserVersion,
            getPlatform: getPlatform,
            isDesktop: isDesktop,
            isMobile: isMobile,
            isCordova: isCordova,
            getOS: getOS,
            isSupported: isSupported
        };
        function getBrowserName() {
            var ua = $window.navigator.userAgent;
            if (ua.search(/Edge/) > -1)
                return "edge";
            if (ua.search(/MSIE/) > -1)
                return "ie";
            if (ua.search(/Trident/) > -1)
                return "ie";
            if (ua.search(/Firefox/) > -1)
                return "firefox";
            if (ua.search(/Opera/) > -1)
                return "opera";
            if (ua.search(/OPR/) > -1)
                return "opera";
            if (ua.search(/YaBrowser/) > -1)
                return "yabrowser";
            if (ua.search(/Chrome/) > -1)
                return "chrome";
            if (ua.search(/Safari/) > -1)
                return "safari";
            if (ua.search(/Maxthon/) > -1)
                return "maxthon";
            return "unknown";
        }
        function getBrowserVersion() {
            var browser, version;
            var ua = $window.navigator.userAgent;
            browser = getBrowserName();
            switch (browser) {
                case "edge":
                    version = (ua.split("Edge")[1]).split("/")[1];
                    break;
                case "ie":
                    version = (ua.split("MSIE ")[1]).split(";")[0];
                    break;
                case "ie11":
                    browser = "ie";
                    version = (ua.split("; rv:")[1]).split(")")[0];
                    break;
                case "firefox":
                    version = ua.split("Firefox/")[1];
                    break;
                case "opera":
                    version = ua.split("Version/")[1];
                    break;
                case "operaWebkit":
                    version = ua.split("OPR/")[1];
                    break;
                case "yabrowser":
                    version = (ua.split("YaBrowser/")[1]).split(" ")[0];
                    break;
                case "chrome":
                    version = (ua.split("Chrome/")[1]).split(" ")[0];
                    break;
                case "safari":
                    version = (ua.split("Version/")[1]).split(" ")[0];
                    break;
                case "maxthon":
                    version = ua.split("Maxthon/")[1];
                    break;
            }
            return version;
        }
        function getPlatform() {
            var ua = $window.navigator.userAgent;
            if (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua.toLowerCase()))
                return 'mobile';
            return 'desktop';
        }
        function isDesktop() {
            return getPlatform() == 'desktop';
        }
        function isMobile() {
            return getPlatform() == 'mobile';
        }
        function isCordova() {
            return null;
        }
        function getOS() {
            var ua = $window.navigator.userAgent;
            try {
                var osAll = (/(windows|mac|android|linux|blackberry|sunos|solaris|iphone)/.exec(ua.toLowerCase()) || [ua])[0].replace('sunos', 'solaris'), osAndroid = (/(android)/.exec(ua.toLowerCase()) || '');
                return osAndroid && (osAndroid == 'android' || (osAndroid[0] == 'android')) ? 'android' : osAll;
            }
            catch (err) {
                return 'unknown';
            }
        }
        function isSupported(supported) {
            if (!supported)
                supported = {
                    edge: 11,
                    ie: 11,
                    firefox: 43,
                    opera: 35,
                    chrome: 47
                };
            var browser = getBrowserName();
            var version = getBrowserVersion();
            version = version.split(".")[0];
            if (browser && supported[browser] && version >= supported[browser])
                return true;
            return true;
        }
        ;
    }]);
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipTags', []);
    thisModule.factory('pipTags', function () {
        return {
            equal: equal,
            normalizeOne: normalizeOne,
            normalizeAll: normalizeAll,
            normalize: normalizeAll,
            compressOne: compressOne,
            compressAll: compressAll,
            compress: compressAll,
            extract: extract
        };
        function normalizeOne(tag) {
            return tag
                ? _.trim(tag.replace(/(_|#)+/g, ' '))
                : null;
        }
        function compressOne(tag) {
            return tag
                ? tag.replace(/( |_|#)/g, '').toLowerCase()
                : null;
        }
        function equal(tag1, tag2) {
            if (tag1 == null && tag2 == null)
                return true;
            if (tag1 == null || tag2 == null)
                return false;
            return compressOne(tag1) == compressOne(tag2);
        }
        function normalizeAll(tags) {
            if (_.isString(tags)) {
                tags = tags.split(/( |,|;)+/);
            }
            tags = _.map(tags, function (tag) {
                return normalizeOne(tag);
            });
            return tags;
        }
        function compressAll(tags) {
            if (_.isString(tags))
                tags = tags.split(/( |,|;)+/);
            tags = _.map(tags, function (tag) {
                return compressOne(tag);
            });
            return tags;
        }
        ;
        function extract(entity, searchFields) {
            var tags = normalizeAll(entity.tags);
            _.each(searchFields, function (field) {
                var text = entity[field] || '';
                if (text != '') {
                    var hashTags = text.match(/#\w+/g);
                    tags = tags.concat(normalizeAll(hashTags));
                }
            });
            return _.uniq(tags);
        }
    });
})();

var pip;
(function (pip) {
    var utilities;
    (function (utilities) {
        'use strict';
        var TimerEvent = (function () {
            function TimerEvent() {
            }
            return TimerEvent;
        }());
        var DefaultEvents = [
            { event: 'pipAutoPullChanges', timeout: 60000 },
            { event: 'pipAutoUpdatePage', timeout: 15000 },
            { event: 'pipAutoUpdateCollection', timeout: 300000 }
        ];
        var TimerService = (function () {
            TimerService.$inject = ['$rootScope', '$interval'];
            function TimerService($rootScope, $interval) {
                this._started = false;
                this._events = _.cloneDeep(DefaultEvents);
                this._rootScope = $rootScope;
                this._interval = $interval;
            }
            Object.defineProperty(TimerService.prototype, "isStarted", {
                get: function () {
                    return this._started;
                },
                enumerable: true,
                configurable: true
            });
            TimerService.prototype.addEvent = function (event, timeout) {
                var existingEvent = _.find(this._events, function (e) { return e.event == event; });
                if (existingEvent != null)
                    return;
                var newEvent = {
                    event: event,
                    timeout: timeout
                };
                this._events.push(newEvent);
                if (this._started)
                    this.startEvent(newEvent);
            };
            TimerService.prototype.removeEvent = function (event) {
                for (var i = this._events.length - 1; i >= 0; i--) {
                    var existingEvent = this._events[i];
                    if (existingEvent.event == event) {
                        this.stopEvent(existingEvent);
                        this._events.splice(i, 1);
                    }
                }
            };
            TimerService.prototype.clearEvents = function () {
                this.stop();
                this._events = [];
            };
            TimerService.prototype.startEvent = function (event) {
                var _this = this;
                event.interval = this._interval(function () { _this._rootScope.$broadcast(event.event); }, event.timeout);
            };
            TimerService.prototype.stopEvent = function (event) {
                if (event.interval != null) {
                    try {
                        this._interval.cancel(event.interval);
                    }
                    catch (ex) {
                    }
                    event.interval = null;
                }
            };
            TimerService.prototype.start = function () {
                var _this = this;
                if (this._started)
                    return;
                _.each(this._events, function (event) {
                    _this.startEvent(event);
                });
                this._started = true;
            };
            TimerService.prototype.stop = function () {
                var _this = this;
                _.each(this._events, function (event) {
                    _this.stopEvent(event);
                });
                this._started = false;
            };
            return TimerService;
        }());
        angular
            .module('pipTimer', [])
            .service('pipTimer', TimerService);
    })(utilities = pip.utilities || (pip.utilities = {}));
})(pip || (pip = {}));







/**
 * @file Registration of basic WebUI controls
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function (angular) {
    'use strict';

    angular.module('pipButtons', [
        'pipToggleButtons',
        'pipRefreshButton',
        'pipFabTooltipVisibility'
    ]);

})(window.angular);


(function(module) {
try {
  module = angular.module('pipButtons.Templates');
} catch (e) {
  module = angular.module('pipButtons.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('toggle_buttons/toggle_buttons.html',
    '<div class="pip-toggle-buttons layout-row {{class}}" pip-selected="bufButtonIndex" pip-enter-space-press="enterSpacePress($event)"\n' +
    '     ng-if="$mdMedia(\'gt-xs\')">\n' +
    '    <md-button tabindex="-1" ng-repeat="button in buttons"\n' +
    '               ng-class="{\'md-accent md-raised selected color-accent-bg\' : currentButtonIndex == $index}"\n' +
    '               ng-attr-style="{{ \'background-color:\' + (currentButtonIndex == $index ? button.backgroundColor : \'\') + \'!important\' }}"\n' +
    '               class="pip-selectable pip-chip-button flex" ng-click="buttonSelected($index, $event)"\n' +
    '               ng-disabled="button.disabled || disabled()">\n' +
    '        {{button.name || button.title | translate}}\n' +
    '        <span ng-if="button.checked || button.complete || button.filled" class="pip-tagged">*</span>\n' +
    '    </md-button>\n' +
    '</div>\n' +
    '\n' +
    '<md-input-container class="md-block" ng-if="$mdMedia(\'xs\')">\n' +
    '    <md-select ng-model="currentButtonIndex" ng-disabled="disabled()" aria-label="DROPDOWN" md-on-close="buttonSelected(currentButtonIndex)">\n' +
    '        <md-option ng-repeat="action in buttons" value="{{ ::$index }}">\n' +
    '            {{ (action.title || action.name) | translate }}\n' +
    '            <span ng-if="action.checked || action.complete || action.filled" class="pip-tagged">*</span>\n' +
    '        </md-option>\n' +
    '    </md-select>\n' +
    '</md-input-container>\n' +
    '');
}]);
})();

/**
 * @file Optional filter to translate string resources
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipButtons.Translate', []);

    thisModule.filter('translate', ['$injector', function ($injector) {
        var pipTranslate = $injector.has('pipTranslate') 
            ? $injector.get('pipTranslate') : null;

        return function (key) {
            return pipTranslate  ? pipTranslate.translate(key) || key : key;
        }
    }]);

})();

/**
 * @file Directive to show confirmation dialog when user tries to leave page with unsaved changes.
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function(){
    'use strict';

    var thisModule = angular.module("pipFabTooltipVisibility", []);

    thisModule.directive("pipFabTooltipVisibility", ['$parse', '$timeout', function ($parse, $timeout) {
        return {
            restrict: 'A',
            scope: false,
            controller: ['$scope', '$attrs', function($scope, $attrs) {
                var trigGetter = $parse($attrs.pipFabTooltipVisibility),
                    showGetter = $parse($attrs.pipFabShowTooltip),
                    showSetter = showGetter.assign;

                $scope.$watch(trigGetter, function(isOpen) {
                    if (isOpen) {
                        $timeout(function() {
                            showSetter($scope, isOpen);
                        }, 600);
                    } else {
                        showSetter($scope, isOpen);
                    }
                });
            }]
        };
    }]);

})();

/**
 * @file Refresh button control
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipRefreshButton', ['ngMaterial']);

    thisModule.directive('pipRefreshButton',
        ['$parse', function ($parse) {
            return {
                restrict: 'EA',
                scope: false,
                template: String() +
                '<md-button class="pip-refresh-button" tabindex="-1" ng-click="onClick($event)" aria-label="REFRESH">' +
                '<md-icon md-svg-icon="icons:refresh"></md-icon>' +
                '<span class="pip-refresh-text"></span>' +
                '</md-button>',
                replace: false,
                link: function ($scope, $element, $attrs) {
                    var width, text, show,
                        textGetter = $parse($attrs.pipText),
                        visibleGetter = $parse($attrs.pipVisible),
                        refreshGetter = $parse($attrs.pipRefresh),
                        $button = $element.children('.md-button'),
                        $text = $button.children('.pip-refresh-text');

                    show = function () {
                        // Set a new text
                        text = textGetter($scope);
                        $text.text(text);

                        // Show button
                        $button.show();

                        // Adjust position
                        width = $button.width();
                        $button.css('margin-left', '-' + width / 2 + 'px');
                    };

                    function hide() {
                        $button.hide();
                    }

                    $scope.onClick = function () {
                        refreshGetter($scope);
                    };

                    $scope.$watch(visibleGetter, function (newValue) {
                        if (newValue) {
                            show();
                        } else {
                            hide();
                        }
                    });

                    $scope.$watch(textGetter, function (newValue) {
                        $text.text(newValue);
                    });
                }
            };
        }]
    );

})(window.angular);


/**
 * @file Toggle buttons control
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipToggleButtons', ['pipButtons.Templates']);

    thisModule.directive('pipToggleButtons',
        function () {
            return {
                restrict: 'EA',
                scope: {
                    ngDisabled: '&',
                    buttons: '=pipButtons',
                    currentButtonValue: '=ngModel',
                    currentButton: '=?pipButtonObject',
                    change: '&ngChange'
                },
                templateUrl: 'toggle_buttons/toggle_buttons.html',
                controller: ['$scope', '$element', '$attrs', '$mdMedia', '$timeout', function ($scope, $element, $attrs, $mdMedia, $timeout) {
                    var index;

                    $scope.$mdMedia = $mdMedia;
                    $scope.class = $attrs.class || '';

                    if (!$scope.buttons || _.isArray($scope.buttons) && $scope.buttons.length === 0) {
                        $scope.buttons = [];
                    }

                    index = _.indexOf($scope.buttons, _.find($scope.buttons, {id: $scope.currentButtonValue}));
                    $scope.currentButtonIndex = index < 0 ? 0 : index;
                    $scope.currentButton = $scope.buttons.length > 0 ? $scope.buttons[$scope.currentButtonIndex]
                        : $scope.currentButton;

                    $scope.buttonSelected = function (index) {
                        if ($scope.disabled()) {
                            return;
                        }

                        $scope.currentButtonIndex = index;
                        $scope.currentButton = $scope.buttons[$scope.currentButtonIndex];
                        $scope.currentButtonValue = $scope.currentButton.id || index;

                        $timeout(function () {
                            if ($scope.change) {
                                $scope.change();
                            }
                        });
                    };

                    $scope.enterSpacePress = function (event) {
                        $scope.buttonSelected(event.index);
                    };

                    $scope.disabled = function () {
                        if ($scope.ngDisabled) {
                            return $scope.ngDisabled();
                        }
                    };
                }],
                link: function (scope, elem) {
                    elem
                        .on('focusin', function () {
                            elem.addClass('focused-container');
                        })
                        .on('focusout', function () {
                            elem.removeClass('focused-container');
                        });
                }
            };
        }
    );

})(window.angular, window._);



/**
 * @file Registration of landing WebUI controls
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function (angular) {
    'use strict';

    angular.module('pipLanding', [
    ]);

})(window.angular);




/**
 * @file Registration of all application layouts
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';

    angular.module('pipLayout', [
        'pipLayout.Main', 'pipLayout.Simple', 'pipLayout.Card', 'pipLayout.Document',
        'pipLayout.Tiles', 'pipLayout.Dialog', 'pipLayout.Media'
    ]);

})();

/**
 * @file Card layout
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipLayout.Card', []);

    thisModule.directive('pipCard', function() {
        return {
           restrict: 'EA',
           //controller: 'pipCardController'
            link: function($scope, $element, $attrs) {
                var $window = $(window);

                // Add class to the element
                $element.addClass('pip-card');

                // Resize every time window is resized
                $scope.$on('pipWindowResized', resize);

                // Resize right away to avoid flicking
                resize();

                // Resize the element right away
                setTimeout(resize, 100);

                return;

                //---------------

                function resize() {
                    var
                        $mainBody = $('.pip-main-body'),
                        cardContainer = $('.pip-card-container'),
                        windowWidth = $window.width(),
                        maxWidth = $mainBody.width(),
                        maxHeight = $mainBody.height(),
                        minWidth = $attrs.minWidth ? Math.floor($attrs.minWidth) : null,
                        minHeight = $attrs.minHeight ? Math.floor($attrs.minHeight) : null,
                        width = $attrs.width ? Math.floor($attrs.width) : null,
                        height = $attrs.height ? Math.floor($attrs.height) : null,
                        left, top;

                    // Full-screen on phone
                    if (windowWidth <= 768) {
                        minWidth = null;
                        minHeight = null;
                        width = null;
                        height = null;
                        maxWidth = null;
                        maxHeight = null;
                    }
                    // Card view with adjustable margins on tablet and desktop
                    else {
                        // Set margin and maximum dimensions
                        var space = windowWidth > 1200 ? 24 : 16;
                        maxWidth -= space * 2;
                        maxHeight -= space * 2;

                        // Set minimum dimensions
                        minWidth = minWidth ? Math.min(minWidth, maxWidth) : null;
                        minHeight = minHeight ? Math.min(minHeight, maxHeight) : null;

                        // Set regular dimensions
                        width = width ? Math.min(width, maxWidth) : null;
                        height = height ? Math.min(height, maxHeight) : null;
                    }

                    // Set dimensions
                    $element.css('max-width', maxWidth ? maxWidth + 'px' : '');
                    $element.css('min-width', minWidth ? minWidth + 'px' : '');
                    $element.css('width', width ? width + 'px' : '');
                    $element.css('height', height ? height + 'px' : '');

                    if (!cardContainer.hasClass('pip-outer-scroll'))
                    {
                        $element.css('max-height', maxHeight ? maxHeight + 'px' : '');
                        $element.css('min-height', minHeight ? minHeight + 'px' : '');
                        var
                            $header = $element.find('.pip-header:visible'),
                            $footer = $element.find('.pip-footer:visible'),
                            $body = $element.find('.pip-body'),
                            maxBodyHeight = maxHeight || $mainBody.height();

                        if ($header.length > 0)
                            maxBodyHeight -= $header.outerHeight(true);
                        if ($footer.length > 0)
                            maxBodyHeight -= $footer.outerHeight(true);

                        $body.css('max-height', maxBodyHeight + 'px');
                    } else {
                        cardContainer.addClass('pip-scroll');
                        if (windowWidth <= 768) {
                            left = 0;
                            top = 0;
                        } else {
                            left = cardContainer.width() / 2 - $element.width() / 2 - 16;
                            top = Math.max(cardContainer.height() / 2 - $element.height() / 2 - 16, 0);
                        }

                        $element.css('left', left);
                        $element.css('top', top);
                        setTimeout(function () {
                            $element.css('display', 'flex');
                        }, 100);
                    }

                    // Notify child controls that layout was resized
                    $scope.$broadcast('pipLayoutResized');
                };
            }
        }
    });

})();

/**
 * @file Dialog layout
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipLayout.Dialog', []);

    thisModule.directive('pipDialog', function() {
        return {
           restrict: 'EA',
           controller: 'pipDialogController'
        };
    });

    thisModule.controller('pipDialogController', 
        ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
            var $window = $(window);

            // Add class to the element
            $element.addClass('pip-dialog');

            // Resize every time window is resized
            $scope.$on('pipWindowResized', resize);

            $scope.$on('pipResizeLayout', resize);


            // Resize right away to avoid flicking
            resize();

            // Resize the element right away
            //setTimeout(resize, 0);
            $window.trigger('resize');

            return;

            //-----------------------

            function resize() {
                var
                    maxWidth = $window.width(),
                    maxHeight = $window.height(),
                    minWidth = $attrs.minWidth ? Math.floor($attrs.minWidth) : null,
                    minHeight = $attrs.minHeight ? Math.floor($attrs.minHeight) : null,
                    width = $attrs.width ? Math.floor($attrs.width) : null,
                    height = $attrs.height ? Math.floor($attrs.height) : null;

                // Set margin and maximum dimensions
                var space = maxWidth > 1200 ? 24 : 16;
                maxWidth -= space * 2;
                maxHeight -= space * 2;

                // Set minimum dimensions
                minWidth = minWidth && minWidth < maxWidth ? minWidth : null;
                minHeight = minHeight && minHeight < maxHeight ? minHeight : null;

                // Set regular dimensions
                width = width ? Math.min(width, maxWidth) : null;
                height = height ? Math.min(height, maxHeight) : null;

                // Set dimensions
                $element.css('max-width', maxWidth ? maxWidth + 'px' : '');
                $element.css('max-height', maxHeight ? maxHeight + 'px' : '');
                $element.css('min-width', minWidth ? minWidth + 'px' : '');
                $element.css('min-height', minHeight ? minHeight + 'px' : '');
                $element.css('width', width ? width + 'px' : '');
                $element.css('height', height ? height + 'px' : '');

                // Notify child controls that layout was resized
                $scope.$broadcast('pipLayoutResized');
            };
        }]
    );

})();

/**
 * @file Document layout
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipLayout.Document', []);

    thisModule.directive('pipDocument', function() {
        return {
           restrict: 'EA',
           controller: 'pipDocumentController'
        };
    });

    thisModule.controller('pipDocumentController', 
        ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
            // Add class to the element
            $element.addClass('pip-document');
        }]
    );    

})();

/**
 * @file Top-level application container
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipLayout.Main', []);

    thisModule.directive('pipMain', function() {
        return {
           restrict: 'EA',
           controller: 'pipMainController' 
        }
    });

    thisModule.directive('pipMainBody', function() {
       return {
           restrict: 'EA',
           link: function($scope, $element) {
                $element.addClass('pip-main-body');
           }
       };
    });

    thisModule.controller('pipMainController',
        ['$scope', '$element', '$rootScope', 'pipMedia', function($scope, $element, $rootScope, pipMedia) {
            var $window = $(window);

            // Add CSS class
            $element.addClass('pip-main');

            pipMedia().addResizeListener($element[0], resize);

            // Handle window resize events
            //$window.bind('resize', resize);

            // Unbind when scope is removed
            $scope.$on('$destroy', function() {
                pipMedia().removeResizeListener($element[0]);
                //$window.unbind('resize', resize);
            });

            // Resize window from request
            //$rootScope.$on('pipResizeWindow', function(event) {
            //    // Trigger a bit latter t allow full initialization
            //    // Do not remove! Otherwise, sizes in layouts calculated incorrectly
            //    setTimeout(resize, 0);
            //});

            // Allow to finish initialization of all controllers
            //setTimeout(resize, 0);

            return;
            
            //---------------

            function resize() {
                $rootScope.$broadcast('pipWindowResized');
            }
        }]
    );

})();

/**
 * @file Media service to detect the width of pip-main container
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, $) {
    'use strict';

    var thisModule = angular.module('pipLayout.Media', []);

    thisModule.service('pipMedia',
        ['$rootScope', '$timeout', function ($rootScope, $timeout) {

            var elementWidth = null,
                sizes = {
                    'xs': false,
                    'gt-xs': false,
                    'sm': false,
                    'gt-sm': false,
                    'md': false,
                    'gt-md': false,
                    'lg': false,
                    'gt-lg': false,
                    'xl': false
                },
                attachEvent = document.attachEvent,
                isIE = navigator.userAgent.match(/Trident/);
            
            return function (size) {
                if (size) {
                    return sizes[size];
                } else {
                    return {
                        addResizeListener: addResizeListener,
                        removeResizeListener: removeResizeListener
                    };
                }
            };

            function requestFrame(fn) {
                var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
                    function(fn){ return window.setTimeout(fn, 20); };

                return raf(fn);
            }

            function cancelFrame() {
                var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
                    window.clearTimeout;
                return function(id){ return cancel(id); };
            }

            function resizeListener(e) {
                var win = e.target || e.srcElement;
                if (win.__resizeRAF__) cancelFrame(win.__resizeRAF__);
                win.__resizeRAF__ = requestFrame(function(){
                    var trigger = win.__resizeTrigger__;
                    trigger.__resizeListeners__.forEach(function(fn){
                        fn.call(trigger, e);
                    });
                });
            }

            function objectLoad(e) {
                this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
                this.contentDocument.defaultView.addEventListener('resize', resizeListener);
            }

            function addResizeListener(element, fn) {
                if (!element.__resizeListeners__) {
                    element.__resizeListeners__ = [];
                    if (attachEvent) {
                        element.__resizeTrigger__ = element;
                        element.attachEvent('onresize', resizeListener);
                    }
                    else {
                        if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
                        var obj = element.__resizeTrigger__ = document.createElement('object');
                        obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
                        obj.__resizeElement__ = element;
                        obj.onload = objectLoad;
                        obj.type = 'text/html';
                        if (isIE) element.appendChild(obj);
                        obj.data = 'about:blank';
                        if (!isIE) element.appendChild(obj);
                    }
                }
                setSizes();
                if (fn) element.__resizeListeners__.push(fn);
                element.__resizeListeners__.push(setSizes);
            }

            function removeResizeListener(element, fn) {
                if (fn) element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
                if (!element.__resizeListeners__.length) {
                    if (attachEvent) element.detachEvent('onresize', resizeListener);
                    else {
                        element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
                        element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
                    }
                }
            }

            function updateClasses() {
                $.each(sizes, function (name, size) {
                    $('body')[size ? 'addClass': 'removeClass']('pip-' + name);
                });
            }

            function setSizes() {
                elementWidth = $('.pip-main').innerWidth();
                sizes['xs'] = elementWidth <= 599;
                sizes['gt-xs'] = elementWidth >= 600;
                sizes['sm'] = elementWidth >= 600 && elementWidth <= 959;
                sizes['gt-sm'] = elementWidth >= 960;
                sizes['md'] = elementWidth >= 960 && elementWidth <= 1279;
                sizes['gt-md'] = elementWidth >= 1280;
                sizes['lg'] = elementWidth >= 1280 && elementWidth <= 1919;
                sizes['gt-lg'] = elementWidth >= 1920;
                sizes['xl'] = sizes['gt-lg'];

                updateClasses();

                $timeout(function () {
                    $rootScope.$apply();
                });
            }

        }]
    );

})(window.angular, window._, window.jQuery);

/**
 * @file Simple layout
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipLayout.Simple', []);

    thisModule.directive('pipSimple', function() {
       return {
           restrict: 'EA',
           link: function($scope, $element, $attrs) {
                $element.addClass('pip-simple');
           }
       };
    });

})();

/**
 * @file Tiles layout
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global $, angular, Masonry */

(function () {
    'use strict';

    var thisModule = angular.module('pipLayout.Tiles', ['wu.masonry']);

    thisModule.directive('pipTiles', function() {
       return {
           restrict: 'EA',
           scope: false,
           transclude: true,
           template:
               function($element, $attrs) {
                   if (convertToBoolean($attrs.pipInfinite)) {
                       return  String()
                       + '<div masonry class="pip-tiles-container" load-images="false" preserve-order  '
                       + ' ng-transclude column-width=".pip-tile-sizer" item-selector=".pip-tile"'
                       + ' masonry-options="tilesOptions"  pip-scroll-container="\'.pip-tiles\'"'
                       + ' pip-infinite-scroll="readScroll()" >'
                       + '</div>';
                   } else {
                       return String()
                           + '<div masonry class="pip-tiles-container" load-images="false" preserve-order  '
                           + ' ng-transclude column-width=".pip-tile-sizer" item-selector=".pip-tile"'
                           + ' masonry-options="tilesOptions">'
                           + '</div>';
                   }
               },
           controller: ['$scope', function($scope) {
                $scope.tilesOptions = {
                    gutter: 8,//16
                    isFitWidth: false,
                    isResizeBound: false,
                    transitionDuration: 0 // '0.2s'
                };
           }],
           link: pipTilesController 
        };
    });

    function pipTilesController($scope, $element, $attrs) {
        var
            $window = $(window),
            columnWidth = $attrs.columnWidth ? Math.floor($attrs.columnWidth) : 440,
            container = $element.children('.pip-tiles-container'),
            prevContainerWidth = null,
            masonry = Masonry.data(container[0]);
        
        // Add class to the element
        $element.addClass('pip-tiles');

        // Insert sizer
        var sizer = $('<div class="pip-tile-sizer"></div>');
        sizer.appendTo(container);

        // Resize every time window is resized
        $scope.$on('pipWindowResized', function () {
            console.log('resize tiles');
            resize(false);
        });

        // Force layout by request
        //$scope.$on('pipResizeLayout', function () {
        //    resize(true);
        //});

        // Resize the element right away
        resize();

        return;

        //--------------------

        function resize(force) {
            var
                width = $window.width(),
                containerWidth;

            if (width > 767) {
                width = width - 24 * 2;

                var columns = Math.floor(width / columnWidth);
                containerWidth = (columnWidth + 16) * columns - 16;

                if (containerWidth > width) {
                    columns--;
                    containerWidth = (columnWidth + 16) * columns - 16;
                }

                if (columns < 1) {
                    containerWidth = width;
                    sizer.css('width', containerWidth + 'px');
                } else {
                    sizer.css('width', columnWidth + 'px');
                }

                // +1 to avoid precision related error
                container.css('width', (containerWidth + 1) + 'px');
            } else {
                width = width - 16 * 2;
                containerWidth = width;

                sizer.css('width', containerWidth + 'px');
                // +1 to avoid precision related error
                container.css('width', (containerWidth + 1) + 'px');
            }

            // Manually call layout on tile container
            if (prevContainerWidth != containerWidth || force) {
                prevContainerWidth = containerWidth;
                masonry.layout();

                // Notify child controls that layout was resized
                $scope.$broadcast('pipLayoutResized');
            }
        }
    }

    // Converts value into boolean
    function convertToBoolean(value) {
        if (value == null) return false;
        if (!value) return false;
        value = value.toString().toLowerCase();
        return value == '1' || value == 'true';
    };

})();



/**
 * @file Split layout
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global $, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipSplit', []);

    thisModule.run( ['$rootScope', 'pipSplit', function($rootScope, pipSplit) {
        // Intercept routes
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams) {
                // Split animation
                var splitElements = $('.pip-split');
                
                if (splitElements.length > 0) {
                    splitElements.removeClass('pip-transition-forward');
                    splitElements.removeClass('pip-transition-back');
                    if (toState.name != fromState.name) {
                        if (pipSplit.forwardTransition(toState, fromState)) {
                            splitElements.addClass('pip-transition-forward');
                        } else {
                            splitElements.addClass('pip-transition-back');
                        }
                    }
                }

            }
        );

    }]);

    thisModule.provider('pipSplit', function() {
        var transitionSequences = [];

        this.addTransitionSequence = addTransitionSequence;

        this.$get = function () {
            return {
                forwardTransition: forwardTransition
            };
        };

        return;

        //----------------------------

        function addTransitionSequence(sequence) {
            if (!_.isArray(sequence) || sequence.length == 0) {
                throw new Error('Transition sequence must be an array of state names');
            }

            transitionSequences.push(sequence);
        }

        function forwardTransition(toState, fromState) {
            var i, toIndex, fromIndex;

            for (i = 0; i < transitionSequences.length; i++) {
                toIndex = transitionSequences[i].indexOf(toState.name),
                fromIndex = transitionSequences[i].indexOf(fromState.name);

                if (toIndex > -1) {
                    return toIndex > fromIndex;
                }
            }

            return false
        }

    });

})();



/**
 * @file Registration of basic WebUI controls
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function (angular) {
    'use strict';

    angular.module('pipControls', [
        'pipMarkdown',
        'pipColorPicker',
        'pipRoutingProgress',
        'pipPopover',
        'pipImageSlider',
        'pipToasts',
        'pipUnsavedChanges',
        'pipControls.Translate',
        'pipDraggable'
    ]);

})(window.angular);


(function(module) {
try {
  module = angular.module('pipControls.Templates');
} catch (e) {
  module = angular.module('pipControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('color_picker/color_picker.html',
    '<ul class="pip-color-picker {{class}}" pip-selected="currentColorIndex" pip-enter-space-press="enterSpacePress($event)">\n' +
    '    <li tabindex="-1" ng-repeat="color in colors track by color">\n' +
    '        <md-button  tabindex="-1" class="md-icon-button pip-selectable" ng-click="selectColor($index)" aria-label="color" ng-disabled="disabled()">\n' +
    '            <md-icon ng-style="{\'color\': color}" md-svg-icon="icons:{{ color == currentColor ? \'circle\' : \'radio-off\' }}">\n' +
    '            </md-icon>\n' +
    '        </md-button>\n' +
    '    </li>\n' +
    '</ul>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipControls.Templates');
} catch (e) {
  module = angular.module('pipControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('popover/popover.html',
    '<div ng-if="params.templateUrl" class=\'pip-popover flex layout-column\'\n' +
    '     ng-click="onPopoverClick($event)" ng-include="params.templateUrl">\n' +
    '</div>\n' +
    '\n' +
    '<div ng-if="params.template" class=\'pip-popover\' ng-click="onPopoverClick($event)">\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipControls.Templates');
} catch (e) {
  module = angular.module('pipControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('progress/routing_progress.html',
    '<div class="pip-routing-progress layout-column layout-align-center-center"\n' +
    '        ng-show="showProgress()">\n' +
    '     <!--ng-show="$routing || $reset || toolInitialized">-->\n' +
    '    <div class="loader">\n' +
    '        <svg class="circular" viewBox="25 25 50 50">\n' +
    '            <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>\n' +
    '        </svg>\n' +
    '    </div>\n' +
    '\n' +
    '    <img src=""  height="40" width="40" class="pip-img">\n' +
    '\n' +
    '    <md-progress-circular md-diameter="96"\n' +
    '                          class="fix-ie"></md-progress-circular>\n' +
    '\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipControls.Templates');
} catch (e) {
  module = angular.module('pipControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('toast/toast.html',
    '<md-toast class="md-action pip-toast"\n' +
    '          ng-class="{\'pip-error\': toast.type==\'error\',\n' +
    '          \'pip-column-toast\': toast.type == \'error\' || toast.actions.length > 1 || actionLenght > 4,\n' +
    '          \'pip-no-action-toast\': actionLenght == 0}"\n' +
    '          style="height:initial; max-height: initial; ">\n' +
    '\n' +
    '    <span class="flex-var pip-text" ng-bind-html="message"></span>\n' +
    '    <div class="layout-row layout-align-end-start" class="pip-actions" ng-if="actions.length > 0 || (toast.type==\'error\' && toast.error)">\n' +
    '        <md-button class="flex-fixed pip-toast-button" ng-if="toast.type==\'error\' && toast.error && showDetails" ng-click="onDetails()">Details</md-button>\n' +
    '        <md-button class="flex-fixed pip-toast-button"\n' +
    '                   ng-click="onAction(action)"\n' +
    '                   ng-repeat="action in actions"\n' +
    '                   aria-label="{{::action| translate}}">\n' +
    '            {{::action| translate}}\n' +
    '        </md-button>\n' +
    '    </div>\n' +
    '\n' +
    '</md-toast>');
}]);
})();

/**
 * @file Color picker control
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipColorPicker', [ 'pipControls.Templates']); // 'pipFocused',

    thisModule.directive('pipColorPicker',
        function () {
            return {
                restrict: 'EA',
                scope: {
                    ngDisabled: '&',
                    colors: '=pipColors',
                    currentColor: '=ngModel',
                    colorChange: '&ngChange'
                },
                templateUrl: 'color_picker/color_picker.html',
                controller: 'pipColorPickerController'
            };
        }
    );
    thisModule.controller('pipColorPickerController',
        ['$scope', '$element', '$attrs', '$timeout', function ($scope, $element, $attrs, $timeout) {
            var
                DEFAULT_COLORS = ['purple', 'lightgreen', 'green', 'darkred', 'pink', 'yellow', 'cyan'];

            $scope.class = $attrs.class || '';

            if (!$scope.colors || _.isArray($scope.colors) && $scope.colors.length === 0) {
                $scope.colors = DEFAULT_COLORS;
            }

            $scope.currentColor = $scope.currentColor || $scope.colors[0];
            $scope.currentColorIndex = $scope.colors.indexOf($scope.currentColor);

            $scope.disabled = function () {
                if ($scope.ngDisabled) {
                    return $scope.ngDisabled();
                }

                return true;
            };

            $scope.selectColor = function (index) {
                if ($scope.disabled()) {
                    return;
                }
                $scope.currentColorIndex = index;

                $scope.currentColor = $scope.colors[$scope.currentColorIndex];

                $timeout(function () {
                    $scope.$apply();
                });

                if ($scope.colorChange) {
                    $scope.colorChange();
                }
            };

            $scope.enterSpacePress = function (event) {
                $scope.selectColor(event.index);
            };
        }]
    );

})(window.angular, window._);

/**
 * @file Optional filter to translate string resources
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipControls.Translate', []);

    thisModule.filter('translate', ['$injector', function ($injector) {
        var pipTranslate = $injector.has('pipTranslate') 
            ? $injector.get('pipTranslate') : null;

        return function (key) {
            return pipTranslate  ? pipTranslate.translate(key) || key : key;
        }
    }]);

})();

/**
 * @file Drag & drop attachable behavior
 * @description
 * Based on https://github.com/fatlinesofcode/pipDraggable
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipDraggable", []);

    thisModule.service('pipDraggable', function () {

        var scope = this;
        scope.inputEvent = function (event) {
            if (angular.isDefined(event.touches)) {
                return event.touches[0];
            }
            //Checking both is not redundent. If only check if touches isDefined, angularjs isDefnied will return error and stop the remaining scripty if event.originalEvent is not defined.
            else if (angular.isDefined(event.originalEvent) && angular.isDefined(event.originalEvent.touches)) {
                return event.originalEvent.touches[0];
            }
            return event;
        };

    });

    thisModule.directive('pipDrag',
        ['$rootScope', '$parse', '$document', '$window', 'pipDraggable', function ($rootScope, $parse, $document, $window, pipDraggable) {
            return {

                restrict: 'A',
                link: function (scope, element, attrs) {
                    scope.value = attrs.ngDrag;
                    var LONG_PRESS = 50; // 50ms for longpress
                    var offset, _centerAnchor = false, _mx, _my, _tx, _ty, _mrx, _mry;
                    var _hasTouch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
                    var _pressEvents = 'touchstart mousedown';
                    var _moveEvents = 'touchmove mousemove';
                    var _releaseEvents = 'touchend mouseup';
                    var _dragHandle;

                    // to identify the element in order to prevent getting superflous events when a single element has both drag and drop directives on it.
                    var _myid = scope.$id;
                    var _data = null;

                    var _dragOffset = null;

                    var _dragEnabled = false;

                    var _pressTimer = null;

                    var _elementStyle = {};

                    var onDragStartCallback = $parse(attrs.pipDragStart) || null;
                    var onDragStopCallback = $parse(attrs.pipDragStop) || null;
                    var onDragSuccessCallback = $parse(attrs.pipDragSuccess) || null;
                    var allowTransform = angular.isDefined(attrs.allowTransform) ? scope.$eval(attrs.allowTransform) : false;

                    var getDragData = $parse(attrs.pipDragData);
                    var
                        verticalScroll = toBoolean(attrs.pipVerticalScroll) || true,
                        horizontalScroll = toBoolean(attrs.pipHorizontalScroll) || true,
                        activationDistance = parseFloat(attrs.pipActivationDistance) || 75,
                        scrollDistance = parseFloat(attrs.pipScrollDistance) || 50,
                        scrollParent = false,

                        scrollContainer = angular.element(window),
                        scrollContainerGetter = $parse(attrs.pipScrollContainer);

                    // deregistration function for mouse move events in $rootScope triggered by jqLite trigger handler
                    var _deregisterRootMoveListener = angular.noop;

                    initialize();

                    return;

                    //-----------------------------------

                    function initialize() {
                        element.attr('pip-draggable', 'false'); // prevent native drag
                        // check to see if drag handle(s) was specified
                        // if querySelectorAll is available, we use this instead of find
                        // as JQLite find is limited to tagnames
                        if (element[0].querySelectorAll) {
                            var dragHandles = angular.element(element[0].querySelectorAll('[pip-drag-handle]'));
                        } else {
                            var dragHandles = element.find('[pip-drag-handle]');
                        }
                        if (dragHandles.length) {
                            _dragHandle = dragHandles;
                        }
                        toggleListeners(true);

                        // Initialize scroll container
                        if (scrollParent) {
                            scrollContainer = angular.element($element.parent());
                        } else if (attrs.pipScrollContainer) {
                            scrollContainer = angular.element(scrollContainerGetter(scope));
                        } else {
                            scrollContainer = angular.element(window);
                        }
                    }

                    function toBoolean(value) {
                        if (value == null) return false;
                        if (!value) return false;
                        value = value.toString().toLowerCase();
                        return value == '1' || value == 'true';
                    }

                    function toggleListeners(enable) {
                        if (!enable)return;
                        // add listeners.

                        scope.$on('$destroy', onDestroy);
                        scope.$watch(attrs.pipDrag, onEnableChange);
                        scope.$watch(attrs.pipCenterAnchor, onCenterAnchor);
                        // wire up touch events
                        if (_dragHandle) {
                            // handle(s) specified, use those to initiate drag
                            _dragHandle.on(_pressEvents, onpress);
                        } else {
                            // no handle(s) specified, use the element as the handle
                            element.on(_pressEvents, onpress);
                        }
                        if (!_hasTouch && element[0].nodeName.toLowerCase() == "img") {
                            element.on('mousedown', function () {
                                return false;
                            }); // prevent native drag for images
                        }
                    }
                    
                    function onDestroy(enable) {
                        toggleListeners(false);
                    }

                    function onEnableChange(newVal, oldVal) {
                        _dragEnabled = (newVal);
                    }

                    function onCenterAnchor(newVal, oldVal) {
                        if (angular.isDefined(newVal))
                            _centerAnchor = (newVal || 'true');
                    }

                    function isClickableElement(evt) {
                        return (
                            angular.isDefined(angular.element(evt.target).attr("pip-cancel-drag"))
                        );
                    }

                    /*
                     * When the element is clicked start the drag behaviour
                     * On touch devices as a small delay so as not to prevent native window scrolling
                     */
                    function onpress(evt) {
                        if (!_dragEnabled)return;

                        if (isClickableElement(evt)) {
                            return;
                        }

                        if (evt.type == "mousedown" && evt.button != 0) {
                            // Do not start dragging on right-click
                            return;
                        }

                        saveElementStyles();

                        if (_hasTouch) {
                            cancelPress();
                            _pressTimer = setTimeout(function () {
                                cancelPress();
                                onlongpress(evt);
                            }, LONG_PRESS);
                            $document.on(_moveEvents, cancelPress);
                            $document.on(_releaseEvents, cancelPress);
                        } else {
                            onlongpress(evt);
                        }

                    }

                    function saveElementStyles() {
                        _elementStyle.left = element.css('css') || 0;
                        _elementStyle.top = element.css('top') || 0;
                        _elementStyle.position = element.css('position');
                        _elementStyle.width = element.css('width');    
                    }

                    function cancelPress() {
                        clearTimeout(_pressTimer);
                        $document.off(_moveEvents, cancelPress);
                        $document.off(_releaseEvents, cancelPress);
                    }

                    function onlongpress(evt) {
                        if (!_dragEnabled)return;
                        evt.preventDefault();

                        offset = element[0].getBoundingClientRect();
                        if (allowTransform)
                            _dragOffset = offset;
                        else {
                            _dragOffset = {left: document.body.scrollLeft, top: document.body.scrollTop};
                        }


                        element.centerX = element[0].offsetWidth / 2;
                        element.centerY = element[0].offsetHeight / 2;

                        _mx = pipDraggable.inputEvent(evt).pageX;
                        _my = pipDraggable.inputEvent(evt).pageY;
                        _mrx = _mx - offset.left;
                        _mry = _my - offset.top;
                        if (_centerAnchor) {
                            _tx = _mx - element.centerX - $window.pageXOffset;
                            _ty = _my - element.centerY - $window.pageYOffset;
                        } else {
                            _tx = _mx - _mrx - $window.pageXOffset;
                            _ty = _my - _mry - $window.pageYOffset;
                        }

                        $document.on(_moveEvents, onmove);
                        $document.on(_releaseEvents, onrelease);
                        // This event is used to receive manually triggered mouse move events
                        // jqLite unfortunately only supports triggerHandler(...)
                        // See http://api.jquery.com/triggerHandler/
                        // _deregisterRootMoveListener = $rootScope.$on('draggable:_triggerHandlerMove', onmove);
                        _deregisterRootMoveListener = $rootScope.$on('draggable:_triggerHandlerMove', function (event, origEvent) {
                            onmove(origEvent);
                        });
                    }

                    function onmove(evt) {
                        if (!_dragEnabled)return;
                        evt.preventDefault();

                        if (!element.hasClass('pip-dragging')) {
                            _data = getDragData(scope);
                            element.addClass('pip-dragging');
                            $rootScope.$broadcast('draggable:start', {
                                x: _mx,
                                y: _my,
                                tx: _tx,
                                ty: _ty,
                                event: evt,
                                element: element,
                                data: _data
                            });

                            if (onDragStartCallback) {
                                scope.$apply(function () {
                                    onDragStartCallback(scope, {$data: _data, $event: evt});
                                });
                            }
                        }

                        _mx = pipDraggable.inputEvent(evt).pageX;
                        _my = pipDraggable.inputEvent(evt).pageY;

                        if (horizontalScroll || verticalScroll) {
                            dragToScroll();
                        }

                        if (_centerAnchor) {
                            _tx = _mx - element.centerX - _dragOffset.left;
                            _ty = _my - element.centerY - _dragOffset.top;
                        } else {
                            _tx = _mx - _mrx - _dragOffset.left;
                            _ty = _my - _mry - _dragOffset.top;
                        }

                        moveElement(_tx, _ty);

                        $rootScope.$broadcast('draggable:move', {
                            x: _mx,
                            y: _my,
                            tx: _tx,
                            ty: _ty,
                            event: evt,
                            element: element,
                            data: _data,
                            uid: _myid,
                            dragOffset: _dragOffset
                        });
                    }

                    function onrelease(evt) {
                        if (!_dragEnabled)
                            return;
                        evt.preventDefault();
                        $rootScope.$broadcast('draggable:end', {
                            x: _mx,
                            y: _my,
                            tx: _tx,
                            ty: _ty,
                            event: evt,
                            element: element,
                            data: _data,
                            callback: onDragComplete,
                            uid: _myid
                        });
                        element.removeClass('pip-dragging');
                        element.parent().find('.pip-drag-enter').removeClass('pip-drag-enter');
                        reset();
                        $document.off(_moveEvents, onmove);
                        $document.off(_releaseEvents, onrelease);

                        if (onDragStopCallback) {
                            scope.$apply(function () {
                                onDragStopCallback(scope, {$data: _data, $event: evt});
                            });
                        }

                        _deregisterRootMoveListener();
                    }

                    function onDragComplete(evt) {
                        if (!onDragSuccessCallback)return;

                        scope.$apply(function () {
                            onDragSuccessCallback(scope, {$data: _data, $event: evt});
                        });
                    }

                    function reset() {
                        if (allowTransform)
                            element.css({transform: '', 'z-index': '', '-webkit-transform': '', '-ms-transform': ''});
                        else {
                            element.css({'position': _elementStyle.position, top: _elementStyle.top, left: _elementStyle.left, 'z-index': '', width: _elementStyle.width});
                        }
                    }

                    function moveElement(x, y) {
                        var eWidth = element.css('width');
                        if (allowTransform) {
                            element.css({
                                transform: 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + x + ', ' + y + ', 0, 1)',
                                'z-index': 99999,
                                '-webkit-transform': 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + x + ', ' + y + ', 0, 1)',
                                '-ms-transform': 'matrix(1, 0, 0, 1, ' + x + ', ' + y + ')'
                            });
                        } else {
                            element.css({
                                'left': x + 'px',
                                'top': y + 'px',
                                'position': 'fixed',
                                'z-index': 100,
                                width: eWidth
                            });
                        }
                    }

                    function dragToScroll() {
                        var scrollX = 0, scrollY = 0,
                            offset = function (element) {
                                return element.offset() || {left: 0, top: 0};
                            };

                        if (horizontalScroll) {
                            var
                                containerLeft = offset(scrollContainer).left,
                                containerWidth = scrollContainer.innerWidth(),
                                containerRight = containerLeft + containerWidth;

                            if ((_mx - containerLeft) < activationDistance) {
                                scrollX = -scrollDistance;
                            }
                            else if ((containerRight - _mx) < activationDistance) {
                                scrollX = scrollDistance;
                            }
                        }

                        if (verticalScroll) {
                            var
                                containerTop = offset(scrollContainer).top,
                                containerHeight = scrollContainer.innerHeight(),
                                containerBottom = containerTop + containerHeight;

                            if ((_my - containerTop) < activationDistance) {
                                scrollY = -scrollDistance + 30;
                            }
                            else if ((containerBottom - _my) < activationDistance) {
                                scrollY = scrollDistance - 30;
                            }
                        }
                        if (scrollX !== 0 || scrollY !== 0) {
                            var
                                containerScrollLeft = scrollContainer.scrollLeft(),
                                containerScrollTop = scrollContainer.scrollTop();

                            scrollContainer.scrollLeft(containerScrollLeft + scrollX);
                            scrollContainer.scrollTop(containerScrollTop + scrollY);
                        }

                    }
                }
            }
        }]);

    thisModule.directive('pipDrop', 
        ['$parse', '$timeout', '$window', '$document', 'pipDraggable', function ($parse, $timeout, $window, $document, pipDraggable) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.value = attrs.pipDrop;
                scope.isTouching = false;

                var _lastDropTouch = null;
                var _myid = scope.$id;
                var _dropEnabled = false;

                var onDropCallback = $parse(attrs.pipDropSuccess);// || function(){};
                var onDragStartCallback = $parse(attrs.pipDragStart);
                var onDragStopCallback = $parse(attrs.pipDragStop);
                var onDragMoveCallback = $parse(attrs.pipDragMove);

                initialize();

                return;

                //----------------------

                function initialize() {
                    toggleListeners(true);
                }

                function toggleListeners(enable) {
                    // remove listeners
                    if (!enable)return;
                    // add listeners.
                    scope.$watch(attrs.pipDrop, onEnableChange);
                    scope.$on('$destroy', onDestroy);
                    scope.$on('draggable:start', onDragStart);
                    scope.$on('draggable:move', onDragMove);
                    scope.$on('draggable:end', onDragEnd);
                }

                function onDestroy(enable) {
                    toggleListeners(false);
                }

                function onEnableChange(newVal, oldVal) {
                    _dropEnabled = newVal;
                }

                function onDragStart(evt, obj) {
                    if (!_dropEnabled)return;
                    isTouching(obj.x, obj.y, obj.element);

                    if (attrs.pipDragStart) {
                        $timeout(function () {
                            onDragStartCallback(scope, {$data: obj.data, $event: obj});
                        });
                    }
                }

                function onDragMove(evt, obj) {
                    if (!_dropEnabled)return;
                    isTouching(obj.x, obj.y, obj.element);

                    if (attrs.pipDragMove) {
                        $timeout(function () {
                            onDragMoveCallback(scope, {$data: obj.data, $event: obj});
                        });
                    }
                }

                function onDragEnd(evt, obj) {
                    // don't listen to drop events if this is the element being dragged
                    // only update the styles and return
                    if (!_dropEnabled || _myid === obj.uid) {
                        updateDragStyles(false, obj.element);
                        return;
                    }

                    if (isTouching(obj.x, obj.y, obj.element)) {
                        // call the pipDraggable pipDragSuccess element callback
                        if (obj.callback) {
                            obj.callback(obj);
                        }

                        if (attrs.pipDropSuccess) {
                            $timeout(function () {
                                onDropCallback(scope, {
                                    $data: obj.data,
                                    $event: obj,
                                    $target: scope.$eval(scope.value)
                                });
                            });
                        }
                    }

                    if (attrs.pipDragStop) {
                        $timeout(function () {
                            onDragStopCallback(scope, {$data: obj.data, $event: obj});
                        });
                    }

                    updateDragStyles(false, obj.element);
                }

                function isTouching(mouseX, mouseY, dragElement) {
                    var touching = hitTest(mouseX, mouseY);
                    scope.isTouching = touching;
                    if (touching) {
                        _lastDropTouch = element;
                    }
                    updateDragStyles(touching, dragElement);
                    return touching;
                }

                function updateDragStyles(touching, dragElement) {
                    if (touching) {
                        element.addClass('pip-drag-enter');
                        dragElement.addClass('pip-drag-over');
                    } else if (_lastDropTouch == element) {
                        _lastDropTouch = null;
                        element.removeClass('pip-drag-enter');
                        dragElement.removeClass('pip-drag-over');
                    }
                };

                function hitTest(x, y) {
                    var bounds = element[0].getBoundingClientRect();
                    x -= $document[0].body.scrollLeft + $document[0].documentElement.scrollLeft;
                    y -= $document[0].body.scrollTop + $document[0].documentElement.scrollTop;
                    return x >= bounds.left
                        && x <= bounds.right
                        && y <= bounds.bottom
                        && y >= bounds.top;
                }
            }
        };
    }]);

    //thisModule.directive('pipDragClone', function ($parse, $timeout, pipDraggable) {
    //    return {
    //        restrict: 'A',
    //        link: function (scope, element, attrs) {
    //            var img, _allowClone = true;
    //            var _dragOffset = null;
    //            scope.clonedData = {};
    //            initialize();
    //            return;

    //            function initialize() {
//
    //                img = element.find('img');
    //                element.attr('pip-draggable', 'false');
    //                img.attr('draggable', 'false');
    //                reset();
    //                toggleListeners(true);
    //            }
//
//
    //            function toggleListeners(enable) {
    //                // remove listeners
//
    //                if (!enable)return;
    //                // add listeners.
    //                scope.$on('draggable:start', onDragStart);
    //                scope.$on('draggable:move', onDragMove);
    //                scope.$on('draggable:end', onDragEnd);
    //                preventContextMenu();
//
    //            }

    //            function preventContextMenu() {
    //                //  element.off('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
    //                img.off('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
    //                //  element.on('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
    //                img.on('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
    //            }

    //            function onDragStart(evt, obj, elm) {
    //                _allowClone = true;
    //                if (angular.isDefined(obj.data.allowClone)) {
    //                    _allowClone = obj.data.allowClone;
    //                }
    //                if (_allowClone) {
    //                    scope.$apply(function () {
    //                        scope.clonedData = obj.data;
    //                    });
    //                    element.css('width', obj.element[0].offsetWidth);
    //                    element.css('height', obj.element[0].offsetHeight);
//
    //                    moveElement(obj.tx, obj.ty);
    //                }
//
    //            }

    //            function onDragMove(evt, obj) {
    //                if (_allowClone) {
//
    //                    _tx = obj.tx + obj.dragOffset.left;
    //                    _ty = obj.ty + obj.dragOffset.top;
//
    //                    moveElement(_tx, _ty);
    //                }
    //            }

    //            function onDragEnd(evt, obj) {
    //                //moveElement(obj.tx,obj.ty);
    //                if (_allowClone) {
    //                    reset();
    //                }
    //            }
//
    //            function reset() {
    //                element.css({left: 0, top: 0, position: 'fixed', 'z-index': -1, visibility: 'hidden'});
    //            }

    //            function moveElement(x, y) {
    //                element.css({
    //                    transform: 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + x + ', ' + y + ', 0, 1)',
    //                    'z-index': 99999,
    //                    'visibility': 'visible',
    //                    '-webkit-transform': 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + x + ', ' + y + ', 0, 1)',
    //                    '-ms-transform': 'matrix(1, 0, 0, 1, ' + x + ', ' + y + ')'
    //                    //,margin: '0'  don't monkey with the margin,
    //                });
    //            }
//
    //            function absorbEvent_(event) {
    //                var e = event;//.originalEvent;
    //                e.preventDefault && e.preventDefault();
    //                e.stopPropagation && e.stopPropagation();
    //                e.cancelBubble = true;
    //                e.returnValue = false;
    //                return false;
    //            }
//
    //        }
    //    };
    //});

    thisModule.directive('pipPreventDrag', ['$parse', '$timeout', function ($parse, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                initialize();

                return;
                //---------------------

                function initialize() {
                    element.attr('pip-draggable', 'false');
                    toggleListeners(true);
                }

                function toggleListeners(enable) {
                    // remove listeners
                    if (!enable)return;
                    // add listeners.
                    element.on('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
                }

                function absorbEvent_(event) {
                    var e = event.originalEvent;
                    e.preventDefault && e.preventDefault();
                    e.stopPropagation && e.stopPropagation();
                    e.cancelBubble = true;
                    e.returnValue = false;
                    return false;
                }
            }
        };
    }]);

    thisModule.directive('pipCancelDrag', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.find('*').attr('pip-cancel-drag', 'pip-cancel-drag');
            }
        };
    });
})();


/**
 * @file Image slider control
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, $) {
    'use strict';

    var thisModule = angular.module('pipImageSlider', ['pipSliderButton', 'pipSliderIndicator', 'pipImageSlider.Service']);

    thisModule.directive('pipImageSlider',
        function () {
            return {
                scope: {
                    sliderIndex: '=pipImageIndex'
                },
                controller: ['$scope', '$element', '$attrs', '$parse', '$timeout', '$interval', '$pipImageSlider', function ($scope, $element, $attrs, $parse, $timeout, $interval, $pipImageSlider) {
                    var blocks,
                        index = 0, newIndex,
                        direction,
                        type = $parse($attrs.pipAnimationType)($scope),
                        DEFAULT_INTERVAL = 4500,
                        interval = $parse($attrs.pipAnimationInterval)($scope),
                        timePromises,
                        throttled;

                    $element.addClass('pip-image-slider');
                    $element.addClass('pip-animation-' + type);

                    $scope.swipeStart = 0;
                    /*
                     if ($swipe)
                     $swipe.bind($element, {
                     'start': function(coords) {
                     if (coords) $scope.swipeStart = coords.x;
                     else $scope.swipeStart = 0;
                     },
                     'end': function(coords) {
                     var delta;
                     if (coords) {
                     delta = $scope.swipeStart - coords.x;
                     if (delta > 150)  $scope.nextBlock();
                     if (delta < -150)  $scope.prevBlock();
                     $scope.swipeStart = 0;
                     } else $scope.swipeStart = 0;
                     }
                     });
                     */
                    setIndex();

                    $timeout(function () {
                        blocks = $element.find('.pip-animation-block');
                        if (blocks.length > 0) {
                            $(blocks[0]).addClass('pip-show');
                        }
                    });

                    startInterval();
                    throttled = _.throttle(function () {
                        $pipImageSlider.toBlock(type, blocks, index, newIndex, direction);
                        index = newIndex;
                        setIndex();
                    }, 700);

                    $scope.nextBlock = function () {
                        restartInterval();
                        newIndex = index + 1 === blocks.length ? 0 : index + 1;
                        direction = 'next';
                        throttled();
                    };

                    $scope.prevBlock = function () {
                        restartInterval();
                        newIndex = index - 1 < 0 ? blocks.length - 1 : index - 1;
                        direction = 'prev';
                        throttled();
                    };

                    $scope.slideTo = function (nextIndex) {
                        if (nextIndex === index || nextIndex > blocks.length - 1) {
                            return;
                        }

                        restartInterval();
                        newIndex = nextIndex;
                        direction = nextIndex > index ? 'next' : 'prev';
                        throttled();
                    };
                    
                    if ($attrs.id) $pipImageSlider.registerSlider($attrs.id, $scope);

                    function setIndex() {
                        if ($attrs.pipImageIndex) $scope.sliderIndex = index;
                    }

                    function startInterval() {
                        timePromises = $interval(function () {
                            newIndex = index + 1 === blocks.length ? 0 : index + 1;
                            direction = 'next';
                            throttled();
                        }, interval || DEFAULT_INTERVAL);
                    }

                    function stopInterval() {
                        $interval.cancel(timePromises);
                    }

                    $element.on('$destroy', function () {
                        stopInterval();
                        $pipImageSlider.removeSlider($attrs.id);
                    });

                    function restartInterval() {
                        stopInterval();
                        startInterval();
                    }
                }]
            };
        }
    );

})(window.angular, window._, window.jQuery);

/**
 * @file Image slider service
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, $) {
    'use strict';

    var thisModule = angular.module('pipImageSlider.Service', []);

    thisModule.service('$pipImageSlider',
        ['$timeout', function ($timeout) {

            var ANIMATION_DURATION = 550,
                sliders = {};

            return {
                nextCarousel: nextCarousel,
                prevCarousel: prevCarousel,
                toBlock: toBlock,
                registerSlider: register,
                removeSlider: remove,
                getSliderScope: getSlider
            };

            function register(sliderId, sliderScope) {
                sliders[sliderId] = sliderScope;
            }
            
            function remove(sliderId) {
                delete sliders[sliderId];
            }

            function getSlider(sliderId) {
                return sliders[sliderId];
            }

            function nextCarousel(nextBlock, prevBlock) {
                nextBlock.addClass('pip-next');
                
                $timeout(function () {
                    nextBlock.addClass('animated').addClass('pip-show').removeClass('pip-next');
                    prevBlock.addClass('animated').removeClass('pip-show');
                }, 100);
            }

            function prevCarousel(nextBlock, prevBlock) {
                $timeout(function () {
                    nextBlock.addClass('animated').addClass('pip-show');
                    prevBlock.addClass('animated').addClass('pip-next').removeClass('pip-show');
                }, 100);
            }

            function toBlock(type, blocks, oldIndex, nextIndex, direction) {
                var prevBlock = $(blocks[oldIndex]),
                    blockIndex = nextIndex,
                    nextBlock = $(blocks[blockIndex]);

                if (type === 'carousel') {
                    $(blocks).removeClass('pip-next').removeClass('pip-prev').removeClass('animated');

                    if (direction && (direction === 'prev' || direction === 'next')) {
                        if (direction === 'prev') {
                            prevCarousel(nextBlock, prevBlock);
                        } else {
                            nextCarousel(nextBlock, prevBlock);
                        }
                    } else {
                        if (nextIndex && nextIndex < oldIndex) {
                            prevCarousel(nextBlock, prevBlock);
                        } else {
                            nextCarousel(nextBlock, prevBlock);
                        }
                    }
                } else {
                    prevBlock.addClass('animated').removeClass('pip-show');
                    nextBlock.addClass('animated').addClass('pip-show');
                }
            }
        }]
    );

})(window.angular, window._, window.jQuery);

/**
 * @file Image slider button
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, $) {
    'use strict';

    var thisModule = angular.module('pipSliderButton', []);

    thisModule.directive('pipSliderButton',
        function () {
            return {
                scope: {},
                controller: ['$scope', '$element', '$parse', '$attrs', '$pipImageSlider', function ($scope, $element, $parse, $attrs, $pipImageSlider) {
                    var type = $parse($attrs.pipButtonType)($scope),
                        sliderId = $parse($attrs.pipSliderId)($scope);

                    $element.on('click', function () {
                        if (!sliderId || !type) {
                            return;
                        }

                        $pipImageSlider.getSliderScope(sliderId)[type + 'Block']();
                    });
                }]
            };
        }
    );

})(window.angular, window._, window.jQuery);

/**
 * @file Slider indicator
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, $) {
    'use strict';

    var thisModule = angular.module('pipSliderIndicator', []);

    thisModule.directive('pipSliderIndicator',
        function () {
            return {
                scope: false,
                controller: ['$scope', '$element', '$parse', '$attrs', '$pipImageSlider', function ($scope, $element, $parse, $attrs, $pipImageSlider) {
                    var sliderId = $parse($attrs.pipSliderId)($scope),
                        slideTo = $parse($attrs.pipSlideTo)($scope);

                    $element.css('cursor', 'pointer');
                    $element.on('click', function () {
                        if (!sliderId || slideTo && slideTo < 0) {
                            return;
                        }

                        $pipImageSlider.getSliderScope(sliderId).slideTo(slideTo);
                    });
                }]
            };
        }
    );

})(window.angular, window._, window.jQuery);

/**
 * @file Markdown control
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Move css styles under control
 * - Improve samples in sampler app
 */

(function (angular, marked, _) {
    'use strict';

    var thisModule = angular.module('pipMarkdown', ['ngSanitize']);

    thisModule.run(['$injector', function ($injector) {
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;

        if (pipTranslate) {
            pipTranslate.translations('en', {
                'MARKDOWN_ATTACHMENTS': 'Attachments:',
                'checklist': 'Checklist',
                'documents': 'Documents',
                'pictures': 'Pictures',
                'location': 'Location',
                'time': 'Time'
            });
            pipTranslate.translations('ru', {
                'MARKDOWN_ATTACHMENTS': 'Вложения:',
                'checklist': 'Список',
                'documents': 'Документы',
                'pictures': 'Изображения',
                'location': 'Местонахождение',
                'time': 'Время'
            });
        }

    }]);

    thisModule.directive('pipMarkdown',
        ['$parse', '$injector', function ($parse, $injector) {
            var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;

            return {
                restrict: 'EA',
                scope: false,
                link: function ($scope, $element, $attrs) {
                    var
                        textGetter = $parse($attrs.pipText),
                        listGetter = $parse($attrs.pipList),
                        clampGetter = $parse($attrs.pipLineCount);

                    function describeAttachments(array) {
                        var attachString = '',
                            attachTypes = [];

                        _.each(array, function (attach) {
                            if (attach.type && attach.type !== 'text') {
                                if (attachString.length === 0 && pipTranslate) {
                                    attachString = pipTranslate.translate('MARKDOWN_ATTACHMENTS');
                                }

                                if (attachTypes.indexOf(attach.type) < 0) {
                                    attachTypes.push(attach.type);
                                    attachString += attachTypes.length > 1 ? ', ' : ' ';
                                    if (pipTranslate)
                                        attachString += pipTranslate.translate(attach.type);
                                }
                            }
                        });

                        return attachString;
                    }

                    function toBoolean(value) {
                        if (value == null) return false;
                        if (!value) return false;
                        value = value.toString().toLowerCase();
                        return value == '1' || value == 'true';
                    }

                    function bindText(value) {
                        var textString, isClamped, height, options, obj;

                        if (_.isArray(value)) {
                            obj = _.find(value, function (item) {
                                return item.type === 'text' && item.text;
                            });

                            textString = obj ? obj.text : describeAttachments(value);
                        } else {
                            textString = value;
                        }

                        isClamped = $attrs.pipLineCount && _.isNumber(clampGetter());
                        isClamped = isClamped && textString && textString.length > 0;
                        options = {
                            gfm: true,
                            tables: true,
                            breaks: true,
                            sanitize: true,
                            pedantic: true,
                            smartLists: true,
                            smartypents: false
                        };
                        textString = marked(textString || '', options);
                        if (isClamped) {
                            height = 1.5 * clampGetter();
                        }
                        // Assign value as HTML
                        $element.html('<div' + (isClamped ? listGetter() ? 'class="pip-markdown-content ' +
                            'pip-markdown-list" style="max-height: ' + height + 'em">'
                                : ' class="pip-markdown-content" style="max-height: ' + height + 'em">' : listGetter()
                                ? ' class="pip-markdown-list">' : '>') + textString + '</div>');
                        $element.find('a').attr('target', 'blank');
                        if (!listGetter() && isClamped) {
                            $element.append('<div class="pip-gradient-block"></div>');
                        }
                    }

                    // Fill the text
                    bindText(textGetter($scope));

                    // Also optimization to avoid watch if it is unnecessary
                    if (toBoolean($attrs.pipRebind)) {
                        $scope.$watch(textGetter, function (newValue) {
                            bindText(newValue);
                        });
                    }

                    $scope.$on('pipWindowResized', function () {
                        bindText(textGetter($scope));
                    });

                    // Add class
                    $element.addClass('pip-markdown');
                }
            };
        }]
    );

})(window.angular, window.marked, window._);


/**
 * @file Popover control
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, $, _) {
    'use strict';

    var thisModule = angular.module('pipPopover', ['pipPopover.Service']);

    thisModule.directive('pipPopover', function () {
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: 'popover/popover.html',
            controller: ['$scope', '$rootScope', '$element', '$timeout', '$compile', function ($scope, $rootScope, $element, $timeout, $compile) {
                var backdropElement, content;

                backdropElement = $('.pip-popover-backdrop');
                backdropElement.on('click keydown scroll', backdropClick);
                backdropElement.addClass($scope.params.responsive !== false ? 'pip-responsive' : '');

                $timeout(function () {
                    position();
                    if ($scope.params.template) {
                        content = $compile($scope.params.template)($scope);
                        $element.find('.pip-popover').append(content);
                    }

                    init();
                });

                $timeout(function () {
                    calcHeight();
                }, 200);

                $scope.onPopoverClick = onPopoverClick;
                $scope = _.defaults($scope, $scope.$parent);    // eslint-disable-line 

                $rootScope.$on('pipPopoverResize', onResize);
                $(window).resize(onResize);

                function init() {
                    backdropElement.addClass('opened');
                    $('.pip-popover-backdrop').focus();
                    if ($scope.params.timeout) {
                        $timeout(function () {
                            closePopover();
                        }, $scope.params.timeout);
                    }
                }

                function backdropClick() {
                    if ($scope.params.cancelCallback) {
                        $scope.params.cancelCallback();
                    }

                    closePopover();
                }

                function closePopover() {
                    backdropElement.removeClass('opened');
                    $timeout(function () {
                        backdropElement.remove();
                    }, 100);
                }

                function onPopoverClick($e) {
                    $e.stopPropagation();
                }

                function position() {
                    if ($scope.params.element) {
                        var element = $($scope.params.element),
                            pos = element.offset(),
                            width = element.width(),
                            height = element.height(),
                            docWidth = $(document).width(),
                            docHeight = $(document).height(),
                            popover = backdropElement.find('.pip-popover');

                        if (pos) {
                            popover
                                .css('max-width', docWidth - (docWidth - pos.left))
                                .css('max-height', docHeight - (pos.top + height) - 32, 0)
                                .css('left', pos.left - popover.width() + width / 2)
                                .css('top', pos.top + height + 16);
                        }
                    }
                }

                function calcHeight() {
                    if ($scope.params.calcHeight === false) { return; }

                    var popover = backdropElement.find('.pip-popover'),
                        title = popover.find('.pip-title'),
                        footer = popover.find('.pip-footer'),
                        content = popover.find('.pip-content'),
                        contentHeight = popover.height() - title.outerHeight(true) - footer.outerHeight(true);

                    content.css('max-height', Math.max(contentHeight, 0) + 'px').css('box-sizing', 'border-box');
                }

                function onResize() {
                    backdropElement.find('.pip-popover').find('.pip-content').css('max-height', '100%');
                    position();
                    calcHeight();
                }
            }]
        };
    });

})(window.angular, window.jQuery, window._);

/**
 * @file Popover service
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, $, _) {
    'use strict';

    var thisModule = angular.module('pipPopover.Service', []);

    thisModule.service('pipPopoverService',
        ['$compile', '$rootScope', '$timeout', function ($compile, $rootScope, $timeout) {
            var popoverTemplate;

            popoverTemplate = "<div class='pip-popover-backdrop {{ params.class }}' ng-controller='params.controller'" +
                " tabindex='1'> <pip-popover pip-params='params'> </pip-popover> </div>";

            return {
                show: onShow,
                hide: onHide,
                resize: onResize
            };

            function onShow(p) {
                var element, scope, params, content;

                element = $('body');
                if (element.find('md-backdrop').length > 0) { return; }
                onHide();
                scope = $rootScope.$new();
                params = p && _.isObject(p) ? p : {};
                scope.params = params;
                scope.locals = params.locals;
                content = $compile(popoverTemplate)(scope);
                element.append(content);
            }

            function onHide() {
                var backdropElement = $('.pip-popover-backdrop');

                backdropElement.removeClass('opened');
                $timeout(function () {
                    backdropElement.remove();
                }, 100);
            }

            function onResize() {
                $rootScope.$broadcast('pipPopoverResize');
            }

        }]
    );

})(window.angular, window.jQuery, window._);

/**
 * @file Routing progress control
 * @description
 * This progress control is enabled by ui router
 * while switching between pages
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipRoutingProgress', ['ngMaterial']);

    thisModule.directive('pipRoutingProgress', function () {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                    showProgress: '&',
                    logoUrl: '@'
                },
            templateUrl: 'progress/routing_progress.html',
            controller: 'pipRoutingProgressController'
        };
    });

    thisModule.controller('pipRoutingProgressController',
        ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
            var  image = $element.children('img');          

            loadProgressImage();

            return;

            function loadProgressImage() {
                if ($scope.logoUrl) {
                    image.attr('src', $scope.logoUrl);
                }
            }

        }]
    );

})(window.angular);

/**
 * @file Toasts management service
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo Replace ngAudio with alternative service
 * 
 * toast.error structure:
 * data: {
 *  code: error code,
 *  path: 
 *  error: 
 *  method:
 *  message: 
 * }
 */

(function (angular, _) {
    'use strict';
    var thisModule = angular.module('pipToasts', ['ngMaterial', 'pipControls.Translate']);

    thisModule.controller('pipToastController',
        ['$scope', '$mdToast', 'toast', '$injector', function ($scope, $mdToast, toast, $injector) {
            var pipErrorDetailsDialog = $injector.has('pipErrorDetailsDialog') 
                ? $injector.get('pipErrorDetailsDialog') : null;

            // if (toast.type && sounds['toast_' + toast.type]) {
            //     sounds['toast_' + toast.type].play();
            // }

            $scope.message = toast.message;
            $scope.actions = toast.actions;
            $scope.toast = toast;
            
            if (toast.actions.length === 0) {
                $scope.actionLenght = 0;
            } else if (toast.actions.length === 1) {
                $scope.actionLenght = toast.actions[0].toString().length;
            } else {
                $scope.actionLenght = null;
            }

            $scope.showDetails = pipErrorDetailsDialog != null;
            $scope.onDetails = function () {
                $mdToast.hide();

                if (pipErrorDetailsDialog) {
                    pipErrorDetailsDialog.show(
                        {
                            error: $scope.toast.error,
                            ok: 'Ok'
                        },
                        angular.noop,
                        angular.noop
                    );
                }
            };

            $scope.onAction = function (action) {
                $mdToast.hide(
                    {
                        action: action,
                        id: toast.id,
                        message: toast.message
                    });
            };
        }]
    );

    thisModule.service('pipToasts',
        ['$rootScope', '$mdToast', function ($rootScope, $mdToast) {
            var
                SHOW_TIMEOUT = 20000,
                SHOW_TIMEOUT_NOTIFICATIONS = 20000,
                toasts = [],
                currentToast,
                sounds = {};

            /** pre-load sounds for notifications */
                // sounds['toast_error'] = ngAudio.load('sounds/fatal.mp3');
                // sounds['toast_notification'] = ngAudio.load('sounds/error.mp3');
                // sounds['toast_message'] = ngAudio.load('sounds/warning.mp3');

                // Remove error toasts when page is changed
            $rootScope.$on('$stateChangeSuccess', onStateChangeSuccess);
            $rootScope.$on('pipSessionClosed', onClearToasts);
            $rootScope.$on('pipIdentityChanged', onClearToasts);

            return {
                showNotification: showNotification,
                showMessage: showMessage,
                showError: showError,
                hideAllToasts: hideAllToasts,
                clearToasts: clearToasts,
                removeToastsById: removeToastsById,
                getToastById: getToastById
            };

            // Take the next from queue and show it
            function showNextToast() {
                var toast;

                if (toasts.length > 0) {
                    toast = toasts[0];
                    toasts.splice(0, 1);
                    showToast(toast);
                }
            }

            // Show toast
            function showToast(toast) {
                currentToast = toast;

                $mdToast.show({
                    templateUrl: 'toast/toast.html',
                    hideDelay: toast.duration || SHOW_TIMEOUT,
                    position: 'bottom left',
                    controller: 'pipToastController',
                    locals: {
                        toast: currentToast,
                        sounds: sounds
                    }
                })
                    .then(
                    function showToastOkResult(action) {
                        if (currentToast.successCallback) {
                            currentToast.successCallback(action);
                        }
                        currentToast = null;
                        showNextToast();
                    },
                    function showToastCancelResult(action) {
                        if (currentToast.cancelCallback) {
                            currentToast.cancelCallback(action);
                        }
                        currentToast = null;
                        showNextToast();
                    }
                );
            }

            function addToast(toast) {
                if (currentToast && toast.type !== 'error') {
                    toasts.push(toast);
                } else {
                    showToast(toast);
                }
            }

            function removeToasts(type) {
                var result = [];

                _.each(toasts, function (toast) {
                    if (!toast.type || toast.type !== type) {
                        result.push(toast);
                    }
                });
                toasts = _.cloneDeep(result);
            }

            function removeToastsById(id) {
                _.remove(toasts, {id: id});
            }

            function getToastById(id) {
                return _.find(toasts, {id: id});
            }

            function onStateChangeSuccess() {
                toasts = _.reject(toasts, function (toast) {
                    return toast.type === 'error';
                });

                if (currentToast && currentToast.type === 'error') {
                    $mdToast.cancel();
                    showNextToast();
                }
            }

            function onClearToasts() {
                clearToasts();
            }

            // Show new notification toast at the top right
            function showNotification(message, actions, successCallback, cancelCallback, id) {
                // pipAssert.isDef(message, 'pipToasts.showNotification: message should be defined');
                // pipAssert.isString(message, 'pipToasts.showNotification: message should be a string');
                // pipAssert.isArray(actions || [], 'pipToasts.showNotification: actions should be an array');
                // if (successCallback) {
                //     pipAssert.isFunction(successCallback, 'showNotification: successCallback should be a function');
                // }
                // if (cancelCallback) {
                //     pipAssert.isFunction(cancelCallback, 'showNotification: cancelCallback should be a function');
                // }

                addToast({
                    id: id || null,
                    type: 'notification',
                    message: message,
                    actions: actions || ['ok'],
                    successCallback: successCallback,
                    cancelCallback: cancelCallback,
                    duration: SHOW_TIMEOUT_NOTIFICATIONS
                });
            }

            // Show new message toast at the top right
            function showMessage(message, successCallback, cancelCallback, id) {
                // pipAssert.isDef(message, 'pipToasts.showMessage: message should be defined');
                // pipAssert.isString(message, 'pipToasts.showMessage: message should be a string');
                // if (successCallback) {
                //     pipAssert.isFunction(successCallback, 'pipToasts.showMessage:successCallback should be a function');
                // }
                // if (cancelCallback) {
                //     pipAssert.isFunction(cancelCallback, 'pipToasts.showMessage: cancelCallback should be a function');
                // }

                addToast({
                    id: id || null,
                    type: 'message',
                    message: message,
                    actions: ['ok'],
                    successCallback: successCallback,
                    cancelCallback: cancelCallback
                });
            }

            // Show error toast at the bottom right after error occured
            function showError(message, successCallback, cancelCallback, id, error) {
                // pipAssert.isDef(message, 'pipToasts.showError: message should be defined');
                // pipAssert.isString(message, 'pipToasts.showError: message should be a string');
                // if (successCallback) {
                //     pipAssert.isFunction(successCallback, 'pipToasts.showError: successCallback should be a function');
                // }
                // if (cancelCallback) {
                //     pipAssert.isFunction(cancelCallback, 'pipToasts.showError: cancelCallback should be a function');
                // }

                addToast({
                    id: id || null,
                    error: error,
                    type: 'error',
                    message: message,
                    actions: ['ok'],
                    successCallback: successCallback,
                    cancelCallback: cancelCallback
                });
            }

            // Hide and clear all toast when user signs out
            function hideAllToasts() {
                $mdToast.cancel();
                toasts = [];
            }

            // Clear toasts by type
            function clearToasts(type) {
                if (type) {
                    // pipAssert.isString(type, 'pipToasts.clearToasts: type should be a string');
                    removeToasts(type);
                } else {
                    $mdToast.cancel();
                    toasts = [];
                }
            }
        }]
    );

})(window.angular, window._);

/**
 * @file Directive to show confirmation dialog when user tries to leave page with unsaved changes.
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function(){
    'use strict';

    var thisModule = angular.module("pipUnsavedChanges", []);

    thisModule.directive("pipUnsavedChanges", ['$window', '$rootScope', function ($window, $rootScope) {
        return {
            restrict: 'AE',
            scope: {
                unsavedChangesAvailable: '&pipUnsavedChangesAvailable',
                unsavedChangesMessage: '@pipUnsavedChangesMessage',
                afterLeave: '&pipUnsavedChangesAfterLeave'
            },
            link: function($scope) {

                $window.onbeforeunload = function() {
                    if ($scope.unsavedChangesAvailable()) {
                        $rootScope.$routing = false;
                        return $scope.unsavedChangesMessage;
                    }
                };

                var unbindFunc = $scope.$on('$stateChangeStart', function(event) {
                    if ($scope.unsavedChangesAvailable() && !$window.confirm($scope.unsavedChangesMessage)) {
                        $rootScope.$routing = false;
                        event.preventDefault();
                    } else {
                        _.isFunction($scope.afterLeave) && $scope.afterLeave();
                    }
                });

                $scope.$on('$destroy', function() {
                    $window.onbeforeunload = null;
                    unbindFunc();
                });
            }
        };
    }]);

})();


/**
 * @file Registration of all WebUI list controls
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    angular.module('pipLists', [
        'pipFocused',
        'pipSelected',
        'pipInfiniteScroll',
	'pipTagList'
    ]);
    
})();
(function(module) {
try {
  module = angular.module('pipLists.Templates');
} catch (e) {
  module = angular.module('pipLists.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('tag_list/tag_list.html',
    '<div class="pip-chip rm4 pip-type-chip pip-type-chip-left {{\'bg-\' + pipType + \'-chips\'}}"\n' +
    '     ng-if="pipType && !pipTypeLocal">\n' +
    '\n' +
    '    <span>{{pipType.toUpperCase() | translate | uppercase}}</span>\n' +
    '</div>\n' +
    '<div class="pip-chip rm4 pip-type-chip pip-type-chip-left {{\'bg-\' + pipType + \'-chips\'}}"\n' +
    '     ng-if="pipType && pipTypeLocal">\n' +
    '\n' +
    '    <span>{{pipTypeLocal.toUpperCase() | translate | uppercase}}</span>\n' +
    '</div>\n' +
    '<div class="pip-chip rm4" ng-repeat="tag in pipTags">\n' +
    '    <span>{{::tag}}</span>\n' +
    '</div>');
}]);
})();

/**
 * @file Optional filter to translate string resources
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipList.Translate', []);

    thisModule.filter('translate', ['$injector', function ($injector) {
        var pipTranslate = $injector.has('pipTranslate') 
            ? $injector.get('pipTranslate') : null;

        return function (key) {
            return pipTranslate  ? pipTranslate.translate(key) || key : key;
        }
    }]);

})();

/**
 * @file Keyboard navigation over few focusable controls
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipFocused", []);

    thisModule.directive('pipFocused', ['$timeout', '$mdConstant', function($timeout, $mdConstant) {
        return {
            require: "?ngModel",
            link: function ($scope, $element, $attrs) {
                var controls, controlsLength,
                    withHidden = $attrs.pipWithHidden;

                $timeout(init);
                $element.on('keydown', keydownListener);

                $scope.$watch($attrs.ngModel, function () {
                    $timeout(init);
                }, true);

                function init() {
                    var selector = withHidden ? '.pip-focusable' : '.pip-focusable:visible';
                    controls = $element.find(selector);
                    controlsLength = controls.length;

                    // add needed event listeners
                    controls.on('focus', function () {
                        $element.addClass('pip-focused-container');
                        $(this).addClass('md-focused');
                    }).on('focusout', function () {
                        $element.removeClass('pip-focused-container');
                    });
                }

                function keydownListener(e) {
                    var keyCode = e.which || e.keyCode;

                    // Check control keyCode
                    if (keyCode == $mdConstant.KEY_CODE.LEFT_ARROW ||
                        keyCode == $mdConstant.KEY_CODE.UP_ARROW ||
                        keyCode == $mdConstant.KEY_CODE.RIGHT_ARROW ||
                        keyCode == $mdConstant.KEY_CODE.DOWN_ARROW) {

                        e.preventDefault();

                        var 
                            increment = (keyCode == $mdConstant.KEY_CODE.RIGHT_ARROW || keyCode == $mdConstant.KEY_CODE.DOWN_ARROW) ? 1 : -1,
                            moveToControl = controls.index(controls.filter(".md-focused")) + increment;

                        // Move focus to next control
                        if (moveToControl >= 0 && moveToControl < controlsLength) {
                            controls[moveToControl].focus();
                        }
                    }
                }
            }
        };
    }]);

})();


/**
 * @file Infinite scrolling behavior
 * @description
 * Modified from https://github.com/sroze/ngInfiniteScroll
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipInfiniteScroll", []);

    thisModule.directive('pipInfiniteScroll', 
        ['$rootScope', '$window', '$interval', '$parse', function($rootScope, $window, $interval, $parse) {
            var THROTTLE_MILLISECONDS = 500;

            return {
                scope: {
                    pipInfiniteScroll: '&',
                    pipScrollContainer: '=',
                    pipScrollDistance: '=',
                    pipScrollDisabled: '=',
                    pipScrollUseDocumentBottom: '=',
                    pipScrollListenForEvent: '@'
                },
                link: function($scope, $element, $attrs) {
                    var 
                        checkWhenEnabled = null,
                        scrollContainer,
                        immediateCheck = true,
                        scrollDistance = null,
                        scrollEnabled = null, 
                        unregisterEventListener = null,
                        useDocumentBottom = false, 
                        windowElement = angular.element($window);
                    
                    function height(element) {
                        element = element[0] || element;
                        if (isNaN(element.offsetHeight)) {
                            return element.document.documentElement.clientHeight;
                        } else {
                            return element.offsetHeight;
                        }
                    };

                    function offsetTop(element) {
                        if (!element[0].getBoundingClientRect || element.css('none')) {
                            return;
                        }
                        return element[0].getBoundingClientRect().top + pageYOffset(element);
                    };

                    function pageYOffset(element) {
                        element = element[0] || element;
                        if (isNaN(window.pageYOffset)) {
                            return element.document.documentElement.scrollTop;
                        } else {
                            return element.ownerDocument.defaultView.pageYOffset;
                        }
                    };

                    var onContainerScroll = function() {
                        var 
                            containerBottom, 
                            containerTopOffset, 
                            elementBottom, 
                            remaining, 
                            shouldScroll;
                                                
                        if (scrollContainer === windowElement) {
                            containerBottom = height(scrollContainer) + pageYOffset(scrollContainer[0].document.documentElement);
                            elementBottom = offsetTop($element) + height($element);
                        } else {
                            containerBottom = height(scrollContainer);
                            containerTopOffset = 0;
                            if (offsetTop(scrollContainer) !== void 0) {
                                containerTopOffset = offsetTop(scrollContainer);
                            }
                            elementBottom = offsetTop($element) - containerTopOffset + height($element);
                        }

                        if (useDocumentBottom) {
                            elementBottom = height(($element[0].ownerDocument || $element[0].document).documentElement);
                        }

                        remaining = elementBottom - containerBottom;
                        shouldScroll = remaining <= height(scrollContainer) * scrollDistance + 1;
                        
                        if (shouldScroll) {
                            checkWhenEnabled = true;
                            if (scrollEnabled) {
                                if ($scope.$$phase || $rootScope.$$phase) {
                                    return $scope.pipInfiniteScroll();
                                } else {
                                    return $scope.$apply($scope.pipInfiniteScroll);
                                }
                            }
                        } else {
                            return checkWhenEnabled = false;
                        }
                    };

                    if (THROTTLE_MILLISECONDS != null) {
                        onContainerScroll = _.throttle(onContainerScroll, THROTTLE_MILLISECONDS);                    
                    }

                    $scope.$on('$destroy', function() {
                        scrollContainer.unbind('scroll', onContainerScroll);
                        if (unregisterEventListener != null) {
                            unregisterEventListener();
                            return unregisterEventListener = null;
                        }
                    });

                    function handleScrollDistance(v) {
                        return scrollDistance = parseFloat(v) || 0;
                    };
                    $scope.$watch('pipScrollDistance', handleScrollDistance);
                    handleScrollDistance($scope.pipScrollDistance);
                    
                    function handleScrollDisabled(v) {
                        scrollEnabled = !v;
                        if (scrollEnabled && checkWhenEnabled) {
                            checkWhenEnabled = false;
                            return onContainerScroll();
                        }
                    };
                    $scope.$watch('pipScrollDisabled', handleScrollDisabled);
                    handleScrollDisabled($scope.pipScrollDisabled);

                    function handleScrollUseDocumentBottom(v) {
                        return useDocumentBottom = v;
                    };
                    $scope.$watch('pipScrollUseDocumentBottom', handleScrollUseDocumentBottom);
                    handleScrollUseDocumentBottom($scope.pipScrollUseDocumentBottom);

                    function changeContainer(newContainer) {
                        if (scrollContainer != null) {
                            scrollContainer.unbind('scroll', onContainerScroll);
                        }

                        scrollContainer = newContainer;
                        if (newContainer != null) {
                            return scrollContainer.bind('scroll', onContainerScroll);
                        }
                    };

                    changeContainer(windowElement);
                    if ($scope.pipScrollListenForEvent) {
                        unregisterEventListener = $rootScope.$on($scope.pipScrollListenForEvent, onContainerScroll);
                    }

                    function handleScrollContainer(newContainer) {
                        if ((newContainer == null) || newContainer.length === 0) {
                            return;
                        }
                        if (newContainer instanceof HTMLElement) {
                            newContainer = angular.element(newContainer);
                        } else if (typeof newContainer.append === 'function') {
                            newContainer = angular.element(newContainer[newContainer.length - 1]);
                        } else if (typeof newContainer === 'string') {
                            newContainer = $element.parents().find(newContainer);
                        }

                        if (newContainer != null && (!Array.isArray(newContainer) ||
                            (Array.isArray(newContainer) && newContainer.length > 0))) {
                            return changeContainer(newContainer);
                        } else {
                            throw new Error("Invalid pip-scroll-container attribute.");
                        }
                    };
                    $scope.$watch('pipScrollContainer', function (newContainer) {
                        if (newContainer !== scrollContainer)
                            handleScrollContainer(newContainer);
                    });
                    handleScrollContainer($scope.pipScrollContainer || []);
                    
                    if ($attrs.pipScrollParent != null) {
                        changeContainer(angular.element($element.parent()));
                    }
                    if ($attrs.pipScrolImmediateCheck != null) {
                        immediateCheck = $scope.$eval($attrs.pipScrolImmediateCheck);
                    }
                    
                    return $interval((function() {
                        if (immediateCheck) {
                            return onContainerScroll();
                        }
                    }), 0, 1);
                }
            }
        }]
    );

})();


/**
 * @file Keyboard navigation with scrolling over non-focusable controls
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipSelected", []);

    thisModule.directive('pipSelected',['$parse', '$mdConstant', '$timeout', function ($parse, $mdConstant, $timeout) {
        return {
            restrict: 'A',
            scope: false,
            link: function ($scope, $element, $attrs) {
                var
                    indexGetter = $attrs.pipSelected ? $parse($attrs.pipSelected) : null,
                    indexSetter = indexGetter ? indexGetter.assign : null,
                    idGetter = $attrs.pipSelectedId ? $parse($attrs.pipSelectedId) : null,
                    idSetter = idGetter ? idGetter.assign : null,
                    changeGetter = $attrs.pipSelect ? $parse($attrs.pipSelect) : null,
                    enterSpaceGetter = $attrs.pipEnterSpacePress ? $parse($attrs.pipEnterSpacePress) : null,
                    noScroll = toBoolean($attrs.pipNoScroll),
                    modifier = toBoolean($attrs.pipSkipHidden) ? ':visible' : '',
                    className = toBoolean($attrs.pipTreeList) ? '.pip-selectable-tree' : '.pip-selectable',
                    selectedIndex = indexGetter($scope),
                    currentElementTabinex = $element.attr('tabindex'),
                    pipSelectedWatch = $attrs.pipSelectedWatch;

                // Set tabindex if it's not set yet
                $element.attr('tabindex', currentElementTabinex || 0);

                // Watch selected item index
                if (!toBoolean($attrs.pipTreeList)) {
                    $scope.$watch(indexGetter, function(newSelectedIndex) {
                        selectItem({itemIndex: newSelectedIndex});
                    });
                } else {
                    $scope.$watch(idGetter, function(newSelectedId) {
                        setTimeout(function () {
                            selectItem({itemId: newSelectedId, raiseEvent: true});
                        }, 0);
                    });
                }

                // Watch resync selection
                if (pipSelectedWatch) {
                    $scope.$watch(pipSelectedWatch, function() {
                        // Delay update to allow ng-repeat to update DOM
                        setTimeout(function() {
                            selectedIndex = indexGetter($scope);
                            selectItem({itemIndex: selectedIndex});
                        }, 100);
                    });
                }

                // Select item defined by index
                selectItem({itemIndex: selectedIndex, items: $element.find(className)});

                // Converts value into boolean
                function toBoolean(value) {
                    if (value == null) return false;
                    if (!value) return false;
                    value = value.toString().toLowerCase();
                    return value == '1' || value == 'true';
                };
                
                // Functions and listeners

                function selectItem(itemParams) {
                    var itemIndex = itemParams.itemIndex,
                        itemId = itemParams.itemId,
                        items = itemParams.items || $element.find(className + modifier),
                        itemsLength = items.length,
                        item = (function () {
                            if (itemParams.item) return itemParams.item;
                            if (itemIndex === undefined && itemIndex === -1) {
                                itemIndex = items.index(items.filter('[pip-id=' + itemId + ']'));
                            }
                            if (itemIndex >= 0 && itemIndex < itemsLength) {
                                return items[itemIndex]
                            }
                        }()),
                        raiseEvent = itemParams.raiseEvent;

                    if (item) {
                        $element.find(className).removeClass('selected md-focused');
                        item = angular.element(item)
                            .addClass('selected md-focused')
                            .focus(); // todo сдвигает список тут, на первом проходе
                        if (!noScroll) scrollToItem(item);
                        if (raiseEvent) defineSelectedIndex(items);
                    }
                };

                function defineSelectedIndex(items) {
                    var oldSelectedIndex = selectedIndex;
                    selectedIndex = -1;
                    for (var index = 0; index < items.length; index++) {
                        if ($(items[index]).hasClass('selected')) {
                            selectedIndex = index;

                            break;
                        }
                    }

                    // Execute callback to notify about item select
                    if (oldSelectedIndex != selectedIndex && selectedIndex !== -1) {
                        $scope.$apply(updateIndex);
                    }

                    function updateIndex() {
                        var selectedItem = angular.element(items[selectedIndex]),
                            selectedId = selectedItem.attr('pip-id');

                        if (indexSetter) indexSetter($scope, selectedIndex);
                        if (idSetter) idSetter($scope, selectedId);
                        if (changeGetter) {
                            changeGetter($scope, {
                                $event: {
                                    target: $element,
                                    item: selectedItem,
                                    index: selectedIndex,
                                    id: selectedId,
                                    newIndex: selectedIndex,
                                    oldIndex: oldSelectedIndex
                                }
                            });
                        }
                    };
                };

                function scrollToItem($item) {
                    if (noScroll) return;

                    var
                        containerTop = $element.offset().top,
                        containerHeight = $element.height(),
                        containerBottom = containerTop + containerHeight,
                        itemTop = $item.offset().top,
                        itemHeight = $item.outerHeight(true),
                        itemBottom = itemTop + itemHeight,
                        containerScrollTop = $element.scrollTop();

                    if (containerTop > itemTop) {
                        $element.scrollTop(containerScrollTop + itemTop - containerTop);
                    }
                    else if (containerBottom < itemBottom) {
                        $element.scrollTop(containerScrollTop + itemBottom - containerBottom);
                    }

                };

                $element.on('click touchstart', className, function (event) {
                    selectItem({item: event.currentTarget, raiseEvent: true});
                });

                $element.on('keydown', function (e) {
                    var keyCode = e.which || e.keyCode;

                    // Check control keyCode
                    if (keyCode == $mdConstant.KEY_CODE.ENTER || keyCode == $mdConstant.KEY_CODE.SPACE) {
                        e.preventDefault();
                        e.stopPropagation();

                        if (enterSpaceGetter) {
                            enterSpaceGetter($scope, {
                                $event: {
                                    target: $element,
                                    index: selectedIndex,
                                    item: $element.find('.selected')
                                }
                            });
                        }

                    } else
                    if (keyCode == $mdConstant.KEY_CODE.LEFT_ARROW || keyCode == $mdConstant.KEY_CODE.RIGHT_ARROW ||
                        keyCode == $mdConstant.KEY_CODE.UP_ARROW || keyCode == $mdConstant.KEY_CODE.DOWN_ARROW) {

                        e.preventDefault();
                        e.stopPropagation();

                        // Get next selectable control index
                        var items = $element.find(className + modifier),
                            inc = (keyCode == $mdConstant.KEY_CODE.RIGHT_ARROW || keyCode == $mdConstant.KEY_CODE.DOWN_ARROW) ? 1 : -1,
                            newSelectedIndex = selectedIndex + inc;

                        // Set next control as selected
                        selectItem({itemIndex: newSelectedIndex, items: items, raiseEvent: true});
                    }
                });

                $element.on('focusin', function (event) {
                    // Choose selected element
                    var items,
                        selectedItem = $element.find(className + '.selected');

                    selectedItem.addClass('md-focused');

                    // If there are not selected elements then pick the first one
                    if (selectedItem.length === 0) {
                        selectedIndex = indexGetter($scope);
                        items = $element.find(className + modifier);
                        selectItem({itemIndex: selectedIndex || 0, items: items, raiseEvent: true});
                    }
                });

                $element.on('focusout', function (event) {
                    $element.find(className + '.md-focused' + modifier).removeClass('md-focused');
                });
            }
        };
    }]);

})();


/**
 * @file Tag list control
 * @copyright Digital Living Software Corp. 2014-2015
 * @todo
 * - Improve samples in sampler app
 * - What's pipType and pipTypeLocal? Give better name
 * - Do not use ng-if, instead generate template statically
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipTagList', ['pipList.Translate']);

    /**
     * pipTags - set of tags
     * pipType - additional type tag
     * pipTypeLocal - additional translated type tag
     */
    thisModule.directive('pipTagList',
        ['$parse', function ($parse) {
            return {
                restrict: 'EA',
                scope: {
                    pipTags: '=',
                    pipType: '=',
                    pipTypeLocal: '='
                },
                templateUrl: 'tag_list/tag_list.html',
                controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
                    var tagsGetter;

                    tagsGetter = $parse($attrs.pipTags);
                    $element.css('display', 'block');
                    // Set tags
                    $scope.tags = tagsGetter($scope);

                    function toBoolean(value) {
                        if (value == null) return false;
                        if (!value) return false;
                        value = value.toString().toLowerCase();
                        return value == '1' || value == 'true';
                    }

                    // Also optimization to avoid watch if it is unnecessary
                    if (toBoolean($attrs.pipRebind)) {
                        $scope.$watch(tagsGetter, function () {
                            $scope.tags = tagsGetter($scope);
                        });
                    }

                    // Add class
                    $element.addClass('pip-tag-list');
                }]
            };
        }]
    );

})(window.angular);



/**
 * @file Registration of Dates and times WebUI controls
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function (angular) {
    'use strict';

    angular.module('pipDateTimes', [
        'pipDate',
        'pipDateRange',
        'pipTimeRangeEdit',
        'pipTimeRange',
        'pipDatesUtils',
        'pipDateFormat',
        'pipDateTimeFilters',
        'pipDates.Translate'
    ]);


})(window.angular);


(function(module) {
try {
  module = angular.module('pipDates.Templates');
} catch (e) {
  module = angular.module('pipDates.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('date/date.html',
    '<!--\n' +
    '@file Date control content\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<div class="pip-date layout-row flex" tabindex="-1">\n' +
    '	<md-input-container class="tm0 flex">\n' +
    '		<md-select class="pip-date-day tm0 flex" ng-disabled="disableControls"\n' +
    '				   ng-model="day" placeholder="{{dayLabel}}" ng-change="onDayChanged()">\n' +
    '			<md-option ng-value="opt" ng-repeat="opt in days track by opt">{{:: opt }}</md-option>\n' +
    '		</md-select>\n' +
    '	</md-input-container>\n' +
    '	<div class="w16 flex-fixed"></div>\n' +
    '	<md-input-container class="tm0 flex">\n' +
    '		<md-select class="pip-date-month tm0 flex" ng-disabled="disableControls"\n' +
    '				   ng-model="month" placeholder="{{monthLabel}}" ng-change="onMonthChanged()">\n' +
    '			<md-option ng-value="opt.id" ng-repeat="opt in months track by opt.id">{{:: opt.name }}</md-option>\n' +
    '		</md-select>\n' +
    '	</md-input-container>\n' +
    '	<div class="w16 flex-fixed"></div>\n' +
    '	<md-input-container class="tm0 flex">\n' +
    '		<md-select class="pip-date-year tm0 flex" ng-disabled="disableControls"\n' +
    '				   ng-model="year" placeholder="{{yearLabel}}" ng-change="onYearChanged()">\n' +
    '			<md-option ng-value="opt" ng-repeat="opt in years track by opt">{{:: opt }}</md-option>\n' +
    '		</md-select>\n' +
    '	</md-input-container>\n' +
    '</div>\n' +
    '					');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDates.Templates');
} catch (e) {
  module = angular.module('pipDates.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('date_range/date_range.html',
    '<!--\n' +
    '@file Date range control content\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<div class="pip-date-range layout-row flex" tabindex="-1">\n' +
    '    <md-input-container ng-show="isDay()" class="tm0 pip-day flex"\n' +
    '            ng-class="{\'flex-fixed\' : $mdMedia(\'gt-xs\')}">\n' +
    '        <md-select class="select-day w-stretch"\n' +
    '                   ng-class="{\'pip-no-line\' : pipNoLine}"\n' +
    '                   ng-disable="{{disableControls}}"\n' +
    '                   md-on-open="onDayClick()"\n' +
    '                   ng-model="day"\n' +
    '                   ng-change="onDayChanged()"\n' +
    '                   placeholder="{{dayLabel}}"\n' +
    '                   aria-label="DAY">\n' +
    '\n' +
    '            <md-option ng-value="opt" ng-repeat="opt in days track by opt ">\n' +
    '               {{nameDays[$index]}} {{ opt }}\n' +
    '            </md-option>\n' +
    '        </md-select>\n' +
    '    </md-input-container>\n' +
    '    <md-input-container ng-show="isWeek()" class="tm0 flex"\n' +
    '                        ng-class="{\'flex-fixed\' : $mdMedia(\'gt-xs\')}">\n' +
    '        <md-select class="select-week w-stretch"\n' +
    '                   ng-class="{\'pip-no-line\' : pipNoLine}"\n' +
    '                   ng-disable="{{disableControls}}"\n' +
    '                   ng-model="week"\n' +
    '                   ng-change="onWeekChange()"\n' +
    '                   placeholder="{{weekLabel}}"\n' +
    '                   aria-label="WEEK">\n' +
    '\n' +
    '            <md-option ng-value="opt.id" ng-repeat="opt in weeks track by opt.id">\n' +
    '                {{ opt.name }}\n' +
    '            </md-option>\n' +
    '        </md-select>\n' +
    '    </md-input-container >\n' +
    '    <div class="flex-fixed"\n' +
    '         ng-class="{\'w16\': $mdMedia(\'gt-xs\'), \'w8\':  $mdMedia(\'xs\')}"\n' +
    '         ng-show="isDay() || isWeek()">\n' +
    '    </div>\n' +
    '    <md-input-container ng-show="isMonth() && !monthFormatShort " class="tm0 flex min-w72"\n' +
    '                        ng-class="{\'flex-fixed\' : $mdMedia(\'gt-xs\')}">\n' +
    '        <md-select class="select-month w-stretch"\n' +
    '                   ng-class="{\'pip-no-line\' : pipNoLine}"\n' +
    '                   ng-disable="{{disableControls}}"\n' +
    '                   md-on-open="onMonthClick()"\n' +
    '                   ng-model="month"\n' +
    '                   ng-change="onMonthChanged()"\n' +
    '                   placeholder="{{monthLabel}}"\n' +
    '                   aria-label="MONTH">\n' +
    '\n' +
    '            <md-option ng-value="opt.id" ng-repeat="opt in months track by opt.id">\n' +
    '                {{ opt.name }}\n' +
    '            </md-option>\n' +
    '        </md-select>\n' +
    '    </md-input-container>\n' +
    '    <md-input-container ng-show="isMonth() && monthFormatShort" class="flex tm0"\n' +
    '                        ng-class="{\'flex-fixed\' : $mdMedia(\'gt-xs\')}">\n' +
    '        <md-select class="select-month w-stretch"\n' +
    '                   ng-class="{\'pip-no-line\' : pipNoLine}"\n' +
    '                   ng-disable="{{disableControls}}"\n' +
    '                   md-on-open="onMonthClick()"\n' +
    '                   ng-model="month"\n' +
    '                   ng-change="onMonthChanged()"\n' +
    '                   placeholder="{{monthLabel}}"\n' +
    '                   aria-label="MONTH">\n' +
    '\n' +
    '            <md-option ng-value="opt.id" ng-repeat="opt in shortMonths track by opt.id">\n' +
    '                {{ opt.name }}\n' +
    '            </md-option>\n' +
    '        </md-select>\n' +
    '    </md-input-container>\n' +
    '    <div class="flex-fixed"\n' +
    '         ng-class="{\'w16\': $mdMedia(\'gt-xs\'), \'w8\':  $mdMedia(\'xs\')}"\n' +
    '         ng-show="isMonth()">\n' +
    '    </div>\n' +
    '    <md-input-container class="tm0 flex"\n' +
    '                        ng-class="{\'flex-fixed\' : $mdMedia(\'gt-xs\')}">\n' +
    '        <md-select class="select-year w-stretch"\n' +
    '                   ng-class="{\'pip-no-line\' : pipNoLine}"\n' +
    '                   ng-disable="{{disableControls}}"\n' +
    '                   md-on-open="onYearClick()"\n' +
    '                   ng-model="year"\n' +
    '                   ng-change="onYearChanged()"\n' +
    '                   placeholder="{{yearLabel}}"\n' +
    '                   aria-label="YEAR">\n' +
    '\n' +
    '            <md-option ng-value="opt" ng-repeat="opt in years track by opt">\n' +
    '                {{ opt }}\n' +
    '            </md-option>\n' +
    '        </md-select>\n' +
    '    </md-input-container>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDates.Templates');
} catch (e) {
  module = angular.module('pipDates.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('time_range/time_range.html',
    '<p>\n' +
    '    <span ng-if="data.start != null">{{data.start | formatShortDateTime}}</span>\n' +
    '    <span  class="rm4 lm4" ng-if="data.start && data.end"> - </span>\n' +
    '    <span ng-if="data.end != null">{{data.end | formatShortDateTime}}</span>\n' +
    '</p>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDates.Templates');
} catch (e) {
  module = angular.module('pipDates.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('time_range_edit/time_range_edit.html',
    '<!--\n' +
    '@file Time edit control content\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<div class="event-edit layout-row layout-xs-column flex layout-align-start-start">\n' +
    '    <div flex="47" class="w-stretch rm24-flex0">\n' +
    '        <p class="text-caption text-grey tm0">{{startLabel}}</p>\n' +
    '\n' +
    '        <div class="layout-row layout-align-space-between-center">\n' +
    '            <div class="rm16 pip-datepicker-container" flex="49">\n' +
    '                <md-datepicker ng-model="data.startDate"\n' +
    '                               xmd-placeholder="{{startLabel}}"\n' +
    '                               ng-change="onChangeStartDate()"\n' +
    '                               ng-disabled="isDisabled()"\n' +
    '                               aria-label="START-DATE">\n' +
    '                </md-datepicker>\n' +
    '            </div>\n' +
    '            <div flex>\n' +
    '                <md-input-container class="w-stretch tm0">\n' +
    '                    <md-select aria-label="START-TIME" class="tm0 bm0" ng-model="data.startTime" ng-disabled="isDisabled()"\n' +
    '                               ng-change="onChangeStartTime()">\n' +
    '                        <md-option ng-value="opt.id" ng-repeat="opt in intervalTimeCollection track by opt.id">{{ opt.time }}\n' +
    '                        </md-option>\n' +
    '                    </md-select>\n' +
    '                </md-input-container>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div flex="47" class="w-stretch">\n' +
    '        <p class="text-caption text-grey tm0">{{endLabel}}</p>\n' +
    '\n' +
    '        <div class="layout-row layout-align-space-between-center">\n' +
    '            <div class="rm16 pip-datepicker-container flex-49">\n' +
    '                <md-datepicker ng-model="data.endDate"\n' +
    '                               xmd-placeholder="{{endLabel}}"\n' +
    '                               ng-disabled="isDisabled()"\n' +
    '                               ng-change="onChangeEndDate()"\n' +
    '                               aria-label="END-DATE">\n' +
    '                </md-datepicker>\n' +
    '            </div>\n' +
    '            <div flex>\n' +
    '                <md-input-container class="w-stretch tm0">\n' +
    '                    <md-select aria-label="END-TIME" class="tm0 bm0" ng-model="data.endTime" ng-change="onChangeEndTime()"\n' +
    '                               ng-disabled="isDisabled()">\n' +
    '                        <md-option ng-value="opt.id" ng-repeat="opt in intervalTimeCollection track by opt.id">{{\n' +
    '                            opt.time }}\n' +
    '                        </md-option>\n' +
    '                    </md-select>\n' +
    '                </md-input-container>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

/**
 * @file Date control
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve samples int sampler app
 * - Optimize. It is way to slow on samples
 */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipDate', ['pipDates.Templates']);

    thisModule.directive('pipDate',
        function () {
            return {
                restrict: 'EA',
                require: 'ngModel',
                scope: {
                    timeMode: '@pipTimeMode',
                    disabled: '&ngDisabled',
                    model: '=ngModel',
                    ngChange: '&'
                },
                templateUrl: 'date/date.html',
                controller: 'pipDateController'
            };
        }
    );

    // Todo: Remove dependency on Translate. Use moment localization
    thisModule.controller('pipDateController',
        ['$scope', '$element', function ($scope, $element) { //pipTranslate
            var value;

            function dayList(month, year) {
                var count = 31, days = [], i;

                if (month === 4 || month === 6 || month === 9 || month === 11) {
                    count = 30;
                } else if (month === 2) {
                    if (year) {
                        // Calculate leap year (primitive)
                        count = year % 4 === 0 ? 29 : 28;
                    } else {
                        count = 28;
                    }
                }

                for (i = 1; i <= count; i++) {
                    days.push(i);
                }

                return days;
            }

            function monthList() {
                var months = [], i;

                for (i = 1; i <= 12; i++) {
                    months.push({
                        id: i,
                        name: ''//pipTranslate.translate('MONTH_' + i)
                    });
                }

                return months;
            }

            function yearList() {
                var i,
                    currentYear = new Date().getFullYear(),
                    startYear = $scope.timeMode === 'future' ? currentYear : currentYear - 100,
                    endYear = $scope.timeMode === 'past' ? currentYear : currentYear + 100,
                    years = [];

                if ($scope.timeMode === 'past') {
                    for (i = endYear; i >= startYear; i--) {
                        years.push(i);
                    }
                } else {
                    for (i = startYear; i <= endYear; i++) {
                        years.push(i);
                    }
                }

                return years;
            }

            function adjustDay() {
                var days = dayList($scope.month, $scope.year);

                if ($scope.days.length !== days.length) {
                    if ($scope.day > days.length) {
                        $scope.day = days.length;
                    }

                    $scope.days = days;
                }
            }

            function getValue(v) {
                var value = v ? _.isDate(v) ? v : new Date(v) : null,
                    day = value ? value.getDate() : null,
                    month = value ? value.getMonth() + 1 : null,
                    year = value ? value.getFullYear() : null;

                // Update day list if month and year were changed
                if ($scope.month !== month && $scope.year !== year) {
                    $scope.days = dayList($scope.month, $scope.year);
                }

                // Assign values to scope
                $scope.day = day;
                $scope.month = month;
                $scope.year = year;
            }

            function setValue() {
                var value;

                if ($scope.day && $scope.month && $scope.year) {
                    value = new Date($scope.year, $scope.month - 1, $scope.day, 0, 0, 0, 0);
                    $scope.model = value;
                    $scope.ngChange();
                }
            }

            $scope.onDayChanged = function () {
                setValue();
            };

            $scope.onMonthChanged = function () {
                adjustDay();
                setValue();
            };

            $scope.onYearChanged = function () {
                adjustDay();
                setValue();
            };

            // Set initial values
            value = $scope.model ? _.isDate($scope.model) ? $scope.model : new Date($scope.model) : null;
            $scope.day = value ? value.getDate() : null;
            $scope.month = value ? value.getMonth() + 1 : null;
            $scope.year = value ? value.getFullYear() : null;

            $scope.dayLabel = 'day'; //pipTranslate.translate('DAY');
            $scope.monthLabel = 'month'; //pipTranslate.translate('MONTH');
            $scope.yearLabel = 'year'; //pipTranslate.translate('YEAR');

            $scope.days = dayList($scope.month, $scope.year);
            $scope.months = monthList();
            $scope.years = yearList();

            $scope.disableControls = $scope.disabled ? $scope.disabled() : false;

            // React on changes
            $scope.$watch('model', function (newValue) {
                getValue(newValue);
            });

            $scope.$watch($scope.disabled, function (newValue) {
                $scope.disableControls = newValue;
            });
        }]
    );

})(window.angular, window._);


/**
 * @file Date range control
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve samples int sampler app
 * - Optimize. It is way to slow on samples
 */

/*
 pip-date-range-type
 [ daily,  weekly,  monthly,  yearly ]
 */

(function (angular, _) {
    'use strict';
    var thisModule = angular.module('pipDateRange', ['pipDates.Templates']);

    thisModule.directive('pipDateRange',
        function () {
            return {
                restrict: 'EA',
                require: 'ngModel',
                scope: {
                    timeMode: '@pipTimeMode',
                    disabled: '&ngDisabled',
                    model: '=ngModel',
                    pipChanged: '&',
                    pipDateRangeType: '@',
                    pipDateFormat: '@',
                    pipNoLine: '@'
                },
                templateUrl: 'date_range/date_range.html',
                controller: 'pipDateRangeController'
            };
        });

    // Todo: Remove dependency on Translate. Use moment localization
    thisModule.controller('pipDateRangeController',
        ['$scope', '$element', '$mdMedia', '$rootScope', function ($scope, $element, $mdMedia, $rootScope) { //pipTranslate, 
            var currentDate,
                currentYear,
                currentMonth,
                currentDay,
                prevState = {}, currentState = {};

            currentDate = new Date();
            currentYear = currentDate.getUTCFullYear();
            currentMonth = currentDate.getUTCMonth() + 1;
            currentDay = currentDate.getUTCDate();
            $scope.daysWeek = {
                en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
            };

            $scope.onDayChanged = function () {
                setValue();
            };

            $scope.onMonthChanged = function () {
                if ($scope.pipDateRangeType === 'weekly') {
                    var date, dayOfWeek;

                    date = new Date(Date.UTC($scope.year, $scope.month - 1, 1));
                    dayOfWeek = date.getUTCDay() ? date.getUTCDay() : 7;
                    $scope.week = getWeekByDate(dayOfWeek, $scope.month - 1, $scope.year);
                    correctWeek();
                    adjustWeek();
                } else {
                    adjustDay();
                }
                setValue();
            };

            $scope.onYearChanged = function () {
                var date, dayOfWeek;

                date = new Date(Date.UTC($scope.year, $scope.month - 1, 1));
                dayOfWeek = date.getUTCDay() ? date.getUTCDay() : 7;
                if ($scope.pipDateRangeType === 'weekly') {
                    $scope.week = getWeekByDate(dayOfWeek, $scope.month - 1, $scope.year);
                    adjustWeek();
                    correctWeek();
                } else {
                    adjustDay();
                }
                setValue();
            };

            $scope.onWeekChange = function () {
                if ($scope.pipDateRangeType === 'weekly') {
                    adjustWeek();
                    correctWeek();
                } else {
                    adjustDay();
                }
                setValue();
            };

            // visibility
            $scope.isDay = function () {
                return $scope.pipDateRangeType === 'daily';
            };

            $scope.isWeek = function () {
                return $scope.pipDateRangeType === 'weekly';
            };

            $scope.isMonth = function () {
                return $scope.pipDateRangeType === 'daily' ||
                    $scope.pipDateRangeType === 'weekly' ||
                    $scope.pipDateRangeType === 'monthly';
            };

            $scope.onChange = function () {
                if ($scope.pipChanged) {
                    $scope.pipChanged();
                }
            };

            function setCurrent() {
                currentState.day = $scope.day;
                currentState.month = $scope.month;
                currentState.year = $scope.year;
                currentState.week = $scope.week;
                currentState.dateRangeType = $scope.pipDateRangeType;
                currentState.model = $scope.model;
            }

            function fillLists() {
                $scope.days = dayList($scope.month, $scope.year);
                $scope.weeks = weekList($scope.month, $scope.year);
                $scope.months = monthList();
                $scope.shortMonths = monthList(true);
                $scope.years = yearList();

            }

            function correctWeek() {
                if (!prevState.model || prevState.model && prevState.model.getTime() >= $scope.model.getTime()) {
                    // if shift week -> increase month
                    if ($scope.weeks && $scope.weeks[$scope.week] && $scope.weeks[$scope.week].id <= 0) {
                        if ($scope.month < 12) {
                            $scope.month += 1;
                        } else {
                            $scope.month = 1;
                            $scope.year += 1;
                        }
                        fillLists();
                    }
                }
            }

            function init() {
                var value;

                value = $scope.model ? new Date($scope.model) : null;
                $scope.day = value ? value.getUTCDate() : null;
                $scope.month = value ? value.getUTCMonth() + 1 : null;
                $scope.year = value ? value.getUTCFullYear() : null;
                $scope.week = value ? getWeekByDate($scope.day, $scope.month - 1, $scope.year) : null;

                fillLists();

                if ($scope.pipDateRangeType === 'weekly') {
                    correctWeek();
                    adjustWeek();
                } else {
                    adjustDay();
                }
                setValue();
            }

            // Set initial values
            $scope.$mdMedia = $mdMedia;

            init();

            $scope.disableControls = $scope.disabled ? $scope.disabled() : false;

            // React on changes
            $scope.$watch('model', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    getValue(newValue);
                }
            });

            $scope.$watch($scope.disabled, function (newValue) {
                $scope.disableControls = newValue;
            });

            $scope.$watch('pipDateRangeType', function (newValue, oldValue) {
                if (newValue !== oldValue && oldValue) {
                    init();
                }
            });

            $scope.onYearClick = function () {
                if (!$scope.year) {
                    $scope.year = currentYear;
                }
            };

            $scope.onMonthClick = function () {
                if (!$scope.month) {
                    $scope.month = currentMonth;
                }
            };

            $scope.onDayClick = function () {
                if (!$scope.year) {
                    $scope.day = currentDay;
                }
            };
            // ---------------------------------------------------------------------------------------

            function getCountDay(month, year) {
                var count = 31;

                if (month === 4 || month === 6 || month === 9 || month === 11) {
                    count = 30;
                } else if (month === 2) {
                    if (year) {
                        // Calculate leap year (primitive)
                        count = year % 4 === 0 ? 29 : 28;
                    } else {
                        count = 28;
                    }
                }

                return count;
            }

            function dayList(month, year) {
                var count, days, i, ln;

                ln = $rootScope.$language || 'en';
                count = getCountDay(month, year);
                $scope.nameDays = [];
                days = [];
                for (i = 1; i <= count; i++) {
                    days.push(i);
                    $scope.nameDays.push($scope.daysWeek[ln][new Date(year, month - 1, i).getDay()]);
                }

                return days;
            }

            function getWeekByDate(day, month, year) {
                var date, dayOfWeek, startWeek;

                date = new Date(Date.UTC(year, month, day));
                dayOfWeek = date.getUTCDay() ? date.getUTCDay() : 7;

                if (dayOfWeek === 1) {
                    startWeek = day;
                } else {
                    startWeek = day + 1 - dayOfWeek;
                }

                return startWeek;
            }

            function getWeek(day, countDay, countPrevMonthDay) {
                var endDay, startDay;

                endDay = day + 6 > countDay ? countDay - day - 6 : day + 6;
                startDay = day > 0 ? day : countPrevMonthDay + day;

                return startDay.toString() + ' - ' + (Math.abs(endDay)).toString();
            }

            function weekList(month, year) { // возвращает список начала надели
                var weeks, countDay, countPrevMonthDay, startWeek;

                weeks = [];  // в массиве первые дни недели в текущем месяце
                countDay = getCountDay(month, year);
                startWeek = getWeekByDate(1, month - 1, year);

                countPrevMonthDay = month - 1 ? getCountDay(month - 1, year) : getCountDay(12, year - 1);
                while (startWeek < countDay + 1) {
                    weeks.push({
                        id: startWeek,
                        name: getWeek(startWeek, countDay, countPrevMonthDay)
                    });
                    startWeek = startWeek + 7;
                }

                return weeks;
            }

            function monthList() {
                var months, i;

                months = [];
                for (i = 1; i <= 12; i++) {
                    months.push({
                        id: i,
                        name: ''//pipTranslate.translate('MONTH_' + i)
                    });
                }

                return months;
            }

            function yearList() {
                var startYear, i,
                    endYear,
                    years = [];

                switch ($scope.timeMode) {
                    case 'future':
                        startYear = currentYear;
                        endYear = currentYear + 100;
                        break;
                    case 'past':
                        startYear = currentYear - 100;
                        endYear = currentYear;
                        break;
                    case 'now':
                        startYear = currentYear - 50;
                        endYear = currentYear + 100;
                        break;
                    default:
                        startYear = currentYear - 50;
                        endYear = currentYear + 50;
                        break;
                }
                if ($scope.timeMode === 'future') {
                    for (i = startYear; i <= endYear; i++) {
                        years.push(i);
                    }
                } else {
                    for (i = endYear; i >= startYear; i--) {
                        years.push(i);
                    }
                }

                return years;
            }

            function adjustDay() {
                var days = dayList($scope.month, $scope.year);

                switch ($scope.pipDateRangeType) {
                    case 'monthly':
                        $scope.day = 1;
                        break;
                    case 'yearly':
                        $scope.month = 1;
                        $scope.day = 1;
                        break;
                    default:
                        if ($scope.days.length !== days.length) {
                            if ($scope.day > days.length) {
                                $scope.day = days.length;
                            }
                        }
                        break;
                }
                $scope.days = days;
            }

            function adjustWeek() {
                var weeks;

                weeks = weekList($scope.month, $scope.year);
                $scope.week = getWeekByDate($scope.week, $scope.month - 1, $scope.year);
                $scope.weeks = weeks;
            }

            function getValue(v) {
                var value, day, month, year, week;

                value = v ? new Date(v) : null;
                // Define values
                day = value ? value.getUTCDate() : null;
                month = value ? value.getUTCMonth() + 1 : null;
                year = value ? value.getUTCFullYear() : null;
                week = value ? getWeekByDate(day, month - 1, year) : null;
                // Exit if nothing to update
                if ($scope.day === day && $scope.month === month && $scope.year === year && $scope.week === week) {
                    return;
                }
                // Assign values to scope
                $scope.day = day;
                $scope.month = month;
                $scope.year = year;
                $scope.week = week;

                // Define data sources
                $scope.days = dayList($scope.month, $scope.year);
                $scope.weeks = weekList($scope.month, $scope.year);
            }

            function setValue() {
                var value;

                if ($scope.pipDateRangeType === 'weekly') {
                    value = new Date($scope.year, $scope.month - 1, $scope.week, 0, 0, 0, 0);
                    value = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
                    $scope.model = value;
                } else {
                    value = new Date($scope.year, $scope.month - 1, $scope.day, 0, 0, 0, 0);
                    value = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
                    $scope.model = value;
                }

                prevState = _.cloneDeep(currentState);
                setCurrent();
                $scope.onChange();
            }
        }]
    );

})(window.angular, window._);

/**
 * @file Optional filter to translate string resources
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipDates.Translate', []);

    thisModule.filter('translate', ['$injector', function ($injector) {
        var pipTranslate = $injector.has('pipTranslate') 
            ? $injector.get('pipTranslate') : null;

        return function (key) {
            return pipTranslate  ? pipTranslate.translate(key) || key : key;
        }
    }]);

})();

/**
 * @file Filter to format date and time
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipDateTimeFilters', ['pipDateFormat']);

    thisModule.filter('formatDate',  
        ['pipDateFormat', function (pipDateFormat) {
            return function(value, format) {
                return pipDateFormat.formatDate(value, format);  
            };
        }]
    );

    thisModule.filter('formatLongDate', 
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatLongDate(value);  
            };
        }]
    );

    thisModule.filter('formatLongDateWithYear',
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatLongDateWithYear(value);
            };
        }]
    );

    thisModule.filter('formatMonth',
        ['pipDateFormat', function (pipDateFormat) {
            return function(value, format) {
                return pipDateFormat.formatMonth(value, format);
            };
        }]
    );

    thisModule.filter('formatShortDate', 
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatShortDate(value);  
            };
        }]
    );

    thisModule.filter('formatShortDateWithYear',
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatShortDateWithYear(value);
            };
        }]
    );

    thisModule.filter('formatLongMonth',
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatLongMonth(value);
            };
        }]
    );

    thisModule.filter('formatYear',
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatYear(value);
            };
        }]
    );

    thisModule.filter('formatShortWeek',
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatShortWeek(value);
            };
        }]
    );

    thisModule.filter('formatTime', 
        ['pipDateFormat', function (pipDateFormat) {
            return function(value, format) {
                return pipDateFormat.formatTime(value, format);  
            };
        }]
    );

    thisModule.filter('formatLongTime', 
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatLongTime(value);  
            };
        }]
    );

    thisModule.filter('formatShortTime', 
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatShortTime(value);  
            };
        }]
    );

    thisModule.filter('formatLongDateTime', 
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatLongDateTime(value);  
            };
        }]
    );

    thisModule.filter('formatShortDateTime', 
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatShortDateTime(value);  
            };
        }]
    );

    thisModule.filter('formatElapsedInterval', 
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatElapsedInterval(value);  
            };
        }]
    );

    thisModule.filter('formatElapsedTime', 
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatElapsedTime(value);  
            };
        }]
    );

    thisModule.filter('formatMillisecondsToSeconds',
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatMillisecondsToSeconds(value);
            };
        }]
    );

    thisModule.filter('formatDateRange',
        ['pipDateFormat', function (pipDateFormat) {
            return function(value1, value2) {
                return pipDateFormat.formatDateRange(value1, value2);
            };
        }]
    );

    thisModule.filter('formatDateTimeRange',
        ['pipDateFormat', function (pipDateFormat) {
            return function(value1, value2) {
                return pipDateFormat.formatDateTimeRange(value1, value2);
            };
        }]
    );


})();

/**
 * @file Date formatting service
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global _, angular */
 
(function () {
    'use strict';

    var thisModule = angular.module('pipDateFormat', []);

    // Todo: Remove dependency on Translate. Use moment localization
	thisModule.config(function() {

        // pipTranslateProvider.translations('en', {
        //     // Months - 'MONTH_' + monthIndex
        //     // start at 0 to match JS date format
        //     'MONTH_1': 'January',
        //     'MONTH_2': 'February',
        //     'MONTH_3': 'March',
        //     'MONTH_4': 'April',
        //     'MONTH_5': 'May',
        //     'MONTH_6': 'June',
        //     'MONTH_7': 'July',
        //     'MONTH_8': 'August',
        //     'MONTH_9': 'September',
        //     'MONTH_10': 'October',
        //     'MONTH_11': 'November',
        //     'MONTH_12': 'December',

        //     'MONTH_LONG_1': 'January',
        //     'MONTH_LONG_2': 'February',
        //     'MONTH_LONG_3': 'March',
        //     'MONTH_LONG_4': 'April',
        //     'MONTH_LONG_5': 'May',
        //     'MONTH_LONG_6': 'June',
        //     'MONTH_LONG_7': 'July',
        //     'MONTH_LONG_8': 'August',
        //     'MONTH_LONG_9': 'September',
        //     'MONTH_LONG_10': 'October',
        //     'MONTH_LONG_11': 'November',
        //     'MONTH_LONG_12': 'December',

        //     'MONTH_SHORT_1': 'Jan',
        //     'MONTH_SHORT_2': 'Feb',
        //     'MONTH_SHORT_3': 'Mar',
        //     'MONTH_SHORT_4': 'Apr',
        //     'MONTH_SHORT_5': 'May',
        //     'MONTH_SHORT_6': 'Jun',
        //     'MONTH_SHORT_7': 'Jul',
        //     'MONTH_SHORT_8': 'Aug',
        //     'MONTH_SHORT_9': 'Sep',
        //     'MONTH_SHORT_10': 'Oct',
        //     'MONTH_SHORT_11': 'Nov',
        //     'MONTH_SHORT_12': 'Dec',

        //     // Days of the week - 'DAY_' + dayIndex
        //     // start at 1 to match JS date format
        //     'DAY_1': 'Monday',
        //     'DAY_2': 'Tuesday',
        //     'DAY_3': 'Wednesday',
        //     'DAY_4': 'Thursday',
        //     'DAY_5': 'Friday',
        //     'DAY_6': 'Saturday',
        //     'DAY_7': 'Sunday',

        //     'ELAPSED_TODAY': 'Today',
        //     'ELAPSED_YESTERDAY': 'Yesterday',
        //     'ELAPSED_YEARS': 'y',
        //     'ELAPSED_MONTHS': 'mth',
        //     'ELAPSED_WEEKS': 'w',
        //     'ELAPSED_DAYS': 'd',
        //     'ELAPSED_HOURS': 'h',
        //     'ELAPSED_MINUTES': 'm',
        //     'ELAPSED_SECONDS': 's',
        //     'ELAPSED_AT': 'at',
        //     'ELAPSED_AGO': 'ago',
        //     'ELAPSED_JUST_NOW': 'Just now',
        //     'ELAPSED_FEW_MIN_AGO': 'Few min ago',
        //     'ELAPSED_MIN_AGO': 'min ago',
        //     'ELAPSED_HOUR_AGO': 'hour ago',
        //     'ELAPSED_HOURS_AGO': 'hours ago',
        //     'ELAPSED_HOURS_AGO_MORE_THAN_FIVE': 'hours ago'
        // });

        // pipTranslateProvider.translations('ru', {
        //     // Months - 'MONTH_' + monthIndex
        //     // start at 0 to match JS date format
        //     'MONTH_1': 'январь',
        //     'MONTH_2': 'февраль',
        //     'MONTH_3': 'март',
        //     'MONTH_4': 'апрель',
        //     'MONTH_5': 'май',
        //     'MONTH_6': 'июнь',
        //     'MONTH_7': 'июль',
        //     'MONTH_8': 'август',
        //     'MONTH_9': 'сентябрь',
        //     'MONTH_10': 'октябрь',
        //     'MONTH_11': 'ноябрь',
        //     'MONTH_12': 'декабрь',

        //     'MONTH_LONG_1': 'января',
        //     'MONTH_LONG_2': 'февраля',
        //     'MONTH_LONG_3': 'марта',
        //     'MONTH_LONG_4': 'апреля',
        //     'MONTH_LONG_5': 'мая',
        //     'MONTH_LONG_6': 'июня',
        //     'MONTH_LONG_7': 'июля',
        //     'MONTH_LONG_8': 'августа',
        //     'MONTH_LONG_9': 'сентября',
        //     'MONTH_LONG_10': 'октября',
        //     'MONTH_LONG_11': 'ноября',
        //     'MONTH_LONG_12': 'декабря',

        //     'MONTH_SHORT_1': 'янв',
        //     'MONTH_SHORT_2': 'фев',
        //     'MONTH_SHORT_3': 'мар',
        //     'MONTH_SHORT_4': 'апр',
        //     'MONTH_SHORT_5': 'май',
        //     'MONTH_SHORT_6': 'июн',
        //     'MONTH_SHORT_7': 'июл',
        //     'MONTH_SHORT_8': 'авг',
        //     'MONTH_SHORT_9': 'сен',
        //     'MONTH_SHORT_10': 'окт',
        //     'MONTH_SHORT_11': 'ноя',
        //     'MONTH_SHORT_12': 'дек',

        //     // Days of the week - 'DAY_' + dayIndex
        //     // start at 1 to match JS date format
        //     'DAY_1': 'понедельник',
        //     'DAY_2': 'вторник',
        //     'DAY_3': 'среда',
        //     'DAY_4': 'четверг',
        //     'DAY_5': 'пятница',
        //     'DAY_6': 'суббота',
        //     'DAY_7': 'воскресенье',

        //     'ELAPSED_TODAY': 'Сегодня',
        //     'ELAPSED_YESTERDAY': 'Вчера',
        //     'ELAPSED_YEARS': 'г',
        //     'ELAPSED_MONTHS': 'мц',
        //     'ELAPSED_WEEKS': 'н',
        //     'ELAPSED_DAYS': 'д',
        //     'ELAPSED_HOURS': 'ч',
        //     'ELAPSED_MINUTES': 'м',
        //     'ELAPSED_SECONDS': 'с',
        //     'ELAPSED_AT': 'в',
        //     'ELAPSED_AGO': 'тн',
        //     'ELAPSED_JUST_NOW': 'Только что',
        //     'ELAPSED_FEW_MIN_AGO': 'Несколько мин тн',
        //     'ELAPSED_MIN_AGO': 'мин тн',
        //     'ELAPSED_HOUR_AGO': 'час тн',
        //     'ELAPSED_HOURS_AGO': 'часа тн',
        //     'ELAPSED_HOURS_AGO_MORE_THAN_FIVE': 'часов тн'
        // });
		
	});

    thisModule.factory('pipDateFormat',
        ['pipDates', '$rootScope', function (pipDates, $rootScope) { //pipTranslate

            return {
                formatDate: formatDate,
                formatLongDate: formatLongDate,
                formatShortDate: formatShortDate,
                formatShortDateWithYear: formatShortDateWithYear,
                formatLongDateWithYear: formatLongDateWithYear,

                formatLongMonth: formatLongMonth,
                formatMonth: formatMonth,
                formatYear: formatYear,
                formatShortWeek: formatShortWeek,
                formatShortDayAndMonth: formatShortDayAndMonth,
                formatLongDayAndMonth: formatLongDayAndMonth,

                formatDateRange: formatDateRange,
                formatDateTimeRange: formatDateTimeRange,

                formatTime: formatTime,
                formatLongTime: formatLongTime,
                formatShortTime: formatShortTime, 

                formatLongDateTime: formatLongDateTime,
                formatShortDateTime: formatShortDateTime,

                formatElapsedTime: formatElapsedTime,
                formatElapsedInterval: formatElapsedInterval,

                formatMillisecondsToSeconds: formatMillisecondsToSeconds
            };


            function twoDigits(value) {
                return value < 10 ? '0' + value : value; 
            };

            function formatDate(value, format, str) {
                if (value == null) return '';

                var
                    strict = str || false,
                    value = _.isDate(value) ? value : new Date(value),
                    thisYear = new Date().getUTCFullYear(),
                    year = value.getUTCFullYear(),
                    month = value.getUTCMonth(),
                    // longMonthName = pipTranslate.translate('MONTH_LONG_' + (month + 1)),
                    // shortMonthName = pipTranslate.translate('MONTH_SHORT_' + (month + 1)),
                    // monthName = pipTranslate.translate('MONTH_' + (month + 1)),
                    day = value.getUTCDate(),
                    startWeek = pipDates.toStartWeek(value),
                    endWeek = pipDates.toEndWeek(value, -1);

                if (strict == false && format == 'd MMMM yyyy' && thisYear === year) {
                        format = 'MMMM d';
                }
                if (strict == false && format == 'd MMM yyyy' && thisYear === year) {
                        format = 'MMM d';
                }
                if ((format == 'MMM d') && $rootScope.$language == 'ru') {
                        format = 'd MMM';
                }
                if ((format == 'MMMM d') && $rootScope.$language == 'ru') {
                    format = 'd MMMM';
                }

                if (format == 'd MMMM yyyy')
                    return '' + day + ' ' + longMonthName + ' ' + year
                else if (format == 'MMMM d, yyyy')
                    return '' + monthName + ' ' + day + ', ' + year
                if (format == 'd MMM yyyy')
                    return '' + day + ' ' + shortMonthName + ' ' + year
                else if (format == 'MMM d, yyyy')
                    return '' + shortMonthName + ' ' + day + ', ' + year
                else if (format == 'd MMMM')
                    return '' + day + ' ' + longMonthName
                else if (format == 'd MMM')
                    return '' + day + ' ' + shortMonthName
                else if (format == 'MMM d')
                    return '' + shortMonthName + ' ' + day;
                else if (format == 'MMMM d')
                    return '' + longMonthName + ' ' + day;
                else if (format == 'yyyy/M/d')
                    return '' + year + '/' + month + '/' + day;
                else if (format == 'yyy-M-d')
                    return '' + year + '-' + month + '-' + day;
                else if (format == 'MMMM')
                    return '' + longMonthName + ' ' + year;
                else if (format == 'yyyy')
                    return '' + year;
                else if (format == 'ww')
                    return '' + startWeek.getUTCDate() + ' - ' + endWeek.getUTCDate() + ' ' + monthName + ' ' + year;

                return '' + day + ' ' + monthName + ' ' + year
            }

            function formatLongDate(value) {
                return formatDate(value, 'd MMMM yyyy');
            }

            function formatShortDateWithYear(value) {
                return formatDate(value, 'd MMM yyyy', true);
            }

            function formatLongDateWithYear(value) {
                return formatDate(value, 'd MMMM yyyy', true);
            }

            function formatShortDate(value) {
                return formatDate(value, 'd MMM yyyy');
            }

            function formatLongMonth(value) {
                return formatDate(value, 'MMMM');
            }

            function formatYear(value) {
                return formatDate(value, 'yyyy');
            }

            function formatShortWeek(value) {
                return formatDate(value, 'ww');
            }

            function formatShortDayAndMonth(value) {
                return formatDate(value, 'd MMM');
            }

            function formatLongDayAndMonth(value) {
                if ($rootScope.$language == 'ru')
                    return formatDate(value, 'd MMMM');
                else
                    return formatDate(value, 'MMMM d');
            }

            function formatDateRange(value1, value2) {
                value1 =  value1 ? (_.isDate(value1) ? value1 : new Date(value1)) : null;
                value2 =  value2 ? (_.isDate(value2) ? value2 : new Date(value2)) : null;

                if (value1 == null) {
                    if ($rootScope.$language == 'ru')
                        return formatDate(value2, 'd MMM yyyy', true);
                    else
                        return formatDate(value2, 'MMM d, yyyy', true);
                }

                if (value2 == null || value1 == value2) {
                    if ($rootScope.$language == 'ru')
                        return formatDate(value1, 'd MMM yyyy', true);
                    else
                        return formatDate(value1, 'MMM d, yyyy', true);
                }

                if (value1.getUTCFullYear() !== value2.getUTCFullYear()) {
                    if ($rootScope.$language == 'ru')
                        return formatDate(value1, 'd MMM yyyy', true) + '-' + formatDate(value2, 'd MMM yyyy', true);
                    else
                        return formatDate(value1, 'MMM d, yyyy', true) + '-' + formatDate(value2, 'MMM d, yyyy', true);
                } else {
                        return formatDate(value1, 'd MMM') + ' - ' + formatDate(value2, 'd MMM')
                            + ((new Date().getUTCFullYear() !== value1.getUTCFullYear()) ? ' ' + formatDate(value1, 'yyyy') : '');
                }
            }

            function formatDateTimeRange(value1, value2) {
                value1 =  value1 ? (_.isDate(value1) ? value1 : new Date(value1)) : null;
                value2 =  value2 ? (_.isDate(value2) ? value2 : new Date(value2)) : null;
                if (value1 == null && value2 == null) return '';

                if (value1 == null) {
                    return formatShortDateTime(value2);
                }

                if (value2 == null || value1 == value2) {
                    return formatShortDateTime(value1);
                }

                var dayStart, monthStart, yearStart,
                    dayEnd, monthEnd, yearEnd;

                dayStart = value1.getUTCDate();
                monthStart = value1.getUTCMonth();
                yearStart = value1.getUTCFullYear();
                dayEnd = value2.getUTCDate();
                monthEnd = value2.getUTCMonth();
                yearEnd = value2.getUTCFullYear();


                if (yearStart !== yearEnd) {
                    return formatDate(value1, 'd MMM') + ', ' + yearStart + ' ' + formatTime(value1, 'hh:mm') +
                        ' - ' + formatDate(value2, 'd MMM') + ', ' + yearEnd + ' ' + formatTime(value2, 'hh:mm');
                } else {
                    if (monthStart != monthEnd && !dayStart != dayEnd)
                        return formatDate(value1, 'd MMM') + ', ' + formatTime(value1, 'hh:mm') +
                            ' - ' + formatDate(value2, 'd MMM') + ', ' + formatTime(value2, 'hh:mm');
                    else
                        return formatTime(value1, 'hh:mm') + ' - ' + formatTime(value2, 'hh:mm')
                }
            }

            function formatTime(value, format) {
                if (value == null) return '';

                value = _.isDate(value) ? value : new Date(value);
                
                var 
                    hours = value.getHours(),
                    mins = value.getMinutes(),
                    secs = value.getSeconds(),
                    ampm = '';

                // if (pipTranslate && pipTranslate.use() == 'en') {
                //     ampm = hours >= 12 ? ' PM' : ' AM';
                //     hours = hours % 12;
                //     if (hours == 0) hours = 12;
                // }

                if (format == 'hh:mm:ss')
                    return '' + twoDigits(hours) + ':' + twoDigits(mins) + ':' + twoDigits(secs) + ampm;
                else if (format == 'hh:mm')
                    return '' + twoDigits(hours) + ':' + twoDigits(mins) + ampm;

                return '' + twoDigits(hours) + ':' + twoDigits(mins) + ':' + twoDigits(secs) + ampm;
            }

            function formatMonth(value, short) {
                if (value == null) return '';
                return 'MONTH_SHORT_' + value //short ? pipTranslate.translate('MONTH_SHORT_' + value) : pipTranslate.translate('MONTH_' + value);
            }

            function formatLongTime(value) {
                return formatTime(value, 'hh:mm:ss');
            }

            function formatShortTime(value) {
                return formatTime(value, 'hh:mm');
            }

            function formatLongDateTime(value) {
                if (value == null) return '';
                value = _.isDate(value) ? value : new Date(value);
                return formatLongDate(value) + ' ' + formatLongTime(value);
            }

            function formatShortDateTime(value) {
                if (value == null) return '';
                value = _.isDate(value) ? value : new Date(value);
                return formatShortDate(value) + ' ' + formatShortTime(value);
            }

            function formatElapsedTime(value, format) {
                if (value == null) return '';

                value = _.isDate(value) ? value : new Date(value);

                var 
                    current = new Date(),
                    diff = Math.floor(((current.getTime() + current.getTimezoneOffset()) - (value.getTime() + value.getTimezoneOffset())) / 1000);

                if (diff < 1) return 'ELAPSED_JUST_NOW' //pipTranslate.translate('ELAPSED_JUST_NOW');

                var years, months, weeks, days, hours, mins, secs;

                secs = diff % 60;

                diff = Math.floor(diff / 60);
                mins = diff % 60;

                diff = Math.floor(diff / 60);
                hours = diff % 24;

                diff = diff / 24;
                years = Math.floor(diff / 365),

                diff = diff - years * 365;
                months = Math.floor(diff / 30),
                days = Math.floor(diff - months * 30);

                if (days % 7 == 0) {
                    weeks = Math.floor(days / 7);
                    days = 0;
                } else {
                    weeks = 0;
                }

                // if (format == 'interval') {
                //     var result = '';

                //     if (years) {
                //         result += ' ' + years + pipTranslate.translate('ELAPSED_YEARS');
                //         weeks = days = hours = mins = secs = null;
                //     }
                //     if (months) {
                //         result += ' ' + months + pipTranslate.translate('ELAPSED_MONTHS');
                //         days = hours = mins = secs = null;
                //     }
                //     if (weeks) {
                //         result += ' ' + weeks + pipTranslate.translate('ELAPSED_WEEKS');
                //         hours = mins = secs = null;
                //     }
                //     if (days) {
                //         result += ' ' + days + pipTranslate.translate('ELAPSED_DAYS');
                //         mins = secs = null;
                //     }
                //     if (hours) {
                //         result += ' ' + hours + pipTranslate.translate('ELAPSED_HOURS');
                //         secs = null;
                //     }
                //     if (mins) result += ' ' + mins + pipTranslate.translate('ELAPSED_MINUTES');
                //     if (secs) result += ' ' + secs + pipTranslate.translate('ELAPSED_SECONDS');

                //     return result != '' ? result + ' ' + pipTranslate.translate('ELAPSED_AGO') 
                //         : pipTranslate.translate('ELAPSED_JUST_NOW');
                // }

                // Default time format = 'default'

                // if (years > 0) {
                //     return formatDate(value, 'd MMM yyyy');
                // }

                // if (months > 0 || weeks > 0 || days > 1) {
                //     return formatDate(value, 'MMM d') 
                //         + ', ' + formatTime(value, 'hh:mm');
                // }

                // if (days == 1) {
                //     return pipTranslate.translate('ELAPSED_YESTERDAY') 
                //         + ', ' + formatTime(value, 'hh:mm');
                // }

                // if (hours > 10) {
                //     return pipTranslate.translate('ELAPSED_TODAY') 
                //         + ', ' + formatTime(value, 'hh:mm');
                // }

                // if (hours > 0) {
                //     return '' + hours + ' ' + (hours < 2 ? pipTranslate.translate('ELAPSED_HOUR_AGO') :
                //         hours < 5 ? pipTranslate.translate('ELAPSED_HOURS_AGO') : pipTranslate.translate('ELAPSED_HOURS_AGO_MORE_THAN_FIVE'));
                // }

                // if (mins > 10) {
                //     return '' + mins + ' ' + pipTranslate.translate('ELAPSED_MIN_AGO');
                // }

                // if (mins > 0) {
                //     return pipTranslate.translate('ELAPSED_FEW_MIN_AGO');
                // }

                // return pipTranslate.translate('ELAPSED_JUST_NOW');
            }

            function formatElapsedInterval(value) {
                return formatElapsedTime(value, 'interval');  
            }

            function formatMillisecondsToSeconds(value) {
                return Math.floor(value / 1000)
            }

        }]
    );
    
})();

/**
 * @file Time control
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipTimeRange', []);

    thisModule.directive('pipTimeRange',
        function () {
            return {
                restrict: 'EA',
                scope: {
                    pipStartDate: '=',
                    pipEndDate: '='
                },
                templateUrl: 'time_range/time_range.html',
                link: function ($scope, $element, $attrs) {

                    function getDateJSON(value) {
                        return value ? new Date(value) : null;
                    }

                    function defineStartDate() {
                        if ($scope.pipStartDate !== null && $scope.pipStartDate !== undefined) {
                            $scope.data.start = _.isDate($scope.pipStartDate) ? $scope.pipStartDate
                                : getDateJSON($scope.pipStartDate);
                        }
                    }

                    function defineEndDate() {
                        if ($scope.pipEndDate !== null && $scope.pipEndDate !== undefined) {
                            $scope.data.end = _.isDate($scope.pipEndDate) ? $scope.pipEndDate
                                : getDateJSON($scope.pipEndDate);
                        }
                    }

                    function toBoolean(value) {
                        if (value == null) return false;
                        if (!value) return false;
                        value = value.toString().toLowerCase();
                        return value == '1' || value == 'true';
                    }

                    $scope.data = {};
                    $scope.data.start = null;
                    $scope.data.end = null;
                    defineStartDate();
                    defineEndDate();

                    if (toBoolean($attrs.pipRebind)) {
                        $scope.$watch('pipStartDate',
                            function () {
                                $scope.data.start = null;
                                defineStartDate();
                            }
                        );
                        $scope.$watch('pipEndDate',
                            function () {
                                $scope.data.end = null;
                                defineEndDate();
                            }
                        );
                    }

                    // Add class
                    $element.addClass('pip-time-range');
                }
            };
        }
    );

})(window.angular, window._);


(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipTimeRangeEdit', ['pipDatesUtils']);

    thisModule.directive('pipTimeRangeEdit',
        function () {
            return {
                restrict: 'EA',
                scope: {
                    pipStartDate: '=',
                    pipChanged: '&',
                    pipEndDate: '=',
                    pipStartLabel: '@',
                    pipEndLabel: '@',
                    disabled: '&ngDisabled',
                    pipSize: '='
                },
                templateUrl: 'time_range_edit/time_range_edit.html',
                controller: 'pipTimeRangeEditController'
            };
        }
    );

    // Todo: Remove dependency on Translate. Use moment localization
    thisModule.controller('pipTimeRangeEditController',
        ['$scope', '$element', '$attrs', 'pipDates', 'pipTranslate', function ($scope, $element, $attrs, pipDates, pipTranslate) {

            function getDateJSON(value) {
                return value ? new Date(value) : null;
            }

            function setDuration() {
                var start, end;

                if (!$scope.data.startDate || !$scope.data.endDate) {
                    return null;
                }
                start = new Date($scope.data.startDate.getTime() + $scope.data.startTime * 60 * 1000);
                end = new Date($scope.data.endDate.getTime() + $scope.data.endTime * 60 * 1000);

                return end - start;
            }

            function validateStartDate() {
                var date, start, end;

                // если начальная дата не задана, обнуляем и выходим
                if (!$scope.data.startDate) {
                    $scope.data.startTime = null;

                    return;
                }

                // еcли не задано начальное время - задаем его
                if (!$scope.data.startTime) {
                    if (!$scope.data.endTime) {
                        date = new Date();
                        date = date.getTime() - pipDates.toStartDay(date);
                        $scope.data.startTime = Math.floor(date / (30 * 60 * 1000)) * 30;
                    } else {
                        $scope.data.startTime = $scope.data.endTime === 0 ? 0 : $scope.data.endTime - 30;
                    }
                }

                // если конечная дата не задана, обнуляем и выходим
                if (!$scope.data.endDate) {
                    $scope.data.endTime = null;

                    return;
                }

                start = new Date($scope.data.startDate.getTime() + $scope.data.startTime * 60 * 1000);

                // Если есть длительность, то сохраняем ее. Длительность можно изменить только изменяя конечную дату
                if ($scope.data.duration) {
                    end = new Date(start.getTime() + $scope.data.duration);
                    $scope.data.endDate = pipDates.toStartDay(end);
                    end = end.getTime() - $scope.data.endDate.getTime();
                    $scope.data.endTime = Math.floor(end / (30 * 60 * 1000)) * 30;
                } else {
                    // Если нет длительности сравниваем даты
                    end = new Date($scope.data.endDate.getTime() + $scope.data.endTime * 60 * 1000);
                    if (start >= end) {
                        // Если начальная дата больше, то двигаем конечную дату
                        $scope.data.endDate = pipDates.toStartDay(new Date(start.getTime() + 30 * 60000));
                        $scope.data.endTime = ($scope.data.startTime + 30) % 1440;
                    }
                }
            }

            function validateEndDate() {
                var date, start, end;

                // если начальная дата не задана, обнуляем и выходим
                if (!$scope.data.endDate) {
                    $scope.data.endTime = null;

                    return;
                }

                // еcли не задано конечное время - задаем его
                if (!$scope.data.endTime) {
                    if (!$scope.data.startTime) {
                        date = new Date();
                        date = date.getTime() - pipDates.toStartDay(date);
                        $scope.data.endTime = Math.floor(date / (30 * 60 * 1000)) * 30;
                    } else {
                        $scope.data.endTime = $scope.data.startTime === 1410 ? 1410 : $scope.data.startTime + 30;
                    }
                }

                // если yачальная дата не задана, обнуляем и выходим
                if (!$scope.data.startDate) {
                    $scope.data.startTime = null;

                    return;
                }

                start = new Date($scope.data.startDate.getTime() + $scope.data.startTime * 60 * 1000);
                end = new Date($scope.data.endDate.getTime() + $scope.data.endTime * 60 * 1000);

                if (start >= end) {
                    // Если начальная дата больше, то двигаем начальную дату
                    $scope.data.startDate = pipDates.toStartDay(new Date(end.getTime() - 30 * 60000));
                    $scope.data.startTime = $scope.data.endTime % 1440 === 0 ? 1410 : $scope.data.endTime - 30;
                }

                $scope.data.duration = setDuration();
            }

            function setDate() {
                var time;

                $scope.data.bind = false;

                if ($scope.data.startDate) {
                    time = $scope.data.startTime ? $scope.data.startTime * 60 * 1000 : 0;
                    $scope.pipStartDate = new Date($scope.data.startDate.getTime() + time);
                }

                if ($scope.data.endDate) {
                    time = $scope.data.endTime ? $scope.data.endTime * 60 * 1000 : 0;
                    $scope.pipEndDate = new Date($scope.data.endDate.getTime() + time);
                }

                $scope.data.bind = true;
            }

            function defineDate() {
                var start, end;

                if ($scope.pipStartDate !== null && $scope.pipStartDate !== undefined) {
                    start = _.isDate($scope.pipStartDate) ? $scope.pipStartDate : null;

                    if (!start) {
                        start = getDateJSON($scope.pipStartDate);
                    }

                    $scope.data.startDate = pipDates.toStartDay(start);
                    $scope.data.startTime = (new Date(start) - $scope.data.startDate) / (60 * 1000);
                }

                if ($scope.pipEndDate !== null && $scope.pipEndDate !== undefined) {
                    end = _.isDate($scope.pipEndDate) ? $scope.pipEndDate : null;

                    if (!start) {
                        end = getDateJSON($scope.pipEndDate);
                    }

                    $scope.data.endDate = pipDates.toStartDay(end);
                    $scope.data.endTime = (new Date(end) - $scope.data.endDate) / (60 * 1000);
                }

                validateStartDate();
                $scope.data.duration = setDuration();
                setDate();
            }

            function getTimeInterval() {
                var result, i, j, minutes;

                result = [];
                for (i = 0; i < 24; i++) {
                    for (j = 0; j < 2; j++) {
                        minutes = j * 30;
                        result.push({
                            id: i * 60 + minutes,
                            time: _.pad(i.toString(), 3, '0').substr(0, 2) + ':' + _.pad(minutes.toString(), 2, '0')
                        });
                    }
                }

                return result;
            }

            function initDate() {
                $scope.data.startDate = null;
                $scope.data.startTime = null;
                $scope.data.endDate = null;
                $scope.data.endTime = null;
                $scope.data.duration = null;
            }

            // initialize data
            $scope.intervalTimeCollection = getTimeInterval();
            $scope.data = {};
            $scope.startLabel = $scope.pipStartLabel ? pipTranslate.translate($scope.pipStartLabel)
                : pipTranslate.translate('EVENT_NEW_START_TIME');
            $scope.endLabel = $scope.pipEndLabel ? pipTranslate.translate($scope.pipEndLabel)
                : pipTranslate.translate('EVENT_NEW_END_TIME');
            initDate();
            defineDate();

            // process function
            $scope.onChangeStartDate = function () {
                validateStartDate();
                $scope.data.duration = setDuration();
                setDate();
                $scope.pipChanged();
            };

            $scope.onChangeEndDate = function () {
                validateEndDate();
                $scope.data.duration = setDuration();
                setDate();
                $scope.pipChanged();
            };

            $scope.onChangeStartTime = function () {
                if (!$scope.data.startDate) {
                    $scope.data.startDate = pipDates.toStartDay(new Date());
                }
                validateStartDate();
                $scope.data.duration = setDuration();
                setDate();
                $scope.pipChanged();
            };

            $scope.onChangeEndTime = function () {
                if (!$scope.data.endDate) {
                    $scope.data.endDate = pipDates.toStartDay(new Date());
                }

                validateEndDate();
                $scope.data.duration = setDuration();
                setDate();
                $scope.pipChanged();
            };

            $scope.isDisabled = function () {
                if ($scope.disabled) {
                    return $scope.disabled();
                }

                return false;
            };

            $scope.$watchGroup([$scope.pipStartDate, $scope.pipEndDate], function () {
                if ($scope.data.bind) {
                    initDate();
                    defineDate();
                }
            });

            $scope.$watch($scope.disabled, function (newValue) {
                $scope.disableControls = newValue;
            });

            // Add class
            $element.addClass('pip-time-range-edit');
        }]
    );

})(window.angular, window._);

/**
 * @file Date utilities
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipDatesUtils', []);

    // Todo: Use moment functions instead
    thisModule.factory('pipDates', function () {
        var dates = {};

        dates.addHours = function (date, hours) {
            date = _.isDate(date) ? date : new Date(date);
            var time = date.getTime() + hours * 3600000;
            return new Date(time);
        };

        dates.toStartDay = function (date) {
            date = _.isDate(date) ? date : new Date(date);
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        };

        dates.toEndDay = function (date, offset) {
            date = _.isDate(date) ? date : new Date(date);
            offset = offset != null ? offset : 0;
            var start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return new Date(start.getTime() + 24 * 3600000 + offset);
        };

        dates.toStartWeek = function (date) {
            date = _.isDate(date) ? date : new Date(date);
            var dayOfWeek = date.getDay() ? date.getDay() : 7;
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return new Date(date.getTime() - (dayOfWeek - 1) * 24 * 3600000);  // dayOfWeek = 0 для воскресенья
        };

        dates.toEndWeek = function (date, offset) {
            date = _.isDate(date) ? date : new Date(date);
            offset = offset != null ? offset : 0;
            var dayOfWeek = date.getDay() ? date.getDay() : 7;
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return new Date(date.getTime() + (8 - dayOfWeek) * 24 * 3600000 + offset);
        };

        dates.toStartMonth = function (date) {
            date = _.isDate(date) ? date : new Date(date);
            return new Date(date.getFullYear(), date.getMonth(), 1);
        };

        dates.toEndMonth = function (date, offset) {
            date = _.isDate(date) ? date : new Date(date);

            var
                month = date.getMonth() + 1,
                year = date.getFullYear();

            if (month > 11) {
                year++;
                month = 0;
            }

            date = new Date(year, month, 1);

            if (offset != null) {
                date = new Date(date.getTime() + offset);
            }

            return date;
        };

        dates.toStartYear = function (date) {
            date = _.isDate(date) ? date : new Date(date);
            return new Date(date.getFullYear(), 0, 1);
        };

        dates.toEndYear = function (date, offset) {
            date = _.isDate(date) ? date : new Date(date);
            date = new Date(date.getFullYear() + 1, 0, 1);

            if (offset != null) {
                date = new Date(date.getTime() + offset);
            }

            return date;
        };

        /** UTC functions  - **/
        dates.toUTCDate = function (year, month, day) {
            return new Date(Date.UTC(year, month, day));
        };

        dates.toUTCDate = function (date) {
            return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        };

        dates.fromUTCDate = function (date) {
            if (date == null) date = new Date();
            return new Date(
                date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
        };

        dates.toUTCStartWeek = function (date) {
            if(!_.isDate(date)) {
                date = new Date(date);
                date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            }
            var dayOfWeek = date.getDay() ? date.getDay() : 7;
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            date = dayOfWeek != 1 ? new Date(date.getTime() - (dayOfWeek - 1) * 24 * 3600000) : date;
            return  new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        };

        dates.toUTCEndWeek = function (date, offset) {
            if(!_.isDate(date)) {
                date = new Date(date);
                date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            }
            offset = offset != null ? offset : 0;
            var dayOfWeek = date.getDay() ? date.getDay() : 7;
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            date = new Date(date.getTime() + (8 - dayOfWeek) * 24 * 3600000 + offset);
            return  new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        };

        return dates;
    });
})();



/**
 * @file Registration of dialogs
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function (angular) {
    'use strict';

    angular.module('pipDialogs', [
        'pipInformationDialog',
        'pipConfirmationDialog',
        'pipOptionsDialog',
        'pipOptionsBigDialog',
        'pipErrorDetailsDialog'
    ]);

})(window.angular);


(function(module) {
try {
  module = angular.module('pipDialogs.Templates');
} catch (e) {
  module = angular.module('pipDialogs.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('confirmation/confirmation.html',
    '<!--\n' +
    '@file Confirmation dialog template\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-dialog pip-confirmation-dialog layout-column" width="400" md-theme="{{::theme}}">\n' +
    '    <div class="pip-header">\n' +
    '        <h3>{{:: title}}</h3>\n' +
    '    </div>\n' +
    '    <div class="pip-footer">\n' +
    '        <div>\n' +
    '            <md-button ng-click="onCancel()">{{:: cancel}}</md-button>\n' +
    '            <md-button class="md-accent" ng-click="onOk()">{{:: ok}}</md-button>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</md-dialog>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDialogs.Templates');
} catch (e) {
  module = angular.module('pipDialogs.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('error_details/error_details.html',
    '<!--\n' +
    '@file Confirmation dialog template\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-dialog pip-error-details-dialog layout-column" width="400" md-theme="{{theme}}">\n' +
    '    <div class="pip-body">\n' +
    '        <div class="pip-header">\n' +
    '            <h3>{{::errorDetails | translate}}</h3>\n' +
    '        </div>\n' +
    '        <div class="layout-row layout-align-start-center error-section text-body2 color-secondary-text"\n' +
    '             ng-if="error.code || (error.data && error.data.code)">\n' +
    '            {{::errorCode | translate}}\n' +
    '        </div>\n' +
    '        <div class="layout-row layout-align-start-center text-subhead1" ng-if="error.code || (error.data && error.data.code)">\n' +
    '            {{error.code || error.data.code}}\n' +
    '        </div>\n' +
    '\n' +
    '        <div class="layout-row layout-align-start-center error-section text-body2 color-secondary-text"\n' +
    '             ng-if="error.path || (error.data && error.data.path)">\n' +
    '            {{::errorPath | translate}}\n' +
    '        </div>\n' +
    '        <div class="layout-row layout-align-start-center text-subhead1" ng-if="error.path || (error.data && error.data.path)">\n' +
    '            {{error.path || error.data.path}}\n' +
    '        </div>\n' +
    '\n' +
    '        <div class="error-section text-body2 color-secondary-text layout-row layout-align-start-center"\n' +
    '             ng-if="error.error || (error.data && error.data.error)">\n' +
    '            {{::errorText | translate}}\n' +
    '        </div>\n' +
    '        <div class="layout-row layout-align-start-center text-subhead1" ng-if="error.error || (error.data && error.data.error)">\n' +
    '            {{error.error || error.data.error}}\n' +
    '        </div>\n' +
    '\n' +
    '        <div class="error-section text-body2 color-secondary-text layout-row layout-align-start-center"\n' +
    '             ng-if="error.method || (error.data && error.data.method)">\n' +
    '            {{::errorMethod | translate}}\n' +
    '        </div>\n' +
    '        <div class="layout-row layout-align-start-center text-subhead1" ng-if="error.method || (error.data && error.data.method)">\n' +
    '            {{error.method || error.data.method}}\n' +
    '        </div>\n' +
    '\n' +
    '        <div class="error-section text-body2 color-secondary-text layout-row layout-align-start-center"\n' +
    '             ng-if="error.message || (error.data && error.data.message)">\n' +
    '            {{::errorMessage | translate}}\n' +
    '        </div>\n' +
    '        <div class="layout-row layout-align-start-center text-subhead1"\n' +
    '             ng-if="error.message || (error.data && error.data.message)">\n' +
    '            {{error.message || error.data.message}}\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="pip-footer">\n' +
    '        <div>\n' +
    '            <md-button class="md-accent m0" ng-click="onOk()">{{::dismissButton | translate}}</md-button>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</md-dialog>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDialogs.Templates');
} catch (e) {
  module = angular.module('pipDialogs.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('information/information.html',
    '<!--\n' +
    '@file Information dialog content\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-dialog pip-information-dialog layout-column"\n' +
    '           width="400" md-theme="{{theme}}">\n' +
    '    <div class="pip-header">\n' +
    '        <h3 >{{ title | translate }}</h3>\n' +
    '    </div>\n' +
    '    <div class="pip-body">\n' +
    '        <div class="pip-content">\n' +
    '            {{ content }}\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="pip-footer">\n' +
    '        <div>\n' +
    '            <md-button class="md-accent" ng-click="onOk()">{{ ok | translate }}</md-button>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</md-dialog>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDialogs.Templates');
} catch (e) {
  module = angular.module('pipDialogs.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('options/options.html',
    '<!--\n' +
    '@file Options dialog content\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-dialog pip-options-dialog layout-column"\n' +
    '           min-width="400" md-theme="{{theme}}">\n' +
    '    <md-dialog-content class="pip-body lp0 tp0 rp0 bp24 pip-scroll">\n' +
    '        <div class="pip-header" >\n' +
    '            <h3>{{::title | translate}}</h3>\n' +
    '            <div ng-show="deletedTitle" class="header-option text-subhead1 divider-bottom">\n' +
    '                <md-checkbox ng-model="deleted" aria-label="CHECKBOX">{{::deletedTitle | translate}}</md-checkbox>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="pip-content">\n' +
    '            <md-radio-group ng-model="selectedOptionName" class="pip-list md-primary" md-no-ink="true"\n' +
    '                            ng-keypress="onKeyPress($event)" tabindex="0">\n' +
    '                <div ng-repeat="option in options" class="pip-list-item" md-ink-ripple\n' +
    '                     ui-event="{ click: \'onOptionSelect($event, option)\' }"\n' +
    '                     ng-class="{ selected: option.name == selectedOptionName }">\n' +
    '                    <div class="pip-list-item item-padding">\n' +
    '                        <md-icon class="pip-option-icon" md-svg-icon="icons:{{option.icon}}" ng-if="option.icon">\n' +
    '                        </md-icon>\n' +
    '                        <div class="pip-option-title">\n' +
    '                            {{::option.title | translate}}\n' +
    '                        </div>\n' +
    '                        <md-radio-button ng-value="option.name" tabindex="-1"\n' +
    '                                         aria-label="{{::option.title | translate}}">\n' +
    '                        </md-radio-button>\n' +
    '                    </div>\n' +
    '\n' +
    '                </div>\n' +
    '            </md-radio-group>\n' +
    '        </div>\n' +
    '    </md-dialog-content>\n' +
    '    <div class="pip-footer">\n' +
    '        <div>\n' +
    '            <md-button class="pip-cancel" ng-click="onCancel()">{{::\'CANCEL\' | translate}}</md-button>\n' +
    '            <md-button class="pip-submit md-accent" ng-click="onSelect()">{{::applyButtonTitle | translate}}</md-button>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</md-dialog>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDialogs.Templates');
} catch (e) {
  module = angular.module('pipDialogs.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('options/options_big.html',
    '<!--\n' +
    '@file Options dialog content\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-dialog pip-options-dialog-big layout-column"\n' +
    '           min-width="400" md-theme="{{theme}}">\n' +
    '    <md-dialog-content class="pip-body pip-scroll" ng-class="{\'bp24\': !noActions}">\n' +
    '        <div class="pip-header" ng-class="{\'header-hint\': noTitle && hint}">\n' +
    '            <h3 class="m0" ng-if="!noTitle">\n' +
    '                {{::title | translate}}\n' +
    '            </h3>\n' +
    '            <div ng-show="noTitle && hint" class="dialog-hint layout-row layout-align-start-center">\n' +
    '                <div class="hint-icon-container flex-fixed" >\n' +
    '                    <md-icon md-svg-icon="icons:info-circle-outline"></md-icon>\n' +
    '                </div>\n' +
    '                <div>{{::hint | translate}}</div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="content-divider" ng-if="!noTitle"></div>\n' +
    '        <div class="pip-content">\n' +
    '            <div class="spacer8" ng-if="noTitle && hint"></div>\n' +
    '            <md-list class="pip-menu  pip-ref-list"\n' +
    '                     pip-selected="optionIndex" index="{{optionIndex }}"\n' +
    '                     pip-select="onSelected($event)">\n' +
    '\n' +
    '                <md-list-item class="pip-ref-list-item pip-selectable layout-row layout-align-start-center"\n' +
    '                              ng-class="{\'selected md-focused\' : option.name == selectedOptionName,\n' +
    '                              \'divider-bottom\': $index != options.length - 1}"\n' +
    '                              md-ink-ripple\n' +
    '                              ng-keyup="onKeyUp($event, $index)"\n' +
    '                              ng-repeat="option in options" >\n' +
    '\n' +
    '                    <div class="pip-content  content-stretch" ng-click="onOptionSelect($event, option)">\n' +
    '                        <p class="pip-title spacer-right" ng-if="option.title" style="margin-bottom: 4px !important;">\n' +
    '                            {{::option.title | translate}}\n' +
    '                        </p>\n' +
    '                        <div class="pip-subtitle spacer-right"\n' +
    '                             style="height: inherit"\n' +
    '                             ng-if="option.subtitle">\n' +
    '                            {{::option.subtitle | translate}}\n' +
    '                        </div>\n' +
    '                        <div class="pip-subtitle spacer-right"\n' +
    '                             style="height: inherit" ng-if="option.text"\n' +
    '                             ng-bind-html="option.text | translate">\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '\n' +
    '                </md-list-item>\n' +
    '\n' +
    '            </md-list>\n' +
    '        </div>\n' +
    '        <div class="spacer8" ng-if="noActions"></div>\n' +
    '    </md-dialog-content>\n' +
    '\n' +
    '    <div class="pip-footer" ng-if="!noActions">\n' +
    '        <div>\n' +
    '            <md-button class="pip-cancel" ng-click="onCancel()">{{::\'CANCEL\' | translate}}</md-button>\n' +
    '            <md-button class="pip-submit md-accent" ng-click="onSelect()" style="margin-right: -6px">\n' +
    '                {{::applyButtonTitle | translate}}\n' +
    '            </md-button>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</md-dialog>\n' +
    '');
}]);
})();

/**
 * @file Confirmation dialog
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipConfirmationDialog',
        ['ngMaterial', 'pipDialogs.Translate', 'pipDialogs.Templates']);

    thisModule.factory('pipConfirmationDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'confirmation/confirmation.html',
                        controller: 'pipConfirmationDialogController',
                        locals: { params: params },
                        clickOutsideToClose: true
                    })
                    .then(function () {
                        if (successCallback) {
                            successCallback();
                        }
                    }, function () {
                        if (cancelCallback) {
                            cancelCallback();
                        }
                    });
                }
            };
        }]
    );

    thisModule.controller('pipConfirmationDialogController',
        ['$scope', '$rootScope', '$mdDialog', '$injector', 'params', function ($scope, $rootScope, $mdDialog, $injector, params) {
            var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;

            if (pipTranslate) {
                pipTranslate.translations('en', {
                    'CONFIRM_TITLE': 'Confirm'
                });
                pipTranslate.translations('ru', {
                    'CONFIRM_TITLE': 'Подтвердите'
                });

                $scope.title = params.title || 'CONFIRM_TITLE';
                $scope.ok = params.ok || 'OK';
                $scope.cancel = params.cancel || 'CANCEL';
            } else {
                $scope.title = params.title || 'Confirm';
                $scope.ok = params.ok || 'OK';
                $scope.cancel = params.cancel || 'Cancel';
            }

            $scope.theme = $rootScope.$theme;

            $scope.onCancel = function () {
                $mdDialog.cancel();
            };

            $scope.onOk = function () {
                $mdDialog.hide();
            };
        }]
    );

})(window.angular);

/**
 * @file Optional filter to translate string resources
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipDialogs.Translate', []);

    thisModule.filter('translate', ['$injector', function ($injector) {
        var pipTranslate = $injector.has('pipTranslate') 
            ? $injector.get('pipTranslate') : null;

        return function (key) {
            return pipTranslate  ? pipTranslate.translate(key) || key : key;
        }
    }]);

})();

/**
 * @file Error details dialog
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve sample in sampler app
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipErrorDetailsDialog',
        ['ngMaterial', 'pipDialogs.Translate', 'pipDialogs.Templates']);

    thisModule.factory('pipErrorDetailsDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'error_details/error_details.html',
                        controller: 'pipErrorDetailsDialogController',
                        locals: {params: params},
                        clickOutsideToClose: true
                    })
                        .then(function () {
                            if (successCallback) {
                                successCallback();
                            }
                        }, function () {
                            if (cancelCallback) {
                                cancelCallback();
                            }
                        });
                }
            };
        }]
    );

    thisModule.controller('pipErrorDetailsDialogController',
        ['$scope', '$rootScope', '$mdDialog', '$injector', 'params', function ($scope, $rootScope, $mdDialog, $injector, params) {
            
            var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
            
            if (pipTranslate) {
                pipTranslate.translations('en', {
                    'ERROR_DETAILS': 'Error details',
                    'CODE': 'Error code',
                    'PATH': 'Path',
                    'ERROR': 'Error',
                    'METHOD': 'Method',
                    'MESSAGE': 'Message',
                    'DISMISS': 'Dismiss'
                });
                pipTranslate.translations('ru', {
                    'ERROR_DETAILS': 'Детали ошибки',
                    'CODE': 'Код ошибки',
                    'PATH': 'Путь',
                    'ERROR': 'Ошибка',
                    'METHOD': 'Метод',
                    'MESSAGE': 'Сообщение'
                });
                $scope.ok = params.ok || 'OK';
                $scope.cancel = params.cancel || 'CANCEL';
                $scope.errorDetails = 'ERROR_DETAILS';
                $scope.dismissButton = 'DISMISS';
                $scope.errorMessage = 'MESSAGE';
                $scope.errorCode = 'CODE';
                $scope.errorMethod = 'METHOD';
                $scope.errorPath = 'PATH';
                $scope.errorText = 'ERROR';                
            } else {
                $scope.ok = params.ok || 'OK';
                $scope.cancel = params.cancel || 'Cancel';
                $scope.errorDetails = 'Error details';
                $scope.dismissButton = 'Dismiss';
                $scope.errorMessage = 'Message';
                $scope.errorCode = 'Code';
                $scope.errorMethod = 'Method';
                $scope.errorPath = 'Path';
                $scope.error = 'Error';
            }

            $scope.theme = $rootScope.$theme
            $scope.error = params.error;

            $scope.onCancel = function () {
                $mdDialog.cancel();
            };

            $scope.onOk = function () {
                $mdDialog.hide();
            };
        }]
    );

})(window.angular);

/**
 * @file Information dialog
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve sample in sampler app
 */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipInformationDialog',
        ['ngMaterial', 'pipDialogs.Translate', 'pipDialogs.Templates']);

    thisModule.factory('pipInformationDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (params, callback) {
                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'information/information.html',
                        controller: 'pipInformationDialogController',
                        locals: {params: params},
                        clickOutsideToClose: true
                    })
                        .then(function () {
                            if (callback) {
                                callback();
                            }
                        });
                }
            };
        }]
    );

    thisModule.controller('pipInformationDialogController',
        ['$scope', '$rootScope', '$mdDialog', '$injector', 'params', function ($scope, $rootScope, $mdDialog, $injector, params) {
            var content = params.message, item;

            var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
            if (pipTranslate) {
                pipTranslate.translations('en', {
                    'INFORMATION_TITLE': 'Information'
                });
                pipTranslate.translations('ru', {
                    'INFORMATION_TITLE': 'Информация'
                });

                $scope.title = params.title || 'INFORMATION_TITLE';
                $scope.ok = params.ok || 'OK';
                content = pipTranslate.translate(content);
            } else {
                $scope.title = params.title || 'Information';
                $scope.ok = params.ok || 'OK';
            }

            var pipFormat = $injector.has('pipFormat') ? $injector.get('pipFormat') : null;

            $scope.theme = $rootScope.$theme;
            if (params.item && pipFormat) {
                item = _.truncate(params.item, 25);
                content = pipFormat.sprintf(content, item);
                console.log('content2', content);
            }
            $scope.content = content;

            $scope.onOk = function () {
                $mdDialog.hide();
            };
        }]
    );

})(window.angular, window._);

/**
 * @file Options dialog
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve sample in sampler app
 * - Remove deleted hack in the controller
 */

(function (angular, $, _) {
    'use strict';

    var thisModule = angular.module('pipOptionsDialog',
        ['ngMaterial', 'pipDialogs.Translate', 'pipDialogs.Templates']);

    thisModule.factory('pipOptionsDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    if (params.event) {
                        params.event.stopPropagation();
                        params.event.preventDefault();
                    }

                    function focusToggleControl() {
                        if (params.event && params.event.currentTarget) {
                            params.event.currentTarget.focus();
                        }
                    }

                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'options/options.html',
                        controller: 'pipOptionsDialogController',
                        locals: {params: params},
                        clickOutsideToClose: true
                    })
                    .then(function (option) {
                        focusToggleControl();

                        if (successCallback) {
                            successCallback(option);
                        }
                    }, function () {
                        focusToggleControl();
                        if (cancelCallback) {
                            cancelCallback();
                        }
                    });
                }
            };
        }]
    );
    thisModule.controller('pipOptionsDialogController',
        ['$scope', '$rootScope', '$mdDialog', '$injector', 'params', function ($scope, $rootScope, $mdDialog, $injector, params) {
            var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
            if (pipTranslate) {
                pipTranslate.translations('en', {
                    'OPTIONS_TITLE': 'Choose Option'
                });
                pipTranslate.translations('ru', {
                    'OPTIONS_TITLE': 'Выберите опцию'
                });

                $scope.title = params.title || 'OPTIONS_TITLE';
                $scope.applyButtonTitle = params.appleButtonTitle || 'SELECT';
            } else {
                $scope.title = params.title || 'Choose Option';
                $scope.applyButtonTitle = params.appleButtonTitle || 'Select';
            }

            $scope.theme = $rootScope.$theme;
            $scope.options = params.options;
            $scope.selectedOption = _.find(params.options, {active: true}) || {};
            $scope.selectedOptionName = $scope.selectedOption.name;
            $scope.deleted = params.deleted;
            $scope.deletedTitle = params.deletedTitle;
            $scope.onOptionSelect = function (event, option) {
                event.stopPropagation();
                $scope.selectedOptionName = option.name;
            };
            
            $scope.onKeyPress = function (event) {
                if (event.keyCode === 32 || event.keyCode === 13) {
                    event.stopPropagation();
                    event.preventDefault();
                    $scope.onSelect();
                }
            };

            $scope.onCancel = function () {
                $mdDialog.cancel();
            };

            $scope.onSelect = function () {
                var option;

                option = _.find(params.options, {name: $scope.selectedOptionName});
                $mdDialog.hide({option: option, deleted: $scope.deleted});
            };

            // Setting focus to input control
            function focusInput() {
                var list;

                list = $('.pip-options-dialog .pip-list');
                list.focus();
            }

            setTimeout(focusInput, 500);
        }]
    );

})(window.angular, window.jQuery, window._);

/**
 * @file Options dialog
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve sample in sampler app
 * - Remove deleted hack in the controller
 */

(function (angular, $, _) {
    'use strict';

    var thisModule = angular.module('pipOptionsBigDialog',
        ['ngMaterial', 'pipDialogs.Translate', 'pipDialogs.Templates']);

    thisModule.factory('pipOptionsBigDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    if (params.event) {
                        params.event.stopPropagation();
                        params.event.preventDefault();
                    }

                    function focusToggleControl() {
                        if (params.event && params.event.currentTarget) {
                            params.event.currentTarget.focus();
                        }
                    }

                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'options/options_big.html',
                        controller: 'pipOptionsDialogBigController',
                        locals: {params: params},
                        clickOutsideToClose: true
                    })
                    .then(function (option) {
                        focusToggleControl();

                        if (successCallback) {
                            successCallback(option);
                        }
                    }, function () {
                        focusToggleControl();
                        if (cancelCallback) {
                            cancelCallback();
                        }
                    });
                }
            };
        }]
    );

    thisModule.controller('pipOptionsDialogBigController',
        ['$scope', '$rootScope', '$mdDialog', '$injector', 'params', function ($scope, $rootScope, $mdDialog, $injector, params) {
            var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
            if (pipTranslate) {
                pipTranslate.translations('en', {
                    'OPTIONS_TITLE': 'Choose Option'
                });
                pipTranslate.translations('ru', {
                    'OPTIONS_TITLE': 'Выберите опцию'
                });

                $scope.title = params.title || 'OPTIONS_TITLE';
                $scope.applyButtonTitle = params.applyButtonTitle || 'SELECT';
            } else {
                $scope.title = params.title || 'Choose Option';
                $scope.applyButtonTitle = params.applyButtonTitle || 'Select';
            }

            $scope.theme = $rootScope.$theme;
            $scope.options = params.options;
            $scope.noActions = params.noActions || false;
            $scope.noTitle = params.noTitle || false;
            $scope.hint = params.hint || '';
            $scope.selectedOption = _.find(params.options, {active: true}) || {};
            $scope.selectedOptionName = $scope.selectedOption.name;
            $scope.optionIndex = _.findIndex(params.options, $scope.selectedOption);

            $scope.deleted = params.deleted;
            $scope.deletedTitle = params.deletedTitle;

            $scope.onOptionSelect = function (event, option) {
                event.stopPropagation();
                $scope.selectedOptionName = option.name;

                if ($scope.noActions) {
                    $scope.onSelect();
                }
            };

            $scope.onSelected = function () {
                $scope.selectedOptionName = $scope.options[$scope.optionIndex].name;

                if ($scope.noActions) {
                    // $scope.onSelect();
                }
            };

            $scope.onKeyUp = function (event, index) {
                if (event.keyCode === 32 || event.keyCode === 13) {
                    event.stopPropagation();
                    event.preventDefault();
                    if (index !== undefined && index > -1 && index < $scope.options.length) {
                        $scope.selectedOptionName = $scope.options[index].name;
                        $scope.onSelect();
                    }
                }
            };
            $scope.onCancel = function () {
                $mdDialog.cancel();
            };
            $scope.onSelect = function () {
                var option;

                option = _.find($scope.options, {name: $scope.selectedOptionName});
                $mdDialog.hide({option: option, deleted: $scope.deleted});
            };
            // Setting focus to input control
            function focusInput() {
                var list;

                list = $('.pip-options-dialog .pip-list');
                list.focus();
            }

            setTimeout(focusInput, 500);
        }]
    );

})(window.angular, window.jQuery, window._);



(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('actions/primary_actions.html',
    '<md-menu md-position-mode="target-right target" class="pip-primary-actions" ng-repeat="action in config.primaryLocalActions">\n' +
    '    <md-button class="pip-primary-actions-action md-icon-button"\n' +
    '                ng-class="{ \'pip-primary-actions-hide-sm\': action.hideSmall,\n' +
    '                            \'pip-primary-actions-show-sm\': action.showSmall }"\n' +
    '                ng-click="onActionClick(action, $mdOpenMenu);"\n' +
    '                ng-hide="actionHidden(action)"\n' +
    '                aria-label="{{action.tooltip | translate}}">\n' +
    '        <!--<md-tooltip ng-if="action.tooltip">{{action.tooltip | translate}}</md-tooltip>-->\n' +
    '        <div class="pip-primary-actions-badge" ng-show="action.count > 0">\n' +
    '            {{actionCount(action)}}\n' +
    '        </div>\n' +
    '        <md-icon md-svg-icon="{{action.icon}}"></md-icon>\n' +
    '    </md-button>\n' +
    '    <md-menu-content width="3" >\n' +
    '        <md-menu-item ng-repeat-start="subAction in action.subActions"\n' +
    '                        ng-if="!subAction.divider"\n' +
    '                        ng-hide="actionHidden(subAction)">\n' +
    '            <md-button ng-hide="subAction.divider"\n' +
    '                        ng-click="onActionClick(subAction)">\n' +
    '                {{subAction.title | translate}}\n' +
    '            </md-button>\n' +
    '        </md-menu-item>\n' +
    '        <md-menu-divider ng-if="subAction.divider" ng-repeat-end></md-menu-divider>\n' +
    '    </md-menu-content>\n' +
    '</md-menu>\n' +
    '\n' +
    '<md-menu md-position-mode="target-right target" class="pip-primary-actions" ng-repeat="action in config.primaryGlobalActions">\n' +
    '    <md-button class="pip-primary-actions-action md-icon-button"\n' +
    '               ng-class="{ \'pip-primary-actions-hide-sm\': action.hideSmall,\n' +
    '                            \'pip-primary-actions-show-sm\': action.showSmall }"\n' +
    '               ng-click="onActionClick(action, $mdOpenMenu);"\n' +
    '               ng-hide="actionHidden(action)"\n' +
    '               aria-label="{{action.tooltip | translate}}">\n' +
    '        <!--<md-tooltip ng-if="action.tooltip">{{action.tooltip | translate}}</md-tooltip>-->\n' +
    '        <div class="pip-primary-actions-badge" ng-show="action.count > 0">\n' +
    '            {{actionCount(action)}}\n' +
    '        </div>\n' +
    '        <md-icon md-svg-icon="{{action.icon}}"></md-icon>\n' +
    '    </md-button>\n' +
    '    <md-menu-content width="3" >\n' +
    '        <md-menu-item ng-repeat-start="subAction in action.subActions"\n' +
    '                      ng-if="!subAction.divider"\n' +
    '                      ng-hide="actionHidden(subAction)">\n' +
    '            <md-button ng-hide="subAction.divider"\n' +
    '                       ng-click="onActionClick(subAction)">\n' +
    '                {{subAction.title | translate}}\n' +
    '            </md-button>\n' +
    '        </md-menu-item>\n' +
    '        <md-menu-divider ng-if="subAction.divider" ng-repeat-end></md-menu-divider>\n' +
    '    </md-menu-content>\n' +
    '</md-menu>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('actions/secondary_actions.html',
    '<md-menu ng-if="secondaryActionsVisible()"\n' +
    '    md-position-mode="target-right target">\n' +
    '    <md-button class="md-icon-button"\n' +
    '        ng-click="onSecondaryActionClick(); openMenu($mdOpenMenu, $event);"\n' +
    '        aria-label="open actions">\n' +
    '        <md-icon md-svg-icon="icons:vdots"></md-icon>\n' +
    '    </md-button>\n' +
    '    <md-menu-content width="3">\n' +
    '        <!-- Local secondary actions -->\n' +
    '        <md-menu-item ng-repeat-start="action in config.secondaryLocalActions"\n' +
    '            ng-if="!action.divider"\n' +
    '            ng-hide="actionHidden(action)">\n' +
    '            <md-button ng-hide="action.divider"\n' +
    '                ng-click="onActionClick(action)">\n' +
    '                {{action.title | translate}}\n' +
    '            </md-button>\n' +
    '        </md-menu-item>\n' +
    '        <md-menu-divider ng-if="action.divider" ng-repeat-end></md-menu-divider>\n' +
    '\n' +
    '        <md-menu-divider ng-if="secondaryDividerVisible()" >\n' +
    '\n' +
    '        </md-menu-divider>\n' +
    '        <!-- Global secondary actions -->\n' +
    '        <md-menu-item ng-repeat-start="action in config.secondaryGlobalActions"\n' +
    '            ng-if="!action.divider"\n' +
    '            ng-hide="actionHidden(action)">\n' +
    '            <md-button ng-hide="action.divider"\n' +
    '                ng-click="onActionClick(action)">\n' +
    '                {{action.title | translate}}\n' +
    '            </md-button>                    \n' +
    '        </md-menu-item>\n' +
    '        <md-menu-divider ng-if="action.divider" ng-repeat-end>\n' +
    '        </md-menu-divider>                        \n' +
    '    </md-menu-content>\n' +
    '</md-menu>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('appbar/appbar.html',
    '<!--\n' +
    '@file App Bar component\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-toolbar md-theme-watch="true" ng-if="!$partialReset" ng-class="config.ngClasses"\n' +
    '            class="{{ config.cssClass }}" ng-transclude>\n' +
    '</md-toolbar>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('breadcrumb/breadcrumb.html',
    '<div>\n' +
    '    <div class="hide-xs text-overflow">\n' +
    '        <!-- Search criteria -->\n' +
    '        <span ng-if="vm.config.criteria"\n' +
    '            ng-click="vm.onSearchOpen()">{{vm.config.criteria}} -</span>\n' +
    '        <!-- Breadcrumb navigation -->\n' +
    '        <span class="pip-breadcrumb-item"\n' +
    '            ng-repeat-start="item in vm.config.items"\n' +
    '            ng-click="vm.onBreadcrumbClick(item)"\n' +
    '            ng-init="stepWidth = 100/(vm.config.items.length + 1)"\n' +
    '            ng-style="{\'max-width\': stepWidth + \'%\'}">\n' +
    '            {{item.title | translate}}\n' +
    '        </span>\n' +
    '        <md-icon ng-repeat-end md-svg-icon="icons:chevron-right"></md-icon>\n' +
    '        <!-- Text title -->\n' +
    '        <span class="pip-title">{{vm.config.text | translate}}</span>\n' +
    '    </div>\n' +
    '\n' +
    '    <!-- Mobile breadcrumb dropdown -->\n' +
    '    <md-menu xmd-offset="0 48" class="hide-gt-xs">\n' +
    '        <span class="pip-mobile-breadcrumb layout-row"\n' +
    '            ng-click="$mdOpenMenu()"\n' +
    '            md-ink-ripple\n' +
    '            aria-label="open breadcrumb">\n' +
    '            <span class="text-overflow">\n' +
    '                <!-- Search criteria -->\n' +
    '                <span ng-if="vm.config.criteria"\n' +
    '                    ng-click="vm.onSearchOpen()">{{vm.config.criteria}} -</span>\n' +
    '                {{vm.config.text | translate}}\n' +
    '            </span>\n' +
    '            <md-icon class="pip-triangle-down" md-svg-icon="icons:triangle-down"></md-icon>\n' +
    '        </span>\n' +
    '        <md-menu-content width="3">\n' +
    '            <md-menu-item  ng-repeat="item in vm.config.items" >\n' +
    '                <md-button ng-click="vm.onBreadcrumbClick(item)"><span>{{item.title | translate}}</span></md-button>\n' +
    '            </md-menu-item>\n' +
    '            <md-menu-item  >\n' +
    '                <md-button><span class="text-grey">{{vm.config.text | translate}}</span></md-button>\n' +
    '            </md-menu-item>\n' +
    '        </md-menu-content>\n' +
    '    </md-menu>\n' +
    '\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('dropdown/dropdown.html',
    '<md-toolbar class="md-subhead color-primary-bg {{class}}" ng-if="show()" ng-class="{\'md-whiteframe-3dp\': $mdMedia(\'xs\')}">\n' +
    '    <div class="pip-divider"></div>\n' +
    '        <md-select ng-model="selectedIndex" ng-disabled="disabled()" md-container-class="pip-full-width-dropdown" aria-label="DROPDOWN" md-ink-ripple md-on-close="onSelect(selectedIndex)">\n' +
    '            <md-option ng-repeat="action in actions" value="{{ ::$index }}" ng-selected="activeIndex == $index ? true : false">\n' +
    '                {{ (action.title || action.name) | translate }}\n' +
    '            </md-option>\n' +
    '        </md-select>\n' +
    '</md-toolbar>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('language_picker/language_picker.html',
    '<md-menu md-position-mode="target-right target">\n' +
    '    <span class="pip-language"\n' +
    '        ng-click="$mdOpenMenu()"\n' +
    '        aria-label="language selection">\n' +
    '        {{language() | translate}}\n' +
    '        <md-icon md-svg-icon="icons:triangle-down"></md-icon>\n' +
    '    </span>\n' +
    '    <md-menu-content width="3">\n' +
    '        <md-menu-item ng-repeat="lang in languages">\n' +
    '            <md-button ng-click="onLanguageClick(lang)">{{lang | translate}}</md-button>\n' +
    '        </md-menu-item>\n' +
    '    </md-menu-content>\n' +
    '</md-menu>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('nav_header/nav_header.html',
    '<md-toolbar md-theme="{{ $theme }}" ng-hide="!user">\n' +
    '\n' +
    '    <md-button class="pip-nav-header-user md-icon-button"\n' +
    '                ng-click="onUserClick()"\n' +
    '                aria-label="current user">\n' +
    '        <!--<pip-avatar ng-if="!$avatarReset"\n' +
    '                    pip-default-icon="icon-person"\n' +
    '                    pip-party-name="getParty(\'name\')"\n' +
    '                    pip-image-url="primaryPartyAvatar"\n' +
    '                    pip-rebind-avatar="true"\n' +
    '                    pip-rebind="true">\n' +
    '        </pip-avatar>-->\n' +
    '    </md-button>\n' +
    '    \n' +
    '    <div class="pip-nav-header-user-text">\n' +
    '        <a class="pip-nav-header-user-pri cursor-pointer"\n' +
    '            ng-click="onUserClick()">{{ getUser(\'fullName\') }}</a>\n' +
    '        <div class="pip-nav-header-user-sec">\n' +
    '            {{ getUser(\'details\') | translate }}\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '</md-toolbar>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('nav_icon/nav_icon.html',
    '<md-button class="md-icon-button pip-nav-icon"\n' +
    '            ng-if="config.type != \'none\'"\n' +
    '            ng-class="config.class"\n' +
    '            ng-click="onNavIconClick()"\n' +
    '            aria-label="menu">\n' +
    '    <!-- Menu icon -->\n' +
    '    <md-icon ng-if="config.type==\'menu\'"\n' +
    '        md-svg-icon="icons:menu"></md-icon>\n' +
    '    <!-- Image -->\n' +
    '    <img ng-src="{{config.imageUrl}}" ng-if="config.type==\'image\'" height="24" width="24">\n' +
    '    <!--<pip-avatar ng-if="config.navIconType==\'menu\' && (getParty() && !getUser(\'owner\'))"\n' +
    '                pip-rebind-avatar="true"\n' +
    '                pip-rebind="true"\n' +
    '                pip-image-url="partyAvatarUrl"\n' +
    '                pip-party-id="getParty(\'id\')" class="pip-face"\n' +
    '                pip-party-name="getParty(\'name\')">\n' +
    '    </pip-avatar>-->\n' +
    '    <!-- Back icon -->\n' +
    '    <md-icon ng-if="config.type==\'back\'"\n' +
    '        md-svg-icon="icons:arrow-left"></md-icon>\n' +
    '    <!--Icon -->\n' +
    '    <md-icon ng-if="config.type==\'icon\'"\n' +
    '             md-svg-icon="icons:{{config.iconName}}"></md-icon>\n' +
    '</md-button>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('nav_menu/nav_menu.html',
    '<md-list>\n' +
    '    <div class="pip-section" ng-repeat="section in config"\n' +
    '        ng-hide="section.access && !section.access(section)">\n' +
    '        \n' +
    '        <md-divider ng-show="$index > 0 && !isSectionEmpty(section.links)"></md-divider>\n' +
    '        <md-subheader ng-show="section.title">{{::section.title | translate}}</md-subheader>\n' +
    '        \n' +
    '        <md-list-item class="pip-focusable no-border" \n' +
    '            ng-repeat="link in section.links"\n' +
    '            ng-click="onLinkClick($event, link)"\n' +
    '            ng-hide="link.access && !link.access(link)">\n' +
    '            <md-icon md-svg-icon="{{link.icon}}" \n' +
    '                ng-hide="!link.icon" \n' +
    '                class="tm0 bm0"></md-icon>\n' +
    '            <p>{{::link.title | translate}}</p>\n' +
    '        </md-list-item>\n' +
    '    </div>\n' +
    '</md-list>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('search_bar/search_bar.html',
    '<div class="md-toolbar-tools layout-row" ng-if="searchEnabled">\n' +
    '    <md-button class="md-icon-button" \n' +
    '        aria-label="start search" \n' +
    '        ng-click="onSearchClick()">\n' +
    '        <md-icon md-svg-icon="icons:search"></md-icon>\n' +
    '    </md-button>\n' +
    '    <input class="pip-search-text flex"\n' +
    '        type="search"\n' +
    '        ng-model="search.text" \n' +
    '        ng-keydown="onSearchKeyDown($event)" />\n' +
    '    <md-button class="md-icon-button" \n' +
    '        aria-label="clear search" \n' +
    '        ng-click="onSearchClear()">\n' +
    '        <md-icon md-svg-icon="icons:cross-circle"></md-icon>\n' +
    '    </md-button>\n' +
    '</div>\n' +
    '<div class="md-toolbar-tools layout-row layout-align-end-center"  ng-if="!searchEnabled">\n' +
    '    <md-button class="md-icon-button"\n' +
    '               aria-label="start search"\n' +
    '               ng-click="onSearchEnable()">\n' +
    '        <md-icon md-svg-icon="icons:search"></md-icon>\n' +
    '    </md-button>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('sidenav/sidenav.html',
    '<!--\n' +
    '@file Side Nav component\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-sidenav class="md-sidenav-left md-whiteframe-z2 pip-sidenav color-content-bg"\n' +
    '    md-component-id="pip-sidenav" ng-if="!$partialReset" pip-focused ng-transclude>\n' +
    '</md-sidenav>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('tabs/tabs.html',
    '<md-toolbar class="pip-nav {{ class }}" ng-class="{\'pip-visible\': show(), \'pip-shadow\': showShadow()}">\n' +
    '    <md-tabs ng-if="$mdMedia(\'gt-xs\')" md-selected="activeTab" ng-class="{\'disabled\': disabled()}"\n' +
    '             md-stretch-tabs="true" md-dynamic-height="true">\n' +
    '        <md-tab ng-repeat="tab in tabs track by $index" ng-disabled="tabDisabled($index)"\n' +
    '                md-on-select="onSelect($index)">\n' +
    '            <md-tab-label>\n' +
    '                {{::tab.nameLocal }}\n' +
    '                <div class="pip-tabs-badge color-badge-bg" ng-if="tab.newCounts > 0 && tab.newCounts <= 99">\n' +
    '                    {{::tab.newCounts }}\n' +
    '                </div>\n' +
    '                <div class="pip-tabs-badge color-badge-bg" ng-if="tab.newCounts > 99">!</div>\n' +
    '            </md-tab-label>\n' +
    '        </md-tab>\n' +
    '    </md-tabs>\n' +
    '    <div class="md-subhead pip-tabs-content color-primary-bg  " ng-if="$mdMedia(\'xs\')">\n' +
    '        <div class="pip-divider position-top m0"></div>\n' +
    '        <md-select ng-model="activeIndex" ng-disabled="disabled()"\n' +
    '                   md-container-class="pip-full-width-dropdown" aria-label="SELECT" md-ink-ripple\n' +
    '                   md-on-close="onSelect(activeIndex)">\n' +
    '            <md-option ng-repeat="tab in tabs track by $index" value="{{ ::$index }}">\n' +
    '                {{ ::tab.nameLocal }}\n' +
    '                <div class="pip-tabs-badge color-badge-bg" ng-if="tab.newCounts > 0 && tab.newCounts <= 99">\n' +
    '                    {{ ::tab.newCounts }}\n' +
    '                </div>\n' +
    '                <div class="pip-tabs-badge color-badge-bg" ng-if="tab.newCounts > 99">!</div>\n' +
    '            </md-option>\n' +
    '        </md-select>\n' +
    '    </div>\n' +
    '</md-toolbar>\n' +
    '');
}]);
})();

(function () {
    'use strict';
    angular.module('pipNav', [
        'pipDropdown',
        'pipTabs',
        'pipAppBar',
        'pipSideNav',
        'pipNavIcon',
        'pipNavMenu',
        'pipBreadcrumb',
        'pipPrimaryActions',
        'pipSecondaryActions'
    ]);
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipActions.Service', []);
    thisModule.provider('pipActions', function () {
        var config = {
            primaryGlobalActions: [],
            primaryLocalActions: [],
            secondaryGlobalActions: [],
            secondaryLocalActions: []
        };
        this.globalActions = globalActions;
        this.globalPrimaryActions = globalPrimaryActions;
        this.globalSecondaryActions = globalSecondaryActions;
        this.$get = ['$rootScope', function ($rootScope) {
            return {
                config: getConfig,
                show: showLocalActions,
                hide: hideLocalActions,
                count: updateActionCount,
            };
            function getConfig() {
                return config;
            }
            function hideLocalActions() {
                config.primaryLocalActions = [];
                config.secondaryLocalActions = [];
                sendConfigEvent();
            }
            function showLocalActions(primaryActions, secondaryActions) {
                config.primaryLocalActions = primaryActions || [];
                config.secondaryLocalActions = secondaryActions || [];
                sendConfigEvent();
            }
            function updateActionCount(actionName, count) {
                _.each(config.primaryGlobalActions, function (action) {
                    if (action.name === actionName) {
                        action.count = count;
                    }
                });
                _.each(config.primaryLocalActions, function (action) {
                    if (action.name === actionName) {
                        action.count = count;
                    }
                });
                sendConfigEvent();
            }
            function sendConfigEvent() {
                $rootScope.$broadcast('pipActionsChanged', config);
            }
        }];
        function globalActions(primaryActions, secondaryActions) {
            config.primaryGlobalActions = primaryActions || [];
            config.secondaryGlobalActions = secondaryActions || [];
        }
        function globalPrimaryActions(primaryActions) {
            config.primaryGlobalActions = primaryActions || [];
        }
        function globalSecondaryActions(secondaryActions) {
            config.secondaryGlobalActions = secondaryActions || [];
        }
    });
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipPrimaryActions', ['ngMaterial', 'pipNav.Translate', 'pipNav.Templates', 'pipActions.Service']);
    thisModule.directive('pipPrimaryActions', function () {
        return {
            restrict: 'E',
            scope: {
                localActions: '=pipLocalActions',
                globalActions: '=pipGlobalActions'
            },
            replace: false,
            templateUrl: function (element, attr) {
                return 'actions/primary_actions.html';
            },
            controller: 'pipPrimaryActionsController'
        };
    });
    thisModule.controller('pipPrimaryActionsController', ['$scope', '$element', '$attrs', '$rootScope', '$window', '$location', '$injector', 'pipActions', function ($scope, $element, $attrs, $rootScope, $window, $location, $injector, pipActions) {
        $element.addClass('pip-primary-actions');
        $scope.config = pipActions.config();
        if ($scope.localActions) {
            pipActions.showLocalActions();
            $scope.config.primaryLocalActions = $scope.localActions[0];
        }
        if ($scope.globalActions) {
            pipActions.showLocalActions();
            $scope.config.primaryGlobalActions = $scope.globalActions[0];
        }
        $rootScope.$on('pipActionsChanged', onActionsChanged);
        $scope.actionHidden = actionHidden;
        $scope.actionCount = actionCount;
        $scope.onActionClick = onActionClick;
        function onActionsChanged(event, config) {
            $scope.config = config;
        }
        function actionHidden(action) {
            return action.access && !action.access(action);
        }
        function actionCount(action) {
            if (action.count === null || action.count <= 0) {
                return '';
            }
            if (action.count > 99) {
                return '!';
            }
            return action.count;
        }
        function calcActions(actions) {
            var count = 0;
            _.each(actions, function (action) {
                if (!actionHidden(action)) {
                    count++;
                }
            });
            return count;
        }
        function secondaryActionsVisible() {
            return calcActions($scope.config.secondaryGlobalActions) > 0 ||
                calcActions($scope.config.secondaryLocalActions) > 0;
        }
        function secondaryDividerVisible() {
            return calcActions($scope.config.secondaryGlobalActions) > 0 &&
                calcActions($scope.config.secondaryLocalActions) > 0;
        }
        function onActionClick(action, $mdOpenMenu) {
            if (!action || action.divider) {
                return;
            }
            if (action.close) {
                $scope.originatorEv = null;
            }
            if (action.menu) {
                $mdOpenMenu($scope.originatorEv);
                return;
            }
            if (action.callback) {
                action.callback();
                return;
            }
            if (action.href) {
                $window.location.href = action.href;
                return;
            }
            if (action.url) {
                $location.url(action.url);
                return;
            }
            if (action.state) {
                if ($injector.has('$state')) {
                    var $state = $injector.get('$state');
                    $state.go(action.state, action.stateParams);
                }
                return;
            }
            if (action.event) {
                $rootScope.$broadcast(action.event);
            }
            else {
                $rootScope.$broadcast('pipActionClicked', action.name);
            }
        }
    }]);
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipSecondaryActions', ['ngMaterial', 'pipNav.Translate', 'pipNav.Templates', 'pipActions.Service']);
    thisModule.directive('pipSecondaryActions', function () {
        return {
            restrict: 'E',
            scope: {
                title: '=pipTitle',
                showMenu: '=pipShowMenu',
                localActions: '=pipLocalActions',
                globalActions: '=pipGlobalActions',
                partyAvatarUrl: '=pipPartyAvatarUrl'
            },
            replace: false,
            templateUrl: function (element, attr) {
                return 'actions/secondary_actions.html';
            },
            controller: 'pipSecondaryActionsController'
        };
    });
    thisModule.controller('pipSecondaryActionsController', ['$scope', '$element', '$attrs', '$rootScope', '$window', '$location', '$injector', 'pipActions', function ($scope, $element, $attrs, $rootScope, $window, $location, $injector, pipActions) {
        $element.addClass('pip-secondary-actions');
        $scope.config = pipActions.config();
        if ($scope.localActions) {
            pipActions.showLocalActions();
            $scope.config.secondaryLocalActions = $scope.localActions[1];
        }
        if ($scope.globalActions) {
            pipActions.showLocalActions();
            $scope.config.secondaryGlobalActions = $scope.globalActions[0];
        }
        $rootScope.$on('pipActionsChanged', onActionsChanged);
        $scope.actionHidden = actionHidden;
        $scope.actionCount = actionCount;
        $scope.secondaryActionsVisible = secondaryActionsVisible;
        $scope.secondaryDividerVisible = secondaryDividerVisible;
        $scope.onActionClick = onActionClick;
        $scope.openMenu = openMenu;
        function openMenu($mdOpenMenu, ev) {
            $scope.originatorEv = ev;
            $mdOpenMenu(ev);
        }
        function onActionsChanged(event, config) {
            $scope.config = config;
        }
        function actionHidden(action) {
            return action.access && !action.access(action);
        }
        function actionCount(action) {
            if (action.count === null || action.count <= 0) {
                return '';
            }
            if (action.count > 99) {
                return '!';
            }
            return action.count;
        }
        function calcActions(actions) {
            var count = 0;
            _.each(actions, function (action) {
                if (!actionHidden(action)) {
                    count++;
                }
            });
            return count;
        }
        function secondaryActionsVisible() {
            return calcActions($scope.config.secondaryGlobalActions) > 0 ||
                calcActions($scope.config.secondaryLocalActions) > 0;
        }
        function secondaryDividerVisible() {
            return calcActions($scope.config.secondaryGlobalActions) > 0 &&
                calcActions($scope.config.secondaryLocalActions) > 0;
        }
        function onActionClick(action, $mdOpenMenu) {
            if (!action || action.divider) {
                return;
            }
            if (action.close) {
                $scope.originatorEv = null;
            }
            if (action.menu) {
                $mdOpenMenu($scope.originatorEv);
                return;
            }
            if (action.callback) {
                action.callback();
                return;
            }
            if (action.href) {
                $window.location.href = action.href;
                return;
            }
            if (action.url) {
                $location.url(action.url);
                return;
            }
            if (action.state) {
                if ($injector.has('$state')) {
                    var $state = $injector.get('$state');
                    $state.go(action.state, action.stateParams);
                }
                return;
            }
            if (action.event) {
                $rootScope.$broadcast(action.event);
            }
            else {
                $rootScope.$broadcast('pipActionClicked', action.name);
            }
        }
    }]);
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipAppBar', ['ngMaterial', 'pipNav.Templates', 'pipAppBar.Service']);
    thisModule.directive('pipAppbar', function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: true,
            templateUrl: 'appbar/appbar.html',
            controller: 'pipAppBarController'
        };
    });
    thisModule.controller('pipAppBarController', ['$scope', '$element', '$rootScope', 'pipAppBar', function ($scope, $element, $rootScope, pipAppBar) {
        $element.addClass('pip-appbar');
        $element.addClass('color-primary-bg');
        $scope.$emit('pipResizeWindow');
        $scope.config = pipAppBar.config();
        $rootScope.$on('pipAppBarChanged', onAppBarChanged);
        function onAppBarChanged(event, config) {
            $scope.config = config;
        }
    }]);
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipAppBar.Part', ['pipAppBar.Service']);
    thisModule.directive('pipAppbarPart', ['ngIfDirective', function (ngIfDirective) {
        var ngIf = ngIfDirective[0];
        return {
            transclude: ngIf.transclude,
            priority: ngIf.priority,
            terminal: ngIf.terminal,
            restrict: ngIf.restrict,
            scope: true,
            link: function linkFunction($scope, $element, $attrs) {
                $attrs.ngIf = function () {
                    return $scope.visible;
                };
                ngIf.link.apply(ngIf, arguments);
            },
            controller: 'pipAppBarPartController'
        };
    }]);
    thisModule.controller('pipAppBarPartController', ['$scope', '$element', '$attrs', '$rootScope', 'pipAppBar', function ($scope, $element, $attrs, $rootScope, pipAppBar) {
        var partName = '' + $attrs.pipAppbarPart;
        var partValue = null;
        var pos = partName.indexOf(':');
        if (pos > 0) {
            partValue = partName.substr(pos + 1);
            partName = partName.substr(0, pos);
        }
        onAppBarChanged(null, pipAppBar.config());
        $rootScope.$on('pipAppBarChanged', onAppBarChanged);
        function onAppBarChanged(event, config) {
            var parts = config.parts || {};
            var currentPartValue = parts[partName];
            var visible = !!(partValue ? currentPartValue == partValue : currentPartValue);
            if (visible != $scope.visible)
                $scope.visible = visible;
        }
    }]);
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipAppBar.Service', []);
    thisModule.provider('pipAppBar', function () {
        var config = {
            theme: 'default',
            cssClass: '',
            ngClasses: {},
            parts: {}
        };
        this.theme = theme;
        this.parts = initParts;
        this.$get = ['$rootScope', function ($rootScope) {
            return {
                config: getConfig,
                cssClass: cssClass,
                part: getOrSetPart,
                parts: getOrSetParts,
                showShadow: showShadow,
                showShadowSm: showShadowSm,
                showShadowSmXs: showShadowSmXs,
                hideShadow: hideShadow
            };
            function getConfig() {
                return config;
            }
            function cssClass(newCssClass) {
                if (newCssClass != undefined) {
                    config.cssClass = newCssClass;
                    sendConfigEvent();
                }
                return config.cssClass;
            }
            function showShadowSm() {
                config.ngClasses['pip-shadow'] = false;
                config.ngClasses['pip-shadow-sm'] = true;
                config.ngClasses['pip-shadow-xs'] = false;
                sendConfigEvent();
            }
            function showShadowSmXs() {
                config.ngClasses['pip-shadow'] = false;
                config.ngClasses['pip-shadow-sm'] = true;
                config.ngClasses['pip-shadow-xs'] = true;
                sendConfigEvent();
            }
            function showShadow() {
                config.ngClasses['pip-shadow'] = true;
                sendConfigEvent();
            }
            function hideShadow() {
                config.ngClasses['pip-shadow'] = false;
                config.ngClasses['pip-shadow-sm'] = false;
                config.ngClasses['pip-shadow-xs'] = false;
                sendConfigEvent();
            }
            function getOrSetPart(name, value) {
                if (!_.isString(name))
                    throw new Error("Part name has to be a string");
                if (value != undefined) {
                    if (config.parts[name] != value) {
                        config.parts[name] = value;
                        sendConfigEvent();
                    }
                }
                return config.parts[name];
            }
            function getOrSetParts(parts) {
                if (_.isObject(parts)) {
                    if (!_.isEqual(config.parts, parts)) {
                        config.parts = parts;
                        sendConfigEvent();
                    }
                }
                return config.parts;
            }
            function sendConfigEvent() {
                $rootScope.$broadcast('pipAppBarChanged', config);
            }
        }];
        function theme(theme) {
            config.theme = theme || config.theme;
            return config.theme;
        }
        function initParts(parts) {
            if (_.isObject(parts)) {
                config.parts = parts;
            }
            return config.parts;
        }
    });
})();

var pip;
(function (pip) {
    var nav;
    (function (nav) {
        var BreadcrumbController = (function () {
            BreadcrumbController.$inject = ['$scope', '$element', '$attrs', '$rootScope', '$window', '$state', 'pipBreadcrumb'];
            function BreadcrumbController($scope, $element, $attrs, $rootScope, $window, $state, pipBreadcrumb) {
                "ngInject";
                this._rootScope = $rootScope;
                this._window = $window;
                $element.addClass('pip-breadcrumb');
                this.config = pipBreadcrumb.config;
                $rootScope.$on('pipBreadcrumbChanged', this.onBreadcrumbChanged);
                $rootScope.$on('pipBreadcrumbBack', this.onBreadcrumbBack);
            }
            BreadcrumbController.prototype.onBreadcrumbChanged = function (event, config) {
                this.config = config;
            };
            BreadcrumbController.prototype.onBreadcrumbBack = function () {
                var items = this.config.items;
                if (_.isArray(items) && items.length > 0) {
                    var backCallback = items[items.length - 1].click;
                    if (_.isFunction(backCallback))
                        backCallback();
                    else
                        this._window.history.back();
                }
                else
                    this._window.history.back();
            };
            BreadcrumbController.prototype.onBreadcrumbClick = function (item) {
                if (_.isFunction(item.click))
                    item.click(item);
            };
            BreadcrumbController.prototype.onSearchOpen = function () {
                this._rootScope.$broadcast('pipSearchOpen');
            };
            return BreadcrumbController;
        }());
        function breadcrumbDirective() {
            return {
                restrict: 'E',
                scope: {},
                replace: false,
                templateUrl: function (element, attr) {
                    return 'breadcrumb/breadcrumb.html';
                },
                controller: BreadcrumbController,
                controllerAs: 'vm'
            };
        }
        angular
            .module('pipBreadcrumb', [
            'ngMaterial',
            'pipNav.Templates',
            'pipNav.Translate',
            'pipBreadcrumb.Service'
        ])
            .directive('pipBreadcrumb', breadcrumbDirective);
    })(nav = pip.nav || (pip.nav = {}));
})(pip || (pip = {}));

var pip;
(function (pip) {
    var nav;
    (function (nav) {
        nav.BreadcrumbChangedEvent = "pipBreadcrumbChanged";
        var BreadcrumbItem = (function () {
            function BreadcrumbItem() {
            }
            return BreadcrumbItem;
        }());
        nav.BreadcrumbItem = BreadcrumbItem;
        var BreadcrumbConfig = (function () {
            function BreadcrumbConfig() {
            }
            return BreadcrumbConfig;
        }());
        nav.BreadcrumbConfig = BreadcrumbConfig;
        var BreadcrumbService = (function () {
            function BreadcrumbService(config, $rootScope) {
                this._config = config;
                this._rootScope = $rootScope;
            }
            Object.defineProperty(BreadcrumbService.prototype, "config", {
                get: function () {
                    return this._config;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BreadcrumbService.prototype, "text", {
                get: function () {
                    return this._config.text;
                },
                set: function (value) {
                    this._config.text = value;
                    this._config.items = null;
                    this.sendEvent();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BreadcrumbService.prototype, "items", {
                get: function () {
                    return this._config.items;
                },
                set: function (value) {
                    this._config.text = null;
                    this._config.items = value;
                    this.sendEvent();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BreadcrumbService.prototype, "criteria", {
                get: function () {
                    return this._config.criteria;
                },
                set: function (value) {
                    this._config.criteria = value;
                    this.sendEvent();
                },
                enumerable: true,
                configurable: true
            });
            BreadcrumbService.prototype.sendEvent = function () {
                this._rootScope.$broadcast(pip.nav.BreadcrumbChangedEvent, this._config);
            };
            return BreadcrumbService;
        }());
        var BreadcrumbProvider = (function () {
            function BreadcrumbProvider() {
                this._config = {
                    text: null,
                    items: null,
                    criteria: null
                };
            }
            Object.defineProperty(BreadcrumbProvider.prototype, "text", {
                get: function () {
                    return this._config.text;
                },
                set: function (value) {
                    this._config.text = value;
                },
                enumerable: true,
                configurable: true
            });
            BreadcrumbProvider.prototype.$get = ['$rootScope', function ($rootScope) {
                "ngInject";
                if (this._service == null)
                    this._service = new BreadcrumbService(this._config, $rootScope);
                return this._service;
            }];
            return BreadcrumbProvider;
        }());
        angular
            .module('pipBreadcrumb.Service', [])
            .provider('pipBreadcrumb', BreadcrumbProvider);
    })(nav = pip.nav || (pip.nav = {}));
})(pip || (pip = {}));

(function () {
    'use strict';
    var thisModule = angular.module('pipNav.Translate', []);
    thisModule.filter('translate', ['$injector', function ($injector) {
        var pipTranslate = $injector.has('pipTranslate')
            ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate.translate(key) || key : key;
        };
    }]);
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipDropdown', ['pipNav.Templates']);
    thisModule.directive('pipDropdown', ['$mdMedia', function ($mdMedia) {
        return {
            restrict: 'E',
            scope: {
                ngDisabled: '&',
                actions: '=pipActions',
                showDropdown: '&pipShow',
                activeIndex: '=pipActiveIndex',
                select: '=pipDropdownSelect'
            },
            templateUrl: 'dropdown/dropdown.html',
            controller: ['$scope', '$element', '$attrs', 'localStorageService', function ($scope, $element, $attrs, localStorageService) {
                $scope.class = ($attrs.class || '') + ' md-' + localStorageService.get('theme') + '-theme';
                $scope.$mdMedia = $mdMedia;
                $scope.actions = ($scope.actions && _.isArray($scope.actions)) ? $scope.actions : [];
                $scope.activeIndex = $scope.activeIndex || 0;
                $scope.disabled = function () {
                    if ($scope.ngDisabled()) {
                        return $scope.ngDisabled();
                    }
                    else {
                        return false;
                    }
                };
                $scope.onSelect = function (index) {
                    $scope.activeIndex = index;
                    if ($scope.select) {
                        $scope.select($scope.actions[index], $scope.activeIndex);
                    }
                };
                $scope.show = function () {
                    if ($scope.showDropdown()) {
                        return $scope.showDropdown();
                    }
                    else {
                        return true;
                    }
                };
            }]
        };
    }]);
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipLanguagePicker', ['ngMaterial', 'pipNav.Translate', 'pipNav.Templates']);
    thisModule.directive('pipLanguagePicker', function () {
        return {
            restrict: 'E',
            scope: {
                languages: '=languages',
            },
            replace: false,
            templateUrl: function (element, attr) {
                return 'language_picker/language_picker.html';
            },
            controller: 'pipLanguagePickerController'
        };
    });
    thisModule.controller('pipLanguagePickerController', ['$scope', '$element', '$attrs', '$rootScope', '$window', '$state', '$location', '$injector', function ($scope, $element, $attrs, $rootScope, $window, $state, $location, $injector) {
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        $element.addClass('pip-language-picker');
        $scope.language = getLanguage;
        $scope.onLanguageClick = onLanguageClick;
        $rootScope.$on('pipSetLanguages', setLanguages);
        function setLanguages(lang) {
            $scope.languages = lang.length > 0 ? lang : ['en', 'ru'];
        }
        function getLanguage() {
            return pipTranslate ? pipTranslate.use() : null;
        }
        function onLanguageClick(language) {
            if (pipTranslate) {
                setTimeout(function () {
                    pipTranslate.use(language);
                    $rootScope.$apply();
                }, 0);
            }
        }
    }]);
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipNavHeader', ['ngMaterial', 'pipNav.Templates']);
    thisModule.directive('pipNavHeader', function () {
        return {
            restrict: 'EA',
            scope: {
                user: '=pipUser',
            },
            replace: false,
            templateUrl: 'nav_header/nav_header.html',
            controller: 'pipNavHeaderController'
        };
    });
    thisModule.controller('pipNavHeaderController', ['$scope', '$element', '$rootScope', function ($scope, $element, $rootScope) {
        $element.addClass('pip-nav-header');
        $rootScope.$on('pipIdentityChanged', onIdentityChanged);
        $scope.getUser = getUser;
        $scope.onUserClick = onUserClick;
        return;
        function getUser(prop) {
            var value = $scope.user || $scope.identity || {};
            if (prop)
                return value[prop];
            return value;
        }
        function onIdentityChanged(event, identity) {
            $scope.identity = identity;
        }
        function onUserClick() {
            $rootScope.$broadcast('pipNavUserClicked');
        }
    }]);
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipNavIcon', ['ngMaterial', 'pipNav.Translate', 'pipNav.Templates', 'pipNavIcon.Service']);
    thisModule.directive('pipNavIcon', function () {
        return {
            restrict: 'E',
            scope: {
                type: '=pipType',
                imageUrl: '=pipImageUrl'
            },
            replace: false,
            templateUrl: function (element, attr) {
                return 'nav_icon/nav_icon.html';
            },
            controller: 'pipNavIconController'
        };
    });
    thisModule.controller('pipNavIconController', ['$scope', '$element', '$attrs', '$rootScope', '$window', 'pipNavIcon', function ($scope, $element, $attrs, $rootScope, $window, pipNavIcon) {
        $element.addClass('pip-nav-icon');
        $scope.config = pipNavIcon.config();
        $rootScope.$on('pipNavIconChanged', onNavIconChanged);
        $scope.onNavIconClick = onNavIconClick;
        function onNavIconChanged(event, config) {
            $scope.config = config;
        }
        function onNavIconClick() {
            var breadcrumb, backCallback;
            if (_.isFunction($scope.config.callback)) {
                $scope.config.callback();
            }
            else if ($scope.config.event) {
                $rootScope.$broadcast($scope.config.event);
            }
            else if ($scope.config.type == 'menu') {
                $rootScope.$broadcast('pipOpenSideNav');
            }
            else if ($scope.config.type == 'back') {
                $window.history.back();
            }
            else {
                $rootScope.$broadcast('pipNavIconClicked');
            }
        }
    }]);
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipNavIcon.Service', []);
    thisModule.provider('pipNavIcon', function () {
        var config = {
            type: 'menu',
            imageUrl: null,
            iconName: 'back',
            callback: null,
            event: null
        };
        this.config = getConfig;
        this.clear = clear;
        this.menu = setMenu;
        this.back = setBack;
        this.icon = setIcon;
        this.image = setImage;
        this.$get = ['$rootScope', function ($rootScope) {
            return {
                config: getConfig,
                hide: hide,
                menu: showMenu,
                back: showBack,
                icon: showIcon,
                image: showImage
            };
            function hide() {
                clear();
                sendConfigEvent();
            }
            function showMenu(callbackOrEvent) {
                setMenu(callbackOrEvent);
                sendConfigEvent();
            }
            function showIcon(iconName, callbackOrEvent) {
                setIcon(iconName, callbackOrEvent);
                sendConfigEvent();
            }
            function showBack(callbackOrEvent) {
                setBack(callbackOrEvent);
                sendConfigEvent();
            }
            function showImage(imageUrl, callbackOrEvent) {
                setImage(imageUrl, callbackOrEvent);
                sendConfigEvent();
            }
            function sendConfigEvent() {
                $rootScope.$broadcast('pipNavIconChanged', config);
            }
        }];
        function getConfig() {
            return config;
        }
        function clear() {
            config.type = 'none';
            config.callback = null;
            config.event = null;
        }
        function setMenu(callbackOrEvent) {
            config.type = 'menu';
            config.callback = null;
            config.event = null;
            if (_.isFunction(callbackOrEvent))
                config.callback = callbackOrEvent;
            if (_.isString(callbackOrEvent))
                config.event = callbackOrEvent;
        }
        function setIcon(iconName, callbackOrEvent) {
            config.type = 'icon';
            config.iconName = iconName;
            config.callback = null;
            config.event = null;
            if (_.isFunction(callbackOrEvent))
                config.callback = callbackOrEvent;
            if (_.isString(callbackOrEvent))
                config.event = callbackOrEvent;
        }
        function setBack(callbackOrEvent) {
            config.type = 'back';
            config.callback = null;
            config.event = null;
            if (_.isFunction(callbackOrEvent))
                config.callback = callbackOrEvent;
            if (_.isString(callbackOrEvent))
                config.event = callbackOrEvent;
        }
        function setImage(imageUrl, callbackOrEvent) {
            config.type = 'image';
            config.imageUrl = imageUrl;
            config.callback = null;
            config.event = null;
            if (_.isFunction(callbackOrEvent))
                config.callback = callbackOrEvent;
            if (_.isString(callbackOrEvent))
                config.event = callbackOrEvent;
        }
    });
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipNavMenu', ['ngMaterial', 'pipNav.Translate', 'pipNav.Templates', 'pipNavMenu.Service']);
    thisModule.directive('pipNavMenu', function () {
        return {
            restrict: 'EA',
            scope: {
                config: '=pipLinks'
            },
            replace: false,
            templateUrl: 'nav_menu/nav_menu.html',
            controller: 'pipNavMenuController'
        };
    });
    thisModule.controller('pipNavMenuController', ['$scope', '$element', '$rootScope', '$window', '$location', '$timeout', '$injector', 'pipSideNav', 'pipNavMenu', function ($scope, $element, $rootScope, $window, $location, $timeout, $injector, pipSideNav, pipNavMenu) {
        $element.addClass('pip-nav-menu');
        $scope.config = $scope.config || pipNavMenu.get();
        $rootScope.$on('pipNavMenuChanged', onConfigChanged);
        $scope.itemVisible = itemVisible;
        $scope.onLinkClick = onLinkClick;
        $scope.isSectionEmpty = isSectionEmpty;
        return;
        function itemVisible(item) {
            return item && item.access && !item.access(item);
        }
        function isSectionEmpty(linkCollection) {
            var result = true;
            _.each(linkCollection, function (link) {
                if (!itemVisible(link))
                    result = false;
            });
            return result;
        }
        function onConfigChanged(event, config) {
            $scope.config = config;
        }
        function onLinkClick(event, link) {
            event.stopPropagation();
            if (!link) {
                pipSideNav.close();
                return;
            }
            if (link.href) {
                if (link.href.split('?')[0] === $window.location.href.split('?')[0]) {
                    pipSideNav.close();
                    return;
                }
                pipSideNav.close();
                $timeout(function () {
                    $window.location.href = link.href;
                }, 300);
                return;
            }
            else if (link.url) {
                if (link.url.split(/[\s/?]+/)[1] === $location.url().split(/[\s/?]+/)[1]) {
                    pipSideNav.close();
                    return;
                }
                pipSideNav.close();
                $timeout(function () {
                    $location.url(link.url);
                }, 300);
                return;
            }
            else if (link.state) {
                var $state = $injector.has('$state') ? $injector.get('$state') : null;
                if ($state != null && $state.current.name === link.state) {
                    pipSideNav.close();
                    return;
                }
                pipSideNav.close();
                $timeout(function () {
                    if ($injector.has('$state')) {
                        var $state = $injector.get('$state');
                        $state.go(link.state, link.stateParams);
                    }
                }, 300);
                return;
            }
            else if (link.event)
                $rootScope.$broadcast(link.event, link);
            pipSideNav.close();
        }
    }]);
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipNavMenu.Service', []);
    thisModule.provider('pipNavMenu', function () {
        var config = [];
        this.sections = init;
        this.$get = ['$rootScope', '$mdSidenav', function ($rootScope, $mdSidenav) {
            return {
                get: getConfig,
                set: setConfig
            };
            function getConfig() {
                return config;
            }
            function setConfig(newConfig) {
                init(newConfig);
                $rootScope.$broadcast('pipNavMenuChanged', config);
                return config;
            }
        }];
        function init(newConfig) {
            if (_.isArray(newConfig))
                config = newConfig;
            return config;
        }
        ;
    });
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipSearchBar', ['ngMaterial', 'pipNav.Translate', 'pipNav.Templates', 'pipSearch.Service']);
    thisModule.run(['$injector', function ($injector) {
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        if (pipTranslate && pipTranslate.setTranslations) {
            pipTranslate.setTranslations('en', {
                'APPBAR_SEARCH': 'Search'
            });
            pipTranslate.setTranslations('ru', {
                'APPBAR_SEARCH': 'Поиск'
            });
        }
    }]);
    thisModule.directive('pipSearchBar', function () {
        return {
            restrict: 'E',
            scope: {},
            replace: false,
            templateUrl: function (element, attr) {
                return 'search_bar/search_bar.html';
            },
            controller: 'pipSearchBarController'
        };
    });
    thisModule.controller('pipSearchBarController', ['$scope', '$element', '$attrs', '$rootScope', 'pipSearch', function ($scope, $element, $attrs, $rootScope, pipSearch) {
        $element.addClass('pip-search-bar');
        $scope.config = pipSearch.config();
        $scope.searchEnabled = false;
        $scope.search = { text: '' };
        $rootScope.$on('pipSearchChanged', onSearchBarChanged);
        $scope.onSearchEnable = onSearchEnable;
        $scope.onSearchClick = onSearchClick;
        $scope.onSearchClear = onSearchClear;
        $scope.onSearchKeyDown = onSearchKeyDown;
        function onSearchBarChanged(event, config) {
            $scope.config = config;
            $scope.searchEnabled = false;
            $scope.search.text = '';
        }
        function focusSearchText() {
            var element;
            setTimeout(function () {
                element = $('.pip-search-text');
                if (element.length > 0) {
                    element.focus();
                }
            }, 0);
        }
        function onSearchEnable() {
            $scope.search.text = $scope.config.criteria;
            $scope.searchEnabled = true;
            focusSearchText();
        }
        function onSearchClick() {
            var searchText = $scope.search.text;
            $scope.search.text = '';
            $scope.searchEnabled = false;
            if ($scope.config.callback) {
                $scope.config.callback(searchText);
            }
            else {
                $rootScope.$broadcast('pipSearchBarSearchClicked', searchText);
            }
        }
        function onSearchClear() {
            if ($scope.search.text) {
                $scope.search.text = '';
                focusSearchText();
            }
            else {
                $scope.searchEnabled = false;
                onSearchClick();
            }
        }
        function onSearchKeyDown(event) {
            if (event.keyCode === 13) {
                $scope.onSearchClick();
                return;
            }
            if (event.keyCode === 27) {
                $scope.searchEnabled = false;
            }
        }
    }]);
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipSearch.Service', []);
    thisModule.provider('pipSearch', function () {
        var config = {
            visible: false,
            criteria: '',
            history: [],
            callback: null,
        };
        this.$get = ['$rootScope', function ($rootScope) {
            $rootScope.$on('pipSearchOpen', open);
            $rootScope.$on('pipSearchClose', close);
            return {
                config: getConfig,
                set: setSearch,
                clear: clearSearch,
                criteria: updateCriteria,
                history: updateHistory,
            };
            function getConfig() {
                return config;
            }
            function setSearch(callback, criteria, history) {
                config.callback = callback;
                config.criteria = criteria;
                config.history = history;
                sendConfigEvent();
            }
            function clearSearch() {
                config.callback = null;
                config.criteria = null;
                sendConfigEvent();
            }
            function open(event) {
                config.visible = true;
                sendConfigEvent();
            }
            function close(event) {
                config.visible = false;
                sendConfigEvent();
            }
            function toggle() {
                config.visible = !config.visible;
                sendConfigEvent();
            }
            function updateCriteria(criteria) {
                config.criteria = criteria;
                sendConfigEvent();
            }
            function updateHistory(history) {
                config.history = history;
                sendConfigEvent();
            }
            function sendConfigEvent() {
                $rootScope.$broadcast('pipSearchChanged', config);
            }
        }];
    });
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipSideNav', ['ngMaterial', 'pipNav.Templates', 'pipSideNav.Service']);
    thisModule.directive('pipSidenav', function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: true,
            templateUrl: 'sidenav/sidenav.html',
            controller: 'pipSideNavController'
        };
    });
    thisModule.controller('pipSideNavController', ['$scope', '$element', '$rootScope', 'pipSideNav', function ($scope, $element, $rootScope, pipSideNav) {
        $element.addClass('pip-sidenav');
        $rootScope.$on('pipNavIconClicked', onNavIconClick);
        return;
        function onNavIconClick(event) {
            pipSideNav.open();
        }
    }]);
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipSideNav.Part', ['pipSideNav.Service']);
    thisModule.directive('pipSidenavPart', ['ngIfDirective', function (ngIfDirective) {
        var ngIf = ngIfDirective[0];
        return {
            transclude: ngIf.transclude,
            priority: ngIf.priority,
            terminal: ngIf.terminal,
            restrict: ngIf.restrict,
            scope: true,
            link: function ($scope, $element, $attrs) {
                $attrs.ngIf = function () { return $scope.visible; };
                ngIf.link.apply(ngIf);
            },
            controller: 'pipSideNavPartController'
        };
    }]);
    thisModule.controller('pipSideNavPartController', ['$scope', '$element', '$attrs', '$rootScope', 'pipSideNav', function ($scope, $element, $attrs, $rootScope, pipSideNav) {
        var partName = '' + $attrs.pipSidenavPart;
        var partValue = null;
        var pos = partName.indexOf(':');
        if (pos > 0) {
            partValue = partName.substr(pos + 1);
            partName = partName.substr(0, pos);
        }
        onSideNavChanged(null, pipSideNav.config());
        $rootScope.$on('pipSideNavChanged', onSideNavChanged);
        function onSideNavChanged(event, config) {
            var parts = config.parts || {};
            var currentPartValue = config[partName];
            $scope.visible = partValue ? currentPartValue == partValue : currentPartValue;
        }
    }]);
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipSideNav.Service', []);
    thisModule.provider('pipSideNav', function () {
        var config = {
            theme: 'default',
            parts: []
        };
        this.theme = theme;
        this.parts = initParts;
        this.$get = ['$rootScope', '$mdSidenav', function ($rootScope, $mdSidenav) {
            $rootScope.$on('pipOpenSideNav', open);
            $rootScope.$on('pipCloseSideNav', close);
            return {
                config: getConfig,
                part: getOrSetPart,
                parts: getOrSetParts,
                open: open,
                close: close,
                toggle: toggle
            };
            function getConfig() {
                return config;
            }
            function getOrSetPart(name, value) {
                if (!_.isString(name))
                    throw new Error("Part name has to be a string");
                if (value != undefined) {
                    if (config.parts[name] != value) {
                        config.parts[name] = value;
                        sendConfigEvent();
                    }
                }
                return config.parts[name];
            }
            function getOrSetParts(parts) {
                if (_.isObject(parts)) {
                    if (!_.isEqual(config.parts, parts)) {
                        config.parts = parts;
                        sendConfigEvent();
                    }
                }
                return config.parts;
            }
            function sendConfigEvent() {
                $rootScope.$broadcast('pipSideNavChanged', config);
            }
            function open(event) {
                $mdSidenav('pip-sidenav').open();
            }
            function close(event) {
                $mdSidenav('pip-sidenav').close();
            }
            function toggle() {
                $mdSidenav('pip-sidenav').toggle();
            }
        }];
        function theme(theme) {
            config.theme = theme || config.theme;
            return config.theme;
        }
        function initParts(parts) {
            if (_.isObject(parts)) {
                config.parts = parts;
            }
            return config.parts;
        }
    });
})();

(function () {
    'use strict';
    var thisModule = angular.module("pipTabs", ['pipNav.Templates']);
    thisModule.directive('pipTabs', function () {
        return {
            restrict: 'E',
            scope: {
                ngDisabled: '&',
                tabs: '=pipTabs',
                showTabs: '&pipShowTabs',
                showTabsShadow: '&pipTabsShadow',
                activeIndex: '=pipActiveIndex',
                select: '=pipTabsSelect'
            },
            templateUrl: 'tabs/tabs.html',
            controller: ['$scope', '$element', '$attrs', '$mdMedia', 'localStorageService', '$injector', function ($scope, $element, $attrs, $mdMedia, localStorageService, $injector) {
                $scope.class = ($attrs.class || '') + ' md-' + localStorageService.get('theme') + '-theme';
                $scope.$mdMedia = $mdMedia;
                $scope.tabs = ($scope.tabs && _.isArray($scope.tabs)) ? $scope.tabs : [];
                var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
                if (pipTranslate) {
                    if ($scope.tabs.length > 0 && $scope.tabs[0].title) {
                        pipTranslate.translateObjects($scope.tabs, 'title', 'nameLocal');
                    }
                    else {
                        pipTranslate.translateObjects($scope.tabs, 'name', 'nameLocal');
                    }
                }
                $scope.activeIndex = $scope.activeIndex || 0;
                $scope.activeTab = $scope.activeIndex;
                $scope.disabled = function () {
                    if ($scope.ngDisabled) {
                        return $scope.ngDisabled();
                    }
                };
                $scope.tabDisabled = function (index) {
                    return ($scope.disabled() && $scope.activeIndex != index);
                };
                $scope.onSelect = function (index) {
                    if ($scope.disabled())
                        return;
                    $scope.activeIndex = index;
                    $scope.activeTab = $scope.activeIndex;
                    if ($scope.select) {
                        $scope.select($scope.tabs[$scope.activeIndex], $scope.activeIndex);
                    }
                };
                $scope.showShadow = function () {
                    if ($scope.showTabsShadow) {
                        return $scope.showTabsShadow();
                    }
                    else {
                        return false;
                    }
                };
                $scope.show = function () {
                    if ($scope.showTabs) {
                        return $scope.showTabs();
                    }
                    else {
                        return true;
                    }
                };
            }]
        };
    });
})();





(function () {
    'use strict';
    run.$inject = ['localStorageService', '$rootScope'];
    var thisModule = angular.module('pipTheme', ['LocalStorageModule', 'ngMaterial']);

    thisModule.run(run);

    function run (localStorageService, $rootScope) {
        try {
            $rootScope.$theme =  localStorageService.get('theme') || 'blue';
        } catch (ex) {
            
        }
    }
    
    thisModule.provider('pipTheme', function() {
        var 
            theme = 'blue',
            persist = true,
            setRoot = true;

        this.use = initTheme;
        this.init = initTheme;
        this.persist = initPersist;
        this.setRoot = initSetRoot;

        this.$get = ['$rootScope', '$timeout', 'localStorageService', '$mdTheming', function ($rootScope, $timeout, localStorageService, $mdTheming) {
            // Read theme from persistent storage
            if (persist)
                theme = localStorageService.get('theme') || theme;

            // Set root variable
            if (setRoot) 
                $rootScope.$theme = theme;

            // Switch material theme
            //$('body').attr('md-theme',  $rootScope.$theme).addClass("{{ $theme }}");
            
            // Resetting root scope to force update language on the screen
            function resetContent(fullReset, partialReset) {
                fullReset = fullReset !== undefined ? !!fullReset : false;
                partialReset = partialReset !== undefined ? !!partialReset : false;

                $rootScope.$reset = fullReset;
                $rootScope.$partialReset = partialReset;
                $timeout(function() {
                    $rootScope.$reset = false;
                    $rootScope.$partialReset = false;
                }, 0);
            }

            function getOrSetTheme(newTheme, fullReset, partialReset) {
                if (newTheme != null && newTheme != theme) {
                    if (!(theme in $mdTheming.THEMES))
                        throw new Error('Theme ' + theme + ' is not registered. Please, register it first with $mdThemingProvider');

                    theme = newTheme;
                    
                    if (persist)
                        localStorageService.set('theme', theme);
                    if (setRoot)
                        $rootScope.$theme = theme;
                    
                    // Switch material theme
                    //$('body').attr('md-theme', "{{ $theme }}").addClass("{{ $theme }}");

                    // Resetting content.
                    resetContent(fullReset, partialReset);

                    // Sending notification
                    $rootScope.$broadcast('pipThemeChanged', newTheme);
                }
                return theme;
            }

            return {
                use: getOrSetTheme,
                theme: getOrSetTheme
            }
        }];

        // Initialize theme selection
        function initTheme(newTheme) {
            if (newTheme != null)
                theme = newTheme;
            return theme;
        }

        // Initialize persistence flag
        function initPersist(newPersist) {
            if (newPersist != null)
                persist = newPersist;
            return persist;
        }

        // Initialize set root flag
        function initSetRoot(newSetRoot) {
            if (newSetRoot != null)
                setRoot = newSetRoot;
            return setRoot;  
        }

    });
    
})();

(function () {
    'use strict';
    angular.module('pipTheme.Bootbarn', [
        'pipTheme.Bootbarn.Warm',
        'pipTheme.Bootbarn.Cool',
        'pipTheme.Bootbarn.Monochrome'
    ]);
})();

(function () {
    'use strict';
    config.$inject = ['$mdThemingProvider'];
    var thisModule = angular.module('pipTheme.Bootbarn.Cool', ['ngMaterial']);

    thisModule.config(config);

    function config($mdThemingProvider) {
        // pipTranslateProvider.translations('en', {
        //     THEME: 'Theme',
        //     'bootbarn-cool': 'Cool'
        // });

        // pipTranslateProvider.translations('ru', {
        //     THEME: 'Тема',
        //     'bootbarn-cool': ''
        // });
        
        var coolBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
            'A100': 'rgba(250, 250, 250, 1)',
            'A200': 'rgba(69, 90, 100, 1)'
        });
        $mdThemingProvider.definePalette('bootbarn-cool-background', coolBackgroundPalette);

        var coolPrimaryPalette = $mdThemingProvider.extendPalette('grey', {
            '300': 'rgba(69, 90, 100, .54)',
            '500': 'rgba(69, 90, 100, 1)',
            'contrastLightColors': ['500', '300']
        });
        $mdThemingProvider.definePalette('bootbarn-cool-primary', coolPrimaryPalette);


        var coolAccentPalette = $mdThemingProvider.extendPalette('green', {
            'A700': 'rgba(76, 175, 80, 1)',
            'contrastLightColors': ['A700']
        });
        $mdThemingProvider.definePalette('bootbarn-cool-accent', coolAccentPalette);

        $mdThemingProvider.theme('bootbarn-cool')
            .primaryPalette('bootbarn-cool-primary', {
                'default': '500',
                'hue-1': '300'
            })
            .backgroundPalette('bootbarn-cool-background', {
                'default': '50',  // background
                'hue-1': 'A200',  // tiles dialog
                'hue-2': 'A700'   // app bar
            })
            .warnPalette('red', {
                'default': 'A200'
            })
            .accentPalette('bootbarn-cool-accent', {
                'default': 'A700'
            });

        $mdThemingProvider.alwaysWatchTheme(true);

    }
})();

(function () {
    'use strict';
    config.$inject = ['$mdThemingProvider'];
    var thisModule = angular.module('pipTheme.Bootbarn.Monochrome', ['ngMaterial']);

    thisModule.config(config);

    function config($mdThemingProvider) {
        // pipTranslateProvider.translations('en', {
        //     THEME: 'Theme',
        //     'bootbarn-monochrome': 'Monochrome'
        // });

        // pipTranslateProvider.translations('ru', {
        //     THEME: 'Тема',
        //     'bootbarn-monochrome': ''
        // });
        
        var monochromeBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
            'A100': 'rgba(250, 250, 250, 1)',
            'A200': 'rgba(38, 50, 56, 1)'
        });
        $mdThemingProvider.definePalette('bootbarn-monochrome-background', monochromeBackgroundPalette);

        var monochromePrimaryPalette = $mdThemingProvider.extendPalette('grey', {
            '300': 'rgba(38, 50, 56, .54)',
            '500': 'rgba(38, 50, 56, 1)',
            'contrastLightColors': ['500', '300']
        });
        $mdThemingProvider.definePalette('bootbarn-monochrome-primary', monochromePrimaryPalette);


        var monochromeAccentPalette = $mdThemingProvider.extendPalette('green', {
            'A700': 'rgba(76, 175, 80, 1)',
            'contrastLightColors': ['A700']
        });
        $mdThemingProvider.definePalette('bootbarn-monochrome-accent', monochromeAccentPalette);

        $mdThemingProvider.theme('bootbarn-monochrome')
            .primaryPalette('bootbarn-monochrome-primary', {
                'default': '500',
                'hue-1': '300'
            })
            .backgroundPalette('bootbarn-monochrome-background', {
                'default': '50',  // background
                'hue-1': 'A200',  // tiles dialog
                'hue-2': 'A700'   // app bar
            })
            .warnPalette('red', {
                'default': 'A200'
            })
            .accentPalette('bootbarn-monochrome-accent', {
                'default': 'A700'
            });

        $mdThemingProvider.alwaysWatchTheme(true);

    }
})();

(function () {
    'use strict';
    config.$inject = ['$mdThemingProvider'];
    var thisModule = angular.module('pipTheme.Bootbarn.Warm', ['ngMaterial']);

    thisModule.config(config);

    function config($mdThemingProvider) {
        // pipTranslateProvider.translations('en', {
        //     THEME: 'Theme',
        //     'bootbarn-warm': 'Warm'
        // });

        // pipTranslateProvider.translations('ru', {
        //     THEME: 'Тема',
        //     'bootbarn-warm': 'Коричневая'
        // });

        $mdThemingProvider.alwaysWatchTheme(true);

        var warmBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
                'A100': 'rgba(250, 250, 250, 1)',
                'A200': 'rgba(177, 55, 34, 1)'
            })
            ;
        $mdThemingProvider.definePalette('bootbarn-warm-background', warmBackgroundPalette);

        var warmPrimaryPalette = $mdThemingProvider.extendPalette('brown', {
            '300': 'rgba(177, 55, 34, .54)',
            '500': 'rgba(177, 55, 34, 1)',
            'contrastLightColors': ['500', '300']
        });
        $mdThemingProvider.definePalette('bootbarn-warm-primary', warmPrimaryPalette);


        var warmAccentPalette = $mdThemingProvider.extendPalette('amber', {
            'A700': 'rgba(127, 148, 92, 1)',
            'contrastLightColors': ['A700']
        });
        $mdThemingProvider.definePalette('bootbarn-warm-accent', warmAccentPalette);

        var warmErrorPalette = $mdThemingProvider.extendPalette('red', {
            'A200': 'rgba(255, 87, 34, 1)',
            'contrastLightColors': ['A200']
        });
        $mdThemingProvider.definePalette('bootbarn-warm-error', warmErrorPalette);

        $mdThemingProvider.theme('bootbarn-warm')
            .primaryPalette('bootbarn-warm-primary', {
                'default': '500',
                'hue-1': '300'
            })
            .backgroundPalette('bootbarn-warm-background', {
                'default': '50',  // background
                'hue-1': 'A200',  // tiles dialog
                'hue-2': 'A700'   // app bar
            })
            .warnPalette('bootbarn-warm-error', {
                'default': 'A200'
            })
            .accentPalette('bootbarn-warm-accent', {
                'default': 'A700'
            });
    }
})();

(function () {
    'use strict';
    config.$inject = ['$mdThemingProvider'];
    var thisModule = angular.module('pipTheme.Default', ['pipTheme.Blue', 'pipTheme.Pink',
        'pipTheme.Amber', 'pipTheme.Orange', 'pipTheme.Green', 'pipTheme.Navy', 'pipTheme.Grey']);

    thisModule.config(config);

    function config($mdThemingProvider) {
        // pipTranslateProvider.translations('en', {
        //     THEME: 'Theme'
        // });
        // pipTranslateProvider.translations('ru', {
        //     THEME: 'Тема'
        // });

        $mdThemingProvider.setDefaultTheme('default');
        $mdThemingProvider.alwaysWatchTheme(true);

    }
})();

(function () {
    'use strict';
    config.$inject = ['$mdThemingProvider'];
    var thisModule = angular.module('pipTheme.Amber', ['ngMaterial']);

    thisModule.config(config);

    function config($mdThemingProvider) {
        // pipTranslateProvider.translations('en', {
        //     THEME: 'Theme',
        //     amber: 'Amber'
        // });
        // pipTranslateProvider.translations('ru', {
        //     THEME: 'Тема',
        //     amber: 'Янтарная'
        // });

        var orangeBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
            'A100': 'rgba(250, 250, 250, 1)',
            'A200': 'rgba(255, 152, 0, 1)'
        });
        $mdThemingProvider.definePalette('orange-background', orangeBackgroundPalette);

        var orangePrimaryPalette = $mdThemingProvider.extendPalette('orange', {
            '800': 'rgba(255, 152, 0, 1)',
            '900': 'rgba(255, 152, 0, .54);'
        });
        $mdThemingProvider.definePalette('orange-primary', orangePrimaryPalette);

        $mdThemingProvider.theme('amber')
            .primaryPalette('orange-primary', {
                'default': '800',
                'hue-1': '900'
            })
            .backgroundPalette('orange-background', {
                'default': '50',  // background
                'hue-1': 'A200',  // tiles dialog
                'hue-2': 'A700'   // app bar
            })
            .warnPalette('red', {
                'default': 'A200'
            })
            .accentPalette('orange', {
                'default': '900'
            });
        $mdThemingProvider.alwaysWatchTheme(true);
        
    }
})();

(function () {
    'use strict';
    config.$inject = ['$mdThemingProvider'];
    var thisModule = angular.module('pipTheme.Black', ['ngMaterial']);

    thisModule.config(config);

    function config($mdThemingProvider) {
        // pipTranslateProvider.translations('en', {
        //     THEME: 'Theme',
        // });
        // pipTranslateProvider.translations('ru', {
        //     THEME: 'Тема'
        // });
        
        registerDarkTheme('dark');
        registerBlackTheme('black');
        $mdThemingProvider.alwaysWatchTheme(true);

        function registerDarkTheme(themeName) {
            var darkBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
                '600': 'rgba(48, 48, 48, 1)',
                '700': 'rgba(255, 255, 255, 0.54)',
                '800': 'rgba(66, 66, 66, 1)'
            });
            $mdThemingProvider.definePalette('dark-background', darkBackgroundPalette);

            var darkAccentPalette = $mdThemingProvider.extendPalette('green', {
                '600': 'rgba(0, 200, 83, 1)'
            });
            $mdThemingProvider.definePalette('dark-accent', darkAccentPalette);

            $mdThemingProvider.theme(themeName)
                .primaryPalette('dark-background', {
                    'default': '900',
                    'hue-1': '700'
                })
                .backgroundPalette('dark-background', {
                    'default': '800',  // background
                    'hue-1': '900',  // tiles dialog
                    'hue-2': 'A700'   // app bar
                })
                .warnPalette('red', {
                    'default': 'A200'
                })
                .accentPalette('dark-accent', {
                    'default': '600'
                });
        }

        function registerBlackTheme(themeName) {
            var blackBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
                '600': 'rgba(48, 48, 48, 1)',
                '700': 'rgba(255, 255, 255, 0.54)',
                '800': 'rgba(66, 66, 66, 1)',
                '500': 'rgba(38, 50, 56, 1)'
            });
            $mdThemingProvider.definePalette('black-background', blackBackgroundPalette);

            var blackAccentPalette = $mdThemingProvider.extendPalette('blue-grey', {
                '700': 'rgba(255, 255, 255, 0.54)'
            });
            $mdThemingProvider.definePalette('black-accent', blackAccentPalette);

            $mdThemingProvider.theme(themeName)
                .primaryPalette('black-accent', {
                    'default': '900',
                    'hue-1': '700'
                })
                .backgroundPalette('black-background', {
                    'default': '800',  // background
                    'hue-1': '500',  // tiles dialog
                    'hue-2': '800'   // app bar
                })
                .warnPalette('red', {
                    'default': 'A200'
                })
                .accentPalette('black-accent', {
                    'default': '600'
                });
        }
    }
})();

(function () {
    'use strict';
    config.$inject = ['$mdThemingProvider'];
    var thisModule = angular.module('pipTheme.Blue', ['ngMaterial']);

    thisModule.config(config);

    function config($mdThemingProvider) {
        // pipTranslateProvider.translations('en', {
        //     THEME: 'Theme',
        //     blue: 'Blue',
        // });
        // pipTranslateProvider.translations('ru', {
        //     THEME: 'Тема',
        //     blue: 'Голубая'
        // });

        registerBlueTheme('default');
        registerBlueTheme('blue');

        $mdThemingProvider.setDefaultTheme('default');
        $mdThemingProvider.alwaysWatchTheme(true);

        function registerBlueTheme(themeName) {
            var bluePrimaryPalette = $mdThemingProvider.extendPalette('blue', {
                'contrastDefaultColor': 'light',
                'contrastDarkColors': undefined
            });
            $mdThemingProvider.definePalette('blue-primary', bluePrimaryPalette);

            var blueBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
                'A100': 'rgba(250, 250, 250, 1)',
                'A200': 'rgba(33, 150, 243, 1)'
            });
            $mdThemingProvider.definePalette('blue-background', blueBackgroundPalette);

            var blueAccentPalette = $mdThemingProvider.extendPalette('green', {
                '600': 'rgba(0, 200, 83, 1)'
            });
            $mdThemingProvider.definePalette('blue-accent', blueAccentPalette);

            $mdThemingProvider.theme(themeName)
                .primaryPalette('blue-primary', {
                    'default': '500',
                    'hue-1': '300'
                })
                .backgroundPalette('blue-background', {
                    'default': '50',  // background
                    'hue-1': 'A200',  // tiles dialog
                    'hue-2': 'A700'   // app bar
                })
                .warnPalette('red', {
                    'default': 'A200'
                })
                .accentPalette('blue-accent', {
                    'default': '600'
                });
        }
    }
})();

(function () {
    'use strict';
    config.$inject = ['$mdThemingProvider'];
    var thisModule = angular.module('pipTheme.Green', ['ngMaterial']);

    thisModule.config(config);

    function config($mdThemingProvider) {
        // pipTranslateProvider.translations('en', {
        //     THEME: 'Theme',
        //     green: 'Green'
        // });

        // pipTranslateProvider.translations('ru', {
        //     THEME: 'Тема',
        //     green: 'Зеленая'
        // });

        var greenBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
            'A100': 'rgba(250, 250, 250, 1)',
            'A200': 'rgba(76, 175, 80, 1)'
        });
        $mdThemingProvider.definePalette('green-background', greenBackgroundPalette);

        var greenPrimaryPalette = $mdThemingProvider.extendPalette('green', {
            '300': '#9ed4a1',
            'contrastLightColors': ['500', '300']
        });
        $mdThemingProvider.definePalette('green-primary', greenPrimaryPalette);


        var greenAccentPalette = $mdThemingProvider.extendPalette('amber', {
            'contrastLightColors': ['A700']
        });
        $mdThemingProvider.definePalette('green-accent', greenAccentPalette);

        $mdThemingProvider.theme('green')
            .primaryPalette('green-primary', {
                'default': '500',
                'hue-1': '300'
            })
            .backgroundPalette('green-background', {
                'default': '50',  // background
                'hue-1': 'A200',  // tiles dialog
                'hue-2': 'A700'   // app bar
            })
            .warnPalette('red', {
                'default': 'A200'
            })
            .accentPalette('green-accent', {
                'default': 'A700'
            });
        $mdThemingProvider.alwaysWatchTheme(true);
    }
})();

(function () {
    'use strict';
    config.$inject = ['$mdThemingProvider'];
    var thisModule = angular.module('pipTheme.Grey', ['ngMaterial']);

    thisModule.config(config);

    function config($mdThemingProvider) {
        // pipTranslateProvider.translations('en', {
        //     THEME: 'Theme',
        //     grey: 'Grey'
        // });
        
        // pipTranslateProvider.translations('ru', {
        //     THEME: 'Тема',
        //     grey: 'Серая'
        // });

        var thirdPartyPalette = $mdThemingProvider.extendPalette('grey', {
            'A100': 'rgba(250, 250, 250, 1)',
            'A200': 'rgba(255, 152, 0, 1)',
            'A400': '#a9b9c0',
            '500': '#607D8B',
            'A700': '#90A4AE',
            //'800': '',
            'contrastDefaultColor': 'dark',
            'contrastLightColors': ['300', '400', '500', '600', '700', '800', '900', 'A700']
        });
        $mdThemingProvider.definePalette('third-party', thirdPartyPalette);


        $mdThemingProvider.theme('grey')
            .primaryPalette('third-party', {
                'default': '500',
                'hue-1': 'A400'
            })
            .backgroundPalette('third-party', {
                'default': '50',  // background
                'hue-1': '500',  // tiles dialog
                'hue-2': 'A700'   // app bar
            })
            .warnPalette('red', {
                'default': 'A200'
            })
            .accentPalette('third-party', {
                'default': 'A700'
            });
        
        $mdThemingProvider.alwaysWatchTheme(true);

    }
})();

(function () {
    'use strict';
    config.$inject = ['$mdThemingProvider'];
    var thisModule = angular.module('pipTheme.Navy', ['ngMaterial']);

    thisModule.config(config);

    function config($mdThemingProvider) {
        // pipTranslateProvider.translations('en', {
        //     THEME: 'Theme',
        //     navy: 'Navy'
        // });
        // pipTranslateProvider.translations('ru', {
        //     THEME: 'Тема',
        //     navy: 'Сине-серая'
        // });

        var greyPalette = $mdThemingProvider.extendPalette('grey', {
            '700': 'rgba(86, 97, 125, 1)',
            '800': 'rgba(86, 97, 125, .54)',
            'A100': 'rgba(250, 250, 250, 1)',
        });
        $mdThemingProvider.definePalette('grey', greyPalette);

        var tealPalette = $mdThemingProvider.extendPalette('teal', {
            'contrastLightColors': ['500', '600', '700', '800', '900', 'A700']
        });
        $mdThemingProvider.definePalette('teal', tealPalette);

        $mdThemingProvider.theme('navy')
            .primaryPalette('grey', {
                'default': '700',
                'hue-1': '800'
            })
            .backgroundPalette('grey', {
                'default': '50',  // background
                'hue-1': '700',  // tiles dialog
                'hue-2': 'A700'   // app bar
            })
            .warnPalette('red', {
                'default': 'A200'
            })
            .accentPalette('teal', {
                'default': 'A700'
            });
        $mdThemingProvider.alwaysWatchTheme(true);
    }
})();

(function () {
    'use strict';
    config.$inject = ['$mdThemingProvider'];
    var thisModule = angular.module('pipTheme.Orange', ['ngMaterial']);

    thisModule.config(config);

    function config($mdThemingProvider) {
        // pipTranslateProvider.translations('en', {
        //     THEME: 'Theme',
        //     orange: 'Orange'
        // });

        // pipTranslateProvider.translations('ru', {
        //     THEME: 'Тема',
        //     orange: 'Оранжевая'
        // });

        var RedBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
            'A100': 'rgba(250, 250, 250, 1)',
            'A200': 'rgba(255, 112, 67, 1)',
            'contrastLightColors': ['600', '700', '800', '900', 'A200']
        });
        $mdThemingProvider.definePalette('red-background', RedBackgroundPalette);

        var RedPrimaryPalette = $mdThemingProvider.extendPalette('orange', {
            '800': 'rgba(255, 112, 67, 1)',
            '900': 'rgba(255, 152, 67, .54)',
            'A100': 'rgba(255, 171, 64, 1)',
            'contrastLightColors': ['800', '900', 'A100']
        });
        $mdThemingProvider.definePalette('red-primary', RedPrimaryPalette);

        $mdThemingProvider.theme('orange')
            .primaryPalette('red-primary', {
                'default': '800',
                'hue-1': '900'
            })
            .backgroundPalette('red-background', {
                'default': '50',  // background
                'hue-1': 'A200',  // tiles dialog
                'hue-2': 'A700'   // app bar
            })
            .warnPalette('red', {
                'default': 'A200'
            })
            .accentPalette('red-primary', {
                'default': 'A100'
            });
        $mdThemingProvider.alwaysWatchTheme(true);
    }
})();

(function () {
    'use strict';
    config.$inject = ['$mdThemingProvider'];
    var thisModule = angular.module('pipTheme.Pink', ['ngMaterial']);

    thisModule.config(config);

    function config($mdThemingProvider) {
        // pipTranslateProvider.translations('en', {
        //     THEME: 'Theme',
        //     pink: 'Pink'
        // });
        // pipTranslateProvider.translations('ru', {
        //     THEME: 'Тема',
        //     pink: 'Розовая',

        // });

        var PinkBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
            'A100': 'rgba(250, 250, 250, 1)',
            'A200': 'rgba(188, 86, 121, 1)',
            'contrastDefaultColor': 'dark',
            'contrastLightColors': ['A200', 'A700']
        });
        $mdThemingProvider.definePalette('pink-background', PinkBackgroundPalette);

        var PinkPrimaryPalette = $mdThemingProvider.extendPalette('pink', {
            '600': 'rgba(255, 128, 171, 1)',
            '700': 'rgba(188, 86, 121, .54)',
            '900': 'rgba(188, 86, 121, 1)',
            'contrastDefaultColor': 'light'
        });
        $mdThemingProvider.definePalette('pink-primary', PinkPrimaryPalette);

        $mdThemingProvider.theme('pink')
            .primaryPalette('pink-primary', {
                'default': '900',
                'hue-1': '700'
            })
            .backgroundPalette('pink-background', {
                'default': '50',  // background
                'hue-1': 'A200',  // tiles dialog
                'hue-2': 'A700'   // app bar
            })
            .warnPalette('red', {
                'default': 'A200'
            })
            .accentPalette('pink-primary', {
                'default': '600'
            });
        $mdThemingProvider.alwaysWatchTheme(true);

    }
})();



/**
 * @file Registration of all error handling components
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    angular.module('pipErrors', [
        'pipErrors.Pages',
        'pipNoConnectionPanel',
        'pipClearErrors',
	    'pipFormErrors'
    ]);
    
})();
(function(module) {
try {
  module = angular.module('pipErrors.Templates');
} catch (e) {
  module = angular.module('pipErrors.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('maintenance/maintenance.html',
    '<div class="pip-error pip-empty layout-column flex layout-align-center-center">\n' +
    '    <div style="background-image: url(\'images/maintenance.svg\');" class="pip-pic"></div>\n' +
    '    <div class="pip-error-text">{{::\'ERROR_AVAILABLE_TITLE\' | translate}}</div>\n' +
    '    <div class="pip-error-subtext">{{::\'ERROR_AVAILABLE_SUBTITLE\' | translate}}</div>\n' +
    '    <div class="pip-error-subtext" ng-if="timeoutInterval">\n' +
    '        {{::\'ERROR_AVAILABLE_TRY_AGAIN\' | translate}} {{timeoutInterval}} sec.\n' +
    '    </div>\n' +
    '    <div class="pip-error-actions h48 layout-column layout-align-center-center"\n' +
    '         ng-if="isCordova">\n' +
    '        <md-button class="md-accent" ng-click="onClose($event)" aria-label="CLOSE" >\n' +
    '            {{::\'ERROR_AVAILABLE_CLOSE\' | translate}}\n' +
    '        </md-button>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipErrors.Templates');
} catch (e) {
  module = angular.module('pipErrors.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('missing_route/missing_route.html',
    '<div class="pip-error pip-empty layout-column flex layout-align-center-center">\n' +
    '    <div style="background-image: url(\'images/invalid_route.svg\');" class="pip-pic"></div>\n' +
    '    <div class="pip-error-text">{{::\'ERROR_ROUTE_TITLE\' | translate}}</div>\n' +
    '    <div class="pip-error-subtext">{{::\'ERROR_ROUTE_SUBTITLE\' | translate}}</div>\n' +
    '\n' +
    '    <div class="pip-error-actions h48 layout-column layout-align-center-center">\n' +
    '        <md-button aria-label="CONTINUE" class="md-accent" ng-click="onContinue($event)">\n' +
    '            {{::\'ERROR_ROUTE_CONTINUE\' | translate}}\n' +
    '        </md-button>\n' +
    '    </div>\n' +
    '    <div class="h48" ng-if="url"><a ng-href="{{url}}">\n' +
    '        {{::\'ERROR_ROUTE_TRY_AGAIN\' | translate }}: {{url}}\n' +
    '    </a></div>\n' +
    '    <div class="h48" ng-if="urlBack"><a ng-href="{{urlBack}}">\n' +
    '        {{::\'ERROR_ROUTE_GO_BACK\' | translate }}: {{urlBack}}\n' +
    '    </a></div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipErrors.Templates');
} catch (e) {
  module = angular.module('pipErrors.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('no_connection/no_connection.html',
    '<div class="pip-error pip-empty layout-column flex layout-align-center-center">\n' +
    '    <div style="background-image: url(\'images/no_response.svg\');" class="pip-pic"></div>\n' +
    '    <div class="pip-error-text">{{::\'ERROR_RESPONDING_TITLE\' | translate}}</div>\n' +
    '    <div class="pip-error-subtext">{{::\'ERROR_RESPONDING_SUBTITLE\' | translate}}</div>\n' +
    '\n' +
    '    <div class="pip-error-actions h48 layout-column layout-align-center-center">\n' +
    '        <md-button aria-label="RETRY" class="md-accent" ng-click="onRetry($event)">\n' +
    '            {{::\'ERROR_RESPONDING_RETRY\' | translate}}\n' +
    '        </md-button>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipErrors.Templates');
} catch (e) {
  module = angular.module('pipErrors.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('no_connection_panel/no_connection_panel.html',
    '    <div class="pip-empty pip-error layout-column layout-align-center-center flex">\n' +
    '        <img src="images/no_response.svg" class="pip-pic block" >\n' +
    '        \n' +
    '            <div class="pip-error-text">{{::\'ERROR_RESPONDING_TITLE\' | translate}}</div>\n' +
    '            <div class="pip-error-subtext">{{::\'ERROR_RESPONDING_SUBTITLE\' | translate}}</div>\n' +
    '\n' +
    '            <div class="pip-error-actions h48 layout-column layout-align-center-center">\n' +
    '                <md-button aria-label="RETRY" class="md-accent" ng-click="onRetry($event)">\n' +
    '                    {{::\'ERROR_RESPONDING_RETRY\' | translate}}\n' +
    '                </md-button>\n' +
    '            </div>\n' +
    '    </div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipErrors.Templates');
} catch (e) {
  module = angular.module('pipErrors.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('unknown/unknown.html',
    '<div class="pip-error pip-empty layout-column flex layout-align-center-center">\n' +
    '    <div style="background-image: url(\'images/unknown_error.svg\');" class="pip-pic"></div>\n' +
    '    <div class="pip-error-text">{{::\'ERROR_UNKNOWN_TITLE\' | translate}}</div>\n' +
    '    <div class="pip-error-subtext">{{::\'ERROR_UNKNOWN_SUBTITLE\' | translate}}</div>\n' +
    '\n' +
    '    <div class="pip-error-subtext" ng-if="showError && error_details && error_details.status">\n' +
    '        <div ng-if="error_details.code">Code: {{error_details.code}}</div>\n' +
    '        <div ng-if="error_details.description">Description: {{error_details.description}}</div>\n' +
    '        <div ng-if="error_details.status">HTTP status: {{error_details.status}}</div>\n' +
    '        <div ng-if="error_details.server_stacktrace">Server stacktrace: {{error_details.server_stacktrace}}</div>\n' +
    '        <div ng-if="error_details.client_stacktrace">Client stacktrace stacktrace: {{error_details.client_stacktrace}}</div>\n' +
    '    </div>\n' +
    '    <div class="pip-error-actions layout-column layout-align-center-center">\n' +
    '        <div class="h48" ng-if="isCordova">\n' +
    '            <md-button aria-label="CLOSE" class="md-accent" ng-click="onClose($event)">\n' +
    '                {{::\'ERROR_UNKNOWN_CLOSE\' | translate}}\n' +
    '            </md-button>\n' +
    '        </div>\n' +
    '        <div class="h48">\n' +
    '            <md-button aria-label="DETAILS" class="md-accent" ng-click="onDetails($event)">\n' +
    '                {{::\'ERROR_UNKNOWN_DETAILS\' | translate}}\n' +
    '            </md-button>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipErrors.Templates');
} catch (e) {
  module = angular.module('pipErrors.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('unsupported/unsupported.html',
    '<div class="pip-error pip-empty layout-column flex layout-align-center-center">\n' +
    '\n' +
    '    <div class="pip-error-text">{{::\'ERROR_UNSUPPORTED_TITLE\' | translate}}</div>\n' +
    '    <div class="pip-error-subtext">\n' +
    '        {{::\'ERROR_UNSUPPORTED_SUBTITLE\' | translate}}\n' +
    '    </div>\n' +
    '    <div class="pip-error-details layout-row layout-align-center-center" ng-if="$mdMedia(\'gt-xs\')">\n' +
    '        <div class="pip-error-details-item layout-column layout-align-center-center">\n' +
    '            <div style="background-image: url(\'images/ie.svg\');" class="pip-pic"></div>\n' +
    '            <div class="h64 tp16 bp16">\n' +
    '                <a class="text-body2 m0" target="_blank"\n' +
    '                   href="https://www.microsoft.com/en-us/download/internet-explorer-11-for-windows-7-details.aspx">\n' +
    '                    {{::\'ERROR_UNSUPPORTED_IE\' | translate}}\n' +
    '                </a>\n' +
    '                <p class="text-body1 m0"> {{::\'ERROR_UNSUPPORTED_IE_VER\' | translate}}</p>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="pip-error-details-item layout-column layout-align-center-center">\n' +
    '            <div style="background-image: url(\'images/fm.svg\');" class="pip-pic"></div>\n' +
    '            <div class="h64 tp16 bp16">\n' +
    '                <a class="text-body2 m0" target="_blank"\n' +
    '                   href="https://www.mozilla.org/ru/firefox/new/">\n' +
    '                    {{::\'ERROR_UNSUPPORTED_FM\' | translate}}\n' +
    '                </a>\n' +
    '                <p class="text-body1 m0"> {{::\'ERROR_UNSUPPORTED_FM_VER\' | translate}}</p>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="pip-error-details-item layout-column layout-align-center-center">\n' +
    '            <div style="background-image: url(\'images/gc.svg\');" class="pip-pic"></div>\n' +
    '            <div class="h64 tp16 bp16">\n' +
    '                <a class="text-body2 m0" target="_blank"\n' +
    '                   href="https://www.google.com/chrome/browser/desktop/index.html?platform=win64#">\n' +
    '                    {{::\'ERROR_UNSUPPORTED_GC\' | translate}}\n' +
    '                </a>\n' +
    '                <p class="text-body1 m0"> {{::\'ERROR_UNSUPPORTED_GC_VER\' | translate}}</p>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="pip-error-details-item layout-column layout-align-center-center">\n' +
    '            <div style="background-image: url(\'images/o.svg\');" class="pip-pic"></div>\n' +
    '            <div class="h64 tp16 bp16">\n' +
    '                <a class="text-body2 m0" target="_blank"\n' +
    '                   href="http://www.opera.com/ru/download">\n' +
    '                    {{::\'ERROR_UNSUPPORTED_O\' | translate}}\n' +
    '                </a>\n' +
    '                <p class="text-body1 m0"> {{::\'ERROR_UNSUPPORTED_O_VER\' | translate}}</p>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="pip-error-details" ng-if="$mdMedia(\'xs\')">\n' +
    '        <div class="layout-row layout-align-center-center">\n' +
    '            <div class="pip-error-details-item layout-column layout-align-center-center">\n' +
    '                <div style="background-image: url(\'images/ie.svg\');" class="pip-pic"></div>\n' +
    '                <div class="h64 tp16 bp16">\n' +
    '                    <a class="text-body2 m0" target="_blank"\n' +
    '                       href="https://www.microsoft.com/en-us/download/internet-explorer-11-for-windows-7-details.aspx">\n' +
    '                        {{::\'ERROR_UNSUPPORTED_IE\' | translate}}\n' +
    '                    </a>\n' +
    '                    <p class="text-body1 m0"> {{::\'ERROR_UNSUPPORTED_IE_VER\' | translate}}</p>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="pip-error-details-item layout-column layout-align-center-center">\n' +
    '                <div style="background-image: url(\'images/fm.svg\');" class="pip-pic"></div>\n' +
    '                <div class="h64 tp16 bp16">\n' +
    '                    <a class="text-body2 m0" target="_blank"\n' +
    '                       href="https://www.mozilla.org/ru/firefox/new/">\n' +
    '                        {{::\'ERROR_UNSUPPORTED_FM\' | translate}}\n' +
    '                    </a>\n' +
    '                    <p class="text-body1 m0"> {{::\'ERROR_UNSUPPORTED_FM_VER\' | translate}}</p>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="tm16 layout-row layout-align-center-center">\n' +
    '            <div class="pip-error-details-item layout-column layout-align-center-center">\n' +
    '                <div style="background-image: url(\'images/gc.svg\');" class="pip-pic"></div>\n' +
    '                <div class="h64 tp16 bp16">\n' +
    '                    <a class="text-body2 m0" target="_blank"\n' +
    '                       href="https://www.google.com/chrome/browser/desktop/index.html?platform=win64#">\n' +
    '                        {{::\'ERROR_UNSUPPORTED_GC\' | translate}}\n' +
    '                    </a>\n' +
    '                    <p class="text-body1 m0"> {{::\'ERROR_UNSUPPORTED_GC_VER\' | translate}}</p>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="pip-error-details-item layout-column layout-align-center-center">\n' +
    '                <div style="background-image: url(\'images/o.svg\');" class="pip-pic"></div>\n' +
    '                <div class="h64 tp16 bp16">\n' +
    '                    <a class="text-body2 m0" target="_blank"\n' +
    '                       href="http://www.opera.com/ru/download">\n' +
    '                        {{::\'ERROR_UNSUPPORTED_O\' | translate}}\n' +
    '                    </a>\n' +
    '                    <p class="text-body1 m0"> {{::\'ERROR_UNSUPPORTED_O_VER\' | translate}}</p>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

/**
 * @file Errors string resources
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipErrors.Strings', ['pipTranslate']);

    thisModule.run(['$injector', function($injector) {
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        if (pipTranslate == null) return;

        // Set translation strings for the module
        pipTranslate.translations('en', {
            'ERROR_ROUTE_TITLE': 'Sorry, the page isn\'t available',
            'ERROR_ROUTE_SUBTITLE': 'The link you followed may be broken, or the page may have been removed.',
            'ERROR_ROUTE_CONTINUE': 'Continue',
            'ERROR_ROUTE_TRY_AGAIN': 'Try again',
            'ERROR_ROUTE_GO_BACK': 'Go Back',
            'ERROR_ROUTE_PAGE_TITLE': 'Wrong page',

            'ERROR_UNKNOWN_TITLE': 'Oops. Something went wrong',
            'ERROR_UNKNOWN_SUBTITLE': 'Unknown error occurred, but don\'t worry we already have been notified.',
            'ERROR_UNKNOWN_CLOSE': 'Close',
            'ERROR_UNKNOWN_DETAILS': 'Details',

            'ERROR_AVAILABLE_TITLE': 'The server is on maintenance',
            'ERROR_AVAILABLE_SUBTITLE': 'Sorry for the inconvenience. This application is undergoing maintenance for ' +
                                            'a short period. We\'ll be back soon. Thank for your patience.',
            'ERROR_AVAILABLE_CLOSE': 'Close',
            'ERROR_AVAILABLE_TRY_AGAIN': 'Try after',

            'ERROR_RESPONDING_TITLE': 'No connection to the server',
            'ERROR_RESPONDING_SUBTITLE': 'Unable to connect to the server. Check your Internet connection and try again.',
            'ERROR_RESPONDING_RETRY': 'Retry',

            'ERROR_UNSUPPORTED_TITLE': 'This browser is not supported',
            'ERROR_UNSUPPORTED_SUBTITLE': 'Our application using the latest technology. This makes the application faster ' +
                                          'and easier to use. Unfortunately, your browser doesn\'t support those ' +
                                          'technologies. Download on of these great browsers and you\'ll be on your way:',
            'ERROR_UNSUPPORTED_O': 'Opera',
            'ERROR_UNSUPPORTED_O_VER': 'Version 36+',
            'ERROR_UNSUPPORTED_IE': 'Internet Explorer',
            'ERROR_UNSUPPORTED_IE_VER': 'Version 11+',
            'ERROR_UNSUPPORTED_GC': 'Google Chrome',
            'ERROR_UNSUPPORTED_GC_VER': 'Version 48+',
            'ERROR_UNSUPPORTED_FM': 'Mozilla Firefox',
            'ERROR_UNSUPPORTED_FM_VER': 'Version 45+'

        });

        pipTranslate.translations('ru', {
            'ERROR_ROUTE_TITLE': 'Sorry, the page isn\'t available',
            'ERROR_ROUTE_SUBTITLE': 'The link you followed may be broken, or the page may have been removed.',
            'ERROR_ROUTE_CONTINUE': 'Continue',
            'ERROR_ROUTE_TRY_AGAIN': 'Try again',
            'ERROR_ROUTE_GO_BACK': 'Go Back',
            'ERROR_ROUTE_PAGE_TITLE': 'Wrong page',

            'ERROR_UNKNOWN_TITLE': 'Oops. Something went wrong',
            'ERROR_UNKNOWN_SUBTITLE': 'Unknown error occurred, but don\'t worry we already have been notified.',
            'ERROR_UNKNOWN_CLOSE': 'Close',
            'ERROR_UNKNOWN_DETAILS': 'Details',

            'ERROR_AVAILABLE_TITLE': 'The server is on maintenance',
            'ERROR_AVAILABLE_SUBTITLE': 'Sorry for the inconvenience. This application is undergoing maintenance for ' +
            'a short period. We\'ll be back soon. Thank for your patience.',
            'ERROR_AVAILABLE_CLOSE': 'Close',
            'ERROR_AVAILABLE_TRY_AGAIN': 'Try after',

            'ERROR_RESPONDING_TITLE': 'No connection to the server',
            'ERROR_RESPONDING_SUBTITLE': 'Unable to connect to server. Check your Internet connection and try again.',
            'ERROR_RESPONDING_RETRY': 'Retry',

            'ERROR_UNSUPPORTED_TITLE': 'This browser is not supported',
            'ERROR_UNSUPPORTED_SUBTITLE': 'Our application using the latest technology. This makes the application faster ' +
            'and easier to use. Unfortunately, your browser doesn\'t support those ' +
            'technologies. Download on of these great browsers and you\'ll be on your way:',            
            'ERROR_UNSUPPORTED_O': 'Opera',
            'ERROR_UNSUPPORTED_O_VER': 'Version 35+',
            'ERROR_UNSUPPORTED_IE': 'Internet Explorer',
            'ERROR_UNSUPPORTED_IE_VER': 'Version 11+',
            'ERROR_UNSUPPORTED_GC': 'Google Chrome',
            'ERROR_UNSUPPORTED_GC_VER': 'Version 47+',
            'ERROR_UNSUPPORTED_FM': 'Mozilla Firefox',
            'ERROR_UNSUPPORTED_FM_VER': 'Version 43+'

        });
    }]);

})();
/**
 * @file Optional filter to translate string resources
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipErrors.Translate', []);

    thisModule.filter('translate', ['$injector', function ($injector) {
        var pipTranslate = $injector.has('pipTranslate') 
            ? $injector.get('pipTranslate') : null;

        return function (key) {
            return pipTranslate  ? pipTranslate.translate(key) || key : key;
        }
    }]);

})();

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipErrors.Pages', [
        'ngMaterial', 
        'pipErrors.Strings', 'pipErrors.NoConnection', 'pipErrors.MissingRoute', 'pipErrors.Unsupported',
        'pipErrors.Unknown', 'pipErrors.Maintenance', 'pipErrors.Translate', 'pipErrors.Templates'
    ]);

    thisModule.config(
        ['$stateProvider', function ($stateProvider) {
            // Configure module routes
            $stateProvider
                .state('errors_no_connection', {
                    url: '/errors/no_connection',
                    params: {
                        error: null
                    },
                    controller: 'pipErrorNoConnectionController',
                    templateUrl: 'no_connection/no_connection.html'
                })
                .state('errors_maintenance', {
                    url: '/errors/maintenance',
                    params: {
                        error: null
                    },
                    controller: 'pipErrorMaintenanceController',
                    templateUrl: 'maintenance/maintenance.html'
                })
                .state('errors_missing_route', {
                    url: '/errors/missing_route',
                    params: {
                        unfoundState: null,
                        fromState: null
                    },
                    controller: 'pipErrorMissingRouteController',
                    templateUrl: 'missing_route/missing_route.html'
                })
                .state('errors_unsupported', {
                    url: '/errors/unsupported',
                    params: {
                        error: null
                    },
                    controller: 'pipErrorUnsupportedController',
                    templateUrl: 'unsupported/unsupported.html'
                })
                .state('errors_unknown', {
                    url: '/errors/unknown',
                    params: {
                        error: null
                    },
                    controller: 'pipErrorUnknownController',
                    templateUrl: 'unknown/unknown.html'
                });
        }]);

})();
/**
 * @file Special error handling for forms
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipClearErrors', []);

    thisModule.directive('pipClearErrors', function () {
        return {
            restrict: 'A',
            require: ['ngModel', '^?form'],
            link: function ($scope, $element, $attrs, $ctrls) {
                var 
                    fieldController = $ctrls[0],
                    formController = $ctrls[1];

                $scope.$watch($attrs.ngModel, function (newValue) {
                    clearFieldErrors();
                    clearFormErrors();
                });

                //-------------------

                function clearFieldErrors() {
                    var errors = fieldController.$error;

                    for (var prop in errors) {
                        if (errors.hasOwnProperty(prop) && prop.substring(0, 6) == 'ERROR_') {
                            fieldController.$setValidity(prop, true);
                        }
                    };
                }

                function clearFormErrors() {
                    formController.$serverError = {};
                };
            }
        };
    });

})();
/**
 * @file Form error utilities
 * @copyright Digital Living Software Corp. 2014-2016
 *
 */
 
 /* global _, angular */
 
(function () {
    'use strict';

    var thisModule = angular.module('pipFormErrors', []);

    thisModule.factory('pipFormErrors', ['$rootScope', function ($rootScope) {
		return {
			errorsWithHint: errorsWithHint,
            //submittedErrors: submittedErrors,
            //submittedErrorsWithHint: submittedErrorsWithHint,
            //dirtyErrors: dirtyErrors,
            //dirtyErrorsWithHint: dirtyErrorsWithHint,
            //touchedErrors: touchedErrors,            
            touchedErrorsWithHint: touchedErrorsWithHint,
            resetFormErrors: resetFormErrors,
            setFormError: setFormError,
            resetFieldsErrors: resetFieldsErrors
		};
		//-------------------

        function errorsWithHint(field) {
            if (field == null) return;
			
            return _.isEmpty(field.$error) ? { hint: true } : field.$error;
        };
		
//         function submittedErrors(form, field) {
//             if (form == null) throw new Error('Form is not set');
//             if (field == null) throw new Error('Field is not set');
// 
//             if (form.$submitted)
//                 return field.$error;
//             return {};
//         };
// 
//         function submittedErrorsWithHint(form, field) {
//             if (form == null) throw new Error('Form is not set');
//             if (field == null) throw new Error('Field is not set');
// 
//             if (form.$submitted) {
//                 return _.isEmpty(field.$error) ? { hint: true} : field.$error;
//             }
//             return { hint: true };
//         };
// 
//         function dirtyErrors(form, field) {
//             if (form == null) throw new Error('Form is not set');
//             if (field == null) throw new Error('Field is not set');
// 
//             if (field.$dirty || form.$dirty)
//                 return field.$error;
//             return {};
//         };
// 
//         function dirtyErrorsWithHint(form, field) {
//             if (form == null) throw new Error('Form is not set');
//             if (field == null) throw new Error('Field is not set');
// 
//             if (field.$dirty || form.$dirty) {
//                 return _.isEmpty(field.$error) ? { hint: true} : field.$error;
//             }
//             return { hint: true };
//         };
// 
//         function touchedErrors(form, field) {
//             if (form == null) throw new Error('Form is not set');
//             if (field == null) throw new Error('Field is not set');
//             
//             if (field.$touched || form.$dirty)
//                 return field.$error;
//             return {};
//         };

        function touchedErrorsWithHint(form, field) {
            if (form == null) return;
            if (field == null) return;

            if (form.$submitted && (field.$touched || form.$dirty) || !form.$submitted && (field.$touched || field.$dirty)) {
                var result = _.isEmpty(field.$error) ? { hint: true} : field.$error;
                return result;
            }
            return { hint: true };
        };

        function resetFormErrors(form, errors) {
            form.$setPristine();
            form.$setUntouched();

            if (errors) {
                form.$setDirty();
                form.$setSubmitted();
            }

            form.$serverError = {};
        };
        
        function resetFieldsErrors(form, field) {
            if (!form) return;
            if (field && form[field] && form[field].$error) {
                 form[field].$error = {};
            } else {
                for (var prop in form) {
                    if (form[prop] && form[prop].$error) {
                        form[prop].$error = {};
                    };
                }
                if (form && form.$error) form.$error = {};
            }
        };
        
        function setFormError(form, error, errorFieldMap) {
            if (error == null) return;
            // Prepare form server errors
            form.$serverError = form.$serverError || {};
            // Prepare error code
            var code = error.code || (error.data || {}).code || null;
            if (!code && error.status) code = error.status;

            if (code) {
                var 
                    errorName = 'ERROR_' + code,
                    field = errorFieldMap ? errorFieldMap[code] : null;
                // Set server error to fields
                if (field && form[field] && form[field].$setValidity) {
                    form[field].$setValidity(errorName, false);
                    return;
                }

                // Set server error to form
                if (field == 'form') {
                    form.$serverError[errorName] = true;
                    return;
                }
            }

            // if undefined error for this form or code === undefined/null, go to unhandled error page
            if (error.data && error.data.message) {
                form.$serverError['ERROR_UNKNOWN'] = error.data.message;
                goToUnhandledErrorPage(error);
                return;
            }

            // Set as undefined error
            if (error.message) {
                form.$serverError['ERROR_UNKNOWN'] = error.message;
                goToUnhandledErrorPage(error);
                return;
            }

            if (error.name) {
                form.$serverError['ERROR_UNKNOWN'] = error.name;
                goToUnhandledErrorPage(error);
                return;
            }

            form.$serverError['ERROR_UNKNOWN'] = error;
            goToUnhandledErrorPage(error);
        };

        function goToUnhandledErrorPage(error) {
            $rootScope.$emit('pipUnhandledInternalError', {
                error: error
            });
        };
        
	}]);

})();
/**
 * @file Maintenance error controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipErrors.Maintenance', []);

    thisModule.controller('pipErrorMaintenanceController', ['$scope', '$state', '$rootScope', 'pipAppBar', function ($scope, $state, $rootScope, pipAppBar) {

        $rootScope.$routing = false;
        $scope.isCordova = false;
        appHeader();

        $scope.error = $state && $state.params && $state.params.error ?  $state.params.error : {};
        $scope.timeoutInterval = $scope.error && $scope.error.config &&
                        $scope.error.config.params && $scope.error.config.params.interval ? $scope.error.config.params.interval : 0;

        $scope.onClose = onClose;

        return;

        // Todo: Made dependencies optional
        function appHeader() {
            pipAppBar.showMenuNavIcon();
            pipAppBar.showShadow();
            pipAppBar.showTitleBreadcrumb('ERROR_AVAILABLE_TITLE', []);
            pipAppBar.showLocalActions(null, []);
        };

        function onClose() {

        };

    }]);

})();

/**
 * @file Missing route error controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipErrors.MissingRoute', []);

    thisModule.controller('pipErrorMissingRouteController', ['$scope', '$state', '$rootScope', 'pipAppBar', function ($scope, $state, $rootScope, pipAppBar) {

        appHeader();
        $rootScope.$routing = false;

        $scope.error = $state && $state.params && $state.params.error ?  $state.params.fromState : {};
        $scope.unfoundState = $state && $state.params ?  $state.params.unfoundState : {};
        $scope.url = $scope.unfoundState && $scope.unfoundState.to ? $state.href($scope.unfoundState.to, $scope.unfoundState.toParams, {absolute: true}) : '';
        $scope.urlBack = $scope.fromState && $scope.fromState.to ? $state.href($scope.fromState.to, $scope.fromState.fromParams, {absolute: true}) : '';

        $scope.onContinue = onContinue;

        return;

        // Todo: Made dependencies optional
        function appHeader() {
            pipAppBar.showMenuNavIcon();
            pipAppBar.showShadow();
            pipAppBar.showTitleBreadcrumb('ERROR_ROUTE_PAGE_TITLE', []);
            pipAppBar.showLocalActions(null, []);
        };

        function onContinue() {
            // Todo: Go to default state '/'
            //pipAuthState.goToAuthorized();
        };

    }]);

})();

/**
 * @file No connection error controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipErrors.NoConnection', []);

    thisModule.controller('pipErrorNoConnectionController', ['$scope', '$state', '$rootScope', '$window', 'pipAppBar', function ($scope, $state, $rootScope, $window, pipAppBar) {

        $rootScope.$routing = false;
        appHeader();

        $scope.error = $state && $state.params && $state.params.error ?  $state.params.error : {};

        $scope.onRetry = onRetry;

        return;

        function onRetry() {
            $window.history.back();
        };

        // Todo: Made dependencies optional
        function appHeader() {
            pipAppBar.showMenuNavIcon();
            pipAppBar.showShadow();
            pipAppBar.showTitleBreadcrumb('ERROR_RESPONDING_TITLE', []);
            pipAppBar.showLocalActions(null, []);
        };

    }]);


})();

/**
 * @file No Connection Error panel
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipNoConnectionPanel", ['pipErrors.Translate']);

    thisModule.directive('pipNoConnectionPanel',
        function () {
            return {
                restrict: 'E',
                scope: {
                    error: '=pipError',
                    retry: '=pipRetry'
                },
                templateUrl: 'no_connection_panel/no_connection_panel.html',
                controller: 'pipNoConnectionPanelController'
            };
        }
    );

    thisModule.controller('pipNoConnectionPanelController',
        ['$scope', '$element', '$attrs', 'pipTranslate', function ($scope, $element, $attrs, pipTranslate) {

            $scope.onRetry = onRetry;

            return;

            function onRetry() {
                if ($scope.retry && angular.isFunction($scope.retry)) $scope.retry();
            };

        }]
    );

})();


/**
 * @file Unknown error controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipErrors.Unknown', []);

    thisModule.controller('pipErrorUnknownController', ['$scope', '$state', '$rootScope', 'pipAppBar', function ($scope, $state, $rootScope, pipAppBar) {

        $rootScope.$routing = false;
        $scope.isCordova = false;
        appHeader();

        $scope.error = $state && $state.params && $state.params.error ?  $state.params.error : {};
        $scope.error_details = null;

        $scope.onDetails = onDetails;
        $scope.onClose = onClose;

        parseError();

        return;

        // Todo: Made dependencies optional
        function appHeader() {
            pipAppBar.showMenuNavIcon();
            pipAppBar.showShadow();
            pipAppBar.showTitleBreadcrumb('ERROR_UNKNOWN_TITLE', []);
            pipAppBar.showLocalActions(null, []);
        };

        function parseError() {
            $scope.error_details = {};
            $scope.error_details.code = $scope.error.code;
            $scope.error_details.description = $scope.error.message;
            $scope.error_details.status = $scope.error.status;

            $scope.error_details.server_stacktrace = function () {

            };

            $scope.error_details.client_stacktrace = function () {

            };
        };

        function onDetails() {
            $scope.showError = true;
        };

        function onClose() {

        };

    }]);

})();

/**
 * @file Unsupported error controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipErrors.Unsupported', []);

    thisModule.controller('pipErrorUnsupportedController', ['$scope', '$state', '$rootScope', '$mdMedia', 'pipAppBar', function ($scope, $state, $rootScope, $mdMedia, pipAppBar) {

        $scope.$mdMedia = $mdMedia;
        $rootScope.$routing = false;
        appHeader();

        $scope.error = $state && $state.params && $state.params.error ?  $state.params.error : {};

        return;

        // Todo: Made dependencies optional
        function appHeader() {
            pipAppBar.showMenuNavIcon();
            pipAppBar.showShadow();
            pipAppBar.showTitleBreadcrumb('ERROR_UNSUPPORTED_TITLE', []);
            pipAppBar.showLocalActions(null, []);
        };

    }]);

})();



/**
 * @file Registration of chart WebUI controls
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function (angular) {
    'use strict';

    angular.module('pipCharts', [
        'pipBarCharts',
        'pipLineCharts',
        'pipPieCharts',
        'pipChartLegends'
    ]);

})(window.angular);


(function(module) {
try {
  module = angular.module('pipCharts.Templates');
} catch (e) {
  module = angular.module('pipCharts.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('bar/bar_chart.html',
    '<div class="bar-chart flex-auto layout-column">\n' +
    '    <svg class="flex-auto"></svg>\n' +
    '</div>\n' +
    '\n' +
    '<pip-chart-legend pip-series="barChart.legend" pip-interactive="false"></pip-chart-legend>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipCharts.Templates');
} catch (e) {
  module = angular.module('pipCharts.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('legend/interactive_legend.html',
    '<div >\n' +
    '    <div class="chart-legend-item" ng-repeat="item in series">\n' +
    '        <md-checkbox class="lp16 m8"\n' +
    '                     ng-model="item.disabled"\n' +
    '                     ng-true-value="false"\n' +
    '                     ng-false-value="true"\n' +
    '                     ng-if="interactive"\n' +
    '                     aria-label="{{ item.label }}">\n' +
    '            <p class="legend-item-value"\n' +
    '               ng-style="{\'background-color\': item.color}">\n' +
    '                {{ item.value }}\n' +
    '            </p>\n' +
    '            <p class="legend-item-label">{{:: item.label || item.key }}</p>\n' +
    '        </md-checkbox>\n' +
    '\n' +
    '        <div ng-if="!interactive">\n' +
    '            <span class="bullet" ng-style="{\'background-color\': item.color}"></span>\n' +
    '            <span>{{:: item.label || item.key}}</span>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipCharts.Templates');
} catch (e) {
  module = angular.module('pipCharts.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('line/line_chart.html',
    '<div class="line-chart" flex="auto" layout="column">\n' +
    '    <svg class="flex-auto" ng-class="{\'visible-x-axis\': lineChart.isVisibleX(), \'visible-y-axis\': lineChart.isVisibleY()}">\n' +
    '    </svg>\n' +
    '</div>\n' +
    '\n' +
    '<pip-chart-legend pip-series="lineChart.data" pip-interactive="false"></pip-chart-legend>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipCharts.Templates');
} catch (e) {
  module = angular.module('pipCharts.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('pie/pie_chart.html',
    '<div class="pie-chart" flex="auto" layout="column">\n' +
    '    <svg class="flex-auto"></svg>\n' +
    '</div>\n' +
    '\n' +
    '<pip-chart-legend pip-series="pieChart.data" pip-interactive="false"></pip-chart-legend>');
}]);
})();

(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name pipBarCharts
     *
     * @description
     * Bar chart on top of Rickshaw charts
     */
    angular.module('pipBarCharts', [])
        .directive('pipBarChart', pipBarChart);

    function pipBarChart() {
        return {
            restrict: 'E',
            scope: {
                series: '=pipSeries'
            },
            bindToController: true,
            controllerAs: 'barChart',
            templateUrl: 'bar/bar_chart.html',
            controller: ['$element', '$scope', '$timeout', '$interval', '$mdColorPalette', function ($element, $scope, $timeout, $interval, $mdColorPalette) {
                var vm = this;
                var chart = null;
                var chartElem = null;
                var colors = _.map($mdColorPalette, function (palette, color) {
                    return color;
                });

                vm.data = vm.series || [];

                if ((vm.series || []).length > colors.length) {
                    vm.data = vm.series.slice(0, 9);
                }

                //colors = _.sample(colors, colors.length);

                // sets legend params
                vm.legend = vm.data[0].values;
                
                // Sets colors of items
                generateParameterColor();

                d3.scale.paletteColors = function () {
                    return d3.scale.ordinal().range(colors.map(materialColorToRgba));
                };

                $scope.$watch('barChart.series', function (updatedSeries) {
                    vm.data = updatedSeries || [];

                    generateParameterColor();

                    if (chart) {
                        chartElem.datum(vm.data).call(chart);
                        chart.update();
                        intervalUpdate(chart.update, 10);
                    }
                });


                /**
                 * Instantiate chart
                 */
                nv.addGraph(function () {
                    chart = nv.models.discreteBarChart()
                        .margin({top: 10, right: 0, bottom: 0, left: -50})
                        .x(function (d) { return d.label; })
                        .y(function (d) { return d.value; })
                        .showValues(true)
                        .showXAxis(false)
                        .showYAxis(false)
                        .valueFormat(d3.format('d'))
                        .duration(0)
                        .height(270)
                        .color(function(d) {
                            return d.color || d3.scale.paletteColors().range();
                        });

                    chart.tooltip.enabled(false);
                    chart.noData('No data for this moment...');

                    chartElem = d3.select($element.get(0))
                        .select('.bar-chart svg')
                        .datum(vm.data)
                        .style('height', 270)
                        .call(chart);

                    //nv.utils.windowResize(chart.update);

                    return chart;
                }, function () {
                    chart.dispatch.on('beforeUpdate', function () {
                        $timeout(configBarWidthAndLabel, 0);
                    });

                    $timeout(configBarWidthAndLabel, 0);
                });

                /**
                 * Aligns value label according to parent container size.
                 * @return {void}
                 */
                function configBarWidthAndLabel() {
                    var labels = d3.selectAll('.nv-bar text')[0],
                        chartBars = d3.selectAll('.nv-bar')[0],
                        legendTitles = d3.selectAll('.legend-title')[0],
                        parentHeight = d3.select('.nvd3-svg')[0][0].getBBox().height;

                    d3.select('.bar-chart').classed('visible', true);

                    chartBars.forEach(function (item, index) {
                        var barSize = item.getBBox(),
                            element = d3.select(item),
                            y = d3.transform(element.attr('transform')).translate[1];
                        
                        element
                            .attr('transform', 'translate(' + Number(index * (38 + 8) + 50) + ', ' + parentHeight + ')')
                            .select('rect')
                            .attr('width', 38);

                        element
                            .transition()
                            .duration(1000)
                            .attr('transform', 'translate(' + Number(index * (38 + 8) + 50) + ', ' + y + ')');

                        d3.select(labels[index])
                            .attr('dy', barSize.height / 2)
                            .attr('x', 19);
                    });

                    legendTitles.forEach(function (item, index) {
                        $timeout(function () {
                            $(item).addClass('visible');
                        }, 200 * index);
                    });
                }

                /**
                 * Converts palette color name into RGBA color representation.
                 * Should by replaced by palette for charts.
                 *
                 * @param {string} color    Name of color from AM palette
                 * @returns {string} RGBa format
                 */
                function materialColorToRgba(color) {
                    return 'rgba(' + $mdColorPalette[color][500].value[0] + ','
                        + $mdColorPalette[color][500].value[1] + ','
                        + $mdColorPalette[color][500].value[2] + ','
                        + ($mdColorPalette[color][500].value[3] || 1) + ')';
                }

                /**
                 * Helpful method
                 * @private
                 */
                function generateParameterColor() {
                    vm.legend.forEach(function (item, index) {
                        item.color = item.color || materialColorToRgba(colors[index]);
                    });
                }
            }]
        };
    }
})();
(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name pipLegends
     *
     * @description
     * Legend of charts
     */
    angular.module('pipChartLegends', [])
        .directive('pipChartLegend', pipChartLegend);

    function pipChartLegend() {
        return {
            restrict: 'E',
            scope: {
                series: '=pipSeries',
                interactive: '=pipInteractive'
            },
            templateUrl: 'legend/interactive_legend.html',
            controller: ['$element', '$scope', '$timeout', '$mdColorPalette', function ($element, $scope, $timeout, $mdColorPalette) {
                var colors = _.map($mdColorPalette, function (palette) {
                    return palette[500].hex;
                });

                function colorCheckboxes() {
                    var checkboxContainers = $($element).find('md-checkbox .md-container');
                    
                    checkboxContainers.each(function (index, item) {
                        $(item)
                            .css('color', $scope.series[index].color || colors[index])
                            .find('.md-icon')
                            .css('background-color', $scope.series[index].color || colors[index]);
                    });
                }

                function animate() {
                    var legendTitles = $($element).find('.chart-legend-item');

                    legendTitles.each(function (index, item) {
                        $timeout(function () {
                            $(item).addClass('visible');
                        }, 200 * index);
                    });
                }
                
                function prepareSeries() {
                    $scope.series.forEach(function (item, index) {
                        item.color = item.color || colors[index];
                        item.disabled = item.disabled || false;
                    });   
                }

                $scope.$watch('series', function () {
                    $timeout(function () {
                        animate();
                        colorCheckboxes();
                    }, 0);
                    prepareSeries();
                }, true);

                $scope.$watch('interactive', function (newValue, oldValue) {
                    if (newValue == true && newValue != oldValue) {
                        $timeout(colorCheckboxes, 0);
                    }
                });

                $timeout(function () {
                    animate();
                    colorCheckboxes();
                }, 0);
                prepareSeries();
            }]
        };
    }
})();
(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name pipLineCharts
     *
     * @description
     * Line chart on top of Rickshaw charts
     */
    angular.module('pipLineCharts', [])
        .directive('pipLineChart', pipLineChart);

    function pipLineChart() {
        return {
            restrict: 'E',
            scope: {
                series: '=pipSeries',
                showYAxis: '=pipYAxis',
                showXAxis: '=pipXAxis'
            },
            bindToController: true,
            controllerAs: 'lineChart',
            templateUrl: 'line/line_chart.html',
            controller: ['$element', '$scope', '$timeout', '$interval', '$mdColorPalette', function ($element, $scope, $timeout, $interval, $mdColorPalette) {
                var vm        = this;
                var chart     = null;
                var chartElem = null;
                var colors    = _.map($mdColorPalette, function (palette, color) {
                    return color;
                });

                vm.data = vm.series || [];
                
                vm.isVisibleX = function () {
                    return vm.showXAxis == undefined ? true : vm.showXAxis; 
                };

                vm.isVisibleY = function () {
                    return vm.showYAxis == undefined ? true : vm.showYAxis;
                };
                
                if (vm.series.length > colors.length) {
                    vm.data = vm.series.slice(0, 9);
                }
                
                //colors = _.sample(colors, colors.length);

                // Sets colors of items
                generateParameterColor();

                d3.scale.paletteColors = function () {
                    return d3.scale.ordinal().range(colors.map(materialColorToRgba));
                };

                $scope.$watch('lineChart.series', function (updatedSeries) {
                    vm.data = updatedSeries;

                    generateParameterColor();

                    if (chart) {
                        chartElem.datum(vm.data).call(chart);
                    }
                }, true);

                /**
                 * Instantiate chart
                 */
                nv.addGraph(function () {
                    chart = nv.models.lineChart()
                        .margin({ top: 20, right: 20, bottom: 30, left: 30 })
                        .x(function (d) {
                            return d.x;
                        })
                        .y(function (d) {
                            return d.value;
                        })
                        .height(270)
                        .useInteractiveGuideline(true)
                        .showXAxis(true)
                        .showYAxis(true)
                        .showLegend(false)
                        .color(function(d) {
                            return d.color || d3.scale.paletteColors().range();
                        });

                    chart.tooltip.enabled(false);
                    chart.noData('No data for this moment...');

                    chart.yAxis
                        .tickFormat(function (d) {
                            return d / 1000 + 'k';
                        });

                    chart.xAxis
                        .tickFormat(function (d) {
                            return d;
                        });

                    chartElem = d3.select($element.get(0)).select('.line-chart svg');
                    chartElem.datum(vm.data).style('height', 270).call(chart);

                    nv.utils.windowResize(chart.update);

                    return chart;
                }, function () {
                    var legendTitles = d3.selectAll('.legend-title')[0];
                    
                    legendTitles.forEach(function (item, index) {
                        $timeout(function () {
                            $(item).addClass('visible');
                        }, 200 * index);
                    });
                });

                /**
                 * Converts palette color name into RGBA color representation.
                 * Should by replaced by palette for charts.
                 *
                 * @param {string} color    Name of color from AM palette
                 * @returns {string} RGBa format
                 */
                function materialColorToRgba(color) {
                    return 'rgba(' + $mdColorPalette[color][500].value[0] + ','
                        + $mdColorPalette[color][500].value[1] + ','
                        + $mdColorPalette[color][500].value[2] + ','
                        + ($mdColorPalette[color][500].value[3] || 1) + ')';
                }

                /**
                 * Helpful method
                 * @private
                 */
                function generateParameterColor() {
                    vm.data.forEach(function (item, index) {
                        item.color = item.color || materialColorToRgba(colors[index]);
                    });
                }
            }]
        };
    }
})();
(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name pipPieCharts
     *
     * @description
     * Line chart on top of Rickshaw charts
     */
    angular.module('pipPieCharts', [])
        .directive('pipPieChart', pipPieChart);

    function pipPieChart() {
        return {
            restrict: 'E',
            scope: {
                series: '=pipSeries'
            },
            bindToController: true,
            controllerAs: 'pieChart',
            templateUrl: 'pie/pie_chart.html',
            controller: ['$element', '$scope', '$timeout', '$interval', '$mdColorPalette', function ($element, $scope, $timeout, $interval, $mdColorPalette) {
                var vm               = this;
                var chart            = null;
                var titleElem        = null;
                var chartElem        = null;
                var colors           = _.map($mdColorPalette, function (palette, color) {
                    return color;
                });
                var resizeTitleLabel = resizeTitleLabelUnwrap;

                vm.data = vm.data || [];

                if (vm.series.length > colors.length) {
                    vm.data = vm.series.slice(0, 9);
                }

                $scope.$watch('pieChart.series', function (newVal) {
                    vm.data = newVal;

                    generateParameterColor();

                    if (chart) {
                        chartElem.datum(vm.data).call(chart);
                        $timeout(resizeTitleLabel);
                    }
                }, true);

                // Sets colors of items
                generateParameterColor();

                d3.scale.paletteColors = function () {
                    return d3.scale.ordinal().range(colors.map(materialColorToRgba));
                };

                /**
                 * Instantiate chart
                 */
                nv.addGraph(function () {
                    chart = nv.models.pieChart()
                        .margin({ top: 0, right: 0, bottom: 0, left: 0 })
                        .x(function (d) {
                            return d.value;
                        })
                        .y(function (d) {
                            return d.value;
                        })
                        .height(250)
                        .width(250)
                        .showLabels(true)
                        .labelThreshold(.001)
                        .growOnHover(false)
                        .donut(true)
                        .donutRatio(0.5)
                        .color(function(d) {
                            return d.color || d3.scale.paletteColors().range();
                        });

                    chart.tooltip.enabled(false);
                    chart.noData('No data for this moment...');
                    chart.showLegend(false);

                    chartElem = d3.select($element.get(0))
                        .select('.pie-chart svg')
                        .attr('height', 250)
                        .style('opacity', 0)
                        .datum(vm.data)
                        .call(chart);

                    nv.utils.windowResize(function () {
                        chart.update();
                        $timeout(resizeTitleLabel);
                    });

                    return chart;
                }, function () {
                    $timeout(renderTotalLabel);
                });

                function renderTotalLabel() {
                    var legendTitles = d3.selectAll('.legend-title')[0];
                    var svgElem  = d3.select($element.get(0)).select('.pie-chart svg')[0][0];
                    var totalVal = vm.data.reduce(function (sum, curr) {
                        return sum + curr.value;
                    }, 0);

                    d3.select(svgElem)
                        .select('.nv-pie:not(.nvd3)')
                        .append('text')
                        .classed('label-total', true)
                        .attr('text-anchor', 'middle')
                        .style('dominant-baseline', 'central')
                        .text(totalVal);
                    
                    d3.select(svgElem)
                        .transition()
                        .duration(1000)
                        .style('opacity', 1);

                    titleElem = d3.select($element.find('text.label-total').get(0));
                    resizeTitleLabel();

                    legendTitles.forEach(function (item, index) {
                        $timeout(function () {
                            $(item).addClass('visible');
                        }, 200 * index);
                    });
                }

                function resizeTitleLabelUnwrap() {
                    var boxSize = $element.find('.nv-pieLabels').get(0).getBBox();

                    if (!boxSize.width || !boxSize.height) {
                        return;
                    }

                    titleElem.style('font-size', ~~boxSize.width / 2);
                }

                /**
                 * Converts palette color name into RGBA color representation.
                 * Should by replaced by palette for charts.
                 *
                 * @param {string} color    Name of color from AM palette
                 * @returns {string} RGBa format
                 */
                function materialColorToRgba(color) {
                    return 'rgba(' + $mdColorPalette[color][500].value[0] + ','
                        + $mdColorPalette[color][500].value[1] + ','
                        + $mdColorPalette[color][500].value[2] + ','
                        + ($mdColorPalette[color][500].value[3] || 1) + ')';
                }


                /**
                 * Helpful method
                 * @private
                 */
                function generateParameterColor() {
                    vm.data.forEach(function (item, index) {
                        item.color = item.color || materialColorToRgba(colors[index]);
                    });
                }
            }]
        };
    }
})();


/**
 * @file Registration of settings components
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
    'use strict';

    angular.module('pipSettings', [
        'pipSettings.Service',
        'pipSettings.Page'
    ]);

})(window.angular);

(function(module) {
try {
  module = angular.module('pipSettings.Templates');
} catch (e) {
  module = angular.module('pipSettings.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('settings_page/settings_page.html',
    '<md-toolbar class="pip-appbar-ext"></md-toolbar>\n' +
    '<pip-document width="800" min-height="400"\n' +
    '              class="pip-settings">\n' +
    '\n' +
    '    <div class="pip-menu-container"\n' +
    '         ng-hide="manager === false || !tabs || tabs.length < 1">\n' +
    '        <md-list class="pip-menu pip-simple-list hide-xs"\n' +
    '                 pip-selected="selected.tabIndex"\n' +
    '                 pip-selected-watch="selected.navId"\n' +
    '                 pip-select="onNavigationSelect($event.id)">\n' +
    '            <md-list-item class="pip-simple-list-item pip-selectable flex"\n' +
    '                          ng-repeat="tab in tabs track by tab.state" ng-if="$party.id == $user.id ||\n' +
    '                          tab.state == \'settings.basic_info\'|| tab.state ==\'settings.contact_info\'\n' +
    '                          || tab.state ==\'settings.blacklist\'"\n' +
    '                          md-ink-ripple\n' +
    '                          pip-id="{{:: tab.state }}">\n' +
    '                <p>{{::tab.title | translate}}</p>\n' +
    '            </md-list-item>\n' +
    '        </md-list>\n' +
    '\n' +
    '        <div class="pip-content-container" ng-if="selected.tab">\n' +
    '            <pip-dropdown class="hide-gt-xs"\n' +
    '                          pip-actions="tabs"\n' +
    '                          pip-dropdown-select="onDropdownSelect"\n' +
    '                          pip-active-index="selected.tabIndex"></pip-dropdown>\n' +
    '\n' +
    '            <div class="pip-body tp24-flex layout-column" ui-view></div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="layout-column layout-align-center-center flex"\n' +
    '         ng-show="manager === false || !tabs || tabs.length < 1">\n' +
    '        {{::\'ERROR_400\' | translate}}\n' +
    '    </div>\n' +
    '</pip-document>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipSettings.Templates');
} catch (e) {
  module = angular.module('pipSettings.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('user_settings/user_settings_basic_info.html',
    '<form name="form" class="w-stretch" novalidate>\n' +
    '    <md-progress-linear class="pip-progress-top"\n' +
    '                        ng-show="transaction.busy()"\n' +
    '                        md-mode="indeterminate"></md-progress-linear>\n' +
    '    <div class="layout-row bm12">\n' +
    '        <div class="md-tile-left">\n' +
    '            <pip-avatar-edit pip-party-id="$party.id"\n' +
    '                             pip-created="onPictureCreated($event)"\n' +
    '                             pip-changed="onPictureChanged($control, $event)">\n' +
    '            </pip-avatar-edit>\n' +
    '        </div>\n' +
    '        <div class="md-tile-content tp0 layout-align-center">\n' +
    '            <h3 class="tm16 bm8 text-one-line">{{ nameCopy }}</h3>\n' +
    '\n' +
    '            <p class="text-primary text-overflow m0">\n' +
    '                {{::\'SETTINGS_BASIC_INFO_FROM\' | translate}}\n' +
    '                {{$user.signup | formatLongDate }}\n' +
    '            </p>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <md-input-container class="md-block">\n' +
    '        <label>{{::\'SETTINGS_BASIC_INFO_FULL_NAME\' | translate}}</label>\n' +
    '        <input name="fullName" step="any" type="text" tabindex="0" required\n' +
    '               ng-model="$party.name"\n' +
    '               ng-disabled="transaction.busy()"\n' +
    '               ng-change="onChangeBasicInfo()"/>\n' +
    '\n' +
    '        <div class="hint"\n' +
    '             ng-if="errorsWithHint(form, form.fullName).hint">\n' +
    '            {{::\'ERROR_FULLNAME_INVALID\' | translate}}\n' +
    '        </div>\n' +
    '    </md-input-container>\n' +
    '\n' +
    '    <md-input-container class="md-block bm0">\n' +
    '        <label>{{::\'SETTINGS_BASIC_INFO_PRIMARY_EMAIL\' | translate}}</label>\n' +
    '        <input name="email" type="email" required\n' +
    '               ng-model="$party.email"\n' +
    '               ng-change="onChangeBasicInfo()"\n' +
    '               pip-email-unique="{{$party.email}}"/>\n' +
    '\n' +
    '        <div class="hint"\n' +
    '             ng-if="errorsWithHint(form, form.email).hint && !$user.email_ver">\n' +
    '            {{::\'SETTINGS_BASIC_INFO_VERIFY_HINT\' | translate}}\n' +
    '        </div>\n' +
    '        <div ng-messages="errorsWithHint(form.email)" ng-hide=" $party.type ==\'team\'">\n' +
    '            <div ng-message="email">{{::\'ERROR_EMAIL_INVALID\' | translate}}</div>\n' +
    '            <div ng-message="emailUnique">{{::\'ERROR_EMAIL_INVALID\' | translate}}</div>\n' +
    '        </div>\n' +
    '    </md-input-container>\n' +
    '\n' +
    '    <md-button class="md-raised bm16 tm8 rm8"\n' +
    '               ng-click="onVerifyEmail($event)"\n' +
    '               ng-hide="$user.email_ver || $party.type ==\'team\'">\n' +
    '        {{::\'SETTINGS_BASIC_INFO_VERIFY_CODE\' | translate}}\n' +
    '    </md-button>\n' +
    '\n' +
    '    <md-button ng-click="onChangePassword($event)" class="md-raised bm16 tm8" ng-hide="$party.type ==\'team\'">\n' +
    '        {{::\'SETTINGS_BASIC_INFO_CHANGE_PASSWORD\' | translate}}\n' +
    '    </md-button>\n' +
    '\n' +
    '    <md-input-container class="md-block flex">\n' +
    '        <label>{{::\'SETTINGS_BASIC_INFO_WORDS_ABOUT_ME\' | translate }}</label>\n' +
    '        <textarea ng-model="$party.about" columns="1"\n' +
    '                  ng-change="onChangeBasicInfo()"></textarea>\n' +
    '    </md-input-container>\n' +
    '\n' +
    '    <md-input-container class="md-block" ng-hide="$party.type ==\'team\'">\n' +
    '        <label>{{::\'GENDER\' | translate}}</label>\n' +
    '        <md-select ng-model="$party.gender" ng-change="onChangeBasicInfo()"\n' +
    '                   placeholder="{{\'GENDER\' | translate}}">\n' +
    '            <md-option ng-value="gender.id" ng-repeat="gender in genders">{{gender.name}}</md-option>\n' +
    '        </md-select>\n' +
    '    </md-input-container>\n' +
    '\n' +
    '    <div ng-hide="$party.type ==\'team\'">\n' +
    '        <p class="text-caption text-grey tm0 bm0">{{::\'SETTINGS_BASIC_INFO_BIRTHDAY\' | translate}}</p>\n' +
    '        <pip-date ng-model="$party.birthday"\n' +
    '                  ng-change="onChangeBasicInfo()"\n' +
    '                  pip-time-mode="past\n' +
    '                  time-mode="past"></pip-date>\n' +
    '    </div>\n' +
    '\n' +
    '    <md-input-container class="md-block"\n' +
    '                        ng-hide="$party.type ==\'team\'">\n' +
    '        <label>{{::\'LANGUAGE\' | translate}}</label>\n' +
    '        <md-select placeholder="{{\'LANGUAGE\' | translate}}"\n' +
    '                   ng-model="$user.language"\n' +
    '                   ng-change="onChangeUser()">\n' +
    '            <md-option ng-value="language.id"\n' +
    '                       ng-repeat="language in languages">\n' +
    '                {{language.name}}\n' +
    '            </md-option>\n' +
    '        </md-select>\n' +
    '    </md-input-container>\n' +
    '\n' +
    '    <md-input-container class="md-block"\n' +
    '                        ng-if="$party.type !=\'team\'">\n' +
    '        <label>{{::\'THEME\' | translate}}</label>\n' +
    '        <md-select class="w-stretch theme-text-primary"\n' +
    '                   ng-model="$user.theme"\n' +
    '                   ng-change="onChangeUser()"\n' +
    '                   ng-disabled="transaction.busy()">\n' +
    '            <md-option ng-value="theme"\n' +
    '                       ng-repeat="theme in themes"\n' +
    '                       ng-selected="$theme == theme ? true : false">\n' +
    '                {{ theme | translate }}\n' +
    '            </md-option>\n' +
    '        </md-select>\n' +
    '    </md-input-container>\n' +
    '    <pip-location-edit class="map-edit bm24-flex"\n' +
    '                       ng-hide="$party.type ==\'team\'"\n' +
    '                       pip-changed="onChangeBasicInfo()"\n' +
    '                       pip-location-name="$party.loc_name"\n' +
    '                       pip-location-pos="loc_pos">\n' +
    '    </pip-location-edit>\n' +
    '</form>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipSettings.Templates');
} catch (e) {
  module = angular.module('pipSettings.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('user_settings/user_settings_change_password.html',
    '<md-dialog class="pip-dialog layout-column"  width="440">\n' +
    '    <form name="form" ng-submit="onApply()" >\n' +
    '    <div class="pip-header">\n' +
    '        <h3 class="m0">\n' +
    '            {{::\'SETTINGS_CHANGE_PASSWORD_TITLE\' | translate : module}}\n' +
    '        </h3>\n' +
    '    </div>\n' +
    '    <div class="pip-body">\n' +
    '        <div class="pip-content">\n' +
    '            <div class="text-error bm8"\n' +
    '                 ng-messages="form.$serverError">\n' +
    '                <div ng-message="ERROR_UNKNOWN">\n' +
    '                    {{ form.$serverError.ERROR_UNKNOWN | translate }}\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '            <md-input-container class="md-block">\n' +
    '                <label>{{::\'SETTINGS_CHANGE_PASSWORD_CURRENT_PASSWORD\' | translate }}</label>\n' +
    '                <input name="oldPassword" type="password"\n' +
    '                       ng-model="changePasData.old_password"\n' +
    '                       ng-required="change_password.$submitted"\n' +
    '                       pip-clear-errors/>\n' +
    '\n' +
    '                <div ng-messages="errorsWithHint(form, form.oldPassword)">\n' +
    '                    <div ng-message="required">\n' +
    '                        {{::\'ERROR_REQUIRED\' | translate }}\n' +
    '                    </div>\n' +
    '                    <div ng-message="ERROR_1107">\n' +
    '                        {{::\'ERROR_WRONG_PASSWORD\' | translate }}\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '\n' +
    '            </md-input-container>\n' +
    '\n' +
    '            <md-input-container class="md-block">\n' +
    '                <label>{{\'SETTINGS_CHANGE_PASSWORD_NEW_PASSWORD\' | translate }}</label>\n' +
    '                <input name="newPassword" type="password"\n' +
    '                       ng-model="changePasData.new_password"\n' +
    '                       ng-change="onCheckRepeatPassword()"\n' +
    '                       ng-required="change_password.$submitted"\n' +
    '                       ng-minlength="6"\n' +
    '                       pip-clear-errors/>\n' +
    '                <div class="hint"\n' +
    '                     ng-if="errorsWithHint(form, form.newPassword).hint">\n' +
    '                    {{ \'HINT_PASSWORD\' | translate }}\n' +
    '                </div>\n' +
    '                <div ng-messages="errorsWithHint(form, form.newPassword)">\n' +
    '                    <div ng-message="required">\n' +
    '                        {{::\'ERROR_REQUIRED\' | translate}}\n' +
    '                    </div>\n' +
    '                    <div ng-message="minlength">\n' +
    '                        {{::\'HINT_PASSWORD\' | translate }}\n' +
    '                    </div>\n' +
    '                    <div ng-message="ERROR_1105">\n' +
    '                        {{::\'ERROR_IDENTICAL_PASSWORDS\' | translate }}\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </md-input-container>\n' +
    '\n' +
    '            <md-input-container class="md-block">\n' +
    '                <label>{{ \'SETTINGS_CHANGE_PASSWORD_REPEAT_RASSWORD\' | translate }}</label>\n' +
    '                <input name="repeat"  type="password"\n' +
    '                       ng-model="repeat"\n' +
    '                       ng-change="onCheckRepeatPassword()"\n' +
    '                       ng-required="change_password.$submitted"\n' +
    '                       ng-minlength="6" />\n' +
    '\n' +
    '                <div class="hint"\n' +
    '                     ng-if="errorsRepeatWithHint(form.repeat).hint">\n' +
    '                    {{::\'HINT_REPEAT_PASSWORD\' | translate }}\n' +
    '                </div>\n' +
    '\n' +
    '                <div ng-messages="errorsRepeatWithHint(form.repeat)">\n' +
    '                    <div ng-message="required">{{::\'ERROR_REQUIRED\' | translate }}</div>\n' +
    '                    <div ng-message="minlength">{{::\'HINT_PASSWORD\' | translate }}</div>\n' +
    '                    <div ng-message="repeat">{{::\'REPEAT_PASSWORD_INVALID\' | translate }}</div>\n' +
    '                </div>\n' +
    '\n' +
    '            </md-input-container>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="pip-footer">\n' +
    '        <div>\n' +
    '            <md-button aria-label="xxx"\n' +
    '                       ng-click="onCancel()">\n' +
    '                {{::\'CANCEL\' | translate }}\n' +
    '            </md-button>\n' +
    '            <md-button type="submit" class="md-accent" aria-label="xxx">\n' +
    '                {{::\'APPLY\' | translate : module}}\n' +
    '            </md-button>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    </form>\n' +
    '</md-dialog>\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipSettings.Templates');
} catch (e) {
  module = angular.module('pipSettings.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('user_settings/user_settings_sessions.html',
    '\n' +
    '    <md-progress-linear ng-show="transaction.busy()" md-mode="indeterminate" class="pip-progress-top">\n' +
    '    </md-progress-linear>\n' +
    '    <div class="pip-details-title pip-sessions">\n' +
    '        <p class="pip-title bm16">\n' +
    '            {{::\'SETTINGS_ACTIVE_SESSIONS_TITLE\' | translate}}\n' +
    '        </p>\n' +
    '\n' +
    '        <p class="pip-subtitle">\n' +
    '            {{::\'SETTINGS_ACTIVE_SESSIONS_SUBTITLE\' | translate}}\n' +
    '        </p>\n' +
    '    </div>\n' +
    '\n' +
    '\n' +
    '<md-list class="w-stretch">\n' +
    '    <div ng-repeat="session in sessions" >\n' +
    '        <div class="layout-row"\n' +
    '             ng-init="showBlock = session.id != sessionId"\n' +
    '             ng-click="showBlock = !showBlock" >\n' +
    '            <p class="m0 text-subhead2 text-overflow max-w50-stretch">\n' +
    '                {{::session.client}}\n' +
    '            </p>\n' +
    '            <p class="m0 lp4 text-body1 color-secondary-text flex">\n' +
    '                {{::\'SETTINGS_ACTIVE_SESSION_ACTIVE\' | translate}}\n' +
    '            </p>\n' +
    '            <p class="m0 text-body1 color-secondary-text">\n' +
    '                {{::country}}\n' +
    '                <md-icon ng-if="showBlock" md-svg-icon="icons:triangle-up"></md-icon>\n' +
    '                <md-icon ng-if="!showBlock" md-svg-icon="icons:triangle-down"></md-icon>\n' +
    '            </p>\n' +
    '        </div>\n' +
    '        <div class="layout-row bm8 bp8" ng-class="{\'divider-bottom\':!$last}" >\n' +
    '            <div class="flex-50">\n' +
    '                <p class="m0 bm4 text-body1 text-overflow color-secondary-text ">\n' +
    '                    {{session.last_req | date : \'medium\'}}\n' +
    '                </p>\n' +
    '                <p class="m0 bm4 text-body1 text-overflow color-secondary-text"\n' +
    '                   ng-show="showBlock">\n' +
    '                    {{::\'SETTINGS_ACTIVE_SESSION_OS\' | translate}}{{::session.platform}}</p>\n' +
    '                <p class="m0 bm4 text-body1 text-overflow color-secondary-text"\n' +
    '                   ng-show="showBlock">\n' +
    '                    {{::\'SETTINGS_ACTIVE_SESSION_IP\' | translate}}{{::session.address}}\n' +
    '                </p>\n' +
    '                <md-button class="md-raised"\n' +
    '                           ng-show="showBlock && session.id != sessionId"\n' +
    '                           ng-click="onRemove(session)">\n' +
    '                    {{::\'SETTINGS_ACTIVE_SESSIONS_CLOSE_SESSION\' | translate}}\n' +
    '                </md-button>\n' +
    '            </div>\n' +
    '\n' +
    '            <pip-location-ip class="map-edit flex-50" ng-if="showBlock"\n' +
    '                             pip-ipaddress="session.address"\n' +
    '                             pip-extra-info="country = extraInfo.country">\n' +
    '            </pip-location-ip>\n' +
    '        </div>\n' +
    '\n' +
    '    </div>\n' +
    '</md-list>\n' +
    '<div class="layout-row layout-align-end-center">\n' +
    '    <md-button class="md-raised"\n' +
    '               ng-show="sessions.length > 1"\n' +
    '               ng-click="onRemoveAll()">\n' +
    '        {{::\'SETTINGS_ACTIVE_SESSIONS_CLOSE_ACTIVE_SESSIONS\' | translate}}\n' +
    '    </md-button>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipSettings.Templates');
} catch (e) {
  module = angular.module('pipSettings.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('user_settings/user_settings_verify_email.html',
    '<md-dialog class="pip-dialog layout-column"  width="440">\n' +
    '    <div class="pip-body">\n' +
    '        <div class="pip-content">\n' +
    '                <md-progress-linear ng-show="transaction.busy()" md-mode="indeterminate" class="pip-progress-top" >\n' +
    '                </md-progress-linear>\n' +
    '\n' +
    '                <h2>{{::\'VERIFY_EMAIL_TITLE\' | translate}}</h2>\n' +
    '\n' +
    '                <p class="title-padding">{{::\'VERIFY_EMAIL_TEXT_1\' | translate}} </p>\n' +
    '\n' +
    '                <form name=\'form\' novalidate>\n' +
    '                    <div ng-messages="form.$serverError" class="text-error bm8">\n' +
    '                        <div ng-message="ERROR_UNKNOWN">{{ form.$serverError.ERROR_UNKNOWN | translate }}</div>\n' +
    '                    </div>\n' +
    '\n' +
    '                    <md-input-container class="display  bp4 md-block" >\n' +
    '                        <label>{{::\'EMAIL\' | translate}}</label>\n' +
    '                        <input name="email" type="email" ng-model="data.email" required step="any"\n' +
    '                               pip-clear-errors  tabindex="1"\n' +
    '                               ng-disabled="transaction.busy()"\n' +
    '                               pip-test="input-email"/>\n' +
    '                        <div class="hint" ng-if="errorsWithHint(form, form.email).hint">{{::\'HINT_EMAIL\' | translate}}</div>\n' +
    '                        <div ng-messages="errorsWithHint(form, form.email)"\n' +
    '                             xng-if="!form.email.$pristine">\n' +
    '                            <div ng-message="required">{{::\'ERROR_EMAIL_INVALID\' | translate }}</div>\n' +
    '                            <div ng-message="ERROR_1106">{{::\'ERROR_USER_NOT_FOUND\' | translate}}</div>\n' +
    '                        </div>\n' +
    '                    </md-input-container>\n' +
    '\n' +
    '                    <md-input-container class="md-block">\n' +
    '                        <label>{{::\'ENTRY_VERIFICATION_CODE\' | translate}}</label>\n' +
    '                        <input name="code" ng-disabled="transaction.busy()" tabindex="0"\n' +
    '                               ng-model="data.code" required pip-clear-errors/>\n' +
    '                        <div ng-messages="errorsWithHint(form, form.code)">\n' +
    '                            <div ng-message="required"> {{::\'ERROR_CODE_INVALID\' | translate }}</div>\n' +
    '                            <div ng-message="ERROR_1103"> {{::\'ERROR_CODE_WRONG\' | translate }}</div>\n' +
    '                        </div>\n' +
    '                    </md-input-container>\n' +
    '\n' +
    '                    <p>\n' +
    '                        {{::\'VERIFY_EMAIL_TEXT_21\' | translate}}\n' +
    '                        <a ng-click="onRequestVerificationClick()" class="pointer" tabindex="0">{{::\'VERIFY_EMAIL_RESEND\' | translate}}</a>\n' +
    '                        {{::\'VERIFY_EMAIL_TEXT_22\' | translate}}\n' +
    '                    </p>\n' +
    '                </form>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="pip-footer">\n' +
    '            <md-button ng-click="onCancel()" ng-hide="transaction.busy()" aria-label="xxx">\n' +
    '                {{::\'CANCEL\' | translate}}\n' +
    '            </md-button>\n' +
    '            <md-button class="md-accent" ng-click="onVerify()" ng-hide="transaction.busy()" tabindex="0" aria-label="xxx"\n' +
    '                ng-disabled="data.code.length == 0 || data.email.length == 0 || (!data.email && form.$pristine) || (!data.code)">\n' +
    '                {{::\'VERIFY\' | translate}}\n' +
    '            </md-button>\n' +
    '            <md-button class="md-warn" ng-show="transaction.busy()" ng-click="transaction.abort()" tabindex="0" aria-label="xxx">\n' +
    '                {{::\'CANCEL\' | translate}}\n' +
    '            </md-button>\n' +
    '\n' +
    '        </div>\n' +
    '</md-dialog>');
}]);
})();

/**
 * @file Define controller for a settings tab
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipSettings.Page', [
        'pipSettings.Service', 'pipAppBar', 'pipSelected', 'pipTranslate',
        'pipSettings.Templates', 'pipNavIcon', 'pipActions.Service'
    ]);

    thisModule.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('settings', {
            url: '/settings?party_id',
            auth: true,
            controller: 'pipSettingsPageController',
            templateUrl: 'settings_page/settings_page.html'
        });
    }]);

    /**
     * @ngdoc controller
     * @name pipSettings.Page:pipSettingsPageController
     *
     * @description
     * The controller is used for the whole settings tabs and provides
     * navigation menu on the left and load content into right panel.
     * This component is integrated with `'pipAppBar'` component and adapt the tabs header.
     * The component has predefined states `'settings.base_info'` and `'settings.active_sessions'`. Each of these states
     * require user's authorization.
     *
     * @requires pipAppBar
     */
    thisModule.controller('pipSettingsPageController',
        ['$scope', '$state', '$rootScope', '$timeout', 'pipAppBar', 'pipSettings', 'pipActions', 'pipBreadcrumb', 'pipNavIcon', function ($scope, $state, $rootScope, $timeout, pipAppBar, pipSettings, pipActions,
                  pipBreadcrumb, pipNavIcon) {

            $scope.tabs = _.filter(pipSettings.getTabs(), function (tab) {
                if (tab.visible === true && (tab.access ? tab.access($rootScope.$user, tab) : true)) {
                    return tab;
                }
            });

            $scope.tabs = _.sortBy($scope.tabs, 'index');

            $scope.selected = {};
            if ($state.current.name !== 'settings') {
                initSelect($state.current.name);
            } else if ($state.current.name === 'settings' && pipSettings.getDefaultTab()) {
                initSelect(pipSettings.getDefaultTab().state);
            } else {
                $timeout(function () {
                    if (pipSettings.getDefaultTab()) {
                        initSelect(pipSettings.getDefaultTab().state);
                    }
                    if (!pipSettings.getDefaultTab() && $scope.tabs.length > 0) {
                        initSelect($scope.tabs[0].state);
                    }
                });
            }

            appHeader();

            /** @see onNavigationSelect */
            $scope.onNavigationSelect = onNavigationSelect;
            /** @see onDropdownSelect */
            $scope.onDropdownSelect = onDropdownSelect;

            /**
             * Config header panel
             */
            function appHeader() {
                pipActions.hide();
                pipAppBar.part('menu', true);
                pipAppBar.part('actions', 'primary');
                pipAppBar.part('icon', true);
                pipAppBar.part('title', 'breadcrumb');
                pipAppBar.hideShadow();
                pipBreadcrumb.text('Settings');
                pipNavIcon.menu();
            }

            /**
             * @ngdoc method
             * @methodOf pipSettings.Page:pipSettingsPageController
             * @name pipSettings.Page:pipSettingsPageController:onDropdownSelect
             *
             * @description
             * Method changes selected tab in the navigation menu and transfer to selected tab(state).
             * It used on mobile screens.
             *
             * @param {Object} state    State configuration object
             */
            function onDropdownSelect(state) {
                onNavigationSelect(state.state);
            }

            /**
             * @ngdoc method
             * @methodOf pipSettings.Page:pipSettingsPageController
             * @name pipSettings.Page:pipSettingsPageController:onNavigationSelect
             *
             * @description
             * Method changes selected tab in the navigation menu and transfer to selected tab(state).
             * It uses on screens more than mobile.
             *
             * @param {string} state    Name of new state
             */
            function onNavigationSelect(state) {
                initSelect(state);

                if ($scope.selected.tab) {
                    $state.go(state);
                }
            }

            /**
             * Establish selected tab
             */
            function initSelect(state) {
                $scope.selected.tab = _.find($scope.tabs, function (tab) {
                    return tab.state === state;
                });
                $scope.selected.tabIndex = _.indexOf($scope.tabs, $scope.selected.tab);
                $scope.selected.tabId = state;
            }
        }]);

})(window.angular, window._);

/**
 * @file Service for settings component
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipSettings.Service', []);

    /**
     * @ngdoc service
     * @name pipSettings.Service:pipSettingsProvider
     *
     * @description
     * Service provides an interface to manage 'Settings' component behaviour.
     * It is available on config and run phases.
     */
    thisModule.provider('pipSettings', ['$stateProvider', function ($stateProvider) { // pipAuthStateProvider

        var defaultTab,
            tabs = [],
            titleText = 'SETTINGS_TITLE',
            titleLogo = null,
            isNavIcon = true;

        // Configure global parameters
        this.showTitleText = showTitleText;
        this.showTitleLogo = showTitleLogo;
        this.showNavIcon = showNavIcon;

        return {
            /**
             * @ngdoc method
             * @methodOf pipSettings.Service:pipSettingsProvider
             * @name pipSettings.Service.pipSettingsProvider:addTab
             *
             * @description
             * Register new tab in 'Settings' component. Before adding a tab this method validates passed object.
             *
             * @param {Object} tabObj  Configuration object for new tab.
             */
            addTab: addTab,

            /**
             * @ngdoc method
             * @methodOf pipSettings.Service:pipSettingsProvider
             * @name pipSettings.Service.pipSettingsProvider:getTabs
             *
             * @description
             * Method returns collection of registered tabs.
             *
             * @returns {Array<Object>} Collection of tabs.
             */
            getTabs: getTabs,

            /**
             * @ngdoc method
             * @methodOf pipSettings.Service:pipSettingsProvider
             * @name pipSettings.Service.pipSettingsProvider:setDefaultTab
             *
             * @description
             * Establish a tab which is available by default (after chose this component in menu).
             *
             * @param {string} name     Name of the default state for this component.
             */
            setDefaultTab: setDefaultTab,

            /**
             * @ngdoc method
             * @methodOf pipSettings.Service:pipSettingsProvider
             * @name pipSettings.Service.pipSettingsProvider:getDefaultTab
             *
             * @description
             * Method returns an config object for tabs established as default (it will be opened when app transeferred to
             * abstract state 'settings').
             *
             * @returns {Array<Object>} Collection of tabs.
             */
            getDefaultTab: getDefaultTab,
                    
            showTitleText: showTitleText,
            showTitleLogo: showTitleLogo,
            showNavIcon: showNavIcon,

            $get: function () {
                /**
                 * @ngdoc service
                 * @name pipSettings.Service:pipSettings
                 *
                 * @description
                 * Service provides an interface to manage 'Settings' component behaviour.
                 * It is available on config and run phases.
                 */
                return {
                    /**
                     * @ngdoc method
                     * @methodOf pipSettings.Service:pipSettings
                     * @name pipSettings.Service.pipSettings:getTabs
                     *
                     * @description
                     * Method returns collection of registered tabs.
                     *
                     * @returns {Array<Object>} Collection of tabs.
                     */
                    getTabs: getTabs,

                    /**
                     * @ngdoc method
                     * @methodOf pipSettings.Service:pipSettings
                     * @name pipSettings.Service.pipSettings:addTab
                     *
                     * @description
                     * Register new tab in 'Settings' component. Before adding a tab this method validates passed object.
                     *
                     * @param {Object} tabObj  Configuration object for new tab.
                     */
                    addTab: addTab,

                    /**
                     * @ngdoc method
                     * @methodOf pipSettings.Service:pipSettings
                     * @name pipSettings.Service.pipSettings:getDefaultTab
                     *
                     * @description
                     * Method returns an config object for tabs established as default (it will be opened when app transeferred to
                     * abstract state 'settings').
                     *
                     * @returns {Array<Object>} Collection of tabs.
                     */
                    getDefaultTab: getDefaultTab,

                    /**
                     * @ngdoc method
                     * @methodOf pipSettings.Service:pipSettings
                     * @name pipSettings.Service.pipSettings:setDefaultTab
                     *
                     * @description
                     * Establish a tab which is available by default (after chose this component in menu).
                     *
                     * @param {string} name     Name of the default state for this component.
                     */
                    setDefaultTab: setDefaultTab,

                    showTitleText: showTitleText,
                    showTitleLogo: showTitleLogo,
                    showNavIcon: showNavIcon
                };
            }
        };

        /**
         * Appends component abstract state prefix to passed state
         */
        function getFullStateName(state) {
            return 'settings.' + state;
        }

        function getTabs() {
            return _.clone(tabs, true);
        }

        function getDefaultTab() {
            var defaultTab;

            defaultTab = _.find(tabs, function (p) {
                return p.state === defaultTab;
            });

            return _.clone(defaultTab, true);
        }

        function addTab(tabObj) {
            var existingTab;

            validateTab(tabObj);
            existingTab = _.find(tabs, function (p) {
                return p.state === getFullStateName(tabObj.state);
            });
            if (existingTab) {
                throw new Error('Tab with state name "' + tabObj.state + '" is already registered');
            }

            tabs.push({
                state: getFullStateName(tabObj.state),
                title: tabObj.title,
                index: tabObj.index || 100000,
                access: tabObj.access,
                visible: tabObj.visible !== false,
                stateConfig: _.clone(tabObj.stateConfig, true)
            });

            $stateProvider.state(getFullStateName(tabObj.state), tabObj.stateConfig);

            // if we just added first state and no default state is specified
            if (typeof defaultTab === 'undefined' && tabs.length === 1) {
                setDefaultTab(tabObj.state);
            }
        }

        function setDefaultTab(name) {
            // TODO [apidhirnyi] extract expression inside 'if' into variable. It isn't readable now.
            if (!_.find(tabs, function (tab) {
                return tab.state === getFullStateName(name);
            })) {
                throw new Error('Tab with state name "' + name + '" is not registered');
            }

            defaultTab = getFullStateName(name);
            
            //$stateProvider.go(defaultTab);
            //pipAuthStateProvider.redirect('settings', getFullStateName(name));
        }

        /**
         * Validates passed tab config object
         * If passed tab is not valid it will throw an error
         */
        function validateTab(tabObj) {
            if (!tabObj || !_.isObject(tabObj)) {
                throw new Error('Invalid object');
            }

            if (tabObj.state === null || tabObj.state === '') {
                throw new Error('Tab should have valid Angular UI router state name');
            }

            if (tabObj.access && !_.isFunction(tabObj.access)) {
                throw new Error('"access" should be a function');
            }

            if (!tabObj.stateConfig || !_.isObject(tabObj.stateConfig)) {
                throw new Error('Invalid state configuration object');
            }
        }

        function showTitleText (newTitleText) {
            if (newTitleText) {
                titleText = newTitleText;
                titleLogo = null;
            }

            return titleText;
        }

        function showTitleLogo(newTitleLogo) {
            if (newTitleLogo) {
                titleLogo = newTitleLogo;
                titleText = null;
            }

            return titleLogo;
        }

        function showNavIcon(value) {
            if (value !== null && value !== undefined) {
                isNavIcon = !!value;
            }

            return isNavIcon;
        }

    }]);

})(window.angular, window._);

/**
 * @file Settings tab logic
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
    'use strict';

    angular.module('pipUserSettings', [
        'ngMaterial', 'pipData',
        'pipSettings.Service',
        'pipSettings.Page',

        'pipUserSettings.Strings',
        'pipUserSettings.Sessions',
        'pipUserSettings.BasicInfo',
        'pipSettings.Templates'
    ]);

})(window.angular);

/**
 * @file Settings basic info controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';
    var thisModule = angular.module('pipUserSettings.BasicInfo',
        ['pipUserSettings.ChangePassword', 'pipUserSettings.VerifyEmail', 
            'pipSettings.Service', 'pipSettings.Page',]);

    thisModule.config(['pipSettingsProvider', function (pipSettingsProvider) {
        pipSettingsProvider.addTab({
            state: 'basic_info',
            index: 1,
            title: 'SETTINGS_BASIC_INFO_TITLE',
            stateConfig: {
                url: '/basic_info',
                controller: 'pipUserSettingsBasicInfoController',
                templateUrl: 'user_settings/user_settings_basic_info.html',
                auth: true
            }
        });

        pipSettingsProvider.setDefaultTab('basic_info');
    }]);

    /**
     * @ngdoc controller
     * @name pipUserSettings.BasicInfo:pipUserSettingsBasicInfoController
     *
     * @description
     * Controller for the predefined 'basic_info' state.
     * Provides sync changes user's profile with remote profile.
     * On state exit everything is saved on the server.
     */
    thisModule.controller('pipUserSettingsBasicInfoController',
        ['$scope', '$rootScope', '$mdDialog', '$state', '$window', '$timeout', '$mdTheming', 'pipTranslate', 'pipTransaction', 'pipTheme', 'pipToasts', 'pipDataUser', 'pipDataParty', 'pipFormErrors', function ($scope, $rootScope, $mdDialog, $state, $window, $timeout, $mdTheming,
                  pipTranslate, pipTransaction, pipTheme,
                  pipToasts, pipDataUser, pipDataParty, pipFormErrors) {

            try {
                $scope.originalParty = angular.toJson($rootScope.$party);
            } catch (err) {
                throw err;
            }

            $scope.nameCopy = $rootScope.$party.name;

            $timeout(function () {
                $scope.loc_pos = $rootScope.$party.loc_pos;
            });

            $scope.genders = pipTranslate.translateSet(['male', 'female', 'n/s']);
            $scope.languages = pipTranslate.translateSet(['ru', 'en']);

            $scope.transaction = pipTransaction('settings.basic_info', $scope);

            $scope.themes = _.keys(_.omit($mdTheming.THEMES, 'default'));

            $state.get('settings.basic_info').onExit = saveChanges;

            $scope.errorsWithHint = pipFormErrors.errorsWithHint;
            /** @see onChangePassword */
            $scope.onChangePassword = onChangePassword;
            /** @see onVerifyEmail */
            $scope.onVerifyEmail = onVerifyEmail;
            /** @see onPictureCreated */
            $scope.onPictureCreated = onPictureCreated;
            /** @see onPictureChanged */
            $scope.onPictureChanged = onPictureChanged;
            /** @see updateUser */
            $scope.onChangeUser = _.debounce(updateUser, 2000);
            /** @see saveChanges */
            $scope.onChangeBasicInfo = _.debounce(saveChanges, 2000);

            function onPictureChanged() {
                $scope.picture.save(
                    function () {
                        $rootScope.$broadcast('pipPartyAvatarUpdated');
                    },
                    function (error) {
                        return new Error(error);
                    }
                );
            }

            function onPictureCreated($event) {
                $scope.picture = $event.sender;
                $scope.picture.save(
                    function () {
                        $rootScope.$broadcast('pipPartyAvatarUpdated');
                    },
                    function (error) {
                        return new Error(error);
                    }
                );
            }

            /**
             * @ngdoc method
             * @methodOf pipUserSettings.BasicInfo:pipUserSettingsBasicInfoController
             * @name pipUserSettings.BasicInfo.pipUserSettingsBasicInfoController:onChangeBasicInfo
             *
             * @description
             * Saves changes onto server.
             * This method responses on change of the input information.
             * It is updated user's party profile. Also it updates user's profile in $rootScope.
             */
            function saveChanges() {
                if ($scope.form) {
                    $scope.form.$setSubmitted();
                }

                if ($rootScope.$party) {

                    if ($rootScope.$party.type === 'person' && $scope.form.$invalid) {
                        return;
                    }

                    // Check to avoid unnecessary savings
                    $rootScope.$party.loc_pos = $scope.loc_pos;
                    try {
                        var party = angular.toJson($rootScope.$party);
                    } catch (err) {
                        throw err;
                    }

                    if (party !== $scope.originalParty) {
                        var tid = $scope.transaction.begin('UPDATING');

                        pipDataParty.updateParty($rootScope.$party,
                            function (data) {
                                if ($scope.transaction.aborted(tid)) {
                                    return;
                                }
                                $scope.transaction.end();

                                $scope.originalParty = party;
                                $scope.nameCopy = data.name;
                            }, function (error) {
                                $scope.transaction.end(error);
                                $scope.message = String() + 'ERROR_' + error.status || error.data.status_code;
                                $rootScope.$party = angular.fromJson($scope.originalParty);
                            }
                        );
                    }
                }

            }

            /**
             * @ngdoc method
             * @methodOf pipUserSettings.BasicInfo:pipUserSettingsBasicInfoController
             * @name pipUserSettings.BasicInfo.pipUserSettingsBasicInfoController:onChangeUser
             *
             * @description
             * Saves changes onto server.
             * This method responses on change of the user's profile information.
             * Also it updates user's profile in $rootScope.
             */
            function updateUser() {
                var tid = $scope.transaction.begin('RequestEmailVerification');

                if ($rootScope.$user.id === $rootScope.$party.id) {
                    pipDataUser.updateUser(
                        {
                            item: $rootScope.$user
                        },
                        function (data) {
                            if ($scope.transaction.aborted(tid)) {
                                return;
                            }
                            $scope.transaction.end();

                            pipTranslate.use(data.language);
                            $rootScope.$user.language = data.language;
                            $rootScope.$user.theme = data.theme;
                            if ($rootScope.$user.theme) {
                                pipTheme.setCurrentTheme($rootScope.$user.theme, true);
                            }

                        }, function (error) {
                            var message;
                            
                            $scope.transaction.end(error);
                            message = String() + 'ERROR_' + error.status || error.data.status_code;
                            pipToasts.showNotification(pipTranslate.translate(message), null, null, null);
                        }
                    );
                }
            }

            /**
             * @ngdoc method
             * @methodOf pipUserSettings.BasicInfo:pipUserSettingsBasicInfoController
             * @name pipUserSettings.BasicInfo.pipUserSettingsBasicInfoController:onChangePassword
             *
             * @description
             * It opens a dialog panel to change password.
             *
             * @param {Object} event    Triggered event object
             */
            function onChangePassword(event) {
                var message;

                $mdDialog.show({
                    templateUrl: 'user_settings/user_settings_change_password.html',
                    controller: 'pipUserSettingsChangePasswordController',
                    targetEvent: event,
                    locals: {email: $rootScope.$party.email}
                }).then(
                    function (answer) {
                        if (answer) {
                            message = String() + 'RESET_PWD_SUCCESS_TEXT';
                            pipToasts.showNotification(pipTranslate.translate(message), null, null, null);
                        }
                    });
            }

            /**
             * @ngdoc method
             * @methodOf pipUserSettings.BasicInfo:pipUserSettingsBasicInfoController
             * @name pipUserSettings.BasicInfo.pipUserSettingsBasicInfoController:onVerifyEmail
             *
             * @description
             * It opens a dialog panel to change password.
             *
             * @param {Object} event    Triggered event object
             */
            function onVerifyEmail(event) {
                var message;

                $mdDialog.show({
                    templateUrl: 'user_settings/user_settings_verify_email.html',
                    controller: 'pipUserSettingsVerifyEmailController',
                    targetEvent: event,
                    locals: {email: $rootScope.$party.email}
                }).then(
                    function (answer) {
                        $scope.user.email_ver = answer;
                        if (answer) {
                            message = String() + 'VERIFY_EMAIL_SUCCESS_TEXT';
                            pipToasts.showNotification(pipTranslate.translate(message), null, null, null);
                        }
                    }
                );
            }
        }]
    );

})(window.angular, window._);

/**
 * @file Settings change password controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipUserSettings.ChangePassword', []);

    /**
     * @ngdoc controller
     * @name pipUserSettings.ChangePassword:pipUserSettingsChangePasswordController
     *
     * @description
     * Controller for dialog panel of password change.
     */
    thisModule.controller('pipUserSettingsChangePasswordController',
        ['$scope', '$rootScope', '$mdDialog', 'email', 'pipDataUser', 'pipTransaction', 'pipFormErrors', function ($scope, $rootScope, $mdDialog, email, pipDataUser, pipTransaction, pipFormErrors) {

            $scope.transaction = pipTransaction('settings.change_password', $scope);
            $scope.errorsRepeatWithHint = function (form, formPart) {
                if ($scope.showRepeatHint) {
                    return pipFormErrors.errorsWithHint(form, formPart);
                }

                return {};
            };
            $scope.showRepeatHint = true;
            $scope.changePasData = {};

            $scope.errorsWithHint = pipFormErrors.errorsWithHint;
            $scope.onCancel = onCancel;
            $scope.onCheckRepeatPassword = onCheckRepeatPassword;
            $scope.onApply = onApply;

            /**
             * @ngdoc method
             * @methodOf pipUserSettings.ChangePassword:pipUserSettingsChangePasswordController
             * @name pipUserSettings.ChangePassword.pipUserSettingsChangePasswordController:onCancel
             *
             * @description
             * Closes opened dialog panel.
             */
            function onCancel() {
                $mdDialog.cancel();
            }

            /**
             * @ngdoc method
             * @methodOf pipUserSettings.ChangePassword:pipUserSettingsChangePasswordController
             * @name pipUserSettings.ChangePassword.pipUserSettingsChangePasswordController:onCheckRepeatPassword
             *
             * @description
             * Validates a password typed into password fields.
             */
            function onCheckRepeatPassword() {
                if ($scope.changePasData) {
                    if ($scope.repeat === $scope.changePasData.new_password || $scope.repeat === '' || !$scope.repeat) {
                        $scope.form.repeat.$setValidity('repeat', true);
                        if ($scope.repeat === $scope.changePasData.new_password) {
                            $scope.showRepeatHint = false;
                        } else {
                            $scope.showRepeatHint = true;
                        }
                    } else {
                        $scope.showRepeatHint = true;
                        $scope.form.repeat.$setValidity('repeat', false);
                    }
                }
            }

            /**
             * @ngdoc method
             * @methodOf pipUserSettings.ChangePassword:pipUserSettingsChangePasswordController
             * @name pipUserSettings.ChangePassword.pipUserSettingsChangePasswordController:onApply
             *
             * @description
             * Approves password change and sends request to the server on password change.
             */
            function onApply() {
                $scope.onCheckRepeatPassword();

                if ($scope.form.$invalid) {
                    return;
                }

                if (!$scope.transaction.begin('CHANGE_PASSWORD')) {
                    return;
                }

                $scope.changePasData.email = email;

                pipDataUser.changePassword(
                    $scope.changePasData,
                    function () {
                        $scope.transaction.end();
                        $mdDialog.hide(true);
                    },
                    function (error) {
                        $scope.transaction.end(error);
                        pipFormErrors.setFormError(
                            $scope.form, error,
                            {
                                1107: 'oldPassword',
                                1105: 'newPassword'
                            }
                        );
                    }
                );
            }
        }]
    );

})(window.angular);

/**
 * @file Settings sessions controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, async) {
    'use strict';

    var thisModule = angular.module('pipUserSettings.Sessions', [
        'pipSettings.Service', 'pipSettings.Page',]);

    thisModule.config(['pipSettingsProvider', 'pipDataSessionProvider', function (pipSettingsProvider, pipDataSessionProvider) {
        pipSettingsProvider.addTab({
            state: 'sessions',
            index: 3,
            title: 'SETTINGS_ACTIVE_SESSIONS_TITLE',
            stateConfig: {
                url: '/sessions',
                controller: 'pipUserSettingsSessionsController',
                templateUrl: 'user_settings/user_settings_sessions.html',
                auth: true,
                resolve: {
                    sessions: pipDataSessionProvider.readSessionsResolver,
                    sessionId: pipDataSessionProvider.readSessionIdResolver
                }
            }
        });
    }]);

    /**
     * @ngdoc controller
     * @name pipUserSettings.Sessions:pipUserSettingsSessionsController
     *
     * @description
     * Controller provides an interface for managing active sessions.
     */
    thisModule.controller('pipUserSettingsSessionsController',
        ['$scope', 'pipTransaction', 'pipDataSession', 'sessions', 'sessionId', function ($scope, pipTransaction, pipDataSession, sessions, sessionId) {

            $scope.sessionId = sessionId;
            $scope.transaction = pipTransaction('settings.sessions', $scope);
            $scope.sessions = sessions;

            $scope.onRemoveAll = onRemoveAll;
            $scope.onRemove = onRemove;

            /**
             * @ngdoc method
             * @methodOf pipUserSettings.Sessions:pipUserSettingsSessionsController
             * @name pipUserSettings.Sessions.pipUserSettingsSessionsController:onRemoveAll
             *
             * @description
             * Closes all active session.
             */
            function onRemoveAll() {
                var tid = $scope.transaction.begin('REMOVING');

                async.eachSeries(
                    $scope.sessions,
                    function (session, callback) {
                        if (session.id == $scope.sessionId) {
                            callback();
                        } else {
                            pipDataSession.removeSession(
                                {
                                    session: session
                                },
                                function () {
                                    $scope.sessions = _.without($scope.sessions, session);
                                    callback();
                                },
                                function (error) {
                                    callback;
                                }
                            );
                        }
                    },
                    function (err) {
                        if (err) {
                            $scope.transaction.end(error);
                        }
                        if ($scope.transaction.aborted(tid)) {
                            return;
                        }
                        $scope.transaction.end();
                    });                
            }

            /**
             * @ngdoc method
             * @methodOf pipUserSettings.Sessions:pipUserSettingsSessionsController
             * @name pipUserSettings.Sessions.pipUserSettingsSessionsController:onRemove
             *
             * @description
             * Closes passed session.
             *
             * @param {Object} session  Session configuration object
             */
            function onRemove(session, callback) {
                if (session.id === $scope.sessionId) {
                    return;
                }
                var tid = $scope.transaction.begin('REMOVING');
                pipDataSession.removeSession(
                    {
                        session: session
                    },
                    function () {
                        if ($scope.transaction.aborted(tid)) {
                            return;
                        }
                        $scope.transaction.end();

                        $scope.sessions = _.without($scope.sessions, session);
                        if (callback) {
                            callback();
                        }
                    },
                    function (error) {
                        $scope.transaction.end(error);
                        $scope.message = 'ERROR_' + error.status || error.data.status_code;
                    }
                );
            }
        }]
    );

})(window.angular, window._, window.async);

/**
 * @file Settings string resources
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* eslint-disable quote-props */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipUserSettings.Strings', ['pipTranslate']);

    thisModule.config(['pipTranslateProvider', function (pipTranslateProvider) {

        // Set translation strings for the module
        pipTranslateProvider.translations('en', {
            'SETTINGS_TITLE': 'Settings',
            'SETTINGS_BASIC_INFO_TITLE': 'Basic info',
            'SETTINGS_ACTIVE_SESSIONS_TITLE': 'Active sessions',

            'SETTINGS_BASIC_INFO_FULL_NAME': 'Full name',
            'SETTINGS_BASIC_INFO_VERIFY_HINT': 'Please, verify your email address.',
            'SETTINGS_BASIC_INFO_VERIFY_CODE': 'Verify email address',
            'SETTINGS_BASIC_INFO_DATE_CHANGE_PASSWORD': 'Your password was changed on ',
            'SETTINGS_BASIC_INFO_CHANGE_PASSWORD': 'Change your password',
            'SETTINGS_BASIC_INFO_NAME_HINT': 'Please, use your real name to let other people know who you are.',
            'SETTINGS_BASIC_INFO_WORDS_ABOUT_ME': 'Few words about yourself',

            'SETTINGS_BASIC_INFO_GENDER': 'Gender',
            'SETTINGS_BASIC_INFO_BIRTHDAY': 'Birthday',
            'SETTINGS_BASIC_INFO_LOCATION': 'Current location',
            'SETTINGS_BASIC_INFO_PRIMARY_EMAIL': 'Primary email',
            'SETTINGS_BASIC_INFO_FROM': 'User since ',
            'SETTINGS_BASIC_INFO_USER_ID': 'User ID',

            'SETTINGS_CHANGE_PASSWORD_TITLE': 'Change password',
            'SETTINGS_CHANGE_PASSWORD_NEW_PASSWORD': 'New password',
            'SETTINGS_CHANGE_PASSWORD_REPEAT_RASSWORD': 'Repeat password',
            'SETTINGS_CHANGE_PASSWORD_CURRENT_PASSWORD': 'Current password',

            'SETTINGS_ACTIVE_SESSIONS_SUBTITLE': ' If you notice any unfamiliar devices or locations, click' +
            '"Close Session" to end the session.',
            'SETTINGS_ACTIVE_SESSIONS_CLOSE_SESSION': 'Close session',
            'SETTINGS_ACTIVE_SESSIONS_CLOSE_ACTIVE_SESSIONS': 'Close active sessions',
            'SETTINGS_ACTIVE_SESSION_OS': 'OS: ',
            'SETTINGS_ACTIVE_SESSION_IP': 'IP: ',
            'SETTINGS_ACTIVE_SESSION_ACTIVE': 'active',

            'SETTINGS_BLACKLIST_TITLE': 'Blacklist',
            'SETTINGS_BLACKLIST_SUBTITLE': 'Parties from blacklist will not be able to send you invitations and ' +
            'private messages.',
            'SETTINGS_BLACKLIST_UNBLOCK': 'Unblock',
            'SETTINGS_BLACKLIST_EMPTY': 'You have no blocked parties',

            'SETTINGS_CONTACT_INFO_TITLE': 'Contact info',
            'SETTINGS_CONTACT_INFO_EMAIL': 'Email',
            'SETTINGS_CONTACT_INFO_ADD_EMAIL': 'Add email',
            'SETTINGS_CONTACT_INFO_ADD_PHONE': 'Add phone',
            'SETTINGS_CONTACT_INFO_ADD_ADDRESS': 'Add address',
            'SETTINGS_CONTACT_INFO_ADD_ACCOUNT': 'Add account',
            'SETTINGS_CONTACT_INFO_ADD_URL': 'Add URL',
            'SETTINGS_CONTACT_INFO_ADDRESS': 'Address',
            'SETTINGS_CONTACT_INFO_PHONE': 'Phone',
            'SETTINGS_CONTACT_INFO_ACCOUNT_NAME': 'Account name',
            'SETTINGS_CONTACT_INFO_URL': 'URL',

            'THEME': 'Theme',

            'HINT_PASSWORD': 'Minimum 6 characters',
            'HINT_REPEAT_PASSWORD': 'Repeat password',

            'ERROR_WRONG_PASSWORD': 'Wrong password',
            'ERROR_IDENTICAL_PASSWORDS': 'Old and new passwords are identical',
            'REPEAT_PASSWORD_INVALID': 'Password does not match',
            'ERROR_EMAIL_INVALID': 'Please, enter a valid email'
        });

        pipTranslateProvider.translations('ru', {
            'SETTINGS_TITLE': 'Настройки',
            'SETTINGS_BASIC_INFO_TITLE': 'Основные данные',
            'SETTINGS_ACTIVE_SESSIONS_TITLE': 'Активные сессии',

            'SETTINGS_BASIC_INFO_FULL_NAME': 'Полное имя',
            'SETTINGS_BASIC_INFO_NAME_HINT': 'Пожалуйста, используйте реальное имя, чтоб люди могли вас узнать',
            'SETTINGS_BASIC_INFO_VERIFY_HINT': 'Пожалуйста, подтвердите адрес своей электронной почты',
            'SETTINGS_BASIC_INFO_VERIFY_CODE': 'Подтвердите адрес эл.почты',
            'SETTINGS_BASIC_INFO_DATE_CHANGE_PASSWORD': 'Ваш пароль был изменен ',
            'SETTINGS_BASIC_INFO_CHANGE_PASSWORD': 'Поменять пароль',

            'SETTINGS_BASIC_INFO_WORDS_ABOUT_ME': 'Несколько слов о себе',
            'SETTINGS_BASIC_INFO_GENDER': 'Пол',
            'SETTINGS_BASIC_INFO_BIRTHDAY': 'Дата рождения',
            'SETTINGS_BASIC_INFO_LOCATION': 'Текущее местонахождение',
            'SETTINGS_BASIC_INFO_PRIMARY_EMAIL': 'Основной адрес эл. почты',
            'SETTINGS_BASIC_INFO_FROM': 'Начиная с',
            'SETTINGS_BASIC_INFO_USER_ID': 'Личный код',

            'SETTINGS_CHANGE_PASSWORD_TITLE': 'Изменить пароль',
            'SETTINGS_CHANGE_PASSWORD_NEW_PASSWORD': 'Новый пароль',
            'SETTINGS_CHANGE_PASSWORD_REPEAT_RASSWORD': 'Повтор',
            'SETTINGS_CHANGE_PASSWORD_CURRENT_PASSWORD': 'Текущий пароль',

            'SETTINGS_ACTIVE_SESSIONS_SUBTITLE': 'Если вы заметили какие-либо незнакомые устройства или ' +
            'месторасположение, нажмите кнопку "Закончить сеанс", чтобы завершить сеанс.',
            'SETTINGS_ACTIVE_SESSIONS_CLOSE_SESSION': 'Закрыть сессию',
            'SETTINGS_ACTIVE_SESSIONS_CLOSE_ACTIVE_SESSIONS': 'Закрыть активные сессии',
            'SETTINGS_ACTIVE_SESSION_OS': 'ОС: ',
            'SETTINGS_ACTIVE_SESSION_IP': 'IP: ',
            'SETTINGS_ACTIVE_SESSION_ACTIVE': 'Активно',

            'SETTINGS_BLACKLIST_TITLE': 'Блокировки',
            'SETTINGS_BLACKLIST_SUBTITLE': 'Участники из черного списка не смогут' +
            ' посылать вам приглашения и личные сообщения.',
            'SETTINGS_BLACKLIST_UNBLOCK': 'Разблокировать',
            'SETTINGS_BLACKLIST_EMPTY': 'У вас нет заблокированных участников',

            'SETTINGS_CONTACT_INFO_TITLE': 'Контакты',
            'SETTINGS_CONTACT_INFO_EMAIL': 'Адрес электронной почты',
            'SETTINGS_CONTACT_INFO_ADD_EMAIL': 'Добавить адрес эл. почты',
            'SETTINGS_CONTACT_INFO_ADD_PHONE': 'Добавить телефон',
            'SETTINGS_CONTACT_INFO_ADD_ADDRESS': 'Добавить адрес',
            'SETTINGS_CONTACT_INFO_ADD_ACCOUNT': 'Добавить аккаунт',
            'SETTINGS_CONTACT_INFO_ADD_URL': 'Добавить веб-сайт',
            'SETTINGS_CONTACT_INFO_ADDRESS': 'Адрес',
            'SETTINGS_CONTACT_INFO_PHONE': 'Телефон',
            'SETTINGS_CONTACT_INFO_ACCOUNT_NAME': 'Учетка в мессенджере',
            'SETTINGS_CONTACT_INFO_URL': 'Веб сайт',

            'THEME': 'Тема',

            'HINT_PASSWORD': 'Минимум 6 знаков',
            'HINT_REPEAT_PASSWORD': 'Повторите пароль',

            'ERROR_WRONG_PASSWORD': 'Неправильный пароль',
            'ERROR_IDENTICAL_PASSWORDS': 'Старый и новый пароли идентичны',
            'REPEAT_PASSWORD_INVALID': 'Пароль не совпадает',
            'ERROR_EMAIL_INVALID': 'Пожалуйста, введите правильный почт.адрес'
        });
    }]);

})(window.angular);

/**
 * @file Settings verify email controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipUserSettings.VerifyEmail', []);

    /**
     * @ngdoc controller
     * @name pipUserSettings.VerifyEmail:pipUserSettingsVerifyEmailController
     *
     * @description
     * Controller for verify email dialog panel.
     */
    thisModule.controller('pipUserSettingsVerifyEmailController',
        ['$scope', '$rootScope', '$mdDialog', 'pipTransaction', 'pipFormErrors', 'pipDataUser', 'email', function ($scope, $rootScope, $mdDialog, pipTransaction, pipFormErrors, pipDataUser, email) {

            $scope.emailVerified = false;
            $scope.data = {
                email: email,
                code: ''
            };
            $scope.transaction = pipTransaction('settings.verify_email', $scope);

            /** @see onAbort */
            $scope.onAbort = onAbort;
            /** @see onRequestVerificationClick*/
            $scope.onRequestVerificationClick = onRequestVerificationClick;
            $scope.errorsWithHint = pipFormErrors.errorsWithHint;
            /** @see onVerify */
            $scope.onVerify = onVerify;
            /** @see onCancel */
            $scope.onCancel = onCancel;

            /**
             * @ngdoc method
             * @methodOf pipUserSettings.VerifyEmail:pipUserSettingsVerifyEmailController
             * @name pipUserSettings.VerifyEmail.pipUserSettingsVerifyEmailController:onAbort
             *
             * @description
             * Aborts a verify request.
             */
            function onAbort() {
                $scope.transaction.abort();
            }

            /**
             * @ngdoc method
             * @methodOf pipUserSettings.VerifyEmail:pipUserSettingsVerifyEmailController
             * @name pipUserSettings.VerifyEmail.pipUserSettingsVerifyEmailController:onCancel
             *
             * @description
             * Closes opened dialog panel.
             */
            function onCancel() {
                $mdDialog.cancel();
            }

            /**
             * @ngdoc method
             * @methodOf pipUserSettings.VerifyEmail:pipUserSettingsVerifyEmailController
             * @name pipUserSettings.VerifyEmail.pipUserSettingsVerifyEmailController:onRequestVerificationClick
             *
             * @description
             * Sends request to verify entered email.
             */
            function onRequestVerificationClick() {
                    var tid = $scope.transaction.begin('RequestEmailVerification');

                pipDataUser.requestEmailVerification(
                    {},                         
                    function (result) {
                            if ($scope.transaction.aborted(tid)) {
                                return;
                            }
                            $scope.transaction.end();
                        }, 
                        function (error) {
                            $scope.transaction.end(error);
                        }
                    );
            }

            /**
             * @ngdoc method
             * @methodOf pipUserSettings.VerifyEmail:pipUserSettingsVerifyEmailController
             * @name pipUserSettings.VerifyEmail.pipUserSettingsVerifyEmailController:onVerify
             *
             * @description
             * Initiates request on verify email on the server.
             */
            function onVerify() {
                $scope.form.$setSubmitted();

                if ($scope.form.$invalid) {
                    return;
                }
                var tid = $scope.transaction.begin('Verifying');

                pipDataUser.verifyEmail(
                    {
                        email: $scope.data.email,
                        code: $scope.data.code
                    }, 
                    function (verifyData) {
                            if ($scope.transaction.aborted(tid)) {
                                return;
                            }
                            $scope.transaction.end();

                        $mdDialog.hide(true);
                    },
                    function (error) {
                        $scope.transaction.end(error);

                        pipFormErrors.setFormError(
                            $scope.form, error,
                            {
                                1106: 'email',
                                1103: 'code'
                            }
                        );

                    }
                );
            }
        }]
    );

})(window.angular);



/**
 * @file Registration of all help components
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
    'use strict';

    angular.module('pipHelp', [
        'pipHelp.Service',
        'pipHelp.Page'
    ]);

})(window.angular);

(function(module) {
try {
  module = angular.module('pipHelp.Templates');
} catch (e) {
  module = angular.module('pipHelp.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('help_page/help_page.html',
    '<!--\n' +
    '@file Help page\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-toolbar class="pip-appbar-ext"></md-toolbar>\n' +
    '\n' +
    '<pip-document width="800" min-height="400">\n' +
    '    <div class="pip-menu-container pip-help"\n' +
    '         ng-if="manager !== false">\n' +
    '        <md-list class="pip-menu pip-simple-list hide-xs"\n' +
    '                 pip-selected="selected.tabIndex"\n' +
    '                 pip-selected-watch="selected.navId"\n' +
    '                 pip-select="onNavigationSelect($event.id)">\n' +
    '            <md-list-item class="pip-simple-list-item pip-selectable"\n' +
    '                          ng-repeat="tab in tabs track by tab.state"\n' +
    '                          md-ink-ripple\n' +
    '                          pip-id="{{::tab.state }}">\n' +
    '                <p> {{::tab.title | translate}} </p>\n' +
    '            </md-list-item>\n' +
    '        </md-list>\n' +
    '\n' +
    '        <div class="pip-content-container">\n' +
    '            <pip-dropdown class="hide-gt-xs"\n' +
    '                          pip-actions="tabs"\n' +
    '                          pip-dropdown-select="onDropdownSelect"\n' +
    '                          pip-active-index="selected.tabIndex"></pip-dropdown>\n' +
    '            <div class="pip-body layout-column flex" ui-view></div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="layout-column layout-align-center-center flex"\n' +
    '         ng-if="manager === false">\n' +
    '        {{::\'ERROR_400\' | translate}}\n' +
    '    </div>\n' +
    '</pip-document>');
}]);
})();

/**
 * @file Page template for help components
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';

    config.$inject = ['$stateProvider'];
    HelpPageController.$inject = ['$rootScope', '$scope', '$state', 'pipAppBar', 'pipHelp'];
    angular.module('pipHelp.Page', ['ui.router', 'pipHelp.Service', 'pipAppBar', 'pipSelected', 'pipTranslate',
        'pipHelp.Templates'])
        .config(config)
        .controller('pipHelpPageController', HelpPageController);

    function config($stateProvider) {
        $stateProvider.state('help', {
            url: '/help',
            auth: false,
            controller: 'pipHelpPageController',
            templateUrl: 'help_page/help_page.html'
        });
    }

    /**
     * @ngdoc controller
     * @name pipHelp.Page.pipHelpPageController
     *
     * @description
     * The controller is used for the root Help component.
     * It manages available tabs provide navigation through those ones.
     *
     * {@link https://github.com/pip-webui/pip-webui-help/blob/master/src/help_page/help_page.js#L40 View source}
     *
     *
     * @param {Object} $rootScope   Root scope object
     * @param {Object} $scope       Scope for the current controller
     * @param {Object} $state       UI Router service
     * @param {Object} pipAppBar    Service provides an interface to manage on application bar header.
     * @param {Object} pipHelp      Service to manage this component behaviour
     */
    function HelpPageController($rootScope, $scope, $state, pipAppBar, pipHelp) {

        $scope.tabs = _.filter(pipHelp.getTabs(), function (tab) {
            if (tab.visible && (tab.access !== angular.noop ? tab.access($rootScope.$user, tab) : true)) {
                return tab;
            }
        });
        $scope.selected = {};

        if ($state.current.name !== 'help') {
            initSelect($state.current.name);
        } else {
            initSelect(pipHelp.getDefaultTab().state);
        }

        appHeader();

        $scope.onNavigationSelect = onNavigationSelect;
        $scope.onDropdownSelect = onDropdownSelect;

        /**
         * @ngdoc method
         * @name pipHelp.Page.pipHelpPageController#onDropdownSelect
         * @methodOf pipHelp.Page.pipHelpPageController
         *
         * @description
         * It redirects to a passed state.
         *
         * {@link https://github.com/pip-webui/pip-webui-help/blob/master/src/help_page/help_page.js#L72 View source}
         *
         * @param {Object} state    State configuration object
         */
        function onDropdownSelect(state) {
            onNavigationSelect(state.state);
        }

        /**
         * Config appBar due to this page
         */
        function appHeader() {
            pipAppBar.showMenuNavIcon();
            pipAppBar.showTitleText('Help');
            pipAppBar.showShadowSm();
            pipAppBar.showLocalActions(null, []);
        }

        /**
         * @ngdoc method
         * @name pipHelp.Page.pipHelpPageController#onNavigationSelect
         * @methodOf pipHelp.Page.pipHelpPageController
         *
         * @description
         * It redirects to a passed state.
         *
         * {@link https://github.com/pip-webui/pip-webui-help/blob/master/src/help_page/help_page.js#L98 View source}
         *
         * @param {string} state    Name of the target state.
         */
        function onNavigationSelect(state) {
            initSelect(state);

            if ($scope.selected.tab) {
                $state.go(state);
            }
        }

        /**
         * Set selected item for highlighting in the nav menu
         */
        function initSelect(state) {
            $scope.selected.tab = _.find($scope.tabs, function (tab) {
                return tab.state === state;
            });

            $scope.selected.tabIndex = _.indexOf($scope.tabs, $scope.selected.tab);
            $scope.selected.tabId = state;
        }
    }
})(window.angular, window._);

/**
 * @file Service for help components
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';

    /**
     * @ngdoc service
     * @name pipHelp.Service.pipHelp
     *
     * @description
     * This service is provided an interface to manage the Help component.
     * It is available on the config and run application phases. On the both phases the interface is the same.
     * This module requires the '$state' module.
     */
    angular.module('pipHelp.Service', ['ui.router'])
        .provider('pipHelp',
            ['$stateProvider', function ($stateProvider) {
                var defaultTab,
                    tabs = [];

                /** @see addTab */
                this.addTab = addTab;

                /** @see setDefaultTab */
                this.setDefaultTab = setDefaultTab;

                /** @see getTabs */
                this.getTabs = getTabs;

                /** @see getDefaultTab */
                this.getDefaultTab = getDefaultTab;

                this.$get = function () {
                    return {
                        /** @see getTabs */
                        getTabs: getTabs,

                        /** @see getDefaultTab */
                        getDefaultTab: getDefaultTab,

                        /** @see addTab */
                        addTab: addTab,

                        /** @see setDefaultTab */
                        setDefaultTab: setDefaultTab
                    };
                };

                /**
                 * This method build the full name of state within the abstract 'help' state
                 */
                function getFullStateName(state) {
                    return 'help.' + state;
                }

                /**
                 * @ngdoc method
                 * @name pipHelp.Service.pipHelp#getTabs
                 * @methodOf pipHelp.Service.pipHelp
                 *
                 * @description
                 * This method returns asset of all tabs registered in the Help component.
                 *
                 * {@link https://github.com/pip-webui/pip-webui-help/blob/master/src/help_service/help_service.js#L79 View source}
                 *
                 * @returns {Array<Object>} List of registered states
                 *
                 * @example
                 * <pre>
                 * // on the config phase
                 * pipHelpProvider.getTabs();
                 * </pre>
                 */
                function getTabs() {
                    return _.clone(tabs, true);
                }

                /**
                 * @ngdoc method
                 * @name pipHelp.Service.pipHelp#getDefaultTab
                 * @methodOf pipHelp.Service.pipHelp
                 *
                 * @description
                 * This method return name of the default state.
                 *
                 * {@link https://github.com/pip-webui/pip-webui-help/blob/master/src/help_service/help_service.js#L101 View source}
                 *
                 * @returns {string} Name of the state
                 *
                 * @example
                 * <pre>
                 * // on the config phase
                 * pipHelpProvider.getDefaultTab();
                 * </pre>
                 */
                function getDefaultTab() {
                    return _.clone(_.find(tabs, function (tab) {
                        return tab.state === defaultTab;
                    }), true);
                }

                /**
                 * @ngdoc method
                 * @name pipHelp.Service.pipHelp#addTab
                 * @methodOf pipHelp.Service.pipHelp
                 *
                 * @description
                 * This method allows add new tab into navigation menu. It accepts config object to define new state
                 * with needed params.
                 *
                 * {@link https://github.com/pip-webui/pip-webui-help/blob/master/src/help_service/help_service.js#L139 View source}
                 *
                 * @param {Object} tabObj Configuration object contains settings for another tab
                 * @param {Object.<string>} tabObj.state   Name of tab state which is available via UI router
                 * @param {Object.<string>} tabObj.title   Tab title in the navigation menu.
                 * @param {Object.<boolean>} tabObj.access If it is true it will be available only for logged in users
                 * @param {Object.<boolean>} tabObj.visible If it is true the tab will be visible
                 * @param {Object.<Object>} tabObj.stateConfig  Configuration object in format like UI Router state
                 *
                 * @example
                 * <pre>
                 *  // on the config phase
                 *  pipHelpProvider.addTab({
                 *      state: 'test',
                 *      title: 'Test help tab',
                 *      auth: true,
                 *      stateConfig: {
                 *          url: '/test',
                 *          templateUrl: 'help/help_test1.html'
                 *      }
                 *  });
                 * </pre>
                 */
                function addTab(tabObj) {
                    var tab;

                    validateTab(tabObj);

                    tab = _.find(tabs, function (tab) {
                        return tab.state === getFullStateName(tabObj.state);
                    });
                    if (tab) {
                        throw new Error('Tab with state name "' + tabObj.state + '" is already registered');
                    }

                    tabs.push({
                        state: getFullStateName(tabObj.state),
                        title: tabObj.title,
                        access: tabObj.access || angular.noop,
                        visible: tabObj.visible || true,
                        stateConfig: _.clone(tabObj.stateConfig, true)
                    });

                    $stateProvider.state(getFullStateName(tabObj.state), tabObj.stateConfig);

                    // if we just added first state and no default state is specified
                    if (_.isUndefined(defaultTab) && tabs.length === 1) {
                        setDefaultTab(tabObj.state);
                    }
                }

                /**
                 * @ngdoc method
                 * @name pipHelp.Service.pipHelp#setDefaultTab
                 * @methodOf pipHelp.Service.pipHelp
                 *
                 * @description
                 * This method establishes passed state as default which is redirected at after transfer on abstract
                 * state
                 *
                 * {@link https://github.com/pip-webui/pip-webui-help/blob/master/src/help_service/help_service.js#L185 View source}
                 *
                 * @param {Object} name     Name of the state
                 *
                 * @example
                 * <pre>
                 * pipHelpProvider.setDefaultTab('test');
                 * </pre>
                 */
                function setDefaultTab(name) {
                    var tab, error;

                    tab = _.find(tabs, function (tab) {
                        return tab.state === getFullStateName(name);
                    });
                    if (!tab) {
                        error = new Error('Tab with state name "' + name + '" is not registered');
                        throw error;
                    }

                    defaultTab = getFullStateName(name);

                    $stateProvider.redirect('help', getFullStateName(name));
                }

                /**
                 * This method validates passed state.
                 * If it is incorrect it will throw an error.
                 */
                function validateTab(tabObj) {
                    if (!tabObj || !_.isObject(tabObj)) {
                        throw new Error('Invalid object');
                    }

                    if (!tabObj.state || tabObj.state === '') {
                        throw new Error('Tab should have valid Angular UI router state name');
                    }

                    if (tabObj.access && !_.isFunction(tabObj.access)) {
                        throw new Error('"access" should be a function');
                    }

                    if (!tabObj.stateConfig || !_.isObject(tabObj.stateConfig)) {
                        throw new Error('Invalid state configuration object');
                    }
                }
            }]);

})(window.angular, window._);



//# sourceMappingURL=pip-webui.js.map
