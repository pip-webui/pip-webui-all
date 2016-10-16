/**
 * @file Registration of all WebUI services
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    angular.module('pipServices', [
        'pipUtils',
        'pipAssert',
        'pipDebug',
        'pipScope',
	    'pipTranslate',
        'pipState',
        'pipTimer',
        'pipSession',
        'pipIdentity',
        'pipSystemInfo',
        'pipFormat',
        'pipScroll',
        'pipTags'
    ]);
    
})();
/**
 * @file Assertion utilities
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipAssert', ['pipDebug']);

    thisModule.provider('pipAssert', ['pipDebugProvider', function (pipDebugProvider) {

        return {
            isEmpty: pipDebugProvider.enabled() ? isEmpty : noop,
            isObjectId: pipDebugProvider.enabled() ? isObjectId : noop,
            isDefined: pipDebugProvider.enabled() ? isDefined : noop,
            isDef: pipDebugProvider.enabled() ? isDefined : noop,
            contains: pipDebugProvider.enabled() ? contains : noop,
            equal: pipDebugProvider.enabled() ? equal : noop,
            notEqual: pipDebugProvider.enabled() ? notEqual : noop,
            strictEqual: pipDebugProvider.enabled() ? strictEqual : noop,
            notStrictEqual: pipDebugProvider.enabled() ? notStrictEqual : noop,
            isArray: pipDebugProvider.enabled() ? isArray : noop,
            isBoolean: pipDebugProvider.enabled() ? isBoolean : noop,
            isNumber: pipDebugProvider.enabled() ? isNumber : noop,
            isString: pipDebugProvider.enabled() ? isString : noop,
            isObject: pipDebugProvider.enabled() ? isObject : noop,
            isDate: pipDebugProvider.enabled() ? isDate : noop,
            isError: pipDebugProvider.enabled() ? isError : noop,
            isFunction: pipDebugProvider.enabled() ? isFunction : noop,
            isNotNull: pipDebugProvider.enabled() ? isNotNull : noop,
            
            $get: ['pipDebug', function(pipDebug) {
                return {
                    isEmpty: pipDebug.enabled() ? isEmpty : noop,
                    isObjectId: pipDebug.enabled() ? isObjectId : noop,
                    isDefined: pipDebug.enabled() ? isDefined : noop,
                    isDef: pipDebug.enabled() ? isDefined : noop,
                    contains: pipDebug.enabled() ? contains : noop,
                    equal: pipDebug.enabled() ? equal :  noop,
                    notEqual: pipDebug.enabled() ? notEqual : noop,
                    strictEqual: pipDebug.enabled() ? strictEqual : noop,
                    notStrictEqual: pipDebug.enabled() ? notStrictEqual :  noop,
                    isArray: pipDebug.enabled() ? isArray : noop,
                    isBoolean: pipDebug.enabled() ? isBoolean : noop,
                    isNumber: pipDebug.enabled() ? isNumber : noop,
                    isString: pipDebug.enabled() ? isString : noop,
                    isObject: pipDebug.enabled() ? isObject : noop,
                    isDate: pipDebug.enabled() ? isDate : noop,
                    isError: pipDebug.enabled() ? isError : noop,
                    isFunction: pipDebug.enabled() ? isFunction : noop,
                    isNotNull: pipDebug.enabled() ? isNotNull : noop
                }
            }]
        };

        function noop() {}

        function objectToString(o) {
            return Object.prototype.toString.call(o);
        }

        function isArray(arg, message) {
            if (!Array.isArray(arg)) {
                throw new Error(message || arg + ' should be array');
            }
        }

        function isBoolean(arg, message) {
            if (typeof arg !== 'boolean') {
                throw new Error(message || arg + ' should be boolean');
            }
        }

        function isNotNull(arg, message) {
            if (arg === null) {
                throw new Error(message || arg + ' should be not null');
            }
        }

        function isNumber(arg, message) {
            if (typeof arg !== 'number') {
                throw new Error(message || arg + ' should be number');
            }
        }

        function isString(arg, message) {
            if (typeof arg !== 'string') {
                throw new Error(message || arg + ' should be string');
            }
        }

        function isObject(arg, message) {
            if (typeof arg !== 'object') {
                throw new Error(message || arg + ' should be an object');
            }
        }

        function isDate(d, message) {
            if (typeof d === 'object' && objectToString(d) !== '[object Date]') {
                throw new Error(message || d + ' should be a date');
            }
        }

        function isError(e, message) {
            if (typeof e === 'object' && (objectToString(e) !== '[object Error]' || e instanceof Error)) {
                throw new Error(message || e + ' should be an error');
            }
        }

        function isFunction(arg, message) {
            if (typeof arg !== 'function') {
                throw new Error(message || arg + ' should be a function');
            }
        }

        function isDefined(arg, message) {
           if (typeof arg === "undefined") {
               throw new Error(message || arg + ' should be defined');
           }
        }

        function isEmpty(arg, message) {
            if (arg === null || arg === undefined || arg === false) {
                throw new Error(message || arg + ' should be not null or undefined or false');
            }
        }

        function contains(obj, prop, message) {
            if (typeof obj !== 'object') {
                throw new Error(obj + ' should be an object');
            }
            if (obj[prop] === null || obj[prop] === undefined) {
                throw new Error(message || prop + ' should be in object ' + obj);
            }
        }

        // Compares args with ==
        function equal(actual, expected, message) {
            if (actual != expected) {
                throw new Error(message || actual + ' should be not equal ' + expected);
            }
        }

        // Compares args with !=
        function notEqual(actual, expected, message) {
            if (actual == expected) {
                throw new Error(message || actual + ' should be equal ' + expected);
            }
        }

        // Compares args with ===
        function strictEqual(actual, expected, message) {
            if (actual !== expected) {
                throw new Error(message || actual + ' should not be strict equal ' + expected);
            }
        }

        // Compares args with !==
        function notStrictEqual(actual, expected, message) {
            if (actual === expected) {
                throw new Error(message || actual + ' should not strict equal ' + expected);
            }
        }

        // Checks if value is a valid ObjectId
        function isObjectId(value, message) {
            var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
            if (!checkForHexRegExp.test(value)) {
                throw new Error(message || value + ' should be an object id');
            }
        }

    }]);

})();

/**
 * @file Debugging service
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipDebug', []);

    thisModule.provider('pipDebug', ['$logProvider', function ($logProvider) {

        this.enabled = true;

        return {
            enable: enable,
            disable: disable,
            enabled: enabled,
            
            $get: ['$log', function($log) {
                return {
                    enabled: enabled,
                    log: $log.log,
                    info: $log.info,
                    warn: $log.warn,
                    error: $log.error,
                    debug: $log.debug
                }
            }]
        };

        function enabled() {
            return this.enabled;
        }

        function enable() {
            this.enabled = true;
            $logProvider.debugEnabled(true);
        }

        function disable() {
            this.enabled = false;
            $logProvider.debugEnabled(false);
        }

    }]);

})();

/**
 * @file Application router extended from ui.router
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global angular */
 
(function () {
    'use strict';
    
    var thisModule = angular.module('pipState', ['ui.router', 'pipTranslate', 'pipAssert']);

    thisModule.config(
        ['$locationProvider', '$httpProvider', 'pipTranslateProvider', function($locationProvider, $httpProvider, pipTranslateProvider) {
            // Switch to HTML5 routing mode
            //$locationProvider.html5Mode(true);
            pipTranslateProvider.translations('en', {
                'ERROR_SWITCHING': 'Error while switching route. Try again.'
            });

            pipTranslateProvider.translations('ru', {
                'ERROR_SWITCHING': 'Ошибка при переходе. Попробуйте ещё раз.'
            });
        }]
    );

    thisModule.run(
        ['$rootScope', 'pipTranslate', '$state', function($rootScope, pipTranslate, $state) {
            $rootScope.$on('$stateChangeSuccess',
                function(event, toState, toParams, fromState, fromParams) {
                    // Unset routing variable to disable page transition
                    $rootScope.$routing = false;
                    // Record current and previous state
                    $rootScope.$state = {name: toState.name, url: toState.url, params: toParams};
                    $rootScope.$prevState = {name: fromState.name, url: fromState.url, params: fromParams};
                }
            );

            // Intercept route error
            $rootScope.$on('$stateChangeError',
                function(event, toState, toParams, fromState, fromParams, error) {
                    // Unset routing variable to disable page transition
                    $rootScope.$routing = false;

                    console.error('Error while switching route to ' + toState.name);
                    console.error(error);
                }
            );


            // Intercept route error
            $rootScope.$on('$stateNotFound',
                function(event, unfoundState, fromState, fromParams) {
                    event.preventDefault();

                    // todo make configured error state name
                    $state.go('errors_missing_route',  {
                            unfoundState: unfoundState,
                            fromState : {
                                to: fromState ? fromState.name : '',
                                fromParams: fromParams
                            }
                        }
                    );
                    $rootScope.$routing = false;
                }
            );

        }]
    );

    thisModule.provider('pipState', ['$stateProvider', 'pipAssertProvider', function($stateProvider, pipAssertProvider) {
        // Configuration of redirected states
        var redirectedStates = {};

        this.redirect = setRedirect;
        this.state = $stateProvider.state;

        this.$get = ['$state', '$timeout', 'pipAssert', function ($state, $timeout, pipAssert) {
            $state.redirect = redirect;
            $state.goBack = goBack;
            $state.goBackAndSelect = goBackAndSelect;
            
            return $state;
            
			//------------------------
            
            function redirect(event, state, params, $rootScope) {
                pipAssert.contains(state, 'name', "$state.redirect: state should contains name prop");
                pipAssert.isObject(params, "$state.redirect: params should be an object");

                var toState;

                $rootScope.$routing = true;
                toState = redirectedStates[state.name];
                if (_.isFunction(toState)) {
                    toState = toState(state.name, params, $rootScope);

                    if (_.isNull(toState)) {
                        $rootScope.$routing = false;
                        throw new Error('Redirected toState cannot be null');
                    }
                }

                if (!!toState) {
                    $timeout(function() {
                        event.preventDefault();
                        $state.transitionTo(toState, params, {location: 'replace'});
                    });

                    return true;
                }

                return false;
            }

            function goBack() {
                $window.history.back()
            }

            function goBackAndSelect(obj, objParamName, id, idParamName) {
                pipAssert.isObject(obj, 'pipUtils.goBack: first argument should be an object');
                pipAssert.isString(idParamName, 'pipUtils.goBack: second argument should a string');
                pipAssert.isString(objParamName, 'pipUtils.goBack: third argument should a string');
                    
                if ($rootScope.$prevState && $rootScope.$prevState.name) {
                    var state = _.cloneDeep($rootScope.$prevState);

                    state.params[idParamName] = id;
                    state.params[objParamName] = obj;

                    $state.go(state.name, state.params);
                } else {
                    $window.history.back();
                }
            }
        }];

        return;        
        //------------------

        // Specify automatic redirect from one state to another
        function setRedirect(fromState, toState) {
            pipAssertProvider.isNotNull(fromState, "pipState.redirect: fromState cannot be null");
            pipAssertProvider.isNotNull(toState, "pipState.redirect: toState cannot be null");
            
            redirectedStates[fromState] = toState;  

            return this;
        };

    }]);

})();

 /* global angular */

(function () {
    'use strict';

    angular.module('pipScope', ['pipScope.Error', 'pipScope.Transaction']);
    angular.module('pipTransactions', ['pipScope']);

})();
/**
 * @file Error context
 * @description
 * Error context decouples business components that throw errors
 * and visualization components that show them to users
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */
 
(function () {
    'use strict';

    var thisModule = angular.module('pipScope.Error', ['pipAssert']);

    /*
     * Error is designed to assist with error handling
     * within different application scopes & controllers without overlap.
     *
     * A unique identification of the scope/controller is passed to the service
     * when it is initialized to identify the error for that scope.
     * */
    thisModule.factory('pipError',
        ['$rootScope', 'pipAssert', function ($rootScope, pipAssert) {

            // Initialize error scope
            $rootScope.errors = {};

            return createError;

            //----------------------------

            function initError(scope) {
                $rootScope.errors[scope] = {
                    message: undefined,
                    code: undefined,
                    details: undefined
                };
            };

            function errorMessage(error) {
                if (_.isNull(error)) {
                    return null;
                }

                // Process regular messages
                if (error.message) {
                    return error.message;
                }

                // Process server application errors
                if (error.data) {
                    if (error.data.code) {
                        // process server error codes here
                        return 'ERROR_' + error.data.code;
                    }

                    if (error.data.message) {
                        return error.data.message;
                    }
                }

                // Process standard HTTP errors
                if (error.statusText) {
                    return error.statusText;
                }

                if (error.status) {
                    return 'ERROR_' + error.status;
                }
                
                return error.data ? error.data : error;
            };

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
            };

            function errorDetails(error) {
                return error && error.data ? error.data : error;
            };

            function createError(scope, scopeObject) {
                scope = scope || 'global';

                var error = {
                    reset: function () {
                        initError(scope);
                    },

                    empty: function() {
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
                            pipAssert.isObject(error, "Setting error: error should be an object");

                            $rootScope.errors[scope] = {
                                message: errorMessage(error),
                                code: errorCode(error),
                                details: errorDetails(error)
                            };
                            console.error($rootScope.errors[scope]);
                        } else {
                            initError(scope);
                        }
                    }
                };

                // Assign error into scope
                if (_.isObject(scopeObject)) scopeObject.error = error;

                return error;
            };
        }]
    );
    
})();
/**
 * @file Transaction context
 * @description
 * Transaction context helps to wrap multiple server requests
 * into one logical transaction. It decouples transaction
 * management and progress visualization to the user
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipScope.Transaction', ['pipTranslate', 'pipScope.Error']);

	thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {
        
        pipTranslateProvider.translations('en', {
            'ENTERING': 'Entering...',
            'PROCESSING': 'Processing...',
            'LOADING': 'Loading...',
            'SAVING': 'Saving...'
        });

        pipTranslateProvider.translations('ru', {
            'ENTERING': 'Вход в систему...',
            'PROCESSING': 'Обрабатывается...',
            'LOADING': 'Загружается...',
            'SAVING': 'Сохраняется...'
        });
		
	}]);

    /*
     * Transaction is designed to assist with transaction processing
     * within different application scopes & controllers without overlap.
     *
     * A unique identification of the scope/controller is passed to the service
     * when it is initialized to identify the error for that scope.
     * 
     * Transaction is also integrated with Error service. So you don't need to double it
     * */
    thisModule.factory('pipTransaction',
        ['$rootScope', 'pipError', function ($rootScope, pipError) {

            // Initialize transaction scope
            $rootScope.transactions = {};

            return createTransaction;

            //---------------------------------

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
                        initTransaction();
                        error.reset();
                    },

                    busy: function() {
                        var transaction = $rootScope.transactions[scope];
                        return transaction != null && transaction.id;
                    },

                    failed: function() {
                        return !error.empty();
                    },

                    aborted: function(id) {
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
                        // Transaction already in progress
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

                    abort: function() {
                        var transaction = $rootScope.transactions[scope];
                        if (transaction) {
                            transaction.id = null;
                        }
                        error.reset();
                    },

                    end: function (err) {
                        if (err) error.set(err);
                        else error.reset();

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
        }]
    );

})();

