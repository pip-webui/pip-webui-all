(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).services = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
require("./translate");
require("./session");
require("./transactions");
require("./routing");
require("./utilities");
angular.module('pipServices', [
    'pipTranslate',
    'pipSession',
    'pipTransaction',
    'pipRouting',
    'pipFormat',
    'pipTimer',
    'pipScroll',
    'pipTags',
    'pipCodes',
    'pipSystemInfo',
    'pipPageReset'
]);
__export(require("./translate"));
__export(require("./session"));
__export(require("./transactions"));
__export(require("./routing"));
},{"./routing":5,"./session":8,"./transactions":13,"./translate":18,"./utilities":26}],2:[function(require,module,exports){
"use strict";
captureStateTranslations.$inject = ['$rootScope'];
decorateBackStateService.$inject = ['$delegate', '$window'];
addBackStateDecorator.$inject = ['$provide'];
Object.defineProperty(exports, "__esModule", { value: true });
function captureStateTranslations($rootScope) {
    "ngInject";
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        exports.CurrentState = {
            name: toState.name,
            url: toState.url,
            params: toParams
        };
        exports.PreviousState = {
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
        if (exports.PreviousState != null
            && exports.PreviousState.name != null) {
            var state = _.cloneDeep(exports.PreviousState);
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
    .module('pipRouting')
    .config(addBackStateDecorator)
    .run(captureStateTranslations);
},{}],3:[function(require,module,exports){
decorateRedirectStateProvider.$inject = ['$delegate'];
addRedirectStateProviderDecorator.$inject = ['$provide'];
decorateRedirectStateService.$inject = ['$delegate', '$timeout'];
addRedirectStateDecorator.$inject = ['$provide'];
var RedirectedStates = {};
function decorateRedirectStateProvider($delegate) {
    "ngInject";
    $delegate.redirect = redirect;
    return $delegate;
    function redirect(fromState, toState) {
        RedirectedStates[fromState] = toState;
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
        var toState = RedirectedStates[state.name];
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
    .module('pipRouting')
    .config(addRedirectStateProviderDecorator)
    .config(addRedirectStateDecorator);
},{}],4:[function(require,module,exports){
"use strict";
hookRoutingEvents.$inject = ['$rootScope', '$log', '$state'];
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingVar = "$routing";
function hookRoutingEvents($rootScope, $log, $state) {
    "ngInject";
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        $rootScope[exports.RoutingVar] = true;
    });
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $rootScope[exports.RoutingVar] = false;
    });
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        $rootScope[exports.RoutingVar] = false;
        $log.error('Error while switching route to ' + toState.name);
        $log.error(error);
    });
}
angular
    .module('pipRouting')
    .run(hookRoutingEvents);
},{}],5:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipRouting', ['ui.router']);
require("./BackDecorator");
require("./RedirectDecorator");
require("./RoutingEvents");
__export(require("./BackDecorator"));
__export(require("./RoutingEvents"));
},{"./BackDecorator":2,"./RedirectDecorator":3,"./RoutingEvents":4}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityRootVar = "$identity";
exports.IdentityChangedEvent = "pipIdentityChanged";
var IdentityService = (function () {
    function IdentityService(setRootVar, identity, $rootScope, $log) {
        this._setRootVar = setRootVar;
        this._identity = identity;
        this._rootScope = $rootScope;
        this._log = $log;
        this.setRootVar();
    }
    IdentityService.prototype.setRootVar = function () {
        if (this._setRootVar)
            this._rootScope[exports.IdentityRootVar] = this._identity;
    };
    Object.defineProperty(IdentityService.prototype, "identity", {
        get: function () {
            return this._identity;
        },
        set: function (value) {
            this._identity = value;
            this.setRootVar();
            this._rootScope.$emit(exports.IdentityChangedEvent, this._identity);
            var identity = value || {};
            this._log.debug("Changed identity to " + JSON.stringify(identity));
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
    IdentityProvider.prototype.$get = ['$rootScope', '$log', function ($rootScope, $log) {
        "ngInject";
        if (this._service == null)
            this._service = new IdentityService(this._setRootVar, this._identity, $rootScope, $log);
        return this._service;
    }];
    return IdentityProvider;
}());
angular
    .module('pipSession')
    .provider('pipIdentity', IdentityProvider);
},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionRootVar = "$session";
exports.SessionOpenedEvent = "pipSessionOpened";
exports.SessionClosedEvent = "pipSessionClosed";
var SessionService = (function () {
    function SessionService(setRootVar, session, $rootScope, $log) {
        this._setRootVar = setRootVar;
        this._session = session;
        this._rootScope = $rootScope;
        this._log = $log;
        this.setRootVar();
    }
    SessionService.prototype.setRootVar = function () {
        if (this._setRootVar)
            this._rootScope[exports.SessionRootVar] = this._session;
    };
    Object.defineProperty(SessionService.prototype, "session", {
        get: function () {
            return this._session;
        },
        enumerable: true,
        configurable: true
    });
    SessionService.prototype.isOpened = function () {
        return this._session != null;
    };
    SessionService.prototype.open = function (session, fullReset, partialReset) {
        if (fullReset === void 0) { fullReset = false; }
        if (partialReset === void 0) { partialReset = false; }
        if (session == null)
            throw new Error("Session cannot be null");
        this._session = session;
        this.setRootVar();
        this._rootScope.$emit(exports.SessionOpenedEvent, session);
        this._log.debug("Opened session " + session);
    };
    SessionService.prototype.close = function (fullReset, partialReset) {
        if (fullReset === void 0) { fullReset = false; }
        if (partialReset === void 0) { partialReset = false; }
        var oldSession = this._session;
        this._session = null;
        this.setRootVar();
        this._rootScope.$emit(exports.SessionClosedEvent, oldSession);
        this._log.debug("Closed session " + oldSession);
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
    SessionProvider.prototype.$get = ['$rootScope', '$log', function ($rootScope, $log) {
        "ngInject";
        if (this._service == null)
            this._service = new SessionService(this._setRootVar, this._session, $rootScope, $log);
        return this._service;
    }];
    return SessionProvider;
}());
angular
    .module('pipSession')
    .provider('pipSession', SessionProvider);
},{}],8:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipSession', []);
require("./IdentityService");
require("./SessionService");
__export(require("./IdentityService"));
__export(require("./SessionService"));
},{"./IdentityService":6,"./SessionService":7}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TransactionError_1 = require("./TransactionError");
var Transaction = (function () {
    function Transaction(scope) {
        this._scope = null;
        this._id = null;
        this._operation = null;
        this._error = new TransactionError_1.TransactionError();
        this._progress = 0;
        this._scope = scope;
    }
    Object.defineProperty(Transaction.prototype, "scope", {
        get: function () {
            return this._scope;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transaction.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transaction.prototype, "operation", {
        get: function () {
            return this._operation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transaction.prototype, "progress", {
        get: function () {
            return this._progress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transaction.prototype, "error", {
        get: function () {
            return this._error;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transaction.prototype, "errorMessage", {
        get: function () {
            return this._error.message;
        },
        enumerable: true,
        configurable: true
    });
    Transaction.prototype.reset = function () {
        this._id = null;
        this._operation = null;
        this._progress = 0;
        this._error.reset();
    };
    Transaction.prototype.busy = function () {
        return this._id != null;
    };
    Transaction.prototype.failed = function () {
        return !this._error.empty();
    };
    Transaction.prototype.aborted = function (id) {
        return this._id != id;
    };
    Transaction.prototype.begin = function (operation) {
        if (this._id != null)
            return null;
        this._id = new Date().getTime().toString();
        this._operation = operation || 'PROCESSING';
        this._error.reset();
        return this._id;
    };
    Transaction.prototype.update = function (progress) {
        this._progress = Math.max(progress, 100);
    };
    Transaction.prototype.abort = function () {
        this._id = null;
        this._error.reset();
    };
    Transaction.prototype.end = function (error) {
        this._error.decode(error);
        this._id = null;
    };
    return Transaction;
}());
exports.Transaction = Transaction;
},{"./TransactionError":10}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TransactionError = (function () {
    function TransactionError(error) {
        if (error != null)
            this.decode(error);
    }
    TransactionError.prototype.reset = function () {
        this.code = null;
        this.message = null;
        this.details = null;
        this.cause = null;
        this.stack_trace = null;
    };
    TransactionError.prototype.empty = function () {
        return this.message = null && this.code == null;
    };
    TransactionError.prototype.decode = function (error) {
        this.reset();
        if (error == null)
            return;
        if (error.message) {
            this.message = error.message;
        }
        if (error.data) {
            if (error.data.code) {
                this.message = this.message || 'ERROR_' + error.data.code;
                this.code = this.code || error.data.code;
            }
            if (error.data.message) {
                this.message = this.message || error.data.message;
            }
            this.message = this.message || error.data;
            this.details = this.details || error.data;
            this.cause = error.data.cause;
            this.stack_trace = error.data.stack_trace;
            this.details = error.data.details;
        }
        if (error.statusText) {
            this.message = this.message || error.statusText;
        }
        if (error.status) {
            this.message = this.message || 'ERROR_' + error.status;
            this.code = this.code || error.status;
        }
        this.message = this.message || error;
        this.details = this.details || error;
    };
    return TransactionError;
}());
exports.TransactionError = TransactionError;
},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Transaction_1 = require("./Transaction");
var TransactionService = (function () {
    function TransactionService() {
        this._transactions = {};
    }
    TransactionService.prototype.create = function (scope) {
        var transaction = new Transaction_1.Transaction(scope);
        if (scope != null)
            this._transactions[scope] = transaction;
        return transaction;
    };
    TransactionService.prototype.get = function (scope) {
        var transaction = scope != null ? this._transactions[scope] : null;
        if (transaction == null) {
            transaction = new Transaction_1.Transaction(scope);
            if (scope != null)
                this._transactions[scope] = transaction;
        }
        return transaction;
    };
    return TransactionService;
}());
angular
    .module('pipTransaction')
    .service('pipTransaction', TransactionService);
},{"./Transaction":9}],12:[function(require,module,exports){
"use strict";
configureTransactionStrings.$inject = ['$injector'];
Object.defineProperty(exports, "__esModule", { value: true });
function configureTransactionStrings($injector) {
    "ngInject";
    var pipTranslate = $injector.has('pipTranslateProvider')
        ? $injector.get('pipTranslateProvider') : null;
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
}
angular
    .module('pipTransaction')
    .config(configureTransactionStrings);
},{}],13:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipTransaction', []);
require("./TransactionStrings");
require("./TransactionError");
require("./Transaction");
require("./TransactionService");
__export(require("./TransactionError"));
__export(require("./Transaction"));
},{"./Transaction":9,"./TransactionError":10,"./TransactionService":11,"./TransactionStrings":12}],14:[function(require,module,exports){
"use strict";
translateDirective.$inject = ['pipTranslate'];
translateHtmlDirective.$inject = ['pipTranslate'];
Object.defineProperty(exports, "__esModule", { value: true });
function translateDirective(pipTranslate) {
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
function translateHtmlDirective(pipTranslate) {
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
    .module('pipTranslate')
    .directive('pipTranslate', translateDirective)
    .directive('pipTranslateHtml', translateHtmlDirective);
},{}],15:[function(require,module,exports){
"use strict";
translateFilter.$inject = ['pipTranslate'];
optionalTranslateFilter.$inject = ['$injector'];
Object.defineProperty(exports, "__esModule", { value: true });
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
    .module('pipTranslate')
    .filter('translate', translateFilter);
},{}],16:[function(require,module,exports){
"use strict";
initTranslate.$inject = ['pipTranslate'];
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Translation_1 = require("./Translation");
var PageResetService_1 = require("../utilities/PageResetService");
exports.LanguageRootVar = "$language";
exports.LanguageChangedEvent = "pipLanguageChanged";
var TranslateService = (function () {
    function TranslateService(translation, setRootVar, persist, $rootScope, $log, $window, $mdDateLocale) {
        this._setRootVar = setRootVar;
        this._persist = persist;
        this._translation = translation;
        this._rootScope = $rootScope;
        this._log = $log;
        this._window = $window;
        this._mdDateLocale = $mdDateLocale;
        if (this._persist && this._window.localStorage)
            this._translation.language = this._window.localStorage.getItem('language') || this._translation.language;
        this._log.debug("Set language to " + this._translation.language);
        this.save();
    }
    TranslateService.prototype.changeLocale = function (locale) {
        if (!locale)
            return;
        var localeDate;
        moment.locale(locale);
        localeDate = moment.localeData();
        this._mdDateLocale.months = angular.isArray(localeDate._months) ? localeDate._months : localeDate._months.format;
        this._mdDateLocale.shortMonths = angular.isArray(localeDate._monthsShort) ? localeDate._monthsShort : localeDate._monthsShort.format;
        this._mdDateLocale.days = angular.isArray(localeDate._weekdays) ? localeDate._weekdays : localeDate._weekdays.format;
        this._mdDateLocale.shortDays = localeDate._weekdaysMin;
        this._mdDateLocale.firstDayOfWeek = localeDate._week.dow;
    };
    TranslateService.prototype.save = function () {
        if (this._setRootVar)
            this._rootScope[exports.LanguageRootVar] = this._translation.language;
        if (this._persist && this._window.localStorage != null)
            this._window.localStorage.setItem('language', this._translation.language);
    };
    Object.defineProperty(TranslateService.prototype, "language", {
        get: function () {
            return this._translation.language;
        },
        set: function (value) {
            if (value != this._translation.language) {
                this._translation.language = value;
                this._log.debug("Changing language to " + value);
                this.changeLocale(this._translation.language);
                this.save();
                this._rootScope.$emit(exports.LanguageChangedEvent, value);
                this._rootScope.$emit(PageResetService_1.ResetPageEvent);
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
    TranslateService.prototype.translations = function (language, translations) {
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
        var _this = _super.call(this) || this;
        _this._setRootVar = true;
        _this._persist = true;
        return _this;
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
    TranslateProvider.prototype.$get = ['$rootScope', '$log', '$window', '$mdDateLocale', function ($rootScope, $log, $window, $mdDateLocale) {
        "ngInject";
        if (this._service == null)
            this._service = new TranslateService(this, this._setRootVar, this._persist, $rootScope, $log, $window, $mdDateLocale);
        return this._service;
    }];
    return TranslateProvider;
}(Translation_1.Translation));
function initTranslate(pipTranslate) {
    pipTranslate.language;
}
angular
    .module('pipTranslate')
    .provider('pipTranslate', TranslateProvider)
    .run(initTranslate);
},{"../utilities/PageResetService":21,"./Translation":17}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    Translation.prototype.translations = function (language, translations) {
        this.setTranslations(language, translations);
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
exports.Translation = Translation;
},{}],18:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipTranslate', []);
require("./Translation");
require("./TranslateService");
require("./TranslateFilter");
require("./TranslateDirective");
__export(require("./Translation"));
__export(require("./TranslateService"));
},{"./TranslateDirective":14,"./TranslateFilter":15,"./TranslateService":16,"./Translation":17}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Codes = (function () {
    function Codes() {
    }
    Codes.prototype.hash = function (value) {
        if (value == null)
            return 0;
        var result = 0;
        for (var i = 0; i < value.length; i++)
            result += value.charCodeAt(i);
        return result;
    };
    Codes.prototype.verification = function () {
        return Math.random().toString(36).substr(2, 10).toUpperCase();
    };
    return Codes;
}());
angular
    .module('pipCodes', [])
    .service('pipCodes', Codes);
},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Format = (function () {
    function Format() {
        this.cache = {};
    }
    Format.prototype.sample = function (value, maxLength) {
        if (!value || value == '') {
            return '';
        }
        var length = value.indexOf('\n');
        length = length >= 0 ? length : value.length;
        length = length < maxLength ? value.length : maxLength;
        return value.substring(0, length);
    };
    Format.prototype.strRepeat = function (str, qty) {
        if (qty < 1) {
            return '';
        }
        var result = '';
        while (qty > 0) {
            if (qty & 1)
                result += str;
            qty >>= 1, str += str;
        }
        return result;
    };
    Format.prototype.getType = function (variable) {
        return toString.call(variable).slice(8, -1).toLowerCase();
    };
    Format.prototype.parseFormat = function (fmt) {
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
                                throw new Error('Unknown error');
                            }
                        }
                    }
                    else {
                        throw new Error('Unknown error');
                    }
                    match[2] = field_list;
                }
                else {
                    arg_names |= 2;
                }
                if (arg_names === 3) {
                    throw new Error('Mixing positional and named placeholders is not (yet) supported');
                }
                parse_tree.push(match);
            }
            else {
                throw new Error('Unknown error');
            }
            _fmt = _fmt.substring(match[0].length);
        }
        return parse_tree;
    };
    Format.prototype.format = function (parse_tree, argv) {
        var cursor = 0;
        var tree_length = parse_tree.length;
        var output = [];
        for (var i = 0; i < tree_length; i++) {
            var node_type = this.getType(parse_tree[i]);
            if (node_type === 'string') {
                output.push(parse_tree[i]);
            }
            else if (node_type === 'array') {
                var match = parse_tree[i];
                var arg = void 0;
                if (match[2]) {
                    arg = argv[cursor];
                    for (var k = 0; k < match[2].length; k++) {
                        if (!arg.hasOwnProperty(match[2][k])) {
                            throw new Error(this.sprintf('Property "%s" does not exist', match[2][k]));
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
                if (/[^s]/.test(match[8]) && (this.getType(arg) != 'number')) {
                    throw new Error(this.sprintf('Expecting number but found %s', this.getType(arg)));
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
                var pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
                var pad_length = match[6] - String(arg).length;
                var pad = match[6] ? this.strRepeat(pad_character, pad_length) : '';
                output.push(match[5] ? arg + pad : pad + arg);
            }
        }
        return output.join('');
    };
    Format.prototype.sprintf = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!this.cache.hasOwnProperty(message))
            this.cache[message] = this.parseFormat(message);
        return this.format(this.cache[message], args);
    };
    return Format;
}());
angular
    .module('pipFormat', [])
    .service('pipFormat', Format);
},{}],21:[function(require,module,exports){
"use strict";
hookResetEvents.$inject = ['$rootScope', 'pipPageReset'];
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPageEvent = "pipResetPage";
exports.ResetAreaEvent = "pipResetArea";
exports.ResetRootVar = "$reset";
exports.ResetAreaRootVar = "$resetArea";
var PageResetService = (function () {
    PageResetService.$inject = ['$rootScope', '$log', '$timeout'];
    function PageResetService($rootScope, $log, $timeout) {
        this._rootScope = $rootScope;
        this._log = $log;
        this._timeout = $timeout;
        $rootScope[exports.ResetRootVar] = false;
        $rootScope[exports.ResetAreaRootVar] = null;
    }
    PageResetService.prototype.reset = function () {
        this._log.debug("Resetting the entire page");
        this.performReset(null);
    };
    PageResetService.prototype.resetArea = function (area) {
        this._log.debug("Resetting the area " + area);
        this.performReset(area);
    };
    PageResetService.prototype.performReset = function (area) {
        var _this = this;
        this._rootScope[exports.ResetRootVar] = area == null;
        this._rootScope[exports.ResetAreaRootVar] = area;
        this._timeout(function () {
            _this._rootScope[exports.ResetRootVar] = false;
            _this._rootScope[exports.ResetAreaRootVar] = null;
        }, 0);
    };
    return PageResetService;
}());
function hookResetEvents($rootScope, pipPageReset) {
    $rootScope.$on(exports.ResetPageEvent, function () { pipPageReset.reset(); });
    $rootScope.$on(exports.ResetAreaEvent, function (event, area) { pipPageReset.resetArea(area); });
}
angular.module('pipPageReset', [])
    .service('pipPageReset', PageResetService)
    .run(hookResetEvents);
},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ScrollService = (function () {
    function ScrollService() {
    }
    ScrollService.prototype.scrollTo = function (parentElement, childElement, animationDuration) {
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
    };
    return ScrollService;
}());
angular
    .module('pipScroll', [])
    .service('pipScroll', ScrollService);
},{}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SystemInfo = (function () {
    SystemInfo.$inject = ['$window'];
    function SystemInfo($window) {
        "ngInject";
        this._window = $window;
    }
    Object.defineProperty(SystemInfo.prototype, "browserName", {
        get: function () {
            var ua = this._window.navigator.userAgent;
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SystemInfo.prototype, "browserVersion", {
        get: function () {
            var version;
            var ua = this._window.navigator.userAgent;
            var browser = this.browserName;
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SystemInfo.prototype, "platform", {
        get: function () {
            var ua = this._window.navigator.userAgent;
            if (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua.toLowerCase()))
                return 'mobile';
            return 'desktop';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SystemInfo.prototype, "os", {
        get: function () {
            var ua = this._window.navigator.userAgent;
            try {
                var osAll = (/(windows|mac|android|linux|blackberry|sunos|solaris|iphone)/.exec(ua.toLowerCase()) || [ua])[0].replace('sunos', 'solaris');
                var osAndroid = (/(android)/.exec(ua.toLowerCase()) || '');
                return osAndroid && (osAndroid == 'android' || (osAndroid[0] == 'android')) ? 'android' : osAll;
            }
            catch (err) {
                return 'unknown';
            }
        },
        enumerable: true,
        configurable: true
    });
    SystemInfo.prototype.isDesktop = function () {
        return this.platform == 'desktop';
    };
    SystemInfo.prototype.isMobile = function () {
        return this.platform == 'mobile';
    };
    SystemInfo.prototype.isCordova = function () {
        return false;
    };
    SystemInfo.prototype.isSupported = function (supported) {
        if (!supported)
            supported = {
                edge: 11,
                ie: 11,
                firefox: 43,
                opera: 35,
                chrome: 47
            };
        var browser = this.browserName;
        var version = this.browserVersion;
        version = version.split(".")[0];
        if (browser && supported[browser] && version >= supported[browser])
            return true;
        return true;
    };
    return SystemInfo;
}());
angular
    .module('pipSystemInfo', [])
    .service('pipSystemInfo', SystemInfo);
},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tags = (function () {
    function Tags() {
    }
    Tags.prototype.normalizeOne = function (tag) {
        return tag
            ? _.trim(tag.replace(/(_|#)+/g, ' '))
            : null;
    };
    Tags.prototype.compressOne = function (tag) {
        return tag
            ? tag.replace(/( |_|#)/g, '').toLowerCase()
            : null;
    };
    Tags.prototype.equal = function (tag1, tag2) {
        if (tag1 == null && tag2 == null)
            return true;
        if (tag1 == null || tag2 == null)
            return false;
        return this.compressOne(tag1) == this.compressOne(tag2);
    };
    Tags.prototype.normalizeAll = function (tags) {
        var _this = this;
        if (_.isString(tags))
            tags = tags.split(/( |,|;)+/);
        tags = _.map(tags, function (tag) { return _this.normalizeOne(tag); });
        return tags;
    };
    Tags.prototype.compressAll = function (tags) {
        var _this = this;
        if (_.isString(tags))
            tags = tags.split(/( |,|;)+/);
        tags = _.map(tags, function (tag) { return _this.compressOne(tag); });
        return tags;
    };
    Tags.prototype.extract = function (entity, searchFields) {
        var _this = this;
        var tags = this.normalizeAll(entity.tags);
        _.each(searchFields, function (field) {
            var text = entity[field] || '';
            if (text != '') {
                var hashTags = text.match(/#\w+/g);
                tags = tags.concat(_this.normalizeAll(hashTags));
            }
        });
        return _.uniq(tags);
    };
    return Tags;
}());
angular
    .module('pipTags', [])
    .service('pipTags', Tags);
},{}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TimerEvent = (function () {
    function TimerEvent(event, timeout) {
        this.event = event;
        this.timeout = timeout;
    }
    return TimerEvent;
}());
var DefaultEvents = [
    new TimerEvent('pipAutoPullChanges', 60000),
    new TimerEvent('pipAutoUpdatePage', 15000),
    new TimerEvent('pipAutoUpdateCollection', 300000)
];
var TimerService = (function () {
    TimerService.$inject = ['$rootScope', '$log', '$interval'];
    function TimerService($rootScope, $log, $interval) {
        "ngInject";
        this._started = false;
        this._events = _.cloneDeep(DefaultEvents);
        this._rootScope = $rootScope;
        this._log = $log;
        this._interval = $interval;
    }
    TimerService.prototype.isStarted = function () {
        return this._started;
    };
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
        event.interval = this._interval(function () {
            _this._log.debug('Generated timer event ' + event.event);
            _this._rootScope.$emit(event.event);
        }, event.timeout);
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
angular.module('pipTimer', [])
    .service('pipTimer', TimerService);
},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./Format");
require("./TimerService");
require("./ScrollService");
require("./Tags");
require("./Codes");
require("./SystemInfo");
require("./PageResetService");
},{"./Codes":19,"./Format":20,"./PageResetService":21,"./ScrollService":22,"./SystemInfo":23,"./Tags":24,"./TimerService":25}]},{},[1])(1)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).buttons = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
{
    translate.$inject = ['$injector'];
    function translate($injector) {
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate['translate'](key) || key : key;
        };
    }
    angular.module('pipButtons.Translate', [])
        .filter('translate', translate);
}
},{}],2:[function(require,module,exports){
{
    pipFabTooltipVisibility.$inject = ['$parse', '$timeout'];
    var FabTooltipVisibilityController_1 = (function () {
        FabTooltipVisibilityController_1.$inject = ['$element', '$attrs', '$scope', '$timeout', '$parse'];
        function FabTooltipVisibilityController_1($element, $attrs, $scope, $timeout, $parse) {
            "ngInject";
            var trigGetter = $parse($attrs['pipFabTooltipVisibility']), showGetter = $parse($attrs['pipFabShowTooltip']), showSetter = showGetter.assign;
            $scope.$watch(trigGetter, function (isOpen) {
                if (!_.isFunction(showSetter))
                    return;
                if (isOpen) {
                    $timeout(function () {
                        showSetter($scope, isOpen);
                    }, 600);
                }
                else {
                    showSetter($scope, isOpen);
                }
            });
        }
        return FabTooltipVisibilityController_1;
    }());
    function pipFabTooltipVisibility($parse, $timeout) {
        return {
            restrict: 'A',
            scope: false,
            controller: FabTooltipVisibilityController_1
        };
    }
    angular
        .module('pipFabTooltipVisibility', [])
        .directive('pipFabTooltipVisibility', pipFabTooltipVisibility);
}
},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./refresh_button/RefreshButton");
require("./toggle_buttons/ToggleButtons");
require("./fabs/FabTooltipVisibility");
angular.module('pipButtons', [
    'pipToggleButtons',
    'pipRefreshButton',
    'pipFabTooltipVisibility'
]);
},{"./fabs/FabTooltipVisibility":2,"./refresh_button/RefreshButton":4,"./toggle_buttons/ToggleButtons":5}],4:[function(require,module,exports){
{
    var RefreshButtonBindings = {
        text: '<pipText',
        visible: '<pipVisible',
        onRefresh: '&?pipRefresh'
    };
    var RefreshButtonChanges = (function () {
        function RefreshButtonChanges() {
        }
        return RefreshButtonChanges;
    }());
    var RefreshButtonController = (function () {
        function RefreshButtonController($scope, $element, $attrs) {
            this.$scope = $scope;
            this.$element = $element;
            this.$attrs = $attrs;
        }
        RefreshButtonController.prototype.$postLink = function () {
            this._buttonElement = this.$element.children('.md-button');
            this._textElement = this._buttonElement.children('.pip-refresh-text');
            this.show();
        };
        RefreshButtonController.prototype.$onChanges = function (changes) {
            if (changes.visible.currentValue === true) {
                this.text = changes.text.currentValue;
                this.show();
            }
            else {
                this.hide();
            }
        };
        RefreshButtonController.prototype.onClick = function ($event) {
            if (this.onRefresh) {
                this.onRefresh({
                    $event: $event
                });
            }
        };
        RefreshButtonController.prototype.show = function () {
            if (this._textElement === undefined || this._buttonElement === undefined) {
                return;
            }
            this._textElement.text(this.text);
            this._buttonElement.show();
            var width = this._buttonElement.width();
            this._buttonElement.css('margin-left', '-' + width / 2 + 'px');
        };
        RefreshButtonController.prototype.hide = function () {
            this._buttonElement.hide();
        };
        return RefreshButtonController;
    }());
    var RefreshButtonComponent = {
        bindings: RefreshButtonBindings,
        controller: RefreshButtonController,
        template: '<md-button class="pip-refresh-button" tabindex="-1" ng-click="$ctrl.onClick($event)" aria-label="REFRESH">' +
            '<md-icon md-svg-icon="icons:refresh"></md-icon>' +
            '<span class="pip-refresh-text"></span>' +
            '</md-button>'
    };
    angular
        .module('pipRefreshButton', ['ngMaterial'])
        .component('pipRefreshButton', RefreshButtonComponent);
}
},{}],5:[function(require,module,exports){
{
    var ToggleButton = (function () {
        function ToggleButton() {
        }
        return ToggleButton;
    }());
    var ToggleButtonsBindings = {
        ngDisabled: '<?',
        buttons: '<pipButtons',
        currentButtonValue: '=ngModel',
        currentButton: '=?pipButtonObject',
        multiselect: '<?pipMultiselect',
        change: '&ngChange',
        onlyToggle: '<?pipOnlyToggle'
    };
    var ToggleButtonsChanges = (function () {
        function ToggleButtonsChanges() {
        }
        return ToggleButtonsChanges;
    }());
    var ToggleButtonsController = (function () {
        ToggleButtonsController.$inject = ['$element', '$attrs', '$scope', '$timeout', '$injector'];
        function ToggleButtonsController($element, $attrs, $scope, $timeout, $injector) {
            "ngInject";
            this.$element = $element;
            this.$attrs = $attrs;
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
            this.class = $attrs['class'] || '';
            var index = _.indexOf(this.buttons, _.find(this.buttons, {
                id: this.currentButtonValue
            }));
            this.currentButtonIndex = index < 0 ? 0 : index;
            this.currentButton = this.buttons.length > 0 ? this.buttons[this.currentButtonIndex] : this.currentButton;
        }
        ToggleButtonsController.prototype.$onChanges = function (changes) {
            this.multiselect = changes.multiselect ? changes.multiselect.currentValue : false;
            this.disabled = changes.ngDisabled ? changes.ngDisabled.currentValue : false;
            this.onlyToggle = changes.onlyToggle ? changes.onlyToggle.currentValue : false;
            this.buttons = !changes.buttons || _.isArray(changes.buttons.currentValue) && changes.buttons.currentValue.length === 0 ? [] : changes.buttons.currentValue;
            var index = _.indexOf(this.buttons, _.find(this.buttons, {
                id: this.currentButtonValue
            }));
            this.currentButtonIndex = index < 0 ? 0 : index;
            this.currentButton = this.buttons.length > 0 ? this.buttons[this.currentButtonIndex] : this.currentButton;
        };
        ToggleButtonsController.prototype.$postLink = function () {
            var _this = this;
            this.$element
                .on('focusin', function () {
                _this.$element.addClass('focused-container');
            })
                .on('focusout', function () {
                _this.$element.removeClass('focused-container');
            });
        };
        ToggleButtonsController.prototype.buttonSelected = function (index) {
            var _this = this;
            if (this.disabled) {
                return;
            }
            this.currentButtonIndex = index;
            this.currentButton = this.buttons[this.currentButtonIndex];
            this.currentButtonValue = this.currentButton.id || index;
            this.$timeout(function () {
                if (_this.change) {
                    _this.change();
                }
            });
        };
        ToggleButtonsController.prototype.enterSpacePress = function (event) {
            this.buttonSelected(event.index);
        };
        ToggleButtonsController.prototype.highlightButton = function (index) {
            if (this.multiselect &&
                !_.isUndefined(this.currentButton.level) &&
                !_.isUndefined(this.buttons[index].level)) {
                return this.currentButton.level >= this.buttons[index].level;
            }
            return this.currentButtonIndex == index;
        };
        return ToggleButtonsController;
    }());
    var ToggleButtons = {
        bindings: ToggleButtonsBindings,
        templateUrl: 'toggle_buttons/ToggleButtons.html',
        controller: ToggleButtonsController
    };
    angular
        .module('pipToggleButtons', ['pipButtons.Templates'])
        .component('pipToggleButtons', ToggleButtons);
}
},{}],6:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipButtons.Templates');
} catch (e) {
  module = angular.module('pipButtons.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('toggle_buttons/ToggleButtons.html',
    '<div class="pip-toggle-buttons layout-row {{$ctrl.class}}" pip-selected="$ctrl.bufButtonIndex" pip-enter-space-press="$ctrl.enterSpacePress($event)" ng-if="!$ctrl.pipMedia(\'xs\') || $ctrl.onlyToggle"><md-button tabindex="-1" ng-repeat="button in $ctrl.buttons" ng-class="{\'md-accent md-raised selected color-accent-bg\' : $ctrl.highlightButton($index)}" ng-attr-style="{{ \'background-color:\' + ($ctrl.highlightButton($index) ? button.backgroundColor : \'\') + \'!important\' }}" class="pip-selectable pip-chip-button flex" ng-click="$ctrl.buttonSelected($index, $event)" ng-disabled="button.disabled || $ctrl.disabled">{{button.name || button.title | translate}} <span ng-if="button.checked || button.complete || button.filled" class="pip-tagged">*</span></md-button></div><md-input-container class="md-block" ng-if="$ctrl.pipMedia(\'xs\') && !$ctrl.onlyToggle"><md-select ng-model="$ctrl.currentButtonIndex" ng-disabled="$ctrl.disabled" aria-label="DROPDOWN" md-on-close="$ctrl.buttonSelected($ctrl.currentButtonIndex)"><md-option ng-repeat="action in $ctrl.buttons" value="{{ ::$index }}">{{ (action.title || action.name) | translate }} <span ng-if="action.checked || action.complete || action.filled" class="pip-tagged">*</span></md-option></md-select></md-input-container>');
}]);
})();



},{}]},{},[6,1,2,3,4,5])(6)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).layouts = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MediaService_1 = require("../media/MediaService");
{
    var AuxPanelDirectiveController = (function () {
        function AuxPanelDirectiveController(pipAuxPanel) {
            this.pipAuxPanel = pipAuxPanel;
            this.normalSize = 320;
            this.largeSize = 480;
        }
        AuxPanelDirectiveController.prototype.isGtxs = function () {
            return Number($('body').width()) > MediaService_1.MainBreakpoints.xs && this.pipAuxPanel.isOpen();
        };
        AuxPanelDirectiveController.prototype.isGtlg = function () {
            return Number($('body').width()) > (MediaService_1.MainBreakpoints.lg + this.largeSize);
        };
        return AuxPanelDirectiveController;
    }());
    var AuxPanel = {
        controller: AuxPanelDirectiveController,
        transclude: true,
        template: '<md-sidenav class="md-sidenav-right md-whiteframe-z2 pip-auxpanel color-content-bg" ng-class="{\'pip-large\': $ctrl.isGtlg()}"' +
            'md-component-id="pip-auxpanel" md-is-locked-open="$ctrl.isGtxs()" pip-focused ng-transclude>' +
            '</md-sidenav>'
    };
    angular
        .module('pipAuxPanel')
        .component('pipAuxPanel', AuxPanel);
}
},{"../media/MediaService":14}],2:[function(require,module,exports){
{
    AuxPanelPartDirective.$inject = ['ngIfDirective'];
    var AuxPanelPartController_1 = (function () {
        AuxPanelPartController_1.$inject = ['$scope', '$element', '$attrs', '$rootScope', 'pipAuxPanel'];
        function AuxPanelPartController_1($scope, $element, $attrs, $rootScope, pipAuxPanel) {
            var _this = this;
            this.$scope = $scope;
            this.partName = '' + $attrs.pipAuxPanelPart;
            this.pos = this.partName.indexOf(':');
            if (this.pos > 0) {
                this.partValue = this.partName.substr(this.pos + 1);
                this.partName = this.partName.substr(0, this.pos);
            }
            this.onAuxPanelChanged(null, pipAuxPanel.config);
            $rootScope.$on('pipAuxPanelChanged', function (event, config) {
                _this.onAuxPanelChanged(event, config);
            });
        }
        AuxPanelPartController_1.prototype.onAuxPanelChanged = function (event, config) {
            var parts = config.parts || {};
            var currentPartValue = config[this.partName];
            this.$scope['visible'] = this.partValue ? currentPartValue == this.partValue : currentPartValue;
        };
        return AuxPanelPartController_1;
    }());
    function AuxPanelPartDirective(ngIfDirective) {
        "ngInject";
        var ngIf = ngIfDirective[0];
        return {
            transclude: ngIf.transclude,
            priority: ngIf.priority,
            terminal: ngIf.terminal,
            restrict: ngIf.restrict,
            scope: true,
            link: function ($scope, $element, $attrs) {
                $attrs.ngIf = function () { return $scope['visible']; };
                ngIf.link.apply(ngIf);
            },
            controller: AuxPanelPartController_1
        };
    }
    angular
        .module('pipAuxPanel')
        .directive('pipAuxPanelPart', AuxPanelPartDirective);
}
},{}],3:[function(require,module,exports){
"use strict";
hookAuxPanelEvents.$inject = ['$rootScope', 'pipAuxPanel'];
Object.defineProperty(exports, "__esModule", { value: true });
var IAuxPanelService_1 = require("./IAuxPanelService");
var IAuxPanelService_2 = require("./IAuxPanelService");
var AuxPanelService = (function () {
    function AuxPanelService(config, $rootScope, $mdSidenav) {
        this.id = 'pip-auxpanel';
        this._config = config;
        this._rootScope = $rootScope;
        this._sidenav = $mdSidenav;
    }
    Object.defineProperty(AuxPanelService.prototype, "config", {
        get: function () {
            return this._config;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuxPanelService.prototype, "classes", {
        get: function () {
            return this._config.classes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuxPanelService.prototype, "parts", {
        get: function () {
            return this._config.parts;
        },
        set: function (value) {
            this._config.parts = value || {};
            this.sendConfigEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuxPanelService.prototype, "state", {
        get: function () {
            return this._state;
        },
        set: function (value) {
            this._state = value || {};
            this._rootScope.$broadcast(IAuxPanelService_1.AuxPanelStateChangedEvent, value);
        },
        enumerable: true,
        configurable: true
    });
    AuxPanelService.prototype.isOpen = function () {
        return this._sidenav(this.id).isOpen();
    };
    AuxPanelService.prototype.open = function () {
        this._sidenav(this.id).open();
    };
    AuxPanelService.prototype.close = function () {
        this._sidenav(this.id).close();
    };
    AuxPanelService.prototype.toggle = function () {
        this._sidenav(this.id).toggle();
    };
    AuxPanelService.prototype.addClass = function () {
        var _this = this;
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        _.each(classes, function (c) {
            _this._config.classes.push(c);
        });
        this.sendConfigEvent();
    };
    AuxPanelService.prototype.removeClass = function () {
        var _this = this;
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        _.each(classes, function (c) {
            _this._config.classes = _.reject(_this._config.classes, function (cc) { return cc == c; });
        });
        this.sendConfigEvent();
    };
    AuxPanelService.prototype.part = function (part, value) {
        this._config.parts[part] = value;
        this.sendConfigEvent();
    };
    AuxPanelService.prototype.sendConfigEvent = function () {
        this._rootScope.$emit(IAuxPanelService_1.AuxPanelChangedEvent, this._config);
    };
    return AuxPanelService;
}());
var AuxPanelProvider = (function () {
    function AuxPanelProvider() {
        this._config = {
            parts: {},
            classes: [],
            type: 'sticky',
            state: null
        };
    }
    Object.defineProperty(AuxPanelProvider.prototype, "config", {
        get: function () {
            return this._config;
        },
        set: function (value) {
            this._config = value || new IAuxPanelService_2.AuxPanelConfig();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuxPanelProvider.prototype, "parts", {
        get: function () {
            return this._config.parts;
        },
        set: function (value) {
            this._config.parts = value || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuxPanelProvider.prototype, "type", {
        get: function () {
            return this._config.type;
        },
        set: function (value) {
            this._config.type = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuxPanelProvider.prototype, "classes", {
        get: function () {
            return this._config.classes;
        },
        set: function (value) {
            this._config.classes = value || [];
        },
        enumerable: true,
        configurable: true
    });
    AuxPanelProvider.prototype.addClass = function () {
        var _this = this;
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        _.each(classes, function (c) {
            _this._config.classes.push(c);
        });
    };
    AuxPanelProvider.prototype.removeClass = function () {
        var _this = this;
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        _.each(classes, function (c) {
            _this._config.classes = _.reject(_this._config.classes, function (cc) { return cc == c; });
        });
    };
    AuxPanelProvider.prototype.part = function (part, value) {
        this._config.parts[part] = value;
    };
    AuxPanelProvider.prototype.open = function () {
        this._service.open();
    };
    AuxPanelProvider.prototype.close = function () {
        this._service.close();
    };
    AuxPanelProvider.prototype.toggle = function () {
        this._service.toggle();
    };
    AuxPanelProvider.prototype.$get = ['$rootScope', '$mdSidenav', function ($rootScope, $mdSidenav) {
        "ngInject";
        if (this._service == null)
            this._service = new AuxPanelService(this._config, $rootScope, $mdSidenav);
        return this._service;
    }];
    return AuxPanelProvider;
}());
function hookAuxPanelEvents($rootScope, pipAuxPanel) {
    $rootScope.$on(IAuxPanelService_1.OpenAuxPanelEvent, function () { pipAuxPanel.open(); });
    $rootScope.$on(IAuxPanelService_1.CloseAuxPanelEvent, function () { pipAuxPanel.close(); });
}
angular
    .module('pipAuxPanel')
    .provider('pipAuxPanel', AuxPanelProvider)
    .run(hookAuxPanelEvents);
},{"./IAuxPanelService":4}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuxPanelChangedEvent = 'pipAuxPanelChanged';
exports.AuxPanelStateChangedEvent = 'pipAuxPanelStateChanged';
exports.OpenAuxPanelEvent = 'pipOpenAuxPanel';
exports.CloseAuxPanelEvent = 'pipCloseAuxPanel';
var AuxPanelConfig = (function () {
    function AuxPanelConfig() {
    }
    return AuxPanelConfig;
}());
exports.AuxPanelConfig = AuxPanelConfig;
},{}],5:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipAuxPanel', ['ngMaterial']);
require("./AuxPanelService");
require("./AuxPanelPart");
require("./AuxPanel");
__export(require("./IAuxPanelService"));
},{"./AuxPanel":1,"./AuxPanelPart":2,"./AuxPanelService":3,"./IAuxPanelService":4}],6:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipLayout', ['wu.masonry', 'pipMedia', 'pipAuxPanel']);
require("./media/index");
require("./layouts/MainDirective");
require("./layouts/CardDirective");
require("./layouts/DialogDirective");
require("./layouts/DocumentDirective");
require("./layouts/SimpleDirective");
require("./layouts/TilesDirective");
require("./auxpanel/index");
__export(require("./media/index"));
},{"./auxpanel/index":5,"./layouts/CardDirective":7,"./layouts/DialogDirective":8,"./layouts/DocumentDirective":9,"./layouts/MainDirective":10,"./layouts/SimpleDirective":11,"./layouts/TilesDirective":12,"./media/index":16}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IMediaService_1 = require("../media/IMediaService");
var MediaService_1 = require("../media/MediaService");
(function () {
    cardDirective.$inject = ['$rootScope'];
    var CardDirectiveLink = (function () {
        function CardDirectiveLink($rootScope, $element, $attrs) {
            var _this = this;
            this.$rootScope = $rootScope;
            this.$element = $element;
            this.$attrs = $attrs;
            $element.addClass('pip-card');
            var listener = function () { _this.resize(); };
            $rootScope.$on(IMediaService_1.MainResizedEvent, listener);
            this.resize();
            setTimeout(listener, 100);
        }
        CardDirectiveLink.prototype.resize = function () {
            var _this = this;
            var $mainBody = $('.pip-main-body'), cardContainer = $('.pip-card-container'), windowWidth = $('pip-main').width();
            var maxWidth = $mainBody.width(), maxHeight = $mainBody.height(), minWidth = this.$attrs.minWidth ? Math.floor(Number(this.$attrs.minWidth)) : null, minHeight = this.$attrs.minHeight ? Math.floor(Number(this.$attrs.minHeight)) : null, width = this.$attrs.width ? Math.floor(Number(this.$attrs.width)) : null, height = this.$attrs.height ? Math.floor(Number(this.$attrs.height)) : null, left, top;
            if (MediaService_1.MainBreakpointStatuses.xs) {
                minWidth = null;
                minHeight = null;
                width = null;
                height = null;
                maxWidth = null;
                maxHeight = null;
            }
            else {
                var space = MediaService_1.MainBreakpointStatuses['gt-md'] ? 24 : 16;
                maxWidth -= space * 2;
                maxHeight -= space * 2;
                minWidth = minWidth ? Math.min(minWidth, maxWidth) : null;
                minHeight = minHeight ? Math.min(minHeight, maxHeight) : null;
                width = width ? Math.min(width, maxWidth) : null;
                height = height ? Math.min(height, maxHeight) : null;
            }
            this.$element.css('max-width', maxWidth ? maxWidth + 'px' : '');
            this.$element.css('min-width', minWidth ? minWidth + 'px' : '');
            this.$element.css('width', width ? width + 'px' : '');
            this.$element.css('height', height ? height + 'px' : '');
            if (!cardContainer.hasClass('pip-outer-scroll')) {
                this.$element.css('max-height', maxHeight ? maxHeight + 'px' : '');
                this.$element.css('min-height', minHeight ? minHeight + 'px' : '');
                var $header = this.$element.find('.pip-header:visible'), $footer = this.$element.find('.pip-footer:visible'), $body = this.$element.find('.pip-body');
                var maxBodyHeight = maxHeight || $mainBody.height();
                if ($header.length > 0)
                    maxBodyHeight -= $header.outerHeight(true);
                if ($footer.length > 0)
                    maxBodyHeight -= $footer.outerHeight(true);
                $body.css('max-height', maxBodyHeight + 'px');
            }
            else {
                cardContainer.addClass('pip-scroll');
                if (MediaService_1.MainBreakpointStatuses.xs) {
                    left = 0;
                    top = 0;
                }
                else {
                    left = cardContainer.width() / 2 - this.$element.width() / 2 - 16;
                    top = Math.max(cardContainer.height() / 2 - this.$element.height() / 2 - 16, 0);
                }
                this.$element.css('left', left);
                this.$element.css('top', top);
                setTimeout(function () { _this.$element.css('display', 'flex'); }, 100);
            }
            this.$rootScope.$emit('pipLayoutResized');
        };
        return CardDirectiveLink;
    }());
    function cardDirective($rootScope) {
        "ngInject";
        return {
            restrict: 'EA',
            link: function ($scope, $element, $attrs) {
                new CardDirectiveLink($rootScope, $element, $attrs);
            }
        };
    }
    angular
        .module('pipLayout')
        .directive('pipCard', cardDirective);
})();
},{"../media/IMediaService":13,"../media/MediaService":14}],8:[function(require,module,exports){
(function () {
    function dialogDirective() {
        return {
            restrict: 'EA',
            link: function ($scope, $element, $attrs) {
                $element.addClass('pip-dialog');
            }
        };
    }
    angular
        .module('pipLayout')
        .directive('pipDialog', dialogDirective);
})();
},{}],9:[function(require,module,exports){
(function () {
    function documentDirective() {
        return {
            restrict: 'EA',
            link: function ($scope, $element, $attrs) {
                $element.addClass('pip-document');
            }
        };
    }
    angular
        .module('pipLayout')
        .directive('pipDocument', documentDirective);
})();
},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResizeFunctions_1 = require("../media/ResizeFunctions");
var IMediaService_1 = require("../media/IMediaService");
var MediaService_1 = require("../media/MediaService");
(function () {
    var MainDirectiveController = (function () {
        MainDirectiveController.$inject = ['$scope', '$element', '$rootScope', '$timeout', '$attrs'];
        function MainDirectiveController($scope, $element, $rootScope, $timeout, $attrs) {
            var _this = this;
            this.$scope = $scope;
            this.$element = $element;
            this.$rootScope = $rootScope;
            this.$timeout = $timeout;
            this.$attrs = $attrs;
            this._container = $attrs.pipContainer ? $($attrs.pipContainer) : $element;
            $element.addClass('pip-main');
            var listener = function () { _this.resize(); };
            ResizeFunctions_1.addResizeListener(this._container[0], listener);
            $scope.$on('$destroy', function () {
                ResizeFunctions_1.removeResizeListener(_this._container[0], listener);
            });
            this.updateBreakpointStatuses();
        }
        MainDirectiveController.prototype.updateBreakpointStatuses = function () {
            var _this = this;
            var width = this._container.innerWidth();
            var body = $('body');
            MediaService_1.MainBreakpointStatuses.update(MediaService_1.MainBreakpoints, width);
            $.each(MediaService_1.MainBreakpointStatuses, function (breakpoint, status) {
                if (_.isBoolean(status)) {
                    body[status ? 'addClass' : 'removeClass']('pip-' + breakpoint);
                }
            });
            this.$timeout(function () {
                _this.$rootScope.$apply();
            });
        };
        MainDirectiveController.prototype.resize = function () {
            this.updateBreakpointStatuses();
            this.$rootScope.$emit(IMediaService_1.MainResizedEvent, MediaService_1.MainBreakpointStatuses);
        };
        return MainDirectiveController;
    }());
    var MainBodyDirectiveLink = (function () {
        function MainBodyDirectiveLink($scope, $element) {
            $element.addClass('pip-main-body');
        }
        return MainBodyDirectiveLink;
    }());
    function mainDirective() {
        return {
            restrict: 'EA',
            controller: MainDirectiveController,
            controllerAs: 'vm'
        };
    }
    function mainBodyDirective() {
        return {
            restrict: 'EA',
            link: MainBodyDirectiveLink
        };
    }
    angular
        .module('pipLayout')
        .directive('pipMain', mainDirective)
        .directive('pipMainBody', mainBodyDirective);
})();
},{"../media/IMediaService":13,"../media/MediaService":14,"../media/ResizeFunctions":15}],11:[function(require,module,exports){
(function () {
    function simpleDirective() {
        return {
            restrict: 'EA',
            link: function ($scope, $element, $attrs) {
                $element.addClass('pip-simple');
            }
        };
    }
    angular
        .module('pipLayout')
        .directive('pipSimple', simpleDirective);
})();
},{}],12:[function(require,module,exports){
"use strict";
tilesDirective.$inject = ['$rootScope'];
Object.defineProperty(exports, "__esModule", { value: true });
var ResizeFunctions_1 = require("../media/ResizeFunctions");
var IMediaService_1 = require("../media/IMediaService");
var MediaService_1 = require("../media/MediaService");
var TilesOptions = (function () {
    function TilesOptions() {
    }
    return TilesOptions;
}());
var TilesDirectiveLink = (function () {
    function TilesDirectiveLink($scope, $element, $attrs, $rootScope) {
        var _this = this;
        this.$element = $element;
        this.$attrs = $attrs;
        this.$rootScope = $rootScope;
        this._columnWidth = $attrs.columnWidth ? Math.floor(Number($attrs.columnWidth)) : 440,
            this._container = $element.children('.pip-tiles-container'),
            this._prevContainerWidth = null,
            this._masonry = Masonry.data(this._container[0]);
        $element.addClass('pip-tiles');
        var listener = function () { _this.resize(false); };
        ResizeFunctions_1.addResizeListener($element[0], listener);
        $scope.$on('$destroy', function () {
            ResizeFunctions_1.removeResizeListener($element[0], listener);
        });
        this._sizer = $('<div class="pip-tile-sizer"></div>');
        this._sizer.appendTo(this._container);
        $rootScope.$on(IMediaService_1.MainResizedEvent, function () { _this.resize(false); });
        this.resize(true);
    }
    TilesDirectiveLink.prototype.resize = function (force) {
        var width = this.$element.parent().width(), containerWidth;
        if (MediaService_1.MainBreakpointStatuses['gt-xs'] && (width - 36) > this._columnWidth) {
            width = width - 24 * 2;
            var columns = Math.floor(width / this._columnWidth);
            containerWidth = (this._columnWidth + 16) * columns - 16;
            if (containerWidth > width) {
                columns--;
                containerWidth = (this._columnWidth + 16) * columns - 16;
            }
            if (columns < 1) {
                containerWidth = width;
                this._sizer.css('width', containerWidth + 'px');
            }
            else {
                this._sizer.css('width', this._columnWidth + 'px');
            }
            this._container.css('width', (containerWidth + 10) + 'px');
            this._container.removeClass('pip-mobile');
        }
        else {
            width = width - 16 * 2;
            containerWidth = width;
            this._sizer.css('width', containerWidth + 'px');
            this._container.css('width', (containerWidth + 10) + 'px');
            this._container.addClass('pip-mobile');
        }
        if (this._prevContainerWidth != containerWidth || force) {
            this._prevContainerWidth = containerWidth;
            this._masonry.layout();
            this.$rootScope.$emit(IMediaService_1.LayoutResizedEvent);
        }
    };
    return TilesDirectiveLink;
}());
function tilesDirective($rootScope) {
    "ngInject";
    function convertToBoolean(value) {
        if (value == null)
            return false;
        if (!value)
            return false;
        value = value.toString().toLowerCase();
        return value == '1' || value == 'true';
    }
    return {
        restrict: 'EA',
        scope: false,
        transclude: true,
        template: function ($element, $attrs) {
            if (convertToBoolean($attrs.pipInfinite)) {
                return String()
                    + '<div masonry class="pip-tiles-container" load-images="false" preserve-order  '
                    + ' ng-transclude column-width=".pip-tile-sizer" item-selector=".pip-tile"'
                    + ' masonry-options="tilesOptions"  pip-scroll-container="\'.pip-tiles\'"'
                    + ' pip-infinite-scroll="readScroll()" >'
                    + '</div>';
            }
            else {
                return String()
                    + '<div masonry class="pip-tiles-container" load-images="false" preserve-order  '
                    + ' ng-transclude column-width=".pip-tile-sizer" item-selector=".pip-tile"'
                    + ' masonry-options="tilesOptions">'
                    + '</div>';
            }
        },
        controller: ['$scope', function ($scope) {
            $scope.tilesOptions = {
                gutter: 8,
                isFitWidth: false,
                isResizeBound: false,
                transitionDuration: 0
            };
        }],
        link: function ($scope, $element, $attrs) {
            new TilesDirectiveLink($scope, $element, $attrs, $rootScope);
        }
    };
}
angular
    .module('pipLayout')
    .directive('pipTiles', tilesDirective);
},{"../media/IMediaService":13,"../media/MediaService":14,"../media/ResizeFunctions":15}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainResizedEvent = 'pipMainResized';
exports.LayoutResizedEvent = 'pipLayoutResized';
var MediaBreakpoints = (function () {
    function MediaBreakpoints(xs, sm, md, lg) {
        this.xs = xs;
        this.sm = sm;
        this.md = md;
        this.lg = lg;
    }
    return MediaBreakpoints;
}());
exports.MediaBreakpoints = MediaBreakpoints;
var MediaBreakpointStatuses = (function () {
    function MediaBreakpointStatuses() {
    }
    MediaBreakpointStatuses.prototype.update = function (breakpoints, width) {
        if (breakpoints == null || width == null)
            return;
        this.width = width;
        this['xs'] = width <= breakpoints.xs;
        this['gt-xs'] = width > breakpoints.xs;
        this['sm'] = width > breakpoints.xs && width <= breakpoints.sm;
        this['gt-sm'] = width > breakpoints.sm;
        this['md'] = width > breakpoints.sm && width <= breakpoints.md;
        this['gt-md'] = width > breakpoints.md;
        this['lg'] = width > breakpoints.md && width <= breakpoints.lg;
        this['gt-lg'] = width > breakpoints.lg;
        this['xl'] = this['gt-lg'];
    };
    return MediaBreakpointStatuses;
}());
exports.MediaBreakpointStatuses = MediaBreakpointStatuses;
},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IMediaService_1 = require("./IMediaService");
exports.MainBreakpoints = new IMediaService_1.MediaBreakpoints(639, 716, 1024, 1439);
exports.MainBreakpointStatuses = new IMediaService_1.MediaBreakpointStatuses();
var MediaProvider = (function () {
    function MediaProvider() {
    }
    Object.defineProperty(MediaProvider.prototype, "breakpoints", {
        get: function () {
            return exports.MainBreakpoints;
        },
        set: function (value) {
            exports.MainBreakpoints = value;
        },
        enumerable: true,
        configurable: true
    });
    MediaProvider.prototype.$get = function () {
        var service = function (size) {
            return exports.MainBreakpointStatuses[size];
        };
        Object.defineProperty(service, 'breakpoints', {
            get: function () { return exports.MainBreakpoints; },
            set: function (value) {
                exports.MainBreakpoints = value || new IMediaService_1.MediaBreakpoints(639, 716, 1024, 1439);
                exports.MainBreakpointStatuses.update(exports.MainBreakpoints, exports.MainBreakpointStatuses.width);
            }
        });
        Object.defineProperty(service, 'width', {
            get: function () {
                return exports.MainBreakpointStatuses.width;
            }
        });
        return service;
    };
    return MediaProvider;
}());
angular
    .module('pipMedia')
    .provider('pipMedia', MediaProvider);
},{"./IMediaService":13}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var attachEvent = document.attachEvent;
var isIE = navigator.userAgent.match(/Trident/);
function requestFrame(callback) {
    var frame = window.requestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.webkitRequestAnimationFrame
        || function (callback) {
            return window.setTimeout(callback, 20);
        };
    return frame(callback);
}
function cancelFrame() {
    var cancel = window.cancelAnimationFrame
        || window.mozCancelAnimationFrame
        || window.webkitCancelAnimationFrame
        || window.clearTimeout;
    return function (id) {
        return cancel(id);
    };
}
function resizeListener(event) {
    var win = event.target || event.srcElement;
    if (win.__resizeRAF__)
        cancelFrame();
    win.__resizeRAF__ = requestFrame(function () {
        var trigger = win.__resizeTrigger__;
        trigger.__resizeListeners__.forEach(function (fn) {
            fn.call(trigger, event);
        });
    });
}
function loadListener(event) {
    if (this.contentDocument) {
        this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
        this.contentDocument.defaultView.addEventListener('resize', resizeListener);
    }
}
function addResizeListener(element, listener) {
    if (!element.__resizeListeners__) {
        element.__resizeListeners__ = [];
        if (attachEvent) {
            element.__resizeTrigger__ = element;
            element.attachEvent('onresize', resizeListener);
        }
        else {
            if (getComputedStyle(element).position == 'static')
                element.style.position = 'relative';
            var obj = element.__resizeTrigger__ = document.createElement('object');
            obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
            obj.__resizeElement__ = element;
            obj.onload = loadListener;
            obj.type = 'text/html';
            if (isIE)
                element.appendChild(obj);
            obj.data = 'about:blank';
            if (!isIE)
                element.appendChild(obj);
        }
    }
    element.__resizeListeners__.push(listener);
}
exports.addResizeListener = addResizeListener;
function removeResizeListener(element, listener) {
    if (listener)
        element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(listener), 1);
    if (!element.__resizeListeners__.length) {
        if (attachEvent)
            element.detachEvent('onresize', resizeListener);
        else {
            if (element.__resizeTrigger__.contentDocument) {
                element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
                element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
            }
        }
    }
}
exports.removeResizeListener = removeResizeListener;
},{}],16:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipMedia', []);
require("./MediaService");
require("./ResizeFunctions");
__export(require("./IMediaService"));
__export(require("./MediaService"));
__export(require("./ResizeFunctions"));
},{"./IMediaService":13,"./MediaService":14,"./ResizeFunctions":15}]},{},[6])(6)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).behaviors = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
{
    var CancelDragLink_1 = (function () {
        function CancelDragLink_1($element) {
            $element.find('*').attr('pip-cancel-drag', 'pip-cancel-drag');
        }
        return CancelDragLink_1;
    }());
    var CancelDrag = function () {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                new CancelDragLink_1($element);
            }
        };
    };
    angular
        .module("pipDraggable")
        .directive('pipCancelDrag', CancelDrag);
}
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
{
    var DragLink_1 = (function () {
        function DragLink_1($rootScope, $parse, $document, $window, pipDraggable, $scope, $element, $attrs) {
            this.$rootScope = $rootScope;
            this.$parse = $parse;
            this.$document = $document;
            this.$window = $window;
            this.pipDraggable = pipDraggable;
            this.$scope = $scope;
            this.$element = $element;
            this.$attrs = $attrs;
            this.LONG_PRESS = 50;
            this._centerAnchor = false;
            this._hasTouch = ('ontouchstart' in window) || window.DocumentTouch;
            this._pressEvents = 'touchstart mousedown';
            this._moveEvents = 'touchmove mousemove';
            this._releaseEvents = 'touchend mouseup';
            this._data = null;
            this._dragOffset = null;
            this._dragEnabled = false;
            this._pressTimer = null;
            this._elementStyle = {};
            this.scrollParent = false;
            this.scrollContainer = angular.element(window);
            this._deregisterRootMoveListener = angular.noop;
            $scope.value = $attrs.ngDrag;
            this._myid = $scope.$id;
            this.onDragStartCallback = $parse($attrs.pipDragStart) || null;
            this.onDragStopCallback = $parse($attrs.pipDragStop) || null;
            this.onDragSuccessCallback = $parse($attrs.pipDragSuccess) || null;
            this.allowTransform = angular.isDefined($attrs.allowTransform) ? $scope.$eval($attrs.allowTransform) : false;
            this.getDragData = $parse($attrs.pipDragData);
            this.verticalScroll = $attrs.pipVerticalScroll || true;
            this.horizontalScroll = $attrs.pipHorizontalScroll || true;
            this.activationDistance = parseFloat($attrs.pipActivationDistance) || 75;
            this.scrollDistance = parseFloat($attrs.pipActivationDistance) || 50;
            this.scrollContainerGetter = $parse($attrs.pipScrollContainer);
            this.$element.css('cursor', 'move');
            this.initialize();
        }
        DragLink_1.prototype.initialize = function () {
            this.$element.attr('pip-draggable', 'false');
            var dragHandles;
            if (this.$element[0].querySelectorAll) {
                dragHandles = angular.element(this.$element[0].querySelectorAll('[pip-drag-handle]'));
            }
            else {
                dragHandles = this.$element.find('[pip-drag-handle]');
            }
            if (dragHandles.length) {
                this._dragHandle = dragHandles;
            }
            this.toggleListeners(true);
            if (this.scrollParent) {
                this.scrollContainer = angular.element(this.$element.parent());
            }
            else if (this.$attrs.pipScrollContainer) {
                this.scrollContainer = angular.element(this.scrollContainerGetter(this.$scope));
            }
            else {
                this.scrollContainer = angular.element(window);
            }
        };
        DragLink_1.prototype.toggleListeners = function (enable) {
            var _this = this;
            if (!enable)
                return;
            this.$scope.$on('$destroy', function () {
                _this.onDestroy(enable);
            });
            this.$scope.$watch(this.$attrs.pipDrag, function (newVal, oldVal) {
                _this.onEnableChange(newVal, oldVal);
            });
            this.$scope.$watch(this.$attrs.pipCenterAnchor, function (newVal, oldVal) {
                _this.onCenterAnchor(newVal, oldVal);
            });
            if (this._dragHandle) {
                this._dragHandle.on(this._pressEvents, function (event) {
                    _this.onpress(event);
                });
            }
            else {
                this.$element.on(this._pressEvents, function (event) {
                    _this.onpress(event);
                });
            }
            if (!this._hasTouch && this.$element[0].nodeName.toLowerCase() == "img") {
                this.$element.on('mousedown', function () {
                    return false;
                });
            }
        };
        DragLink_1.prototype.onDestroy = function (enable) {
            this.toggleListeners(false);
        };
        DragLink_1.prototype.onEnableChange = function (newVal, oldVal) {
            this._dragEnabled = (newVal);
        };
        DragLink_1.prototype.onCenterAnchor = function (newVal, oldVal) {
            if (angular.isDefined(newVal))
                this._centerAnchor = (newVal || 'true');
        };
        DragLink_1.prototype.isClickableElement = function (evt) {
            return (angular.isDefined(angular.element(evt.target).attr("pip-cancel-drag")));
        };
        DragLink_1.prototype.onpress = function (evt) {
            var _this = this;
            if (!this._dragEnabled)
                return;
            if (this.isClickableElement(evt)) {
                return;
            }
            if (evt.type == "mousedown" && evt.button != 0) {
                return;
            }
            this.saveElementStyles();
            if (this._hasTouch) {
                this.cancelPress();
                this._pressTimer = setTimeout(function () {
                    _this.cancelPress();
                    _this.onlongpress(evt);
                }, this.LONG_PRESS);
                this.$document.on(this._moveEvents, function () {
                    _this.cancelPress();
                });
                this.$document.on(this._releaseEvents, function () {
                    _this.cancelPress();
                });
            }
            else {
                this.onlongpress(evt);
            }
        };
        DragLink_1.prototype.saveElementStyles = function () {
            this._elementStyle.left = this.$element.css('css') || 0;
            this._elementStyle.top = this.$element.css('top') || 0;
            this._elementStyle.position = this.$element.css('position');
            this._elementStyle.width = this.$element.css('width');
        };
        DragLink_1.prototype.cancelPress = function () {
            var _this = this;
            clearTimeout(this._pressTimer);
            this.$document.off(this._moveEvents, function () {
                _this.cancelPress();
            });
            this.$document.off(this._releaseEvents, function () {
                _this.cancelPress();
            });
        };
        DragLink_1.prototype.onlongpress = function (evt) {
            var _this = this;
            if (!this._dragEnabled)
                return;
            evt.preventDefault();
            this.offset = this.$element[0].getBoundingClientRect();
            if (this.allowTransform)
                this._dragOffset = this.offset;
            else {
                this._dragOffset = {
                    left: document.body.scrollLeft,
                    top: document.body.scrollTop
                };
            }
            this.$element.centerX = this.$element[0].offsetWidth / 2;
            this.$element.centerY = this.$element[0].offsetHeight / 2;
            this._mx = this.pipDraggable.inputEvent(evt).pageX;
            this._my = this.pipDraggable.inputEvent(evt).pageY;
            this._mrx = this._mx - this.offset.left;
            this._mry = this._my - this.offset.top;
            if (this._centerAnchor) {
                this._tx = this._mx - this.$element.centerX - this.$window.pageXOffset;
                this._ty = this._my - this.$element.centerY - this.$window.pageYOffset;
            }
            else {
                this._tx = this._mx - this._mrx - this.$window.pageXOffset;
                this._ty = this._my - this._mry - this.$window.pageYOffset;
            }
            this.$document.on(this._moveEvents, function (event) {
                _this.onmove(event);
            });
            this.$document.on(this._releaseEvents, function (event) {
                _this.onrelease(event);
            });
            this._deregisterRootMoveListener = this.$rootScope.$on('draggable:_triggerHandlerMove', function (event, origEvent) {
                _this.onmove(origEvent);
            });
        };
        DragLink_1.prototype.onmove = function (evt) {
            var _this = this;
            if (!this._dragEnabled)
                return;
            evt.preventDefault();
            if (!this.$element.hasClass('pip-dragging')) {
                this._data = this.getDragData(this.$scope);
                this.$element.addClass('pip-dragging');
                this.$rootScope.$broadcast('draggable:start', {
                    x: this._mx,
                    y: this._my,
                    tx: this._tx,
                    ty: this._ty,
                    event: evt,
                    element: this.$element,
                    data: this._data
                });
                if (this.onDragStartCallback) {
                    this.$scope.$apply(function () {
                        _this.onDragStartCallback(_this.$scope, {
                            $data: _this._data,
                            $event: evt
                        });
                    });
                }
            }
            this._mx = this.pipDraggable.inputEvent(evt).pageX;
            this._my = this.pipDraggable.inputEvent(evt).pageY;
            if (this.horizontalScroll || this.verticalScroll) {
                this.dragToScroll();
            }
            if (this._centerAnchor) {
                this._tx = this._mx - this.$element.centerX - this._dragOffset.left;
                this._ty = this._my - this.$element.centerY - this._dragOffset.top;
            }
            else {
                this._tx = this._mx - this._mrx - this._dragOffset.left;
                this._ty = this._my - this._mry - this._dragOffset.top;
            }
            this.moveElement(this._tx, this._ty);
            this.$rootScope.$broadcast('draggable:move', {
                x: this._mx,
                y: this._my,
                tx: this._tx,
                ty: this._ty,
                event: evt,
                element: this.$element,
                data: this._data,
                uid: this._myid,
                dragOffset: this._dragOffset
            });
        };
        DragLink_1.prototype.onrelease = function (evt) {
            var _this = this;
            if (!this._dragEnabled)
                return;
            evt.preventDefault();
            this.$rootScope.$broadcast('draggable:end', {
                x: this._mx,
                y: this._my,
                tx: this._tx,
                ty: this._ty,
                event: evt,
                element: this.$element,
                data: this._data,
                callback: this.onDragComplete,
                uid: this._myid
            });
            this.$element.removeClass('pip-dragging');
            this.$element.parent().find('.pip-drag-enter').removeClass('pip-drag-enter');
            this.reset();
            this.$document.off(this._moveEvents);
            this.$document.off(this._releaseEvents);
            if (this.onDragStopCallback) {
                this.$scope.$apply(function () {
                    _this.onDragStopCallback(_this.$scope, {
                        $data: _this._data,
                        $event: evt
                    });
                });
            }
            this._deregisterRootMoveListener();
        };
        DragLink_1.prototype.onDragComplete = function (evt) {
            var _this = this;
            if (!this.onDragSuccessCallback)
                return;
            this.$scope.$apply(function () {
                _this.onDragSuccessCallback(_this.$scope, {
                    $data: _this._data,
                    $event: evt
                });
            });
        };
        DragLink_1.prototype.reset = function () {
            if (this.allowTransform)
                this.$element.css({
                    transform: '',
                    'z-index': '',
                    '-webkit-transform': '',
                    '-ms-transform': ''
                });
            else {
                this.$element.css({
                    position: this._elementStyle.position,
                    top: this._elementStyle.top,
                    left: this._elementStyle.left,
                    'z-index': '',
                    width: this._elementStyle.width
                });
            }
        };
        DragLink_1.prototype.moveElement = function (x, y) {
            var eWidth = this.$element.css('width');
            if (this.allowTransform) {
                this.$element.css({
                    transform: 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + x + ', ' + y + ', 0, 1)',
                    'z-index': 99999,
                    '-webkit-transform': 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + x + ', ' + y + ', 0, 1)',
                    '-ms-transform': 'matrix(1, 0, 0, 1, ' + x + ', ' + y + ')'
                });
            }
            else {
                this.$element.css({
                    'left': x + 'px',
                    'top': y + 'px',
                    'position': 'fixed',
                    'z-index': 100,
                    width: eWidth
                });
            }
        };
        DragLink_1.prototype.dragToScroll = function () {
            var scrollX = 0, scrollY = 0, offset = function (element) {
                return element.offset() || {
                    left: 0,
                    top: 0
                };
            };
            if (this.horizontalScroll) {
                var containerLeft = offset(this.scrollContainer).left, containerWidth = this.scrollContainer.innerWidth(), containerRight = containerLeft + containerWidth;
                if ((this._mx - containerLeft) < this.activationDistance) {
                    scrollX = -this.scrollDistance;
                }
                else if ((containerRight - this._mx) < this.activationDistance) {
                    scrollX = this.scrollDistance;
                }
            }
            if (this.verticalScroll) {
                var containerTop = offset(this.scrollContainer).top, containerHeight = this.scrollContainer.innerHeight(), containerBottom = containerTop + containerHeight;
                if ((this._my - containerTop) < this.activationDistance) {
                    scrollY = -this.scrollDistance + 30;
                }
                else if ((containerBottom - this._my) < this.activationDistance) {
                    scrollY = this.scrollDistance - 30;
                }
            }
            if (scrollX !== 0 || scrollY !== 0) {
                var containerScrollLeft = this.scrollContainer.scrollLeft(), containerScrollTop = this.scrollContainer.scrollTop();
                this.scrollContainer.scrollLeft(containerScrollLeft + scrollX);
                this.scrollContainer.scrollTop(containerScrollTop + scrollY);
            }
        };
        return DragLink_1;
    }());
    var Drag = function ($rootScope, $parse, $document, $window, pipDraggable) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                new DragLink_1($rootScope, $parse, $document, $window, pipDraggable, $scope, $element, $attrs);
            }
        };
    };
    Drag.$inject = ['$rootScope', '$parse', '$document', '$window', 'pipDraggable'];
    angular
        .module("pipDraggable")
        .directive('pipDrag', Drag);
}
},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DraggableService = (function () {
    function DraggableService() {
    }
    DraggableService.prototype.inputEvent = function (event) {
        if (angular.isDefined(event.touches)) {
            return event.touches[0];
        }
        else if (angular.isDefined(event.originalEvent) && angular.isDefined(event.originalEvent.touches)) {
            return event.originalEvent.touches[0];
        }
        return event;
    };
    ;
    return DraggableService;
}());
angular
    .module("pipDraggable")
    .service('pipDraggable', DraggableService);
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
{
    var DropLink_1 = (function () {
        function DropLink_1($parse, $document, $timeout, pipDraggable, $scope, $element, $attrs) {
            this.$parse = $parse;
            this.$document = $document;
            this.$timeout = $timeout;
            this.pipDraggable = pipDraggable;
            this.$scope = $scope;
            this.$element = $element;
            this.$attrs = $attrs;
            $scope.value = $attrs.pipDrop;
            $scope.isTouching = false;
            this._myid = $scope.$id;
            this.onDropCallback = $parse($attrs.pipDropSuccess);
            this.onDragStartCallback = $parse($attrs.pipDragStart);
            this.onDragStopCallback = $parse($attrs.pipDragStop);
            this.onDragMoveCallback = $parse($attrs.pipDragMove);
            this.initialize();
        }
        DropLink_1.prototype.initialize = function () {
            this.toggleListeners(true);
        };
        DropLink_1.prototype.toggleListeners = function (enable) {
            var _this = this;
            if (!enable)
                return;
            this.$scope.$watch(this.$attrs.pipDrop, function (newVal, oldVal) {
                _this.onEnableChange(newVal, oldVal);
            });
            this.$scope.$on('$destroy', function (event) {
                _this.onDestroy(event);
            });
            this.$scope.$on('draggable:start', function (evt, obj) {
                _this.onDragStart(evt, obj);
            });
            this.$scope.$on('draggable:move', function (evt, obj) {
                _this.onDragMove(evt, obj);
            });
            this.$scope.$on('draggable:end', function (evt, obj) {
                _this.onDragEnd(evt, obj);
            });
        };
        DropLink_1.prototype.onDestroy = function (enable) {
            this.toggleListeners(false);
        };
        DropLink_1.prototype.onEnableChange = function (newVal, oldVal) {
            this._dropEnabled = newVal;
        };
        DropLink_1.prototype.onDragStart = function (evt, obj) {
            var _this = this;
            if (!this._dropEnabled)
                return;
            this.isTouching(obj.x, obj.y, obj.element);
            if (this.$attrs.pipDragStart) {
                this.$timeout(function () {
                    _this.onDragStartCallback(_this.$scope, {
                        $data: obj.data,
                        $event: obj
                    });
                });
            }
        };
        DropLink_1.prototype.onDragMove = function (evt, obj) {
            var _this = this;
            if (!this._dropEnabled)
                return;
            this.isTouching(obj.x, obj.y, obj.element);
            if (this.$attrs.pipDragMove) {
                this.$timeout(function () {
                    _this.onDragMoveCallback(_this.$scope, {
                        $data: obj.data,
                        $event: obj
                    });
                });
            }
        };
        DropLink_1.prototype.onDragEnd = function (evt, obj) {
            var _this = this;
            if (!this._dropEnabled || this._myid === obj.uid) {
                this.updateDragStyles(false, obj.element);
                return;
            }
            if (this.isTouching(obj.x, obj.y, obj.element)) {
                if (obj.callback) {
                    obj.callback(obj);
                }
                if (this.$attrs.pipDropSuccess) {
                    this.$timeout(function () {
                        _this.onDropCallback(_this.$scope, {
                            $data: obj.data,
                            $event: obj,
                            $target: _this.$scope.$eval(_this.$scope.value)
                        });
                    });
                }
            }
            if (this.$attrs.pipDragStop) {
                this.$timeout(function () {
                    _this.onDragStopCallback(_this.$scope, {
                        $data: obj.data,
                        $event: obj
                    });
                });
            }
            this.updateDragStyles(false, obj.element);
        };
        DropLink_1.prototype.isTouching = function (mouseX, mouseY, dragElement) {
            var touching = this.hitTest(mouseX, mouseY);
            this.$scope.isTouching = touching;
            if (touching) {
                this._lastDropTouch = this.$element;
            }
            this.updateDragStyles(touching, dragElement);
            return touching;
        };
        DropLink_1.prototype.updateDragStyles = function (touching, dragElement) {
            if (touching) {
                this.$element.addClass('pip-drag-enter');
                dragElement.addClass('pip-drag-over');
            }
            else if (this._lastDropTouch == this.$element) {
                this._lastDropTouch = null;
                this.$element.removeClass('pip-drag-enter');
                dragElement.removeClass('pip-drag-over');
            }
        };
        ;
        DropLink_1.prototype.hitTest = function (x, y) {
            var bounds = this.$element[0].getBoundingClientRect();
            x -= this.$document[0].body.scrollLeft + this.$document[0].documentElement.scrollLeft;
            y -= this.$document[0].body.scrollTop + this.$document[0].documentElement.scrollTop;
            return x >= bounds.left &&
                x <= bounds.right &&
                y <= bounds.bottom &&
                y >= bounds.top;
        };
        return DropLink_1;
    }());
    var Drop = function ($parse, $document, $timeout, pipDraggable) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                new DropLink_1($parse, $document, $timeout, pipDraggable, $scope, $element, $attrs);
            }
        };
    };
    Drop.$inject = ['$parse', '$document', '$timeout', 'pipDraggable'];
    angular
        .module("pipDraggable")
        .directive('pipDrop', Drop);
}
},{}],5:[function(require,module,exports){
{
    var PreventDragLink_1 = (function () {
        function PreventDragLink_1($element) {
            this.$element = $element;
            this.initialize();
        }
        PreventDragLink_1.prototype.initialize = function () {
            this.$element.attr('pip-draggable', 'false');
            this.toggleListeners(true);
        };
        PreventDragLink_1.prototype.toggleListeners = function (enable) {
            var _this = this;
            if (!enable)
                return;
            this.$element.on('mousedown touchstart touchmove touchend touchcancel', function (event) { _this.absorbEvent_(event); });
        };
        PreventDragLink_1.prototype.absorbEvent_ = function (event) {
            var e = event.originalEvent;
            e.preventDefault && e.preventDefault();
            e.stopPropagation && e.stopPropagation();
            e.cancelBubble = true;
            e.returnValue = false;
            return false;
        };
        return PreventDragLink_1;
    }());
    var PreventDrag = function () {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                new PreventDragLink_1($element);
            }
        };
    };
    angular
        .module("pipDraggable")
        .directive('pipPreventDrag', PreventDrag);
}
},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
angular.module("pipDraggable", []);
require("./DraggableService");
require("./Drag");
require("./Drop");
require("./PreventDrag");
require("./CancelDrag");
},{"./CancelDrag":1,"./Drag":2,"./DraggableService":3,"./Drop":4,"./PreventDrag":5}],7:[function(require,module,exports){
{
    var FocusedLink_1 = (function () {
        function FocusedLink_1($scope, $element, $attrs, $timeout, $mdConstant, $window) {
            var _this = this;
            this.$scope = $scope;
            this.$element = $element;
            this.$timeout = $timeout;
            this.$mdConstant = $mdConstant;
            this.$window = $window;
            this.opacityDelta = 0.4;
            this.opacityLimit = 0.5;
            $element.on('keydown', function (e) {
                _this.keydownListener(e);
            });
            $timeout(function () {
                _this.init();
            });
            if ($attrs.ngModel) {
                $scope.$watch('ngModel', function () {
                    $timeout(this.init);
                }, true);
            }
            if ($attrs.pipFocusedData) {
                $scope.$watch('pipFocusedData', function () {
                    $timeout(this.init);
                }, true);
            }
        }
        FocusedLink_1.prototype.init = function () {
            var _this = this;
            var selector = this.$scope.pipWithHidden && this.$scope.pipWithHidden() ? '.pip-focusable' : '.pip-focusable:visible';
            this.onFocusClass = this.$scope.pipFocusedClass ? this.$scope.pipFocusedClass() : '';
            this.controls = this.$element.find(selector);
            this.controlsLength = this.controls.length;
            this.checkTabindex(this.controls);
            this.controls.on('focus', function (event) {
                var target = event.currentTarget;
                if ($(target).hasClass('md-focused')) {
                    return;
                }
                if (_this.$scope.pipRebind && _this.$scope.pipRebind()) {
                    _this.init();
                }
                _this.$element.addClass('pip-focused-container');
                $(target).addClass(_this.onFocusClass);
                if (!_this.$scope.pipFocusedOpacity || !_this.$scope.pipFocusedOpacity()) {
                    _this.color = $(target).css('backgroundColor');
                    _this.oldBackgroundColor = _this.color;
                    $(target).css('backgroundColor', _this.rgba(_this.color));
                    $(target).addClass('md-focused');
                }
                else {
                    $(target).addClass('md-focused md-focused-opacity');
                }
            }).on('focusout', function (event) {
                var target = event.currentTarget;
                if (!$(target).hasClass('md-focused')) {
                    return;
                }
                _this.$element.removeClass('pip-focused-container');
                $(target).removeClass(_this.onFocusClass);
                if (!_this.$scope.pipFocusedOpacity || !_this.$scope.pipFocusedOpacity()) {
                    $(target).css('backgroundColor', _this.oldBackgroundColor);
                    $(target).removeClass('md-focused md-focused-opacity');
                }
                else {
                    $(target).removeClass('md-focused');
                }
            });
        };
        FocusedLink_1.prototype.rgba = function (color) {
            if (this.$scope.pipFocusedColor && this.$scope.pipFocusedColor()) {
                return this.$scope.pipFocusedColor();
            }
            var arr = color.split("(")[1].split(")")[0].split(",");
            if (!arr || arr.length < 3) {
                return '';
            }
            var red, blue, green, opacity;
            opacity = arr.length == 3 ? 1 : parseFloat(arr[3]);
            red = arr[0];
            blue = arr[1];
            green = arr[2];
            if (opacity < this.opacityLimit) {
                opacity += this.opacityDelta;
            }
            else {
                opacity -= this.opacityDelta;
            }
            return 'rgba(' + red + ', ' + blue + ', ' + green + ', ' + opacity + ')';
        };
        FocusedLink_1.prototype.setTabindex = function (element, value) {
            element.attr('tabindex', value);
        };
        FocusedLink_1.prototype.checkTabindex = function (controls) {
            var index = _.findIndex(controls, function (c) {
                return c['tabindex'] > -1;
            });
            if (index == -1 && controls.length > 0 && this.$scope.pipFocusedTabindex) {
                this.setTabindex(angular.element(controls[0]), this.$scope.pipFocusedTabindex());
            }
        };
        FocusedLink_1.prototype.keydownListener = function (e) {
            var keyCode = e.which || e.keyCode;
            if (keyCode == this.$mdConstant.KEY_CODE.LEFT_ARROW ||
                keyCode == this.$mdConstant.KEY_CODE.UP_ARROW ||
                keyCode == this.$mdConstant.KEY_CODE.RIGHT_ARROW ||
                keyCode == this.$mdConstant.KEY_CODE.DOWN_ARROW) {
                e.preventDefault();
                var increment = (keyCode == this.$mdConstant.KEY_CODE.RIGHT_ARROW || keyCode == this.$mdConstant.KEY_CODE.DOWN_ARROW) ? 1 : -1, moveToControl = this.controls.index(this.controls.filter(".md-focused")) + increment;
                if (moveToControl >= 0 && moveToControl < this.controlsLength) {
                    this.controls[moveToControl].focus();
                }
            }
        };
        return FocusedLink_1;
    }());
    var Focused = function ($timeout, $mdConstant, $window) {
        return {
            scope: {
                pipFocusedColor: '&?',
                pipFocusedClass: '&?',
                pipFocusedRebind: '&?',
                pipFocusedTabindex: '&?',
                pipFocusedOpacity: '&?',
                pipFocusedData: '&?',
                pipWithHidden: '&?',
                pipRebind: '&?'
            },
            link: function ($scope, $element, $attrs) {
                new FocusedLink_1($scope, $element, $attrs, $timeout, $mdConstant, $window);
            }
        };
    };
    Focused.$inject = ['$timeout', '$mdConstant', '$window'];
    angular
        .module("pipFocused", [])
        .directive('pipFocused', Focused);
}
},{}],8:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
require("./unsaved_changes/unsavedChanges");
require("./shortcuts/index");
require("./focused/focused");
require("./draggable/index");
require("./selected/selected");
require("./infinite_scroll/infiniteScroll");
angular.module('pipBehaviors', [
    'pipFocused',
    'pipSelected',
    'pipInfiniteScroll',
    'pipUnsavedChanges',
    'pipDraggable',
    'pipShortcuts'
]);
__export(require("./shortcuts/index"));
},{"./draggable/index":6,"./focused/focused":7,"./infinite_scroll/infiniteScroll":9,"./selected/selected":10,"./shortcuts/index":16,"./unsaved_changes/unsavedChanges":17}],9:[function(require,module,exports){
{
    var InfiniteScrollLink_1 = (function () {
        function InfiniteScrollLink_1($rootScope, $window, $interval, $scope, $element, $attrs) {
            var _this = this;
            this.$rootScope = $rootScope;
            this.$window = $window;
            this.$interval = $interval;
            this.$scope = $scope;
            this.$element = $element;
            this.$attrs = $attrs;
            this.THROTTLE_MILLISECONDS = 500;
            this.checkWhenEnabled = null;
            this.scrollContainer = null;
            this.immediateCheck = true;
            this.scrollDistance = null;
            this.scrollEnabled = null;
            this.unregisterEventListener = null;
            this.useDocumentBottom = false;
            this.windowElement = null;
            this.windowElement = angular.element($window);
            this.onContainerScrollThrottle = _.throttle(function () {
                _this.onContainerScroll();
            }, this.THROTTLE_MILLISECONDS);
            $scope.$on('$destroy', function () {
                _this.scrollContainer.unbind('scroll', function () {
                    _this.onContainerScrollThrottle();
                });
                if (_this.unregisterEventListener !== null) {
                    _this.unregisterEventListener();
                    return _this.unregisterEventListener = null;
                }
            });
            $scope.$watch('pipScrollDistance', function (v) {
                _this.handleScrollDistance(v);
            });
            this.handleScrollDistance($scope.pipScrollDistance);
            $scope.$watch('pipScrollDisabled', function (v) {
                _this.handleScrollDisabled(v);
            });
            this.handleScrollDisabled($scope.pipScrollDisabled);
            $scope.$watch('pipScrollUseDocumentBottom', function (v) {
                _this.handleScrollUseDocumentBottom(v);
            });
            this.handleScrollUseDocumentBottom($scope.pipScrollUseDocumentBottom);
            this.changeContainer(this.windowElement);
            if ($scope.pipScrollListenForEvent) {
                this.unregisterEventListener = $rootScope.$on($scope.pipScrollListenForEvent, function () {
                    _this.onContainerScrollThrottle();
                });
            }
            $scope.$watch('pipScrollContainer', function (newContainer) {
                if (newContainer != _this.scrollContainer)
                    _this.handleScrollContainer(newContainer);
            });
            this.handleScrollContainer($scope.pipScrollContainer || []);
            if ($attrs.pipScrollParent !== null) {
                this.changeContainer(angular.element($element.parent()));
            }
            if ($attrs.pipScrolImmediateCheck !== null) {
                this.immediateCheck = $scope.$eval($attrs.pipScrolImmediateCheck);
            }
            $interval((function () {
                if (this.immediateCheck) {
                    return this.onContainerScrollThrottle();
                }
            }), 0, 1);
        }
        InfiniteScrollLink_1.prototype.height = function (element) {
            element = element[0] || element;
            if (isNaN(element.offsetHeight)) {
                return element.document.documentElement.clientHeight;
            }
            else {
                return element.offsetHeight;
            }
        };
        InfiniteScrollLink_1.prototype.offsetTop = function (element) {
            if (!element[0].getBoundingClientRect || element.css('none')) {
                return;
            }
            return element[0].getBoundingClientRect().top + this.pageYOffset(element);
        };
        InfiniteScrollLink_1.prototype.pageYOffset = function (element) {
            element = element[0] || element;
            if (isNaN(window.pageYOffset)) {
                return element.document.documentElement.scrollTop;
            }
            else {
                return element.ownerDocument.defaultView.pageYOffset;
            }
        };
        InfiniteScrollLink_1.prototype.onContainerScroll = function () {
            var _this = this;
            var containerBottom, containerTopOffset, elementBottom, remaining, shouldScroll;
            if (this.scrollContainer === this.windowElement) {
                containerBottom = this.height(this.scrollContainer) + this.pageYOffset(this.scrollContainer[0].document.documentElement);
                elementBottom = this.offsetTop(this.$element) + this.height(this.$element);
            }
            else {
                containerBottom = this.height(this.scrollContainer);
                containerTopOffset = 0;
                if (this.offsetTop(this.scrollContainer) !== void 0) {
                    containerTopOffset = this.offsetTop(this.scrollContainer);
                }
                elementBottom = this.offsetTop(this.$element) - containerTopOffset + this.height(this.$element);
            }
            if (this.useDocumentBottom) {
                elementBottom = this.height((this.$element[0].ownerDocument || this.$element[0].document).documentElement);
            }
            remaining = elementBottom - containerBottom;
            shouldScroll = remaining <= this.height(this.scrollContainer) * this.scrollDistance + 1;
            if (shouldScroll) {
                this.checkWhenEnabled = true;
                if (this.scrollEnabled) {
                    if (this.$scope.$$phase || this.$rootScope.$$phase) {
                        return this.$scope.pipInfiniteScroll();
                    }
                    else {
                        return this.$scope.$apply(function () {
                            _this.$scope.pipInfiniteScroll();
                        });
                    }
                }
            }
            else {
                return this.checkWhenEnabled = false;
            }
        };
        InfiniteScrollLink_1.prototype.handleScrollDistance = function (v) {
            return this.scrollDistance = parseFloat(v) || 0;
        };
        InfiniteScrollLink_1.prototype.handleScrollDisabled = function (v) {
            this.scrollEnabled = !v;
            if (this.scrollEnabled && this.checkWhenEnabled) {
                this.checkWhenEnabled = false;
                this.onContainerScrollThrottle();
            }
        };
        InfiniteScrollLink_1.prototype.handleScrollUseDocumentBottom = function (v) {
            return this.useDocumentBottom = v;
        };
        InfiniteScrollLink_1.prototype.changeContainer = function (newContainer) {
            var _this = this;
            if (this.scrollContainer) {
                this.scrollContainer.unbind('scroll', function () {
                    _this.onContainerScrollThrottle();
                });
            }
            this.scrollContainer = newContainer;
            if (newContainer) {
                return this.scrollContainer.bind('scroll', function () {
                    _this.onContainerScrollThrottle();
                });
            }
        };
        InfiniteScrollLink_1.prototype.handleScrollContainer = function (newContainer) {
            if ((newContainer == null) || newContainer.length === 0) {
                return;
            }
            if (newContainer instanceof HTMLElement) {
                newContainer = angular.element(newContainer);
            }
            else if (typeof newContainer.append === 'function') {
                newContainer = angular.element(newContainer[newContainer.length - 1]);
            }
            else if (typeof newContainer === 'string') {
                newContainer = this.$element.parents().find(newContainer);
            }
            if (newContainer != null && (!Array.isArray(newContainer) ||
                (Array.isArray(newContainer) && newContainer.length > 0))) {
                return this.changeContainer(newContainer);
            }
            else {
                throw new Error("Invalid pip-scroll-container attribute.");
            }
        };
        return InfiniteScrollLink_1;
    }());
    var InfiniteScroll = function ($rootScope, $window, $interval) {
        return {
            scope: {
                pipInfiniteScroll: '&',
                pipScrollContainer: '=',
                pipScrollDistance: '=',
                pipScrollDisabled: '=',
                pipScrollUseDocumentBottom: '=',
                pipScrollListenForEvent: '@'
            },
            link: function ($scope, $element, $attrs) {
                new InfiniteScrollLink_1($rootScope, $window, $interval, $scope, $element, $attrs);
            }
        };
    };
    InfiniteScroll.$inject = ['$rootScope', '$window', '$interval'];
    angular
        .module("pipInfiniteScroll", [])
        .directive('pipInfiniteScroll', InfiniteScroll);
}
},{}],10:[function(require,module,exports){
{
    var SelectedLink_1 = (function () {
        function SelectedLink_1($parse, $mdConstant, $timeout, $scope, $element, $attrs) {
            var _this = this;
            this.$mdConstant = $mdConstant;
            this.$timeout = $timeout;
            this.$scope = $scope;
            this.$element = $element;
            this.$attrs = $attrs;
            this.touchBoundary = 10;
            this.tapdelay = 200;
            this.tapTimeout = 700;
            this.indexGetter = $attrs.pipSelected ? $parse($attrs.pipSelected) : null;
            this.indexSetter = this.indexGetter ? this.indexGetter.assign : null;
            this.idGetter = $attrs.pipSelectedId ? $parse($attrs.pipSelectedId) : null;
            this.idSetter = this.idGetter ? this.idGetter.assign : null;
            this.changeGetter = $attrs.pipSelect ? $parse($attrs.pipSelect) : null;
            this.enterSpaceGetter = $attrs.pipEnterSpacePress ? $parse($attrs.pipEnterSpacePress) : null;
            this.noScroll = $attrs.pipNoScroll;
            this.modifier = $attrs.pipSkipHidden ? ':visible' : '';
            this.className = $attrs.pipTreeList ? '.pip-selectable-tree' : '.pip-selectable';
            this.selectedIndex = this.indexGetter($scope);
            this.currentElementTabinex = $element.attr('tabindex');
            this.pipSelectedWatch = $attrs.pipSelectedWatch;
            this.isScrolled = false;
            $element.attr('tabindex', this.currentElementTabinex || 0);
            $element.on('click', this.className, function (event) {
                _this.onClickEvent(event);
            });
            $element.on('touchstart', this.className, function (event) {
                _this.onTouchStart(event);
            });
            $element.on('touchmove', this.className, function (event) {
                _this.onTouchMove(event);
            });
            $element.on('touchend', this.className, function (event) {
                _this.onTouchEnd(event);
            });
            $element.on('touchcancel', this.className, function (event) {
                _this.onTouchCancel(event);
            });
            $element.on('keydown', function (event) {
                _this.onKeyDown(event);
            });
            $element.on('focusin', function (event) {
                _this.onFocusIn(event);
            });
            $element.on('focusout', function (event) {
                _this.onFocusOut(event);
            });
            if (!$attrs.pipTreeList) {
                $scope.$watch(this.indexGetter, function (newSelectedIndex) {
                    _this.selectItem({
                        itemIndex: newSelectedIndex
                    });
                });
            }
            else {
                $scope.$watch(this.idGetter, function (newSelectedId) {
                    $timeout(function () {
                        _this.selectItem({
                            itemId: newSelectedId,
                            raiseEvent: true
                        });
                    }, 0);
                });
            }
            if (this.pipSelectedWatch) {
                $scope.$watch(this.pipSelectedWatch, function () {
                    $timeout(function () {
                        _this.selectedIndex = _this.indexGetter($scope);
                        _this.selectItem({
                            itemIndex: _this.selectedIndex
                        });
                    }, 100);
                });
            }
            this.selectItem({
                itemIndex: this.selectedIndex,
                items: $element.find(this.className)
            });
        }
        SelectedLink_1.prototype.selectItem = function (itemParams) {
            if (this.isScrolled)
                return;
            var itemIndex = itemParams.itemIndex, itemId = itemParams.itemId, items = itemParams.items || this.$element.find(this.className + this.modifier), itemsLength = items.length, item = function () {
                if (itemParams.item)
                    return itemParams.item;
                if (itemIndex === undefined && itemIndex === -1) {
                    itemIndex = items.index(items.filter('[pip-id=' + itemId + ']'));
                }
                if (itemIndex >= 0 && itemIndex < itemsLength) {
                    return items[itemIndex];
                }
                return false;
            }, raiseEvent = itemParams.raiseEvent;
            item = item();
            if (item) {
                this.$element.find(this.className).removeClass('selected md-focused');
                item = angular.element(item)
                    .addClass('selected md-focused')
                    .focus();
                if (!this.noScroll)
                    this.scrollToItem(item);
                if (raiseEvent)
                    this.defineSelectedIndex(items);
            }
        };
        ;
        SelectedLink_1.prototype.defineSelectedIndex = function (items) {
            var _this = this;
            var oldSelectedIndex = this.selectedIndex;
            this.selectedIndex = -1;
            for (var index = 0; index < items.length; index++) {
                if ($(items[index]).hasClass('selected')) {
                    this.selectedIndex = index;
                    break;
                }
            }
            var updateIndex = function () {
                var selectedItem = angular.element(items[_this.selectedIndex]), selectedId = selectedItem.attr('pip-id');
                if (_this.indexSetter)
                    _this.indexSetter(_this.$scope, _this.selectedIndex);
                if (_this.idSetter)
                    _this.idSetter(_this.$scope, selectedId);
                onSelect();
            };
            var onSelect = function () {
                var selectedItem = angular.element(items[_this.selectedIndex]), selectedId = selectedItem.attr('pip-id');
                if (_this.changeGetter) {
                    _this.changeGetter(_this.$scope, {
                        $event: {
                            target: _this.$element,
                            item: selectedItem,
                            index: _this.selectedIndex,
                            id: selectedId,
                            newIndex: _this.selectedIndex,
                            oldIndex: oldSelectedIndex
                        }
                    });
                }
            };
            if (oldSelectedIndex != this.selectedIndex && this.selectedIndex !== -1) {
                this.$scope.$apply(function () { updateIndex(); });
            }
            else {
                this.$scope.$apply(function () { onSelect(); });
            }
        };
        ;
        SelectedLink_1.prototype.scrollToItem = function ($item) {
            var _this = this;
            if (this.noScroll || !$item.offset())
                return;
            var containerTop = this.$element.offset().top, containerHeight = this.$element.height(), containerBottom = containerTop + containerHeight, itemTop = $item.offset().top, itemHeight = $item.outerHeight(true), itemBottom = itemTop + itemHeight, containerScrollTop = this.$element.scrollTop();
            this.isScrolled = true;
            this.$timeout(function () {
                _this.isScrolled = false;
            }, 100);
            if (containerTop > itemTop) {
                this.$element.scrollTop(containerScrollTop + itemTop - containerTop);
            }
            else if (containerBottom < itemBottom) {
                this.$element.scrollTop(containerScrollTop + itemBottom - containerBottom);
            }
        };
        ;
        SelectedLink_1.prototype.getTargetElementFromEventTarget = function (eventTarget) {
            if (eventTarget.nodeType === Node.TEXT_NODE) {
                return eventTarget.parentNode;
            }
            return eventTarget;
        };
        ;
        SelectedLink_1.prototype.touchHasMoved = function (event) {
            var touch = event.changedTouches[0], boundary = this.touchBoundary;
            if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
                return true;
            }
            return false;
        };
        ;
        SelectedLink_1.prototype.onClickEvent = function (event) {
            this.selectItem({
                item: event.currentTarget,
                raiseEvent: true
            });
        };
        SelectedLink_1.prototype.onTouchStart = function (event) {
            var ev = event.originalEvent;
            if (ev['targetTouches'].length > 1) {
                return true;
            }
            var targetElement = this.getTargetElementFromEventTarget(ev.target), touch = ev['targetTouches'][0];
            this.trackingClick = true;
            this.trackingClickStart = ev.timeStamp;
            this.targetElement = targetElement;
            this.touchStartX = touch.pageX;
            this.touchStartY = touch.pageY;
            return true;
        };
        SelectedLink_1.prototype.onTouchMove = function (event) {
            if (!this.trackingClick) {
                return true;
            }
            var ev = event.originalEvent;
            if (this.targetElement !== this.getTargetElementFromEventTarget(ev.target) || this.touchHasMoved(ev)) {
                this.trackingClick = false;
                this.targetElement = null;
            }
            return true;
        };
        SelectedLink_1.prototype.onTouchEnd = function (event) {
            var forElement, newTrackingClickStart, targetTagName, scrollParent, touch, newtargetElement = this.targetElement;
            if (!this.trackingClick) {
                return true;
            }
            var ev = event.originalEvent;
            if ((ev.timeStamp - this.lastClickTime) < this.tapdelay) {
                this.cancelNextClick = true;
                return true;
            }
            if ((ev.timeStamp - this.trackingClickStart) > this.tapTimeout) {
                return true;
            }
            this.cancelNextClick = false;
            this.lastClickTime = event.timeStamp;
            newTrackingClickStart = this.trackingClickStart;
            this.trackingClick = false;
            this.trackingClickStart = 0;
            this.selectItem({
                item: event.currentTarget,
                raiseEvent: true
            });
            return false;
        };
        SelectedLink_1.prototype.onTouchCancel = function (event) {
            this.trackingClick = false;
            this.targetElement = null;
        };
        SelectedLink_1.prototype.onKeyDown = function (event) {
            var keyCode = event.which || event.keyCode;
            if (keyCode == this.$mdConstant.KEY_CODE.ENTER || keyCode == this.$mdConstant.KEY_CODE.SPACE) {
                event.preventDefault();
                event.stopPropagation();
                if (this.enterSpaceGetter) {
                    this.enterSpaceGetter(this.$scope, {
                        $event: {
                            target: this.$element,
                            index: this.selectedIndex,
                            item: this.$element.find('.selected')
                        }
                    });
                }
            }
            else if (keyCode == this.$mdConstant.KEY_CODE.LEFT_ARROW || keyCode == this.$mdConstant.KEY_CODE.RIGHT_ARROW ||
                keyCode == this.$mdConstant.KEY_CODE.UP_ARROW || keyCode == this.$mdConstant.KEY_CODE.DOWN_ARROW) {
                event.preventDefault();
                event.stopPropagation();
                var items = this.$element.find(this.className + this.modifier), inc = (keyCode == this.$mdConstant.KEY_CODE.RIGHT_ARROW || keyCode == this.$mdConstant.KEY_CODE.DOWN_ARROW) ? 1 : -1, newSelectedIndex = this.selectedIndex + inc;
                this.selectItem({
                    itemIndex: newSelectedIndex,
                    items: items,
                    raiseEvent: true
                });
            }
        };
        SelectedLink_1.prototype.onFocusIn = function (event) {
            var items, selectedItem = this.$element.find(this.className + '.selected');
            selectedItem.addClass('md-focused');
            if (selectedItem.length === 0) {
                this.selectedIndex = this.indexGetter(this.$scope);
                items = this.$element.find(this.className + this.modifier);
                this.selectItem({
                    itemIndex: this.selectedIndex || 0,
                    items: items,
                    raiseEvent: true
                });
            }
        };
        SelectedLink_1.prototype.onFocusOut = function (event) {
            this.$element.find(this.className + '.md-focused' + this.modifier).removeClass('md-focused');
        };
        return SelectedLink_1;
    }());
    var Selected = function ($parse, $mdConstant, $timeout) {
        return {
            restrict: 'A',
            scope: false,
            link: function ($scope, $element, $attrs) {
                new SelectedLink_1($parse, $mdConstant, $timeout, $scope, $element, $attrs);
            }
        };
    };
    Selected.$inject = ['$parse', '$mdConstant', '$timeout'];
    angular
        .module("pipSelected", [])
        .directive('pipSelected', Selected);
}
},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ShortcutItem = (function () {
    function ShortcutItem() {
    }
    return ShortcutItem;
}());
exports.ShortcutItem = ShortcutItem;
var ShortcutsConfig = (function () {
    function ShortcutsConfig() {
        this.globalShortcuts = [];
        this.localShortcuts = [];
        this.defaultOptions = null;
    }
    return ShortcutsConfig;
}());
exports.ShortcutsConfig = ShortcutsConfig;
},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var KeyboardEvent = (function () {
    function KeyboardEvent() {
    }
    return KeyboardEvent;
}());
KeyboardEvent.Keydown = 'keydown';
KeyboardEvent.Keyup = 'keyup';
KeyboardEvent.Keypress = 'keypress';
exports.KeyboardEvent = KeyboardEvent;
var ShortcutOptions = (function () {
    function ShortcutOptions() {
    }
    return ShortcutOptions;
}());
exports.ShortcutOptions = ShortcutOptions;
var Shortcut = (function () {
    Shortcut.$inject = ['element', 'shorcutCombination', 'option', 'callback'];
    function Shortcut(element, shorcutCombination, option, callback) {
        "ngInject";
        var _this = this;
        this.shift_nums = {
            "`": "~",
            "1": "!",
            "2": "@",
            "3": "#",
            "4": "$",
            "5": "%",
            "6": "^",
            "7": "&",
            "8": "*",
            "9": "(",
            "0": ")",
            "-": "_",
            "=": "+",
            ";": ":",
            "'": "\"",
            ",": "<",
            ".": ">",
            "/": "?",
            "\\": "|"
        };
        this.special_keys = {
            'esc': 27,
            'escape': 27,
            'tab': 9,
            'space': 32,
            'return': 13,
            'enter': 13,
            'backspace': 8,
            'scrolllock': 145,
            'scroll_lock': 145,
            'scroll': 145,
            'capslock': 20,
            'caps_lock': 20,
            'caps': 20,
            'numlock': 144,
            'num_lock': 144,
            'num': 144,
            'pause': 19,
            'break': 19,
            'insert': 45,
            'home': 36,
            'delete': 46,
            'end': 35,
            'pageup': 33,
            'page_up': 33,
            'pu': 33,
            'pagedown': 34,
            'page_down': 34,
            'pd': 34,
            'left': 37,
            'up': 38,
            'right': 39,
            'down': 40,
            'f1': 112,
            'f2': 113,
            'f3': 114,
            'f4': 115,
            'f5': 116,
            'f6': 117,
            'f7': 118,
            'f8': 119,
            'f9': 120,
            'f10': 121,
            'f11': 122,
            'f12': 123
        };
        this.modifiers = {
            shift: { wanted: false, pressed: false },
            ctrl: { wanted: false, pressed: false },
            alt: { wanted: false, pressed: false },
            meta: { wanted: false, pressed: false }
        };
        this.target = element;
        this.shorcut = shorcutCombination;
        this.event = option.Type;
        this.option = option;
        this.callback = callback;
        this.eventCallback = function (event) {
            var e = event || window.event;
            var code;
            if (_this.option.DisableInInput) {
                var element_1;
                if (e.target) {
                    element_1 = e.target;
                }
                else if (e.srcElement) {
                    element_1 = e.srcElement;
                }
                if (element_1.nodeType == 3) {
                    element_1 = element_1.parentNode;
                }
                if (element_1.tagName == 'INPUT' || element_1.tagName == 'TEXTAREA')
                    return;
            }
            if (e.keyCode) {
                code = e.keyCode;
            }
            else if (e.which) {
                code = e.which;
            }
            var character = String.fromCharCode(code).toLowerCase();
            if (code == 188)
                character = ",";
            if (code == 190)
                character = ".";
            var keys = _this.shorcut.split("+");
            var kp = 0;
            if (e.ctrlKey)
                _this.modifiers.ctrl.pressed = e.ctrlKey;
            if (e.shiftKey)
                _this.modifiers.shift.pressed = e.shiftKey;
            if (e.altKey)
                _this.modifiers.alt.pressed = e.altKey;
            if (e.metaKey)
                _this.modifiers.meta.pressed = e.metaKey;
            var i = 0;
            for (i = 0; i < keys.length; i++) {
                var k = keys[i];
                if (k == 'ctrl' || k == 'control') {
                    kp++;
                    _this.modifiers.ctrl.wanted = true;
                }
                else if (k == 'shift') {
                    kp++;
                    _this.modifiers.shift.wanted = true;
                }
                else if (k == 'alt') {
                    kp++;
                    _this.modifiers.alt.wanted = true;
                }
                else if (k == 'meta') {
                    kp++;
                    _this.modifiers.meta.wanted = true;
                }
                else if (k.length > 1) {
                    if (_this.special_keys[k] == code) {
                        kp++;
                    }
                }
                else if (_this.option.Keycode) {
                    if (_this.option.Keycode == code)
                        kp++;
                }
                else {
                    if (character == k)
                        kp++;
                    else {
                        if (_this.shift_nums[character] && e.shiftKey) {
                            character = _this.shift_nums[character];
                            if (character == k) {
                                kp++;
                            }
                        }
                    }
                }
            }
            if (kp == keys.length &&
                _this.modifiers.ctrl.pressed == _this.modifiers.ctrl.wanted &&
                _this.modifiers.shift.pressed == _this.modifiers.shift.wanted &&
                _this.modifiers.alt.pressed == _this.modifiers.alt.wanted &&
                _this.modifiers.meta.pressed == _this.modifiers.meta.wanted) {
                _this.callback(e);
                if (!_this.option.Propagate) {
                    e.cancelBubble = true;
                    e.returnValue = false;
                    if (e.stopPropagation) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    return false;
                }
            }
            _this.modifiers.ctrl.pressed = false;
            _this.modifiers.shift.pressed = false;
            _this.modifiers.alt.pressed = false;
            _this.modifiers.meta.pressed = false;
        };
    }
    return Shortcut;
}());
exports.Shortcut = Shortcut;
},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Shortcut_1 = require("./Shortcut");
{
    var ShortcutBindingService_1 = (function () {
        ShortcutBindingService_1.$inject = ['$log', 'option'];
        function ShortcutBindingService_1($log, option) {
            "ngInject";
            this._shortcuts = {};
            this._log = $log;
            this._defaultOption = option ? _.defaults(option, this.getDefaultOption()) : this.getDefaultOption();
        }
        ShortcutBindingService_1.prototype.getDefaultOption = function () {
            var defaultOption = {
                Type: Shortcut_1.KeyboardEvent.Keydown,
                Propagate: false,
                DisableInInput: false,
                Target: document,
                Keycode: null
            };
            return defaultOption;
        };
        Object.defineProperty(ShortcutBindingService_1.prototype, "shortcuts", {
            get: function () {
                return this._shortcuts;
            },
            enumerable: true,
            configurable: true
        });
        ShortcutBindingService_1.prototype.add = function (shortcut, callback, option) {
            this.remove(shortcut);
            var shortcutOption = option ? _.defaults(option, this._defaultOption) : this._defaultOption;
            var shortcutCombination = shortcut.toLowerCase();
            var element = shortcutOption.Target;
            if (typeof shortcutOption.Target == 'string') {
                element = document.getElementById(shortcutOption.Target);
            }
            else {
                element = shortcutOption.Target;
            }
            if (!element) {
                this._log.error('Register shortcut: element undentified!');
                return;
            }
            if (!shortcutCombination) {
                this._log.error('Register shortcut: shortcut combination undentified!');
                return;
            }
            if (!callback) {
                this._log.error('Register shortcut: shorcut callback undentified!');
                return;
            }
            var newKeyboardShortcut = new Shortcut_1.Shortcut(element, shortcutCombination, shortcutOption, callback);
            this._shortcuts[shortcutCombination] = newKeyboardShortcut;
            if (element.addEventListener) {
                element.addEventListener(shortcutOption.Type, newKeyboardShortcut.eventCallback, false);
            }
            else if (element.attachEvent) {
                element.attachEvent('on' + shortcutOption.Type, newKeyboardShortcut.eventCallback);
            }
            else {
                element.on(shortcutOption.Type, newKeyboardShortcut.eventCallback);
            }
        };
        ShortcutBindingService_1.prototype.remove = function (shorcut) {
            var shortcutCombination = shorcut.toLowerCase();
            var binding = this._shortcuts[shortcutCombination];
            delete (this._shortcuts[shortcutCombination]);
            if (!binding)
                return;
            var type = binding.event;
            var element = binding.target;
            var callback = binding.eventCallback;
            if (element.detachEvent) {
                element.detachEvent('on' + type, callback);
            }
            else if (element.removeEventListener) {
                element.removeEventListener(type, callback, false);
            }
            else {
                element.off(type, callback);
            }
        };
        return ShortcutBindingService_1;
    }());
    var ShortcutBindingProvider = (function () {
        function ShortcutBindingProvider() {
        }
        Object.defineProperty(ShortcutBindingProvider.prototype, "option", {
            get: function () {
                return this._option;
            },
            set: function (value) {
                this._option = value || new Shortcut_1.ShortcutOptions();
            },
            enumerable: true,
            configurable: true
        });
        ShortcutBindingProvider.prototype.$get = ['$log', function ($log) {
            "ngInject";
            if (this._service == null)
                this._service = new ShortcutBindingService_1($log, this._option);
            return this._service;
        }];
        return ShortcutBindingProvider;
    }());
    angular
        .module('pipShortcuts')
        .provider('pipShortcutBinding', ShortcutBindingProvider);
}
},{"./Shortcut":12}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ShortcutController = (function () {
    ShortcutController.$inject = ['$element', '$attrs', '$scope', '$log', '$parse', 'pipShortcutBinding'];
    function ShortcutController($element, $attrs, $scope, $log, $parse, pipShortcutBinding) {
        "ngInject";
        var _this = this;
        if ($attrs.pipShortcutAction) {
            this.actionShortcuts = $parse($attrs.pipShortcutAction);
            this.actionShortcuts($scope, { $event: {} });
        }
        else {
            $log.error('Shortcut action does not set.');
            return;
        }
        if ($attrs.pipShortcutName && _.isString($attrs.pipShortcutName)) {
            this.nameShortcuts = $attrs.pipShortcutName;
        }
        else {
            $log.error('Shortcut name does not set.');
            return;
        }
        this.options = $attrs.pipShorcutOptions ? $attrs.pipShorcutOptions : {};
        this.options.Target = $element;
        pipShortcutBinding.add(this.nameShortcuts, function (e) {
            _this.actionShortcuts($scope, { $event: { 'e': e } });
        }, this.options);
    }
    ShortcutController.prototype.keypressShortcut = function (action) {
        this.actionShortcuts();
    };
    return ShortcutController;
}());
{
    var shortcutsDirective = function () {
        return {
            restrict: 'A',
            scope: false,
            controller: ShortcutController
        };
    };
    angular
        .module('pipShortcuts')
        .directive('pipShortcut', shortcutsDirective);
}
},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IShortcutsService_1 = require("./IShortcutsService");
exports.ShortcutsChangedEvent = 'pipShortcutsChanged';
var ShortcutsService = (function () {
    function ShortcutsService(config, $rootScope, $window, $location, $injector, pipShortcutBinding) {
        this.$rootScope = $rootScope;
        this.$window = $window;
        this.$location = $location;
        this.$injector = $injector;
        this.pipShortcutBinding = pipShortcutBinding;
        this._config = config;
        this._oldConfig = _.cloneDeep(this._config);
        this.addShortcuts(this._config.globalShortcuts);
        this.addShortcuts(this._config.localShortcuts);
    }
    ShortcutsService.prototype.sendChangeEvent = function () {
        this.removeShortcuts(this._oldConfig.globalShortcuts);
        this.removeShortcuts(this._oldConfig.localShortcuts);
        this.addShortcuts(this.config.globalShortcuts);
        this.addShortcuts(this.config.localShortcuts);
        this.$rootScope.$emit(exports.ShortcutsChangedEvent, this.config);
        this._oldConfig = _.cloneDeep(this.config);
    };
    ShortcutsService.prototype.removeShortcuts = function (collection) {
        var _this = this;
        _.each(collection, function (k) {
            _this.pipShortcutBinding.remove(k.shortcut);
        });
    };
    ShortcutsService.prototype.keypressShortcut = function (item, event) {
        if (item.access && _.isFunction(item.access)) {
            if (!item.access(event)) {
                return;
            }
        }
        if (item.keypress) {
            item.keypress(event);
            return;
        }
        if (item.href) {
            this.$window.location.href = item.href;
            return;
        }
        if (item.url) {
            this.$location.url(item.url);
            return;
        }
        if (item.state) {
            if (this.$injector.has('$state')) {
                var $state = this.$injector.get('$state');
                $state['go'](item.state, item.stateParams);
            }
            return;
        }
        if (item.event) {
            this.$rootScope.$broadcast(item.event);
        }
        else {
            this.$rootScope.$broadcast('pipShortcutKeypress', item.shortcut);
        }
    };
    ShortcutsService.prototype.addShortcuts = function (collection) {
        var _this = this;
        var generalOptions = this.config.defaultOptions ? this.config.defaultOptions : {};
        _.each(collection, function (k) {
            var option = k.options ? k.options : generalOptions;
            var target;
            target = k.target ? k.target : k.targetId;
            option.Target = target;
            _this.pipShortcutBinding.add(k.shortcut, function (e) {
                _this.keypressShortcut(k, e);
            }, option);
        });
    };
    Object.defineProperty(ShortcutsService.prototype, "config", {
        get: function () {
            return this._config;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShortcutsService.prototype, "defaultOptions", {
        get: function () {
            return this._config.defaultOptions;
        },
        set: function (value) {
            this._config.defaultOptions = value || null;
            this.sendChangeEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShortcutsService.prototype, "globalShortcuts", {
        get: function () {
            return this._config.globalShortcuts;
        },
        set: function (value) {
            this._config.globalShortcuts = value || [];
            this.sendChangeEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShortcutsService.prototype, "localShortcuts", {
        get: function () {
            return this._config.localShortcuts;
        },
        set: function (value) {
            this._config.localShortcuts = value || [];
            this.sendChangeEvent();
        },
        enumerable: true,
        configurable: true
    });
    return ShortcutsService;
}());
var ShortcutsProvider = (function () {
    function ShortcutsProvider() {
        this._config = new IShortcutsService_1.ShortcutsConfig();
    }
    Object.defineProperty(ShortcutsProvider.prototype, "config", {
        get: function () {
            return this._config;
        },
        set: function (value) {
            this._config = value || new IShortcutsService_1.ShortcutsConfig();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShortcutsProvider.prototype, "defaultOptions", {
        get: function () {
            return this._config.defaultOptions;
        },
        set: function (value) {
            this._config.defaultOptions = value || null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShortcutsProvider.prototype, "globalShortcuts", {
        get: function () {
            return this._config.globalShortcuts;
        },
        set: function (value) {
            this._config.globalShortcuts = value || [];
        },
        enumerable: true,
        configurable: true
    });
    ShortcutsProvider.prototype.$get = ['$rootScope', '$window', '$location', '$injector', 'pipShortcutBinding', function ($rootScope, $window, $location, $injector, pipShortcutBinding) {
        "ngInject";
        if (this._service == null)
            this._service = new ShortcutsService(this._config, $rootScope, $window, $location, $injector, pipShortcutBinding);
        return this._service;
    }];
    return ShortcutsProvider;
}());
angular
    .module('pipShortcuts')
    .provider('pipShortcuts', ShortcutsProvider);
},{"./IShortcutsService":11}],16:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipShortcuts', ['ngMaterial', 'ui.router']);
require("./ShortcutBindingService");
require("./ShortcutsService");
require("./ShortcutDirective");
__export(require("./IShortcutsService"));
__export(require("./ShortcutsService"));
},{"./IShortcutsService":11,"./ShortcutBindingService":13,"./ShortcutDirective":14,"./ShortcutsService":15}],17:[function(require,module,exports){
{
    var UnsavedChangesLink_1 = (function () {
        function UnsavedChangesLink_1($scope, $window) {
            $window.onbeforeunload = function () {
                if ($scope.unsavedChangesAvailable()) {
                    return $scope.unsavedChangesMessage;
                }
            };
            var unbindFunc = $scope.$on('$stateChangeStart', function (event) {
                if ($scope.unsavedChangesAvailable() && !$window.confirm($scope.unsavedChangesMessage)) {
                    _.isFunction($scope.cancelLeave) && $scope.cancelLeave();
                    event.preventDefault();
                }
                else {
                    _.isFunction($scope.afterLeave) && $scope.afterLeave();
                }
            });
            $scope.$on('$destroy', function () {
                $window.onbeforeunload = null;
                unbindFunc();
            });
        }
        return UnsavedChangesLink_1;
    }());
    var UnsavedChanges = function ($window) {
        return {
            restrict: 'AE',
            scope: {
                unsavedChangesAvailable: '&pipUnsavedChangesAvailable',
                unsavedChangesMessage: '@pipUnsavedChangesMessage',
                afterLeave: '&pipUnsavedChangesAfterLeave',
                cancelLeave: '&pipUnsavedChangesCancelLeave'
            },
            link: function ($scope) {
                new UnsavedChangesLink_1($scope, $window);
            }
        };
    };
    UnsavedChanges.$inject = ['$window'];
    angular
        .module("pipUnsavedChanges", [])
        .directive("pipUnsavedChanges", UnsavedChanges);
}
},{}]},{},[8])(8)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).controls = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
{
    var ColorPickerBindings = {
        ngDisabled: '<?ngDisabled',
        colors: '<pipColors',
        currentColor: '=ngModel',
        colorChange: '&?ngChange'
    };
    var ColorPickerChanges = (function () {
        function ColorPickerChanges() {
        }
        return ColorPickerChanges;
    }());
    var DEFAULT_COLORS_1 = ['purple', 'lightgreen', 'green', 'darkred', 'pink', 'yellow', 'cyan'];
    var ColorPickerController = (function () {
        function ColorPickerController($scope, $element, $attrs, $timeout) {
            this.$scope = $scope;
            this.$element = $element;
            this.$timeout = $timeout;
            this.class = $attrs.class || '';
        }
        ColorPickerController.prototype.$onChanges = function (changes) {
            this.colors = changes.colors && _.isArray(changes.colors.currentValue) && changes.colors.currentValue.length !== 0 ?
                changes.colors.currentValue : DEFAULT_COLORS_1;
            this.currentColor = this.currentColor || this.colors[0];
            this.currentColorIndex = this.colors.indexOf(this.currentColor);
            this.ngDisabled = changes.ngDisabled.currentValue;
        };
        ColorPickerController.prototype.selectColor = function (index) {
            var _this = this;
            if (this.ngDisabled) {
                return;
            }
            this.currentColorIndex = index;
            this.currentColor = this.colors[this.currentColorIndex];
            this.$timeout(function () {
                _this.$scope.$apply();
            });
            if (this.colorChange) {
                this.colorChange();
            }
        };
        ;
        ColorPickerController.prototype.enterSpacePress = function (event) {
            this.selectColor(event.index);
        };
        ;
        return ColorPickerController;
    }());
    var pipColorPicker = {
        bindings: ColorPickerBindings,
        templateUrl: 'color_picker/ColorPicker.html',
        controller: ColorPickerController
    };
    angular
        .module('pipColorPicker', ['pipControls.Templates'])
        .component('pipColorPicker', pipColorPicker);
}
},{}],2:[function(require,module,exports){
{
    translateFilter.$inject = ['$injector'];
    function translateFilter($injector) {
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate['translate'](key) || key : key;
        };
    }
    angular
        .module('pipControls.Translate', [])
        .filter('translate', translateFilter);
}
},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
{
    var pipImageSliderController_1 = (function () {
        pipImageSliderController_1.$inject = ['$scope', '$element', '$attrs', '$parse', '$timeout', '$interval', 'pipImageSlider'];
        function pipImageSliderController_1($scope, $element, $attrs, $parse, $timeout, $interval, pipImageSlider) {
            var _this = this;
            this.$scope = $scope;
            this.$element = $element;
            this.$attrs = $attrs;
            this.$parse = $parse;
            this.$timeout = $timeout;
            this.$interval = $interval;
            this.pipImageSlider = pipImageSlider;
            this._index = 0;
            this.DEFAULT_INTERVAL = 4500;
            this.swipeStart = 0;
            this._type = this.type();
            this._interval = this.interval();
            this.slideTo = this.slideToPrivate;
            $element.addClass('pip-image-slider');
            $element.addClass('pip-animation-' + this._type);
            this.setIndex();
            $timeout(function () {
                _this._blocks = $element.find('.pip-animation-block');
                if (_this._blocks.length > 0) {
                    $(_this._blocks[0]).addClass('pip-show');
                }
            });
            this.startInterval();
            this._throttled = _.throttle(function () {
                pipImageSlider.toBlock(_this._type, _this._blocks, _this._index, _this._newIndex, _this._direction);
                _this._index = _this._newIndex;
                _this.setIndex();
            }, 700);
            if ($attrs.id) {
                pipImageSlider.registerSlider($attrs.id, $scope);
            }
            $scope.$on('$destroy', function () {
                _this.stopInterval();
                pipImageSlider.removeSlider($attrs.id);
            });
        }
        pipImageSliderController_1.prototype.nextBlock = function () {
            this.restartInterval();
            this._newIndex = this._index + 1 === this._blocks.length ? 0 : this._index + 1;
            this._direction = 'next';
            this._throttled();
        };
        pipImageSliderController_1.prototype.prevBlock = function () {
            this.restartInterval();
            this._newIndex = this._index - 1 < 0 ? this._blocks.length - 1 : this._index - 1;
            this._direction = 'prev';
            this._throttled();
        };
        pipImageSliderController_1.prototype.slideToPrivate = function (nextIndex) {
            if (nextIndex === this._index || nextIndex > this._blocks.length - 1) {
                return;
            }
            this.restartInterval();
            this._newIndex = nextIndex;
            this._direction = nextIndex > this._index ? 'next' : 'prev';
            this._throttled();
        };
        pipImageSliderController_1.prototype.setIndex = function () {
            if (this.$attrs.pipImageIndex)
                this.sliderIndex = this._index;
        };
        pipImageSliderController_1.prototype.startInterval = function () {
            var _this = this;
            this._timePromises = this.$interval(function () {
                _this._newIndex = _this._index + 1 === _this._blocks.length ? 0 : _this._index + 1;
                _this._direction = 'next';
                _this._throttled();
            }, Number(this._interval || this.DEFAULT_INTERVAL));
        };
        pipImageSliderController_1.prototype.stopInterval = function () {
            this.$interval.cancel(this._timePromises);
        };
        pipImageSliderController_1.prototype.restartInterval = function () {
            this.stopInterval();
            this.startInterval();
        };
        return pipImageSliderController_1;
    }());
    var ImageSlider = function () {
        return {
            scope: {
                sliderIndex: '=pipImageIndex',
                type: '&pipAnimationType',
                interval: '&pipAnimationInterval'
            },
            bindToController: true,
            controller: pipImageSliderController_1,
            controllerAs: 'vm'
        };
    };
    angular.module('pipImageSlider')
        .directive('pipImageSlider', ImageSlider);
}
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
{
    var ImageSliderService = (function () {
        ImageSliderService.$inject = ['$timeout'];
        function ImageSliderService($timeout) {
            this.$timeout = $timeout;
            this.ANIMATION_DURATION = 550;
            this._sliders = {};
        }
        ImageSliderService.prototype.registerSlider = function (sliderId, sliderScope) {
            this._sliders[sliderId] = sliderScope;
        };
        ImageSliderService.prototype.removeSlider = function (sliderId) {
            delete this._sliders[sliderId];
        };
        ImageSliderService.prototype.getSliderScope = function (sliderId) {
            return this._sliders[sliderId];
        };
        ImageSliderService.prototype.nextCarousel = function (nextBlock, prevBlock) {
            nextBlock.addClass('pip-next');
            this.$timeout(function () {
                nextBlock.addClass('animated').addClass('pip-show').removeClass('pip-next');
                prevBlock.addClass('animated').removeClass('pip-show');
            }, 100);
        };
        ImageSliderService.prototype.prevCarousel = function (nextBlock, prevBlock) {
            this.$timeout(function () {
                nextBlock.addClass('animated').addClass('pip-show');
                prevBlock.addClass('animated').addClass('pip-next').removeClass('pip-show');
            }, 100);
        };
        ImageSliderService.prototype.toBlock = function (type, blocks, oldIndex, nextIndex, direction) {
            var prevBlock = $(blocks[oldIndex]), blockIndex = nextIndex, nextBlock = $(blocks[blockIndex]);
            if (type === 'carousel') {
                $(blocks).removeClass('pip-next').removeClass('pip-prev').removeClass('animated');
                if (direction && (direction === 'prev' || direction === 'next')) {
                    if (direction === 'prev') {
                        this.prevCarousel(nextBlock, prevBlock);
                    }
                    else {
                        this.nextCarousel(nextBlock, prevBlock);
                    }
                }
                else {
                    if (nextIndex && nextIndex < oldIndex) {
                        this.prevCarousel(nextBlock, prevBlock);
                    }
                    else {
                        this.nextCarousel(nextBlock, prevBlock);
                    }
                }
            }
            else {
                prevBlock.addClass('animated').removeClass('pip-show');
                nextBlock.addClass('animated').addClass('pip-show');
            }
        };
        return ImageSliderService;
    }());
    angular
        .module('pipImageSlider.Service', [])
        .service('pipImageSlider', ImageSliderService);
}
},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
{
    var SliderButtonController_1 = (function () {
        SliderButtonController_1.$inject = ['$element', 'pipImageSlider'];
        function SliderButtonController_1($element, pipImageSlider) {
            var _this = this;
            $element.on('click', function () {
                if (!_this.sliderId() || !_this.direction()) {
                    return;
                }
                pipImageSlider.getSliderScope(_this.sliderId()).vm[_this.direction() + 'Block']();
            });
        }
        return SliderButtonController_1;
    }());
    var SliderButton = function () {
        return {
            scope: {
                direction: '&pipButtonType',
                sliderId: '&pipSliderId'
            },
            controllerAs: '$ctlr',
            bindToController: true,
            controller: SliderButtonController_1
        };
    };
    angular
        .module('pipSliderButton', [])
        .directive('pipSliderButton', SliderButton);
}
},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
{
    var SliderIndicatorController_1 = (function () {
        SliderIndicatorController_1.$inject = ['$element', 'pipImageSlider'];
        function SliderIndicatorController_1($element, pipImageSlider) {
            var _this = this;
            $element.css('cursor', 'pointer');
            $element.on('click', function () {
                if (!_this.sliderId() || _this.slideTo() === undefined) {
                    return;
                }
                pipImageSlider.getSliderScope(_this.sliderId()).vm.slideTo(_this.slideTo());
            });
        }
        return SliderIndicatorController_1;
    }());
    var SliderIndicator = function () {
        return {
            scope: {
                slideTo: '&pipSlideTo',
                sliderId: '&pipSliderId'
            },
            controllerAs: '$ctlr',
            bindToController: true,
            controller: SliderIndicatorController_1
        };
    };
    angular
        .module('pipSliderIndicator', [])
        .directive('pipSliderIndicator', SliderIndicator);
}
},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
angular
    .module('pipImageSlider', ['pipSliderButton', 'pipSliderIndicator', 'pipImageSlider.Service']);
require("./ImageSlider");
require("./ImageSliderService");
require("./SliderButton");
require("./SliderIndicator");
},{"./ImageSlider":3,"./ImageSliderService":4,"./SliderButton":5,"./SliderIndicator":6}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./dependencies/TranslateFilter");
require("./color_picker/ColorPicker");
require("./image_slider");
require("./markdown/Markdown");
require("./popover");
require("./progress/RoutingProgress");
require("./toast");
angular.module('pipControls', [
    'pipMarkdown',
    'pipColorPicker',
    'pipRoutingProgress',
    'pipPopover',
    'pipImageSlider',
    'pipToasts',
    'pipControls.Translate'
]);
},{"./color_picker/ColorPicker":1,"./dependencies/TranslateFilter":2,"./image_slider":7,"./markdown/Markdown":9,"./popover":12,"./progress/RoutingProgress":13,"./toast":16}],9:[function(require,module,exports){
{
    var ConfigTranslations = function ($injector) {
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        if (pipTranslate) {
            pipTranslate.setTranslations('en', {
                'MARKDOWN_ATTACHMENTS': 'Attachments:',
                'checklist': 'Checklist',
                'documents': 'Documents',
                'pictures': 'Pictures',
                'location': 'Location',
                'time': 'Time'
            });
            pipTranslate.setTranslations('ru', {
                'MARKDOWN_ATTACHMENTS': 'Вложения:',
                'checklist': 'Список',
                'documents': 'Документы',
                'pictures': 'Изображения',
                'location': 'Местонахождение',
                'time': 'Время'
            });
        }
    };
    ConfigTranslations.$inject = ['$injector'];
    var MarkdownBindings = {
        text: '<pipText',
        isList: '<?pipList',
        clamp: '<?pipLineCount',
        rebind: '<?pipRebind'
    };
    var MarkdownChanges = (function () {
        function MarkdownChanges() {
        }
        return MarkdownChanges;
    }());
    var MarkdownController = (function () {
        function MarkdownController($scope, $element, $injector) {
            this.$scope = $scope;
            this.$element = $element;
            this._pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        }
        MarkdownController.prototype.$postLink = function () {
            this.bindText(this.text);
            this.$scope.$on('pipWindowResized', function () {
                if (this.bindText)
                    this.bindText(this._text(this._$scope));
            });
            this.$element.addClass('pip-markdown');
        };
        MarkdownController.prototype.$onChanges = function (changes) {
            var newText = changes.text.currentValue;
            if (this.rebind) {
                this.text = newText;
                this.bindText(this.text);
            }
        };
        MarkdownController.prototype.describeAttachments = function (array) {
            var attachString = '', attachTypes = [];
            _.each(array, function (attach) {
                if (attach.type && attach.type !== 'text') {
                    if (attachString.length === 0 && this._pipTranslate) {
                        attachString = this._pipTranslate.translate('MARKDOWN_ATTACHMENTS');
                    }
                    if (attachTypes.indexOf(attach.type) < 0) {
                        attachTypes.push(attach.type);
                        attachString += attachTypes.length > 1 ? ', ' : ' ';
                        if (this._pipTranslate)
                            attachString += this._pipTranslate.translate(attach.type);
                    }
                }
            });
            return attachString;
        };
        MarkdownController.prototype.bindText = function (value) {
            var textString, isClamped, height, options, obj;
            if (_.isArray(value)) {
                obj = _.find(value, function (item) {
                    return item.type === 'text' && item.text;
                });
                textString = obj ? obj.text : this.describeAttachments(value);
            }
            else {
                textString = value;
            }
            isClamped = this.clamp && _.isNumber(this.clamp);
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
                height = 1.5 * Number(this.clamp);
            }
            this.$element.html('<div' + (isClamped ? this.isList ? 'class="pip-markdown-content ' +
                'pip-markdown-list" style="max-height: ' + height + 'em">' :
                ' class="pip-markdown-content" style="max-height: ' + height + 'em">' : this.isList ?
                ' class="pip-markdown-list">' : '>') + textString + '</div>');
            this.$element.find('a').attr('target', 'blank');
            if (!this.isList && isClamped) {
                this.$element.append('<div class="pip-gradient-block"></div>');
            }
        };
        return MarkdownController;
    }());
    var MarkdownComponent = {
        controller: MarkdownController,
        bindings: MarkdownBindings
    };
    angular
        .module('pipMarkdown', ['ngSanitize'])
        .run(ConfigTranslations)
        .component('pipMarkdown', MarkdownComponent);
}
},{}],10:[function(require,module,exports){
{
    var PopoverBindings = {
        params: '<pipParams'
    };
    var PopoverController = (function () {
        function PopoverController($scope, $rootScope, $element, $timeout, $compile, $templateRequest) {
            var _this = this;
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.$compile = $compile;
            this.$templateRequest = $templateRequest;
            this.backdropElement = $('.pip-popover-backdrop');
            this.backdropElement.on('click keydown scroll', function () {
                _this.backdropClick();
            });
            this.backdropElement.addClass(this.params.responsive !== false ? 'pip-responsive' : '');
            $timeout(function () {
                _this.position();
                angular.extend($scope, _this.params.locals);
                if (_this.params.template) {
                    _this.content = $compile(_this.params.template)($scope);
                    $element.find('.pip-popover').append(_this.content);
                    _this.init();
                }
                else {
                    _this.$templateRequest(_this.params.templateUrl, false).then(function (html) {
                        _this.content = $compile(html)($scope);
                        $element.find('.pip-popover').append(_this.content);
                        _this.init();
                    });
                }
            });
            $timeout(function () {
                _this.calcHeight();
            }, 200);
            $rootScope.$on('pipPopoverResize', function () {
                _this.onResize();
            });
            $(window).resize(function () {
                _this.onResize();
            });
        }
        PopoverController.prototype.backdropClick = function () {
            if (this.params.cancelCallback) {
                this.params.cancelCallback();
            }
            this.closePopover();
        };
        PopoverController.prototype.closePopover = function () {
            var _this = this;
            this.backdropElement.removeClass('opened');
            this.$timeout(function () {
                _this.backdropElement.remove();
            }, 100);
        };
        PopoverController.prototype.onPopoverClick = function (event) {
            event.stopPropagation();
        };
        PopoverController.prototype.init = function () {
            this.backdropElement.addClass('opened');
            $('.pip-popover-backdrop').focus();
            if (this.params.timeout) {
                this.$timeout(function () {
                    this.closePopover();
                }, this.params.timeout);
            }
        };
        PopoverController.prototype.position = function () {
            if (this.params.element) {
                var element = $(this.params.element), pos = element.offset(), width = element.width(), height = element.height(), docWidth = $(document).width(), docHeight = $(document).height(), popover = this.backdropElement.find('.pip-popover');
                if (pos) {
                    popover
                        .css('max-width', docWidth - (docWidth - pos.left))
                        .css('max-height', docHeight - (pos.top + height) - 32, 0)
                        .css('left', pos.left - popover.width() + width / 2)
                        .css('top', pos.top + height + 16);
                }
            }
        };
        PopoverController.prototype.onResize = function () {
            this.backdropElement.find('.pip-popover').find('.pip-content').css('max-height', '100%');
            this.position();
            this.calcHeight();
        };
        PopoverController.prototype.calcHeight = function () {
            if (this.params.calcHeight === false) {
                return;
            }
            var popover = this.backdropElement.find('.pip-popover'), title = popover.find('.pip-title'), footer = popover.find('.pip-footer'), content = popover.find('.pip-content'), contentHeight = popover.height() - title.outerHeight(true) - footer.outerHeight(true);
            content.css('max-height', Math.max(contentHeight, 0) + 'px').css('box-sizing', 'border-box');
        };
        return PopoverController;
    }());
    var Popover = {
        bindings: PopoverBindings,
        templateUrl: 'popover/Popover.html',
        controller: PopoverController
    };
    angular
        .module('pipPopover')
        .component('pipPopover', Popover);
}
},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
{
    var PopoverService = (function () {
        PopoverService.$inject = ['$compile', '$rootScope', '$timeout'];
        function PopoverService($compile, $rootScope, $timeout) {
            this.$compile = $compile;
            this.$rootScope = $rootScope;
            this.$timeout = $timeout;
            this.popoverTemplate = "<div class='pip-popover-backdrop {{ params.class }}' ng-controller='params.controller'" +
                " tabindex='1'> <pip-popover pip-params='params'> </pip-popover> </div>";
        }
        PopoverService.prototype.show = function (p) {
            var element, scope, params, content;
            element = $('body');
            if (element.find('md-backdrop').length > 0) {
                return;
            }
            this.hide();
            scope = this.$rootScope.$new();
            params = p && _.isObject(p) ? p : {};
            scope.params = params;
            scope.locals = params.locals;
            content = this.$compile(this.popoverTemplate)(scope);
            element.append(content);
        };
        PopoverService.prototype.hide = function () {
            var backdropElement = $('.pip-popover-backdrop');
            backdropElement.removeClass('opened');
            this.$timeout(function () {
                backdropElement.remove();
            }, 100);
        };
        PopoverService.prototype.resize = function () {
            this.$rootScope.$broadcast('pipPopoverResize');
        };
        return PopoverService;
    }());
    angular
        .module('pipPopover.Service', [])
        .service('pipPopoverService', PopoverService);
}
},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipPopover', ['pipPopover.Service']);
require("./Popover");
require("./PopoverService");
},{"./Popover":10,"./PopoverService":11}],13:[function(require,module,exports){
{
    var RoutingBindings = {
        showProgress: '&',
        logoUrl: '@'
    };
    var RoutingController = (function () {
        function RoutingController($scope, $element) {
            this.$element = $element;
        }
        RoutingController.prototype.$postLink = function () {
            this._image = this.$element.find('img');
            this.loadProgressImage();
        };
        RoutingController.prototype.loadProgressImage = function () {
            if (this.logoUrl) {
                this._image.attr('src', this.logoUrl);
            }
        };
        return RoutingController;
    }());
    var RoutingProgress = {
        bindings: RoutingBindings,
        templateUrl: 'progress/RoutingProgress.html',
        controller: RoutingController
    };
    angular
        .module('pipRoutingProgress', ['ngMaterial'])
        .component('pipRoutingProgress', RoutingProgress);
}
},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Toast = (function () {
    function Toast() {
    }
    return Toast;
}());
exports.Toast = Toast;
},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
{
    var ToastController_1 = (function () {
        function ToastController_1($mdToast, toast, $injector) {
            this.$mdToast = $mdToast;
            this.toast = toast;
            this._pipErrorDetailsDialog = $injector.has('pipErrorDetailsDialog') ?
                $injector.get('pipErrorDetailsDialog') : null;
            this.message = toast.message;
            this.actions = toast.actions;
            if (toast.actions.length === 0) {
                this.actionLenght = 0;
            }
            else {
                this.actionLenght = toast.actions.length === 1 ? toast.actions[0].toString().length : null;
            }
            this.showDetails = this._pipErrorDetailsDialog != null;
        }
        ToastController_1.prototype.onDetails = function () {
            this.$mdToast.hide();
            if (this._pipErrorDetailsDialog) {
                this._pipErrorDetailsDialog.show({
                    error: this.toast.error,
                    ok: 'Ok'
                }, angular.noop, angular.noop);
            }
        };
        ToastController_1.prototype.onAction = function (action) {
            this.$mdToast.hide({
                action: action,
                id: this.toast.id,
                message: this.message
            });
        };
        return ToastController_1;
    }());
    var ToastService = (function () {
        ToastService.$inject = ['$rootScope', '$mdToast'];
        function ToastService($rootScope, $mdToast) {
            var _this = this;
            this.$mdToast = $mdToast;
            this.SHOW_TIMEOUT = 20000;
            this.SHOW_TIMEOUT_NOTIFICATIONS = 20000;
            this.toasts = [];
            this.sounds = {};
            $rootScope.$on('$stateChangeSuccess', function () { _this.onStateChangeSuccess(); });
            $rootScope.$on('pipSessionClosed', function () { _this.onClearToasts(); });
            $rootScope.$on('pipIdentityChanged', function () { _this.onClearToasts(); });
        }
        ToastService.prototype.showNextToast = function () {
            var toast;
            if (this.toasts.length > 0) {
                toast = this.toasts[0];
                this.toasts.splice(0, 1);
                this.showToast(toast);
            }
        };
        ToastService.prototype.showToast = function (toast) {
            var _this = this;
            this.currentToast = toast;
            this.$mdToast.show({
                templateUrl: 'toast/Toast.html',
                hideDelay: toast.duration || this.SHOW_TIMEOUT,
                position: 'bottom left',
                controller: ToastController_1,
                controllerAs: 'vm',
                locals: {
                    toast: this.currentToast,
                    sounds: this.sounds
                }
            })
                .then(function (action) {
                _this.showToastOkResult(action);
            }, function (action) {
                _this.showToastCancelResult(action);
            });
        };
        ToastService.prototype.showToastCancelResult = function (action) {
            if (this.currentToast.cancelCallback) {
                this.currentToast.cancelCallback(action);
            }
            this.currentToast = null;
            this.showNextToast();
        };
        ToastService.prototype.showToastOkResult = function (action) {
            if (this.currentToast.successCallback) {
                this.currentToast.successCallback(action);
            }
            this.currentToast = null;
            this.showNextToast();
        };
        ToastService.prototype.addToast = function (toast) {
            if (this.currentToast && toast.type !== 'error') {
                this.toasts.push(toast);
            }
            else {
                this.showToast(toast);
            }
        };
        ToastService.prototype.removeToasts = function (type) {
            var result = [];
            _.each(this.toasts, function (toast) {
                if (!toast.type || toast.type !== type) {
                    result.push(toast);
                }
            });
            this.toasts = _.cloneDeep(result);
        };
        ToastService.prototype.removeToastsById = function (id) {
            _.remove(this.toasts, {
                id: id
            });
        };
        ToastService.prototype.getToastById = function (id) {
            return _.find(this.toasts, {
                id: id
            });
        };
        ToastService.prototype.onStateChangeSuccess = function () { };
        ToastService.prototype.onClearToasts = function () {
            this.clearToasts(null);
        };
        ToastService.prototype.showNotification = function (message, actions, successCallback, cancelCallback, id) {
            this.addToast({
                id: id || null,
                type: 'notification',
                message: message,
                actions: actions || ['ok'],
                successCallback: successCallback,
                cancelCallback: cancelCallback,
                duration: this.SHOW_TIMEOUT_NOTIFICATIONS
            });
        };
        ToastService.prototype.showMessage = function (message, successCallback, cancelCallback, id) {
            this.addToast({
                id: id || null,
                type: 'message',
                message: message,
                actions: ['ok'],
                successCallback: successCallback,
                cancelCallback: cancelCallback
            });
        };
        ToastService.prototype.showError = function (message, successCallback, cancelCallback, id, error) {
            this.addToast({
                id: id || null,
                error: error,
                type: 'error',
                message: message || 'Unknown error.',
                actions: ['ok'],
                successCallback: successCallback,
                cancelCallback: cancelCallback
            });
        };
        ToastService.prototype.hideAllToasts = function () {
            this.$mdToast.cancel();
            this.toasts = [];
        };
        ToastService.prototype.clearToasts = function (type) {
            if (type) {
                this.removeToasts(type);
            }
            else {
                this.$mdToast.cancel();
                this.toasts = [];
            }
        };
        return ToastService;
    }());
    angular
        .module('pipToasts')
        .service('pipToasts', ToastService);
}
},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipToasts', ['ngMaterial', 'pipControls.Translate']);
require("./ToastService");
require("./Toast");
},{"./Toast":14,"./ToastService":15}],17:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipControls.Templates');
} catch (e) {
  module = angular.module('pipControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('color_picker/colorPicker.html',
    '<ul class="pip-color-picker {{$ctrl.class}}" pip-selected="$ctrl.currentColorIndex" pip-enter-space-press="$ctrl.enterSpacePress($event)"><li tabindex="-1" ng-repeat="color in $ctrl.colors track by color"><md-button tabindex="-1" class="md-icon-button pip-selectable" ng-click="$ctrl.selectColor($index)" aria-label="color" ng-disabled="$ctrl.ngDisabled"><md-icon ng-style="{\'color\': color}" md-svg-icon="icons:{{ color == $ctrl.currentColor ? \'circle\' : \'radio-off\' }}"></md-icon></md-button></li></ul>');
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
    '<div class="pip-popover" ng-click="$ctrl.params.onPopoverClick($event)"></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipControls.Templates');
} catch (e) {
  module = angular.module('pipControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('progress/routingProgress.html',
    '<div class="layout-column layout-align-center-center" ng-show="$ctrl.showProgress()"><div class="loader"><svg class="circular" viewbox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></circle></svg></div><img src="" height="40" width="40" class="pip-img"><md-progress-circular md-diameter="96" class="fix-ie"></md-progress-circular></div>');
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
    '<md-toast class="md-action pip-toast" ng-class="{\'pip-error\': vm.toast.type==\'error\', \'pip-column-toast\': vm.toast.actions.length > 1 || vm.actionLenght > 4, \'pip-no-action-toast\': vm.actionLenght == 0}" style="height:initial; max-height: initial;"><span class="flex-var pip-text" ng-bind-html="vm.message"></span><div class="layout-row layout-align-end-start pip-actions" ng-if="vm.actions.length > 0 || (vm.toast.type==\'error\' && vm.toast.error)"><div class="flex" ng-if="vm.toast.actions.length > 1"></div><md-button class="flex-fixed pip-toast-button" ng-if="vm.toast.type==\'error\' && vm.toast.error && vm.showDetails" ng-click="vm.onDetails()">Details</md-button><md-button class="flex-fixed pip-toast-button" ng-click="vm.onAction(action)" ng-repeat="action in vm.actions" aria-label="{{::action| translate}}">{{::action| translate}}</md-button></div></md-toast>');
}]);
})();



},{}]},{},[17,8])(17)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).lists = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
{
    translate.$inject = ['$injector'];
    function translate($injector) {
        var pipTranslate = $injector.has('pipTranslate')
            ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate.translate(key) || key : key;
        };
    }
    angular
        .module('pipList.Translate', [])
        .filter('translate', translate);
}
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipLists', ['pipTagList']);
require("./dependencies/TranslateFilter");
require("./tag_list/TagList");
},{"./dependencies/TranslateFilter":1,"./tag_list/TagList":3}],3:[function(require,module,exports){
{
    var TagListController = (function () {
        function TagListController($scope, $element) {
            $element.css('display', 'block');
            $element.addClass('pip-tag-list');
        }
        TagListController.prototype.toBoolean = function (value) {
            if (_.isNull(value) || _.isUndefined(value))
                return false;
            if (!value)
                return false;
            value = value.toString().toLowerCase();
            return value == '1' || value == 'true';
        };
        TagListController.prototype.$onChanges = function (changes) {
            if (this.rebind && changes.tags) {
                this.tags = changes.tags.currentValue;
            }
        };
        return TagListController;
    }());
    var TagListBindings = {
        tags: '<pipTags',
        type: '<pipType',
        typeLocal: '<pipTypeLocal',
        rebuid: '<pipRebind'
    };
    var TagListChanges = (function () {
        function TagListChanges() {
        }
        return TagListChanges;
    }());
    var TagList = {
        bindings: TagListBindings,
        templateUrl: 'tag_list/TagList.html',
        controller: TagListController
    };
    angular
        .module('pipTagList', ['pipList.Translate'])
        .component('pipTagList', TagList);
}
},{}],4:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipLists.Templates');
} catch (e) {
  module = angular.module('pipLists.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('tag_list/TagList.html',
    '<div class="pip-chip rm4 pip-type-chip pip-type-chip-left {{\'bg-\' + $ctrl.type + \'-chips\'}}" ng-if="$ctrl.type && !$ctrl.typeLocal"><span>{{$ctrl.type.toUpperCase() | translate | uppercase}}</span></div><div class="pip-chip rm4 pip-type-chip pip-type-chip-left {{\'bg-\' + $ctrl.type + \'-chips\'}}" ng-if="$ctrl.type && $ctrl.typeLocal"><span>{{$ctrl.typeLocal.toUpperCase() | translate | uppercase}}</span></div><div class="pip-chip rm4" ng-repeat="tag in $ctrl.tags"><span>{{::tag}}</span></div>');
}]);
})();



},{}]},{},[4,1,2,3])(4)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).dates = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
    var DateBindings = {
        timeMode: '@pipTimeMode',
        disabled: '&ngDisabled',
        model: '<ngModel',
        ngChange: '<'
    };
    var DateChanges = (function () {
        function DateChanges() {
        }
        return DateChanges;
    }());
    var DateController = (function () {
        function DateController($injector, $scope) {
            this.localeDate = moment.localeData();
            this.momentMonths = angular.isArray(this.localeDate['_months']) ? this.localeDate['_months'] : this.localeDate['_months'].format;
            this.momentDays = angular.isArray(this.localeDate['_weekdays']) ? this.localeDate['_weekdays'] : this.localeDate['_weekdays'].format;
            this.momentShortDays = this.localeDate['_weekdaysMin'];
            this.momentFirstDayOfWeek = this.localeDate['_week'].dow;
            var value = this.model ? _.isDate(this.model) ? this.model : new Date(this.model) : null;
            this.day = value ? value.getDate() : null;
            this.month = value ? value.getMonth() + 1 : null;
            this.year = value ? value.getFullYear() : null;
            this.days = this.dayList(this.month, this.year);
            this.months = this.monthList();
            this.years = this.yearList();
            this.disableControls = this.disabled ? this.disabled() : false;
        }
        DateController.prototype.$onChanges = function (changes) {
            if (changes.model && changes.model.currentValue) {
                this.model = changes.model.currentValue;
                this.getValue(this.model);
            }
        };
        DateController.prototype.dayList = function (month, year) {
            var count = 31, days = [];
            if (month === 4 || month === 6 || month === 9 || month === 11) {
                count = 30;
            }
            else {
                if (month === 2) {
                    if (year) {
                        count = year % 4 === 0 ? 29 : 28;
                    }
                    else {
                        count = 28;
                    }
                }
            }
            for (var i = 1; i <= count; i++) {
                days.push(i);
            }
            return days;
        };
        DateController.prototype.monthList = function () {
            var months = [];
            for (var i = 1; i <= 12; i++) {
                months.push({
                    id: i,
                    name: this.momentMonths[i - 1]
                });
            }
            return months;
        };
        DateController.prototype.yearList = function () {
            var currentYear = new Date().getFullYear(), startYear = this.timeMode === 'future' ? currentYear : currentYear - 100, endYear = this.timeMode === 'past' ? currentYear : currentYear + 100, years = [];
            if (this.timeMode === 'past') {
                for (var i = endYear; i >= startYear; i--) {
                    years.push(i);
                }
            }
            else {
                for (var i = startYear; i <= endYear; i++) {
                    years.push(i);
                }
            }
            return years;
        };
        DateController.prototype.adjustDay = function () {
            var days = this.dayList(this.month, this.year);
            if (this.days.length !== days.length) {
                if (this.day > days.length) {
                    this.day = days.length;
                }
                this.days = days;
            }
        };
        DateController.prototype.getValue = function (v) {
            var value = v ? _.isDate(v) ? v : new Date(v) : null, day = value ? value.getDate() : null, month = value ? value.getMonth() + 1 : null, year = value ? value.getFullYear() : null;
            if (this.month !== month && this.year !== year) {
                this.days = this.dayList(this.month, this.year);
            }
            this.day = day;
            this.month = month;
            this.year = year;
        };
        DateController.prototype.setValue = function () {
            var value;
            if (this.day && this.month && this.year) {
                value = new Date(this.year, this.month - 1, this.day, 0, 0, 0, 0);
                this.model = value;
                this.ngChange(this.model);
            }
        };
        DateController.prototype.onMonthChanged = function () {
            this.adjustDay();
            this.setValue();
        };
        DateController.prototype.onYearChanged = function () {
            this.adjustDay();
            this.setValue();
        };
        return DateController;
    }());
    var DateComponent = {
        bindings: DateBindings,
        templateUrl: 'date/Date.html',
        controller: DateController
    };
    angular
        .module('pipDate', ['pipDates.Templates'])
        .component('pipDate', DateComponent);
})();
},{}],2:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var DateTimeConvert = (function () {
        function DateTimeConvert(config) {
            this._momentRanged = new Array('year', 'month', 'week', 'isoweek', 'day');
            this._defaultFormat = 'LL';
            this._config = config || { timeZone: null };
        }
        DateTimeConvert.prototype.isUndefinedOrNull = function (value) {
            return angular.isUndefined(value) || value === null;
        };
        DateTimeConvert.prototype.getRange = function (value) {
            if (this.isUndefinedOrNull(value)) {
                return 'day';
            }
            var index = this._momentRanged.indexOf(value);
            if (index < 0) {
                return 'day';
            }
            return this._momentRanged[index];
        };
        DateTimeConvert.prototype.getOperationRange = function (value) {
            if (this.isUndefinedOrNull(value)) {
                return 'day';
            }
            var range = value == 'isoweek' ? 'week' : value, index = this._momentRanged.indexOf(range);
            if (index < 0) {
                return 'day';
            }
            return this._momentRanged[index];
        };
        DateTimeConvert.prototype.formatDateTime = function (value, basicFormat) {
            var date, formatTpl;
            if (this.isUndefinedOrNull(value)) {
                return '';
            }
            if (this._config.timeZone != undefined && this._config.timeZone != null) {
                date = moment(value).utcOffset(this._config.timeZone);
            }
            else {
                date = moment(value);
            }
            if (!date.isValid()) {
                return '';
            }
            formatTpl = basicFormat ? basicFormat : this._defaultFormat;
            return date.format(formatTpl);
        };
        DateTimeConvert.prototype.formatDateTimeY = function (value, basicFormat) {
            var date, nowDate, formatMoment;
            if (this.isUndefinedOrNull(value)) {
                return '';
            }
            if (this._config.timeZone != undefined && this._config.timeZone != null) {
                date = moment(value).utcOffset(this._config.timeZone);
            }
            else {
                date = moment(value);
            }
            if (!date.isValid()) {
                return '';
            }
            nowDate = moment();
            formatMoment = moment.localeData().longDateFormat(basicFormat ? basicFormat : this._defaultFormat);
            if (nowDate.year() == date.year()) {
                formatMoment = formatMoment.replace(/Y/g, '').replace(/^\W|\W$|\W\W/, '');
            }
            return date.format(formatMoment);
        };
        DateTimeConvert.prototype.formatDay = function (value, basicFormat) {
            var date, format = moment.localeData().longDateFormat(basicFormat ? basicFormat : this._defaultFormat), formatMonthYearless = format.replace(/Y/g, '').replace(/^\W|\W$|\W\W/, '').replace(/M/g, '');
            if (this.isUndefinedOrNull(value)) {
                return '';
            }
            if (this._config.timeZone != undefined && this._config.timeZone != null) {
                date = moment(value).utcOffset(this._config.timeZone);
            }
            else {
                date = moment(value);
            }
            if (!date.isValid()) {
                return '';
            }
            return date.format(formatMonthYearless);
        };
        DateTimeConvert.prototype.formatMonthDay = function (value, basicFormat) {
            var date, format = basicFormat ? basicFormat : this._defaultFormat, formatLL = moment.localeData().longDateFormat(format), formatYearlessLL = formatLL.replace(/Y/g, '').replace(/^\W|\W$|\W\W/, '');
            if (this.isUndefinedOrNull(value)) {
                return '';
            }
            if (this._config.timeZone != undefined && this._config.timeZone != null) {
                date = moment(value).utcOffset(this._config.timeZone);
            }
            else {
                date = moment(value);
            }
            if (!date.isValid()) {
                return '';
            }
            return date.format(formatYearlessLL);
        };
        DateTimeConvert.prototype.formatRange = function (value1, value2, basicFormat) {
            var dateStart, dateEnd, format = basicFormat ? basicFormat : this._defaultFormat;
            if (this.isUndefinedOrNull(value1)) {
                dateStart = null;
            }
            else {
                dateStart = (this._config.timeZone != undefined && this._config.timeZone != null) ? moment(value1).utcOffset(this._config.timeZone) : moment(value1);
            }
            if (this.isUndefinedOrNull(value2)) {
                dateEnd = null;
            }
            else {
                dateEnd = (this._config.timeZone != undefined && this._config.timeZone != null) ? moment(value2).utcOffset(this._config.timeZone) : moment(value2);
            }
            if (dateStart === null && dateEnd === null)
                return '';
            if (dateStart === null) {
                return dateEnd.format(basicFormat);
            }
            if (dateEnd === null || dateStart.isSame(dateEnd)) {
                return dateStart.format(basicFormat);
                ;
            }
            if (dateStart.isAfter(dateEnd)) {
                throw new Error('Date range error. Start date is more than end date.');
            }
            if (dateStart.year() == dateEnd.year()) {
                if (dateStart.month() == dateEnd.month()) {
                    return this.formatDay(dateStart, basicFormat) + '-' + dateEnd.format(basicFormat);
                }
                return this.formatMonthDay(dateStart, basicFormat) + '-' + dateEnd.format(basicFormat);
            }
            return dateStart.format(basicFormat) + '-' + dateEnd.format(basicFormat);
        };
        DateTimeConvert.prototype.toStartRange = function (value, range) {
            var date;
            if (this.isUndefinedOrNull(value)) {
                throw new Error('toStartRange - value is undefined or null');
            }
            if (this._config.timeZone != undefined && this._config.timeZone != null) {
                date = moment(value).utcOffset(this._config.timeZone);
            }
            else {
                date = moment(value);
            }
            if (!date.isValid()) {
                throw new Error('toStartRange - date is invalid');
            }
            return date.startOf(range).toDate();
        };
        DateTimeConvert.prototype.toEndRange = function (value, range, offset) {
            var date, result, mssOffset;
            if (this.isUndefinedOrNull(value)) {
                return '';
            }
            if (!angular.isNumber(offset)) {
                mssOffset = 0;
            }
            if (this._config.timeZone != undefined && this._config.timeZone != null) {
                date = moment(value).utcOffset(this._config.timeZone);
            }
            else {
                date = moment(value);
            }
            if (!date.isValid()) {
                return '';
            }
            if (mssOffset) {
                result = date.startOf(range).add(mssOffset, 'milliseconds');
            }
            else {
                result = date.startOf(range);
            }
            return date.startOf(range).toDate();
        };
        DateTimeConvert.prototype.toDateWithTime = function (value, formatDate, formatTime, firstTime) {
            var date, result, nowDate;
            if (this.isUndefinedOrNull(value)) {
                return '';
            }
            if (this._config.timeZone != undefined && this._config.timeZone != null) {
                date = moment(value).utcOffset(this._config.timeZone);
            }
            else {
                date = moment(value);
            }
            if (!date.isValid()) {
                return '';
            }
            nowDate = moment();
            if (firstTime) {
                result = date.format(formatTime) + ' ' + date.format(formatDate);
            }
            else {
                result = date.format(formatDate) + ' ' + date.format(formatTime);
            }
            return result;
        };
        DateTimeConvert.prototype.toTodayDate = function (value, formatDate, formatTime) {
            var date, result, nowDate;
            if (this.isUndefinedOrNull(value)) {
                return '';
            }
            if (this._config.timeZone != undefined && this._config.timeZone != null) {
                date = moment(value).utcOffset(this._config.timeZone);
            }
            else {
                date = moment(value);
            }
            if (!date.isValid()) {
                return '';
            }
            nowDate = moment();
            if (nowDate.year() == date.year() && nowDate.month() == date.month() && nowDate.day() == date.day()) {
                result = date.format(formatTime);
            }
            else {
                result = date.format(formatDate) + ' ' + date.format(formatTime);
            }
            return result;
        };
        ;
        Object.defineProperty(DateTimeConvert.prototype, "config", {
            get: function () {
                return this._config;
            },
            enumerable: true,
            configurable: true
        });
        DateTimeConvert.prototype.useTimeZone = function (offset) {
            this._config.timeZone = offset;
        };
        DateTimeConvert.prototype.getDateJSON = function (date) {
            return JSON.stringify(moment(date));
        };
        DateTimeConvert.prototype.getNextStart = function (value, category) {
            var date, range, result;
            if (this.isUndefinedOrNull(value)) {
                return '';
            }
            date = moment(value);
            if (!date.isValid()) {
                return '';
            }
            range = this.getRange(category);
            result = moment(date).startOf(range).add(this.getOperationRange(range));
            return result.toDate();
        };
        DateTimeConvert.prototype.getPrevStart = function (value, category) {
            var date, range, result;
            if (this.isUndefinedOrNull(value)) {
                throw new Error('getPrevStart - value is undefined or null');
            }
            date = moment(value);
            if (!date.isValid()) {
                throw new Error('getPrevStart - date is invalid');
            }
            range = this.getRange(category);
            result = moment(date).startOf(range).add(-1, this.getOperationRange(range));
            return result.toDate();
        };
        DateTimeConvert.prototype.getNowStart = function (category) {
            var date, range, result;
            date = moment();
            if (!date.isValid()) {
                throw new Error('getNowStart - date is invalid');
            }
            range = this.getRange(category);
            result = moment(date).startOf(range);
            return result.toDate();
        };
        DateTimeConvert.prototype.addHours = function (value, hours) {
            var date;
            if (this.isUndefinedOrNull(value) || !angular.isNumber(hours)) {
                throw new Error('addHours - value is undefined or null or hours is not a number');
            }
            date = moment(value);
            if (!date.isValid()) {
                throw new Error('addHours - date is invalid');
            }
            return date.add(hours, 'hours').toDate();
        };
        DateTimeConvert.prototype.toStartDay = function (value) {
            return this.toStartRange(value, 'day');
        };
        DateTimeConvert.prototype.toEndDay = function (value, offset) {
            return this.toEndRange(value, 'day', offset);
        };
        DateTimeConvert.prototype.toStartWeek = function (value) {
            return this.toStartRange(value, 'week');
        };
        DateTimeConvert.prototype.toEndWeek = function (value, offset) {
            return this.toEndRange(value, 'week', offset);
        };
        DateTimeConvert.prototype.toStartMonth = function (value) {
            return this.toStartRange(value, 'month');
        };
        DateTimeConvert.prototype.toEndMonth = function (value, offset) {
            return this.toEndRange(value, 'month', offset);
        };
        DateTimeConvert.prototype.toStartYear = function (value) {
            return this.toStartRange(value, 'year');
        };
        DateTimeConvert.prototype.toEndYear = function (value, offset) {
            return this.toEndRange(value, 'year', offset);
        };
        return DateTimeConvert;
    }());
    var DateTimeConvertService = (function () {
        function DateTimeConvertService(datetime) {
            this._config = { timeZone: null };
            this._datetime = datetime;
        }
        DateTimeConvertService.prototype.useTimeZone = function (offset) {
            return this._datetime.useTimeZone(offset);
        };
        DateTimeConvertService.prototype.getDateJSON = function (date) {
            return this._datetime.getDateJSON(date);
        };
        DateTimeConvertService.prototype.getNextStart = function (value, category) {
            return this._datetime.getNextStart(value, category);
        };
        DateTimeConvertService.prototype.getPrevStart = function (value, category) {
            return this._datetime.getPrevStart(value, category);
        };
        DateTimeConvertService.prototype.getNowStart = function (category) {
            return this._datetime.getNowStart(category);
        };
        DateTimeConvertService.prototype.addHours = function (value, hours) {
            return this._datetime.addHours(value, hours);
        };
        DateTimeConvertService.prototype.toStartDay = function (value) {
            return this._datetime.toStartDay(value);
        };
        DateTimeConvertService.prototype.toEndDay = function (value, offset) {
            return this._datetime.toEndDay(value, offset);
        };
        DateTimeConvertService.prototype.toStartWeek = function (value) {
            return this._datetime.toStartWeek(value);
        };
        DateTimeConvertService.prototype.toEndWeek = function (value, offset) {
            return this._datetime.toEndWeek(value, offset);
        };
        DateTimeConvertService.prototype.toStartMonth = function (value) {
            return this._datetime.toStartMonth(value);
        };
        DateTimeConvertService.prototype.toEndMonth = function (value, offset) {
            return this._datetime.toEndMonth(value, offset);
        };
        DateTimeConvertService.prototype.toStartYear = function (value) {
            return this._datetime.toStartYear(value);
        };
        DateTimeConvertService.prototype.toEndYear = function (value, offset) {
            return this._datetime.toEndYear(value, offset);
        };
        return DateTimeConvertService;
    }());
    var DateConvertProvider = (function (_super) {
        __extends(DateConvertProvider, _super);
        function DateConvertProvider() {
            return _super.call(this, { timeZone: null }) || this;
        }
        DateConvertProvider.prototype.$get = function () {
            "ngInject";
            if (this._service == null)
                this._service = new DateTimeConvertService(this);
            return this._service;
        };
        return DateConvertProvider;
    }(DateTimeConvert));
    angular
        .module('pipDate.Convert', [])
        .provider('pipDateConvert', DateConvertProvider);
})();
},{}],3:[function(require,module,exports){
"use strict";
formatTimeFilter.$inject = ['pipDateFormat'];
formatDateOptionalFilter.$inject = ['pipDateFormat'];
formatLongDateFilter.$inject = ['pipDateFormat'];
formatShortDateFilter.$inject = ['pipDateFormat'];
formatMiddleDateFilter.$inject = ['pipDateFormat'];
formatMonthFilter.$inject = ['pipDateFormat'];
formatLongMonthFilter.$inject = ['pipDateFormat'];
formatYearFilter.$inject = ['pipDateFormat'];
formatWeekFilter.$inject = ['pipDateFormat'];
formatShortWeekFilter.$inject = ['pipDateFormat'];
formatShortDateTimeFilter.$inject = ['pipDateFormat'];
formatMiddleDateTimeFilter.$inject = ['pipDateFormat'];
formatLongDateTimeFilter.$inject = ['pipDateFormat'];
formatShortDateLongTimeFilter.$inject = ['pipDateFormat'];
formatMiddleDateLongTimeFilter.$inject = ['pipDateFormat'];
formatLongDateLongTimeFilter.$inject = ['pipDateFormat'];
bbFormatDateLongTimeFilter.$inject = ['pipDateFormat'];
formatFullDateTimeFilter.$inject = ['pipDateFormat'];
formatShortTimeFilter.$inject = ['pipDateFormat'];
formatLongTimeFilter.$inject = ['pipDateFormat'];
formatShortDayOfWeekFilter.$inject = ['pipDateFormat'];
formatLongDayOfWeekFilter.$inject = ['pipDateFormat'];
formatLongMonthDayFilter.$inject = ['pipDateFormat'];
formatShortMonthDayFilter.$inject = ['pipDateFormat'];
formatDateRangeFilter.$inject = ['pipDateFormat'];
formatDateTimeRangeFilter.$inject = ['pipDateFormat'];
formatISOWeekFilter.$inject = ['pipDateFormat'];
formatShortISOWeekFilter.$inject = ['pipDateFormat'];
formatISOWeekOrdinalFilter.$inject = ['pipDateFormat'];
formatDateYFilter.$inject = ['pipDateFormat'];
formatLongDateYFilter.$inject = ['pipDateFormat'];
formatTodayDateLongTimeLongFilter.$inject = ['pipDateFormat'];
formatTodayDateShortTimeLongFilter.$inject = ['pipDateFormat'];
formatTodayDateLongTimeShortFilter.$inject = ['pipDateFormat'];
formatTodayDateShortTimeShortFilter.$inject = ['pipDateFormat'];
formatMillisecondsToSecondsFilter.$inject = ['pipDateFormat'];
formatElapsedIntervalFilter.$inject = ['pipDateFormat'];
getDateJSONFilter.$inject = ['pipDateConvert'];
Object.defineProperty(exports, "__esModule", { value: true });
function formatTimeFilter(pipDateFormat) {
    "ngInject";
    return function (value, format) {
        return pipDateFormat.formatTime(value, format);
    };
}
function formatDateOptionalFilter(pipDateFormat) {
    "ngInject";
    return function (value, format) {
        return pipDateFormat.formatDateOptional(value, format);
    };
}
function formatLongDateFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatLongDate(value);
    };
}
function formatShortDateFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatShortDate(value);
    };
}
function formatMiddleDateFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatMiddleDate(value);
    };
}
function formatMonthFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatMonth(value);
    };
}
function formatLongMonthFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatLongMonth(value);
    };
}
function formatYearFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatYear(value);
    };
}
function formatWeekFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatWeek(value);
    };
}
function formatShortWeekFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatShortWeek(value);
    };
}
function formatShortDateTimeFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatShortDateTime(value);
    };
}
function formatMiddleDateTimeFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatMiddleDateTime(value);
    };
}
function formatLongDateTimeFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatLongDateTime(value);
    };
}
function formatShortDateLongTimeFilter(pipDateFormat) {
    "ngInject";
    return function (value, firstTime) {
        return pipDateFormat.formatShortDateLongTime(value, firstTime);
    };
}
function formatMiddleDateLongTimeFilter(pipDateFormat) {
    "ngInject";
    return function (value, firstTime) {
        return pipDateFormat.formatMiddleDateLongTime(value, firstTime);
    };
}
function formatLongDateLongTimeFilter(pipDateFormat) {
    "ngInject";
    return function (value, firstTime) {
        return pipDateFormat.formatLongDateLongTime(value, firstTime);
    };
}
function bbFormatDateLongTimeFilter(pipDateFormat) {
    "ngInject";
    return function (value, firstTime) {
        return pipDateFormat.bbFormatDateLongTime(value, firstTime);
    };
}
function formatFullDateTimeFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatFullDateTime(value);
    };
}
function formatShortTimeFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatShortTime(value);
    };
}
function formatLongTimeFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatLongTime(value);
    };
}
function formatShortDayOfWeekFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatShortDayOfWeek(value);
    };
}
function formatLongDayOfWeekFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatLongDayOfWeek(value);
    };
}
function formatLongMonthDayFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatLongMonthDay(value);
    };
}
function formatShortMonthDayFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatShortMonthDay(value);
    };
}
function formatDateRangeFilter(pipDateFormat) {
    "ngInject";
    return function (value1, value2) {
        return pipDateFormat.formatDateRange(value1, value2);
    };
}
function formatDateTimeRangeFilter(pipDateFormat) {
    "ngInject";
    return function (value1, value2) {
        return pipDateFormat.formatDateTimeRange(value1, value2);
    };
}
function formatISOWeekFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatISOWeek(value);
    };
}
function formatShortISOWeekFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatShortISOWeek(value);
    };
}
function formatISOWeekOrdinalFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatISOWeekOrdinal(value);
    };
}
function formatDateYFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatDateY(value);
    };
}
function formatLongDateYFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatLongDateY(value);
    };
}
function formatTodayDateLongTimeLongFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatTodayDateLongTimeLong(value);
    };
}
function formatTodayDateShortTimeLongFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatTodayDateShortTimeLong(value);
    };
}
function formatTodayDateLongTimeShortFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatTodayDateLongTimeShort(value);
    };
}
function formatTodayDateShortTimeShortFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatTodayDateShortTimeShort(value);
    };
}
function formatMillisecondsToSecondsFilter(pipDateFormat) {
    "ngInject";
    return function (value) {
        return pipDateFormat.formatMillisecondsToSeconds(value);
    };
}
function formatElapsedIntervalFilter(pipDateFormat) {
    "ngInject";
    return function (value, start) {
        return pipDateFormat.formatElapsedInterval(value, start);
    };
}
function getDateJSONFilter(pipDateConvert) {
    "ngInject";
    return function (value) {
        return pipDateConvert.getDateJSON(value);
    };
}
angular
    .module('pipDate.Filter', [])
    .filter('formatTime', formatTimeFilter)
    .filter('formatDateOptional', formatDateOptionalFilter)
    .filter('bbFormatDateLongTime', bbFormatDateLongTimeFilter)
    .filter('formatShortDate', formatShortDateFilter)
    .filter('formatMiddleDate', formatMiddleDateFilter)
    .filter('formatLongDate', formatLongDateFilter)
    .filter('formatMonth', formatMonthFilter)
    .filter('formatLongMonth', formatLongMonthFilter)
    .filter('formatYear', formatYearFilter)
    .filter('formatWeek', formatWeekFilter)
    .filter('formatShortWeek', formatShortWeekFilter)
    .filter('formatShortDateTime', formatShortDateTimeFilter)
    .filter('formatMiddleDateTime', formatMiddleDateTimeFilter)
    .filter('formatLongDateTime', formatLongDateTimeFilter)
    .filter('formatShortDateLongTime', formatShortDateLongTimeFilter)
    .filter('formatMiddleDateLongTime', formatMiddleDateLongTimeFilter)
    .filter('formatLongDateLongTime', formatLongDateLongTimeFilter)
    .filter('formatFullDateTime', formatFullDateTimeFilter)
    .filter('formatShortTime', formatShortTimeFilter)
    .filter('formatLongTime', formatLongTimeFilter)
    .filter('formatShortDayOfWeek', formatShortDayOfWeekFilter)
    .filter('formatLongDayOfWeek', formatLongDayOfWeekFilter)
    .filter('formatLongMonthDay', formatLongMonthDayFilter)
    .filter('formatShortMonthDay', formatShortMonthDayFilter)
    .filter('formatDateRange', formatDateRangeFilter)
    .filter('formatDateTimeRange', formatDateTimeRangeFilter)
    .filter('formatISOWeek', formatISOWeekFilter)
    .filter('formatShortISOWeek', formatShortISOWeekFilter)
    .filter('formatISOWeekOrdinal', formatISOWeekOrdinalFilter)
    .filter('formatDateY', formatDateYFilter)
    .filter('formatLongDateY', formatLongDateYFilter)
    .filter('formatTodayDateLongTimeLong', formatTodayDateLongTimeLongFilter)
    .filter('formatTodayDateShortTimeLong', formatTodayDateShortTimeLongFilter)
    .filter('formatTodayDateLongTimeShort', formatTodayDateLongTimeShortFilter)
    .filter('formatTodayDateShortTimeShort', formatTodayDateShortTimeShortFilter)
    .filter('formatMillisecondsToSeconds', formatMillisecondsToSecondsFilter)
    .filter('formatElapsedInterval', formatElapsedIntervalFilter);
},{}],4:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var DateFormatService = (function () {
        function DateFormatService(config) {
            this._momentRanged = new Array('year', 'month', 'week', 'isoweek', 'day');
            this._defaultFormat = 'LL';
            this._config = config || { timeZone: null };
        }
        DateFormatService.prototype.isUndefinedOrNull = function (value) {
            return angular.isUndefined(value) || value === null;
        };
        DateFormatService.prototype.formatDateTime = function (value, basicFormat) {
            var date, formatTpl;
            if (this.isUndefinedOrNull(value)) {
                return '';
            }
            if (this._config.timeZone != undefined && this._config.timeZone != null) {
                date = moment(value).utcOffset(this._config.timeZone);
            }
            else {
                date = moment(value);
            }
            if (!date.isValid()) {
                return '';
            }
            formatTpl = basicFormat ? basicFormat : this._defaultFormat;
            return date.format(formatTpl);
        };
        DateFormatService.prototype.formatDateTimeY = function (value, basicFormat) {
            var date, nowDate, formatMoment;
            if (this.isUndefinedOrNull(value)) {
                return '';
            }
            if (this._config.timeZone != undefined && this._config.timeZone != null) {
                date = moment(value).utcOffset(this._config.timeZone);
            }
            else {
                date = moment(value);
            }
            if (!date.isValid()) {
                return '';
            }
            nowDate = moment();
            formatMoment = moment.localeData().longDateFormat(basicFormat ? basicFormat : this._defaultFormat);
            if (nowDate.year() == date.year()) {
                formatMoment = formatMoment.replace(/Y/g, '').replace(/^\W|\W$|\W\W/, '');
            }
            return date.format(formatMoment);
        };
        DateFormatService.prototype.formatDay = function (value, basicFormat) {
            var date, format = moment.localeData().longDateFormat(basicFormat ? basicFormat : this._defaultFormat), formatMonthYearless = format.replace(/Y/g, '').replace(/^\W|\W$|\W\W/, '').replace(/M/g, '');
            if (this.isUndefinedOrNull(value)) {
                return '';
            }
            if (this._config.timeZone != undefined && this._config.timeZone != null) {
                date = moment(value).utcOffset(this._config.timeZone);
            }
            else {
                date = moment(value);
            }
            if (!date.isValid()) {
                return '';
            }
            return date.format(formatMonthYearless);
        };
        DateFormatService.prototype.formatMonthDay = function (value, basicFormat) {
            var date, format = basicFormat ? basicFormat : this._defaultFormat, formatLL = moment.localeData().longDateFormat(format), formatYearlessLL = formatLL.replace(/Y/g, '').replace(/^\W|\W$|\W\W/, '');
            if (this.isUndefinedOrNull(value)) {
                return '';
            }
            if (this._config.timeZone != undefined && this._config.timeZone != null) {
                date = moment(value).utcOffset(this._config.timeZone);
            }
            else {
                date = moment(value);
            }
            if (!date.isValid()) {
                return '';
            }
            return date.format(formatYearlessLL);
        };
        DateFormatService.prototype.formatRange = function (value1, value2, basicFormat) {
            var dateStart, dateEnd, format = basicFormat ? basicFormat : this._defaultFormat;
            if (this.isUndefinedOrNull(value1)) {
                dateStart = null;
            }
            else {
                dateStart = (this._config.timeZone != undefined && this._config.timeZone != null) ? moment(value1).utcOffset(this._config.timeZone) : moment(value1);
            }
            if (this.isUndefinedOrNull(value2)) {
                dateEnd = null;
            }
            else {
                dateEnd = (this._config.timeZone != undefined && this._config.timeZone != null) ? moment(value2).utcOffset(this._config.timeZone) : moment(value2);
            }
            if (dateStart === null && dateEnd === null)
                return '';
            if (dateStart === null) {
                return dateEnd.format(basicFormat);
            }
            if (dateEnd === null || dateStart.isSame(dateEnd)) {
                return dateStart.format(basicFormat);
                ;
            }
            if (dateStart.isAfter(dateEnd)) {
                throw new Error('Date range error. Start date is more than end date.');
            }
            if (dateStart.year() == dateEnd.year()) {
                if (dateStart.month() == dateEnd.month()) {
                    return this.formatDay(dateStart, basicFormat) + '-' + dateEnd.format(basicFormat);
                }
                return this.formatMonthDay(dateStart, basicFormat) + '-' + dateEnd.format(basicFormat);
            }
            return dateStart.format(basicFormat) + '-' + dateEnd.format(basicFormat);
        };
        DateFormatService.prototype.toDateWithTime = function (value, formatDate, formatTime, firstTime) {
            var date, result, nowDate;
            if (this.isUndefinedOrNull(value)) {
                return '';
            }
            if (this._config.timeZone != undefined && this._config.timeZone != null) {
                date = moment(value).utcOffset(this._config.timeZone);
            }
            else {
                date = moment(value);
            }
            if (!date.isValid()) {
                return '';
            }
            nowDate = moment();
            if (firstTime) {
                result = date.format(formatTime) + ' ' + date.format(formatDate);
            }
            else {
                result = date.format(formatDate) + ' ' + date.format(formatTime);
            }
            return result;
        };
        DateFormatService.prototype.toTodayDate = function (value, formatDate, formatTime) {
            var date, result, nowDate;
            if (this.isUndefinedOrNull(value)) {
                return '';
            }
            if (this._config.timeZone != undefined && this._config.timeZone != null) {
                date = moment(value).utcOffset(this._config.timeZone);
            }
            else {
                date = moment(value);
            }
            if (!date.isValid()) {
                return '';
            }
            nowDate = moment();
            if (nowDate.year() == date.year() && nowDate.month() == date.month() && nowDate.day() == date.day()) {
                result = date.format(formatTime);
            }
            else {
                result = date.format(formatDate) + ' ' + date.format(formatTime);
            }
            return result;
        };
        ;
        Object.defineProperty(DateFormatService.prototype, "config", {
            get: function () {
                return this._config;
            },
            enumerable: true,
            configurable: true
        });
        DateFormatService.prototype.useTimeZone = function (offset) {
            this._config.timeZone = offset;
        };
        DateFormatService.prototype.formatTime = function (value, format) {
            return this.formatDateTime(value, 'LLL');
        };
        DateFormatService.prototype.formatDateOptional = function (value, format) {
            return this.formatDateTime(value, 'L');
        };
        DateFormatService.prototype.formatShortDate = function (value) {
            return this.formatDateTime(value, 'L');
        };
        DateFormatService.prototype.bbFormatDateLongTime = function (value, firstTime) {
            return this.toDateWithTime(value, 'MM/DD/YY', 'LTS', firstTime);
        };
        DateFormatService.prototype.formatMiddleDate = function (value) {
            return this.formatDateTime(value, 'll');
        };
        DateFormatService.prototype.formatLongDate = function (value) {
            return this.formatDateTime(value, 'LL');
        };
        DateFormatService.prototype.formatMonth = function (value) {
            return this.formatDateTime(value, 'MM');
        };
        DateFormatService.prototype.formatLongMonth = function (value) {
            return this.formatDateTime(value, 'MMMM');
        };
        DateFormatService.prototype.formatYear = function (value) {
            return this.formatDateTime(value, 'YYYY');
        };
        DateFormatService.prototype.formatWeek = function (value) {
            return this.formatDateTime(value, 'ww');
        };
        DateFormatService.prototype.formatShortWeek = function (value) {
            return this.formatDateTime(value, 'w');
        };
        DateFormatService.prototype.formatShortDateTime = function (value) {
            return this.toDateWithTime(value, 'L', 'LT');
        };
        DateFormatService.prototype.formatMiddleDateTime = function (value) {
            return this.formatDateTime(value, 'lll');
        };
        DateFormatService.prototype.formatLongDateTime = function (value) {
            return this.formatDateTime(value, 'LLL');
        };
        DateFormatService.prototype.formatFullDateTime = function (value) {
            return this.formatDateTime(value, 'LLLL');
        };
        DateFormatService.prototype.formatShortDateLongTime = function (value, firstTime) {
            return this.toDateWithTime(value, 'L', 'LTS', firstTime);
        };
        DateFormatService.prototype.formatMiddleDateLongTime = function (value, firstTime) {
            return this.toDateWithTime(value, 'll', 'LTS', firstTime);
        };
        DateFormatService.prototype.formatLongDateLongTime = function (value, firstTime) {
            return this.toDateWithTime(value, 'LL', 'LTS', firstTime);
        };
        DateFormatService.prototype.formatShortTime = function (value) {
            return this.formatDateTime(value, 'LT');
        };
        DateFormatService.prototype.formatLongTime = function (value) {
            return this.formatDateTime(value, 'LTS');
        };
        DateFormatService.prototype.formatShortDayOfWeek = function (value) {
            return this.formatDateTime(value, 'dd');
        };
        DateFormatService.prototype.formatLongDayOfWeek = function (value) {
            return this.formatDateTime(value, 'dddd');
        };
        DateFormatService.prototype.formatLongMonthDay = function (value) {
            return this.formatMonthDay(value, 'LL');
        };
        DateFormatService.prototype.formatShortMonthDay = function (value) {
            return this.formatMonthDay(value, 'L');
        };
        DateFormatService.prototype.formatDateRange = function (value1, value2) {
            return this.formatRange(value1, value2, 'LL');
        };
        DateFormatService.prototype.formatDateTimeRange = function (value1, value2) {
            return this.formatRange(value1, value2, 'LLL');
        };
        DateFormatService.prototype.formatISOWeek = function (value) {
            return this.formatDateTime(value, 'WW');
        };
        DateFormatService.prototype.formatShortISOWeek = function (value) {
            return this.formatDateTime(value, 'W');
        };
        DateFormatService.prototype.formatISOWeekOrdinal = function (value) {
            return this.formatDateTime(value, 'Wo');
        };
        DateFormatService.prototype.formatDateY = function (value) {
            return this.formatDateTimeY(value, 'L');
        };
        DateFormatService.prototype.formatLongDateY = function (value) {
            return this.formatDateTimeY(value, 'LL');
        };
        DateFormatService.prototype.formatTodayDateLongTimeLong = function (value) {
            return this.toTodayDate(value, 'LL', 'LTS');
        };
        DateFormatService.prototype.formatTodayDateShortTimeLong = function (value) {
            return this.toTodayDate(value, 'LL', 'LTS');
        };
        DateFormatService.prototype.formatTodayDateLongTimeShort = function (value) {
            return this.toTodayDate(value, 'LL', 'LT');
        };
        DateFormatService.prototype.formatTodayDateShortTimeShort = function (value) {
            return this.toTodayDate(value, 'll', 'LT');
        };
        DateFormatService.prototype.formatMillisecondsToSeconds = function (value) {
            return '';
        };
        DateFormatService.prototype.formatElapsedInterval = function (value, start) {
            var date, nowDate;
            if (this.isUndefinedOrNull(value)) {
                return '';
            }
            if (this.isUndefinedOrNull(start)) {
                nowDate = moment();
            }
            else {
                nowDate = moment(start);
            }
            date = moment(value);
            if (!date.isValid() || !nowDate.isValid()) {
                return '';
            }
            return moment(date).fromNow(nowDate);
        };
        DateFormatService.prototype.getDateJSON = function (date) {
            return JSON.stringify(moment(date));
        };
        return DateFormatService;
    }());
    var DateTimeFormatService = (function () {
        function DateTimeFormatService(datetime) {
            this._config = { timeZone: null };
            this._datetime = datetime;
        }
        DateTimeFormatService.prototype.useTimeZone = function (offset) {
            return this._datetime.useTimeZone(offset);
        };
        DateTimeFormatService.prototype.formatTime = function (value, format) {
            return this._datetime.formatTime(value, format);
        };
        DateTimeFormatService.prototype.formatDateOptional = function (value, format) {
            return this._datetime.formatDateOptional(value, format);
        };
        DateTimeFormatService.prototype.formatShortDate = function (value) {
            return this._datetime.formatShortDate(value);
        };
        DateTimeFormatService.prototype.formatMiddleDate = function (value) {
            return this._datetime.formatMiddleDate(value);
        };
        DateTimeFormatService.prototype.formatLongDate = function (value) {
            return this._datetime.formatLongDate(value);
        };
        DateTimeFormatService.prototype.formatMonth = function (value) {
            return this._datetime.formatMonth(value);
        };
        DateTimeFormatService.prototype.formatLongMonth = function (value) {
            return this._datetime.formatLongMonth(value);
        };
        DateTimeFormatService.prototype.formatYear = function (value) {
            return this._datetime.formatYear(value);
        };
        DateTimeFormatService.prototype.formatWeek = function (value) {
            return this._datetime.formatWeek(value);
        };
        DateTimeFormatService.prototype.formatShortWeek = function (value) {
            return this._datetime.formatShortWeek(value);
        };
        DateTimeFormatService.prototype.formatShortDateTime = function (value) {
            return this._datetime.formatShortDateTime(value);
        };
        DateTimeFormatService.prototype.formatMiddleDateTime = function (value) {
            return this._datetime.formatMiddleDateTime(value);
        };
        DateTimeFormatService.prototype.formatLongDateTime = function (value) {
            return this._datetime.formatLongDateTime(value);
        };
        DateTimeFormatService.prototype.formatFullDateTime = function (value) {
            return this._datetime.formatFullDateTime(value);
        };
        DateTimeFormatService.prototype.formatShortDateLongTime = function (value, firstTime) {
            return this._datetime.formatShortDateLongTime(value, firstTime);
        };
        DateTimeFormatService.prototype.formatMiddleDateLongTime = function (value, firstTime) {
            return this._datetime.formatMiddleDateLongTime(value, firstTime);
        };
        DateTimeFormatService.prototype.formatLongDateLongTime = function (value, firstTime) {
            return this._datetime.formatLongDateLongTime(value, firstTime);
        };
        DateTimeFormatService.prototype.bbFormatDateLongTime = function (value, firstTime) {
            return this._datetime.bbFormatDateLongTime(value, firstTime);
        };
        DateTimeFormatService.prototype.formatShortTime = function (value) {
            return this._datetime.formatShortTime(value);
        };
        DateTimeFormatService.prototype.formatLongTime = function (value) {
            return this._datetime.formatLongTime(value);
        };
        DateTimeFormatService.prototype.formatShortDayOfWeek = function (value) {
            return this._datetime.formatShortDayOfWeek(value);
        };
        DateTimeFormatService.prototype.formatLongDayOfWeek = function (value) {
            return this._datetime.formatLongDayOfWeek(value);
        };
        DateTimeFormatService.prototype.formatLongMonthDay = function (value) {
            return this._datetime.formatLongMonthDay(value);
        };
        DateTimeFormatService.prototype.formatShortMonthDay = function (value) {
            return this._datetime.formatShortMonthDay(value);
        };
        DateTimeFormatService.prototype.formatDateRange = function (value1, value2) {
            return this._datetime.formatDateRange(value1, value2);
        };
        DateTimeFormatService.prototype.formatDateTimeRange = function (value1, value2) {
            return this._datetime.formatDateTimeRange(value1, value2);
        };
        DateTimeFormatService.prototype.formatISOWeek = function (value) {
            return this._datetime.formatISOWeek(value);
        };
        DateTimeFormatService.prototype.formatShortISOWeek = function (value) {
            return this._datetime.formatShortISOWeek(value);
        };
        DateTimeFormatService.prototype.formatISOWeekOrdinal = function (value) {
            return this._datetime.formatISOWeekOrdinal(value);
        };
        DateTimeFormatService.prototype.formatDateY = function (value) {
            return this._datetime.formatDateY(value);
        };
        DateTimeFormatService.prototype.formatLongDateY = function (value) {
            return this._datetime.formatLongDateY(value);
        };
        DateTimeFormatService.prototype.formatTodayDateLongTimeLong = function (value) {
            return this._datetime.formatTodayDateLongTimeLong(value);
        };
        DateTimeFormatService.prototype.formatTodayDateShortTimeLong = function (value) {
            return this._datetime.formatTodayDateShortTimeLong(value);
        };
        DateTimeFormatService.prototype.formatTodayDateLongTimeShort = function (value) {
            return this._datetime.formatTodayDateLongTimeShort(value);
        };
        DateTimeFormatService.prototype.formatTodayDateShortTimeShort = function (value) {
            return this._datetime.formatTodayDateShortTimeShort(value);
        };
        DateTimeFormatService.prototype.formatMillisecondsToSeconds = function (value) {
            return this._datetime.formatMillisecondsToSeconds(value);
        };
        DateTimeFormatService.prototype.formatElapsedInterval = function (value, start) {
            return this._datetime.formatElapsedInterval(value, start);
        };
        DateTimeFormatService.prototype.getDateJSON = function (date) {
            return this._datetime.getDateJSON(date);
        };
        return DateTimeFormatService;
    }());
    var DateFormatProvider = (function (_super) {
        __extends(DateFormatProvider, _super);
        function DateFormatProvider() {
            return _super.call(this, { timeZone: null }) || this;
        }
        DateFormatProvider.prototype.$get = function () {
            "ngInject";
            if (this._service == null)
                this._service = new DateTimeFormatService(this);
            return this._service;
        };
        return DateFormatProvider;
    }(DateFormatService));
    angular
        .module('pipDate.Format', [])
        .provider('pipDateFormat', DateFormatProvider);
})();
},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DateTimeConfig = (function () {
    function DateTimeConfig() {
    }
    return DateTimeConfig;
}());
exports.DateTimeConfig = DateTimeConfig;
},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DateTimeConfig = (function () {
    function DateTimeConfig() {
    }
    return DateTimeConfig;
}());
exports.DateTimeConfig = DateTimeConfig;
},{}],7:[function(require,module,exports){
angular.module('pipDate.Common', [
    'pipDate.Convert',
    'pipDate.Format',
    'pipDate.Filter'
]);
},{}],8:[function(require,module,exports){
(function () {
    var DateRangeBindings = {
        timeMode: '@pipTimeMode',
        disabled: '&ngDisabled',
        model: '=ngModel',
        pipChanged: '&',
        type: '@pipDateRangeType',
        pipDateFormat: '@',
        pipNoLine: '@'
    };
    var DateRangeChanges = (function () {
        function DateRangeChanges() {
        }
        return DateRangeChanges;
    }());
    var DateRangeController = (function () {
        function DateRangeController($mdMedia, $timeout, $scope, $element, $rootScope, $injector) {
            var _this = this;
            this.$mdMedia = $mdMedia;
            this.$timeout = $timeout;
            this.prevState = {};
            this.currentState = {};
            this.localeDate = moment.localeData();
            this.momentMonths = angular.isArray(this.localeDate._months) ? this.localeDate._months : this.localeDate._months.standalone;
            this.momentDays = angular.isArray(this.localeDate._weekdays) ? this.localeDate._weekdays : this.localeDate._weekdays.format;
            this.momentShortDays = this.localeDate._weekdaysMin;
            this.momentFirstDayOfWeek = this.localeDate._week.dow;
            this.currentDate = new Date();
            this.currentYear = this.currentDate.getUTCFullYear();
            this.currentMonth = this.currentDate.getUTCMonth() + 1;
            this.currentDay = this.currentDate.getUTCDate();
            this.init();
            this.disableControls = this.disabled ? this.disabled() : false;
            $scope.$watch('$ctrl.type', function (newValue, oldValue) {
                if (newValue !== oldValue && oldValue) {
                    _this.init();
                }
            });
        }
        DateRangeController.prototype.$onChanges = function (changes) {
            if (changes.type && changes.type.currentValue) {
                this.type = changes.type.currentValue;
                this.init();
            }
        };
        DateRangeController.prototype.onMonthChanged = function () {
            if (this.type === 'weekly') {
                var date = void 0, dayOfWeek = void 0;
                date = new Date(Date.UTC(this.year, this.month - 1, 1));
                dayOfWeek = date.getUTCDay() ? date.getUTCDay() : 7;
                this.week = this.getWeekByDate(dayOfWeek, this.month - 1, this.year);
                this.correctWeek();
                this.adjustWeek();
            }
            else {
                this.adjustDay();
            }
            this.setValue();
        };
        DateRangeController.prototype.onYearChanged = function () {
            var date, dayOfWeek;
            date = new Date(Date.UTC(this.year, this.month - 1, 1));
            dayOfWeek = date.getUTCDay() ? date.getUTCDay() : 7;
            if (this.type === 'weekly') {
                this.week = this.getWeekByDate(dayOfWeek, this.month - 1, this.year);
                this.adjustWeek();
                this.correctWeek();
            }
            else {
                this.adjustDay();
            }
            this.setValue();
        };
        ;
        DateRangeController.prototype.onWeekChange = function () {
            if (this.type === 'weekly') {
                this.adjustWeek();
                this.correctWeek();
            }
            else {
                this.adjustDay();
            }
            this.setValue();
        };
        ;
        DateRangeController.prototype.isDay = function () {
            return this.type === 'daily';
        };
        ;
        DateRangeController.prototype.isWeek = function () {
            return this.type === 'weekly';
        };
        ;
        DateRangeController.prototype.isMonth = function () {
            return this.type === 'daily' ||
                this.type === 'weekly' ||
                this.type === 'monthly';
        };
        ;
        DateRangeController.prototype.onChange = function () {
            var _this = this;
            if (this.pipChanged) {
                this.$timeout(function () {
                    _this.pipChanged();
                }, 0);
            }
        };
        ;
        DateRangeController.prototype.setCurrent = function () {
            this.currentState.day = this.day;
            this.currentState.month = this.month;
            this.currentState.year = this.year;
            this.currentState.week = this.week;
            this.currentState.dateRangeType = this.type;
            this.currentState.model = this.model;
        };
        DateRangeController.prototype.fillLists = function () {
            this.days = this.dayList(this.month, this.year);
            this.weeks = this.weekList(this.month, this.year);
            this.months = this.monthList();
            this.shortMonths = this.monthList();
            this.years = this.yearList();
        };
        DateRangeController.prototype.correctWeek = function () {
            if (!this.prevState.model || this.prevState.model && this.prevState.model.getTime() >= this.model.getTime()) {
                if (this.weeks && this.weeks[this.week] && this.weeks[this.week].id <= 0) {
                    if (this.month < 12) {
                        this.month += 1;
                    }
                    else {
                        this.month = 1;
                        this.year += 1;
                    }
                    this.fillLists();
                }
            }
        };
        DateRangeController.prototype.init = function () {
            var value;
            value = this.model ? new Date(this.model) : null;
            this.day = value ? value.getUTCDate() : null;
            this.month = value ? value.getUTCMonth() + 1 : null;
            this.year = value ? value.getUTCFullYear() : null;
            this.week = value ? this.getWeekByDate(this.day, this.month - 1, this.year) : null;
            this.fillLists();
            if (this.type === 'weekly') {
                this.correctWeek();
            }
            this.adjustWeek();
            this.setValue();
        };
        DateRangeController.prototype.onYearClick = function () {
            if (!this.year) {
                this.year = this.currentYear;
            }
        };
        ;
        DateRangeController.prototype.onMonthClick = function () {
            if (!this.month) {
                this.month = this.currentMonth;
            }
        };
        ;
        DateRangeController.prototype.onDayClick = function () {
            if (!this.year) {
                this.day = this.currentDay;
            }
        };
        ;
        DateRangeController.prototype.getCountDay = function (month, year) {
            var count = 31;
            if (month === 4 || month === 6 || month === 9 || month === 11) {
                count = 30;
                return count;
            }
            if (month === 2) {
                if (year) {
                    count = year % 4 === 0 ? 29 : 28;
                    return count;
                }
                count = 28;
            }
            return count;
        };
        DateRangeController.prototype.dayList = function (month, year) {
            var count, days;
            count = this.getCountDay(month, year);
            this.nameDays = [];
            days = [];
            for (var i = 1; i <= count; i++) {
                days.push(i);
                this.nameDays.push(this.momentShortDays[moment([year, month - 1, i]).weekday()]);
            }
            return days;
        };
        DateRangeController.prototype.getWeekByDate = function (day, month, year) {
            var date, dayOfWeek, startWeek;
            date = new Date(Date.UTC(year, month, day));
            dayOfWeek = date.getUTCDay() ? date.getUTCDay() : 7;
            if (dayOfWeek === 1) {
                startWeek = day;
            }
            else {
                startWeek = day + 1 - dayOfWeek;
            }
            return startWeek;
        };
        DateRangeController.prototype.getWeek = function (day, countDay, countPrevMonthDay) {
            var endDay, startDay;
            endDay = day + 6 > countDay ? countDay - day - 6 : day + 6;
            startDay = day > 0 ? day : countPrevMonthDay + day;
            return startDay.toString() + ' - ' + (Math.abs(endDay)).toString();
        };
        DateRangeController.prototype.weekList = function (month, year) {
            var weeks, countDay, countPrevMonthDay, startWeek;
            weeks = [];
            countDay = this.getCountDay(month, year);
            startWeek = this.getWeekByDate(1, month - 1, year);
            countPrevMonthDay = month - 1 ? this.getCountDay(month - 1, year) : this.getCountDay(12, year - 1);
            while (startWeek < countDay + 1) {
                weeks.push({
                    id: startWeek,
                    name: this.getWeek(startWeek, countDay, countPrevMonthDay)
                });
                startWeek = startWeek + 7;
            }
            return weeks;
        };
        DateRangeController.prototype.monthList = function () {
            var months = [];
            for (var i = 1; i <= 12; i++) {
                months.push({
                    id: i,
                    name: this.momentMonths[i - 1]
                });
            }
            return months;
        };
        DateRangeController.prototype.yearList = function () {
            var startYear, endYear, years = [];
            switch (this.timeMode) {
                case 'future':
                    startYear = this.currentYear;
                    endYear = this.currentYear + 100;
                    break;
                case 'past':
                    startYear = this.currentYear - 100;
                    endYear = this.currentYear;
                    break;
                case 'now':
                    startYear = this.currentYear - 50;
                    endYear = this.currentYear + 100;
                    break;
                default:
                    startYear = this.currentYear - 50;
                    endYear = this.currentYear + 50;
                    break;
            }
            if (this.timeMode === 'future') {
                for (var i = startYear; i <= endYear; i++) {
                    years.push(i);
                }
            }
            else {
                for (var i = endYear; i >= startYear; i--) {
                    years.push(i);
                }
            }
            return years;
        };
        DateRangeController.prototype.adjustDay = function () {
            var days = this.dayList(this.month, this.year);
            switch (this.type) {
                case 'monthly':
                    this.day = 1;
                    break;
                case 'yearly':
                    this.month = 1;
                    this.day = 1;
                    break;
                default:
                    if (this.days.length !== days.length) {
                        if (this.day > days.length) {
                            this.day = days.length;
                        }
                    }
                    break;
            }
            this.days = days;
        };
        DateRangeController.prototype.adjustWeek = function () {
            var weeks = this.weekList(this.month, this.year);
            this.week = this.getWeekByDate(this.week, this.month - 1, this.year);
            this.weeks = weeks;
        };
        DateRangeController.prototype.getValue = function (v) {
            var value, day, month, year, week;
            value = v ? new Date(v) : null;
            day = value ? value.getUTCDate() : null;
            month = value ? value.getUTCMonth() + 1 : null;
            year = value ? value.getUTCFullYear() : null;
            week = value ? this.getWeekByDate(day, month - 1, year) : null;
            if (this.day === day && this.month === month && this.year === year && this.week === week) {
                return;
            }
            this.day = day;
            this.month = month;
            this.year = year;
            this.week = week;
            this.days = this.dayList(this.month, this.year);
            this.weeks = this.weekList(this.month, this.year);
        };
        DateRangeController.prototype.setValue = function () {
            var value;
            if (this.type === 'weekly') {
                value = new Date(this.year, this.month - 1, this.week, 0, 0, 0, 0);
                value = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
                this.model = value;
            }
            else {
                value = new Date(this.year, this.month - 1, this.day, 0, 0, 0, 0);
                value = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
                this.model = value;
            }
            this.prevState = _.cloneDeep(this.currentState);
            this.setCurrent();
            this.onChange();
        };
        return DateRangeController;
    }());
    var daterange = {
        bindings: DateRangeBindings,
        templateUrl: 'date_range/DateRange.html',
        controller: DateRangeController
    };
    angular
        .module('pipDateRange', ['pipDates.Templates'])
        .component('pipDateRange', daterange);
})();
},{}],9:[function(require,module,exports){
{
    translateFilter.$inject = ['$injector'];
    function translateFilter($injector) {
        var pipTranslate = $injector.has('pipTranslate')
            ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate.translate(key) || key : key;
        };
    }
    angular
        .module('pipDates.Translate', [])
        .filter('translate', translateFilter);
}
},{}],10:[function(require,module,exports){
angular.module('pipDates', [
    'pipDate',
    'pipDate.Common',
    'pipTimeRange',
    'pipTimeRangeEdit',
    'pipDateRange',
    'pipDates.Translate'
]);
},{}],11:[function(require,module,exports){
(function () {
    var TimeRangeData = (function () {
        function TimeRangeData() {
        }
        return TimeRangeData;
    }());
    var TimeRangeBindings = {
        start: '<pipStartDate',
        end: '<pipEndDate'
    };
    var TimeRangeChanges = (function () {
        function TimeRangeChanges() {
        }
        return TimeRangeChanges;
    }());
    var TimeRangeController = (function () {
        function TimeRangeController($scope, $attrs, $element) {
            this.data = new TimeRangeData();
            this.defineStartDate();
            this.defineEndDate();
            $element.addClass('pip-time-range');
        }
        TimeRangeController.prototype.$onChanges = function (changes) {
            if (changes.start && changes.start.currentValue) {
                this.data.start = null;
                this.defineStartDate();
            }
            if (changes.end && changes.end.currentValue) {
                this.data.end = null;
                this.defineEndDate();
            }
        };
        TimeRangeController.prototype.getDateJSON = function (value) {
            return value ? new Date(value) : null;
        };
        TimeRangeController.prototype.defineStartDate = function () {
            if (this.start !== null && this.start !== undefined) {
                this.data.start = _.isDate(this.start) ? this.start
                    : this.getDateJSON(this.start);
            }
        };
        TimeRangeController.prototype.defineEndDate = function () {
            if (this.end !== null && this.end !== undefined) {
                this.data.end = _.isDate(this.end) ? this.end
                    : this.getDateJSON(this.end);
            }
        };
        TimeRangeController.prototype.toBoolean = function (value) {
            if (value == null)
                return false;
            if (!value)
                return false;
            value = value.toString().toLowerCase();
            return value == '1' || value == 'true';
        };
        return TimeRangeController;
    }());
    var TimeRangeComponent = {
        bindings: TimeRangeBindings,
        templateUrl: 'time_range/TimeRange.html',
        controller: TimeRangeController
    };
    angular.module('pipTimeRange', [])
        .component('pipTimeRange', TimeRangeComponent);
})();
},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntervalTimeRange = 30;
exports.MinutesInHour = 60;
exports.HoursInDay = 24;
exports.MillisecondsInSecond = 1000;
{
    var TimeRangeEditData_1 = (function () {
        function TimeRangeEditData_1() {
            this.bind = false;
        }
        return TimeRangeEditData_1;
    }());
    var TimeRangeEditBindings = {
        pipStartDate: '<',
        pipChanged: '=',
        pipEndDate: '<',
        pipStartLabel: '@',
        pipEndLabel: '@',
        disabled: '&ngDisabled',
        pipHideTime: '=',
        pipSize: '='
    };
    var TimeRangeEditChanges = (function () {
        function TimeRangeEditChanges() {
        }
        return TimeRangeEditChanges;
    }());
    var TimeRangeEditController = (function () {
        function TimeRangeEditController($injector, pipDateConvert, $scope, $element) {
            this.$injector = $injector;
            this.pipDateConvert = pipDateConvert;
            this.$scope = $scope;
            this.startLabel = 'Start time';
            this.endLabel = 'End time';
            this.translate();
            this.intervalTimeCollection = this.getTimeInterval();
            this.data = new TimeRangeEditData_1();
            this.initDate();
            this.defineDate();
            $element.addClass('pip-time-range-edit');
        }
        TimeRangeEditController.prototype.$onChanges = function (changes) {
            if (changes.pipStartDate && changes.pipStartDate.currentValue) {
                this.pipStartDate = changes.pipStartDate.currentValue;
                this.initDate();
                this.defineDate();
            }
            if (changes.pipEndDate && changes.pipEndDate.currentValue) {
                this.pipEndDate = changes.pipEndDate.currentValue;
                this.initDate();
                this.defineDate();
            }
        };
        TimeRangeEditController.prototype.translate = function () {
            var pipTranslate = this.$injector.has('pipTranslate') ? this.$injector.get('pipTranslate') : null;
            if (pipTranslate) {
                pipTranslate.setTranslations('en', {
                    EVENT_NEW_START_TIME: 'Start time',
                    EVENT_NEW_END_TIME: 'End time'
                });
                pipTranslate.setTranslations('ru', {
                    EVENT_NEW_START_TIME: 'Начало',
                    EVENT_NEW_END_TIME: 'Конец'
                });
                this.startLabel = this.pipStartLabel ? pipTranslate.translate(this.pipStartLabel)
                    : pipTranslate.translate('EVENT_NEW_START_TIME');
                this.endLabel = this.pipEndLabel ? pipTranslate.translate(this.pipEndLabel)
                    : pipTranslate.translate('EVENT_NEW_END_TIME');
            }
        };
        TimeRangeEditController.prototype.getDateJSON = function (value) {
            return value ? new Date(value) : null;
        };
        TimeRangeEditController.prototype.setDuration = function () {
            var start, end;
            if (!this.data.startDate || !this.data.endDate) {
                return null;
            }
            start = new Date(this.data.startDate.getTime() + this.data.startTime * exports.MinutesInHour * exports.MillisecondsInSecond);
            end = new Date(this.data.endDate.getTime() + this.data.endTime * exports.MinutesInHour * exports.MillisecondsInSecond);
            return end - start;
        };
        TimeRangeEditController.prototype.validateStartDate = function () {
            var date, start, end, endTime, startTime;
            if (!this.data.startDate) {
                this.data.startTime = null;
                return;
            }
            if (_.isUndefined(this.data.startTime) || _.isNull(this.data.startTime)) {
                if (!this.data.endTime) {
                    start = new Date();
                    startTime = date.getTime() - this.pipDateConvert.toStartDay(date);
                    this.data.startTime = Math.floor(startTime / (exports.IntervalTimeRange * exports.MinutesInHour * exports.MillisecondsInSecond)) * exports.IntervalTimeRange;
                }
                else {
                    this.data.startTime = this.data.endTime === 0 ? 0 : this.data.endTime - exports.IntervalTimeRange;
                }
            }
            start = new Date(this.data.startDate.getTime() + this.data.startTime * exports.MinutesInHour * exports.MillisecondsInSecond);
            if (this.data.duration) {
                end = new Date(start.getTime() + this.data.duration);
                this.data.endDate = this.pipDateConvert.toStartDay(end);
                endTime = end.getTime() - this.data.endDate.getTime();
                this.data.endTime = Math.floor(endTime / (exports.IntervalTimeRange * exports.MinutesInHour * exports.MillisecondsInSecond)) * exports.IntervalTimeRange;
            }
            else {
                end = new Date(this.data.endDate.getTime() + this.data.endTime * exports.MinutesInHour * exports.MillisecondsInSecond);
                if (start >= end) {
                    this.data.endDate = this.pipDateConvert.toStartDay(new Date(start.getTime() + (exports.IntervalTimeRange * exports.MinutesInHour * exports.MillisecondsInSecond)));
                    this.data.endTime = (this.data.startTime + exports.IntervalTimeRange) % (exports.HoursInDay * exports.MinutesInHour);
                }
            }
            this.data.startTime = Math.round(this.data.startTime / exports.IntervalTimeRange) * exports.IntervalTimeRange;
        };
        TimeRangeEditController.prototype.validateEndDate = function () {
            var date, start, end;
            if (!this.data.endDate) {
                this.data.endTime = null;
                return;
            }
            if (_.isUndefined(this.data.endTime) || _.isNull(this.data.endTime)) {
                if (!this.data.startTime) {
                    date = new Date();
                    date = date.getTime() - this.pipDateConvert.toStartDay(date);
                    this.data.endTime = Math.floor(date / (exports.IntervalTimeRange * exports.MinutesInHour * exports.MillisecondsInSecond)) * exports.IntervalTimeRange;
                }
                else {
                    this.data.endTime = this.data.startTime === (exports.HoursInDay * exports.MinutesInHour - exports.IntervalTimeRange) ? (exports.HoursInDay * exports.MinutesInHour - exports.IntervalTimeRange) : this.data.startTime + exports.IntervalTimeRange;
                }
            }
            start = new Date(this.data.startDate.getTime() + this.data.startTime * exports.MinutesInHour * exports.MillisecondsInSecond);
            end = new Date(this.data.endDate.getTime() + this.data.endTime * exports.MinutesInHour * exports.MillisecondsInSecond);
            if (start >= end) {
                this.data.startDate = this.pipDateConvert.toStartDay(new Date(end.getTime() - exports.IntervalTimeRange * exports.MinutesInHour * exports.MillisecondsInSecond));
                this.data.startTime = this.data.endTime % (exports.HoursInDay * exports.MinutesInHour) === 0 ? (exports.HoursInDay * exports.MinutesInHour - exports.IntervalTimeRange) : this.data.endTime - exports.IntervalTimeRange;
            }
            this.data.endTime = Math.round(this.data.endTime / exports.IntervalTimeRange) * exports.IntervalTimeRange;
            this.data.duration = this.setDuration();
        };
        TimeRangeEditController.prototype.setDate = function () {
            var time;
            if (!this.data)
                this.data = new TimeRangeEditData_1();
            this.data.bind = false;
            if (this.data.startDate) {
                time = this.data.startTime ? this.data.startTime * exports.MinutesInHour * exports.MillisecondsInSecond : 0;
                this.pipStartDate = new Date(this.data.startDate.getTime() + time);
            }
            if (this.data.endDate) {
                time = this.data.endTime ? this.data.endTime * exports.MinutesInHour * exports.MillisecondsInSecond : 0;
                this.pipEndDate = new Date(this.data.endDate.getTime() + time);
            }
            this.data.bind = true;
        };
        TimeRangeEditController.prototype.defineDate = function () {
            var start, end;
            if (this.pipStartDate !== null && this.pipStartDate !== undefined) {
                start = _.isDate(this.pipStartDate) ? this.pipStartDate : null;
                if (!start) {
                    start = this.getDateJSON(this.pipStartDate);
                }
                this.data.startDate = this.pipDateConvert.toStartDay(start);
                this.data.startTime = (new Date(start) - this.data.startDate) / (exports.MinutesInHour * exports.MillisecondsInSecond);
            }
            if (this.pipEndDate !== null && this.pipEndDate !== undefined) {
                end = _.isDate(this.pipEndDate) ? this.pipEndDate : null;
                if (!start) {
                    end = this.getDateJSON(this.pipEndDate);
                }
                this.data.endDate = this.pipDateConvert.toStartDay(end);
                this.data.endTime = (new Date(end) - this.data.endDate) / (exports.MinutesInHour * exports.MillisecondsInSecond);
            }
            this.validateStartDate();
            this.validateEndDate();
            this.data.duration = this.setDuration();
            this.setDate();
        };
        TimeRangeEditController.prototype.getTimeInterval = function () {
            var result, minutes;
            result = [];
            for (var i = 0; i < 24; i++) {
                for (var j = 0; j < 2; j++) {
                    minutes = j * exports.IntervalTimeRange;
                    result.push({
                        id: i * exports.MinutesInHour + minutes,
                        time: _.pad(i.toString(), 3, '0').substr(0, 2) + ':' + _.pad(minutes.toString(), 2, '0')
                    });
                }
            }
            return result;
        };
        TimeRangeEditController.prototype.toBoolean = function (value) {
            if (value == null)
                return false;
            if (!value)
                return false;
            value = value.toString().toLowerCase();
            return value == '1' || value == 'true';
        };
        TimeRangeEditController.prototype.initDate = function () {
            this.data.startDate = null;
            this.data.startTime = null;
            this.data.endDate = null;
            this.data.endTime = null;
            this.data.duration = null;
            this.showTime = !this.toBoolean(this.pipHideTime);
        };
        TimeRangeEditController.prototype.onChangeStartDate = function (newV) {
            this.validateStartDate();
            this.data.duration = this.setDuration();
            this.setDate();
            this.pipChanged(this.pipStartDate, this.pipEndDate);
        };
        ;
        TimeRangeEditController.prototype.onChangeEndDate = function () {
            this.validateEndDate();
            this.data.duration = this.setDuration();
            this.setDate();
            this.pipChanged(this.pipStartDate, this.pipEndDate);
        };
        ;
        TimeRangeEditController.prototype.onChangeStartTime = function () {
            if (!this.data.startDate) {
                this.data.startDate = this.pipDateConvert.toStartDay(new Date());
            }
            this.validateStartDate();
            this.data.duration = this.setDuration();
            this.setDate();
            this.pipChanged(this.pipStartDate, this.pipEndDate);
        };
        ;
        TimeRangeEditController.prototype.onChangeEndTime = function () {
            if (!this.data.endDate) {
                this.data.endDate = this.pipDateConvert.toStartDay(new Date());
            }
            this.validateEndDate();
            this.data.duration = this.setDuration();
            this.setDate();
            this.pipChanged(this.pipStartDate, this.pipEndDate);
        };
        ;
        TimeRangeEditController.prototype.isDisabled = function () {
            if (this.disabled) {
                return this.disabled();
            }
            return false;
        };
        ;
        return TimeRangeEditController;
    }());
    var TimeRangeEditComponent = {
        bindings: TimeRangeEditBindings,
        templateUrl: 'time_range_edit/TimeRangeEdit.html',
        controller: TimeRangeEditController
    };
    angular.module('pipTimeRangeEdit', [])
        .component('pipTimeRangeEdit', TimeRangeEditComponent);
}
},{}],13:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipDates.Templates');
} catch (e) {
  module = angular.module('pipDates.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('date/Date.html',
    '<div class="pip-date layout-row flex" tabindex="-1"><md-input-container class="input-container flex"><md-select class="pip-date-day flex" ng-disabled="$ctrl.disableControls" ng-model="$ctrl.day" placeholder="{{$ctrl.dayLabel}}" ng-change="$ctrl.setValue()"><md-option ng-value="opt" ng-repeat="opt in $ctrl.days track by opt">{{:: opt }}</md-option></md-select></md-input-container><div class="input-container-separator flex-fixed"></div><md-input-container class="input-container flex"><md-select class="pip-date-monthflex" ng-disabled="$ctrl.disableControls" ng-model="$ctrl.month" placeholder="{{$ctrl.monthLabel}}" ng-change="$ctrl.onMonthChanged()"><md-option ng-value="opt.id" ng-repeat="opt in $ctrl.months track by opt.id">{{:: opt.name }}</md-option></md-select></md-input-container><div class="input-container-separator flex-fixed"></div><md-input-container class="input-container flex"><md-select class="pip-date-year flex" ng-disabled="$ctrl.disableControls" ng-model="$ctrl.year" placeholder="{{$ctrl.yearLabel}}" ng-change="$ctrl.onYearChanged()"><md-option ng-value="opt" ng-repeat="opt in $ctrl.years track by opt">{{:: opt }}</md-option></md-select></md-input-container></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDates.Templates');
} catch (e) {
  module = angular.module('pipDates.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('date_range/DateRange.html',
    '<div class="pip-date-range layout-row flex" tabindex="-1"><md-input-container ng-show="$ctrl.isDay()" class="input-container pip-day flex" ng-class="{\'flex-fixed\' : $ctrl.$mdMedia(\'gt-xs\')}"><md-select class="select-day" ng-class="{\'pip-no-line\' : $ctrl.pipNoLine}" ng-disable="{{$ctrl.disableControls}}" md-on-open="$ctrl.onDayClick()" ng-model="$ctrl.day" ng-change="$ctrl.setValue()" placeholder="{{$ctrl.dayLabel}}" aria-label="DAY"><md-option ng-value="opt" ng-repeat="opt in $ctrl.days track by opt">{{$ctrl.nameDays[$index]}} {{ opt }}</md-option></md-select></md-input-container><md-input-container ng-show="$ctrl.isWeek()" class="input-container flex" ng-class="{\'flex-fixed\' : $ctrl.$mdMedia(\'gt-xs\')}"><md-select class="select-week" ng-class="{\'pip-no-line\' : $ctrl.pipNoLine}" ng-disable="{{$ctrl.disableControls}}" ng-model="$ctrl.week" ng-change="$ctrl.onWeekChange()" placeholder="{{$ctrl.weekLabel}}" aria-label="WEEK"><md-option ng-value="opt.id" ng-repeat="opt in $ctrl.weeks track by opt.id">{{ opt.name }}</md-option></md-select></md-input-container><div class="flex-fixed" ng-class="{\'space16\': $ctrl.$mdMedia(\'gt-xs\'), \'space8\': $ctrl.$mdMedia(\'xs\')}" ng-show="$ctrl.isDay() || $ctrl.isWeek()"></div><md-input-container ng-show="$ctrl.isMonth() && !$ctrl.monthFormatShort" class="input-container flex" ng-class="{\'flex-fixed\' : $ctrl.$mdMedia(\'gt-xs\')}"><md-select class="select-month" ng-class="{\'pip-no-line\' : $ctrl.pipNoLine}" ng-disable="{{$ctrl.disableControls}}" md-on-open="$ctrl.onMonthClick()" ng-model="$ctrl.month" ng-change="$ctrl.onMonthChanged()" placeholder="{{$ctrl.monthLabel}}" aria-label="MONTH"><md-option ng-value="opt.id" ng-repeat="opt in $ctrl.months track by opt.id">{{ opt.name }}</md-option></md-select></md-input-container><md-input-container ng-show="$ctrl.isMonth() && $ctrl.monthFormatShort" class="flex input-container" ng-class="{\'flex-fixed\' : $ctrl.$mdMedia(\'gt-xs\')}"><md-select class="select-month" ng-class="{\'pip-no-line\' : $ctrl.pipNoLine}" ng-disable="{{$ctrl.disableControls}}" md-on-open="$ctrl.onMonthClick()" ng-model="$ctrl.month" ng-change="$ctrl.onMonthChanged()" placeholder="{{$ctrl.monthLabel}}" aria-label="MONTH"><md-option ng-value="opt.id" ng-repeat="opt in $ctrl.shortMonths track by opt.id">{{ opt.name }}</md-option></md-select></md-input-container><div class="flex-fixed" ng-class="{\'space16\': $ctrl.$mdMedia(\'gt-xs\'), \'space8\': $ctrl.$mdMedia(\'xs\')}" ng-show="$ctrl.isMonth()"></div><md-input-container class="input-container flex" ng-class="{\'flex-fixed\' : $ctrl.$mdMedia(\'gt-xs\')}"><md-select class="select-year" ng-class="{\'pip-no-line\' : $ctrl.pipNoLine}" ng-disable="{{$ctrl.disableControls}}" md-on-open="$ctrl.onYearClick()" ng-model="$ctrl.year" ng-change="$ctrl.onYearChanged()" placeholder="{{$ctrl.yearLabel}}" aria-label="YEAR"><md-option ng-value="opt" ng-repeat="opt in $ctrl.years track by opt">{{ opt }}</md-option></md-select></md-input-container></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDates.Templates');
} catch (e) {
  module = angular.module('pipDates.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('time_range/TimeRange.html',
    '<p><span ng-if="$ctrl.data.start != null">{{$ctrl.data.start | formatLongDateTime}}</span> <span class="separator" ng-if="$ctrl.data.start && $ctrl.data.end">-</span> <span ng-if="$ctrl.data.end != null">{{$ctrl.data.end | formatLongDateTime}}</span></p>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDates.Templates');
} catch (e) {
  module = angular.module('pipDates.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('time_range_edit/TimeRangeEdit.html',
    '<div class="event-edit layout-row layout-xs-column flex layout-align-start-start"><div flex="47" class="start-time-container"><p class="text-caption text-grey">{{$ctrl.startLabel}}</p><div class="layout-row layout-align-space-between-center"><div class="pip-datepicker-container" flex="49"><md-datepicker ng-model="$ctrl.data.startDate" xmd-placeholder="{{$ctrl.startLabel}}" ng-change="$ctrl.onChangeStartDate()" ng-disabled="$ctrl.isDisabled()" aria-label="START-DATE"></md-datepicker></div><div flex="" ng-if="$ctrl.showTime"><md-input-container class="input-container"><md-select aria-label="START-TIME" ng-model="$ctrl.data.startTime" ng-disabled="$ctrl.isDisabled()" ng-change="$ctrl.onChangeStartTime($ctrl.data.startTime)"><md-option ng-value="opt.id" ng-repeat="opt in $ctrl.intervalTimeCollection track by opt.id">{{ opt.time }}</md-option></md-select></md-input-container></div></div></div><div flex="47" class="end-time-container"><p class="text-caption text-grey">{{$ctrl.endLabel}}</p><div class="layout-row layout-align-space-between-center"><div class="pip-datepicker-container flex-49"><md-datepicker ng-model="$ctrl.data.endDate" xmd-placeholder="{{$ctrl.endLabel}}" ng-disabled="$ctrl.isDisabled()" ng-change="$ctrl.onChangeEndDate()" aria-label="END-DATE"></md-datepicker></div><div flex="" ng-if="$ctrl.showTime"><md-input-container class="input-container"><md-select aria-label="END-TIME" ng-model="$ctrl.data.endTime" ng-change="$ctrl.onChangeEndTime()" ng-disabled="$ctrl.isDisabled()"><md-option ng-value="opt.id" ng-repeat="opt in $ctrl.intervalTimeCollection track by opt.id">{{ opt.time }}</md-option></md-select></md-input-container></div></div></div></div>');
}]);
})();



},{}]},{},[13,2,3,4,5,6,7,8,1,9,10,12,11])(13)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).dialogs = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ConfirmationDialogParams_1 = require("./ConfirmationDialogParams");
var ConfirmationDialogController = (function (_super) {
    __extends(ConfirmationDialogController, _super);
    ConfirmationDialogController.$inject = ['$mdDialog', '$injector', '$rootScope'];
    function ConfirmationDialogController($mdDialog, $injector, $rootScope) {
        "ngInject";
        var _this = _super.call(this) || this;
        _this._injector = $injector;
        _this.initTranslate();
        _this.$mdDialog = $mdDialog;
        _this.theme = $rootScope['$theme'];
        return _this;
    }
    ConfirmationDialogController.prototype.initTranslate = function () {
        var pipTranslate;
        pipTranslate = this._injector.has('pipTranslate')
            ? this._injector.get('pipTranslate') : null;
        if (pipTranslate) {
            pipTranslate.translations('en', { 'CONFIRM_TITLE': 'Confirm' });
            pipTranslate.translations('ru', { 'CONFIRM_TITLE': 'Подтвердите' });
            this.title = pipTranslate.translate(this.title) || pipTranslate.translate('CONFIRM_TITLE');
            this.ok = pipTranslate.translate(this.ok) || pipTranslate.translate('OK');
            this.cancel = pipTranslate.translate(this.cancel) || ('CANCEL');
        }
        else {
            this.title = this.title || 'Confirm';
            this.ok = this.ok || 'OK';
            this.cancel = this.cancel || 'Cancel';
        }
    };
    ConfirmationDialogController.prototype.onOk = function () {
        this.$mdDialog.hide();
    };
    ConfirmationDialogController.prototype.onCancel = function () {
        this.$mdDialog.cancel();
    };
    return ConfirmationDialogController;
}(ConfirmationDialogParams_1.ConfirmationDialogParams));
angular
    .module('pipConfirmationDialog')
    .controller('pipConfirmationDialogController', ConfirmationDialogController);
},{"./ConfirmationDialogParams":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConfirmationDialogParams = (function () {
    function ConfirmationDialogParams() {
    }
    return ConfirmationDialogParams;
}());
exports.ConfirmationDialogParams = ConfirmationDialogParams;
},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConfirmationDialogService = (function () {
    ConfirmationDialogService.$inject = ['$mdDialog'];
    function ConfirmationDialogService($mdDialog) {
        this._mdDialog = $mdDialog;
    }
    ConfirmationDialogService.prototype.show = function (params, successCallback, cancelCallback) {
        this._mdDialog.show({
            targetEvent: params.event,
            templateUrl: 'confirmation/ConfirmationDialog.html',
            controller: 'pipConfirmationDialogController',
            controllerAs: '$ctrl',
            locals: params,
            bindToController: true,
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
    };
    return ConfirmationDialogService;
}());
angular
    .module('pipConfirmationDialog')
    .service('pipConfirmationDialog', ConfirmationDialogService);
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
angular
    .module('pipConfirmationDialog', [
    'ngMaterial',
    'pipDialogs.Translate',
    'pipDialogs.Templates'
]);
require("./ConfirmationDialogParams");
require("./ConfirmationDialogController");
require("./IConfirmationDialogService");
require("./ConfirmationDialogService");
},{"./ConfirmationDialogController":1,"./ConfirmationDialogParams":2,"./ConfirmationDialogService":3,"./IConfirmationDialogService":4}],6:[function(require,module,exports){
{
    translate.$inject = ['$injector'];
    function translate($injector) {
        var pipTranslate = $injector.has('pipTranslate')
            ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate.translate(key) || key : key;
        };
    }
    angular
        .module('pipDialogs.Translate', [])
        .filter('translate', translate);
}
},{}],7:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorDetailsDialogParams_1 = require("./ErrorDetailsDialogParams");
var ErrorDialogStrings = (function () {
    function ErrorDialogStrings() {
        this.errorDetails = 'Error details';
        this.errorMessage = 'Message';
        this.errorCode = 'Code';
        this.errorMethod = 'Method';
        this.errorPath = 'Path';
        this.errorText = 'Error';
    }
    return ErrorDialogStrings;
}());
var ErrorDetailsDialogController = (function (_super) {
    __extends(ErrorDetailsDialogController, _super);
    ErrorDetailsDialogController.$inject = ['$mdDialog', '$injector', '$rootScope'];
    function ErrorDetailsDialogController($mdDialog, $injector, $rootScope) {
        "ngInject";
        var _this = _super.call(this) || this;
        _this.strings = new ErrorDialogStrings();
        _this._injector = $injector;
        _this.$mdDialog = $mdDialog;
        _this.theme = $rootScope.$theme;
        _this.initTranslate();
        if (!_this.error) {
            _this.error = '<none>';
        }
        return _this;
    }
    ErrorDetailsDialogController.prototype.initTranslate = function () {
        var pipTranslate;
        pipTranslate = this._injector.has('pipTranslate')
            ? this._injector.get('pipTranslate') : null;
        if (pipTranslate) {
            pipTranslate.translations('en', {
                'OK': 'Ok',
                'CANCEL': 'Cancel',
                'ERROR_DETAILS': 'Error details',
                'CODE': 'Error code',
                'PATH': 'Path',
                'ERROR': 'Error',
                'METHOD': 'Method',
                'MESSAGE': 'Message',
                'DISMISS': 'Dismiss'
            });
            pipTranslate.translations('ru', {
                'OK': 'Ок',
                'CANCEL': 'Отмена',
                'ERROR_DETAILS': 'Детали ошибки',
                'CODE': 'Код ошибки',
                'PATH': 'Путь',
                'ERROR': 'Ошибка',
                'METHOD': 'Метод',
                'MESSAGE': 'Сообщение'
            });
            this.dismissButton = pipTranslate.translate(this.dismissButton) || pipTranslate.translate('DISMISS');
            this.strings.errorDetails = pipTranslate.translate('ERROR_DETAILS');
            this.strings.errorMessage = pipTranslate.translate('MESSAGE');
            this.strings.errorCode = pipTranslate.translate('CODE');
            this.strings.errorMethod = pipTranslate.translate('METHOD');
            this.strings.errorPath = pipTranslate.translate('PATH');
            this.strings.errorText = pipTranslate.translate('ERROR');
        }
        else {
            this.dismissButton = this.dismissButton || 'Dismiss';
        }
    };
    ErrorDetailsDialogController.prototype.onOk = function () {
        this.$mdDialog.hide();
    };
    ErrorDetailsDialogController.prototype.isString = function (error) {
        return _.isString(error);
    };
    ErrorDetailsDialogController.prototype.getErrorText = function () {
        var error;
        if (_.isString(this.error)) {
            return this.error;
        }
        if (this.error && this.error.error) {
            return this.error.error.toString();
        }
        if (this.error && this.error.data && this.error.data.error) {
            return this.error.data.error.toString();
        }
        return '<none>';
    };
    return ErrorDetailsDialogController;
}(ErrorDetailsDialogParams_1.ErrorDetailsDialogParams));
angular
    .module('pipErrorDetailsDialog')
    .controller('pipErrorDetailsDialogController', ErrorDetailsDialogController);
},{"./ErrorDetailsDialogParams":8}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorDetailsDialogParams = (function () {
    function ErrorDetailsDialogParams() {
    }
    return ErrorDetailsDialogParams;
}());
exports.ErrorDetailsDialogParams = ErrorDetailsDialogParams;
},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorDetailsDialogService = (function () {
    ErrorDetailsDialogService.$inject = ['$mdDialog'];
    function ErrorDetailsDialogService($mdDialog) {
        this._mdDialog = $mdDialog;
    }
    ErrorDetailsDialogService.prototype.show = function (params, successCallback, cancelCallback) {
        this._mdDialog.show({
            targetEvent: params.event,
            templateUrl: 'error_details/ErrorDetailsDialog.html',
            controller: 'pipErrorDetailsDialogController',
            controllerAs: '$ctrl',
            locals: params,
            bindToController: true,
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
    };
    return ErrorDetailsDialogService;
}());
angular
    .module('pipErrorDetailsDialog')
    .service('pipErrorDetailsDialog', ErrorDetailsDialogService);
},{}],10:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular
    .module('pipErrorDetailsDialog', [
    'ngMaterial',
    'pipDialogs.Translate',
    'pipDialogs.Templates'
]);
require("./ErrorDetailsDialogParams");
require("./ErrorDetailsDialogService");
require("./ErrorDetailsDialogController");
__export(require("./ErrorDetailsDialogParams"));
},{"./ErrorDetailsDialogController":7,"./ErrorDetailsDialogParams":8,"./ErrorDetailsDialogService":9}],11:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
require("./dependencies/TranslateFilter");
require("./error_details");
require("./information");
require("./options");
require("./options_big");
require("./confirmation");
angular
    .module('pipDialogs', [
    'pipInformationDialog',
    'pipConfirmationDialog',
    'pipOptionsDialog',
    'pipOptionsBigDialog',
    'pipErrorDetailsDialog'
]);
__export(require("./error_details"));
__export(require("./information"));
__export(require("./options"));
__export(require("./options_big"));
},{"./confirmation":5,"./dependencies/TranslateFilter":6,"./error_details":10,"./information":15,"./options":21,"./options_big":27}],12:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var InformationDialogParams_1 = require("./InformationDialogParams");
var InformationDialogController = (function (_super) {
    __extends(InformationDialogController, _super);
    InformationDialogController.$inject = ['$mdDialog', '$injector', '$rootScope'];
    function InformationDialogController($mdDialog, $injector, $rootScope) {
        "ngInject";
        var _this = _super.call(this) || this;
        _this._injector = $injector;
        _this.initTranslate();
        _this.$mdDialog = $mdDialog;
        _this.theme = $rootScope['$theme'];
        return _this;
    }
    InformationDialogController.prototype.initTranslate = function () {
        var pipTranslate;
        pipTranslate = this._injector.has('pipTranslate')
            ? this._injector.get('pipTranslate') : null;
        var content = this.message;
        var item;
        if (pipTranslate) {
            pipTranslate.translations('en', { 'INFORMATION_TITLE': 'Information' });
            pipTranslate.translations('ru', { 'INFORMATION_TITLE': 'Информация' });
            this.title = pipTranslate.translate(this.title) || pipTranslate.translate('INFORMATION_TITLE');
            this.ok = pipTranslate.translate(this.ok) || pipTranslate.translate('OK');
            content = pipTranslate.translate(content);
        }
        else {
            this.title = this.title || 'Information';
            this.ok = this.ok || 'OK';
        }
        var pipFormat = this._injector.has('pipFormat')
            ? this._injector.get('pipFormat') : null;
        if (this.item && pipFormat) {
            content = pipFormat.sprintf(content, item);
        }
        this.content = content;
    };
    InformationDialogController.prototype.onOk = function () {
        this.$mdDialog.hide();
    };
    InformationDialogController.prototype.onCancel = function () {
        this.$mdDialog.cancel();
    };
    return InformationDialogController;
}(InformationDialogParams_1.InformationDialogParams));
angular
    .module('pipInformationDialog')
    .controller('pipInformationDialogController', InformationDialogController);
},{"./InformationDialogParams":13}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InformationDialogParams = (function () {
    function InformationDialogParams() {
    }
    return InformationDialogParams;
}());
exports.InformationDialogParams = InformationDialogParams;
},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InformationDialogService = (function () {
    InformationDialogService.$inject = ['$mdDialog'];
    function InformationDialogService($mdDialog) {
        this._mdDialog = $mdDialog;
    }
    InformationDialogService.prototype.show = function (params, successCallback, cancelCallback) {
        this._mdDialog.show({
            targetEvent: params.event,
            templateUrl: 'information/InformationDialog.html',
            controller: 'pipInformationDialogController',
            controllerAs: '$ctrl',
            locals: params,
            bindToController: true,
            clickOutsideToClose: true
        })
            .then(function () {
            if (successCallback) {
                successCallback();
            }
        });
    };
    return InformationDialogService;
}());
angular
    .module('pipInformationDialog')
    .service('pipInformationDialog', InformationDialogService);
},{}],15:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular
    .module('pipInformationDialog', [
    'ngMaterial',
    'pipDialogs.Translate',
    'pipDialogs.Templates'
]);
require("./InformationDialogParams");
require("./InformationDialogController");
require("./InformationDialogService");
__export(require("./InformationDialogParams"));
},{"./InformationDialogController":12,"./InformationDialogParams":13,"./InformationDialogService":14}],16:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsDialogParams_1 = require("./OptionsDialogParams");
var OptionsDialogController = (function (_super) {
    __extends(OptionsDialogController, _super);
    OptionsDialogController.$inject = ['$mdDialog', '$injector', '$rootScope'];
    function OptionsDialogController($mdDialog, $injector, $rootScope) {
        "ngInject";
        var _this = _super.call(this) || this;
        _this.$mdDialog = $mdDialog;
        _this._injector = $injector;
        _this.theme = $rootScope['$theme'];
        _this.options = _this.options || [];
        _this.initTranslate();
        _this.selectedOption = _.find(_this.options, { active: true }) || null;
        var name = _this.selectedOption ? _this.selectedOption.name : _this.selectedOptionName;
        var index = _.findIndex(_this.options, function (opt) {
            return opt.name == name;
        });
        _this.optionIndex = index == -1 ? 0 : index;
        _this.selectedOption = _this.options[_this.optionIndex];
        _this.selectedOptionName = _this.selectedOption.name;
        setTimeout(_this.focusInput, 500);
        return _this;
    }
    OptionsDialogController.prototype.initTranslate = function () {
        var pipTranslate;
        pipTranslate = this._injector.has('pipTranslate') ? this._injector.get('pipTranslate') : null;
        if (pipTranslate) {
            pipTranslate.translations('en', { 'OPTIONS_TITLE': 'Choose Option' });
            pipTranslate.translations('ru', { 'OPTIONS_TITLE': 'Выберите опцию' });
            this.title = pipTranslate.translate(this.title) || pipTranslate.translate('OPTIONS_TITLE');
            this.ok = pipTranslate.translate(this.ok) || pipTranslate.translate('SELECT');
        }
        else {
            this.title = this.title || 'Choose Option';
            this.ok = this.ok || 'Select';
        }
    };
    OptionsDialogController.prototype.onOk = function () {
        this.$mdDialog.hide();
    };
    OptionsDialogController.prototype.onCancel = function () {
        this.$mdDialog.cancel();
    };
    OptionsDialogController.prototype.onOptionSelect = function (event, option) {
        event.stopPropagation();
        this.selectedOptionName = option.name;
    };
    OptionsDialogController.prototype.onKeyPress = function (event) {
        if (event.keyCode === 32 || event.keyCode === 13) {
            event.stopPropagation();
            event.preventDefault();
            this.onSelect();
        }
    };
    OptionsDialogController.prototype.onSelect = function () {
        var option;
        option = _.find(this.options, { name: this.selectedOptionName });
        this.$mdDialog.hide({ option: option, isCheckboxOption: this.isCheckboxOption });
    };
    OptionsDialogController.prototype.focusInput = function () {
        var list;
        list = $('.pip-options-dialog .pip-list');
        list.focus();
    };
    return OptionsDialogController;
}(OptionsDialogParams_1.OptionsDialogParams));
angular
    .module('pipOptionsDialog')
    .controller('pipOptionsDialogController', OptionsDialogController);
},{"./OptionsDialogParams":18}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsDialogData = (function () {
    function OptionsDialogData() {
        this.icon = 'star';
        this.active = true;
    }
    return OptionsDialogData;
}());
exports.OptionsDialogData = OptionsDialogData;
},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsDialogParams = (function () {
    function OptionsDialogParams() {
    }
    return OptionsDialogParams;
}());
exports.OptionsDialogParams = OptionsDialogParams;
},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsDialogResult = (function () {
    function OptionsDialogResult() {
    }
    return OptionsDialogResult;
}());
exports.OptionsDialogResult = OptionsDialogResult;
},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsDialogService = (function () {
    OptionsDialogService.$inject = ['$mdDialog'];
    function OptionsDialogService($mdDialog) {
        this._mdDialog = $mdDialog;
    }
    OptionsDialogService.prototype.show = function (params, successCallback, cancelCallback) {
        this._mdDialog.show({
            targetEvent: params.event,
            templateUrl: 'options/OptionsDialog.html',
            controller: 'pipOptionsDialogController',
            controllerAs: '$ctrl',
            locals: params,
            bindToController: true,
            clickOutsideToClose: true
        })
            .then(function (result) {
            if (successCallback) {
                successCallback(result);
            }
        }, function () {
            if (cancelCallback) {
                cancelCallback();
            }
        });
    };
    return OptionsDialogService;
}());
angular
    .module('pipOptionsDialog')
    .service('pipOptionsDialog', OptionsDialogService);
},{}],21:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular
    .module('pipOptionsDialog', [
    'ngMaterial',
    'pipDialogs.Translate',
    'pipDialogs.Templates'
]);
require("./OptionsDialogData");
require("./OptionsDialogParams");
require("./OptionsDialogResult");
require("./OptionsDialogController");
require("./OptionsDialogService");
__export(require("./OptionsDialogData"));
__export(require("./OptionsDialogParams"));
__export(require("./OptionsDialogResult"));
},{"./OptionsDialogController":16,"./OptionsDialogData":17,"./OptionsDialogParams":18,"./OptionsDialogResult":19,"./OptionsDialogService":20}],22:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsBigDialogParams_1 = require("./OptionsBigDialogParams");
var OptionsBigDialogData_1 = require("./OptionsBigDialogData");
var OptionsBigDialogController = (function (_super) {
    __extends(OptionsBigDialogController, _super);
    OptionsBigDialogController.$inject = ['$mdDialog', '$injector', '$rootScope'];
    function OptionsBigDialogController($mdDialog, $injector, $rootScope) {
        "ngInject";
        var _this = _super.call(this) || this;
        _this.onSelect = function () {
            var option;
            option = _.find(this.options, { name: this.selectedOptionName }) || new OptionsBigDialogData_1.OptionsBigDialogData();
            this.$mdDialog.hide({ option: option });
        };
        _this.$mdDialog = $mdDialog;
        _this._injector = $injector;
        _this.theme = $rootScope['$theme'];
        _this.initTranslate();
        _this.selectedOption = _.find(_this.options, { active: true }) || null;
        var name = _this.selectedOption ? _this.selectedOption.name : _this.selectedOptionName;
        var index = _.findIndex(_this.options, function (opt) {
            return opt.name == name;
        });
        _this.optionIndex = index == -1 ? 0 : index;
        _this.selectedOption = _this.options[_this.optionIndex];
        _this.selectedOptionName = _this.selectedOption.name;
        setTimeout(_this.focusInput, 500);
        return _this;
    }
    OptionsBigDialogController.prototype.initTranslate = function () {
        var pipTranslate;
        pipTranslate = this._injector.has('pipTranslate')
            ? this._injector.get('pipTranslate') : null;
        if (pipTranslate) {
            pipTranslate.translations('en', { 'OPTIONS_TITLE': 'Choose Option' });
            pipTranslate.translations('ru', { 'OPTIONS_TITLE': 'Выберите опцию' });
            this.title = pipTranslate.translate(this.title) || pipTranslate.translate('OPTIONS_TITLE');
            this.ok = pipTranslate.translate(this.ok) || pipTranslate.translate('SELECT');
        }
        else {
            this.title = this.title || 'Choose Option';
            this.ok = this.ok || 'Select';
        }
    };
    OptionsBigDialogController.prototype.onOk = function () {
        this.$mdDialog.hide();
    };
    OptionsBigDialogController.prototype.onCancel = function () {
        this.$mdDialog.cancel();
    };
    OptionsBigDialogController.prototype.onOptionSelect = function (event, option) {
        event.stopPropagation();
        this.selectedOptionName = option.name;
        if (this.noActions) {
            this.onSelect();
        }
    };
    OptionsBigDialogController.prototype.onSelected = function () {
        this.selectedOptionName = this.options[this.optionIndex].name;
        if (this.noActions) {
            this.onSelect();
        }
    };
    OptionsBigDialogController.prototype.onKeyUp = function (event, index) {
        if (event.keyCode === 32 || event.keyCode === 13) {
            event.stopPropagation();
            event.preventDefault();
            if (index !== undefined && index > -1 && index < this.options.length) {
                this.selectedOptionName = this.options[index].name;
                this.onSelect();
            }
        }
    };
    OptionsBigDialogController.prototype.focusInput = function () {
        var list;
        list = $('.pip-options-dialog .pip-list');
        list.focus();
    };
    return OptionsBigDialogController;
}(OptionsBigDialogParams_1.OptionsBigDialogParams));
angular
    .module('pipOptionsBigDialog')
    .controller('pipOptionsBigDialogController', OptionsBigDialogController);
},{"./OptionsBigDialogData":23,"./OptionsBigDialogParams":24}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsBigDialogData = (function () {
    function OptionsBigDialogData() {
    }
    return OptionsBigDialogData;
}());
exports.OptionsBigDialogData = OptionsBigDialogData;
},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsBigDialogParams = (function () {
    function OptionsBigDialogParams() {
    }
    return OptionsBigDialogParams;
}());
exports.OptionsBigDialogParams = OptionsBigDialogParams;
},{}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsBigDialogResult = (function () {
    function OptionsBigDialogResult() {
    }
    return OptionsBigDialogResult;
}());
exports.OptionsBigDialogResult = OptionsBigDialogResult;
},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsBigDialogService = (function () {
    OptionsBigDialogService.$inject = ['$mdDialog'];
    function OptionsBigDialogService($mdDialog) {
        this._mdDialog = $mdDialog;
    }
    OptionsBigDialogService.prototype.show = function (params, successCallback, cancelCallback) {
        this._mdDialog.show({
            targetEvent: params.event,
            templateUrl: 'options_big/OptionsBigDialog.html',
            controller: 'pipOptionsBigDialogController',
            controllerAs: '$ctrl',
            locals: params,
            bindToController: true,
            clickOutsideToClose: true
        })
            .then(function (result) {
            if (successCallback) {
                successCallback(result);
            }
        }, function () {
            if (cancelCallback) {
                cancelCallback();
            }
        });
    };
    return OptionsBigDialogService;
}());
angular
    .module('pipOptionsBigDialog')
    .service('pipOptionsBigDialog', OptionsBigDialogService);
},{}],27:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular
    .module('pipOptionsBigDialog', [
    'ngMaterial',
    'pipDialogs.Translate',
    'pipDialogs.Templates'
]);
require("./OptionsBigDialogParams");
require("./OptionsBigDialogData");
require("./OptionsBigDialogResult");
require("./OptionsBigDialogController");
require("./OptionsBigDialogService");
__export(require("./OptionsBigDialogParams"));
__export(require("./OptionsBigDialogData"));
__export(require("./OptionsBigDialogResult"));
},{"./OptionsBigDialogController":22,"./OptionsBigDialogData":23,"./OptionsBigDialogParams":24,"./OptionsBigDialogResult":25,"./OptionsBigDialogService":26}],28:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipDialogs.Templates');
} catch (e) {
  module = angular.module('pipDialogs.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('confirmation/ConfirmationDialog.html',
    '<md-dialog class="pip-dialog pip-confirmation-dialog layout-column" width="400" md-theme="{{ ::$ctrl.theme }}"><div class="pip-header"><h3>{{ :: $ctrl.title }}</h3></div><div class="pip-footer"><div><md-button ng-click="$ctrl.onCancel()">{{ :: $ctrl.cancel }}</md-button><md-button class="md-accent" ng-click="$ctrl.onOk()">{{ :: $ctrl.ok }}</md-button></div></div></md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDialogs.Templates');
} catch (e) {
  module = angular.module('pipDialogs.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('error_details/ErrorDetailsDialog.html',
    '<md-dialog class="pip-dialog pip-error-details-dialog layout-column" width="400" md-theme="{{ $ctrl.theme }}"><div class="pip-body"><div class="pip-header"><h3>{{ ::$ctrl.strings.errorDetails | translate }}</h3></div><div class="layout-row layout-align-start-center error-section text-body2 color-secondary-text" ng-if="$ctrl.error.code || ($ctrl.error.data && $ctrl.error.data.code)">{{ ::$ctrl.strings.errorCode | translate }}</div><div class="layout-row layout-align-start-center text-subhead1" ng-if="$ctrl.error.code || ($ctrl.error.data && $ctrl.error.data.code)">{{ $ctrl.error.code || $ctrl.error.data.code }}</div><div class="layout-row layout-align-start-center error-section text-body2 color-secondary-text" ng-if="$ctrl.error.path || ($ctrl.error.data && $ctrl.error.data.path)">{{ ::$ctrl.strings.errorPath | translate }}</div><div class="layout-row layout-align-start-center text-subhead1" ng-if="$ctrl.error.path || ($ctrl.error.data && $ctrl.error.data.path)">{{ $ctrl.error.path || $ctrl.error.data.path }}</div><div class="error-section text-body2 color-secondary-text layout-row layout-align-start-center" ng-if="$ctrl.isString($ctrl.error) || $ctrl.error.error || ($ctrl.error.data && $ctrl.error.data.error)">{{ ::$ctrl.strings.errorText | translate }}</div><div class="layout-row layout-align-start-center text-subhead1" ng-if="$ctrl.error.error || ($ctrl.error.data && $ctrl.error.data.error)">{{ $ctrl.getErrorText() }}</div><div class="error-section text-body2 color-secondary-text layout-row layout-align-start-center" ng-if="$ctrl.error.method || ($ctrl.error.data && $ctrl.error.data.method)">{{ ::$ctrl.strings.errorMethod | translate }}</div><div class="layout-row layout-align-start-center text-subhead1" ng-if="$ctrl.error.method || ($ctrl.error.data && $ctrl.error.data.method)">{{ $ctrl.error.method || $ctrl.error.data.method }}</div><div class="error-section text-body2 color-secondary-text layout-row layout-align-start-center" ng-if="$ctrl.error.message || ($ctrl.error.data && $ctrl.error.data.message)">{{ ::$ctrl.strings.errorMessage | translate }}</div><div class="layout-row layout-align-start-center text-subhead1" ng-if="$ctrl.error.message || ($ctrl.error.data && $ctrl.error.data.message)">{{ $ctrl.error.message || $ctrl.error.data.message }}</div></div><div class="pip-footer"><div><md-button class="md-accent m0" ng-click="$ctrl.onOk()">{{ ::$ctrl.dismissButton | translate }}</md-button></div></div></md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDialogs.Templates');
} catch (e) {
  module = angular.module('pipDialogs.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('information/InformationDialog.html',
    '<md-dialog class="pip-dialog pip-information-dialog layout-column" width="400" md-theme="{{ $ctrl.theme }}"><div class="pip-header"><h3>{{:: $ctrl.title | translate }}</h3></div><div class="pip-body"><div class="pip-content">{{ $ctrl.content }}</div></div><div class="pip-footer"><div><md-button class="md-accent" ng-click="$ctrl.onOk()">{{ $ctrl.ok | translate }}</md-button></div></div></md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDialogs.Templates');
} catch (e) {
  module = angular.module('pipDialogs.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('options/OptionsDialog.html',
    '<md-dialog class="pip-dialog pip-options-dialog layout-column" min-width="400" md-theme="{{ $ctrl.theme }}"><md-dialog-content class="pip-body lp0 tp0 rp0 bp24 pip-scroll"><div class="pip-header"><h3>{{ ::$ctrl.title | translate }}</h3><div ng-show="$ctrl.checkboxOptionCaption" class="header-option text-subhead1 divider-bottom"><md-checkbox ng-model="$ctrl.isCheckboxOption" aria-label="CHECKBOX">{{ ::$ctrl.checkboxOptionCaption | translate }}</md-checkbox></div></div><div class="pip-content"><md-radio-group ng-model="$ctrl.selectedOptionName" class="pip-list md-primary" md-no-ink="true" ng-keypress="$ctrl.onKeyPress($event)" tabindex="0"><div ng-repeat="option in $ctrl.options" class="pip-list-item" md-ink-ripple="" ui-event="{ click: \'$ctrl.onOptionSelect($event, option)\' }" ng-class="{ selected: option.name == $ctrl.selectedOptionName }"><div class="pip-list-item item-padding"><md-icon class="pip-option-icon" md-svg-icon="icons:{{ option.icon }}" ng-if="option.icon"></md-icon><div class="pip-option-title">{{ ::option.title | translate }}</div><md-radio-button ng-value="option.name" tabindex="-1" aria-label="{{ ::option.title | translate }}"></md-radio-button></div></div></md-radio-group></div></md-dialog-content><div class="pip-footer"><div><md-button class="pip-cancel" ng-click="$ctrl.onCancel()">{{ ::\'CANCEL\' | translate }}</md-button><md-button class="pip-submit md-accent" ng-click="$ctrl.onSelect()">{{ ::$ctrl.ok | translate }}</md-button></div></div></md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDialogs.Templates');
} catch (e) {
  module = angular.module('pipDialogs.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('options_big/OptionsBigDialog.html',
    '<md-dialog class="pip-dialog pip-options-dialog-big layout-column" min-width="400" md-theme="{{ $ctrl.theme }}"><md-dialog-content class="pip-body pip-scroll" ng-class="{\'bp24\': !$ctrl.noActions}"><div class="pip-header" ng-class="{\'header-hint\': $ctrl.noTitle && $ctrl.hint}"><h3 class="m0" ng-if="!$ctrl.noTitle">{{ ::$ctrl.title | translate }}</h3><div ng-show="$ctrl.noTitle && $ctrl.hint" class="dialog-hint layout-row layout-align-start-center"><div class="hint-icon-container flex-fixed"><md-icon md-svg-icon="icons:info-circle-outline"></md-icon></div><div>{{ ::$ctrl.hint | translate }}</div></div></div><div class="content-divider" ng-if="!noTitle"></div><div class="pip-content"><div class="spacer8" ng-if="noTitle && hint"></div><md-list class="pip-menu pip-ref-list" pip-selected="$ctrl.optionIndex" index="{{ $ctrl.optionIndex }}" pip-select="$ctrl.onSelected($event)"><md-list-item class="pip-ref-list-item pip-selectable layout-row layout-align-start-center" ng-class="{\'selected md-focused\' : option.name == $ctrl.selectedOptionName, \'divider-bottom\': $index != options.length - 1}" md-ink-ripple="" ng-keyup="$ctrl.onKeyUp($event, $index)" ng-repeat="option in $ctrl.options"><div class="pip-content content-stretch" ng-click="$ctrl.onOptionSelect($event, option)"><p class="pip-title spacer-right" ng-if="option.title" style="margin-bottom: 4px !important;">{{ ::option.title | translate }}</p><div class="pip-subtitle spacer-right" style="height: inherit" ng-if="option.subtitle">{{ ::option.subtitle | translate }}</div><div class="pip-subtitle spacer-right" style="height: inherit" ng-if="option.text" ng-bind-html="option.text | translate"></div></div></md-list-item></md-list></div><div class="spacer8" ng-if="$ctrl.noActions"></div></md-dialog-content><div class="pip-footer" ng-if="!$ctrl.noActions"><div><md-button class="pip-cancel" ng-click="$ctrl.onCancel()">{{ ::\'CANCEL\' | translate }}</md-button><md-button class="pip-submit md-accent" ng-click="$ctrl.onSelect()" style="margin-right: -6px">{{ ::$ctrl.ok | translate }}</md-button></div></div></md-dialog>');
}]);
})();



},{}]},{},[28,11])(28)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).nav = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IActionsService_1 = require("./IActionsService");
var IActionsService_2 = require("./IActionsService");
var IActionsService_3 = require("./IActionsService");
var ActionsService = (function () {
    function ActionsService(config, $rootScope) {
        this._config = config;
        this._rootScope = $rootScope;
    }
    Object.defineProperty(ActionsService.prototype, "config", {
        get: function () {
            return this._config;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionsService.prototype, "primaryGlobalActions", {
        get: function () {
            return this._config.primaryGlobalActions;
        },
        set: function (value) {
            this._config.primaryGlobalActions = value || [];
            this.sendChangeEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionsService.prototype, "secondaryGlobalActions", {
        get: function () {
            return this._config.secondaryGlobalActions;
        },
        set: function (value) {
            this._config.secondaryGlobalActions = value || [];
            this.sendChangeEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionsService.prototype, "primaryLocalActions", {
        get: function () {
            return this._config.primaryLocalActions;
        },
        set: function (value) {
            this._config.primaryLocalActions = value || [];
            this.sendChangeEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionsService.prototype, "secondaryLocalActions", {
        get: function () {
            return this._config.secondaryLocalActions;
        },
        set: function (value) {
            this._config.secondaryLocalActions = value || [];
            this.sendChangeEvent();
        },
        enumerable: true,
        configurable: true
    });
    ActionsService.prototype.show = function (primaryActions, secondaryActions) {
        this._config.primaryLocalActions = primaryActions || [];
        this._config.secondaryLocalActions = secondaryActions || [];
        this.sendChangeEvent();
    };
    ActionsService.prototype.hide = function () {
        this._config.primaryLocalActions = [];
        this._config.secondaryLocalActions = [];
        this.sendChangeEvent();
    };
    ActionsService.prototype.updateCount = function (action, count) {
        if (action == null || !_.isNumber(count))
            return;
        _.each(this._config.primaryGlobalActions, function (a) {
            if (a.name == action)
                a.count = count;
        });
        _.each(this._config.primaryLocalActions, function (a) {
            if (a.name == action)
                a.count = count;
        });
        this.sendChangeEvent();
    };
    ActionsService.prototype.clearCounts = function () {
        _.each(this._config.primaryGlobalActions, function (a) {
            a.count = null;
        });
        _.each(this._config.primaryLocalActions, function (a) {
            a.count = null;
        });
        this.sendChangeEvent();
    };
    ActionsService.prototype.sendChangeEvent = function () {
        this._rootScope.$emit(IActionsService_2.ActionsChangedEvent, this._config);
    };
    ActionsService.prototype.openMenuEvent = function () {
        this._rootScope.$emit(IActionsService_3.SecondaryActionsOpenEvent);
    };
    return ActionsService;
}());
var ActionsProvider = (function () {
    function ActionsProvider() {
        this._config = new IActionsService_1.ActionsConfig();
    }
    Object.defineProperty(ActionsProvider.prototype, "config", {
        get: function () {
            return this._config;
        },
        set: function (value) {
            this._config = value || new IActionsService_1.ActionsConfig();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionsProvider.prototype, "primaryGlobalActions", {
        get: function () {
            return this._config.primaryGlobalActions;
        },
        set: function (value) {
            this._config.primaryGlobalActions = value || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionsProvider.prototype, "secondaryGlobalActions", {
        get: function () {
            return this._config.secondaryGlobalActions;
        },
        set: function (value) {
            this._config.secondaryGlobalActions = value || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionsProvider.prototype, "primaryLocalActions", {
        get: function () {
            return this._config.primaryLocalActions;
        },
        set: function (value) {
            this._config.primaryLocalActions = value || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionsProvider.prototype, "secondaryLocalActions", {
        get: function () {
            return this._config.secondaryLocalActions;
        },
        set: function (value) {
            this._config.secondaryLocalActions = value || [];
        },
        enumerable: true,
        configurable: true
    });
    ActionsProvider.prototype.$get = ['$rootScope', function ($rootScope) {
        "ngInject";
        if (this._service == null)
            this._service = new ActionsService(this._config, $rootScope);
        return this._service;
    }];
    return ActionsProvider;
}());
angular
    .module('pipActions')
    .provider('pipActions', ActionsProvider);
},{"./IActionsService":2}],2:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionsChangedEvent = 'pipActionsChanged';
exports.SecondaryActionsOpenEvent = 'pipSecondaryActionsOpen';
var SimpleActionItem = (function () {
    function SimpleActionItem() {
    }
    return SimpleActionItem;
}());
exports.SimpleActionItem = SimpleActionItem;
var ActionItem = (function (_super) {
    __extends(ActionItem, _super);
    function ActionItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ActionItem;
}(SimpleActionItem));
exports.ActionItem = ActionItem;
var ActionsConfig = (function () {
    function ActionsConfig() {
        this.primaryGlobalActions = [];
        this.primaryLocalActions = [];
        this.secondaryGlobalActions = [];
        this.secondaryLocalActions = [];
    }
    return ActionsConfig;
}());
exports.ActionsConfig = ActionsConfig;
},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PrimaryActionsController = (function () {
    PrimaryActionsController.$inject = ['$element', '$injector', '$scope', '$rootScope', '$window', '$location', 'pipActions', '$log', '$attrs'];
    function PrimaryActionsController($element, $injector, $scope, $rootScope, $window, $location, pipActions, $log, $attrs) {
        "ngInject";
        var _this = this;
        this.$element = $element;
        this.$injector = $injector;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.$window = $window;
        this.$location = $location;
        this.pipActions = pipActions;
        this._pipTranslate = this.$injector.has('pipTranslate') ? this.$injector.get('pipTranslate') : null;
        if (this._pipTranslate && this._pipTranslate.setTranslations) {
            this._pipTranslate.setTranslations('en', {
                DOCUMENTS_ATTACHED: 'document(s) attached',
                ERROR_DOCUMENTS_LOADED: 'Error: <%= error_number %> document(s) are not loaded'
            });
            this._pipTranslate.setTranslations('ru', {
                DOCUMENTS_ATTACHED: 'документов добавлено',
                ERROR_DOCUMENTS_LOADED: 'Ошибка: <%= error_number %> документ(ов) не загружено'
            });
        }
        this.$element.addClass('pip-primary-actions');
        this.$rootScope.$on('pipActionsChanged', function (event, config) {
            _this.onActionsChanged(event, config);
        });
    }
    PrimaryActionsController.prototype.$onInit = function () {
        if (this.localActions) {
            this.pipActions.primaryLocalActions = this.localActions;
        }
        if (this.globalActions) {
            this.pipActions.primaryGlobalActions = this.globalActions;
        }
        this.config = this.pipActions.config;
    };
    PrimaryActionsController.prototype.onActionsChanged = function (event, config) {
        this.config = config;
    };
    PrimaryActionsController.prototype.isHidden = function (action) {
        return action.access && !action.access(action);
    };
    PrimaryActionsController.prototype.actionCount = function (action) {
        if (action.count === null || action.count <= 0) {
            return '';
        }
        if (action.count > 99) {
            return '!';
        }
        return String(action.count);
    };
    PrimaryActionsController.prototype.clickAction = function (action, $mdOpenMenu) {
        if (!action || action.divider) {
            return;
        }
        if (action.subActions) {
            $mdOpenMenu(this.originatorEv);
            return;
        }
        if (_.isFunction(action.click)) {
            action.click(action);
            return;
        }
        if (action.href) {
            this.$window.location.href = action.href;
            return;
        }
        if (action.url) {
            this.$location.url(action.url);
            return;
        }
        if (action.state) {
            if (this.$injector.has('this._state')) {
                var _state = this.$injector.has('pipTranslate') ? this.$injector.get('$state') : null;
                if (_state) {
                    _state.go(action.state, action.stateParams);
                }
            }
            return;
        }
        if (action.event) {
            this.$rootScope.$broadcast(action.event);
        }
        else {
            this.$rootScope.$broadcast('pipActionClicked', action.name);
        }
    };
    return PrimaryActionsController;
}());
var PrimaryActionsBindings = {
    localActions: '<pipLocalActions',
    globalActions: '<pipGlobalActions',
    originatorEv: '<?pipOriginatorEv'
};
var PrimaryActionsChanges = (function () {
    function PrimaryActionsChanges() {
    }
    return PrimaryActionsChanges;
}());
(function () {
    var primaryActions = {
        bindings: PrimaryActionsBindings,
        templateUrl: 'actions/PrimaryActions.html',
        controller: PrimaryActionsController
    };
    angular
        .module('pipActions')
        .component('pipPrimaryActions', primaryActions);
})();
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SecondaryActionsController = (function () {
    SecondaryActionsController.$inject = ['$attrs', '$injector', '$log', '$rootScope', '$window', '$location', 'pipActions', '$element'];
    function SecondaryActionsController($attrs, $injector, $log, $rootScope, $window, $location, pipActions, $element) {
        "ngInject";
        var _this = this;
        this.$attrs = $attrs;
        this.$injector = $injector;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$window = $window;
        this.$location = $location;
        this.pipActions = pipActions;
        $element.addClass('pip-secondary-actions');
        if (this.localActions) {
            pipActions.secondaryLocalActions = this.localActions;
        }
        if (this.globalActions) {
            pipActions.secondaryGlobalActions = this.globalActions;
        }
        this.config = pipActions.config;
        this.$rootScope.$on('pipActionsChanged', function (event, config) {
            _this.onActionsChanged(event, config);
        });
        this.$rootScope.$on('pipSecondaryActionsOpen', function () {
            _this.onActionsMenuOpen();
        });
    }
    SecondaryActionsController.prototype.getMenu = function (menuFn) {
        this._menuFn = menuFn;
    };
    SecondaryActionsController.prototype.onActionsMenuOpen = function () {
        this._menuFn();
    };
    SecondaryActionsController.prototype.openMenu = function ($mdOpenMenu, ev) {
        this.originatorEv = ev;
        $mdOpenMenu(ev);
    };
    SecondaryActionsController.prototype.onActionsChanged = function (event, config) {
        this.config = config;
    };
    SecondaryActionsController.prototype.isHidden = function (action) {
        return action.access && !action.access(action);
    };
    SecondaryActionsController.prototype.actionCount = function (action) {
        if (action.count === null || action.count <= 0) {
            return '';
        }
        if (action.count > 99) {
            return '!';
        }
        return String(action.count);
    };
    SecondaryActionsController.prototype.calcActions = function (actions) {
        var _this = this;
        var count = 0;
        _.each(actions, function (action) {
            if (!_this.isHidden(action)) {
                count++;
            }
        });
        return count;
    };
    SecondaryActionsController.prototype.secondaryActionsVisible = function () {
        return this.calcActions(this.config.secondaryGlobalActions) > 0 ||
            this.calcActions(this.config.secondaryLocalActions) > 0;
    };
    SecondaryActionsController.prototype.secondaryDividerVisible = function () {
        return this.calcActions(this.config.secondaryGlobalActions) > 0 &&
            this.calcActions(this.config.secondaryLocalActions) > 0;
    };
    SecondaryActionsController.prototype.clickAction = function (action, $mdOpenMenu) {
        if (!action || action.divider) {
            return;
        }
        if (action.subActions) {
            $mdOpenMenu(this.originatorEv);
            return;
        }
        if (action.click) {
            action.click(action);
            return;
        }
        if (action.href) {
            this.$window.location.href = action.href;
            return;
        }
        if (action.url) {
            this.$location.url(action.url);
            return;
        }
        if (action.state) {
            if (this.$injector.has('this._state')) {
                var _state = this.$injector.has('pipTranslate') ? this.$injector.get('$state') : null;
                if (_state) {
                    _state.go(action.state, action.stateParams);
                }
            }
            return;
        }
        if (action.event) {
            this.$rootScope.$broadcast(action.event);
        }
        else {
            this.$rootScope.$broadcast('pipActionClicked', action.name);
        }
    };
    return SecondaryActionsController;
}());
var SecondaryActionsBindings = {
    localActions: '<pipLocalActions',
    globalActions: '<pipGlobalActions'
};
var SecondaryActionsChanges = (function () {
    function SecondaryActionsChanges() {
    }
    return SecondaryActionsChanges;
}());
(function () {
    var secondaryActions = {
        bindings: SecondaryActionsBindings,
        templateUrl: 'actions/SecondaryActions.html',
        controller: SecondaryActionsController
    };
    angular
        .module('pipActions')
        .component('pipSecondaryActions', secondaryActions);
})();
},{}],5:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipActions', ['ngMaterial', 'pipNav.Templates', 'ui.router']);
require("./ActionsService");
require("./PrimaryActions");
require("./SecondaryActions");
__export(require("./IActionsService"));
},{"./ActionsService":1,"./IActionsService":2,"./PrimaryActions":3,"./SecondaryActions":4}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppBarController = (function () {
    AppBarController.$inject = ['$element', '$rootScope', 'pipAppBar'];
    function AppBarController($element, $rootScope, pipAppBar) {
        "ngInject";
        var _this = this;
        $element.addClass('pip-appbar');
        $element.addClass('color-primary-bg');
        this.config = pipAppBar.config;
        $rootScope.$on('pipAppBarChanged', function (event, config) {
            _this.onAppBarChanged(event, config);
        });
    }
    AppBarController.prototype.onAppBarChanged = function (event, config) {
        this.config = config;
    };
    return AppBarController;
}());
{
    var appbar = {
        transclude: true,
        templateUrl: 'appbar/AppBar.html',
        controller: AppBarController
    };
    angular
        .module('pipAppBar')
        .component('pipAppbar', appbar);
}
},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppBarConfig = (function () {
    function AppBarConfig() {
    }
    return AppBarConfig;
}());
exports.AppBarConfig = AppBarConfig;
},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppBarPartController = (function () {
    AppBarPartController.$inject = ['$scope', '$element', '$attrs', '$log', '$rootScope', 'pipAppBar'];
    function AppBarPartController($scope, $element, $attrs, $log, $rootScope, pipAppBar) {
        "ngInject";
        var _this = this;
        this.$scope = $scope;
        this._partName = String($attrs['pipAppbarPart']);
        this._partValue = null;
        var pos = this._partName.indexOf(':');
        if (pos > 0) {
            this._partValue = this._partName.substr(pos + 1);
            this._partName = this._partName.substr(0, pos);
        }
        this.onAppBarChanged(null, pipAppBar.config);
        $rootScope.$on('pipAppBarChanged', function (event, config) {
            _this.onAppBarChanged(null, config);
        });
    }
    AppBarPartController.prototype.onAppBarChanged = function (event, config) {
        var parts = config.parts || {};
        var currentPartValue = parts[this._partName];
        var visible = !!(this._partValue ? currentPartValue == this._partValue : currentPartValue);
        if (visible != this.$scope['visible'])
            this.$scope['visible'] = visible;
    };
    return AppBarPartController;
}());
(function () {
    appbarPart.$inject = ['ngIfDirective'];
    function appbarPart(ngIfDirective) {
        "ngInject";
        var ngIf = ngIfDirective[0];
        return {
            transclude: ngIf.transclude,
            priority: ngIf.priority,
            terminal: ngIf.terminal,
            restrict: ngIf.restrict,
            scope: true,
            link: function linkFunction($scope, $element, $attrs) {
                $attrs['ngIf'] = function () {
                    return $scope['visible'];
                };
                ngIf.link.apply(ngIf, arguments);
            },
            controller: AppBarPartController
        };
    }
    angular.module('pipAppBar')
        .directive('pipAppbarPart', appbarPart);
})();
},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppBarConfig_1 = require("./AppBarConfig");
exports.AppBarChangedEvent = 'pipAppBarChanged';
var AppBarService = (function () {
    function AppBarService(config, $rootScope) {
        this.$rootScope = $rootScope;
        this._config = config;
    }
    Object.defineProperty(AppBarService.prototype, "config", {
        get: function () {
            return this._config;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppBarService.prototype, "classes", {
        get: function () {
            return this._config.classes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppBarService.prototype, "parts", {
        get: function () {
            return this._config.parts;
        },
        set: function (value) {
            this._config.parts = value || {};
            this.sendConfigEvent();
        },
        enumerable: true,
        configurable: true
    });
    AppBarService.prototype.show = function (parts, classes, shadowBreakpoints) {
        this._config.visible = true;
        this._config.parts = parts || this._config.parts || {};
        this._config.classes = classes || this._config.classes || [];
        if (shadowBreakpoints) {
            this.setShadow(shadowBreakpoints);
        }
        this.sendConfigEvent();
    };
    AppBarService.prototype.hide = function () {
        this._config.visible = false;
        this.sendConfigEvent();
    };
    AppBarService.prototype.hideShadow = function () {
        this._config.classes = _.reject(this._config.classes, function (c) { return c.startsWith('pip-shadow'); });
    };
    AppBarService.prototype.setShadow = function (breakpoints) {
        var _this = this;
        this.hideShadow();
        if (breakpoints != null && breakpoints.length > 0) {
            _.each(breakpoints, function (bp) {
                _this._config.classes.push('pip-shadow-' + bp);
            });
        }
        else {
            this._config.classes.push('pip-shadow');
        }
    };
    AppBarService.prototype.addShadow = function () {
        var breakpoints = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            breakpoints[_i] = arguments[_i];
        }
        this.setShadow(breakpoints);
        this.sendConfigEvent();
    };
    AppBarService.prototype.removeShadow = function () {
        this.hideShadow();
        this.sendConfigEvent();
    };
    AppBarService.prototype.addClass = function () {
        var _this = this;
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        _.each(classes, function (c) {
            _this._config.classes.push(c);
        });
        this.sendConfigEvent();
    };
    AppBarService.prototype.removeClass = function () {
        var _this = this;
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        _.each(classes, function (c) {
            _this._config.classes = _.reject(_this._config.classes, function (cc) { return cc == c; });
        });
        this.sendConfigEvent();
    };
    AppBarService.prototype.part = function (part, value) {
        this._config.parts[part] = value;
        this.sendConfigEvent();
    };
    AppBarService.prototype.sendConfigEvent = function () {
        this.$rootScope.$broadcast(exports.AppBarChangedEvent, this._config);
    };
    return AppBarService;
}());
var AppBarProvider = (function () {
    function AppBarProvider() {
        this._config = {
            visible: true,
            parts: {},
            classes: []
        };
    }
    Object.defineProperty(AppBarProvider.prototype, "config", {
        get: function () {
            return this._config;
        },
        set: function (value) {
            this._config = value || new AppBarConfig_1.AppBarConfig();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppBarProvider.prototype, "parts", {
        get: function () {
            return this._config.parts;
        },
        set: function (value) {
            this._config.parts = value || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppBarProvider.prototype, "classes", {
        get: function () {
            return this._config.classes;
        },
        set: function (value) {
            this._config.classes = value || [];
        },
        enumerable: true,
        configurable: true
    });
    AppBarProvider.prototype.addClass = function () {
        var _this = this;
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        _.each(classes, function (c) {
            _this._config.classes.push(c);
        });
    };
    AppBarProvider.prototype.removeClass = function () {
        var _this = this;
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        _.each(classes, function (c) {
            _this._config.classes = _.reject(_this._config.classes, function (cc) { return cc == c; });
        });
    };
    AppBarProvider.prototype.part = function (part, value) {
        this._config.parts[part] = value;
    };
    AppBarProvider.prototype.$get = ['$rootScope', function ($rootScope) {
        "ngInject";
        if (this._service == null)
            this._service = new AppBarService(this._config, $rootScope);
        return this._service;
    }];
    return AppBarProvider;
}());
angular
    .module('pipAppBar')
    .provider('pipAppBar', AppBarProvider);
},{"./AppBarConfig":7}],10:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular
    .module('pipAppBar', ['ngMaterial', 'pipNav.Templates']);
require("./AppBarConfig");
require("./AppBarService");
require("./AppBar");
require("./AppBarPart");
__export(require("./AppBarService"));
},{"./AppBar":6,"./AppBarConfig":7,"./AppBarPart":8,"./AppBarService":9}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BreadcrumbService_1 = require("./BreadcrumbService");
var BreadcrumbService_2 = require("./BreadcrumbService");
var SearchService_1 = require("../search/SearchService");
var BreadcrumbController = (function () {
    BreadcrumbController.$inject = ['$rootScope', '$window', '$location', '$injector', 'pipBreadcrumb', '$mdMedia', '$state', '$element'];
    function BreadcrumbController($rootScope, $window, $location, $injector, pipBreadcrumb, $mdMedia, $state, $element) {
        "ngInject";
        var _this = this;
        this.$rootScope = $rootScope;
        this.$window = $window;
        this.$location = $location;
        this.$injector = $injector;
        $element.addClass('pip-breadcrumb');
        this.config = pipBreadcrumb.config;
        $rootScope.$on(BreadcrumbService_1.BreadcrumbChangedEvent, function (event, config) {
            _this.onBreadcrumbChanged(event, config);
        });
        $rootScope.$on(BreadcrumbService_2.BreadcrumbBackEvent, function () { _this.onBreadcrumbBack(); });
        var pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
        this._media = pipMedia !== undefined ? pipMedia : $mdMedia;
    }
    BreadcrumbController.prototype.onBreadcrumbChanged = function (event, config) {
        this.config = config;
    };
    BreadcrumbController.prototype.onBreadcrumbBack = function () {
        var items = this.config.items;
        if (_.isArray(items) && items.length > 0) {
            var item = items[items.length - 1];
            if (_.isFunction(item.click)) {
                item.click(item);
            }
            else {
                this.$window.history.back();
            }
        }
        else {
            this.$window.history.back();
        }
    };
    BreadcrumbController.prototype.onClick = function (item) {
        if (_.isFunction(item.click)) {
            item.click(item);
        }
    };
    BreadcrumbController.prototype.openSearch = function () {
        this.$rootScope.$broadcast(SearchService_1.OpenSearchEvent);
    };
    BreadcrumbController.prototype.actionsVisible = function (item) {
        return angular.isArray(item.subActions) && item.subActions.length > 1;
    };
    BreadcrumbController.prototype.onOpenMenu = function ($mdOpenMenu, event) {
        this.originatorEv = event;
        $mdOpenMenu(this.originatorEv);
    };
    BreadcrumbController.prototype.onSubActionClick = function (action) {
        if (!action || action.divider) {
            return;
        }
        if (_.isFunction(action.click)) {
            action.click(action);
            return;
        }
        if (action.href) {
            this.$window.location.href = action.href;
            return;
        }
        if (action.url) {
            this.$location.url(action.url);
            return;
        }
        if (action.state) {
            if (this.$injector.has('$state')) {
                var _state = this.$injector.get('$state');
                _state.go(action.state, action.stateParams);
            }
            return;
        }
        if (action.event) {
            this.$rootScope.$broadcast(action.event);
            this.originatorEv = null;
        }
        else {
            this.$rootScope.$broadcast('pipActionClicked', action.name);
            this.originatorEv = null;
        }
    };
    return BreadcrumbController;
}());
var breadcrumb = {
    bindings: {},
    templateUrl: 'breadcrumb/Breadcrumb.html',
    controller: BreadcrumbController
};
angular
    .module('pipBreadcrumb')
    .component('pipBreadcrumb', breadcrumb);
},{"../search/SearchService":35,"./BreadcrumbService":13}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BreadcrumbItem = (function () {
    function BreadcrumbItem() {
        this.title = null;
        this.click = null;
        this.subActions = null;
    }
    return BreadcrumbItem;
}());
exports.BreadcrumbItem = BreadcrumbItem;
var BreadcrumbConfig = (function () {
    function BreadcrumbConfig() {
    }
    return BreadcrumbConfig;
}());
exports.BreadcrumbConfig = BreadcrumbConfig;
},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BreadcrumbConfig_1 = require("./BreadcrumbConfig");
exports.BreadcrumbChangedEvent = "pipBreadcrumbChanged";
exports.BreadcrumbBackEvent = "pipBreadcrumbBack";
var BreadcrumbService = (function () {
    function BreadcrumbService($rootScope, config) {
        this.$rootScope = $rootScope;
        this._config = config;
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
            this.sendConfigEvent();
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
            this.sendConfigEvent();
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
            this.sendConfigEvent();
        },
        enumerable: true,
        configurable: true
    });
    BreadcrumbService.prototype.showText = function (text, criteria) {
        this._config.text = text;
        this._config.items = null;
        this._config.criteria = criteria;
        this.sendConfigEvent();
    };
    BreadcrumbService.prototype.showItems = function (items, criteria) {
        this._config.items = items || [];
        this._config.text = null;
        this._config.criteria = criteria;
        this.sendConfigEvent();
    };
    BreadcrumbService.prototype.sendConfigEvent = function () {
        this.$rootScope.$broadcast(exports.BreadcrumbChangedEvent, this._config);
    };
    return BreadcrumbService;
}());
var BreadcrumbProvider = (function () {
    function BreadcrumbProvider() {
        this._config = new BreadcrumbConfig_1.BreadcrumbConfig();
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
            this._service = new BreadcrumbService($rootScope, this._config);
        return this._service;
    }];
    return BreadcrumbProvider;
}());
angular
    .module('pipBreadcrumb')
    .provider('pipBreadcrumb', BreadcrumbProvider);
},{"./BreadcrumbConfig":12}],14:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipBreadcrumb', ['ngMaterial', 'pipNav.Templates', 'pipNav.Translate']);
require("./Breadcrumb");
require("./BreadcrumbService");
__export(require("./BreadcrumbService"));
},{"./Breadcrumb":11,"./BreadcrumbService":13}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NavService = (function () {
    NavService.$inject = ['$injector'];
    function NavService($injector) {
        "ngInject";
        this.appbar = $injector.has('pipAppBar') ? $injector.get('pipAppBar') : null;
        this.icon = $injector.has('pipNavIcon') ? $injector.get('pipNavIcon') : null;
        this.breadcrumb = $injector.has('pipBreadcrumb') ? $injector.get('pipBreadcrumb') : null;
        this.actions = $injector.has('pipActions') ? $injector.get('pipActions') : null;
        this.search = $injector.has('pipSearch') ? $injector.get('pipSearch') : null;
        this.sidenav = $injector.has('pipSideNav') ? $injector.get('pipSideNav') : null;
        this.header = $injector.has('pipNavHeader') ? $injector.get('pipNavHeader') : null;
        this.menu = $injector.has('pipNavMenu') ? $injector.get('pipNavMenu') : null;
    }
    NavService.prototype.reset = function () {
        if (this.appbar) {
            this.appbar.show();
        }
        if (this.icon) {
            this.icon.showMenu();
        }
        if (this.breadcrumb) {
            this.breadcrumb.showText(null);
        }
        if (this.actions) {
            this.actions.show();
        }
        if (this.search) {
            this.search.set(null);
        }
        if (this.sidenav) {
            this.sidenav.show();
        }
    };
    return NavService;
}());
angular
    .module('pipNavService', [])
    .service('pipNavService', NavService);
},{}],16:[function(require,module,exports){
{
    translateFilter.$inject = ['$injector'];
    function translateFilter($injector) {
        "ngInject";
        var pipTranslate = $injector.has('pipTranslate')
            ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate.translate(key) || key : key;
        };
    }
    angular
        .module('pipNav.Translate', [])
        .filter('translate', translateFilter);
}
},{}],17:[function(require,module,exports){
{
    var DropdownController = (function () {
        DropdownController.$inject = ['$scope', '$timeout', '$element', '$attrs', '$injector', '$log', '$rootScope', '$mdMedia'];
        function DropdownController($scope, $timeout, $element, $attrs, $injector, $log, $rootScope, $mdMedia) {
            "ngInject";
            this.$scope = $scope;
            this.$timeout = $timeout;
            this._pipTheme = $injector.has('pipTheme') ? $injector.get('pipTheme') : null;
            this._pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
            if (this._pipTheme) {
                this.currentTheme = this._pipTheme.theme;
            }
            else if ($rootScope['$theme']) {
                this.currentTheme = $rootScope['$theme'];
            }
            this.themeClass = ($attrs['class'] || '') + ' md-' + this.currentTheme + '-theme';
            this.media = !_.isUndefined(this._pipMedia) ? this._pipMedia : $mdMedia;
            this.actions = (this.actions && _.isArray(this.actions)) ? this.actions : [];
            this.activeIndex = this.activeIndex || 0;
        }
        DropdownController.prototype.disabled = function () {
            if (this.ngDisabled) {
                return this.ngDisabled();
            }
            else {
                return false;
            }
        };
        DropdownController.prototype.onSelect = function (index) {
            var _this = this;
            this.activeIndex = index;
            if (this.select) {
                this.select(this.actions[index], this.activeIndex);
            }
            if (this.pipChange) {
                this.$timeout(function () {
                    _this.pipChange();
                });
            }
        };
        DropdownController.prototype.show = function () {
            var result;
            if (this.showDropdown()) {
                return !!this.showDropdown();
            }
            else {
                return true;
            }
        };
        return DropdownController;
    }());
    var DropdownBindings = {
        ngDisabled: '&',
        actions: '=pipActions',
        showDropdown: '&pipShow',
        activeIndex: '=pipActiveIndex',
        select: '=pipDropdownSelect',
        pipChange: '&'
    };
    var DropdownChanges = (function () {
        function DropdownChanges() {
        }
        return DropdownChanges;
    }());
    var dropdown = {
        bindings: DropdownBindings,
        templateUrl: 'dropdown/Dropdown.html',
        controller: DropdownController
    };
    angular
        .module('pipDropdown', ['pipNav.Templates'])
        .component('pipDropdown', dropdown);
}
},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
{
    var NavHeaderController = (function () {
        NavHeaderController.$inject = ['$element', '$scope', '$log', '$rootScope', '$timeout', 'pipNavHeader', 'navConstant'];
        function NavHeaderController($element, $scope, $log, $rootScope, $timeout, pipNavHeader, navConstant) {
            "ngInject";
            var _this = this;
            this.$element = $element;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$timeout = $timeout;
            this.pipNavHeader = pipNavHeader;
            this.imageUrl = null;
            $element.addClass('pip-sticky-nav-header');
            this.initImage();
            this.cleanupNavHeaderChanged = $rootScope.$on('pipNavHeaderChanged', function ($event, config) {
                _this.onNavHeaderChanged($event, config);
            });
            this.cleanupSideNavStateChanged = $rootScope.$on('pipSideNavStateChanged', function ($event, state) {
                _this.onStateChanged($event, state);
            });
        }
        NavHeaderController.prototype.$onDestroy = function () {
            if (angular.isFunction(this.cleanupNavHeaderChanged)) {
                this.cleanupNavHeaderChanged();
            }
            if (angular.isFunction(this.cleanupSideNavStateChanged)) {
                this.cleanupSideNavStateChanged();
            }
        };
        NavHeaderController.prototype.initImage = function () {
            var _this = this;
            this.imageBlock = this.$element.find('.pip-sticky-nav-header-user');
            this.$timeout(function () {
                _this.image = _this.$element.find('.pip-sticky-nav-header-user-image');
                if (_this.image[0]) {
                    _this.image[0].onload = (function () { return _this.onImageLoad(); });
                    _this.image[0].onerror = (function () { return _this.onImageError(); });
                }
                else {
                    _this.image.onload = (function () { return _this.onImageLoad(); });
                    _this.image.onerror = (function () { return _this.onImageError(); });
                }
                _this.onNavHeaderChanged(null, _this.pipNavHeader.config);
            }, 20);
        };
        NavHeaderController.prototype.initHeader = function () {
            if (!this.pipNavHeader.config)
                return;
            this.title = this.pipNavHeader.config.title;
            this.subtitle = this.pipNavHeader.config.subtitle;
            this.imageUrl = this.pipNavHeader.config.imageUrl;
            this.imageCss = this.pipNavHeader.config.imageCss;
        };
        NavHeaderController.prototype.onImageLoad = function () {
            this.setImageMarginCSS(this.image);
        };
        ;
        NavHeaderController.prototype.onImageError = function () {
            var _this = this;
            if (this.loadedDefaultImage)
                return;
            this.$scope.$apply(function () {
                _this.setImage(_this.pipNavHeader.config, true);
            });
        };
        ;
        NavHeaderController.prototype.onStateChanged = function (event, state) {
            var _this = this;
            if (state === undefined)
                return;
            if (state.id == 'toggle') {
                this.$timeout(function () {
                    _this.showHeader = state && state.id == 'toggle';
                }, 400);
            }
            else {
                this.showHeader = false;
            }
        };
        NavHeaderController.prototype.setImageMarginCSS = function (image) {
            var cssParams = {}, containerWidth = this.imageBlock.width ? this.imageBlock.width() : this.imageBlock.clientWidth, containerHeight = this.imageBlock.height ? this.imageBlock.height() : this.imageBlock.clientHeight, imageWidth = image[0]['naturalWidth'] || image.width, imageHeight = image[0]['naturalHeight'] || image.height, margin = 0;
            if ((imageWidth / containerWidth) > (imageHeight / containerHeight)) {
                margin = -((imageWidth / imageHeight * containerHeight - containerWidth) / 2);
                cssParams['margin-left'] = '' + margin + 'px';
                cssParams['height'] = '' + containerHeight + 'px';
                cssParams['width'] = '' + imageWidth * containerHeight / imageHeight + 'px';
                cssParams['margin-top'] = '';
            }
            else {
                margin = -((imageHeight / imageWidth * containerWidth - containerHeight) / 2);
                cssParams['margin-top'] = '' + margin + 'px';
                cssParams['height'] = '' + imageHeight * containerWidth / imageWidth + 'px';
                cssParams['width'] = '' + containerWidth + 'px';
                cssParams['margin-left'] = '';
            }
            image.css(cssParams);
        };
        ;
        NavHeaderController.prototype.setImage = function (config, loadError) {
            if (!config)
                return;
            var url;
            if (!loadError && !!config.imageUrl) {
                url = config.imageUrl;
            }
            else {
                this.loadedDefaultImage = true;
                url = config.defaultImageUrl;
            }
            if (url && this.image) {
                this.image.attr('src', url);
            }
            else {
                this.imageBlock.css("display", "none");
            }
        };
        NavHeaderController.prototype.onNavHeaderChanged = function ($event, config) {
            if (!config)
                return;
            this.title = config.title;
            this.subtitle = config.subtitle;
            this.imageUrl = config.imageUrl;
            this.imageCss = config.imageCss;
            this.setImage(config, false);
        };
        NavHeaderController.prototype.onUserClick = function () {
            this.$rootScope.$broadcast('pipNavUserClicked');
        };
        return NavHeaderController;
    }());
    var navHeader = {
        templateUrl: 'header/NavHeader.html',
        controller: NavHeaderController
    };
    angular
        .module('pipNavHeader')
        .component('pipNavHeader', navHeader);
}
},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NavHeaderConfig = (function () {
    function NavHeaderConfig() {
    }
    return NavHeaderConfig;
}());
exports.NavHeaderConfig = NavHeaderConfig;
;
},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NavHeaderConfig_1 = require("./NavHeaderConfig");
exports.NavHeaderChangedEvent = 'pipNavHeaderChanged';
var NavHeaderService = (function () {
    function NavHeaderService(config, $rootScope) {
        this.$rootScope = $rootScope;
        this._config = config;
    }
    Object.defineProperty(NavHeaderService.prototype, "config", {
        get: function () {
            return this._config;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavHeaderService.prototype, "title", {
        get: function () {
            return this._config.title;
        },
        set: function (value) {
            this._config.title = value;
            this.sendConfigEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavHeaderService.prototype, "subtitle", {
        get: function () {
            return this._config.subtitle;
        },
        set: function (value) {
            this._config.subtitle = value;
            this.sendConfigEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavHeaderService.prototype, "imageUrl", {
        get: function () {
            return this._config.imageUrl;
        },
        set: function (value) {
            this._config.imageUrl = value;
            this.sendConfigEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavHeaderService.prototype, "click", {
        get: function () {
            return this._config.click;
        },
        set: function (value) {
            this._config.click = value;
            this.sendConfigEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavHeaderService.prototype, "event", {
        get: function () {
            return this._config.event;
        },
        set: function (value) {
            this._config.event = value;
            this.sendConfigEvent();
        },
        enumerable: true,
        configurable: true
    });
    NavHeaderService.prototype.show = function (title, subtitle, imageUrl, callbackOrEvent) {
        this._config.title = title;
        this._config.subtitle = subtitle;
        this._config.imageUrl = imageUrl;
        if (_.isFunction(callbackOrEvent)) {
            this._config.click = callbackOrEvent;
        }
        else {
            this._config.click = null;
        }
        if (_.isString(callbackOrEvent)) {
            this._config.event = callbackOrEvent;
        }
        else {
            this._config.event = null;
        }
        this.sendConfigEvent();
    };
    NavHeaderService.prototype.hide = function () {
        this._config.title = null;
        this._config.subtitle = null;
        this._config.imageUrl = null;
        this._config.click = null;
        this._config.event = null;
        this.sendConfigEvent();
    };
    NavHeaderService.prototype.sendConfigEvent = function () {
        this.$rootScope.$emit(exports.NavHeaderChangedEvent, this._config);
    };
    return NavHeaderService;
}());
var NavHeaderProvider = (function () {
    function NavHeaderProvider() {
        this._config = new NavHeaderConfig_1.NavHeaderConfig();
    }
    Object.defineProperty(NavHeaderProvider.prototype, "config", {
        get: function () {
            return this._config;
        },
        set: function (value) {
            this._config = value || new NavHeaderConfig_1.NavHeaderConfig();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavHeaderProvider.prototype, "defaultImageUrl", {
        get: function () {
            return this._config.defaultImageUrl;
        },
        set: function (value) {
            this._config.defaultImageUrl = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavHeaderProvider.prototype, "title", {
        get: function () {
            return this._config.title;
        },
        set: function (value) {
            this._config.title = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavHeaderProvider.prototype, "subtitle", {
        get: function () {
            return this._config.subtitle;
        },
        set: function (value) {
            this._config.subtitle = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavHeaderProvider.prototype, "imageUrl", {
        get: function () {
            return this._config.imageUrl;
        },
        set: function (value) {
            this._config.imageUrl = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavHeaderProvider.prototype, "click", {
        get: function () {
            return this._config.click;
        },
        set: function (value) {
            this._config.click = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavHeaderProvider.prototype, "event", {
        get: function () {
            return this._config.event;
        },
        set: function (value) {
            this._config.event = value;
        },
        enumerable: true,
        configurable: true
    });
    NavHeaderProvider.prototype.set = function (title, subtitle, imageUrl, callbackOrEvent) {
        this._config.title = title;
        this._config.subtitle = subtitle;
        this._config.imageUrl = imageUrl;
        if (_.isFunction(callbackOrEvent)) {
            this._config.click = callbackOrEvent;
        }
        else {
            this._config.click = null;
        }
        if (_.isString(callbackOrEvent)) {
            this._config.event = callbackOrEvent;
        }
        else {
            this._config.event = null;
        }
    };
    NavHeaderProvider.prototype.clear = function () {
        this._config.title = null;
        this._config.subtitle = null;
        this._config.imageUrl = null;
        this._config.click = null;
        this._config.event = null;
    };
    NavHeaderProvider.prototype.$get = ['$rootScope', function ($rootScope) {
        "ngInject";
        if (this._service == null)
            this._service = new NavHeaderService(this._config, $rootScope);
        return this._service;
    }];
    return NavHeaderProvider;
}());
angular
    .module('pipNavHeader')
    .provider('pipNavHeader', NavHeaderProvider);
},{"./NavHeaderConfig":19}],21:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipNavHeader', ['ngMaterial', 'pipNav.Templates']);
require("./NavHeaderService");
require("./NavHeader");
__export(require("./NavHeaderService"));
},{"./NavHeader":18,"./NavHeaderService":20}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
},{}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SideNavService_1 = require("../sidenav/SideNavService");
var NavIconService_1 = require("./NavIconService");
var NavIconBindings = {
    type: '<?pipType',
    imageUrl: '<?pipImageUrl',
    icon: '<?pipIcon'
};
var NavIconChanges = (function () {
    function NavIconChanges() {
    }
    return NavIconChanges;
}());
var NavIconController = (function () {
    NavIconController.$inject = ['$rootScope', '$window', '$element', '$scope', '$log', 'pipNavIcon'];
    function NavIconController($rootScope, $window, $element, $scope, $log, pipNavIcon) {
        "ngInject";
        var _this = this;
        this.$rootScope = $rootScope;
        this.$window = $window;
        $element.addClass('pip-nav-icon');
        this.config = pipNavIcon.config;
        this.clearFn = $rootScope.$on('pipNavIconChanged', function (event, config) {
            _this.onNavIconChanged(event, config);
        });
    }
    NavIconController.prototype.$onInit = function () {
        if (this.type) {
            this.config.type = this.type;
        }
        if (this.imageUrl) {
            this.config.imageUrl = this.imageUrl;
        }
        if (this.icon) {
            this.config.icon = this.icon;
        }
    };
    NavIconController.prototype.$onDestroy = function () {
        if (_.isFunction(this.clearFn)) {
            this.clearFn();
        }
    };
    NavIconController.prototype.onNavIconChanged = function (event, config) {
        this.config = config;
    };
    NavIconController.prototype.onNavIconClick = function () {
        if (_.isFunction(this.config.click)) {
            this.config.click();
        }
        else if (this.config.event) {
            this.$rootScope.$broadcast(this.config.event);
        }
        else if (this.config.type == 'menu') {
            this.$rootScope.$broadcast(SideNavService_1.OpenSideNavEvent);
        }
        else if (this.config.type == 'back') {
            this.$window.history.back();
        }
        else {
            this.$rootScope.$broadcast(NavIconService_1.NavIconClickedEvent);
        }
    };
    return NavIconController;
}());
var NavIcon = {
    bindings: NavIconBindings,
    templateUrl: 'icon/NavIcon.html',
    controller: NavIconController
};
angular
    .module('pipNavIcon')
    .component('pipNavIcon', NavIcon);
},{"../sidenav/SideNavService":39,"./NavIconService":25}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NavIconConfig = (function () {
    function NavIconConfig() {
    }
    return NavIconConfig;
}());
exports.NavIconConfig = NavIconConfig;
;
},{}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NavIconConfig_1 = require("./NavIconConfig");
exports.NavIconClickedEvent = 'pipNavIconClicked';
exports.NavIconChangedEvent = 'pipNavIconChanged';
var NavIconService = (function () {
    function NavIconService(config, $rootScope) {
        this.$rootScope = $rootScope;
        this._config = config;
    }
    Object.defineProperty(NavIconService.prototype, "config", {
        get: function () {
            return this._config;
        },
        enumerable: true,
        configurable: true
    });
    NavIconService.prototype.setCallbackOrEvent = function (callbackOrEvent) {
        if (_.isFunction(callbackOrEvent)) {
            this._config.click = callbackOrEvent;
            this._config.event = null;
        }
        else if (_.isString(callbackOrEvent)) {
            this._config.click = null;
            this._config.event = callbackOrEvent;
        }
        else {
            this._config.click = null;
            this._config.event = null;
        }
    };
    NavIconService.prototype.showMenu = function (callbackOrEvent) {
        this._config.type = 'menu';
        this.setCallbackOrEvent(callbackOrEvent);
        this.sendConfigEvent();
    };
    NavIconService.prototype.showIcon = function (icon, callbackOrEvent) {
        this._config.type = 'icon';
        this._config.icon = icon;
        this.setCallbackOrEvent(callbackOrEvent);
        this.sendConfigEvent();
    };
    NavIconService.prototype.showBack = function (callbackOrEvent) {
        this._config.type = 'back';
        this.setCallbackOrEvent(callbackOrEvent);
        this.sendConfigEvent();
    };
    NavIconService.prototype.showImage = function (imageUrl, callbackOrEvent) {
        this._config.type = 'image';
        this._config.imageUrl = imageUrl;
        this.setCallbackOrEvent(callbackOrEvent);
        this.sendConfigEvent();
    };
    NavIconService.prototype.hide = function () {
        this._config.type = 'none';
        this.setCallbackOrEvent(null);
        this.sendConfigEvent();
    };
    NavIconService.prototype.sendConfigEvent = function () {
        this.$rootScope.$broadcast(exports.NavIconChangedEvent, this._config);
    };
    return NavIconService;
}());
var NavIconProvider = (function () {
    function NavIconProvider() {
        this._config = new NavIconConfig_1.NavIconConfig();
    }
    Object.defineProperty(NavIconProvider.prototype, "config", {
        get: function () {
            return this._config;
        },
        set: function (value) {
            this._config = value || new NavIconConfig_1.NavIconConfig();
        },
        enumerable: true,
        configurable: true
    });
    NavIconProvider.prototype.setCallbackOrEvent = function (callbackOrEvent) {
        if (_.isFunction(callbackOrEvent))
            this._config.click = callbackOrEvent;
        else
            this._config.click = null;
        if (_.isString(callbackOrEvent))
            this._config.event = callbackOrEvent;
        else
            this._config.event = null;
    };
    NavIconProvider.prototype.setMenu = function (callbackOrEvent) {
        this._config.type = 'menu';
        this.setCallbackOrEvent(callbackOrEvent);
    };
    NavIconProvider.prototype.setIcon = function (icon, callbackOrEvent) {
        this._config.type = 'icon';
        this._config.icon = icon;
        this.setCallbackOrEvent(callbackOrEvent);
    };
    NavIconProvider.prototype.setBack = function (callbackOrEvent) {
        this._config.type = 'back';
        this.setCallbackOrEvent(callbackOrEvent);
    };
    NavIconProvider.prototype.setImage = function (imageUrl, callbackOrEvent) {
        this._config.type = 'image';
        this._config.imageUrl = imageUrl;
        this.setCallbackOrEvent(callbackOrEvent);
    };
    NavIconProvider.prototype.clear = function () {
        this._config.type = 'none';
        this.setCallbackOrEvent(null);
    };
    NavIconProvider.prototype.$get = ['$rootScope', function ($rootScope) {
        "ngInject";
        if (this._service == null)
            this._service = new NavIconService(this._config, $rootScope);
        return this._service;
    }];
    return NavIconProvider;
}());
angular
    .module('pipNavIcon')
    .provider('pipNavIcon', NavIconProvider);
},{"./NavIconConfig":24}],26:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipNavIcon', ['ngMaterial', 'pipNav.Translate', 'pipNav.Templates']);
require("./NavIconConfig");
require("./INavIconService");
require("./NavIconService");
require("./NavIcon");
__export(require("./NavIconConfig"));
__export(require("./NavIconService"));
},{"./INavIconService":22,"./NavIcon":23,"./NavIconConfig":24,"./NavIconService":25}],27:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
require("./dependencies/TranslateFilter");
require("./language/LanguagePickerDirective");
require("./dropdown/Dropdown");
require("./tabs/Tabs");
require("./actions");
require("./appbar");
require("./search");
require("./breadcrumb");
require("./sidenav");
require("./header");
require("./menu");
require("./icon");
require("./common/NavService");
angular
    .module('pipNav', [
    'pipNavService',
    'pipDropdown',
    'pipTabs',
    'pipAppBar',
    'pipSearchBar',
    'pipNavIcon',
    'pipBreadcrumb',
    'pipLanguagePicker',
    'pipActions',
    'pipSideNav',
    'pipNavMenu',
    'pipNavHeader'
])
    .constant('navConstant', {
    'TAB_BREAKPOINT': 'gt-sm',
    'SIDENAV_CONTAINER': '.pip-main',
    'SIDENAV_LARGE_WIDTH': 320,
    'SIDENAV_MIDDLE_WIDTH': 240,
    'SIDENAV_SMALL_WIDTH': 72,
    'SIDENAV_ANIMATION_DURATION': 600
});
__export(require("./actions"));
__export(require("./appbar"));
__export(require("./breadcrumb"));
__export(require("./sidenav"));
__export(require("./icon"));
__export(require("./header"));
},{"./actions":5,"./appbar":10,"./breadcrumb":14,"./common/NavService":15,"./dependencies/TranslateFilter":16,"./dropdown/Dropdown":17,"./header":21,"./icon":26,"./language/LanguagePickerDirective":28,"./menu":31,"./search":36,"./sidenav":41,"./tabs/Tabs":42}],28:[function(require,module,exports){
{
    var LanguagePickerDirectiveController = (function () {
        LanguagePickerDirectiveController.$inject = ['$element', '$injector', '$rootScope'];
        function LanguagePickerDirectiveController($element, $injector, $rootScope) {
            "ngInject";
            this.languages = ['en', 'ru'];
            this.value = null;
            this._translate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
            $element.addClass('pip-language-picker');
            this.setLanguages(this.languages);
            this.value = this.value || this.languages[0];
        }
        Object.defineProperty(LanguagePickerDirectiveController.prototype, "language", {
            get: function () {
                return this._translate ? this._translate.language : null;
            },
            enumerable: true,
            configurable: true
        });
        LanguagePickerDirectiveController.prototype.setLanguages = function (languages) {
            this.languages = languages.length > 0 ? languages : ['en', 'ru'];
        };
        LanguagePickerDirectiveController.prototype.onLanguageClick = function (language) {
            if (this._translate != null) {
                this.value = language;
                this._translate.language = this.value;
            }
        };
        return LanguagePickerDirectiveController;
    }());
    var LanguagePickerBindings = {
        languages: '<languages',
        value: '=?value'
    };
    var languagePickerDirective = {
        bindings: LanguagePickerBindings,
        templateUrl: 'language/LanguagePicker.html',
        controller: LanguagePickerDirectiveController
    };
    angular
        .module('pipLanguagePicker', [
        'ngMaterial', 'pipNav.Translate', 'pipNav.Templates'
    ])
        .component('pipLanguagePicker', languagePickerDirective);
}
},{}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var NavMenuController = (function () {
        NavMenuController.$inject = ['$scope', '$window', '$location', '$rootScope', '$timeout', 'pipSideNav', 'pipNavMenu', '$element', '$injector', 'navConstant'];
        function NavMenuController($scope, $window, $location, $rootScope, $timeout, pipSideNav, pipNavMenu, $element, $injector, navConstant) {
            "ngInject";
            var _this = this;
            this.$scope = $scope;
            this.$window = $window;
            this.$location = $location;
            this.$rootScope = $rootScope;
            this.$timeout = $timeout;
            this.pipSideNav = pipSideNav;
            this.pipNavMenu = pipNavMenu;
            this._state = $injector.has('$state') ? $injector.get('$state') : null;
            this._animationDuration = navConstant.SIDENAV_ANIMATION_DURATION,
                this._pipSideNavElement = $element.parent().parent();
            $element.addClass('pip-sticky-nav-menu');
            this.sections = this.$scope['sections'] || this.pipNavMenu.sections;
            this.setCollapsible();
            this.defaultIcon = this.pipNavMenu.defaultIcon;
            this.onStateChanged(null, this.pipSideNav.state);
            var cleanupNavMenuChanged = this.$rootScope.$on('pipNavMenuChanged', function ($event, config) {
                _this.onConfigChanged($event, config);
            });
            var cleanupSideNavStateChanged = this.$rootScope.$on('pipSideNavStateChanged', function ($event, state) {
                _this.onStateChanged($event, state);
            });
            this.$scope.$on('$destroy', function () {
                if (angular.isFunction(cleanupNavMenuChanged)) {
                    cleanupNavMenuChanged();
                }
                if (angular.isFunction(cleanupSideNavStateChanged)) {
                    cleanupSideNavStateChanged();
                }
            });
        }
        NavMenuController.prototype.setCollapsible = function () {
            var collapsed;
            if (angular.isFunction(this.$scope['collapsed'])) {
                collapsed = this.$scope['collapsed']();
            }
            else {
                collapsed = this.$scope['collapsed'] !== false && this.$scope['collapsed'] !== 'false';
            }
            this.isCollapsed = collapsed;
        };
        NavMenuController.prototype.onExpand = function () {
            if (!this.isCollapsed) {
                return;
            }
            this.expanded = !this.expanded;
            if (this.expanded) {
                this._pipSideNavElement.removeClass('pip-sticky-nav-small');
            }
            else {
                this._pipSideNavElement.addClass('pip-sticky-nav-small');
            }
            this.$rootScope.$emit('pipNavExpanded', this.expanded);
        };
        NavMenuController.prototype.isHidden = function (item) {
            return item && item.access && !item.access(item);
        };
        NavMenuController.prototype.isSectionEmpty = function (linkCollection) {
            var _this = this;
            var result = true;
            _.each(linkCollection, function (link) {
                if (!_this.isHidden(link)) {
                    result = false;
                }
            });
            return result;
        };
        NavMenuController.prototype.onConfigChanged = function ($event, config) {
            if (!config)
                return;
            this.sections = config.sections;
        };
        NavMenuController.prototype.onStateChanged = function (event, state) {
            if (!state)
                return;
            this.isCollapsed = state.expand;
            this.expanded = state.isExpanded;
            this.expandedButton = state.expandedButton;
            this.sideNavState = state;
        };
        NavMenuController.prototype.isActive = function (link) {
            if (link.parentState) {
                if (this._state != null && this._state.includes(link.parentState)) {
                    return true;
                }
            }
            else if (link.state) {
                if (this._state != null && this._state.includes(link.state)) {
                    return true;
                }
            }
            else if (link.href) {
                if (link.href.split('?')[0] === this.$window.location.href.split('?')[0]) {
                    return true;
                }
            }
            else if (link.url) {
                if (link.url.split(/[\s/?]+/)[1] === this.$location.url().split(/[\s/?]+/)[1]) {
                    return true;
                }
            }
            return false;
        };
        NavMenuController.prototype.clickLink = function (event, link) {
            var _this = this;
            event.stopPropagation();
            if (!link) {
                this.pipSideNav.close();
                return;
            }
            if (link.href) {
                if (link.href.split('?')[0] === this.$window.location.href.split('?')[0]) {
                    this.pipSideNav.close();
                    return;
                }
                this.pipSideNav.close();
                this.$timeout(function () {
                    _this.$window.location.href = link.href;
                }, this._animationDuration);
                return;
            }
            else if (link.url) {
                if (link.url.split(/[\s/?]+/)[1] === this.$location.url().split(/[\s/?]+/)[1]) {
                    this.pipSideNav.close();
                    return;
                }
                this.pipSideNav.close();
                this.$timeout(function () {
                    _this.$location.url(link.url);
                }, this._animationDuration);
                return;
            }
            else if (link.state) {
                if (this._state != null && this._state.current.name === link.state) {
                    this.pipSideNav.close();
                    return;
                }
                this.pipSideNav.close();
                this.$timeout(function () {
                    _this._state.go(link.state, link.stateParams);
                }, this._animationDuration);
                return;
            }
            else if (link.event) {
                this.$rootScope.$broadcast(link.event, link);
            }
            this.pipSideNav.close();
        };
        return NavMenuController;
    }());
    var NavMenuBindings = {
        sections: '=?pipSections',
        collapsed: '=?pipCollapsed'
    };
    function navMenuDirective() {
        return {
            restrict: 'EA',
            scope: NavMenuBindings,
            replace: false,
            templateUrl: 'menu/NavMenu.html',
            controller: NavMenuController,
            controllerAs: '$ctrl'
        };
    }
    angular
        .module('pipNavMenu')
        .directive('pipNavMenu', navMenuDirective);
})();
},{}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavMenuChangedEvent = 'pipNavMenuChanged';
var NavMenuService = (function () {
    function NavMenuService(config, $rootScope) {
        this._config = config;
        this._rootScope = $rootScope;
    }
    Object.defineProperty(NavMenuService.prototype, "sections", {
        get: function () {
            return this._config.sections;
        },
        set: function (value) {
            this._config.sections = value || [];
            this.sendChangeEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavMenuService.prototype, "defaultIcon", {
        get: function () {
            return this._config.defaultIcon;
        },
        set: function (value) {
            this._config.defaultIcon = value;
            this.sendChangeEvent();
        },
        enumerable: true,
        configurable: true
    });
    NavMenuService.prototype.updateBadgeStyle = function (link, style) {
        if (link == null || !_.isString(style))
            return;
        _.each(this._config.sections, function (s) {
            _.each(s.links, function (l) {
                if (l.name == link)
                    l.badgeStyle = style;
            });
        });
        this.sendChangeEvent();
    };
    NavMenuService.prototype.updateCount = function (link, count) {
        if (link == null || !_.isNumber(count))
            return;
        _.each(this._config.sections, function (s) {
            _.each(s.links, function (l) {
                if (l.name == link)
                    l.count = count;
            });
        });
        this.sendChangeEvent();
    };
    NavMenuService.prototype.clearCounts = function () {
        _.each(this._config.sections, function (s) {
            _.each(s.links, function (l) {
                l.count = null;
            });
        });
        this.sendChangeEvent();
    };
    NavMenuService.prototype.sendChangeEvent = function () {
        this._rootScope.$emit(exports.NavMenuChangedEvent, this._config);
    };
    return NavMenuService;
}());
var NavMenuProvider = (function () {
    function NavMenuProvider() {
        this._config = {
            sections: [],
            defaultIcon: 'icons:folder'
        };
    }
    Object.defineProperty(NavMenuProvider.prototype, "sections", {
        get: function () {
            return this._config.sections;
        },
        set: function (value) {
            this._config.sections = value || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavMenuProvider.prototype, "defaultIcon", {
        get: function () {
            return this._config.defaultIcon;
        },
        set: function (value) {
            this._config.defaultIcon = value;
        },
        enumerable: true,
        configurable: true
    });
    NavMenuProvider.prototype.$get = ['$rootScope', function ($rootScope) {
        "ngInject";
        if (this._service == null)
            this._service = new NavMenuService(this._config, $rootScope);
        return this._service;
    }];
    return NavMenuProvider;
}());
angular
    .module('pipNavMenu')
    .provider('pipNavMenu', NavMenuProvider);
},{}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipNavMenu', ['ngMaterial', 'pipNav.Translate', 'pipNav.Templates']);
require("./NavMenuService");
require("./NavMenu");
},{"./NavMenu":29,"./NavMenuService":30}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
},{}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SearchService_1 = require("./SearchService");
var SearchBarController = (function () {
    SearchBarController.$inject = ['$element', '$rootScope', 'pipSearch'];
    function SearchBarController($element, $rootScope, pipSearch) {
        "ngInject";
        var _this = this;
        this.$element = $element;
        this.$rootScope = $rootScope;
        this.enabled = false;
        this.search = { text: '' };
        $element.addClass('pip-search-bar');
        this.config = pipSearch.config;
        this.stateChange();
        this.clearFn = $rootScope.$on(SearchService_1.SearchChangedEvent, function (event, config) {
            _this.onSearchChanged(event, config);
        });
    }
    SearchBarController.prototype.$onDestroy = function () {
        if (_.isFunction(this.clearFn)) {
            this.clearFn();
        }
    };
    SearchBarController.prototype.stateChange = function () {
        if (this.enabled) {
            this.$element.addClass('w-stretch');
            this.$element.parent().addClass('pip-search-active');
        }
        else {
            this.$element.removeClass('w-stretch');
            this.$element.parent().removeClass('pip-search-active');
        }
    };
    SearchBarController.prototype.onSearchChanged = function (event, config) {
        this.config = config;
        this.enabled = false;
        this.search.text = '';
        this.stateChange();
    };
    SearchBarController.prototype.focusText = function () {
        setTimeout(function () {
            var element = $('.pip-search-text');
            if (element.length > 0)
                element.focus();
        }, 0);
    };
    SearchBarController.prototype.enable = function () {
        this.search.text = this.config.criteria;
        this.enabled = true;
        this.focusText();
        this.stateChange();
    };
    SearchBarController.prototype.onClick = function () {
        var search = this.search.text;
        this.search.text = '';
        this.enabled = false;
        this.stateChange();
        if (this.config.callback) {
            this.config.callback(search);
        }
        else {
            this.$rootScope.$broadcast(SearchService_1.SearchActivatedEvent, search);
        }
    };
    SearchBarController.prototype.clear = function () {
        if (this.search.text) {
            this.search.text = '';
            this.focusText();
        }
        else {
            this.enabled = false;
            this.stateChange();
            this.onClick();
        }
    };
    SearchBarController.prototype.onKeyDown = function (event) {
        if (event.keyCode === 13)
            this.onClick();
        else if (event.keyCode === 27) {
            this.enabled = false;
            this.stateChange();
        }
    };
    return SearchBarController;
}());
var SearchBar = {
    templateUrl: 'search/SearchBar.html',
    controller: SearchBarController
};
angular
    .module('pipSearchBar')
    .component('pipSearchBar', SearchBar);
},{"./SearchService":35}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SearchConfig = (function () {
    function SearchConfig() {
    }
    return SearchConfig;
}());
exports.SearchConfig = SearchConfig;
},{}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SearchConfig_1 = require("./SearchConfig");
exports.OpenSearchEvent = 'pipOpenSearch';
exports.CloseSearchEvent = 'pipCloseSearch';
exports.SearchChangedEvent = 'pipSearchChanged';
exports.SearchActivatedEvent = 'pipSearchActivated';
var SearchService = (function () {
    function SearchService(config, $rootScope) {
        var _this = this;
        this.$rootScope = $rootScope;
        this._config = config;
        $rootScope.$on(exports.OpenSearchEvent, function () { _this.open; });
        $rootScope.$on(exports.CloseSearchEvent, function () { _this.close; });
    }
    Object.defineProperty(SearchService.prototype, "config", {
        get: function () {
            return this._config;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchService.prototype, "criteria", {
        get: function () {
            return this._config.criteria;
        },
        set: function (value) {
            this._config.criteria = value;
            this.sendConfigEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchService.prototype, "params", {
        get: function () {
            return this._config.params;
        },
        set: function (value) {
            this._config.params = value;
            this.sendConfigEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchService.prototype, "history", {
        get: function () {
            return this._config.history;
        },
        set: function (value) {
            this._config.history = value;
            this.sendConfigEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchService.prototype, "callback", {
        get: function () {
            return this._config.callback;
        },
        set: function (value) {
            this._config.callback = value;
            this.sendConfigEvent();
        },
        enumerable: true,
        configurable: true
    });
    SearchService.prototype.set = function (callback, criteria, params, history) {
        this._config.callback = callback;
        this._config.criteria = criteria;
        this._config.params = params;
        this._config.history = history;
        this.sendConfigEvent();
    };
    SearchService.prototype.clear = function () {
        this._config.callback = null;
        this._config.criteria = null;
        this._config.params = null;
        this.sendConfigEvent();
    };
    SearchService.prototype.open = function () {
        this._config.visible = true;
        this.sendConfigEvent();
    };
    SearchService.prototype.close = function () {
        this._config.visible = false;
        this.sendConfigEvent();
    };
    SearchService.prototype.toggle = function () {
        this._config.visible = !this._config.visible;
        this.sendConfigEvent();
    };
    SearchService.prototype.sendConfigEvent = function () {
        this.$rootScope.$broadcast(exports.SearchChangedEvent, this._config);
    };
    return SearchService;
}());
var SearchProvider = (function () {
    function SearchProvider() {
        this._config = new SearchConfig_1.SearchConfig();
        this._service = null;
    }
    SearchProvider.prototype.$get = ['$rootScope', function ($rootScope) {
        "ngInject";
        if (this._service == null)
            this._service = new SearchService(this._config, $rootScope);
        return this._service;
    }];
    return SearchProvider;
}());
angular.module('pipSearchBar')
    .provider('pipSearch', SearchProvider);
},{"./SearchConfig":34}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipSearchBar', ['ngMaterial', 'pipNav.Translate', 'pipNav.Templates']);
require("./SearchConfig");
require("./ISearchService");
require("./SearchService");
require("./SearchBar");
},{"./ISearchService":32,"./SearchBar":33,"./SearchConfig":34,"./SearchService":35}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SideNavState_1 = require("./SideNavState");
var SideNavController = (function () {
    SideNavController.$inject = ['$element', '$attrs', '$injector', '$scope', '$rootScope', '$timeout', 'pipSideNav', 'navConstant'];
    function SideNavController($element, $attrs, $injector, $scope, $rootScope, $timeout, pipSideNav, navConstant) {
        "ngInject";
        var _this = this;
        this.$element = $element;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
        this.pipSideNav = pipSideNav;
        this._pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
        this._mainContainer = navConstant.SIDENAV_CONTAINER;
        this._bigWidth = navConstant.SIDENAV_LARGE_WIDTH;
        this._middleWidth = navConstant.SIDENAV_MIDDLE_WIDTH;
        this._smallWidth = navConstant.SIDENAV_SMALL_WIDTH;
        this._isResizing = false;
        this._animationDuration = navConstant.SIDENAV_ANIMATION_DURATION;
        this._navState = new SideNavState_1.SideNavStateConfig();
        this._mediaBreakpoints = this.setBreakpoints();
        this.$element.addClass('pip-sticky-sidenav');
        if (this.pipSideNav.config && this.pipSideNav.config.type != 'popup') {
            this.$timeout(function () {
                _this.setSideNaveState();
            }, 100);
            this.windowResize = _.debounce(function () { _this.setSideNaveState(); }, 10);
            this.cleanupMainResized = this.$rootScope.$on('pipMainResized', function () {
                _this.windowResize();
            });
            this.cleanupSideNavState = this.$rootScope.$on('pipSideNavState', function ($event, state) {
                _this.onSideNavState($event, state);
            });
        }
        else {
            this._isResizing = false;
            this.sidenavState = null;
            this.$timeout(function () {
                if (_this.pipSideNav.config.backdrop == false) {
                    _this.$element.addClass('pip-sidenav-hide-backdrop');
                }
                else {
                    _this.$element.removeClass('pip-sidenav-hide-backdrop');
                }
                _this.setState(SideNavState_1.SideNavStateNames.Toggle);
            }, 100);
        }
        this.cleanupNavHeaderChanged = this.$rootScope.$on('pipNavIconClicked', function () {
            _this.onNavIconClick();
        });
        this.cleanupSideNavChanged = this.$rootScope.$on('pipSideNavChanged', function ($event, config) {
            _this.onSideNavChanged($event, config);
        });
    }
    SideNavController.prototype.$onDestroy = function () {
        if (angular.isFunction(this.cleanupNavHeaderChanged)) {
            this.cleanupNavHeaderChanged();
        }
        if (angular.isFunction(this.cleanupSideNavChanged)) {
            this.cleanupSideNavChanged();
        }
        if (angular.isFunction(this.cleanupMainResized)) {
            this.cleanupMainResized();
        }
        if (angular.isFunction(this.cleanupSideNavState)) {
            this.cleanupSideNavState();
        }
    };
    SideNavController.prototype.setBreakpoints = function () {
        if (!this._pipMedia || !angular.isObject(this._pipMedia.breakpoints)) {
            return { xs: 639, sm: 959, md: 1024, lg: 1919 };
        }
        else {
            return this._pipMedia.breakpoints;
        }
    };
    SideNavController.prototype.onSideNavChanged = function ($event, config) {
        if (config && config.visible) {
            this.$element.css('display', 'block');
        }
        else {
            this.$element.css('display', 'none');
        }
    };
    SideNavController.prototype.onNavIconClick = function () {
        this.pipSideNav.open();
    };
    SideNavController.prototype.onSideNavState = function ($event, stateName) {
        if (angular.isString(stateName) && this._navState[stateName] !== undefined) {
            this.setState(stateName);
        }
    };
    SideNavController.prototype.setSideNaveState = function () {
        var _this = this;
        if (this.pipSideNav.config && this.pipSideNav.config.type == 'popup') {
            return;
        }
        if (this._isResizing) {
            this.$timeout(function () { _this.setSideNaveState(); }, this._animationDuration);
            return;
        }
        var mainWidth = $(this._mainContainer).innerWidth();
        var sideNavWidth = $('.pip-sticky-sidenav').innerWidth();
        var currentWidth = sideNavWidth ? sideNavWidth + 2 : 0;
        if (mainWidth + currentWidth < this._mediaBreakpoints.sm) {
            this.setState(SideNavState_1.SideNavStateNames.Toggle);
            return;
        }
        if (mainWidth + currentWidth < this._mediaBreakpoints.md) {
            this.setState(SideNavState_1.SideNavStateNames.Small);
            return;
        }
        if (mainWidth + currentWidth < this._mediaBreakpoints.lg) {
            this.setState(SideNavState_1.SideNavStateNames.Large);
            return;
        }
        this.setState(SideNavState_1.SideNavStateNames.XLarge);
    };
    SideNavController.prototype.setState = function (stateName) {
        var _this = this;
        if (this._isResizing)
            return;
        if (this.sidenavState && this.sidenavState.id == stateName)
            return;
        if (stateName != SideNavState_1.SideNavStateNames.Toggle) {
            this.$element.removeClass('sidenav-mobile');
        }
        if (stateName != SideNavState_1.SideNavStateNames.Small) {
            this.$element.removeClass('pip-sticky-nav-small');
        }
        if (stateName != SideNavState_1.SideNavStateNames.XLarge) {
            this.$element.removeClass('sidenav-desktop');
        }
        if (stateName != SideNavState_1.SideNavStateNames.Large) {
            this.$element.removeClass('sidenav-smalldesktop');
        }
        this._isResizing = true;
        this.sidenavState = this._navState[String(stateName)];
        this.$element.addClass(this.sidenavState.addClass);
        this.pipSideNav.state = this.sidenavState;
        this.$timeout(function () {
            _this.setSideNaveState();
        }, 15);
        this.$timeout(function () {
            _this._isResizing = false;
        }, this._animationDuration);
    };
    return SideNavController;
}());
var SideNavBindings = {
    sidenavState: '=?'
};
(function () {
    var sideNav = {
        transclude: true,
        bindings: SideNavBindings,
        templateUrl: 'sidenav/SideNav.html',
        controller: SideNavController
    };
    angular
        .module('pipSideNav')
        .component('pipSidenav', sideNav);
})();
},{"./SideNavState":40}],38:[function(require,module,exports){
{
    sidenavPartDirective.$inject = ['ngIfDirective'];
    var SideNavPartBindings_1 = {
        visible: '=?'
    };
    var SideNavPartController_1 = (function () {
        SideNavPartController_1.$inject = ['$scope', '$element', '$attrs', '$rootScope', 'pipSideNav'];
        function SideNavPartController_1($scope, $element, $attrs, $rootScope, pipSideNav) {
            var _this = this;
            this.$scope = $scope;
            this.partValue = null;
            this.partName = '' + $attrs['pipSidenavPart'];
            this.pos = this.partName.indexOf(':');
            if (this.pos > 0) {
                this.partValue = this.partName.substr(this.pos + 1);
                this.partName = this.partName.substr(0, this.pos);
            }
            this.onSideNavChanged(null, pipSideNav.config);
            $rootScope.$on('pipSideNavChanged', function (event, config) { _this.onSideNavChanged(event, config); });
        }
        SideNavPartController_1.prototype.onSideNavChanged = function (event, config) {
            var parts = config.parts || {};
            var currentPartValue = parts[this.partName];
            var visible = !!(this.partValue ? currentPartValue == this.partValue : currentPartValue);
            if (visible != this.$scope['visible'])
                this.$scope['visible'] = visible;
        };
        return SideNavPartController_1;
    }());
    function sidenavPartDirective(ngIfDirective) {
        "ngInject";
        var ngIf = ngIfDirective[0];
        return {
            transclude: ngIf.transclude,
            priority: ngIf.priority,
            terminal: ngIf.terminal,
            restrict: ngIf.restrict,
            scope: SideNavPartBindings_1,
            link: function linkFunction($scope, $element, $attrs) {
                $attrs['ngIf'] = function () { return $scope['visible']; };
                ngIf.link.apply(ngIf, arguments);
            },
            controller: SideNavPartController_1
        };
    }
    angular
        .module('pipSideNav')
        .directive('pipSidenavPart', sidenavPartDirective);
}
},{}],39:[function(require,module,exports){
"use strict";
hookSideNavEvents.$inject = ['$rootScope', 'pipSideNav'];
Object.defineProperty(exports, "__esModule", { value: true });
var SideNavState_1 = require("./SideNavState");
exports.SideNavChangedEvent = 'pipSideNavChanged';
exports.SideNavStateChangedEvent = 'pipSideNavStateChanged';
exports.OpenSideNavEvent = 'pipOpenSideNav';
exports.CloseSideNavEvent = 'pipCloseSideNav';
var SideNavService = (function () {
    function SideNavService(config, $rootScope, $mdSidenav) {
        this.$rootScope = $rootScope;
        this.$mdSidenav = $mdSidenav;
        this._config = config;
    }
    Object.defineProperty(SideNavService.prototype, "config", {
        get: function () {
            return this._config;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideNavService.prototype, "classes", {
        get: function () {
            return this._config.classes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideNavService.prototype, "parts", {
        get: function () {
            return this._config.parts;
        },
        set: function (value) {
            this._config.parts = value || {};
            this.sendConfigEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideNavService.prototype, "state", {
        get: function () {
            return this._state;
        },
        set: function (value) {
            this._state = value || {};
            this.$rootScope.$broadcast(exports.SideNavStateChangedEvent, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideNavService.prototype, "type", {
        get: function () {
            return this._config.type;
        },
        set: function (value) {
            this._config.type = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideNavService.prototype, "backdrop", {
        get: function () {
            return this._config.backdrop;
        },
        set: function (value) {
            this._config.backdrop = value;
        },
        enumerable: true,
        configurable: true
    });
    SideNavService.prototype.open = function () {
        this.$mdSidenav('pip-sticky-sidenav').open();
    };
    SideNavService.prototype.close = function () {
        this.$mdSidenav('pip-sticky-sidenav').close();
    };
    SideNavService.prototype.toggle = function () {
        this.$mdSidenav('pip-sticky-sidenav').toggle();
    };
    SideNavService.prototype.show = function () {
        if (!this._config.visible) {
            this._config.visible = true;
            this.sendConfigEvent();
        }
    };
    SideNavService.prototype.hide = function () {
        if (this._config.visible) {
            this._config.visible = false;
            this.sendConfigEvent();
        }
    };
    SideNavService.prototype.addClass = function () {
        var _this = this;
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        _.each(classes, function (c) {
            _this._config.classes.push(c);
        });
        this.sendConfigEvent();
    };
    SideNavService.prototype.removeClass = function () {
        var _this = this;
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        _.each(classes, function (c) {
            _this._config.classes = _.reject(_this._config.classes, function (cc) { return cc == c; });
        });
        this.sendConfigEvent();
    };
    SideNavService.prototype.part = function (part, value) {
        this._config.parts[part] = value;
        this.sendConfigEvent();
    };
    SideNavService.prototype.sendConfigEvent = function () {
        this.$rootScope.$emit(exports.SideNavChangedEvent, this._config);
    };
    return SideNavService;
}());
var SideNavProvider = (function () {
    function SideNavProvider() {
        this._config = {
            parts: {},
            classes: [],
            type: 'popup',
            backdrop: true,
            state: null,
            visible: true
        };
    }
    Object.defineProperty(SideNavProvider.prototype, "backdrop", {
        get: function () {
            return this._config.backdrop;
        },
        set: function (value) {
            this._config.backdrop = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideNavProvider.prototype, "config", {
        get: function () {
            return this._config;
        },
        set: function (value) {
            this._config = value || new SideNavState_1.SideNavConfig();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideNavProvider.prototype, "parts", {
        get: function () {
            return this._config.parts;
        },
        set: function (value) {
            this._config.parts = value || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideNavProvider.prototype, "type", {
        get: function () {
            return this._config.type;
        },
        set: function (value) {
            this._config.type = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideNavProvider.prototype, "visible", {
        get: function () {
            return this._config.visible;
        },
        set: function (value) {
            this._config.visible = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideNavProvider.prototype, "classes", {
        get: function () {
            return this._config.classes;
        },
        set: function (value) {
            this._config.classes = value || [];
        },
        enumerable: true,
        configurable: true
    });
    SideNavProvider.prototype.addClass = function () {
        var _this = this;
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        _.each(classes, function (c) {
            _this._config.classes.push(c);
        });
    };
    SideNavProvider.prototype.removeClass = function () {
        var _this = this;
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        _.each(classes, function (c) {
            _this._config.classes = _.reject(_this._config.classes, function (cc) { return cc == c; });
        });
    };
    SideNavProvider.prototype.part = function (part, value) {
        this._config.parts[part] = value;
    };
    SideNavProvider.prototype.$get = ['$rootScope', '$mdSidenav', function ($rootScope, $mdSidenav) {
        "ngInject";
        if (this._service == null)
            this._service = new SideNavService(this._config, $rootScope, $mdSidenav);
        return this._service;
    }];
    return SideNavProvider;
}());
function hookSideNavEvents($rootScope, pipSideNav) {
    $rootScope.$on(exports.OpenSideNavEvent, function () { pipSideNav.open(); });
    $rootScope.$on(exports.CloseSideNavEvent, function () { pipSideNav.close(); });
}
angular
    .module('pipSideNav')
    .provider('pipSideNav', SideNavProvider)
    .run(hookSideNavEvents);
},{"./SideNavState":40}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SideNavStateNames = (function () {
    function SideNavStateNames() {
    }
    return SideNavStateNames;
}());
SideNavStateNames.Toggle = 'toggle';
SideNavStateNames.Small = 'small';
SideNavStateNames.Large = 'large';
SideNavStateNames.XLarge = 'xlarge';
exports.SideNavStateNames = SideNavStateNames;
var SideNavState = (function () {
    function SideNavState() {
    }
    return SideNavState;
}());
exports.SideNavState = SideNavState;
var SideNavStateConfig = (function () {
    function SideNavStateConfig() {
        this.toggle = {
            id: SideNavStateNames.Toggle,
            addClass: 'sidenav-mobile',
            showHeader: true,
            isLockedOpen: false,
            expandedButton: false,
            isExpanded: true,
            expand: true,
            showIconTooltype: false
        };
        this.small = {
            id: SideNavStateNames.Small,
            addClass: 'pip-sticky-nav-small sidenav-smalldesktop',
            showHeader: false,
            isLockedOpen: true,
            expandedButton: false,
            isExpanded: false,
            expand: false,
            showIconTooltype: true
        };
        this.large = {
            id: SideNavStateNames.Large,
            addClass: 'sidenav-smalldesktop',
            showHeader: false,
            isLockedOpen: true,
            expandedButton: true,
            isExpanded: true,
            expand: true,
            showIconTooltype: true
        };
        this.xlarge = {
            id: SideNavStateNames.XLarge,
            addClass: 'sidenav-desktop',
            showHeader: false,
            isLockedOpen: true,
            expandedButton: false,
            isExpanded: true,
            expand: true,
            showIconTooltype: false
        };
    }
    return SideNavStateConfig;
}());
exports.SideNavStateConfig = SideNavStateConfig;
var SideNavConfig = (function () {
    function SideNavConfig() {
        this.backdrop = true;
    }
    return SideNavConfig;
}());
exports.SideNavConfig = SideNavConfig;
},{}],41:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipSideNav', ['ngMaterial', 'pipNav.Templates']);
require("./SideNavState");
require("./SideNavService");
require("./SideNavPart");
require("./SideNav");
__export(require("./SideNavService"));
},{"./SideNav":37,"./SideNavPart":38,"./SideNavService":39,"./SideNavState":40}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PipTab = (function () {
    function PipTab() {
    }
    return PipTab;
}());
exports.PipTab = PipTab;
{
    var TabsBindings = {
        ngDisabled: '&?',
        tabs: '<pipTabs',
        showTabs: '&pipShowTabs',
        showTabsShadow: '&pipTabsShadow',
        activeIndex: '<?pipActiveIndex',
        select: '=pipTabsSelect',
        breakpoints: '<?pipBreakpoints',
        themeClass: '<?themeClass',
    };
    var TabsChanges = (function () {
        function TabsChanges() {
        }
        return TabsChanges;
    }());
    var TabsDirectiveController = (function () {
        TabsDirectiveController.$inject = ['$element', '$injector', '$rootScope', '$timeout', 'navConstant', '$mdMedia'];
        function TabsDirectiveController($element, $injector, $rootScope, $timeout, navConstant, $mdMedia) {
            "ngInject";
            this.$element = $element;
            this.$injector = $injector;
            this.$rootScope = $rootScope;
            this.$timeout = $timeout;
            this.navConstant = navConstant;
            this.setTheme();
            this.pipMedia = this.$injector.has('pipMedia') ? this.$injector.get('pipMedia') : $mdMedia;
            if (!this.breakpoints) {
                this.breakpoints = this.navConstant.TAB_BREAKPOINT;
            }
        }
        TabsDirectiveController.prototype.setTheme = function () {
            this._pipTheme = this.$injector.has('pipTheme') ? this.$injector.get('pipTheme') : null;
            if (this._pipTheme) {
                this.currentTheme = this._pipTheme.theme;
            }
            else if (this.$rootScope['$theme']) {
                this.currentTheme = this.$rootScope['$theme'];
            }
            this.themeClass = (this.themeClass || '') + ' md-' + this.currentTheme + '-theme';
        };
        TabsDirectiveController.prototype.setTranslate = function () {
            this._pipTranslate = this.$injector.has('pipTranslate') ? this.$injector.get('pipTranslate') : null;
            if (this._pipTranslate) {
                if (this.tabs.length > 0 && this.tabs[0].title) {
                    this._pipTranslate.translateObjects(this.tabs, 'title', 'nameLocal');
                }
                else {
                    this._pipTranslate.translateObjects(this.tabs, 'name', 'nameLocal');
                }
            }
        };
        TabsDirectiveController.prototype.isDisabled = function () {
            if (_.isFunction(this.ngDisabled)) {
                return this.ngDisabled();
            }
            else {
                return this.toBoolean(this.ngDisabled);
            }
        };
        ;
        TabsDirectiveController.prototype.tabDisabled = function (index) {
            return (this.isDisabled() && this.activeIndex != index);
        };
        ;
        TabsDirectiveController.prototype.onSelect = function (index) {
            var _this = this;
            if (this.isDisabled())
                return;
            this.activeIndex = index;
            this.selectedTabId = this.tabs.length >= this.activeIndex ? this.tabs[this.activeIndex].id : null;
            this.$timeout(function () {
                if (_this.select) {
                    _this.select(_this.tabs[_this.activeIndex], _this.activeIndex);
                }
            }, 0);
        };
        ;
        TabsDirectiveController.prototype.showShadow = function () {
            if (_.isFunction(this.showTabsShadow)) {
                return this.showTabsShadow();
            }
            else {
                return this.toBoolean(this.showTabsShadow);
            }
        };
        ;
        TabsDirectiveController.prototype.show = function () {
            if (!this.showTabs)
                return true;
            if (_.isFunction(this.showTabs)) {
                return this.showTabs();
            }
            else {
                return this.toBoolean(this.showTabs);
            }
        };
        ;
        TabsDirectiveController.prototype.toBoolean = function (value) {
            if (value == null)
                return false;
            if (!value)
                return false;
            value = value.toString().toLowerCase();
            return value == '1' || value == 'true';
        };
        TabsDirectiveController.prototype.$onChanges = function (changes) {
            var _this = this;
            if (!changes.breakpoints) {
                if (!this.breakpoints) {
                    this.breakpoints = this.navConstant.TAB_BREAKPOINT;
                }
            }
            else {
                this.breakpoints = changes.breakpoints.currentValue ? changes.breakpoints.currentValue : this.navConstant.TAB_BREAKPOINT;
            }
            if (changes.activeIndex === undefined) {
                if (!this.activeIndex) {
                    this.activeIndex = 0;
                }
            }
            else {
                this.activeIndex = changes.activeIndex.currentValue || 0;
                if (this.$timeout && this.activeIndex !== changes.activeIndex.previousValue) {
                    this.$timeout(function () {
                        var a = _this.$element.find('md-tabs-canvas');
                        if (a && a[0]) {
                            angular.element(a[0]).attr('activeIndex', _this.activeIndex);
                        }
                        a.on('focusout', function () {
                            angular.element(a[0]).attr('activeIndex', _this.activeIndex);
                            _this.$timeout(function () {
                                angular.element(a[0]).attr('activeIndex', _this.activeIndex);
                            }, 50);
                        });
                    }, 1000);
                }
            }
            if (changes.tabs === undefined || !_.isArray(changes.tabs.currentValue)) {
                if (!this.tabs) {
                    this.tabs = [];
                }
            }
            else {
                this.tabs = changes.tabs.currentValue;
                this.setTranslate();
            }
            if (!changes.activeIndex && changes.tabs && this.selectedTabId !== undefined) {
                var index = _.indexOf(this.tabs, _.find(this.tabs, {
                    id: this.selectedTabId
                }));
                if (index < 0) {
                    this.selectedTabId = this.tabs.length >= this.activeIndex ? this.tabs[this.activeIndex].id : null;
                }
                else if (this.tabs.length > 0 && this.activeIndex) {
                    this.onSelect(index);
                }
            }
            else {
                this.selectedTabId = this.tabs.length >= this.activeIndex ? this.tabs[this.activeIndex].id : null;
            }
        };
        return TabsDirectiveController;
    }());
    var Tabs = {
        bindings: TabsBindings,
        templateUrl: 'tabs/Tabs.html',
        controller: TabsDirectiveController
    };
    angular
        .module('pipTabs', ['pipNav.Templates'])
        .component('pipTabs', Tabs);
}
},{}],43:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('actions/PrimaryActions.html',
    '<div pip-focused="" pip-focused-tabindex="2"><md-menu md-position-mode="target-right target" class="pip-primary-actions" ng-repeat="action in $ctrl.config.primaryLocalActions"><md-button class="pip-primary-actions-action md-icon-button pip-focusable" ng-click="$ctrl.clickAction(action, $mdOpenMenu);" tabindex="-1" ng-hide="$ctrl.isHidden(action)" aria-label="{{ action.title | translate }}"><div class="pip-primary-actions-badge" ng-show="action.count > 0">{{ $ctrl.actionCount(action) }}</div><md-icon md-svg-icon="{{ action.icon}}"></md-icon></md-button><md-menu-content width="3"><md-menu-item ng-repeat-start="subAction in action.subActions" ng-if="!subAction.divider" ng-hide="$ctrl.isHidden(subAction)"><md-button class="pip-focusable" ng-hide="subAction.divider" tabindex="-1" ng-click="$ctrl.clickAction(subAction)">{{ ::subAction.title | translate }}</md-button></md-menu-item><md-menu-divider ng-if="subAction.divider" ng-repeat-end=""></md-menu-divider></md-menu-content></md-menu><md-menu md-position-mode="target-right target" class="pip-primary-actions" ng-repeat="action in $ctrl.config.primaryGlobalActions"><md-button class="pip-primary-actions-action md-icon-button pip-focusable" ng-click="$ctrl.clickAction(action, $mdOpenMenu);" ng-hide="$ctrl.isHidden(action)" tabindex="-1" aria-label="{{ action.title | translate }}"><div class="pip-primary-actions-badge color-badge-bg" ng-show="action.count > 0">{{ $ctrl.actionCount(action) }}</div><md-icon md-svg-icon="{{ action.icon }}"></md-icon></md-button><md-menu-content width="3"><md-menu-item ng-repeat-start="subAction in action.subActions" ng-if="!subAction.divider" ng-hide="$ctrl.isHidden(subAction)"><md-button class="pip-focusable" ng-hide="subAction.divider" tabindex="-1" ng-click="$ctrl.clickAction(subAction)">{{ subAction.title | translate }}</md-button></md-menu-item><md-menu-divider ng-if="subAction.divider" ng-repeat-end=""></md-menu-divider></md-menu-content></md-menu></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('actions/SecondaryActions.html',
    '<md-menu ng-if="$ctrl.secondaryActionsVisible()" md-position-mode="target-right target"><md-button class="md-icon-button" tabindex="3" ng-init="$ctrl.getMenu($mdOpenMenu)" ng-click="$ctrl.onSecondaryActionClick(); $ctrl.openMenu($mdOpenMenu, $event);" aria-label="open actions"><md-icon md-svg-icon="icons:vdots"></md-icon></md-button><md-menu-content width="3"><md-menu-item ng-repeat-start="action in $ctrl.config.secondaryLocalActions" ng-if="!action.divider" ng-hide="$ctrl.isHidden(action)"><md-button ng-hide="action.divider" ng-click="$ctrl.clickAction(action)">{{ ::action.title | translate }}</md-button></md-menu-item><md-menu-divider ng-if="action.divider" ng-repeat-end=""></md-menu-divider><md-menu-divider ng-if="$ctrl.secondaryDividerVisible()"></md-menu-divider><md-menu-item ng-repeat-start="action in $ctrl.config.secondaryGlobalActions" ng-if="!action.divider" ng-hide="$ctrl.isHidden(action)"><md-button ng-hide="action.divider" ng-click="$ctrl.clickAction(action)">{{ ::action.title | translate }}</md-button></md-menu-item><md-menu-divider ng-if="action.divider" ng-repeat-end=""></md-menu-divider></md-menu-content></md-menu>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('appbar/AppBar.html',
    '<md-toolbar class="{{ $ctrl.config.classes.join(\' \') }}" ng-if="$ctrl.config.visible" ng-transclude=""></md-toolbar>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('breadcrumb/Breadcrumb.html',
    '<div class="pip-breadcrumb-block"><div class="text-overflow" ng-if="!$ctrl._media(\'xs\')"><span ng-if="$ctrl.config.criteria" ng-click="$ctrl.openSearch()">{{ $ctrl.config.criteria }} -</span><span class="pip-breadcrumb-item {{ $last ? \'breadcrumb-accent\' : \'\' }}" ng-if="$ctrl.config.items && $ctrl.config.items.length > 0" ng-repeat-start="item in $ctrl.config.items" ng-click="$ctrl.onClick(item)" ng-init="stepWidth = 100/($ctrl.config.items.length + 1)" ng-class="{\'cursor-pointer\': !$last}" ng-style="{\'max-width\': stepWidth + \'%\'}"><span ng-if="!$last || !$ctrl.actionsVisible(item)">{{ item.title | translate }}</span><div ng-if="$last && $ctrl.actionsVisible(item)" style="display: inline-block; position: relative;"><md-menu md-offset="0 44"><span class="layout-row pip-breadcrumb-item-menu cursor-pointer {{ $last ? \'breadcrumb-accent\' : \'\' }}" ng-click="$ctrl.onOpenMenu($mdOpenMenu, $event)" md-ink-ripple="" aria-label="open breadcrumb actions">{{ item.title | translate }}<md-icon class="pip-triangle-down" md-svg-icon="icons:triangle-down"></md-icon></span><md-menu-content width="4"><md-menu-item ng-if="!subItem.divider" ng-repeat-start="subItem in item.subActions"><md-button ng-click="$ctrl.onSubActionClick(subItem)" ng-if="!action.divider" tabindex="4"><md-icon md-menu-align-target="" ng-if="subItem.icon" md-svg-icon="{{ subItem.icon }}"></md-icon><span>{{ subItem.title | translate }}</span></md-button></md-menu-item><md-menu-divider ng-if="subItem.divider" ng-repeat-end=""></md-menu-divider></md-menu-content></md-menu></div></span><md-icon ng-repeat-end="" md-svg-icon="icons:chevron-right" ng-hide="$last"></md-icon><span class="pip-title breadcrumb-accent" ng-if="$ctrl.config.text">{{ $ctrl.config.text | translate }}</span></div><div style="position: relative;" ng-if="$ctrl._media(\'xs\')"><md-menu md-offset="0 44"><span class="pip-mobile-breadcrumb layout-row" ng-click="$ctrl.config.items && $ctrl.config.items.length > 1 ? $mdOpenMenu() : return"><span class="text-overflow"><span ng-if="$ctrl.config.criteria" ng-click="$ctrl.openSearch()">{{ $ctrl.config.criteria }} -</span> <span class="breadcrumb-accent" ng-if="$ctrl.config.text">{{ $ctrl.config.text | translate }}</span> <span ng-if="$ctrl.config.items && $ctrl.config.items.length > 0" class="breadcrumb-accent {{ ($ctrl.config.items && $ctrl.config.items.length > 1) ? \'cursor-pointer\' : \'\' }}">{{ $ctrl.config.items[$ctrl.config.items.length - 1].title | translate }}</span></span><md-icon class="pip-triangle-down cursor-pointer breadcrumb-accent" md-svg-icon="icons:triangle-down" ng-if="$ctrl.config.items && $ctrl.config.items.length > 1"></md-icon></span><md-menu-content width="4"><md-menu-item ng-repeat="item in $ctrl.config.items" ng-if="$ctrl.config.items && $ctrl.config.items.length > 0"><md-button ng-click="$ctrl.onClick(item)" tabindex="5"><md-icon md-menu-align-target="" ng-if="item.icon" md-svg-icon="{{ item.icon }}"></md-icon><span>{{ item.title | translate }}</span></md-button></md-menu-item><md-menu-item ng-if="$ctrl.config.text"><md-button tabindex="5"><span class="text-grey">{{ $ctrl.config.text | translate }}</span></md-button></md-menu-item></md-menu-content></md-menu></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('dropdown/Dropdown.html',
    '<md-toolbar class="md-subhead color-primary-bg {{ $ctrl.themeClass}}" ng-if="$ctrl.show()" ng-class="{\'md-whiteframe-3dp\': $ctrl.media(\'xs\')}"><div class="pip-divider"></div><md-select ng-model="$ctrl.selectedIndex" tabindex="15" ng-disabled="$ctrl.disabled()" md-container-class="pip-full-width-dropdown" aria-label="DROPDOWN" md-ink-ripple="" md-on-close="$ctrl.onSelect($ctrl.selectedIndex)"><md-option ng-repeat="action in $ctrl.actions" value="{{ ::$index }}" ng-selected="$ctrl.activeIndex == $index ? true : false">{{ (action.title || action.name || action) | translate }}</md-option></md-select></md-toolbar>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('header/NavHeader.html',
    '<md-toolbar ng-show="$ctrl.showHeader" class="layout-row layout-align-start-center"><div class="flex-fixed pip-sticky-nav-header-user"><md-button class="md-icon-button" ng-click="$ctrl.onUserClick()" aria-label="current user" tabindex="-1"><img src="" class="pip-sticky-nav-header-user-image" ng-class="$ctrl.imageCss"></md-button></div><div class="pip-sticky-nav-header-user-text"><div class="pip-sticky-nav-header-user-pri" ng-click="$ctrl.onUserClick()" tabindex="-1">{{ $ctrl.title | translate }}</div><div class="pip-sticky-nav-header-user-sec">{{ $ctrl.subtitle | translate }}</div></div></md-toolbar>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('icon/NavIcon.html',
    '<md-button class="md-icon-button pip-nav-icon" ng-if="$ctrl.config.type != \'none\'" ng-class="$ctrl.config.class" ng-click="$ctrl.onNavIconClick()" tabindex="{{ $ctrl.config.type==\'menu\' || $ctrl.config.type==\'back\' ? 4 : -1 }}" aria-label="menu"><md-icon ng-if="$ctrl.config.type==\'menu\'" md-svg-icon="icons:menu"></md-icon><img ng-src="{{ $ctrl.config.imageUrl }}" ng-if="$ctrl.config.type==\'image\'" height="24" width="24"><md-icon ng-if="$ctrl.config.type==\'back\'" md-svg-icon="icons:arrow-left"></md-icon><md-icon ng-if="$ctrl.config.type==\'icon\'" md-svg-icon="{{ $ctrl.config.icon }}"></md-icon></md-button>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('language/LanguagePicker.html',
    '<md-menu md-position-mode="target-right target"><span class="pip-language" ng-click="$mdOpenMenu()" aria-label="language selection">{{ $ctrl.value | translate }}<md-icon md-svg-icon="icons:triangle-down"></md-icon></span><md-menu-content width="3"><md-menu-item ng-repeat="language in $ctrl.languages"><md-button ng-click="$ctrl.onLanguageClick(language)" tabindex="7">{{ language | translate }}</md-button></md-menu-item></md-menu-content></md-menu>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('menu/NavMenu.html',
    '<div ng-if="$ctrl.sections && $ctrl.sections.length"><md-list class="sidenav-list" pip-focused="" pip-focused-tabindex="10" pip-with-hidden="true"><md-list-item class="no-border pip-sticky-nav-menu-item pip-sticky-nav-expanded-button" ng-click="$ctrl.onExpand()" ng-disabled="!$ctrl.isCollapsed" tabindex="-1" ng-if="$ctrl.expandedButton"><md-icon class="pip-sticky-nav-menu-icon" md-svg-icon="icons:chevron-left" ng-if="$ctrl.expanded"></md-icon><md-icon class="pip-sticky-nav-menu-icon" md-svg-icon="icons:chevron-right" ng-if="!$ctrl.expanded"></md-icon></md-list-item><md-divider ng-show="$ctrl.expandedButton"></md-divider><div class="pip-section" ng-repeat="section in $ctrl.sections" ng-hide="section.access && !section.access(section)"><md-divider ng-show="$index > 0 && !$ctrl.isSectionEmpty(section.links)"></md-divider><md-subheader ng-show="section.title" style="height: 48px;"><span ng-if="$ctrl.expanded" class="pip-sticky-nav-menu-title section-title">{{ ::section.title | translate }}</span><md-icon class="pip-sticky-nav-menu-icon section-icon" md-svg-icon="{{ section.icon }}" ng-if="!$ctrl.sideNavState.showIconTooltype && !$ctrl.expanded && section.icon"></md-icon><md-icon class="pip-sticky-nav-menu-icon section-icon" md-svg-icon="{{ section.icon }}" ng-if="$ctrl.sideNavState.showIconTooltype && !$ctrl.expanded && section.icon"><md-tooltip md-visible="showTooltip" md-direction="right" class="sidenav-icon-tooltip">{{ ::section.tooltipText || section.title | translate }}</md-tooltip></md-icon><md-icon class="pip-sticky-nav-menu-icon section-icon" md-svg-icon="{{ $ctrl.defaultIcon }}" ng-if="!$ctrl.sideNavState.showIconTooltype && !$ctrl.expanded && !section.icon"></md-icon><md-icon class="pip-sticky-nav-menu-icon section-icon" md-svg-icon="{{ $ctrl.defaultIcon }}" ng-if="$ctrl.sideNavState.showIconTooltype && !$ctrl.expanded && !section.icon"><md-tooltip md-visible="showTooltip" class="md-secondary">{{ ::section.tooltipText || section.title | translate }}</md-tooltip></md-icon></md-subheader><md-list-item class="no-border pip-sticky-nav-menu-item pip-focusable" tabindex="-1" ng-repeat="link in section.links" ng-class="{\'active\': $ctrl.isActive(link)}" ng-hide="link.access && !link.access(link)"><md-button class="layout-row layout-align-start-center pip-button-block" tabindex="-1" ng-click="$ctrl.clickLink($event, link)"><md-tooltip md-visible="showTooltip" md-direction="right">{{ ::link.tooltipText | translate }}</md-tooltip><div class="pip-sticky-nav-menu-icon-block"><md-icon class="pip-sticky-nav-menu-icon flex-fixed" md-svg-icon="{{ link.icon }}" ng-if="!($ctrl.sideNavState.showIconTooltype && !link.tooltipText && !$ctrl.expanded)" ng-hide="!link.icon"></md-icon><md-icon class="pip-sticky-nav-menu-icon flex-fixed" md-svg-icon="{{ link.icon }}" ng-hide="!link.icon" ng-if="$ctrl.sideNavState.showIconTooltype && !link.tooltipText && !$ctrl.expanded"><md-tooltip md-visible="showTooltip" md-direction="right" class="sidenav-icon-tooltip">{{ ::link.tooltipText || link.title | translate }}</md-tooltip></md-icon></div><div class="pip-sticky-nav-menu-title">{{ ::link.title | translate }}</div><div class="pip-sticky-nav-menu-badge {{ link.badgeStyle ? link.badgeStyle : \'color-badge-bg\' }} flex-fixed" ng-if="link.count && link.count < 100">{{ link.count }}</div><div class="pip-sticky-nav-menu-badge {{ link.badgeStyle ? link.badgeStyle : \'color-badge-bg\' }} flex-fixed" ng-if="link.count && link.count > 99">!</div></md-button></md-list-item></div></md-list></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('search/SearchBar.html',
    '<div class="md-toolbar-tools pip-search-container" ng-if="$ctrl.enabled"><div class="layout-row pip-search-selected"><md-button class="md-icon-button" tabindex="6" aria-label="start search" ng-click="$ctrl.onClick()"><md-icon md-svg-icon="icons:search"></md-icon></md-button><input class="pip-search-text flex" type="search" tabindex="6" ng-model="$ctrl.search.text" ng-keydown="$ctrl.onKeyDown($event)"><md-button class="md-icon-button" tabindex="6" aria-label="clear search" ng-click="$ctrl.clear()"><md-icon md-svg-icon="icons:cross-circle"></md-icon></md-button></div></div><div class="md-toolbar-tools layout-row layout-align-end-center flex-fixed lp0 rp0" ng-if="!$ctrl.enabled"><md-button class="md-icon-button" tabindex="5" aria-label="start search" ng-click="$ctrl.enable()"><md-icon md-svg-icon="icons:search"></md-icon></md-button></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('sidenav/SideNav.html',
    '<md-sidenav class="md-sidenav-left" md-is-locked-open="$ctrl.sidenavState.isLockedOpen" md-component-id="pip-sticky-sidenav" ng-transclude=""></md-sidenav>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('tabs/Tabs.html',
    '<md-toolbar ng-if="$ctrl.pipMedia" class="pip-nav color-primary-bg {{ $ctrl.themeClass }}" ng-class="{\'pip-visible\': $ctrl.show(), \'pip-shadow\': $ctrl.showShadow()}"><md-tabs class="color-primary-bg" ng-if="$ctrl.pipMedia($ctrl.breakpoints)" md-selected="$ctrl.activeIndex" ng-class="{\'disabled\': $ctrl.isDisabled()}" md-stretch-tabs="true" md-dynamic-height="true"><md-tab ng-repeat="tab in $ctrl.tabs track by $index" ng-disabled="$ctrl.tabDisabled($index)" md-on-select="$ctrl.onSelect($index)"><md-tab-label>{{:: tab.nameLocal }}<div class="pip-tabs-badge color-badge-bg" ng-if="tab.counts > 0 && tab.counts <= 99">{{ tab.counts }}</div><div class="pip-tabs-badge color-badge-bg" ng-if="tab.counts > 99">!</div></md-tab-label></md-tab></md-tabs><div class="md-subhead pip-tabs-content color-primary-bg" ng-if="!$ctrl.pipMedia($ctrl.breakpoints)"><div class="pip-divider position-top m0"></div><md-select ng-model="$ctrl.activeIndex" ng-disabled="$ctrl.isDisabled()" md-container-class="pip-full-width-dropdown" aria-label="SELECT" md-ink-ripple="" md-on-close="$ctrl.onSelect($ctrl.activeIndex)"><md-option ng-repeat="tab in $ctrl.tabs track by $index" class="pip-tab-option" value="{{ ::$index }}">{{ ::tab.nameLocal }}<div class="pip-tabs-badge color-badge-bg" ng-if="tab.counts > 0 && tab.counts <= 99">{{ tab.counts }}</div><div class="pip-tabs-badge color-badge-bg" ng-if="tab.counts > 99">!</div></md-option></md-select></div></md-toolbar>');
}]);
})();



},{}]},{},[43,27])(43)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).themes = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
{
    configureBootBarnCoolTheme.$inject = ['$mdThemingProvider'];
    function configureBootBarnCoolTheme($mdThemingProvider) {
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
            'default': '50',
            'hue-1': 'A200',
            'hue-2': 'A700'
        })
            .warnPalette('red', {
            'default': 'A200'
        })
            .accentPalette('bootbarn-cool-accent', {
            'default': 'A700'
        });
        $mdThemingProvider.alwaysWatchTheme(true);
    }
    angular
        .module('pipTheme.BootBarn.Cool', ['ngMaterial'])
        .config(configureBootBarnCoolTheme);
}

},{}],2:[function(require,module,exports){
{
    configureBootBarnMonochromeTheme.$inject = ['$mdThemingProvider'];
    function configureBootBarnMonochromeTheme($mdThemingProvider) {
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
            'default': '50',
            'hue-1': 'A200',
            'hue-2': 'A700'
        })
            .warnPalette('red', {
            'default': 'A200'
        })
            .accentPalette('bootbarn-monochrome-accent', {
            'default': 'A700'
        });
        $mdThemingProvider.alwaysWatchTheme(true);
    }
    angular
        .module('pipTheme.BootBarn.Monochrome', ['ngMaterial'])
        .config(configureBootBarnMonochromeTheme);
}

},{}],3:[function(require,module,exports){
{
    configureBootBarnWarmTheme.$inject = ['$mdThemingProvider'];
    function configureBootBarnWarmTheme($mdThemingProvider) {
        $mdThemingProvider.alwaysWatchTheme(true);
        var warmBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
            'A100': 'rgba(250, 250, 250, 1)',
            'A200': 'rgba(177, 55, 34, 1)'
        });
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
            'A200': 'rgba(255, 82, 82, 1)',
            'contrastLightColors': ['A200']
        });
        $mdThemingProvider.definePalette('bootbarn-warm-error', warmErrorPalette);
        $mdThemingProvider.theme('bootbarn-warm')
            .primaryPalette('bootbarn-warm-primary', {
            'default': '500',
            'hue-1': '300'
        })
            .backgroundPalette('bootbarn-warm-background', {
            'default': '50',
            'hue-1': 'A200',
            'hue-2': 'A700'
        })
            .warnPalette('bootbarn-warm-error', {
            'default': 'A200'
        })
            .accentPalette('bootbarn-warm-accent', {
            'default': 'A700'
        });
    }
    angular
        .module('pipTheme.BootBarn.Warm', ['ngMaterial'])
        .config(configureBootBarnWarmTheme);
}

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./BootBarnCoolTheme");
require("./BootBarnWarmTheme");
require("./BootBarnMonochromeTheme");
angular.module('pipTheme.BootBarn', [
    'ngMaterial',
    'pipTheme.BootBarn.Warm',
    'pipTheme.BootBarn.Cool',
    'pipTheme.BootBarn.Monochrome',
]);

},{"./BootBarnCoolTheme":1,"./BootBarnMonochromeTheme":2,"./BootBarnWarmTheme":3}],5:[function(require,module,exports){
"use strict";
initTheme.$inject = ['pipTheme'];
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeRootVar = "$theme";
exports.ThemeChangedEvent = "pipThemeChanged";
exports.ThemeResetPage = "pipResetPage";
var ThemeConfig = (function () {
    function ThemeConfig() {
    }
    return ThemeConfig;
}());
var ThemeService = (function () {
    function ThemeService($log, $rootScope, $window, $mdTheming, config, setRootVar, persist) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$window = $window;
        this.$mdTheming = $mdTheming;
        this._currentTheme = null;
        this._setRootVar = setRootVar;
        this._persist = persist;
        this._config = config;
        this._config.theme = this.$window.localStorage.getItem('theme') || this._config.theme || 'default';
        this.$log.debug("Set theme to " + this._config.theme);
        $('body').attr('md-theme', '{{' + exports.ThemeRootVar + '}}');
        this.save();
    }
    ThemeService.prototype.save = function () {
        var body = $('body');
        var newTheme = this._config.theme;
        body.addClass(newTheme);
        if (this._currentTheme != null && this._currentTheme != newTheme)
            body.removeClass(this._currentTheme);
        this._currentTheme = newTheme;
        if (this._setRootVar)
            this.$rootScope[exports.ThemeRootVar] = this._config.theme;
        if (this._persist && this.$window.localStorage != null)
            this.$window.localStorage.setItem('theme', this._config.theme);
    };
    Object.defineProperty(ThemeService.prototype, "theme", {
        get: function () {
            return this._config.theme;
        },
        set: function (value) {
            if (value != this._config.theme) {
                if (!(value in this.$mdTheming.THEMES))
                    throw new Error('Theme ' + value + ' is not defined. Please, register it first with $mdThemingProvider');
                this._config.theme = value;
                this.$log.debug("Changing theme to " + value);
                this.save();
                this.$rootScope.$emit(exports.ThemeChangedEvent, value);
                this.$rootScope.$emit(exports.ThemeResetPage);
            }
        },
        enumerable: true,
        configurable: true
    });
    ThemeService.prototype.use = function (theme) {
        if (theme != null) {
            this._config.theme = theme;
            this.save();
        }
        return this._config.theme;
    };
    return ThemeService;
}());
var ThemeProvider = (function () {
    function ThemeProvider() {
        this._config = new ThemeConfig();
        this._setRootVar = true;
        this._persist = true;
        this._config.theme = "default";
    }
    Object.defineProperty(ThemeProvider.prototype, "setRootVar", {
        get: function () {
            return this._setRootVar;
        },
        set: function (value) {
            this._setRootVar = !!value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ThemeProvider.prototype, "persist", {
        get: function () {
            return this._persist;
        },
        set: function (value) {
            this._persist = !!value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ThemeProvider.prototype, "theme", {
        get: function () {
            return this._config.theme;
        },
        set: function (value) {
            this._config.theme = value;
        },
        enumerable: true,
        configurable: true
    });
    ThemeProvider.prototype.use = function (theme) {
        if (theme != null) {
            this._config.theme = theme;
            var body = $('body');
            body.addClass(this._config.theme);
        }
        return this._config.theme;
    };
    ThemeProvider.prototype.$get = ['$rootScope', '$log', '$window', '$mdTheming', function ($rootScope, $log, $window, $mdTheming) {
        "ngInject";
        if (_.isUndefined(this._service) || _.isNull(this._service)) {
            this._service = new ThemeService($log, $rootScope, $window, this._config, $mdTheming, this._setRootVar, this._persist);
        }
        return this._service;
    }];
    return ThemeProvider;
}());
function initTheme(pipTheme) {
    pipTheme.theme;
}
angular
    .module('pipTheme')
    .provider('pipTheme', ThemeProvider)
    .run(initTheme);

},{}],6:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipTheme', ['ngMaterial']);
require("./ThemeService");
__export(require("./ThemeService"));

},{"./ThemeService":5}],7:[function(require,module,exports){
{
    configureDefaultAmberTheme.$inject = ['$mdThemingProvider'];
    function configureDefaultAmberTheme($mdThemingProvider) {
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
            'default': '50',
            'hue-1': 'A200',
            'hue-2': 'A700'
        })
            .warnPalette('red', {
            'default': 'A200'
        })
            .accentPalette('orange', {
            'default': '900'
        });
        $mdThemingProvider.alwaysWatchTheme(true);
    }
    angular
        .module('pipTheme.Amber', ['ngMaterial'])
        .config(configureDefaultAmberTheme);
}

},{}],8:[function(require,module,exports){
{
    configureDefaultBlueTheme.$inject = ['$mdThemingProvider'];
    function configureDefaultBlueTheme($mdThemingProvider) {
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
                'default': '50',
                'hue-1': 'A200',
                'hue-2': 'A700'
            })
                .warnPalette('red', {
                'default': 'A200'
            })
                .accentPalette('blue-accent', {
                'default': '600'
            });
        }
    }
    angular
        .module('pipTheme.Blue', ['ngMaterial'])
        .config(configureDefaultBlueTheme);
}

},{}],9:[function(require,module,exports){
{
    configureDefaultGreenTheme.$inject = ['$mdThemingProvider'];
    function configureDefaultGreenTheme($mdThemingProvider) {
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
            'default': '50',
            'hue-1': 'A200',
            'hue-2': 'A700'
        })
            .warnPalette('red', {
            'default': 'A200'
        })
            .accentPalette('green-accent', {
            'default': 'A700'
        });
        $mdThemingProvider.alwaysWatchTheme(true);
    }
    angular
        .module('pipTheme.Green', ['ngMaterial'])
        .config(configureDefaultGreenTheme);
}

},{}],10:[function(require,module,exports){
{
    configureDefaultGreyTheme.$inject = ['$mdThemingProvider'];
    function configureDefaultGreyTheme($mdThemingProvider) {
        var thirdPartyPalette = $mdThemingProvider.extendPalette('grey', {
            'A100': 'rgba(250, 250, 250, 1)',
            'A200': 'rgba(255, 152, 0, 1)',
            'A400': '#a9b9c0',
            '500': '#607D8B',
            'A700': '#90A4AE',
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
            'default': '50',
            'hue-1': '500',
            'hue-2': 'A700'
        })
            .warnPalette('red', {
            'default': 'A200'
        })
            .accentPalette('third-party', {
            'default': 'A700'
        });
        $mdThemingProvider.alwaysWatchTheme(true);
    }
    angular
        .module('pipTheme.Grey', ['ngMaterial'])
        .config(configureDefaultGreyTheme);
}

},{}],11:[function(require,module,exports){
{
    configureDefaultNavyTheme.$inject = ['$mdThemingProvider'];
    function configureDefaultNavyTheme($mdThemingProvider) {
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
            'default': '50',
            'hue-1': '700',
            'hue-2': 'A700'
        })
            .warnPalette('red', {
            'default': 'A200'
        })
            .accentPalette('teal', {
            'default': 'A700'
        });
        $mdThemingProvider.alwaysWatchTheme(true);
    }
    angular
        .module('pipTheme.Navy', ['ngMaterial'])
        .config(configureDefaultNavyTheme);
}

},{}],12:[function(require,module,exports){
{
    configureDefaultOrangeTheme.$inject = ['$mdThemingProvider'];
    function configureDefaultOrangeTheme($mdThemingProvider) {
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
            'default': '50',
            'hue-1': 'A200',
            'hue-2': 'A700'
        })
            .warnPalette('red', {
            'default': 'A200'
        })
            .accentPalette('red-primary', {
            'default': 'A100'
        });
        $mdThemingProvider.alwaysWatchTheme(true);
    }
    angular
        .module('pipTheme.Orange', ['ngMaterial'])
        .config(configureDefaultOrangeTheme);
}

},{}],13:[function(require,module,exports){
{
    configureDefaultPinkTheme.$inject = ['$mdThemingProvider'];
    function configureDefaultPinkTheme($mdThemingProvider) {
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
            'default': '50',
            'hue-1': 'A200',
            'hue-2': 'A700'
        })
            .warnPalette('red', {
            'default': 'A200'
        })
            .accentPalette('pink-primary', {
            'default': '600'
        });
        $mdThemingProvider.alwaysWatchTheme(true);
    }
    angular
        .module('pipTheme.Pink', ['ngMaterial'])
        .config(configureDefaultPinkTheme);
}

},{}],14:[function(require,module,exports){
"use strict";
configureDefaultTheme.$inject = ['$mdThemingProvider'];
Object.defineProperty(exports, "__esModule", { value: true });
require("./DefaultBlueTheme");
require("./DefaultPinkTheme");
require("./DefaultAmberTheme");
require("./DefaultOrangeTheme");
require("./DefaultGreenTheme");
require("./DefaultNavyTheme");
require("./DefaultGreyTheme");
function configureDefaultTheme($mdThemingProvider) {
    $mdThemingProvider.setDefaultTheme('default');
    $mdThemingProvider.alwaysWatchTheme(true);
}
angular
    .module('pipTheme.Default', [
    'ngMaterial',
    'pipTheme.Blue',
    'pipTheme.Pink',
    'pipTheme.Amber',
    'pipTheme.Orange',
    'pipTheme.Green',
    'pipTheme.Navy',
    'pipTheme.Grey'
])
    .config(configureDefaultTheme);

},{"./DefaultAmberTheme":7,"./DefaultBlueTheme":8,"./DefaultGreenTheme":9,"./DefaultGreyTheme":10,"./DefaultNavyTheme":11,"./DefaultOrangeTheme":12,"./DefaultPinkTheme":13}],15:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
require("./common");
require("./default");
require("./bootbarn");
__export(require("./common"));

},{"./bootbarn":4,"./common":6,"./default":14}]},{},[15])(15)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).errors = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorPageConfig = (function () {
    function ErrorPageConfig() {
    }
    return ErrorPageConfig;
}());
exports.ErrorPageConfig = ErrorPageConfig;
var ErrorPageConfigs = (function () {
    function ErrorPageConfigs() {
        this.Maintenance = {
            Active: true,
            Name: 'errors_maintenance',
            Event: 'pipMaintenanceError',
            Title: 'ERROR_MAINTENANCE_TITLE',
            SubTitle: 'ERROR_MAINTENANCE_SUBTITLE',
            Breadcrumb: 'ERROR_MAINTENANCE_TITLE',
            Image: 'images/maintenance.svg'
        };
        this.MissingRoute = {
            Active: true,
            Name: 'errors_missing_route',
            Event: '$stateNotFound',
            Title: 'ERROR_MISSING_ROUTE_TITLE',
            SubTitle: 'ERROR_MISSING_ROUTE_SUBTITLE',
            Breadcrumb: 'ERROR_MISSING_ROUTE_PAGE_TITLE',
            Image: 'images/invalid_route.svg'
        };
        this.NoConnection = {
            Active: true,
            Name: 'errors_no_connection',
            Event: 'pipNoConnectionError',
            Title: 'ERROR_NO_CONNECTION_TITLE',
            SubTitle: 'ERROR_NO_CONNECTION_SUBTITLE',
            Breadcrumb: 'ERROR_NO_CONNECTION_TITLE',
            Image: 'images/no_response.svg'
        };
        this.Unknown = {
            Active: true,
            Name: 'errors_unknown',
            Event: 'pipUnknownError',
            Title: 'ERROR_UNKNOWN_TITLE',
            SubTitle: 'ERROR_UNKNOWN_SUBTITLE',
            Breadcrumb: 'ERROR_UNKNOWN_TITLE',
            Image: 'images/unknown_error.svg'
        };
        this.Unsupported = {
            Active: true,
            Name: 'errors_unsupported',
            Event: '',
            Title: 'ERROR_UNSUPPORTED_TITLE',
            SubTitle: 'ERROR_UNSUPPORTED_SUBTITLE',
            Breadcrumb: 'ERROR_UNSUPPORTED_TITLE',
            Image: '',
            Params: {}
        };
    }
    return ErrorPageConfigs;
}());
exports.ErrorPageConfigs = ErrorPageConfigs;
var SupportedBrowsers = (function () {
    function SupportedBrowsers() {
        this.edge = 11;
        this.ie = 11;
        this.firefox = 43;
        this.opera = 35;
        this.chrome = 47;
    }
    return SupportedBrowsers;
}());
exports.SupportedBrowsers = SupportedBrowsers;
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorPageConfig_1 = require("./ErrorPageConfig");
var ErrorPageConfigService = (function () {
    ErrorPageConfigService.$inject = ['config'];
    function ErrorPageConfigService(config) {
        "ngInject";
        this._config = config || new ErrorPageConfig_1.ErrorPageConfigs();
    }
    Object.defineProperty(ErrorPageConfigService.prototype, "configs", {
        get: function () {
            return this._config;
        },
        enumerable: true,
        configurable: true
    });
    ErrorPageConfigService.prototype.getErrorPageConfig = function (pageName) {
        console.log(pageName, this._config);
        if (!pageName || !this._config[pageName]) {
            return null;
        }
        return this._config[pageName];
    };
    return ErrorPageConfigService;
}());
var ErrorPageConfigProvider = (function () {
    function ErrorPageConfigProvider() {
        this.configs = new ErrorPageConfig_1.ErrorPageConfigs();
        this.configs.Unsupported.Params.supported = new ErrorPageConfig_1.SupportedBrowsers();
    }
    ErrorPageConfigProvider.prototype.setErrorPageConfig = function (pageName, config) {
        if (!pageName || !config)
            return;
        if (!this.configs[pageName])
            return;
        this.configs[pageName] = _.defaultsDeep(config, this.configs[pageName]);
    };
    ErrorPageConfigProvider.prototype.setAllErrorPageConfigs = function (configs) {
        if (!configs)
            return;
        this.configs = _.defaultsDeep(configs, this.configs);
    };
    ErrorPageConfigProvider.prototype.setSupportedBrowsers = function (browsers) {
        this.configs.Unsupported.Params.supported = browsers;
    };
    ErrorPageConfigProvider.prototype.$get = function () {
        "ngInject";
        if (this._service == null) {
            this._service = new ErrorPageConfigService(this.configs);
        }
        return this._service;
    };
    return ErrorPageConfigProvider;
}());
(function () {
    angular
        .module('pipErrorPageConfigService', [])
        .provider('pipErrorPageConfigService', ErrorPageConfigProvider);
})();
},{"./ErrorPageConfig":1}],3:[function(require,module,exports){
(function () {
    var ClearErrorsLink = (function () {
        function ClearErrorsLink($scope, $element, $attrs, $ctrls) {
            var _this = this;
            this._fieldController = $ctrls[0];
            this._formController = $ctrls[1];
            $scope.$watch($attrs['ngModel'], function (newValue) {
                _this.clearFieldErrors();
                _this.clearFormErrors();
            });
        }
        ClearErrorsLink.prototype.clearFieldErrors = function () {
            var errors = this._fieldController.$error;
            for (var prop in errors) {
                if (errors.hasOwnProperty(prop) && prop.substring(0, 6) == 'ERROR_') {
                    this._fieldController.$setValidity(prop, true);
                }
            }
        };
        ClearErrorsLink.prototype.clearFormErrors = function () {
            this._formController.$serverError = {};
        };
        return ClearErrorsLink;
    }());
    function clearErrorsDirective() {
        return {
            restrict: 'A',
            require: ['ngModel', '^?form'],
            link: ClearErrorsLink
        };
    }
    angular
        .module('pipClearErrors', [])
        .directive('pipClearErrors', clearErrorsDirective);
})();
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormErrorsService = (function () {
    FormErrorsService.$inject = ['$rootScope'];
    function FormErrorsService($rootScope) {
        this.$rootScope = $rootScope;
    }
    FormErrorsService.prototype.errorsWithHint = function (field) {
        if (field == null)
            return;
        return _.isEmpty(field.$error) ? { hint: true } : field.$error;
    };
    ;
    FormErrorsService.prototype.touchedErrorsWithHint = function (form, field) {
        if (form == null)
            return;
        if (field == null)
            return;
        if (form.$submitted && (field.$touched || form.$dirty) || !form.$submitted && (field.$touched || field.$dirty)) {
            var result = _.isEmpty(field.$error) ? { hint: true } : field.$error;
            return result;
        }
        return { hint: true };
    };
    FormErrorsService.prototype.resetFormErrors = function (form, errors) {
        form.$setPristine();
        form.$setUntouched();
        if (errors) {
            form.$setDirty();
            form.$setSubmitted();
        }
        form['$serverError'] = {};
    };
    FormErrorsService.prototype.resetFieldsErrors = function (form, field) {
        if (!form)
            return;
        if (field && form[field] && form[field].$error) {
            form[field].$error = {};
        }
        else {
            for (var prop in form) {
                if (form[prop] && form[prop].$error) {
                    form[prop].$error = {};
                }
            }
            if (form && form.$error) {
                form.$error = {};
            }
        }
    };
    FormErrorsService.prototype.setFormError = function (form, error, errorFieldMap) {
        if (error == null)
            return;
        form['$serverError'] = form['$serverError'] || {};
        var code = error.code || (error.data || {}).code || null;
        if (!code && error.status)
            code = error.status;
        if (code) {
            var errorName = 'ERROR_' + code, field = errorFieldMap ? errorFieldMap[code] : null;
            if (field && form[field] && form[field].$setValidity) {
                form[field].$setValidity(errorName, false);
                return;
            }
            if (field == 'form') {
                form['$serverError'][errorName] = true;
                return;
            }
        }
        if (error.data && error.data.message) {
            form['$serverError']['ERROR_UNKNOWN'] = error.data.message;
            this.goToUnhandledErrorPage(error);
            return;
        }
        if (error.message) {
            form['$serverError']['ERROR_UNKNOWN'] = error.message;
            this.goToUnhandledErrorPage(error);
            return;
        }
        if (error.name) {
            form['$serverError']['ERROR_UNKNOWN'] = error.name;
            this.goToUnhandledErrorPage(error);
            return;
        }
        form['$serverError']['ERROR_UNKNOWN'] = error;
        this.goToUnhandledErrorPage(error);
    };
    FormErrorsService.prototype.goToUnhandledErrorPage = function (error) {
        this.$rootScope.$emit('pipUnhandledInternalError', {
            error: error
        });
    };
    return FormErrorsService;
}());
(function () {
    angular
        .module('pipFormErrors', [])
        .service('pipFormErrors', FormErrorsService);
})();
},{}],5:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular
    .module('pipErrors.Pages', [
    'ngMaterial'
]);
require("./maintenance/MaintenanceErrorPage");
require("./missing_route/MissingRouteErrorPage");
require("./no_connection/NoConnectionErrorPage");
require("./unknown/UnknownErrorPage");
require("./unsupported/UnsupportedErrorPage");
require("./error_pages/ErrorPageConfigService");
require("./no_connection_panel/NoConnectionPanel");
require("./form_errors/ClearErrorsDirective");
require("./form_errors/FormErrorsService");
angular
    .module('pipErrors', [
    'pipErrors.Templates',
    'pipErrors.Pages',
    'pipErrorPageConfigService',
    'pipNoConnectionPanel',
    'pipClearErrors',
    'pipFormErrors'
]);
__export(require("./error_pages/ErrorPageConfig"));
},{"./error_pages/ErrorPageConfig":1,"./error_pages/ErrorPageConfigService":2,"./form_errors/ClearErrorsDirective":3,"./form_errors/FormErrorsService":4,"./maintenance/MaintenanceErrorPage":6,"./missing_route/MissingRouteErrorPage":7,"./no_connection/NoConnectionErrorPage":8,"./no_connection_panel/NoConnectionPanel":9,"./unknown/UnknownErrorPage":10,"./unsupported/UnsupportedErrorPage":11}],6:[function(require,module,exports){
"use strict";
configureMaintenanceErrorPageRoute.$inject = ['$stateProvider'];
initMaintenanceErrorPage.$inject = ['$rootScope', '$state', 'pipErrorPageConfigService'];
setMaintenanceErrorPageResources.$inject = ['$injector'];
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorsMaintenanceState = 'errors_maintenance';
exports.MaintenanceErrorEvent = 'pipMaintenanceError';
var MaintenanceError = (function () {
    function MaintenanceError() {
    }
    return MaintenanceError;
}());
var MaintenanceErrorConfig = (function () {
    function MaintenanceErrorConfig() {
    }
    return MaintenanceErrorConfig;
}());
var MaintenanceErrorParams = (function () {
    function MaintenanceErrorParams() {
        this.interval = 0;
    }
    return MaintenanceErrorParams;
}());
var MaintenanceErrorPageController = (function () {
    MaintenanceErrorPageController.$inject = ['$scope', '$state', '$rootScope', '$mdMedia', '$injector', 'pipErrorPageConfigService'];
    function MaintenanceErrorPageController($scope, $state, $rootScope, $mdMedia, $injector, pipErrorPageConfigService) {
        "ngInject";
        this._pageName = 'Maintenance';
        this.isCordova = false;
        var pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
        this.config = pipErrorPageConfigService.getErrorPageConfig(this._pageName);
        this.pipNavService = $injector.has('pipNavService') ? $injector.get('pipNavService') : null;
        this.media = pipMedia ? pipMedia : $mdMedia;
        $rootScope[pip.services.RoutingVar] = false;
        this.appHeader();
        this.error = $state && $state.params && $state.params['error'] ? $state.params['error'] : {};
        this.timeoutInterval = this.error && this.error.config &&
            this.error.config.params && this.error.config.params.interval ? this.error.config.params.interval : 0;
    }
    MaintenanceErrorPageController.prototype.appHeader = function () {
        if (!this.pipNavService)
            return;
        this.pipNavService.appbar.addShadow();
        this.pipNavService.icon.showMenu();
        this.pipNavService.breadcrumb.text = this.config.Breadcrumb;
        this.pipNavService.actions.hide();
    };
    return MaintenanceErrorPageController;
}());
function configureMaintenanceErrorPageRoute($stateProvider) {
    "ngInject";
    $stateProvider
        .state(exports.ErrorsMaintenanceState, {
        url: '/errors/maintenance',
        params: {
            error: null
        },
        controller: MaintenanceErrorPageController,
        controllerAs: '$ctrl',
        templateUrl: 'maintenance/MaintenanceErrorPage.html'
    });
}
function initMaintenanceErrorPage($rootScope, $state, pipErrorPageConfigService) {
    "ngInject";
    var _this = this;
    var config = pipErrorPageConfigService.configs;
    if (!config.Maintenance.Active)
        return;
    $rootScope.$on(exports.MaintenanceErrorEvent, function (event, params) {
        _this.$state.go(exports.ErrorsMaintenanceState, params);
    });
}
function setMaintenanceErrorPageResources($injector) {
    var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
    if (pipTranslate == null)
        return;
    pipTranslate.translations('en', {
        'ERROR_MAINTENANCE_TITLE': 'The server is on maintenance',
        'ERROR_MAINTENANCE_SUBTITLE': 'Sorry for the inconvenience. This application is undergoing maintenance for ' +
            'a short period. We\'ll be back soon. Thank for your patience.',
        'ERROR_MAINTENANCE_CLOSE': 'Close',
        'ERROR_MAINTENANCE_TRY_AGAIN': 'Try after'
    });
    pipTranslate.translations('ru', {
        'ERROR_MAINTENANCE_TITLE': 'The server is on maintenance',
        'ERROR_MAINTENANCE_SUBTITLE': 'Sorry for the inconvenience. This application is undergoing maintenance for ' +
            'a short period. We\'ll be back soon. Thank for your patience.',
        'ERROR_MAINTENANCE_CLOSE': 'Close',
        'ERROR_MAINTENANCE_TRY_AGAIN': 'Try after'
    });
}
(function () {
    angular
        .module('pipErrors.Pages')
        .config(configureMaintenanceErrorPageRoute)
        .run(initMaintenanceErrorPage)
        .run(setMaintenanceErrorPageResources);
})();
},{}],7:[function(require,module,exports){
"use strict";
configureMissingRouteErrorPageRoute.$inject = ['$stateProvider'];
initMissingRouteErrorPage.$inject = ['$rootScope', '$state', '$injector', 'pipErrorPageConfigService'];
setMissingRouteErrorPageResources.$inject = ['$injector'];
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorsMissingRouteState = 'errors_missing_route';
exports.StateNotFoundEvent = '$stateNotFound';
var MissingRouteErrorState = (function () {
    function MissingRouteErrorState() {
    }
    return MissingRouteErrorState;
}());
var MissingRouteErrorPageController = (function () {
    MissingRouteErrorPageController.$inject = ['$scope', '$location', '$state', '$rootScope', '$mdMedia', '$injector', 'pipErrorPageConfigService'];
    function MissingRouteErrorPageController($scope, $location, $state, $rootScope, $mdMedia, $injector, pipErrorPageConfigService) {
        "ngInject";
        this.$location = $location;
        this._pageName = 'MissingRoute';
        this.isCordova = false;
        var pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
        this.config = pipErrorPageConfigService.getErrorPageConfig(this._pageName);
        this.pipNavService = $injector.has('pipNavService') ? $injector.get('pipNavService') : null;
        this.media = pipMedia ? pipMedia : $mdMedia;
        $rootScope[pip.services.RoutingVar] = false;
        this.appHeader();
        this.fromState = $state && $state.params && $state.params['fromState'] ? $state.params['fromState'] : {};
        this.unfoundState = $state && $state.params ? $state.params['unfoundState'] : {};
        this.url = this.unfoundState && this.unfoundState.to ? $state.href(this.unfoundState.to, this.unfoundState.toParams, { absolute: true }) : '';
        this.urlBack = this.fromState && this.fromState.to ? $state.href(this.fromState.to, this.fromState.fromParams, { absolute: true }) : '';
    }
    MissingRouteErrorPageController.prototype.appHeader = function () {
        if (!this.pipNavService)
            return;
        this.pipNavService.appbar.addShadow();
        this.pipNavService.icon.showMenu();
        this.pipNavService.breadcrumb.text = this.config.Breadcrumb;
        this.pipNavService.actions.hide();
    };
    MissingRouteErrorPageController.prototype.onContinue = function () {
        this.$location.url('/');
    };
    return MissingRouteErrorPageController;
}());
function configureMissingRouteErrorPageRoute($stateProvider) {
    "ngInject";
    $stateProvider
        .state(exports.ErrorsMissingRouteState, {
        url: '/errors/missing_route',
        params: {
            unfoundState: null,
            fromState: null
        },
        controller: MissingRouteErrorPageController,
        controllerAs: '$ctrl',
        templateUrl: 'missing_route/MissingRouteErrorPage.html'
    });
}
function initMissingRouteErrorPage($rootScope, $state, $injector, pipErrorPageConfigService) {
    "ngInject";
    var config = pipErrorPageConfigService.configs;
    if (!config.MissingRoute.Active)
        return;
    $rootScope.$on(exports.StateNotFoundEvent, function (event, unfoundState, fromState, fromParams) {
        event.preventDefault();
        $state.go(exports.ErrorsMissingRouteState, {
            unfoundState: unfoundState,
            fromState: {
                to: fromState ? fromState.name : '',
                fromParams: fromParams
            }
        });
        $rootScope[pip.services.RoutingVar] = false;
    });
}
function setMissingRouteErrorPageResources($injector) {
    var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
    if (pipTranslate == null)
        return;
    pipTranslate.translations('en', {
        'ERROR_MISSING_ROUTE_TITLE': 'Sorry, the page isn\'t available',
        'ERROR_MISSING_ROUTE_SUBTITLE': 'The link you followed may be broken, or the page may have been removed.',
        'ERROR_MISSING_ROUTE_CONTINUE': 'Continue',
        'ERROR_MISSING_ROUTE_TRY_AGAIN': 'Try again',
        'ERROR_MISSING_ROUTE_GO_BACK': 'Go Back',
        'ERROR_MISSING_ROUTE_PAGE_TITLE': 'Wrong page'
    });
    pipTranslate.translations('ru', {
        'ERROR_MISSING_ROUTE_TITLE': 'Sorry, the page isn\'t available',
        'ERROR_MISSING_ROUTE_SUBTITLE': 'The link you followed may be broken, or the page may have been removed.',
        'ERROR_MISSING_ROUTE_CONTINUE': 'Continue',
        'ERROR_MISSING_ROUTE_TRY_AGAIN': 'Try again',
        'ERROR_MISSING_ROUTE_GO_BACK': 'Go Back',
        'ERROR_MISSING_ROUTE_PAGE_TITLE': 'Wrong page'
    });
}
(function () {
    angular
        .module('pipErrors.Pages')
        .config(configureMissingRouteErrorPageRoute)
        .run(initMissingRouteErrorPage)
        .run(setMissingRouteErrorPageResources);
})();
},{}],8:[function(require,module,exports){
"use strict";
configureNoConnectionErrorPageRoute.$inject = ['$injector', '$stateProvider'];
initNoConnectionErrorPage.$inject = ['$rootScope', '$state', 'pipErrorPageConfigService'];
setNoConnectionErrorPageResources.$inject = ['$injector'];
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorsConnectionState = 'errors_no_connection';
exports.ErrorsConnectionEvent = 'pipNoConnectionError';
var NoConnectionError = (function () {
    function NoConnectionError() {
    }
    return NoConnectionError;
}());
var NoConnectionErrorPageController = (function () {
    NoConnectionErrorPageController.$inject = ['$window', '$scope', '$state', '$rootScope', '$mdMedia', '$injector', 'pipErrorPageConfigService'];
    function NoConnectionErrorPageController($window, $scope, $state, $rootScope, $mdMedia, $injector, pipErrorPageConfigService) {
        "ngInject";
        this.$window = $window;
        this._pageName = 'NoConnection';
        this.isCordova = false;
        var pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
        this.errorConfig = pipErrorPageConfigService.getErrorPageConfig(this._pageName);
        this.pipNavService = $injector.has('pipNavService') ? $injector.get('pipNavService') : null;
        this.media = pipMedia ? pipMedia : $mdMedia;
        $rootScope[pip.services.RoutingVar] = false;
        this.appHeader();
        this.error = $state && $state.params && $state.params['error'] ? $state.params['error'] : {};
    }
    NoConnectionErrorPageController.prototype.appHeader = function () {
        if (!this.pipNavService)
            return;
        this.pipNavService.appbar.addShadow();
        this.pipNavService.icon.showMenu();
        this.pipNavService.breadcrumb.text = this.errorConfig.Breadcrumb;
        this.pipNavService.actions.hide();
    };
    NoConnectionErrorPageController.prototype.onRetry = function () {
        this.$window.history.back();
    };
    return NoConnectionErrorPageController;
}());
function configureNoConnectionErrorPageRoute($injector, $stateProvider) {
    "ngInject";
    $stateProvider
        .state(exports.ErrorsConnectionState, {
        url: '/errors/no_connection',
        params: {
            error: null
        },
        controller: NoConnectionErrorPageController,
        controllerAs: '$ctrl',
        templateUrl: 'no_connection/NoConnectionErrorPage.html'
    });
}
function initNoConnectionErrorPage($rootScope, $state, pipErrorPageConfigService) {
    "ngInject";
    var _this = this;
    var config = pipErrorPageConfigService.configs;
    if (!config.NoConnection.Active)
        return;
    $rootScope.$on(exports.ErrorsConnectionEvent, function (event, params) {
        _this.$state.go(exports.ErrorsConnectionState, params);
    });
}
function setNoConnectionErrorPageResources($injector) {
    var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
    if (pipTranslate == null)
        return;
    pipTranslate.translations('en', {
        'ERROR_NO_CONNECTION_TITLE': 'No connection to the server',
        'ERROR_NO_CONNECTION_SUBTITLE': 'Unable to connect to the server. Check your Internet connection and try again.',
        'ERROR_NO_CONNECTION_RETRY': 'Retry',
    });
    pipTranslate.translations('ru', {
        'ERROR_NO_CONNECTION_TITLE': 'No connection to the server',
        'ERROR_NO_CONNECTION_SUBTITLE': 'Unable to connect to server. Check your Internet connection and try again.',
        'ERROR_NO_CONNECTION_RETRY': 'Retry',
    });
}
(function () {
    angular
        .module('pipErrors.Pages')
        .config(configureNoConnectionErrorPageRoute)
        .run(initNoConnectionErrorPage)
        .run(setNoConnectionErrorPageResources);
})();
},{}],9:[function(require,module,exports){
(function () {
    var NoConnectionPanelController = (function () {
        NoConnectionPanelController.$inject = ['$scope'];
        function NoConnectionPanelController($scope) {
            this._retry = $scope['retry'];
            this.error = $scope['error'];
        }
        NoConnectionPanelController.prototype.onRetry = function () {
            if (this._retry && angular.isFunction(this._retry))
                this._retry();
        };
        return NoConnectionPanelController;
    }());
    angular
        .module("pipNoConnectionPanel", [])
        .directive('pipNoConnectionPanel', function () {
        return {
            restrict: 'E',
            scope: {
                error: '=pipError',
                retry: '=pipRetry'
            },
            templateUrl: 'no_connection_panel/NoConnectionPanel.html',
            controller: NoConnectionPanelController,
            controllerAs: '$ctrl'
        };
    });
})();
},{}],10:[function(require,module,exports){
"use strict";
configureUnknownErrorPageRoute.$inject = ['$injector', '$stateProvider'];
initUnknownErrorPage.$inject = ['$rootScope', '$state', 'pipErrorPageConfigService'];
setUnknownErrorPageResources.$inject = ['$injector'];
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorsUnknownState = 'errors_unknown';
exports.ErrorsUnknownEvent = 'pipUnknownError';
var UnknownErrorDetails = (function () {
    function UnknownErrorDetails() {
    }
    return UnknownErrorDetails;
}());
var UnknownErrorPageController = (function () {
    UnknownErrorPageController.$inject = ['$scope', '$state', '$rootScope', '$mdMedia', '$injector', 'pipErrorPageConfigService'];
    function UnknownErrorPageController($scope, $state, $rootScope, $mdMedia, $injector, pipErrorPageConfigService) {
        "ngInject";
        this._pageName = 'Unknown';
        this.isCordova = false;
        var pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
        this.config = pipErrorPageConfigService.getErrorPageConfig(this._pageName);
        this.pipNavService = $injector.has('pipNavService') ? $injector.get('pipNavService') : null;
        this.media = pipMedia ? pipMedia : $mdMedia;
        $rootScope[pip.services.RoutingVar] = false;
        this.showError = $scope['showError'];
        this.appHeader();
        this.error = $state && $state.params && $state.params['error'] ? $state.params['error'] : {};
        this.parseError();
    }
    UnknownErrorPageController.prototype.appHeader = function () {
        if (!this.pipNavService)
            return;
        this.pipNavService.appbar.addShadow();
        this.pipNavService.icon.showMenu();
        this.pipNavService.breadcrumb.text = this.config.Breadcrumb;
        this.pipNavService.actions.hide();
    };
    UnknownErrorPageController.prototype.parseError = function () {
        this.error_details = new UnknownErrorDetails();
        this.error_details.code = this.error.code;
        this.error_details.message = this.error.message;
        this.error_details.status = this.error.status;
        this.error_details.server_stacktrace = function () { };
        this.error_details.client_stacktrace = function () { };
    };
    UnknownErrorPageController.prototype.onDetails = function () {
        this.showError = true;
    };
    return UnknownErrorPageController;
}());
function configureUnknownErrorPageRoute($injector, $stateProvider) {
    "ngInject";
    $stateProvider
        .state(exports.ErrorsUnknownState, {
        url: '/errors/unknown',
        params: {
            error: null
        },
        controllerAs: '$ctrl',
        controller: UnknownErrorPageController,
        templateUrl: 'unknown/UnknownErrorPage.html'
    });
}
function initUnknownErrorPage($rootScope, $state, pipErrorPageConfigService) {
    "ngInject";
    var _this = this;
    var config = pipErrorPageConfigService.configs;
    if (!config.Unknown.Active)
        return;
    $rootScope.$on(exports.ErrorsUnknownEvent, function (event, params) {
        _this.$state.go(exports.ErrorsUnknownState, params);
    });
}
function setUnknownErrorPageResources($injector) {
    var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
    if (pipTranslate == null)
        return;
    pipTranslate.translations('en', {
        'ERROR_UNKNOWN_TITLE': 'Oops. Something went wrong',
        'ERROR_UNKNOWN_SUBTITLE': 'Unknown error occurred, but don\'t worry we already have been notified.',
        'ERROR_UNKNOWN_CLOSE': 'Close',
        'ERROR_UNKNOWN_DETAILS': 'Details',
    });
    pipTranslate.translations('ru', {
        'ERROR_UNKNOWN_TITLE': 'Oops. Something went wrong',
        'ERROR_UNKNOWN_SUBTITLE': 'Unknown error occurred, but don\'t worry we already have been notified.',
        'ERROR_UNKNOWN_CLOSE': 'Close',
        'ERROR_UNKNOWN_DETAILS': 'Details',
    });
}
(function () {
    angular
        .module('pipErrors.Pages')
        .config(configureUnknownErrorPageRoute)
        .run(initUnknownErrorPage)
        .run(setUnknownErrorPageResources);
})();
},{}],11:[function(require,module,exports){
"use strict";
configureUnsupportedErrorPageRoute.$inject = ['$stateProvider'];
initUnsupportedErrorPage.$inject = ['$rootScope', '$state', '$injector', 'pipErrorPageConfigService'];
setUnsupportedErrorPageResources.$inject = ['$injector'];
Object.defineProperty(exports, "__esModule", { value: true });
var UnsupportedError = (function () {
    function UnsupportedError() {
    }
    return UnsupportedError;
}());
var UnsupportedErrorPageController = (function () {
    UnsupportedErrorPageController.$inject = ['$scope', '$state', '$rootScope', '$mdMedia', '$injector', 'pipErrorPageConfigService'];
    function UnsupportedErrorPageController($scope, $state, $rootScope, $mdMedia, $injector, pipErrorPageConfigService) {
        "ngInject";
        this._pageName = 'Unsupported';
        this.isCordova = false;
        var pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
        this.errorConfig = pipErrorPageConfigService.getErrorPageConfig(this._pageName);
        this.pipNavService = $injector.has('pipNavService') ? $injector.get('pipNavService') : null;
        this.media = pipMedia ? pipMedia : $mdMedia;
        $rootScope[pip.services.RoutingVar] = false;
        this.appHeader();
        this.error = $state && $state.params && $state.params['error'] ? $state.params['error'] : {};
    }
    UnsupportedErrorPageController.prototype.appHeader = function () {
        if (!this.pipNavService)
            return;
        this.pipNavService.appbar.addShadow();
        this.pipNavService.icon.showMenu();
        this.pipNavService.breadcrumb.text = this.errorConfig.Breadcrumb;
        this.pipNavService.actions.hide();
    };
    return UnsupportedErrorPageController;
}());
function configureUnsupportedErrorPageRoute($stateProvider) {
    "ngInject";
    $stateProvider
        .state('errors_unsupported', {
        url: '/errors/unsupported',
        params: {
            error: null
        },
        controllerAs: '$ctrl',
        controller: UnsupportedErrorPageController,
        templateUrl: 'unsupported/UnsupportedErrorPage.html'
    });
}
function initUnsupportedErrorPage($rootScope, $state, $injector, pipErrorPageConfigService) {
    "ngInject";
    var config = pipErrorPageConfigService.configs;
    if (!config.Unsupported.Active)
        return;
    var pipSystemInfo = $injector.has('pipSystemInfo') ? $injector.get('pipSystemInfo') : null;
    if (!pipSystemInfo) {
        return;
    }
    var supportedVersions = config.Unsupported.Params.supported;
    var browser = pipSystemInfo.browserName;
    var version = pipSystemInfo.browserVersion;
    version = version.split(".")[0];
    if (browser
        && supportedVersions[browser]
        && version >= supportedVersions[browser]) {
        return;
    }
    this.$state.go('errors_unsupported');
}
function setUnsupportedErrorPageResources($injector) {
    var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
    if (pipTranslate == null)
        return;
    pipTranslate.translations('en', {
        'ERROR_UNSUPPORTED_TITLE': 'This browser is not supported',
        'ERROR_UNSUPPORTED_SUBTITLE': 'Our application using the latest technology. This makes the application faster ' +
            'and easier to use. Unfortunately, your browser doesn\'t support those ' +
            'technologies. Download one of these great browsers and you\'ll be on your way:',
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
        'ERROR_UNSUPPORTED_TITLE': 'This browser is not supported',
        'ERROR_UNSUPPORTED_SUBTITLE': 'Our application using the latest technology. This makes the application faster ' +
            'and easier to use. Unfortunately, your browser doesn\'t support those ' +
            'technologies. Download one of these great browsers and you\'ll be on your way:',
        'ERROR_UNSUPPORTED_O': 'Opera',
        'ERROR_UNSUPPORTED_O_VER': 'Version 35+',
        'ERROR_UNSUPPORTED_IE': 'Internet Explorer',
        'ERROR_UNSUPPORTED_IE_VER': 'Version 11+',
        'ERROR_UNSUPPORTED_GC': 'Google Chrome',
        'ERROR_UNSUPPORTED_GC_VER': 'Version 47+',
        'ERROR_UNSUPPORTED_FM': 'Mozilla Firefox',
        'ERROR_UNSUPPORTED_FM_VER': 'Version 43+'
    });
}
(function () {
    angular
        .module('pipErrors.Pages')
        .config(configureUnsupportedErrorPageRoute)
        .run(initUnsupportedErrorPage)
        .run(setUnsupportedErrorPageResources);
})();
},{}],12:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipErrors.Templates');
} catch (e) {
  module = angular.module('pipErrors.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('maintenance/MaintenanceErrorPage.html',
    '<div class="pip-error-scroll-body pip-scroll"><div class="pip-error pip-error-page layout-column flex layout-align-center-center"><img src="{{$ctrl.config.Image}}" class="pip-pic block"><div class="pip-error-text">{{::\'ERROR_MAINTENANCE_TITLE\' | translate}}</div><div class="pip-error-subtext">{{::\'ERROR_MAINTENANCE_SUBTITLE\' | translate}}</div><div class="pip-error-subtext" ng-if="$ctrl.timeoutInterval">{{::\'ERROR_MAINTENANCE_TRY_AGAIN\' | translate}} {{timeoutInterval}} sec.</div><div class="pip-error-actions h48 layout-column layout-align-center-center" ng-if="$ctrl.isCordova"><md-button class="md-accent" ng-click="$ctrl.onClose($event)" aria-label="CLOSE">{{::\'ERROR_MAINTENANCE_CLOSE\' | translate}}</md-button></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipErrors.Templates');
} catch (e) {
  module = angular.module('pipErrors.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('missing_route/MissingRouteErrorPage.html',
    '<div class="pip-error-scroll-body pip-scroll"><div class="pip-error pip-error-page layout-column flex layout-align-center-center"><img src="{{$ctrl.config.Image}}" class="pip-pic block"><div class="pip-error-text">{{::$ctrl.config.Title | translate}}</div><div class="pip-error-subtext">{{::$ctrl.config.SubTitle | translate}}</div><div class="pip-error-actions h48 layout-column layout-align-center-center"><md-button aria-label="CONTINUE" class="md-accent" ng-click="$ctrl.onContinue($event)">{{::\'ERROR_MISSING_ROUTE_CONTINUE\' | translate}}</md-button></div><div class="h48" ng-if="url"><a ng-href="{{$ctrl.url}}">{{::\'ERROR_MISSING_ROUTE_TRY_AGAIN\' | translate }}: {{$ctrl.url}}</a></div><div class="h48" ng-if="urlBack"><a ng-href="{{$ctrl.urlBack}}">{{::\'ERROR_MISSING_ROUTE_GO_BACK\' | translate }}: {{$ctrl.urlBack}}</a></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipErrors.Templates');
} catch (e) {
  module = angular.module('pipErrors.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('no_connection/NoConnectionErrorPage.html',
    '<div class="pip-error-scroll-body pip-scroll"><div class="pip-error pip-error-page layout-column flex layout-align-center-center"><img src="{{$ctrl.errorConfig.Image}}" class="pip-pic block"><div class="pip-error-text">{{::$ctrl.errorConfig.Title | translate}}</div><div class="pip-error-subtext">{{::$ctrl.errorConfig.SubTitle | translate}}</div><div class="pip-error-actions h48 layout-column layout-align-center-center"><md-button aria-label="RETRY" class="md-accent" ng-click="$ctrl.onRetry($event)">{{::\'ERROR_NO_CONNECTION_RETRY\' | translate}}</md-button></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipErrors.Templates');
} catch (e) {
  module = angular.module('pipErrors.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('no_connection_panel/NoConnectionPanel.html',
    '<div class="pip-error-page pip-error layout-column layout-align-center-center flex"><img src="{{$ctrl.error.Image}}" class="pip-pic block"><div class="pip-error-text">{{::$ctrl.error.Title | translate}}</div><div class="pip-error-subtext">{{::$ctrl.error.SubTitle | translate}}</div><div class="pip-error-actions h48 layout-column layout-align-center-center"><md-button aria-label="RETRY" class="md-accent" ng-click="$ctrl.onRetry($event)">{{::\'ERROR_NO_CONNECTION_RETRY\' | translate}}</md-button></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipErrors.Templates');
} catch (e) {
  module = angular.module('pipErrors.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('unknown/UnknownErrorPage.html',
    '<div class="pip-error-scroll-body pip-scroll"><div class="pip-error pip-error-page layout-column flex layout-align-center-center"><img src="{{$ctrl.config.Image}}" class="pip-pic block"><div class="pip-error-text">{{::$ctrl.config.Title | translate}}</div><div class="pip-error-subtext">{{::$ctrl.config.SubTitle | translate}}</div><div class="pip-error-subtext" ng-if="$ctrl.showError && $ctrl.error_details && $ctrl.error_details.message"><div ng-if="$ctrl.error_details.code">Code: {{$ctrl.error_details.code}}</div><div ng-if="$ctrl.error_details.message">Description: {{$ctrl.error_details.message}}</div><div ng-if="$ctrl.error_details.status">HTTP status: {{$ctrl.error_details.status}}</div><div ng-if="$ctrl.error_details.server_stacktrace">Server stacktrace: {{$ctrl.error_details.server_stacktrace}}</div><div ng-if="$ctrl.error_details.client_stacktrace">Client stacktrace stacktrace: {{$ctrl.error_details.client_stacktrace}}</div></div><div class="pip-error-actions layout-column layout-align-center-center"><div class="h48" ng-if="$ctrl.isCordova"><md-button aria-label="CLOSE" class="md-accent" ng-click="$ctrl.onClose($event)">{{::\'ERROR_UNKNOWN_CLOSE\' | translate}}</md-button></div><div class="h48" ng-if="$ctrl.error_details && $ctrl.error_details.status"><md-button aria-label="DETAILS" class="md-accent" ng-click="$ctrl.onDetails($event)">{{::\'ERROR_UNKNOWN_DETAILS\' | translate}}</md-button></div></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipErrors.Templates');
} catch (e) {
  module = angular.module('pipErrors.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('unsupported/UnsupportedErrorPage.html',
    '<div class="pip-error-scroll-body pip-scroll"><div class="pip-error pip-error-page layout-column flex layout-align-center-center"><div class="pip-error-text">{{::$ctrl.errorConfig.Title | translate}}</div><div class="pip-error-subtext">{{::$ctrl.errorConfig.SubTitle | translate}}</div><div class="pip-error-details layout-row layout-align-center-center" ng-if="$ctrl.media(\'gt-xs\')"><div class="pip-error-details-item layout-column layout-align-center-center"><div style="background-image: url(\'images/ie.svg\');" class="pip-pic"></div><div class="h64 tp16 bp16"><a class="text-body2 m0" target="_blank" href="https://www.microsoft.com/en-us/download/internet-explorer-11-for-windows-7-details.aspx">{{::\'ERROR_UNSUPPORTED_IE\' | translate}}</a><p class="text-body1 m0">{{::\'ERROR_UNSUPPORTED_IE_VER\' | translate}}</p></div></div><div class="pip-error-details-item layout-column layout-align-center-center"><div style="background-image: url(\'images/fm.svg\');" class="pip-pic"></div><div class="h64 tp16 bp16"><a class="text-body2 m0" target="_blank" href="https://www.mozilla.org/ru/firefox/new/">{{::\'ERROR_UNSUPPORTED_FM\' | translate}}</a><p class="text-body1 m0">{{::\'ERROR_UNSUPPORTED_FM_VER\' | translate}}</p></div></div><div class="pip-error-details-item layout-column layout-align-center-center"><div style="background-image: url(\'images/gc.svg\');" class="pip-pic"></div><div class="h64 tp16 bp16"><a class="text-body2 m0" target="_blank" href="https://www.google.com/chrome/browser/desktop/index.html?platform=win64#">{{::\'ERROR_UNSUPPORTED_GC\' | translate}}</a><p class="text-body1 m0">{{::\'ERROR_UNSUPPORTED_GC_VER\' | translate}}</p></div></div><div class="pip-error-details-item layout-column layout-align-center-center"><div style="background-image: url(\'images/o.svg\');" class="pip-pic"></div><div class="h64 tp16 bp16"><a class="text-body2 m0" target="_blank" href="http://www.opera.com/ru/download">{{::\'ERROR_UNSUPPORTED_O\' | translate}}</a><p class="text-body1 m0">{{::\'ERROR_UNSUPPORTED_O_VER\' | translate}}</p></div></div></div><div class="pip-error-details" ng-if="$ctrl.media(\'xs\')"><div class="layout-row layout-align-center-center"><div class="pip-error-details-item layout-column layout-align-center-center"><div style="background-image: url(\'images/ie.svg\');" class="pip-pic"></div><div class="h64 tp16 bp16"><a class="text-body2 m0" target="_blank" href="https://www.microsoft.com/en-us/download/internet-explorer-11-for-windows-7-details.aspx">{{::\'ERROR_UNSUPPORTED_IE\' | translate}}</a><p class="text-body1 m0">{{::\'ERROR_UNSUPPORTED_IE_VER\' | translate}}</p></div></div><div class="pip-error-details-item layout-column layout-align-center-center"><div style="background-image: url(\'images/fm.svg\');" class="pip-pic"></div><div class="h64 tp16 bp16"><a class="text-body2 m0" target="_blank" href="https://www.mozilla.org/ru/firefox/new/">{{::\'ERROR_UNSUPPORTED_FM\' | translate}}</a><p class="text-body1 m0">{{::\'ERROR_UNSUPPORTED_FM_VER\' | translate}}</p></div></div></div><div class="tm16 layout-row layout-align-center-center"><div class="pip-error-details-item layout-column layout-align-center-center"><div style="background-image: url(\'images/gc.svg\');" class="pip-pic"></div><div class="h64 tp16 bp16"><a class="text-body2 m0" target="_blank" href="https://www.google.com/chrome/browser/desktop/index.html?platform=win64#">{{::\'ERROR_UNSUPPORTED_GC\' | translate}}</a><p class="text-body1 m0">{{::\'ERROR_UNSUPPORTED_GC_VER\' | translate}}</p></div></div><div class="pip-error-details-item layout-column layout-align-center-center"><div style="background-image: url(\'images/o.svg\');" class="pip-pic"></div><div class="h64 tp16 bp16"><a class="text-body2 m0" target="_blank" href="http://www.opera.com/ru/download">{{::\'ERROR_UNSUPPORTED_O\' | translate}}</a><p class="text-body1 m0">{{::\'ERROR_UNSUPPORTED_O_VER\' | translate}}</p></div></div></div></div></div></div>');
}]);
})();



},{}]},{},[12,5])(12)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).charts = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
{
    var BarChartBindings = {
        series: '<pipSeries',
        xTickFormat: '<?pipXTickFormat',
        yTickFormat: '<?pipYTickFormat',
        interactiveLegend: '<?pipInterLegend'
    };
    var BarChartBindingsChanges = (function () {
        function BarChartBindingsChanges() {
        }
        return BarChartBindingsChanges;
    }());
    var BarChartController = (function () {
        BarChartController.$inject = ['$element', '$scope', '$timeout', 'pipChartColors'];
        function BarChartController($element, $scope, $timeout, pipChartColors) {
            "ngInject";
            var _this = this;
            this.$element = $element;
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.pipChartColors = pipChartColors;
            this.chart = null;
            this.height = 270;
            this.colors = this.pipChartColors.generateMaterialColors();
            $scope.$watch('$ctrl.legend', function (updatedLegend) {
                if (!updatedLegend)
                    return;
                _this.data = _this.prepareData(updatedLegend);
                _this.legend = updatedLegend;
                _this.updateChart();
            }, true);
        }
        BarChartController.prototype.$onInit = function () {
            var _this = this;
            this.data = this.prepareData(this.series);
            this.legend = _.clone(this.series);
            this.generateParameterColor();
            d3.scale.paletteColors = function () {
                return d3.scale.ordinal().range(_this.colors.map(function (color) {
                    return _this.pipChartColors.materialColorToRgba(color);
                }));
            };
            this.instantiateChart();
        };
        BarChartController.prototype.$onChanges = function (changes) {
            this.xTickFormat = changes.xTickFormat ? changes.xTickFormat.currentValue : null;
            this.yTickFormat = changes.yTickFormat ? changes.yTickFormat.currentValue : null;
            this.interactiveLegend = changes.interactiveLegend ? changes.interactiveLegend.currentValue : null;
            if (changes.series && changes.series.currentValue !== changes.series.previousValue) {
                this.series = changes.series.currentValue;
                this.data = this.prepareData(this.series);
                this.legend = _.clone(this.series);
                this.generateParameterColor();
                this.updateChart();
            }
        };
        BarChartController.prototype.updateChart = function () {
            if (this.chart) {
                this.chartElem.datum(this.data).call(this.chart);
                this.configBarWidthAndLabel();
                this.drawEmptyState();
            }
        };
        BarChartController.prototype.instantiateChart = function () {
            var _this = this;
            nv.addGraph(function () {
                _this.chart = nv.models.discreteBarChart()
                    .margin({
                    top: 10,
                    right: 0,
                    bottom: 10,
                    left: 50
                })
                    .x(function (d) {
                    return d.label || d.key || d.x;
                })
                    .y(function (d) {
                    return d.value;
                })
                    .showValues(true)
                    .staggerLabels(true)
                    .showXAxis(true)
                    .showYAxis(true)
                    .valueFormat(d3.format('d'))
                    .duration(0)
                    .height(_this.height)
                    .color(function (d) {
                    return _this.data[d.series].color || _this.pipChartColors.materialColorToRgba(_this.colors[d.series]);
                });
                _this.chart.tooltip.enabled(false);
                _this.chart.noData('There is no data right now...');
                _this.chart.yAxis
                    .tickFormat(function (d) {
                    return _this.yTickFormat ? _this.yTickFormat(d) : d;
                });
                _this.chart.xAxis
                    .tickFormat(function (d) {
                    return _this.xTickFormat ? _this.xTickFormat(d) : d;
                });
                _this.chartElem = d3.select(_this.$element.get(0))
                    .select('.bar-chart svg')
                    .datum(_this.data)
                    .style('height', '285px')
                    .call(_this.chart);
                nv.utils.windowResize(function () {
                    _this.chart.update();
                    _this.configBarWidthAndLabel(0);
                    _this.drawEmptyState();
                });
                return _this.chart;
            }, function () {
                _this.$timeout(function () {
                    _this.configBarWidthAndLabel();
                }, 0);
                _this.drawEmptyState();
            });
        };
        BarChartController.prototype.prepareData = function (data) {
            var result = [];
            _.each(data, function (seria) {
                if (!seria.disabled && seria.values)
                    result.push(seria);
            });
            return _.cloneDeep(result);
        };
        BarChartController.prototype.drawEmptyState = function () {
            if (this.$element.find('.nv-noData').length === 0) {
                d3.select(this.$element.find('.empty-state')[0]).remove();
            }
            else {
                var g = this.chartElem.append('g').classed('empty-state', true), width = this.$element.find('.nvd3-svg').innerWidth(), margin = width * 0.1;
                g.append('g')
                    .style('fill', 'rgba(0, 0, 0, 0.08)')
                    .append('rect')
                    .attr('height', this.height - 10)
                    .attr('width', 38);
                g.append('g')
                    .attr('transform', 'translate(42, 60)')
                    .style('fill', 'rgba(0, 0, 0, 0.08)')
                    .append('rect')
                    .attr('height', 200)
                    .attr('width', 38);
                g.append('g')
                    .attr('transform', 'translate(84, 160)')
                    .style('fill', 'rgba(0, 0, 0, 0.08)')
                    .append('rect')
                    .attr('height', 100)
                    .attr('width', 38);
                g.attr('transform', 'translate(' + (50 + margin) + ', 0), ' + 'scale(' + ((width - 2 * margin) / 126) + ', 1)');
            }
        };
        BarChartController.prototype.configBarWidthAndLabel = function (timeout) {
            var _this = this;
            if (timeout === void 0) { timeout = 1000; }
            var labels = this.$element.find('.nv-bar text'), chartBars = this.$element.find('.nv-bar'), parentHeight = this.$element.find('.nvd3-svg')[0].getBBox().height;
            d3.select(this.$element.find('.bar-chart')[0]).classed('visible', true);
            _.each(chartBars, function (item, index) {
                var barHeight = Number(d3.select(item).select('rect').attr('height')), barWidth = Number(d3.select(item).select('rect').attr('width')), element = d3.select(item), x = d3.transform(element.attr('transform')).translate[0], y = d3.transform(element.attr('transform')).translate[1];
                element
                    .attr('transform', 'translate(' + Number(x + index * (barWidth + 15)) + ', ' + (_this.height - 20) + ')')
                    .select('rect').attr('height', 0);
                element
                    .transition()
                    .duration(timeout)
                    .attr('transform', 'translate(' + Number(x + index * (barWidth + 15)) + ', ' + y + ')')
                    .select('rect').attr('height', barHeight);
                d3.select(labels[index])
                    .attr('dy', barHeight / 2 + 10)
                    .attr('x', barWidth / 2);
            });
        };
        BarChartController.prototype.generateParameterColor = function () {
            var _this = this;
            if (!this.data)
                return;
            _.each(this.data, function (item, index) {
                if (item.values[0]) {
                    item.values[0].color = item.values[0].color || _this.pipChartColors.getMaterialColor(index, _this.colors);
                    item.color = item.values[0].color;
                }
            });
        };
        return BarChartController;
    }());
    var BarChart = {
        bindings: BarChartBindings,
        templateUrl: 'bar_chart/BarChart.html',
        controller: BarChartController
    };
    angular
        .module('pipBarCharts', [])
        .component('pipBarChart', BarChart);
}
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
{
    var ChartColorsService = (function () {
        ChartColorsService.$inject = ['$mdColorPalette'];
        function ChartColorsService($mdColorPalette) {
            "ngInject";
            this.$mdColorPalette = $mdColorPalette;
        }
        ChartColorsService.prototype.getMaterialColor = function (index, colors) {
            if (!colors || colors.length < 1)
                return null;
            if (index >= colors.length) {
                index = 0;
            }
            return this.materialColorToRgba(colors[index]);
        };
        ChartColorsService.prototype.materialColorToRgba = function (color) {
            return 'rgba(' + this.$mdColorPalette[color][500].value[0] + ',' +
                this.$mdColorPalette[color][500].value[1] + ',' +
                this.$mdColorPalette[color][500].value[2] + ',' +
                (this.$mdColorPalette[color][500].value[3] || 1) + ')';
        };
        ChartColorsService.prototype.generateMaterialColors = function () {
            var _this = this;
            var colors = _.map(this.$mdColorPalette, function (palette, color) {
                return color;
            });
            colors = _.filter(colors, function (color) {
                return _.isObject(_this.$mdColorPalette[color]) && _.isObject(_this.$mdColorPalette[color][500]) && _.isArray(_this.$mdColorPalette[color][500].value);
            });
            return colors;
        };
        return ChartColorsService;
    }());
    angular
        .module('pipChartColors', [])
        .service('pipChartColors', ChartColorsService);
}
},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
{
    var ChartLegendBindings = {
        series: '<pipSeries',
        interactive: '<pipInteractive'
    };
    var ChartLegendBindingsChanges = (function () {
        function ChartLegendBindingsChanges() {
        }
        return ChartLegendBindingsChanges;
    }());
    var ChartLegendController = (function () {
        ChartLegendController.$inject = ['$element', '$scope', '$timeout', 'pipChartColors'];
        function ChartLegendController($element, $scope, $timeout, pipChartColors) {
            "ngInject";
            this.$element = $element;
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.pipChartColors = pipChartColors;
            this.colors = this.pipChartColors.generateMaterialColors();
        }
        ChartLegendController.prototype.$onInit = function () {
            this.updateLegends();
        };
        ChartLegendController.prototype.$onChanges = function (changes) {
            var _this = this;
            if (changes.series && changes.series.currentValue !== changes.series.previousValue) {
                this.series = changes.series.currentValue;
                this.updateLegends();
            }
            if (changes.interactive && changes.interactive.currentValue !== changes.interactive.previousValue) {
                this.interactive = changes.interactive.currentValue;
                if (this.interactive === true) {
                    this.$timeout(function () {
                        _this.colorCheckboxes();
                    }, 0);
                }
            }
        };
        ChartLegendController.prototype.updateLegends = function () {
            var _this = this;
            this.$timeout(function () {
                _this.animate();
                _this.colorCheckboxes();
            }, 0);
            this.prepareSeries();
        };
        ChartLegendController.prototype.colorCheckboxes = function () {
            var _this = this;
            var checkboxContainers = this.$element.find('md-checkbox .md-container');
            _.each(checkboxContainers, function (item, index) {
                if (index >= _this.series.length) {
                    return;
                }
                $(item)
                    .css('color', _this.series[index].color || _this.colors[index])
                    .find('.md-icon')
                    .css('background-color', _this.series[index].color || _this.colors[index]);
            });
        };
        ChartLegendController.prototype.animate = function () {
            var _this = this;
            var legendTitles = this.$element.find('.chart-legend-item');
            _.each(legendTitles, function (item, index) {
                _this.$timeout(function () {
                    $(item).addClass('visible');
                }, 200 * index);
            });
        };
        ChartLegendController.prototype.prepareSeries = function () {
            var _this = this;
            if (!this.series)
                return;
            _.each(this.series, function (item, index) {
                var materialColor = _this.pipChartColors.getMaterialColor(index, _this.colors);
                item.color = item.color || (item.values && item.values[0] && item.values[0].color ? item.values[0].color : materialColor);
                item.disabled = item.disabled || false;
            });
        };
        return ChartLegendController;
    }());
    var ChartLegend = {
        bindings: ChartLegendBindings,
        templateUrl: 'chart_legend/ChartInteractiveLegend.html',
        controller: ChartLegendController
    };
    angular
        .module('pipChartLegends', [])
        .component('pipChartLegend', ChartLegend);
}
},{}],5:[function(require,module,exports){
angular.module('pipCharts', [
    'pipBarCharts',
    'pipLineCharts',
    'pipPieCharts',
    'pipChartLegends',
    'pipChartColors',
    'pipCharts.Templates'
]);
},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
{
    var LineChartBindings = {
        series: '<pipSeries',
        showYAxis: '<?pipYAxis',
        showXAxis: '<?pipXAxis',
        xFormat: '<?pipXFormat',
        xTickFormat: '<?pipXTickFormat',
        yTickFormat: '<?pipYTickFormat',
        xTickValues: '<?pipXTickValues',
        dynamic: '<?pipDynamic',
        fixedHeight: '<?pipDiagramHeight',
        dynamicHeight: '<?pipDynamicHeight',
        minHeight: '<?pipMinHeight',
        maxHeight: '<?pipMaxHeight',
        interactiveLegend: '<?pipInterLegend'
    };
    var LineChartBindingsChanges = (function () {
        function LineChartBindingsChanges() {
        }
        return LineChartBindingsChanges;
    }());
    var LineChartController = (function () {
        LineChartController.$inject = ['$element', '$scope', '$timeout', 'pipChartColors'];
        function LineChartController($element, $scope, $timeout, pipChartColors) {
            "ngInject";
            var _this = this;
            this.$element = $element;
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.pipChartColors = pipChartColors;
            this.HEIGHT = 270;
            this.chart = null;
            this.chartElem = null;
            this.setZoom = null;
            this.updateZoomOptions = null;
            this.fixedHeight = this.HEIGHT;
            this.dynamicHeight = false;
            this.minHeight = this.HEIGHT;
            this.maxHeight = this.HEIGHT;
            this.showYAxis = true;
            this.showXAxis = true;
            this.dynamic = false;
            this.interactiveLegend = false;
            this.colors = this.pipChartColors.generateMaterialColors();
            $scope.$watch('$ctrl.legend', function (updatedLegend) {
                _this.data = _this.prepareData(updatedLegend);
                _this.legend = updatedLegend;
                _this.updateChart();
            }, true);
            $scope.$on('$destroy', function () {
                $timeout(function () {
                    d3.selectAll('.nvtooltip').style('opacity', 0);
                }, 800);
            });
        }
        LineChartController.prototype.$onInit = function () {
            var _this = this;
            this.data = this.prepareData(this.series) || [];
            this.legend = _.clone(this.series);
            this.sourceEvents = [];
            this.generateParameterColor();
            d3.scale.paletteColors = function () {
                return d3.scale.ordinal().range(_this.colors.map(function (color) {
                    return _this.pipChartColors.materialColorToRgba(color);
                }));
            };
            this.instantiateChart();
        };
        LineChartController.prototype.$onChanges = function (changes) {
            this.fixedHeight = changes.fixedHeight ? changes.fixedHeight.currentValue : this.HEIGHT;
            this.minHeight = changes.minHeight ? changes.minHeight.currentValue : this.HEIGHT;
            this.maxHeight = changes.maxHeight ? changes.maxHeight.currentValue : this.HEIGHT;
            this.dynamicHeight = changes.dynamicHeight ? changes.dynamicHeight.currentValue : this.dynamicHeight;
            this.showXAxis = changes.showXAxis ? changes.showXAxis.currentValue : this.showXAxis;
            this.showYAxis = changes.showYAxis ? changes.showYAxis.currentValue : this.showYAxis;
            this.dynamic = changes.dynamic ? changes.dynamic.currentValue : this.dynamic;
            this.interactiveLegend = changes.interactiveLegend ? changes.interactiveLegend.currentValue : this.interactiveLegend;
            this.xFormat = changes.xFormat ? changes.xFormat.currentValue : this.xFormat;
            this.xTickFormat = changes.xTickFormat ? changes.xTickFormat.currentValue : this.xTickFormat;
            this.yTickFormat = changes.yTickFormat ? changes.yTickFormat.currentValue : this.yTickFormat;
            if (changes.xTickValues && changes.xTickValues.currentValue !== changes.xTickValues.previousValue) {
                this.xTickValues = changes.xTickValues.currentValue;
                this.updateXTickValues();
                if (this.chartElem && this.chart)
                    this.chartElem.datum(this.data || []).call(this.chart);
            }
            if (changes.series && changes.series.currentValue !== changes.series.previousValue) {
                this.updateSeries();
            }
        };
        LineChartController.prototype.prepareData = function (data) {
            var result = [];
            _.each(data, function (seria) {
                if (!seria.disabled && seria.values)
                    result.push(seria);
            });
            return _.cloneDeep(result);
        };
        LineChartController.prototype.getHeight = function () {
            return this.dynamicHeight ? Math.min(Math.max(this.minHeight, this.$element.parent().innerHeight()), this.maxHeight) : this.fixedHeight;
        };
        ;
        LineChartController.prototype.zoomIn = function () {
            if (this.setZoom) {
                this.setZoom('in');
            }
        };
        ;
        LineChartController.prototype.zoomOut = function () {
            if (this.setZoom) {
                this.setZoom('out');
            }
        };
        ;
        LineChartController.prototype.instantiateChart = function () {
            var _this = this;
            nv.addGraph(function () {
                _this.chart = nv.models.lineChart()
                    .margin({
                    top: 20,
                    right: 20,
                    bottom: 30,
                    left: 30
                })
                    .x(function (d) {
                    return (d !== undefined && d.x !== undefined) ? (_this.xFormat ? _this.xFormat(d.x) : d.x) : d;
                })
                    .y(function (d) {
                    return (d !== undefined && d.value !== undefined) ? d.value : d;
                })
                    .height(_this.getHeight() - 50)
                    .useInteractiveGuideline(true)
                    .showXAxis(true)
                    .showYAxis(true)
                    .showLegend(false)
                    .color(function (d) {
                    return d.color || d3.scale.paletteColors().range();
                });
                _this.chart.tooltip.enabled(false);
                _this.chart.noData('There is no data right now...');
                _this.chart.yAxis
                    .tickFormat(function (d) {
                    return _this.yTickFormat ? _this.yTickFormat(d) : d;
                });
                _this.chart.xAxis
                    .tickFormat(function (d) {
                    return _this.xTickFormat ? _this.xTickFormat(d) : d;
                })
                    .tickValues(_this.xTickValues && _.isArray(_this.xTickValues) && _this.xTickValues.length > 2 ?
                    d3.range(_this.xTickValues[0], _this.xTickValues[1], _this.xTickValues[2]) : null);
                _this.chartElem = d3.select(_this.$element.get(0)).select('.line-chart svg');
                _this.chartElem.datum(_this.data || []).style('height', (_this.getHeight() - 50) + 'px').call(_this.chart);
                $('.line-chart svg').on('touchstart touchmove', function (e) {
                    _this.$timeout(function () {
                        var tooltip = $('.nvtooltip'), tooltipW = tooltip.innerWidth(), bodyWidth = $('body').innerWidth(), x = e.originalEvent['touches'][0]['pageX'], y = e.originalEvent['touches'][0]['pageY'];
                        tooltip.css('transform', 'translate(' +
                            (x + tooltipW >= bodyWidth ? (x - tooltipW) : x) + ',' +
                            y + ')');
                        tooltip.css('left', 0);
                        tooltip.css('top', 0);
                    });
                });
                $('.line-chart svg').on('touchstart touchend', function (e) {
                    var removeTooltip = function () {
                        $('.nvtooltip').css('opacity', 0);
                    };
                    removeTooltip();
                    _this.$timeout(function () {
                        removeTooltip();
                    }, 500);
                });
                if (_this.dynamic) {
                    _this.addZoom(_this.chart, _this.chartElem);
                }
                nv.utils.windowResize(function () {
                    _this.onResize();
                });
                _this.$scope.$on('pipMainResized', function () {
                    _this.onResize();
                });
                return _this.chart;
            }, function () {
                _this.drawEmptyState();
            });
        };
        LineChartController.prototype.updateXTickValues = function () {
            if (!this.chart)
                return;
            this.chart.xAxis
                .tickValues(this.xTickValues && _.isArray(this.xTickValues) && this.xTickValues.length > 2 ?
                d3.range(this.xTickValues[0], this.xTickValues[1], this.xTickValues[2]) : null);
        };
        LineChartController.prototype.updateChart = function () {
            if (this.chart) {
                this.updateXTickValues();
                this.chartElem.datum(this.data || []).call(this.chart);
                this.drawEmptyState();
                if (this.updateZoomOptions)
                    this.updateZoomOptions(this.data);
            }
        };
        LineChartController.prototype.updateSeries = function () {
            this.data = this.prepareData(this.series);
            this.legend = _.clone(this.series);
            this.generateParameterColor();
            this.updateChart();
        };
        LineChartController.prototype.onResize = function () {
            this.chart.height(this.getHeight() - 50);
            this.chartElem.style('height', (this.getHeight() - 50) + 'px');
            this.chart.update();
            this.drawEmptyState();
        };
        LineChartController.prototype.drawEmptyState = function () {
            if (!this.$element.find('text.nv-noData').get(0)) {
                d3.select(this.$element.find('.empty-state')[0]).remove();
            }
            else {
                var containerWidth = this.$element.find('.line-chart').innerWidth(), containerHeight = this.$element.find('.line-chart').innerHeight();
                if (this.$element.find('.empty-state').get(0)) {
                    this.chartElem
                        .select('image')
                        .attr('transform', 'scale(' + (containerWidth / 1151) + ',' + (containerHeight / 216) + ')');
                }
                else {
                    this.chartElem
                        .append("defs")
                        .append("pattern")
                        .attr("height", 1)
                        .attr("width", 1)
                        .attr("x", "0")
                        .attr("y", "0")
                        .attr("id", "bg")
                        .append("image")
                        .attr('x', 17)
                        .attr('y', 0)
                        .attr('height', "216px")
                        .attr('width', "1151px")
                        .attr('transform', 'scale(' + (containerWidth / 1151) + ',' + (containerHeight / 216) + ')')
                        .attr("xlink:href", "images/line_chart_empty_state.svg");
                    this.chartElem
                        .append('rect')
                        .classed('empty-state', true)
                        .attr('height', "100%")
                        .attr('width', "100%")
                        .attr('fill', 'url(#bg)');
                }
            }
        };
        LineChartController.prototype.updateScroll = function (domains, boundary) {
            var bDiff = boundary[1] - boundary[0], domDiff = domains[1] - domains[0], isEqual = domDiff / bDiff === 1;
            $(this.$element[0]).find('.visual-scroll')
                .css('opacity', function () {
                return isEqual ? 0 : 1;
            });
            if (isEqual)
                return;
            $(this.$element[0]).find('.scrolled-block')
                .css('left', function () {
                return (domains[0] - boundary[0]) / bDiff * 100 + '%';
            })
                .css('width', function () {
                return domDiff / bDiff * 100 + '%';
            });
        };
        LineChartController.prototype.generateParameterColor = function () {
            var _this = this;
            if (!this.data)
                return;
            _.each(this.data, function (item, index) {
                item.color = item.color || _this.pipChartColors.getMaterialColor(index, _this.colors);
            });
        };
        LineChartController.prototype.addZoom = function (chart, svg) {
            var _this = this;
            var scaleExtent = 4;
            var yAxis = null;
            var xAxis = null;
            var xDomain = null;
            var yDomain = null;
            var redraw = null;
            var xScale = null;
            var yScale = null;
            var x_boundary = null;
            var y_boundary = null;
            var d3zoom = d3.behavior.zoom();
            var prevXDomain = null;
            var prevScale = null;
            var prevTranslate = null;
            var setData = function (newChart) {
                yAxis = newChart.yAxis;
                xAxis = newChart.xAxis;
                xDomain = newChart.xDomain || xAxis.scale().domain;
                yDomain = newChart.yDomain || yAxis.scale().domain;
                redraw = newChart.update;
                xScale = xAxis.scale();
                yScale = yAxis.scale();
                x_boundary = xAxis.scale().domain().slice();
                y_boundary = yAxis.scale().domain().slice();
                prevXDomain = x_boundary;
                prevScale = d3zoom.scale();
                prevTranslate = d3zoom.translate();
                xScale.nice();
                yScale.nice();
            };
            setData(chart);
            var fixDomain = function (domain, boundary, scale, translate) {
                if (domain[0] < boundary[0]) {
                    domain[0] = boundary[0];
                    if (prevXDomain[0] !== boundary[0] || scale !== prevScale) {
                        domain[1] += (boundary[0] - domain[0]);
                    }
                    else {
                        domain[1] = prevXDomain[1];
                        translate = _.clone(prevTranslate);
                    }
                }
                if (domain[1] > boundary[1]) {
                    domain[1] = boundary[1];
                    if (prevXDomain[1] !== boundary[1] || scale !== prevScale) {
                        domain[0] -= (domain[1] - boundary[1]);
                    }
                    else {
                        domain[0] = prevXDomain[0];
                        translate = _.clone(prevTranslate);
                    }
                }
                d3zoom.translate(translate);
                prevXDomain = _.clone(domain);
                prevScale = _.clone(scale);
                prevTranslate = _.clone(translate);
                return domain;
            };
            var updateChart = function () {
                d3zoom.scale(1);
                d3zoom.translate([0, 0]);
                xScale.domain(x_boundary);
                d3zoom.x(xScale).y(yScale);
                svg.call(d3zoom);
            };
            var zoomed = function () {
                if (d3.event.scale === 1) {
                    unzoomed();
                    updateChart();
                }
                else {
                    xDomain(fixDomain(xScale.domain(), x_boundary, d3.event.scale, d3.event.translate));
                    redraw();
                }
                _this.updateScroll(xScale.domain(), x_boundary);
            };
            this.setZoom = function (which) {
                var center0 = [svg[0][0].getBBox().width / 2, svg[0][0].getBBox().height / 2];
                var translate0 = d3zoom.translate(), coordinates0 = coordinates(center0);
                if (which === 'in') {
                    if (prevScale < scaleExtent)
                        d3zoom.scale(prevScale + 0.2);
                }
                else {
                    if (prevScale > 1)
                        d3zoom.scale(prevScale - 0.2);
                }
                var center1 = point(coordinates0);
                d3zoom.translate([translate0[0] + center0[0] - center1[0], translate0[1] + center0[1] - center1[1]]);
                d3zoom.event(svg);
            };
            var step = function (which) {
                var translate = d3zoom.translate();
                if (which === 'right') {
                    translate[0] -= 20;
                }
                else {
                    translate[0] += 20;
                }
                d3zoom.translate(translate);
                d3zoom.event(svg);
            };
            var coordinates = function (point) {
                var scale = d3zoom.scale(), translate = d3zoom.translate();
                return [(point[0] - translate[0]) / scale, (point[1] - translate[1]) / scale];
            };
            var point = function (coordinates) {
                var scale = d3zoom.scale(), translate = d3zoom.translate();
                return [coordinates[0] * scale + translate[0], coordinates[1] * scale + translate[1]];
            };
            var keypress = function () {
                switch (d3.event.keyCode) {
                    case 39:
                        step('right');
                        break;
                    case 37:
                        step('left');
                        break;
                    case 107:
                        _this.setZoom('in');
                        break;
                    case 109:
                        _this.setZoom('out');
                }
            };
            var unzoomed = function () {
                xDomain(x_boundary);
                redraw();
                d3zoom.scale(1);
                d3zoom.translate([0, 0]);
                prevScale = 1;
                prevTranslate = [0, 0];
            };
            d3zoom.x(xScale)
                .y(yScale)
                .scaleExtent([1, scaleExtent])
                .on('zoom', zoomed);
            svg.call(d3zoom).on('dblclick.zoom', unzoomed);
            $(this.$element.get(0)).addClass('dynamic');
            svg
                .attr('focusable', false)
                .style('outline', 'none')
                .on('keydown', keypress)
                .on('focus', function () { });
            var getXMinMax = function (data) {
                var maxVal, minVal = null;
                for (var i = 0; i < data.length; i++) {
                    if (!data[i].disabled) {
                        var tempMinVal = d3.max(data[i].values, function (d) {
                            return _this.xFormat ? _this.xFormat(d.x) : d.x;
                        });
                        var tempMaxVal = d3.min(data[i].values, function (d) {
                            return _this.xFormat ? _this.xFormat(d.x) : d.x;
                        });
                        minVal = (!minVal || tempMinVal < minVal) ? tempMinVal : minVal;
                        maxVal = (!maxVal || tempMaxVal > maxVal) ? tempMaxVal : maxVal;
                    }
                }
                return [maxVal, minVal];
            };
            var updateZoomOptions = function (data) {
                yAxis = chart.yAxis;
                xAxis = chart.xAxis;
                xScale = xAxis.scale();
                yScale = yAxis.scale();
                x_boundary = getXMinMax(data);
                if (d3zoom.scale() === 1) {
                    d3zoom.x(xScale).y(yScale);
                    svg.call(d3zoom);
                    d3zoom.event(svg);
                }
                _this.updateScroll(xScale.domain(), x_boundary);
            };
        };
        return LineChartController;
    }());
    var LineChart = {
        bindings: LineChartBindings,
        templateUrl: 'line_chart/LineChart.html',
        controller: LineChartController
    };
    angular
        .module('pipLineCharts', [])
        .component('pipLineChart', LineChart);
}
},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
{
    var PieChartBindings = {
        series: '<pipSeries',
        donut: '<?pipDonut',
        legend: '<?pipShowLegend',
        total: '<?pipShowTotal',
        size: '<?pipPieSize',
        centered: '<?pipCentered'
    };
    var PieChartBindingsChanges = (function () {
        function PieChartBindingsChanges() {
        }
        return PieChartBindingsChanges;
    }());
    var PieChartController = (function () {
        PieChartController.$inject = ['$element', '$scope', '$timeout', 'pipChartColors'];
        function PieChartController($element, $scope, $timeout, pipChartColors) {
            "ngInject";
            this.$element = $element;
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.pipChartColors = pipChartColors;
            this.donut = false;
            this.legend = true;
            this.total = true;
            this.size = 250;
            this.centered = false;
            this.chart = null;
            this.colors = this.pipChartColors.generateMaterialColors();
        }
        PieChartController.prototype.$onInit = function () {
            var _this = this;
            this.data = this.series;
            this.generateParameterColor();
            d3.scale.paletteColors = function () {
                return d3.scale.ordinal().range(_this.colors.map(function (color) {
                    return _this.pipChartColors.materialColorToRgba(color);
                }));
            };
            this.instantiateChart();
        };
        PieChartController.prototype.$onChanges = function (changes) {
            var _this = this;
            this.legend = changes.legend ? changes.legend.currentValue : this.legend;
            this.centered = changes.centered ? changes.centered.currentValue : this.centered;
            this.donut = changes.donut ? changes.donut.currentValue : this.donut;
            this.size = changes.size ? changes.size.currentValue : this.size;
            this.total = changes.total ? changes.total.currentValue : this.total;
            if (changes.series && changes.series.currentValue !== changes.series.previousValue) {
                this.data = changes.series.currentValue;
                this.generateParameterColor();
                if (this.chart) {
                    this.chartElem.datum(this.data).call(this.chart);
                    this.$timeout(function () {
                        _this.resizeTitleLabelUnwrap();
                    });
                    this.drawEmptyState(d3.select(this.$element.get(0)).select('.pie-chart svg')[0][0]);
                }
            }
        };
        PieChartController.prototype.instantiateChart = function () {
            var _this = this;
            nv.addGraph(function () {
                _this.chart = nv.models.pieChart()
                    .margin({
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                })
                    .x(function (d) {
                    return _this.donut ? d.value : null;
                })
                    .y(function (d) {
                    return d.value;
                })
                    .height(Number(_this.size))
                    .width(Number(_this.size))
                    .showLabels(true)
                    .labelThreshold(.001)
                    .growOnHover(false)
                    .donut(_this.donut)
                    .donutRatio(0.5)
                    .color(function (d) {
                    return d.color || d3.scale.paletteColors().range();
                });
                _this.chart.tooltip.enabled(false);
                _this.chart.noData('There is no data right now...');
                _this.chart.showLegend(false);
                _this.chartElem = d3.select(_this.$element.get(0))
                    .select('.pie-chart')
                    .style('height', (_this.size) + 'px')
                    .style('width', _this.centered ? '100%' : (_this.size) + 'px')
                    .select('svg')
                    .style('opacity', 0)
                    .datum(_this.data || [])
                    .call(_this.chart);
                nv.utils.windowResize(function () {
                    _this.chart.update();
                    _this.$timeout(function () {
                        _this.resizeTitleLabelUnwrap();
                    });
                    _this.centerChart();
                    _this.drawEmptyState(d3.select(_this.$element.get(0)).select('.pie-chart svg')[0][0]);
                });
                return _this.chart;
            }, function () {
                _this.$timeout(function () {
                    var svgElem = d3.select(_this.$element.get(0)).select('.pie-chart svg')[0][0];
                    _this.renderTotalLabel(svgElem);
                    d3.select(svgElem)
                        .transition()
                        .duration(1000)
                        .style('opacity', 1);
                    _this.$timeout(function () {
                        _this.resizeTitleLabelUnwrap();
                    }, 800);
                    _this.centerChart();
                    _this.drawEmptyState(svgElem);
                });
            });
        };
        PieChartController.prototype.drawEmptyState = function (svg) {
            if (!this.$element.find('text.nv-noData').get(0)) {
                d3.select(this.$element.find('.empty-state')[0]).remove();
                this.$element.find('.pip-empty-pie-text').remove();
            }
            else {
                if (this.$element.find('.pip-empty-pie-text').length === 0) {
                    this.$element.find('.pie-chart')
                        .append("<div class='pip-empty-pie-text'>There is no data right now...</div>");
                }
                var pie = d3.layout.pie().sort(null), size = Number(this.size);
                var arc = d3.svg.arc()
                    .innerRadius(size / 2 - 20)
                    .outerRadius(size / 2 - 57);
                svg = d3.select(svg)
                    .append("g")
                    .classed('empty-state', true)
                    .attr('transform', "translate(" + size / 2 + "," + size / 2 + ")");
                var path = svg.selectAll("path")
                    .data(pie([1]))
                    .enter().append("path")
                    .attr("fill", "rgba(0, 0, 0, 0.08)")
                    .attr("d", arc);
            }
        };
        PieChartController.prototype.centerChart = function () {
            if (this.centered) {
                var svgElem = d3.select(this.$element.get(0)).select('.pie-chart svg')[0][0], leftMargin = $(svgElem).innerWidth() / 2 - (Number(this.size) || 250) / 2;
                d3.select(this.$element.find('.nv-pieChart')[0]).attr('transform', 'translate(' + leftMargin + ', 0)');
            }
        };
        PieChartController.prototype.renderTotalLabel = function (svgElem) {
            if ((!this.total && !this.donut) || !this.data)
                return;
            var totalVal = this.data.reduce(function (sum, curr) {
                return sum + curr.value;
            }, 0);
            if (totalVal >= 10000)
                totalVal = (totalVal / 1000).toFixed(1) + 'k';
            d3.select(svgElem)
                .select('.nv-pie:not(.nvd3)')
                .append('text')
                .classed('label-total', true)
                .attr('text-anchor', 'middle')
                .style('dominant-baseline', 'central')
                .text(totalVal);
            this.titleElem = d3.select(this.$element.find('text.label-total').get(0)).style('opacity', 0);
        };
        PieChartController.prototype.resizeTitleLabelUnwrap = function () {
            if ((!this.total && !this.donut) || !this.data)
                return;
            var boxSize = this.$element.find('.nvd3.nv-pieChart').get(0).getBBox();
            if (!boxSize.width || !boxSize.height) {
                return;
            }
            this.titleElem.style('font-size', ~~boxSize.width / 4.5).style('opacity', 1);
        };
        PieChartController.prototype.generateParameterColor = function () {
            var _this = this;
            if (!this.data)
                return;
            _.each(this.data, function (item, index) {
                item.color = item.color || _this.pipChartColors.getMaterialColor(index, _this.colors);
            });
        };
        return PieChartController;
    }());
    var PieChart = {
        bindings: PieChartBindings,
        templateUrl: 'pie_chart/PieChart.html',
        controller: PieChartController
    };
    angular
        .module('pipPieCharts', [])
        .component('pipPieChart', PieChart);
}
},{}],8:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipCharts.Templates');
} catch (e) {
  module = angular.module('pipCharts.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('bar_chart/BarChart.html',
    '<div class="bar-chart"><svg></svg></div><pip-chart-legend ng-show="$ctrl.legend" pip-series="$ctrl.legend" pip-interactive="$ctrl.interactiveLegend"></pip-chart-legend>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipCharts.Templates');
} catch (e) {
  module = angular.module('pipCharts.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('chart_legend/ChartInteractiveLegend.html',
    '<div><div class="chart-legend-item" ng-repeat="item in $ctrl.series" ng-show="item.values || item.value"><md-checkbox ng-model="item.disabled" ng-true-value="false" ng-false-value="true" ng-if="$ctrl.interactive" aria-label="{{ item.label }}"><p class="legend-item-value" ng-if="item.value" ng-style="{\'background-color\': item.color}">{{ item.value }}</p><p class="legend-item-label">{{:: item.label || item.key }}</p></md-checkbox><div ng-if="!$ctrl.interactive"><span class="bullet" ng-style="{\'background-color\': item.color}"></span> <span>{{:: item.label || item.key}}</span></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipCharts.Templates');
} catch (e) {
  module = angular.module('pipCharts.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('line_chart/LineChart.html',
    '<div class="line-chart" flex="auto" layout="column"><svg class="flex-auto" ng-class="{\'visible-x-axis\': $ctrl.showXAxis, \'visible-y-axis\': $ctrl.showYAxis}"></svg><div class="scroll-container"><div class="visual-scroll"><div class="scrolled-block"></div></div></div><md-button class="md-fab md-mini minus-button" ng-click="$ctrl.zoomOut()"><md-icon md-svg-icon="icons:minus-circle"></md-icon></md-button><md-button class="md-fab md-mini plus-button" ng-click="$ctrl.zoomIn()"><md-icon md-svg-icon="icons:plus-circle"></md-icon></md-button></div><pip-chart-legend pip-series="$ctrl.legend" pip-interactive="$ctrl.interactiveLegend"></pip-chart-legend>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipCharts.Templates');
} catch (e) {
  module = angular.module('pipCharts.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('pie_chart/PieChart.html',
    '<div class="pie-chart" ng-class="{\'circle\': !$ctrl.donut}"><svg class="flex-auto"></svg></div><pip-chart-legend pip-series="$ctrl.data" pip-interactive="false" ng-if="$ctrl.legend"></pip-chart-legend>');
}]);
})();



},{}]},{},[8,1,2,3,4,5,6,7])(8)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).locations = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
{
    translateFilter.$inject = ['$injector'];
    function translateFilter($injector) {
        var pipTranslate = $injector.has('pipTranslate')
            ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate.translate(key) || key : key;
        };
    }
    angular
        .module('pipLocations.Translate', [])
        .filter('translate', translateFilter);
}

},{}],2:[function(require,module,exports){
angular.module('pipLocations', [
    'pipLocation',
    'pipLocationMap',
    'pipLocationIp',
    'pipLocationEditDialog',
    'pipLocationEdit',
    'pipLocations.Translate'
]);

},{}],3:[function(require,module,exports){
{
    var LocationBindings = {
        pipLocationName: '<',
        pipLocationPos: '<',
        pipShowLocationIcon: '<',
        pipCollapse: '<',
        pipRebind: '<',
        pipDisabled: '<',
        pipLocationResize: '&'
    };
    var LocationBindingsChanges = (function () {
        function LocationBindingsChanges() {
        }
        return LocationBindingsChanges;
    }());
    var LocationController = (function () {
        LocationController.$inject = ['$element', '$timeout', '$scope'];
        function LocationController($element, $timeout, $scope) {
            "ngInject";
            this.$element = $element;
            this.$timeout = $timeout;
            this.$scope = $scope;
            this.showMap = true;
            $element.addClass('pip-location');
        }
        LocationController.prototype.$postLink = function () {
            var _this = this;
            this.$timeout(function () {
                _this.name = _this.$element.find('.pip-location-name');
                _this.mapContainer = _this.$element.find('.pip-location-container');
                if (_this.pipCollapse === true) {
                    _this.mapContainer.hide();
                    _this.showMap = false;
                    _this.name.click(function (event) {
                        event.stopPropagation();
                        if (_this.pipDisabled)
                            return;
                        _this.showMap = !_this.showMap;
                        _this.mapContainer[_this.showMap ? 'show' : 'hide']();
                        if (_this.showMap)
                            _this.generateMap();
                        if (!_this.$scope.$$phase)
                            _this.$scope.$apply();
                    });
                }
                _this.redrawMap();
            });
        };
        LocationController.prototype.redrawMap = function () {
            if (!this.mapContainer)
                return;
            if (this.pipLocationPos && this.showMap === true) {
                this.generateMap();
            }
            else {
                this.clearMap();
            }
        };
        LocationController.prototype.$onChanges = function (changes) {
            this.pipRebind = changes.pipRebind
                ? changes.pipRebind.currentValue || false : false;
            this.pipShowLocationIcon = changes.pipShowLocationIcon
                ? changes.pipShowLocationIcon.currentValue || false : false;
            this.pipCollapse = changes.pipCollapse
                ? changes.pipCollapse.currentValue || false : false;
            this.pipDisabled = changes.pipDisabled
                ? changes.pipDisabled.currentValue || false : false;
            if (this.pipRebind) {
                this.pipLocationName = changes.pipLocationName
                    ? changes.pipLocationName.currentValue : null;
                this.pipLocationPos = changes.pipLocationPos
                    ? changes.pipLocationPos.currentValue : null;
                this.redrawMap();
            }
        };
        LocationController.prototype.clearMap = function () {
            if (this.mapControl)
                this.mapControl.remove();
            this.mapControl = null;
            this.mapContainer.hide();
        };
        LocationController.prototype.generateMap = function () {
            var location = this.pipLocationPos;
            if (this.showMap === false
                || location == null
                || location.coordinates == null
                || location.coordinates.length < 0) {
                this.clearMap();
                return;
            }
            var coordinates = new google.maps.LatLng(location.coordinates[0], location.coordinates[1]);
            if (this.mapControl)
                this.mapControl.remove();
            this.mapControl = $('<div></div>');
            this.mapContainer.show();
            this.mapControl.appendTo(this.mapContainer);
            var mapOptions = {
                center: coordinates,
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true,
                disableDoubleClickZoom: true,
                scrollwheel: false,
                draggable: false
            }, map = new google.maps.Map(this.mapControl[0], mapOptions);
            new google.maps.Marker({
                position: coordinates,
                map: map
            });
        };
        ;
        return LocationController;
    }());
    var LocationComponent = {
        bindings: LocationBindings,
        templateUrl: 'location/Location.html',
        controller: LocationController
    };
    angular
        .module("pipLocation", [])
        .component('pipLocation', LocationComponent);
}

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
{
    var LocationEditDialogController_1 = (function () {
        function LocationEditDialogController_1($scope, $rootScope, $timeout, $mdDialog, locationPos, locationName) {
            var _this = this;
            this.$scope = $scope;
            this.$mdDialog = $mdDialog;
            this._map = null;
            this._marker = null;
            this.onSetLocation = function () {
                var _this = this;
                if (this._map === null)
                    return;
                navigator.geolocation.getCurrentPosition(function (position) {
                    var coordinates = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    _this._marker = _this.createMarker(coordinates);
                    _this._map.setCenter(coordinates);
                    _this._map.setZoom(12);
                    _this.changeLocation(coordinates, null);
                }, function () {
                    _this.$scope.$apply();
                }, {
                    maximumAge: 0,
                    enableHighAccuracy: true,
                    timeout: 5000
                });
            };
            this.theme = $rootScope['$theme'];
            this.locationPos = locationPos && locationPos.type == 'Point' &&
                locationPos.coordinates && locationPos.coordinates.length == 2 ?
                locationPos : null;
            this.locationName = locationName;
            this.supportSet = navigator.geolocation != null;
            $timeout(function () {
                var mapContainer = $('.pip-location-edit-dialog .pip-location-container');
                var coordinates = _this.locationPos ?
                    new google.maps.LatLng(_this.locationPos.coordinates[0], _this.locationPos.coordinates[1]) : null;
                var mapOptions = {
                    center: new google.maps.LatLng(0, 0),
                    zoom: 1,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    disableDefaultUI: true
                };
                if (coordinates != null) {
                    mapOptions.center = coordinates;
                    mapOptions.zoom = 12;
                }
                _this._map = new google.maps.Map(mapContainer[0], mapOptions);
                _this._marker = _this.createMarker(coordinates);
                $timeout(function () {
                    google.maps.event.trigger(_this._map, 'resize');
                }, 1000);
            }, 0);
            $scope.$on('pipLayoutResized', function () {
                if (_this._map == null)
                    return;
                google.maps.event.trigger(_this._map, 'resize');
            });
        }
        LocationEditDialogController_1.prototype.createMarker = function (coordinates) {
            var _this = this;
            if (this._marker)
                this._marker.setMap(null);
            if (coordinates) {
                this._marker = new google.maps.Marker({
                    position: coordinates,
                    map: this._map,
                    draggable: true,
                    animation: google.maps.Animation.DROP
                });
                var thisMarker_1 = this._marker;
                google.maps.event.addListener(thisMarker_1, 'dragend', function () {
                    var coordinates = thisMarker_1.getPosition();
                    _this.changeLocation(coordinates, null);
                });
            }
            else {
                this._marker = null;
            }
            return this._marker;
        };
        LocationEditDialogController_1.prototype.changeLocation = function (coordinates, tid) {
            var _this = this;
            this.locationPos = {
                type: 'Point',
                coordinates: [coordinates.lat(), coordinates.lng()]
            };
            this.locationName = null;
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                latLng: coordinates
            }, function (results, status) {
                if (results && results.length > 0) {
                    _this.locationName = results[0].formatted_address;
                }
                _this.$scope.$apply();
            });
        };
        LocationEditDialogController_1.prototype.onAddPin = function () {
            if (this._map === null)
                return;
            var coordinates = this._map.getCenter();
            this._marker = this.createMarker(coordinates);
            this.changeLocation(coordinates, null);
        };
        LocationEditDialogController_1.prototype.onRemovePin = function () {
            if (this._map === null)
                return;
            this._marker = this.createMarker(null);
            this.locationPos = null;
            this.locationName = null;
        };
        LocationEditDialogController_1.prototype.onZoomIn = function () {
            if (this._map === null)
                return;
            var zoom = this._map.getZoom();
            this._map.setZoom(zoom + 1);
        };
        LocationEditDialogController_1.prototype.onZoomOut = function () {
            if (this._map === null)
                return;
            var zoom = this._map.getZoom();
            this._map.setZoom(zoom > 1 ? zoom - 1 : zoom);
        };
        LocationEditDialogController_1.prototype.onCancel = function () {
            this.$mdDialog.cancel();
        };
        LocationEditDialogController_1.prototype.onApply = function () {
            this.$mdDialog.hide({
                location: this.locationPos,
                locationPos: this.locationPos,
                locationName: this.locationName
            });
        };
        return LocationEditDialogController_1;
    }());
    var LocationDialogService = (function () {
        LocationDialogService.$inject = ['$mdDialog'];
        function LocationDialogService($mdDialog) {
            this.$mdDialog = $mdDialog;
        }
        LocationDialogService.prototype.show = function (params, successCallback, cancelCallback) {
            this.$mdDialog.show({
                controller: LocationEditDialogController_1,
                controllerAs: '$ctrl',
                templateUrl: 'location_dialog/LocationDialog.html',
                locals: {
                    locationName: params.locationName,
                    locationPos: params.locationPos
                },
                clickOutsideToClose: true
            })
                .then(function (result) {
                if (successCallback) {
                    successCallback(result);
                }
            }, function () {
                if (cancelCallback) {
                    cancelCallback();
                }
            });
        };
        return LocationDialogService;
    }());
    var LocationDialogRun = function ($injector) {
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        if (pipTranslate) {
            pipTranslate.setTranslations('en', {
                'LOCATION_ADD_LOCATION': 'Add location',
                'LOCATION_SET_LOCATION': 'Set location',
                'LOCATION_ADD_PIN': 'Add pin',
                'LOCATION_REMOVE_PIN': 'Remove pin'
            });
            pipTranslate.setTranslations('ru', {
                'LOCATION_ADD_LOCATION': 'Добавить местоположение',
                'LOCATION_SET_LOCATION': 'Определить положение',
                'LOCATION_ADD_PIN': 'Добавить точку',
                'LOCATION_REMOVE_PIN': 'Убрать точку'
            });
        }
    };
    LocationDialogRun.$inject = ['$injector'];
    angular
        .module('pipLocationEditDialog')
        .run(LocationDialogRun)
        .service('pipLocationEditDialog', LocationDialogService);
}

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LocationDialogParams = (function () {
    function LocationDialogParams() {
    }
    return LocationDialogParams;
}());
exports.LocationDialogParams = LocationDialogParams;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipLocationEditDialog', ['ngMaterial', 'pipLocations.Templates']);
require("./LocationDialog");

},{"./LocationDialog":5}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
{
    var LocationEditBindings = {
        pipLocationName: '=',
        pipLocationPos: '=',
        pipLocationHolder: '=',
        ngDisabled: '<',
        pipChanged: '&'
    };
    var LocationEditBindingsChanges = (function () {
        function LocationEditBindingsChanges() {
        }
        return LocationEditBindingsChanges;
    }());
    var LocationEditController = (function () {
        function LocationEditController($element, $scope, pipLocationEditDialog) {
            var _this = this;
            this.$element = $element;
            this.$scope = $scope;
            this.pipLocationEditDialog = pipLocationEditDialog;
            this.defineCoordinatesDebounced = _.debounce(function () {
                _this.defineCoordinates;
            }, 2000);
        }
        LocationEditController.prototype.$postLink = function () {
            var _this = this;
            this.$element.find('md-input-container').attr('md-no-float', (!!this.pipLocationHolder).toString());
            this.empty = this.$element.children('.pip-location-empty');
            this.mapContainer = this.$element.children('.pip-location-container');
            this.mapControl = null;
            this.$scope.$watch('$ctrl.pipLocationName', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    _this.defineCoordinatesDebounced();
                }
            });
            this.$scope.$watch('$ctrl.pipLocationPos', function () {
                _this.generateMap();
            });
            this.$element.addClass('pip-location-edit');
            if (this.pipLocationPos) {
                this.generateMap();
            }
            else {
                this.clearMap();
            }
        };
        LocationEditController.prototype.$onChanges = function (changes) {
            this.ngDisabled = changes.ngDisabled ? changes.ngDisabled.currentValue : false;
        };
        LocationEditController.prototype.clearMap = function () {
            if (this.mapControl)
                this.mapControl.remove();
            this.mapControl = null;
            this.mapContainer.hide();
            this.empty.show();
        };
        LocationEditController.prototype.generateMap = function () {
            var location = this.pipLocationPos;
            if (location == null || location.coordinates == null || location.coordinates.length < 0) {
                this.clearMap();
                return;
            }
            var coordinates = new google.maps.LatLng(location.coordinates[0], location.coordinates[1]);
            if (this.mapControl)
                this.mapControl.remove();
            this.mapContainer.show();
            this.empty.hide();
            this.mapControl = $('<div></div>');
            this.mapControl.appendTo(this.mapContainer);
            var mapOptions = {
                center: coordinates,
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true,
                disableDoubleClickZoom: true,
                scrollwheel: false,
                draggable: false
            }, map = new google.maps.Map(this.mapControl[0], mapOptions), marker = new google.maps.Marker({
                position: coordinates,
                map: map
            });
        };
        LocationEditController.prototype.defineCoordinates = function () {
            var locationName = this.pipLocationName;
            if (locationName == '') {
                this.pipLocationPos = null;
                this.clearMap();
                this.$scope.$apply();
                return;
            }
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                address: locationName
            }, function (results, status) {
                this.$scope.$apply(function () {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results === null || results.length === 0) {
                            this.pipLocationPos = null;
                            this.clearMap();
                            return;
                        }
                        var geometry = results[0].geometry || {}, location_1 = geometry.location || {};
                        if (location_1.lat === null || location_1.lng === null) {
                            this.pipLocationPos = null;
                            this.clearMap();
                            return;
                        }
                        this.pipLocationPos = {
                            type: 'Point',
                            coordinates: {
                                latitude: location_1.lat(),
                                longtitude: location_1.lng()
                            }
                        };
                        this.generateMap();
                    }
                    else {
                        this.pipLocationPos = null;
                        this.clearMap();
                    }
                });
            });
        };
        ;
        LocationEditController.prototype.onSetLocation = function () {
            var _this = this;
            if (this.ngDisabled)
                return;
            this.pipLocationEditDialog.show({
                locationName: this.pipLocationName,
                locationPos: this.pipLocationPos
            }, function (result) {
                var location = result.location, locationName = result.locationName;
                if (_this.pipLocationPos && _this.pipLocationPos.type == 'Point' &&
                    _this.pipLocationPos.coordinates.length == 2 &&
                    location && location.coordinates.length == 2 &&
                    (_this.pipLocationPos.coordinates[0] - location.coordinates[0]) < 0.0001 &&
                    (_this.pipLocationPos.coordinates[1] - location.coordinates[1]) < 0.0001 &&
                    (locationName === _this.pipLocationName)) {
                    return;
                }
                _this.pipLocationPos = location;
                _this.pipLocationName = locationName;
                if (locationName === null && location !== null) {
                    _this.pipLocationName =
                        '(' + result.location.coordinates[0] +
                            ',' + result.location.coordinates[1] + ')';
                }
                _this.pipChanged();
                _this.mapContainer[0].focus();
            });
        };
        ;
        LocationEditController.prototype.onMapClick = function ($event) {
            if (this.ngDisabled)
                return;
            this.mapContainer[0].focus();
            this.onSetLocation();
        };
        ;
        LocationEditController.prototype.onMapKeyPress = function ($event) {
            if (this.ngDisabled)
                return;
            if ($event.keyCode == 13 || $event.keyCode == 32) {
                this.onSetLocation();
            }
        };
        ;
        return LocationEditController;
    }());
    var LocationEdit = {
        bindings: LocationEditBindings,
        templateUrl: 'location_edit/LocationEdit.html',
        controller: LocationEditController
    };
    angular
        .module("pipLocationEdit", ['pipLocationEditDialog'])
        .component('pipLocationEdit', LocationEdit);
}

},{}],9:[function(require,module,exports){
{
    var LocationIpBindings = {
        pipIpaddress: '<',
        pipExtraInfo: '&',
        pipRebind: '<'
    };
    var LocationIpBindingsChanges = (function () {
        function LocationIpBindingsChanges() {
        }
        return LocationIpBindingsChanges;
    }());
    var LocationIpController = (function () {
        function LocationIpController($element, $http) {
            this.$http = $http;
            this.mapContainer = $element.children('.pip-location-container');
            $element.addClass('pip-location-ip');
            this.defineCoordinates();
        }
        LocationIpController.prototype.$onChanges = function (changes) {
            this.pipRebind = changes.pipRebind ? changes.pipRebind.currentValue || false : false;
            if (this.pipRebind === true) {
                this.pipIpaddress = changes.pipIpaddress ? changes.pipIpaddress.currentValue : this.pipIpaddress;
                this.defineCoordinates();
            }
        };
        LocationIpController.prototype.clearMap = function () {
            if (this.mapControl)
                this.mapControl.remove();
            this.mapControl = null;
        };
        LocationIpController.prototype.generateMap = function (latitude, longitude) {
            if (latitude == null || longitude == null) {
                this.clearMap();
                return;
            }
            var coordinates = new google.maps.LatLng(latitude, longitude);
            if (this.mapControl)
                this.mapControl.remove();
            this.mapControl = $('<div></div>');
            this.mapControl.appendTo(this.mapContainer);
            var mapOptions = {
                center: coordinates,
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true,
                disableDoubleClickZoom: true,
                scrollwheel: false,
                draggable: false
            }, map = new google.maps.Map(this.mapControl[0], mapOptions);
            new google.maps.Marker({
                position: coordinates,
                map: map
            });
        };
        LocationIpController.prototype.defineCoordinates = function () {
            var _this = this;
            var ipAddress = this.pipIpaddress;
            if (ipAddress == '') {
                this.clearMap();
                return;
            }
            this.$http.get('https://freegeoip.net/json/' + ipAddress)
                .success(function (response) {
                if (response != null &&
                    response.latitude != null &&
                    response.longitude != null) {
                    _this.generateMap(response.latitude, response.longitude);
                    if (_this.pipExtraInfo) {
                        var extraInfo = {
                            city: response.city,
                            regionCode: response.regionCode,
                            region: response.regionName,
                            zipCode: response.zipCode,
                            countryCode: response.countryCode,
                            country: response.countryName
                        };
                        _this.pipExtraInfo({
                            extraInfo: extraInfo
                        });
                    }
                }
                else {
                    _this.clearMap();
                }
            })
                .error(function (response) {
                _this.clearMap();
            });
        };
        return LocationIpController;
    }());
    var LocationIp = {
        bindings: LocationIpBindings,
        template: '<div class="pip-location-container"></div>',
        controller: LocationIpController
    };
    angular
        .module("pipLocationIp", [])
        .component('pipLocationIp', LocationIp);
}

},{}],10:[function(require,module,exports){
{
    var LocationMapBindings = {
        pipLocationPos: '<',
        pipLocationPositions: '<',
        pipIconPath: '<',
        pipDraggable: '<',
        pipStretch: '<',
        pipRebind: '<'
    };
    var LocationMapBindingsChanges = (function () {
        function LocationMapBindingsChanges() {
        }
        return LocationMapBindingsChanges;
    }());
    var LocationMapController = (function () {
        function LocationMapController($element) {
            this.$element = $element;
            this.mapControl = null;
            this.mapContainer = $element.children('.pip-location-container');
            $element.addClass('pip-location-map');
        }
        LocationMapController.prototype.$onChanges = function (changes) {
            this.pipRebind = changes.pipRebind ? changes.pipRebind.currentValue || false : false;
            this.pipDraggable = changes.pipDraggable ? changes.pipDraggable.currentValue || false : false;
            this.pipStretch = changes.pipStretch ? changes.pipStretch.currentValue || false : false;
            if (this.pipStretch === true) {
                this.mapContainer.addClass('stretch');
            }
            else {
                this.mapContainer.removeClass('stretch');
            }
            if (this.pipRebind === true) {
                this.pipLocationPos = changes.pipLocationPos ? changes.pipLocationPos.currentValue : this.pipLocationPos;
                this.pipLocationPositions = changes.pipLocationPositions ? changes.pipLocationPositions.currentValue : this.pipLocationPos;
                this.pipIconPath = changes.pipIconPath ? changes.pipIconPath.currentValue : this.pipIconPath;
                this.generateMap();
            }
        };
        LocationMapController.prototype.clearMap = function () {
            if (this.mapControl)
                this.mapControl.remove();
            this.mapControl = null;
        };
        LocationMapController.prototype.checkLocation = function (loc) {
            return !(loc == null || loc.coordinates == null || loc.coordinates.length < 0);
        };
        LocationMapController.prototype.determineCoordinates = function (loc) {
            var point = new google.maps.LatLng(loc.coordinates[0], loc.coordinates[1]);
            point.fill = loc.fill;
            point.stroke = loc.stroke;
            return point;
        };
        LocationMapController.prototype.generateMap = function () {
            var _this = this;
            var location = this.pipLocationPos, locations = this.pipLocationPositions, points = [], draggable = this.pipDraggable || false;
            if (this.checkLocation(location)) {
                points.push(this.determineCoordinates(location));
            }
            else {
                if (locations && locations.length && locations.length > 0) {
                    _.each(locations, function (loc) {
                        if (_this.checkLocation(loc)) {
                            points.push(_this.determineCoordinates(loc));
                        }
                    });
                }
            }
            if (points.length === 0) {
                this.clearMap();
                return;
            }
            if (this.mapControl)
                this.mapControl.remove();
            this.mapControl = $('<div></div>');
            this.mapControl.appendTo(this.mapContainer);
            var mapOptions = {
                center: points[0],
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true,
                disableDoubleClickZoom: true,
                scrollwheel: draggable,
                draggable: draggable
            }, map = new google.maps.Map(this.mapControl[0], mapOptions), bounds = new google.maps.LatLngBounds();
            _.each(points, function (point) {
                var icon = {
                    path: _this.pipIconPath,
                    fillColor: point.fill || '#EF5350',
                    fillOpacity: 1,
                    scale: 1,
                    strokeColor: point.stroke || 'white',
                    strokeWeight: 5
                };
                new google.maps.Marker({
                    position: point,
                    map: map,
                    icon: _this.pipIconPath ? icon : null
                });
                bounds.extend(point);
            });
            if (points.length > 1)
                map.fitBounds(bounds);
        };
        return LocationMapController;
    }());
    var LocationMap = {
        bindings: LocationMapBindings,
        template: '<div class="pip-location-container"></div>',
        controller: LocationMapController
    };
    angular
        .module("pipLocationMap", [])
        .component('pipLocationMap', LocationMap);
}

},{}],11:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipLocations.Templates');
} catch (e) {
  module = angular.module('pipLocations.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('location_dialog/LocationDialog.html',
    '<md-dialog class="pip-dialog pip-location-edit-dialog layout-column" md-theme="{{$ctrl.theme}}"><div class="pip-header layout-column layout-align-start-start"><md-progress-linear ng-show="$ctrl.transaction.busy()" md-mode="indeterminate" class="pip-progress-top"></md-progress-linear><h3 class="flex">{{ \'LOCATION_SET_LOCATION\' | translate }}</h3></div><div class="pip-footer"><div class="layout-row layout-align-start-center"><md-button class="md-accent" ng-click="$ctrl.onAddPin()" ng-show="$ctrl.locationPos == null" ng-disabled="$ctrl.transaction.busy()" aria-label="{{ ::\'LOCATION_ADD_PIN\' }}">{{ ::\'LOCATION_ADD_PIN\' | translate }}</md-button><md-button class="md-accent" ng-click="$ctrl.onRemovePin()" ng-show="$ctrl.locationPos != null" ng-disabled="$ctrl.transaction.busy()" aria-label="{{ ::\'LOCATION_REMOVE_PIN\' }}">{{ ::\'LOCATION_REMOVE_PIN\' | translate }}</md-button></div><div class="flex"></div><div class="layout-row layout-align-end-center"><md-button ng-click="$ctrl.onCancel()" aria-label="{{ ::\'CANCEL\' }}">{{ ::\'CANCEL\' | translate }}</md-button><md-button class="md-accent" ng-click="$ctrl.onApply()" ng-disabled="$ctrl.transaction.busy()" aria-label="{{ ::\'APPLY\' }}">{{ ::\'APPLY\' | translate }}</md-button></div></div><div class="pip-body"><div class="pip-location-container"></div><md-button class="md-icon-button md-fab pip-zoom-in" ng-click="$ctrl.onZoomIn()" aria-label="{{ ::\'LOCATION_ZOOM_IN\' }}"><md-icon md-svg-icon="icons:plus"></md-icon></md-button><md-button class="md-icon-button md-fab pip-zoom-out" ng-click="$ctrl.onZoomOut()" aria-label="{{ ::\'LOCATION_ZOOM_OUT\' }}"><md-icon md-svg-icon="icons:minus"></md-icon></md-button><md-button class="md-icon-button md-fab pip-set-location" ng-click="$ctrl.onSetLocation()" aria-label="{{ ::\'LOCATION_SET_LOCATION\' }}" ng-show="supportSet" ng-disabled="transaction.busy()"><md-icon md-svg-icon="icons:target"></md-icon></md-button></div></md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipLocations.Templates');
} catch (e) {
  module = angular.module('pipLocations.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('location/Location.html',
    '<div class="pip-location-name location-collapse" ng-click="$ctrl.pipLocationResize()" ng-if="!$ctrl.pipCollapse" ng-class="$ctrl.pipShowLocationIcon ? \'pip-location-icon-space\' : \'\'"><md-icon md-svg-icon="icons:location" class="flex-fixed pip-icon" ng-if="$ctrl.pipShowLocationIcon"></md-icon><span class="pip-location-text">{{$ctrl.pipLocationName}}</span></div><md-button class="pip-location-name" ng-click="$ctrl.pipLocationResize()" ng-if="$ctrl.pipCollapse" ng-class="$ctrl.pipShowLocationIcon ? \'pip-location-icon-space\' : \'\'"><div class="layout-align-start-center layout-row w-stretch"><md-icon md-svg-icon="icons:location" class="flex-fixed pip-icon" ng-if="$ctrl.pipShowLocationIcon"></md-icon><span class="pip-location-text flex">{{$ctrl.pipLocationName}}</span><md-icon md-svg-icon="icons:triangle-down" class="flex-fixed" ng-show="!$ctrl.showMap"></md-icon><md-icon md-svg-icon="icons:triangle-up" class="flex-fixed" ng-show="$ctrl.showMap"></md-icon></div></md-button><div class="pip-location-container"></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipLocations.Templates');
} catch (e) {
  module = angular.module('pipLocations.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('location_edit/LocationEdit.html',
    '<md-input-container class="md-block"><label>{{ \'LOCATION\' | translate }}</label> <input ng-model="$ctrl.pipLocationName" ng-disabled="$ctrl.ngDisabled"></md-input-container><div class="pip-location-empty" layout="column" layout-align="center center"><md-button class="md-raised" ng-disabled="$ctrl.ngDisabled" ng-click="$ctrl.onSetLocation()" aria-label="LOCATION_ADD_LOCATION"><span class="icon-location"></span> {{\'LOCATION_ADD_LOCATION\' | translate }}</md-button></div><div class="pip-location-container" tabindex="{{ $ctrl.ngDisabled ? -1 : 0 }}" ng-click="$ctrl.onMapClick($event)" ng-keypress="$ctrl.onMapKeyPress($event)"></div>');
}]);
})();



},{}]},{},[11,1,2,4,7,5,6,8,9,10,3])(11)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).files = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ButtonsUpload = (function () {
    function ButtonsUpload() {
    }
    return ButtonsUpload;
}());
exports.ButtonsUpload = ButtonsUpload;
},{}],2:[function(require,module,exports){
{
    translateFilter.$inject = ['$injector'];
    function translateFilter($injector) {
        var pipTranslate = $injector.has('pipTranslate')
            ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate.translate(key) || key : key;
        };
    }
    angular
        .module('pipFiles.Translate', [])
        .filter('translate', translateFilter);
}
},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileFailBindings = {
    buttons: '<?pipButtons',
    name: '<pipName',
    type: '<?pipType',
    error: '<pipError'
};
var FileFailChanges = (function () {
    function FileFailChanges() {
    }
    return FileFailChanges;
}());
var FileFailController = (function () {
    FileFailController.$inject = ['$scope'];
    function FileFailController($scope) {
        "ngInject";
        var _this = this;
        $scope.$watch('error', function (error) {
            _this.error = error;
        });
    }
    return FileFailController;
}());
var fileFailComponent = {
    controller: FileFailController,
    bindings: FileFailBindings,
    templateUrl: 'fail/FileFail.html'
};
angular
    .module('pipFiles.FailUpload', [])
    .component('pipFailUpload', fileFailComponent);
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./service/FileUploadService");
require("./model/FileModel");
require("./success/FileSuccess");
require("./upload/FileUpload");
require("./start/FileStart");
require("./fail/FileFail");
require("./select/FileSelect");
angular
    .module('pipFiles', [
    'pipFiles.Service',
    'pipFiles.Model',
    'pipFiles.SuccessUpload',
    'pipFiles.FileUpload',
    'pipFiles.StartUpload',
    'pipFiles.FailUpload',
    'pipFiles.Select'
]);
},{"./fail/FileFail":3,"./model/FileModel":5,"./select/FileSelect":6,"./service/FileUploadService":7,"./start/FileStart":10,"./success/FileSuccess":11,"./upload/FileUpload":12}],5:[function(require,module,exports){
{
    fileModelDirective.$inject = ['$parse'];
    function fileModelLink(scope, element, attrs, $parse) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;
        element.bind('change', function () {
            scope.$apply(function () {
                modelSetter(scope, element[0].files[0]);
            });
        });
    }
    function fileModelDirective($parse) {
        "ngInject";
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                fileModelLink(scope, element, attrs, $parse);
            }
        };
    }
    angular
        .module('pipFiles.Model', [])
        .directive('fileModel', fileModelDirective);
}
},{}],6:[function(require,module,exports){
{
    var FileSelectBindings = {
        localFile: '<pipLocalFile',
        change: '<pipChange'
    };
    var FileSelectController = (function () {
        FileSelectController.$inject = ['$scope'];
        function FileSelectController($scope) {
            "ngInject";
            var _this = this;
            $scope.$watch('$ctrl.localFile', function (item) {
                if (_this.change) {
                    _this.change(_this.localFile);
                }
            });
        }
        FileSelectController.prototype.onUploadButtonClick = function () {
            $('#inp_file').click();
        };
        FileSelectController.prototype.onDeleteButtonClick = function () {
            this.localFile = null;
            var forml = document.getElementById('inp_form');
            forml.reset();
        };
        return FileSelectController;
    }());
    var fileSelectDirective = {
        restrict: 'E',
        replace: true,
        bindings: FileSelectBindings,
        controller: FileSelectController,
        templateUrl: 'select/FileSelect.html'
    };
    angular
        .module('pipFiles.Select', [])
        .component('pipFileSelect', fileSelectDirective);
}
},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileUploadState_1 = require("./FileUploadState");
var FileUploadService = (function () {
    FileUploadService.$inject = ['$http'];
    function FileUploadService($http) {
        "ngInject";
        this.$http = $http;
    }
    FileUploadService.prototype.upload = function (file, url, resultCallback, progressCallback) {
        var fd = new FormData();
        fd.append('file', file);
        if (progressCallback)
            progressCallback(FileUploadState_1.FileUploadState.Uploading, 0);
        this.$http.post(url, fd, {
            uploadEventHandlers: {
                progress: function (e) {
                    if (e.lengthComputable && progressCallback) {
                        progressCallback(FileUploadState_1.FileUploadState.Uploading, (e.loaded / e.total) * 100);
                    }
                }
            },
            headers: { 'Content-Type': undefined }
        })
            .success(function (response) {
            if (progressCallback)
                progressCallback(FileUploadState_1.FileUploadState.Completed, 100);
            if (resultCallback)
                resultCallback(response, null);
        })
            .error(function (response) {
            if (progressCallback)
                progressCallback(FileUploadState_1.FileUploadState.Failed, 0);
            if (resultCallback)
                resultCallback(null, response.Error || response);
        });
    };
    return FileUploadService;
}());
angular
    .module('pipFiles.Service', [])
    .service('pipFileUpload', FileUploadService);
},{"./FileUploadState":8}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileUploadState;
(function (FileUploadState) {
    FileUploadState[FileUploadState["Uploading"] = 0] = "Uploading";
    FileUploadState[FileUploadState["Completed"] = 1] = "Completed";
    FileUploadState[FileUploadState["Failed"] = 2] = "Failed";
})(FileUploadState = exports.FileUploadState || (exports.FileUploadState = {}));
},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileStartBindings = {
    buttons: '<?pipButtons',
    name: '<pipName',
    type: '<?pipType',
    progress: '<?pipProgress'
};
var FileStartChanges = (function () {
    function FileStartChanges() {
    }
    return FileStartChanges;
}());
var FileStartController = (function () {
    function FileStartController() {
        this.progress = 0;
    }
    FileStartController.prototype.$onChanges = function (changes) {
        if (changes.progress) {
            this.progress = changes.progress.currentValue;
        }
    };
    return FileStartController;
}());
var fileStartDirective = {
    controller: FileStartController,
    bindings: FileStartBindings,
    templateUrl: 'start/FileStart.html'
};
angular
    .module('pipFiles.StartUpload', [])
    .component('pipStartUpload', fileStartDirective);
},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileSuccessBindings = {
    buttons: '=?pipButtons',
    name: '=pipName',
    type: '=?pipType',
};
var FileSuccessController = (function () {
    function FileSuccessController() {
        this.type = 'file';
    }
    FileSuccessController.prototype.$onChanges = function (changes) { };
    return FileSuccessController;
}());
var fileSuccessDirective = {
    restrict: 'E',
    replace: true,
    controller: FileSuccessController,
    controllerAs: 'vm',
    bindings: FileSuccessBindings,
    templateUrl: 'success/FileSuccess.html'
};
angular
    .module('pipFiles.SuccessUpload', [])
    .component('pipSuccesUpload', fileSuccessDirective);
},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileUploadButtons = (function () {
    function FileUploadButtons() {
    }
    return FileUploadButtons;
}());
var FileUploadBindings = {
    buttonFunction: '<?pipButtonFunctions',
    buttons: '<?pipButtons',
    error: '<?pipError',
    name: '<pipName',
    state: '<pipState',
    type: '<?pipType',
    progress: '<pipProgress'
};
var FileUploadChanges = (function () {
    function FileUploadChanges() {
    }
    return FileUploadChanges;
}());
var FileUploadController = (function () {
    function FileUploadController($scope) {
        this.error = null;
    }
    FileUploadController.prototype.$onInit = function () {
        var _this = this;
        if (this.buttons) {
            this.uploadButtons = [];
            this.failButtons = [
                { title: 'Cancel', click: function () { _this.onCancel(); } },
                { title: 'Retry', click: function () { _this.onRetry(); } }
            ];
            this.startButtons = [
                { title: 'Abort', click: function () { _this.onAbort(); } }
            ];
        }
    };
    FileUploadController.prototype.$onChanges = function (changes) {
        if (changes.state) {
            this.state = changes.state.currentValue;
        }
        if (changes.progress) {
            this.progress = changes.progress.currentValue;
        }
        if (changes.error) {
            this.error = changes.error.currentValue;
        }
    };
    FileUploadController.prototype.onCancel = function () {
        if (this.buttonFunction.cancel)
            this.buttonFunction.cancel();
    };
    FileUploadController.prototype.onRetry = function () {
        if (this.buttonFunction.retry)
            this.buttonFunction.retry();
    };
    FileUploadController.prototype.onAbort = function () {
        if (this.buttonFunction.abort)
            this.buttonFunction.abort();
    };
    return FileUploadController;
}());
var fileUploadDirective = {
    controller: FileUploadController,
    bindings: FileUploadBindings,
    templateUrl: 'upload/FileUpload.html'
};
angular
    .module('pipFiles.FileUpload', [])
    .component('pipFileUpload', fileUploadDirective);
},{}],13:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipFiles.Templates');
} catch (e) {
  module = angular.module('pipFiles.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('fail/FileFail.html',
    '<div class="pip-files pip-progress-files"><div class="pip-body pip-scroll pip-progress-body"><div class="layout-row"><div class="pip-progress-icon color-badge-bg"><md-icon md-svg-icon="icons:cross"></md-icon></div><div class="pip-progress-content"><h3 class="pip-title">Uploading {{$ctrl.type}} failed with errors!</h3><div class="color-secondary-text pip-subtitle">{{$ctrl.name}}</div><div class="color-error pip-error">{{$ctrl.error}}</div></div></div></div><div class="pip-footer layout-row layout-align-end-center" ng-if="$ctrl.buttons && $ctrl.buttons.length > 0"><div><md-button class="md-accent" ng-repeat="fail in $ctrl.buttons" ng-click="fail.click()">{{::fail.title}}</md-button></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipFiles.Templates');
} catch (e) {
  module = angular.module('pipFiles.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('select/FileSelect.html',
    '<div class="pip-file-select"><form id="inp_form" class="pip-hidden-form"><input type="file" file-model="$ctrl.localFile" id="inp_file" ng-model="$ctrl.localFile"></form><md-button class="md-raised md-accent pip-button" ng-click="$ctrl.onUploadButtonClick()" ng-if="!$ctrl.localFile">Choose File</md-button><div ng-if="$ctrl.localFile.name" class="pip-file layout-row layout-align-start-center"><md-icon md-svg-icon="icons:document" class="pip-icon"></md-icon><div class="flex"><div class="text-body2 text-overflow">{{$ctrl.localFile.name}}</div><div ng-if="$ctrl.localFile.size" class="color-secondary-text">{{$ctrl.localFile.size}}</div></div><md-button ng-click="$ctrl.onDeleteButtonClick()" class="md-icon-button"><md-icon md-svg-icon="icons:cross-circle"></md-icon></md-button></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipFiles.Templates');
} catch (e) {
  module = angular.module('pipFiles.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('start/FileStart.html',
    '<div class="pip-files pip-progress-files"><div class="pip-body pip-scroll pip-progress-body"><div class="layout-row"><div class="pip-progress-icon bb-orange"><md-icon md-svg-icon="icons:play"></md-icon></div><div class="pip-progress-content"><h3 class="pip-title">Uploading {{::$ctrl.type}}</h3><div class="color-secondary-text pip-subtitle">{{$ctrl.name}}</div><div><md-progress-linear md-mode="determinate" class="md-accent" value="{{$ctrl.progress}}" ng-if="$ctrl.progress < 100"></md-progress-linear><md-progress-linear md-mode="indeterminate" class="md-accent" ng-if="$ctrl.progress == 100"></md-progress-linear></div></div></div></div><div class="pip-footer layout-row layout-align-end-center" ng-if="$ctrl.buttons"><div><md-button class="md-accent" ng-repeat="start in $ctrl.buttons" ng-click="start.click()">{{start.title}}</md-button></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipFiles.Templates');
} catch (e) {
  module = angular.module('pipFiles.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('success/FileSuccess.html',
    '<div class="pip-files pip-progress-files"><div class="pip-body pip-scroll pip-progress-body"><div class="layout-row"><div class="pip-progress-icon bb-green"><md-icon md-svg-icon="icons:check"></md-icon></div><div class="pip-progress-content"><h3 class="pip-title">Uploaded {{::vm.type}} successfully!</h3><div class="color-secondary-text pip-subtitle">{{vm.name}}</div></div></div></div><div class="pip-footer layout-row layout-align-end-center" ng-if="vm.buttons && vm.buttons.length > 0"><div><md-button class="md-accent" ng-repeat="start in vm.buttons" ng-click="start.click()">{{start.title}}</md-button></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipFiles.Templates');
} catch (e) {
  module = angular.module('pipFiles.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('upload/FileUpload.html',
    '<div><pip-succes-upload ng-if="$ctrl.state == 1 && (!$ctrl.buttons || $ctrl.uploadButtons)" pip-name="$ctrl.name" pip-type="$ctrl.type" pip-buttons="$ctrl.buttons"></pip-succes-upload><pip-fail-upload ng-if="$ctrl.state == 2" pip-name="$ctrl.name" pip-type="$ctrl.type" pip-error="$ctrl.error" pip-buttons="$ctrl.failButtons"></pip-fail-upload><pip-start-upload ng-if="$ctrl.state == 0" pip-name="$ctrl.name" pip-type="$ctrl.type" pip-progress="$ctrl.progress" pip-buttons="$ctrl.startButtons"></pip-start-upload></div>');
}]);
})();



},{}]},{},[13,1,2,3,4,5,6,7,8,9,10,11,12])(13)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).dashboard = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./widgets/Widgets");
require("./draggable/Draggable");
angular.module('pipDashboard', [
    'pipWidget',
    'pipDragged',
    'pipWidgetConfigDialog',
    'pipAddDashboardComponentDialog',
    'pipDashboard.Templates',
    'pipLayout',
    'pipLocations',
    'pipDateTime',
    'pipCharts',
    'pipTranslate',
    'pipControls'
]);
require("./utility/WidgetTemplateUtility");
require("./dialogs/widget_config/ConfigDialogController");
require("./dialogs/add_component/AddComponentDialogController");
require("./DashboardComponent");

},{"./DashboardComponent":2,"./dialogs/add_component/AddComponentDialogController":3,"./dialogs/widget_config/ConfigDialogController":5,"./draggable/Draggable":8,"./utility/WidgetTemplateUtility":13,"./widgets/Widgets":15}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
{
    var setTranslations = function ($injector) {
        var pipTranslate = $injector.has('pipTranslateProvider') ? $injector.get('pipTranslateProvider') : null;
        if (pipTranslate) {
            pipTranslate.setTranslations('en', {
                DROP_TO_CREATE_NEW_GROUP: 'Drop here to create new group',
            });
            pipTranslate.setTranslations('ru', {
                DROP_TO_CREATE_NEW_GROUP: 'Перетащите сюда для создания новой группы'
            });
        }
    };
    setTranslations.$inject = ['$injector'];
    var configureAvailableWidgets = function (pipAddComponentDialogProvider) {
        pipAddComponentDialogProvider.configWidgetList([
            [{
                    title: 'Event',
                    icon: 'document',
                    name: 'event',
                    amount: 0
                },
                {
                    title: 'Position',
                    icon: 'location',
                    name: 'position',
                    amount: 0
                }
            ],
            [{
                    title: 'Calendar',
                    icon: 'date',
                    name: 'calendar',
                    amount: 0
                },
                {
                    title: 'Sticky Notes',
                    icon: 'note-take',
                    name: 'notes',
                    amount: 0
                },
                {
                    title: 'Statistics',
                    icon: 'tr-statistics',
                    name: 'statistics',
                    amount: 0
                }
            ]
        ]);
    };
    configureAvailableWidgets.$inject = ['pipAddComponentDialogProvider'];
    var draggableOptions = (function () {
        function draggableOptions() {
        }
        return draggableOptions;
    }());
    var DEFAULT_GRID_OPTIONS_1 = {
        tileWidth: 150,
        tileHeight: 150,
        gutter: 10,
        inline: false
    };
    var DashboardController = (function () {
        function DashboardController($scope, $rootScope, $attrs, $element, $timeout, $interpolate, pipAddComponentDialog, pipWidgetTemplate) {
            var _this = this;
            this.$rootScope = $rootScope;
            this.$attrs = $attrs;
            this.$element = $element;
            this.$timeout = $timeout;
            this.$interpolate = $interpolate;
            this.pipAddComponentDialog = pipAddComponentDialog;
            this.pipWidgetTemplate = pipWidgetTemplate;
            this.defaultGroupMenuActions = [{
                    title: 'Add Component',
                    callback: function (groupIndex) {
                        _this.addComponent(groupIndex);
                    }
                },
                {
                    title: 'Remove',
                    callback: function (groupIndex) {
                        _this.removeGroup(groupIndex);
                    }
                },
                {
                    title: 'Configurate',
                    callback: function (groupIndex) {
                        console.log('configurate group with index:', groupIndex);
                    }
                }
            ];
            this._includeTpl = '<pip-{{ type }}-widget group="groupIndex" index="index"' +
                'pip-options="$parent.$ctrl.groupedWidgets[groupIndex][\'source\'][index].opts">' +
                '</pip-{{ type }}-widget>';
            this.groupMenuActions = this.defaultGroupMenuActions;
            this.removeGroup = function (groupIndex) {
                console.log('removeGroup', groupIndex);
                _this.groupedWidgets.splice(groupIndex, 1);
            };
            $element.addClass('pip-scroll');
            this.draggableGridOptions = this.gridOptions || DEFAULT_GRID_OPTIONS_1;
            if (this.draggableGridOptions.inline === true) {
                $element.addClass('inline-grid');
            }
            if (this.groupAdditionalActions)
                angular.extend(this.groupMenuActions, this.groupAdditionalActions);
            this.widgetsContext = $scope;
            this.compileWidgets();
            this.$timeout(function () {
                _this.$element.addClass('visible');
            }, 700);
        }
        DashboardController.prototype.compileWidgets = function () {
            var _this = this;
            _.each(this.groupedWidgets, function (group, groupIndex) {
                group.removedWidgets = group.removedWidgets || [],
                    group.source = group.source.map(function (widget, index) {
                        widget.size = widget.size || {
                            colSpan: 1,
                            rowSpan: 1
                        };
                        widget.index = index;
                        widget.groupIndex = groupIndex;
                        widget.menu = widget.menu || {};
                        angular.extend(widget.menu, [{
                                title: 'Remove',
                                click: function (item, params, object) {
                                    _this.removeWidget(item, params, object);
                                }
                            }]);
                        return {
                            opts: widget,
                            template: _this.pipWidgetTemplate.getTemplate(widget, _this._includeTpl)
                        };
                    });
            });
        };
        DashboardController.prototype.addComponent = function (groupIndex) {
            var _this = this;
            this.pipAddComponentDialog
                .show(this.groupedWidgets, groupIndex)
                .then(function (data) {
                var activeGroup;
                if (!data) {
                    return;
                }
                if (data.groupIndex !== -1) {
                    activeGroup = _this.groupedWidgets[data.groupIndex];
                }
                else {
                    activeGroup = {
                        title: 'New group',
                        source: []
                    };
                }
                _this.addWidgets(activeGroup.source, data.widgets);
                if (data.groupIndex === -1) {
                    _this.groupedWidgets.push(activeGroup);
                }
                _this.compileWidgets();
            });
        };
        ;
        DashboardController.prototype.addWidgets = function (group, widgets) {
            widgets.forEach(function (widgetGroup) {
                widgetGroup.forEach(function (widget) {
                    if (widget.amount) {
                        Array.apply(null, Array(widget.amount)).forEach(function () {
                            group.push({
                                type: widget.name
                            });
                        });
                    }
                });
            });
        };
        DashboardController.prototype.removeWidget = function (item, params, object) {
            var _this = this;
            this.groupedWidgets[params.options.groupIndex].removedWidgets = [];
            this.groupedWidgets[params.options.groupIndex].removedWidgets.push(params.options.index);
            this.groupedWidgets[params.options.groupIndex].source.splice(params.options.index, 1);
            this.$timeout(function () {
                _this.groupedWidgets[params.options.groupIndex].removedWidgets = [];
            });
        };
        return DashboardController;
    }());
    var pipDashboard = {
        bindings: {
            gridOptions: '=pipGridOptions',
            groupAdditionalActions: '=pipGroupActions',
            groupedWidgets: '=pipGroups'
        },
        controller: DashboardController,
        templateUrl: 'Dashboard.html'
    };
    angular
        .module('pipDashboard')
        .config(configureAvailableWidgets)
        .config(setTranslations)
        .component('pipDashboard', pipDashboard);
}

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AddComponentDialogWidget = (function () {
    function AddComponentDialogWidget() {
    }
    return AddComponentDialogWidget;
}());
exports.AddComponentDialogWidget = AddComponentDialogWidget;
var AddComponentDialogController = (function () {
    function AddComponentDialogController(groups, activeGroupIndex, widgetList, $mdDialog) {
        this.activeGroupIndex = activeGroupIndex;
        this.$mdDialog = $mdDialog;
        this.totalWidgets = 0;
        this.activeGroupIndex = _.isNumber(activeGroupIndex) ? activeGroupIndex : -1;
        this.defaultWidgets = _.cloneDeep(widgetList);
        this.groups = _.map(groups, function (group) {
            return group['title'];
        });
    }
    AddComponentDialogController.prototype.add = function () {
        this.$mdDialog.hide({
            groupIndex: this.activeGroupIndex,
            widgets: this.defaultWidgets
        });
    };
    ;
    AddComponentDialogController.prototype.cancel = function () {
        this.$mdDialog.cancel();
    };
    ;
    AddComponentDialogController.prototype.encrease = function (groupIndex, widgetIndex) {
        var widget = this.defaultWidgets[groupIndex][widgetIndex];
        widget.amount++;
        this.totalWidgets++;
    };
    ;
    AddComponentDialogController.prototype.decrease = function (groupIndex, widgetIndex) {
        var widget = this.defaultWidgets[groupIndex][widgetIndex];
        widget.amount = widget.amount ? widget.amount - 1 : 0;
        this.totalWidgets = this.totalWidgets ? this.totalWidgets - 1 : 0;
    };
    ;
    return AddComponentDialogController;
}());
exports.AddComponentDialogController = AddComponentDialogController;
angular
    .module('pipAddDashboardComponentDialog', ['ngMaterial']);
require("./AddComponentProvider");

},{"./AddComponentProvider":4}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AddComponentDialogController_1 = require("./AddComponentDialogController");
{
    var setTranslations = function ($injector) {
        var pipTranslate = $injector.has('pipTranslateProvider') ? $injector.get('pipTranslateProvider') : null;
        if (pipTranslate) {
            pipTranslate.setTranslations('en', {
                DASHBOARD_ADD_COMPONENT_DIALOG_TITLE: 'Add component',
                DASHBOARD_ADD_COMPONENT_DIALOG_USE_HOT_KEYS: 'Use "Enter" or "+" buttons on keyboard to encrease and "Delete" or "-" to decrease tiles amount',
                DASHBOARD_ADD_COMPONENT_DIALOG_CREATE_NEW_GROUP: 'Create new group'
            });
            pipTranslate.setTranslations('ru', {
                DASHBOARD_ADD_COMPONENT_DIALOG_TITLE: 'Добавить компонент',
                DASHBOARD_ADD_COMPONENT_DIALOG_USE_HOT_KEYS: 'Используйте "Enter" или "+" клавиши на клавиатуре чтобы увеличить и "Delete" or "-" чтобы уменшить количество тайлов',
                DASHBOARD_ADD_COMPONENT_DIALOG_CREATE_NEW_GROUP: 'Создать новую группу'
            });
        }
    };
    setTranslations.$inject = ['$injector'];
    var AddComponentDialogService_1 = (function () {
        function AddComponentDialogService_1(widgetList, $mdDialog) {
            this.widgetList = widgetList;
            this.$mdDialog = $mdDialog;
        }
        AddComponentDialogService_1.prototype.show = function (groups, activeGroupIndex) {
            var _this = this;
            return this.$mdDialog
                .show({
                templateUrl: 'dialogs/add_component/AddComponent.html',
                bindToController: true,
                controller: AddComponentDialogController_1.AddComponentDialogController,
                controllerAs: 'dialogCtrl',
                clickOutsideToClose: true,
                resolve: {
                    groups: function () {
                        return groups;
                    },
                    activeGroupIndex: function () {
                        return activeGroupIndex;
                    },
                    widgetList: function () {
                        return _this.widgetList;
                    }
                }
            });
        };
        ;
        return AddComponentDialogService_1;
    }());
    var AddComponentDialogProvider = (function () {
        function AddComponentDialogProvider() {
            this._widgetList = null;
            this.configWidgetList = function (list) {
                this._widgetList = list;
            };
        }
        AddComponentDialogProvider.prototype.$get = ['$mdDialog', function ($mdDialog) {
            "ngInject";
            if (this._service == null)
                this._service = new AddComponentDialogService_1(this._widgetList, $mdDialog);
            return this._service;
        }];
        return AddComponentDialogProvider;
    }());
    angular
        .module('pipDashboard')
        .config(setTranslations)
        .provider('pipAddComponentDialog', AddComponentDialogProvider);
}

},{"./AddComponentDialogController":3}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileColors = (function () {
    function TileColors() {
    }
    return TileColors;
}());
TileColors.all = ['purple', 'green', 'gray', 'orange', 'blue'];
var TileSizes = (function () {
    function TileSizes() {
    }
    return TileSizes;
}());
TileSizes.all = [{
        name: 'DASHBOARD_WIDGET_CONFIG_DIALOG_SIZE_SMALL',
        id: '11'
    },
    {
        name: 'DASHBOARD_WIDGET_CONFIG_DIALOG_SIZE_WIDE',
        id: '21'
    },
    {
        name: 'DASHBOARD_WIDGET_CONFIG_DIALOG_SIZE_LARGE',
        id: '22'
    }
];
var WidgetConfigDialogController = (function () {
    WidgetConfigDialogController.$inject = ['params', '$mdDialog'];
    function WidgetConfigDialogController(params, $mdDialog) {
        "ngInject";
        var _this = this;
        this.params = params;
        this.$mdDialog = $mdDialog;
        this.colors = TileColors.all;
        this.sizes = TileSizes.all;
        this.sizeId = TileSizes.all[0].id;
        angular.extend(this, this.params);
        this.sizeId = '' + this.params.size.colSpan + this.params.size.rowSpan;
        this.onCancel = function () {
            _this.$mdDialog.cancel();
        };
    }
    WidgetConfigDialogController.prototype.onApply = function (updatedData) {
        this['size'].sizeX = Number(this.sizeId.substr(0, 1));
        this['size'].sizeY = Number(this.sizeId.substr(1, 1));
        this.$mdDialog.hide(updatedData);
    };
    return WidgetConfigDialogController;
}());
exports.WidgetConfigDialogController = WidgetConfigDialogController;
angular
    .module('pipWidgetConfigDialog', ['ngMaterial']);
require("./ConfigDialogService");
require("./ConfigDialogExtendComponent");

},{"./ConfigDialogExtendComponent":6,"./ConfigDialogService":7}],6:[function(require,module,exports){
{
    var WidgetConfigExtendComponentBindings = {
        pipExtensionUrl: '<',
        pipDialogScope: '<',
        pipApply: '&'
    };
    var WidgetConfigExtendComponentChanges = (function () {
        function WidgetConfigExtendComponentChanges() {
        }
        return WidgetConfigExtendComponentChanges;
    }());
    var WidgetConfigExtendComponentController = (function () {
        function WidgetConfigExtendComponentController($templateRequest, $compile, $scope, $element, $attrs) {
            this.$templateRequest = $templateRequest;
            this.$compile = $compile;
            this.$scope = $scope;
            this.$element = $element;
            this.$attrs = $attrs;
        }
        WidgetConfigExtendComponentController.prototype.$onChanges = function (changes) {
            var _this = this;
            if (changes.pipDialogScope) {
                angular.extend(this, changes.pipDialogScope.currentValue);
            }
            if (changes.pipExtensionUrl) {
                this.$templateRequest(changes.pipExtensionUrl.currentValue, false).then(function (html) {
                    _this.$element.find('pip-extension-point').replaceWith(_this.$compile(html)(_this.$scope));
                });
            }
        };
        WidgetConfigExtendComponentController.prototype.onApply = function () {
            this.pipApply({ updatedData: this });
        };
        return WidgetConfigExtendComponentController;
    }());
    var pipWidgetConfigComponent = {
        templateUrl: 'dialogs/widget_config/ConfigDialogExtendComponent.html',
        controller: WidgetConfigExtendComponentController,
        bindings: WidgetConfigExtendComponentBindings
    };
    angular
        .module('pipWidgetConfigDialog')
        .component('pipWidgetConfigExtendComponent', pipWidgetConfigComponent);
}

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConfigDialogController_1 = require("./ConfigDialogController");
{
    var setTranslations = function ($injector) {
        var pipTranslate = $injector.has('pipTranslateProvider') ? $injector.get('pipTranslateProvider') : null;
        if (pipTranslate) {
            pipTranslate.setTranslations('en', {
                DASHBOARD_WIDGET_CONFIG_DIALOG_TITLE: 'Edit tile',
                DASHBOARD_WIDGET_CONFIG_DIALOG_SIZE_SMALL: 'Small',
                DASHBOARD_WIDGET_CONFIG_DIALOG_SIZE_WIDE: 'Wide',
                DASHBOARD_WIDGET_CONFIG_DIALOG_SIZE_LARGE: 'Large'
            });
            pipTranslate.setTranslations('ru', {
                DASHBOARD_WIDGET_CONFIG_DIALOG_TITLE: 'Изменить виджет',
                DASHBOARD_WIDGET_CONFIG_DIALOG_SIZE_SMALL: 'Мален.',
                DASHBOARD_WIDGET_CONFIG_DIALOG_SIZE_WIDE: 'Широкий',
                DASHBOARD_WIDGET_CONFIG_DIALOG_SIZE_LARGE: 'Большой'
            });
        }
    };
    setTranslations.$inject = ['$injector'];
    var WidgetConfigDialogService = (function () {
        WidgetConfigDialogService.$inject = ['$mdDialog'];
        function WidgetConfigDialogService($mdDialog) {
            this.$mdDialog = $mdDialog;
        }
        WidgetConfigDialogService.prototype.show = function (params, successCallback, cancelCallback) {
            this.$mdDialog.show({
                targetEvent: params.event,
                templateUrl: params.templateUrl || 'dialogs/widget_config/ConfigDialog.html',
                controller: ConfigDialogController_1.WidgetConfigDialogController,
                bindToController: true,
                controllerAs: 'vm',
                locals: {
                    params: params.locals
                },
                clickOutsideToClose: true
            })
                .then(function (key) {
                if (successCallback) {
                    successCallback(key);
                }
            }, function () {
                if (cancelCallback) {
                    cancelCallback();
                }
            });
        };
        return WidgetConfigDialogService;
    }());
    angular
        .module('pipWidgetConfigDialog')
        .config(setTranslations)
        .service('pipWidgetConfigDialogService', WidgetConfigDialogService);
}

},{"./ConfigDialogController":5}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipDragged', []);
require("./DraggableTileService");
require("./DraggableComponent");
require("./draggable_group/DraggableTilesGroupService");
require("./draggable_group/DraggableTilesGroupDirective");

},{"./DraggableComponent":9,"./DraggableTileService":10,"./draggable_group/DraggableTilesGroupDirective":11,"./draggable_group/DraggableTilesGroupService":12}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DraggableTileService_1 = require("./DraggableTileService");
var DraggableTilesGroupService_1 = require("./draggable_group/DraggableTilesGroupService");
exports.DEFAULT_TILE_WIDTH = 150;
exports.DEFAULT_TILE_HEIGHT = 150;
exports.UPDATE_GROUPS_EVENT = "pipUpdateDashboardGroupsConfig";
var SIMPLE_LAYOUT_COLUMNS_COUNT = 2;
var DEFAULT_OPTIONS = {
    tileWidth: exports.DEFAULT_TILE_WIDTH,
    tileHeight: exports.DEFAULT_TILE_HEIGHT,
    gutter: 20,
    container: 'pip-draggable-grid:first-of-type',
    activeDropzoneClass: 'dropzone-active',
    groupContaninerSelector: '.pip-draggable-group:not(.fict-group)',
};
{
    var DraggableController = (function () {
        function DraggableController($scope, $rootScope, $compile, $timeout, $element, pipDragTile, pipTilesGrid, pipMedia) {
            var _this = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$compile = $compile;
            this.$timeout = $timeout;
            this.$element = $element;
            this.sourceDropZoneElem = null;
            this.isSameDropzone = true;
            this.tileGroups = null;
            this.opts = _.merge({
                mobileBreakpoint: pipMedia.breakpoints.xs
            }, DEFAULT_OPTIONS, this.options);
            this.groups = this.tilesTemplates.map(function (group, groupIndex) {
                return {
                    title: group.title,
                    editingName: false,
                    index: groupIndex,
                    source: group.source.map(function (tile) {
                        var tileScope = _this.createTileScope(tile);
                        return DraggableTileService_1.IDragTileConstructor(DraggableTileService_1.DragTileService, {
                            tpl: $compile(tile.template)(tileScope),
                            options: tile.opts,
                            size: tile.opts.size
                        });
                    })
                };
            });
            $scope.$watch('$ctrl.tilesTemplates', function (newVal) {
                _this.watch(newVal);
            }, true);
            this.initialize();
            $(window).on('resize', _.debounce(function () {
                _this.availableWidth = _this.getContainerWidth();
                _this.availableColumns = _this.getAvailableColumns(_this.availableWidth);
                _this.tileGroups.forEach(function (group) {
                    group
                        .setAvailableColumns(_this.availableColumns)
                        .generateGrid(_this.getSingleTileWidthForMobile(_this.availableWidth))
                        .setTilesDimensions()
                        .calcContainerHeight();
                });
            }, 50));
        }
        DraggableController.prototype.$postLink = function () {
            this.$container = this.$element;
        };
        DraggableController.prototype.watch = function (newVal) {
            var _this = this;
            var prevVal = this.groups;
            var changedGroupIndex = null;
            if (newVal.length > prevVal.length) {
                this.addGroup(newVal[newVal.length - 1]);
                return;
            }
            if (newVal.length < prevVal.length) {
                this.removeGroups(newVal);
                return;
            }
            for (var i = 0; i < newVal.length; i++) {
                var groupWidgetDiff = prevVal[i].source.length - newVal[i].source.length;
                if (groupWidgetDiff || (newVal[i].removedWidgets && newVal[i].removedWidgets.length > 0)) {
                    changedGroupIndex = i;
                    if (groupWidgetDiff < 0) {
                        var newTiles = newVal[changedGroupIndex].source.slice(groupWidgetDiff);
                        _.each(newTiles, function (tile) {
                            console.log('tile', tile);
                        });
                        this.addTilesIntoGroup(newTiles, this.tileGroups[changedGroupIndex], this.groupsContainers[changedGroupIndex]);
                        this.$timeout(function () {
                            _this.updateTilesGroups();
                        });
                    }
                    else {
                        this.removeTiles(this.tileGroups[changedGroupIndex], newVal[changedGroupIndex].removedWidgets, this.groupsContainers[changedGroupIndex]);
                        this.updateTilesOptions(newVal);
                        this.$timeout(function () {
                            _this.updateTilesGroups();
                        });
                    }
                    return;
                }
            }
            if (newVal && this.tileGroups) {
                this.updateTilesOptions(newVal);
                this.$timeout(function () {
                    _this.updateTilesGroups();
                });
            }
        };
        DraggableController.prototype.onTitleClick = function (group, event) {
            if (!group.editingName) {
                group.oldTitle = _.clone(group.title);
                group.editingName = true;
                this.$timeout(function () {
                    $(event.currentTarget.children[0]).focus();
                });
            }
        };
        DraggableController.prototype.cancelEditing = function (group) {
            group.title = group.oldTitle;
        };
        DraggableController.prototype.onBlurTitleInput = function (group) {
            var _this = this;
            this.$timeout(function () {
                group.editingName = false;
                _this.$rootScope.$broadcast(exports.UPDATE_GROUPS_EVENT, _this.groups);
                _this.tilesTemplates[group.index].title = group.title;
            }, 100);
        };
        DraggableController.prototype.onKyepressTitleInput = function (group, event) {
            if (event.keyCode === 13) {
                this.onBlurTitleInput(group);
            }
        };
        DraggableController.prototype.updateTilesTemplates = function (updateType, source) {
            switch (updateType) {
                case 'addGroup':
                    if (this.groups.length !== this.tilesTemplates.length) {
                        this.tilesTemplates.push(source);
                    }
                    break;
                case 'moveTile':
                    var _a = {
                        fromIndex: source.from.elem.attributes['data-group-id'].value,
                        toIndex: source.to.elem.attributes['data-group-id'].value,
                        tileOptions: source.tile.opts.options,
                        fromTileIndex: source.tile.opts.options.index
                    }, fromIndex = _a.fromIndex, toIndex = _a.toIndex, tileOptions = _a.tileOptions, fromTileIndex = _a.fromTileIndex;
                    this.tilesTemplates[fromIndex].source.splice(fromTileIndex, 1);
                    this.tilesTemplates[toIndex].source.push({
                        opts: tileOptions
                    });
                    this.reIndexTiles(source.from.elem);
                    this.reIndexTiles(source.to.elem);
                    break;
            }
        };
        DraggableController.prototype.createTileScope = function (tile) {
            var tileScope = this.$rootScope.$new(false, this.tilesContext);
            tileScope.index = tile.opts.index == undefined ? tile.opts.options.index : tile.opts.index;
            tileScope.groupIndex = tile.opts.groupIndex == undefined ? tile.opts.options.groupIndex : tile.opts.groupIndex;
            return tileScope;
        };
        DraggableController.prototype.removeTiles = function (group, indexes, container) {
            var tiles = $(container).find('.pip-draggable-tile');
            _.each(indexes, function (index) {
                group.tiles.splice(index, 1);
                tiles[index].remove();
            });
            this.reIndexTiles(container);
        };
        DraggableController.prototype.reIndexTiles = function (container, gIndex) {
            var tiles = $(container).find('.pip-draggable-tile'), groupIndex = gIndex === undefined ? container.attributes['data-group-id'].value : gIndex;
            _.each(tiles, function (tile, index) {
                var child = $(tile).children()[0];
                angular.element(child).scope()['index'] = index;
                angular.element(child).scope()['groupIndex'] = groupIndex;
            });
        };
        DraggableController.prototype.removeGroups = function (newGroups) {
            var _this = this;
            var removeIndexes = [], remain = [], containers = [];
            _.each(this.groups, function (group, index) {
                if (_.findIndex(newGroups, function (g) {
                    return g['title'] === group.title;
                }) < 0) {
                    removeIndexes.push(index);
                }
                else {
                    remain.push(index);
                }
            });
            _.each(removeIndexes.reverse(), function (index) {
                _this.groups.splice(index, 1);
                _this.tileGroups.splice(index, 1);
            });
            _.each(remain, function (index) {
                containers.push(_this.groupsContainers[index]);
            });
            this.groupsContainers = containers;
            _.each(this.groupsContainers, function (container, index) {
                _this.reIndexTiles(container, index);
            });
        };
        DraggableController.prototype.addGroup = function (sourceGroup) {
            var _this = this;
            var group = {
                title: sourceGroup.title,
                source: sourceGroup.source.map(function (tile) {
                    var tileScope = _this.createTileScope(tile);
                    return DraggableTileService_1.IDragTileConstructor(DraggableTileService_1.DragTileService, {
                        tpl: _this.$compile(tile.template)(tileScope),
                        options: tile.opts,
                        size: tile.opts.size
                    });
                })
            };
            this.groups.push(group);
            if (!this.$scope.$$phase)
                this.$scope.$apply();
            this.$timeout(function () {
                _this.groupsContainers = document.querySelectorAll(_this.opts.groupContaninerSelector);
                _this.tileGroups.push(DraggableTilesGroupService_1.ITilesGridConstructor(DraggableTilesGroupService_1.TilesGridService, group.source, _this.opts, _this.availableColumns, _this.groupsContainers[_this.groupsContainers.length - 1])
                    .generateGrid(_this.getSingleTileWidthForMobile(_this.availableWidth))
                    .setTilesDimensions()
                    .calcContainerHeight());
            });
            this.updateTilesTemplates('addGroup', sourceGroup);
        };
        DraggableController.prototype.addTilesIntoGroup = function (newTiles, group, groupContainer) {
            var _this = this;
            newTiles.forEach(function (tile) {
                var tileScope = _this.createTileScope(tile);
                var newTile = DraggableTileService_1.IDragTileConstructor(DraggableTileService_1.DragTileService, {
                    tpl: _this.$compile(tile.template)(tileScope),
                    options: tile.opts,
                    size: tile.opts.size
                });
                group.addTile(newTile);
                $('<div>')
                    .addClass('pip-draggable-tile')
                    .append(newTile.getCompiledTemplate())
                    .appendTo(groupContainer);
            });
        };
        DraggableController.prototype.updateTilesOptions = function (optionsGroup) {
            var _this = this;
            optionsGroup.forEach(function (optionGroup) {
                optionGroup.source.forEach(function (tileOptions) {
                    _this.tileGroups.forEach(function (group) {
                        group.updateTileOptions(tileOptions.opts);
                    });
                });
            });
        };
        DraggableController.prototype.initTilesGroups = function (tileGroups, opts, groupsContainers) {
            var _this = this;
            return tileGroups.map(function (group, index) {
                return DraggableTilesGroupService_1.ITilesGridConstructor(DraggableTilesGroupService_1.TilesGridService, group.source, opts, _this.availableColumns, groupsContainers[index])
                    .generateGrid(_this.getSingleTileWidthForMobile(_this.availableWidth))
                    .setTilesDimensions()
                    .calcContainerHeight();
            });
        };
        DraggableController.prototype.updateTilesGroups = function (onlyPosition, draggedTile) {
            var _this = this;
            this.tileGroups.forEach(function (group) {
                if (!onlyPosition) {
                    group.generateGrid(_this.getSingleTileWidthForMobile(_this.availableWidth));
                }
                group
                    .setTilesDimensions(onlyPosition, draggedTile)
                    .calcContainerHeight();
            });
        };
        DraggableController.prototype.getContainerWidth = function () {
            var container = this.$container || $('body');
            return container.width();
        };
        DraggableController.prototype.getAvailableColumns = function (availableWidth) {
            return this.opts.mobileBreakpoint > availableWidth ? SIMPLE_LAYOUT_COLUMNS_COUNT :
                Math.floor(availableWidth / (this.opts.tileWidth + this.opts.gutter));
        };
        DraggableController.prototype.getActiveGroupAndTile = function (elem) {
            var active = {};
            this.tileGroups.forEach(function (group) {
                var foundTile = group.getTileByNode(elem);
                if (foundTile) {
                    active['group'] = group;
                    active['tile'] = foundTile;
                    return;
                }
            });
            return active;
        };
        DraggableController.prototype.getSingleTileWidthForMobile = function (availableWidth) {
            return this.opts.mobileBreakpoint > availableWidth ? availableWidth / 2 - this.opts.gutter : null;
        };
        DraggableController.prototype.onDragStartListener = function (event) {
            var activeEntities = this.getActiveGroupAndTile(event.target);
            this.container = $(event.target).parent('.pip-draggable-group').get(0);
            this.draggedTile = activeEntities['tile'];
            this.activeDraggedGroup = activeEntities['group'];
            this.$element.addClass('drag-transfer');
            this.draggedTile.startDrag();
        };
        DraggableController.prototype.onDragMoveListener = function (event) {
            var _this = this;
            var target = event.target;
            var x = (parseFloat(target.style.left) || 0) + event.dx;
            var y = (parseFloat(target.style.top) || 0) + event.dy;
            this.containerOffset = this.getContainerOffset();
            target.style.left = x + 'px';
            target.style.top = y + 'px';
            var belowElement = this.activeDraggedGroup.getTileByCoordinates({
                left: event.pageX - this.containerOffset.left,
                top: event.pageY - this.containerOffset.top
            }, this.draggedTile);
            if (belowElement) {
                var draggedTileIndex = this.activeDraggedGroup.getTileIndex(this.draggedTile);
                var belowElemIndex = this.activeDraggedGroup.getTileIndex(belowElement);
                if ((draggedTileIndex + 1) === belowElemIndex) {
                    return;
                }
                this.activeDraggedGroup
                    .swapTiles(this.draggedTile, belowElement)
                    .setTilesDimensions(true, this.draggedTile);
                this.$timeout(function () {
                    _this.setGroupContainersHeight();
                }, 0);
            }
        };
        DraggableController.prototype.onDragEndListener = function () {
            this.draggedTile.stopDrag(this.isSameDropzone);
            this.$element.removeClass('drag-transfer');
            this.activeDraggedGroup = null;
            this.draggedTile = null;
        };
        DraggableController.prototype.getContainerOffset = function () {
            var containerRect = this.container.getBoundingClientRect();
            return {
                left: containerRect.left,
                top: containerRect.top
            };
        };
        DraggableController.prototype.setGroupContainersHeight = function () {
            this.tileGroups.forEach(function (tileGroup) {
                tileGroup.calcContainerHeight();
            });
        };
        DraggableController.prototype.moveTile = function (from, to, tile) {
            var elem;
            var movedTile = from.removeTile(tile);
            var tileScope = this.createTileScope(tile);
            $(this.groupsContainers[_.findIndex(this.tileGroups, from)])
                .find(movedTile.getElem())
                .remove();
            if (to !== null) {
                to.addTile(movedTile);
                elem = this.$compile(movedTile.getElem())(tileScope);
                $(this.groupsContainers[_.findIndex(this.tileGroups, to)])
                    .append(elem);
                this.$timeout(to.setTilesDimensions.bind(to, true));
            }
            this.updateTilesTemplates('moveTile', {
                from: from,
                to: to,
                tile: movedTile
            });
        };
        DraggableController.prototype.onDropListener = function (event) {
            var droppedGroupIndex = event.target.attributes['data-group-id'].value;
            var droppedGroup = this.tileGroups[droppedGroupIndex];
            if (this.activeDraggedGroup !== droppedGroup) {
                this.moveTile(this.activeDraggedGroup, droppedGroup, this.draggedTile);
            }
            this.updateTilesGroups(true);
            this.sourceDropZoneElem = null;
        };
        DraggableController.prototype.onDropToFictGroupListener = function (event) {
            var _this = this;
            var from = this.activeDraggedGroup;
            var tile = this.draggedTile;
            this.addGroup({
                title: 'New group',
                source: []
            });
            this.$timeout(function () {
                _this.moveTile(from, _this.tileGroups[_this.tileGroups.length - 1], tile);
                _this.updateTilesGroups(true);
            });
            this.sourceDropZoneElem = null;
        };
        DraggableController.prototype.onDropEnterListener = function (event) {
            if (!this.sourceDropZoneElem) {
                this.sourceDropZoneElem = event.dragEvent.dragEnter;
            }
            if (this.sourceDropZoneElem !== event.dragEvent.dragEnter) {
                event.dragEvent.dragEnter.classList.add('dropzone-active');
                $('body').css('cursor', 'copy');
                this.isSameDropzone = false;
            }
            else {
                $('body').css('cursor', '');
                this.isSameDropzone = true;
            }
        };
        DraggableController.prototype.onDropDeactivateListener = function (event) {
            if (this.sourceDropZoneElem !== event.target) {
                event.target.classList.remove(this.opts.activeDropzoneClass);
                $('body').css('cursor', '');
            }
        };
        DraggableController.prototype.onDropLeaveListener = function (event) {
            event.target.classList.remove(this.opts.activeDropzoneClass);
        };
        DraggableController.prototype.initialize = function () {
            var _this = this;
            this.$timeout(function () {
                _this.availableWidth = _this.getContainerWidth();
                _this.availableColumns = _this.getAvailableColumns(_this.availableWidth);
                _this.groupsContainers = document.querySelectorAll(_this.opts.groupContaninerSelector);
                _this.tileGroups = _this.initTilesGroups(_this.groups, _this.opts, _this.groupsContainers);
                interact('.pip-draggable-tile')
                    .draggable({
                    autoScroll: true,
                    onstart: function (event) {
                        _this.onDragStartListener(event);
                    },
                    onmove: function (event) {
                        _this.onDragMoveListener(event);
                    },
                    onend: function (event) {
                        _this.onDragEndListener();
                    }
                });
                interact('.pip-draggable-group.fict-group')
                    .dropzone({
                    ondrop: function (event) {
                        _this.onDropToFictGroupListener(event);
                    },
                    ondragenter: function (event) {
                        _this.onDropEnterListener(event);
                    },
                    ondropdeactivate: function (event) {
                        _this.onDropDeactivateListener(event);
                    },
                    ondragleave: function (event) {
                        _this.onDropLeaveListener(event);
                    }
                });
                interact('.pip-draggable-group')
                    .dropzone({
                    ondrop: function (event) {
                        _this.onDropListener(event);
                    },
                    ondragenter: function (event) {
                        _this.onDropEnterListener(event);
                    },
                    ondropdeactivate: function (event) {
                        _this.onDropDeactivateListener(event);
                    },
                    ondragleave: function (event) {
                        _this.onDropLeaveListener(event);
                    }
                });
                _this.$container
                    .on('mousedown touchstart', 'md-menu .md-icon-button', function () {
                    interact('.pip-draggable-tile').draggable(false);
                    $(_this).trigger('click');
                })
                    .on('mouseup touchend', function () {
                    interact('.pip-draggable-tile').draggable(true);
                });
            }, 0);
        };
        return DraggableController;
    }());
    var DragComponent = {
        bindings: {
            tilesTemplates: '=pipTilesTemplates',
            tilesContext: '=pipTilesContext',
            options: '=pipDraggableGrid',
            groupMenuActions: '=pipGroupMenuActions'
        },
        templateUrl: 'draggable/Draggable.html',
        controller: DraggableController
    };
    angular.module('pipDragged')
        .component('pipDraggableGrid', DragComponent);
}

},{"./DraggableTileService":10,"./draggable_group/DraggableTilesGroupService":12}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function IDragTileConstructor(constructor, options) {
    return new constructor(options);
}
exports.IDragTileConstructor = IDragTileConstructor;
var DEFAULT_TILE_SIZE = {
    colSpan: 1,
    rowSpan: 1
};
var DragTileService = (function () {
    function DragTileService(options) {
        this.tpl = options.tpl.get(0);
        this.opts = options;
        this.size = _.merge({}, DEFAULT_TILE_SIZE, options.size);
        this.elem = null;
    }
    DragTileService.prototype.getSize = function () {
        return this.size;
    };
    DragTileService.prototype.setSize = function (width, height) {
        this.size.width = width;
        this.size.height = height;
        if (this.elem) {
            this.elem.css({
                width: width,
                height: height
            });
        }
        return this;
    };
    DragTileService.prototype.setPosition = function (left, top) {
        this.size.left = left;
        this.size.top = top;
        if (this.elem) {
            this.elem.css({
                left: left,
                top: top
            });
        }
        return this;
    };
    DragTileService.prototype.getCompiledTemplate = function () {
        return this.tpl;
    };
    ;
    DragTileService.prototype.updateElem = function (parent) {
        this.elem = $(this.tpl).parent(parent);
        return this;
    };
    ;
    DragTileService.prototype.getElem = function () {
        return this.elem.get(0);
    };
    ;
    DragTileService.prototype.startDrag = function () {
        this.preview = $('<div>')
            .addClass('pip-dragged-preview')
            .css({
            position: 'absolute',
            left: this.elem.css('left'),
            top: this.elem.css('top'),
            width: this.elem.css('width'),
            height: this.elem.css('height')
        });
        this.elem
            .addClass('no-animation')
            .css({
            zIndex: '9999'
        })
            .after(this.preview);
        return this;
    };
    ;
    DragTileService.prototype.stopDrag = function (isAnimate) {
        var self = this;
        if (isAnimate) {
            this.elem
                .removeClass('no-animation')
                .css({
                left: this.preview.css('left'),
                top: this.preview.css('top')
            })
                .on('transitionend', onTransitionEnd);
        }
        else {
            self.elem
                .css({
                left: self.preview.css('left'),
                top: self.preview.css('top'),
                zIndex: ''
            })
                .removeClass('no-animation');
            self.preview.remove();
            self.preview = null;
        }
        return this;
        function onTransitionEnd() {
            if (self.preview) {
                self.preview.remove();
                self.preview = null;
            }
            self.elem
                .css('zIndex', '')
                .off('transitionend', onTransitionEnd);
        }
    };
    ;
    DragTileService.prototype.setPreviewPosition = function (coords) {
        this.preview.css(coords);
    };
    ;
    DragTileService.prototype.getOptions = function () {
        return this.opts.options;
    };
    ;
    DragTileService.prototype.setOptions = function (options) {
        _.merge(this.opts.options, options);
        _.merge(this.size, options.size);
        return this;
    };
    ;
    return DragTileService;
}());
exports.DragTileService = DragTileService;
angular
    .module('pipDragged')
    .service('pipDragTile', function () {
    return function (options) {
        var newTile = new DragTileService(options);
        return newTile;
    };
});

},{}],11:[function(require,module,exports){
{
    function DraggableTileLink($scope, $elem, $attr) {
        var docFrag = document.createDocumentFragment(), group = $scope.$eval($attr.pipDraggableTiles);
        group.forEach(function (tile) {
            var tpl = wrapComponent(tile.getCompiledTemplate());
            docFrag.appendChild(tpl);
        });
        $elem.append(docFrag);
        function wrapComponent(elem) {
            return $('<div>')
                .addClass('pip-draggable-tile')
                .append(elem)
                .get(0);
        }
    }
    function DraggableTile() {
        return {
            restrict: 'A',
            link: DraggableTileLink
        };
    }
    angular
        .module('pipDragged')
        .directive('pipDraggableTiles', DraggableTile);
}

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ITilesGridConstructor(constructor, tiles, options, columns, elem) {
    return new constructor(tiles, options, columns, elem);
}
exports.ITilesGridConstructor = ITilesGridConstructor;
var MOBILE_LAYOUT_COLUMNS = 2;
var TilesGridService = (function () {
    function TilesGridService(tiles, options, columns, elem) {
        this.gridCells = [];
        this.inline = false;
        this.tiles = tiles;
        this.opts = options;
        this.columns = columns || 0;
        this.elem = elem;
        this.gridCells = [];
        this.inline = options.inline || false;
        this.isMobileLayout = columns === MOBILE_LAYOUT_COLUMNS;
    }
    TilesGridService.prototype.addTile = function (tile) {
        this.tiles.push(tile);
        if (this.tiles.length === 1) {
            this.generateGrid();
        }
        return this;
    };
    ;
    TilesGridService.prototype.getCellByPosition = function (row, col) {
        return this.gridCells[row][col];
    };
    ;
    TilesGridService.prototype.getCells = function (prevCell, rowSpan, colSpan) {
        if (this.isMobileLayout) {
            return this.getAvailableCellsMobile(prevCell, rowSpan, colSpan);
        }
        else {
            return this.getAvailableCellsDesktop(prevCell, rowSpan, colSpan);
        }
    };
    ;
    TilesGridService.prototype.getAvailableCellsDesktop = function (prevCell, rowSpan, colSpan) {
        var leftCornerCell;
        var rightCornerCell;
        var basicCol = prevCell && prevCell.col || 0;
        var basicRow = this.getBasicRow(prevCell);
        if (colSpan === 1 && rowSpan === 1) {
            var gridCopy = this.gridCells.slice();
            if (!prevCell) {
                leftCornerCell = gridCopy[0][0];
            }
            else {
                leftCornerCell = this.getCell(gridCopy, basicRow, basicCol, this.columns);
                if (!leftCornerCell) {
                    var rowShift = this.isMobileLayout ? 1 : 2;
                    leftCornerCell = this.getCell(gridCopy, basicRow + rowShift, 0, this.columns);
                }
            }
        }
        if (colSpan === 2 && rowSpan === 1) {
            var prevTileSize = prevCell && prevCell.elem.size || null;
            if (!prevTileSize) {
                leftCornerCell = this.getCellByPosition(basicRow, basicCol);
                rightCornerCell = this.getCellByPosition(basicRow, basicCol + 1);
            }
            else if (prevTileSize.colSpan === 2 && prevTileSize.rowSpan === 2) {
                if (this.columns - basicCol - 2 > 0) {
                    leftCornerCell = this.getCellByPosition(basicRow, basicCol + 1);
                    rightCornerCell = this.getCellByPosition(basicRow, basicCol + 2);
                }
                else {
                    leftCornerCell = this.getCellByPosition(basicRow + 2, 0);
                    rightCornerCell = this.getCellByPosition(basicRow + 2, 1);
                }
            }
            else if (prevTileSize.colSpan === 2 && prevTileSize.rowSpan === 1) {
                if (prevCell.row % 2 === 0) {
                    leftCornerCell = this.getCellByPosition(basicRow + 1, basicCol - 1);
                    rightCornerCell = this.getCellByPosition(basicRow + 1, basicCol);
                }
                else {
                    if (this.columns - basicCol - 3 >= 0) {
                        leftCornerCell = this.getCellByPosition(basicRow, basicCol + 1);
                        rightCornerCell = this.getCellByPosition(basicRow, basicCol + 2);
                    }
                    else {
                        leftCornerCell = this.getCellByPosition(basicRow + 2, 0);
                        rightCornerCell = this.getCellByPosition(basicRow + 2, 1);
                    }
                }
            }
            else if (prevTileSize.colSpan === 1 && prevTileSize.rowSpan === 1) {
                if (this.columns - basicCol - 3 >= 0) {
                    if (this.isCellFree(basicRow, basicCol + 1)) {
                        leftCornerCell = this.getCellByPosition(basicRow, basicCol + 1);
                        rightCornerCell = this.getCellByPosition(basicRow, basicCol + 2);
                    }
                    else {
                        leftCornerCell = this.getCellByPosition(basicRow, basicCol + 2);
                        rightCornerCell = this.getCellByPosition(basicRow, basicCol + 3);
                    }
                }
                else {
                    leftCornerCell = this.getCellByPosition(basicRow + 2, 0);
                    rightCornerCell = this.getCellByPosition(basicRow + 2, 1);
                }
            }
        }
        if (!prevCell && rowSpan === 2 && colSpan === 2) {
            leftCornerCell = this.getCellByPosition(basicRow, basicCol);
            rightCornerCell = this.getCellByPosition(basicRow + 1, basicCol + 1);
        }
        else if (rowSpan === 2 && colSpan === 2) {
            if (this.columns - basicCol - 2 > 0) {
                if (this.isCellFree(basicRow, basicCol + 1)) {
                    leftCornerCell = this.getCellByPosition(basicRow, basicCol + 1);
                    rightCornerCell = this.getCellByPosition(basicRow + 1, basicCol + 2);
                }
                else {
                    leftCornerCell = this.getCellByPosition(basicRow, basicCol + 2);
                    rightCornerCell = this.getCellByPosition(basicRow + 1, basicCol + 3);
                }
            }
            else {
                leftCornerCell = this.getCellByPosition(basicRow + 2, 0);
                rightCornerCell = this.getCellByPosition(basicRow + 3, 1);
            }
        }
        return {
            start: leftCornerCell,
            end: rightCornerCell
        };
    };
    ;
    TilesGridService.prototype.getCell = function (src, basicRow, basicCol, columns) {
        var cell, col, row;
        if (this.isMobileLayout) {
            for (col = basicCol; col < columns; col++) {
                if (!src[basicRow][col].elem) {
                    cell = src[basicRow][col];
                    break;
                }
            }
            return cell;
        }
        for (col = basicCol; col < columns; col++) {
            for (row = 0; row < 2; row++) {
                if (!src[row + basicRow][col].elem) {
                    cell = src[row + basicRow][col];
                    break;
                }
            }
            if (cell) {
                return cell;
            }
        }
    };
    ;
    TilesGridService.prototype.getAvailableCellsMobile = function (prevCell, rowSpan, colSpan) {
        var leftCornerCell;
        var rightCornerCell;
        var basicRow = this.getBasicRow(prevCell);
        var basicCol = prevCell && prevCell.col || 0;
        if (colSpan === 1 && rowSpan === 1) {
            var gridCopy = this.gridCells.slice();
            if (!prevCell) {
                leftCornerCell = gridCopy[0][0];
            }
            else {
                leftCornerCell = this.getCell(gridCopy, basicRow, basicCol, this.columns);
                if (!leftCornerCell) {
                    var rowShift = this.isMobileLayout ? 1 : 2;
                    leftCornerCell = this.getCell(gridCopy, basicRow + rowShift, 0, this.columns);
                }
            }
        }
        if (!prevCell) {
            leftCornerCell = this.getCellByPosition(basicRow, 0);
            rightCornerCell = this.getCellByPosition(basicRow + rowSpan - 1, 1);
        }
        else if (colSpan === 2) {
            leftCornerCell = this.getCellByPosition(basicRow + 1, 0);
            rightCornerCell = this.getCellByPosition(basicRow + rowSpan, 1);
        }
        return {
            start: leftCornerCell,
            end: rightCornerCell
        };
    };
    ;
    TilesGridService.prototype.getBasicRow = function (prevCell) {
        var basicRow;
        if (this.isMobileLayout) {
            if (prevCell) {
                basicRow = prevCell && prevCell.row || 0;
            }
            else {
                basicRow = 0;
            }
        }
        else {
            if (prevCell) {
                basicRow = prevCell.row % 2 === 0 ? prevCell.row : prevCell.row - 1;
            }
            else {
                basicRow = 0;
            }
        }
        return basicRow;
    };
    ;
    TilesGridService.prototype.isCellFree = function (row, col) {
        return !this.gridCells[row][col].elem;
    };
    ;
    TilesGridService.prototype.getCellIndex = function (srcCell) {
        var self = this;
        var index;
        this.gridCells.forEach(function (row, rowIndex) {
            index = _.findIndex(self.gridCells[rowIndex], function (cell) {
                return cell === srcCell;
            });
            if (index !== -1) {
                return;
            }
        });
        return index !== -1 ? index : 0;
    };
    ;
    TilesGridService.prototype.reserveCells = function (start, end, elem) {
        this.gridCells.forEach(function (row) {
            row.forEach(function (cell) {
                if (cell.row >= start.row && cell.row <= end.row &&
                    cell.col >= start.col && cell.col <= end.col) {
                    cell.elem = elem;
                }
            });
        });
    };
    ;
    TilesGridService.prototype.clearElements = function () {
        this.gridCells.forEach(function (row) {
            row.forEach(function (tile) {
                tile.elem = null;
            });
        });
    };
    ;
    TilesGridService.prototype.setAvailableColumns = function (columns) {
        this.isMobileLayout = columns === MOBILE_LAYOUT_COLUMNS;
        this.columns = columns;
        return this;
    };
    ;
    TilesGridService.prototype.generateGrid = function (singleTileWidth) {
        var self = this, tileWidth = singleTileWidth || this.opts.tileWidth, offset = document.querySelector('.pip-draggable-group-title').getBoundingClientRect();
        var colsInRow = 0, rows = 0, gridInRow = [];
        this.gridCells = [];
        this.tiles.forEach(function (tile, index, srcTiles) {
            var tileSize = tile.getSize();
            generateCells(tileSize.colSpan);
            if (srcTiles.length === index + 1) {
                if (colsInRow < self.columns) {
                    generateCells(self.columns - colsInRow);
                }
                if (self.tiles.length * 2 > self.gridCells.length) {
                    Array.apply(null, Array(self.tiles.length * 2 - self.gridCells.length)).forEach(function () {
                        generateCells(self.columns);
                    });
                }
            }
        });
        function generateCells(newCellCount) {
            Array.apply(null, Array(newCellCount)).forEach(function () {
                if (self.columns < colsInRow + 1) {
                    rows++;
                    colsInRow = 0;
                    self.gridCells.push(gridInRow);
                    gridInRow = [];
                }
                var top = rows * self.opts.tileHeight + (rows ? rows * self.opts.gutter : 0) + offset.height;
                var left = colsInRow * tileWidth + (colsInRow ? colsInRow * self.opts.gutter : 0);
                gridInRow.push({
                    top: top,
                    left: left,
                    bottom: top + self.opts.tileHeight,
                    right: left + tileWidth,
                    row: rows,
                    col: colsInRow
                });
                colsInRow++;
            });
        }
        return this;
    };
    ;
    TilesGridService.prototype.setTilesDimensions = function (onlyPosition, draggedTile) {
        var self = this;
        var currIndex = 0;
        var prevCell;
        if (onlyPosition) {
            self.clearElements();
        }
        this.tiles.forEach(function (tile) {
            var tileSize = tile.getSize();
            var startCell;
            var width;
            var height;
            var cells;
            tile.updateElem('.pip-draggable-tile');
            if (tileSize.colSpan === 1) {
                if (prevCell && prevCell.elem.size.colSpan === 2 && prevCell.elem.size.rowSpan === 1) {
                    startCell = self.getCells(self.getCellByPosition(prevCell.row, prevCell.col - 1), 1, 1).start;
                }
                else {
                    startCell = self.getCells(prevCell, 1, 1).start;
                }
                if (!onlyPosition) {
                    width = startCell.right - startCell.left;
                    height = startCell.bottom - startCell.top;
                }
                prevCell = startCell;
                self.reserveCells(startCell, startCell, tile);
                currIndex++;
            }
            else if (tileSize.colSpan === 2) {
                cells = self.getCells(prevCell, tileSize.rowSpan, tileSize.colSpan);
                startCell = cells.start;
                if (!onlyPosition) {
                    width = cells.end.right - cells.start.left;
                    height = cells.end.bottom - cells.start.top;
                }
                prevCell = cells.end;
                self.reserveCells(cells.start, cells.end, tile);
                currIndex += 2;
            }
            if (draggedTile === tile) {
                tile.setPreviewPosition({
                    left: startCell.left,
                    top: startCell.top
                });
                return;
            }
            if (!onlyPosition) {
                tile.setSize(width, height);
            }
            tile.setPosition(startCell.left, startCell.top);
        });
        return this;
    };
    ;
    TilesGridService.prototype.calcContainerHeight = function () {
        var maxHeightSize, maxWidthSize;
        if (!this.tiles.length) {
            return this;
        }
        maxHeightSize = _.maxBy(this.tiles, function (tile) {
            var tileSize = tile['getSize']();
            return tileSize.top + tileSize.height;
        })['getSize']();
        this.elem.style.height = maxHeightSize.top + maxHeightSize.height + 'px';
        if (this.inline) {
            maxWidthSize = _.maxBy(this.tiles, function (tile) {
                var tileSize = tile['getSize']();
                return tileSize.left + tileSize.width;
            })['getSize']();
            this.elem.style.width = maxWidthSize.left + maxWidthSize.width + 'px';
        }
        return this;
    };
    ;
    TilesGridService.prototype.getTileByNode = function (node) {
        var foundTile = this.tiles.filter(function (tile) {
            return node === tile.getElem();
        });
        return foundTile.length ? foundTile[0] : null;
    };
    ;
    TilesGridService.prototype.getTileByCoordinates = function (coords, draggedTile) {
        return this.tiles
            .filter(function (tile) {
            var tileSize = tile.getSize();
            return tile !== draggedTile &&
                tileSize.left <= coords.left && coords.left <= (tileSize.left + tileSize.width) &&
                tileSize.top <= coords.top && coords.top <= (tileSize.top + tileSize.height);
        })[0] || null;
    };
    ;
    TilesGridService.prototype.getTileIndex = function (tile) {
        return _.findIndex(this.tiles, tile);
    };
    ;
    TilesGridService.prototype.swapTiles = function (movedTile, beforeTile) {
        var movedTileIndex = _.findIndex(this.tiles, movedTile);
        var beforeTileIndex = _.findIndex(this.tiles, beforeTile);
        this.tiles.splice(movedTileIndex, 1);
        this.tiles.splice(beforeTileIndex, 0, movedTile);
        return this;
    };
    ;
    TilesGridService.prototype.removeTile = function (removeTile) {
        var droppedTile;
        this.tiles.forEach(function (tile, index, tiles) {
            if (tile === removeTile) {
                droppedTile = tiles.splice(index, 1)[0];
                return false;
            }
        });
        return droppedTile;
    };
    ;
    TilesGridService.prototype.updateTileOptions = function (opts) {
        var index = _.findIndex(this.tiles, function (tile) {
            return tile['getOptions']() === opts;
        });
        if (index !== -1) {
            this.tiles[index].setOptions(opts);
            return true;
        }
        return false;
    };
    ;
    return TilesGridService;
}());
exports.TilesGridService = TilesGridService;
angular
    .module('pipDragged')
    .service('pipTilesGrid', function () {
    return function (tiles, options, columns, elem) {
        var newGrid = new TilesGridService(tiles, options, columns, elem);
        return newGrid;
    };
});

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
{
    var widgetTemplateService = (function () {
        widgetTemplateService.$inject = ['$interpolate', '$compile', '$templateRequest'];
        function widgetTemplateService($interpolate, $compile, $templateRequest) {
            this._$interpolate = $interpolate;
            this._$compile = $compile;
            this._$templateRequest = $templateRequest;
        }
        widgetTemplateService.prototype.getTemplate = function (source, tpl, tileScope, strictCompile) {
            var _this = this;
            var template = source.template, templateUrl = source.templateUrl, type = source.type;
            var result;
            if (type) {
                var interpolated = tpl ? this._$interpolate(tpl)(source) : this._$interpolate(template)(source);
                return strictCompile == true ?
                    (tileScope ? this._$compile(interpolated)(tileScope) : this._$compile(interpolated)) :
                    interpolated;
            }
            if (template) {
                return tileScope ? this._$compile(template)(tileScope) : this._$compile(template);
            }
            if (templateUrl) {
                this._$templateRequest(templateUrl, false).then(function (html) {
                    result = tileScope ? _this._$compile(html)(tileScope) : _this._$compile(html);
                });
            }
            return result;
        };
        widgetTemplateService.prototype.setImageMarginCSS = function ($element, image) {
            var containerWidth = $element.width ? $element.width() : $element.clientWidth, containerHeight = $element.height ? $element.height() : $element.clientHeight, imageWidth = (image[0] ? image[0].naturalWidth : image.naturalWidth) || image.width, imageHeight = (image[0] ? image[0].naturalHeight : image.naturalWidth) || image.height, margin = 0, cssParams = {};
            if ((imageWidth / containerWidth) > (imageHeight / containerHeight)) {
                margin = -((imageWidth / imageHeight * containerHeight - containerWidth) / 2);
                cssParams['margin-left'] = '' + margin + 'px';
                cssParams['height'] = '' + containerHeight + 'px';
                cssParams['width'] = '' + imageWidth * containerHeight / imageHeight + 'px';
                cssParams['margin-top'] = '';
            }
            else {
                margin = -((imageHeight / imageWidth * containerWidth - containerHeight) / 2);
                cssParams['margin-top'] = '' + margin + 'px';
                cssParams['height'] = '' + imageHeight * containerWidth / imageWidth + 'px';
                cssParams['width'] = '' + containerWidth + 'px';
                cssParams['margin-left'] = '';
            }
            $(image).css(cssParams);
        };
        return widgetTemplateService;
    }());
    var ImageLoad = function ImageLoad($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var callback = $parse(attrs.pipImageLoad);
                element.bind('load', function (event) {
                    callback(scope, {
                        $event: event
                    });
                });
            }
        };
    };
    ImageLoad.$inject = ['$parse'];
    angular
        .module('pipDashboard')
        .service('pipWidgetTemplate', widgetTemplateService)
        .directive('pipImageLoad', ImageLoad);
}

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DashboardWidget = (function () {
    function DashboardWidget() {
    }
    return DashboardWidget;
}());
exports.DashboardWidget = DashboardWidget;

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipWidget', []);
require("./calendar/WidgetCalendar");
require("./event/WidgetEvent");
require("./menu/WidgetMenuService");
require("./menu/WidgetMenuDirective");
require("./notes/WidgetNotes");
require("./position/WidgetPosition");
require("./statistics/WidgetStatistics");
require("./picture_slider/WidgetPictureSlider");

},{"./calendar/WidgetCalendar":16,"./event/WidgetEvent":17,"./menu/WidgetMenuDirective":18,"./menu/WidgetMenuService":19,"./notes/WidgetNotes":20,"./picture_slider/WidgetPictureSlider":21,"./position/WidgetPosition":22,"./statistics/WidgetStatistics":23}],16:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var WidgetMenuService_1 = require("../menu/WidgetMenuService");
{
    var CalendarWidgetController = (function (_super) {
        __extends(CalendarWidgetController, _super);
        function CalendarWidgetController(pipWidgetConfigDialogService) {
            var _this = _super.call(this) || this;
            _this.pipWidgetConfigDialogService = pipWidgetConfigDialogService;
            if (_this.options) {
                _this.menu = _this.options.menu ? _.union(_this.menu, _this.options.menu) : _this.menu;
                _this.menu.push({
                    title: 'Configurate',
                    click: function () {
                        _this.onConfigClick();
                    }
                });
                _this.options.date = _this.options.date || new Date();
                _this.color = _this.options.color || 'blue';
            }
            return _this;
        }
        CalendarWidgetController.prototype.onConfigClick = function () {
            var _this = this;
            this.pipWidgetConfigDialogService.show({
                dialogClass: 'pip-calendar-config',
                locals: {
                    color: this.color,
                    size: this.options.size,
                    date: this.options.date,
                },
                extensionUrl: 'widgets/calendar/ConfigDialogExtension.html'
            }, function (result) {
                _this.changeSize(result.size);
                _this.color = result.color;
                _this.options.color = result.color;
                _this.options.date = result.date;
            });
        };
        return CalendarWidgetController;
    }(WidgetMenuService_1.MenuWidgetService));
    var CalendarWidget = {
        bindings: {
            options: '=pipOptions',
        },
        controller: CalendarWidgetController,
        templateUrl: 'widgets/calendar/WidgetCalendar.html'
    };
    angular
        .module('pipWidget')
        .component('pipCalendarWidget', CalendarWidget);
}

},{"../menu/WidgetMenuService":19}],17:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var WidgetMenuService_1 = require("../menu/WidgetMenuService");
{
    var EventWidgetController = (function (_super) {
        __extends(EventWidgetController, _super);
        function EventWidgetController($scope, $element, $timeout, pipWidgetConfigDialogService) {
            var _this = _super.call(this) || this;
            _this.$element = $element;
            _this.$timeout = $timeout;
            _this.pipWidgetConfigDialogService = pipWidgetConfigDialogService;
            _this.opacity = 0.57;
            if (_this.options) {
                if (_this.options.menu)
                    _this.menu = _.union(_this.menu, _this.options.menu);
            }
            _this.menu.push({
                title: 'Configurate',
                click: function () {
                    _this.onConfigClick();
                }
            });
            _this.color = _this.options.color || 'gray';
            _this.opacity = _this.options.opacity || _this.opacity;
            _this.drawImage();
            $scope.$watch(function () {
                return $element.is(':visible');
            }, function (newVal) {
                _this.drawImage();
            });
            return _this;
        }
        EventWidgetController.prototype.drawImage = function () {
            var _this = this;
            if (this.options.image) {
                this.$timeout(function () {
                    _this.onImageLoad(_this.$element.find('img'));
                }, 500);
            }
        };
        EventWidgetController.prototype.onConfigClick = function () {
            var _this = this;
            this._oldOpacity = _.clone(this.opacity);
            this.pipWidgetConfigDialogService.show({
                dialogClass: 'pip-calendar-config',
                locals: {
                    color: this.color,
                    size: this.options.size || {
                        colSpan: 1,
                        rowSpan: 1
                    },
                    date: this.options.date,
                    title: this.options.title,
                    text: this.options.text,
                    opacity: this.opacity,
                    onOpacitytest: function (opacity) {
                        _this.opacity = opacity;
                    }
                },
                extensionUrl: 'widgets/event/ConfigDialogExtension.html'
            }, function (result) {
                _this.changeSize(result.size);
                _this.color = result.color;
                _this.options.color = result.color;
                _this.options.date = result.date;
                _this.options.title = result.title;
                _this.options.text = result.text;
                _this.options.opacity = result.opacity;
            }, function () {
                _this.opacity = _this._oldOpacity;
            });
        };
        EventWidgetController.prototype.onImageLoad = function (image) {
            this.setImageMarginCSS(this.$element.parent(), image);
        };
        EventWidgetController.prototype.changeSize = function (params) {
            var _this = this;
            this.options.size.colSpan = params.sizeX;
            this.options.size.rowSpan = params.sizeY;
            if (this.options.image) {
                this.$timeout(function () {
                    _this.setImageMarginCSS(_this.$element.parent(), _this.$element.find('img'));
                }, 500);
            }
        };
        EventWidgetController.prototype.setImageMarginCSS = function ($element, image) {
            var containerWidth = $element.width ? $element.width() : $element.clientWidth, containerHeight = $element.height ? $element.height() : $element.clientHeight, imageWidth = image[0].naturalWidth || image.width, imageHeight = image[0].naturalHeight || image.height, margin = 0, cssParams = {};
            if ((imageWidth / containerWidth) > (imageHeight / containerHeight)) {
                margin = -((imageWidth / imageHeight * containerHeight - containerWidth) / 2);
                cssParams['margin-left'] = '' + margin + 'px';
                cssParams['height'] = '' + containerHeight + 'px';
                cssParams['width'] = '' + imageWidth * containerHeight / imageHeight + 'px';
                cssParams['margin-top'] = '';
            }
            else {
                margin = -((imageHeight / imageWidth * containerWidth - containerHeight) / 2);
                cssParams['margin-top'] = '' + margin + 'px';
                cssParams['height'] = '' + imageHeight * containerWidth / imageWidth + 'px';
                cssParams['width'] = '' + containerWidth + 'px';
                cssParams['margin-left'] = '';
            }
            image.css(cssParams);
        };
        return EventWidgetController;
    }(WidgetMenuService_1.MenuWidgetService));
    var EventWidget = {
        bindings: {
            options: '=pipOptions'
        },
        controller: EventWidgetController,
        templateUrl: 'widgets/event/WidgetEvent.html'
    };
    angular
        .module('pipWidget')
        .component('pipEventWidget', EventWidget);
}

},{"../menu/WidgetMenuService":19}],18:[function(require,module,exports){
(function () {
    'use strict';
    angular
        .module('pipWidget')
        .directive('pipMenuWidget', pipMenuWidget);
    function pipMenuWidget() {
        return {
            restrict: 'EA',
            templateUrl: 'widgets/menu/WidgetMenu.html'
        };
    }
})();

},{}],19:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var WidgetClass_1 = require("../WidgetClass");
var MenuWidgetService = (function (_super) {
    __extends(MenuWidgetService, _super);
    function MenuWidgetService() {
        "ngInject";
        var _this = _super.call(this) || this;
        _this.menu = [{
                title: 'Change Size',
                action: angular.noop,
                submenu: [{
                        title: '1 x 1',
                        action: 'changeSize',
                        params: {
                            sizeX: 1,
                            sizeY: 1
                        }
                    },
                    {
                        title: '2 x 1',
                        action: 'changeSize',
                        params: {
                            sizeX: 2,
                            sizeY: 1
                        }
                    },
                    {
                        title: '2 x 2',
                        action: 'changeSize',
                        params: {
                            sizeX: 2,
                            sizeY: 2
                        }
                    }
                ]
            }];
        return _this;
    }
    MenuWidgetService.prototype.callAction = function (actionName, params, item) {
        if (this[actionName]) {
            this[actionName].call(this, params);
        }
        if (item['click']) {
            item['click'].call(item, params, this);
        }
    };
    ;
    MenuWidgetService.prototype.changeSize = function (params) {
        this.options.size.colSpan = params.sizeX;
        this.options.size.rowSpan = params.sizeY;
    };
    ;
    return MenuWidgetService;
}(WidgetClass_1.DashboardWidget));
exports.MenuWidgetService = MenuWidgetService;
{
    var MenuWidgetProvider = (function () {
        function MenuWidgetProvider() {
        }
        MenuWidgetProvider.prototype.$get = function () {
            "ngInject";
            if (this._service == null)
                this._service = new MenuWidgetService();
            return this._service;
        };
        return MenuWidgetProvider;
    }());
    angular
        .module('pipWidget')
        .provider('pipWidgetMenu', MenuWidgetProvider);
}

},{"../WidgetClass":14}],20:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var WidgetMenuService_1 = require("../menu/WidgetMenuService");
{
    var NotesWidgetController = (function (_super) {
        __extends(NotesWidgetController, _super);
        function NotesWidgetController(pipWidgetConfigDialogService) {
            var _this = _super.call(this) || this;
            _this.pipWidgetConfigDialogService = pipWidgetConfigDialogService;
            if (_this.options) {
                _this.menu = _this.options.menu ? _.union(_this.menu, _this.options.menu) : _this.menu;
            }
            _this.menu.push({
                title: 'Configurate',
                click: function () {
                    _this.onConfigClick();
                }
            });
            _this.color = _this.options.color || 'orange';
            return _this;
        }
        NotesWidgetController.prototype.onConfigClick = function () {
            var _this = this;
            this.pipWidgetConfigDialogService.show({
                dialogClass: 'pip-calendar-config',
                locals: {
                    color: this.color,
                    size: this.options.size,
                    title: this.options.title,
                    text: this.options.text,
                },
                extensionUrl: 'widgets/notes/ConfigDialogExtension.html'
            }, function (result) {
                _this.color = result.color;
                _this.options.color = result.color;
                _this.changeSize(result.size);
                _this.options.text = result.text;
                _this.options.title = result.title;
            });
        };
        return NotesWidgetController;
    }(WidgetMenuService_1.MenuWidgetService));
    var NotesWidget = {
        bindings: {
            options: '=pipOptions'
        },
        controller: NotesWidgetController,
        templateUrl: 'widgets/notes/WidgetNotes.html'
    };
    angular
        .module('pipWidget')
        .component('pipNotesWidget', NotesWidget);
}

},{"../menu/WidgetMenuService":19}],21:[function(require,module,exports){
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var WidgetMenuService_1 = require("../menu/WidgetMenuService");
{
    var PictureSliderController = (function (_super) {
        __extends(PictureSliderController, _super);
        function PictureSliderController($scope, $element, $timeout, pipWidgetConfigDialogService, pipWidgetTemplate) {
            var _this = _super.call(this) || this;
            _this.$scope = $scope;
            _this.$element = $element;
            _this.$timeout = $timeout;
            _this.pipWidgetConfigDialogService = pipWidgetConfigDialogService;
            _this.pipWidgetTemplate = pipWidgetTemplate;
            _this.animationType = 'fading';
            _this.animationInterval = 5000;
            if (_this.options) {
                _this.animationType = _this.options.animationType || _this.animationType;
                _this.animationInterval = _this.options.animationInterval || _this.animationInterval;
            }
            return _this;
        }
        PictureSliderController.prototype.onImageLoad = function ($event) {
            var _this = this;
            this.$timeout(function () {
                _this.pipWidgetTemplate.setImageMarginCSS(_this.$element.parent(), $event.target);
            });
        };
        PictureSliderController.prototype.changeSize = function (params) {
            var _this = this;
            this.options.size.colSpan = params.sizeX;
            this.options.size.rowSpan = params.sizeY;
            this.$timeout(function () {
                _.each(_this.$element.find('img'), function (image) {
                    _this.pipWidgetTemplate.setImageMarginCSS(_this.$element.parent(), image);
                });
            }, 500);
        };
        return PictureSliderController;
    }(WidgetMenuService_1.MenuWidgetService));
    var PictureSliderWidget = {
        bindings: {
            options: '=pipOptions'
        },
        controller: PictureSliderController,
        templateUrl: 'widgets/picture_slider/WidgetPictureSlider.html'
    };
    angular
        .module('pipWidget')
        .component('pipPictureSliderWidget', PictureSliderWidget);
}

},{"../menu/WidgetMenuService":19}],22:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var WidgetMenuService_1 = require("../menu/WidgetMenuService");
{
    var PositionWidgetController = (function (_super) {
        __extends(PositionWidgetController, _super);
        function PositionWidgetController($scope, $timeout, $element, pipWidgetConfigDialogService, pipLocationEditDialog) {
            var _this = _super.call(this) || this;
            _this.$timeout = $timeout;
            _this.$element = $element;
            _this.pipWidgetConfigDialogService = pipWidgetConfigDialogService;
            _this.pipLocationEditDialog = pipLocationEditDialog;
            _this.showPosition = true;
            if (_this.options) {
                if (_this.options.menu)
                    _this.menu = _.union(_this.menu, _this.options.menu);
            }
            _this.menu.push({
                title: 'Configurate',
                click: function () {
                    _this.onConfigClick();
                }
            });
            _this.menu.push({
                title: 'Change location',
                click: function () {
                    _this.openLocationEditDialog();
                }
            });
            _this.options.location = _this.options.location || _this.options.position;
            $scope.$watch('widgetCtrl.options.location', function () {
                _this.reDrawPosition();
            });
            $scope.$watch(function () {
                return $element.is(':visible');
            }, function (newVal) {
                if (newVal == true)
                    _this.reDrawPosition();
            });
            return _this;
        }
        PositionWidgetController.prototype.onConfigClick = function () {
            var _this = this;
            this.pipWidgetConfigDialogService.show({
                dialogClass: 'pip-position-config',
                locals: {
                    size: this.options.size,
                    locationName: this.options.locationName,
                    hideColors: true,
                },
                extensionUrl: 'widgets/position/ConfigDialogExtension.html'
            }, function (result) {
                _this.changeSize(result.size);
                _this.options.locationName = result.locationName;
            });
        };
        PositionWidgetController.prototype.changeSize = function (params) {
            this.options.size.colSpan = params.sizeX;
            this.options.size.rowSpan = params.sizeY;
            this.reDrawPosition();
        };
        PositionWidgetController.prototype.openLocationEditDialog = function () {
            var _this = this;
            this.pipLocationEditDialog.show({
                locationName: this.options.locationName,
                locationPos: this.options.location
            }, function (newPosition) {
                if (newPosition) {
                    _this.options.location = newPosition.location;
                    _this.options.locationName = newPosition.locatioName;
                }
            });
        };
        PositionWidgetController.prototype.reDrawPosition = function () {
            var _this = this;
            this.showPosition = false;
            this.$timeout(function () {
                _this.showPosition = true;
            }, 50);
        };
        return PositionWidgetController;
    }(WidgetMenuService_1.MenuWidgetService));
    var PositionWidget = {
        bindings: {
            options: '=pipOptions',
            index: '=',
            group: '='
        },
        controller: PositionWidgetController,
        templateUrl: 'widgets/position/WidgetPosition.html'
    };
    angular
        .module('pipWidget')
        .component('pipPositionWidget', PositionWidget);
}

},{"../menu/WidgetMenuService":19}],23:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var WidgetMenuService_1 = require("../menu/WidgetMenuService");
{
    var SMALL_CHART_1 = 70;
    var BIG_CHART_1 = 250;
    var StatisticsWidgetController = (function (_super) {
        __extends(StatisticsWidgetController, _super);
        function StatisticsWidgetController(pipWidgetMenu, $scope, $timeout) {
            var _this = _super.call(this) || this;
            _this.reset = false;
            _this.chartSize = SMALL_CHART_1;
            _this._$scope = $scope;
            _this._$timeout = $timeout;
            if (_this.options) {
                _this.menu = _this.options.menu ? _.union(_this.menu, _this.options.menu) : _this.menu;
            }
            _this.setChartSize();
            return _this;
        }
        StatisticsWidgetController.prototype.changeSize = function (params) {
            var _this = this;
            this.options.size.colSpan = params.sizeX;
            this.options.size.rowSpan = params.sizeY;
            this.reset = true;
            this.setChartSize();
            this._$timeout(function () {
                _this.reset = false;
            }, 500);
        };
        StatisticsWidgetController.prototype.setChartSize = function () {
            this.chartSize = this.options.size.colSpan == 2 && this.options.size.rowSpan == 2 ? BIG_CHART_1 : SMALL_CHART_1;
        };
        return StatisticsWidgetController;
    }(WidgetMenuService_1.MenuWidgetService));
    var StatisticsWidget = {
        bindings: {
            options: '=pipOptions'
        },
        controller: StatisticsWidgetController,
        templateUrl: 'widgets/statistics/WidgetStatistics.html'
    };
    angular
        .module('pipWidget')
        .component('pipStatisticsWidget', StatisticsWidget);
}

},{"../menu/WidgetMenuService":19}],24:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('Dashboard.html',
    '<md-button class="md-accent md-raised md-fab layout-column layout-align-center-center" aria-label="Add component" ng-click="$ctrl.addComponent()"><md-icon md-svg-icon="icons:plus" class="md-headline centered-add-icon"></md-icon></md-button><div class="pip-draggable-grid-holder"><pip-draggable-grid pip-tiles-templates="$ctrl.groupedWidgets" pip-tiles-context="$ctrl.widgetsContext" pip-draggable-grid="$ctrl.draggableGridOptions" pip-group-menu-actions="$ctrl.groupMenuActions"></pip-draggable-grid><md-progress-circular md-mode="indeterminate" class="progress-ring"></md-progress-circular></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('draggable/Draggable.html',
    '<div class="pip-draggable-holder"><div class="pip-draggable-group" ng-repeat="group in $ctrl.groups" data-group-id="{{ $index }}" pip-draggable-tiles="group.source"><div class="pip-draggable-group-title layout-row layout-align-start-center"><div class="title-input-container" ng-click="$ctrl.onTitleClick(group, $event)"><input ng-if="group.editingName" ng-blur="$ctrl.onBlurTitleInput(group)" ng-keypress="$ctrl.onKyepressTitleInput(group, $event)" ng-model="group.title"><div class="text-overflow flex-none" ng-if="!group.editingName">{{ group.title }}</div></div><md-button class="md-icon-button flex-none layout-align-center-center" ng-show="group.editingName" ng-click="$ctrl.cancelEditing(group)" aria-label="Cancel"><md-icon md-svg-icon="icons:cross"></md-icon></md-button><md-menu class="flex-none layout-column" md-position-mode="target-right target" ng-show="!group.editingName"><md-button class="md-icon-button flex-none layout-align-center-center" ng-click="$mdOpenMenu(); groupId = $index" aria-label="Menu"><md-icon md-svg-icon="icons:dots"></md-icon></md-button><md-menu-content width="4"><md-menu-item ng-repeat="action in $ctrl.groupMenuActions"><md-button ng-click="action.callback(groupId)">{{ action.title }}</md-button></md-menu-item></md-menu-content></md-menu></div></div><div class="pip-draggable-group fict-group layout-align-center-center layout-column tm16"><div class="fict-group-text-container"><md-icon md-svg-icon="icons:plus"></md-icon>{{ \'DROP_TO_CREATE_NEW_GROUP\' | translate }}</div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('dialogs/add_component/AddComponent.html',
    '<md-dialog class="pip-dialog pip-add-component-dialog"><md-dialog-content class="layout-column"><div class="theme-divider p16 flex-auto"><h3 class="hide-xs m0 bm16 theme-text-primary" hide-xs="">{{ \'DASHBOARD_ADD_COMPONENT_DIALOG_TITLE\' | translate }}<md-input-container class="layout-row flex-auto m0 tm16"><md-select class="flex-auto m0 theme-text-primary" ng-model="dialogCtrl.activeGroupIndex" placeholder="{{ \'DASHBOARD_ADD_COMPONENT_DIALOG_CREATE_NEW_GROUP\' | translate }}" aria-label="Group"><md-option ng-value="$index" ng-repeat="group in dialogCtrl.groups">{{ group }}</md-option></md-select></md-input-container></h3></div><div class="pip-body pip-scroll p0 flex-auto"><p class="md-body-1 theme-text-secondary m0 lp16 rp16">{{ \'DASHBOARD_ADD_COMPONENT_DIALOG_USE_HOT_KEYS\' | translate }}</p><md-list ng-init="groupIndex = $index" ng-repeat="group in dialogCtrl.defaultWidgets"><md-list-item class="layout-row pip-list-item lp16 rp16" ng-repeat="item in group"><div class="icon-holder flex-none"><md-icon md-svg-icon="icons:{{:: item.icon }}"></md-icon><div class="pip-badge theme-badge md-warn" ng-if="item.amount"><span>{{ item.amount }}</span></div></div><span class="flex-auto lm24 theme-text-primary">{{:: item.title }}</span><md-button class="md-icon-button flex-none" ng-click="dialogCtrl.encrease(groupIndex, $index)" aria-label="Encrease"><md-icon md-svg-icon="icons:plus-circle"></md-icon></md-button><md-button class="md-icon-button flex-none" ng-click="dialogCtrl.decrease(groupIndex, $index)" aria-label="Decrease"><md-icon md-svg-icon="icons:minus-circle"></md-icon></md-button></md-list-item><md-divider class="lm72 tm8 bm8" ng-if="groupIndex !== (dialogCtrl.defaultWidgets.length - 1)"></md-divider></md-list></div></md-dialog-content><md-dialog-actions class="flex-none layout-align-end-center theme-divider divider-top theme-text-primary"><md-button ng-click="dialogCtrl.cancel()" aria-label="Cancel">{{ \'CANCEL\' | translate }}</md-button><md-button ng-click="dialogCtrl.add()" ng-disabled="dialogCtrl.totalWidgets === 0" arial-label="Add">{{ \'ADD\' | translate }}</md-button></md-dialog-actions></md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('dialogs/widget_config/ConfigDialog.html',
    '<md-dialog class="pip-dialog pip-widget-config-dialog {{ vm.params.dialogClass }}" width="400" md-theme="{{vm.theme}}"><pip-widget-config-extend-component class="layout-column" pip-dialog-scope="vm" pip-extension-url="vm.params.extensionUrl" pip-apply="vm.onApply(updatedData)"></pip-widget-config-extend-component></md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('dialogs/widget_config/ConfigDialogExtendComponent.html',
    '<h3 class="tm0 flex-none">{{ \'DASHBOARD_WIDGET_CONFIG_DIALOG_TITLE\' | translate }}</h3><div class="pip-body pip-scroll p16 bp0 flex-auto"><pip-extension-point></pip-extension-point><pip-toggle-buttons class="bm16" ng-if="!$ctrl.hideSizes" pip-buttons="$ctrl.sizes" ng-model="$ctrl.sizeId"></pip-toggle-buttons><pip-color-picker ng-if="!$ctrl.hideColors" pip-colors="$ctrl.colors" ng-model="$ctrl.color"></pip-color-picker></div><div class="pip-footer flex-none"><div><md-button class="md-accent" ng-click="$ctrl.onCancel()">{{ \'CANCEL\' | translate }}</md-button><md-button class="md-accent" ng-click="$ctrl.onApply()">{{ \'APPLY\' | translate }}</md-button></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('widgets/calendar/ConfigDialogExtension.html',
    '<div class="w-stretch bm16">Date:<md-datepicker ng-model="$ctrl.date" class="w-stretch"></md-datepicker></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('widgets/calendar/WidgetCalendar.html',
    '<div class="widget-box pip-calendar-widget {{ $ctrl.color }} layout-column layout-fill tp0" ng-class="{ small: $ctrl.options.size.colSpan == 1 && $ctrl.options.size.rowSpan == 1, medium: $ctrl.options.size.colSpan == 2 && $ctrl.options.size.rowSpan == 1, big: $ctrl.options.size.colSpan == 2 && $ctrl.options.size.rowSpan == 2 }"><div class="widget-heading layout-row layout-align-end-center flex-none"><pip-menu-widget></pip-menu-widget></div><div class="widget-content flex-auto layout-row layout-align-center-center" ng-if="$ctrl.options.size.colSpan == 2 && $ctrl.options.size.rowSpan == 1"><span class="date lm24 rm12">{{ $ctrl.options.date.getDate() }}</span><div class="flex-auto layout-column"><span class="weekday md-headline">{{ $ctrl.options.date | formatLongDayOfWeek }}</span> <span class="month-year md-headline">{{ $ctrl.options.date | formatLongMonth }} {{ $ctrl.options.date | formatYear }}</span></div></div><div class="widget-content flex-auto layout-column layout-align-space-around-center" ng-hide="$ctrl.options.size.colSpan == 2 && $ctrl.options.size.rowSpan == 1"><span class="weekday md-headline" ng-hide="$ctrl.options.size.colSpan == 1 && $ctrl.options.size.rowSpan == 1">{{ $ctrl.options.date | formatLongDayOfWeek }}</span> <span class="weekday" ng-show="$ctrl.options.size.colSpan == 1 && $ctrl.options.size.rowSpan == 1">{{ $ctrl.options.date | formatLongDayOfWeek }}</span> <span class="date lm12 rm12">{{ $ctrl.options.date.getDate() }}</span> <span class="month-year md-headline">{{ $ctrl.options.date | formatLongMonth }} {{ $ctrl.options.date | formatYear }}</span></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('widgets/event/ConfigDialogExtension.html',
    '<div class="w-stretch"><md-input-container class="w-stretch bm0"><label>Title:</label> <input type="text" ng-model="$ctrl.title"></md-input-container>Date:<md-datepicker ng-model="$ctrl.date" class="w-stretch bm8"></md-datepicker><md-input-container class="w-stretch"><label>Description:</label> <textarea type="text" ng-model="$ctrl.text">\n' +
    '    </textarea></md-input-container>Backdrop\'s opacity:<md-slider aria-label="opacity" type="number" min="0.1" max="0.9" step="0.01" ng-model="$ctrl.opacity" ng-change="$ctrl.onOpacitytest($ctrl.opacity)"></md-slider></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('widgets/event/WidgetEvent.html',
    '<div class="widget-box pip-event-widget {{ $ctrl.color }} layout-column layout-fill" ng-class="{ small: $ctrl.options.size.colSpan == 1 && $ctrl.options.size.rowSpan == 1, medium: $ctrl.options.size.colSpan == 2 && $ctrl.options.size.rowSpan == 1, big: $ctrl.options.size.colSpan == 2 && $ctrl.options.size.rowSpan == 2 }"><img ng-if="$ctrl.options.image" ng-src="{{$ctrl.options.image}}" alt="{{$ctrl.options.title || $ctrl.options.name}}"><div class="text-backdrop" style="background-color: rgba(0, 0, 0, {{ $ctrl.opacity }})"><div class="widget-heading layout-row layout-align-start-center flex-none"><span class="widget-title flex-auto text-overflow">{{ $ctrl.options.title || $ctrl.options.name }}</span><pip-menu-widget ng-if="!$ctrl.options.hideMenu"></pip-menu-widget></div><div class="text-container flex-auto pip-scroll"><p class="date flex-none" ng-if="$ctrl.options.date">{{ $ctrl.options.date | formatShortDate }}</p><p class="text flex-auto">{{ $ctrl.options.text || $ctrl.options.description }}</p></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('widgets/menu/WidgetMenu.html',
    '<md-menu class="widget-menu" md-position-mode="target-right target"><md-button class="md-icon-button flex-none" ng-click="$mdOpenMenu()" aria-label="Menu"><md-icon md-svg-icon="icons:vdots"></md-icon></md-button><md-menu-content width="4"><md-menu-item ng-repeat="item in $ctrl.menu"><md-button ng-if="!item.submenu" ng-click="$ctrl.callAction(item.action, item.params, item)">{{:: item.title }}</md-button><md-menu ng-if="item.submenu"><md-button ng-click="$ctrl.callAction(item.action)">{{:: item.title }}</md-button><md-menu-content><md-menu-item ng-repeat="subitem in item.submenu"><md-button ng-click="$ctrl.callAction(subitem.action, subitem.params, subitem)">{{:: subitem.title }}</md-button></md-menu-item></md-menu-content></md-menu></md-menu-item></md-menu-content></md-menu>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('widgets/picture_slider/WidgetPictureSlider.html',
    '<div class="widget-box pip-picture-slider-widget {{ $ctrl.color }} layout-column layout-fill" ng-class="{ small: $ctrl.options.size.colSpan == 1 && $ctrl.options.size.rowSpan == 1, medium: $ctrl.options.size.colSpan == 2 && $ctrl.options.size.rowSpan == 1, big: $ctrl.options.size.colSpan == 2 && $ctrl.options.size.rowSpan == 2 }" index="{{ $ctrl.index }}" group="{{ $ctrl.group }}"><div class="widget-heading lp16 rp8 layout-row layout-align-end-center flex-none"><span class="flex text-overflow">{{ $ctrl.options.title }}</span><pip-menu-widget ng-if="!$ctrl.options.hideMenu"></pip-menu-widget></div><div class="slider-container"><div pip-image-slider="" pip-animation-type="\'fading\'" pip-animation-interval="$ctrl.animationInterval" ng-if="$ctrl.animationType == \'fading\'"><div class="pip-animation-block" ng-repeat="slide in $ctrl.options.slides"><img ng-src="{{ slide.image }}" alt="{{ slide.image }}" pip-image-load="$ctrl.onImageLoad($event)"><p class="slide-text" ng-if="slide.text">{{ slide.text }}</p></div></div><div pip-image-slider="" pip-animation-type="\'carousel\'" pip-animation-interval="$ctrl.animationInterval" ng-if="$ctrl.animationType == \'carousel\'"><div class="pip-animation-block" ng-repeat="slide in $ctrl.options.slides"><img ng-src="{{ slide.image }}" alt="{{ slide.image }}" pip-image-load="$ctrl.onImageLoad($event)"><p class="slide-text" ng-if="slide.text">{{ slide.text }}</p></div></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('widgets/notes/ConfigDialogExtension.html',
    '<div class="w-stretch"><md-input-container class="w-stretch bm0"><label>Title:</label> <input type="text" ng-model="$ctrl.title"></md-input-container><md-input-container class="w-stretch tm0"><label>Text:</label> <textarea type="text" ng-model="$ctrl.text">\n' +
    '    </textarea></md-input-container></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('widgets/notes/WidgetNotes.html',
    '<div class="widget-box pip-notes-widget {{ $ctrl.color }} layout-column"><div class="widget-heading layout-row layout-align-start-center flex-none" ng-if="$ctrl.options.title || $ctrl.options.name"><span class="widget-title flex-auto text-overflow">{{ $ctrl.options.title || $ctrl.options.name }}</span></div><pip-menu-widget ng-if="!$ctrl.options.hideMenu"></pip-menu-widget><div class="text-container flex-auto pip-scroll"><p>{{ $ctrl.options.text }}</p></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('widgets/position/ConfigDialogExtension.html',
    '<div class="w-stretch"><md-input-container class="w-stretch bm0"><label>Location name:</label> <input type="text" ng-model="$ctrl.locationName"></md-input-container></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('widgets/position/WidgetPosition.html',
    '<div class="pip-position-widget widget-box p0 layout-column layout-fill" ng-class="{ small: $ctrl.options.size.colSpan == 1 && $ctrl.options.size.rowSpan == 1, medium: $ctrl.options.size.colSpan == 2 && $ctrl.options.size.rowSpan == 1, big: $ctrl.options.size.colSpan == 2 && $ctrl.options.size.rowSpan == 2 }" index="{{ $ctrl.index }}" group="{{ $ctrl.group }}"><div class="position-absolute-right-top" ng-if="!$ctrl.options.locationName"><pip-menu-widget ng-if="!$ctrl.options.hideMenu"></pip-menu-widget></div><div class="widget-heading lp16 rp8 layout-row layout-align-end-center flex-none" ng-if="$ctrl.options.locationName"><span class="flex text-overflow">{{ $ctrl.options.locationName }}</span><pip-menu-widget ng-if="!$ctrl.options.hideMenu"></pip-menu-widget></div><pip-location-map class="flex" ng-if="$ctrl.showPosition" pip-stretch="true" pip-rebind="true" pip-location-pos="$ctrl.options.location"></pip-location-map></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('widgets/statistics/WidgetStatistics.html',
    '<div class="widget-box pip-statistics-widget layout-column layout-fill" ng-class="{ small: $ctrl.options.size.colSpan == 1 && $ctrl.options.size.rowSpan == 1, medium: $ctrl.options.size.colSpan == 2 && $ctrl.options.size.rowSpan == 1, big: $ctrl.options.size.colSpan == 2 && $ctrl.options.size.rowSpan == 2 }"><div class="widget-heading layout-row layout-align-start-center flex-none"><span class="widget-title flex-auto text-overflow">{{ $ctrl.options.title || $ctrl.options.name }}</span><pip-menu-widget></pip-menu-widget></div><div class="widget-content flex-auto layout-row layout-align-center-center" ng-if="$ctrl.options.series && !$ctrl.reset"><pip-pie-chart pip-series="$ctrl.options.series" ng-if="!$ctrl.options.chartType || $ctrl.options.chartType == \'pie\'" pip-donut="true" pip-pie-size="$ctrl.chartSize" pip-show-total="true" pip-centered="true"></pip-pie-chart></div></div>');
}]);
})();



},{}]},{},[24,1,2,3,4,5,6,7,11,12,8,9,10,13,16,17,18,19,20,21,22,23,14,15])(24)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).settings = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
require("./service");
require("./page");
angular.module('pipSettings', [
    'pipSettings.Service',
    'pipSettings.Page'
]);
__export(require("./service"));
},{"./page":4,"./service":11}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SettingsPageSelectedTab_1 = require("../service/SettingsPageSelectedTab");
var SettingsPageController = (function () {
    SettingsPageController.$inject = ['$state', 'pipNavService', 'pipSettings', '$rootScope', '$timeout'];
    function SettingsPageController($state, pipNavService, pipSettings, $rootScope, $timeout) {
        var _this = this;
        this.$state = $state;
        this.tabs = _.filter(pipSettings.getTabs(), function (tab) {
            if (tab.visible === true && (tab.access ? tab.access($rootScope['$user'], tab) : true)) {
                return tab;
            }
        });
        this.tabs = _.sortBy(this.tabs, 'index');
        this.selected = new SettingsPageSelectedTab_1.SettingsPageSelectedTab();
        if (this.$state.current.name !== 'settings') {
            this.initSelect(this.$state.current.name);
        }
        else if (this.$state.current.name === 'settings' && pipSettings.getDefaultTab()) {
            this.initSelect(pipSettings.getDefaultTab().state);
        }
        else {
            $timeout(function () {
                if (pipSettings.getDefaultTab()) {
                    _this.initSelect(pipSettings.getDefaultTab().state);
                }
                if (!pipSettings.getDefaultTab() && _this.tabs.length > 0) {
                    _this.initSelect(_this.tabs[0].state);
                }
            });
        }
        pipNavService.icon.showMenu();
        pipNavService.breadcrumb.text = "Settings";
        pipNavService.actions.hide();
        pipNavService.appbar.removeShadow();
        this.onDropdownSelect = function (state) {
            _this.onNavigationSelect(state.state);
        };
    }
    SettingsPageController.prototype.initSelect = function (state) {
        this.selected.tab = _.find(this.tabs, function (tab) {
            return tab.state === state;
        });
        this.selected.tabIndex = _.indexOf(this.tabs, this.selected.tab);
        this.selected.tabId = state;
        this.$state.go(this.selected.tabId);
    };
    SettingsPageController.prototype.onNavigationSelect = function (state) {
        this.initSelect(state);
        if (this.selected.tab) {
            this.$state.go(state);
        }
    };
    return SettingsPageController;
}());
angular
    .module('pipSettings.Page')
    .controller('pipSettingsPageController', SettingsPageController);
},{"../service/SettingsPageSelectedTab":7}],3:[function(require,module,exports){
{
    configureSettingsPageRoutes.$inject = ['$stateProvider'];
    function configureSettingsPageRoutes($stateProvider) {
        $stateProvider
            .state('settings', {
            url: '/settings?party_id',
            auth: true,
            controllerAs: 'vm',
            controller: 'pipSettingsPageController',
            templateUrl: 'page/SettingsPage.html'
        });
    }
    angular.module('pipSettings.Page')
        .config(configureSettingsPageRoutes);
}
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipSettings.Page', [
    'ui.router',
    'pipSettings.Service',
    'pipNav',
    'pipSelected',
    'pipTranslate',
    'pipSettings.Templates'
]);
require("./SettingsPage");
require("./SettingsPageRoutes");
},{"./SettingsPage":2,"./SettingsPageRoutes":3}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SettingsConfig = (function () {
    function SettingsConfig() {
        this.tabs = [];
        this.titleText = 'SETTINGS_TITLE';
        this.titleLogo = null;
        this.isNavIcon = true;
    }
    return SettingsConfig;
}());
exports.SettingsConfig = SettingsConfig;
},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SettingsPageSelectedTab = (function () {
    function SettingsPageSelectedTab() {
        this.tabIndex = 0;
    }
    return SettingsPageSelectedTab;
}());
exports.SettingsPageSelectedTab = SettingsPageSelectedTab;
},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SettingsConfig_1 = require("./SettingsConfig");
var SettingsService = (function () {
    SettingsService.$inject = ['config'];
    function SettingsService(config) {
        "ngInject";
        this._config = config;
    }
    SettingsService.prototype.getFullStateName = function (state) {
        return 'settings.' + state;
    };
    SettingsService.prototype.setDefaultTab = function (name) {
        if (!_.find(this._config.tabs, function (tab) {
            return tab.state === 'settings.' + name;
        })) {
            throw new Error('Tab with state name "' + name + '" is not registered');
        }
        this._config.defaultTab = this.getFullStateName(name);
    };
    SettingsService.prototype.getDefaultTab = function () {
        var _this = this;
        var defaultTab;
        defaultTab = _.find(this._config.tabs, function (tab) {
            return tab.state === _this._config.defaultTab;
        });
        return _.cloneDeep(defaultTab);
    };
    SettingsService.prototype.showTitleText = function (newTitleText) {
        if (newTitleText) {
            this._config.titleText = newTitleText;
            this._config.titleLogo = null;
        }
        return this._config.titleText;
    };
    SettingsService.prototype.showTitleLogo = function (newTitleLogo) {
        if (newTitleLogo) {
            this._config.titleLogo = newTitleLogo;
            this._config.titleText = null;
        }
        return this._config.titleLogo;
    };
    SettingsService.prototype.showNavIcon = function (value) {
        if (value !== null && value !== undefined) {
            this._config.isNavIcon = !!value;
        }
        return this._config.isNavIcon;
    };
    SettingsService.prototype.getTabs = function () {
        return _.cloneDeep(this._config.tabs);
    };
    return SettingsService;
}());
var SettingsProvider = (function () {
    SettingsProvider.$inject = ['$stateProvider'];
    function SettingsProvider($stateProvider) {
        this.$stateProvider = $stateProvider;
        this._config = new SettingsConfig_1.SettingsConfig();
    }
    SettingsProvider.prototype.getFullStateName = function (state) {
        return 'settings.' + state;
    };
    SettingsProvider.prototype.getDefaultTab = function () {
        var defaultTab;
        defaultTab = _.find(this._config.tabs, function (tab) {
            return tab.state === defaultTab.state;
        });
        return _.cloneDeep(defaultTab);
    };
    SettingsProvider.prototype.addTab = function (tabObj) {
        var existingTab;
        this.validateTab(tabObj);
        existingTab = _.find(this._config.tabs, function (tab) {
            return tab.state === 'settings.' + tabObj.state;
        });
        if (existingTab) {
            throw new Error('Tab with state name "' + tabObj.state + '" is already registered');
        }
        this._config.tabs.push({
            state: this.getFullStateName(tabObj.state),
            title: tabObj.title,
            index: tabObj.index || 100000,
            access: tabObj.access,
            visible: tabObj.visible !== false,
            stateConfig: _.cloneDeep(tabObj.stateConfig)
        });
        this.$stateProvider.state(this.getFullStateName(tabObj.state), tabObj.stateConfig);
        if (typeof this._config.defaultTab === 'undefined' && this._config.tabs.length === 1) {
            this.setDefaultTab(tabObj.state);
        }
    };
    SettingsProvider.prototype.setDefaultTab = function (name) {
        if (!_.find(this._config.tabs, function (tab) {
            return tab.state === 'settings.' + name;
        })) {
            throw new Error('Tab with state name "' + name + '" is not registered');
        }
        this._config.defaultTab = this.getFullStateName(name);
    };
    SettingsProvider.prototype.validateTab = function (tabObj) {
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
    };
    SettingsProvider.prototype.showTitleText = function (newTitleText) {
        if (newTitleText) {
            this._config.titleText = newTitleText;
            this._config.titleLogo = null;
        }
        return this._config.titleText;
    };
    SettingsProvider.prototype.showTitleLogo = function (newTitleLogo) {
        if (newTitleLogo) {
            this._config.titleLogo = newTitleLogo;
            this._config.titleText = null;
        }
        return this._config.titleLogo;
    };
    SettingsProvider.prototype.showNavIcon = function (value) {
        if (value !== null && value !== undefined) {
            this._config.isNavIcon = !!value;
        }
        return this._config.isNavIcon;
    };
    SettingsProvider.prototype.$get = function () {
        "ngInject";
        if (_.isNull(this._service) || _.isUndefined(this._service)) {
            this._service = new SettingsService(this._config);
        }
        return this._service;
    };
    return SettingsProvider;
}());
angular
    .module('pipSettings.Service')
    .provider('pipSettings', SettingsProvider);
},{"./SettingsConfig":6}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SettingsStateConfig = (function () {
    function SettingsStateConfig() {
        this.auth = false;
    }
    return SettingsStateConfig;
}());
exports.SettingsStateConfig = SettingsStateConfig;
},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SettingsTab = (function () {
    function SettingsTab() {
    }
    return SettingsTab;
}());
exports.SettingsTab = SettingsTab;
},{}],11:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipSettings.Service', []);
require("./SettingsConfig");
require("./SettingsPageSelectedTab");
require("./SettingsStateConfig");
require("./SettingsTab");
require("./SettingsService");
__export(require("./SettingsConfig"));
__export(require("./SettingsPageSelectedTab"));
__export(require("./SettingsStateConfig"));
__export(require("./SettingsTab"));
},{"./SettingsConfig":6,"./SettingsPageSelectedTab":7,"./SettingsService":8,"./SettingsStateConfig":9,"./SettingsTab":10}],12:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipSettings.Templates');
} catch (e) {
  module = angular.module('pipSettings.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('page/SettingsPage.html',
    '<md-toolbar class="pip-appbar-ext"></md-toolbar><pip-document width="800" min-height="400" class="pip-settings"><div class="pip-menu-container" ng-hide="vm.manager === false || !vm.tabs || vm.tabs.length < 1"><md-list class="pip-menu pip-simple-list" pip-selected="vm.selected.tabIndex" pip-selected-watch="vm.selected.navId" pip-select="vm.onNavigationSelect($event.id)"><md-list-item class="pip-simple-list-item pip-selectable flex" ng-repeat="tab in vm.tabs track by tab.state" ng-if="vm.$party.id == vm.$user.id || tab.state == \'settings.basic_info\'|| tab.state ==\'settings.contact_info\' || tab.state ==\'settings.blacklist\'" md-ink-ripple="" pip-id="{{:: tab.state }}"><p>{{::tab.title | translate}}</p></md-list-item></md-list><div class="pip-content-container"><pip-dropdown pip-actions="vm.tabs" pip-dropdown-select="vm.onDropdownSelect" pip-active-index="vm.selected.tabIndex"></pip-dropdown><div class="pip-body tp24-flex layout-column" ui-view=""></div></div></div><div class="layout-column layout-align-center-center flex" ng-show="vm.manager === false || !vm.tabs || vm.tabs.length < 1">{{::\'ERROR_400\' | translate}}</div></pip-document>');
}]);
})();



},{}]},{},[12,1,4,2,3,11,5,6,7,8,9,10])(12)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).help = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
{
    filter.$inject = ['$injector'];
    function filter($injector) {
        var pipTranslate = $injector.has('pipTranslate')
            ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate.translate(key) || key : key;
        };
    }
    angular.module('pipHelp.Translate', [])
        .filter('translate', filter);
}
},{}],2:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
require("./service");
require("./page");
angular.module('pipHelp', [
    'pipHelp.Service',
    'pipHelp.Page'
]);
__export(require("./service"));
},{"./page":5,"./service":12}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelpPageSelectedTab_1 = require("../service/HelpPageSelectedTab");
var HelpPageController = (function () {
    HelpPageController.$inject = ['$log', '$state', '$rootScope', '$timeout', 'pipNavService', 'pipHelp'];
    function HelpPageController($log, $state, $rootScope, $timeout, pipNavService, pipHelp) {
        var _this = this;
        this.$log = $log;
        this.$state = $state;
        this.tabs = _.filter(pipHelp.getTabs(), function (tab) {
            if (tab.visible === true) {
                return tab;
            }
        });
        this.tabs = _.sortBy(this.tabs, 'index');
        this.selected = new HelpPageSelectedTab_1.HelpPageSelectedTab();
        if (this.$state.current.name !== 'help') {
            this.initSelect(this.$state.current.name);
        }
        else if (this.$state.current.name === 'help' && pipHelp.getDefaultTab()) {
            this.initSelect(pipHelp.getDefaultTab().state);
        }
        else {
            $timeout(function () {
                if (pipHelp.getDefaultTab()) {
                    _this.initSelect(pipHelp.getDefaultTab().state);
                }
                if (!pipHelp.getDefaultTab() && _this.tabs && _this.tabs.length > 0) {
                    _this.initSelect(_this.tabs[0].state);
                }
            });
        }
        pipNavService.icon.showMenu();
        pipNavService.breadcrumb.text = "Help";
        pipNavService.actions.hide();
        pipNavService.appbar.removeShadow();
        this.onDropdownSelect = function (state) {
            _this.onNavigationSelect(state.state);
        };
    }
    HelpPageController.prototype.initSelect = function (state) {
        this.selected.tab = _.find(this.tabs, function (tab) {
            return tab.state === state;
        });
        this.selected.tabIndex = _.indexOf(this.tabs, this.selected.tab);
        this.selected.tabId = state;
        this.$state.go(this.selected.tabId);
    };
    HelpPageController.prototype.onNavigationSelect = function (state) {
        this.initSelect(state);
        console.log('a', state);
        if (this.selected.tab) {
            this.$state.go(state);
        }
    };
    return HelpPageController;
}());
angular
    .module('pipHelp.Page')
    .controller('pipHelpPageController', HelpPageController);
},{"../service/HelpPageSelectedTab":7}],4:[function(require,module,exports){
{
    configureHelpPageRoutes.$inject = ['$stateProvider'];
    function configureHelpPageRoutes($stateProvider) {
        $stateProvider
            .state('help', {
            url: '/help?party_id',
            auth: true,
            controllerAs: '$ctrl',
            controller: 'pipHelpPageController',
            templateUrl: 'page/HelpPage.html'
        });
    }
    angular.module('pipHelp.Page')
        .config(configureHelpPageRoutes);
}
},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipHelp.Page', [
    'ui.router',
    'pipHelp.Service',
    'pipNav',
    'pipSelected',
    'pipTranslate',
    'pipHelp.Templates'
]);
require("./HelpPage");
require("./HelpPageRoutes");
},{"./HelpPage":3,"./HelpPageRoutes":4}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelpConfig = (function () {
    function HelpConfig() {
        this.tabs = [];
        this.titleText = 'SETTINGS_TITLE';
        this.titleLogo = null;
        this.isNavIcon = true;
    }
    return HelpConfig;
}());
exports.HelpConfig = HelpConfig;
},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelpPageSelectedTab = (function () {
    function HelpPageSelectedTab() {
    }
    return HelpPageSelectedTab;
}());
exports.HelpPageSelectedTab = HelpPageSelectedTab;
},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelpConfig_1 = require("./HelpConfig");
var HelpService = (function () {
    HelpService.$inject = ['_config'];
    function HelpService(_config) {
        "ngInject";
        this._config = _config;
    }
    HelpService.prototype.getFullStateName = function (state) {
        return 'help.' + state;
    };
    HelpService.prototype.setDefaultTab = function (name) {
        if (!_.find(this._config.tabs, function (tab) {
            return tab.state === 'help.' + name;
        })) {
            throw new Error('Tab with state name "' + name + '" is not registered');
        }
        this._config.defaultTab = this.getFullStateName(name);
    };
    HelpService.prototype.getDefaultTab = function () {
        var _this = this;
        var defaultTab;
        defaultTab = _.find(this._config.tabs, function (p) {
            return p.state === _this._config.defaultTab;
        });
        return _.cloneDeep(defaultTab);
    };
    HelpService.prototype.showTitleText = function (newTitleText) {
        if (newTitleText) {
            this._config.titleText = newTitleText;
            this._config.titleLogo = null;
        }
        return this._config.titleText;
    };
    HelpService.prototype.showTitleLogo = function (newTitleLogo) {
        if (newTitleLogo) {
            this._config.titleLogo = newTitleLogo;
            this._config.titleText = null;
        }
        return this._config.titleLogo;
    };
    HelpService.prototype.showNavIcon = function (value) {
        if (value !== null && value !== undefined) {
            this._config.isNavIcon = !!value;
        }
        return this._config.isNavIcon;
    };
    HelpService.prototype.getTabs = function () {
        return _.cloneDeep(this._config.tabs);
    };
    return HelpService;
}());
var HelpProvider = (function () {
    HelpProvider.$inject = ['$stateProvider'];
    function HelpProvider($stateProvider) {
        this.$stateProvider = $stateProvider;
        this._config = new HelpConfig_1.HelpConfig();
    }
    HelpProvider.prototype.getFullStateName = function (state) {
        return 'help.' + state;
    };
    HelpProvider.prototype.getDefaultTab = function () {
        var _this = this;
        var defaultTab;
        defaultTab = _.find(this._config.tabs, function (p) {
            return p.state === _this._config.defaultTab;
        });
        return _.cloneDeep(defaultTab);
    };
    HelpProvider.prototype.addTab = function (tabObj) {
        var existingTab;
        this.validateTab(tabObj);
        existingTab = _.find(this._config.tabs, function (p) {
            return p.state === 'help.' + tabObj.state;
        });
        if (existingTab) {
            throw new Error('Tab with state name "' + tabObj.state + '" is already registered');
        }
        this._config.tabs.push({
            state: this.getFullStateName(tabObj.state),
            title: tabObj.title,
            index: tabObj.index || 100000,
            access: tabObj.access,
            visible: tabObj.visible !== false,
            stateConfig: _.cloneDeep(tabObj.stateConfig)
        });
        this.$stateProvider.state(this.getFullStateName(tabObj.state), tabObj.stateConfig);
        if (typeof _.isUndefined(this._config.defaultTab) && this._config.tabs.length === 1) {
            this.setDefaultTab(tabObj.state);
        }
    };
    HelpProvider.prototype.setDefaultTab = function (name) {
        if (!_.find(this._config.tabs, function (tab) {
            return tab.state === 'help.' + name;
        })) {
            throw new Error('Tab with state name "' + name + '" is not registered');
        }
        this._config.defaultTab = this.getFullStateName(name);
    };
    HelpProvider.prototype.validateTab = function (tabObj) {
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
    };
    HelpProvider.prototype.showTitleText = function (newTitleText) {
        if (newTitleText) {
            this._config.titleText = newTitleText;
            this._config.titleLogo = null;
        }
        return this._config.titleText;
    };
    HelpProvider.prototype.showTitleLogo = function (newTitleLogo) {
        if (newTitleLogo) {
            this._config.titleLogo = newTitleLogo;
            this._config.titleText = null;
        }
        return this._config.titleLogo;
    };
    HelpProvider.prototype.showNavIcon = function (value) {
        if (!_.isNull(value) && !_.isUndefined(value)) {
            this._config.isNavIcon = !!value;
        }
        return this._config.isNavIcon;
    };
    HelpProvider.prototype.$get = function () {
        "ngInject";
        if (_.isNull(this._service) || _.isUndefined(this._service)) {
            this._service = new HelpService(this._config);
        }
        return this._service;
    };
    return HelpProvider;
}());
angular
    .module('pipHelp.Service')
    .provider('pipHelp', HelpProvider);
},{"./HelpConfig":6}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelpStateConfig = (function () {
    function HelpStateConfig() {
        this.auth = false;
    }
    return HelpStateConfig;
}());
exports.HelpStateConfig = HelpStateConfig;
},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelpTab = (function () {
    function HelpTab() {
    }
    return HelpTab;
}());
exports.HelpTab = HelpTab;
},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
},{}],12:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular
    .module('pipHelp.Service', []);
require("./HelpConfig");
require("./HelpPageSelectedTab");
require("./HelpTab");
require("./HelpStateConfig");
require("./HelpService");
__export(require("./HelpConfig"));
__export(require("./HelpPageSelectedTab"));
__export(require("./HelpTab"));
__export(require("./HelpStateConfig"));
},{"./HelpConfig":6,"./HelpPageSelectedTab":7,"./HelpService":8,"./HelpStateConfig":9,"./HelpTab":10}],13:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipHelp.Templates');
} catch (e) {
  module = angular.module('pipHelp.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('page/HelpPage.html',
    '<md-toolbar class="pip-appbar-ext"></md-toolbar><pip-document width="800" min-height="400" class="pip-help"><div class="pip-menu-container" ng-hide="$ctrl.manager === false || !$ctrl.tabs || $ctrl.tabs.length < 1"><md-list class="pip-menu pip-simple-list" pip-selected="$ctrl.selected.tabIndex" pip-selected-watch="$ctrl.selected.navId" pip-select="$ctrl.onNavigationSelect($event.id)"><md-list-item class="pip-simple-list-item pip-selectable flex" ng-repeat="tab in $ctrl.tabs track by tab.state" md-ink-ripple="" pip-id="{{:: tab.state }}"><p>{{::tab.title | translate}}</p></md-list-item></md-list><div class="pip-content-container"><pip-dropdown pip-actions="$ctrl.tabs" pip-dropdown-select="$ctrl.onDropdownSelect" pip-active-index="$ctrl.selected.tabIndex"></pip-dropdown><div class="pip-body p0 layout-column" ui-view=""></div></div></div><div class="layout-column layout-align-center-center flex" ng-show="$ctrl.manager === false || !$ctrl.tabs || $ctrl.tabs.length < 1">{{::\'ERROR_400\' | translate}}</div></pip-document>');
}]);
})();



},{}]},{},[13,1,2,3,4,5,6,7,8,9,10,11,12])(13)
});



//# sourceMappingURL=pip-webui.js.map
