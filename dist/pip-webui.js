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
(function () {
    'use strict';
    angular.module('pipButtons', [
        'pipToggleButtons',
        'pipRefreshButton',
        'pipFabTooltipVisibility'
    ]);
})();

},{}],2:[function(require,module,exports){
(function () {
    'use strict';
    ToggleButtonsFilter.$inject = ['$injector'];
    function ToggleButtonsFilter($injector) {
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate['translate'](key) || key : key;
        };
    }
    angular.module('pipButtons.Translate', [])
        .filter('translate', ToggleButtonsFilter);
})();

},{}],3:[function(require,module,exports){
(function () {
    'use strict';
    pipFabTooltipVisibility.$inject = ['$parse', '$timeout'];
    var FabTooltipVisibilityController = (function () {
        FabTooltipVisibilityController.$inject = ['$element', '$attrs', '$scope', '$timeout', '$parse'];
        function FabTooltipVisibilityController($element, $attrs, $scope, $timeout, $parse) {
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
        return FabTooltipVisibilityController;
    }());
    function pipFabTooltipVisibility($parse, $timeout) {
        return {
            restrict: 'A',
            scope: false,
            controller: FabTooltipVisibilityController
        };
    }
    angular
        .module('pipFabTooltipVisibility', [])
        .directive('pipFabTooltipVisibility', pipFabTooltipVisibility);
})();

},{}],4:[function(require,module,exports){
(function () {
    'use strict';
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
    angular.module('pipRefreshButton', ['ngMaterial'])
        .component('pipRefreshButton', RefreshButtonComponent);
})();

},{}],5:[function(require,module,exports){
(function () {
    'use strict';
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
        templateUrl: 'toggle_buttons/toggle_buttons.html',
        controller: ToggleButtonsController
    };
    angular
        .module('pipToggleButtons', ['pipButtons.Templates'])
        .component('pipToggleButtons', ToggleButtons);
})();

},{}],6:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipButtons.Templates');
} catch (e) {
  module = angular.module('pipButtons.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('toggle_buttons/toggle_buttons.html',
    '<div class="pip-toggle-buttons layout-row {{$ctrl.class}}" pip-selected="$ctrl.bufButtonIndex" pip-enter-space-press="$ctrl.enterSpacePress($event)" ng-if="!$ctrl.pipMedia(\'xs\') || $ctrl.onlyToggle"><md-button tabindex="-1" ng-repeat="button in $ctrl.buttons" ng-class="{\'md-accent md-raised selected color-accent-bg\' : $ctrl.highlightButton($index)}" ng-attr-style="{{ \'background-color:\' + ($ctrl.highlightButton($index) ? button.backgroundColor : \'\') + \'!important\' }}" class="pip-selectable pip-chip-button flex" ng-click="$ctrl.buttonSelected($index, $event)" ng-disabled="button.disabled || $ctrl.disabled">{{button.name || button.title | translate}} <span ng-if="button.checked || button.complete || button.filled" class="pip-tagged">*</span></md-button></div><md-input-container class="md-block" ng-if="$ctrl.pipMedia(\'xs\') && !$ctrl.onlyToggle"><md-select ng-model="$ctrl.currentButtonIndex" ng-disabled="$ctrl.disabled" aria-label="DROPDOWN" md-on-close="$ctrl.buttonSelected($ctrl.currentButtonIndex)"><md-option ng-repeat="action in $ctrl.buttons" value="{{ ::$index }}">{{ (action.title || action.name) | translate }} <span ng-if="action.checked || action.complete || action.filled" class="pip-tagged">*</span></md-option></md-select></md-input-container>');
}]);
})();



},{}]},{},[6,1,2,3,4,5])(6)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).layouts = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var MediaService_1 = require("../media/MediaService");
(function () {
    var AuxPanelDirectiveController = (function () {
        AuxPanelDirectiveController.$inject = ['pipAuxPanel'];
        function AuxPanelDirectiveController(pipAuxPanel) {
            this.normalSize = 320;
            this.largeSize = 480;
            this._pipAuxPanel = pipAuxPanel;
        }
        AuxPanelDirectiveController.prototype.isGtxs = function () {
            return Number($('body').width()) > MediaService_1.MainBreakpoints.xs && this._pipAuxPanel.isOpen();
        };
        AuxPanelDirectiveController.prototype.isGtlg = function () {
            return Number($('body').width()) > (MediaService_1.MainBreakpoints.lg + this.largeSize);
        };
        return AuxPanelDirectiveController;
    }());
    function AuxPanelDirective() {
        return {
            restrict: 'E',
            replace: true,
            controller: AuxPanelDirectiveController,
            transclude: true,
            controllerAs: 'vm',
            template: '<md-sidenav class="md-sidenav-right md-whiteframe-z2 pip-auxpanel color-content-bg" ng-class="{\'pip-large\': vm.isGtlg()}"' +
                'md-component-id="pip-auxpanel" md-is-locked-open="vm.isGtxs()" pip-focused ng-transclude>' +
                '</md-sidenav>'
        };
    }
    angular
        .module('pipAuxPanel')
        .directive('pipAuxPanel', AuxPanelDirective);
})();

},{"../media/MediaService":12}],2:[function(require,module,exports){
'use strict';
(function () {
    AuxPanelPartDirectiveController.$inject = ['$scope', '$element', '$attrs', '$rootScope', 'pipAuxPanel'];
    AuxPanelPartDirective.$inject = ['ngIfDirective'];
    function AuxPanelPartDirectiveController($scope, $element, $attrs, $rootScope, pipAuxPanel) {
        "ngInject";
        var partName = '' + $attrs.pipAuxPanelPart;
        var partValue = null;
        var pos = partName.indexOf(':');
        if (pos > 0) {
            partValue = partName.substr(pos + 1);
            partName = partName.substr(0, pos);
        }
        onAuxPanelChanged(null, pipAuxPanel.config);
        $rootScope.$on('pipAuxPanelChanged', onAuxPanelChanged);
        function onAuxPanelChanged(event, config) {
            var parts = config.parts || {};
            var currentPartValue = config[partName];
            $scope.visible = partValue ? currentPartValue == partValue : currentPartValue;
        }
    }
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
                $attrs.ngIf = function () { return $scope.visible; };
                ngIf.link.apply(ngIf);
            },
            controller: AuxPanelPartDirectiveController
        };
    }
    angular
        .module('pipAuxPanel')
        .directive('pipAuxPanelPart', AuxPanelPartDirective);
})();

},{}],3:[function(require,module,exports){
'use strict';
hookAuxPanelEvents.$inject = ['$rootScope', 'pipAuxPanel'];
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
            this._rootScope.$broadcast(exports.AuxPanelStateChangedEvent, value);
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
        this._rootScope.$emit(exports.AuxPanelChangedEvent, this._config);
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
            this._config = value || new AuxPanelConfig();
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
    $rootScope.$on(exports.OpenAuxPanelEvent, function () { pipAuxPanel.open(); });
    $rootScope.$on(exports.CloseAuxPanelEvent, function () { pipAuxPanel.close(); });
}
angular
    .module('pipAuxPanel')
    .provider('pipAuxPanel', AuxPanelProvider)
    .run(hookAuxPanelEvents);

},{}],4:[function(require,module,exports){
'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipAuxPanel', ['ngMaterial']);
require("./AuxPanelService");
require("./AuxPanelPartDirective");
require("./AuxPanelDirective");
__export(require("./AuxPanelService"));

},{"./AuxPanelDirective":1,"./AuxPanelPartDirective":2,"./AuxPanelService":3}],5:[function(require,module,exports){
'use strict';
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

},{"./auxpanel/index":4,"./layouts/CardDirective":6,"./layouts/DialogDirective":7,"./layouts/DocumentDirective":8,"./layouts/MainDirective":9,"./layouts/SimpleDirective":10,"./layouts/TilesDirective":11,"./media/index":14}],6:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
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
            $rootScope.$on(MediaService_1.MainResizedEvent, listener);
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

},{"../media/MediaService":12}],7:[function(require,module,exports){
'use strict';
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

},{}],8:[function(require,module,exports){
'use strict';
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

},{}],9:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var ResizeFunctions_1 = require("../media/ResizeFunctions");
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
            this.$rootScope.$emit(MediaService_1.MainResizedEvent, MediaService_1.MainBreakpointStatuses);
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

},{"../media/MediaService":12,"../media/ResizeFunctions":13}],10:[function(require,module,exports){
'use strict';
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

},{}],11:[function(require,module,exports){
'use strict';
tilesDirective.$inject = ['$rootScope'];
Object.defineProperty(exports, "__esModule", { value: true });
var ResizeFunctions_1 = require("../media/ResizeFunctions");
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
        $rootScope.$on(MediaService_1.MainResizedEvent, function () { _this.resize(false); });
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
            this.$rootScope.$emit(MediaService_1.LayoutResizedEvent);
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

},{"../media/MediaService":12,"../media/ResizeFunctions":13}],12:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
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
        if (breakpoints == null)
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
exports.MainResizedEvent = 'pipMainResized';
exports.LayoutResizedEvent = 'pipLayoutResized';
exports.MainBreakpoints = new MediaBreakpoints(639, 716, 1024, 1439);
exports.MainBreakpointStatuses = new MediaBreakpointStatuses();
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
                exports.MainBreakpoints = value || new MediaBreakpoints(639, 716, 1024, 1439);
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

},{}],13:[function(require,module,exports){
'use strict';
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
    this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
    this.contentDocument.defaultView.addEventListener('resize', resizeListener);
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
            element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
            element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
        }
    }
}
exports.removeResizeListener = removeResizeListener;

},{}],14:[function(require,module,exports){
'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipMedia', []);
require("./MediaService");
require("./ResizeFunctions");
__export(require("./MediaService"));
__export(require("./ResizeFunctions"));

},{"./MediaService":12,"./ResizeFunctions":13}]},{},[5])(5)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).behaviors = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('pipBehaviors', [
        'pipFocused',
        'pipSelected',
        'pipInfiniteScroll',
        'pipUnsavedChanges',
        'pipDraggable',
        'pipShortcuts'
    ]);
})();

},{}],2:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module("pipDraggable", []);
    thisModule.service('pipDraggable', function () {
        var scope = this;
        scope.inputEvent = function (event) {
            if (angular.isDefined(event.touches)) {
                return event.touches[0];
            }
            else if (angular.isDefined(event.originalEvent) && angular.isDefined(event.originalEvent.touches)) {
                return event.originalEvent.touches[0];
            }
            return event;
        };
    });
    thisModule.directive('pipDrag', ['$rootScope', '$parse', '$document', '$window', 'pipDraggable', function ($rootScope, $parse, $document, $window, pipDraggable) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.value = attrs.ngDrag;
                var LONG_PRESS = 50;
                var offset, _centerAnchor = false, _mx, _my, _tx, _ty, _mrx, _mry;
                var _hasTouch = ('ontouchstart' in window) || window.DocumentTouch;
                var _pressEvents = 'touchstart mousedown';
                var _moveEvents = 'touchmove mousemove';
                var _releaseEvents = 'touchend mouseup';
                var _dragHandle;
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
                var verticalScroll = toBoolean(attrs.pipVerticalScroll) || true, horizontalScroll = toBoolean(attrs.pipHorizontalScroll) || true, activationDistance = parseFloat(attrs.pipActivationDistance) || 75, scrollDistance = parseFloat(attrs.pipScrollDistance) || 50, scrollParent = false, scrollContainer = angular.element(window), scrollContainerGetter = $parse(attrs.pipScrollContainer);
                var _deregisterRootMoveListener = angular.noop;
                initialize();
                return;
                function initialize() {
                    element.attr('pip-draggable', 'false');
                    var dragHandles;
                    if (element[0].querySelectorAll) {
                        dragHandles = angular.element(element[0].querySelectorAll('[pip-drag-handle]'));
                    }
                    else {
                        dragHandles = element.find('[pip-drag-handle]');
                    }
                    if (dragHandles.length) {
                        _dragHandle = dragHandles;
                    }
                    toggleListeners(true);
                    if (scrollParent) {
                        scrollContainer = angular.element(element.parent());
                    }
                    else if (attrs.pipScrollContainer) {
                        scrollContainer = angular.element(scrollContainerGetter(scope));
                    }
                    else {
                        scrollContainer = angular.element(window);
                    }
                }
                function toBoolean(value) {
                    if (value == null)
                        return false;
                    if (!value)
                        return false;
                    value = value.toString().toLowerCase();
                    return value == '1' || value == 'true';
                }
                function toggleListeners(enable) {
                    if (!enable)
                        return;
                    scope.$on('$destroy', onDestroy);
                    scope.$watch(attrs.pipDrag, onEnableChange);
                    scope.$watch(attrs.pipCenterAnchor, onCenterAnchor);
                    if (_dragHandle) {
                        _dragHandle.on(_pressEvents, onpress);
                    }
                    else {
                        element.on(_pressEvents, onpress);
                    }
                    if (!_hasTouch && element[0].nodeName.toLowerCase() == "img") {
                        element.on('mousedown', function () {
                            return false;
                        });
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
                    return (angular.isDefined(angular.element(evt.target).attr("pip-cancel-drag")));
                }
                function onpress(evt) {
                    if (!_dragEnabled)
                        return;
                    if (isClickableElement(evt)) {
                        return;
                    }
                    if (evt.type == "mousedown" && evt.button != 0) {
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
                    }
                    else {
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
                    if (!_dragEnabled)
                        return;
                    evt.preventDefault();
                    offset = element[0].getBoundingClientRect();
                    if (allowTransform)
                        _dragOffset = offset;
                    else {
                        _dragOffset = { left: document.body.scrollLeft, top: document.body.scrollTop };
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
                    }
                    else {
                        _tx = _mx - _mrx - $window.pageXOffset;
                        _ty = _my - _mry - $window.pageYOffset;
                    }
                    $document.on(_moveEvents, onmove);
                    $document.on(_releaseEvents, onrelease);
                    _deregisterRootMoveListener = $rootScope.$on('draggable:_triggerHandlerMove', function (event, origEvent) {
                        onmove(origEvent);
                    });
                }
                function onmove(evt) {
                    if (!_dragEnabled)
                        return;
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
                                onDragStartCallback(scope, { $data: _data, $event: evt });
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
                    }
                    else {
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
                            onDragStopCallback(scope, { $data: _data, $event: evt });
                        });
                    }
                    _deregisterRootMoveListener();
                }
                function onDragComplete(evt) {
                    if (!onDragSuccessCallback)
                        return;
                    scope.$apply(function () {
                        onDragSuccessCallback(scope, { $data: _data, $event: evt });
                    });
                }
                function reset() {
                    if (allowTransform)
                        element.css({ transform: '', 'z-index': '', '-webkit-transform': '', '-ms-transform': '' });
                    else {
                        element.css({ 'position': _elementStyle.position, top: _elementStyle.top, left: _elementStyle.left, 'z-index': '', width: _elementStyle.width });
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
                    }
                    else {
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
                    var scrollX = 0, scrollY = 0, offset = function (element) {
                        return element.offset() || { left: 0, top: 0 };
                    };
                    if (horizontalScroll) {
                        var containerLeft = offset(scrollContainer).left, containerWidth = scrollContainer.innerWidth(), containerRight = containerLeft + containerWidth;
                        if ((_mx - containerLeft) < activationDistance) {
                            scrollX = -scrollDistance;
                        }
                        else if ((containerRight - _mx) < activationDistance) {
                            scrollX = scrollDistance;
                        }
                    }
                    if (verticalScroll) {
                        var containerTop = offset(scrollContainer).top, containerHeight = scrollContainer.innerHeight(), containerBottom = containerTop + containerHeight;
                        if ((_my - containerTop) < activationDistance) {
                            scrollY = -scrollDistance + 30;
                        }
                        else if ((containerBottom - _my) < activationDistance) {
                            scrollY = scrollDistance - 30;
                        }
                    }
                    if (scrollX !== 0 || scrollY !== 0) {
                        var containerScrollLeft = scrollContainer.scrollLeft(), containerScrollTop = scrollContainer.scrollTop();
                        scrollContainer.scrollLeft(containerScrollLeft + scrollX);
                        scrollContainer.scrollTop(containerScrollTop + scrollY);
                    }
                }
            }
        };
    }]);
    thisModule.directive('pipDrop', ['$parse', '$timeout', '$window', '$document', 'pipDraggable', function ($parse, $timeout, $window, $document, pipDraggable) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.value = attrs.pipDrop;
                scope.isTouching = false;
                var _lastDropTouch = null;
                var _myid = scope.$id;
                var _dropEnabled = false;
                var onDropCallback = $parse(attrs.pipDropSuccess);
                var onDragStartCallback = $parse(attrs.pipDragStart);
                var onDragStopCallback = $parse(attrs.pipDragStop);
                var onDragMoveCallback = $parse(attrs.pipDragMove);
                initialize();
                return;
                function initialize() {
                    toggleListeners(true);
                }
                function toggleListeners(enable) {
                    if (!enable)
                        return;
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
                    if (!_dropEnabled)
                        return;
                    isTouching(obj.x, obj.y, obj.element);
                    if (attrs.pipDragStart) {
                        $timeout(function () {
                            onDragStartCallback(scope, { $data: obj.data, $event: obj });
                        });
                    }
                }
                function onDragMove(evt, obj) {
                    if (!_dropEnabled)
                        return;
                    isTouching(obj.x, obj.y, obj.element);
                    if (attrs.pipDragMove) {
                        $timeout(function () {
                            onDragMoveCallback(scope, { $data: obj.data, $event: obj });
                        });
                    }
                }
                function onDragEnd(evt, obj) {
                    if (!_dropEnabled || _myid === obj.uid) {
                        updateDragStyles(false, obj.element);
                        return;
                    }
                    if (isTouching(obj.x, obj.y, obj.element)) {
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
                            onDragStopCallback(scope, { $data: obj.data, $event: obj });
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
                    }
                    else if (_lastDropTouch == element) {
                        _lastDropTouch = null;
                        element.removeClass('pip-drag-enter');
                        dragElement.removeClass('pip-drag-over');
                    }
                }
                ;
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
    thisModule.directive('pipPreventDrag', ['$parse', '$timeout', function ($parse, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                initialize();
                return;
                function initialize() {
                    element.attr('pip-draggable', 'false');
                    toggleListeners(true);
                }
                function toggleListeners(enable) {
                    if (!enable)
                        return;
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

},{}],3:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module("pipFocused", []);
    thisModule.directive('pipFocused', ['$timeout', '$mdConstant', '$window', function ($timeout, $mdConstant, $window) {
        return {
            require: "?ngModel",
            link: function ($scope, $element, $attrs) {
                var controls, controlsLength, withHidden = $attrs.pipWithHidden, opacityDelta = 0.4, opacityLimit = 0.5, _color, focusedColor = $attrs.pipFocusedColor ? $attrs.pipFocusedColor : null, reInit = $attrs.pipFocusedRebind ? $attrs.pipFocusedRebind : null, focusedTabindex = $attrs.pipFocusedTabindex ? parseInt($attrs.pipFocusedTabindex) || 0 : 0, isOpacity = $attrs.pipFocusedOpacity ? toBoolean($attrs.pipFocusedOpacity) : false;
                $timeout(init);
                $element.on('keydown', keydownListener);
                if ($attrs.ngModel) {
                    $scope.$watch($attrs.ngModel, function () {
                        $timeout(init);
                    }, true);
                }
                if ($attrs.pipFocusedData) {
                    $attrs.$observe('pipFocusedData', function () {
                        $timeout(init);
                    }, true);
                }
                function toBoolean(value) {
                    if (value == null)
                        return false;
                    if (!value)
                        return false;
                    value = value.toString().toLowerCase();
                    return value == '1' || value == 'true';
                }
                ;
                function rgba(color) {
                    if (focusedColor) {
                        return focusedColor;
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
                    if (opacity < opacityLimit) {
                        opacity += opacityDelta;
                    }
                    else {
                        opacity -= opacityDelta;
                    }
                    return 'rgba(' + red + ', ' + blue + ', ' + green + ', ' + opacity + ')';
                }
                function setTabindex(element, value) {
                    element.attr('tabindex', value);
                }
                function checkTabindex(controls) {
                    var index = _.findIndex(controls, function (c) {
                        return c['tabindex'] > -1;
                    });
                    if (index == -1 && controls.length > 0) {
                        setTabindex(angular.element(controls[0]), focusedTabindex);
                    }
                }
                function init() {
                    var selector = withHidden ? '.pip-focusable' : '.pip-focusable:visible';
                    controls = $element.find(selector);
                    controlsLength = controls.length;
                    checkTabindex(controls);
                    controls.on('focus', function () {
                        if ($(this).hasClass('md-focused')) {
                            return;
                        }
                        if (reInit) {
                            init();
                        }
                        $element.addClass('pip-focused-container');
                        if (isOpacity) {
                            var ell = angular.element($(this)[0]);
                            _color = $(this).css('backgroundColor');
                            $(this).css('backgroundColor', rgba(_color));
                            $(this).addClass('md-focused');
                        }
                        else {
                            $(this).addClass('md-focused md-focused-opacity');
                        }
                    }).on('focusout', function () {
                        if (!$(this).hasClass('md-focused')) {
                            return;
                        }
                        $element.removeClass('pip-focused-container');
                        if (isOpacity) {
                            $(this).css('backgroundColor', "");
                            $(this).removeClass('md-focused md-focused-opacity');
                        }
                        else {
                            $(this).removeClass('md-focused');
                        }
                    });
                }
                function keydownListener(e) {
                    var keyCode = e.which || e.keyCode;
                    if (keyCode == $mdConstant.KEY_CODE.LEFT_ARROW ||
                        keyCode == $mdConstant.KEY_CODE.UP_ARROW ||
                        keyCode == $mdConstant.KEY_CODE.RIGHT_ARROW ||
                        keyCode == $mdConstant.KEY_CODE.DOWN_ARROW) {
                        e.preventDefault();
                        var increment = (keyCode == $mdConstant.KEY_CODE.RIGHT_ARROW || keyCode == $mdConstant.KEY_CODE.DOWN_ARROW) ? 1 : -1, moveToControl = controls.index(controls.filter(".md-focused")) + increment;
                        if (moveToControl >= 0 && moveToControl < controlsLength) {
                            controls[moveToControl].focus();
                        }
                    }
                }
            }
        };
    }]);
})();

},{}],4:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module("pipInfiniteScroll", []);
    thisModule.directive('pipInfiniteScroll', ['$rootScope', '$window', '$interval', '$parse', function ($rootScope, $window, $interval, $parse) {
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
            link: function ($scope, $element, $attrs) {
                var checkWhenEnabled = null, scrollContainer, immediateCheck = true, scrollDistance = null, scrollEnabled = null, unregisterEventListener = null, useDocumentBottom = false, windowElement = angular.element($window);
                function height(element) {
                    element = element[0] || element;
                    if (isNaN(element.offsetHeight)) {
                        return element.document.documentElement.clientHeight;
                    }
                    else {
                        return element.offsetHeight;
                    }
                }
                ;
                function offsetTop(element) {
                    if (!element[0].getBoundingClientRect || element.css('none')) {
                        return;
                    }
                    return element[0].getBoundingClientRect().top + pageYOffset(element);
                }
                ;
                function pageYOffset(element) {
                    element = element[0] || element;
                    if (isNaN(window.pageYOffset)) {
                        return element.document.documentElement.scrollTop;
                    }
                    else {
                        return element.ownerDocument.defaultView.pageYOffset;
                    }
                }
                ;
                var onContainerScroll = function () {
                    var containerBottom, containerTopOffset, elementBottom, remaining, shouldScroll;
                    if (scrollContainer === windowElement) {
                        containerBottom = height(scrollContainer) + pageYOffset(scrollContainer[0].document.documentElement);
                        elementBottom = offsetTop($element) + height($element);
                    }
                    else {
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
                            }
                            else {
                                return $scope.$apply($scope.pipInfiniteScroll);
                            }
                        }
                    }
                    else {
                        return checkWhenEnabled = false;
                    }
                };
                if (THROTTLE_MILLISECONDS != null) {
                    onContainerScroll = _.throttle(onContainerScroll, THROTTLE_MILLISECONDS);
                }
                $scope.$on('$destroy', function () {
                    scrollContainer.unbind('scroll', onContainerScroll);
                    if (unregisterEventListener != null) {
                        unregisterEventListener();
                        return unregisterEventListener = null;
                    }
                });
                function handleScrollDistance(v) {
                    return scrollDistance = parseFloat(v) || 0;
                }
                ;
                $scope.$watch('pipScrollDistance', handleScrollDistance);
                handleScrollDistance($scope.pipScrollDistance);
                function handleScrollDisabled(v) {
                    scrollEnabled = !v;
                    if (scrollEnabled && checkWhenEnabled) {
                        checkWhenEnabled = false;
                        return onContainerScroll();
                    }
                }
                ;
                $scope.$watch('pipScrollDisabled', handleScrollDisabled);
                handleScrollDisabled($scope.pipScrollDisabled);
                function handleScrollUseDocumentBottom(v) {
                    return useDocumentBottom = v;
                }
                ;
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
                }
                ;
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
                    }
                    else if (typeof newContainer.append === 'function') {
                        newContainer = angular.element(newContainer[newContainer.length - 1]);
                    }
                    else if (typeof newContainer === 'string') {
                        newContainer = $element.parents().find(newContainer);
                    }
                    if (newContainer != null && (!Array.isArray(newContainer) ||
                        (Array.isArray(newContainer) && newContainer.length > 0))) {
                        return changeContainer(newContainer);
                    }
                    else {
                        throw new Error("Invalid pip-scroll-container attribute.");
                    }
                }
                ;
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
                return $interval((function () {
                    if (immediateCheck) {
                        return onContainerScroll();
                    }
                }), 0, 1);
            }
        };
    }]);
})();

},{}],5:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var ShortcutOption = (function () {
    function ShortcutOption() {
    }
    return ShortcutOption;
}());
exports.ShortcutOption = ShortcutOption;
var KeyboardEvent = (function () {
    function KeyboardEvent() {
    }
    return KeyboardEvent;
}());
KeyboardEvent.Keydown = 'keydown';
KeyboardEvent.Keyup = 'keyup';
KeyboardEvent.Keypress = 'keypress';
exports.KeyboardEvent = KeyboardEvent;
var KeyboardShortcut = (function () {
    KeyboardShortcut.$inject = ['element', 'shorcutCombination', 'option', 'callback'];
    function KeyboardShortcut(element, shorcutCombination, option, callback) {
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
    return KeyboardShortcut;
}());
exports.KeyboardShortcut = KeyboardShortcut;

},{}],6:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var KeyboardShortcut_1 = require("./KeyboardShortcut");
var ShortcutsRegister = (function () {
    ShortcutsRegister.$inject = ['$log', 'option'];
    function ShortcutsRegister($log, option) {
        "ngInject";
        this._log = $log;
        this._defaultOption = option ? _.defaults(option, this.getDefaultOption()) : this.getDefaultOption();
        this._shortcuts = {};
    }
    ShortcutsRegister.prototype.getDefaultOption = function () {
        var defaultOption = {
            Type: KeyboardShortcut_1.KeyboardEvent.Keydown,
            Propagate: false,
            DisableInInput: false,
            Target: document,
            Keycode: null
        };
        return defaultOption;
    };
    ShortcutsRegister.prototype.checkAddShortcut = function (element, shorcutCombination, callback) {
        if (!element) {
            this._log.error('Register shortcut: element undentified!');
            return false;
        }
        if (!shorcutCombination) {
            this._log.error('Register shortcut: shorcut combination undentified!');
            return false;
        }
        if (!callback) {
            this._log.error('Register shortcut: shorcut callback undentified!');
            return false;
        }
        return true;
    };
    Object.defineProperty(ShortcutsRegister.prototype, "shorcuts", {
        get: function () {
            return this._shortcuts;
        },
        enumerable: true,
        configurable: true
    });
    ShortcutsRegister.prototype.add = function (shorcutName, callback, option) {
        this.remove(shorcutName);
        var shorcutOption = option ? _.defaults(option, this._defaultOption) : this._defaultOption;
        var shorcutCombination = shorcutName.toLowerCase();
        var element = shorcutOption.Target;
        if (typeof shorcutOption.Target == 'string') {
            element = document.getElementById(shorcutOption.Target);
        }
        else {
            element = shorcutOption.Target;
        }
        if (!this.checkAddShortcut(element, shorcutCombination, callback)) {
            return;
        }
        var newKeyboardShortcut = new KeyboardShortcut_1.KeyboardShortcut(element, shorcutCombination, shorcutOption, callback);
        this._shortcuts[shorcutCombination] = newKeyboardShortcut;
        if (element.addEventListener) {
            element.addEventListener(shorcutOption.Type, newKeyboardShortcut.eventCallback, false);
        }
        else if (element.attachEvent) {
            element.attachEvent('on' + shorcutOption.Type, newKeyboardShortcut.eventCallback);
        }
        else {
            element.on(shorcutOption.Type, newKeyboardShortcut.eventCallback);
        }
    };
    ShortcutsRegister.prototype.remove = function (shorcutName) {
        var shortcutCombination = shorcutName.toLowerCase();
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
    return ShortcutsRegister;
}());
exports.ShortcutsRegister = ShortcutsRegister;
var ShortcutsRegisterProvider = (function () {
    function ShortcutsRegisterProvider() {
    }
    Object.defineProperty(ShortcutsRegisterProvider.prototype, "option", {
        get: function () {
            return this._option;
        },
        set: function (value) {
            this._option = value || new KeyboardShortcut_1.ShortcutOption();
        },
        enumerable: true,
        configurable: true
    });
    ShortcutsRegisterProvider.prototype.$get = ['$log', function ($log) {
        "ngInject";
        if (this._service == null)
            this._service = new ShortcutsRegister($log, this._option);
        return this._service;
    }];
    return ShortcutsRegisterProvider;
}());
angular
    .module('pipShortcuts')
    .provider('pipShortcutsRegister', ShortcutsRegisterProvider);

},{"./KeyboardShortcut":5}],7:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var ShortcutController = (function () {
    ShortcutController.$inject = ['$element', '$attrs', '$scope', '$log', '$parse', 'pipShortcutsRegister'];
    function ShortcutController($element, $attrs, $scope, $log, $parse, pipShortcutsRegister) {
        "ngInject";
        var _this = this;
        this._log = $log;
        if ($attrs.pipShortcutAction) {
            this.actionShortcuts = $parse($attrs.pipShortcutAction);
            var a1 = $attrs.pipShortcutAction;
            this.actionShortcuts($scope, { $event: {} });
        }
        else {
            this._log.error('Shorcunt action does not set.');
            return;
        }
        if ($attrs.pipShortcutName && _.isString($attrs.pipShortcutName)) {
            this.nameShortcuts = $attrs.pipShortcutName;
        }
        else {
            this._log.error('Shorcunt name does not set.');
            return;
        }
        this.options = $attrs.pipShorcutOptions ? $attrs.pipShorcutOptions : {};
        this.options.Target = $element;
        pipShortcutsRegister.add(this.nameShortcuts, function (e) {
            _this.actionShortcuts($scope, { $event: { 'e': e } });
        }, this.options);
    }
    ShortcutController.prototype.keypressShortcut = function (action) {
        this.actionShortcuts();
    };
    return ShortcutController;
}());
(function () {
    shortcutsDirective.$inject = ['$parse'];
    function shortcutsDirective($parse) {
        return {
            restrict: 'A',
            scope: false,
            controller: ShortcutController
        };
    }
    angular
        .module('pipShortcuts')
        .directive('pipShortcut', shortcutsDirective);
})();

},{}],8:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortcutsChangedEvent = 'pipShortcutsChanged';
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
var ShortcutsService = (function () {
    function ShortcutsService(config, $rootScope, $window, $location, $injector, pipShortcutsRegister) {
        this._config = config;
        this._oldConfig = _.cloneDeep(this._config);
        this._rootScope = $rootScope;
        this._window = $window;
        this._location = $location;
        this._injector = $injector;
        this._pipShortcutsRegister = pipShortcutsRegister;
        this.addShortcuts(this._config.globalShortcuts);
        this.addShortcuts(this._config.localShortcuts);
    }
    ShortcutsService.prototype.sendChangeEvent = function () {
        this.removeShortcuts(this._oldConfig.globalShortcuts);
        this.removeShortcuts(this._oldConfig.localShortcuts);
        this.addShortcuts(this._config.globalShortcuts);
        this.addShortcuts(this._config.localShortcuts);
        this._rootScope.$emit(exports.ShortcutsChangedEvent, this._config);
        this._oldConfig = _.cloneDeep(this._config);
    };
    ShortcutsService.prototype.removeShortcuts = function (collection) {
        var _this = this;
        _.each(collection, function (k) {
            _this._pipShortcutsRegister.remove(k.shortcut);
        });
    };
    ShortcutsService.prototype.keypressShortcut = function (shorcut, event) {
        if (shorcut.access && _.isFunction(shorcut.access)) {
            if (!shorcut.access(event)) {
                return;
            }
        }
        if (shorcut.keypress) {
            shorcut.keypress(event);
            return;
        }
        if (shorcut.href) {
            this._window.location.href = shorcut.href;
            return;
        }
        if (shorcut.url) {
            this._location.url(shorcut.url);
            return;
        }
        if (shorcut.state) {
            if (this._injector.has('$state')) {
                var $state = this._injector.get('$state');
                $state['go'](shorcut.state, shorcut.stateParams);
            }
            return;
        }
        if (shorcut.event) {
            this._rootScope.$broadcast(shorcut.event);
        }
        else {
            this._rootScope.$broadcast('pipShortcutKeypress', shorcut.shortcut);
        }
    };
    ShortcutsService.prototype.addShortcuts = function (collection) {
        var _this = this;
        var generalOptions = this._config.defaultOptions ? this._config.defaultOptions : {};
        _.each(collection, function (k) {
            var option = k.options ? k.options : generalOptions;
            var target;
            target = k.target ? k.target : k.targetId;
            option.Target = target;
            _this._pipShortcutsRegister.add(k.shortcut, function (e) {
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
    ShortcutsService.prototype.on = function (globalShortcuts, localShortcuts) {
        if (globalShortcuts && _.isArray(globalShortcuts)) {
            this._config.globalShortcuts = globalShortcuts;
        }
        if (localShortcuts && _.isArray(localShortcuts)) {
            this._config.localShortcuts = localShortcuts;
        }
        this.sendChangeEvent();
    };
    ShortcutsService.prototype.onLocal = function (localShortcuts) {
        if (localShortcuts && _.isArray(localShortcuts)) {
            this._config.localShortcuts = localShortcuts;
        }
        this.sendChangeEvent();
    };
    ShortcutsService.prototype.off = function () {
        this._config.globalShortcuts = [];
        this._config.localShortcuts = [];
        this.sendChangeEvent();
    };
    return ShortcutsService;
}());
var ShortcutsProvider = (function () {
    function ShortcutsProvider() {
        this._config = new ShortcutsConfig();
    }
    Object.defineProperty(ShortcutsProvider.prototype, "config", {
        get: function () {
            return this._config;
        },
        set: function (value) {
            this._config = value || new ShortcutsConfig();
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
    Object.defineProperty(ShortcutsProvider.prototype, "localShortcuts", {
        get: function () {
            return this._config.localShortcuts;
        },
        set: function (value) {
            this._config.localShortcuts = value || [];
        },
        enumerable: true,
        configurable: true
    });
    ShortcutsProvider.prototype.$get = ['$rootScope', '$window', '$location', '$injector', 'pipShortcutsRegister', function ($rootScope, $window, $location, $injector, pipShortcutsRegister) {
        "ngInject";
        if (this._service == null)
            this._service = new ShortcutsService(this._config, $rootScope, $window, $location, $injector, pipShortcutsRegister);
        return this._service;
    }];
    return ShortcutsProvider;
}());
angular
    .module('pipShortcuts')
    .provider('pipShortcuts', ShortcutsProvider);

},{}],9:[function(require,module,exports){
'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipShortcuts', ['ngMaterial', 'ui.router']);
require("./ShorcutsRegisterService");
require("./ShortcutsService");
require("./ShortcutDirective");
__export(require("./ShortcutsService"));
__export(require("./ShorcutsRegisterService"));

},{"./ShorcutsRegisterService":6,"./ShortcutDirective":7,"./ShortcutsService":8}],10:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module("pipSelected", []);
    thisModule.directive('pipSelected', ['$parse', '$mdConstant', '$timeout', function ($parse, $mdConstant, $timeout) {
        return {
            restrict: 'A',
            scope: false,
            link: function ($scope, $element, $attrs) {
                var indexGetter = $attrs.pipSelected ? $parse($attrs.pipSelected) : null, indexSetter = indexGetter ? indexGetter.assign : null, idGetter = $attrs.pipSelectedId ? $parse($attrs.pipSelectedId) : null, idSetter = idGetter ? idGetter.assign : null, changeGetter = $attrs.pipSelect ? $parse($attrs.pipSelect) : null, enterSpaceGetter = $attrs.pipEnterSpacePress ? $parse($attrs.pipEnterSpacePress) : null, noScroll = toBoolean($attrs.pipNoScroll), modifier = toBoolean($attrs.pipSkipHidden) ? ':visible' : '', className = toBoolean($attrs.pipTreeList) ? '.pip-selectable-tree' : '.pip-selectable', selectedIndex = indexGetter($scope), currentElementTabinex = $element.attr('tabindex'), pipSelectedWatch = $attrs.pipSelectedWatch, isScrolled = false;
                var touchStartX, touchStartY, trackingClick, trackingClickStart, targetElement, lastClickTime, cancelNextClick;
                var touchBoundary = 10, tapdelay = 200, tapTimeout = 700;
                $element.attr('tabindex', currentElementTabinex || 0);
                $element.on('click', className, onClickEvent);
                $element.on('touchstart', className, onTouchStart);
                $element.on('touchmove', className, onTouchMove);
                $element.on('touchend', className, onTouchEnd);
                $element.on('touchcancel', className, onTouchCancel);
                $element.on('keydown', onKeyDown);
                $element.on('focusin', onFocusIn);
                $element.on('focusout', onFocusOut);
                if (!toBoolean($attrs.pipTreeList)) {
                    $scope.$watch(indexGetter, function (newSelectedIndex) {
                        selectItem({ itemIndex: newSelectedIndex });
                    });
                }
                else {
                    $scope.$watch(idGetter, function (newSelectedId) {
                        setTimeout(function () {
                            selectItem({ itemId: newSelectedId, raiseEvent: true });
                        }, 0);
                    });
                }
                if (pipSelectedWatch) {
                    $scope.$watch(pipSelectedWatch, function () {
                        setTimeout(function () {
                            selectedIndex = indexGetter($scope);
                            selectItem({ itemIndex: selectedIndex });
                        }, 100);
                    });
                }
                selectItem({ itemIndex: selectedIndex, items: $element.find(className) });
                function toBoolean(value) {
                    if (value == null)
                        return false;
                    if (!value)
                        return false;
                    value = value.toString().toLowerCase();
                    return value == '1' || value == 'true';
                }
                ;
                function selectItem(itemParams) {
                    if (isScrolled)
                        return;
                    var itemIndex = itemParams.itemIndex, itemId = itemParams.itemId, items = itemParams.items || $element.find(className + modifier), itemsLength = items.length, item = (function () {
                        if (itemParams.item)
                            return itemParams.item;
                        if (itemIndex === undefined && itemIndex === -1) {
                            itemIndex = items.index(items.filter('[pip-id=' + itemId + ']'));
                        }
                        if (itemIndex >= 0 && itemIndex < itemsLength) {
                            return items[itemIndex];
                        }
                    }()), raiseEvent = itemParams.raiseEvent;
                    if (item) {
                        $element.find(className).removeClass('selected md-focused');
                        item = angular.element(item)
                            .addClass('selected md-focused')
                            .focus();
                        if (!noScroll)
                            scrollToItem(item);
                        if (raiseEvent)
                            defineSelectedIndex(items);
                    }
                }
                ;
                function defineSelectedIndex(items) {
                    var oldSelectedIndex = selectedIndex;
                    selectedIndex = -1;
                    for (var index = 0; index < items.length; index++) {
                        if ($(items[index]).hasClass('selected')) {
                            selectedIndex = index;
                            break;
                        }
                    }
                    if (oldSelectedIndex != selectedIndex && selectedIndex !== -1) {
                        $scope.$apply(updateIndex);
                    }
                    else {
                        $scope.$apply(onSelect);
                    }
                    function updateIndex() {
                        var selectedItem = angular.element(items[selectedIndex]), selectedId = selectedItem.attr('pip-id');
                        if (indexSetter)
                            indexSetter($scope, selectedIndex);
                        if (idSetter)
                            idSetter($scope, selectedId);
                        onSelect();
                    }
                    ;
                    function onSelect() {
                        var selectedItem = angular.element(items[selectedIndex]), selectedId = selectedItem.attr('pip-id');
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
                    }
                }
                ;
                function scrollToItem($item) {
                    if (noScroll)
                        return;
                    var containerTop = $element.offset().top, containerHeight = $element.height(), containerBottom = containerTop + containerHeight, itemTop = $item.offset().top, itemHeight = $item.outerHeight(true), itemBottom = itemTop + itemHeight, containerScrollTop = $element.scrollTop();
                    isScrolled = true;
                    setTimeout(function () {
                        isScrolled = false;
                    }, 100);
                    if (containerTop > itemTop) {
                        $element.scrollTop(containerScrollTop + itemTop - containerTop);
                    }
                    else if (containerBottom < itemBottom) {
                        $element.scrollTop(containerScrollTop + itemBottom - containerBottom);
                    }
                }
                ;
                function getTargetElementFromEventTarget(eventTarget) {
                    if (eventTarget.nodeType === Node.TEXT_NODE) {
                        return eventTarget.parentNode;
                    }
                    return eventTarget;
                }
                ;
                function touchHasMoved(event) {
                    var touch = event.changedTouches[0], boundary = touchBoundary;
                    if (Math.abs(touch.pageX - touchStartX) > boundary || Math.abs(touch.pageY - touchStartY) > boundary) {
                        return true;
                    }
                    return false;
                }
                ;
                function onClickEvent(event) {
                    selectItem({ item: event.currentTarget, raiseEvent: true });
                }
                function onTouchStart(ev) {
                    var event = ev.originalEvent;
                    if (event['targetTouches'].length > 1) {
                        return true;
                    }
                    var targetElement = getTargetElementFromEventTarget(event.target);
                    var touch = event['targetTouches'][0];
                    trackingClick = true;
                    trackingClickStart = event.timeStamp;
                    targetElement = targetElement;
                    touchStartX = touch.pageX;
                    touchStartY = touch.pageY;
                    if ((event.timeStamp - lastClickTime) < tapdelay) {
                    }
                    return true;
                }
                function onTouchMove(ev) {
                    if (!trackingClick) {
                        return true;
                    }
                    var event = ev.originalEvent;
                    if (targetElement !== getTargetElementFromEventTarget(event.target) || touchHasMoved(event)) {
                        trackingClick = false;
                        targetElement = null;
                    }
                    return true;
                }
                function onTouchEnd(ev) {
                    var forElement, newTrackingClickStart, targetTagName, scrollParent, touch, newtargetElement = targetElement;
                    if (!trackingClick) {
                        return true;
                    }
                    event = ev.originalEvent;
                    if ((event.timeStamp - lastClickTime) < tapdelay) {
                        cancelNextClick = true;
                        return true;
                    }
                    if ((event.timeStamp - trackingClickStart) > tapTimeout) {
                        return true;
                    }
                    cancelNextClick = false;
                    lastClickTime = event.timeStamp;
                    newTrackingClickStart = trackingClickStart;
                    trackingClick = false;
                    trackingClickStart = 0;
                    selectItem({ item: ev.currentTarget, raiseEvent: true });
                    return false;
                }
                function onTouchCancel(ev) {
                    trackingClick = false;
                    targetElement = null;
                }
                function onKeyDown(e) {
                    var keyCode = e.which || e.keyCode;
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
                    }
                    else if (keyCode == $mdConstant.KEY_CODE.LEFT_ARROW || keyCode == $mdConstant.KEY_CODE.RIGHT_ARROW ||
                        keyCode == $mdConstant.KEY_CODE.UP_ARROW || keyCode == $mdConstant.KEY_CODE.DOWN_ARROW) {
                        e.preventDefault();
                        e.stopPropagation();
                        var items = $element.find(className + modifier), inc = (keyCode == $mdConstant.KEY_CODE.RIGHT_ARROW || keyCode == $mdConstant.KEY_CODE.DOWN_ARROW) ? 1 : -1, newSelectedIndex = selectedIndex + inc;
                        selectItem({ itemIndex: newSelectedIndex, items: items, raiseEvent: true });
                    }
                }
                function onFocusIn(event) {
                    var items, selectedItem = $element.find(className + '.selected');
                    selectedItem.addClass('md-focused');
                    if (selectedItem.length === 0) {
                        selectedIndex = indexGetter($scope);
                        items = $element.find(className + modifier);
                        selectItem({ itemIndex: selectedIndex || 0, items: items, raiseEvent: true });
                    }
                }
                function onFocusOut(event) {
                    $element.find(className + '.md-focused' + modifier).removeClass('md-focused');
                }
            }
        };
    }]);
})();

},{}],11:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module("pipUnsavedChanges", []);
    thisModule.directive("pipUnsavedChanges", ['$window', '$rootScope', function ($window, $rootScope) {
        return {
            restrict: 'AE',
            scope: {
                unsavedChangesAvailable: '&pipUnsavedChangesAvailable',
                unsavedChangesMessage: '@pipUnsavedChangesMessage',
                afterLeave: '&pipUnsavedChangesAfterLeave',
                cancelLeave: '&pipUnsavedChangesCancelLeave'
            },
            link: function ($scope) {
                $window.onbeforeunload = function () {
                    if ($scope.unsavedChangesAvailable()) {
                        $rootScope.$routing = false;
                        return $scope.unsavedChangesMessage;
                    }
                };
                var unbindFunc = $scope.$on('$stateChangeStart', function (event) {
                    if ($scope.unsavedChangesAvailable() && !$window.confirm($scope.unsavedChangesMessage)) {
                        $rootScope.$routing = false;
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
        };
    }]);
})();

},{}]},{},[1,2,3,4,9,5,6,7,8,10,11])(11)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).controls = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DEFAULT_COLORS = ['purple', 'lightgreen', 'green', 'darkred', 'pink', 'yellow', 'cyan'];
var ColorPickerController = (function () {
    function ColorPickerController($scope, $element, $attrs, $timeout) {
        this._$timeout = $timeout;
        this._$scope = $scope;
        this.class = $attrs.class || '';
        this.colors = !$scope['vm']['colors'] ||
            _.isArray($scope['vm']['colors']) && $scope['vm']['colors'].length === 0 ? DEFAULT_COLORS : $scope['vm']['colors'];
        this.colorChange = $scope['vm']['colorChange'] || null;
        this.currentColor = $scope['vm']['currentColor'] || this.colors[0];
        this.currentColorIndex = this.colors.indexOf(this.currentColor);
        this.ngDisabled = $scope['vm']['ngDisabled'] || false;
    }
    ColorPickerController.prototype.$onChanges = function (changes) {
        this.colors = _.isArray(changes['colors'].currentValue) && changes['colors'].currentValue.length !== 0 ?
            changes['colors'].currentValue : DEFAULT_COLORS;
        this.currentColor = changes['currentColor'].currentValue || this.colors[0];
    };
    ColorPickerController.prototype.disabled = function () {
        if (this.ngDisabled) {
            return true;
        }
        return false;
    };
    ;
    ColorPickerController.prototype.selectColor = function (index) {
        var _this = this;
        if (this.disabled()) {
            return;
        }
        this.currentColorIndex = index;
        this.currentColor = this.colors[this.currentColorIndex];
        this._$timeout(function () {
            _this._$scope.$apply();
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
exports.ColorPickerController = ColorPickerController;
var pipColorPicker = {
    bindings: {
        ngDisabled: '<?ngDisabled',
        colors: '<pipColors',
        currentColor: '=ngModel',
        colorChange: '<?ngChange'
    },
    templateUrl: 'color_picker/color_picker.html',
    controller: ColorPickerController,
    controllerAs: 'vm'
};
angular
    .module('pipColorPicker', ['pipControls.Templates'])
    .component('pipColorPicker', pipColorPicker);

},{}],2:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('pipControls', [
        'pipMarkdown',
        'pipColorPicker',
        'pipRoutingProgress',
        'pipPopover',
        'pipImageSlider',
        'pipToasts',
        'pipControls.Translate'
    ]);
})();

},{}],3:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipControls.Translate', []);
    thisModule.filter('translate', ['$injector', function ($injector) {
        var pipTranslate = $injector.has('pipTranslate')
            ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate.translate(key) || key : key;
        };
    }]);
})();

},{}],4:[function(require,module,exports){
var pipImageSliderController = (function () {
    pipImageSliderController.$inject = ['$scope', '$element', '$attrs', '$parse', '$timeout', '$interval', 'pipImageSlider'];
    function pipImageSliderController($scope, $element, $attrs, $parse, $timeout, $interval, pipImageSlider) {
        var _this = this;
        this._index = 0;
        this.DEFAULT_INTERVAL = 4500;
        this.swipeStart = 0;
        this.sliderIndex = $scope['vm']['sliderIndex'];
        this._type = $scope['vm']['type']();
        this._interval = $scope['vm']['interval']();
        this._$attrs = $attrs;
        this._$interval = $interval;
        this._$scope = $scope;
        $scope['slideTo'] = this.slideToPrivate;
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
        $element.on('$destroy', function () {
            _this.stopInterval();
            pipImageSlider.removeSlider($attrs.id);
        });
    }
    pipImageSliderController.prototype.nextBlock = function () {
        this.restartInterval();
        this._newIndex = this._index + 1 === this._blocks.length ? 0 : this._index + 1;
        this._direction = 'next';
        this._throttled();
    };
    pipImageSliderController.prototype.prevBlock = function () {
        this.restartInterval();
        this._newIndex = this._index - 1 < 0 ? this._blocks.length - 1 : this._index - 1;
        this._direction = 'prev';
        this._throttled();
    };
    pipImageSliderController.prototype.slideToPrivate = function (nextIndex) {
        if (nextIndex === this._index || nextIndex > this._blocks.length - 1) {
            return;
        }
        this.restartInterval();
        this._newIndex = nextIndex;
        this._direction = nextIndex > this._index ? 'next' : 'prev';
        this._throttled();
    };
    pipImageSliderController.prototype.setIndex = function () {
        if (this._$attrs.pipImageIndex)
            this.sliderIndex = this._index;
    };
    pipImageSliderController.prototype.startInterval = function () {
        var _this = this;
        this._timePromises = this._$interval(function () {
            _this._newIndex = _this._index + 1 === _this._blocks.length ? 0 : _this._index + 1;
            _this._direction = 'next';
            _this._throttled();
        }, this._interval || this.DEFAULT_INTERVAL);
    };
    pipImageSliderController.prototype.stopInterval = function () {
        this._$interval.cancel(this._timePromises);
    };
    pipImageSliderController.prototype.restartInterval = function () {
        this.stopInterval();
        this.startInterval();
    };
    return pipImageSliderController;
}());
(function () {
    function pipImageSlider() {
        return {
            scope: {
                sliderIndex: '=pipImageIndex',
                type: '&pipAnimationType',
                interval: '&pipAnimationInterval'
            },
            bindToController: true,
            controller: pipImageSliderController,
            controllerAs: 'vm'
        };
    }
    angular
        .module('pipImageSlider', ['pipSliderButton', 'pipSliderIndicator', 'pipImageSlider.Service'])
        .directive('pipImageSlider', pipImageSlider);
})();

},{}],5:[function(require,module,exports){
var ImageSliderService = (function () {
    ImageSliderService.$inject = ['$timeout'];
    function ImageSliderService($timeout) {
        this.ANIMATION_DURATION = 550;
        this._sliders = {};
        this._$timeout = $timeout;
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
        this._$timeout(function () {
            nextBlock.addClass('animated').addClass('pip-show').removeClass('pip-next');
            prevBlock.addClass('animated').removeClass('pip-show');
        }, 100);
    };
    ImageSliderService.prototype.prevCarousel = function (nextBlock, prevBlock) {
        this._$timeout(function () {
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
(function () {
    'use strict';
    angular
        .module('pipImageSlider.Service', [])
        .service('pipImageSlider', ImageSliderService);
})();

},{}],6:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipSliderButton', []);
    thisModule.directive('pipSliderButton', function () {
        return {
            scope: {},
            controller: ['$scope', '$element', '$parse', '$attrs', 'pipImageSlider', function ($scope, $element, $parse, $attrs, pipImageSlider) {
                var type = $parse($attrs.pipButtonType)($scope), sliderId = $parse($attrs.pipSliderId)($scope);
                $element.on('click', function () {
                    if (!sliderId || !type) {
                        return;
                    }
                    pipImageSlider.getSliderScope(sliderId).vm[type + 'Block']();
                });
            }]
        };
    });
})();

},{}],7:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipSliderIndicator', []);
    thisModule.directive('pipSliderIndicator', function () {
        return {
            scope: false,
            controller: ['$scope', '$element', '$parse', '$attrs', 'pipImageSlider', function ($scope, $element, $parse, $attrs, pipImageSlider) {
                var sliderId = $parse($attrs.pipSliderId)($scope), slideTo = $parse($attrs.pipSlideTo)($scope);
                $element.css('cursor', 'pointer');
                $element.on('click', function () {
                    if (!sliderId || slideTo && slideTo < 0) {
                        return;
                    }
                    pipImageSlider.getSliderScope(sliderId).vm.slideToPrivate(slideTo);
                });
            }]
        };
    });
})();

},{}],8:[function(require,module,exports){
Config.$inject = ['$injector'];
function Config($injector) {
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
}
var MarkdownController = (function () {
    function MarkdownController($scope, $parse, $attrs, $element, $injector) {
        this._pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        this._$parse = $parse;
        this._$scope = $scope;
        this._$injector = $injector;
        this._$element = $element;
        this._$attrs = $attrs;
        this._text = $scope['$ctrl']['text'];
        this._isList = $scope['$ctrl']['isList'];
        this._clamp = $scope['$ctrl']['clamp'];
        this._rebind = $scope['$ctrl']['rebind'];
    }
    MarkdownController.prototype.$postLink = function () {
        this.bindText(this._text);
        this._$scope.$on('pipWindowResized', function () {
            if (this.bindText)
                this.bindText(this._text(this._$scope));
        });
        this._$element.addClass('pip-markdown');
    };
    MarkdownController.prototype.$onChanges = function (changes) {
        var newText = changes['text'].currentValue;
        if (this._rebind) {
            if (this._text !== newText) {
                this._text = newText;
                this.bindText(this._text);
            }
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
        isClamped = this._$attrs.pipLineCount && _.isNumber(this._clamp);
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
            height = 1.5 * this._clamp;
        }
        this._$element.html('<div' + (isClamped ? this._isList ? 'class="pip-markdown-content ' +
            'pip-markdown-list" style="max-height: ' + height + 'em">' :
            ' class="pip-markdown-content" style="max-height: ' + height + 'em">' : this._isList ?
            ' class="pip-markdown-list">' : '>') + textString + '</div>');
        this._$element.find('a').attr('target', 'blank');
        if (!this._isList && isClamped) {
            this._$element.append('<div class="pip-gradient-block"></div>');
        }
    };
    return MarkdownController;
}());
(function () {
    'use strict';
    var MarkdownComponent = {
        controller: MarkdownController,
        bindings: {
            text: '<pipText',
            isList: '<?pipList',
            clamp: '<?pipLineCount',
            rebind: '<?pipRebind'
        }
    };
    angular.module('pipMarkdown', ['ngSanitize'])
        .run(Config)
        .component('pipMarkdown', MarkdownComponent);
})();

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PopoverController = (function () {
    PopoverController.$inject = ['$scope', '$rootScope', '$element', '$timeout', '$compile'];
    function PopoverController($scope, $rootScope, $element, $timeout, $compile) {
        var _this = this;
        this._$timeout = $timeout;
        this.templateUrl = $scope['params'].templateUrl;
        this.template = $scope['params'].template;
        this.timeout = $scope['params'].timeout;
        this.element = $scope['params'].element;
        this.calcH = $scope['params'].calcHeight;
        this.cancelCallback = $scope['params'].cancelCallback;
        this.backdropElement = $('.pip-popover-backdrop');
        this.backdropElement.on('click keydown scroll', function () { _this.backdropClick(); });
        this.backdropElement.addClass($scope['params'].responsive !== false ? 'pip-responsive' : '');
        $timeout(function () {
            _this.position();
            if ($scope['params'].template) {
                _this.content = $compile($scope['params'].template)($scope);
                $element.find('.pip-popover').append(_this.content);
            }
            _this.init();
        });
        $timeout(function () { _this.calcHeight(); }, 200);
        $rootScope.$on('pipPopoverResize', function () { _this.onResize(); });
        $(window).resize(function () { _this.onResize(); });
    }
    PopoverController.prototype.backdropClick = function () {
        if (this.cancelCallback) {
            this.cancelCallback();
        }
        this.closePopover();
    };
    PopoverController.prototype.closePopover = function () {
        var _this = this;
        this.backdropElement.removeClass('opened');
        this._$timeout(function () {
            _this.backdropElement.remove();
        }, 100);
    };
    PopoverController.prototype.onPopoverClick = function ($e) {
        $e.stopPropagation();
    };
    PopoverController.prototype.init = function () {
        this.backdropElement.addClass('opened');
        $('.pip-popover-backdrop').focus();
        if (this.timeout) {
            this._$timeout(function () {
                this.closePopover();
            }, this.timeout);
        }
    };
    PopoverController.prototype.position = function () {
        if (this.element) {
            var element = $(this.element), pos = element.offset(), width = element.width(), height = element.height(), docWidth = $(document).width(), docHeight = $(document).height(), popover = this.backdropElement.find('.pip-popover');
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
        if (this.calcH === false) {
            return;
        }
        var popover = this.backdropElement.find('.pip-popover'), title = popover.find('.pip-title'), footer = popover.find('.pip-footer'), content = popover.find('.pip-content'), contentHeight = popover.height() - title.outerHeight(true) - footer.outerHeight(true);
        content.css('max-height', Math.max(contentHeight, 0) + 'px').css('box-sizing', 'border-box');
    };
    return PopoverController;
}());
exports.PopoverController = PopoverController;
(function () {
    pipPopover.$inject = ['$parse'];
    function pipPopover($parse) {
        "ngInject";
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: 'popover/popover.html',
            controller: PopoverController,
            controllerAs: 'vm'
        };
    }
    angular
        .module('pipPopover', ['pipPopover.Service'])
        .directive('pipPopover', pipPopover);
})();

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PopoverService = (function () {
    PopoverService.$inject = ['$compile', '$rootScope', '$timeout'];
    function PopoverService($compile, $rootScope, $timeout) {
        this._$compile = $compile;
        this._$rootScope = $rootScope;
        this._$timeout = $timeout;
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
        scope = this._$rootScope.$new();
        params = p && _.isObject(p) ? p : {};
        scope['params'] = params;
        scope['locals'] = params.locals;
        content = this._$compile(this.popoverTemplate)(scope);
        element.append(content);
    };
    PopoverService.prototype.hide = function () {
        var backdropElement = $('.pip-popover-backdrop');
        backdropElement.removeClass('opened');
        this._$timeout(function () {
            backdropElement.remove();
        }, 100);
    };
    PopoverService.prototype.resize = function () {
        this._$rootScope.$broadcast('pipPopoverResize');
    };
    return PopoverService;
}());
exports.PopoverService = PopoverService;
(function () {
    angular
        .module('pipPopover.Service', [])
        .service('pipPopoverService', PopoverService);
})();

},{}],11:[function(require,module,exports){
var RoutingController = (function () {
    function RoutingController($scope, $element) {
        this._$element = $element;
        this.showProgress = $scope['vm']['showProgress'];
        this.logoUrl = $scope['vm']['logoUrl'];
    }
    RoutingController.prototype.$postLink = function () {
        this._image = this._$element.find('img');
        this.loadProgressImage();
    };
    RoutingController.prototype.loadProgressImage = function () {
        if (this.logoUrl) {
            this._image.attr('src', this.logoUrl);
        }
    };
    return RoutingController;
}());
(function () {
    var RoutingProgress = {
        replace: true,
        bindings: {
            showProgress: '&',
            logoUrl: '@'
        },
        templateUrl: 'progress/routing_progress.html',
        controller: RoutingController,
        controllerAs: 'vm'
    };
    angular
        .module('pipRoutingProgress', ['ngMaterial'])
        .component('pipRoutingProgress', RoutingProgress);
})();

},{}],12:[function(require,module,exports){
var ToastController = (function () {
    function ToastController($mdToast, toast, $injector) {
        this._pipErrorDetailsDialog = $injector.has('pipErrorDetailsDialog')
            ? $injector.get('pipErrorDetailsDialog') : null;
        this._$mdToast = $mdToast;
        this.message = toast.message;
        this.actions = toast.actions;
        this.toast = toast;
        if (toast.actions.length === 0) {
            this.actionLenght = 0;
        }
        else {
            this.actionLenght = toast.actions.length === 1 ? toast.actions[0].toString().length : null;
        }
        this.showDetails = this._pipErrorDetailsDialog != null;
    }
    ToastController.prototype.onDetails = function () {
        this._$mdToast.hide();
        if (this._pipErrorDetailsDialog) {
            this._pipErrorDetailsDialog.show({
                error: this.toast.error,
                ok: 'Ok'
            }, angular.noop, angular.noop);
        }
    };
    ToastController.prototype.onAction = function (action) {
        this._$mdToast.hide({
            action: action,
            id: this.toast.id,
            message: this.message
        });
    };
    return ToastController;
}());
var ToastService = (function () {
    ToastService.$inject = ['$rootScope', '$mdToast'];
    function ToastService($rootScope, $mdToast) {
        var _this = this;
        this.SHOW_TIMEOUT = 20000;
        this.SHOW_TIMEOUT_NOTIFICATIONS = 20000;
        this.toasts = [];
        this.sounds = {};
        this._$mdToast = $mdToast;
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
        this._$mdToast.show({
            templateUrl: 'toast/toast.html',
            hideDelay: toast.duration || this.SHOW_TIMEOUT,
            position: 'bottom left',
            controller: ToastController,
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
        _.remove(this.toasts, { id: id });
    };
    ToastService.prototype.getToastById = function (id) {
        return _.find(this.toasts, { id: id });
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
        this._$mdToast.cancel();
        this.toasts = [];
    };
    ToastService.prototype.clearToasts = function (type) {
        if (type) {
            this.removeToasts(type);
        }
        else {
            this._$mdToast.cancel();
            this.toasts = [];
        }
    };
    return ToastService;
}());
(function () {
    angular
        .module('pipToasts', ['ngMaterial', 'pipControls.Translate'])
        .service('pipToasts', ToastService);
})();

},{}],13:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipControls.Templates');
} catch (e) {
  module = angular.module('pipControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('color_picker/color_picker.html',
    '<ul class="pip-color-picker {{vm.class}}" pip-selected="vm.currentColorIndex" pip-enter-space-press="vm.enterSpacePress($event)"><li tabindex="-1" ng-repeat="color in vm.colors track by color"><md-button tabindex="-1" class="md-icon-button pip-selectable" ng-click="vm.selectColor($index)" aria-label="color" ng-disabled="vm.disabled()"><md-icon ng-style="{\'color\': color}" md-svg-icon="icons:{{ color == vm.currentColor ? \'circle\' : \'radio-off\' }}"></md-icon></md-button></li></ul>');
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
    '<div ng-if="vm.templateUrl" class="pip-popover flex layout-column" ng-click="vm.onPopoverClick($event)" ng-include="vm.templateUrl"></div><div ng-if="vm.template" class="pip-popover" ng-click="vm.onPopoverClick($event)"></div>');
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
    '<div class="pip-routing-progress layout-column layout-align-center-center" ng-show="vm.showProgress()"><div class="loader"><svg class="circular" viewbox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></circle></svg></div><img src="" height="40" width="40" class="pip-img"><md-progress-circular md-diameter="96" class="fix-ie"></md-progress-circular></div>');
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



},{}]},{},[13,1,2,3,5,4,6,7,8,10,9,11,12])(13)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).lists = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
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
})();

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./dependencies/translate");
angular.module('pipLists', ['pipTagList']);

},{"./dependencies/translate":1}],3:[function(require,module,exports){
(function () {
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
        templateUrl: 'tag_list/tag_list.html',
        controller: TagListController
    };
    angular.module('pipTagList', ['pipList.Translate'])
        .component('pipTagList', TagList);
})();

},{}],4:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipLists.Templates');
} catch (e) {
  module = angular.module('pipLists.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('tag_list/tag_list.html',
    '<div class="pip-chip rm4 pip-type-chip pip-type-chip-left {{\'bg-\' + $ctrl.type + \'-chips\'}}" ng-if="$ctrl.type && !$ctrl.typeLocal"><span>{{$ctrl.type.toUpperCase() | translate | uppercase}}</span></div><div class="pip-chip rm4 pip-type-chip pip-type-chip-left {{\'bg-\' + $ctrl.type + \'-chips\'}}" ng-if="$ctrl.type && $ctrl.typeLocal"><span>{{$ctrl.typeLocal.toUpperCase() | translate | uppercase}}</span></div><div class="pip-chip rm4" ng-repeat="tag in $ctrl.tags"><span>{{::tag}}</span></div>');
}]);
})();



},{}]},{},[4,1,2,3])(4)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).dates = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
angular.module('pipDateTime', [
    'pipDateTime.Service', 'pipDateTime.Filter'
]);

},{}],2:[function(require,module,exports){
'use strict';
formatTimeFilter.$inject = ['pipDateTime'];
formatDateOptionalFilter.$inject = ['pipDateTime'];
formatLongDateFilter.$inject = ['pipDateTime'];
formatShortDateFilter.$inject = ['pipDateTime'];
formatMiddleDateFilter.$inject = ['pipDateTime'];
formatMonthFilter.$inject = ['pipDateTime'];
formatLongMonthFilter.$inject = ['pipDateTime'];
formatYearFilter.$inject = ['pipDateTime'];
formatWeekFilter.$inject = ['pipDateTime'];
formatShortWeekFilter.$inject = ['pipDateTime'];
formatShortDateTimeFilter.$inject = ['pipDateTime'];
formatMiddleDateTimeFilter.$inject = ['pipDateTime'];
formatLongDateTimeFilter.$inject = ['pipDateTime'];
formatShortDateLongTimeFilter.$inject = ['pipDateTime'];
formatMiddleDateLongTimeFilter.$inject = ['pipDateTime'];
formatLongDateLongTimeFilter.$inject = ['pipDateTime'];
bbFormatDateLongTimeFilter.$inject = ['pipDateTime'];
formatFullDateTimeFilter.$inject = ['pipDateTime'];
formatShortTimeFilter.$inject = ['pipDateTime'];
formatLongTimeFilter.$inject = ['pipDateTime'];
formatShortDayOfWeekFilter.$inject = ['pipDateTime'];
formatLongDayOfWeekFilter.$inject = ['pipDateTime'];
formatLongMonthDayFilter.$inject = ['pipDateTime'];
formatShortMonthDayFilter.$inject = ['pipDateTime'];
formatDateRangeFilter.$inject = ['pipDateTime'];
formatDateTimeRangeFilter.$inject = ['pipDateTime'];
formatISOWeekFilter.$inject = ['pipDateTime'];
formatShortISOWeekFilter.$inject = ['pipDateTime'];
formatISOWeekOrdinalFilter.$inject = ['pipDateTime'];
formatDateYFilter.$inject = ['pipDateTime'];
formatLongDateYFilter.$inject = ['pipDateTime'];
formatTodayDateLongTimeLongFilter.$inject = ['pipDateTime'];
formatTodayDateShortTimeLongFilter.$inject = ['pipDateTime'];
formatTodayDateLongTimeShortFilter.$inject = ['pipDateTime'];
formatTodayDateShortTimeShortFilter.$inject = ['pipDateTime'];
formatMillisecondsToSecondsFilter.$inject = ['pipDateTime'];
formatElapsedIntervalFilter.$inject = ['pipDateTime'];
getDateJSONFilter.$inject = ['pipDateTime'];
function formatTimeFilter(pipDateTime) {
    "ngInject";
    return function (value, format) {
        return pipDateTime.formatTime(value, format);
    };
}
function formatDateOptionalFilter(pipDateTime) {
    "ngInject";
    return function (value, format) {
        return pipDateTime.formatDateOptional(value, format);
    };
}
function formatLongDateFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatLongDate(value);
    };
}
function formatShortDateFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatShortDate(value);
    };
}
function formatMiddleDateFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatMiddleDate(value);
    };
}
function formatMonthFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatMonth(value);
    };
}
function formatLongMonthFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatLongMonth(value);
    };
}
function formatYearFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatYear(value);
    };
}
function formatWeekFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatWeek(value);
    };
}
function formatShortWeekFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatShortWeek(value);
    };
}
function formatShortDateTimeFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatShortDateTime(value);
    };
}
function formatMiddleDateTimeFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatMiddleDateTime(value);
    };
}
function formatLongDateTimeFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatLongDateTime(value);
    };
}
function formatShortDateLongTimeFilter(pipDateTime) {
    "ngInject";
    return function (value, firstTime) {
        return pipDateTime.formatShortDateLongTime(value, firstTime);
    };
}
function formatMiddleDateLongTimeFilter(pipDateTime) {
    "ngInject";
    return function (value, firstTime) {
        return pipDateTime.formatMiddleDateLongTime(value, firstTime);
    };
}
function formatLongDateLongTimeFilter(pipDateTime) {
    "ngInject";
    return function (value, firstTime) {
        return pipDateTime.formatLongDateLongTime(value, firstTime);
    };
}
function bbFormatDateLongTimeFilter(pipDateTime) {
    "ngInject";
    return function (value, firstTime) {
        return pipDateTime.bbFormatDateLongTime(value, firstTime);
    };
}
function formatFullDateTimeFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatFullDateTime(value);
    };
}
function formatShortTimeFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatShortTime(value);
    };
}
function formatLongTimeFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatLongTime(value);
    };
}
function formatShortDayOfWeekFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatShortDayOfWeek(value);
    };
}
function formatLongDayOfWeekFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatLongDayOfWeek(value);
    };
}
function formatLongMonthDayFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatLongMonthDay(value);
    };
}
function formatShortMonthDayFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatShortMonthDay(value);
    };
}
function formatDateRangeFilter(pipDateTime) {
    "ngInject";
    return function (value1, value2) {
        return pipDateTime.formatDateRange(value1, value2);
    };
}
function formatDateTimeRangeFilter(pipDateTime) {
    "ngInject";
    return function (value1, value2) {
        return pipDateTime.formatDateTimeRange(value1, value2);
    };
}
function formatISOWeekFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatISOWeek(value);
    };
}
function formatShortISOWeekFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatShortISOWeek(value);
    };
}
function formatISOWeekOrdinalFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatISOWeekOrdinal(value);
    };
}
function formatDateYFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatDateY(value);
    };
}
function formatLongDateYFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatLongDateY(value);
    };
}
function formatTodayDateLongTimeLongFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatTodayDateLongTimeLong(value);
    };
}
function formatTodayDateShortTimeLongFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatTodayDateShortTimeLong(value);
    };
}
function formatTodayDateLongTimeShortFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatTodayDateLongTimeShort(value);
    };
}
function formatTodayDateShortTimeShortFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatTodayDateShortTimeShort(value);
    };
}
function formatMillisecondsToSecondsFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.formatMillisecondsToSeconds(value);
    };
}
function formatElapsedIntervalFilter(pipDateTime) {
    "ngInject";
    return function (value, start) {
        return pipDateTime.formatElapsedInterval(value, start);
    };
}
function getDateJSONFilter(pipDateTime) {
    "ngInject";
    return function (value) {
        return pipDateTime.getDateJSON(value);
    };
}
angular
    .module('pipDateTime.Filter', [])
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

},{}],3:[function(require,module,exports){
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
var DateTimeConfig = (function () {
    function DateTimeConfig() {
    }
    return DateTimeConfig;
}());
exports.DateTimeConfig = DateTimeConfig;
var DateTime = (function () {
    function DateTime(config) {
        this._momentRanged = new Array('year', 'month', 'week', 'isoweek', 'day');
        this._defaultFormat = 'LL';
        this._config = config || { timeZone: null };
    }
    DateTime.prototype.isUndefinedOrNull = function (value) {
        return angular.isUndefined(value) || value === null;
    };
    DateTime.prototype.getRange = function (value) {
        if (this.isUndefinedOrNull(value)) {
            return 'day';
        }
        var index = this._momentRanged.indexOf(value);
        if (index < 0) {
            return 'day';
        }
        else {
            return this._momentRanged[index];
        }
    };
    DateTime.prototype.getOperationRange = function (value) {
        if (this.isUndefinedOrNull(value)) {
            return 'day';
        }
        var range = value == 'isoweek' ? 'week' : value, index = this._momentRanged.indexOf(range);
        if (index < 0) {
            return 'day';
        }
        else {
            return this._momentRanged[index];
        }
    };
    DateTime.prototype.formatDateTime = function (value, basicFormat) {
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
    DateTime.prototype.formatDateTimeY = function (value, basicFormat) {
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
    DateTime.prototype.formatDay = function (value, basicFormat) {
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
    DateTime.prototype.formatMonthDay = function (value, basicFormat) {
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
    DateTime.prototype.formatRange = function (value1, value2, basicFormat) {
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
        else if (dateEnd === null || dateStart.isSame(dateEnd)) {
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
            else {
                return this.formatMonthDay(dateStart, basicFormat) + '-' + dateEnd.format(basicFormat);
            }
        }
        else {
            return dateStart.format(basicFormat) + '-' + dateEnd.format(basicFormat);
        }
    };
    DateTime.prototype.toStartRange = function (value, range) {
        var date;
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
        return date.startOf(range).toDate();
    };
    DateTime.prototype.toEndRange = function (value, range, offset) {
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
    DateTime.prototype.toDateWithTime = function (value, formatDate, formatTime, firstTime) {
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
    DateTime.prototype.toTodayDate = function (value, formatDate, formatTime) {
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
    Object.defineProperty(DateTime.prototype, "config", {
        get: function () {
            return this._config;
        },
        enumerable: true,
        configurable: true
    });
    DateTime.prototype.useTimeZone = function (offset) {
        this._config.timeZone = offset;
    };
    DateTime.prototype.formatTime = function (value, format) {
        return this.formatDateTime(value, 'LLL');
    };
    DateTime.prototype.formatDateOptional = function (value, format) {
        return this.formatDateTime(value, 'L');
    };
    DateTime.prototype.formatShortDate = function (value) {
        return this.formatDateTime(value, 'L');
    };
    DateTime.prototype.bbFormatDateLongTime = function (value, firstTime) {
        return this.toDateWithTime(value, 'MM/DD/YY', 'LTS', firstTime);
    };
    DateTime.prototype.formatMiddleDate = function (value) {
        return this.formatDateTime(value, 'll');
    };
    DateTime.prototype.formatLongDate = function (value) {
        return this.formatDateTime(value, 'LL');
    };
    DateTime.prototype.formatMonth = function (value) {
        return this.formatDateTime(value, 'MM');
    };
    DateTime.prototype.formatLongMonth = function (value) {
        return this.formatDateTime(value, 'MMMM');
    };
    DateTime.prototype.formatYear = function (value) {
        return this.formatDateTime(value, 'YYYY');
    };
    DateTime.prototype.formatWeek = function (value) {
        return this.formatDateTime(value, 'ww');
    };
    DateTime.prototype.formatShortWeek = function (value) {
        return this.formatDateTime(value, 'w');
    };
    DateTime.prototype.formatShortDateTime = function (value) {
        return this.toDateWithTime(value, 'L', 'LT');
    };
    DateTime.prototype.formatMiddleDateTime = function (value) {
        return this.formatDateTime(value, 'lll');
    };
    DateTime.prototype.formatLongDateTime = function (value) {
        return this.formatDateTime(value, 'LLL');
    };
    DateTime.prototype.formatFullDateTime = function (value) {
        return this.formatDateTime(value, 'LLLL');
    };
    DateTime.prototype.formatShortDateLongTime = function (value, firstTime) {
        return this.toDateWithTime(value, 'L', 'LTS', firstTime);
    };
    DateTime.prototype.formatMiddleDateLongTime = function (value, firstTime) {
        return this.toDateWithTime(value, 'll', 'LTS', firstTime);
    };
    DateTime.prototype.formatLongDateLongTime = function (value, firstTime) {
        return this.toDateWithTime(value, 'LL', 'LTS', firstTime);
    };
    DateTime.prototype.formatShortTime = function (value) {
        return this.formatDateTime(value, 'LT');
    };
    DateTime.prototype.formatLongTime = function (value) {
        return this.formatDateTime(value, 'LTS');
    };
    DateTime.prototype.formatShortDayOfWeek = function (value) {
        return this.formatDateTime(value, 'dd');
    };
    DateTime.prototype.formatLongDayOfWeek = function (value) {
        return this.formatDateTime(value, 'dddd');
    };
    DateTime.prototype.formatLongMonthDay = function (value) {
        return this.formatMonthDay(value, 'LL');
    };
    DateTime.prototype.formatShortMonthDay = function (value) {
        return this.formatMonthDay(value, 'L');
    };
    DateTime.prototype.formatDateRange = function (value1, value2) {
        return this.formatRange(value1, value2, 'LL');
    };
    DateTime.prototype.formatDateTimeRange = function (value1, value2) {
        return this.formatRange(value1, value2, 'LLL');
    };
    DateTime.prototype.formatISOWeek = function (value) {
        return this.formatDateTime(value, 'WW');
    };
    DateTime.prototype.formatShortISOWeek = function (value) {
        return this.formatDateTime(value, 'W');
    };
    DateTime.prototype.formatISOWeekOrdinal = function (value) {
        return this.formatDateTime(value, 'Wo');
    };
    DateTime.prototype.formatDateY = function (value) {
        return this.formatDateTimeY(value, 'L');
    };
    DateTime.prototype.formatLongDateY = function (value) {
        return this.formatDateTimeY(value, 'LL');
    };
    DateTime.prototype.formatTodayDateLongTimeLong = function (value) {
        return this.toTodayDate(value, 'LL', 'LTS');
    };
    DateTime.prototype.formatTodayDateShortTimeLong = function (value) {
        return this.toTodayDate(value, 'LL', 'LTS');
    };
    DateTime.prototype.formatTodayDateLongTimeShort = function (value) {
        return this.toTodayDate(value, 'LL', 'LT');
    };
    DateTime.prototype.formatTodayDateShortTimeShort = function (value) {
        return this.toTodayDate(value, 'll', 'LT');
    };
    DateTime.prototype.formatMillisecondsToSeconds = function (value) {
        return '';
    };
    DateTime.prototype.formatElapsedInterval = function (value, start) {
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
    DateTime.prototype.getDateJSON = function (date) {
        return JSON.stringify(moment(date));
    };
    DateTime.prototype.getNextStart = function (value, category) {
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
    DateTime.prototype.getPrevStart = function (value, category) {
        var date, range, result;
        if (this.isUndefinedOrNull(value)) {
            return '';
        }
        date = moment(value);
        if (!date.isValid()) {
            return '';
        }
        range = this.getRange(category);
        result = moment(date).startOf(range).add(-1, this.getOperationRange(range));
        return result.toDate();
    };
    DateTime.prototype.getNowStart = function (category) {
        var date, range, result;
        date = moment();
        if (!date.isValid()) {
            return '';
        }
        range = this.getRange(category);
        result = moment(date).startOf(range);
        return result.toDate();
    };
    DateTime.prototype.addHours = function (value, hours) {
        var date;
        if (this.isUndefinedOrNull(value) || !angular.isNumber(hours)) {
            return '';
        }
        date = moment(value);
        if (!date.isValid()) {
            return '';
        }
        return date.add(hours, 'hours').toDate();
    };
    DateTime.prototype.toStartDay = function (value) {
        return this.toStartRange(value, 'day');
    };
    DateTime.prototype.toEndDay = function (value, offset) {
        return this.toEndRange(value, 'day', offset);
    };
    DateTime.prototype.toStartWeek = function (value) {
        return this.toStartRange(value, 'week');
    };
    DateTime.prototype.toEndWeek = function (value, offset) {
        return this.toEndRange(value, 'week', offset);
    };
    DateTime.prototype.toStartMonth = function (value) {
        return this.toStartRange(value, 'month');
    };
    DateTime.prototype.toEndMonth = function (value, offset) {
        return this.toEndRange(value, 'month', offset);
    };
    DateTime.prototype.toStartYear = function (value) {
        return this.toStartRange(value, 'year');
    };
    DateTime.prototype.toEndYear = function (value, offset) {
        return this.toEndRange(value, 'year', offset);
    };
    return DateTime;
}());
var DateTimeService = (function () {
    function DateTimeService(datetime) {
        this._config = { timeZone: null };
        this._datetime = datetime;
    }
    DateTimeService.prototype.useTimeZone = function (offset) {
        return this._datetime.useTimeZone(offset);
    };
    DateTimeService.prototype.formatTime = function (value, format) {
        return this._datetime.formatTime(value, format);
    };
    DateTimeService.prototype.formatDateOptional = function (value, format) {
        return this._datetime.formatDateOptional(value, format);
    };
    DateTimeService.prototype.formatShortDate = function (value) {
        return this._datetime.formatShortDate(value);
    };
    DateTimeService.prototype.formatMiddleDate = function (value) {
        return this._datetime.formatMiddleDate(value);
    };
    DateTimeService.prototype.formatLongDate = function (value) {
        return this._datetime.formatLongDate(value);
    };
    DateTimeService.prototype.formatMonth = function (value) {
        return this._datetime.formatMonth(value);
    };
    DateTimeService.prototype.formatLongMonth = function (value) {
        return this._datetime.formatLongMonth(value);
    };
    DateTimeService.prototype.formatYear = function (value) {
        return this._datetime.formatYear(value);
    };
    DateTimeService.prototype.formatWeek = function (value) {
        return this._datetime.formatWeek(value);
    };
    DateTimeService.prototype.formatShortWeek = function (value) {
        return this._datetime.formatShortWeek(value);
    };
    DateTimeService.prototype.formatShortDateTime = function (value) {
        return this._datetime.formatShortDateTime(value);
    };
    DateTimeService.prototype.formatMiddleDateTime = function (value) {
        return this._datetime.formatMiddleDateTime(value);
    };
    DateTimeService.prototype.formatLongDateTime = function (value) {
        return this._datetime.formatLongDateTime(value);
    };
    DateTimeService.prototype.formatFullDateTime = function (value) {
        return this._datetime.formatFullDateTime(value);
    };
    DateTimeService.prototype.formatShortDateLongTime = function (value, firstTime) {
        return this._datetime.formatShortDateLongTime(value, firstTime);
    };
    DateTimeService.prototype.formatMiddleDateLongTime = function (value, firstTime) {
        return this._datetime.formatMiddleDateLongTime(value, firstTime);
    };
    DateTimeService.prototype.formatLongDateLongTime = function (value, firstTime) {
        return this._datetime.formatLongDateLongTime(value, firstTime);
    };
    DateTimeService.prototype.bbFormatDateLongTime = function (value, firstTime) {
        return this._datetime.bbFormatDateLongTime(value, firstTime);
    };
    DateTimeService.prototype.formatShortTime = function (value) {
        return this._datetime.formatShortTime(value);
    };
    DateTimeService.prototype.formatLongTime = function (value) {
        return this._datetime.formatLongTime(value);
    };
    DateTimeService.prototype.formatShortDayOfWeek = function (value) {
        return this._datetime.formatShortDayOfWeek(value);
    };
    DateTimeService.prototype.formatLongDayOfWeek = function (value) {
        return this._datetime.formatLongDayOfWeek(value);
    };
    DateTimeService.prototype.formatLongMonthDay = function (value) {
        return this._datetime.formatLongMonthDay(value);
    };
    DateTimeService.prototype.formatShortMonthDay = function (value) {
        return this._datetime.formatShortMonthDay(value);
    };
    DateTimeService.prototype.formatDateRange = function (value1, value2) {
        return this._datetime.formatDateRange(value1, value2);
    };
    DateTimeService.prototype.formatDateTimeRange = function (value1, value2) {
        return this._datetime.formatDateTimeRange(value1, value2);
    };
    DateTimeService.prototype.formatISOWeek = function (value) {
        return this._datetime.formatISOWeek(value);
    };
    DateTimeService.prototype.formatShortISOWeek = function (value) {
        return this._datetime.formatShortISOWeek(value);
    };
    DateTimeService.prototype.formatISOWeekOrdinal = function (value) {
        return this._datetime.formatISOWeekOrdinal(value);
    };
    DateTimeService.prototype.formatDateY = function (value) {
        return this._datetime.formatDateY(value);
    };
    DateTimeService.prototype.formatLongDateY = function (value) {
        return this._datetime.formatLongDateY(value);
    };
    DateTimeService.prototype.formatTodayDateLongTimeLong = function (value) {
        return this._datetime.formatTodayDateLongTimeLong(value);
    };
    DateTimeService.prototype.formatTodayDateShortTimeLong = function (value) {
        return this._datetime.formatTodayDateShortTimeLong(value);
    };
    DateTimeService.prototype.formatTodayDateLongTimeShort = function (value) {
        return this._datetime.formatTodayDateLongTimeShort(value);
    };
    DateTimeService.prototype.formatTodayDateShortTimeShort = function (value) {
        return this._datetime.formatTodayDateShortTimeShort(value);
    };
    DateTimeService.prototype.formatMillisecondsToSeconds = function (value) {
        return this._datetime.formatMillisecondsToSeconds(value);
    };
    DateTimeService.prototype.formatElapsedInterval = function (value, start) {
        return this._datetime.formatElapsedInterval(value, start);
    };
    DateTimeService.prototype.getDateJSON = function (date) {
        return this._datetime.getDateJSON(date);
    };
    DateTimeService.prototype.getNextStart = function (value, category) {
        return this._datetime.getNextStart(value, category);
    };
    DateTimeService.prototype.getPrevStart = function (value, category) {
        return this._datetime.getPrevStart(value, category);
    };
    DateTimeService.prototype.getNowStart = function (category) {
        return this._datetime.getNowStart(category);
    };
    DateTimeService.prototype.addHours = function (value, hours) {
        return this._datetime.addHours(value, hours);
    };
    DateTimeService.prototype.toStartDay = function (value) {
        return this._datetime.toStartDay(value);
    };
    DateTimeService.prototype.toEndDay = function (value, offset) {
        return this._datetime.toEndDay(value, offset);
    };
    DateTimeService.prototype.toStartWeek = function (value) {
        return this._datetime.toStartWeek(value);
    };
    DateTimeService.prototype.toEndWeek = function (value, offset) {
        return this._datetime.toEndWeek(value, offset);
    };
    DateTimeService.prototype.toStartMonth = function (value) {
        return this._datetime.toStartMonth(value);
    };
    DateTimeService.prototype.toEndMonth = function (value, offset) {
        return this._datetime.toEndMonth(value, offset);
    };
    DateTimeService.prototype.toStartYear = function (value) {
        return this._datetime.toStartYear(value);
    };
    DateTimeService.prototype.toEndYear = function (value, offset) {
        return this._datetime.toEndYear(value, offset);
    };
    return DateTimeService;
}());
var DateTimeProvider = (function (_super) {
    __extends(DateTimeProvider, _super);
    function DateTimeProvider() {
        return _super.call(this, { timeZone: null }) || this;
    }
    DateTimeProvider.prototype.$get = function () {
        "ngInject";
        if (this._service == null)
            this._service = new DateTimeService(this);
        return this._service;
    };
    return DateTimeProvider;
}(DateTime));
angular
    .module('pipDateTime.Service', [])
    .provider('pipDateTime', DateTimeProvider);

},{}],4:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipDate', ['pipDates.Templates']);
    thisModule.directive('pipDate', function () {
        return {
            restrict: 'EA',
            require: 'ngModel',
            scope: {
                timeMode: '@pipTimeMode',
                disabled: '&ngDisabled',
                model: '=ngModel',
                ngChange: '&'
            },
            templateUrl: 'date_directive/date.html',
            controller: 'pipDateController'
        };
    });
    thisModule.controller('pipDateController', ['$scope', '$element', '$injector', function ($scope, $element, $injector) {
        var value, localeDate = moment.localeData(), momentMonths = angular.isArray(localeDate._months) ? localeDate._months : localeDate._months.format, momentDays = angular.isArray(localeDate._weekdays) ? localeDate._weekdays : localeDate._weekdays.format, momentShortDays = localeDate._weekdaysMin, momentFirstDayOfWeek = localeDate._week.dow;
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        if (pipTranslate) {
            pipTranslate.setTranslations('en', {
                DAY: 'Day',
                MONTH: 'Month',
                YEAR: 'Year'
            });
            pipTranslate.setTranslations('ru', {
                DAY: 'День',
                MONTH: 'Месяц',
                YEAR: 'Год'
            });
            $scope.dayLabel = pipTranslate.translate('DAY');
            $scope.monthLabel = pipTranslate.translate('MONTH');
            $scope.yearLabel = pipTranslate.translate('YEAR');
        }
        else {
            $scope.dayLabel = 'Day';
            $scope.monthLabel = 'Month';
            $scope.yearLabel = 'Year';
        }
        function dayList(month, year) {
            var count = 31, days = [], i;
            if (month === 4 || month === 6 || month === 9 || month === 11) {
                count = 30;
            }
            else if (month === 2) {
                if (year) {
                    count = year % 4 === 0 ? 29 : 28;
                }
                else {
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
                    name: momentMonths[i - 1]
                });
            }
            return months;
        }
        function yearList() {
            var i, currentYear = new Date().getFullYear(), startYear = $scope.timeMode === 'future' ? currentYear : currentYear - 100, endYear = $scope.timeMode === 'past' ? currentYear : currentYear + 100, years = [];
            if ($scope.timeMode === 'past') {
                for (i = endYear; i >= startYear; i--) {
                    years.push(i);
                }
            }
            else {
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
            var value = v ? _.isDate(v) ? v : new Date(v) : null, day = value ? value.getDate() : null, month = value ? value.getMonth() + 1 : null, year = value ? value.getFullYear() : null;
            if ($scope.month !== month && $scope.year !== year) {
                $scope.days = dayList($scope.month, $scope.year);
            }
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
        value = $scope.model ? _.isDate($scope.model) ? $scope.model : new Date($scope.model) : null;
        $scope.day = value ? value.getDate() : null;
        $scope.month = value ? value.getMonth() + 1 : null;
        $scope.year = value ? value.getFullYear() : null;
        $scope.days = dayList($scope.month, $scope.year);
        $scope.months = monthList();
        $scope.years = yearList();
        $scope.disableControls = $scope.disabled ? $scope.disabled() : false;
        $scope.$watch('model', function (newValue) {
            getValue(newValue);
        });
        $scope.$watch($scope.disabled, function (newValue) {
            $scope.disableControls = newValue;
        });
    }]);
})();

},{}],5:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipDateRange', ['pipDates.Templates']);
    thisModule.directive('pipDateRange', function () {
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
            templateUrl: 'date_range_directive/date_range.html',
            controller: 'pipDateRangeController'
        };
    });
    thisModule.controller('pipDateRangeController', ['$scope', '$element', '$mdMedia', '$rootScope', '$injector', '$timeout', function ($scope, $element, $mdMedia, $rootScope, $injector, $timeout) {
        var currentDate, currentYear, currentMonth, currentDay, prevState = {}, currentState = {}, localeDate = moment.localeData(), momentMonths = angular.isArray(localeDate._months) ? localeDate._months : localeDate._months.format, momentDays = angular.isArray(localeDate._weekdays) ? localeDate._weekdays : localeDate._weekdays.format, momentShortDays = localeDate._weekdaysMin, momentFirstDayOfWeek = localeDate._week.dow;
        currentDate = new Date();
        currentYear = currentDate.getUTCFullYear();
        currentMonth = currentDate.getUTCMonth() + 1;
        currentDay = currentDate.getUTCDate();
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
            }
            else {
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
            }
            else {
                adjustDay();
            }
            setValue();
        };
        $scope.onWeekChange = function () {
            if ($scope.pipDateRangeType === 'weekly') {
                adjustWeek();
                correctWeek();
            }
            else {
                adjustDay();
            }
            setValue();
        };
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
                $timeout(function () {
                    $scope.pipChanged();
                }, 0);
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
            $scope.shortMonths = monthList();
            $scope.years = yearList();
        }
        function correctWeek() {
            if (!prevState.model || prevState.model && prevState.model.getTime() >= $scope.model.getTime()) {
                if ($scope.weeks && $scope.weeks[$scope.week] && $scope.weeks[$scope.week].id <= 0) {
                    if ($scope.month < 12) {
                        $scope.month += 1;
                    }
                    else {
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
            }
            else {
                adjustDay();
            }
            setValue();
        }
        $scope.$mdMedia = $mdMedia;
        init();
        $scope.disableControls = $scope.disabled ? $scope.disabled() : false;
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
        function getCountDay(month, year) {
            var count = 31;
            if (month === 4 || month === 6 || month === 9 || month === 11) {
                count = 30;
            }
            else if (month === 2) {
                if (year) {
                    count = year % 4 === 0 ? 29 : 28;
                }
                else {
                    count = 28;
                }
            }
            return count;
        }
        function dayList(month, year) {
            var count, days, i, ln;
            count = getCountDay(month, year);
            $scope.nameDays = [];
            days = [];
            for (i = 1; i <= count; i++) {
                days.push(i);
                $scope.nameDays.push(momentShortDays[moment([year, month - 1, i]).weekday()]);
            }
            return days;
        }
        function getWeekByDate(day, month, year) {
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
        }
        function getWeek(day, countDay, countPrevMonthDay) {
            var endDay, startDay;
            endDay = day + 6 > countDay ? countDay - day - 6 : day + 6;
            startDay = day > 0 ? day : countPrevMonthDay + day;
            return startDay.toString() + ' - ' + (Math.abs(endDay)).toString();
        }
        function weekList(month, year) {
            var weeks, countDay, countPrevMonthDay, startWeek;
            weeks = [];
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
            var months = [], i;
            for (i = 1; i <= 12; i++) {
                months.push({
                    id: i,
                    name: momentMonths[i - 1]
                });
            }
            return months;
        }
        function yearList() {
            var startYear, i, endYear, years = [];
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
            }
            else {
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
            day = value ? value.getUTCDate() : null;
            month = value ? value.getUTCMonth() + 1 : null;
            year = value ? value.getUTCFullYear() : null;
            week = value ? getWeekByDate(day, month - 1, year) : null;
            if ($scope.day === day && $scope.month === month && $scope.year === year && $scope.week === week) {
                return;
            }
            $scope.day = day;
            $scope.month = month;
            $scope.year = year;
            $scope.week = week;
            $scope.days = dayList($scope.month, $scope.year);
            $scope.weeks = weekList($scope.month, $scope.year);
        }
        function setValue() {
            var value;
            if ($scope.pipDateRangeType === 'weekly') {
                value = new Date($scope.year, $scope.month - 1, $scope.week, 0, 0, 0, 0);
                value = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
                $scope.model = value;
            }
            else {
                value = new Date($scope.year, $scope.month - 1, $scope.day, 0, 0, 0, 0);
                value = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
                $scope.model = value;
            }
            prevState = _.cloneDeep(currentState);
            setCurrent();
            $scope.onChange();
        }
    }]);
})();

},{}],6:[function(require,module,exports){
'use strict';
angular.module('pipDates', [
    'pipDate',
    'pipTimeRange',
    'pipDateTime',
    'pipTimeRangeEdit',
    'pipDateRange',
    'pipDates.Translate'
]);

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipTimeRange', []);
    thisModule.directive('pipTimeRange', function () {
        return {
            restrict: 'EA',
            scope: {
                pipStartDate: '=',
                pipEndDate: '='
            },
            templateUrl: 'time_range_directive/time_range.html',
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
                    if (value == null)
                        return false;
                    if (!value)
                        return false;
                    value = value.toString().toLowerCase();
                    return value == '1' || value == 'true';
                }
                $scope.data = {};
                $scope.data.start = null;
                $scope.data.end = null;
                defineStartDate();
                defineEndDate();
                if (toBoolean($attrs.pipRebind)) {
                    $scope.$watch('pipStartDate', function () {
                        $scope.data.start = null;
                        defineStartDate();
                    });
                    $scope.$watch('pipEndDate', function () {
                        $scope.data.end = null;
                        defineEndDate();
                    });
                }
                $element.addClass('pip-time-range');
            }
        };
    });
})();

},{}],9:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipTimeRangeEdit', []);
    thisModule.directive('pipTimeRangeEdit', function () {
        return {
            restrict: 'EA',
            scope: {
                pipStartDate: '=',
                pipChanged: '&',
                pipEndDate: '=',
                pipStartLabel: '@',
                pipEndLabel: '@',
                disabled: '&ngDisabled',
                pipHideTime: '=',
                pipSize: '='
            },
            templateUrl: 'time_range_edit_directive/time_range_edit.html',
            controller: 'pipTimeRangeEditController'
        };
    });
    thisModule.controller('pipTimeRangeEditController', ['$scope', '$element', '$attrs', '$injector', 'pipDateTime', function ($scope, $element, $attrs, $injector, pipDateTime) {
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        if (pipTranslate) {
            pipTranslate.setTranslations('en', {
                EVENT_NEW_START_TIME: 'Start time',
                EVENT_NEW_END_TIME: 'End time'
            });
            pipTranslate.setTranslations('ru', {
                EVENT_NEW_START_TIME: 'Начало',
                EVENT_NEW_END_TIME: 'Конец'
            });
            $scope.startLabel = $scope.pipStartLabel ? pipTranslate.translate($scope.pipStartLabel)
                : pipTranslate.translate('EVENT_NEW_START_TIME');
            $scope.endLabel = $scope.pipEndLabel ? pipTranslate.translate($scope.pipEndLabel)
                : pipTranslate.translate('EVENT_NEW_END_TIME');
        }
        else {
            $scope.startLabel = $scope.pipStartLabel ? $scope.pipStartLabel : 'Start time';
            $scope.endLabel = $scope.pipEndLabel ? $scope.pipEndLabel : 'End time';
        }
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
            if (!$scope.data.startDate) {
                $scope.data.startTime = null;
                return;
            }
            if ($scope.data.startTime === undefined || $scope.data.startTime === null) {
                if (!$scope.data.endTime) {
                    date = new Date();
                    date = date.getTime() - pipDateTime.toStartDay(date);
                    $scope.data.startTime = Math.floor(date / (30 * 60 * 1000)) * 30;
                }
                else {
                    $scope.data.startTime = $scope.data.endTime === 0 ? 0 : $scope.data.endTime - 30;
                }
            }
            start = new Date($scope.data.startDate.getTime() + $scope.data.startTime * 60 * 1000);
            if ($scope.data.duration) {
                end = new Date(start.getTime() + $scope.data.duration);
                $scope.data.endDate = pipDateTime.toStartDay(end);
                end = end.getTime() - $scope.data.endDate.getTime();
                $scope.data.endTime = Math.floor(end / (30 * 60 * 1000)) * 30;
            }
            else {
                end = new Date($scope.data.endDate.getTime() + $scope.data.endTime * 60 * 1000);
                if (start >= end) {
                    $scope.data.endDate = pipDateTime.toStartDay(new Date(start.getTime() + 30 * 60000));
                    $scope.data.endTime = ($scope.data.startTime + 30) % 1440;
                }
            }
            $scope.data.startTime = Math.round($scope.data.startTime / 30) * 30;
        }
        function validateEndDate() {
            var date, start, end;
            if (!$scope.data.endDate) {
                $scope.data.endTime = null;
                return;
            }
            if ($scope.data.endTime === undefined || $scope.data.endTime === null) {
                if (!$scope.data.startTime) {
                    date = new Date();
                    date = date.getTime() - pipDateTime.toStartDay(date);
                    $scope.data.endTime = Math.floor(date / (30 * 60 * 1000)) * 30;
                }
                else {
                    $scope.data.endTime = $scope.data.startTime === 1410 ? 1410 : $scope.data.startTime + 30;
                }
            }
            start = new Date($scope.data.startDate.getTime() + $scope.data.startTime * 60 * 1000);
            end = new Date($scope.data.endDate.getTime() + $scope.data.endTime * 60 * 1000);
            if (start >= end) {
                $scope.data.startDate = pipDateTime.toStartDay(new Date(end.getTime() - 30 * 60000));
                $scope.data.startTime = $scope.data.endTime % 1440 === 0 ? 1410 : $scope.data.endTime - 30;
            }
            $scope.data.endTime = Math.round($scope.data.endTime / 30) * 30;
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
                $scope.data.startDate = pipDateTime.toStartDay(start);
                $scope.data.startTime = (new Date(start) - $scope.data.startDate) / (60 * 1000);
            }
            if ($scope.pipEndDate !== null && $scope.pipEndDate !== undefined) {
                end = _.isDate($scope.pipEndDate) ? $scope.pipEndDate : null;
                if (!start) {
                    end = getDateJSON($scope.pipEndDate);
                }
                $scope.data.endDate = pipDateTime.toStartDay(end);
                $scope.data.endTime = (new Date(end) - $scope.data.endDate) / (60 * 1000);
            }
            validateStartDate();
            validateEndDate();
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
        function toBoolean(value) {
            if (value == null)
                return false;
            if (!value)
                return false;
            value = value.toString().toLowerCase();
            return value == '1' || value == 'true';
        }
        function initDate() {
            $scope.data.startDate = null;
            $scope.data.startTime = null;
            $scope.data.endDate = null;
            $scope.data.endTime = null;
            $scope.data.duration = null;
            $scope.showTime = !toBoolean($scope.pipHideTime);
        }
        $scope.intervalTimeCollection = getTimeInterval();
        $scope.data = {};
        initDate();
        defineDate();
        $scope.onChangeStartDate = function (newV) {
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
                $scope.data.startDate = pipDateTime.toStartDay(new Date());
            }
            validateStartDate();
            $scope.data.duration = setDuration();
            setDate();
            $scope.pipChanged();
        };
        $scope.onChangeEndTime = function () {
            if (!$scope.data.endDate) {
                $scope.data.endDate = pipDateTime.toStartDay(new Date());
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
        $element.addClass('pip-time-range-edit');
    }]);
})();

},{}],10:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipDates.Templates');
} catch (e) {
  module = angular.module('pipDates.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('date_range_directive/date_range.html',
    '<div class="pip-date-range layout-row flex" tabindex="-1"><md-input-container ng-show="isDay()" class="input-container pip-day flex" ng-class="{\'flex-fixed\' : $mdMedia(\'gt-xs\')}"><md-select class="select-day" ng-class="{\'pip-no-line\' : pipNoLine}" ng-disable="{{disableControls}}" md-on-open="onDayClick()" ng-model="day" ng-change="onDayChanged()" placeholder="{{dayLabel}}" aria-label="DAY"><md-option ng-value="opt" ng-repeat="opt in days track by opt">{{nameDays[$index]}} {{ opt }}</md-option></md-select></md-input-container><md-input-container ng-show="isWeek()" class="input-container flex" ng-class="{\'flex-fixed\' : $mdMedia(\'gt-xs\')}"><md-select class="select-week" ng-class="{\'pip-no-line\' : pipNoLine}" ng-disable="{{disableControls}}" ng-model="week" ng-change="onWeekChange()" placeholder="{{weekLabel}}" aria-label="WEEK"><md-option ng-value="opt.id" ng-repeat="opt in weeks track by opt.id">{{ opt.name }}</md-option></md-select></md-input-container><div class="flex-fixed" ng-class="{\'space16\': $mdMedia(\'gt-xs\'), \'space8\': $mdMedia(\'xs\')}" ng-show="isDay() || isWeek()"></div><md-input-container ng-show="isMonth() && !monthFormatShort" class="input-container flex" ng-class="{\'flex-fixed\' : $mdMedia(\'gt-xs\')}"><md-select class="select-month" ng-class="{\'pip-no-line\' : pipNoLine}" ng-disable="{{disableControls}}" md-on-open="onMonthClick()" ng-model="month" ng-change="onMonthChanged()" placeholder="{{monthLabel}}" aria-label="MONTH"><md-option ng-value="opt.id" ng-repeat="opt in months track by opt.id">{{ opt.name }}</md-option></md-select></md-input-container><md-input-container ng-show="isMonth() && monthFormatShort" class="flex input-container" ng-class="{\'flex-fixed\' : $mdMedia(\'gt-xs\')}"><md-select class="select-month" ng-class="{\'pip-no-line\' : pipNoLine}" ng-disable="{{disableControls}}" md-on-open="onMonthClick()" ng-model="month" ng-change="onMonthChanged()" placeholder="{{monthLabel}}" aria-label="MONTH"><md-option ng-value="opt.id" ng-repeat="opt in shortMonths track by opt.id">{{ opt.name }}</md-option></md-select></md-input-container><div class="flex-fixed" ng-class="{\'space16\': $mdMedia(\'gt-xs\'), \'space8\': $mdMedia(\'xs\')}" ng-show="isMonth()"></div><md-input-container class="input-container flex" ng-class="{\'flex-fixed\' : $mdMedia(\'gt-xs\')}"><md-select class="select-year" ng-class="{\'pip-no-line\' : pipNoLine}" ng-disable="{{disableControls}}" md-on-open="onYearClick()" ng-model="year" ng-change="onYearChanged()" placeholder="{{yearLabel}}" aria-label="YEAR"><md-option ng-value="opt" ng-repeat="opt in years track by opt">{{ opt }}</md-option></md-select></md-input-container></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDates.Templates');
} catch (e) {
  module = angular.module('pipDates.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('date_directive/date.html',
    '<div class="pip-date layout-row flex" tabindex="-1"><md-input-container class="input-container flex"><md-select class="pip-date-day flex" ng-disabled="disableControls" ng-model="day" placeholder="{{dayLabel}}" ng-change="onDayChanged()"><md-option ng-value="opt" ng-repeat="opt in days track by opt">{{:: opt }}</md-option></md-select></md-input-container><div class="input-container-separator flex-fixed"></div><md-input-container class="input-container flex"><md-select class="pip-date-monthflex" ng-disabled="disableControls" ng-model="month" placeholder="{{monthLabel}}" ng-change="onMonthChanged()"><md-option ng-value="opt.id" ng-repeat="opt in months track by opt.id">{{:: opt.name }}</md-option></md-select></md-input-container><div class="input-container-separator flex-fixed"></div><md-input-container class="input-container flex"><md-select class="pip-date-year flex" ng-disabled="disableControls" ng-model="year" placeholder="{{yearLabel}}" ng-change="onYearChanged()"><md-option ng-value="opt" ng-repeat="opt in years track by opt">{{:: opt }}</md-option></md-select></md-input-container></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDates.Templates');
} catch (e) {
  module = angular.module('pipDates.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('time_range_directive/time_range.html',
    '<p><span ng-if="data.start != null">{{data.start | formatLongDateTime}}</span> <span class="separator" ng-if="data.start && data.end">-</span> <span ng-if="data.end != null">{{data.end | formatLongDateTime}}</span></p>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDates.Templates');
} catch (e) {
  module = angular.module('pipDates.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('time_range_edit_directive/time_range_edit.html',
    '<div class="event-edit layout-row layout-xs-column flex layout-align-start-start"><div flex="47" class="start-time-container"><p class="text-caption text-grey">{{startLabel}}</p><div class="layout-row layout-align-space-between-center"><div class="pip-datepicker-container" flex="49"><md-datepicker ng-model="data.startDate" xmd-placeholder="{{startLabel}}" ng-change="onChangeStartDate()" ng-disabled="isDisabled()" aria-label="START-DATE"></md-datepicker></div><div flex="" ng-if="showTime"><md-input-container class="input-container"><md-select aria-label="START-TIME" ng-model="data.startTime" ng-disabled="isDisabled()" ng-change="onChangeStartTime(data.startTime)"><md-option ng-value="opt.id" ng-repeat="opt in intervalTimeCollection track by opt.id">{{ opt.time }}</md-option></md-select></md-input-container></div></div></div><div flex="47" class="end-time-container"><p class="text-caption text-grey">{{endLabel}}</p><div class="layout-row layout-align-space-between-center"><div class="pip-datepicker-container flex-49"><md-datepicker ng-model="data.endDate" xmd-placeholder="{{endLabel}}" ng-disabled="isDisabled()" ng-change="onChangeEndDate()" aria-label="END-DATE"></md-datepicker></div><div flex="" ng-if="showTime"><md-input-container class="input-container"><md-select aria-label="END-TIME" ng-model="data.endTime" ng-change="onChangeEndTime()" ng-disabled="isDisabled()"><md-option ng-value="opt.id" ng-repeat="opt in intervalTimeCollection track by opt.id">{{ opt.time }}</md-option></md-select></md-input-container></div></div></div></div>');
}]);
})();



},{}]},{},[10,7,4,5,2,3,1,6,8,9])(10)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).dialogs = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConfirmationParams_1 = require("./ConfirmationParams");
var ConfirmationDialogController = (function () {
    ConfirmationDialogController.$inject = ['$mdDialog', '$injector', '$rootScope', 'params'];
    function ConfirmationDialogController($mdDialog, $injector, $rootScope, params) {
        "ngInject";
        this.config = new ConfirmationParams_1.ConfirmationParams();
        this._injector = $injector;
        this.initTranslate(params);
        this.$mdDialog = $mdDialog;
        this.theme = $rootScope['$theme'];
    }
    ConfirmationDialogController.prototype.initTranslate = function (params) {
        var pipTranslate;
        pipTranslate = this._injector.has('pipTranslate') ? this._injector.get('pipTranslate') : null;
        if (pipTranslate) {
            pipTranslate.translations('en', { 'CONFIRM_TITLE': 'Confirm' });
            pipTranslate.translations('ru', { 'CONFIRM_TITLE': 'Подтвердите' });
            this.config.title = pipTranslate.translate(params.title) || pipTranslate.translate('CONFIRM_TITLE');
            this.config.ok = pipTranslate.translate(params.ok) || pipTranslate.translate('OK');
            this.config.cancel = pipTranslate.translate(params.cancel) || ('CANCEL');
        }
        else {
            this.config.title = params.title || 'Confirm';
            this.config.ok = params.ok || 'OK';
            this.config.cancel = params.cancel || 'Cancel';
        }
    };
    ConfirmationDialogController.prototype.onOk = function () {
        this.$mdDialog.hide();
    };
    ConfirmationDialogController.prototype.onCancel = function () {
        this.$mdDialog.cancel();
    };
    return ConfirmationDialogController;
}());
exports.ConfirmationDialogController = ConfirmationDialogController;
angular
    .module('pipConfirmationDialog', [
    'ngMaterial',
    'pipDialogs.Translate',
    'pipDialogs.Templates'
])
    .controller('pipConfirmationDialogController', ConfirmationDialogController);

},{"./ConfirmationParams":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConfirmationParams = (function () {
    function ConfirmationParams() {
        this.ok = 'OK';
        this.cancel = 'Cancel';
    }
    return ConfirmationParams;
}());
exports.ConfirmationParams = ConfirmationParams;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConfirmationService = (function () {
    ConfirmationService.$inject = ['$mdDialog'];
    function ConfirmationService($mdDialog) {
        this._mdDialog = $mdDialog;
    }
    ConfirmationService.prototype.show = function (params, successCallback, cancelCallback) {
        this._mdDialog.show({
            targetEvent: params.event,
            templateUrl: 'confirmation/ConfirmationDialog.html',
            controller: 'pipConfirmationDialogController',
            controllerAs: 'vm',
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
    };
    return ConfirmationService;
}());
angular
    .module('pipConfirmationDialog')
    .service('pipConfirmationDialog', ConfirmationService);

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./ConfirmationController");
require("./ConfirmationService");
require("./ConfirmationParams");

},{"./ConfirmationController":1,"./ConfirmationParams":2,"./ConfirmationService":3}],5:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipDialogs.Translate', []);
    thisModule.filter('translate', ['$injector', function ($injector) {
        var pipTranslate = $injector.has('pipTranslate')
            ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate.translate(key) || key : key;
        };
    }]);
})();

},{}],6:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
require("./error_details");
require("./information");
require("./options");
require("./confirmation");
angular
    .module('pipDialogs', [
    'pipInformationDialog',
    'pipConfirmationDialog',
    'pipOptionsDialog',
    'pipOptionsBigDialog',
    'pipErrorDetailsDialog',
]);

},{"./confirmation":4,"./error_details":11,"./information":16,"./options":26}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorStrings_1 = require("./ErrorStrings");
var ErrorDetailsDialogController = (function () {
    ErrorDetailsDialogController.$inject = ['$mdDialog', '$injector', '$rootScope', 'params'];
    function ErrorDetailsDialogController($mdDialog, $injector, $rootScope, params) {
        "ngInject";
        this.config = new ErrorStrings_1.ErrorStrings();
        this._injector = $injector;
        this.initTranslate(params);
        this.$mdDialog = $mdDialog;
        this.theme = $rootScope.$theme;
        this.config.error = params.error;
    }
    ErrorDetailsDialogController.prototype.initTranslate = function (params) {
        var pipTranslate;
        pipTranslate = this._injector.has('pipTranslate') ? this._injector.get('pipTranslate') : null;
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
            this.config.ok = pipTranslate.translate(params.ok) || pipTranslate.translate('OK');
            this.config.cancel = pipTranslate.translate(params.cancel) || pipTranslate.translate('CANCEL');
            this.config.errorDetails = pipTranslate.translate('ERROR_DETAILS');
            this.config.dismissButton = pipTranslate.translate('DISMISS');
            this.config.errorMessage = pipTranslate.translate('MESSAGE');
            this.config.errorCode = pipTranslate.translate('CODE');
            this.config.errorMethod = pipTranslate.translate('METHOD');
            this.config.errorPath = pipTranslate.translate('PATH');
            this.config.errorText = pipTranslate.translate('ERROR');
        }
        else {
            this.config.ok = params.ok || 'Ok';
            this.config.cancel = params.cancel || 'Cancel';
        }
    };
    ErrorDetailsDialogController.prototype.onOk = function () {
        this.$mdDialog.hide();
    };
    ErrorDetailsDialogController.prototype.onCancel = function () {
        this.$mdDialog.cancel();
    };
    return ErrorDetailsDialogController;
}());
exports.ErrorDetailsDialogController = ErrorDetailsDialogController;
angular
    .module('pipErrorDetailsDialog')
    .controller('pipErrorDetailsDialogController', ErrorDetailsDialogController);

},{"./ErrorStrings":10}],8:[function(require,module,exports){
var ErrorDetailsService = (function () {
    ErrorDetailsService.$inject = ['$mdDialog'];
    function ErrorDetailsService($mdDialog) {
        this._mdDialog = $mdDialog;
    }
    ErrorDetailsService.prototype.show = function (params, successCallback, cancelCallback) {
        this._mdDialog.show({
            targetEvent: params.event,
            templateUrl: 'error_details/ErrorDetails.html',
            controller: 'pipErrorDetailsDialogController',
            controllerAs: 'vm',
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
    };
    return ErrorDetailsService;
}());
angular
    .module('pipErrorDetailsDialog')
    .service('pipErrorDetailsDialog', ErrorDetailsService);

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorParams = (function () {
    function ErrorParams() {
        this.ok = 'OK';
        this.cancel = 'CANCEL';
        this.error = 'ERROR';
    }
    return ErrorParams;
}());
exports.ErrorParams = ErrorParams;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorStrings = (function () {
    function ErrorStrings() {
        this.ok = 'OK';
        this.cancel = 'Cancel';
        this.errorDetails = 'Error details';
        this.dismissButton = 'Dismiss';
        this.errorMessage = 'Message';
        this.errorCode = 'Code';
        this.errorMethod = 'Method';
        this.errorPath = 'Path';
        this.error = 'Error';
        this.errorText = 'Error';
    }
    return ErrorStrings;
}());
exports.ErrorStrings = ErrorStrings;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
angular
    .module('pipErrorDetailsDialog', [
    'ngMaterial',
    'pipDialogs.Translate',
    'pipDialogs.Templates'
]);
require("./ErrorParams");
require("./ErrorStrings");
require("./ErrorDetailsService");
require("./ErrorDetailsController");

},{"./ErrorDetailsController":7,"./ErrorDetailsService":8,"./ErrorParams":9,"./ErrorStrings":10}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InformationStrings_1 = require("./InformationStrings");
var InformationDialogController = (function () {
    InformationDialogController.$inject = ['$mdDialog', '$injector', '$rootScope', 'params'];
    function InformationDialogController($mdDialog, $injector, $rootScope, params) {
        "ngInject";
        this.config = new InformationStrings_1.InformationStrings();
        this._injector = $injector;
        this.initTranslate(params);
        this.$mdDialog = $mdDialog;
        this.theme = $rootScope['$theme'];
        this.config.error = params.error;
    }
    InformationDialogController.prototype.initTranslate = function (params) {
        var pipTranslate;
        pipTranslate = this._injector.has('pipTranslate') ? this._injector.get('pipTranslate') : null;
        var content = params.message, item;
        if (pipTranslate) {
            pipTranslate.translations('en', { 'INFORMATION_TITLE': 'Information' });
            pipTranslate.translations('ru', { 'INFORMATION_TITLE': 'Информация' });
            this.config.title = pipTranslate.translate(params.title) || pipTranslate.translate('INFORMATION_TITLE');
            this.config.ok = pipTranslate.translate(params.ok) || pipTranslate.translate('OK');
            content = pipTranslate.translate(content);
        }
        else {
            this.config.title = params.title || 'Information';
            this.config.ok = params.ok || 'OK';
        }
        var pipFormat = this._injector.has('pipFormat') ? this._injector.get('pipFormat') : null;
        if (params.item && pipFormat) {
            item = _.truncate(params.item, 25);
            content = pipFormat.sprintf(content, item);
        }
        this.config.content = content;
    };
    InformationDialogController.prototype.onOk = function () {
        this.$mdDialog.hide();
    };
    InformationDialogController.prototype.onCancel = function () {
        this.$mdDialog.cancel();
    };
    return InformationDialogController;
}());
exports.InformationDialogController = InformationDialogController;
angular
    .module('pipInformationDialog')
    .controller('pipInformationDialogController', InformationDialogController);

},{"./InformationStrings":15}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InformationParams = (function () {
    function InformationParams() {
        this.ok = 'OK';
    }
    return InformationParams;
}());
exports.InformationParams = InformationParams;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InformationService = (function () {
    InformationService.$inject = ['$mdDialog'];
    function InformationService($mdDialog) {
        this._mdDialog = $mdDialog;
    }
    InformationService.prototype.show = function (params, successCallback, cancelCallback) {
        this._mdDialog.show({
            targetEvent: params.event,
            templateUrl: 'information/InformationDialog.html',
            controller: 'pipInformationDialogController',
            controllerAs: 'vm',
            locals: { params: params },
            clickOutsideToClose: true
        })
            .then(function () {
            if (successCallback) {
                successCallback();
            }
        });
    };
    return InformationService;
}());
angular
    .module('pipInformationDialog')
    .service('pipInformationDialog', InformationService);

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InformationStrings = (function () {
    function InformationStrings() {
        this.ok = 'OK';
    }
    return InformationStrings;
}());
exports.InformationStrings = InformationStrings;

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
angular
    .module('pipInformationDialog', [
    'ngMaterial',
    'pipDialogs.Translate',
    'pipDialogs.Templates'
]);
require("./InformationParams");
require("./InformationStrings");
require("./InformationService");
require("./InformationController");

},{"./InformationController":12,"./InformationParams":13,"./InformationService":14,"./InformationStrings":15}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsBigParams_1 = require("./OptionsBigParams");
var OptionsBigData_1 = require("./OptionsBigData");
var OptionsBigDialogController = (function () {
    OptionsBigDialogController.$inject = ['$mdDialog', '$injector', '$rootScope', 'params'];
    function OptionsBigDialogController($mdDialog, $injector, $rootScope, params) {
        "ngInject";
        this.onSelect = function () {
            var option;
            option = _.find(this.config.options, { name: this.config.selectedOptionName }) || new OptionsBigData_1.OptionsBigData();
            this.$mdDialog.hide({ option: option, deleted: this.config.deleted });
        };
        this.$mdDialog = $mdDialog;
        this.config = new OptionsBigParams_1.OptionsBigParams();
        this._injector = $injector;
        this.initTranslate(params);
        this.theme = $rootScope['$theme'];
        this.config.options = params.options;
        this.config.selectedOption = _.find(params.options, { active: true }) || new OptionsBigData_1.OptionsBigData();
        this.config.selectedOptionName = this.config.selectedOption.name;
        this.config.deleted = params.deleted;
        this.config.deletedTitle = params.deletedTitle;
        this.config.noActions = params.noActions || false;
        this.config.noTitle = params.noTitle || false;
        this.config.hint = params.hint || '';
        setTimeout(this.focusInput, 500);
    }
    OptionsBigDialogController.prototype.initTranslate = function (params) {
        var pipTranslate;
        pipTranslate = this._injector.has('pipTranslate') ? this._injector.get('pipTranslate') : null;
        if (pipTranslate) {
            pipTranslate.translations('en', { 'OPTIONS_TITLE': 'Choose Option' });
            pipTranslate.translations('ru', { 'OPTIONS_TITLE': 'Выберите опцию' });
            this.config.title = pipTranslate.translate(params.title) || pipTranslate.translate('OPTIONS_TITLE');
            this.config.applyButtonTitle = pipTranslate.translate(params.applyButtonTitle) || pipTranslate.translate('SELECT');
        }
        else {
            this.config.title = params.title || 'Choose Option';
            this.config.applyButtonTitle = params.applyButtonTitle || 'Select';
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
        this.config.selectedOptionName = option.name;
        if (this.config.noActions) {
            this.onSelect();
        }
    };
    OptionsBigDialogController.prototype.onSelected = function () {
        this.config.selectedOptionName = this.config.options[this.config.optionIndex].name;
        if (this.config.noActions) {
            this.onSelect();
        }
    };
    OptionsBigDialogController.prototype.onKeyUp = function (event, index) {
        if (event.keyCode === 32 || event.keyCode === 13) {
            event.stopPropagation();
            event.preventDefault();
            if (index !== undefined && index > -1 && index < this.config.options.length) {
                this.config.selectedOptionName = this.config.options[index].name;
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
}());
exports.OptionsBigDialogController = OptionsBigDialogController;
angular
    .module('pipOptionsBigDialog')
    .controller('pipOptionsBigDialogController', OptionsBigDialogController);

},{"./OptionsBigData":19,"./OptionsBigParams":20}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsBigData = (function () {
    function OptionsBigData() {
    }
    return OptionsBigData;
}());
exports.OptionsBigData = OptionsBigData;

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsBigParams = (function () {
    function OptionsBigParams() {
        this.noTitle = false;
        this.noActions = false;
        this.optionIndex = 0;
    }
    return OptionsBigParams;
}());
exports.OptionsBigParams = OptionsBigParams;

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsBigService = (function () {
    OptionsBigService.$inject = ['$mdDialog'];
    function OptionsBigService($mdDialog) {
        this._mdDialog = $mdDialog;
    }
    OptionsBigService.prototype.show = function (params, successCallback, cancelCallback) {
        this._mdDialog.show({
            targetEvent: params.event,
            templateUrl: 'options/OptionsBigDialog.html',
            controller: 'pipOptionsBigDialogController',
            controllerAs: 'vm',
            locals: { params: params },
            clickOutsideToClose: true
        })
            .then(function (option) {
            if (successCallback) {
                successCallback(option);
            }
        }, function () {
            if (cancelCallback) {
                cancelCallback();
            }
        });
    };
    return OptionsBigService;
}());
angular
    .module('pipOptionsBigDialog')
    .service('pipOptionsBigDialog', OptionsBigService);

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsData_1 = require("./OptionsData");
var OptionsParams_1 = require("./OptionsParams");
var OptionsDialogController = (function () {
    OptionsDialogController.$inject = ['$mdDialog', '$injector', '$rootScope', 'params'];
    function OptionsDialogController($mdDialog, $injector, $rootScope, params) {
        "ngInject";
        this.$mdDialog = $mdDialog;
        this.config = new OptionsParams_1.OptionsParams();
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        if (pipTranslate) {
            pipTranslate.translations('en', { 'OPTIONS_TITLE': 'Choose Option' });
            pipTranslate.translations('ru', { 'OPTIONS_TITLE': 'Выберите опцию' });
            this.config.title = pipTranslate.translate(params.title) || pipTranslate.translate('OPTIONS_TITLE');
            this.config.applyButtonTitle = pipTranslate.translate(params.applyButtonTitle) || pipTranslate.translate('SELECT');
        }
        else {
            this.config.title = params.title || 'Choose Option';
            this.config.applyButtonTitle = params.applyButtonTitle || 'Select';
        }
        this.theme = $rootScope['$theme'];
        this.config.options = params.options;
        this.config.selectedOption = _.find(params.options, { active: true }) || new OptionsData_1.OptionsData();
        this.config.selectedOptionName = this.config.selectedOption.name;
        this.config.deleted = params.deleted;
        this.config.deletedTitle = params.deletedTitle;
        setTimeout(this.focusInput, 500);
    }
    OptionsDialogController.prototype.onOk = function () {
        this.$mdDialog.hide();
    };
    OptionsDialogController.prototype.onCancel = function () {
        this.$mdDialog.cancel();
    };
    OptionsDialogController.prototype.onOptionSelect = function (event, option) {
        event.stopPropagation();
        this.config.selectedOptionName = option.name;
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
        option = _.find(this.config.options, { name: this.config.selectedOptionName });
        this.$mdDialog.hide({ option: option, deleted: this.config.deleted });
    };
    OptionsDialogController.prototype.focusInput = function () {
        var list;
        list = $('.pip-options-dialog .pip-list');
        list.focus();
    };
    return OptionsDialogController;
}());
exports.OptionsDialogController = OptionsDialogController;
angular
    .module('pipOptionsDialog')
    .controller('pipOptionsDialogController', OptionsDialogController);

},{"./OptionsData":23,"./OptionsParams":24}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsData = (function () {
    function OptionsData() {
        this.icon = 'star';
        this.active = true;
    }
    return OptionsData;
}());
exports.OptionsData = OptionsData;

},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsParams = (function () {
    function OptionsParams() {
    }
    return OptionsParams;
}());
exports.OptionsParams = OptionsParams;

},{}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsService = (function () {
    OptionsService.$inject = ['$mdDialog'];
    function OptionsService($mdDialog) {
        this._mdDialog = $mdDialog;
    }
    OptionsService.prototype.show = function (params, successCallback, cancelCallback) {
        this._mdDialog.show({
            targetEvent: params.event,
            templateUrl: 'options/OptionsDialog.html',
            controller: 'pipOptionsDialogController',
            controllerAs: 'vm',
            locals: { params: params },
            clickOutsideToClose: true
        })
            .then(function (option) {
            if (successCallback) {
                successCallback(option.option);
            }
        }, function () {
            if (cancelCallback) {
                cancelCallback();
            }
        });
    };
    return OptionsService;
}());
angular
    .module('pipOptionsDialog')
    .service('pipOptionsDialog', OptionsService);

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
angular
    .module('pipOptionsDialog', [
    'ngMaterial',
    'pipDialogs.Translate',
    'pipDialogs.Templates'
]);
require("./OptionsService");
require("./OptionsController");
angular
    .module('pipOptionsBigDialog', [
    'ngMaterial',
    'pipDialogs.Translate',
    'pipDialogs.Templates'
]);
require("./OptionsBigParams");
require("./OptionsBigData");
require("./OptionsData");
require("./OptionsParams");
require("./IOptionsBigDialogController");
require("./OptionsBigService");
require("./OptionsBigController");

},{"./IOptionsBigDialogController":17,"./OptionsBigController":18,"./OptionsBigData":19,"./OptionsBigParams":20,"./OptionsBigService":21,"./OptionsController":22,"./OptionsData":23,"./OptionsParams":24,"./OptionsService":25}],27:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipDialogs.Templates');
} catch (e) {
  module = angular.module('pipDialogs.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('confirmation/ConfirmationDialog.html',
    '<md-dialog class="pip-dialog pip-confirmation-dialog layout-column" width="400" md-theme="{{ ::vm.theme }}"><div class="pip-header"><h3>{{ :: vm.config.title }}</h3></div><div class="pip-footer"><div><md-button ng-click="vm.onCancel()">{{ :: vm.config.cancel }}</md-button><md-button class="md-accent" ng-click="vm.onOk()">{{ :: vm.config.ok }}</md-button></div></div></md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDialogs.Templates');
} catch (e) {
  module = angular.module('pipDialogs.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('error_details/ErrorDetails.html',
    '<md-dialog class="pip-dialog pip-error-details-dialog layout-column" width="400" md-theme="{{vm.theme}}"><div class="pip-body"><div class="pip-header"><h3>{{::vm.config.errorDetails | translate}}</h3></div><div class="layout-row layout-align-start-center error-section text-body2 color-secondary-text" ng-if="vm.config.error.code || (vm.config.error.data && error.data.code)">{{::vm.config.errorCode | translate}}</div><div class="layout-row layout-align-start-center text-subhead1" ng-if="vm.config.error.code || (vm.config.error.data && vm.config.error.data.code)">{{vm.config.error.code || vm.config.error.data.code}}</div><div class="layout-row layout-align-start-center error-section text-body2 color-secondary-text" ng-if="vm.config.error.path || (vm.config.error.data && vm.config.error.data.path)">{{::vm.config.errorPath | translate}}</div><div class="layout-row layout-align-start-center text-subhead1" ng-if="vm.config.error.path || (vm.config.error.data && vm.config.error.data.path)">{{vm.config.error.path || vm.config.error.data.path}}</div><div class="error-section text-body2 color-secondary-text layout-row layout-align-start-center" ng-if="vm.config.error.error || (vm.config.error.data && vm.config.error.data.error)">{{::vm.config.errorText | translate}}</div><div class="layout-row layout-align-start-center text-subhead1" ng-if="vm.config.error.error || (vm.config.error.data && vm.config.error.data.error)">{{vm.config.error.error || vm.config.error.data.error}}</div><div class="error-section text-body2 color-secondary-text layout-row layout-align-start-center" ng-if="vm.config.error.method || (vm.config.error.data && vm.config.error.data.method)">{{::vm.config.errorMethod | translate}}</div><div class="layout-row layout-align-start-center text-subhead1" ng-if="vm.config.error.method || (vm.config.error.data && vm.config.error.data.method)">{{vm.config.error.method || vm.config.error.data.method}}</div><div class="error-section text-body2 color-secondary-text layout-row layout-align-start-center" ng-if="vm.config.error.message || (vm.config.error.data && vm.config.error.data.message)">{{::vm.config.errorMessage | translate}}</div><div class="layout-row layout-align-start-center text-subhead1" ng-if="vm.config.error.message || (vm.config.error.data && vm.config.error.data.message)">{{vm.config.error.message || vm.config.error.data.message}}</div></div><div class="pip-footer"><div><md-button class="md-accent m0" ng-click="vm.onOk()">{{::vm.config.dismissButton | translate}}</md-button></div></div></md-dialog>');
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
    '<md-dialog class="pip-dialog pip-information-dialog layout-column" width="400" md-theme="{{vm.theme}}"><div class="pip-header"><h3>{{:: vm.config.title | translate }}</h3></div><div class="pip-body"><div class="pip-content">{{ vm.config.content }}</div></div><div class="pip-footer"><div><md-button class="md-accent" ng-click="vm.onOk()">{{ vm.config.ok | translate }}</md-button></div></div></md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDialogs.Templates');
} catch (e) {
  module = angular.module('pipDialogs.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('options/OptionsBigDialog.html',
    '<md-dialog class="pip-dialog pip-options-dialog-big layout-column" min-width="400" md-theme="{{vm.theme}}"><md-dialog-content class="pip-body pip-scroll" ng-class="{\'bp24\': !vm.config.noActions}"><div class="pip-header" ng-class="{\'header-hint\': vm.config.noTitle && vm.config.hint}"><h3 class="m0" ng-if="!vm.config.noTitle">{{::vm.config.title | translate}}</h3><div ng-show="vm.config.noTitle && vm.config.hint" class="dialog-hint layout-row layout-align-start-center"><div class="hint-icon-container flex-fixed"><md-icon md-svg-icon="icons:info-circle-outline"></md-icon></div><div>{{::vm.config.hint | translate}}</div></div></div><div class="content-divider" ng-if="!noTitle"></div><div class="pip-content"><div class="spacer8" ng-if="noTitle && hint"></div><md-list class="pip-menu pip-ref-list" pip-selected="vm.config.optionIndex" index="{{vm.config.optionIndex }}" pip-select="vm.onSelected($event)"><md-list-item class="pip-ref-list-item pip-selectable layout-row layout-align-start-center" ng-class="{\'selected md-focused\' : option.name == selectedOptionName, \'divider-bottom\': $index != options.length - 1}" md-ink-ripple="" ng-keyup="vm.onKeyUp($event, $index)" ng-repeat="option in vm.config.options"><div class="pip-content content-stretch" ng-click="vm.onOptionSelect($event, option)"><p class="pip-title spacer-right" ng-if="option.title" style="margin-bottom: 4px !important;">{{::option.title | translate}}</p><div class="pip-subtitle spacer-right" style="height: inherit" ng-if="option.subtitle">{{::option.subtitle | translate}}</div><div class="pip-subtitle spacer-right" style="height: inherit" ng-if="option.text" ng-bind-html="option.text | translate"></div></div></md-list-item></md-list></div><div class="spacer8" ng-if="vm.config.noActions"></div></md-dialog-content><div class="pip-footer" ng-if="!vm.config.noActions"><div><md-button class="pip-cancel" ng-click="vm.onCancel()">{{::\'CANCEL\' | translate}}</md-button><md-button class="pip-submit md-accent" ng-click="vm.onSelect()" style="margin-right: -6px">{{::vm.config.applyButtonTitle | translate}}</md-button></div></div></md-dialog>');
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
    '<md-dialog class="pip-dialog pip-options-dialog layout-column" min-width="400" md-theme="{{vm.theme}}"><md-dialog-content class="pip-body lp0 tp0 rp0 bp24 pip-scroll"><div class="pip-header"><h3>{{::vm.config.title | translate}}</h3><div ng-show="vm.config.deletedTitle" class="header-option text-subhead1 divider-bottom"><md-checkbox ng-model="deleted" aria-label="CHECKBOX">{{::vm.config.deletedTitle | translate}}</md-checkbox></div></div><div class="pip-content"><md-radio-group ng-model="vm.config.selectedOptionName" class="pip-list md-primary" md-no-ink="true" ng-keypress="vm.onKeyPress($event)" tabindex="0"><div ng-repeat="option in vm.config.options" class="pip-list-item" md-ink-ripple="" ui-event="{ click: \'vm.onOptionSelect($event, option)\' }" ng-class="{ selected: option.name == vm.config.selectedOptionName }"><div class="pip-list-item item-padding"><md-icon class="pip-option-icon" md-svg-icon="icons:{{option.icon}}" ng-if="option.icon"></md-icon><div class="pip-option-title">{{::option.title | translate}}</div><md-radio-button ng-value="option.name" tabindex="-1" aria-label="{{::option.title | translate}}"></md-radio-button></div></div></md-radio-group></div></md-dialog-content><div class="pip-footer"><div><md-button class="pip-cancel" ng-click="vm.onCancel()">{{::\'CANCEL\' | translate}}</md-button><md-button class="pip-submit md-accent" ng-click="vm.onSelect()">{{::vm.config.applyButtonTitle | translate}}</md-button></div></div></md-dialog>');
}]);
})();



},{}]},{},[27,1,2,3,4,5,6,7,8,9,10,11,16,12,13,14,15,26,17,18,19,20,21,22,23,24,25])(27)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).nav = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
        this._rootScope.$emit(exports.ActionsChangedEvent, this._config);
    };
    ActionsService.prototype.openMenuEvent = function () {
        this._rootScope.$emit(exports.SecondaryActionsOpenEvent);
    };
    return ActionsService;
}());
var ActionsProvider = (function () {
    function ActionsProvider() {
        this._config = new ActionsConfig();
    }
    Object.defineProperty(ActionsProvider.prototype, "config", {
        get: function () {
            return this._config;
        },
        set: function (value) {
            this._config = value || new ActionsConfig();
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

},{}],2:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var PrimaryActionsController = (function () {
    PrimaryActionsController.$inject = ['$element', '$attrs', '$injector', '$scope', '$log', '$rootScope', '$window', '$location', 'pipActions'];
    function PrimaryActionsController($element, $attrs, $injector, $scope, $log, $rootScope, $window, $location, pipActions) {
        "ngInject";
        var _this = this;
        this._element = $element;
        this._attrs = $attrs;
        this._scope = $scope;
        this._injector = $injector;
        this._log = $log;
        this._rootScope = $rootScope;
        this._window = $window;
        this._location = $location;
        this._pipActions = pipActions;
        this._pipTranslate = this._injector.has('pipTranslate') ? this._injector.get('pipTranslate') : null;
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
        this._element.addClass('pip-primary-actions');
        if (this._scope.localActions) {
            pipActions.primaryLocalActions = this._scope.localActions;
        }
        if (this._scope.globalActions) {
            pipActions.primaryGlobalActions = this._scope.globalActions;
        }
        this.config = pipActions.config;
        this._rootScope.$on('pipActionsChanged', function (event, config) {
            _this.onActionsChanged(event, config);
        });
    }
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
            $mdOpenMenu(this._scope.originatorEv);
            return;
        }
        if (_.isFunction(action.click)) {
            action.click(action);
            return;
        }
        if (action.href) {
            this._window.location.href = action.href;
            return;
        }
        if (action.url) {
            this._location.url(action.url);
            return;
        }
        if (action.state) {
            if (this._injector.has('this._state')) {
                var _state = this._injector.has('pipTranslate') ? this._injector.get('$state') : null;
                if (_state) {
                    _state.go(action.state, action.stateParams);
                }
            }
            return;
        }
        if (action.event) {
            this._rootScope.$broadcast(action.event);
        }
        else {
            this._rootScope.$broadcast('pipActionClicked', action.name);
        }
    };
    return PrimaryActionsController;
}());
(function () {
    function primaryActionsDirective() {
        return {
            restrict: 'E',
            scope: {
                localActions: '=pipLocalActions',
                globalActions: '=pipGlobalActions'
            },
            replace: false,
            templateUrl: 'actions/PrimaryActions.html',
            controller: PrimaryActionsController,
            controllerAs: 'vm'
        };
    }
    angular
        .module('pipActions')
        .directive('pipPrimaryActions', primaryActionsDirective);
})();

},{}],3:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var SecondaryActionsController = (function () {
    SecondaryActionsController.$inject = ['$element', '$attrs', '$injector', '$scope', '$log', '$rootScope', '$window', '$location', 'pipActions'];
    function SecondaryActionsController($element, $attrs, $injector, $scope, $log, $rootScope, $window, $location, pipActions) {
        "ngInject";
        var _this = this;
        this._element = $element;
        this._attrs = $attrs;
        this._scope = $scope;
        this._injector = $injector;
        this._log = $log;
        this._rootScope = $rootScope;
        this._window = $window;
        this._location = $location;
        this._pipActions = pipActions;
        this._element.addClass('pip-secondary-actions');
        if (this._scope.localActions) {
            pipActions.secondaryLocalActions = this._scope.localActions;
        }
        if (this._scope.globalActions) {
            pipActions.secondaryGlobalActions = this._scope.globalActions;
        }
        this.config = pipActions.config;
        this._rootScope.$on('pipActionsChanged', function (event, config) {
            _this.onActionsChanged(event, config);
        });
        this._rootScope.$on('pipSecondaryActionsOpen', function () {
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
        this._scope.originatorEv = ev;
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
            $mdOpenMenu(this._scope.originatorEv);
            return;
        }
        if (action.click) {
            action.click(action);
            return;
        }
        if (action.href) {
            this._window.location.href = action.href;
            return;
        }
        if (action.url) {
            this._location.url(action.url);
            return;
        }
        if (action.state) {
            if (this._injector.has('this._state')) {
                var _state = this._injector.has('pipTranslate') ? this._injector.get('$state') : null;
                if (_state) {
                    _state.go(action.state, action.stateParams);
                }
            }
            return;
        }
        if (action.event) {
            this._rootScope.$broadcast(action.event);
        }
        else {
            this._rootScope.$broadcast('pipActionClicked', action.name);
        }
    };
    return SecondaryActionsController;
}());
(function () {
    function secondaryActionsDirective() {
        return {
            restrict: 'E',
            scope: {
                localActions: '=pipLocalActions',
                globalActions: '=pipGlobalActions'
            },
            replace: false,
            templateUrl: 'actions/SecondaryActions.html',
            controller: SecondaryActionsController,
            controllerAs: 'vm'
        };
    }
    angular
        .module('pipActions')
        .directive('pipSecondaryActions', secondaryActionsDirective);
})();

},{}],4:[function(require,module,exports){
'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipActions', ['ngMaterial', 'pipNav.Templates', 'ui.router']);
require("./ActionsService");
require("./PrimaryActionsDirective");
require("./SecondaryActionsDirective");
__export(require("./ActionsService"));

},{"./ActionsService":1,"./PrimaryActionsDirective":2,"./SecondaryActionsDirective":3}],5:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var AppBarDirectiveController = (function () {
    AppBarDirectiveController.$inject = ['$element', '$scope', '$log', '$rootScope', 'pipAppBar'];
    function AppBarDirectiveController($element, $scope, $log, $rootScope, pipAppBar) {
        "ngInject";
        var _this = this;
        $element.addClass('pip-appbar');
        $element.addClass('color-primary-bg');
        $scope.config = pipAppBar.config;
        $rootScope.$on('pipAppBarChanged', function (event, config) {
            _this.onAppBarChanged(event, config);
        });
    }
    AppBarDirectiveController.prototype.onAppBarChanged = function (event, config) {
        this.config = config;
    };
    return AppBarDirectiveController;
}());
(function () {
    function appbarDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: true,
            templateUrl: 'appbar/AppBar.html',
            controller: AppBarDirectiveController,
            controllerAs: 'vm'
        };
    }
    angular
        .module('pipAppBar')
        .directive('pipAppbar', appbarDirective);
})();

},{}],6:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var AppBarPartDirectiveController = (function () {
    AppBarPartDirectiveController.$inject = ['$element', '$attrs', '$scope', '$log', '$rootScope', 'pipAppBar'];
    function AppBarPartDirectiveController($element, $attrs, $scope, $log, $rootScope, pipAppBar) {
        "ngInject";
        var _this = this;
        this._scope = $scope;
        this._partName = String($attrs.pipAppbarPart);
        this._partValue = null;
        var pos = this._partName.indexOf(':');
        if (pos > 0) {
            this._partValue = this._partName.substr(pos + 1);
            this._partName = this._partName.substr(0, pos);
        }
        $rootScope.$on('pipAppBarChanged', function (event, config) {
            _this.onAppBarChanged(null, config);
        });
    }
    AppBarPartDirectiveController.prototype.onAppBarChanged = function (event, config) {
        var parts = config.parts || {};
        var currentPartValue = parts[this._partName];
        var visible = !!(this._partValue ? currentPartValue == this._partValue : currentPartValue);
        if (visible != this._scope['visible'])
            this._scope['visible'] = visible;
    };
    return AppBarPartDirectiveController;
}());
(function () {
    appbarPartDirective.$inject = ['ngIfDirective'];
    function appbarPartDirective(ngIfDirective) {
        "ngInject";
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
            controller: AppBarPartDirectiveController
        };
    }
    angular.module('pipAppBar')
        .directive('pipAppbarPart', appbarPartDirective);
})();

},{}],7:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppBarChangedEvent = 'pipAppBarChanged';
var AppBarConfig = (function () {
    function AppBarConfig() {
    }
    return AppBarConfig;
}());
exports.AppBarConfig = AppBarConfig;
var AppBarService = (function () {
    function AppBarService(config, $rootScope) {
        this._config = config;
        this._rootScope = $rootScope;
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
        this._rootScope.$broadcast(exports.AppBarChangedEvent, this._config);
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
            this._config = value || new AppBarConfig();
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

},{}],8:[function(require,module,exports){
'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular
    .module('pipAppBar', ['ngMaterial', 'pipNav.Templates']);
require("./AppBarService");
require("./AppBarDirective");
require("./AppBarPartDirective");
__export(require("./AppBarService"));

},{"./AppBarDirective":5,"./AppBarPartDirective":6,"./AppBarService":7}],9:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var BreadcrumbService_1 = require("./BreadcrumbService");
var BreadcrumbService_2 = require("./BreadcrumbService");
var SearchService_1 = require("../search/SearchService");
var BreadcrumbController = (function () {
    BreadcrumbController.$inject = ['$element', '$rootScope', '$window', '$state', '$location', '$injector', 'pipBreadcrumb', '$mdMedia'];
    function BreadcrumbController($element, $rootScope, $window, $state, $location, $injector, pipBreadcrumb, $mdMedia) {
        "ngInject";
        var _this = this;
        this._rootScope = $rootScope;
        this._window = $window;
        this._location = $location;
        this._injector = $injector;
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
                this._window.history.back();
            }
        }
        else {
            this._window.history.back();
        }
    };
    BreadcrumbController.prototype.onClick = function (item) {
        if (_.isFunction(item.click)) {
            item.click(item);
        }
    };
    BreadcrumbController.prototype.openSearch = function () {
        this._rootScope.$broadcast(SearchService_1.OpenSearchEvent);
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
            this._window.location.href = action.href;
            return;
        }
        if (action.url) {
            this._location.url(action.url);
            return;
        }
        if (action.state) {
            if (this._injector.has('$state')) {
                var _state = this._injector.get('$state');
                _state.go(action.state, action.stateParams);
            }
            return;
        }
        if (action.event) {
            this._rootScope.$broadcast(action.event);
            this.originatorEv = null;
        }
        else {
            this._rootScope.$broadcast('pipActionClicked', action.name);
            this.originatorEv = null;
        }
    };
    return BreadcrumbController;
}());
(function () {
    function breadcrumbDirective() {
        return {
            restrict: 'E',
            scope: {},
            replace: false,
            templateUrl: 'breadcrumb/Breadcrumb.html',
            controller: BreadcrumbController,
            controllerAs: 'vm'
        };
    }
    angular.module('pipBreadcrumb')
        .directive('pipBreadcrumb', breadcrumbDirective);
})();

},{"../search/SearchService":27,"./BreadcrumbService":10}],10:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreadcrumbChangedEvent = "pipBreadcrumbChanged";
exports.BreadcrumbBackEvent = "pipBreadcrumbBack";
var BreadcrumbItem = (function () {
    function BreadcrumbItem() {
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
        this._rootScope.$broadcast(exports.BreadcrumbChangedEvent, this._config);
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
angular.module('pipBreadcrumb')
    .provider('pipBreadcrumb', BreadcrumbProvider);

},{}],11:[function(require,module,exports){
'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipBreadcrumb', ['ngMaterial', 'pipNav.Templates', 'pipNav.Translate']);
require("./BreadcrumbDirective");
require("./BreadcrumbService");
__export(require("./BreadcrumbService"));

},{"./BreadcrumbDirective":9,"./BreadcrumbService":10}],12:[function(require,module,exports){
'use strict';
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

},{}],13:[function(require,module,exports){
'use strict';
(function () {
    translateFilter.$inject = ['$injector'];
    function translateFilter($injector) {
        "ngInject";
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate.translate(key) || key : key;
        };
    }
    angular
        .module('pipNav.Translate', [])
        .filter('translate', translateFilter);
})();

},{}],14:[function(require,module,exports){
'use strict';
var DropdownDirectiveController = (function () {
    DropdownDirectiveController.$inject = ['$element', '$attrs', '$injector', '$scope', '$log', '$rootScope', '$mdMedia', '$timeout'];
    function DropdownDirectiveController($element, $attrs, $injector, $scope, $log, $rootScope, $mdMedia, $timeout) {
        "ngInject";
        this._element = $element;
        this._attrs = $attrs;
        this._scope = $scope;
        this._injector = $injector;
        this._log = $log;
        this._rootScope = $rootScope;
        this._timeout = $timeout;
        this._pipTheme = $injector.has('pipTheme') ? $injector.get('pipTheme') : null;
        this._pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
        if (this._pipTheme) {
            this.currentTheme = this._pipTheme.theme;
        }
        else if (this._rootScope['$theme']) {
            this.currentTheme = this._rootScope['$theme'];
        }
        this.themeClass = ($attrs.class || '') + ' md-' + this.currentTheme + '-theme';
        this.media = this._pipMedia !== undefined ? this._pipMedia : $mdMedia;
        this.actions = ($scope['actions'] && _.isArray($scope['actions'])) ? $scope['actions'] : [];
        this.activeIndex = $scope['activeIndex'] || 0;
    }
    DropdownDirectiveController.prototype.disabled = function () {
        if (this._scope['ngDisabled']) {
            return this._scope['ngDisabled']();
        }
        else {
            return false;
        }
    };
    DropdownDirectiveController.prototype.onSelect = function (index) {
        var _this = this;
        this.activeIndex = index;
        this._scope['activeIndex'] = index;
        if (this._scope['select']) {
            this._scope['select'](this.actions[index], this.activeIndex);
        }
        if (this._scope['pipChange']) {
            this._timeout(function () {
                _this._scope['pipChange']();
            });
        }
    };
    DropdownDirectiveController.prototype.show = function () {
        var result;
        if (this._scope['showDropdown']()) {
            return !!this._scope['showDropdown']();
        }
        else {
            return true;
        }
    };
    return DropdownDirectiveController;
}());
(function () {
    function dropdownDirective() {
        return {
            restrict: 'E',
            scope: {
                ngDisabled: '&',
                actions: '=pipActions',
                showDropdown: '&pipShow',
                activeIndex: '=pipActiveIndex',
                select: '=pipDropdownSelect',
                pipChange: '&'
            },
            templateUrl: 'dropdown/Dropdown.html',
            controller: DropdownDirectiveController,
            controllerAs: 'vm'
        };
    }
    angular
        .module('pipDropdown', ['pipNav.Templates'])
        .directive('pipDropdown', dropdownDirective);
})();

},{}],15:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var NavHeaderDirectiveController = (function () {
    NavHeaderDirectiveController.$inject = ['$element', '$scope', '$log', '$rootScope', '$timeout', 'pipNavHeader', 'navConstant'];
    function NavHeaderDirectiveController($element, $scope, $log, $rootScope, $timeout, pipNavHeader, navConstant) {
        "ngInject";
        var _this = this;
        this._element = $element;
        this._scope = $scope;
        this._log = $log;
        this._rootScope = $rootScope;
        this._timeout = $timeout;
        this._pipNavHeader = pipNavHeader;
        this._element.addClass('pip-sticky-nav-header');
        this.initImage();
        var cleanupNavHeaderChanged = this._rootScope.$on('pipNavHeaderChanged', function ($event, config) {
            _this.onNavHeaderChanged($event, config);
        });
        var cleanupSideNavStateChanged = this._rootScope.$on('pipSideNavStateChanged', function ($event, state) {
            _this.onStateChanged($event, state);
        });
        $scope.$on('$destroy', function () {
            if (angular.isFunction(cleanupNavHeaderChanged)) {
                cleanupNavHeaderChanged();
            }
            if (angular.isFunction(cleanupSideNavStateChanged)) {
                cleanupSideNavStateChanged();
            }
        });
    }
    NavHeaderDirectiveController.prototype.initImage = function () {
        var _this = this;
        this.imageBlock = this._element.find('.pip-sticky-nav-header-user');
        this._timeout(function () {
            _this.image = _this._element.find('.pip-sticky-nav-header-user-image');
            if (_this.image[0]) {
                _this.image[0].onload = (function () { return _this.onImageLoad(); });
                _this.image[0].onerror = (function () { return _this.onImageError(); });
            }
            else {
                _this.image.onload = (function () { return _this.onImageLoad(); });
                _this.image.onerror = (function () { return _this.onImageError(); });
            }
            _this.onNavHeaderChanged(null, _this._pipNavHeader.config);
        }, 20);
    };
    NavHeaderDirectiveController.prototype.initHeader = function () {
        if (!this._pipNavHeader.config)
            return;
        this.title = this._pipNavHeader.config.title;
        this.subtitle = this._pipNavHeader.config.subtitle;
        this.imageUrl = this._pipNavHeader.config.imageUrl;
        this.imageCss = this._pipNavHeader.config.imageCss;
    };
    NavHeaderDirectiveController.prototype.onImageLoad = function () {
        this.setImageMarginCSS(this.image);
    };
    ;
    NavHeaderDirectiveController.prototype.onImageError = function () {
        var _this = this;
        if (this.loadedDefaultImage)
            return;
        this._scope.$apply(function () {
            _this.setImage(_this._pipNavHeader.config, true);
        });
    };
    ;
    NavHeaderDirectiveController.prototype.onStateChanged = function (event, state) {
        if (state === undefined)
            return;
        if (state.id == 'toggle') {
            this._timeout(function () {
                this.showHeader = state && state.id == 'toggle';
            }, 400);
        }
        else {
            this.showHeader = false;
        }
    };
    NavHeaderDirectiveController.prototype.setImageMarginCSS = function (image) {
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
    NavHeaderDirectiveController.prototype.setImage = function (config, loadError) {
        if (!config)
            return;
        var url;
        if (!loadError && !!config.imageUrl && !this.loadedDefaultImage) {
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
            this.imageBlock.css('display', 'none');
        }
    };
    NavHeaderDirectiveController.prototype.onNavHeaderChanged = function ($event, config) {
        if (!config)
            return;
        this.setImage(config, false);
        this.title = config.title;
        this.subtitle = config.subtitle;
        this.imageUrl = config.imageUrl;
        this.imageCss = config.imageCss;
    };
    NavHeaderDirectiveController.prototype.onUserClick = function () {
        this._rootScope.$broadcast('pipNavUserClicked');
    };
    return NavHeaderDirectiveController;
}());
(function () {
    function navHeaderDirective() {
        return {
            restrict: 'EA',
            replace: false,
            templateUrl: 'header/NavHeader.html',
            controller: NavHeaderDirectiveController,
            controllerAs: 'vm'
        };
    }
    angular
        .module('pipNavHeader')
        .directive('pipNavHeader', navHeaderDirective);
})();

},{}],16:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavHeaderChangedEvent = 'pipNavHeaderChanged';
var NavHeaderConfig = (function () {
    function NavHeaderConfig() {
    }
    return NavHeaderConfig;
}());
exports.NavHeaderConfig = NavHeaderConfig;
;
var NavHeaderService = (function () {
    function NavHeaderService(config, $rootScope) {
        this._config = config;
        this._rootScope = $rootScope;
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
        this._rootScope.$emit(exports.NavHeaderChangedEvent, this._config);
    };
    return NavHeaderService;
}());
var NavHeaderProvider = (function () {
    function NavHeaderProvider() {
        this._config = new NavHeaderConfig();
    }
    Object.defineProperty(NavHeaderProvider.prototype, "config", {
        get: function () {
            return this._config;
        },
        set: function (value) {
            this._config = value || new NavHeaderConfig();
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

},{}],17:[function(require,module,exports){
'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipNavHeader', ['ngMaterial', 'pipNav.Templates']);
require("./NavHeaderService");
require("./NavHeaderDirective");
__export(require("./NavHeaderService"));

},{"./NavHeaderDirective":15,"./NavHeaderService":16}],18:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var SideNavEvents_1 = require("../sidenav/SideNavEvents");
exports.NavIconClickedEvent = 'pipNavIconClicked';
var NavIconDirectiveController = (function () {
    NavIconDirectiveController.$inject = ['$element', '$scope', '$log', '$rootScope', '$window', 'pipNavIcon'];
    function NavIconDirectiveController($element, $scope, $log, $rootScope, $window, pipNavIcon) {
        "ngInject";
        var _this = this;
        this._element = $element;
        this._scope = $scope;
        this._log = $log;
        this._rootScope = $rootScope;
        this._window = $window;
        $element.addClass('pip-nav-icon');
        this.config = pipNavIcon.config;
        $rootScope.$on('pipNavIconChanged', function (event, config) {
            _this.onNavIconChanged(event, config);
        });
    }
    NavIconDirectiveController.prototype.onNavIconChanged = function (event, config) {
        this.config = config;
    };
    NavIconDirectiveController.prototype.onNavIconClick = function () {
        if (_.isFunction(this.config.click)) {
            this.config.click();
        }
        else if (this.config.event) {
            this._rootScope.$broadcast(this.config.event);
        }
        else if (this.config.type == 'menu') {
            this._rootScope.$broadcast(SideNavEvents_1.OpenSideNavEvent);
        }
        else if (this.config.type == 'back') {
            this._window.history.back();
        }
        else {
            this._rootScope.$broadcast(exports.NavIconClickedEvent);
        }
    };
    return NavIconDirectiveController;
}());
(function () {
    function navIconDirective() {
        return {
            restrict: 'E',
            scope: {
                type: '=pipType',
                imageUrl: '=pipImageUrl',
                icon: '=pipIcon'
            },
            replace: false,
            templateUrl: 'icon/NavIcon.html',
            controller: NavIconDirectiveController,
            controllerAs: 'vm'
        };
    }
    angular
        .module('pipNavIcon')
        .directive('pipNavIcon', navIconDirective);
})();

},{"../sidenav/SideNavEvents":30}],19:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavIconChangedEvent = 'pipNavIconChanged';
var NavIconConfig = (function () {
    function NavIconConfig() {
    }
    return NavIconConfig;
}());
exports.NavIconConfig = NavIconConfig;
;
var NavIconService = (function () {
    function NavIconService(config, $rootScope) {
        this._config = config;
        this._rootScope = $rootScope;
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
        this._rootScope.$broadcast(exports.NavIconChangedEvent, this._config);
    };
    return NavIconService;
}());
var NavIconProvider = (function () {
    function NavIconProvider() {
        this._config = new NavIconConfig();
    }
    Object.defineProperty(NavIconProvider.prototype, "config", {
        get: function () {
            return this._config;
        },
        set: function (value) {
            this._config = value || new NavIconConfig();
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

},{}],20:[function(require,module,exports){
'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipNavIcon', ['ngMaterial', 'pipNav.Translate', 'pipNav.Templates']);
require("./NavIconService");
require("./NavIconDirective");
__export(require("./NavIconService"));

},{"./NavIconDirective":18,"./NavIconService":19}],21:[function(require,module,exports){
'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
require("./dependencies/TranslateFilter");
require("./language/LanguagePickerDirective");
require("./dropdown/DropdownDirective");
require("./tabs/TabsDirective");
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
__export(require("./search"));
__export(require("./sidenav"));
__export(require("./icon"));
__export(require("./menu"));
__export(require("./header"));

},{"./actions":4,"./appbar":8,"./breadcrumb":11,"./common/NavService":12,"./dependencies/TranslateFilter":13,"./dropdown/DropdownDirective":14,"./header":17,"./icon":20,"./language/LanguagePickerDirective":22,"./menu":25,"./search":28,"./sidenav":34,"./tabs/TabsDirective":35}],22:[function(require,module,exports){
'use strict';
var LanguagePickerDirectiveController = (function () {
    LanguagePickerDirectiveController.$inject = ['$element', '$attrs', '$injector', '$scope', '$log', '$rootScope', '$timeout'];
    function LanguagePickerDirectiveController($element, $attrs, $injector, $scope, $log, $rootScope, $timeout) {
        "ngInject";
        this.languages = ['en', 'ru'];
        this._element = $element;
        this._attrs = $attrs;
        this._scope = $scope;
        this._injector = $injector;
        this._log = $log;
        this._rootScope = $rootScope;
        this._timeout = $timeout;
        this._translate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        $element.addClass('pip-language-picker');
        this.setLanguages($scope['languages']);
        this.selectedLanguage = $scope['value'] || this.languages[0];
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
            this.selectedLanguage = language;
            this._translate.language = this.selectedLanguage;
        }
    };
    return LanguagePickerDirectiveController;
}());
(function () {
    function languagePickerDirective() {
        return {
            restrict: 'E',
            scope: {
                languages: '=languages',
                value: '=value'
            },
            replace: false,
            templateUrl: function (element, attr) {
                return 'language/LanguagePicker.html';
            },
            controller: LanguagePickerDirectiveController,
            controllerAs: 'vm'
        };
    }
    angular
        .module('pipLanguagePicker', [
        'ngMaterial', 'pipNav.Translate', 'pipNav.Templates'
    ])
        .directive('pipLanguagePicker', languagePickerDirective);
})();

},{}],23:[function(require,module,exports){
'use strict';
(function () {
    NavMenuDirectiveController.$inject = ['$scope', '$element', '$rootScope', '$window', '$location', '$timeout', '$injector', 'pipSideNav', 'pipNavMenu'];
    function NavMenuDirectiveController($scope, $element, $rootScope, $window, $location, $timeout, $injector, pipSideNav, pipNavMenu) {
        "ngInject";
        var animationDuration = 450, pipSideNavElement = $element.parent().parent();
        $element.addClass('pip-sticky-nav-menu');
        $scope.sections = $scope.sections || pipNavMenu.sections;
        setCollapsible();
        $scope.defaultIcon = pipNavMenu.defaultIcon;
        onStateChanged(null, pipSideNav.state);
        $rootScope.$on('pipNavMenuChanged', onConfigChanged);
        $rootScope.$on('pipSideNavStateChanged', onStateChanged);
        $scope.itemVisible = isHidden;
        $scope.clickLink = clickLink;
        $scope.isSectionEmpty = isSectionEmpty;
        $scope.onExpand = onExpand;
        $scope.isActive = isActive;
        return;
        function setCollapsible() {
            var collapsed;
            if (angular.isFunction($scope.collapsed)) {
                collapsed = $scope.collapsed();
            }
            else {
                collapsed = $scope.collapsed !== false && $scope.collapsed !== 'false';
            }
            $scope.isCollapsed = collapsed;
        }
        function onExpand() {
            if (!$scope.isCollapsed) {
                return;
            }
            $scope.expanded = !$scope.expanded;
            if ($scope.expanded) {
                pipSideNavElement.removeClass('pip-sticky-nav-small');
            }
            else {
                pipSideNavElement.addClass('pip-sticky-nav-small');
            }
            $rootScope.$emit('pipNavExpanded', $scope.expanded);
        }
        function isHidden(item) {
            return item && item.access && !item.access(item);
        }
        function isSectionEmpty(linkCollection) {
            var result = true;
            _.each(linkCollection, function (link) {
                if (!isHidden(link))
                    result = false;
            });
            return result;
        }
        function onConfigChanged(event, config) {
            if (!config)
                return;
            $scope.sections = config.sections;
        }
        function onStateChanged(event, state) {
            if (!state)
                return;
            $scope.isCollapsed = state.expand;
            $scope.expanded = state.isExpanded;
            $scope.expandedButton = state.expandedButton;
            $scope.sideNavState = state;
        }
        function isActive(link) {
            if (link.parentState) {
                var $state = $injector.has('$state') ? $injector.get('$state') : null;
                if ($state != null && $state.includes(link.parentState)) {
                    return true;
                }
            }
            else if (link.state) {
                var $state = $injector.has('$state') ? $injector.get('$state') : null;
                if ($state != null && $state.includes(link.state)) {
                    return true;
                }
            }
            else if (link.href) {
                if (link.href.split('?')[0] === $window.location.href.split('?')[0]) {
                    return true;
                }
            }
            else if (link.url) {
                if (link.url.split(/[\s/?]+/)[1] === $location.url().split(/[\s/?]+/)[1]) {
                    return true;
                }
            }
            return false;
        }
        function clickLink(event, link) {
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
                }, animationDuration);
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
                }, animationDuration);
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
                }, animationDuration);
                return;
            }
            else if (link.event)
                $rootScope.$broadcast(link.event, link);
            pipSideNav.close();
        }
    }
    function navMenuDirective() {
        return {
            restrict: 'EA',
            scope: {},
            replace: false,
            templateUrl: 'menu/NavMenu.html',
            controller: NavMenuDirectiveController
        };
    }
    angular
        .module('pipNavMenu')
        .directive('pipNavMenu', navMenuDirective);
})();

},{}],24:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavMenuChangedEvent = 'pipNavMenuChanged';
var NavMenuLink = (function () {
    function NavMenuLink() {
    }
    return NavMenuLink;
}());
exports.NavMenuLink = NavMenuLink;
var NavMenuSection = (function () {
    function NavMenuSection() {
    }
    return NavMenuSection;
}());
exports.NavMenuSection = NavMenuSection;
var NavMenuConfig = (function () {
    function NavMenuConfig() {
    }
    return NavMenuConfig;
}());
exports.NavMenuConfig = NavMenuConfig;
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

},{}],25:[function(require,module,exports){
'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipNavMenu', ['ngMaterial', 'pipNav.Translate', 'pipNav.Templates']);
require("./NavMenuService");
require("./NavMenuDirective");
__export(require("./NavMenuService"));

},{"./NavMenuDirective":23,"./NavMenuService":24}],26:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var SearchService_1 = require("./SearchService");
var SearchService_2 = require("./SearchService");
var SearchBarController = (function () {
    SearchBarController.$inject = ['$element', '$rootScope', 'pipSearch'];
    function SearchBarController($element, $rootScope, pipSearch) {
        "ngInject";
        var _this = this;
        this.enabled = false;
        this.search = { text: '' };
        this._rootScope = $rootScope;
        this._element = $element;
        $element.addClass('pip-search-bar');
        this.config = pipSearch.config;
        this.stateChange();
        $rootScope.$on(SearchService_1.SearchChangedEvent, function (event, config) {
            _this.onSearchChanged(event, config);
        });
    }
    SearchBarController.prototype.stateChange = function () {
        if (this.enabled) {
            this._element.addClass('w-stretch');
            this._element.parent().addClass('pip-search-active');
        }
        else {
            this._element.removeClass('w-stretch');
            this._element.parent().removeClass('pip-search-active');
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
            this._rootScope.$broadcast(SearchService_2.SearchActivatedEvent, search);
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
(function () {
    function searchBarDirective() {
        return {
            restrict: 'E',
            scope: {},
            replace: false,
            templateUrl: 'search/SearchBar.html',
            controller: SearchBarController,
            controllerAs: 'vm'
        };
    }
    angular.module('pipSearchBar')
        .directive('pipSearchBar', searchBarDirective);
})();

},{"./SearchService":27}],27:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenSearchEvent = 'pipOpenSearch';
exports.CloseSearchEvent = 'pipCloseSearch';
exports.SearchChangedEvent = 'pipSearchChanged';
exports.SearchActivatedEvent = 'pipSearchActivated';
var SearchConfig = (function () {
    function SearchConfig() {
    }
    return SearchConfig;
}());
exports.SearchConfig = SearchConfig;
var SearchService = (function () {
    function SearchService(config, $rootScope) {
        var _this = this;
        this._config = config;
        this._rootScope = $rootScope;
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
        this._rootScope.$broadcast(exports.SearchChangedEvent, this._config);
    };
    return SearchService;
}());
var SearchProvider = (function () {
    function SearchProvider() {
        this._config = new SearchConfig();
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

},{}],28:[function(require,module,exports){
'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipSearchBar', ['ngMaterial', 'pipNav.Translate', 'pipNav.Templates']);
require("./SearchService");
require("./SearchBarDirective");
__export(require("./SearchService"));

},{"./SearchBarDirective":26,"./SearchService":27}],29:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var SideNavState_1 = require("./SideNavState");
var SideNavDirectiveController = (function () {
    SideNavDirectiveController.$inject = ['$element', '$attrs', '$injector', '$scope', '$log', '$rootScope', '$timeout', 'pipSideNav', 'navConstant'];
    function SideNavDirectiveController($element, $attrs, $injector, $scope, $log, $rootScope, $timeout, pipSideNav, navConstant) {
        "ngInject";
        var _this = this;
        this._element = $element;
        this._attrs = $attrs;
        this._scope = $scope;
        this._injector = $injector;
        this._log = $log;
        this._rootScope = $rootScope;
        this._timeout = $timeout;
        this._pipSideNav = pipSideNav;
        console.log('this._pipSideNav', this._pipSideNav);
        this._pipMedia = this._injector.has('pipMedia') ? this._injector.get('pipMedia') : null;
        this._mainContainer = navConstant.SIDENAV_CONTAINER;
        this._bigWidth = navConstant.SIDENAV_LARGE_WIDTH;
        this._middleWidth = navConstant.SIDENAV_MIDDLE_WIDTH;
        this._smallWidth = navConstant.SIDENAV_SMALL_WIDTH;
        this._isResizing = false;
        this._animationDuration = navConstant.SIDENAV_ANIMATION_DURATION;
        this._navState = new SideNavState_1.SideNavStateConfig();
        this._mediaBreakpoints = this.setBreakpoints();
        this._element.addClass('pip-sticky-sidenav');
        var cleanupMainResized;
        var cleanupSideNavState;
        if (this._pipSideNav.config && this._pipSideNav.config.type != 'popup') {
            this._timeout(function () {
                _this.setSideNaveState();
            }, 100);
            this.windowResize = _.debounce(function () { _this.setSideNaveState(); }, 10);
            cleanupMainResized = $rootScope.$on('pipMainResized', function () {
                _this.windowResize();
            });
            cleanupSideNavState = $rootScope.$on('pipSideNavState', function ($event, state) {
                _this.onSideNavState($event, state);
            });
        }
        else {
            this._isResizing = false;
            $scope.sidenavState = null;
            $timeout(function () {
                this.setState(SideNavState_1.SideNavStateNames.Toggle);
            }, 100);
        }
        var cleanupNavHeaderChanged = this._rootScope.$on('pipNavIconClicked', function () {
            _this.onNavIconClick();
        });
        var cleanupSideNavChanged = this._rootScope.$on('pipSideNavChanged', function ($event, config) {
            _this.onSideNavChanged($event, config);
        });
        $scope.$on('$destroy', function () {
            if (angular.isFunction(cleanupNavHeaderChanged)) {
                cleanupNavHeaderChanged();
            }
            if (angular.isFunction(cleanupSideNavChanged)) {
                cleanupSideNavChanged();
            }
            if (angular.isFunction(cleanupMainResized)) {
                cleanupMainResized();
            }
            if (angular.isFunction(cleanupSideNavState)) {
                cleanupSideNavState();
            }
        });
    }
    SideNavDirectiveController.prototype.setBreakpoints = function () {
        if (!this._pipMedia || !angular.isObject(this._pipMedia.breakpoints)) {
            return { xs: 639, sm: 959, md: 1024, lg: 1919 };
        }
        else {
            return this._pipMedia.breakpoints;
        }
    };
    SideNavDirectiveController.prototype.onSideNavChanged = function ($event, config) {
        if (config && config.visible) {
            this._element.css('display', 'block');
        }
        else {
            this._element.css('display', 'none');
        }
    };
    SideNavDirectiveController.prototype.onNavIconClick = function () {
        this._pipSideNav.open();
    };
    SideNavDirectiveController.prototype.onSideNavState = function ($event, stateName) {
        if (angular.isString(stateName) && this._navState[stateName] !== undefined) {
            this.setState(stateName);
        }
    };
    SideNavDirectiveController.prototype.setSideNaveState = function () {
        var _this = this;
        if (this._pipSideNav.config && this._pipSideNav.config.type == 'popup') {
            return;
        }
        if (this._isResizing) {
            this._timeout(function () { _this.setSideNaveState(); }, this._animationDuration);
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
    SideNavDirectiveController.prototype.setState = function (stateName) {
        var _this = this;
        if (this._isResizing)
            return;
        if (this.sidenavState && this.sidenavState.id == stateName)
            return;
        if (stateName != SideNavState_1.SideNavStateNames.Toggle) {
            this._element.removeClass('sidenav-mobile');
        }
        if (stateName != SideNavState_1.SideNavStateNames.Small) {
            this._element.removeClass('pip-sticky-nav-small');
        }
        if (stateName != SideNavState_1.SideNavStateNames.XLarge) {
            this._element.removeClass('sidenav-desktop');
        }
        if (stateName != SideNavState_1.SideNavStateNames.Large) {
            this._element.removeClass('sidenav-smalldesktop');
        }
        this._isResizing = true;
        if (stateName == SideNavState_1.SideNavStateNames.Toggle) {
            this._pipSideNav.close();
        }
        this.sidenavState = this._navState[String(stateName)];
        this._element.addClass(this.sidenavState.addClass);
        this._pipSideNav.state = this.sidenavState;
        this._timeout(function () {
            _this.setSideNaveState();
        }, 15);
        this._timeout(function () {
            _this._isResizing = false;
        }, this._animationDuration);
    };
    return SideNavDirectiveController;
}());
(function () {
    function sideNavDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: true,
            templateUrl: 'sidenav/SideNav.html',
            controller: SideNavDirectiveController,
            controllerAs: 'vm'
        };
    }
    angular
        .module('pipSideNav')
        .directive('pipSidenav', sideNavDirective);
})();

},{"./SideNavState":33}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SideNavChangedEvent = 'pipSideNavChanged';
exports.SideNavStateChangedEvent = 'pipSideNavStateChanged';
exports.OpenSideNavEvent = 'pipOpenSideNav';
exports.CloseSideNavEvent = 'pipCloseSideNav';

},{}],31:[function(require,module,exports){
'use strict';
(function () {
    SideNavPartDirectiveController.$inject = ['$scope', '$element', '$attrs', '$rootScope', 'pipSideNav'];
    sidenavPartDirective.$inject = ['ngIfDirective'];
    function SideNavPartDirectiveController($scope, $element, $attrs, $rootScope, pipSideNav) {
        "ngInject";
        var partName = '' + $attrs.pipSidenavPart;
        var partValue = null;
        var pos = partName.indexOf(':');
        if (pos > 0) {
            partValue = partName.substr(pos + 1);
            partName = partName.substr(0, pos);
        }
        onSideNavChanged(null, pipSideNav.config);
        $rootScope.$on('pipSideNavChanged', onSideNavChanged);
        function onSideNavChanged(event, config) {
            var parts = config.parts || {};
            var currentPartValue = parts[partName];
            var visible = !!(partValue ? currentPartValue == partValue : currentPartValue);
            if (visible != $scope.visible)
                $scope.visible = visible;
        }
    }
    function sidenavPartDirective(ngIfDirective) {
        "ngInject";
        var ngIf = ngIfDirective[0];
        return {
            transclude: ngIf.transclude,
            priority: ngIf.priority,
            terminal: ngIf.terminal,
            restrict: ngIf.restrict,
            scope: true,
            link: function linkFunction($scope, $element, $attrs) {
                $attrs.ngIf = function () { return $scope.visible; };
                ngIf.link.apply(ngIf, arguments);
            },
            controller: SideNavPartDirectiveController
        };
    }
    angular
        .module('pipSideNav')
        .directive('pipSidenavPart', sidenavPartDirective);
})();

},{}],32:[function(require,module,exports){
"use strict";
hookSideNavEvents.$inject = ['$rootScope', 'pipSideNav'];
Object.defineProperty(exports, "__esModule", { value: true });
var SideNavEvents_1 = require("./SideNavEvents");
var SideNavConfig = (function () {
    function SideNavConfig() {
    }
    return SideNavConfig;
}());
exports.SideNavConfig = SideNavConfig;
var SideNavService = (function () {
    function SideNavService(config, $rootScope, $mdSidenav) {
        this._config = config;
        this._rootScope = $rootScope;
        this._sidenav = $mdSidenav;
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
            this._rootScope.$broadcast(SideNavEvents_1.SideNavStateChangedEvent, value);
        },
        enumerable: true,
        configurable: true
    });
    SideNavService.prototype.open = function () {
        this._sidenav('pip-sticky-sidenav').open();
    };
    SideNavService.prototype.close = function () {
        this._sidenav('pip-sticky-sidenav').close();
    };
    SideNavService.prototype.toggle = function () {
        this._sidenav('pip-sticky-sidenav').toggle();
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
        this._rootScope.$emit(SideNavEvents_1.SideNavChangedEvent, this._config);
    };
    return SideNavService;
}());
var SideNavProvider = (function () {
    function SideNavProvider() {
        this._config = {
            parts: {},
            classes: [],
            type: 'popup',
            state: null,
            visible: true
        };
    }
    Object.defineProperty(SideNavProvider.prototype, "config", {
        get: function () {
            return this._config;
        },
        set: function (value) {
            this._config = value || new SideNavConfig();
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
    $rootScope.$on(SideNavEvents_1.OpenSideNavEvent, function () { pipSideNav.open(); });
    $rootScope.$on(SideNavEvents_1.CloseSideNavEvent, function () { pipSideNav.close(); });
}
angular
    .module('pipSideNav')
    .provider('pipSideNav', SideNavProvider)
    .run(hookSideNavEvents);

},{"./SideNavEvents":30}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SideNavStateNames = (function () {
    function SideNavStateNames() {
    }
    return SideNavStateNames;
}());
SideNavStateNames.Toggle = 'toogle';
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

},{}],34:[function(require,module,exports){
'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipSideNav', ['ngMaterial', 'pipNav.Templates']);
require("./SideNavEvents");
require("./SideNavState");
require("./SideNavService");
require("./SideNavPartDirective");
require("./SideNavDirective");
__export(require("./SideNavService"));

},{"./SideNavDirective":29,"./SideNavEvents":30,"./SideNavPartDirective":31,"./SideNavService":32,"./SideNavState":33}],35:[function(require,module,exports){
'use strict';
var Selected = (function () {
    function Selected() {
        this.activeIndex = 0;
        this.activeTab = 0;
    }
    return Selected;
}());
var TabsDirectiveController = (function () {
    TabsDirectiveController.$inject = ['$element', '$attrs', '$injector', '$scope', '$log', '$rootScope', '$mdMedia', '$timeout', 'navConstant'];
    function TabsDirectiveController($element, $attrs, $injector, $scope, $log, $rootScope, $mdMedia, $timeout, navConstant) {
        "ngInject";
        var _this = this;
        this._element = $element;
        this._attrs = $attrs;
        this._scope = $scope;
        this._injector = $injector;
        this._log = $log;
        this._rootScope = $rootScope;
        this._timeout = $timeout;
        this.selected = new Selected();
        this.setTheme();
        this.setMedia($mdMedia);
        this.initTabs();
        this.breakpoints = this._scope['breakpoints'] ? this._scope['breakpoints'] : navConstant.TAB_BREAKPOINT;
        if (this.toBoolean($attrs['pipRebind'])) {
            this._scope.$watch(function () { return _this._scope['activeIndex']; }, function (newValue, oldValue) {
                _this.selected.activeIndex = newValue || 0;
                _this.selected.activeTab = _this.selected.activeIndex;
            });
        }
    }
    TabsDirectiveController.prototype.setTheme = function () {
        this._pipTheme = this._injector.has('pipTheme') ? this._injector.get('pipTheme') : null;
        if (this._pipTheme) {
            this.currentTheme = this._pipTheme.theme;
        }
        else if (this._rootScope['$theme']) {
            this.currentTheme = this._rootScope['$theme'];
        }
        this.themeClass = (this._attrs['class'] || '') + ' md-' + this.currentTheme + '-theme';
    };
    TabsDirectiveController.prototype.setMedia = function ($mdMedia) {
        this._pipMedia = this._injector.has('pipMedia') ? this._injector.get('pipMedia') : null;
        this.media = this._pipMedia !== undefined ? this._pipMedia : $mdMedia;
    };
    TabsDirectiveController.prototype.setTranslate = function () {
        this._pipTranslate = this._injector.has('pipTranslate') ? this._injector.get('pipTranslate') : null;
        if (this._pipTranslate) {
            if (this.tabs.length > 0 && this.tabs[0].title) {
                this._pipTranslate.translateObjects(this.tabs, 'title', 'nameLocal');
            }
            else {
                this._pipTranslate.translateObjects(this.tabs, 'name', 'nameLocal');
            }
        }
    };
    TabsDirectiveController.prototype.initTabs = function () {
        var _this = this;
        this.tabs = (this._scope['tabs'] && _.isArray(this._scope['tabs'])) ? this._scope['tabs'] : [];
        this.pipTabIndex = this._attrs['pipTabIndex'] ? parseInt(this._attrs['pipTabIndex']) : 0;
        this.selected.activeIndex = this._scope['activeIndex'] || 0;
        this.selected.activeTab = this.selected.activeIndex;
        if (this.pipTabIndex) {
            this._timeout(function () {
                var a = _this._element.find('md-tabs-canvas');
                if (a && a[0]) {
                    angular.element(a[0]).attr('tabindex', _this.pipTabIndex);
                }
                a.on('focusout', function () {
                    var _this = this;
                    angular.element(a[0]).attr('tabindex', this.pipTabIndex);
                    this._timeout(function () {
                        angular.element(a[0]).attr('tabindex', _this.pipTabIndex);
                    }, 50);
                });
            }, 1000);
        }
        this.setTranslate();
    };
    TabsDirectiveController.prototype.disabled = function () {
        if (this._scope['ngDisabled']) {
            return this._scope['ngDisabled']();
        }
        return false;
    };
    ;
    TabsDirectiveController.prototype.tabDisabled = function (index) {
        return (this.disabled() && this.selected.activeIndex != index);
    };
    ;
    TabsDirectiveController.prototype.onSelect = function (index) {
        var _this = this;
        console.log('onSelect', index);
        if (this.disabled())
            return;
        this.selected.activeIndex = index;
        this.selected.activeTab = this.selected.activeIndex;
        this._timeout(function () {
            _this._scope['activeIndex'] = index;
            console.log('activeIndex', _this._scope['activeIndex']);
            if (_this._scope['select']) {
                _this._scope['select'](_this.tabs[_this.selected.activeIndex], _this.selected.activeIndex);
            }
        }, 0);
    };
    ;
    TabsDirectiveController.prototype.showShadow = function () {
        if (this._scope['showTabsShadow']) {
            return this._scope['showTabsShadow']();
        }
        else {
            return false;
        }
    };
    ;
    TabsDirectiveController.prototype.show = function () {
        if (this._scope['showTabs']) {
            return this._scope['showTabs']();
        }
        else {
            return true;
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
    return TabsDirectiveController;
}());
(function () {
    function tabsDirective() {
        return {
            restrict: 'E',
            scope: {
                ngDisabled: '&',
                tabs: '=pipTabs',
                showTabs: '&pipShowTabs',
                showTabsShadow: '&pipTabsShadow',
                activeIndex: '=pipActiveIndex',
                select: '=pipTabsSelect',
                breakpoints: '=pipBreakpoints'
            },
            templateUrl: 'tabs/Tabs.html',
            controller: TabsDirectiveController,
            controllerAs: 'vm'
        };
    }
    angular
        .module("pipTabs", ['pipNav.Templates'])
        .directive('pipTabs', tabsDirective);
})();

},{}],36:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('actions/PrimaryActions.html',
    '<div pip-focused="" pip-focused-tabindex="2"><md-menu md-position-mode="target-right target" class="pip-primary-actions" ng-repeat="action in vm.config.primaryLocalActions"><md-button class="pip-primary-actions-action md-icon-button pip-focusable" ng-click="vm.clickAction(action, $mdOpenMenu);" tabindex="-1" ng-hide="vm.isHidden(action)" aria-label="{{ action.title | translate }}"><div class="pip-primary-actions-badge" ng-show="action.count > 0">{{ vm.actionCount(action) }}</div><md-icon md-svg-icon="{{ action.icon}}"></md-icon></md-button><md-menu-content width="3"><md-menu-item ng-repeat-start="subAction in action.subActions" ng-if="!subAction.divider" ng-hide="vm.isHidden(subAction)"><md-button class="pip-focusable" ng-hide="subAction.divider" tabindex="-1" ng-click="vm.clickAction(subAction)">{{ ::subAction.title | translate }}</md-button></md-menu-item><md-menu-divider ng-if="subAction.divider" ng-repeat-end=""></md-menu-divider></md-menu-content></md-menu><md-menu md-position-mode="target-right target" class="pip-primary-actions" ng-repeat="action in vm.config.primaryGlobalActions"><md-button class="pip-primary-actions-action md-icon-button pip-focusable" ng-click="vm.clickAction(action, $mdOpenMenu);" ng-hide="vm.isHidden(action)" tabindex="-1" aria-label="{{ action.title | translate }}"><div class="pip-primary-actions-badge color-badge-bg" ng-show="action.count > 0">{{ vm.actionCount(action) }}</div><md-icon md-svg-icon="{{ action.icon }}"></md-icon></md-button><md-menu-content width="3"><md-menu-item ng-repeat-start="subAction in action.subActions" ng-if="!subAction.divider" ng-hide="vm.isHidden(subAction)"><md-button class="pip-focusable" ng-hide="subAction.divider" tabindex="-1" ng-click="vm.clickAction(subAction)">{{ subAction.title | translate }}</md-button></md-menu-item><md-menu-divider ng-if="subAction.divider" ng-repeat-end=""></md-menu-divider></md-menu-content></md-menu></div>');
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
    '<md-menu ng-if="vm.secondaryActionsVisible()" md-position-mode="target-right target"><md-button class="md-icon-button" tabindex="3" ng-init="vm.getMenu($mdOpenMenu)" ng-click="vm.onSecondaryActionClick(); vm.openMenu($mdOpenMenu, $event);" aria-label="open actions"><md-icon md-svg-icon="icons:vdots"></md-icon></md-button><md-menu-content width="3"><md-menu-item ng-repeat-start="action in vm.config.secondaryLocalActions" ng-if="!action.divider" ng-hide="vm.isHidden(action)"><md-button ng-hide="action.divider" ng-click="vm.clickAction(action)">{{ ::action.title | translate }}</md-button></md-menu-item><md-menu-divider ng-if="action.divider" ng-repeat-end=""></md-menu-divider><md-menu-divider ng-if="vm.secondaryDividerVisible()"></md-menu-divider><md-menu-item ng-repeat-start="action in vm.config.secondaryGlobalActions" ng-if="!action.divider" ng-hide="vm.isHidden(action)"><md-button ng-hide="action.divider" ng-click="vm.clickAction(action)">{{ ::action.title | translate }}</md-button></md-menu-item><md-menu-divider ng-if="action.divider" ng-repeat-end=""></md-menu-divider></md-menu-content></md-menu>');
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
    '<md-toolbar class="{{ vm.config.classes.join(\' \') }}" ng-if="vm.config.visible" ng-transclude=""></md-toolbar>');
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
    '<div class="pip-breadcrumb-block"><div class="text-overflow" ng-if="!vm._media(\'xs\')"><span ng-if="vm.config.criteria" ng-click="vm.openSearch()">{{ vm.config.criteria }} -</span><span class="pip-breadcrumb-item {{ $last ? \'breadcrumb-accent\' : \'\' }}" ng-if="vm.config.items && vm.config.items.length > 0" ng-repeat-start="item in vm.config.items" ng-click="vm.onClick(item)" ng-init="stepWidth = 100/(vm.config.items.length + 1)" ng-class="{\'cursor-pointer\': !$last}" ng-style="{\'max-width\': stepWidth + \'%\'}"><span ng-if="!$last || !vm.actionsVisible(item)">{{ item.title | translate }}</span><div ng-if="$last && vm.actionsVisible(item)" style="display: inline-block; position: relative;"><md-menu md-offset="0 44"><span class="layout-row pip-breadcrumb-item-menu cursor-pointer {{ $last ? \'breadcrumb-accent\' : \'\' }}" ng-click="vm.onOpenMenu($mdOpenMenu, $event)" md-ink-ripple="" aria-label="open breadcrumb actions">{{ item.title | translate }}<md-icon class="pip-triangle-down" md-svg-icon="icons:triangle-down"></md-icon></span><md-menu-content width="4"><md-menu-item ng-if="!subItem.divider" ng-repeat-start="subItem in item.subActions"><md-button ng-click="vm.onSubActionClick(subItem)" ng-if="!action.divider" tabindex="4"><md-icon md-menu-align-target="" ng-if="subItem.icon" md-svg-icon="{{ subItem.icon }}"></md-icon><span>{{ subItem.title | translate }}</span></md-button></md-menu-item><md-menu-divider ng-if="subItem.divider" ng-repeat-end=""></md-menu-divider></md-menu-content></md-menu></div></span><md-icon ng-repeat-end="" md-svg-icon="icons:chevron-right" ng-hide="$last"></md-icon><span class="pip-title breadcrumb-accent" ng-if="vm.config.text">{{ vm.config.text | translate }}</span></div><div style="position: relative;" ng-if="vm._media(\'xs\')"><md-menu md-offset="0 44"><span class="pip-mobile-breadcrumb layout-row" ng-click="vm.config.items && vm.config.items.length > 1 ? $mdOpenMenu() : return"><span class="text-overflow"><span ng-if="vm.config.criteria" ng-click="vm.openSearch()">{{ vm.config.criteria }} -</span> <span class="breadcrumb-accent" ng-if="vm.config.text">{{ vm.config.text | translate }}</span> <span ng-if="vm.config.items && vm.config.items.length > 0" class="breadcrumb-accent {{ (vm.config.items && vm.config.items.length > 1) ? \'cursor-pointer\' : \'\' }}">{{ vm.config.items[vm.config.items.length - 1].title | translate }}</span></span><md-icon class="pip-triangle-down cursor-pointer breadcrumb-accent" md-svg-icon="icons:triangle-down" ng-if="vm.config.items && vm.config.items.length > 1"></md-icon></span><md-menu-content width="4"><md-menu-item ng-repeat="item in vm.config.items" ng-if="vm.config.items && vm.config.items.length > 0"><md-button ng-click="vm.onClick(item)" tabindex="5"><md-icon md-menu-align-target="" ng-if="item.icon" md-svg-icon="{{ item.icon }}"></md-icon><span>{{ item.title | translate }}</span></md-button></md-menu-item><md-menu-item ng-if="vm.config.text"><md-button tabindex="5"><span class="text-grey">{{ vm.config.text | translate }}</span></md-button></md-menu-item></md-menu-content></md-menu></div></div>');
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
    '<md-toolbar class="md-subhead color-primary-bg {{ vm.themeClass}}" ng-if="vm.show()" ng-class="{\'md-whiteframe-3dp\': vm.media(\'xs\')}"><div class="pip-divider"></div><md-select ng-model="vm.selectedIndex" tabindex="15" ng-disabled="vm.disabled()" md-container-class="pip-full-width-dropdown" aria-label="DROPDOWN" md-ink-ripple="" md-on-close="vm.onSelect(vm.selectedIndex)"><md-option ng-repeat="action in vm.actions" value="{{ ::$index }}" ng-selected="vm.activeIndex == $index ? true : false">{{ (action.title || action.name || action) | translate }}</md-option></md-select></md-toolbar>');
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
    '<md-toolbar ng-show="showHeader" class="layout-row layout-align-start-center"><div class="flex-fixed pip-sticky-nav-header-user"><md-button class="md-icon-button" ng-click="onUserClick()" aria-label="current user" tabindex="-1"><img src="" class="pip-sticky-nav-header-user-image" ng-class="imageCss"></md-button></div><div class="pip-sticky-nav-header-user-text"><div class="pip-sticky-nav-header-user-pri" ng-click="onUserClick()" tabindex="-1">{{ title | translate }}</div><div class="pip-sticky-nav-header-user-sec">{{ subtitle | translate }}</div></div></md-toolbar>');
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
    '<md-button class="md-icon-button pip-nav-icon" ng-if="vm.config.type != \'none\'" ng-class="vm.config.class" ng-click="vm.onNavIconClick()" tabindex="{{ vm.config.type==\'menu\' || vm.config.type==\'back\' ? 4 : -1 }}" aria-label="menu"><md-icon ng-if="vm.config.type==\'menu\'" md-svg-icon="icons:menu"></md-icon><img ng-src="{{ vm.config.imageUrl }}" ng-if="vm.config.type==\'image\'" height="24" width="24"><md-icon ng-if="vm.config.type==\'back\'" md-svg-icon="icons:arrow-left"></md-icon><md-icon ng-if="vm.config.type==\'icon\'" md-svg-icon="{{ vm.config.icon }}"></md-icon></md-button>');
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
    '<md-menu md-position-mode="target-right target"><span class="pip-language" ng-click="$mdOpenMenu()" aria-label="language selection">{{ vm.selectedLanguage | translate }}<md-icon md-svg-icon="icons:triangle-down"></md-icon></span><md-menu-content width="3"><md-menu-item ng-repeat="language in vm.languages"><md-button ng-click="vm.onLanguageClick(language)" tabindex="7">{{ language | translate }}</md-button></md-menu-item></md-menu-content></md-menu>');
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
    '<div ng-if="sections && sections.length"><md-list class="sidenav-list" pip-focused="" pip-focused-tabindex="10" pip-with-hidden="true"><md-list-item class="no-border pip-sticky-nav-menu-item pip-sticky-nav-expanded-button" ng-click="onExpand()" ng-disabled="!isCollapsed" tabindex="-1" ng-if="expandedButton"><md-icon md-svg-icon="icons:chevron-left" ng-if="expanded" class="pip-sticky-nav-menu-icon"></md-icon><md-icon md-svg-icon="icons:chevron-right" ng-if="!expanded" class="pip-sticky-nav-menu-icon"></md-icon></md-list-item><md-divider ng-show="expandedButton"></md-divider><div class="pip-section" ng-repeat="section in sections" ng-hide="section.access && !section.access(section)"><md-divider ng-show="$index > 0 && !isSectionEmpty(section.links)"></md-divider><md-subheader ng-show="section.title" style="height: 48px;"><span ng-if="expanded" class="pip-sticky-nav-menu-title section-title">{{::section.title | translate}}</span><md-icon md-svg-icon="{{section.icon}}" ng-if="!sideNavState.showIconTooltype && !expanded && section.icon" class="pip-sticky-nav-menu-icon section-icon"></md-icon><md-icon md-svg-icon="{{section.icon}}" ng-if="sideNavState.showIconTooltype && !expanded && section.icon" class="pip-sticky-nav-menu-icon section-icon"><md-tooltip md-visible="showTooltip" md-direction="right" class="sidenav-icon-tooltip">{{::section.tooltipText || section.title | translate}}</md-tooltip></md-icon><md-icon md-svg-icon="{{defaultIcon}}" ng-if="!sideNavState.showIconTooltype && !expanded && !section.icon" class="pip-sticky-nav-menu-icon section-icon"></md-icon><md-icon md-svg-icon="{{defaultIcon}}" ng-if="sideNavState.showIconTooltype && !expanded && !section.icon" class="pip-sticky-nav-menu-icon section-icon"><md-tooltip md-visible="showTooltip" class="md-secondary">{{::section.tooltipText || section.title | translate}}</md-tooltip></md-icon></md-subheader><md-list-item class="no-border pip-sticky-nav-menu-item pip-focusable" ng-repeat="link in section.links" tabindex="-1" ng-class="{\'active\': isActive(link)}" ng-hide="link.access && !link.access(link)"><md-button class="layout-row layout-align-start-center pip-button-block" tabindex="-1" ng-click="clickLink($event, link)"><md-tooltip md-visible="showTooltip" md-direction="right">{{::link.tooltipText | translate}}</md-tooltip><div class="pip-sticky-nav-menu-icon-block"><md-icon md-svg-icon="{{link.icon}}" ng-if="!(sideNavState.showIconTooltype && !link.tooltipText && !expanded)" ng-hide="!link.icon" class="pip-sticky-nav-menu-icon flex-fixed"></md-icon><md-icon md-svg-icon="{{link.icon}}" ng-hide="!link.icon" ng-if="sideNavState.showIconTooltype && !link.tooltipText && !expanded" class="pip-sticky-nav-menu-icon flex-fixed"><md-tooltip md-visible="showTooltip" md-direction="right" class="sidenav-icon-tooltip">{{::link.tooltipText || link.title | translate}}</md-tooltip></md-icon></div><div class="pip-sticky-nav-menu-title">{{::link.title | translate}}</div><div class="pip-sticky-nav-menu-badge {{ link.badgeStyle ? link.badgeStyle : \'color-badge-bg\' }} flex-fixed" ng-if="link.count && link.count < 100">{{link.count}}</div><div class="pip-sticky-nav-menu-badge {{ link.badgeStyle ? link.badgeStyle : \'color-badge-bg\' }} flex-fixed" ng-if="link.count && link.count > 99">!</div></md-button></md-list-item></div></md-list></div>');
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
    '<div class="md-toolbar-tools pip-search-container" ng-if="vm.enabled"><div class="layout-row pip-search-selected"><md-button class="md-icon-button" tabindex="6" aria-label="start search" ng-click="vm.onClick()"><md-icon md-svg-icon="icons:search"></md-icon></md-button><input class="pip-search-text flex" type="search" tabindex="6" ng-model="vm.search.text" ng-keydown="vm.onKeyDown($event)"><md-button class="md-icon-button" tabindex="6" aria-label="clear search" ng-click="vm.clear()"><md-icon md-svg-icon="icons:cross-circle"></md-icon></md-button></div></div><div class="md-toolbar-tools layout-row layout-align-end-center flex-fixed lp0 rp0" ng-if="!vm.enabled"><md-button class="md-icon-button" tabindex="5" aria-label="start search" ng-click="vm.enable()"><md-icon md-svg-icon="icons:search"></md-icon></md-button></div>');
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
    '<md-sidenav class="md-sidenav-left" md-is-locked-open="vm.sidenavState.isLockedOpen" md-component-id="pip-sticky-sidenav" ng-transclude=""></md-sidenav>');
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
    '<md-toolbar class="pip-nav {{ vm.themeClass }}" ng-class="{\'pip-visible\': vm.show(), \'pip-shadow\': vm.showShadow()}"><md-tabs ng-if="vm.media(vm.breakpoints)" md-selected="vm.selected.activeTab" ng-class="{\'disabled\': vm.disabled()}" md-stretch-tabs="true" md-dynamic-height="true"><md-tab ng-repeat="tab in vm.tabs track by $index" ng-disabled="vm.tabDisabled($index)" md-on-select="vm.onSelect($index)"><md-tab-label>{{:: tab.nameLocal }}<div class="pip-tabs-badge color-badge-bg" ng-if="tab.newCounts > 0 && tab.newCounts <= 99">{{ tab.newCounts }}</div><div class="pip-tabs-badge color-badge-bg" ng-if="tab.newCounts > 99">!</div></md-tab-label></md-tab></md-tabs><div class="md-subhead pip-tabs-content color-primary-bg" ng-if="!vm.media(vm.breakpoints)"><div class="pip-divider position-top m0"></div><md-select ng-model="vm.selected.activeIndex" ng-disabled="vm.disabled()" md-container-class="pip-full-width-dropdown" aria-label="SELECT" md-ink-ripple="" md-on-close="vm.onSelect(vm.selected.activeIndex)"><md-option ng-repeat="tab in vm.tabs track by $index" class="pip-tab-option" value="{{ ::$index }}">{{ ::tab.nameLocal }}<div class="pip-tabs-badge color-badge-bg" ng-if="tab.newCounts > 0 && tab.newCounts <= 99">{{ tab.newCounts }}</div><div class="pip-tabs-badge color-badge-bg" ng-if="tab.newCounts > 99">!</div></md-option></md-select></div></md-toolbar>');
}]);
})();



},{}]},{},[36,21])(36)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).themes = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
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
})();

},{}],2:[function(require,module,exports){
(function () {
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
})();

},{}],3:[function(require,module,exports){
(function () {
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
    angular.module('pipTheme.BootBarn.Warm', ['ngMaterial'])
        .config(configureBootBarnWarmTheme);
})();

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
(function () {
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
})();

},{}],8:[function(require,module,exports){
(function () {
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
})();

},{}],9:[function(require,module,exports){
(function () {
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
})();

},{}],10:[function(require,module,exports){
(function () {
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
})();

},{}],11:[function(require,module,exports){
(function () {
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
})();

},{}],12:[function(require,module,exports){
(function () {
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
})();

},{}],13:[function(require,module,exports){
(function () {
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
})();

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
(function () {
    'use strict';
    var thisModule = angular.module('pipErrors.Strings', ['pipTranslate']);
    thisModule.run(['$injector', function ($injector) {
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        if (pipTranslate == null)
            return;
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
    }]);
})();

},{}],2:[function(require,module,exports){
(function () {
    'use strict';
    filterTranslate.$inject = ['$injector'];
    function filterTranslate($injector) {
        var pipTranslate = $injector.has('pipTranslate')
            ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate.translate(key) || key : key;
        };
    }
    var thisModule = angular.module('pipErrors.Translate', []);
    thisModule.filter('translate', filterTranslate);
})();

},{}],3:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('pipErrors', [
        'pipErrors.Pages',
        'pipErrorsService',
        'pipNoConnectionPanel',
        'pipClearErrors',
        'pipFormErrors'
    ]);
})();

},{}],4:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipErrorsService', []);
require("./errors_service");

},{"./errors_service":6}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorsPageRun = (function () {
    function ErrorsPageRun($rootScope, $state, $injector, pipErrorsService) {
        var _this = this;
        this.$state = $state;
        this.$injector = $injector;
        var errorConfig = pipErrorsService.config;
        if (errorConfig.Unsupported.Active) {
            this.checkSupported();
        }
        if (errorConfig.MissingRoute.Active) {
            $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
                event.preventDefault();
                $state.go('errors_missing_route', {
                    unfoundState: unfoundState,
                    fromState: {
                        to: fromState ? fromState.name : '',
                        fromParams: fromParams
                    }
                });
                $rootScope['$routing'] = false;
            });
        }
        if (errorConfig.NoConnection.Active) {
            $rootScope.$on('pipNoConnectionError', function (event, params) {
                _this.noConnectionError(event, params);
            });
        }
        if (errorConfig.Unknown.Active) {
            $rootScope.$on('pipUnknownError', function (event, params) {
                _this.unknownError(event, params);
            });
        }
        if (errorConfig.Maintenance.Active) {
            $rootScope.$on('pipMaintenanceError', function (event, params) {
                _this.maintenanceError(event, params);
            });
        }
    }
    ErrorsPageRun.prototype.goToErrors = function (toState, params) {
        if (toState == null)
            throw new Error('Error state was not defined');
        this.$state.go(toState, params);
    };
    ErrorsPageRun.prototype.maintenanceError = function (event, params) {
        this.goToErrors('errors_maintenance', params);
    };
    ErrorsPageRun.prototype.noConnectionError = function (event, params) {
        this.goToErrors('errors_no_connection', params);
    };
    ErrorsPageRun.prototype.unknownError = function (event, params) {
        this.goToErrors('errors_unknown', params);
    };
    ErrorsPageRun.prototype.checkSupported = function (supported) {
        var pipSystemInfo = this.$injector.has('pipSystemInfo') ? this.$injector.get('pipSystemInfo') : null;
        if (!pipSystemInfo) {
            return;
        }
        if (!supported) {
            supported = {
                edge: 11,
                ie: 11,
                firefox: 43,
                opera: 35,
                chrome: 47
            };
        }
        var browser = pipSystemInfo.browserName;
        var version = pipSystemInfo.browserVersion;
        version = version.split(".")[0];
        if (browser && supported[browser] && version >= supported[browser]) {
            return;
        }
        this.$state.go('errors_unsupported');
    };
    return ErrorsPageRun;
}());
var AuthHttpResponseInterceptor = (function () {
    AuthHttpResponseInterceptor.$inject = ['$q', '$location', '$rootScope'];
    function AuthHttpResponseInterceptor($q, $location, $rootScope) {
        this.$q = $q;
        this.$location = $location;
        this.$rootScope = $rootScope;
    }
    AuthHttpResponseInterceptor.prototype.responseError = function (rejection) {
        var toState = this.$rootScope['$state'] && this.$rootScope['$state'].name ? this.$rootScope['$state'].name : null, toParams = this.$rootScope['$state'] && this.$rootScope['$state'].params ? this.$rootScope['$state'].params : null;
        switch (rejection.status) {
            case 503:
                this.$rootScope.$emit('pipMaintenanceError', { error: rejection });
                break;
            case -1:
                this.$rootScope.$emit('pipNoConnectionError', { error: rejection });
                break;
            default:
                console.error("errors_unknown", rejection);
                break;
        }
        return this.$q.reject(rejection);
    };
    return AuthHttpResponseInterceptor;
}());
var maintenance_1 = require("../maintenance/maintenance");
(function () {
    'use strict';
    ErrorsPageConfig.$inject = ['$stateProvider', '$httpProvider'];
    function ErrorsPageConfig($stateProvider, $httpProvider) {
        $httpProvider.interceptors.push('pipAuthHttpResponseInterceptor');
        $stateProvider
            .state('errors_no_connection', {
            url: '/errors/no_connection',
            params: {
                error: null
            },
            controller: 'pipErrorNoConnectionController',
            controllerAs: '$ctrl',
            templateUrl: 'no_connection/no_connection.html'
        })
            .state('errors_maintenance', {
            url: '/errors/maintenance',
            params: {
                error: null
            },
            controller: maintenance_1.ErrorMaintenanceController,
            controllerAs: '$ctrl',
            templateUrl: 'maintenance/maintenance.html'
        })
            .state('errors_missing_route', {
            url: '/errors/missing_route',
            params: {
                unfoundState: null,
                fromState: null
            },
            controller: 'pipErrorMissingRouteController',
            controllerAs: '$ctrl',
            templateUrl: 'missing_route/missing_route.html'
        })
            .state('errors_unsupported', {
            url: '/errors/unsupported',
            params: {
                error: null
            },
            controllerAs: '$ctrl',
            controller: 'pipErrorUnsupportedController',
            templateUrl: 'unsupported/unsupported.html'
        })
            .state('errors_unknown', {
            url: '/errors/unknown',
            params: {
                error: null
            },
            controllerAs: '$ctrl',
            controller: 'pipErrorUnknownController',
            templateUrl: 'unknown/unknown.html'
        });
    }
    angular.module('pipErrors.Pages', [
        'ngMaterial',
        'pipErrors.Strings', 'pipErrors.NoConnection', 'pipErrors.MissingRoute', 'pipErrors.Unsupported',
        'pipErrors.Unknown', 'pipErrors.Maintenance', 'pipErrors.Translate', 'pipErrors.Templates'
    ])
        .config(ErrorsPageConfig)
        .run(['$rootScope', '$state', '$injector', 'pipErrorsService', function ($rootScope, $state, $injector, pipErrorsService) {
        var run = new ErrorsPageRun($rootScope, $state, $injector, pipErrorsService);
    }])
        .service('pipAuthHttpResponseInterceptor', AuthHttpResponseInterceptor);
})();

},{"../maintenance/maintenance":9}],6:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorStateItem = (function () {
    function ErrorStateItem() {
    }
    return ErrorStateItem;
}());
exports.ErrorStateItem = ErrorStateItem;
var ErrorsConfig = (function () {
    function ErrorsConfig() {
        this.Maintenance = {
            Active: true,
            Name: 'errors_maintenance',
            Event: 'pipMaintenanceError',
            Title: 'ERROR_AVAILABLE_TITLE',
            SubTitle: 'ERROR_AVAILABLE_SUBTITLE',
            Breadcrumb: 'ERROR_AVAILABLE_TITLE',
            Image: 'images/maintenance.svg'
        };
        this.MissingRoute = {
            Active: true,
            Name: 'errors_missing_route',
            Event: '$stateNotFound',
            Title: 'ERROR_ROUTE_TITLE',
            SubTitle: 'ERROR_ROUTE_SUBTITLE',
            Breadcrumb: 'ERROR_ROUTE_PAGE_TITLE',
            Image: 'images/invalid_route.svg'
        };
        this.NoConnection = {
            Active: true,
            Name: 'errors_no_connection',
            Event: 'pipNoConnectionError',
            Title: 'ERROR_RESPONDING_TITLE',
            SubTitle: 'ERROR_RESPONDING_SUBTITLE',
            Breadcrumb: 'ERROR_RESPONDING_TITLE',
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
            Params: {
                supported: {
                    edge: 11,
                    ie: 11,
                    firefox: 43,
                    opera: 35,
                    chrome: 47
                }
            }
        };
    }
    return ErrorsConfig;
}());
exports.ErrorsConfig = ErrorsConfig;
var ErrorsService = (function () {
    ErrorsService.$inject = ['config'];
    function ErrorsService(config) {
        "ngInject";
        this._config = config || new ErrorsConfig();
    }
    Object.defineProperty(ErrorsService.prototype, "config", {
        get: function () {
            console.log(this._config);
            return this._config;
        },
        enumerable: true,
        configurable: true
    });
    ErrorsService.prototype.getErrorItemByKey = function (errorName) {
        if (!errorName || !this._config[errorName]) {
            return null;
        }
        return this._config[errorName];
    };
    return ErrorsService;
}());
var ErrorsProvider = (function () {
    function ErrorsProvider() {
        this.config = new ErrorsConfig();
    }
    ErrorsProvider.prototype.configureErrorByKey = function (errorName, errorParams) {
        if (!errorName || !errorParams)
            return;
        if (!this.config[errorName])
            return;
        this.config[errorName] = _.defaultsDeep(errorParams, this.config[errorName]);
    };
    ErrorsProvider.prototype.configureErrors = function (value) {
        if (!value)
            return;
        this.config = _.defaultsDeep(value, this.config);
    };
    ErrorsProvider.prototype.$get = function () {
        "ngInject";
        if (this._service == null) {
            this._service = new ErrorsService(this.config);
        }
        return this._service;
    };
    return ErrorsProvider;
}());
(function () {
    angular
        .module('pipErrorsService')
        .provider('pipErrorsService', ErrorsProvider);
})();

},{}],7:[function(require,module,exports){
var ClearErrorsLink = (function () {
    function ClearErrorsLink($scope, $element, $attrs, $ctrls) {
        var _this = this;
        this._fieldController = $ctrls[0],
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
(function () {
    'use strict';
    function clearErrors() {
        return {
            restrict: 'A',
            require: ['ngModel', '^?form'],
            link: ClearErrorsLink
        };
    }
    var thisModule = angular.module('pipClearErrors', []);
    thisModule.directive('pipClearErrors', clearErrors);
})();

},{}],8:[function(require,module,exports){
var FormErrors = (function () {
    FormErrors.$inject = ['$rootScope'];
    function FormErrors($rootScope) {
        this.$rootScope = $rootScope;
    }
    FormErrors.prototype.errorsWithHint = function (field) {
        if (field == null)
            return;
        return _.isEmpty(field.$error) ? { hint: true } : field.$error;
    };
    ;
    FormErrors.prototype.touchedErrorsWithHint = function (form, field) {
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
    FormErrors.prototype.resetFormErrors = function (form, errors) {
        form.$setPristine();
        form.$setUntouched();
        if (errors) {
            form.$setDirty();
            form.$setSubmitted();
        }
        form['$serverError'] = {};
    };
    FormErrors.prototype.resetFieldsErrors = function (form, field) {
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
    FormErrors.prototype.setFormError = function (form, error, errorFieldMap) {
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
    FormErrors.prototype.goToUnhandledErrorPage = function (error) {
        this.$rootScope.$emit('pipUnhandledInternalError', {
            error: error
        });
    };
    ;
    return FormErrors;
}());
(function () {
    'use strict';
    angular.module('pipFormErrors', [])
        .service('pipFormErrors', FormErrors);
})();

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PipMaintenanceError = (function () {
    function PipMaintenanceError() {
    }
    return PipMaintenanceError;
}());
exports.PipMaintenanceError = PipMaintenanceError;
var PipMaintenanceErrorConfig = (function () {
    function PipMaintenanceErrorConfig() {
    }
    return PipMaintenanceErrorConfig;
}());
exports.PipMaintenanceErrorConfig = PipMaintenanceErrorConfig;
var PipMaintenanceErrorParams = (function () {
    function PipMaintenanceErrorParams() {
        this.interval = 0;
    }
    return PipMaintenanceErrorParams;
}());
exports.PipMaintenanceErrorParams = PipMaintenanceErrorParams;
var ErrorMaintenanceController = (function () {
    ErrorMaintenanceController.$inject = ['$scope', '$state', '$rootScope', '$mdMedia', '$injector', 'pipErrorsService'];
    function ErrorMaintenanceController($scope, $state, $rootScope, $mdMedia, $injector, pipErrorsService) {
        this._errorKey = 'Maintenance';
        this.isCordova = false;
        var pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
        this.errorConfig = pipErrorsService.getErrorItemByKey(this._errorKey);
        this.pipNavService = $injector.has('pipNavService') ? $injector.get('pipNavService') : null;
        this.media = pipMedia ? pipMedia : $mdMedia;
        $rootScope['$routing'] = false;
        this.appHeader();
        this.error = $state && $state.params && $state.params['error'] ? $state.params['error'] : {};
        this.timeoutInterval = this.error && this.error.config &&
            this.error.config.params && this.error.config.params.interval ? this.error.config.params.interval : 0;
    }
    ErrorMaintenanceController.prototype.appHeader = function () {
        if (!this.pipNavService)
            return;
        this.pipNavService.appbar.addShadow();
        this.pipNavService.icon.showMenu();
        this.pipNavService.breadcrumb.text = this.errorConfig.Breadcrumb;
        this.pipNavService.actions.hide();
    };
    return ErrorMaintenanceController;
}());
exports.ErrorMaintenanceController = ErrorMaintenanceController;
(function () {
    'use strict';
    angular.module('pipErrors.Maintenance', []).controller('PipErrorMaintenanceController', ErrorMaintenanceController);
})();

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PipMissingRouteErrorState = (function () {
    function PipMissingRouteErrorState() {
    }
    return PipMissingRouteErrorState;
}());
var ErrorMissingRouteController = (function () {
    ErrorMissingRouteController.$inject = ['$scope', '$state', '$rootScope', '$mdMedia', '$injector', 'pipErrorsService'];
    function ErrorMissingRouteController($scope, $state, $rootScope, $mdMedia, $injector, pipErrorsService) {
        this._errorKey = 'MissingRoute';
        this.isCordova = false;
        var pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
        this.errorConfig = pipErrorsService.getErrorItemByKey(this._errorKey);
        this.pipNavService = $injector.has('pipNavService') ? $injector.get('pipNavService') : null;
        this.media = pipMedia ? pipMedia : $mdMedia;
        $rootScope['$routing'] = false;
        this.appHeader();
        this.fromState = $state && $state.params && $state.params['fromState'] ? $state.params['fromState'] : {};
        this.unfoundState = $state && $state.params ? $state.params['unfoundState'] : {};
        this.url = this.unfoundState && this.unfoundState.to ? $state.href(this.unfoundState.to, this.unfoundState.toParams, { absolute: true }) : '';
        this.urlBack = this.fromState && this.fromState.to ? $state.href(this.fromState.to, this.fromState.fromParams, { absolute: true }) : '';
    }
    ErrorMissingRouteController.prototype.appHeader = function () {
        if (!this.pipNavService)
            return;
        this.pipNavService.appbar.addShadow();
        this.pipNavService.icon.showMenu();
        this.pipNavService.breadcrumb.text = this.errorConfig.Breadcrumb;
        this.pipNavService.actions.hide();
    };
    ErrorMissingRouteController.prototype.onContinue = function () {
    };
    ;
    return ErrorMissingRouteController;
}());
(function () {
    'use strict';
    angular.module('pipErrors.MissingRoute', [])
        .controller('pipErrorMissingRouteController', ErrorMissingRouteController);
})();

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PipNoConnectionError = (function () {
    function PipNoConnectionError() {
    }
    return PipNoConnectionError;
}());
exports.PipNoConnectionError = PipNoConnectionError;
var ErrorNoConnectionController = (function () {
    ErrorNoConnectionController.$inject = ['$window', '$scope', '$state', '$rootScope', '$mdMedia', '$injector', 'pipErrorsService'];
    function ErrorNoConnectionController($window, $scope, $state, $rootScope, $mdMedia, $injector, pipErrorsService) {
        this.$window = $window;
        this._errorKey = 'NoConnection';
        this.isCordova = false;
        var pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
        this.errorConfig = pipErrorsService.getErrorItemByKey(this._errorKey);
        this.pipNavService = $injector.has('pipNavService') ? $injector.get('pipNavService') : null;
        this.media = pipMedia ? pipMedia : $mdMedia;
        $rootScope['$routing'] = false;
        this.appHeader();
        this.error = $state && $state.params && $state.params['error'] ? $state.params['error'] : {};
    }
    ErrorNoConnectionController.prototype.appHeader = function () {
        if (!this.pipNavService)
            return;
        this.pipNavService.appbar.addShadow();
        this.pipNavService.icon.showMenu();
        this.pipNavService.breadcrumb.text = this.errorConfig.Breadcrumb;
        this.pipNavService.actions.hide();
    };
    ErrorNoConnectionController.prototype.onRetry = function () {
        this.$window.history.back();
    };
    return ErrorNoConnectionController;
}());
exports.ErrorNoConnectionController = ErrorNoConnectionController;
(function () {
    'use strict';
    var thisModule = angular.module('pipErrors.NoConnection', []);
    thisModule.controller('pipErrorNoConnectionController', ErrorNoConnectionController);
})();

},{}],12:[function(require,module,exports){
var NoConnectionPanelController = (function () {
    NoConnectionPanelController.$inject = ['$scope'];
    function NoConnectionPanelController($scope) {
        this._retry = $scope['retry'];
    }
    NoConnectionPanelController.prototype.onRetry = function () {
        if (this._retry && angular.isFunction(this._retry))
            this._retry();
    };
    return NoConnectionPanelController;
}());
(function () {
    'use strict';
    var thisModule = angular.module("pipNoConnectionPanel", ['pipErrors.Translate']);
    thisModule.directive('pipNoConnectionPanel', function () {
        return {
            restrict: 'E',
            scope: {
                error: '=pipError',
                retry: '=pipRetry'
            },
            templateUrl: 'no_connection_panel/no_connection_panel.html',
            controller: 'pipNoConnectionPanelController',
            controllerAs: '$ctrl'
        };
    });
    thisModule.controller('pipNoConnectionPanelController', NoConnectionPanelController);
})();

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PipUnknownErrorDetails = (function () {
    function PipUnknownErrorDetails() {
    }
    return PipUnknownErrorDetails;
}());
exports.PipUnknownErrorDetails = PipUnknownErrorDetails;
var ErrorUnknownController = (function () {
    ErrorUnknownController.$inject = ['$scope', '$state', '$rootScope', '$mdMedia', '$injector', 'pipErrorsService'];
    function ErrorUnknownController($scope, $state, $rootScope, $mdMedia, $injector, pipErrorsService) {
        this._errorKey = 'Unknown';
        this.isCordova = false;
        var pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
        this.errorConfig = pipErrorsService.getErrorItemByKey(this._errorKey);
        this.pipNavService = $injector.has('pipNavService') ? $injector.get('pipNavService') : null;
        this.media = pipMedia ? pipMedia : $mdMedia;
        $rootScope['$routing'] = false;
        this.showError = $scope['showError'];
        this.appHeader();
        this.error = $state && $state.params && $state.params['error'] ? $state.params['error'] : {};
        this.parseError();
    }
    ErrorUnknownController.prototype.appHeader = function () {
        if (!this.pipNavService)
            return;
        this.pipNavService.appbar.addShadow();
        this.pipNavService.icon.showMenu();
        this.pipNavService.breadcrumb.text = this.errorConfig.Breadcrumb;
        this.pipNavService.actions.hide();
    };
    ErrorUnknownController.prototype.parseError = function () {
        this.error_details = new PipUnknownErrorDetails();
        this.error_details.code = this.error.code;
        this.error_details.message = this.error.message;
        this.error_details.status = this.error.status;
        this.error_details.server_stacktrace = function () { };
        this.error_details.client_stacktrace = function () { };
    };
    ErrorUnknownController.prototype.onDetails = function () {
        this.showError = true;
    };
    return ErrorUnknownController;
}());
exports.ErrorUnknownController = ErrorUnknownController;
(function () {
    'use strict';
    var thisModule = angular.module('pipErrors.Unknown', []);
    thisModule.controller('pipErrorUnknownController', ErrorUnknownController);
})();

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PipUnsupportedError = (function () {
    function PipUnsupportedError() {
    }
    return PipUnsupportedError;
}());
exports.PipUnsupportedError = PipUnsupportedError;
var ErrorUnsupportedController = (function () {
    ErrorUnsupportedController.$inject = ['$scope', '$state', '$rootScope', '$mdMedia', '$injector', 'pipErrorsService'];
    function ErrorUnsupportedController($scope, $state, $rootScope, $mdMedia, $injector, pipErrorsService) {
        this._errorKey = 'Unsupported';
        this.isCordova = false;
        var pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
        this.errorConfig = pipErrorsService.getErrorItemByKey(this._errorKey);
        this.pipNavService = $injector.has('pipNavService') ? $injector.get('pipNavService') : null;
        this.media = pipMedia ? pipMedia : $mdMedia;
        $rootScope['$routing'] = false;
        this.appHeader();
        this.error = $state && $state.params && $state.params['error'] ? $state.params['error'] : {};
    }
    ErrorUnsupportedController.prototype.appHeader = function () {
        if (!this.pipNavService)
            return;
        this.pipNavService.appbar.addShadow();
        this.pipNavService.icon.showMenu();
        this.pipNavService.breadcrumb.text = this.errorConfig.Breadcrumb;
        this.pipNavService.actions.hide();
    };
    return ErrorUnsupportedController;
}());
exports.ErrorUnsupportedController = ErrorUnsupportedController;
(function () {
    'use strict';
    var thisModule = angular.module('pipErrors.Unsupported', []);
    thisModule.controller('pipErrorUnsupportedController', ErrorUnsupportedController);
})();

},{}],15:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipErrors.Templates');
} catch (e) {
  module = angular.module('pipErrors.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('maintenance/maintenance.html',
    '<div class="pip-error-scroll-body pip-scroll"><div class="pip-error pip-error-page layout-column flex layout-align-center-center"><img src="{{$ctrl.errorConfig.Image}}" class="pip-pic block"><div class="pip-error-text">{{::\'ERROR_AVAILABLE_TITLE\' | translate}}</div><div class="pip-error-subtext">{{::\'ERROR_AVAILABLE_SUBTITLE\' | translate}}</div><div class="pip-error-subtext" ng-if="$ctrl.timeoutInterval">{{::\'ERROR_AVAILABLE_TRY_AGAIN\' | translate}} {{timeoutInterval}} sec.</div><div class="pip-error-actions h48 layout-column layout-align-center-center" ng-if="$ctrl.isCordova"><md-button class="md-accent" ng-click="$ctrl.onClose($event)" aria-label="CLOSE">{{::\'ERROR_AVAILABLE_CLOSE\' | translate}}</md-button></div></div></div>');
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
    '<div class="pip-error-scroll-body pip-scroll"><div class="pip-error pip-error-page layout-column flex layout-align-center-center"><img src="{{$ctrl.errorConfig.Image}}" class="pip-pic block"><div class="pip-error-text">{{::$ctrl.errorConfig.Title | translate}}</div><div class="pip-error-subtext">{{::$ctrl.errorConfig.SubTitle | translate}}</div><div class="pip-error-actions h48 layout-column layout-align-center-center"><md-button aria-label="CONTINUE" class="md-accent" ng-click="$ctrl.onContinue($event)">{{::\'ERROR_ROUTE_CONTINUE\' | translate}}</md-button></div><div class="h48" ng-if="url"><a ng-href="{{$ctrl.url}}">{{::\'ERROR_ROUTE_TRY_AGAIN\' | translate }}: {{$ctrl.url}}</a></div><div class="h48" ng-if="urlBack"><a ng-href="{{$ctrl.urlBack}}">{{::\'ERROR_ROUTE_GO_BACK\' | translate }}: {{$ctrl.urlBack}}</a></div></div></div>');
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
    '<div class="pip-error-scroll-body pip-scroll"><div class="pip-error pip-error-page layout-column flex layout-align-center-center"><img src="{{$ctrl.errorConfig.Image}}" class="pip-pic block"><div class="pip-error-text">{{::$ctrl.errorConfig.Title | translate}}</div><div class="pip-error-subtext">{{::$ctrl.errorConfig.SubTitle | translate}}</div><div class="pip-error-actions h48 layout-column layout-align-center-center"><md-button aria-label="RETRY" class="md-accent" ng-click="$ctrl.onRetry($event)">{{::\'ERROR_RESPONDING_RETRY\' | translate}}</md-button></div></div></div>');
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
    '<div class="pip-error-page pip-error layout-column layout-align-center-center flex"><img src="{{$ctrl.errorConfig.Image}}" class="pip-pic block"><div class="pip-error-text">{{::$ctrl.errorConfig.Title | translate}}</div><div class="pip-error-subtext">{{::$ctrl.errorConfig.SubTitle | translate}}</div><div class="pip-error-actions h48 layout-column layout-align-center-center"><md-button aria-label="RETRY" class="md-accent" ng-click="$ctrl.onRetry($event)">{{::\'ERROR_RESPONDING_RETRY\' | translate}}</md-button></div></div>');
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
    '<div class="pip-error-scroll-body pip-scroll"><div class="pip-error pip-error-page layout-column flex layout-align-center-center"><img src="{{$ctrl.errorConfig.Image}}" class="pip-pic block"><div class="pip-error-text">{{::$ctrl.errorConfig.Title | translate}}</div><div class="pip-error-subtext">{{::$ctrl.errorConfig.SubTitle | translate}}</div><div class="pip-error-subtext" ng-if="$ctrl.showError && $ctrl.error_details && $ctrl.error_details.message"><div ng-if="$ctrl.error_details.code">Code: {{$ctrl.error_details.code}}</div><div ng-if="$ctrl.error_details.message">Description: {{$ctrl.error_details.message}}</div><div ng-if="$ctrl.error_details.status">HTTP status: {{$ctrl.error_details.status}}</div><div ng-if="$ctrl.error_details.server_stacktrace">Server stacktrace: {{$ctrl.error_details.server_stacktrace}}</div><div ng-if="$ctrl.error_details.client_stacktrace">Client stacktrace stacktrace: {{$ctrl.error_details.client_stacktrace}}</div></div><div class="pip-error-actions layout-column layout-align-center-center"><div class="h48" ng-if="$ctrl.isCordova"><md-button aria-label="CLOSE" class="md-accent" ng-click="$ctrl.onClose($event)">{{::\'ERROR_UNKNOWN_CLOSE\' | translate}}</md-button></div><div class="h48" ng-if="$ctrl.error_details && $ctrl.error_details.status"><md-button aria-label="DETAILS" class="md-accent" ng-click="$ctrl.onDetails($event)">{{::\'ERROR_UNKNOWN_DETAILS\' | translate}}</md-button></div></div></div></div>');
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
    '<div class="pip-error-scroll-body pip-scroll"><div class="pip-error pip-error-page layout-column flex layout-align-center-center"><div class="pip-error-text">{{::$ctrl.errorConfig.Title | translate}}</div><div class="pip-error-subtext">{{::$ctrl.errorConfig.SubTitle | translate}}</div><div class="pip-error-details layout-row layout-align-center-center" ng-if="$ctrl.media(\'gt-xs\')"><div class="pip-error-details-item layout-column layout-align-center-center"><div style="background-image: url(\'images/ie.svg\');" class="pip-pic"></div><div class="h64 tp16 bp16"><a class="text-body2 m0" target="_blank" href="https://www.microsoft.com/en-us/download/internet-explorer-11-for-windows-7-details.aspx">{{::\'ERROR_UNSUPPORTED_IE\' | translate}}</a><p class="text-body1 m0">{{::\'ERROR_UNSUPPORTED_IE_VER\' | translate}}</p></div></div><div class="pip-error-details-item layout-column layout-align-center-center"><div style="background-image: url(\'images/fm.svg\');" class="pip-pic"></div><div class="h64 tp16 bp16"><a class="text-body2 m0" target="_blank" href="https://www.mozilla.org/ru/firefox/new/">{{::\'ERROR_UNSUPPORTED_FM\' | translate}}</a><p class="text-body1 m0">{{::\'ERROR_UNSUPPORTED_FM_VER\' | translate}}</p></div></div><div class="pip-error-details-item layout-column layout-align-center-center"><div style="background-image: url(\'images/gc.svg\');" class="pip-pic"></div><div class="h64 tp16 bp16"><a class="text-body2 m0" target="_blank" href="https://www.google.com/chrome/browser/desktop/index.html?platform=win64#">{{::\'ERROR_UNSUPPORTED_GC\' | translate}}</a><p class="text-body1 m0">{{::\'ERROR_UNSUPPORTED_GC_VER\' | translate}}</p></div></div><div class="pip-error-details-item layout-column layout-align-center-center"><div style="background-image: url(\'images/o.svg\');" class="pip-pic"></div><div class="h64 tp16 bp16"><a class="text-body2 m0" target="_blank" href="http://www.opera.com/ru/download">{{::\'ERROR_UNSUPPORTED_O\' | translate}}</a><p class="text-body1 m0">{{::\'ERROR_UNSUPPORTED_O_VER\' | translate}}</p></div></div></div><div class="pip-error-details" ng-if="$ctrl.media(\'xs\')"><div class="layout-row layout-align-center-center"><div class="pip-error-details-item layout-column layout-align-center-center"><div style="background-image: url(\'images/ie.svg\');" class="pip-pic"></div><div class="h64 tp16 bp16"><a class="text-body2 m0" target="_blank" href="https://www.microsoft.com/en-us/download/internet-explorer-11-for-windows-7-details.aspx">{{::\'ERROR_UNSUPPORTED_IE\' | translate}}</a><p class="text-body1 m0">{{::\'ERROR_UNSUPPORTED_IE_VER\' | translate}}</p></div></div><div class="pip-error-details-item layout-column layout-align-center-center"><div style="background-image: url(\'images/fm.svg\');" class="pip-pic"></div><div class="h64 tp16 bp16"><a class="text-body2 m0" target="_blank" href="https://www.mozilla.org/ru/firefox/new/">{{::\'ERROR_UNSUPPORTED_FM\' | translate}}</a><p class="text-body1 m0">{{::\'ERROR_UNSUPPORTED_FM_VER\' | translate}}</p></div></div></div><div class="tm16 layout-row layout-align-center-center"><div class="pip-error-details-item layout-column layout-align-center-center"><div style="background-image: url(\'images/gc.svg\');" class="pip-pic"></div><div class="h64 tp16 bp16"><a class="text-body2 m0" target="_blank" href="https://www.google.com/chrome/browser/desktop/index.html?platform=win64#">{{::\'ERROR_UNSUPPORTED_GC\' | translate}}</a><p class="text-body1 m0">{{::\'ERROR_UNSUPPORTED_GC_VER\' | translate}}</p></div></div><div class="pip-error-details-item layout-column layout-align-center-center"><div style="background-image: url(\'images/o.svg\');" class="pip-pic"></div><div class="h64 tp16 bp16"><a class="text-body2 m0" target="_blank" href="http://www.opera.com/ru/download">{{::\'ERROR_UNSUPPORTED_O\' | translate}}</a><p class="text-body1 m0">{{::\'ERROR_UNSUPPORTED_O_VER\' | translate}}</p></div></div></div></div></div></div>');
}]);
})();



},{}]},{},[15,1,2,4,5,6,3,7,8,9,10,12,11,13,14])(15)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).charts = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('pipBarCharts', [])
        .directive('pipBarChart', pipBarChart);
    function pipBarChart() {
        return {
            restrict: 'E',
            scope: {
                series: '=pipSeries',
                xTickFormat: '=pipXTickFormat',
                yTickFormat: '=pipYTickFormat',
                interactiveLegend: '=pipInterLegend'
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
                colors = _.filter(colors, function (color) {
                    return _.isObject($mdColorPalette[color]) && _.isObject($mdColorPalette[color][500] && _.isArray($mdColorPalette[color][500].value));
                });
                var height = 270;
                vm.data = prepareData(vm.series) || [];
                vm.legend = _.clone(vm.series);
                if ((vm.series || []).length > colors.length) {
                    vm.data = vm.series.slice(0, 9);
                }
                generateParameterColor();
                d3.scale.paletteColors = function () {
                    return d3.scale.ordinal().range(colors.map(materialColorToRgba));
                };
                $scope.$watch('barChart.series', function (updatedSeries) {
                    vm.data = prepareData(updatedSeries);
                    vm.legend = _.clone(vm.series);
                    generateParameterColor();
                    if (chart) {
                        chartElem.datum(vm.data).call(chart);
                        configBarWidthAndLabel();
                        drawEmptyState();
                    }
                });
                $scope.$watch('barChart.legend', function (updatedLegend) {
                    vm.data = prepareData(updatedLegend);
                    vm.legend = updatedLegend;
                    if (chart) {
                        chartElem.datum(vm.data).call(chart);
                        configBarWidthAndLabel();
                        drawEmptyState();
                    }
                }, true);
                function prepareData(data) {
                    var result = [];
                    _.each(data, function (seria) {
                        if (!seria.disabled && seria.values)
                            result.push(seria);
                    });
                    return _.cloneDeep(result);
                }
                nv.addGraph(function () {
                    chart = nv.models.discreteBarChart()
                        .margin({ top: 10, right: 0, bottom: 10, left: 50 })
                        .x(function (d) { return d.label || d.key || d.x; })
                        .y(function (d) { return d.value; })
                        .showValues(true)
                        .staggerLabels(true)
                        .showXAxis(true)
                        .showYAxis(true)
                        .valueFormat(d3.format('d'))
                        .duration(0)
                        .height(height)
                        .color(function (d) {
                        return vm.data[d.series].color || materialColorToRgba(colors[d.series]);
                    });
                    chart.tooltip.enabled(false);
                    chart.noData('There is no data right now...');
                    chart.yAxis
                        .tickFormat(function (d) {
                        return vm.yTickFormat ? vm.yTickFormat(d) : d;
                    });
                    chart.xAxis
                        .tickFormat(function (d) {
                        return vm.xTickFormat ? vm.xTickFormat(d) : d;
                    });
                    chartElem = d3.select($element.get(0))
                        .select('.bar-chart svg')
                        .datum(vm.data)
                        .style('height', '285px')
                        .call(chart);
                    nv.utils.windowResize(function () {
                        chart.update();
                        configBarWidthAndLabel(0);
                        drawEmptyState();
                    });
                    return chart;
                }, function () {
                    $timeout(configBarWidthAndLabel, 0);
                    drawEmptyState();
                });
                function drawEmptyState() {
                    if ($element.find('.nv-noData').length === 0) {
                        d3.select($element.find('.empty-state')[0]).remove();
                    }
                    else {
                        var g = chartElem.append('g').classed('empty-state', true), width = $element.find('.nvd3-svg').innerWidth(), margin = width * 0.1;
                        g.append('g')
                            .style('fill', 'rgba(0, 0, 0, 0.08)')
                            .append('rect')
                            .attr('height', height - 10)
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
                }
                function configBarWidthAndLabel(timeout) {
                    if (timeout === void 0) { timeout = 1000; }
                    var labels = $element.find('.nv-bar text'), chartBars = $element.find('.nv-bar'), parentHeight = $element.find('.nvd3-svg')[0].getBBox().height;
                    d3.select($element.find('.bar-chart')[0]).classed('visible', true);
                    chartBars.each(function (index, item) {
                        var barHeight = Number(d3.select(item).select('rect').attr('height')), barWidth = Number(d3.select(item).select('rect').attr('width')), element = d3.select(item), x = d3.transform(element.attr('transform')).translate[0], y = d3.transform(element.attr('transform')).translate[1];
                        element
                            .attr('transform', 'translate(' + Number(x + index * (barWidth + 15)) + ', ' + (height - 20) + ')')
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
                }
                function materialColorToRgba(color) {
                    return 'rgba(' + $mdColorPalette[color][500].value[0] + ','
                        + $mdColorPalette[color][500].value[1] + ','
                        + $mdColorPalette[color][500].value[2] + ','
                        + ($mdColorPalette[color][500].value[3] || 1) + ')';
                }
                function getMaterialColor(index) {
                    if (!colors || colors.length < 1)
                        return null;
                    if (index >= colors.length) {
                        index = 0;
                    }
                    return materialColorToRgba(colors[index]);
                }
                function generateParameterColor() {
                    if (!vm.data)
                        return;
                    vm.data.forEach(function (item, index) {
                        if (item.values[0]) {
                            item.values[0].color = item.values[0].color || getMaterialColor(index);
                            item.color = item.values[0].color;
                        }
                    });
                }
            }]
        };
    }
})();

},{}],2:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('pipCharts', [
        'pipBarCharts',
        'pipLineCharts',
        'pipPieCharts',
        'pipChartLegends',
        'pipCharts.Templates'
    ]);
})();

},{}],3:[function(require,module,exports){
(function () {
    'use strict';
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
                colors = _.filter(colors, function (color) {
                    return color !== undefined && color !== null;
                });
                function colorCheckboxes() {
                    var checkboxContainers = $($element).find('md-checkbox .md-container');
                    checkboxContainers.each(function (index, item) {
                        if (index >= $scope.series.length) {
                            return;
                        }
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
                    if (!$scope.series)
                        return;
                    $scope.series.forEach(function (item, index) {
                        item.color = item.color || (item.values && item.values[0] && item.values[0].color ? item.values[0].color : colors[index]);
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

},{}],4:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('pipLineCharts', [])
        .directive('pipLineChart', pipLineChart);
    function pipLineChart() {
        return {
            restrict: 'E',
            scope: {
                series: '=pipSeries',
                showYAxis: '=pipYAxis',
                showXAxis: '=pipXAxis',
                xFormat: '=pipXFormat',
                xTickFormat: '=pipXTickFormat',
                yTickFormat: '=pipYTickFormat',
                xTickValues: '=pipXTickValues',
                dynamic: '=pipDynamic',
                fixedHeight: '@pipDiagramHeight',
                dynamicHeight: '@pipDynamicHeight',
                minHeight: '@pipMinHeight',
                maxHeight: '@pipMaxHeight',
                interactiveLegend: '=pipInterLegend'
            },
            bindToController: true,
            controllerAs: 'lineChart',
            templateUrl: 'line/line_chart.html',
            controller: ['$element', '$scope', '$timeout', '$interval', '$mdColorPalette', function ($element, $scope, $timeout, $interval, $mdColorPalette) {
                var vm = this;
                var chart = null;
                var chartElem = null;
                var setZoom = null;
                var updateZoomOptions = null;
                var fixedHeight = vm.fixedHeight || 270;
                var dynamicHeight = vm.dynamicHeight || false;
                var minHeight = vm.minHeight || fixedHeight;
                var maxHeight = vm.maxHeight || fixedHeight;
                var filteredColor = _.filter($mdColorPalette, function (palette, color) {
                    return _.isObject(color) && _.isObject(color[500] && _.isArray(color[500].value));
                });
                var colors = _.map(filteredColor, function (palette, color) {
                    return color;
                });
                colors = _.filter(colors, function (color) {
                    return _.isObject($mdColorPalette[color]) && _.isObject($mdColorPalette[color][500] && _.isArray($mdColorPalette[color][500].value));
                });
                vm.data = prepareData(vm.series) || [];
                vm.legend = _.clone(vm.series);
                vm.sourceEvents = [];
                vm.isVisibleX = function () {
                    return vm.showXAxis == undefined ? true : vm.showXAxis;
                };
                vm.isVisibleY = function () {
                    return vm.showYAxis == undefined ? true : vm.showYAxis;
                };
                vm.zoomIn = function () {
                    if (setZoom) {
                        setZoom('in');
                    }
                };
                vm.zoomOut = function () {
                    if (setZoom) {
                        setZoom('out');
                    }
                };
                if (vm.series && vm.series.length > colors.length) {
                    vm.data = vm.series.slice(0, 9);
                }
                generateParameterColor();
                d3.scale.paletteColors = function () {
                    return d3.scale.ordinal().range(colors.map(materialColorToRgba));
                };
                $scope.$watch('lineChart.series', function (updatedSeries) {
                    vm.data = prepareData(updatedSeries);
                    vm.legend = _.clone(vm.series);
                    generateParameterColor();
                    if (chart) {
                        chart.xAxis
                            .tickValues(vm.xTickValues && _.isArray(vm.xTickValues) && vm.xTickValues.length > 2 ?
                            d3.range(vm.xTickValues[0], vm.xTickValues[1], vm.xTickValues[2]) : null);
                        chartElem.datum(vm.data || []).call(chart);
                        drawEmptyState();
                        if (updateZoomOptions)
                            updateZoomOptions(vm.data);
                    }
                }, true);
                $scope.$watch('lineChart.legend', function (updatedLegend) {
                    vm.data = prepareData(updatedLegend);
                    vm.legend = updatedLegend;
                    if (chart) {
                        chartElem.datum(vm.data || []).call(chart);
                        drawEmptyState();
                        if (updateZoomOptions)
                            updateZoomOptions(vm.data);
                    }
                }, true);
                $scope.$on('$destroy', function () {
                    setTimeout(function () { d3.selectAll('.nvtooltip').style('opacity', 0); }, 800);
                });
                function prepareData(data) {
                    var result = [];
                    _.each(data, function (seria) {
                        if (!seria.disabled && seria.values)
                            result.push(seria);
                    });
                    return _.cloneDeep(result);
                }
                var getHeight = function () {
                    if (dynamicHeight) {
                        var heigth = Math.min(Math.max(minHeight, $element.parent().innerHeight()), maxHeight);
                        return heigth;
                    }
                    else {
                        return fixedHeight;
                    }
                };
                nv.addGraph(function () {
                    chart = nv.models.lineChart()
                        .margin({ top: 20, right: 20, bottom: 30, left: 30 })
                        .x(function (d) {
                        return (d !== undefined && d.x !== undefined) ? (vm.xFormat ? vm.xFormat(d.x) : d.x) : d;
                    })
                        .y(function (d) {
                        return (d !== undefined && d.value !== undefined) ? d.value : d;
                    })
                        .height(getHeight() - 50)
                        .useInteractiveGuideline(true)
                        .showXAxis(true)
                        .showYAxis(true)
                        .showLegend(false)
                        .color(function (d) {
                        return d.color || d3.scale.paletteColors().range();
                    });
                    chart.tooltip.enabled(false);
                    chart.noData('There is no data right now...');
                    chart.yAxis
                        .tickFormat(function (d) {
                        return vm.yTickFormat ? vm.yTickFormat(d) : d;
                    });
                    chart.xAxis
                        .tickFormat(function (d) {
                        return vm.xTickFormat ? vm.xTickFormat(d) : d;
                    })
                        .tickValues(vm.xTickValues && _.isArray(vm.xTickValues) && vm.xTickValues.length > 2 ?
                        d3.range(vm.xTickValues[0], vm.xTickValues[1], vm.xTickValues[2]) : null);
                    chartElem = d3.select($element.get(0)).select('.line-chart svg');
                    chartElem.datum(vm.data || []).style('height', (getHeight() - 50) + 'px').call(chart);
                    $('.line-chart svg').on('touchstart touchmove', function (e) {
                        setTimeout(function () {
                            var tooltip = $('.nvtooltip'), tooltipW = tooltip.innerWidth(), bodyWidth = $('body').innerWidth(), x = e.originalEvent['touches'][0]['pageX'], y = e.originalEvent['touches'][0]['pageY'];
                            tooltip.css('transform', 'translate('
                                + (x + tooltipW >= bodyWidth ? (x - tooltipW) : x) + ','
                                + y + ')');
                            tooltip.css('left', 0);
                            tooltip.css('top', 0);
                        });
                    });
                    $('.line-chart svg').on('touchstart touchend', function (e) {
                        var removeTooltip = function () {
                            var tooltip = $('.nvtooltip');
                            tooltip.css('opacity', 0);
                        };
                        removeTooltip();
                        setTimeout(function () {
                            removeTooltip();
                        }, 500);
                    });
                    if (vm.dynamic) {
                        addZoom(chart, chartElem);
                    }
                    nv.utils.windowResize(function () { onResize(); });
                    $scope.$on('pipMainResized', function () { onResize(); });
                    return chart;
                }, function () {
                    drawEmptyState();
                });
                function onResize() {
                    chart.height(getHeight() - 50);
                    chartElem.style('height', (getHeight() - 50) + 'px');
                    chart.update();
                    drawEmptyState();
                }
                function drawEmptyState() {
                    if (!$element.find('text.nv-noData').get(0)) {
                        d3.select($element.find('.empty-state')[0]).remove();
                    }
                    else {
                        var containerWidth = $element.find('.line-chart').innerWidth(), containerHeight = $element.find('.line-chart').innerHeight();
                        if ($element.find('.empty-state').get(0)) {
                            chartElem
                                .select('image')
                                .attr('transform', 'scale(' + (containerWidth / 1151) + ',' + (containerHeight / 216) + ')');
                        }
                        else {
                            chartElem
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
                            chartElem
                                .append('rect')
                                .classed('empty-state', true)
                                .attr('height', "100%")
                                .attr('width', "100%")
                                .attr('fill', 'url(#bg)');
                        }
                    }
                }
                function updateScroll(domains, boundary) {
                    var bDiff = boundary[1] - boundary[0], domDiff = domains[1] - domains[0], isEqual = (domains[1] - domains[0]) / bDiff === 1;
                    $($element[0]).find('.visual-scroll')
                        .css('opacity', function () {
                        return isEqual ? 0 : 1;
                    });
                    if (isEqual)
                        return;
                    $($element[0]).find('.scrolled-block')
                        .css('left', function () {
                        return domains[0] / bDiff * 100 + '%';
                    })
                        .css('width', function () {
                        return domDiff / bDiff * 100 + '%';
                    });
                }
                function addZoom(chart, svg) {
                    var scaleExtent = 4;
                    var yAxis = null;
                    var xAxis = null;
                    var xDomain = null;
                    var yDomain = null;
                    var redraw = null;
                    var svg = svg;
                    var xScale = null;
                    var yScale = null;
                    var x_boundary = null;
                    var y_boundary = null;
                    var d3zoom = d3.behavior.zoom();
                    var prevXDomain = null;
                    var prevScale = null;
                    var prevTranslate = null;
                    setData(chart);
                    function setData(newChart) {
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
                    }
                    function fixDomain(domain, boundary, scale, translate) {
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
                    }
                    function updateChart() {
                        d3zoom.scale(1);
                        d3zoom.translate([0, 0]);
                        xScale.domain(x_boundary);
                        d3zoom.x(xScale).y(yScale);
                        svg.call(d3zoom);
                    }
                    function zoomed() {
                        if (d3.event.scale === 1) {
                            unzoomed();
                            updateChart();
                        }
                        else {
                            xDomain(fixDomain(xScale.domain(), x_boundary, d3.event.scale, d3.event.translate));
                            redraw();
                        }
                        updateScroll(xScale.domain(), x_boundary);
                    }
                    setZoom = function (which) {
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
                    function step(which) {
                        var translate = d3zoom.translate();
                        if (which === 'right') {
                            translate[0] -= 20;
                        }
                        else {
                            translate[0] += 20;
                        }
                        d3zoom.translate(translate);
                        d3zoom.event(svg);
                    }
                    function coordinates(point) {
                        var scale = d3zoom.scale(), translate = d3zoom.translate();
                        return [(point[0] - translate[0]) / scale, (point[1] - translate[1]) / scale];
                    }
                    function point(coordinates) {
                        var scale = d3zoom.scale(), translate = d3zoom.translate();
                        return [coordinates[0] * scale + translate[0], coordinates[1] * scale + translate[1]];
                    }
                    function keypress() {
                        switch (d3.event.keyCode) {
                            case 39:
                                step('right');
                                break;
                            case 37:
                                step('left');
                                break;
                            case 107:
                                setZoom('in');
                                break;
                            case 109: setZoom('out');
                        }
                    }
                    function unzoomed() {
                        xDomain(x_boundary);
                        redraw();
                        d3zoom.scale(1);
                        d3zoom.translate([0, 0]);
                        prevScale = 1;
                        prevTranslate = [0, 0];
                    }
                    d3zoom.x(xScale)
                        .y(yScale)
                        .scaleExtent([1, scaleExtent])
                        .on('zoom', zoomed);
                    svg.call(d3zoom).on('dblclick.zoom', unzoomed);
                    $($element.get(0)).addClass('dynamic');
                    svg
                        .attr('focusable', false)
                        .style('outline', 'none')
                        .on('keydown', keypress)
                        .on('focus', function () { });
                    var getXMinMax = function (data) {
                        var maxVal, minVal = null;
                        for (var i = 0; i < data.length; i++) {
                            if (!data[i].disabled) {
                                var tempMinVal = d3.max(data[i].values, function (d) { return vm.xFormat ? vm.xFormat(d.x) : d.x; });
                                var tempMaxVal = d3.min(data[i].values, function (d) { return vm.xFormat ? vm.xFormat(d.x) : d.x; });
                                minVal = (!minVal || tempMinVal < minVal) ? tempMinVal : minVal;
                                maxVal = (!maxVal || tempMaxVal > maxVal) ? tempMaxVal : maxVal;
                            }
                        }
                        return [maxVal, minVal];
                    };
                    updateZoomOptions = function (data) {
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
                        updateScroll(xScale.domain(), x_boundary);
                    };
                }
                function materialColorToRgba(color) {
                    return 'rgba(' + $mdColorPalette[color][500].value[0] + ','
                        + $mdColorPalette[color][500].value[1] + ','
                        + $mdColorPalette[color][500].value[2] + ','
                        + ($mdColorPalette[color][500].value[3] || 1) + ')';
                }
                function getMaterialColor(index) {
                    if (!colors || colors.length < 1)
                        return null;
                    if (index >= colors.length) {
                        index = 0;
                    }
                    return materialColorToRgba(colors[index]);
                }
                function generateParameterColor() {
                    if (!vm.data)
                        return;
                    vm.data.forEach(function (item, index) {
                        item.color = item.color || getMaterialColor(index);
                    });
                }
            }]
        };
    }
})();

},{}],5:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('pipPieCharts', [])
        .directive('pipPieChart', pipPieChart);
    function pipPieChart() {
        return {
            restrict: 'E',
            scope: {
                series: '=pipSeries',
                donut: '=pipDonut',
                legend: '=pipShowLegend',
                total: '=pipShowTotal',
                size: '=pipPieSize',
                centered: '=pipCentered'
            },
            bindToController: true,
            controllerAs: 'pieChart',
            templateUrl: 'pie/pie_chart.html',
            controller: ['$element', '$scope', '$timeout', '$interval', '$mdColorPalette', function ($element, $scope, $timeout, $interval, $mdColorPalette) {
                var vm = this;
                var chart = null;
                var titleElem = null;
                var chartElem = null;
                var colors = _.map($mdColorPalette, function (palette, color) {
                    return color;
                });
                colors = _.filter(colors, function (color) {
                    return _.isObject($mdColorPalette[color]) && _.isObject($mdColorPalette[color][500] && _.isArray($mdColorPalette[color][500].value));
                });
                var resizeTitleLabel = resizeTitleLabelUnwrap;
                vm.data = vm.data || [];
                vm.showLegend = function () {
                    return vm.legend !== undefined ? vm.legend : true;
                };
                if (vm.series && vm.series.length > colors.length) {
                    vm.data = vm.series.slice(0, 9);
                }
                $scope.$watch('pieChart.series', function (newVal) {
                    vm.data = newVal;
                    generateParameterColor();
                    if (chart) {
                        chartElem.datum(vm.data).call(chart);
                        $timeout(resizeTitleLabel);
                        drawEmptyState(d3.select($element.get(0)).select('.pie-chart svg')[0][0]);
                    }
                }, true);
                generateParameterColor();
                d3.scale.paletteColors = function () {
                    return d3.scale.ordinal().range(colors.map(materialColorToRgba));
                };
                nv.addGraph(function () {
                    chart = nv.models.pieChart()
                        .margin({ top: 0, right: 0, bottom: 0, left: 0 })
                        .x(function (d) {
                        return vm.donut ? d.value : null;
                    })
                        .y(function (d) {
                        return d.value;
                    })
                        .height(vm.size || 250)
                        .width(vm.size || 250)
                        .showLabels(true)
                        .labelThreshold(.001)
                        .growOnHover(false)
                        .donut(vm.donut)
                        .donutRatio(0.5)
                        .color(function (d) {
                        return d.color || d3.scale.paletteColors().range();
                    });
                    chart.tooltip.enabled(false);
                    chart.noData('There is no data right now...');
                    chart.showLegend(false);
                    chartElem = d3.select($element.get(0))
                        .select('.pie-chart')
                        .style('height', (vm.size || 250) + 'px')
                        .style('width', vm.centered ? '100%' : (vm.size || 250) + 'px')
                        .select('svg')
                        .style('opacity', 0)
                        .datum(vm.data || [])
                        .call(chart);
                    nv.utils.windowResize(function () {
                        chart.update();
                        $timeout(resizeTitleLabel);
                        centerChart();
                        drawEmptyState(d3.select($element.get(0)).select('.pie-chart svg')[0][0]);
                    });
                    return chart;
                }, function () {
                    $timeout(function () {
                        var svgElem = d3.select($element.get(0)).select('.pie-chart svg')[0][0];
                        renderTotalLabel(svgElem);
                        d3.select(svgElem)
                            .transition()
                            .duration(1000)
                            .style('opacity', 1);
                        $timeout(resizeTitleLabelUnwrap, 800);
                        centerChart();
                        drawEmptyState(svgElem);
                    });
                });
                function drawEmptyState(svg) {
                    if (!$element.find('text.nv-noData').get(0)) {
                        d3.select($element.find('.empty-state')[0]).remove();
                        $element.find('.pip-empty-pie-text').remove();
                    }
                    else {
                        if ($element.find('.pip-empty-pie-text').length === 0) {
                            $element.find('.pie-chart')
                                .append("<div class='pip-empty-pie-text'>There is no data right now...</div>");
                        }
                        var pie = d3.layout.pie().sort(null), size = Number(vm.size || 250);
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
                }
                function centerChart() {
                    if (vm.centered) {
                        var svgElem = d3.select($element.get(0)).select('.pie-chart svg')[0][0], leftMargin = $(svgElem).innerWidth() / 2 - (vm.size || 250) / 2;
                        d3.select($element.find('.nv-pieChart')[0]).attr('transform', 'translate(' + leftMargin + ', 0)');
                    }
                }
                function renderTotalLabel(svgElem) {
                    if ((!vm.total && !vm.donut) || !vm.data)
                        return;
                    var totalVal = vm.data.reduce(function (sum, curr) {
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
                    titleElem = d3.select($element.find('text.label-total').get(0)).style('opacity', 0);
                }
                function resizeTitleLabelUnwrap() {
                    if ((!vm.total && !vm.donut) || !vm.data)
                        return;
                    var boxSize = $element.find('.nvd3.nv-pieChart').get(0).getBBox();
                    if (!boxSize.width || !boxSize.height) {
                        return;
                    }
                    titleElem.style('font-size', ~~boxSize.width / 4.5).style('opacity', 1);
                }
                function materialColorToRgba(color) {
                    return 'rgba(' + $mdColorPalette[color][500].value[0] + ','
                        + $mdColorPalette[color][500].value[1] + ','
                        + $mdColorPalette[color][500].value[2] + ','
                        + ($mdColorPalette[color][500].value[3] || 1) + ')';
                }
                function getMaterialColor(index) {
                    if (!colors || colors.length < 1)
                        return null;
                    if (index >= colors.length) {
                        index = 0;
                    }
                    return materialColorToRgba(colors[index]);
                }
                function generateParameterColor() {
                    if (!vm.data)
                        return;
                    vm.data.forEach(function (item, index) {
                        item.color = item.color || getMaterialColor(index);
                    });
                }
            }]
        };
    }
})();

},{}],6:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipCharts.Templates');
} catch (e) {
  module = angular.module('pipCharts.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('bar/bar_chart.html',
    '<div class="bar-chart"><svg></svg></div><pip-chart-legend pip-series="barChart.legend" pip-interactive="barChart.interactiveLegend"></pip-chart-legend>');
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
    '<div><div class="chart-legend-item" ng-repeat="item in series" ng-show="item.values || item.value"><md-checkbox ng-model="item.disabled" ng-true-value="false" ng-false-value="true" ng-if="interactive" aria-label="{{ item.label }}"><p class="legend-item-value" ng-if="item.value" ng-style="{\'background-color\': item.color}">{{ item.value }}</p><p class="legend-item-label">{{:: item.label || item.key }}</p></md-checkbox><div ng-if="!interactive"><span class="bullet" ng-style="{\'background-color\': item.color}"></span> <span>{{:: item.label || item.key}}</span></div></div></div>');
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
    '<div class="line-chart" flex="auto" layout="column"><svg class="flex-auto" ng-class="{\'visible-x-axis\': lineChart.isVisibleX(), \'visible-y-axis\': lineChart.isVisibleY()}"></svg><div class="scroll-container"><div class="visual-scroll"><div class="scrolled-block"></div></div></div><md-button class="md-fab md-mini minus-button" ng-click="lineChart.zoomOut()"><md-icon md-svg-icon="icons:minus-circle"></md-icon></md-button><md-button class="md-fab md-mini plus-button" ng-click="lineChart.zoomIn()"><md-icon md-svg-icon="icons:plus-circle"></md-icon></md-button></div><pip-chart-legend pip-series="lineChart.legend" pip-interactive="lineChart.interactiveLegend"></pip-chart-legend>');
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
    '<div class="pie-chart" ng-class="{\'circle\': !pieChart.donut}"><svg class="flex-auto"></svg></div><pip-chart-legend pip-series="pieChart.data" pip-interactive="false" ng-if="pieChart.showLegend()"></pip-chart-legend>');
}]);
})();



},{}]},{},[6,1,2,3,4,5])(6)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).locations = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipLocations.Translate', []);
    thisModule.filter('translate', ['$injector', function ($injector) {
        var pipTranslate = $injector.has('pipTranslate')
            ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate.translate(key) || key : key;
        };
    }]);
})();

},{}],2:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module("pipLocation", []);
    thisModule.directive('pipLocation', function () {
        return {
            restrict: 'EA',
            scope: {
                pipLocationName: '&',
                pipLocationPos: '&',
                pipLocationResize: '&',
                pipShowLocationIcon: '='
            },
            template: function ($element, $attrs) {
                function toBoolean(value) {
                    if (value == null)
                        return false;
                    if (!value)
                        return false;
                    value = value.toString().toLowerCase();
                    return value == '1' || value == 'true';
                }
                if (toBoolean($attrs.pipCollapse)) {
                    return String()
                        + '<div class="pip-location-name location-collapse" ng-click="pipLocationResize()" ng-hide="!pipLocationName()"'
                        + 'ng-class="pipShowLocationIcon ? \'pip-location-icon-space\' : \'\'">'
                        + '<md-icon md-svg-icon="icons:location" class="flex-fixed pip-icon" ng-if="pipShowLocationIcon"></md-icon>'
                        + '<span class="pip-location-text">{{pipLocationName()}}</span> '
                        + '</div>'
                        + '<div class="pip-location-container" ng-hide="!pipLocationPos()"></div>';
                }
                else {
                    return String()
                        + '<md-button class="pip-location-name" ng-click="pipLocationResize()" '
                        + 'ng-class="pipShowLocationIcon ? \'pip-location-icon-space\' : \'\'">'
                        + '<div class="layout-align-start-center layout-row w-stretch">'
                        + '<md-icon md-svg-icon="icons:location" class="flex-fixed pip-icon" ng-if="pipShowLocationIcon"></md-icon>'
                        + '<span class="pip-location-text flex">{{pipLocationName()}}</span>'
                        + '<md-icon md-svg-icon="icons:triangle-down" class="flex-fixed" ng-if="!showMap"></md-icon>'
                        + '<md-icon md-svg-icon="icons:triangle-up" class="flex-fixed" ng-if="showMap"></md-icon>'
                        + '</div></md-button>'
                        + '<div class="pip-location-container"'
                        + 'ng-class="pipShowLocationIcon ? \'pip-location-icon-space\' : \'\'"></div>';
                }
            },
            controller: 'pipLocationController'
        };
    });
    thisModule.controller('pipLocationController', ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
        function toBoolean(value) {
            if (value == null)
                return false;
            if (!value)
                return false;
            value = value.toString().toLowerCase();
            return value == '1' || value == 'true';
        }
        var $name = $element.children('.pip-location-name'), $mapContainer = $element.children('.pip-location-container'), $mapControl = null, $up = $element.find('.icon-up'), $down = $element.find('.icon-down'), collapsable = toBoolean($attrs.pipCollapse);
        function clearMap() {
            if ($mapControl)
                $mapControl.remove();
            $mapControl = null;
            $mapContainer.hide();
        }
        ;
        function generateMap() {
            var location = $scope.pipLocationPos();
            if ($scope.showMap == false || location == null
                || location.coordinates == null
                || location.coordinates.length < 0) {
                clearMap();
                return;
            }
            var coordinates = new google.maps.LatLng(location.coordinates[0], location.coordinates[1]);
            if ($mapControl)
                $mapControl.remove();
            $mapControl = $('<div></div>');
            $mapContainer.show();
            $mapControl.appendTo($mapContainer);
            var mapOptions = {
                center: coordinates,
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true,
                disableDoubleClickZoom: true,
                scrollwheel: false,
                draggable: false
            }, map = new google.maps.Map($mapControl[0], mapOptions);
            new google.maps.Marker({
                position: coordinates,
                map: map
            });
        }
        ;
        if (!collapsable) {
            $scope.showMap = false;
            $up.hide();
            $mapContainer.hide();
            $name.click(function (event) {
                event.stopPropagation();
                if ($attrs.disabled)
                    return;
                $scope.showMap = !$scope.showMap;
                $up[$scope.showMap ? 'show' : 'hide']();
                $down[!$scope.showMap ? 'show' : 'hide']();
                generateMap();
            });
        }
        if (toBoolean($attrs.pipRebind)) {
            $scope.$watch($scope.pipLocationPos, function (newValue) {
                generateMap();
            });
        }
        $element.addClass('pip-location');
        if ($scope.pipLocationPos())
            generateMap();
        else
            clearMap();
    }]);
})();

},{}],3:[function(require,module,exports){
var LocationDialogService = (function () {
    LocationDialogService.$inject = ['$mdDialog'];
    function LocationDialogService($mdDialog) {
        this._$mdDialog = $mdDialog;
    }
    LocationDialogService.prototype.show = function (params, successCallback, cancelCallback) {
        this._$mdDialog.show({
            controller: 'pipLocationEditDialogController',
            controllerAs: '$ctrl',
            templateUrl: 'location_dialog/location_dialog.html',
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
var LocationEditDialogController = (function () {
    LocationEditDialogController.$inject = ['$scope', '$rootScope', '$timeout', '$mdDialog', 'locationPos', 'locationName'];
    function LocationEditDialogController($scope, $rootScope, $timeout, $mdDialog, locationPos, locationName) {
        var _this = this;
        this._map = null;
        this._marker = null;
        this.onSetLocation = function () {
            var _this = this;
            if (this._map == null)
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
        this._$mdDialog = $mdDialog;
        this._$scope = $scope;
        this.theme = $rootScope['$theme'];
        this.locationPos = locationPos && locationPos.type == 'Point'
            && locationPos.coordinates && locationPos.coordinates.length == 2
            ? locationPos : null;
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
            setTimeout(function () {
                google.maps.event.trigger(_this._map, 'resize');
            }, 1000);
        }, 0);
        $scope.$on('pipLayoutResized', function () {
            if (_this._map == null)
                return;
            google.maps.event.trigger(_this._map, 'resize');
        });
    }
    LocationEditDialogController.prototype.createMarker = function (coordinates) {
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
    LocationEditDialogController.prototype.changeLocation = function (coordinates, tid) {
        var _this = this;
        this.locationPos = {
            type: 'Point',
            coordinates: [coordinates.lat(), coordinates.lng()]
        };
        this.locationName = null;
        if (tid == null) {
            if (tid == null)
                return;
        }
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: coordinates }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK && results && results.length > 0) {
                _this.locationName = results[0].formatted_address;
            }
            _this._$scope.$apply();
        });
    };
    LocationEditDialogController.prototype.onAddPin = function () {
        if (this._map == null)
            return;
        var coordinates = this._map.getCenter();
        this._marker = this.createMarker(coordinates);
        this.changeLocation(coordinates, null);
    };
    LocationEditDialogController.prototype.onRemovePin = function () {
        if (this._map == null)
            return;
        this._marker = this.createMarker(null);
        this.locationPos = null;
        this.locationName = null;
    };
    LocationEditDialogController.prototype.onZoomIn = function () {
        if (this._map == null)
            return;
        var zoom = this._map.getZoom();
        this._map.setZoom(zoom + 1);
    };
    LocationEditDialogController.prototype.onZoomOut = function () {
        if (this._map == null)
            return;
        var zoom = this._map.getZoom();
        this._map.setZoom(zoom > 1 ? zoom - 1 : zoom);
    };
    LocationEditDialogController.prototype.onCancel = function () {
        this._$mdDialog.cancel();
    };
    LocationEditDialogController.prototype.onApply = function () {
        this._$mdDialog.hide({
            location: this.locationPos,
            locationPos: this.locationPos,
            locationName: this.locationName
        });
    };
    return LocationEditDialogController;
}());
(function () {
    'use strict';
    LocationDialogRun.$inject = ['$injector'];
    function LocationDialogRun($injector) {
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
    }
    angular.module('pipLocationEditDialog', ['ngMaterial', 'pipLocations.Templates'])
        .run(LocationDialogRun)
        .service('pipLocationEditDialog', LocationDialogService)
        .controller('pipLocationEditDialogController', LocationEditDialogController);
})();

},{}],4:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module("pipLocationEdit", ['pipLocationEditDialog']);
    thisModule.directive('pipLocationEdit', ['$parse', '$http', 'pipLocationEditDialog', function ($parse, $http, pipLocationEditDialog) {
        return {
            restrict: 'EAC',
            scope: {
                pipLocationName: '=',
                pipLocationPos: '=',
                pipLocationHolder: '=',
                ngDisabled: '&',
                pipChanged: '&'
            },
            template: String()
                + '<md-input-container class="md-block">'
                + '<label>{{ \'LOCATION\' | translate }}</label>'
                + '<input ng-model="pipLocationName"'
                + 'ng-disabled="ngDisabled()"/></md-input-container>'
                + '<div class="pip-location-empty" layout="column" layout-align="center center">'
                + '<md-button class="md-raised" ng-disabled="ngDisabled()" ng-click="onSetLocation()"'
                + 'aria-label="LOCATION_ADD_LOCATION">'
                + '<span class="icon-location"></span> {{::\'LOCATION_ADD_LOCATION\' | translate }}'
                + '</md-button></div>'
                + '<div class="pip-location-container" tabindex="{{ ngDisabled() ? -1 : 0 }}"'
                + ' ng-click="onMapClick($event)" ng-keypress=""onMapKeyPress($event)"></div>',
            controller: ['$scope', '$element', function ($scope, $element) {
                $element.find('md-input-container').attr('md-no-float', !!$scope.pipLocationHolder);
            }],
            link: function ($scope, $element) {
                var $empty = $element.children('.pip-location-empty'), $mapContainer = $element.children('.pip-location-container'), $mapControl = null;
                function clearMap() {
                    if ($mapControl)
                        $mapControl.remove();
                    $mapControl = null;
                    $mapContainer.hide();
                    $empty.show();
                }
                ;
                function generateMap() {
                    var location = $scope.pipLocationPos;
                    if (location == null || location.coordinates == null || location.coordinates.length < 0) {
                        clearMap();
                        return;
                    }
                    var coordinates = new google.maps.LatLng(location.coordinates[0], location.coordinates[1]);
                    if ($mapControl)
                        $mapControl.remove();
                    $mapContainer.show();
                    $empty.hide();
                    $mapControl = $('<div></div>');
                    $mapControl.appendTo($mapContainer);
                    var mapOptions = {
                        center: coordinates,
                        zoom: 12,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        disableDefaultUI: true,
                        disableDoubleClickZoom: true,
                        scrollwheel: false,
                        draggable: false
                    };
                    var map = new google.maps.Map($mapControl[0], mapOptions);
                    var marker = new google.maps.Marker({
                        position: coordinates,
                        map: map
                    });
                }
                ;
                function defineCoordinates() {
                    var locationName = $scope.pipLocationName;
                    if (locationName == '') {
                        $scope.pipLocationPos = null;
                        clearMap();
                        $scope.$apply();
                        return;
                    }
                    var geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ address: locationName }, function (results, status) {
                        $scope.$apply(function () {
                            if (status == google.maps.GeocoderStatus.OK) {
                                if (results == null || results.length == 0) {
                                    $scope.pipLocationPos = null;
                                    clearMap();
                                    return;
                                }
                                var geometry = results[0].geometry || {}, location = geometry.location || {};
                                if (location.lat == null || location.lng == null) {
                                    $scope.pipLocationPos = null;
                                    clearMap();
                                    return;
                                }
                                $scope.pipLocationPos = {
                                    type: 'Point',
                                    coordinates: [
                                        location.lat(),
                                        location.lng()
                                    ]
                                };
                            }
                            else {
                                $scope.pipLocationPos = null;
                            }
                        });
                    });
                }
                ;
                var defineCoordinatesDebounced = _.debounce(defineCoordinates, 2000);
                $scope.onSetLocation = function () {
                    if ($scope.ngDisabled())
                        return;
                    pipLocationEditDialog.show({
                        locationName: $scope.pipLocationName,
                        locationPos: $scope.pipLocationPos
                    }, function (result) {
                        var location = result.location, locationName = result.locationName;
                        if ($scope.pipLocationPos && $scope.pipLocationPos.type == 'Point'
                            && $scope.pipLocationPos.coordinates.length == 2
                            && location && location.coordinates.length == 2
                            && ($scope.pipLocationPos.coordinates[0] - location.coordinates[0]) < 0.0001
                            && ($scope.pipLocationPos.coordinates[1] - location.coordinates[1]) < 0.0001
                            && (locationName == $scope.pipLocationName)) {
                            return;
                        }
                        $scope.pipLocationPos = location;
                        $scope.pipLocationName = locationName;
                        if (locationName == null && location != null) {
                            $scope.pipLocationName =
                                '(' + result.location.coordinates[0]
                                    + ',' + result.location.coordinates[1] + ')';
                        }
                        $scope.pipChanged();
                        $mapContainer[0].focus();
                    });
                };
                $scope.onMapClick = function ($event) {
                    if ($scope.ngDisabled())
                        return;
                    $mapContainer[0].focus();
                    $scope.onSetLocation();
                };
                $scope.onMapKeyPress = function ($event) {
                    if ($scope.ngDisabled())
                        return;
                    if ($event.keyCode == 13 || $event.keyCode == 32) {
                        $scope.onSetLocation();
                    }
                };
                $scope.$watch(function () {
                    return $scope.pipLocationName;
                }, function (newValue, oldValue) {
                    if (newValue != oldValue)
                        defineCoordinatesDebounced();
                });
                $scope.$watch(function () {
                    return $scope.pipLocationPos;
                }, function () {
                    generateMap();
                });
                $element.addClass('pip-location-edit');
                if ($scope.pipLocationPos)
                    generateMap();
                else
                    clearMap();
            }
        };
    }]);
})();

},{}],5:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module("pipLocationIp", []);
    thisModule.directive('pipLocationIp', function () {
        return {
            restrict: 'EA',
            scope: {
                pipIpaddress: '&',
                pipExtraInfo: '&'
            },
            template: '<div class="pip-location-container"></div>',
            controller: 'pipLocationIpController'
        };
    });
    thisModule.controller('pipLocationIpController', ['$scope', '$element', '$attrs', '$http', function ($scope, $element, $attrs, $http) {
        var $mapContainer = $element.children('.pip-location-container'), $mapControl = null;
        function clearMap() {
            if ($mapControl)
                $mapControl.remove();
            $mapControl = null;
        }
        function generateMap(latitude, longitude) {
            if (latitude == null || longitude == null) {
                clearMap();
                return;
            }
            var coordinates = new google.maps.LatLng(latitude, longitude);
            if ($mapControl)
                $mapControl.remove();
            $mapControl = $('<div></div>');
            $mapControl.appendTo($mapContainer);
            var mapOptions = {
                center: coordinates,
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true,
                disableDoubleClickZoom: true,
                scrollwheel: false,
                draggable: false
            }, map = new google.maps.Map($mapControl[0], mapOptions);
            new google.maps.Marker({
                position: coordinates,
                map: map
            });
        }
        function toBoolean(value) {
            if (value == null)
                return false;
            if (!value)
                return false;
            value = value.toString().toLowerCase();
            return value == '1' || value == 'true';
        }
        function defineCoordinates() {
            var ipAddress = $scope.pipIpaddress();
            if (ipAddress == '') {
                clearMap();
                return;
            }
            $http.jsonp('https://www.geoplugin.net/json.gp?ip=' + ipAddress + '&jsoncallback=JSON_CALLBACK')
                .success(function (response) {
                if (response != null
                    && response.geoplugin_latitude != null
                    && response.geoplugin_longitude != null) {
                    generateMap(response.geoplugin_latitude, response.geoplugin_longitude);
                    if ($scope.pipExtraInfo) {
                        var extraInfo = {
                            city: response.geoplugin_city,
                            regionCode: response.geoplugin_regionCode,
                            region: response.geoplugin_regionName,
                            areaCode: response.geoplugin_areaCode,
                            countryCode: response.geoplugin_countryCode,
                            country: response.geoplugin_countryName,
                            continentCode: response.geoplugin_continentCode
                        };
                        $scope.pipExtraInfo({ extraInfo: extraInfo });
                    }
                }
                else {
                    clearMap();
                }
            })
                .error(function (response) {
                console.error(response);
                clearMap();
            });
        }
        if (toBoolean($attrs.pipRebind)) {
            $scope.$watch(function () {
                return $scope.pipIpaddress();
            }, function (newValue) {
                defineCoordinates();
            });
        }
        $element.addClass('pip-location-ip');
        defineCoordinates();
    }]);
})();

},{}],6:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module("pipLocationMap", []);
    thisModule.directive('pipLocationMap', function () {
        return {
            restrict: 'EA',
            scope: {
                pipLocationPos: '&',
                pipLocationPositions: '&',
                pipIconPath: '&',
                pipDraggable: '&',
                pipStretch: '&'
            },
            template: '<div class="pip-location-container"></div>',
            controller: 'pipLocationMapController'
        };
    });
    thisModule.controller('pipLocationMapController', ['$scope', '$element', '$attrs', '$parse', '$timeout', function ($scope, $element, $attrs, $parse, $timeout) {
            var $mapContainer = $element.children('.pip-location-container'), $mapControl = null, stretchMap = $scope.pipStretch() || false, iconPath = $scope.pipIconPath();
            function clearMap() {
                if ($mapControl)
                    $mapControl.remove();
                $mapControl = null;
            }
            function checkLocation(loc) {
                return !(loc == null
                    || loc.coordinates == null
                    || loc.coordinates.length < 0);
            }
            function determineCoordinates(loc) {
                var point = new google.maps.LatLng(loc.coordinates[0], loc.coordinates[1]);
                point.fill = loc.fill;
                point.stroke = loc.stroke;
                return point;
            }
            function toBoolean(value) {
                if (value == null)
                    return false;
                if (!value)
                    return false;
                value = value.toString().toLowerCase();
                return value == '1' || value == 'true';
            }
            function generateMap() {
                var location = $scope.pipLocationPos(), locations = $scope.pipLocationPositions(), points = [], draggable = $scope.pipDraggable() || false;
                if (checkLocation(location)) {
                    points.push(determineCoordinates(location));
                }
                else {
                    if (locations && locations.length && locations.length > 0) {
                        locations.forEach(function (loc) {
                            if (checkLocation(loc)) {
                                points.push(determineCoordinates(loc));
                            }
                        });
                    }
                }
                if (points.length === 0) {
                    clearMap();
                    return;
                }
                if ($mapControl)
                    $mapControl.remove();
                $mapControl = $('<div></div>');
                $mapControl.appendTo($mapContainer);
                var mapOptions = {
                    center: points[0],
                    zoom: 12,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    disableDefaultUI: true,
                    disableDoubleClickZoom: true,
                    scrollwheel: draggable,
                    draggable: draggable
                }, map = new google.maps.Map($mapControl[0], mapOptions), bounds = new google.maps.LatLngBounds();
                points.forEach(function (point) {
                    var icon = {
                        path: iconPath,
                        fillColor: point.fill || '#EF5350',
                        fillOpacity: 1,
                        scale: 1,
                        strokeColor: point.stroke || 'white',
                        strokeWeight: 5
                    };
                    new google.maps.Marker({
                        position: point,
                        map: map,
                        icon: iconPath ? icon : null
                    });
                    bounds.extend(point);
                });
                if (points.length > 1)
                    map.fitBounds(bounds);
            }
            if (toBoolean($attrs.pipRebind)) {
                $scope.$watch(function () {
                    return $scope.pipLocationPos();
                }, function () {
                    generateMap();
                });
            }
            $element.addClass('pip-location-map');
            if (stretchMap)
                $mapContainer.addClass('stretch');
            if ($scope.pipLocationPos() || $scope.pipLocationPositions())
                $timeout(generateMap, 200);
            else
                clearMap();
        }]);
})();

},{}],7:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('pipLocations', [
        'pipLocation',
        'pipLocationMap',
        'pipLocationIp',
        'pipLocationEditDialog',
        'pipLocationEdit',
        'pipLocations.Translate'
    ]);
})();

},{}],8:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipLocations.Templates');
} catch (e) {
  module = angular.module('pipLocations.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('location_dialog/location_dialog.html',
    '<md-dialog class="pip-dialog pip-location-edit-dialog layout-column" md-theme="{{$ctrl.theme}}"><div class="pip-header layout-column layout-align-start-start"><md-progress-linear ng-show="$ctrl.transaction.busy()" md-mode="indeterminate" class="pip-progress-top"></md-progress-linear><h3 class="flex">{{ \'LOCATION_SET_LOCATION\' | translate }}</h3></div><div class="pip-footer"><div class="layout-row layout-align-start-center"><md-button class="md-accent" ng-click="$ctrl.onAddPin()" ng-show="$ctrl.locationPos == null" ng-disabled="$ctrl.transaction.busy()" aria-label="{{ ::\'LOCATION_ADD_PIN\' }}">{{ ::\'LOCATION_ADD_PIN\' | translate }}</md-button><md-button class="md-accent" ng-click="$ctrl.onRemovePin()" ng-show="$ctrl.locationPos != null" ng-disabled="$ctrl.transaction.busy()" aria-label="{{ ::\'LOCATION_REMOVE_PIN\' }}">{{ ::\'LOCATION_REMOVE_PIN\' | translate }}</md-button></div><div class="flex"></div><div class="layout-row layout-align-end-center"><md-button ng-click="$ctrl.onCancel()" aria-label="{{ ::\'CANCEL\' }}">{{ ::\'CANCEL\' | translate }}</md-button><md-button class="md-accent" ng-click="$ctrl.onApply()" ng-disabled="$ctrl.transaction.busy()" aria-label="{{ ::\'APPLY\' }}">{{ ::\'APPLY\' | translate }}</md-button></div></div><div class="pip-body"><div class="pip-location-container"></div><md-button class="md-icon-button md-fab pip-zoom-in" ng-click="$ctrl.onZoomIn()" aria-label="{{ ::\'LOCATION_ZOOM_IN\' }}"><md-icon md-svg-icon="icons:plus"></md-icon></md-button><md-button class="md-icon-button md-fab pip-zoom-out" ng-click="$ctrl.onZoomOut()" aria-label="{{ ::\'LOCATION_ZOOM_OUT\' }}"><md-icon md-svg-icon="icons:minus"></md-icon></md-button><md-button class="md-icon-button md-fab pip-set-location" ng-click="$ctrl.onSetLocation()" aria-label="{{ ::\'LOCATION_SET_LOCATION\' }}" ng-show="supportSet" ng-disabled="transaction.busy()"><md-icon md-svg-icon="icons:target"></md-icon></md-button></div></md-dialog>');
}]);
})();



},{}]},{},[8,1,3,4,5,6,2,7])(8)
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
(function () {
    'use strict';
    filerTranslate.$inject = ['$injector'];
    function filerTranslate($injector) {
        var pipTranslate = $injector.has('pipTranslate')
            ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate.translate(key) || key : key;
        };
    }
    angular.module('pipFiles.Translate', [])
        .filter('translate', filerTranslate);
})();

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileFailController = (function () {
    FileFailController.$inject = ['$scope'];
    function FileFailController($scope) {
        "ngInject";
        var _this = this;
        this.type = $scope['type'] || 'file';
        this.name = $scope['name'];
        this.buttons = $scope['buttons'] || null;
        this.error = $scope['error'] || null;
        $scope.$watch('error', function (error) {
            _this.error = error;
        });
    }
    return FileFailController;
}());
exports.FileFailController = FileFailController;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileSelectController_1 = require("./select/FileSelectController");
var FileFailController_1 = require("./fail/FileFailController");
var FileUploadService_1 = require("./service/FileUploadService");
require("./success/index");
require("./upload/index");
require("./start/index");
(function () {
    fileModelDirective.$inject = ['$parse'];
    function fileModelDirective($parse) {
        "ngInject";
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }
    function fileSelectDirective() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                localFile: '='
            },
            controller: FileSelectController_1.FileSelectController,
            controllerAs: 'vm',
            templateUrl: 'select/FileSelect.html'
        };
    }
    function fileFailDirective() {
        return {
            restrict: 'E',
            replace: true,
            controller: FileFailController_1.FileFailController,
            controllerAs: 'vm',
            scope: {
                buttons: '=?pipButtons',
                name: '=pipName',
                type: '=?pipType',
                error: '=pipError'
            },
            templateUrl: 'fail/FileFail.html'
        };
    }
    angular
        .module('pipFiles', ['pipFiles.SuccessUpload', 'pipFiles.FileUpload', 'pipFiles.StartUpload'])
        .directive('fileModel', fileModelDirective)
        .directive('pipFileSelect', fileSelectDirective)
        .directive('pipFailUpload', fileFailDirective)
        .service('pipFileUpload', FileUploadService_1.FileUploadService);
})();

},{"./fail/FileFailController":3,"./select/FileSelectController":5,"./service/FileUploadService":6,"./start/index":8,"./success/index":10,"./upload/index":12}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileSelectController = (function () {
    FileSelectController.$inject = ['$scope'];
    function FileSelectController($scope) {
        "ngInject";
        this.localFile = $scope['localFile'];
        $scope.$watch('vm.localFile', function (item) {
            $scope['localFile'] = item;
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
exports.FileSelectController = FileSelectController;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileUploadState = (function () {
    function FileUploadState() {
    }
    return FileUploadState;
}());
FileUploadState.All = ['start', 'upload', 'fail'];
FileUploadState.Start = 'start';
FileUploadState.Upload = 'upload';
FileUploadState.Fail = 'fail';
exports.FileUploadState = FileUploadState;
var FileUploadService = (function () {
    function FileUploadService($http) {
        this.$http = $http;
        this.error = null;
    }
    FileUploadService.prototype.upload = function (url, file, callback) {
        var _this = this;
        var fd = new FormData();
        fd.append('file', file);
        this.progress = 0;
        this.state = FileUploadState.Start;
        this.$http.post(url, fd, {
            uploadEventHandlers: {
                progress: function (e) {
                    if (e.lengthComputable) {
                        _this.progress = (e.loaded / e.total) * 100;
                    }
                }
            },
            headers: { 'Content-Type': undefined }
        })
            .success(function (response) {
            _this.state = FileUploadState.Upload;
            if (callback)
                callback(response, null);
        })
            .error(function (response) {
            _this.state = FileUploadState.Fail;
            _this.error = response.Error || response;
            if (callback)
                callback(null, response);
        });
    };
    return FileUploadService;
}());
exports.FileUploadService = FileUploadService;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileStartController = (function () {
    FileStartController.$inject = ['$scope'];
    function FileStartController($scope) {
        "ngInject";
        var _this = this;
        this.progress = 0;
        $scope.$watch('progress', function (progress) {
            _this.progress = progress;
        });
    }
    return FileStartController;
}());
exports.FileStartController = FileStartController;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileStartController_1 = require("./FileStartController");
(function () {
    var fileStartDirective = {
        restrict: 'E',
        replace: true,
        controller: FileStartController_1.FileStartController,
        controllerAs: 'vm',
        bindings: {
            buttons: '=?pipButtons',
            name: '=pipName',
            type: '=?pipType',
            progress: '=?pipProgress'
        },
        templateUrl: 'start/FileStart.html'
    };
    angular
        .module('pipFiles.StartUpload', [])
        .component('pipStartUpload', fileStartDirective);
})();

},{"./FileStartController":7}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileSuccessController = (function () {
    function FileSuccessController() {
        this.type = 'file';
    }
    FileSuccessController.prototype.$onChanges = function (changes) { };
    return FileSuccessController;
}());
exports.FileSuccessController = FileSuccessController;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileSuccessController_1 = require("./FileSuccessController");
var FileSuccessBindings = {
    buttons: '=?pipButtons',
    name: '=pipName',
    type: '=?pipType',
};
(function () {
    var fileSuccessDirective = {
        restrict: 'E',
        replace: true,
        controller: FileSuccessController_1.FileSuccessController,
        controllerAs: 'vm',
        bindings: FileSuccessBindings,
        templateUrl: 'success/FileSuccess.html'
    };
    angular
        .module('pipFiles.SuccessUpload', [])
        .component('pipSuccesUpload', fileSuccessDirective);
})();

},{"./FileSuccessController":9}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileUploadButtons = (function () {
    function FileUploadButtons() {
    }
    return FileUploadButtons;
}());
exports.FileUploadButtons = FileUploadButtons;
var FileUploadController = (function () {
    FileUploadController.$inject = ['$scope'];
    function FileUploadController($scope) {
        "ngInject";
        var _this = this;
        this.error = null;
        if (this.buttonFunction) {
            this.uploadButtons = [];
            this.failButtons = [
                { title: 'Cancel', click: function () { _this.onCancel(); } },
                { title: 'Retry', click: function () { _this.onRetry(); } }
            ];
            this.startButtons = [
                { title: 'Abort', click: function () { _this.onAbort(); } }
            ];
        }
    }
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
exports.FileUploadController = FileUploadController;

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileUploadController_1 = require("./FileUploadController");
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
exports.FileUploadChanges = FileUploadChanges;
var fileUploadDirective = {
    controller: FileUploadController_1.FileUploadController,
    bindings: FileUploadBindings,
    templateUrl: 'upload/FileUpload.html'
};
(function () {
    angular
        .module('pipFiles.FileUpload', [])
        .component('pipFileUpload', fileUploadDirective);
})();

},{"./FileUploadController":11}],13:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipFiles.Templates');
} catch (e) {
  module = angular.module('pipFiles.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('fail/FileFail.html',
    '<div class="pip-files pip-progress-files"><div class="pip-body pip-scroll pip-progress-body"><div class="layout-row"><div class="pip-progress-icon color-badge-bg"><md-icon md-svg-icon="icons:cross"></md-icon></div><div class="pip-progress-content"><h3 class="pip-title">Uploading {{vm.type}} failed with errors!</h3><div class="color-secondary-text pip-subtitle">{{vm.name}}</div><div class="color-error pip-error">{{vm.error}}</div></div></div></div><div class="pip-footer layout-row layout-align-end-center" ng-if="vm.buttons && vm.buttons.length > 0"><div><md-button class="md-accent" ng-repeat="fail in vm.buttons" ng-click="fail.click()">{{::fail.title}}</md-button></div></div></div>');
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
    '<div class="pip-file-select"><form id="inp_form" class="pip-hidden-form"><input type="file" file-model="vm.localFile" id="inp_file" ng-model="vm.localFile"></form><md-button class="md-raised md-accent pip-button" ng-click="vm.onUploadButtonClick()" ng-if="!vm.localFile">Choose File</md-button><div ng-if="vm.localFile.name" class="pip-file layout-row layout-align-start-center"><md-icon md-svg-icon="icons:document" class="pip-icon"></md-icon><div class="flex"><div class="text-body2 text-overflow">{{vm.localFile.name}}</div><div ng-if="vm.localFile.size" class="color-secondary-text">{{vm.localFile.size}}</div></div><md-button ng-click="vm.onDeleteButtonClick()" class="md-icon-button"><md-icon md-svg-icon="icons:cross-circle"></md-icon></md-button></div></div>');
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
    '<div class="pip-files pip-progress-files"><div class="pip-body pip-scroll pip-progress-body"><div class="layout-row"><div class="pip-progress-icon bb-orange"><md-icon md-svg-icon="icons:play"></md-icon></div><div class="pip-progress-content"><h3 class="pip-title">Uploading {{::vm.type}}</h3><div class="color-secondary-text pip-subtitle">{{vm.name}}</div><div><md-progress-linear md-mode="determinate" class="md-accent" value="{{vm.progress}}" ng-if="vm.progress < 100"></md-progress-linear><md-progress-linear md-mode="indeterminate" class="md-accent" ng-if="vm.progress == 100"></md-progress-linear></div></div></div></div><div class="pip-footer layout-row layout-align-end-center" ng-if="vm.buttons"><div><md-button class="md-accent" ng-repeat="start in vm.buttons" ng-click="start.click()">{{start.title}}</md-button></div></div></div>');
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
    '<div><pip-succes-upload ng-if="$ctrl.state == \'upload\'" pip-name="$ctrl.name" pip-type="$ctrl.type" pip-buttons="$ctrl.buttons"></pip-succes-upload><pip-fail-upload ng-if="$ctrl.state == \'fail\'" pip-name="$ctrl.name" pip-type="$ctrl.type" pip-error="$ctrl.error" pip-buttons="$ctrl.failButtons"></pip-fail-upload><pip-start-upload ng-if="$ctrl.state == \'start\'" pip-name="$ctrl.name" pip-type="$ctrl.type" pip-progress="$ctrl.progress" pip-buttons="$ctrl.startButtons"></pip-start-upload></div>');
}]);
})();



},{}]},{},[13,1,2,3,4,5,6,7,8,9,10,11,12])(13)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).dashboard = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./widgets/Widgets");
require("./draggable/Draggable");
(function () {
    'use strict';
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
})();
require("./utility/WidgetTemplateUtility");
require("./dialogs/widget_config/ConfigDialogController");
require("./dialogs/add_component/AddComponentDialogController");
require("./DashboardController");
require("./DashboardComponent");

},{"./DashboardComponent":2,"./DashboardController":3,"./dialogs/add_component/AddComponentDialogController":4,"./dialogs/widget_config/ConfigDialogController":6,"./draggable/Draggable":9,"./utility/WidgetTemplateUtility":14,"./widgets/Widgets":15}],2:[function(require,module,exports){
(function () {
    'use strict';
    var pipDashboard = {
        bindings: {
            gridOptions: '=pipGridOptions',
            groupAdditionalActions: '=pipGroupActions',
            groupedWidgets: '=pipGroups'
        },
        controller: 'pipDashboardCtrl',
        controllerAs: 'dashboardCtrl',
        templateUrl: 'Dashboard.html'
    };
    angular
        .module('pipDashboard')
        .component('pipDashboard', pipDashboard);
})();

},{}],3:[function(require,module,exports){
'use strict';
configureAvailableWidgets.$inject = ['pipAddComponentDialogProvider'];
setTranslations.$inject = ['$injector'];
Object.defineProperty(exports, "__esModule", { value: true });
function setTranslations($injector) {
    var pipTranslate = $injector.has('pipTranslateProvider') ? $injector.get('pipTranslateProvider') : null;
    if (pipTranslate) {
        pipTranslate.setTranslations('en', {
            DROP_TO_CREATE_NEW_GROUP: 'Drop here to create new group',
        });
        pipTranslate.setTranslations('ru', {
            DROP_TO_CREATE_NEW_GROUP: 'Перетащите сюда для создания новой группы'
        });
    }
}
function configureAvailableWidgets(pipAddComponentDialogProvider) {
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
}
var draggableOptions = (function () {
    function draggableOptions() {
    }
    return draggableOptions;
}());
var DEFAULT_GRID_OPTIONS = {
    tileWidth: 150,
    tileHeight: 150,
    gutter: 10,
    inline: false
};
var DashboardController = (function () {
    DashboardController.$inject = ['$scope', '$rootScope', '$attrs', '$element', '$timeout', '$interpolate', 'pipAddComponentDialog', 'pipWidgetTemplate'];
    function DashboardController($scope, $rootScope, $attrs, $element, $timeout, $interpolate, pipAddComponentDialog, pipWidgetTemplate) {
        var _this = this;
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
            'pip-options="$parent.dashboardCtrl.groupedWidgets[groupIndex][\'source\'][index].opts">' +
            '</pip-{{ type }}-widget>';
        this.groupMenuActions = this.defaultGroupMenuActions;
        this.removeGroup = function (groupIndex) {
            console.log('removeGroup', groupIndex);
            _this.groupedWidgets.splice(groupIndex, 1);
        };
        this._$scope = $scope;
        this._$rootScope = $rootScope;
        this._$attrs = $attrs;
        this._$element = $element;
        this._$timeout = $timeout;
        this._$interpolate = $interpolate;
        this._pipAddComponentDialog = pipAddComponentDialog;
        this._pipWidgetTemplate = pipWidgetTemplate;
        $element.addClass('pip-scroll');
        this.draggableGridOptions = $scope['gridOptions'] || DEFAULT_GRID_OPTIONS;
        if (this.draggableGridOptions.inline === true) {
            $element.addClass('inline-grid');
        }
        if ($scope['groupAdditionalActions'])
            angular.extend(this.groupMenuActions, $scope['groupAdditionalActions']);
        this.widgetsContext = $scope;
        this.compileWidgets();
        this._$timeout(function () {
            _this._$element.addClass('visible');
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
                        template: _this._pipWidgetTemplate.getTemplate(widget, _this._includeTpl)
                    };
                });
        });
    };
    DashboardController.prototype.addComponent = function (groupIndex) {
        var _this = this;
        this._pipAddComponentDialog
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
        this._$timeout(function () {
            _this.groupedWidgets[params.options.groupIndex].removedWidgets = [];
        });
    };
    return DashboardController;
}());
angular
    .module('pipDashboard')
    .config(configureAvailableWidgets)
    .config(setTranslations)
    .controller('pipDashboardCtrl', DashboardController);

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var widget = (function () {
    function widget() {
    }
    return widget;
}());
exports.widget = widget;
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

},{"./AddComponentProvider":5}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AddComponentDialogController_1 = require("./AddComponentDialogController");
(function () {
    'use strict';
    setTranslations.$inject = ['$injector'];
    function setTranslations($injector) {
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
    }
    var AddComponentDialogService = (function () {
        function AddComponentDialogService(widgetList, $mdDialog) {
            this.widgetList = widgetList;
            this.$mdDialog = $mdDialog;
        }
        AddComponentDialogService.prototype.show = function (groups, activeGroupIndex) {
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
        return AddComponentDialogService;
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
                this._service = new AddComponentDialogService(this._widgetList, $mdDialog);
            return this._service;
        }];
        return AddComponentDialogProvider;
    }());
    angular
        .module('pipDashboard')
        .config(setTranslations)
        .provider('pipAddComponentDialog', AddComponentDialogProvider);
})();

},{"./AddComponentDialogController":4}],6:[function(require,module,exports){
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

},{"./ConfigDialogExtendComponent":7,"./ConfigDialogService":8}],7:[function(require,module,exports){
(function () {
    'use strict';
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
})();

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConfigDialogController_1 = require("./ConfigDialogController");
(function () {
    'use strict';
    setTranslations.$inject = ['$injector'];
    function setTranslations($injector) {
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
    }
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
                controllerAs: 'vm',
                locals: {
                    params: params
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
})();

},{"./ConfigDialogController":6}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipDragged', []);
require("./DraggableTileService");
require("./DraggableComponent");
require("./draggable_group/DraggableTilesGroupService");
require("./draggable_group/DraggableTilesGroupDirective");

},{"./DraggableComponent":10,"./DraggableTileService":11,"./draggable_group/DraggableTilesGroupDirective":12,"./draggable_group/DraggableTilesGroupService":13}],10:[function(require,module,exports){
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
            }, DEFAULT_OPTIONS, $scope['draggableCtrl'].options);
            this.groups = $scope['draggableCtrl'].tilesTemplates.map(function (group, groupIndex) {
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
            $scope.$watch('draggableCtrl.tilesTemplates', function (newVal) {
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
            this.$scope.$container = this.$element;
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
                _this.$scope.draggableCtrl.tilesTemplates[group.index].title = group.title;
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
                    if (this.groups.length !== this.$scope.draggableCtrl.tilesTemplates.length) {
                        this.$scope.draggableCtrl.tilesTemplates.push(source);
                    }
                    break;
                case 'moveTile':
                    var _a = {
                        fromIndex: source.from.elem.attributes['data-group-id'].value,
                        toIndex: source.to.elem.attributes['data-group-id'].value,
                        tileOptions: source.tile.opts.options,
                        fromTileIndex: source.tile.opts.options.index
                    }, fromIndex = _a.fromIndex, toIndex = _a.toIndex, tileOptions = _a.tileOptions, fromTileIndex = _a.fromTileIndex;
                    this.$scope.draggableCtrl.tilesTemplates[fromIndex].source.splice(fromTileIndex, 1);
                    this.$scope.draggableCtrl.tilesTemplates[toIndex].source.push({
                        opts: tileOptions
                    });
                    this.reIndexTiles(source.from.elem);
                    this.reIndexTiles(source.to.elem);
                    break;
            }
        };
        DraggableController.prototype.createTileScope = function (tile) {
            var tileScope = this.$rootScope.$new(false, this.$scope.draggableCtrl.tilesContext);
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
            var container = this.$scope.$container || $('body');
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
                _this.$scope['$container']
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
        controllerAs: 'draggableCtrl',
        controller: DraggableController
    };
    angular.module('pipDragged')
        .component('pipDraggableGrid', DragComponent);
}

},{"./DraggableTileService":11,"./draggable_group/DraggableTilesGroupService":13}],11:[function(require,module,exports){
'use strict';
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    'use strict';
    angular.module('pipWidget', []);
})();
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
        function CalendarWidgetController(pipWidgetMenu, $scope, pipWidgetConfigDialogService) {
            var _this = _super.call(this) || this;
            _this.color = 'blue';
            _this._$scope = $scope;
            _this._configDialog = pipWidgetConfigDialogService;
            if (_this['options']) {
                _this.menu = _this['options']['menu'] ? _.union(_this.menu, _this['options']['menu']) : _this.menu;
                _this.menu.push({
                    title: 'Configurate',
                    click: function () {
                        _this.onConfigClick();
                    }
                });
                _this['options'].date = _this['options'].date || new Date();
                _this.color = _this['options'].color || _this.color;
            }
            return _this;
        }
        CalendarWidgetController.prototype.onConfigClick = function () {
            var _this = this;
            this._configDialog.show({
                dialogClass: 'pip-calendar-config',
                color: this.color,
                size: this['options'].size,
                date: this['options'].date,
                extensionUrl: 'widgets/calendar/ConfigDialogExtension.html'
            }, function (result) {
                _this.color = result.color;
                _this['options'].color = result.color;
                _this.changeSize(result.size);
                _this['options'].date = result.date;
            });
        };
        return CalendarWidgetController;
    }(WidgetMenuService_1.MenuWidgetService));
    var pipCalendarWidget = {
        bindings: {
            options: '=pipOptions',
        },
        controller: CalendarWidgetController,
        controllerAs: 'widgetCtrl',
        templateUrl: 'widgets/calendar/WidgetCalendar.html'
    };
    angular
        .module('pipWidget')
        .component('pipCalendarWidget', pipCalendarWidget);
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
var EventWidgetController = (function (_super) {
    __extends(EventWidgetController, _super);
    function EventWidgetController(pipWidgetMenu, $scope, $element, $timeout, pipWidgetConfigDialogService) {
        var _this = _super.call(this) || this;
        _this.color = 'gray';
        _this.opacity = 0.57;
        _this._$scope = $scope;
        _this._$element = $element;
        _this._$timeout = $timeout;
        _this._configDialog = pipWidgetConfigDialogService;
        if (_this['options']) {
            if (_this['options']['menu'])
                _this.menu = _.union(_this.menu, _this['options']['menu']);
        }
        _this.menu.push({ title: 'Configurate', click: function () {
                _this.onConfigClick();
            } });
        _this.color = _this['options'].color || _this.color;
        _this.opacity = _this['options'].opacity || _this.opacity;
        _this.drawImage();
        $scope.$watch(function () { return $element.is(':visible'); }, function (newVal) {
            _this.drawImage();
        });
        return _this;
    }
    EventWidgetController.prototype.drawImage = function () {
        var _this = this;
        if (this['options'].image) {
            this._$timeout(function () {
                _this.onImageLoad(_this._$element.find('img'));
            }, 500);
        }
    };
    EventWidgetController.prototype.onConfigClick = function () {
        var _this = this;
        this._oldOpacity = _.clone(this.opacity);
        this._configDialog.show({
            dialogClass: 'pip-calendar-config',
            color: this.color,
            size: this['options'].size || { colSpan: 1, rowSpan: 1 },
            date: this['options'].date,
            title: this['options'].title,
            text: this['options'].text,
            opacity: this.opacity,
            onOpacitytest: function (opacity) {
                _this.opacity = opacity;
            },
            extensionUrl: 'widgets/event/ConfigDialogExtension.html'
        }, function (result) {
            _this.color = result.color;
            _this['options'].color = result.color;
            _this.changeSize(result.size);
            _this['options'].date = result.date;
            _this['options'].title = result.title;
            _this['options'].text = result.text;
            _this['options'].opacity = result.opacity;
        }, function () {
            _this.opacity = _this._oldOpacity;
        });
    };
    EventWidgetController.prototype.onImageLoad = function (image) {
        this.setImageMarginCSS(this._$element.parent(), image);
    };
    EventWidgetController.prototype.changeSize = function (params) {
        var _this = this;
        this['options'].size.colSpan = params.sizeX;
        this['options'].size.rowSpan = params.sizeY;
        if (this['options'].image) {
            this._$timeout(function () {
                _this.setImageMarginCSS(_this._$element.parent(), _this._$element.find('img'));
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
(function () {
    var pipEventWidget = {
        bindings: {
            options: '=pipOptions'
        },
        controller: EventWidgetController,
        controllerAs: 'widgetCtrl',
        templateUrl: 'widgets/event/WidgetEvent.html'
    };
    angular
        .module('pipWidget')
        .component('pipEventWidget', pipEventWidget);
})();

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
Object.defineProperty(exports, "__esModule", { value: true });
var MenuWidgetService = (function () {
    function MenuWidgetService() {
        "ngInject";
        this.menu = [
            {
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
            }
        ];
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
        this['options'].size.colSpan = params.sizeX;
        this['options'].size.rowSpan = params.sizeY;
    };
    ;
    return MenuWidgetService;
}());
exports.MenuWidgetService = MenuWidgetService;
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
(function () {
    'use strict';
    angular
        .module('pipWidget')
        .provider('pipWidgetMenu', MenuWidgetProvider);
})();

},{}],20:[function(require,module,exports){
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
var NotesWidgetController = (function (_super) {
    __extends(NotesWidgetController, _super);
    function NotesWidgetController(pipWidgetMenu, $scope, pipWidgetConfigDialogService) {
        var _this = _super.call(this) || this;
        _this.color = 'orange';
        _this._$scope = $scope;
        _this._configDialog = pipWidgetConfigDialogService;
        if (_this['options']) {
            _this.menu = _this['options']['menu'] ? _.union(_this.menu, _this['options']['menu']) : _this.menu;
        }
        _this.menu.push({ title: 'Configurate', click: function () {
                _this.onConfigClick();
            } });
        _this.color = _this['options'].color || _this.color;
        return _this;
    }
    NotesWidgetController.prototype.onConfigClick = function () {
        var _this = this;
        this._configDialog.show({
            dialogClass: 'pip-calendar-config',
            color: this.color,
            size: this['options'].size,
            title: this['options'].title,
            text: this['options'].text,
            extensionUrl: 'widgets/notes/ConfigDialogExtension.html'
        }, function (result) {
            _this.color = result.color;
            _this['options'].color = result.color;
            _this.changeSize(result.size);
            _this['options'].text = result.text;
            _this['options'].title = result.title;
        });
    };
    return NotesWidgetController;
}(WidgetMenuService_1.MenuWidgetService));
var pipNotesWidget = {
    bindings: {
        options: '=pipOptions'
    },
    controller: NotesWidgetController,
    controllerAs: 'widgetCtrl',
    templateUrl: 'widgets/notes/WidgetNotes.html'
};
angular
    .module('pipWidget')
    .component('pipNotesWidget', pipNotesWidget);

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
var PictureSliderController = (function (_super) {
    __extends(PictureSliderController, _super);
    function PictureSliderController(pipWidgetMenu, $scope, $element, $timeout, pipWidgetConfigDialogService, pipWidgetTemplate) {
        var _this = _super.call(this) || this;
        _this.animationType = 'fading';
        _this.animationInterval = 5000;
        _this._$scope = $scope;
        _this._configDialog = pipWidgetConfigDialogService;
        _this._widgetUtility = pipWidgetTemplate;
        _this._$element = $element;
        _this._$timeout = $timeout;
        if (_this['options']) {
            _this.animationType = _this['options'].animationType || _this.animationType;
            _this.animationInterval = _this['options'].animationInterval || _this.animationInterval;
        }
        return _this;
    }
    PictureSliderController.prototype.onImageLoad = function ($event) {
        var _this = this;
        this._$timeout(function () {
            _this._widgetUtility.setImageMarginCSS(_this._$element.parent(), $event.target);
        });
    };
    PictureSliderController.prototype.changeSize = function (params) {
        var _this = this;
        this['options'].size.colSpan = params.sizeX;
        this['options'].size.rowSpan = params.sizeY;
        this._$timeout(function () {
            _.each(_this._$element.find('img'), function (image) {
                _this._widgetUtility.setImageMarginCSS(_this._$element.parent(), image);
            });
        }, 500);
    };
    return PictureSliderController;
}(WidgetMenuService_1.MenuWidgetService));
var pipPictureSliderWidget = {
    bindings: {
        options: '=pipOptions',
        index: '=',
        group: '='
    },
    controller: PictureSliderController,
    templateUrl: 'widgets/picture_slider/WidgetPictureSlider.html',
    controllerAs: 'widgetCtrl'
};
angular
    .module('pipWidget')
    .component('pipPictureSliderWidget', pipPictureSliderWidget);

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
var PositionWidgetController = (function (_super) {
    __extends(PositionWidgetController, _super);
    function PositionWidgetController(pipWidgetMenu, $scope, $timeout, $element, pipWidgetConfigDialogService, pipLocationEditDialog) {
        var _this = _super.call(this) || this;
        _this.showPosition = true;
        _this._$scope = $scope;
        _this._$timeout = $timeout;
        _this._configDialog = pipWidgetConfigDialogService;
        _this._locationDialog = pipLocationEditDialog;
        if (_this['options']) {
            if (_this['options']['menu'])
                _this.menu = _.union(_this.menu, _this['options']['menu']);
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
        _this['options'].location = _this['options'].location || _this['options'].position;
        $scope.$watch('widgetCtrl.options.location', function () {
            _this.reDrawPosition();
        });
        $scope.$watch(function () { return $element.is(':visible'); }, function (newVal) {
            if (newVal == true)
                _this.reDrawPosition();
        });
        return _this;
    }
    PositionWidgetController.prototype.onConfigClick = function () {
        var _this = this;
        this._configDialog.show({
            dialogClass: 'pip-position-config',
            size: this['options'].size,
            locationName: this['options'].locationName,
            hideColors: true,
            extensionUrl: 'widgets/position/ConfigDialogExtension.html'
        }, function (result) {
            _this.changeSize(result.size);
            _this['options'].locationName = result.locationName;
        });
    };
    PositionWidgetController.prototype.changeSize = function (params) {
        this['options'].size.colSpan = params.sizeX;
        this['options'].size.rowSpan = params.sizeY;
        this.reDrawPosition();
    };
    PositionWidgetController.prototype.openLocationEditDialog = function () {
        var _this = this;
        this._locationDialog.show({
            locationName: this['options'].locationName,
            locationPos: this['options'].location
        }, function (newPosition) {
            if (newPosition) {
                _this['options'].location = newPosition.location;
                _this['options'].locationName = newPosition.locatioName;
            }
        });
    };
    PositionWidgetController.prototype.reDrawPosition = function () {
        var _this = this;
        this.showPosition = false;
        this._$timeout(function () {
            _this.showPosition = true;
        }, 50);
    };
    return PositionWidgetController;
}(WidgetMenuService_1.MenuWidgetService));
var pipPositionWidget = {
    bindings: {
        options: '=pipOptions',
        index: '=',
        group: '='
    },
    controller: PositionWidgetController,
    controllerAs: 'widgetCtrl',
    templateUrl: 'widgets/position/WidgetPosition.html'
};
angular
    .module('pipWidget')
    .component('pipPositionWidget', pipPositionWidget);

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
var SMALL_CHART = 70;
var BIG_CHART = 250;
var StatisticsWidgetController = (function (_super) {
    __extends(StatisticsWidgetController, _super);
    function StatisticsWidgetController(pipWidgetMenu, $scope, $timeout) {
        var _this = _super.call(this) || this;
        _this.reset = false;
        _this.chartSize = SMALL_CHART;
        _this._$scope = $scope;
        _this._$timeout = $timeout;
        if (_this['options']) {
            _this.menu = _this['options']['menu'] ? _.union(_this.menu, _this['options']['menu']) : _this.menu;
        }
        _this.setChartSize();
        return _this;
    }
    StatisticsWidgetController.prototype.changeSize = function (params) {
        var _this = this;
        this['options'].size.colSpan = params.sizeX;
        this['options'].size.rowSpan = params.sizeY;
        this.reset = true;
        this.setChartSize();
        this._$timeout(function () {
            _this.reset = false;
        }, 500);
    };
    StatisticsWidgetController.prototype.setChartSize = function () {
        this.chartSize = this['options'].size.colSpan == 2 && this['options'].size.rowSpan == 2 ? BIG_CHART : SMALL_CHART;
    };
    return StatisticsWidgetController;
}(WidgetMenuService_1.MenuWidgetService));
(function () {
    'use strict';
    var pipStatisticsWidget = {
        bindings: {
            options: '=pipOptions'
        },
        bindToController: true,
        controller: StatisticsWidgetController,
        controllerAs: 'widgetCtrl',
        templateUrl: 'widgets/statistics/WidgetStatistics.html'
    };
    angular
        .module('pipWidget')
        .component('pipStatisticsWidget', pipStatisticsWidget);
})();

},{"../menu/WidgetMenuService":19}],24:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('Dashboard.html',
    '<md-button class="md-accent md-raised md-fab layout-column layout-align-center-center" aria-label="Add component" ng-click="dashboardCtrl.addComponent()"><md-icon md-svg-icon="icons:plus" class="md-headline centered-add-icon"></md-icon></md-button><div class="pip-draggable-grid-holder"><pip-draggable-grid pip-tiles-templates="dashboardCtrl.groupedWidgets" pip-tiles-context="dashboardCtrl.widgetsContext" pip-draggable-grid="dashboardCtrl.draggableGridOptions" pip-group-menu-actions="dashboardCtrl.groupMenuActions"></pip-draggable-grid><md-progress-circular md-mode="indeterminate" class="progress-ring"></md-progress-circular></div>');
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
    '<div class="pip-draggable-holder"><div class="pip-draggable-group" ng-repeat="group in draggableCtrl.groups" data-group-id="{{ $index }}" pip-draggable-tiles="group.source"><div class="pip-draggable-group-title layout-row layout-align-start-center"><div class="title-input-container" ng-click="draggableCtrl.onTitleClick(group, $event)"><input ng-if="group.editingName" ng-blur="draggableCtrl.onBlurTitleInput(group)" ng-keypress="draggableCtrl.onKyepressTitleInput(group, $event)" ng-model="group.title"><div class="text-overflow flex-none" ng-if="!group.editingName">{{ group.title }}</div></div><md-button class="md-icon-button flex-none layout-align-center-center" ng-show="group.editingName" ng-click="draggableCtrl.cancelEditing(group)" aria-label="Cancel"><md-icon md-svg-icon="icons:cross"></md-icon></md-button><md-menu class="flex-none layout-column" md-position-mode="target-right target" ng-show="!group.editingName"><md-button class="md-icon-button flex-none layout-align-center-center" ng-click="$mdOpenMenu(); groupId = $index" aria-label="Menu"><md-icon md-svg-icon="icons:dots"></md-icon></md-button><md-menu-content width="4"><md-menu-item ng-repeat="action in draggableCtrl.groupMenuActions"><md-button ng-click="action.callback(groupId)">{{ action.title }}</md-button></md-menu-item></md-menu-content></md-menu></div></div><div class="pip-draggable-group fict-group layout-align-center-center layout-column tm16"><div class="fict-group-text-container"><md-icon md-svg-icon="icons:plus"></md-icon>{{ \'DROP_TO_CREATE_NEW_GROUP\' | translate }}</div></div></div>');
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
    '<div class="widget-box pip-calendar-widget {{ widgetCtrl.color }} layout-column layout-fill tp0" ng-class="{ small: widgetCtrl.options.size.colSpan == 1 && widgetCtrl.options.size.rowSpan == 1, medium: widgetCtrl.options.size.colSpan == 2 && widgetCtrl.options.size.rowSpan == 1, big: widgetCtrl.options.size.colSpan == 2 && widgetCtrl.options.size.rowSpan == 2 }"><div class="widget-heading layout-row layout-align-end-center flex-none"><pip-menu-widget></pip-menu-widget></div><div class="widget-content flex-auto layout-row layout-align-center-center" ng-if="widgetCtrl.options.size.colSpan == 2 && widgetCtrl.options.size.rowSpan == 1"><span class="date lm24 rm12">{{ widgetCtrl.options.date.getDate() }}</span><div class="flex-auto layout-column"><span class="weekday md-headline">{{ widgetCtrl.options.date | formatLongDayOfWeek }}</span> <span class="month-year md-headline">{{ widgetCtrl.options.date | formatLongMonth }} {{ widgetCtrl.options.date | formatYear }}</span></div></div><div class="widget-content flex-auto layout-column layout-align-space-around-center" ng-hide="widgetCtrl.options.size.colSpan == 2 && widgetCtrl.options.size.rowSpan == 1"><span class="weekday md-headline" ng-hide="widgetCtrl.options.size.colSpan == 1 && widgetCtrl.options.size.rowSpan == 1">{{ widgetCtrl.options.date | formatLongDayOfWeek }}</span> <span class="weekday" ng-show="widgetCtrl.options.size.colSpan == 1 && widgetCtrl.options.size.rowSpan == 1">{{ widgetCtrl.options.date | formatLongDayOfWeek }}</span> <span class="date lm12 rm12">{{ widgetCtrl.options.date.getDate() }}</span> <span class="month-year md-headline">{{ widgetCtrl.options.date | formatLongMonth }} {{ widgetCtrl.options.date | formatYear }}</span></div></div>');
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
    '<div class="widget-box pip-event-widget {{ widgetCtrl.color }} layout-column layout-fill" ng-class="{ small: widgetCtrl.options.size.colSpan == 1 && widgetCtrl.options.size.rowSpan == 1, medium: widgetCtrl.options.size.colSpan == 2 && widgetCtrl.options.size.rowSpan == 1, big: widgetCtrl.options.size.colSpan == 2 && widgetCtrl.options.size.rowSpan == 2 }"><img ng-if="widgetCtrl.options.image" ng-src="{{widgetCtrl.options.image}}" alt="{{widgetCtrl.options.title || widgetCtrl.options.name}}"><div class="text-backdrop" style="background-color: rgba(0, 0, 0, {{ widgetCtrl.opacity }})"><div class="widget-heading layout-row layout-align-start-center flex-none"><span class="widget-title flex-auto text-overflow">{{ widgetCtrl.options.title || widgetCtrl.options.name }}</span><pip-menu-widget ng-if="!widgetCtrl.options.hideMenu"></pip-menu-widget></div><div class="text-container flex-auto pip-scroll"><p class="date flex-none" ng-if="widgetCtrl.options.date">{{ widgetCtrl.options.date | formatShortDate }}</p><p class="text flex-auto">{{ widgetCtrl.options.text || widgetCtrl.options.description }}</p></div></div></div>');
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
    '<div class="widget-box pip-notes-widget {{ widgetCtrl.color }} layout-column"><div class="widget-heading layout-row layout-align-start-center flex-none" ng-if="widgetCtrl.options.title || widgetCtrl.options.name"><span class="widget-title flex-auto text-overflow">{{ widgetCtrl.options.title || widgetCtrl.options.name }}</span></div><pip-menu-widget ng-if="!widgetCtrl.options.hideMenu"></pip-menu-widget><div class="text-container flex-auto pip-scroll"><p>{{ widgetCtrl.options.text }}</p></div></div>');
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
    '<md-menu class="widget-menu" md-position-mode="target-right target"><md-button class="md-icon-button flex-none" ng-click="$mdOpenMenu()" aria-label="Menu"><md-icon md-svg-icon="icons:vdots"></md-icon></md-button><md-menu-content width="4"><md-menu-item ng-repeat="item in widgetCtrl.menu"><md-button ng-if="!item.submenu" ng-click="widgetCtrl.callAction(item.action, item.params, item)">{{:: item.title }}</md-button><md-menu ng-if="item.submenu"><md-button ng-click="widgetCtrl.callAction(item.action)">{{:: item.title }}</md-button><md-menu-content><md-menu-item ng-repeat="subitem in item.submenu"><md-button ng-click="widgetCtrl.callAction(subitem.action, subitem.params, subitem)">{{:: subitem.title }}</md-button></md-menu-item></md-menu-content></md-menu></md-menu-item></md-menu-content></md-menu>');
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
    '<div class="widget-box pip-picture-slider-widget {{ widgetCtrl.color }} layout-column layout-fill" ng-class="{ small: widgetCtrl.options.size.colSpan == 1 && widgetCtrl.options.size.rowSpan == 1, medium: widgetCtrl.options.size.colSpan == 2 && widgetCtrl.options.size.rowSpan == 1, big: widgetCtrl.options.size.colSpan == 2 && widgetCtrl.options.size.rowSpan == 2 }" index="{{ widgetCtrl.index }}" group="{{ widgetCtrl.group }}"><div class="widget-heading lp16 rp8 layout-row layout-align-end-center flex-none"><span class="flex text-overflow">{{ widgetCtrl.options.title }}</span><pip-menu-widget ng-if="!widgetCtrl.options.hideMenu"></pip-menu-widget></div><div class="slider-container"><div pip-image-slider="" pip-animation-type="\'fading\'" pip-animation-interval="widgetCtrl.animationInterval" ng-if="widgetCtrl.animationType == \'fading\'"><div class="pip-animation-block" ng-repeat="slide in widgetCtrl.options.slides"><img ng-src="{{ slide.image }}" alt="{{ slide.image }}" pip-image-load="widgetCtrl.onImageLoad($event)"><p class="slide-text" ng-if="slide.text">{{ slide.text }}</p></div></div><div pip-image-slider="" pip-animation-type="\'carousel\'" pip-animation-interval="widgetCtrl.animationInterval" ng-if="widgetCtrl.animationType == \'carousel\'"><div class="pip-animation-block" ng-repeat="slide in widgetCtrl.options.slides"><img ng-src="{{ slide.image }}" alt="{{ slide.image }}" pip-image-load="widgetCtrl.onImageLoad($event)"><p class="slide-text" ng-if="slide.text">{{ slide.text }}</p></div></div></div></div>');
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
    '<div class="pip-position-widget widget-box p0 layout-column layout-fill" ng-class="{ small: widgetCtrl.options.size.colSpan == 1 && widgetCtrl.options.size.rowSpan == 1, medium: widgetCtrl.options.size.colSpan == 2 && widgetCtrl.options.size.rowSpan == 1, big: widgetCtrl.options.size.colSpan == 2 && widgetCtrl.options.size.rowSpan == 2 }" index="{{ widgetCtrl.index }}" group="{{ widgetCtrl.group }}"><div class="position-absolute-right-top" ng-if="!widgetCtrl.options.locationName"><pip-menu-widget ng-if="!widgetCtrl.options.hideMenu"></pip-menu-widget></div><div class="widget-heading lp16 rp8 layout-row layout-align-end-center flex-none" ng-if="widgetCtrl.options.locationName"><span class="flex text-overflow">{{ widgetCtrl.options.locationName }}</span><pip-menu-widget ng-if="!widgetCtrl.options.hideMenu"></pip-menu-widget></div><pip-location-map class="flex" ng-if="widgetCtrl.showPosition" pip-stretch="true" pip-rebind="true" pip-location-pos="widgetCtrl.options.location"></pip-location-map></div>');
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
    '<div class="widget-box pip-statistics-widget layout-column layout-fill" ng-class="{ small: widgetCtrl.options.size.colSpan == 1 && widgetCtrl.options.size.rowSpan == 1, medium: widgetCtrl.options.size.colSpan == 2 && widgetCtrl.options.size.rowSpan == 1, big: widgetCtrl.options.size.colSpan == 2 && widgetCtrl.options.size.rowSpan == 2 }"><div class="widget-heading layout-row layout-align-start-center flex-none"><span class="widget-title flex-auto text-overflow">{{ widgetCtrl.options.title || widgetCtrl.options.name }}</span><pip-menu-widget></pip-menu-widget></div><div class="widget-content flex-auto layout-row layout-align-center-center" ng-if="widgetCtrl.options.series && !widgetCtrl.reset"><pip-pie-chart pip-series="widgetCtrl.options.series" ng-if="!widgetCtrl.options.chartType || widgetCtrl.options.chartType == \'pie\'" pip-donut="true" pip-pie-size="widgetCtrl.chartSize" pip-show-total="true" pip-centered="true"></pip-pie-chart></div></div>');
}]);
})();



},{}]},{},[24,1,2,3,4,5,6,7,8,12,13,9,10,11,14,16,17,18,19,20,21,22,23,15])(24)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).settings = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
require("./settings_service/index");
require("./settings_page/index");
angular.module('pipSettings', [
    'pipSettings.Service',
    'pipSettings.Page'
]);

},{"./settings_page/index":4,"./settings_service/index":7}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SettingsPageSelectedTab = (function () {
    function SettingsPageSelectedTab() {
        this.tabIndex = 0;
    }
    return SettingsPageSelectedTab;
}());
exports.SettingsPageSelectedTab = SettingsPageSelectedTab;
(function () {
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
            this.selected = new SettingsPageSelectedTab();
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
        };
        SettingsPageController.prototype.onNavigationSelect = function (state) {
            this.initSelect(state);
            if (this.selected.tab) {
                this.$state.go(state);
            }
        };
        return SettingsPageController;
    }());
    angular.module('pipSettings.Page')
        .controller('pipSettingsPageController', SettingsPageController);
})();

},{}],3:[function(require,module,exports){
'use strict';
configureSettingsPageRoutes.$inject = ['$stateProvider'];
function configureSettingsPageRoutes($stateProvider) {
    $stateProvider
        .state('settings', {
        url: '/settings?party_id',
        auth: true,
        controllerAs: 'vm',
        controller: 'pipSettingsPageController',
        templateUrl: 'settings_page/SettingsPage.html'
    });
}
angular.module('pipSettings.Page')
    .config(configureSettingsPageRoutes);

},{}],4:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipSettings.Page', [
    'ui.router',
    'pipSettings.Service',
    'pipNav',
    'pipSelected',
    'pipTranslate',
    'pipSettings.Templates'
]);
require("./SettingsPageController");
require("./SettingsPageRoutes");

},{"./SettingsPageController":2,"./SettingsPageRoutes":3}],5:[function(require,module,exports){

},{}],6:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var SettingsTab = (function () {
    function SettingsTab() {
    }
    return SettingsTab;
}());
exports.SettingsTab = SettingsTab;
var SettingsStateConfig = (function () {
    function SettingsStateConfig() {
        this.auth = false;
    }
    return SettingsStateConfig;
}());
exports.SettingsStateConfig = SettingsStateConfig;
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
        var defaultTab;
        defaultTab = _.find(this._config.tabs, function (tab) {
            return tab.state === defaultTab.state;
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
        this._config = new SettingsConfig();
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

},{}],7:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipSettings.Service', []);
require("./SettingsService");

},{"./SettingsService":6}],8:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipSettings.Templates');
} catch (e) {
  module = angular.module('pipSettings.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('settings_page/SettingsPage.html',
    '<md-toolbar class="pip-appbar-ext"></md-toolbar><pip-document width="800" min-height="400" class="pip-settings"><div class="pip-menu-container" ng-hide="vm.manager === false || !vm.tabs || vm.tabs.length < 1"><md-list class="pip-menu pip-simple-list" pip-selected="vm.selected.tabIndex" pip-selected-watch="vm.selected.navId" pip-select="vm.onNavigationSelect($event.id)"><md-list-item class="pip-simple-list-item pip-selectable flex" ng-repeat="tab in vm.tabs track by tab.state" ng-if="vm.$party.id == vm.$user.id || tab.state == \'settings.basic_info\'|| tab.state ==\'settings.contact_info\' || tab.state ==\'settings.blacklist\'" md-ink-ripple="" pip-id="{{:: tab.state }}"><p>{{::tab.title | translate}}</p></md-list-item></md-list><div class="pip-content-container"><pip-dropdown pip-actions="vm.tabs" pip-dropdown-select="vm.onDropdownSelect" pip-active-index="vm.selected.tabIndex"></pip-dropdown><div class="pip-body tp24-flex layout-column" ui-view=""></div></div></div><div class="layout-column layout-align-center-center flex" ng-show="vm.manager === false || !vm.tabs || vm.tabs.length < 1">{{::\'ERROR_400\' | translate}}</div></pip-document>');
}]);
})();



},{}]},{},[8,4,5,2,3,7,6,1])(8)
});



(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).help = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
    'use strict';
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
})();

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelpPageSelectedTab = (function () {
    function HelpPageSelectedTab() {
    }
    return HelpPageSelectedTab;
}());
exports.HelpPageSelectedTab = HelpPageSelectedTab;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelpStateConfig = (function () {
    function HelpStateConfig() {
        this.auth = false;
    }
    return HelpStateConfig;
}());
exports.HelpStateConfig = HelpStateConfig;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelpTab = (function () {
    function HelpTab() {
    }
    return HelpTab;
}());
exports.HelpTab = HelpTab;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelpPageSelectedTab_1 = require("../help_common/HelpPageSelectedTab");
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
    };
    HelpPageController.prototype.onNavigationSelect = function (state) {
        this.initSelect(state);
        if (this.selected.tab) {
            this.$state.go(state);
        }
    };
    return HelpPageController;
}());
(function () {
    angular.module('pipHelp.Page', [
        'ui.router',
        'pipHelp.Service',
        'pipNav',
        'pipSelected',
        'pipTranslate',
        'pipHelp.Templates'
    ])
        .controller('pipHelpPageController', HelpPageController);
})();
require("./HelpPageRoutes");

},{"../help_common/HelpPageSelectedTab":3,"./HelpPageRoutes":7}],7:[function(require,module,exports){
'use strict';
(function () {
    configureHelpPageRoutes.$inject = ['$stateProvider'];
    function configureHelpPageRoutes($stateProvider) {
        $stateProvider
            .state('help', {
            url: '/help?party_id',
            auth: true,
            controllerAs: '$ctrl',
            controller: 'pipHelpPageController',
            templateUrl: 'help_page/HelpPage.html'
        });
    }
    angular.module('pipHelp.Page')
        .config(configureHelpPageRoutes);
})();

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelpConfig_1 = require("../help_common/HelpConfig");
var HelpService_1 = require("../help_service/HelpService");
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
            this._service = new HelpService_1.HelpService(this._config);
        }
        return this._service;
    };
    return HelpProvider;
}());
angular
    .module('pipHelp.Service', [])
    .provider('pipHelp', HelpProvider);

},{"../help_common/HelpConfig":2,"../help_service/HelpService":9}],9:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.HelpService = HelpService;

},{}],10:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
require("./help_provider/HelpProvider");
require("./help_page/HelpPageController");
angular.module('pipHelp', [
    'pipHelp.Service',
    'pipHelp.Page'
]);
__export(require("./help_service/HelpService"));

},{"./help_page/HelpPageController":6,"./help_provider/HelpProvider":8,"./help_service/HelpService":9}],11:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipHelp.Templates');
} catch (e) {
  module = angular.module('pipHelp.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('help_page/HelpPage.html',
    '<md-toolbar class="pip-appbar-ext"></md-toolbar><pip-document width="800" min-height="400" class="pip-help"><div class="pip-menu-container" ng-hide="$ctrl.manager === false || !$ctrl.tabs || $ctrl.tabs.length < 1"><md-list class="pip-menu pip-simple-list" pip-selected="$ctrl.selected.tabIndex" pip-selected-watch="$ctrl.selected.navId" pip-select="$ctrl.onNavigationSelect($event.id)"><md-list-item class="pip-simple-list-item pip-selectable flex" ng-repeat="tab in $ctrl.tabs track by tab.state" md-ink-ripple="" pip-id="{{:: tab.state }}"><p>{{::tab.title | translate}}</p></md-list-item></md-list><div class="pip-content-container"><pip-dropdown pip-actions="$ctrl.tabs" pip-dropdown-select="$ctrl.onDropdownSelect" pip-active-index="$ctrl.selected.tabIndex"></pip-dropdown><div class="pip-body p0 layout-column" ui-view=""></div></div></div><div class="layout-column layout-align-center-center flex" ng-show="$ctrl.manager === false || !$ctrl.tabs || $ctrl.tabs.length < 1">{{::\'ERROR_400\' | translate}}</div></pip-document>');
}]);
})();



},{}]},{},[11,1,2,3,4,5,6,7,8,9,10])(11)
});



//# sourceMappingURL=pip-webui.js.map