/**
 * @file Identity service
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipIdentity', []);

    thisModule.provider('pipIdentity', ['$timeout', 'pipAssertProvider', function($timeout, pipAssertProvider) {
        var 
            setRoot = true,
            identity = null;

        this.setRoot = initSetRoot;
        this.identity = initIdentity;

        this.$get = ['$rootScope', 'pipAssert', function ($rootScope, pipAssert) {
            // Set root variable
            if (setRoot)
                $rootScope.$identity = identity;

            function getIdentity() {
                return identity;
            }

            // Resetting root scope to force update language on the screen
            function resetContent(fullReset, partialReset) {
                fullReset = fullReset !== undefined ? !!fullReset : true;
                partialReset = partialReset !== undefined ? !!partialReset : true;

                $rootScope.$reset = fullReset;
                $rootScope.$partialReset = partialReset;
                $timeout(function() {
                    $rootScope.$reset = false;
                    $rootScope.$partialReset = false;
                }, 0);
            }

            function setIdentity(newIdentity, fullReset, partialReset) {
                if (newIdentity != null)
                    pipAssert.isObject(newIdentity || '', "pipIdentity.set: argument should be an object");

                identity = newIdentity;

                if (setRoot)
                    $rootScope.$identity = identity;

                resetContent(fullReset, partialReset);

                $rootScope.$broadcast('pipIdentityChanged', identity);
            }

            return {
                get: getIdentity,
                set: setIdentity,
            }
        }];

        // Initialize set root flag
        function initSetRoot(newSetRoot) {
            if (newSetRoot != null) {
                pipAssertProvider.isBoolean(newSetRoot || '', "pipIdentityProvider.setRoot: argument should be a boolean");
                setRoot = newSetRoot;
            }
            return setRoot;  
        }

        // Initialize identity
        function initIdentity(newIdentity) {
            if (newIdentity != null) {
                pipAssertProvider.isObject(newIdentity || '', "pipIdentityProvider.identity: argument should be an object");
                identity = newIdentity;
            }
            return identity;  
        }

    }]);

})();
/**
 * @file Session service
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipSession', []);

    thisModule.provider('pipSession', ['$timeout', 'pipAssertProvider', function($timeout, pipAssertProvider) {
        var 
            setRoot = true,
            session = null;

        this.setRoot = initSetRoot;
        this.session = initSession;

        this.$get = ['$rootScope', 'pipAssert', function ($rootScope, pipAssert) {
            // Set root variable
            if (setRoot)
                $rootScope.$session = session;
            
            // Resetting root scope to force update language on the screen
            function resetContent(fullReset, partialReset) {
                fullReset = fullReset !== undefined ? !!fullReset : true;
                partialReset = partialReset !== undefined ? !!partialReset : true;

                $rootScope.$reset = fullReset;
                $rootScope.$partialReset = partialReset;
                $timeout(function() {
                    $rootScope.$reset = false;
                    $rootScope.$partialReset = false;
                }, 0);
            }

            function startSession(newSession, fullReset, partialReset) {
                pipAssert.isObject(newSession || '', "pipSession.start: argument should be an object");

                session = newSession;

                if (setRoot)
                    $rootScope.$session = session;

                resetContent(fullReset, partialReset);

                $rootScope.$broadcast('pipSessionStarted', session);
            }

            function stopSession(fullReset, partialReset) {
                var oldSession = session;
                session = null;

                if (setRoot)
                    $rootScope.$session = session;

                resetContent(fullReset, partialReset);

                $rootScope.$broadcast('pipSessionStopped', oldSession);
            }

            function getSession() {
                return session;
            }

            return {
                get: getSession,
                start: startSession,
                stop: stopSession
            }
        }];

        // Initialize set root flag
        function initSetRoot(newSetRoot) {
            if (newSetRoot != null) {
                pipAssertProvider.isBoolean(newSetRoot || '', "pipSessionProvider.setRoot: argument should be a boolean");
                setRoot = newSetRoot;
            }
            return setRoot;  
        }

        // Initialize session
        function initSession(newSession) {
            if (newSession != null) {
                pipAssertProvider.isObject(newSession || '', "pipSessionProvider.session: argument should be an object");
                session = newSession;
            }
            return session;  
        }

    }]);

})();
/**
 * @file Global application timer service
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTimer', []);

    thisModule.service('pipTimer', 
        ['$interval', '$rootScope', function ($interval, $rootScope) {
            var 
                AUTO_PULL_CHANGES_TIMEOUT = 60000, // 1 min
                AUTO_UPDATE_PAGE_TIMEOUT = 15000,  // 15 sec
                AUTO_UPDATE_COLLECTION_TIMEOUT = 300000, // 5 min
                started = false, 
                autoPullChangesInterval, 
                autoUpdatePageInterval,
                autoUpdateCollectionInterval;

            return {
                isStarted: isStarted,
                start: start,
                stop: stop
            };

            //------------------------

            function isStarted() {
                return started;
            };

            function start() {
                if (started) return;

                autoPullChangesInterval = $interval(function () {
                    $rootScope.$broadcast('pipAutoPullChanges');
                }, AUTO_PULL_CHANGES_TIMEOUT);

                autoUpdatePageInterval = $interval(function () {
                    $rootScope.$broadcast('pipAutoUpdatePage');
                }, AUTO_UPDATE_PAGE_TIMEOUT);

                autoUpdateCollectionInterval = $interval(function () {
                    $rootScope.$broadcast('pipAutoUpdateCollection');
                }, AUTO_UPDATE_COLLECTION_TIMEOUT);

                started = true;
            };

            function stop() {
                if (autoPullChangesInterval)
                    $interval.cancel(autoPullChangesInterval);

                if (autoUpdatePageInterval)
                    $interval.cancel(autoUpdatePageInterval);

                if (autoUpdateCollectionInterval)
                    $interval.cancel(autoUpdatePageInterval);

                started = false;
            };
        }]
    );

})();

/**
 * @file Translatation service
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTranslate', ['pipTranslate.Service', 'pipTranslate.Directive', 'pipTranslate.Filter']);

})();
/**
 * @file Translatation directives
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTranslate.Directive', ['pipTranslate.Service']);

    thisModule.directive('pipTranslate', ['pipTranslate', function(pipTranslate) {
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
    }]);

    thisModule.directive('pipTranslateHtml', ['pipTranslate', function(pipTranslate) {
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
    }]);

})();
/**
 * @file Filter to translate string resources
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTranslate.Filter', ['pipTranslate.Service']);

    thisModule.filter('translate', ['pipTranslate', function (pipTranslate) {
        return function (key) {
            return pipTranslate.translate(key) || key;
        }
    }]);

})();

/**
 * @file Translatation service
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTranslate.Service', ['LocalStorageModule', 'pipAssert']);

    thisModule.provider('pipTranslate', ['pipAssertProvider', function(pipAssertProvider) {
        var 
            language = 'en',
            persist = true,
            setRoot = true,
            translationMap = {
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

        this.translations = setTranslations;
        this.language = initLanguage;
        this.use = initLanguage;
        this.persist = initPersist;
        this.setRoot = initSetRoot;

        this.$get = ['$rootScope', '$timeout', 'localStorageService', 'pipAssert', function ($rootScope, $timeout, localStorageService, pipAssert) {
            // Read language from persistent storage
            if (persist)
                language = localStorageService.get('language') || language;

            // Set root variable
            if (setRoot) 
                $rootScope.$language = language;
            
            // Resetting root scope to force update language on the screen
            function resetContent(fullReset, partialReset) {
                fullReset = fullReset !== undefined ? !!fullReset : true;
                partialReset = partialReset !== undefined ? !!partialReset : true;

                $rootScope.$reset = fullReset;
                $rootScope.$partialReset = partialReset;
                $timeout(function() {
                    $rootScope.$reset = false;
                    $rootScope.$partialReset = false;
                }, 0);
            }

            function setLanguage(newLanguage, fullReset, partialReset) {
                pipAssert.isString(newLanguage || '', "pipTranslate.use: argument should be a string");

                if (newLanguage != null && newLanguage != language) {
                    language = newLanguage;
                    
                    if (persist)
                        localStorageService.set('language', language);
                    if (setRoot)
                        $rootScope.$language = language;
                    
                    // Resetting content.
                    resetContent(fullReset, partialReset);

                    // Sending notification
                    $rootScope.$broadcast('pipLanguageChanged', newLanguage);
                }
                return language;
            }

            return {
                use: setLanguage,

                translations: setTranslations,
                translate: translate,
                translateArray: translateArray,
                translateSet: translateSet,
                translateObjects: translateObjects,
                translateById: translateById,
                translateSetById: translateSetById,
                translateStringsSet: translateStringsSet
            }
        }];

        // Initialize language selection
        function initLanguage(newLanguage) {
            pipAssertProvider.isString(newLanguage || '', "pipTranslateProvider.use or pipTranslateProvider.language: argument should be a string");

            if (newLanguage != null) {
                language = newLanguage;
            }
            return language;
        }

        // Initialize persistence flag
        function initPersist(newPersist) {
            if (newPersist != null) {
                pipAssertProvider.isBoolean(newPersist || '', "pipTranslateProvider.persist: argument should be a boolean");
                persist = newPersist;
            }
            return persist;
        }

        // Initialize set root flag
        function initSetRoot(newSetRoot) {
            if (newSetRoot != null) {
                pipAssertProvider.isBoolean(newSetRoot || '', "pipTranslateProvider.setRoot: argument should be a boolean");
                setRoot = newSetRoot;
            }
            return setRoot;  
        }

        // Set translation strings for specific language
        function setTranslations(language, languageMap) {
            pipAssertProvider.isString(language, "pipTranslate.setTranslations or pipTranslateProvider.translations: first argument should be a string");
            pipAssertProvider.isObject(languageMap, "pipTranslate.setTranslations or pipTranslateProvider.translations: second argument should be an object");

            var map = translationMap[language] || {};
            translationMap[language] = _.extend(map, languageMap);
        }

        // Translate a string by key using set language
        function translate(key) {
            if (_.isNull(key) || _.isUndefined(key)) return '';

            var map = translationMap[language] || {};
            return map[key] || key;
        }

        // Translate an array of strings
        function translateArray(keys) {
            if (_.isNull(keys) || keys.length == 0) return [];

            pipAssertProvider.isArray(keys, "pipTranslate.translateArray: argument should be an array");

            var values = [];
            var map = translationMap[language] || {};

            _.each(keys, function (k) {
                var key = k || '';
                values.push(map[key] || key);
            });

            return values;
        }

        // Translate an array of strings into array of objects (set)
        function translateSet(keys, key, value) {
            if (_.isNull(keys) || keys.length == 0) return [];

            pipAssertProvider.isArray(keys, "pipTranslate.translateSet: first argument should be an array");
            pipAssertProvider.isString(key || '', "pipTranslate.translateSet: second argument should be a string");
            pipAssertProvider.isString(value || '', "pipTranslate.translateSet: third argument should be a string");

            key = key || 'id';
            value = value || 'name';

            var values = [];
            var map = translationMap[language] || {};

            _.each(keys, function (k) {
                var obj = {}, mapKey = k || '';

                obj[key] = mapKey;
                obj[value] = map[mapKey] || mapKey;

                values.push(obj);
            });

            return values;
        }

        // Translate a collection of objects
        function translateObjects(items, key, value) {
            if (_.isNull(items) || items.length == 0) return [];

            pipAssertProvider.isArray(items, "pipTranslate.translateObjects: first argument should be an array");
            pipAssertProvider.isString(key || '', "pipTranslate.translateObjects: second argument should be a string");
            pipAssertProvider.isString(value || '', "pipTranslate.translateObjects: third argument should be a string");

            key = key || 'name';
            value = value || 'nameLocal';

            var map = translationMap[language] || {};

            _.each(items, function (i) {
                var item = i, mapKey = item[key] || '';

                item[value] = map[mapKey] || mapKey;
            });

            return items;
        }

        // Translate a string by key  with prefix using set language todo
        function translateById(prefix, key) {
            pipAssertProvider.isString(key || '', "pipTranslate.translateById: second argument should be a string");
            pipAssertProvider.isString(prefix || '', "pipTranslate.translateById: first argument should be a string");

            prefix = prefix ? prefix + '_' : '';
            key = (prefix + key).replace(/ /g, '_').toUpperCase();
            if (key == null) return '';
            var map = translationMap[language] || {};
            return map[key] || key;
        };

        function translateSetById(keys, prefix, key, value) {
            if (_.isNull(keys) || keys.length == 0) return [];

            pipAssertProvider.isArray(keys, "pipTranslate.translateSetById: first argument should be an array");
            pipAssertProvider.isString(prefix || '', "pipTranslate.translateSetById: second argument should be a string");
            pipAssertProvider.isString(key || '', "pipTranslate.translateSetById: third argument should be a string");
            pipAssertProvider.isString(value || '', "pipTranslate.translateSetById: forth argument should be a string");

            prefix = prefix ? prefix.replace(/ /g, '_').toUpperCase() : '';
            key = key || 'id';
            value = value || 'name';

            var values = [];
            var map = translationMap[language] || {};

            _.each(keys, function (k) {
                var obj = {}, mapKey = k || '';

                obj[key] = mapKey;
                obj[value] = map[prefix + '_' + mapKey] || mapKey;

                values.push(obj);
            });

            return values;
        }

        // Translate an array of strings, apply uppercase and replace ' ' => '_'
        function translateStringsSet(keys, prefix, key, value) {
            if (_.isNull(keys) || keys.length == 0) return [];

            pipAssertProvider.isArray(keys, "pipTranslate.translateStringsSet: first argument should be an array");
            pipAssertProvider.isString(prefix || '', "pipTranslate.translateStringsSet: second argument should be a string");
            pipAssertProvider.isString(key || '', "pipTranslate.translateStringsSet: third argument should be a string");
            pipAssertProvider.isString(value || '', "pipTranslate.translateStringsSet: forth argument should be a string");

            key = key || 'id';
            value = value || 'name';
            prefix = prefix ? prefix.replace(/ /g, '_').toUpperCase() + '_': '';

            var values = [];
            var map = translationMap[language] || {};

            _.each(keys, function (k) {
                var obj = {}, mapKey = k || '';
                obj[key] = mapKey;
                obj[value] = map[prefix + mapKey.replace(/ /g, '_').toUpperCase()]
                    || (prefix + mapKey.replace(/ /g, '_').toUpperCase());

                values.push(obj);
            });

            return values;
        }
    }]);

})();
/**
 * @file Code utilities
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipCodes', []);

    thisModule.factory('pipCodes', function () {
        
        return {
            hash: hash,
            verification: verification
        }
    
        // Simple version of string hashcode
        function hash(value) {
            if (value == null) return 0;
            var result = 0;
            for (var i = 0; i < value.length; i++) {
                result += value.charCodeAt(i);
            }
            return result;
        }

        // Generates random big number for verification codes
        function verification() {
            return Math.random().toString(36).substr(2, 10).toUpperCase(); // remove `0.`
        }

    });

})();
/**
 * @file Collection utilities
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

// Todo: Deprecate
(function () {
    'use strict';

    var thisModule = angular.module('pipUtils.Collections', []);

    thisModule.factory('pipCollections', function () {
        var collections = {};

        // Index of element in array by key
        collections.indexBy = function (items, key, value) {
            if (!items || !items.length)
                return null;
            for (var i = 0; i < items.length; i++) {
                if (items[i][key] == value) {
                    return i;
                }
            }
            return null;
        };
    
        // Find element in array by key
        collections.findBy = function (items, key, value) {
            if (!items || !items.length)
                return null;
            for (var i = 0; i < items.length; i++) {
                if (items[i][key] == value) {
                    return items[i];
                }
            }
            return null;
        };
    
        // Remove element from array by value
        collections.remove = function (items, item) {
            if (!items || !items.length)
                return null;
            for (var i = 0; i < items.length; i++) {
                if (items[i] == item) {
                    items.splice(i, 1);
                    i--;
                }
            }
        };
    
        // Removes element from array by key
        collections.removeBy = function (items, key, value) {
            if (!items || !items.length)
                return null;
            for (var i = 0; i < items.length; i++) {
                if (items[i][key] == value) {
                    items.splice(i, 1);
                    i--;
                }
            }
        };
    
        // Replaced element by key
        collections.replaceBy = function (items, key, value, data) {
            if (!items || !items.length)
                return null;
            for (var i = 0; i < items.length; i++) {
                if (items[i][key] == value) {
                    items[i] = data;
                    return;
                }
            }
        };
    
        // Calculate difference between two collections
        collections.difference = function (a1, a2, comparator) {
            var result = [];
    
            _.each(a1, function (e1) {
                var e2 = _.find(a2, function (e) {
                    return comparator(e1, e);
                });
    
                if (e2 == null) {
                    result.push(e1);
                }
            })
    
            return result;
        };

        return collections;
    });

})();

/**
 * @file String formatting service
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, $, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipFormat', []);

    thisModule.factory('pipFormat', function () {

        // Creates a sample line from a text
        function sample(value, maxLength) {
            if (!value || value == '') return '';

            var length = value.indexOf('\n');
            length = length >= 0 ? length : value.length;
            length = length < maxLength ? value.length : maxLength;

            return value.substring(0, length);
        }

        function sprintf() {
            function get_type(variable) {
                return toString.call(variable).slice(8, -1).toLowerCase();
            }

            var str_repeat = strRepeat;

            var str_format = function() {
                if (!str_format.cache.hasOwnProperty(arguments[0])) {
                    str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
                }
                return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
            };

            str_format.format = function(parse_tree, argv) {
                var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
                for (i = 0; i < tree_length; i++) {
                    node_type = get_type(parse_tree[i]);
                    if (node_type === 'string') {
                        output.push(parse_tree[i]);
                    }
                    else if (node_type === 'array') {
                        match = parse_tree[i]; // convenience purposes only
                        if (match[2]) { // keyword argument
                            arg = argv[cursor];
                            for (k = 0; k < match[2].length; k++) {
                                if (!arg.hasOwnProperty(match[2][k])) {
                                    throw new Error(sprintf('[_.sprintf] property "%s" does not exist', match[2][k]));
                                }
                                arg = arg[match[2][k]];
                            }
                        } else if (match[1]) { // positional argument (explicit)
                            arg = argv[match[1]];
                        }
                        else { // positional argument (implicit)
                            arg = argv[cursor++];
                        }

                        if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
                            throw new Error(sprintf('[_.sprintf] expecting number but found %s', get_type(arg)));
                        }
                        switch (match[8]) {
                            case 'b': arg = arg.toString(2); break;
                            case 'c': arg = String.fromCharCode(arg); break;
                            case 'd': arg = parseInt(arg, 10); break;
                            case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
                            case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
                            case 'o': arg = arg.toString(8); break;
                            case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
                            case 'u': arg = Math.abs(arg); break;
                            case 'x': arg = arg.toString(16); break;
                            case 'X': arg = arg.toString(16).toUpperCase(); break;
                        }
                        arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
                        pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
                        pad_length = match[6] - String(arg).length;
                        pad = match[6] ? str_repeat(pad_character, pad_length) : '';
                        output.push(match[5] ? arg + pad : pad + arg);
                    }
                }
                return output.join('');
            };

            str_format.cache = {};

            str_format.parse = function(fmt) {
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
        }

        // Return function as the service
        result = sprintf;
        result.sample = sample;
        result.format = sprintf;
        result.sprintf = sprintf;

        return result;
    });

})();

/**
 * @file General purpose utilities
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, $, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipUtils.General', ['pipState', 'pipAssert']);

    thisModule.factory('pipUtils', ['$rootScope', '$window', '$state', 'pipAssert', function ($rootScope, $window, $state, pipAssert) {

        function strRepeat(str, qty) {
            if (qty < 1) return '';
            var result = '';
            while (qty > 0) {
                if (qty & 1) result += str;
                qty >>= 1, str += str;
            }
            return result;
        }

        var toString = Object.prototype.toString;

        return {
            copyProperty: copyProperty,
            copy: copyProperty,
            swapProperties: swapProperties,
            swap: swapProperties,
            convertToBoolean: convertToBoolean,
            toBoolean: convertToBoolean,
            toBool: convertToBoolean,
            convertObjectIdsToString: convertObjectIdsToString,
            OidToString: convertObjectIdsToString,
            generateVerificationCode: generateVerificationCode,
            vercode: generateVerificationCode,
            equalObjectIds: equalObjectIds,
            eqOid: equalObjectIds,
            notEqualObjectIds: notEqualObjectIds,
            neqOid: notEqualObjectIds,
            containsObjectId: containsObjectId,
            hasOid: containsObjectId,
            isObjectId: isObjectId,
            // Strings functions. No analogues in lodash.strings
            hashCode: hashCode,
            makeString: makeString,
            // Collection function. No analogues in lodash. It may be in lodash later. Look gitHub/lodash issue #1022
            replaceBy: replaceBy
        };
        
        //--------------------
        function replaceBy(items, key, value, data) {
            if (!items || !items.length)
                return null;
            for (var i = 0; i < items.length; i++) {
                if (items[i][key] == value) {
                    items[i] = data;
                    return;
                }
            }
        };

        // Ensure some object is a coerced to a string
        function makeString(object) {
            if (object == null) return '';
            return '' + object;
        };

        function isObjectId(value) {
            var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
            return checkForHexRegExp.test(value);
        }

        // Compares two ObjectIds (they are not equal by '==')
        function equalObjectIds(value1, value2) {
            if (value1 == null && value2 == null)
                return true;

            if (value1 == null || value2 == null)
                return false;

            return value1.toString() == value2.toString();
        };

        // Compares two ObjectIds (they are always not equal by '!=')
        function notEqualObjectIds(value1, value2) {
            if (value1 == null && value2 == null)
                return false;

            if (value1 == null || value2 == null)
                return true;

            return value1.toString() != value2.toString();
        };

        // Checks if array contains concrete objectId
        function containsObjectId(values, value) {
            return _.some(values, function (value1) {
                return equalObjectIds(value1, value);
            });
        };

        // Copy property from one object to another if it exists (not null)
        function copyProperty(dest, destProperty, orig, origProperty) {
            // Shift if only 3 arguments set
            if (_.isObject(destProperty)
                && typeof (origProperty) == 'undefined') {
                origProperty = orig;
                orig = destProperty;
                destProperty = origProperty;
            }
    
            if (orig[origProperty] || (typeof (orig[origProperty]) === 'number' && orig[origProperty] % 1 == 0)) {
                dest[destProperty] = orig[origProperty];
                return true;
            }
    
            return false;
        };
    
        // Swaps values of two properties
        function swapProperties(obj, prop1, prop2) {
            var 
                temp1 = obj[prop1],
                temp2 = obj[prop2];
    
            if (temp1) {
                obj[prop2] = temp1;
            }
            else {
                delete obj[prop2];
            }
    
            if (temp2) {
                obj[prop1] = temp2;
            }
            else {
                delete obj[prop1];
            }
        };
    
        // Converts value into boolean
        function convertToBoolean(value) {
            if (value == null) return false;
            if (!value) return false;
            value = value.toString().toLowerCase();
            return value == '1' || value == 'true';
        };
    
        // Converts array of object ids to strings (for comparison)
        function convertObjectIdsToString(values) {
            return _.map(values, function (value) {
                return value ? value.toString() : 0;
            });
        };


    }]);

})();

/**
 * @file Page scrolling functions
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, $, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipScroll', []);

    thisModule.factory('pipScroll', function () {
        return {
            scrollTo: scrollTo
        };
        
        //-------------------------------------

        function scrollTo(parentElement, childElement, animationDuration) {
            if(!parentElement || !childElement) return;
            if (animationDuration == undefined) animationDuration = 300;

            setTimeout(function () {
                if (!$(childElement).position()) return;
                var modDiff= Math.abs($(parentElement).scrollTop() - $(childElement).position().top);
                if (modDiff < 20) return;
                var scrollTo = $(parentElement).scrollTop() + ($(childElement).position().top - 20);
                if (animationDuration > 0)
                    $(parentElement).animate({
                        scrollTop: scrollTo + 'px'
                    }, animationDuration);
            }, 100);
        }

    });

})();

/**
 * @file System Information services
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, $, angular */

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

        // todo add support for iPhone
        function getBrowserName() {
            var ua = $window.navigator.userAgent;

            if (ua.search(/Edge/) > -1) return "edge";
            if (ua.search(/MSIE/) > -1) return "ie";
            if (ua.search(/Trident/) > -1) return "ie";
            if (ua.search(/Firefox/) > -1) return "firefox";
            if (ua.search(/Opera/) > -1) return "opera";
            if (ua.search(/OPR/) > -1) return "opera";
            if (ua.search(/YaBrowser/) > -1) return "yabrowser";
            if (ua.search(/Chrome/) > -1) return "chrome";
            if (ua.search(/Safari/) > -1) return "safari";
            if (ua.search(/Maxthon/) > -1) return "maxthon";
            
            return "unknown";
        }

        function getBrowserVersion() {
            var browser, version;
            var ua = $window.navigator.userAgent;

            if (ua.search(/Edge/) > -1) browser = "edge";
            if (ua.search(/MSIE/) > -1) browser = "ie";
            if (ua.search(/Trident/) > -1) browser = "ie11";
            if (ua.search(/Firefox/) > -1) browser = "firefox";
            if (ua.search(/Opera/) > -1) browser = "opera";
            if (ua.search(/OPR/) > -1) browser = "operaWebkit";
            if (ua.search(/YaBrowser/) > -1) browser = "yabrowser";
            if (ua.search(/Chrome/) > -1) browser = "chrome";
            if (ua.search(/Safari/) > -1) browser = "safari";
            if (ua.search(/Maxthon/) > -1) browser = "maxthon";

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

        // Todo: complete implementation
        function isCordova() {
            return null;
        }

        function getOS() {
            var ua = $window.navigator.userAgent;

            try {
                var osAll = (/(windows|mac|android|linux|blackberry|sunos|solaris|iphone)/.exec(ua.toLowerCase()) || [u])[0].replace('sunos', 'solaris'),
                osAndroid = (/(android)/.exec(ua.toLowerCase()) || '');
                return osAndroid && (osAndroid == 'android' || (osAndroid[0] == 'android')) ? 'android' : osAll;
            } catch (err) {
                return 'unknown'
            }
        }

        // Todo: Move to errors
        function isSupported(supported) {
            if (!supported) supported = {
                edge: 11,
                ie: 11,
                firefox: 43, //4, for testing
                opera: 35,
                chrome: 47
            };

            var browser = getBrowserName();
            var version = getBrowserVersion();
            version = version.split(".")[0]

            if (browser && supported[browser] && version >= supported[browser]) 
                return true;

            return true;
        };

    }]);

})();

/**
 * @file Search tag utilities
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

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

        //------------------------------

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
        };
    
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

/**
 * @file Collection of utilities
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    angular.module('pipUtils', 
		['pipUtils.General', 'pipUtils.Strings', 'pipUtils.Collections']);
})();



/**
 * @file Registration of all application layouts
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';

    angular.module('pipLayout', [
        'pipLayout.Main', 'pipLayout.Simple', 'pipLayout.Card', 'pipLayout.Document',
        'pipLayout.Tiles', 'pipLayout.Dialog'
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
        ['$scope', '$element', '$rootScope', function($scope, $element, $rootScope) {
            var $window = $(window);

            // Add CSS class
            $element.addClass('pip-main');

            // Handle window resize events
            $window.bind('resize', resize);

            // Unbind when scope is removed
            $scope.$on('$destroy', function() {
                $rootScope.$size = undefined;
                $window.unbind('resize', resize);
            });

            // Resize window from request
            $rootScope.$on('pipResizeWindow', function(event) {
                // Trigger a bit latter t allow full initialization
                // Do not remove! Otherwise, sizes in layouts calculated incorrectly
                setTimeout(resize, 0);
            });

            // Allow to finish initialization of all controllers
            setTimeout(resize, 0);

            return;
            
            //---------------

            function resize() {
                $rootScope.$broadcast('pipWindowResized');
            }
        }]
    );

})();

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
            resize(false);
        });

        // Force layout by request
        $scope.$on('pipResizeLayout', function () {
            resize(true);
        });

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
        'pipToggleButtons',
        'pipRefreshButton',
        'pipColorPicker',
        'pipRoutingProgress',
        'pipPopover',
        'pipImageSlider',
        'pipToasts',
        'pipTagList',
        'pipUnsavedChanges',
        'pipFabTooltipVisibility'
    ]);

})(window.angular);


(function(module) {
try {
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('color_picker/color_picker.html',
    '<ul class="pip-color-picker lp0 {{class}}" pip-selected="currentColorIndex" pip-enter-space-press="enterSpacePress($event)">\n' +
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
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('popover/popover.template.html',
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
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
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
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('tags/tag_list.html',
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

(function(module) {
try {
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('toast/toast.html',
    '<md-toast class="md-action pip-toast"\n' +
    '          ng-class="{\'pip-error\': toast.type==\'error\',\n' +
    '          \'pip-column-toast\': toast.type == \'error\' || toast.actions.length > 1 || actionLenght > 4,\n' +
    '          \'pip-no-action-toast\': actionLenght == 0}"\n' +
    '          style="height:initial; max-height: initial; ">\n' +
    '\n' +
    '    <span class="flex-var m0 pip-text" ng-bind-html="message"></span>\n' +
    '    <div class="layout-row layout-align-end-start" class="pip-actions" ng-if="actions.length > 0 || (toast.type==\'error\' && toast.error)">\n' +
    '        <md-button class="flex-fixed m0 lm8" ng-if="toast.type==\'error\' && toast.error" ng-click="onDetails()">Details</md-button>\n' +
    '        <md-button class="flex-fixed m0 lm8"\n' +
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

(function(module) {
try {
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('toggle_buttons/toggle_buttons.html',
    '<div class="pip-toggle-buttons flex layout-row {{class}}" pip-selected="bufButtonIndex" pip-enter-space-press="enterSpacePress($event)"\n' +
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
 * @file Color picker control
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipColorPicker', ['pipUtils', 'pipFocused', 'pipBasicControls.Templates']);

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
 * @file Image slider control
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, $) {
    'use strict';

    var thisModule = angular.module('pipImageSlider', []);

    thisModule.directive('pipImageSlider',
        function () {
            return {
                scope: false,
                controller: ['$scope', '$element', '$attrs', '$parse', '$timeout', '$interval', '$pipImageSlider', function ($scope, $element, $attrs, $parse, $timeout, $interval, $pipImageSlider) {
                    var blocks,
                        indexSetter = $parse($attrs.pipImageSliderIndex).assign,
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
                    }, 600);

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

                    function setIndex() {
                        if (indexSetter) {
                            indexSetter($scope, index);
                        }
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
                    });

                    function restartInterval() {
                        stopInterval();
                        startInterval();
                    }
                }]
            };
        }
    );

    thisModule.directive('pipSliderButton',
        function () {
            return {
                scope: {},
                controller: ['$scope', '$element', '$parse', '$attrs', function ($scope, $element, $parse, $attrs) {
                    var type = $parse($attrs.pipButtonType)($scope),
                        sliderId = $parse($attrs.pipSliderId)($scope);

                    $element.on('click', function () {
                        if (!sliderId || !type) {
                            return;
                        }

                        angular.element(document.getElementById(sliderId)).scope()[type + 'Block']();
                    });
                }]
            };
        }
    );

    thisModule.directive('pipSliderIndicator',
        function () {
            return {
                scope: false,
                controller: ['$scope', '$element', '$parse', '$attrs', function ($scope, $element, $parse, $attrs) {
                    var sliderId = $parse($attrs.pipSliderId)($scope),
                        slideTo = $parse($attrs.pipSlideTo)($scope);

                    $element.css('cursor', 'pointer');
                    $element.on('click', function () {
                        if (!sliderId || slideTo && slideTo < 0) {
                            return;
                        }

                        angular.element(document.getElementById(sliderId)).scope().slideTo(slideTo);
                    });
                }]
            };
        }
    );

    thisModule.service('$pipImageSlider',
        ['$timeout', function ($timeout) {

            var ANIMATION_DURATION = 550;

            return {
                nextCarousel: nextCarousel,
                prevCarousel: prevCarousel,
                toBlock: toBlock
            };

            function nextCarousel(nextBlock, prevBlock) {
                nextBlock.removeClass('animated').addClass('pip-next');

                $timeout(function () {
                    nextBlock.addClass('animated').addClass('pip-show').removeClass('pip-next');
                    prevBlock.addClass('animated').removeClass('pip-show');
                }, 100);
            }

            function prevCarousel(nextBlock, prevBlock) {
                nextBlock.removeClass('animated');

                $timeout(function () {
                    nextBlock.addClass('animated').addClass('pip-show');
                    prevBlock.addClass('animated').addClass('pip-next').removeClass('pip-show');

                    $timeout(function () {
                        prevBlock.removeClass('pip-next').removeClass('animated');
                    }, ANIMATION_DURATION - 100);
                }, 100);
            }

            function toBlock(type, blocks, oldIndex, nextIndex, direction) {
                var prevBlock = $(blocks[oldIndex]),
                    blockIndex = nextIndex,
                    nextBlock = $(blocks[blockIndex]);

                if (type === 'carousel') {
                    $(blocks).removeClass('pip-next').removeClass('pip-prev');

                    if (direction && direction === 'prev') {
                        prevCarousel(nextBlock, prevBlock);
                    }
                    if (direction && direction === 'next') {
                        nextCarousel(nextBlock, prevBlock);
                    }
                    if ((!direction || direction !== 'next' && direction !== 'prev') &&
                        nextIndex && nextIndex < oldIndex) {
                        prevCarousel(nextBlock, prevBlock);
                    } else {
                        nextCarousel(nextBlock, prevBlock);
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
 * @file Markdown control
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Move css styles under control
 * - Improve samples in sampler app
 */

(function (angular, marked, _) {
    'use strict';

    var thisModule = angular.module('pipMarkdown', ['ngSanitize', 'pipUtils', 'pipTranslate']);

    /* eslint-disable quote-props */
    thisModule.config(['pipTranslateProvider', function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'MARKDOWN_ATTACHMENTS': 'Attachments:',
            'checklist': 'Checklist',
            'documents': 'Documents',
            'pictures': 'Pictures',
            'location': 'Location',
            'time': 'Time'
        });
        pipTranslateProvider.translations('ru', {
            'MARKDOWN_ATTACHMENTS': 'Вложения:',
            'checklist': 'Список',
            'documents': 'Документы',
            'pictures': 'Изображения',
            'location': 'Местонахождение',
            'time': 'Время'
        });
    }]);
    /* eslint-enable quote-props */

    thisModule.directive('pipMarkdown',
        ['$parse', 'pipUtils', 'pipTranslate', function ($parse, pipUtils, pipTranslate) {
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
                                if (attachString.length === 0) {
                                    attachString = pipTranslate.translate('MARKDOWN_ATTACHMENTS');
                                }

                                if (attachTypes.indexOf(attach.type) < 0) {
                                    attachTypes.push(attach.type);
                                    attachString += attachTypes.length > 1 ? ', ' : ' ';
                                    attachString += pipTranslate.translate(attach.type);
                                }
                            }
                        });

                        return attachString;
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
                    if (pipUtils.toBoolean($attrs.pipRebind)) {
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

    var thisModule = angular.module('pipPopover', ['pipAssert']);

    thisModule.directive('pipPopover', function () {
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: 'popover/popover.template.html',
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

    thisModule.service('$pipPopover',
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
 * @file Tag list control
 * @copyright Digital Living Software Corp. 2014-2015
 * @todo
 * - Improve samples in sampler app
 * - What's pipType and pipTypeLocal? Give better name
 * - Do not use ng-if, instead generate template statically
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipTagList', ['pipServices']);

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
                templateUrl: 'tags/tag_list.html',
                controller: ['$scope', '$element', '$attrs', 'pipUtils', function ($scope, $element, $attrs, pipUtils) {
                    var tagsGetter;

                    tagsGetter = $parse($attrs.pipTags);
                    $element.css('display', 'block');
                    // Set tags
                    $scope.tags = tagsGetter($scope);

                    // Also optimization to avoid watch if it is unnecessary
                    if (pipUtils.toBoolean($attrs.pipRebind)) {
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
    var thisModule = angular.module('pipToasts', ['pipTranslate', 'ngMaterial', 'pipAssert']);

    thisModule.controller('pipToastController',
        ['$scope', '$mdToast', 'toast', 'pipErrorDetailsDialog', function ($scope, $mdToast, toast, pipErrorDetailsDialog) {
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

            $scope.onDetails = function () {
                $mdToast.hide();
                pipErrorDetailsDialog.show(
                    {
                        error: $scope.toast.error,
                        ok: 'Ok'
                    },
                    angular.noop,
                    angular.noop
                );
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
        ['$rootScope', '$mdToast', 'pipAssert', function ($rootScope, $mdToast, pipAssert) {
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
                pipAssert.isDef(message, 'pipToasts.showNotification: message should be defined');
                pipAssert.isString(message, 'pipToasts.showNotification: message should be a string');
                pipAssert.isArray(actions || [], 'pipToasts.showNotification: actions should be an array');
                if (successCallback) {
                    pipAssert.isFunction(successCallback, 'showNotification: successCallback should be a function');
                }
                if (cancelCallback) {
                    pipAssert.isFunction(cancelCallback, 'showNotification: cancelCallback should be a function');
                }

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
                pipAssert.isDef(message, 'pipToasts.showMessage: message should be defined');
                pipAssert.isString(message, 'pipToasts.showMessage: message should be a string');
                if (successCallback) {
                    pipAssert.isFunction(successCallback, 'pipToasts.showMessage:successCallback should be a function');
                }
                if (cancelCallback) {
                    pipAssert.isFunction(cancelCallback, 'pipToasts.showMessage: cancelCallback should be a function');
                }

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
                pipAssert.isDef(message, 'pipToasts.showError: message should be defined');
                pipAssert.isString(message, 'pipToasts.showError: message should be a string');
                if (successCallback) {
                    pipAssert.isFunction(successCallback, 'pipToasts.showError: successCallback should be a function');
                }
                if (cancelCallback) {
                    pipAssert.isFunction(cancelCallback, 'pipToasts.showError: cancelCallback should be a function');
                }

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
                    pipAssert.isString(type, 'pipToasts.clearToasts: type should be a string');

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
 * @file Toggle buttons control
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipToggleButtons', ['pipBasicControls.Templates']);

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
        'pipDraggable'
    ]);
    
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

    var thisModule = angular.module("pipDraggable", ['pipUtils']);

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

    thisModule.directive('pipDrag', ['$rootScope', '$parse', '$document', '$window', 'pipDraggable', 'pipUtils', function ($rootScope, $parse, $document, $window, pipDraggable, pipUtils) {
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
                        verticalScroll = pipUtils.toBoolean(attrs.pipVerticalScroll) || true,
                        horizontalScroll = pipUtils.toBoolean(attrs.pipHorizontalScroll) || true,
                        activationDistance = parseFloat(attrs.pipActivationDistance) || 75,
                        scrollDistance = parseFloat(attrs.pipScrollDistance) || 50,
                        scrollParent = false,

                        scrollContainer = angular.element(window),
                        scrollContainerGetter = $parse(attrs.pipScrollContainer);

                    // deregistration function for mouse move events in $rootScope triggered by jqLite trigger handler
                    var _deregisterRootMoveListener = angular.noop;

                    var initialize = function () {
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
                    };

                    var toggleListeners = function (enable) {
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
                    };
                    var onDestroy = function (enable) {
                        toggleListeners(false);
                    };
                    var onEnableChange = function (newVal, oldVal) {
                        _dragEnabled = (newVal);
                    };
                    var onCenterAnchor = function (newVal, oldVal) {
                        if (angular.isDefined(newVal))
                            _centerAnchor = (newVal || 'true');
                    };

                    var isClickableElement = function (evt) {
                        return (
                            angular.isDefined(angular.element(evt.target).attr("pip-cancel-drag"))
                        );
                    };
                    /*
                     * When the element is clicked start the drag behaviour
                     * On touch devices as a small delay so as not to prevent native window scrolling
                     */
                    var onpress = function (evt) {
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

                    };

                    function saveElementStyles() {
                        _elementStyle.left = element.css('css');
                        _elementStyle.top = element.css('top');
                        _elementStyle.position = element.css('position');
                        _elementStyle.width = element.css('width');                        
                    }

                    var cancelPress = function () {
                        clearTimeout(_pressTimer);
                        $document.off(_moveEvents, cancelPress);
                        $document.off(_releaseEvents, cancelPress);
                    };

                    var onlongpress = function (evt) {
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
                    };

                    var onmove = function (evt) {
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
                    };

                    var onrelease = function (evt) {
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
                    };

                    var onDragComplete = function (evt) {


                        if (!onDragSuccessCallback)return;

                        scope.$apply(function () {
                            onDragSuccessCallback(scope, {$data: _data, $event: evt});
                        });
                    };

                    var reset = function () {
                        if (allowTransform)
                            element.css({transform: '', 'z-index': '', '-webkit-transform': '', '-ms-transform': ''});
                        else {
                            element.css({'position': _elementStyle.position, top: _elementStyle.top, left: _elementStyle.left, 'z-index': '', width: _elementStyle.width});
                        }
                    };

                    var moveElement = function (x, y) {
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
                    };

                    var dragToScroll = function () {
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

                    };

                    initialize();
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

                var onDropCallback = $parse(attrs.pipDropSuccess);// || function(){};

                var onDragStartCallback = $parse(attrs.pipDragStart);
                var onDragStopCallback = $parse(attrs.pipDragStop);
                var onDragMoveCallback = $parse(attrs.pipDragMove);

                var initialize = function () {
                    toggleListeners(true);
                };

                var toggleListeners = function (enable) {
                    // remove listeners

                    if (!enable)return;
                    // add listeners.
                    scope.$watch(attrs.pipDrop, onEnableChange);
                    scope.$on('$destroy', onDestroy);
                    scope.$on('draggable:start', onDragStart);
                    scope.$on('draggable:move', onDragMove);
                    scope.$on('draggable:end', onDragEnd);
                };

                var onDestroy = function (enable) {
                    toggleListeners(false);
                };
                var onEnableChange = function (newVal, oldVal) {
                    _dropEnabled = newVal;
                };
                var onDragStart = function (evt, obj) {
                    if (!_dropEnabled)return;
                    isTouching(obj.x, obj.y, obj.element);

                    if (attrs.pipDragStart) {
                        $timeout(function () {
                            onDragStartCallback(scope, {$data: obj.data, $event: obj});
                        });
                    }
                };
                var onDragMove = function (evt, obj) {
                    if (!_dropEnabled)return;
                    isTouching(obj.x, obj.y, obj.element);

                    if (attrs.pipDragMove) {
                        $timeout(function () {
                            onDragMoveCallback(scope, {$data: obj.data, $event: obj});
                        });
                    }
                };

                var onDragEnd = function (evt, obj) {

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
                };

                var isTouching = function (mouseX, mouseY, dragElement) {
                    var touching = hitTest(mouseX, mouseY);
                    scope.isTouching = touching;
                    if (touching) {
                        _lastDropTouch = element;
                    }
                    updateDragStyles(touching, dragElement);
                    return touching;
                };

                var updateDragStyles = function (touching, dragElement) {
                    if (touching) {
                        element.addClass('pip-drag-enter');
                        dragElement.addClass('pip-drag-over');
                    } else if (_lastDropTouch == element) {
                        _lastDropTouch = null;
                        element.removeClass('pip-drag-enter');
                        dragElement.removeClass('pip-drag-over');
                    }
                };

                var hitTest = function (x, y) {
                    var bounds = element[0].getBoundingClientRect();
                    x -= $document[0].body.scrollLeft + $document[0].documentElement.scrollLeft;
                    y -= $document[0].body.scrollTop + $document[0].documentElement.scrollTop;
                    return x >= bounds.left
                        && x <= bounds.right
                        && y <= bounds.bottom
                        && y >= bounds.top;
                };

                initialize();
            }
        };
    }]);

    //thisModule.directive('pipDragClone', ['$parse', '$timeout', 'pipDraggable', function ($parse, $timeout, pipDraggable) {
    //    return {
    //        restrict: 'A',
    //        link: function (scope, element, attrs) {
    //            var img, _allowClone = true;
    //            var _dragOffset = null;
    //            scope.clonedData = {};
    //            var initialize = function () {
//
    //                img = element.find('img');
    //                element.attr('pip-draggable', 'false');
    //                img.attr('draggable', 'false');
    //                reset();
    //                toggleListeners(true);
    //            };
//
//
    //            var toggleListeners = function (enable) {
    //                // remove listeners
//
    //                if (!enable)return;
    //                // add listeners.
    //                scope.$on('draggable:start', onDragStart);
    //                scope.$on('draggable:move', onDragMove);
    //                scope.$on('draggable:end', onDragEnd);
    //                preventContextMenu();
//
    //            };
    //            var preventContextMenu = function () {
    //                //  element.off('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
    //                img.off('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
    //                //  element.on('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
    //                img.on('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
    //            };
    //            var onDragStart = function (evt, obj, elm) {
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
    //            };
    //            var onDragMove = function (evt, obj) {
    //                if (_allowClone) {
//
    //                    _tx = obj.tx + obj.dragOffset.left;
    //                    _ty = obj.ty + obj.dragOffset.top;
//
    //                    moveElement(_tx, _ty);
    //                }
    //            };
    //            var onDragEnd = function (evt, obj) {
    //                //moveElement(obj.tx,obj.ty);
    //                if (_allowClone) {
    //                    reset();
    //                }
    //            };
//
    //            var reset = function () {
    //                element.css({left: 0, top: 0, position: 'fixed', 'z-index': -1, visibility: 'hidden'});
    //            };
    //            var moveElement = function (x, y) {
    //                element.css({
    //                    transform: 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + x + ', ' + y + ', 0, 1)',
    //                    'z-index': 99999,
    //                    'visibility': 'visible',
    //                    '-webkit-transform': 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + x + ', ' + y + ', 0, 1)',
    //                    '-ms-transform': 'matrix(1, 0, 0, 1, ' + x + ', ' + y + ')'
    //                    //,margin: '0'  don't monkey with the margin,
    //                });
    //            };
//
    //            var absorbEvent_ = function (event) {
    //                var e = event;//.originalEvent;
    //                e.preventDefault && e.preventDefault();
    //                e.stopPropagation && e.stopPropagation();
    //                e.cancelBubble = true;
    //                e.returnValue = false;
    //                return false;
    //            };
//
    //            initialize();
    //        }
    //    };
    //}]);

    thisModule.directive('pipPreventDrag', ['$parse', '$timeout', function ($parse, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var initialize = function () {

                    element.attr('pip-draggable', 'false');
                    toggleListeners(true);
                };


                var toggleListeners = function (enable) {
                    // remove listeners

                    if (!enable)return;
                    // add listeners.
                    element.on('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
                };


                var absorbEvent_ = function (event) {
                    var e = event.originalEvent;
                    e.preventDefault && e.preventDefault();
                    e.stopPropagation && e.stopPropagation();
                    e.cancelBubble = true;
                    e.returnValue = false;
                    return false;
                };

                initialize();
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

    var thisModule = angular.module("pipSelected", ['pipUtils']);

    thisModule.directive('pipSelected',['$parse', 'pipUtils', '$mdConstant', '$timeout', function ($parse, pipUtils, $mdConstant, $timeout) {
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
                    noScroll = pipUtils.toBoolean($attrs.pipNoScroll),
                    modifier = pipUtils.toBoolean($attrs.pipSkipHidden) ? ':visible' : '',
                    className = pipUtils.toBoolean($attrs.pipTreeList) ? '.pip-selectable-tree' : '.pip-selectable',
                    selectedIndex = indexGetter($scope),
                    currentElementTabinex = $element.attr('tabindex'),
                    pipSelectedWatch = $attrs.pipSelectedWatch;

                // Set tabindex if it's not set yet
                $element.attr('tabindex', currentElementTabinex || 0);

                // Watch selected item index
                if (!pipUtils.toBoolean($attrs.pipTreeList)) {
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
        'pipDateTimeFilters'
    ]);

    angular.module('pipDateTimesControls', ['pipDateTimes']);

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

    thisModule.controller('pipDateController',
        ['$scope', '$element', 'pipTranslate', function ($scope, $element, pipTranslate) {
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
                        name: pipTranslate.translate('MONTH_' + i)
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

            $scope.dayLabel = pipTranslate.translate('DAY');
            $scope.monthLabel = pipTranslate.translate('MONTH');
            $scope.yearLabel = pipTranslate.translate('YEAR');

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

    thisModule.controller('pipDateRangeController',
        ['$scope', '$element', 'pipTranslate', '$mdMedia', '$rootScope', function ($scope, $element, pipTranslate, $mdMedia, $rootScope) {
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
                        name: pipTranslate.translate('MONTH_' + i)
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

    var thisModule = angular.module('pipDateFormat', ['pipUtils', 'pipTranslate']);

	thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {

        pipTranslateProvider.translations('en', {
            // Months - 'MONTH_' + monthIndex
            // start at 0 to match JS date format
            'MONTH_1': 'January',
            'MONTH_2': 'February',
            'MONTH_3': 'March',
            'MONTH_4': 'April',
            'MONTH_5': 'May',
            'MONTH_6': 'June',
            'MONTH_7': 'July',
            'MONTH_8': 'August',
            'MONTH_9': 'September',
            'MONTH_10': 'October',
            'MONTH_11': 'November',
            'MONTH_12': 'December',

            'MONTH_LONG_1': 'January',
            'MONTH_LONG_2': 'February',
            'MONTH_LONG_3': 'March',
            'MONTH_LONG_4': 'April',
            'MONTH_LONG_5': 'May',
            'MONTH_LONG_6': 'June',
            'MONTH_LONG_7': 'July',
            'MONTH_LONG_8': 'August',
            'MONTH_LONG_9': 'September',
            'MONTH_LONG_10': 'October',
            'MONTH_LONG_11': 'November',
            'MONTH_LONG_12': 'December',

            'MONTH_SHORT_1': 'Jan',
            'MONTH_SHORT_2': 'Feb',
            'MONTH_SHORT_3': 'Mar',
            'MONTH_SHORT_4': 'Apr',
            'MONTH_SHORT_5': 'May',
            'MONTH_SHORT_6': 'Jun',
            'MONTH_SHORT_7': 'Jul',
            'MONTH_SHORT_8': 'Aug',
            'MONTH_SHORT_9': 'Sep',
            'MONTH_SHORT_10': 'Oct',
            'MONTH_SHORT_11': 'Nov',
            'MONTH_SHORT_12': 'Dec',

            // Days of the week - 'DAY_' + dayIndex
            // start at 1 to match JS date format
            'DAY_1': 'Monday',
            'DAY_2': 'Tuesday',
            'DAY_3': 'Wednesday',
            'DAY_4': 'Thursday',
            'DAY_5': 'Friday',
            'DAY_6': 'Saturday',
            'DAY_7': 'Sunday',

            'ELAPSED_TODAY': 'Today',
            'ELAPSED_YESTERDAY': 'Yesterday',
            'ELAPSED_YEARS': 'y',
            'ELAPSED_MONTHS': 'mth',
            'ELAPSED_WEEKS': 'w',
            'ELAPSED_DAYS': 'd',
            'ELAPSED_HOURS': 'h',
            'ELAPSED_MINUTES': 'm',
            'ELAPSED_SECONDS': 's',
            'ELAPSED_AT': 'at',
            'ELAPSED_AGO': 'ago',
            'ELAPSED_JUST_NOW': 'Just now',
            'ELAPSED_FEW_MIN_AGO': 'Few min ago',
            'ELAPSED_MIN_AGO': 'min ago',
            'ELAPSED_HOUR_AGO': 'hour ago',
            'ELAPSED_HOURS_AGO': 'hours ago',
            'ELAPSED_HOURS_AGO_MORE_THAN_FIVE': 'hours ago'
        });

        pipTranslateProvider.translations('ru', {
            // Months - 'MONTH_' + monthIndex
            // start at 0 to match JS date format
            'MONTH_1': 'январь',
            'MONTH_2': 'февраль',
            'MONTH_3': 'март',
            'MONTH_4': 'апрель',
            'MONTH_5': 'май',
            'MONTH_6': 'июнь',
            'MONTH_7': 'июль',
            'MONTH_8': 'август',
            'MONTH_9': 'сентябрь',
            'MONTH_10': 'октябрь',
            'MONTH_11': 'ноябрь',
            'MONTH_12': 'декабрь',

            'MONTH_LONG_1': 'января',
            'MONTH_LONG_2': 'февраля',
            'MONTH_LONG_3': 'марта',
            'MONTH_LONG_4': 'апреля',
            'MONTH_LONG_5': 'мая',
            'MONTH_LONG_6': 'июня',
            'MONTH_LONG_7': 'июля',
            'MONTH_LONG_8': 'августа',
            'MONTH_LONG_9': 'сентября',
            'MONTH_LONG_10': 'октября',
            'MONTH_LONG_11': 'ноября',
            'MONTH_LONG_12': 'декабря',

            'MONTH_SHORT_1': 'янв',
            'MONTH_SHORT_2': 'фев',
            'MONTH_SHORT_3': 'мар',
            'MONTH_SHORT_4': 'апр',
            'MONTH_SHORT_5': 'май',
            'MONTH_SHORT_6': 'июн',
            'MONTH_SHORT_7': 'июл',
            'MONTH_SHORT_8': 'авг',
            'MONTH_SHORT_9': 'сен',
            'MONTH_SHORT_10': 'окт',
            'MONTH_SHORT_11': 'ноя',
            'MONTH_SHORT_12': 'дек',

            // Days of the week - 'DAY_' + dayIndex
            // start at 1 to match JS date format
            'DAY_1': 'понедельник',
            'DAY_2': 'вторник',
            'DAY_3': 'среда',
            'DAY_4': 'четверг',
            'DAY_5': 'пятница',
            'DAY_6': 'суббота',
            'DAY_7': 'воскресенье',

            'ELAPSED_TODAY': 'Сегодня',
            'ELAPSED_YESTERDAY': 'Вчера',
            'ELAPSED_YEARS': 'г',
            'ELAPSED_MONTHS': 'мц',
            'ELAPSED_WEEKS': 'н',
            'ELAPSED_DAYS': 'д',
            'ELAPSED_HOURS': 'ч',
            'ELAPSED_MINUTES': 'м',
            'ELAPSED_SECONDS': 'с',
            'ELAPSED_AT': 'в',
            'ELAPSED_AGO': 'тн',
            'ELAPSED_JUST_NOW': 'Только что',
            'ELAPSED_FEW_MIN_AGO': 'Несколько мин тн',
            'ELAPSED_MIN_AGO': 'мин тн',
            'ELAPSED_HOUR_AGO': 'час тн',
            'ELAPSED_HOURS_AGO': 'часа тн',
            'ELAPSED_HOURS_AGO_MORE_THAN_FIVE': 'часов тн'
        });
		
	}]);

    thisModule.factory('pipDateFormat',
        ['pipDates', 'pipTranslate', '$rootScope', function (pipDates, pipTranslate, $rootScope) {

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
                    longMonthName = pipTranslate.translate('MONTH_LONG_' + (month + 1)),
                    shortMonthName = pipTranslate.translate('MONTH_SHORT_' + (month + 1)),
                    monthName = pipTranslate.translate('MONTH_' + (month + 1)),
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

                if (pipTranslate.use() == 'en') {
                    ampm = hours >= 12 ? ' PM' : ' AM';
                    hours = hours % 12;
                    if (hours == 0) hours = 12;
                }

                if (format == 'hh:mm:ss')
                    return '' + twoDigits(hours) + ':' + twoDigits(mins) + ':' + twoDigits(secs) + ampm;
                else if (format == 'hh:mm')
                    return '' + twoDigits(hours) + ':' + twoDigits(mins) + ampm;

                return '' + twoDigits(hours) + ':' + twoDigits(mins) + ':' + twoDigits(secs) + ampm;
            }

            function formatMonth(value, short) {
                if (value == null) return '';
                return short ? pipTranslate.translate('MONTH_SHORT_' + value) : pipTranslate.translate('MONTH_' + value);
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

                if (diff < 1) return pipTranslate.translate('ELAPSED_JUST_NOW');

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

                if (format == 'interval') {
                    var result = '';

                    if (years) {
                        result += ' ' + years + pipTranslate.translate('ELAPSED_YEARS');
                        weeks = days = hours = mins = secs = null;
                    }
                    if (months) {
                        result += ' ' + months + pipTranslate.translate('ELAPSED_MONTHS');
                        days = hours = mins = secs = null;
                    }
                    if (weeks) {
                        result += ' ' + weeks + pipTranslate.translate('ELAPSED_WEEKS');
                        hours = mins = secs = null;
                    }
                    if (days) {
                        result += ' ' + days + pipTranslate.translate('ELAPSED_DAYS');
                        mins = secs = null;
                    }
                    if (hours) {
                        result += ' ' + hours + pipTranslate.translate('ELAPSED_HOURS');
                        secs = null;
                    }
                    if (mins) result += ' ' + mins + pipTranslate.translate('ELAPSED_MINUTES');
                    if (secs) result += ' ' + secs + pipTranslate.translate('ELAPSED_SECONDS');

                    return result != '' ? result + ' ' + pipTranslate.translate('ELAPSED_AGO') 
                        : pipTranslate.translate('ELAPSED_JUST_NOW');
                }

                // Default time format = 'default'

                if (years > 0) {
                    return formatDate(value, 'd MMM yyyy');
                }

                if (months > 0 || weeks > 0 || days > 1) {
                    return formatDate(value, 'MMM d') 
                        + ', ' + formatTime(value, 'hh:mm');
                }

                if (days == 1) {
                    return pipTranslate.translate('ELAPSED_YESTERDAY') 
                        + ', ' + formatTime(value, 'hh:mm');
                }

                if (hours > 10) {
                    return pipTranslate.translate('ELAPSED_TODAY') 
                        + ', ' + formatTime(value, 'hh:mm');
                }

                if (hours > 0) {
                    return '' + hours + ' ' + (hours < 2 ? pipTranslate.translate('ELAPSED_HOUR_AGO') :
                        hours < 5 ? pipTranslate.translate('ELAPSED_HOURS_AGO') : pipTranslate.translate('ELAPSED_HOURS_AGO_MORE_THAN_FIVE'));
                }

                if (mins > 10) {
                    return '' + mins + ' ' + pipTranslate.translate('ELAPSED_MIN_AGO');
                }

                if (mins > 0) {
                    return pipTranslate.translate('ELAPSED_FEW_MIN_AGO');
                }

                return pipTranslate.translate('ELAPSED_JUST_NOW');
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

    var thisModule = angular.module('pipTimeRange', ['pipUtils']);

    thisModule.directive('pipTimeRange',
        ['pipUtils', function (pipUtils) {
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

                    $scope.data = {};
                    $scope.data.start = null;
                    $scope.data.end = null;
                    defineStartDate();
                    defineEndDate();

                    if (pipUtils.toBoolean($attrs.pipRebind)) {
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
        }]
    );

})(window.angular, window._);


(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipTimeRangeEdit', ['pipUtils', 'pipTranslate']);

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
    '    <div class="pip-header text-subhead1">\n' +
    '        <h3 class="m0">{{:: title | translate }}</h3>\n' +
    '    </div>\n' +
    '    <div class="pip-footer">\n' +
    '        <div>\n' +
    '            <md-button ng-click="onCancel()">{{:: cancel | translate }}</md-button>\n' +
    '            <md-button class="md-accent" ng-click="onOk()">{{:: ok | translate }}</md-button>\n' +
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
    '<md-dialog class="pip-dialog pip-details-dialog layout-column" width="400" md-theme="{{theme}}">\n' +
    '    <div class="pip-body">\n' +
    '\n' +
    '        <div class="pip-header p0 bp8  text-subhead1">{{::\'ERROR_DETAILS\' | translate}}</div>\n' +
    '        <div class="layout-row layout-align-start-center h48 text-body2 color-secondary-text"\n' +
    '             ng-if="error.code || (error.data && error.data.code)">\n' +
    '            {{::\'CODE\' | translate}}\n' +
    '        </div>\n' +
    '        <div class="layout-row layout-align-start-center" ng-if="error.code || (error.data && error.data.code)">\n' +
    '            {{error.code || error.data.code}}\n' +
    '        </div>\n' +
    '\n' +
    '        <div class="layout-row layout-align-start-center h48 text-body2 color-secondary-text"\n' +
    '             ng-if="error.path || (error.data && error.data.path)">\n' +
    '            {{::\'PATH\' | translate}}\n' +
    '        </div>\n' +
    '        <div class="layout-row layout-align-start-center" ng-if="error.path || (error.data && error.data.path)">\n' +
    '            {{error.path || error.data.path}}\n' +
    '        </div>\n' +
    '\n' +
    '        <div class="h48 text-body2 color-secondary-text layout-row layout-align-start-center"\n' +
    '             ng-if="error.error || (error.data && error.data.error)">\n' +
    '            {{::\'ERROR\' | translate}}\n' +
    '        </div>\n' +
    '        <div class="layout-row layout-align-start-center" ng-if="error.error || (error.data && error.data.error)">\n' +
    '            {{error.error || error.data.error}}\n' +
    '        </div>\n' +
    '\n' +
    '        <div class="h48 text-body2 color-secondary-text layout-row layout-align-start-center"\n' +
    '             ng-if="error.method || (error.data && error.data.method)">\n' +
    '            {{::\'METHOD\' | translate}}\n' +
    '        </div>\n' +
    '        <div class="layout-row layout-align-start-center" ng-if="error.method || (error.data && error.data.method)">\n' +
    '            {{error.method || error.data.method}}\n' +
    '        </div>\n' +
    '\n' +
    '        <div class="h48 text-body2 color-secondary-text layout-row layout-align-start-center"\n' +
    '             ng-if="error.message || (error.data && error.data.message)">\n' +
    '            {{::\'MESSAGE\' | translate}}\n' +
    '        </div>\n' +
    '        <div class="layout-row layout-align-start-center"\n' +
    '             ng-if="error.message || (error.data && error.data.message)">\n' +
    '            {{error.message || error.data.message}}\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="pip-footer rp16">\n' +
    '        <div>\n' +
    '            <md-button class="md-accent m0" ng-click="onOk()">{{::\'DISMISS\' | translate }}</md-button>\n' +
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
    '        <h3 class="m0">{{ title | translate }}</h3>\n' +
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
    '            <h3 class="m0 bm16 text-title">{{::title | translate}}</h3>\n' +
    '            <div ng-show="deletedTitle" class="bp16 tp8 text-subhead1 divider-bottom">\n' +
    '                <md-checkbox ng-model="deleted" aria-label="CHECKBOX" class="m0">{{::deletedTitle | translate}}</md-checkbox>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="pip-content">\n' +
    '            <md-radio-group ng-model="selectedOptionName" class="pip-list md-primary" md-no-ink="true"\n' +
    '                            ng-keypress="onKeyPress($event)" tabindex="0">\n' +
    '                <div ng-repeat="option in options" class="pip-list-item p0" md-ink-ripple\n' +
    '                     ui-event="{ click: \'onOptionSelect($event, option)\' }"\n' +
    '                     ng-class="{ selected: option.name == selectedOptionName }">\n' +
    '                    <div class="pip-list-item">\n' +
    '                        <md-icon class="pip-option-icon rm12" md-svg-icon="icons:{{option.icon}}" ng-if="option.icon">\n' +
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
    '    <md-dialog-content class="pip-body p0 pip-scroll" ng-class="{\'bp24\': !noActions}">\n' +
    '        <div class="pip-header" ng-class="{\'header-hint\': noTitle && hint}">\n' +
    '            <h3 class="m0 text-title" ng-if="!noTitle">\n' +
    '                {{::title | translate}}\n' +
    '            </h3>\n' +
    '            <div ng-show="noTitle && hint" class="dialog-hint layout-row layout-align-start-center">\n' +
    '                <div class="w40" flex-fixed>\n' +
    '                    <md-icon md-svg-icon="icons:info-circle-outline"></md-icon>\n' +
    '                </div>\n' +
    '                <div>{{::hint | translate}}</div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="pip-divider" ng-if="!noTitle"></div>\n' +
    '        <div class="pip-content">\n' +
    '            <div class="h8" ng-if="noTitle && hint"></div>\n' +
    '            <md-list class="pip-menu  pip-ref-list w-stretch"\n' +
    '                     pip-selected="optionIndex" index="{{optionIndex }}"\n' +
    '                     pip-select="onSelected($event)">\n' +
    '\n' +
    '                <md-list-item class="pip-ref-list-item pip-selectable layout-row layout-align-start-center"\n' +
    '                              ng-class="{\'selected\' : option.name == selectedOptionName,\n' +
    '                              \'divider-bottom\': $index != options.length - 1}"\n' +
    '                              md-ink-ripple xxxxng-keypress="onKeyPress($event)"\n' +
    '                              ng-keyup="onKeyUp($event, $index)"\n' +
    '                              ng-repeat="option in options" >\n' +
    '\n' +
    '                    <div class="pip-content  line-height-string  max-w100-stretch" ng-click="onOptionSelect($event, option)">\n' +
    '                        <p class="pip-title  rp24-flex" ng-if="option.title" style="margin-bottom: 4px !important;">\n' +
    '                            {{::option.title | translate}}\n' +
    '                        </p>\n' +
    '                        <div class="pip-subtitle  rp24-flex"\n' +
    '                             style="height: inherit"\n' +
    '                             ng-if="option.subtitle">\n' +
    '                            {{::option.subtitle | translate}}\n' +
    '                        </div>\n' +
    '                        <div class="pip-subtitle  rp24-flex"\n' +
    '                             style="height: inherit" ng-if="option.text"\n' +
    '                             pip-translate-html="{{::option.text | translate}}">\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '\n' +
    '                </md-list-item>\n' +
    '\n' +
    '            </md-list>\n' +
    '            <!--\n' +
    '            <md-radio-group ng-model="selectedOptionName" class="pip-list md-primary" md-no-ink="true"\n' +
    '                            ng-keypress="onKeyPress($event)" tabindex="0">\n' +
    '                <div ng-repeat="option in options" class="pip-list-item p0" md-ink-ripple\n' +
    '                     ui-event="{ click: \'onOptionSelect($event, option)\' }"\n' +
    '                     ng-class="{ selected: option.name == selectedOptionName }">\n' +
    '                    <div class="pip-list-item">\n' +
    '\n' +
    '                        <div class="pip-content lp24-flex rp24-flex" flex>\n' +
    '                            <div class="pip-title" ng-if="option.title">\n' +
    '                                {{::option.title | translate}}\n' +
    '                            </div>\n' +
    '                            <div class="pip-subtitle" ng-if="option.subtitle">\n' +
    '                                {{::option.subtitle | translate}}\n' +
    '                            </div>\n' +
    '                            <div class="pip-text" ng-if="option.text">\n' +
    '\n' +
    '                                <span pip-translate-html="{{::option.text | translate}}"/>\n' +
    '                            </div>\n' +
    '                        </div>\n' +
    '\n' +
    '                        <md-radio-button ng-value="option.name" tabindex="-1" class="rm24-flex"\n' +
    '                                         aria-label="{{::option.title | translate}}">\n' +
    '                        </md-radio-button>\n' +
    '                    </div>\n' +
    '\n' +
    '                </div>\n' +
    '            </md-radio-group> -->\n' +
    '        </div>\n' +
    '        <div class="h8" ng-if="noActions"></div>\n' +
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
        ['ngMaterial', 'pipUtils', 'pipTranslate', 'pipDialogs.Templates']);

    /* eslint-disable quote-props */
    thisModule.config(['pipTranslateProvider', function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'CONFIRM_TITLE': 'Confirm'
        });
        pipTranslateProvider.translations('ru', {
            'CONFIRM_TITLE': 'Подтвердите'
        });
    }]);
    /* eslint-enable quote-props */

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
        ['$scope', '$rootScope', '$mdDialog', 'pipTranslate', 'params', function ($scope, $rootScope, $mdDialog, pipTranslate, params) {
            $scope.theme = $rootScope.$theme;
            $scope.title = params.title || 'CONFIRM_TITLE';

            $scope.ok = params.ok || 'OK';
            $scope.cancel = params.cancel || 'CANCEL';

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
 * @file Error details dialog
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve sample in sampler app
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipErrorDetailsDialog',
        ['ngMaterial', 'pipUtils', 'pipTranslate', 'pipDialogs.Templates']);

    /* eslint-disable quote-props */
    thisModule.config(['pipTranslateProvider', function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'ERROR_DETAILS': 'Error details',
            'CODE': 'Code',
            'PATH': 'Path',
            'ERROR': 'Error code',
            'METHOD': 'Method',
            'MESSAGE': 'Message'

        });
        pipTranslateProvider.translations('ru', {
            'ERROR_DETAILS': 'Детали ошибки',
            'CODE': 'Код',
            'PATH': 'Путь',
            'ERROR': 'Код ошибки',
            'METHOD': 'Метод',
            'MESSAGE': 'Сообщение'
        });
    }]);
    /* eslint-enable quote-props */

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
        ['$scope', '$rootScope', '$mdDialog', 'pipTranslate', 'params', function ($scope, $rootScope, $mdDialog, pipTranslate, params) {
            $scope.theme = $rootScope.$theme
            $scope.error = params.error;
            $scope.ok = params.ok || 'OK';
            $scope.cancel = params.cancel || 'CANCEL';

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
        ['ngMaterial', 'pipUtils', 'pipTranslate', 'pipDialogs.Templates']);

    /* eslint-disable quote-props */
    thisModule.config(['pipTranslateProvider', function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'INFORMATION_TITLE': 'Information'
        });
        pipTranslateProvider.translations('ru', {
            'INFORMATION_TITLE': 'Информация'
        });
    }]);
    /* eslint-enable quote-props */

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
        ['$scope', '$rootScope', '$mdDialog', 'pipTranslate', 'params', 'pipUtils', function ($scope, $rootScope, $mdDialog, pipTranslate, params, pipUtils) {
            var content, item;

            $scope.theme = $rootScope.$theme;
            $scope.title = params.title || 'INFORMATION_TITLE';
            content = pipTranslate.translate(params.message);
            if (params.item) {
                item = _.truncate(params.item, 25);
                content = pipUtils.sprintf(content, item);
            }
            $scope.content = content;
            $scope.ok = params.ok || 'OK';

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
        ['ngMaterial', 'pipUtils', 'pipTranslate', 'pipDialogs.Templates']);

    /* eslint-disable quote-props */
    thisModule.config(['pipTranslateProvider', function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'OPTIONS_TITLE': 'Choose Option'
        });
        pipTranslateProvider.translations('ru', {
            'OPTIONS_TITLE': 'Выберите опцию'
        });
    }]);
    /* eslint-enable quote-props */

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
        ['$scope', '$rootScope', '$mdDialog', 'params', function ($scope, $rootScope, $mdDialog, params) {
            $scope.theme = $rootScope.$theme;
            $scope.title = params.title || 'OPTIONS_TITLE';
            $scope.options = params.options;
            $scope.selectedOption = _.find(params.options, {active: true}) || {};
            $scope.selectedOptionName = $scope.selectedOption.name;
            $scope.applyButtonTitle = params.appleButtonTitle || 'SELECT';
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
        ['ngMaterial', 'pipUtils', 'pipTranslate', 'pipDialogs.Templates']);

    /* eslint-disable quote-props */
    thisModule.config(['pipTranslateProvider', function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'OPTIONS_TITLE': 'Choose Option'
        });
        pipTranslateProvider.translations('ru', {
            'OPTIONS_TITLE': 'Выберите опцию'
        });
    }]);
    /* eslint-enable quote-props */

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
        ['$scope', '$rootScope', '$mdDialog', 'params', function ($scope, $rootScope, $mdDialog, params) {
            $scope.theme = $rootScope.$theme;
            $scope.title = params.title || 'OPTIONS_TITLE';
            $scope.options = params.options;
            $scope.noActions = params.noActions || false;
            $scope.noTitle = params.noTitle || false;
            $scope.hint = params.hint || '';
            $scope.selectedOption = _.find(params.options, {active: true}) || {};
            $scope.selectedOptionName = $scope.selectedOption.name;
            $scope.optionIndex = _.findIndex(params.options, $scope.selectedOption);
            $scope.applyButtonTitle = params.applyButtonTitle || 'SELECT';

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



/**
 * @file Registration of navigation WebUI controls
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    angular.module('pipNav', [        
        'pipDropdown',
        'pipTabs',

        'pipAppBar',
        'pipSideNav'
    ]);
    
})();



(function(module) {
try {
  module = angular.module('pipNav.Templates');
} catch (e) {
  module = angular.module('pipNav.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('actions/primary_actions.html',
    '<md-menu md-position-mode="target-right target" ng-repeat="action in config.primaryLocalActions">\n' +
    '    <md-button class="pip-primary-actions-action md-icon-button m0"\n' +
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
    '    <md-button class="md-icon-button m0"\n' +
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
    '            class="{{ config.cssClass }} color-primary-bg">\n' +
    '\n' +
    '    <div class="md-toolbar-tools rp24-flex lp24-flex" ng-if="!searchEnabled">\n' +
    '        <!-- Navigation Icon -->\n' +
    '        <md-button class="md-icon-button flex-fixed p0"\n' +
    '                   ng-if="config.navIconType != \'none\'"\n' +
    '                   ng-class="{ \'pip-third-party\': getParty() && !getUser(\'owner\') }"\n' +
    '                   ng-click="onNavIconClick()"\n' +
    '                   aria-label="menu">\n' +
    '            <!-- Menu icon -->\n' +
    '            <md-icon ng-if="config.navIconType==\'menu\' && (!getParty() || getUser(\'owner\'))"\n' +
    '                md-svg-icon="icons:menu"></md-icon>\n' +
    '            <!-- Party avatar -->\n' +
    '            <!--<pip-avatar ng-if="config.navIconType==\'menu\' && (getParty() && !getUser(\'owner\'))"\n' +
    '                        pip-rebind-avatar="true"\n' +
    '                        pip-rebind="true"\n' +
    '                        pip-image-url="partyAvatarUrl"\n' +
    '                        pip-party-id="getParty(\'id\')" class="pip-face"\n' +
    '                        pip-party-name="getParty(\'name\')">\n' +
    '            </pip-avatar>-->\n' +
    '            <!-- Back icon -->\n' +
    '            <md-icon ng-if="config.navIconType==\'back\'"\n' +
    '                md-svg-icon="icons:arrow-left"></md-icon>\n' +
    '        </md-button>\n' +
    '        \n' +
    '        <!-- Title -->            \n' +
    '        <div class="flex-var text-overflow">\n' +
    '            <!-- Logo -->\n' +
    '            <img class="pip-appbar-logo"\n' +
    '                 ng-click="onLogoState(config.logoState)"\n' +
    '                ng-if="config.titleType == \'logo\'"\n' +
    '                ng-src="{{config.titleLogo}}"/>\n' +
    '                \n' +
    '            <!-- Title --> \n' +
    '            <div ng-if="config.titleType == \'text\'" class="text-overflow pip-appbar-text">\n' +
    '                <!-- Search criteria -->\n' +
    '                <span ng-if="config.searchCriteria"\n' +
    '                    ng-click="onSearchEnable()">{{config.searchCriteria}} -</span>\n' +
    '                <!-- Text title -->\n' +
    '                <span class="text-overflow">{{config.titleText | translate}}</span>\n' +
    '            </div>\n' +
    '\n' +
    '            <!-- Title with or without breadcrumb -->\n' +
    '            <div ng-if="config.titleType==\'breadcrumb\'">\n' +
    '                <div class="hide-xs text-overflow">\n' +
    '                    <!-- Search criteria -->\n' +
    '                    <span ng-if="config.searchCriteria"\n' +
    '                      ng-click="onSearchEnable()">{{config.searchCriteria}} -</span>\n' +
    '                    <!-- Breadcrumb navigation -->\n' +
    '                    <span class="pip-appbar-breadcrumb"\n' +
    '                        ng-repeat-start="item in config.titleBreadcrumb"\n' +
    '                        ng-click="onBreadcrumbClick(item)"\n' +
    '                        ng-init="stepWidth = 100/(config.titleBreadcrumb.length + 1)"\n' +
    '                        ng-style="{\'max-width\': stepWidth + \'%\'}">\n' +
    '                        {{item.title | translate}}\n' +
    '                    </span>\n' +
    '                    <md-icon ng-repeat-end md-svg-icon="icons:chevron-right"></md-icon>\n' +
    '                    <!-- Text title -->\n' +
    '                    <span class="pip-title">{{config.titleText | translate}}</span>\n' +
    '                </div>\n' +
    '\n' +
    '                <!-- Mobile breadcrumb dropdown -->\n' +
    '                <md-menu xmd-offset="0 48" class="hide-gt-xs">\n' +
    '                    <span class="pip-appbar-mobile-breadcrumb layout-row"\n' +
    '                        ng-click="$mdOpenMenu()"\n' +
    '                        md-ink-ripple\n' +
    '                        aria-label="open breadcrumb">\n' +
    '                        <span class="text-overflow">\n' +
    '                            <!-- Search criteria -->\n' +
    '                            <span ng-if="config.searchCriteria"\n' +
    '                                ng-click="onSearchEnable()">{{config.searchCriteria}} -</span>\n' +
    '                            {{config.titleText | translate}}\n' +
    '                        </span>\n' +
    '                        <md-icon class="m0 flex-none" md-svg-icon="icons:triangle-down"></md-icon>\n' +
    '                    </span>\n' +
    '                    <md-menu-content width="3">\n' +
    '                        <md-menu-item  ng-repeat="item in config.titleBreadcrumb" >\n' +
    '                            <md-button ng-click="onBreadcrumbClick(item)"><span>{{item.title | translate}}</span></md-button>\n' +
    '                        </md-menu-item>\n' +
    '                        <md-menu-item  >\n' +
    '                            <md-button><span class="text-grey">{{config.titleText | translate}}</span></md-button>\n' +
    '                        </md-menu-item>\n' +
    '                    </md-menu-content>\n' +
    '                </md-menu>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '\n' +
    '\n' +
    '        <div class="flex-fixed pip-appbar-actions layout-row"\n' +
    '             ng-class="{ \'pip-language-action\': config.actionsType==\'language\' }">\n' +
    '            <!-- Laguage picker -->\n' +
    '            <md-menu ng-if="config.actionsType==\'language\'"\n' +
    '                md-position-mode="target-right target">\n' +
    '                <span class="pip-appbar-language"\n' +
    '                    ng-click="$mdOpenMenu()"\n' +
    '                    aria-label="language selection">\n' +
    '                    {{language() | translate}}\n' +
    '                    <md-icon md-svg-icon="icons:triangle-down"></md-icon>\n' +
    '                </span>\n' +
    '                <md-menu-content width="3">\n' +
    '                    <md-menu-item ng-repeat="lang in config.languages">\n' +
    '                        <md-button ng-click="onLanguageClick(lang)">{{lang | translate}}</md-button>\n' +
    '                    </md-menu-item>\n' +
    '                </md-menu-content>\n' +
    '            </md-menu>\n' +
    '\n' +
    '            <!-- Search toggle -->\n' +
    '            <md-button class="md-icon-button m0"\n' +
    '                       ng-if="config.searchVisible"\n' +
    '                       ng-click="onSearchEnable()"\n' +
    '                       aria-label="open search">\n' +
    '                <!--<md-tooltip>{{::\'APPBAR_SEARCH\' | translate}}</md-tooltip>-->\n' +
    '                <md-icon md-svg-icon="icons:search"></md-icon>\n' +
    '            </md-button>\n' +
    '\n' +
    '            <!-- Actions -->\n' +
    '            <div ng-if="config.actionsType==\'list\'">\n' +
    '\n' +
    '                <!-- Global primary actions -->\n' +
    '                <md-menu md-position-mode="target-right target" ng-repeat="action in config.primaryGlobalActions">\n' +
    '                    <md-button class="pip-appbar-action md-icon-button m0"\n' +
    '                               ng-class="{ \'pip-appbar-hide-sm\': action.hideSmall }"\n' +
    '                               ng-click="onActionClick(action, $mdOpenMenu);"\n' +
    '                               ng-hide="actionHidden(action)"\n' +
    '                               aria-label="{{action.tooltip | translate}}">\n' +
    '                        <!--<md-tooltip ng-if="action.tooltip">{{action.tooltip | translate}}</md-tooltip>-->\n' +
    '                        <div class="pip-appbar-badge color-badge-bg" ng-if="action.count > 0">\n' +
    '                            {{actionCount(action)}}\n' +
    '                        </div>\n' +
    '                        <md-icon md-svg-icon="{{action.icon}}"></md-icon>\n' +
    '                    </md-button>\n' +
    '                    <md-menu-content width="3" ng-show="action.menu">\n' +
    '                        <md-menu-item ng-repeat-start="subAction in action.subActions"\n' +
    '                                      ng-if="!subAction.divider"\n' +
    '                                      ng-hide="actionHidden(subAction)">\n' +
    '                            <md-button ng-hide="subAction.divider"\n' +
    '                                       ng-click="onActionClick(subAction)">\n' +
    '                                {{subAction.title | translate}}\n' +
    '                            </md-button>\n' +
    '                        </md-menu-item>\n' +
    '                        <md-menu-divider ng-if="subAction.divider" ng-repeat-end></md-menu-divider>\n' +
    '                    </md-menu-content>\n' +
    '                </md-menu>\n' +
    '\n' +
    '                <!-- Local primary actions -->\n' +
    '                <md-menu md-position-mode="target-right target" ng-repeat="action in config.primaryLocalActions">\n' +
    '                    <md-button class="pip-appbar-action md-icon-button m0"\n' +
    '                               ng-class="{ \'pip-appbar-hide-sm\': action.hideSmall,\n' +
    '                                            \'pip-appbar-show-sm\': action.showSmall,}"\n' +
    '                               ng-click="onActionClick(action, $mdOpenMenu);"\n' +
    '                               ng-hide="actionHidden(action)"\n' +
    '                               aria-label="{{action.tooltip | translate}}">\n' +
    '                        <!--<md-tooltip ng-if="action.tooltip">{{action.tooltip | translate}}</md-tooltip>-->\n' +
    '                        <div class="pip-appbar-badge" ng-show="action.count > 0">\n' +
    '                            {{actionCount(action)}}\n' +
    '                        </div>\n' +
    '                        <md-icon md-svg-icon="{{action.icon}}"></md-icon>\n' +
    '                    </md-button>\n' +
    '                    <md-menu-content width="3" >\n' +
    '                        <md-menu-item ng-repeat-start="subAction in action.subActions"\n' +
    '                                      ng-if="!subAction.divider"\n' +
    '                                      ng-hide="actionHidden(subAction)">\n' +
    '                            <md-button ng-hide="subAction.divider"\n' +
    '                                       ng-click="onActionClick(subAction)">\n' +
    '                                {{subAction.title | translate}}\n' +
    '                            </md-button>\n' +
    '                        </md-menu-item>\n' +
    '                        <md-menu-divider ng-if="subAction.divider" ng-repeat-end></md-menu-divider>\n' +
    '                    </md-menu-content>\n' +
    '                </md-menu>\n' +
    '\n' +
    '                <!-- Secondary actions dropdown -->\n' +
    '                <md-menu ng-if="secondaryActionsVisible()"\n' +
    '                    md-position-mode="target-right target">\n' +
    '                    <md-button class="md-icon-button m0"\n' +
    '                        ng-click="onSecondaryActionClick(); openMenu($mdOpenMenu, $event);"\n' +
    '                        aria-label="open actions">\n' +
    '                        <md-icon md-svg-icon="icons:vdots"></md-icon>\n' +
    '                    </md-button>\n' +
    '                    <md-menu-content width="3">\n' +
    '                        <!-- Local secondary actions -->\n' +
    '                        <md-menu-item ng-repeat-start="action in config.secondaryLocalActions"\n' +
    '                            ng-if="!action.divider"\n' +
    '                            ng-hide="actionHidden(action)">\n' +
    '                            <md-button ng-hide="action.divider"\n' +
    '                                ng-click="onActionClick(action)">\n' +
    '                                {{action.title | translate}}\n' +
    '                            </md-button>\n' +
    '                        </md-menu-item>\n' +
    '                        <md-menu-divider ng-if="action.divider" ng-repeat-end></md-menu-divider>\n' +
    '\n' +
    '                        <md-menu-divider ng-if="secondaryDividerVisible()" >\n' +
    '\n' +
    '                        </md-menu-divider>\n' +
    '                        <!-- Global secondary actions -->\n' +
    '                        <md-menu-item ng-repeat-start="action in config.secondaryGlobalActions"\n' +
    '                            ng-if="!action.divider"\n' +
    '                            ng-hide="actionHidden(action)">\n' +
    '                            <md-button ng-hide="action.divider"\n' +
    '                                ng-click="onActionClick(action)">\n' +
    '                                {{action.title | translate}}\n' +
    '                            </md-button>                    \n' +
    '                        </md-menu-item>\n' +
    '                        <md-menu-divider ng-if="action.divider" ng-repeat-end>\n' +
    '                        </md-menu-divider>                        \n' +
    '                    </md-menu-content>\n' +
    '                </md-menu>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="md-toolbar-tools layout-row" ng-if="searchEnabled">\n' +
    '        <md-button class="md-icon-button" \n' +
    '            aria-label="start search" \n' +
    '            ng-click="onSearchClick()">\n' +
    '            <md-icon md-svg-icon="icons:search"></md-icon>\n' +
    '        </md-button>\n' +
    '        <input class="pip-search-text flex"\n' +
    '            type="search"\n' +
    '            ng-model="search.text" \n' +
    '            ng-keydown="onSearchKeyDown($event)" />\n' +
    '        <md-button class="md-icon-button" \n' +
    '            aria-label="clear search" \n' +
    '            ng-click="onSearchClear()">\n' +
    '            <md-icon md-svg-icon="icons:cross-circle"></md-icon>\n' +
    '        </md-button>\n' +
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
  $templateCache.put('breadcrumb/breadcrumb.html',
    '<div>\n' +
    '    <div class="hide-xs text-overflow">\n' +
    '        <!-- Search criteria -->\n' +
    '        <span ng-if="config.criteria"\n' +
    '            ng-click="onSearchEnable()">{{config.criteria}} -</span>\n' +
    '        <!-- Breadcrumb navigation -->\n' +
    '        <span class="pip-breadcrumb-item"\n' +
    '            ng-repeat-start="item in config.titleBreadcrumb"\n' +
    '            ng-click="onBreadcrumbClick(item)"\n' +
    '            ng-init="stepWidth = 100/(config.titleBreadcrumb.length + 1)"\n' +
    '            ng-style="{\'max-width\': stepWidth + \'%\'}">\n' +
    '            {{item.title | translate}}\n' +
    '        </span>\n' +
    '        <md-icon ng-repeat-end md-svg-icon="icons:chevron-right"></md-icon>\n' +
    '        <!-- Text title -->\n' +
    '        <span class="pip-title">{{config.text | translate}}</span>\n' +
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
    '                <span ng-if="config.criteria"\n' +
    '                    ng-click="onSearchEnable()">{{config.criteria}} -</span>\n' +
    '                {{config.text | translate}}\n' +
    '            </span>\n' +
    '            <md-icon class="m0 flex-none" md-svg-icon="icons:triangle-down"></md-icon>\n' +
    '        </span>\n' +
    '        <md-menu-content width="3">\n' +
    '            <md-menu-item  ng-repeat="item in config.items" >\n' +
    '                <md-button ng-click="onBreadcrumbClick(item)"><span>{{item.title | translate}}</span></md-button>\n' +
    '            </md-menu-item>\n' +
    '            <md-menu-item  >\n' +
    '                <md-button><span class="text-grey">{{config.text | translate}}</span></md-button>\n' +
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
    '<md-content class="md-subhead color-primary-bg {{class}}" ng-if="show()" ng-class="{\'md-whiteframe-3dp\': $mdMedia(\'xs\')}">\n' +
    '    <div class="pip-divider position-top m0"></div>\n' +
    '        <md-select ng-model="selectedIndex" ng-disabled="disabled()" md-container-class="pip-full-width-dropdown" aria-label="DROPDOWN" md-ink-ripple md-on-close="onSelect(selectedIndex)">\n' +
    '            <md-option ng-repeat="action in actions" value="{{ ::$index }}" ng-selected="activeIndex == $index ? true : false">\n' +
    '                {{ (action.title || action.name) | translate }}\n' +
    '            </md-option>\n' +
    '        </md-select>\n' +
    '</md-content>');
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
    '        <md-menu-item ng-repeat="lang in config.languages">\n' +
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
    '<md-toolbar md-theme="{{ $theme }}" ng-hide="user">\n' +
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
    '<md-button class="md-icon-button flex-fixed p0"\n' +
    '            ng-if="config.type != \'none\'"\n' +
    '            ng-class="config.class"\n' +
    '            ng-click="onNavIconClick()"\n' +
    '            aria-label="menu">\n' +
    '    <!-- Menu icon -->\n' +
    '    <md-icon ng-if="config.type==\'menu\'"\n' +
    '        md-svg-icon="icons:menu"></md-icon>\n' +
    '    <!-- Image -->\n' +
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
    '    md-component-id="pip-sidenav" \n' +
    '    ng-if="!$partialReset" \n' +
    '    pip-focused>\n' +
    '\n' +
    '    <md-toolbar class="pip-sidenav-header"\n' +
    '                ng-class="{\'pip-sidenav-owner\': getUser(\'owner\')}"\n' +
    '                md-theme="{{ $theme|| getUser(\'theme\') || config.theme }}"\n' +
    '                ng-hide="!getParty() && !primaryPartyAvatar && !secondaryPartyAvatar">\n' +
    '\n' +
    '            <md-button class="pip-sidenav-party md-icon-button"\n' +
    '                       ng-click="onPartyClick()"\n' +
    '                       aria-label="current party">\n' +
    '                <!--<pip-avatar ng-if="!$avatarReset"\n' +
    '                            pip-party-id="getParty(\'id\')"\n' +
    '                            pip-default-icon="icon-person"\n' +
    '                            pip-party-name="getParty(\'name\')"\n' +
    '                            pip-image-url="primaryPartyAvatar"\n' +
    '                            pip-rebind-avatar="true"\n' +
    '                            pip-rebind="true">\n' +
    '                </pip-avatar>-->\n' +
    '            </md-button>\n' +
    '\n' +
    '            <md-button class="pip-sidenav-user md-icon-button"\n' +
    '                       ng-click="onUserClick()"\n' +
    '                       ng-hide="getUser(\'owner\')"\n' +
    '                       aria-label="current user">\n' +
    '                <!--<pip-avatar class="pic-pic pip-face-ld"\n' +
    '                            ng-if="!$avatarReset"\n' +
    '                            pip-default-icon="icon-person"\n' +
    '                            pip-rebind="true"\n' +
    '                            pip-rebind-avatar="true"\n' +
    '                            pip-party-id="getUser(\'id\')"\n' +
    '                            pip-party-name="getUser(\'name\')"\n' +
    '                            pip-image-url="secondaryPartyAvatar">\n' +
    '                </pip-avatar>-->\n' +
    '            </md-button>\n' +
    '        \n' +
    '        <div class="pip-sidenav-party-text">\n' +
    '            <a class="pip-sidenav-party-pri cursor-pointer"\n' +
    '                ng-click="onPartyClick()">{{ partyName || getParty(\'name\')}}</a>\n' +
    '            <div class="pip-sidenav-party-sec"\n' +
    '                ng-show="getConnection() && !getUser(\'owner\')">\n' +
    '                {{getConnection(\'relation\') | translate}}\n' +
    '                <span ng-show="getConnection(\'relation_since\')">\n' +
    '                    {{::\'SIDENAV_SINCE\' | translate}}\n' +
    '                    {{getConnection(\'relation_since\') | formatLongDate}}\n' +
    '                </span>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </md-toolbar>\n' +
    '\n' +
    '    <md-list>\n' +
    '        <div class="pip-section" ng-repeat="section in config.sections"\n' +
    '            ng-hide="section.access && !section.access(getParty(), getUser(), section)">\n' +
    '            \n' +
    '            <md-divider ng-show="$index > 0 && !isSectionEmpty(section.links)"></md-divider>\n' +
    '            <md-subheader ng-show="section.title">{{::section.title | translate}}</md-subheader>\n' +
    '            \n' +
    '            <md-list-item class="pip-focusable no-border" \n' +
    '                ng-repeat="link in section.links"\n' +
    '                ng-click="onLinkClick($event, link)"\n' +
    '                ng-hide="link.access && !link.access(getParty(), getUser(), link)">\n' +
    '                <md-icon md-svg-icon="{{link.icon}}" \n' +
    '                    ng-hide="!link.icon" \n' +
    '                    class="tm0 bm0"></md-icon>\n' +
    '                <p>{{::link.title | translate}}</p>\n' +
    '            </md-list-item>\n' +
    '        </div>\n' +
    '    </md-list>\n' +
    '\n' +
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
    '    <md-tabs ng-if="$mdMedia(\'gt-xs\')" md-selected="activeTab" ng-class="{\'disabled\': disabled()}" md-stretch-tabs="true" md-dynamic-height="true">\n' +
    '        <md-tab ng-repeat="tab in tabs track by $index"  ng-disabled="tabDisabled($index)" md-on-select="onSelect($index)">\n' +
    '            <md-tab-label>\n' +
    '                {{ ::tab.nameLocal }}\n' +
    '                <div class="pip-tabs-badge color-badge-bg" ng-if="tab.newCounts > 0 && tab.newCounts <= 99">{{ ::tab.newCounts }}</div>\n' +
    '                <div class="pip-tabs-badge color-badge-bg" ng-if="tab.newCounts > 99">!</div>\n' +
    '            </md-tab-label>\n' +
    '        </md-tab>\n' +
    '    </md-tabs>\n' +
    '    <md-content class="md-subhead color-primary-bg md-hue-1 " ng-if="$mdMedia(\'xs\')">\n' +
    '        <div class="pip-divider position-top m0"></div>\n' +
    '        <md-select ng-model="activeIndex" ng-disabled="disabled()"\n' +
    '                   md-container-class="pip-full-width-dropdown" aria-label="SELECT" md-ink-ripple md-on-close="onSelect(activeIndex)">\n' +
    '            <md-option ng-repeat="tab in tabs track by $index" value="{{ ::$index }}" >\n' +
    '                {{ ::tab.nameLocal }}\n' +
    '                <div class="pip-tabs-badge color-badge-bg" ng-if="tab.newCounts > 0 && tab.newCounts <= 99">{{ ::tab.newCounts }}</div>\n' +
    '                <div class="pip-tabs-badge color-badge-bg" ng-if="tab.newCounts > 99">!</div>\n' +
    '            </md-option>\n' +
    '        </md-select>\n' +
    '    </md-content>\n' +
    '</md-toolbar>\n' +
    '');
}]);
})();

/**
 * @file Application Actions service
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipActions.Service', []);

    thisModule.provider('pipActions', function () {
        var config = {
            // Primary global actions visible on the screen
            primaryGlobalActions: [],
            // Primary local actions visible on the screen
            primaryLocalActions: [],

            // Secondary global actions available in popup
            secondaryGlobalActions: [],
            // Secondary local actions available in popup
            secondaryLocalActions: []
        };

        // Configure global parameters
        this.globalActions = globalActions;
        this.globalPrimaryActions = globalPrimaryActions;
        this.globalSecondaryActions = globalSecondaryActions;

        // Get the service instance
        this.$get = ['$rootScope', function ($rootScope) {
            return {
                config: getConfig,
                
                showLocalActions: showLocalActions,
                hideLocalActions: hideLocalActions,
                updateActionCount: updateActionCount,
            };

            // ----------------------

            function getConfig() {
                return config;
            }

            // Show actions
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

            // Todo: Why do we need that?
            function updateActionCount(actionName, count) {
                // Update global actions
                _.each(config.primaryGlobalActions, function (action) {
                    if (action.name === actionName) {
                        action.count = count;
                    }
                });
                // Update local action
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

})(window.angular, window._);

/**
 * @file Application Primary Actions component
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, $) {
    'use strict';

    var thisModule = angular.module('pipPrimaryActions',
        ['ngMaterial', 'pipTranslate', 'pipNav.Templates', 'pipActions.Service']);

    // Main application header directive
    thisModule.directive('pipPrimaryActions', function () {
        return {
            restrict: 'E',
            scope: {
                localActions: '=pipLocalActions',
                globalActions: '=pipGlobalActions'
            },
            replace: false,
            templateUrl: function (element, attr) {
                return 'primary_actions/primary_actions.html';
            },
            controller: 'pipPrimaryActionsController'
        };
    });

    thisModule.controller('pipPrimaryActionsController',
        ['$scope', '$element', '$attrs', '$rootScope', '$window', '$state', '$location', 'pipActions', function ($scope, $element, $attrs, $rootScope, $window, $state, $location, pipActions) {
            // Apply class and call resize
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
                    $state.go(action.state, action.stateParams);
                    return;
                }

                if (action.event) {
                    $rootScope.$broadcast(action.event);
                } else {
                    // Otherwise raise notification
                    $rootScope.$broadcast('pipActionClicked', action.name);
                }
            }

        }]
    );

})(window.angular, window._, window.jQuery);

/**
 * @file Application Secondary Actions component
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, $) {
    'use strict';

    var thisModule = angular.module('pipSecondaryActions',
        ['ngMaterial', 'pipTranslate', 'pipNav.Templates', 'pipActions.Service']);

    // Main application header directive
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
                return 'secondary_actions/secondary_actions.html';
            },
            controller: 'pipSecondaryActionsController'
        };
    });

    thisModule.controller('pipSecondaryActionsController',
        ['$scope', '$element', '$attrs', '$rootScope', '$window', '$state', '$location', 'pipTranslate', 'pipActions', function ($scope, $element, $attrs, $rootScope, $window, $state, $location, pipTranslate, pipActions) {
            // Apply class and call resize
            $element.addClass('pip-secondary-actions');

            $scope.config = pipActions.config();

            if ($scope.localActions) {
                pipSecondaryActions.showLocalActions();
                $scope.config.secondaryLocalActions = $scope.localActions[1];
            }

            if ($scope.globalActions) {
                pipSecondaryActions.showLocalActions();
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
                    $state.go(action.state, action.stateParams);
                    return;
                }

                if (action.event) {
                    $rootScope.$broadcast(action.event);
                } else {
                    // Otherwise raise notification
                    $rootScope.$broadcast('pipActionClicked', action.name);
                }
            }

        }]
    );

})(window.angular, window._, window.jQuery);

/**
 * @file Application App Bar component
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, $) {
    'use strict';

    var thisModule = angular.module('pipAppBar',
        ['ngMaterial', 'pipTranslate', 'pipNav.Templates', 'pipAppBar.Service']);

    thisModule.config(['pipTranslateProvider', function (pipTranslateProvider) {

        pipTranslateProvider.translations('en', {
            'APPBAR_SEARCH': 'Search'
        });

        pipTranslateProvider.translations('ru', {
            'APPBAR_SEARCH': 'Поиск'
        });

    }]);

    // Main application header directive
    thisModule.directive('pipAppbar', function () {
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
                return 'appbar/appbar.html';
            },
            controller: 'pipAppBarController'
        };
    });

    thisModule.controller('pipAppBarController',
        ['$scope', '$element', '$attrs', '$rootScope', '$window', '$state', '$location', 'pipTranslate', 'pipAppBar', function ($scope, $element, $attrs, $rootScope, $window, $state, $location, pipTranslate, pipAppBar) {
            // Initialize default application title
            if ($scope.title) {
                pipAppBar.showTitleText($scope.title);
            }
            if ($scope.showMenu) {
                pipAppBar.showMenuNavIcon();
            }
            // Apply class and call resize
            $element.addClass('pip-appbar');
            $scope.$emit('pipResizeWindow');

            $scope.config = pipAppBar.config();

            if ($scope.localActions) {
                pipAppBar.showLocalActions();
                $scope.config.primaryLocalActions = $scope.localActions[0];
                $scope.config.secondaryLocalActions = $scope.localActions[1];
            }

            if ($scope.globalActions) {
                pipAppBar.showLocalActions();
                $scope.config.primaryGlobalActions = $scope.globalActions[0];
                $scope.config.secondaryGlobalActions = $scope.globalActions[0];
            }

            $scope.searchEnabled = false;
            $scope.search = {text: ''};

            $rootScope.$on('pipAppBarChanged', onAppBarChanged);

            $scope.language = getLanguage;
            $scope.actionHidden = actionHidden;
            $scope.actionCount = actionCount;
            $scope.secondaryActionsVisible = secondaryActionsVisible;
            $scope.secondaryDividerVisible = secondaryDividerVisible;

            $scope.onNavIconClick = onNavIconClick;
            $scope.onBreadcrumbClick = onBreadcrumbClick;
            $scope.onLanguageClick = onLanguageClick;
            $scope.onActionClick = onActionClick;

            $scope.onSearchEnable = onSearchEnable;
            $scope.onSearchClick = onSearchClick;
            $scope.onSearchClear = onSearchClear;
            $scope.onSearchKeyDown = onSearchKeyDown;
            $scope.onLogoState = onLogoState;

            $scope.getParty = getParty;
            $scope.getUser = getUser;

            $scope.openMenu = openMenu;

            function onLogoState(state) {
                if(state)
                $state.go(state);
            }
            
            function openMenu($mdOpenMenu, ev) {
                $scope.originatorEv = ev;
                $mdOpenMenu(ev);
            }

            function getParty(prop) {
                if (!$rootScope.$party) {
                    return;
                }
                if (prop) {
                    return $rootScope.$party[prop];
                }

                return $rootScope.$party;
            }

            function getUser(prop) {
                if (!$rootScope.$user) {
                    return;
                }
                if (prop) {
                    return $rootScope.$user[prop];
                }

                return $rootScope.$user;
            }

            function onAppBarChanged(event, config) {
                $scope.config = config;
                $scope.searchEnabled = false;
                $scope.search.text = '';
            }

            function getLanguage() {
                return pipTranslate.use();
            }

            function actionHidden(action) {
                return action.access && !action.access($rootScope.$party, $rootScope.$user, action);
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

            function onNavIconClick() {
                var breadcrumb, backCallback;

                if (_.isFunction($scope.config.navIconCallback)) {
                    // Execute nav icon callback
                    $scope.config.navIconCallback();

                    return;
                }
                if ($scope.config.navIconType !== 'back') {
                    // Raise an event
                    $rootScope.$broadcast('pipAppBarNavIconClicked');

                    return;
                }
                if ($scope.config.titleType === 'breadcrumb') {
                    breadcrumb = $scope.config.titleBreadcrumb;
                    // Go to the last breadcrumb item
                    if (_.isArray(breadcrumb) && breadcrumb.length > 0) {
                        backCallback = breadcrumb[breadcrumb.length - 1].click;
                        if (_.isFunction(backCallback)) {
                            backCallback();
                        } else {
                            $window.history.back();
                        }
                    } else {
                        $window.history.back();
                    }
                } else {
                    // Go back in history
                    $window.history.back();
                }
            }

            function onBreadcrumbClick(item) {
                if (_.isFunction(item.click)) {
                    item.click(item);
                }
            }

            function onLanguageClick(language) {
                setTimeout(function () {
                    pipTranslate.use(language);
                    $rootScope.$apply();
                }, 0);
            }

            function processStateParams(params) {
                var result = {}, prop;

                if (params === null) {
                    return null;
                }
                for (prop in params) {
                    if (params.hasOwnProperty(prop)) {
                        if (params[prop] === ':party_id') {
                            result[prop] = $rootScope.$party ? $rootScope.$party.id : null;
                        } else if (params[prop] === ':user_id') {
                            result[prop] = $rootScope.$user ? $rootScope.$user.id : null;
                        } else {
                            result[prop] = params[prop];
                        }
                    }
                }

                return result;
            }

            function processUrlParams(url) {
                var result;

                if (url === null) {
                    return null;
                }
                result = url.replace(':party_id', $rootScope.$party ? $rootScope.$party.id : '');
                result = result.replace(':user_id', $rootScope.user ? $rootScope.$user.id : '');

                return result;
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
                    $window.location.href = processUrlParams(action.href);

                    return;
                }
                if (action.url) {
                    $location.url(processUrlParams(action.url));

                    return;
                }
                if (action.state) {
                    $state.go(action.state, processStateParams(action.stateParams));

                    return;
                }
                if (action.event) {
                    $rootScope.$broadcast(action.event);
                } else {
                    // Otherwise raise notification
                    $rootScope.$broadcast('pipAppBarActionClicked', action.name);
                }
            }

            function onSearchEnable() {
                $scope.search.text = $scope.config.searchCriteria;
                $scope.searchEnabled = true;
                focusSearchText();
            }

            function onSearchClick() {
                var searchText = $scope.search.text;

                $scope.search.text = '';
                $scope.searchEnabled = false;

                if ($scope.config.searchCallback) {
                    $scope.config.searchCallback(searchText);
                } else {
                    $rootScope.$broadcast('pipAppBarSearchClicked', searchText);
                }
            }

            function onSearchClear() {
                if ($scope.search.text) {
                    $scope.search.text = '';

                    focusSearchText();
                } else {
                    $scope.searchEnabled = false;
                    onSearchClick();
                }
            }

            function onSearchKeyDown(event) {
                // Enter pressed
                if (event.keyCode === 13) {
                    $scope.onSearchClick();

                    return;
                }
                // ESC pressed
                if (event.keyCode === 27) {
                    $scope.searchEnabled = false;
                }
            }
        }]
    );

})(window.angular, window._, window.jQuery);

/**
 * @file Application App Bar service
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipAppBar.Service', []);

    thisModule.provider('pipAppBar', function () {
        var config = {
            appTitleText: null,
            appTitleLogo: 'images/piplife_logo.svg',

            // Theme to be applied to the header
            theme: 'blue',
            cssClass: '',
            ngClasses: {},
            logoState: null,

            // Type of nav icon: 'back', 'menu' or 'none'
            navIconType: 'none',
            // Handle nav icon click event
            navIconCallback: false,

            // Type of title: 'logo', 'text', 'breadcrumb' or 'none'
            titleType: 'none',
            // URL to logo
            titleLogo: null,
            // Title text
            titleText: null,
            // Navigation breadcrumb [{ title, click }],
            titleBreadcrumb: null,

            // Type of actions: 'language', 'list' or 'none'
            actionsType: 'none',

            // Language options
            languages: ['en', 'ru'],

            // Search visible
            searchVisible: false,
            // Search criteria
            searchCriteria: '',
            // History for search autocomplete
            searchHistory: [],
            // Callback for search
            searchCallback: null,

            // Primary global actions visible on the screen
            primaryGlobalActions: [],
            // Primary local actions visible on the screen
            primaryLocalActions: [],

            // Secondary global actions available in popup
            secondaryGlobalActions: [],
            // Secondary local actions available in popup
            secondaryLocalActions: []
        };

        // Configure global parameters
        this.appTitleText = appTitleText;
        this.appTitleLogo = appTitleLogo;
        this.theme = theme;
        this.globalActions = globalActions;
        this.globalPrimaryActions = globalPrimaryActions;
        this.globalSecondaryActions = globalSecondaryActions;

        // Get the service instance
        this.$get = ['$rootScope', function ($rootScope) {
            return {
                config: getConfig,
                cssClass: cssClass,
                
                logoState:logoState,
                setLogoState: setLogoState,

                hideNavIcon: hideNavIcon,
                showMenuNavIcon: showMenuNavIcon,
                showBackNavIcon: showBackNavIcon,

                showAppTitleLogo: showAppTitleLogo,
                showAppTitleText: showAppTitleText,
                showTitleLogo: showTitleLogo,
                showTitleText: showTitleText,
                showTitleBreadcrumb: showTitleBreadcrumb,
                hideTitle: hideTitle,

                showLanguage: showLanguage,
                showLocalActions: showLocalActions,
                hideLocalActions: hideLocalActions,
                updateActionCount: updateActionCount,

                showSearch: showSearch,
                hideSearch: hideSearch,
                updateSearchCriteria: updateSearchCriteria,
                updateSearchHistory: updateSearchHistory,

                showShadow: showShadow,
                showShadowSm: showShadowSm,
                showShadowSmXs: showShadowSmXs,
                hideShadow: hideShadow
            };
            // ----------------------

            function setLogoState(logoState) {
                config.logoState = logoState;
                return config.logoState;
            }
            
            function logoState() {
                return config.logoState;
            }
            
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

            // Show, hide appbar shadow
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

            // Show navigation icon
            function hideNavIcon() {
                config.navIconType = 'none';
                config.navIconCallback = null;
                sendConfigEvent();
            }

            function showMenuNavIcon(click) {
                config.navIconType = 'menu';
                config.navIconCallback = click;
                sendConfigEvent();
            }

            function showBackNavIcon(click) {
                config.navIconType = 'back';
                config.navIconCallback = click;

                sendConfigEvent();
            }

            // Show title
            function hideTitle() {
                config.titleType = 'none';
                config.titleLogo = null;
                config.titleText = null;
                config.titleBreadcrumb = null;

                sendConfigEvent();
            }

            function showTitleLogo(titleLogo) {
                config.titleType = 'logo';
                config.titleLogo = titleLogo;
                config.titleText = null;
                config.titleBreadcrumb = null;

                sendConfigEvent();
            }

            function showTitleText(titleText) {
                config.titleType = 'text';
                config.titleLogo = null;
                config.titleText = titleText;
                config.titleBreadcrumb = null;

                sendConfigEvent();
            }

            function showTitleBreadcrumb(titleText, titleBreadcrumb) {
                if (_.isArray(titleText)) {
                    titleBreadcrumb = titleText;
                    titleText = titleBreadcrumb[titleBreadcrumb.length - 1].title;
                    titleBreadcrumb.splice(titleBreadcrumb.length - 1, 1);
                }
                config.titleType = 'breadcrumb';
                config.titleLogo = null;
                config.titleText = titleText;
                config.titleBreadcrumb = titleBreadcrumb;
                if (titleBreadcrumb.length > 0) {
                    config.navIconType = config.navIconType === 'none' ? 'none' : config.navIconType;
                    config.navIconCallback = titleBreadcrumb[titleBreadcrumb.length - 1];
                } else {
                    config.navIconType = 'menu';
                    config.navIconCallback = null;
                }

                sendConfigEvent();
            }

            function showAppTitleLogo() {
                showTitleLogo(config.appTitleLogo);
            }

            function showAppTitleText() {
                showTitleText(config.appTitleText);
            }

            // Show actions
            function hideLocalActions() {
                config.actionsType = 'none';
                config.primaryLocalActions = [];
                config.secondaryLocalActions = [];

                sendConfigEvent();
            }

            function showLanguage(languages) {
                config.actionsType = 'language';
                config.languages = languages || config.languages;

                sendConfigEvent();
            }

            function showLocalActions(primaryActions, secondaryActions) {
                config.actionsType = 'list';
                config.primaryLocalActions = primaryActions || [];
                config.secondaryLocalActions = secondaryActions || [];

                sendConfigEvent();
            }

            function updateActionCount(actionName, count) {
                // Update global actions
                _.each(config.primaryGlobalActions, function (action) {
                    if (action.name === actionName) {
                        action.count = count;
                    }
                });
                // Update local action
                _.each(config.primaryLocalActions, function (action) {
                    if (action.name === actionName) {
                        action.count = count;
                    }
                });
                sendConfigEvent();
            }

            // Show actions
            function showSearch(callback, criteria, history) {
                config.searchVisible = true;
                config.searchCallback = callback;
                config.searchCriteria = criteria;
                config.searchHistory = history;

                sendConfigEvent();
            }

            function hideSearch() {
                config.searchVisible = false;
                config.searchCallback = null;
                config.searchCriteria = null;

                sendConfigEvent();
            }

            function updateSearchCriteria(criteria) {
                config.searchCriteria = criteria;
                sendConfigEvent();
            }

            function updateSearchHistory(history) {
                config.searchHistory = history;
                sendConfigEvent();
            }

            function sendConfigEvent() {
                $rootScope.$broadcast('pipAppBarChanged', config);
            }
        }];
        function appTitleText(newTitleText) {
            if (newTitleText) {
                config.appTitleText = newTitleText;
            }

            return config.appTitleText;
        }

        function appTitleLogo(newTitleLogo) {
            if (newTitleLogo) {
                config.appTitleLogo = newTitleLogo;
            }

            return config.appTitleLogo;
        }

        function theme(theme) {
            config.theme = theme || config.theme;

            return config.theme;
        }

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

})(window.angular, window._);

/**
 * @file Breadcrumb component
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, $) {
    'use strict';

    var thisModule = angular.module('pipBreadcrumb',
        ['ngMaterial', 'pipTranslate', 'pipNav.Templates', 'pipBreadcrumb.Service']);

    // Main application header directive
    thisModule.directive('pipBreadcrumb', function () {
        return {
            restrict: 'E',
            scope: {},
            replace: false,
            templateUrl: function (element, attr) {
                return 'breadcrumb/breadcrumb.html';
            },
            controller: 'pipBreadcrumbController'
        };
    });

    thisModule.controller('pipBreadcrumbController',
        ['$scope', '$element', '$attrs', '$rootScope', '$window', '$state', '$location', 'pipBreadcrumb', function ($scope, $element, $attrs, $rootScope, $window, $state, $location, pipBreadcrumb) {
            // Apply class and call resize
            $element.addClass('pip-breadcrumb');

            $scope.config = pipBreadcrumb.config();

            $rootScope.$on('pipBreadcrumbChanged', onBreadcrumbChanged);
            $rootScope.$on('pipBreadcrumbBack', onBreadcrumbBack);

            $scope.onBreadcrumbClick = onBreadcrumbClick;

            function onBreadcrumbChanged(event, config) {
                $scope.config = config;
            }

            function onBreadcrumbBack() {
                var items, backCallback;

                items = $scope.config.items;
                // Go to the last breadcrumb item
                if (_.isArray(items) && items.length > 0) {
                    backCallback = items[items.length - 1].click;
                    if (_.isFunction(backCallback)) {
                        backCallback();
                    } else {
                        $window.history.back();
                    }
                } else {
                    $window.history.back();
                }
            }

            function onBreadcrumbClick(item) {
                if (_.isFunction(item.click)) {
                    item.click(item);
                }
            }

            function onSearchEnable() {
                $rootScope.$broadcast('pipSearchOpen');
            }

        }]
    );

})(window.angular, window._, window.jQuery);

/**
 * @file Breadcrumb service
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipBreadcrumb.Service', []);

    thisModule.provider('pipBreadcrumb', function () {
        var config = {
            // Title text
            text: null,
            // Navigation items [{ title, click }],
            items: null,
            // Search criteria
            criteria: '',
        };

        // Get the service instance
        this.$get = ['$rootScope', function ($rootScope) {
            return {
                config: getConfig,

                text: setText,
                path: setItems,
                items: setItems,

                criteria: setCriteria
            };

            // ----------------------

            function getConfig() {
                return config;
            }

            function setText(text) {
                config.text = text;
                config.items = null;
                
                sendConfigEvent();
            }

            function setItems(text, items) {
                if (_.isArray(text)) {
                    items = text;
                    text = items[items.length - 1].title;
                    items.splice(items.length - 1, 1);
                }
                config.text = text;
                config.items = items;

                // if (items.length > 0) {
                //     config.navIconType = config.navIconType === 'none' ? 'none' : config.navIconType;
                //     config.navIconCallback = items[items.length - 1];
                // } else {
                //     config.navIconType = 'menu';
                //     config.navIconCallback = null;
                // }

                sendConfigEvent();
            }

            function setCriteria(criteria) {
                config.criteria = criteria;
                sendConfigEvent();
            }

            function sendConfigEvent() {
                $rootScope.$broadcast('pipBreadcrumbChanged', config);
            }
        }];
        
    });

})(window.angular, window._);

/**
 * @file Dropdown control
 * @copyright Digital Living Software Corp. 2014-2016
 *
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipDropdown", ['pipAssert', 'pipNav.Templates']);

    thisModule.directive('pipDropdown',
        ['$mdMedia', 'pipAssert', function ($mdMedia, pipAssert) {
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
                controller:
                    ['$scope', '$element', '$attrs', 'localStorageService', function ($scope, $element, $attrs, localStorageService) {
                        $scope.class = ($attrs.class || '') + ' md-' + localStorageService.get('theme') + '-theme';
                        pipAssert.isArray($scope.actions, 'pipDropdown: pip-actions attribute should take an array, but take ' + typeof $scope.actions);
                        $scope.$mdMedia = $mdMedia;
                        $scope.actions = ($scope.actions && _.isArray($scope.actions)) ? $scope.actions : [];
                        $scope.activeIndex = $scope.activeIndex || 0;

                        $scope.disabled = function () {
                            if ($scope.ngDisabled()) {
                                return $scope.ngDisabled();
                            } else {
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
                            } else {
                                return true;
                            }
                        };

                    }]
            };
        }]
    );

})();

/**
 * @file Application Language Picker component
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, $) {
    'use strict';

    var thisModule = angular.module('pipLanguagePicker',
        ['ngMaterial', 'pipTranslate', 'pipNav.Templates']);

    // Main application header directive
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

    thisModule.controller('pipLanguagePickerController',
        ['$scope', '$element', '$attrs', '$rootScope', '$window', '$state', '$location', 'pipTranslate', function ($scope, $element, $attrs, $rootScope, $window, $state, $location, pipTranslate) {
            // Initialize default application title
            if ($scope.title) {
                pipLanguagePicker.showTitleText($scope.title);
            }
            if ($scope.showMenu) {
                pipLanguagePicker.showMenuNavIcon();
            }
            // Apply class and call resize
            $element.addClass('pip-language-picker');

            $scope.language = getLanguage;
            $scope.onLanguageClick = onLanguageClick;

            function getLanguage() {
                return pipTranslate.use();
            }

            function onLanguageClick(language) {
                setTimeout(function () {
                    pipTranslate.use(language);
                    $rootScope.$apply();
                }, 0);
            }

        }]
    );

})(window.angular, window._, window.jQuery);

/**
 * @file Application Nav Header component
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipNavHeader', 
        ['ngMaterial', 'pipNav.Templates']);

    // Main application nav-header directive
    thisModule.directive('pipNavHeader', function() {
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

    thisModule.controller('pipNavHeaderController', 
        ['$scope', '$element', '$rootScope', function ($scope, $element, $rootScope) {

            // Apply class and call resize
            $element.addClass('pip-nav-header');

            $rootScope.$on('pipIdentityChanged', onIdentityChanged);

            $scope.getUser = getUser;
            $scope.onUserClick = onUserClick;

            return;
            
            //------------------------

            function getUser(prop) {
                var value = $scope.user || $scope.identity || {};

                if (prop) return value[prop];

                return value;
            }
                        
            function onIdentityChanged(event, identity) {
                $scope.identity = identity;
            }

            function onUserClick() {
                $rootScope.$broadcast('pipNavUserClicked');
                //pipSideNav.close();
            }

        }]
    );

})();

/**
 * @file Nav Icon component
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, $) {
    'use strict';

    var thisModule = angular.module('pipNavIcon',
        ['ngMaterial', 'pipTranslate', 'pipNav.Templates', 'pipNavIcon.Service']);

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

    thisModule.controller('pipNavIconController',
        ['$scope', '$element', '$attrs', '$rootScope', '$window', '$state', '$location', 'pipTranslate', 'pipNavIcon', function ($scope, $element, $attrs, $rootScope, $window, $state, $location, pipTranslate, pipNavIcon) {
            // Apply class and call resize
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
                    // Execute nav icon callback
                    $scope.config.callback();
                }
                else if ($scope.config.event) {
                    $rootScope.$broadcast($scope.config.event);
                }
                else if ($scope.config.type == 'back') {
                    $window.history.back();
                } else {
                    $rootScope.$broadcast('pipNavIconClicked');
                }
            }

        }]
    );

})(window.angular, window._, window.jQuery);

/**
 * @file Nav Icon service
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipNavIcon.Service', []);

    thisModule.provider('pipNavIcon', function () {
        var config = {
            // Type of nav icon: 'back', 'menu', 'image' or 'none'
            type: 'none',
            // Image url
            imageUrl: null,
            // Handle nav icon click event
            callback: null,
            // Event name
            event: null
        };

        // Get the service instance
        this.$get = ['$rootScope', function ($rootScope) {
            return {
                hide: hide,
                showMenu: showMenu,
                showBack: showBack,
                showImage: showImage
            };

            // ----------------------
            
            function getConfig() {
                return config;
            }

            // Show navigation icon
            function hide() {
                config.type = 'none';
                config.callback = null;
                config.event = null;
                sendConfigEvent();
            }

            function showMenu(callbackOrEvent) {
                config.type = 'menu';
                config.callback = null;
                config.event = null;

                if (_.isFunction(callbackOrEvent))
                    config.callback = callbackOrEvent;
                if (_.isString(callbackOrEvent))
                    config.event = callbackOrEvent;

                sendConfigEvent();
            }

            function showBack(callbackOrEvent) {
                config.type = 'back';
                config.callback = null;
                config.event = null;

                if (_.isFunction(callbackOrEvent))
                    config.callback = callbackOrEvent;
                if (_.isString(callbackOrEvent))
                    config.event = callbackOrEvent;

                sendConfigEvent();
            }

            function showImage(imageUrl, callbackOrEvent) {
                config.type = 'image';
                config.imageUrl = imageUrl;
                config.callback = null;
                config.event = null;

                if (_.isFunction(callbackOrEvent))
                    config.callback = callbackOrEvent;
                if (_.isString(callbackOrEvent))
                    config.event = callbackOrEvent;

                sendConfigEvent();
            }

            function sendConfigEvent() {
                $rootScope.$broadcast('pipNavIconChanged', config);
            }

        }];

    });

})(window.angular, window._);

/**
 * @file Application Nav Menu component
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipNavMenu', 
        ['ngMaterial', 'pipTranslate', 'pipFocused', 'pipNav.Templates', 'pipNavMenu.Service']);

    // Main application navmenu directive
    thisModule.directive('pipNavMenu', function() {
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

    thisModule.controller('pipNavMenuController', 
        ['$scope', '$element', '$state', '$rootScope', '$window', '$location', '$timeout', 'pipState', 'pipTranslate', 'pipSideNav', 'pipNavMenu', function ($scope, $element, $state, $rootScope, $window, $location, $timeout, pipState, pipTranslate, pipSideNav, pipNavMenu) {

            // Apply class and call resize
            $element.addClass('pip-nav-menu');

            $scope.config = pipNavMenu.config();

            $rootScope.$on('pipNavMenuChanged', onConfigChanged);

            $scope.itemVisible = itemVisible;
            $scope.onLinkClick = onLinkClick;
            $scope.isSectionEmpty = isSectionEmpty;

            return;
            
            //------------------------
            
            function itemVisible(item) {
                return item && item.access && !item.access(item);
            }

            function isSectionEmpty(linkCollection) {
                var result = true;
                _.each(linkCollection, function(link){
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
                    $timeout(function() {
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
                    $timeout(function() {
                        $location.url(link.url);
                    }, 300);

                    return;
                }
                else if (link.state) {
                    if ($state.current.name === link.state) {
                        pipSideNav.close();
                        return;
                    }

                    pipSideNav.close();
                    $timeout(function() {
                        pipState.go(link.state, link.stateParams);
                    }, 300);

                    return;
                }
                else if (link.event)
                    $rootScope.$broadcast(link.event, link);

                pipSideNav.close();
            }
        }]
    );

})();

/**
 * @file Application Nav Menu service
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

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
            
            //---------------------

            function getConfig() {
                return config;  
            }
                                                        
            function setConfig(newConfig) {
                init(newConfig);
                $rootScope.$broadcast('pipNavMenuChanged', config);
                return config;  
            }
        }];

        // function validateConfig(sections) {
        //     pipAssertProvider.isArray(sections, 'pipNavMenuProvider.config or pipNavMenu.config: sections should be an array');
        //     _.each(sections, function (section, number) {
        //         if (section.access) {
        //             pipAssertProvider.isFunction(section.access, 'pipNavMenuProvider.config or pipNavMenu.config: in section number '
        //                 + number + " with title " + section.title + ' access should be a function');
        //         }
        //         if (section.links) {
        //             pipAssertProvider.isArray(section.links, 'pipNavMenuProvider.config or pipNavMenu.config: in section number '
        //                 + number + " with title " + section.title + ' links should be an array');
        //             _.each(section.links, function (link) {
        //                 if (link.access) pipAssertProvider.isFunction(link.access, 'pipNavMenuProvider.config or pipNavMenu.config: in section number '
        //                     + number + " with title " + section.title + ' in link with title ' + link.title + ' access should be a function');
        //             });
        //         }
        //     });
        // }

        function init(newConfig) {
            // if (pipDebugProvider.enabled()) 
            //     validateConfig(newConfig);

            if (_.isArray(newConfig))
                config = newConfig;

            return config;
        };
    });

})();

/**
 * @file Search Bar component
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, $) {
    'use strict';

    var thisModule = angular.module('pipSearchBar',
        ['ngMaterial', 'pipTranslate', 'pipNav.Templates', 'pipSearch.Service']);

    thisModule.config(['pipTranslateProvider', function (pipTranslateProvider) {

        pipTranslateProvider.translations('en', {
            'APPBAR_SEARCH': 'Search'
        });

        pipTranslateProvider.translations('ru', {
            'APPBAR_SEARCH': 'Поиск'
        });

    }]);

    // Main application header directive
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

    thisModule.controller('pipSearchBarController',
        ['$scope', '$element', '$attrs', '$rootScope', '$window', '$state', '$location', 'pipTranslate', 'pipSearch', function ($scope, $element, $attrs, $rootScope, $window, $state, $location, pipTranslate, pipSearch) {
            // Apply class and call resize
            $element.addClass('pip-search-bar');

            $scope.config = pipSearch.config();

            $scope.searchEnabled = false;
            $scope.search = {text: ''};

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
                } else {
                    $rootScope.$broadcast('pipSearchBarSearchClicked', searchText);
                }
            }

            function onSearchClear() {
                if ($scope.search.text) {
                    $scope.search.text = '';

                    focusSearchText();
                } else {
                    $scope.searchEnabled = false;
                    onSearchClick();
                }
            }

            function onSearchKeyDown(event) {
                // Enter pressed
                if (event.keyCode === 13) {
                    $scope.onSearchClick();

                    return;
                }
                // ESC pressed
                if (event.keyCode === 27) {
                    $scope.searchEnabled = false;
                }
            }
        }]
    );

})(window.angular, window._, window.jQuery);

/**
 * @file Search service
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipSearch.Service', []);

    thisModule.provider('pipSearch', function () {
        var config = {
            // Search visible
            visible: false,
            // Search criteria
            criteria: '',
            // History for search autocomplete
            history: [],
            // Callback for search
            callback: null,
        };

        // Get the service instance
        this.$get = ['$rootScope', function ($rootScope) {
            $rootScope.$on('pipSearchOpen', open);
            $rootScope.$on('pipSearchClose', close);

            return {
                set: setSearch,
                clear: clearSearch,
                criteria: updateCriteria,
                history: updateHistory,
            };

            // ----------------------

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

})(window.angular, window._);

/**
 * @file Application Side Nav component
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipSideNav', 
        ['ngMaterial', 'pipTranslate', 'pipFocused', 'pipNav.Templates', 'pipSideNav.Service']);

    thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {

        pipTranslateProvider.translations('en', {
            'SIDENAV_SINCE': 'since'
        });

        pipTranslateProvider.translations('ru', {
            'SIDENAV_SINCE': 'с'
        });

    }]);

    // Main application sidenav directive
    thisModule.directive('pipSidenav', function() {
       return {
           restrict: 'EA',
           scope: {
               primaryPartyAvatar: '=pipPrimaryAvatar',
               secondaryPartyAvatar: '=pipSecondaryAvatar',
               partyName: '=pipName'
           },
           replace: false,
           templateUrl: 'sidenav/sidenav.html',
           controller: 'pipSideNavController'
       };
    });

    thisModule.controller('pipSideNavController', 
        ['$scope', '$element', '$state', '$rootScope', '$window', '$location', '$timeout', 'pipState', 'pipTranslate', 'pipSideNav', function ($scope, $element, $state, $rootScope, $window, $location, $timeout, pipState, pipTranslate, pipSideNav) {

            // Apply class and call resize
            $element.addClass('pip-sidenav');

            $scope.config = pipSideNav.config();
            $scope.$avatarReset = false;

            $rootScope.$on('pipAppBarNavIconClicked', onAppBarNavIconClick);
            $rootScope.$on('pipSideNavChanged', onConfigChanged);

            $scope.itemVisible = itemVisible;
            $scope.onUserClick = onUserClick;
            $scope.onPartyClick = onPartyClick;
            $scope.onLinkClick = onLinkClick;
            $scope.isSectionEmpty = isSectionEmpty;

            $scope.getParty = getParty;
            $scope.getUser = getUser;
            $scope.getConnection = getConnection;
            
            return;
            
            //------------------------

            function getParty(prop) {
                if (!$rootScope.$party) {
                    return;
                }
                if (prop) {
                    return $rootScope.$party[prop];
                }

                return $rootScope.$party;
            }

            function getUser(prop) {
                if (!$rootScope.$user) {
                    return;
                }
                if (prop) {
                    return $rootScope.$user[prop];
                }

                return $rootScope.$user;
            }
            
            function getConnection(prop) {
                if (!$rootScope.$connection) {
                    return;
                }
                if (prop) {
                    return $rootScope.$connection[prop];
                }

                return $rootScope.$connection;
            }
            
            function itemVisible(item) {
                return item && item.access && !item.access($rootScope.$party, $rootScope.$user, item);
            }

            function isSectionEmpty(linkCollection) {
                var result = true;
                _.each(linkCollection, function(link){
                    if (!itemVisible(link))
                        result = false;
                });
                return result;
            }

            function onAppBarNavIconClick(event) {
                pipSideNav.open();
            }

            function onConfigChanged(event, config) {
                $scope.config = config;
            }

            function onUserClick() {
                $rootScope.$broadcast('pipSideNavUserClicked');
                pipSideNav.close();
            }

            function onPartyClick() {
                $rootScope.$broadcast('pipSideNavPartyClicked');
                pipSideNav.close();
            }

            function processStateParams(params) {
                if (params == null) return null;

                var result = {};
                for (var prop in params) {
                    if (params.hasOwnProperty(prop)) {
                        if (params[prop] == ':party_id') {
                            result[prop] = $rootScope.$party ? $rootScope.$party.id : null;
                        } else if (params[prop] == ':user_id') {
                            result[prop] = $rootScope.$user ? $rootScope.$user.id : null;
                        } else {
                            result[prop] = params[prop];   
                        }
                    }
                }
                return result;
            }

            function processUrlParams(url) {
                if (url == null) return null;

                var result = url.replace(':party_id', $rootScope.$party ? $rootScope.$party.id : '');
                result = result.replace(':user_id', $rootScope.$user ? $rootScope.$user.id : '');

                return result;
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
                    $timeout(function() {
                        $window.location.href = processUrlParams(link.href);
                    }, 300);

                    return;
                }
                else if (link.url) {
                    if (link.url.split(/[\s/?]+/)[1] === $location.url().split(/[\s/?]+/)[1]) {
                        pipSideNav.close();
                        return;
                    }

                    pipSideNav.close();
                    $timeout(function() {
                        $location.url(processUrlParams(link.url));
                    }, 300);

                    return;
                }
                else if (link.state) {
                    if ($state.current.name === link.state) {
                        pipSideNav.close();
                        return;
                    }

                    pipSideNav.close();
                    $timeout(function() {
                        pipState.go(link.state, processStateParams(link.stateParams));
                    }, 300);

                    return;
                }
                else if (link.event)
                    $rootScope.$broadcast('pipSideNavLinkClicked', link.event);

                pipSideNav.close();
            }
        }]
    );

})();

/**
 * @file Application Side Nav service
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipSideNav.Service', ['pipAssert', 'pipDebug']);

    thisModule.provider('pipSideNav', ['pipAssertProvider', 'pipDebugProvider', function (pipAssertProvider, pipDebugProvider) {
        var config = {
            // Theme to be applied to the header
            theme: 'blue',
            // Sections with navigation links
            sections: []
        };

        this.theme = theme;
        this.sections = sections;

        this.$get = ['$rootScope', '$mdSidenav', function ($rootScope, $mdSidenav) {
            $rootScope.$on('pipSideNavOpen', open);
            $rootScope.$on('pipSideNavClose', close);

            return {
                config: getConfig,
                theme: setTheme,
                sections: setSections,
                open: open,
                close: close,
                toggle: toggle
            };
            //---------------------

            function getConfig() {
                return config;  
            };
                            
            function setTheme(newTheme) {
                theme(newTheme);
                sendConfigEvent();  
                return config.theme;
            };
                            
            function setSections(newSections) {
                sections(newSections);
                sendConfigEvent();
                return config.sections;  
            };
                            
            function sendConfigEvent() {
                $rootScope.$broadcast('pipSideNavChanged', config);
            };

            function open(event) {
                $mdSidenav('pip-sidenav').open();
            };
                 
            function close(event) {
                $mdSidenav('pip-sidenav').close();   
            };                

            function toggle() {
                $mdSidenav('pip-sidenav').toggle();   
            };                   
        }];

        function theme(newTheme) {
            config.theme = newTheme || config.theme;
            return config.theme;            
        };

        function validateSections(sections) {
            pipAssertProvider.isArray(sections, 'pipSideNavProvider.sections or pipSideNav.sections: sections should be an array');
            _.each(sections, function (section, number) {
                if (section.access) {
                    pipAssertProvider.isFunction(section.access, 'pipSideNavProvider.sections or pipSideNav.sections: in section number '
                        + number + " with title " + section.title + ' access should be a function');
                }
                if (section.links) {
                    pipAssertProvider.isArray(section.links, 'pipSideNavProvider.sections or pipSideNav.sections: in section number '
                        + number + " with title " + section.title + ' links should be an array');
                    _.each(section.links, function (link) {
                        if (link.access) pipAssertProvider.isFunction(link.access, 'pipSideNavProvider.sections or pipSideNav.sections: in section number '
                            + number + " with title " + section.title + ' in link with title ' + link.title + ' access should be a function');
                    });
                }
            });
        }

        function sections(newSections) {
            if (pipDebugProvider.enabled()) validateSections(newSections);

            if (_.isArray(newSections))
                config.sections = newSections;
            return config.sections;
        };
    }]);

})();

/**
 * @file Tabs control
 * @copyright Digital Living Software Corp. 2014-2016
 * 
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipTabs", ['pipAssert', 'pipNav.Templates']);

    thisModule.directive('pipTabs',
        ['$mdMedia', 'pipAssert', function ($mdMedia, pipAssert) {
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
                controller:
                    ['$scope', '$element', '$attrs', '$mdMedia', 'localStorageService', 'pipTranslate', function ($scope, $element, $attrs, $mdMedia, localStorageService, pipTranslate) {
                        $scope.class = ($attrs.class || '') + ' md-' + localStorageService.get('theme') + '-theme';
                        pipAssert.isArray($scope.tabs, 'pipTabs: pipTabs attribute should take an array');
                        $scope.$mdMedia = $mdMedia;
                        $scope.tabs = ($scope.tabs && _.isArray($scope.tabs)) ? $scope.tabs : [];
                        if ($scope.tabs.length > 0 && $scope.tabs[0].title) {
                            pipTranslate.translateObjects($scope.tabs, 'title', 'nameLocal');
                        } else {
                            pipTranslate.translateObjects($scope.tabs, 'name', 'nameLocal');
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
                            if ($scope.disabled()) return;

                            $scope.activeIndex = index;
                            $scope.activeTab = $scope.activeIndex;
                            if ($scope.select) {
                                $scope.select($scope.tabs[$scope.activeIndex], $scope.activeIndex);
                            }
                        };

                        $scope.showShadow = function () {
                            if ($scope.showTabsShadow) {
                                return $scope.showTabsShadow();
                            } else {
                                return false;
                            }
                        };

                        $scope.show = function () {
                            if ($scope.showTabs) {
                                return $scope.showTabs();
                            } else {
                                return true;
                            }
                        };
                    }]
            };
        }]
    );

})();





(function () {
    'use strict';
    angular.module('pipTheme', [
        'pipTheme.Run', 
        'pipTheme.Factory'
    ]);
})();

(function () {
    'use strict';
    ThemeFactory.$inject = ['localStorageService', '$mdTheming', '$rootScope', '$timeout', '$state', '$stateParams'];
    var thisModule = angular.module('pipTheme.Factory', ['ngMaterial']);
    
    thisModule.factory('pipTheme', ThemeFactory);
    
    function ThemeFactory(localStorageService, $mdTheming, $rootScope, $timeout, $state, $stateParams) {
        return {
            /**
             * Set current theme
             * @param {String} theme - theme name
             * @param {String}
             * @throws {Error} 'Theme is not specified' in case if theme is not defined
             * @throws {Error} 'Theme XXX is not registered. Please, register it first with $mdThemingProvider' if theme is not registered
             */
            setCurrentTheme: function (theme) {
                if (theme == null || theme === '') {
                    throw new Error('Theme is not specified');
                }

                if (localStorageService.get('theme') == theme && $rootScope.$theme == theme) {
                    return;
                }

                if (!(theme in $mdTheming.THEMES)) {
                    throw new Error('Theme ' + theme + ' is not registered. Please, register it first with $mdThemingProvider');
                }
                localStorageService.set('theme', theme);
                $rootScope.$theme = theme;
            },

            /** 
             *  Add attribute 'md-theme' with value current theme
             *  Add current theme class
             */
            initializeTheme: function (theme) {
                if (theme == null || theme === '') {
                    throw new Error('Theme is not specified');
                }

                if (!(theme in $mdTheming.THEMES)) {
                    throw new Error('Theme ' + theme + ' is not registered. Please, register it first with $mdThemingProvider');
                }

                $rootScope.$theme = theme;
                $('body').attr('md-theme', '{{ $theme }}').addClass('{{ $theme }}');
            }
        };
    }
})();



(function () {
    'use strict';
    run.$inject = ['localStorageService', 'pipTheme', '$rootScope'];
    var thisModule = angular.module('pipTheme.Run', []);

    thisModule.run(run);
    
    function run(localStorageService, pipTheme, $rootScope) {
        try {
            var currentTheme = ($rootScope.$user && $rootScope.$user.theme) ?
                $rootScope.$user.theme : localStorageService.get('theme');

            pipTheme.initializeTheme(currentTheme);
        } catch (ex) {
            pipTheme.initializeTheme('blue');
        }
    }
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
    config.$inject = ['$mdThemingProvider', 'pipTranslateProvider'];
    var thisModule = angular.module('pipTheme.Bootbarn.Cool', ['ngMaterial']);

    thisModule.config(config);

    function config($mdThemingProvider, pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            THEME: 'Theme',
            'bootbarn-cool': 'Cool'
        });

        pipTranslateProvider.translations('ru', {
            THEME: 'Тема',
            'bootbarn-cool': ''
        });
        
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
    config.$inject = ['$mdThemingProvider', 'pipTranslateProvider'];
    var thisModule = angular.module('pipTheme.Bootbarn.Monochrome', ['ngMaterial']);

    thisModule.config(config);

    function config($mdThemingProvider, pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            THEME: 'Theme',
            'bootbarn-monochrome': 'Monochrome'
        });

        pipTranslateProvider.translations('ru', {
            THEME: 'Тема',
            'bootbarn-monochrome': ''
        });
        
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
    config.$inject = ['$mdThemingProvider', 'pipTranslateProvider'];
    var thisModule = angular.module('pipTheme.Bootbarn.Warm', ['ngMaterial']);

    thisModule.config(config);

    function config($mdThemingProvider, pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            THEME: 'Theme',
            'bootbarn-warm': 'Warm'
        });

        pipTranslateProvider.translations('ru', {
            THEME: 'Тема',
            'bootbarn-warm': 'Коричневая'
        });

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
    config.$inject = ['$mdThemingProvider', 'pipTranslateProvider'];
    var thisModule = angular.module('pipTheme.Default', ['pipTheme.Blue', 'pipTheme.Pink',
        'pipTheme.Amber', 'pipTheme.Orange', 'pipTheme.Green', 'pipTheme.Navy', 'pipTheme.Grey']);

    thisModule.config(config);

    function config($mdThemingProvider, pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            THEME: 'Theme'
        });
        pipTranslateProvider.translations('ru', {
            THEME: 'Тема'
        });

        $mdThemingProvider.setDefaultTheme('default');
        $mdThemingProvider.alwaysWatchTheme(true);

    }
})();

(function () {
    'use strict';
    config.$inject = ['$mdThemingProvider', 'pipTranslateProvider'];
    var thisModule = angular.module('pipTheme.Amber', ['ngMaterial']);

    thisModule.config(config);

    function config($mdThemingProvider, pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            THEME: 'Theme',
            amber: 'Amber'
        });
        pipTranslateProvider.translations('ru', {
            THEME: 'Тема',
            amber: 'Янтарная'
        });

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
    config.$inject = ['$mdThemingProvider', 'pipTranslateProvider'];
    var thisModule = angular.module('pipTheme.Black', ['ngMaterial']);

    thisModule.config(config);

    function config($mdThemingProvider, pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            THEME: 'Theme',
        });
        pipTranslateProvider.translations('ru', {
            THEME: 'Тема'
        });
        
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
    config.$inject = ['$mdThemingProvider', 'pipTranslateProvider'];
    var thisModule = angular.module('pipTheme.Blue', ['ngMaterial']);

    thisModule.config(config);

    function config($mdThemingProvider, pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            THEME: 'Theme',
            blue: 'Blue',
        });
        pipTranslateProvider.translations('ru', {
            THEME: 'Тема',
            blue: 'Голубая'
        });

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
    config.$inject = ['$mdThemingProvider', 'pipTranslateProvider'];
    var thisModule = angular.module('pipTheme.Green', ['ngMaterial']);

    thisModule.config(config);

    function config($mdThemingProvider, pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            THEME: 'Theme',
            green: 'Green'
        });

        pipTranslateProvider.translations('ru', {
            THEME: 'Тема',
            green: 'Зеленая'
        });

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
    config.$inject = ['$mdThemingProvider', 'pipTranslateProvider'];
    var thisModule = angular.module('pipTheme.Grey', ['ngMaterial']);

    thisModule.config(config);

    function config($mdThemingProvider, pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            THEME: 'Theme',
            grey: 'Grey'
        });
        
        pipTranslateProvider.translations('ru', {
            THEME: 'Тема',
            grey: 'Серая'
        });

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
    config.$inject = ['$mdThemingProvider', 'pipTranslateProvider'];
    var thisModule = angular.module('pipTheme.Navy', ['ngMaterial']);

    thisModule.config(config);

    function config($mdThemingProvider, pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            THEME: 'Theme',
            navy: 'Navy'
        });
        pipTranslateProvider.translations('ru', {
            THEME: 'Тема',
            navy: 'Сине-серая'
        });

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
    config.$inject = ['$mdThemingProvider', 'pipTranslateProvider'];
    var thisModule = angular.module('pipTheme.Orange', ['ngMaterial']);

    thisModule.config(config);

    function config($mdThemingProvider, pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            THEME: 'Theme',
            orange: 'Orange'
        });

        pipTranslateProvider.translations('ru', {
            THEME: 'Тема',
            orange: 'Оранжевая'
        });

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
    config.$inject = ['$mdThemingProvider', 'pipTranslateProvider'];
    var thisModule = angular.module('pipTheme.Pink', ['ngMaterial']);

    thisModule.config(config);

    function config($mdThemingProvider, pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            THEME: 'Theme',
            pink: 'Pink'
        });
        pipTranslateProvider.translations('ru', {
            THEME: 'Тема',
            pink: 'Розовая',

        });

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
  $templateCache.put('no_connection/pip_no_connection_panel.html',
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

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipErrors.Pages', [
        'pipAppBar', 'pipState', 'pipTransactions', 'ngMaterial', 
        'pipErrors.Strings', 'pipErrors.NoConnection', 'pipErrors.MissingRoute', 'pipErrors.Unsupported',
        'pipErrors.Unknown', 'pipErrors.Maintenance', 'pipErrors.Templates'
    ]);

    thisModule.config(
        ['pipAuthStateProvider', function (pipAuthStateProvider) {
            // Configure module routes
            pipAuthStateProvider
                .state('errors_no_connection', {
                    url: '/errors/no_connection',
                    params: {
                        error: null
                    },
                    auth: false,
                    controller: 'pipErrorNoConnectionController',
                    templateUrl: 'no_connection/no_connection.html'
                })
                .state('errors_maintenance', {
                    url: '/errors/maintenance',
                    params: {
                        error: null
                    },
                    auth: false,
                    controller: 'pipErrorMaintenanceController',
                    templateUrl: 'maintenance/maintenance.html'
                })
                .state('errors_missing_route', {
                    url: '/errors/missing_route',
                    params: {
                        unfoundState: null,
                        fromState: null
                    },
                    auth: true,
                    controller: 'pipErrorMissingRouteController',
                    templateUrl: 'missing_route/missing_route.html'
                })
                .state('errors_unsupported', {
                    url: '/errors/unsupported',
                    params: {
                        error: null
                    },
                    auth: false,
                    controller: 'pipErrorUnsupportedController',
                    templateUrl: 'unsupported/unsupported.html'
                })
                .state('errors_unknown', {
                    url: '/errors/unknown',
                    params: {
                        error: null
                    },
                    auth: false,
                    controller: 'pipErrorUnknownController',
                    templateUrl: 'unknown/unknown.html'
                });
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

    thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {

        // Set translation strings for the module
        pipTranslateProvider.translations('en', {
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

        pipTranslateProvider.translations('ru', {
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

    thisModule.controller('pipErrorMissingRouteController', ['$scope', '$state', '$rootScope', 'pipAppBar', 'pipAuthState', function ($scope, $state, $rootScope, pipAppBar, pipAuthState) {

        appHeader();
        $rootScope.$routing = false;

        $scope.error = $state && $state.params && $state.params.error ?  $state.params.fromState : {};
        $scope.unfoundState = $state && $state.params ?  $state.params.unfoundState : {};
        $scope.url = $scope.unfoundState && $scope.unfoundState.to ? $state.href($scope.unfoundState.to, $scope.unfoundState.toParams, {absolute: true}) : '';
        $scope.urlBack = $scope.fromState && $scope.fromState.to ? $state.href($scope.fromState.to, $scope.fromState.fromParams, {absolute: true}) : '';

        $scope.onContinue = onContinue;

        return;

        function appHeader() {
            pipAppBar.showMenuNavIcon();
            pipAppBar.showShadow();
            pipAppBar.showTitleBreadcrumb('ERROR_ROUTE_PAGE_TITLE', []);
            pipAppBar.showLocalActions(null, []);
        };

        function onContinue() {
            pipAuthState.goToAuthorized();
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

    var thisModule = angular.module("pipNoConnectionPanel", []);

    thisModule.directive('pipNoConnectionPanel',
        function () {
            return {
                restrict: 'E',
                scope: {
                    error: '=pipError',
                    retry: '=pipRetry'
                },
                templateUrl: 'no_connection/pip_no_connection_panel.html',
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
        'pipStaticCharts'
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
    '<div class="static-chart-legend">\n' +
    '    <div class="legend-title" ng-repeat="item in barChart.legend">\n' +
    '        <span class="bullet" ng-style="{\'background-color\': item.color}"></span>\n' +
    '        <span>{{:: item.label}}</span>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name pipStaticCharts
     *
     * @description
     * Bar chart on top of Rickshaw charts
     */
    angular.module('pipStaticCharts', [])
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
                var setLabelPosition = _.debounce(setLabelPositionUnwrap, 150);
                var colors = _.map($mdColorPalette, function (palette, color) {
                    return color;
                });

                console.log('colors', colors);

                vm.data = vm.series || [];

                if ((vm.series || []).length > colors.length) {
                    vm.data = vm.series.slice(0, 9);
                }

                //colors = _.sample(colors, colors.length);

                // Sets colors of items
                generateParameterColor();

                console.log('vm.data', vm.data);

                // sets legend params
                vm.legend = vm.data;

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
                    console.log('here');

                    chart = nv.models.discreteBarChart()
                        .margin({top: 10, right: 0, bottom: 30, left: 0})
                        .x(function (d) { return d.label; })
                        .y(function (d) { return d.value; })
                        .showValues(true)
                        .showXAxis(true)
                        .showYAxis(false)
                        .valueFormat(d3.format('d'))
                        .color(d3.scale.paletteColors().range());

                    chart.tooltip.enabled(false);
                    chart.noData('No data for this moment...');

                    chartElem = d3.select($element.get(0))
                        .select('.bar-chart svg')
                        .datum(vm.data)
                        .call(chart);

                    nv.utils.windowResize(chart.update);

                    intervalUpdate(chart.update, 10);

                    return chart;
                }, function () {
                    chart.dispatch.on('beforeUpdate', function () {
                        $timeout(setLabelPosition, 100);    // dirty hack. Replace by callback
                    });

                    $timeout(setLabelPosition, 100);        // dirty hack. Replace by callback
                });

                /**
                 * Aligns value label according to parent container size.
                 * @return {void}
                 */
                function setLabelPositionUnwrap() {
                    var labels = d3.selectAll('.nv-bar text')[0];
                    var chartBars = d3.selectAll('.nv-bar')[0];

                    chartBars.forEach(function (item, index) {
                        var barSize = item.getBBox();

                        d3.select(labels[index]).attr('dy', barSize.height / 2 + 6);   // 6px = magic float to align text
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
                 * Temp huck for demo
                 * Dirty way to overcome async in charts
                 */
                function intervalUpdate(cb, times) {
                    var counter = 0;

                    var intervalID = $interval(function () {
                        if (counter <= times) {
                            cb();
                            counter++;
                        } else {
                            $interval.cancel(intervalID);
                        }
                    }, 200);
                }

                /**
                 * Helpful method
                 * @private
                 */
                function generateParameterColor() {
                    vm.data.forEach(function (item, index) {
                        item.color = materialColorToRgba(colors[index]);
                    });
                }
            }]
        };
    }
})();


//# sourceMappingURL=pip-webui.js.map
