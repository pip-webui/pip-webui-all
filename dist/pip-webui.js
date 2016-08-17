/**
 * @file Registration of all WebUI core services
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    angular.module('pipCore', [
        'pipUtils',
        'pipErrors',
	    'pipTransactions',
	    'pipTranslate',
        'pipState',
        'pipTimer',
        'pipAssert',
        'pipDebug',
        'pipDateFormat',
        'pipDateTimeFilters',
        'pipTranslateFilters',
        'pipClearErrors',
        'pipTheme',

        'pipFocused',
        'pipSelected',
        'pipInfiniteScroll',
        'pipDraggable',
        'pipUnsavedChanges',
        'pipFabTooltipVisibility',
    ]);
    
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
 * @file Filter to translate string resources
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTranslateFilters', ['pipTranslate']);

    thisModule.filter('translate', ['pipTranslate', function (pipTranslate) {
        return function (key) {
            return pipTranslate.translate(key) || key;
        }
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

                        if (_hasTouch) {
                            cancelPress();
                            _pressTimer = setTimeout(function () {
                                cancelPress();
                                onlongpress(evt);
                            }, 100);
                            $document.on(_moveEvents, cancelPress);
                            $document.on(_releaseEvents, cancelPress);
                        } else {
                            onlongpress(evt);
                        }

                    };

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
                        else
                            element.css({'position': '', top: '', left: '', 'z-index': '', width: ''});
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
 * @file Error context
 * @description
 * Error context decouples business components that throw errors
 * and visualization components that show them to users
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */
 
(function () {
    'use strict';

    var thisModule = angular.module('pipErrors', ['pipUtils', 'pipAssert']);

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
                    if ($rootScope.$user && $rootScope.$user.id && toState.params && toState.params.access) {
                        if (toParams && toParams.party_id) {
                            var party = _.find($rootScope.$user.party_access, {party_id: toParams.party_id});
                            if (party) {
                                if (toState.params.access == 'manager' && !party.manager ||
                                    toState.params.access == 'contributor' && !party.contributor) {
                                    if (toState.params.toState) {
                                        event.preventDefault();
                                        $state.go(toState.params.toState, toParams);
                                        return;
                                    }
                                }
                            } else {
                                if (toParams.party_id != $rootScope.$user.id && toState.params.toState) {
                                    event.preventDefault();
                                    $state.go(toState.params.toState, toParams);
                                    return;
                                }
                            }
                        }
                    }
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


(function () {
    'use strict';

    config.$inject = ['$mdThemingProvider', 'pipTranslateProvider'];
    run.$inject = ['localStorageService', 'pipTheme', '$rootScope'];
    ThemeFactory.$inject = ['localStorageService', '$mdTheming', '$rootScope', '$timeout', '$state', '$stateParams'];
    angular
        .module('pipTheme', ['ngMaterial'])
        .config(config)
        .run(run)
        .factory('pipTheme', ThemeFactory);

    function config($mdThemingProvider, pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            THEME: 'Theme',
            blue: 'Blue',
            pink: 'Pink',
            amber: 'Amber',
            orange: 'Orange',
            green: 'Green',
            navy: 'Navy',
            grey: 'Grey'
        });
        pipTranslateProvider.translations('ru', {
            THEME: 'Тема',
            blue: 'Голубая',
            pink: 'Розовая',
            amber: 'Янтарная',
            orange: 'Оранжевая',
            green: 'Зеленая',
            navy: 'Сине-серая',
            grey: 'Серая'
        });


        registerBlueTheme('default');
        registerBlueTheme('blue');
        registerPinkTheme('pink');
        registerAmberTheme('amber');
        registerOrangeTheme('orange');
        registerGreenTheme('green');
        registerNavyTheme('navy');
        registerGreyTheme('grey');
       // registerDarkTheme('dark');
       // registerBlackTheme('black');

        $mdThemingProvider.setDefaultTheme('default');
        $mdThemingProvider.alwaysWatchTheme(true);

        function registerBlueTheme(themeName) {
            var bluePrimaryPalette = $mdThemingProvider.extendPalette('blue', {
                'contrastDefaultColor': 'light',
                'contrastDarkColors': undefined
            });
            $mdThemingProvider.definePalette('blue-primary', bluePrimaryPalette);

            var blueBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
                'A100': 'rgba(231, 231, 231, 1)',
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

        function registerPinkTheme(themeName) {
            var PinkBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
                'A100': 'rgba(231, 231, 231, 1)',
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

            $mdThemingProvider.theme(themeName)
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
        }


        function registerAmberTheme(themeName) {
            var orangeBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
                'A100': 'rgba(231, 231, 231, 1)',
                'A200': 'rgba(255, 152, 0, 1)'
            });
            $mdThemingProvider.definePalette('orange-background', orangeBackgroundPalette);

            var orangePrimaryPalette = $mdThemingProvider.extendPalette('orange', {
                '800': 'rgba(255, 152, 0, 1)',
                '900': 'rgba(255, 152, 0, .54);'
            });
            $mdThemingProvider.definePalette('orange-primary', orangePrimaryPalette);

            $mdThemingProvider.theme(themeName)
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
        }

        function registerOrangeTheme(themeName) {
            var RedBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
                'A100': 'rgba(231, 231, 231, 1)',
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

            $mdThemingProvider.theme(themeName)
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
        }

        function registerGreenTheme(themeName) {
            var greenBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
                'A100': 'rgba(231, 231, 231, 1)',
                'A200': 'rgba(76, 175, 80, 1)'
            });
            $mdThemingProvider.definePalette('green-background', greenBackgroundPalette);

            var greenPrimaryPalette = $mdThemingProvider.extendPalette('green', {
                '300':'#9ed4a1',
                'contrastLightColors': ['500', '300']
            });
            $mdThemingProvider.definePalette('green-primary', greenPrimaryPalette);


            var greenAccentPalette = $mdThemingProvider.extendPalette('amber', {
                'contrastLightColors': ['A700']
            });
            $mdThemingProvider.definePalette('green-accent', greenAccentPalette);

            $mdThemingProvider.theme(themeName)
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
        }

        function registerNavyTheme(themeName) {
            var greyPalette = $mdThemingProvider.extendPalette('grey', {
                '700': 'rgba(86, 97, 125, 1)',
                '800': 'rgba(86, 97, 125, .54)',
                'A100': 'rgba(231, 231, 231, 1)'
            });
            $mdThemingProvider.definePalette('grey', greyPalette);

            var tealPalette = $mdThemingProvider.extendPalette('teal', {
                'contrastLightColors': [ '500', '600', '700', '800', '900', 'A700']
            });
            $mdThemingProvider.definePalette('teal', tealPalette);

            $mdThemingProvider.theme(themeName)
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
        }

        function registerGreyTheme(themeName) {
            var thirdPartyPalette = $mdThemingProvider.extendPalette('grey', {
                'A100': 'rgba(231, 231, 231, 1)',
                'A200': 'rgba(255, 152, 0, 1)',
                'A400': '#a9b9c0',
                '500': '#607D8B',
                'A700': '#90A4AE',
                //'800': '',
                'contrastDefaultColor': 'dark',
                'contrastLightColors': [ '300', '400', '500', '600', '700', '800', '900', 'A700']
            });
            $mdThemingProvider.definePalette('third-party', thirdPartyPalette);


            $mdThemingProvider.theme(themeName)
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
        }

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



    function run(localStorageService, pipTheme, $rootScope) {
        try {
            var currentTheme = ($rootScope.$user && $rootScope.$user.theme) ?
                $rootScope.$user.theme : localStorageService.get('theme');

            pipTheme.initializeTheme(currentTheme);
        } catch (ex) {
            pipTheme.initializeTheme('navy');
        }
    }

    /**
     * @ngdoc service
     * @name pipTheme
     */
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

            /** Add attribute 'md-theme' with value current theme
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

    var thisModule = angular.module('pipTransactions', ['pipTranslate', 'pipErrors']);

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
 * @file Translatation service
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo:
 * - Move directives to more appropriate places
 */
 
 /* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTranslate', ['LocalStorageModule', 'pipAssert']);

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
            function reset(fullReset, partialReset) {
                fullReset = fullReset !== undefined ? !!fullReset : true;
                partialReset = partialReset !== undefined ? !!partialReset : true;

                $rootScope.$reset = fullReset;
                $rootScope.$partialReset = partialReset;
                $timeout(function() {
                    $rootScope.$reset = false;
                    $rootScope.$partialReset = false;
                }, 0);
            }

            return {
                use: function (newLanguage, fullReset, partialReset) {
                    pipAssert.isString(newLanguage || '', "pipTranslate.use: argument should be a string");
                    if (newLanguage != null && newLanguage != language) {
                        language = newLanguage;
                        if (persist)
                            localStorageService.set('language', language);
                        if (setRoot)
                            $rootScope.$language = language;
                        reset(fullReset, partialReset);
                    }
                    return language;
                },

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
 * @file Collection utilities
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

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
 * @file Date utilities
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipUtils.Dates', []);

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
 * @file Form error utilities
 * @copyright Digital Living Software Corp. 2014-2016
 *
 */
 
 /* global _, angular */
 
(function () {
    'use strict';

    var thisModule = angular.module('pipUtils.FormErrors', []);

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

        var sprintf = (function sprintf() {
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
        })();

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
            goBack: goBack,
            goBackAndSelect: goBackAndSelect,
            scrollTo: scrollTo,
            equalObjectIds: equalObjectIds,
            eqOid: equalObjectIds,
            notEqualObjectIds: notEqualObjectIds,
            neqOid: notEqualObjectIds,
            containsObjectId: containsObjectId,
            hasOid: containsObjectId,
            isObjectId: isObjectId,
            // Strings functions. No analogues in lodash.strings
            sampleLine: sampleLine,
            hashCode: hashCode,
            makeString: makeString,
            getBrowser: getBrowser,
            checkSupported: checkSupported,
            sprintf: sprintf,
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

        // Creates a sample line from a text
        function sampleLine(value, maxLength) {
            if (!value || value == '') return '';

            var length = value.indexOf('\n');
            length = length >= 0 ? length : value.length;
            length = length < maxLength ? value.length : maxLength;

            return value.substring(0, length);
        };

        // Simple version of string hashcode
        function hashCode(value) {
            if (value == null) return 0;
            var result = 0;
            for (var i = 0; i < value.length; i++) {
                result += value.charCodeAt(i);
            }
            return result;
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

        // Generates random big number for verification codes
        function generateVerificationCode() {
            return Math.random().toString(36).substr(2, 10).toUpperCase(); // remove `0.`
        };

        // Navigation
        //-------------

        function goBack() {
            $window.history.back()
        };

        function goBackAndSelect(object, idParamName, objParamName) {
            pipAssert.isDef(object, 'pipUtils.goBack: first argument should be defined');
            pipAssert.isDef(idParamName, 'pipUtils.goBack: second argument should be defined');
            pipAssert.isDef(objParamName, 'pipUtils.goBack: third argument should be defined');
            pipAssert.isObject(object, 'pipUtils.goBack: first argument should be an object');
            pipAssert.isString(idParamName, 'pipUtils.goBack: second argument should a string');
            pipAssert.isString(objParamName, 'pipUtils.goBack: third argument should a string');
                
            if ($rootScope.$prevState && $rootScope.$prevState.name) {
                var state = _.cloneDeep($rootScope.$prevState);

                state.params[idParamName] = object.id;
                state.params[objParamName] = object;

                $state.go(state.name, state.params);
            } else {
                $window.history.back();
            }
        };

        // Scrolling
        //--------------
        
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
        };

        // todo add support for iPhone
        function getBrowser() {
            var ua = $window.navigator.userAgent;

            var bName = function () {
                if (ua.search(/Edge/) > -1) return "edge";
                if (ua.search(/MSIE/) > -1) return "ie";
                if (ua.search(/Trident/) > -1) return "ie11";
                if (ua.search(/Firefox/) > -1) return "firefox";
                if (ua.search(/Opera/) > -1) return "opera";
                if (ua.search(/OPR/) > -1) return "operaWebkit";
                if (ua.search(/YaBrowser/) > -1) return "yabrowser";
                if (ua.search(/Chrome/) > -1) return "chrome";
                if (ua.search(/Safari/) > -1) return "safari";
                if (ua.search(/Maxthon/) > -1) return "maxthon";
            }();

            var version;
            switch (bName) {
                case "edge":
                    version = (ua.split("Edge")[1]).split("/")[1];
                    break;
                case "ie":
                    version = (ua.split("MSIE ")[1]).split(";")[0];
                    break;
                case "ie11":
                    bName = "ie";
                    version = (ua.split("; rv:")[1]).split(")")[0];
                    break;
                case "firefox":
                    version = ua.split("Firefox/")[1];
                    break;
                case "opera":
                    version = ua.split("Version/")[1];
                    break;
                case "operaWebkit":
                    bName = "opera";
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

            var platform = 'desktop';
            if (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua.toLowerCase())) platform = 'mobile';

            var os;
            try {
                var osAll = (/(windows|mac|android|linux|blackberry|sunos|solaris|iphone)/.exec(ua.toLowerCase()) || [u])[0].replace('sunos', 'solaris'),
                    osAndroid = (/(android)/.exec(ua.toLowerCase()) || '');
                    os = osAndroid && (osAndroid == 'android' || (osAndroid[0] == 'android')) ? 'android' : osAll;
            } catch (err) {
                os = 'unknown'
            }

            var browsrObj;

            try {
                browsrObj = {
                    platform: platform,
                    browser: bName,
                    versionFull: version,
                    versionShort: version.split(".")[0],
                    os: os
                };
            } catch (err) {
                browsrObj = {
                    platform: platform,
                    browser: 'unknown',
                    versionFull: 'unknown',
                    versionShort: 'unknown',
                    os: 'unknown'
                };
            }

            return browsrObj;
        }

        // todo нужны каке нибудь настройки?
        function checkSupported(supported) {
            if (!supported) supported = {
                edge: 11,
                ie: 11,
                firefox: 43, //4, for testing
                opera: 35,
                chrome: 47
            };

            var systemInfo = getBrowser();

            if (systemInfo && systemInfo.browser && supported[systemInfo.browser]){
                if (systemInfo.versionShort >= supported[systemInfo.browser]) return true;
            }
            return true;

        };

    }]);

})();

/**
 * @file String utilities
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Move functions to general utilities
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipUtils.Strings', []);

    thisModule.factory('pipStrings', function () {
        var strings = {};

        // Creates a sample line from a text
        strings.sampleLine = function (value, maxLength) {
            if (!value || value == '') return '';
    
            var length = value.indexOf('\n');
            length = length >= 0 ? length : value.length;
            length = length < maxLength ? value.length : maxLength;
    
            return value.substring(0, length);
        };
    
        // Simple version of string hashcode
        strings.hashCode = function (value) {
            if (value == null) return 0;
            var result = 0;
            for (var i = 0; i < value.length; i++) {
                result += value.charCodeAt(i);
            }
            return result;
        };
    
        return strings;
    });

})();
/**
 * @file Search tag utilities
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipUtils.Tags', []);

    thisModule.factory('pipTags', function () {
        var tags = {};
        
        var HASHTAG_REGEX = /#\w+/g;
    
        var normalizeTag = function (tag) {
            return tag 
                ? _.trim(tag.replace(/(_|#)+/g, ' '))
                : null;
        };
        tags.normalizeTag = normalizeTag;
    
        var compressTag = function (tag) {
            return tag
                ? tag.replace(/( |_|#)/g, '').toLowerCase()
                : null;
        };
        tags.compressTag = compressTag;
    
        var equalTags = function (tag1, tag2) {
            if (tag1 == null && tag2 == null)
                return true;
            if (tag1 == null || tag2 == null)
                return false;
            return compressTag(tag1) == compressTag(tag2);
        };
        tags.equalTags = equalTags;
    
        var normalizeTags = function (tags) {
            if (_.isString(tags)) {
                tags = tags.split(/( |,|;)+/);
            }
    
            tags = _.map(tags, function (tag) {
                return normalizeTag(tag);
            });
    
            return tags;
        };
        tags.normalizeTags = normalizeTags;
    
        var compressTags = function (tags) {
            if (_.isString(tags)) {
                tags = tags.split(/( |,|;)+/);
            }
    
            tags = _.map(tags, function (tag) {
                return compressTag(tag);
            });
    
            return tags;
        };
        tags.compressTags = compressTags;
    
        var extractTags = function (entity, searchFields) {
            var tags = normalizeTags(entity.tags);
    
            _.each(searchFields, function (field) {
                var text = entity[field] || '';
    
                if (text != '') {
                    var hashTags = text.match(HASHTAG_REGEX);
                    tags = tags.concat(normalizeTags(hashTags));
                }
            });
    
            return _.uniq(tags);
        };
        tags.extractTags = extractTags;

        return tags;
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
		['pipUtils.General', 'pipUtils.Strings', 'pipUtils.Dates', 'pipUtils.Tags', 'pipUtils.Collections', 'pipUtils.FormErrors']);
})();



/**
 * @file Announces data cache
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipAnnouncesCache', ['pipAnnouncesData']);

    thisModule.service('pipAnnouncesCache',
        ['pipEnums', 'pipDataCache', 'pipTagsCache', function (pipEnums, pipDataCache, pipTagsCache) {

            return {
                readAnnounces: readAnnounces,
                onAnnounceCreate: onAnnounceCreate,
                onAnnounceUpdate: onAnnounceUpdate,
                onAnnounceDelete: onAnnounceDelete                
            };

            function readAnnounces(params, successCallback, errorCallback) {
                params = params || {};
                params.resource = 'announces';
                params.item = params.item || {};

                return pipDataCache.retrieveOrLoad(params, successCallback, errorCallback);
            }
            
            function onAnnounceCreate(params, successCallback) {
                return pipDataCache.addDecorator(
                    'announces', params,
                    pipTagsCache.tagsUpdateDecorator(params, successCallback)
                );
            }

            function onAnnounceUpdate(params, successCallback) {
                return pipDataCache.updateDecorator(
                    'announces', params,
                    pipTagsCache.tagsUpdateDecorator(params, successCallback)
                );
            }

            function onAnnounceDelete(params, successCallback) {
                return pipDataCache.removeDecorator('announces', params, successCallback);
            }
                        
        }]
    );

})();


/**
 * @file Global application data cache
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipDataCache', ['pipDataModel']);

    thisModule.provider('pipDataCache', function () {
        var
            CACHE_TIMEOUT = 5 * 60000, // 5 mins or make it configurable
            cache = {};

        this.timeout = timeout;

        this.$get = ['$q', 'pipDataModel', function ($q, pipDataModel) {
            return {
                timeout: timeout,

                clear: clear,
                retrieve: retrieve,
                retrieveOrLoad: retrieveOrLoad,
                store: store,
                storePermanent: storePermanent,
                remove: remove,
                removeItem: removeItem,
                removeDecorator: removeDecorator,

                // OBSOLETE - will be removed
                addDecorator: addDecorator,
                updateDecorator: updateDecorator,
            };
            //-------------

            // Converts a string value into a numeric hash code
            function hash(data) {
                var filteredData = {};

                // Filter only the generic parameters that can be relevant to the query
                if (data != null) {
                    filteredData.item = data.item;
                    filteredData.party_id = data.party_id;
                    filteredData.search = data.search;
                    filteredData.paging = data.paging;
                    filteredData.take = data.take;
                    filteredData.skip = data.skip;
                }

                filteredData = angular.toJson(filteredData);
                var h = 0, i, chr, len;
                if (filteredData == null || filteredData.length === 0) return h;
                for (i = 0, len = filteredData.length; i < len; i++) {
                    chr = filteredData.charCodeAt(i);
                    h = ((h << 5) - h) + chr;
                    h |= 0; // Convert to 32bit integer
                }
                return h;
            };

            // Generates parameterized key
            function generateKey(name, params) {
                var h = hash(params);
                return name + (h != 0 ? '_' + h : '');
            };

            // Clear the cache, globally or selectively
            function clear(name) {
                if (name == null) {
                    cache = {};
                } else {
                    for (var key in cache) {
                        if (key == name || key.startsWith(name + '_')) {
                            delete cache[key];
                        }
                    }
                }
            };

            // Try to retrieve collection from the cache
            function retrieve(name, params) {
                if (name == null) throw new Error('name cannot be null');
                if (name == '') throw new Error('name cannot be empty');

                var key = generateKey(name, params);
                var holder = cache[key];
                if (holder == null) return null;

                // If expired then cleanup and return null
                if (holder.expire
                    && _.now() - holder.expire > CACHE_TIMEOUT) {
                    delete cache[key];
                    return null;
                }

                return holder.data;
            };

            // Store collection into the cache
            function store(name, data, params) {
                if (name == null) throw new Error('name cannot be null');
                if (name == '') throw new Error('name cannot be empty');

                cache[generateKey(name, params)] = {
                    expire: _.now(),
                    data: data
                };
            };

            // Store collection into the cache without expiration
            function storePermanent(name, data, params) {
                if (name == null) throw new Error('name cannot be null');
                if (name == '') throw new Error('name cannot be empty');

                cache[generateKey(name, params)] = {
                    expire: null,
                    data: data
                };
            };

            // Remove collection from the cache
            function remove(name, params) {
                if (name == null) throw new Error('name cannot be null');
                if (name == '') throw new Error('name cannot be empty');

                delete cache[generateKey(name, params)];
            };

            function updateItem(name, item, params) {
                if (name == null) throw new Error('name cannot be null');
                if (item == null) return;

                var data = retrieve(name, params);

                if (data != null) {
                    var isAdded = false;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].id == item.id) {
                            data[i] = item;
                            isAdded = true;
                            return;
                        }
                    }
                    if (!isAdded) data.push(item);
                    store(name, data, params);
                }
            };

            // Tries to retrieve collection from the cache, otherwise load it from server
            function retrieveOrLoad(params, successCallback, errorCallback) {
                if (params == null) throw new Error('params cannot be null');
                // todo add check params?

                var name = (params.cache || params.resource);

                // Retrieve data from cache
                var filter = params.filter,
                    force = !!params.force,
                    result = !force ? retrieve(name, params) : null,
                    deferred = $q.defer();

                // Return result if it exists
                if (result) {
                    if (filter) {
                        if (result.data) {
                            result.data = filter(result.data);
                        } else {
                            result = filter(result);
                        }
                    }
                    if (successCallback) successCallback(result);
                    deferred.resolve(result);
                    return deferred.promise;
                }

                // Load data from server
                if (params.item.paging == 1) {
                    pipDataModel['page'](
                        params,
                        function (data) {
                            // Store data in cache and return
                            store(name, data, params);
                            if (filter) data.data = filter(data.data);
                            deferred.resolve(data);

                            if (successCallback) successCallback(data);
                        },
                        function (err) {
                            // Return error
                            deferred.reject(err);
                            if (errorCallback) errorCallback(err);
                        }
                    );
                } else {
                    pipDataModel[params.singleResult ? 'readOne' : 'read'](
                        params,
                        function (data) {
                            // Store data in cache and return
                            params.singleResult ?
                                updateItem(name, data, params) :
                                store(name, data, params);
                            if (filter) data = filter(data);
                            deferred.resolve(data);

                            if (successCallback) successCallback(data);
                        },
                        function (err) {
                            // Return error
                            deferred.reject(err);
                            if (errorCallback) errorCallback(err);
                        }
                    );
                }

                // Return deferred object
                return deferred.promise;
            };

            function removeItem(name, item) {
                if (name == null) throw new Error('name cannot be null');
                if (item == null) return;

                for (var key in cache) {
                    if (key == name || key.startsWith(name + '_')) {
                        var data = cache[key].data;
                        if (angular.isArray(data)) {
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].id == item.id) {
                                    data.splice(i, 1);
                                    i--;
                                }
                            }
                        }
                    }
                }
            };

            function removeDecorator(resource, params, successCallback) {
                return function (item) {
                    removeItem(resource, params);
                    if (successCallback) successCallback(item);
                };
            };

            function updateDecorator(resource, params, successCallback) {
                return function (item) {
                    for (var key in cache) {
                        if (key == resource || key.startsWith(resource + '_')) {
                            var data = cache[key].data;
                            if (angular.isArray(data)) {
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].id == item.id) {
                                        data[i] = item;
                                    }
                                }
                            }
                        }
                    }

                    if (successCallback) successCallback(item);
                };
            };

            // OBSOLETE - WILL BE REMOVED ONCE CODE IS REFACTORED
            function addDecorator(resource, params, successCallback) {
                return function (item) {
                    if (!params || !params.notClearedCache) clear(resource);
                    if (successCallback) successCallback(item);
                };
            };

        }];
        //-----------------------

        function timeout(newTimeout) {
            if (newTimeout) {
                CACHE_TIMEOUT = newTimeout;
            }
            return CACHE_TIMEOUT;
        };
    });
})();


/**
 * @file Guides data cache
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipGuidesCache', ['pipGuidesData']);

    thisModule.service('pipGuidesCache',
        ['pipEnums', 'pipDataCache', 'pipTagsCache', function (pipEnums, pipDataCache, pipTagsCache) {

            return {
                readGuides: readGuides,
                onGuideCreate: onGuideCreate,
                onGuideUpdate: onGuideUpdate,
                onGuideDelete: onGuideDelete                
            };

            function readGuides(params, successCallback, errorCallback) {
                params = params || {};
                params.resource = 'guides';
                params.item = params.item || {};

                return pipDataCache.retrieveOrLoad(params, successCallback, errorCallback);
            };
            
            function onGuideCreate(params, successCallback) {
                return pipDataCache.addDecorator(
                    'guides', params,
                    pipTagsCache.tagsUpdateDecorator(params, successCallback)
                );
            };

            function onGuideUpdate(params, successCallback) {
                return pipDataCache.updateDecorator(
                    'guides', params,
                    pipTagsCache.tagsUpdateDecorator(params, successCallback)
                );
            };

            function onGuideDelete(params, successCallback) {
                return pipDataCache.removeDecorator('guides', params, successCallback);
            };
                        
        }]
    );

})();


/**
 * @file ImageSets data cache
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipImageSetsCache', ['pipImageSetsData']);

    thisModule.service('pipImageSetsCache',
        ['pipEnums', 'pipDataCache', 'pipTagsCache', function (pipEnums, pipDataCache, pipTagsCache) {

            return {
                readImageSets: readImageSets,
                onImageSetCreate: onImageSetCreate,
                onImageSetUpdate: onImageSetUpdate,
                onImageSetDelete: onImageSetDelete                
            };

            function readImageSets(params, successCallback, errorCallback) {
                params = params || {};
                params.resource = 'image_sets';
                params.item = params.item || {};

                return pipDataCache.retrieveOrLoad(params, successCallback, errorCallback);
            };
            
            function onImageSetCreate(params, successCallback) {
                return pipDataCache.addDecorator(
                    'image_sets', params,
                    pipTagsCache.tagsUpdateDecorator(params, successCallback)
                );
            };

            function onImageSetUpdate(params, successCallback) {
                return pipDataCache.updateDecorator(
                    'image_sets', params,
                    pipTagsCache.tagsUpdateDecorator(params, successCallback)
                );
            };

            function onImageSetDelete(params, successCallback) {
                return pipDataCache.removeDecorator('image_sets', params, successCallback);
            };
                        
        }]
    );

})();


/**
 * @file Session data cache
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipSessionCache', ['pipCore', 'pipRest', 'pipDataCache']);

    thisModule.run(['$rootScope', 'pipSessionCache', function ($rootScope, pipSessionCache) {
        $rootScope.$on('pipSessionOpened', pipSessionCache.init);
        $rootScope.$on('pipSessionClosed', pipSessionCache.clear);
    }]);

    thisModule.service('pipSessionCache',
        ['$rootScope', '$stateParams', '$q', 'pipTranslate', 'pipRest', 'localStorageService', 'pipAccess', 'pipEnums', 'pipSession', 'pipDataCache', function ($rootScope, $stateParams, $q, pipTranslate, pipRest, localStorageService,
                  pipAccess, pipEnums, pipSession, pipDataCache) {

            return {
                init: init,
                clear: clear,

                readUser: readUser,
                readParty: readParty,
                readConnection: readConnection,

                readSettings: readSettings,
                onSettingsUpdate: onSettingsUpdate
            };
            //-------------

            function init(event, data) {
                if (data == null)
                    throw new Error('Unexpected error: issues in openning session');

                clear();
                if (data.serverUrl) $rootScope.$serverUrl = data.serverUrl;
                storeUser(data.user, null);
            };

            function clear() {
                // Clear data cache
                pipDataCache.clear();

                // Clear global variables
                delete $rootScope.$user;
                delete $rootScope.$party;
                delete $rootScope.$serverUrl;
                delete $rootScope.$connection;
                delete $rootScope.$settings;
            };

            function updateUserRights(user, party) {
                // Get parameters from cache if they are not defined
                user = user || pipDataCache.retrieve('user');
                party = party || pipDataCache.retrieve('party');

                // Exit if user is not defined
                if (user == null) return;

                // Update user access rights
                if (party == null)
                    user = pipAccess.asOwner(user);
                else if (user.id == party.id)
                    user = pipAccess.asOwner(user);
                else
                    user = pipAccess.toParty(user, party);

                // Save user with new rights back to cache
                pipDataCache.storePermanent('user', user);
                $rootScope.$user = user;
            };

            function storeUserTheme(user) {
                if (!user) return;
                var userTheme = user.theme || 'blue';

                if (user && $rootScope.$party) {
                    if ($rootScope.$party.id == user.id) userTheme = user.theme;
                    else userTheme = 'navy';
                }

                $rootScope.$theme = userTheme;
                localStorageService.set('theme', userTheme);
            };

            function storeUser(user) {
                if (user == null) return;

                pipDataCache.storePermanent('user', user);
                $rootScope.$user = user;
                storeUserTheme(user);

                // Activate user language
                pipTranslate.use(user.language, false, true);
                updateUserRights(user, null);
            };

            function readUser(successCallback, errorCallback) {
                // Avoid broken session
                if (!pipSession.opened())
                    throw new Error('User is not authenticated.');

                var
                    userId = pipSession.userId(),
                    user = pipDataCache.retrieve('user');

                // Return user from cache
                if (user) {
                    if (user.id != userId)
                        throw new Error('Unexpected error: issues in opening session');

                    if (successCallback) successCallback(user);
                    var deferred = $q.defer();
                    deferred.resolve(user);
                    return deferred.promise;
                }

                // Read user from server
                return pipRest.users().get(
                    {id: userId},
                    function (user) {
                        // Double check
                        if (user.id != userId)
                            user == null;

                        storeUser(user);

                        if (successCallback) successCallback(use);
                    },
                    errorCallback
                ).$promise;
            };

            function readParty(stateParams, successCallback, errorCallback) {
                // Avoid broken session
                if (!pipSession.opened())
                    throw new Error('User is not authenticated.');

                var
                    userId = pipSession.userId(),
                    partyId = stateParams.party_id || userId,
                    party = pipDataCache.retrieve('party');

                // Skip if party already retrieved
                if (party && party.id == partyId) {
                    $rootScope.$party = party;

                    storeUserTheme($rootScope.$user);

                    if (successCallback) successCallback(party);
                    var deferred = $q.defer();
                    deferred.resolve(party);
                    return deferred.promise;
                }

                // Read party from server
                return pipRest.parties().get(
                    {id: partyId},
                    function (party) {
                        updateUserRights(null, party);
                        pipDataCache.storePermanent('party', party);
                        $rootScope.$party = party;

                        storeUserTheme($rootScope.$user);

                        if (successCallback) successCallback(party);
                    },
                    errorCallback
                ).$promise;
            };

            function readConnection(stateParams, successCallback, errorCallback) {
                // Avoid broken session
                if (!pipSession.opened())
                    throw new Error('User is not authenticated.');

                var
                    userId = pipSession.userId(),
                    partyId = stateParams.party_id || userId,
                    connection = pipDataCache.retrieve('connection');

                // Clear connection it does not match user or party
                if (connection
                    && (connection.party_id != userId
                    || connection.to_party_id != partyId)) {
                    connection = null;
                    pipDataCache.remove('connection');
                    delete $rootScope.$connection;
                }

                // For owner connection is not defined
                if (userId == partyId) {
                    if (successCallback) successCallback(connection);
                    var deferred = $q.defer();
                    deferred.resolve(connection);
                    return deferred.promise;
                }

                // Read connection from server
                return pipRest.connections().query(
                    {
                        party_id: userId,
                        to_party_id: partyId,
                        accept: pipEnums.ACCEPTANCE.ACCEPTED
                    },
                    function (connections) {
                        // There are shall not be more than one active connection
                        if (connections && connections.length > 0)
                            connection = connections[0];
                        else connection = null;

                        pipDataCache.storePermanent('connection', connection);
                        $rootScope.$connection = connection;

                        if (successCallback) successCallback(connection);
                    },
                    errorCallback
                ).$promise;
            };

            function readSettings(successCallback, errorCallback) {
                // Avoid broken session
                if (!pipSession.opened())
                    throw new Error('User is not authenticated.');
                var
                    userId = pipSession.userId(),
                    settings = pipDataCache.retrieve('settings' + '_' + userId);

                if (settings) {
                    if (successCallback) successCallback(settings);
                    var deferred = $q.defer();
                    deferred.resolve(settings);
                    return deferred.promise;
                }

                // Read settings from server
                return pipRest.partySettings().get(
                    {
                        party_id: userId
                    },
                    function (settings) {
                        settings = settings || {};
                        pipDataCache.storePermanent('settings' + '_' + userId, settings);
                        $rootScope.$settings = settings;

                        if (successCallback) successCallback(settings);
                    },
                    errorCallback
                ).$promise;
            };

            function onSettingsUpdate(item, successCallback) {
                // return function(item) {
                if (item == null) return;

                var userId = pipSession.userId(),
                    settings = pipDataCache.retrieve('settings' + '_' + userId);

                // If tags are stored
                if (settings) {
                    settings = _.extend(settings, item);
                    pipDataCache.storePermanent('settings' + '_' + userId, settings);
                    $rootScope.$settings = settings;
                }

                if (successCallback) successCallback(item);
            };
        }]
    );

})();
/**
 * @file Tags data cache
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTagsCache', ['pipUtils', 'pipDataCache']);

    thisModule.service('pipTagsCache',
        ['pipTags', 'pipDataCache', function(pipTags, pipDataCache) {
            return {
                readTags: readTags,
                // Todo: Add updateTags method
                onTagsUpdate: onTagsUpdate,
                tagsUpdateDecorator: tagsUpdateDecorator
            };
			//------------------------------

            function tagsUpdate(params, item) {
                // Extract tag from updated entity
                var tags = item ? pipTags.extractTags(item) : [];
                if (tags.length == 0) return;

                var cacheName = 'partyTags';
                if (params && params.party_id !== null && params.party_id !== undefined)
                    cacheName = cacheName + '_' + params.party_id;
                else if (params && params.item && params.item.party_id !== null && params.item.party_id !== undefined)
                    cacheName = cacheName + '_' + params.item.party_id;

                // Todo: this is a wrong way to get party_id (contributor) from entities
                var data = pipDataCache.retrieve(cacheName);

                // If tags are stored
                if (data) {
                    _.each(tags, function(tag) {
                        // Find if tag already exists
                        var t = _.find(data.tags, function(t) {
                            return pipTags.equalTags(t.tag, tag);
                        });

                        // Otherwise add a new tag
                        if (t) {
                            t.tag = tag;
                            t.count = t.count + 1;
                            t.used = new Date();
                        } else {
                            if (!data.tags)
                                data.tags = [];
								
                            data.tags.push({
                                tag: tag,
                                count: 1,
                                used: new Date()
                            });
                        }
                    });
                    pipDataCache.store(cacheName, data);
                }
            };

            function tagsUpdateDecorator(params, successCallback) {
                return function(item) {
                    tagsUpdate(params, item);

                    if (successCallback) successCallback(item);
                };
            };

			function readTags(params, successCallback, errorCallback) {
				params.resource = 'partyTags';
				params.singleResult = true;

				return pipDataCache.retrieveOrLoad(params, successCallback, errorCallback);
			};

			// Todo: Add updateTags method

			function onTagsUpdate(params, successCallback) {
				return tagsUpdateDecorator(params, successCallback);
			};
        }]
    );

})();


/**
 * @file Tips data cache
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTipsCache', ['pipTipsData']);

    thisModule.service('pipTipsCache',
        ['pipEnums', 'pipDataCache', 'pipTagsCache', function (pipEnums, pipDataCache, pipTagsCache) {

            return {
                readTips: readTips,
                onTipCreate: onTipCreate,
                onTipUpdate: onTipUpdate,
                onTipDelete: onTipDelete                
            };

            function readTips(params, successCallback, errorCallback) {
                params = params || {};
                params.resource = 'tips';
                params.item = params.item || {};

                return pipDataCache.retrieveOrLoad(params, successCallback, errorCallback);
            };
            
            function onTipCreate(params, successCallback) {
                return pipDataCache.addDecorator(
                    'tips', params,
                    pipTagsCache.tagsUpdateDecorator(params, successCallback)
                );
            };

            function onTipUpdate(params, successCallback) {
                return pipDataCache.updateDecorator(
                    'tips', params,
                    pipTagsCache.tagsUpdateDecorator(params, successCallback)
                );
            };

            function onTipDelete(params, successCallback) {
                return pipDataCache.removeDecorator('tips', params, successCallback);
            };
                        
        }]
    );

})();


/**
 * @file User access permissions service
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipRest.Access', ['pipUtils', 'pipRest.Enums']);

    thisModule.factory('pipAccess', ['pipUtils', 'pipEnums', function (pipUtils, pipEnums) {

        function defaultAccess(account) {
            // Clone and set default values
            var user = _.defaults(
                {
                    // Fix id
                    id: account.id || account._id,
                    party_id: null,
                    party_name: null,
                    type: null,
                    owner: false,
                    manager: false,
                    contributor: false,
                    share_level: pipEnums.SHARE_LEVEL.WORLD
                },
                account
            );
    
            delete user._id;
    
            return user;
        };
    
        function fixAccess(user) {
            // Owner acts as his own manager
            user.manager = user.manager || user.owner;
    
            // Manager has contributor rights
            user.contributor = user.contributor || user.manager;
    
            // Managers and contributors can access at private level
            if (user.contributor)
                user.share_level = pipEnums.SHARE_LEVEL.PRIVATE;
    
            return user;
        }
    
        function overrideAccess(user, access) {
            // Copy over override
            user.party_id = access.party_id;
            user.party_name = access.party_name;
            user.type = access.type;
            user.owner = !!access.owner;
            user.manager = !!access.manager;
            user.contributor = !!access.contributor;
            user.share_level = access.share_level || pipEnums.SHARE_LEVEL.WORLD;
    
            // Party can be set as an object
            if (access.party) {
                user.party_id = access.party.id || access.party._id;
                user.party_name = access.party.name;
            }
    
            // Make access settings consistent and return
            return fixAccess(user);
        };
    
        function asOwner(account) {
            // Skip if no account set
            if (account == null) return undefined;
    
            // Construct default user
            var user = defaultAccess(account);
    
            // Set owner access rights
            user.party_id = user.id;
            user.party_name = user.name;
            user.type = null;
            user.owner = true;
            user.manager = true;
            user.contributor = true;
            user.share_level = pipEnums.SHARE_LEVEL.PRIVATE;
    
            return user;
        };
    
        function toParty(account, party) {
            // Skip if no account set
            if (account == null) return undefined;
    
            // If no party set then assume owner access
            if (party == null) return asOwner(account);
    
            var 
                userId = account.id || account._id,
                partyId = party.id || party._id || party,
                partyName = party.name || account.name;
    
            // If user and party are the same then
            if (userId == partyId) return asOwner(account);
    
            // Set default values
            var user = defaultAccess(account);
            user.party_id = partyId;
            user.party_name = partyName;
    
            // Identify maximum access level
            _.each(user.party_access, function (access) {
                if (pipUtils.equalObjectIds(partyId, access.party_id)) {
                    user.party_name = access.party_name;
                    user.type = access.type;
                    user.manager = user.manager || access.manager;
                    user.contributor = user.contributor || access.contributor;
                    user.share_level = Math.max(user.share_level, access.share_level);
                }
            });
    
            // Make access settings consistent and return
            return fixAccess(user);
        };
    
        // Can be used for testing
        function override(account, access) {
            // Skip if no account set
            if (account == null) return undefined;
    
            // Set default values
            var user = defaultAccess(account);
    
            // If no override return plain user
            if (access) overrideAccess(user, access);
    
            return user;
        };
    
        // Can be used for testing
        function toPartyWithOverride(account, party, access) {
            var user = toParty(account, party);
    
            // If no override return plain user
            if (access) overrideAccess(user, access);
    
            return user;
        };
        
        return {
            asOwner: asOwner,
            toParty: toParty,
            override: override,
            toPartyWithOverride: toPartyWithOverride
        };
    }]);

})();

/**
 * @file Application secure router
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global angular */
 
(function () {
    'use strict';
    
    var thisModule = angular.module('pipRest.State', ['pipState', 'pipRest.Session', 'pipRest.Access', 'pipSessionCache']);

    thisModule.config(
        ['$locationProvider', '$httpProvider', function($locationProvider, $httpProvider) {
            // Attach interceptor to react on unauthorized errors
            $httpProvider.interceptors.push('pipAuthHttpResponseInterceptor');
        }]
    );

    thisModule.run(
        ['$rootScope', 'pipState', 'pipSession', 'pipAuthState', function($rootScope, pipState, pipSession, pipAuthState) {

            // Intercept routes
            $rootScope.$on('$stateChangeStart', stateChangeStart);
            // Process unauthorized access error
            $rootScope.$on('pipUnauthorizedRedirect', unauthorizedRedirect);
            // Handle other errors
            $rootScope.$on('pipMaintenanceError', maintenanceError);
            $rootScope.$on('pipNoConnectionError', noConnectionError);
            $rootScope.$on('pipMissingRouteError', missingRouteError);
            $rootScope.$on('pipUnknownError', unknownError);

            function stateChangeStart(event, toState, toParams, fromState, fromParams) {
                // Implement redirect mechanism
                if (pipAuthState.redirect(event, toState, toParams, $rootScope)) {
                    return;
                }

                // todo apply in all tool
                // If user is not authorized then switch to signin
                if ((toState.auth  || toState.auth === undefined) && !pipSession.opened()) {
                    event.preventDefault();

                    var redirectTo = pipState.href(toState.name, toParams);

                    // Remove hashtag
                    if (redirectTo.length > 0 && redirectTo[0] == '#') {
                        redirectTo = redirectTo.substring(1);
                    }

                    pipAuthState.goToSignin({ redirect_to: redirectTo, toState: toState, toParams: toParams});

                    return;
                }

                // Signout and move to unauthorized page
                if (toState.name == pipAuthState.signoutState()) {
                    event.preventDefault();
                    pipSession.signout();
                    pipAuthState.goToUnauthorized({});
                    return;
                }

                // Move user to authorized page
                if (toState.name == pipAuthState.unauthorizedState()
                    && pipSession.opened()) {

                    event.preventDefault();
                    pipAuthState.goToAuthorized({});
                    return;
                }
            }

            function unauthorizedRedirect(event, params) {
                pipSession.close();
                pipAuthState.goToSignin(params);
            }

            function maintenanceError(event, params) {
                pipAuthState.goToErrors('errors_maintenance', params);
            }

            function noConnectionError(event, params) {
                pipAuthState.goToErrors('errors_no_connection', params);
            }

            function missingRouteError(event, params) {
                pipAuthState.goToErrors('errors_missing_route', params);
            }

            function unknownError(event, params) {
                pipAuthState.goToErrors('errors_unknown', params);
            }

        }]
    );

    thisModule.factory('pipAuthHttpResponseInterceptor',
        ['$q', '$location', '$rootScope', function ($q, $location, $rootScope) {
            return {
                response: function (response) {
                    // When server sends Non-authenticated response
                    if (response.status === 401) {
                        console.error("Response 401");
                    }                    
                    return response || $q.when(response);
                },
                
                responseError: function (rejection) {


                    var toState = $rootScope.$state && $rootScope.$state.name ? $rootScope.$state.name : null,
                        toParams = $rootScope.$state && $rootScope.$state.params ? $rootScope.$state.params : null;
                    // When server sends Non-authenticated response
                    switch (rejection.status) {
                        case 401:
                        case 440:
                            console.error("Response Error 401", rejection);
                            // Redirect to unauthorized state
                            $rootScope.$emit('pipUnauthorizedRedirect', {
                                redirect_to:  toState && toParams && toParams.redirect_to ? '': $location.url(),
                                toState: toState,
                                toParams: toParams
                            });

                            break;
                        case 503:
                             //available (maintenance)
                            $rootScope.$emit('pipMaintenanceError', {
                                error: rejection
                            });

                            console.error("errors_maintenance", rejection);
                            break;
                        case -1:
                        
                            if (!$rootScope.$user || !$rootScope.$party)
                                $rootScope.$emit('pipNoConnectionError', {
                                error: rejection
                                });

                            console.error("errors_no_connection", rejection);
                            break;
                        default:
                            // unhandled error (internal)
                            //var code = rejection.code || (rejection.data || {}).code || null;
                            //
                            //// if not our server error generate errorEvent
                            //if (!code) {
                            //    $rootScope.$emit('pipUnknownError', {
                            //        error: rejection
                            //    });
                            //}

                            console.error("errors_unknown", rejection);
                            break;
                    }

                    return $q.reject(rejection);
                }
            }
        }]
    );

    thisModule.provider('pipAuthState', ['pipStateProvider', function(pipStateProvider) {
        // Configuration of redirected states
        userResolver.$inject = ['pipSessionCache'];
        partyResolver.$inject = ['pipSessionCache', '$stateParams'];
        connectionResolver.$inject = ['pipSessionCache', '$stateParams'];
        settingsResolver.$inject = ['pipSessionCache'];
        var 
            signinState = null,
            signoutState = null,
            authorizedState = '/',
            unauthorizedState = '/';

        this.signinState = setSigninState;
        this.signoutState = setSignoutState;
        this.authorizedState = setAuthorizedState;
        this.unauthorizedState = setUnauthorizedState;

        this.redirect = pipStateProvider.redirect;
        this.state = stateOverride;

        this.$get = ['pipState', function (pipState) {            
            pipState.signinState = function() { return signinState; };
            pipState.signoutState = function() { return signoutState; };
            pipState.authorizedState = function() { return authorizedState; };            
            pipState.unauthorizedState = function() { return unauthorizedState; };
            
            pipState.goToErrors = function(toState, params) {
                if (toState == null)
                    throw new Error('Error state was not defined');

                pipState.go(toState, params);
            };

            pipState.goToSignin = function(params) {
                if (signinState == null)
                    throw new Error('Signin state was not defined');

                pipState.go(signinState, params);
            };

            pipState.goToSignout = function(params) {
                if (signoutState == null)
                    throw new Error('Signout state was not defined');
                    
                pipState.go(signoutState, params);  
            };

            pipState.goToAuthorized = function(params) {
                if (authorizedState == null)
                    throw new Error('Authorized state was not defined');
                                        
                pipState.go(authorizedState, params);
            };

            pipState.goToUnauthorized = function(params) {
                if (unauthorizedState == null)
                    throw new Error('Unauthorized state was not defined');
                    
                pipState.go(unauthorizedState, params);  
            };

            return pipState;
        }];

        return;        
        //--------------------------------

        function setSigninState(newSigninState) {
            if (newSigninState)
                signinState = newSigninState;
            return signinState;
        }

        function setSignoutState(newSignoutState) {
            if (newSignoutState)
                signoutState = newSignoutState;
            return signoutState;
        }

        function setAuthorizedState(newAuthorizedState) {
            if (newAuthorizedState)
                authorizedState = newAuthorizedState;
            return authorizedState;
        }

        function setUnauthorizedState(newUnauthorizedState) {
            if (newUnauthorizedState)
                unauthorizedState = newUnauthorizedState;
            return unauthorizedState;
        }

        // Overriding state configuration in ui-router to add auth resolves
        function stateOverride(stateName, stateConfig) {
            if (stateName == null)
                throw new Error('stateName cannot be null');
            if (stateConfig == null)
                throw new Error('stateConfig cannot be null');

            // todo apply in all tool
            if (stateConfig.auth || stateConfig.authenticate) {
                stateConfig.resolve = stateConfig.resolve || {};

                stateConfig.resolve.user = /* @ngInject */ userResolver;
                stateConfig.resolve.party = /* @ngInject */ partyResolver;
                stateConfig.resolve.connection = /* @ngInject */ connectionResolver;
                stateConfig.resolve.setting = /* @ngInject */ settingsResolver;
            }    

            pipStateProvider.state(stateName, stateConfig);

            return this;
        }

        function userResolver(pipSessionCache) {
            return pipSessionCache.readUser();
        }

        function partyResolver(pipSessionCache, $stateParams) {
            return pipSessionCache.readParty($stateParams);
        }

        function connectionResolver(pipSessionCache, $stateParams) {
            return pipSessionCache.readConnection($stateParams);
        }

        function settingsResolver(pipSessionCache) {
            return pipSessionCache.readSettings();
        }

    }]);

})();
/**
 * @file Rest API enumerations service
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipRest.Enums', []);

    thisModule.factory('pipEnums', function () {

        var enums = {};
    
        // Converts enumeration values to string array
        function enumToArray(obj) {
            var result = [];
    
            for (var key in obj)
                if (obj.hasOwnProperty(key))
                    result.push(obj[key]);

            return result;
        };
    
        enums.SHARE_LEVEL = {
            WORLD: 0, // Everyone
            OUTER: 1, // Familiar
            INNER: 2, // Trusted
            PRIVATE: 3 // Private
        };
    
        enums.URGENCY = {
            LOW: 1,
            NORMAL: 500,
            HIGH: 1000,
            MIN: 0,
            MAX: 1000
        };
        enums.URGENCIES = enumToArray(enums.URGENCY);
    
        enums.IMPORTANCE = {
            LOW: 1,
            NORMAL: 500,
            HIGH: 1000,
            MIN: 0,
            MAX: 1000
        };
        enums.IMPORTANCES = enumToArray(enums.IMPORTANCE);
    
        enums.CONFIDENTIALITY = {
            PUBLIC: 0, // No sharing restrictions level - ANY, groups = yes, parties = yes
            SENSITIVE: 1, // No public sharing - level >= OUTER, groups = yes, parties = yes
            CLASSIFIED: 2, // Only selected parties - level = PRIVATE, groups = yes, parties = yes
            SECRET: 3 // No sharing - level = PRIVATE, groups = no, parties = no
        };
        enums.CONFIDENTIALITIES = enumToArray(enums.CONFIDENTIALITY);
    
        enums.LEVEL = {
            NONE: 0,
            LOW: 1,
            LOW_MEDIUM: 250,
            MEDIUM: 500,
            MEDIUM_HIGH: 750,
            HIGH: 1000,
            MIN: 0,
            MAX: 1000
        };
    
        enums.LANGUAGE = {
            ENGLISH: 'en',
            SPANISH: 'es',
            PORTUGUESE: 'pt',
            FRENCH: 'fr',
            GERMAN: 'de',
            RUSSIAN: 'ru'
        };
        enums.LANGUAGES = enumToArray(enums.LANGUAGE);
    
        enums.STAT_TYPE = {
            DAILY: 'daily',
            MONTHLY: 'monthly',
            YEARLY: 'yearly',
            TOTAL: 'total'
        };
        enums.STAT_TYPES = enumToArray(enums.STAT_TYPE);
    
        enums.STAT_BATCH_OPERATION = {
            RECORD_SYSTEM_STATS: 'record system stats',
            RECORD_PARTY_STATS: 'record party stats'
        };
    
        enums.SERVER_TYPE = {
            REALTIME_DB: 'r/t db master',
            HISTORIAN_DB: 'db slave',
            ANALYTICS: 'analytics',
            BUSINESS_LOGIC: 'business logic',
            REST_API: 'rest api',
            STATIC_CONTENT: 'static content',
            BACKUP_STORAGE: 'backup storage'
        };
        enums.SERVER_TYPES = enumToArray(enums.SERVER_TYPE);
    
        enums.SYSTEM_LOG_TYPE = {
            INFO: 'info',
            STOP: 'stop',
            START: 'start',
            RESTART: 'restart',
            UPGRADE: 'upgrade',
            MAINTENANCE: 'maintenance',
            WARNING: 'warning',
            ERROR: 'error'
        };
        enums.SYSTEM_LOG_TYPES = enumToArray(enums.SYSTEM_LOG_TYPE);
    
        enums.ACTIVITY_TYPE = {
            SIGNUP: 'signup',
            SIGNIN: 'signin',
            PASSWORD_CHANGED: 'password changed',
            PWD_RECOVERED: 'pwd recovered',
            EMAIL_VERIFIED: 'email verified',
            SETTINGS_CHANGED: 'settings changed',
            PARTNERED: 'partnered',
            TEAMED_UP: 'teamed up',
            FOLLOWED: 'followed',
            DISCONNECTED: 'disconnected',
            CREATED: 'created',
            UPDATED: 'updated',
            DELETED: 'deleted',
            ACCEPTED: 'accepted',
            REJECTED: 'rejected',
            JOINED: 'joined',
            COMPLETED: 'completed',
            CANCELED: 'canceled',
            PROGRESS: 'progress',
            POSTED: 'posted',
            BUZZED: 'buzzed',
            COMMENTED: 'commented',
            CHEERED: 'cheered',
            BOOED: 'booed'
        };
        enums.ACTIVITY_TYPES = enumToArray(enums.ACTIVITY_TYPE);
    
        enums.REFERENCE_TYPE = {
            PARTY: 'party',
            CONNECTION: 'connection',
            CONTACT: 'contact',
            MESSAGE: 'message',
            NOTE: 'note',
            AREA: 'area',
            GOAL: 'goal',
            EVENT: 'event',
            VISION: 'vision',
            COLLAGE: 'collage',
            POST: 'post',
            SUPPORT_CASE: 'support case',
            ANNOUNCE: 'announce',
            IMAGE_SET: 'image set',
            FEEDBACK: 'feedback',
            GUIDE: 'guide'
        };
        enums.REFERENCE_TYPES = enumToArray(enums.REFERENCE_TYPE);
    
        enums.CONTENT_TYPE = {
            TEXT: 'text',
            CHECKLIST: 'checklist',
            LOCATION: 'location',
            TIME: 'time',
            PICTURES: 'pictures',
            DOCUMENTS: 'documents'
        };
        enums.CONTENT_TYPES = enumToArray(enums.CONTENT_TYPE);
    
        enums.PARTY_TYPE = {
            PERSON: 'person',
            TEAM: 'team',
            AGENT: 'agent'
        };
        enums.PARTY_TYPES = enumToArray(enums.PARTY_TYPE);
    
        enums.GENDER = {
            MALE: 'male',
            FEMALE: 'female',
            NOT_SPECIFIED: 'n/s'
        };
        enums.GENDERS = enumToArray(enums.GENDER);
    
        enums.VISION_TYPE = {
            OVERALL: 'overall',
            ROLE: 'role',
            MODEL: 'model',
            TIME: 'time'
        };
        enums.VISION_TYPES = enumToArray(enums.VISION_TYPE);
    
        enums.AREA_TYPE = {
            CATEGORY: 'category',
            AREA: 'area'
        };
        enums.AREA_TYPES = enumToArray(enums.AREA_TYPE);
    
        enums.GOAL_TYPE = {
            GOAL: 'goal',
            OBJECTIVE: 'objective',
            DREAM: 'dream',
            //ASPIRATION: 'aspiration',
            ACCOMPLISHMENT: 'accomplishment',
            //CHORE: 'chore',
            //HABIT: 'habit',
            TASK: 'task',
            ROUTINE: 'routine'
        };
        enums.GOAL_TYPES = enumToArray(enums.GOAL_TYPE);
    
        enums.PROCESS_NODE = {
            START: 'start',
            END: 'end',
            EVENT: 'event',
            AWAIT: 'await',
            DECISION: 'decision',
            ACTIVITY: 'activity'
        };
        enums.PROCESS_NODES = enumToArray(enums.PROCESS_NODE);
    
        enums.CALCULATION_METHOD = {
            LAST_VALUE: 'last value',
            SUM: 'sum',
            MAX: 'max',
            MIN: 'min',
            AVERAGE: 'average'
        };
        enums.CALCULATION_METHODS = enumToArray(enums.CALCULATION_METHOD);
    
        enums.EXECUTION_STATUS = {
            NEW: 'new',
            ASSIGNED: 'assigned',
            IN_PROGRESS: 'in progress',
            VERIFYING: 'verifying',
            ON_HOLD: 'on hold',
            CANCELED: 'canceled',
            COMPLETED: 'completed'
        };
        enums.EXECUTION_STATUSES = enumToArray(enums.EXECUTION_STATUS);
    
        enums.CONTRIBUTOR_ROLE = {
            UNDEFINED: 'undefined',
            RESPONSIBLE: 'responsible',
            ACCOUNTABLE: 'accountable',
            CONSULTED: 'consulted',
            INFORMED: 'informed'
        };
        enums.CONSTRIBUTOR_ROLES = enumToArray(enums.CONTRIBUTOR_ROLE);
    
        enums.ACCEPTANCE = {
            JOINED: 'joined',
            INVITED: 'invited',
            ACCEPTED: 'accepted'
            //REJECTED: 'rejected'
        };
        enums.ACCEPTANCES = enumToArray(enums.ACCEPTANCE);
    
        enums.ACCEPT_ACTION = {
            INVITE: 'invite',
            JOIN: 'join',
            ACCEPT: 'accept',
            REJECT: 'reject'
        };
        enums.ACCEPT_ACTIONS = enumToArray(enums.ACCEPT_ACTION);
    
        enums.JOIN_METHOD = {
            INVITE: 'invite',
            APPROVE: 'approve',
            OPEN: 'open'
        };
        enums.JOIN_METHODS = enumToArray(enums.JOIN_METHOD);
    
        enums.SKILL_LEVEL = {
            NOVICE: 'novice',
            INTERMEDIATE: 'intermediate',
            ADVANCED: 'advanced',
            EXPERT: 'expert'
        };
        enums.SKILL_LEVELS = enumToArray(enums.SKILL_LEVEL);
    
        enums.FEEDBACK_TYPE = {
            SUPPORT: 'support',
            TEAM: 'team',
            MEETUP: 'meetup',
            COPYRIGHT: 'copyright',
            BUSINESS: 'business',
            ADVERTISEMENT: 'ad'
        };
        enums.FEEDBACK_TYPES = enumToArray(enums.FEEDBACK_TYPE);
    
        enums.NOTE_CATEGORY = {
            GENERAL: 'general',
            UNFINISHED: 'unfinished',
            ULTIMATE_TODO: 'ultimate todo'
        };
        enums.NOTE_CATEGORIES = enumToArray(enums.NOTE_CATEGORY);
    
        enums.CONNECTION_TYPE = {
            PARTNER: 'partner',
            MEMBER: 'member',
            FOLLOW: 'follow',
            AUTOMATION: 'automation'
        };
        enums.CONNECTION_TYPES = enumToArray(enums.CONNECTION_TYPE);
    
        enums.EVENT_TYPE = {
            INSTANCE: 'instance',
            RECURRENCE: 'recurrence',
            AUTO_INSTANCE: 'auto',
            TIME_ENTRY: 'time entry'
        };
        enums.EVENT_TYPES = enumToArray(enums.EVENT_TYPE);
    
        enums.EVENT_CATEGORY = {
            DAILY: 'daily',
            WEEKLY: 'weekly',
            MONTHLY: 'monthly',
            YEARLY: 'yearly'
            //    COULDDO: 'coulddo'
        };
        enums.EVENT_CATEGORIES = enumToArray(enums.EVENT_CATEGORY);
    
        enums.COMMENT_TYPE = {
            BUZZ: 'buzz',
            CHEER: 'cheer',
            BOO: 'boo',
            COMMENT: 'comment'
        };
        enums.COMMENT_TYPES = enumToArray(enums.COMMENT_TYPE);
    
        enums.POST_TYPE = {
            INFO: 'info',
            QUESTION: 'question',
            ISSUE: 'issue',
            REPORT: 'report',
            FORECAST: 'forecast'
        };
        enums.POST_TYPES = enumToArray(enums.POST_TYPE);
    
        enums.MESSAGE_TYPE = {
            REGULAR: 'regular',
            EMAIL: 'email',
            INVITATION: 'invitation'
        };
        enums.MESSAGE_TYPES = enumToArray(enums.MESSAGE_TYPE);
    
        enums.NOTIFICATION_TYPE = {
            GREETING: 'greeting',
            MESSAGE: 'message',
    
            PARTNER_INVITE: 'partner invite',
            PARTNER_RESPONSE_ACCEPTED: 'partner response accepted',
            PARTNER_RESPONSE_REJECTED: 'partner response rejected',
            PARTNER_JOINED: 'partner joined',
            MEMBER_INVITE: 'member invite',
            MEMBER_REQUEST: 'member request',
            MEMBER_RESPONSE_ACCEPTED: 'member response accepted',
            MEMBER_RESPONSE_REJECTED: 'member response rejected',
            MEMBER_JOINED: 'member joined',
            FOLLOWER_JOINED: 'follower joined',
    
            ENTITY_REQUEST: 'entity request',
            ENTITY_REQUEST_ACCEPTED: 'entity request accepted',
            ENTITY_REQUEST_REJECTED: 'entity request rejected',
            ENTITY_INVITE: 'entity invite',
            ENTITY_INVITE_ACCEPTED: 'entity invite accepted',
            ENTITY_INVITE_REJECTED: 'entity invite rejected',
            ENTITY_JOINED: 'entity joined',
    
            VERIFY_EMAIL: 'verify email',
            COMPLETE_PROFILE: 'complete profile'
        };
        enums.NOTIFICATION_TYPES = enumToArray(enums.NOTIFICATION_TYPE);
    
        enums.NOTIFICATION_BATCH_OPERATION = {
            CREATE: 'create',
            REPLY: 'reply',
            CLOSE: 'close',
            DELETE: 'delete'
        };
    
        enums.SUPPORT_CASE_CATEGORY = {
            ACCOUNT: 'account',
            BILLING: 'billing',
            TECHNICAL: 'technical',
            GENERAL: 'general'
        };
        enums.SUPPORT_CASE_CATEGORIES = enumToArray(enums.SUPPORT_CASE_CATEGORY);
    
        enums.ANNOUNCE_TYPE = {
            APP: 'app',
            EMAIL: 'email',
            APP_AND_EMAIL: 'app and email'
        };
        enums.ANNOUNCE_TYPES = enumToArray(enums.ANNOUNCE_TYPE);
    
        enums.ANNOUNCE_CATEGORY = {
            GENERAL: 'general',
            MAINTENANCE: 'maintenance',
            NEW_RELEASE: 'new release',
            SURVEY: 'survey'
        };
        enums.ANNOUNCE_CATEGORIES = enumToArray(enums.ANNOUNCE_CATEGORY);
    
        enums.GUIDE_TYPE = {
            INTRO: 'intro',
            TOPIC: 'topic',
            CONTEXT: 'context',
            TIP: 'tip',
            NEW_RELEASE: 'new release'
        };
        enums.GUIDE_TYPES = enumToArray(enums.GUIDE_TYPE);
    
        enums.EMAIL_TYPE = {
            HOME: 'home',
            WORK: 'work',
            OTHER: 'other'
        };
        enums.EMAIL_TYPES = enumToArray(enums.EMAIL_TYPE);
    
        enums.ADDRESS_TYPE = {
            HOME: 'home',
            WORK: 'work',
            OTHER: 'other'
        };
        enums.ADDRESS_TYPES = enumToArray(enums.ADDRESS_TYPE);
    
        enums.ADDRESS_TYPE = {
            HOME: 'home',
            WORK: 'work',
            OTHER: 'other'
        };
        enums.ADDRESS_TYPES = enumToArray(enums.ADDRESS_TYPE);
    
        enums.PHONE_TYPE = {
            MOBILE: 'mobile',
            WORK: 'work',
            HOME: 'home',
            MAIN: 'main',
            WORK_FAX: 'work fax',
            HOME_FAX: 'home fax',
            OTHER: 'other'
        };
        enums.PHONE_TYPES = enumToArray(enums.PHONE_TYPE);
    
        enums.MESSANGER_TYPE = {
            SKYPE: 'skype',
            GOOGLE_TALK: 'google talk',
            AIM: 'aim',
            YAHOO: 'yahoo',
            QQ: 'qq',
            MSN: 'msn',
            ICQ: 'icq',
            JABBER: 'jabber',
            OTHER: 'other'
        };
        enums.MESSANGER_TYPES = enumToArray(enums.MESSANGER_TYPE);
    
        enums.WEB_ADDRESS_TYPE = {
            PROFILE: 'profile',
            BLOG: 'blog',
            HOME_PAGE: 'home page',
            WORK: 'work',
            PORTFOLIO: 'portfolio',
            OTHER: 'other'
        };
        enums.WEB_ADDRESS_TYPES = enumToArray(enums.WEB_ADDRESS_TYPE);
    
        enums.DASHBOARD_TILE_SIZE = {
            SMALL: 'small',
            WIDE: 'wide',
            LARGE: 'large'
        };
        enums.DASHBOARD_TILE_SIZES = enumToArray(enums.DASHBOARD_TILE_SIZE);

        return enums;
    });
    
})();

/**
 * @file PipServices Rest API
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo:
 * - Separate application and administrative APIs
 */

(function () {
    'use strict';

    var thisModule = angular.module('pipRest', [
        'ngResource',
        'pipRest.Enums', 'pipRest.Access',
        'pipRest.Session', 'pipRest.State'
    ]);

    thisModule.provider('pipRest', ['$httpProvider', function ($httpProvider) {
        var serverUrl = '';
        var serverUrlFixed = false;
        var api = [];
        this.addApi = addApi;

        function addApi(extension) {
            for (var request in extension) {
                api[request] = extension[request];
            }
        };

        // Set default API version
        $httpProvider.defaults.headers.common['api-version'] = '1.0';


        this.version = function (newVersion) {
            if (newVersion)
                $httpProvider.defaults.headers.common['api-version'] = newVersion;
            return $httpProvider.defaults.headers.common['api-version'];
        };

        this.serverUrlFixed = function (value) {
            if (value === true || value === 'on')
                serverUrlFixed = value;
            return serverUrlFixed;
        };

        this.serverUrl = function (newServerUrl) {
            if (newServerUrl)
                serverUrl = newServerUrl;
            return newServerUrl;
        };

        this.$get = ['$rootScope', '$http', '$resource', function ($rootScope, $http, $resource) {

            function createResource(url, path, paramDefaults, actions) {
                url = url || serverUrl;
                return $resource(url + path, paramDefaults, actions);
            };

            function createOperation(url, path) {
                url = url || serverUrl;
                return $resource(url + path, {},
                    {
                        call: {method: 'POST'}
                    }
                );
            };

            function createCollection(url, path, paramDefaults) {
                url = url || serverUrl;
                return $resource(url + path,
                    paramDefaults || {id: '@id'},
                    {
                        update: {method: 'PUT'}
                    }
                );
            };

            function createPagedCollection(url, path, paramDefaults) {
                url = url || serverUrl;
                return $resource(url + path,
                    paramDefaults || {id: '@id'},
                    {
                        page: {method: 'GET', isArray: false},
                        update: {method: 'PUT'}
                    }
                );
            };

            function createPartyCollection(url, path, paramDefaults) {
                return createPagedCollection(url, path, paramDefaults ||
                    {
                        id: '@id',
                        party_id: '@party_id'
                    }
                );
            };

            var restApi = {
                
                version: function (newVersion) {
                    if (newVersion)
                        $httpProvider.defaults.headers.common['api-version'] = newVersion;
                    return $httpProvider.defaults.headers.common['api-version'];
                },

                serverUrl: function (newServerUrl) {
                    if (newServerUrl) {
                        serverUrl = newServerUrl;
                    }
                    return serverUrl;
                },

                userId: function () {
                    return $http.defaults.headers.common['user-id'];
                },

                serverUrlFixed: function () {
                    return serverUrlFixed;
                },

                sessionId: function () {
                    return $http.defaults.headers.common['session-id'];
                },

                // Used in routing
                partyId: function ($stateParams) {
                    return $stateParams.party_id || $http.defaults.headers.common['user-id'];
                },

                about: function (url) {
                    return createResource(url, '/api/about');
                },

                session: function (userId, sessionId) {
                    $http.defaults.headers.common['session-id'] = sessionId;
                    $http.defaults.headers.common['user-id'] = userId;
                },

                signin: function (url) {
                    return createOperation(url, '/api/signin');
                },

                signout: function (url) {
                    return createOperation(url, '/api/signout');
                },

                signup: function (url) {
                    return createOperation(url, '/api/signup');
                },

                recoverPassword: function (url) {
                    return createOperation(url, '/api/recover_password');
                },

                resetPassword: function (url) {
                    return createOperation(url, '/api/reset_password');
                },

                changePassword: function (url) {
                    return createOperation(url, '/api/change_password');
                },

                requestEmailVerification: function (url) {
                    return createCollection(url, '/api/users/:party_id/resend_email_verification');
                },

                verifyEmail: function (url) {
                    return createOperation(url, '/api/verify_email');
                },

                signupValidate: function (url) {
                    return createOperation(url, '/api/signup_validate');
                },

                users: function (url) {
                    return createPagedCollection(url, '/api/users/:id');
                },

                currentUser: function (url) {
                    return createResource(url, '/api/users/current',
                        {},
                        {
                            get: {method: 'GET', isArray: false}
                        }
                    );
                },

                userSessions: function (url) {
                    return createPartyCollection(url, '/api/users/:party_id/sessions/:id');
                },

                parties: function (url) {
                    return createPagedCollection(url, '/api/parties/:id');
                },

                partySettings: function (url) {
                    return createPartyCollection(url, '/api/parties/:party_id/settings');
                },

                serverActivities: function (url) {
                    return createPagedCollection(url, '/api/servers/activities/:id');
                },

                guides: function (url) {
                    return createPagedCollection(url, '/api/guides/:id');
                },

                tips: function (url) {
                    return createPagedCollection(url, '/api/tips/:id');
                },

                image_sets: function (url) {
                    return createPagedCollection(url, '/api/image_sets/:id');
                },

                images: function (url) {
                    return createPagedCollection(url, '/api/images/search');
                },

                feedbacks: function (url) {
                    return createPartyCollection(url, '/api/feedbacks/:id');
                },

                announces: function (url) {
                    return createPagedCollection(url, '/api/announcements/:id');
                },

                // for testing
                //--------------

                createResource: createResource,
                createOperation: createOperation,
                createCollection: createCollection,
                createPagedCollection: createPagedCollection,
                createPartyCollection: createPartyCollection

            };

            function addApi() {
                for (var call in api) {
                    restApi[call] = api[call];
                }
            };

            addApi();


            return restApi;
        }];
    }]);

})();

/**
 * @file Session service for PipServices Rest API
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function () {
    'use strict';

    var thisModule = angular.module('pipRest.Session', ['ngCookies', 'pipRest']);

    thisModule.run(['pipSession', function(pipSession) {
        // Reload session to avoid signin
        pipSession.reopen();
    }]);

    thisModule.factory('pipSession', 
        ['$rootScope', '$http', 'localStorageService', '$cookieStore', 'pipRest', 'pipTimer', function ($rootScope, $http, localStorageService, $cookieStore, pipRest, pipTimer) {
            var 
                currentOperation = undefined,
                sessionId, userId, serverUrl;

            return {
                opened: opened,
                userId: getUserId,
                sessionId: getSessionId,
                serverUrl: getServerUrl,

                lastUsedEmail: lastUsedEmail,
                //lastUsedPassword: lastUsedPassword,
                usedServers: usedServers,
                usedServerUrls: usedServerUrls,

                signin: signin,
                abort: abort,
                signout: signout,

                open: open,
                close: close,
                reopen: reopen
            };
            //-----------------------

            // Session Ids
            //---------------

            function getUserId() {
                return userId;
            };

            function getSessionId() {
                return sessionId;  
            };

            function getServerUrl() {
                return serverUrl || localStorageService.get('serverUrl');
            };

            function opened() {
                var isOpened = (sessionId !== '' && sessionId !== null && sessionId !== undefined) &&
                    (userId !== '' && userId !== null && userId !== undefined) &&
                    (serverUrl !== '' && serverUrl !== null && serverUrl !== undefined);

                return isOpened;
            };

            // Saved connection settings
            //----------------------------
            
            function lastUsedEmail(serverUrl) {
                var servers = localStorageService.get('servers');
                if (servers && servers[serverUrl]) {
                    return servers[serverUrl].email;
                }
                return undefined;
            };

            function usedServers() {
                return localStorageService.get('servers') || {};
            };

            function usedServerUrls() {
                var 
                    servers = localStorageService.get('servers'),
                    serverUrls = [], serverUrl;
                        
                for (var prop in servers) {
                    if (servers.hasOwnProperty(prop)) {
                        serverUrl = servers[prop].serverUrl;
                        if (serverUrl) {
                            serverUrls.push(serverUrl);
                        }
                    }
                }

                return serverUrls;
            };

            // Session management
            //---------------------

            function signin(params, successCallback, errorCallback) {
                var 
                    serverUrl = params.serverUrl,
                    email = params.email,
                    password = params.password,
                    remember = params.remember,
                    adminOnly = !!params.adminOnly,
                    thisOperation = new Date().getTime();

                currentOperation = thisOperation;

                $http.defaults.headers.common['session-id'] = undefined;
                $http.defaults.headers.common['user-id'] = undefined;
                $http.defaults.headers.common['account-id'] = undefined;

                pipRest.signin(serverUrl).call(
                    { 
                        email: email, 
                        password: password,
                        remember: remember
                    },
                    function(user) {
                        if (currentOperation != thisOperation) {
                            return;
                        } else {
                            currentOperation = undefined;

                            if (adminOnly && !user.admin) {
                                errorCallback('ERROR_ADMIN_ONLY_ACCESS');
                            } else {
                                open(serverUrl, user, remember);
                                $rootScope.$broadcast('pipAutoPullChanges');
                                successCallback(user);
                            }
                        }
                    }, 
                    function(error) {
                        if (currentOperation != thisOperation) {
                            return;
                        } else {
                            currentOperation = undefined;
                            errorCallback(error);   
                        }
                    }
                );
            };

            function signup(params, successCallback, errorCallback) {
                var 
                    serverUrl = params.serverUrl,
                    name = params.name,
                    email = params.email,
                    password = params.password,
                    language = params.language,
                    remember = false,
                    thisOperation = new Date().getTime();

                pipRest.signup(serverUrl).call(
                    {
                        name: name,
                        email: email,
                        password: password,
                        language: language
                    },
                    function(user) {
                        if (currentOperation != thisOperation) {
                            return;
                        } else {
                            currentOperation = undefined;

                            open(serverUrl, user, remember);
                            successCallback(user);
                        }
                    }, 
                    function(error) {
                        if (currentOperation != thisOperation) {
                            return;
                        } else {
                            currentOperation = undefined;
                            errorCallback(error);   
                        }
                    }
                );
            };

            function abort() {
                currentOperation = undefined;
            };

            function signout(callback) {
                if (opened()) {
                    pipRest.signout().call({}, callback, callback);
                }

                close();
            };

            function open(currentServerUrl, user, remember) {
                sessionId = user.last_session_id;
                userId = user.id;
                serverUrl = currentServerUrl;

                // Set default headers for subsequent HTTP requests
                $http.defaults.headers.common['session-id'] = sessionId;
                $http.defaults.headers.common['user-id'] = userId;

                // Save ids into local storage
                if (remember) {
                    var servers = localStorageService.get('servers') || {};
                    servers[serverUrl] = {
                        serverUrl: serverUrl,
                        email: user.email
                    };
                    localStorageService.set('servers', servers);

                    localStorageService.set('sessionId', sessionId);
                    localStorageService.set('userId', userId);
                    localStorageService.set('serverUrl', serverUrl);
                }

                // Save into session id to retain the connection while browser is running
                // Remove from cookie store
                $cookieStore.put('user-id', userId);
                $cookieStore.put('session-id', sessionId);
                $cookieStore.put('server-url', serverUrl);

                // Save context parameters do not save
                if (!pipRest.serverUrlFixed()) pipRest.serverUrl(serverUrl);
                
                // Send broadcast
                // saveSession data
                $rootScope.$emit(
                    'pipSessionOpened', 
                    { 
                        serverUrl: serverUrl,
                        sessionId: sessionId,
                        userId: userId,
                        user: user
                    }
                );
                pipTimer.start();
            };

            function reopen() {
                userId = $cookieStore.get('user-id') || localStorageService.get('userId');
                sessionId = $cookieStore.get('session-id') || localStorageService.get('sessionId');
                serverUrl = $cookieStore.get('server-url') || localStorageService.get('serverUrl');

                // Set default headers for subsequent HTTP requests
                $http.defaults.headers.common['session-id'] = sessionId;
                $http.defaults.headers.common['user-id'] = userId;

                if (!pipRest.serverUrlFixed() || !pipRest.serverUrl()) pipRest.serverUrl(serverUrl);
                $rootScope.$serverUrl = pipRest.serverUrl();
                // Send broadcast
                $rootScope.$emit(
                    'pipSessionOpened', 
                    { 
                        serverUrl: serverUrl,
                        sessionId: sessionId,
                        userId: userId
                    }
                );
                pipTimer.start();
            };

            function close() {
                sessionId = undefined;
                userId = undefined;
                        
                // Unset default headers for subsequent HTTP requests
                $http.defaults.headers.common['session-id'] = undefined;
                $http.defaults.headers.common['user-id'] = undefined;

                // Remove ids into local storage
                localStorageService.remove('userId');
                localStorageService.remove('sessionId');

                // Remove from cookie store
                $cookieStore.remove('user-id');
                $cookieStore.remove('session-id');

                // RemoveToastMessages
                pipTimer.stop();

                // Send broadcast
                // RemoveToastMessages
                $rootScope.$emit('pipSessionClosed');
            };
        }]
    );

})();
/**
 * @file Announces data model
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global angular */
 
(function () {
    'use strict';

    var thisModule = angular.module('pipAnnouncesData', ['pipRest', 'pipDataModel', 'pipAnnouncesCache']);

    thisModule.provider('pipAnnouncesData', function () {

        // Read all announces
        this.readAnnouncesResolver = function () {
            return /* @ngInject */ ['$stateParams', 'pipRest', 'pipEnums', function ($stateParams, pipRest, pipEnums) {
                return pipRest.announces().query().$promise;
            }];
        };

        this.readCompletedAnnouncesResolver = function () {
            return /* @ngInject */ ['$stateParams', 'pipRest', 'pipEnums', function ($stateParams, pipRest, pipEnums) {
                return pipRest.announces().query( {
                        status: pipEnums.EXECUTION_STATUS.COMPLETED
                    }
                ).$promise;
            }];
        };

        this.readAnnounceResolver = function () {
            return /* @ngInject */ ['$stateParams', 'pipRest', function ($stateParams, pipRest) {
                return pipRest.announces().get({
                    id: $stateParams.id
                }).$promise;
            }];
        };

        // CRUD operations and other business methods
        this.$get = ['pipRest', '$stateParams', 'pipDataModel', 'pipAnnouncesCache', function (pipRest, $stateParams, pipDataModel, pipAnnouncesCache) {
            return {
                partyId: pipRest.partyId,
                readAnnounces: function (params, successCallback, errorCallback) {
                    params.resource = 'announces';
                    params.item = params.item || {};
                    params.item.search = $stateParams.search;
                    params.item.tags = $stateParams.search;
                    params.item.party_id = pipRest.partyId($stateParams);
                    return pipAnnouncesCache.readAnnounces(params, successCallback, errorCallback);
                },

                updateAnnounce: function (params, successCallback, errorCallback) {
                    params.resource = 'announces';
                    params.skipTransactionBegin = true;
                    params.skipTransactionEnd = false;
                    pipDataModel.update(
                        params,
                        pipAnnouncesCache.onAnnounceCreate(params, successCallback),
                        errorCallback
                    );
                },
                
                updateAnnounceWithFiles: function(params, successCallback, errorCallback) {
                    params.skipTransactionEnd = true;
                    pipDataModel.saveFiles(params, function() {
                        params.resource = 'announces';
                        params.skipTransactionBegin = true;
                        params.skipTransactionEnd = false;
                        pipDataModel.update(
                            params,
                            pipAnnouncesCache.onAnnounceUpdate(params, successCallback),
                            errorCallback
                        );
                    });
                },

                createAnnounceWithFiles: function(params, successCallback, errorCallback) {
                    params.skipTransactionEnd = true;
                    pipDataModel.saveFiles(params, function() {
                        params.resource = 'announces';
                        params.skipTransactionBegin = true;
                        params.skipTransactionEnd = false;
                        pipDataModel.create(
                            params,
                            pipAnnouncesCache.onAnnounceCreate(params, successCallback),
                            errorCallback
                        );
                    });
                },
                
                createAnnounce: function (params, successCallback, errorCallback) {
                    params.resource = 'announces';
                    params.skipTransactionBegin = true;
                    params.skipTransactionEnd = false;
                    pipDataModel.create(
                        params,
                        pipAnnouncesCache.onAnnounceCreate(params, successCallback),
                        errorCallback
                    );
                },

                deleteAnnounce: function(params, successCallback, errorCallback) {
                    params.resource = 'announces';
                    pipDataModel.remove(params, pipAnnouncesCache.onAnnounceDelete(params, successCallback), errorCallback);
                }
            }
        }];
    });

})();
/**
 * @file Registration of all data modules
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    angular.module('pipData', [
		'pipDataModel',
		'pipDataCache',
        
        'pipUsersData',
        'pipSettingsData',
        'pipSessionData',
        'pipTagsData',

        'pipAnnouncesData',
        'pipFeedbacksData',
        'pipImageSetsData',

        'pipTipsCache',
        'pipTipsData',

        'pipGuidesCache',
        'pipGuidesData'
    ]);
    
})();
/**
 * @file Application abstract data model
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular, _, async */

(function () {
    'use strict';

    var thisModule = angular.module('pipDataModel', ['pipUtils', 'pipRest']);

    thisModule.provider('pipDataModel', function() {
        
        this.$get = ['$stateParams', 'pipCollections', 'pipRest', function($stateParams, pipCollections, pipRest) {

            var api = [];
            
            for (var call in pipRest) {
                api[call] = pipRest[call];
            }

            // function extendApi(extension) {
            //     for (var call in extension) {
            //         api[call] = extension[call];
            //     }
            // }

            // Execute request to REST API
            function executeCurl(params, successCallback, errorCallback) {
                var t = params.transaction, tid;

                if (t && !params.skipTransactionBegin) {
                    tid = params.transactionId = t.begin(
                        params.transactionOperation || 'PROCESSING'
                    );
                    if (!tid) return;
                }

                return api[params.resource]()[params.operation](
                    params.item,
                    function (result) {
                        if (t && tid && t.aborted(tid)) return;
                        if (t && !params.skipTransactionEnd) t.end();
                        if (successCallback) successCallback(result);
                    },
                    function (error) {
                        if (t) t.end(error);
                        if (errorCallback) errorCallback(error);
                    }
                );
            };

            // Create an object and add it to object collection
            function createCurl(params, successCallback, errorCallback) {
                params.transactionOperation = params.transactionOperation || 'SAVING';
                params.operation = params.operation || 'save';
                
                return executeCurl(
                    params,
                    function(result) {
                        if (params.itemCollection)
                            params.itemCollection.push(result);

                        if (successCallback) successCallback(result);
                    },
                    function(error){
                        if (errorCallback) errorCallback(error);
                    }
                );
            };

            // Update an object and replace it in object collection
            function updateCurl(params, successCallback, errorCallback) {
                params.transactionOperation = params.transactionOperation || 'SAVING';
                params.operation = params.operation || 'update';

                return  executeCurl(
                    params,
                    function(result) {
                        if (params.itemCollection)
                            pipCollections.replaceBy(params.itemCollection, 'id', result.id, result);

                        if (successCallback) successCallback(result);
                    },
                    errorCallback
                );
            };

            // Update an object and remove it from object collection
            function deleteCurl(params, successCallback, errorCallback) {
                params.transactionOperation = params.transactionOperation || 'SAVING';
                params.operation = params.operation || 'remove';

                return executeCurl(
                    params,
                    function(result) {
                        if (params.itemCollection)
                            _.remove(params.itemCollection, {id: result.id || (params.object || {}).id || (params.item || {}).id});

                        if (successCallback) successCallback(result);
                    },
                    errorCallback
                );
            };

            // Read a collection of objects
            function readCurl(params, successCallback, errorCallback) {
                params.transactionOperation = params.transactionOperation || 'READING';
                params.operation = params.operation || 'query';

                return executeCurl(
                    params,
                    function(result) {
                        if (successCallback) successCallback(result);
                    },
                    errorCallback
                );
            };

            // Read a single object and add it into collection
            function readOneCurl(params, successCallback, errorCallback) {
                params.transactionOperation = params.transactionOperation || 'READING';
                params.operation = params.operation || 'page';

                return executeCurl(
                    params,
                    function(result) {
                        if (params.itemCollection && result) {
                            var index = _.findIndex(params.itemCollection, {id: result.id});
                            if (index >= 0) params.itemCollection[index] = result;
                            else params.itemCollection.push(result);
                        }

                        if (successCallback) successCallback(result);
                    },
                    errorCallback
                );
            };

            // Read a page and add results into object collection
            function pageCurl(params, successCallback, errorCallback) {
                params.transactionOperation = params.transactionOperation || 'READING';
                params.operation = params.operation || 'page';

                return executeCurl(
                    params,
                    function(result) {
                        if (params.itemCollection && result.data) {
                            for (var i = 0; i < result.data.length; i++)
                                params.itemCollection.push(result.data[i]);
                        }

                        if (successCallback) successCallback(result);
                    },
                    errorCallback
                );
            };

            // Save picture and document files
            function saveFilesCurl(params, successCallback, errorCallback) {
                var t = params.transaction, tid;

                // Start transaction if necessary
                if (t && !params.skipTransactionBegin) {
                    tid = params.transactionId = t.begin(
                        params.transactionOperation || 'SAVING'
                    );
                    if (!tid) return;
                }

//------------------

                var uploadFiles = [{
                    pictures: params.pictures,
                    documents: params.documents
                }];

                // from content
                if (params.item && params.item.content ) {
                    var saveResult = true;
                    async.eachSeries(_.union(params.item.content, uploadFiles),
                        function (obj, callback) {
                            // не выбран - пропускаем этот item  || нет этого события action
                            if ( !obj.pictures && !obj.documents ) {
                                callback();
                            } else {
                                if (obj.pictures) {
                                    // Save pictures first
                                    obj.pictures.save(
                                        function () {
                                            if (t && tid && t.aborted(tid)) {
                                                saveResult =  false;
                                                callback('aborted');
                                            }
                                            // Save documents second
                                            if (obj.documents) {
                                                obj.documents.save(
                                                    function () {
                                                        if (t && tid && t.aborted(tid)) {
                                                            saveResult =  false;
                                                            callback('aborted');
                                                        }
                                                        callback();
                                                    },
                                                    function (error) {
                                                        saveResult =  false;
                                                        callback(error);
                                                    }
                                                );
                                            } else {
                                                callback();
                                            }
                                        },
                                        function (error) {
                                            saveResult =  false;
                                            callback(error);
                                        }
                                    );
                                } else {
                                    if (obj.documents) {
                                        // Save documents first
                                        obj.documents.save(
                                            function () {
                                                if (t && tid && t.aborted(tid)) {
                                                    saveResult = false;
                                                    callback('aborted');
                                                }
                                                callback();
                                            },
                                            function (error) {
                                                saveResult = false;
                                                callback(error);
                                            }
                                        );
                                    }
                                }
                            }
                        },
                        function (error) {
                            if (!error && saveResult) {
                                // удаляем ненужные объекты перед сохранением
                                // вызываем колбек
                                if (t & !params.skipTransactionEnd) t.end();
                                _.each(params.item.content, function(item){
                                    delete item.pictures;
                                    delete item.documents;
                                });
                                if (successCallback) successCallback();
                            } else {
                                // вызываем ошибочный колбек
                                if (t) t.end(error);
                                if (errorCallback) {
                                    errorCallback(error);
                                }
                            }
                        }
                    );
                } else {
                    if (params.pictures) {
                        // Save pictures first
                        params.pictures.save(
                            function () {
                                if (t && tid && t.aborted(tid)) return;

                                // Save documents second
                                if (params.documents) {
                                    params.documents.save(
                                        function () {
                                            if (t && tid && t.aborted(tid)) return;
                                            // Do everything else
                                            if (t & !params.skipTransactionEnd) t.end();
                                            if (successCallback) successCallback();
                                        },
                                        function (error) {
                                            if (t) t.end(error);
                                            if (errorCallback) errorCallback(error);
                                        }
                                    );
                                } else {
                                    // Do everything else
                                    if (t & !params.skipTransactionEnd) t.end();
                                    if (successCallback) successCallback();
                                }
                            },
                            function (error) {
                                if (t) t.end(error);
                                if (errorCallback) errorCallback(error);
                            }
                        );
                    } else if (params.documents) {
                        // Save documents first
                        params.documents.save(
                            function () {
                                if (t && tid && t.aborted(tid)) return;
                                // Do everything else
                                if (t & !params.skipTransactionEnd) t.end();
                                if (successCallback) successCallback();
                            },
                            function (error) {
                                if (t) t.end(error);
                                if (errorCallback) errorCallback(error);
                            }
                        );
                    } else {
                        // Do everything else
                        if (t & !params.skipTransactionEnd) t.end();
                        if (successCallback) successCallback();
                    }
                }
            };

            // Abort transaction with file upload
            function abortFilesCurl(params) {
                if (params.pictures) 
                    params.pictures.abort();
                if (params.documents)
                    params.documents.abort();
                    if (params.transaction)
                    params.transaction.abort();  
            };

            return {
                // extendApi: extendApi,

                // Executing transactional requests to server
                execute: executeCurl,

                // Creating an object
                create: createCurl,

                // Updating an object
                update: updateCurl,
                save: updateCurl,

                // Deleting an object
                'delete': deleteCurl,
                remove: deleteCurl,

                // Reading objects
                read: readCurl,
                query: readCurl,

                // Reading a single object
                readOne: readOneCurl,
                get: readOneCurl,

                // Reading paginated results
                page: pageCurl,
                readPage: pageCurl,
                queryPage: pageCurl,

                // Saving files to file store
                saveFiles: saveFilesCurl,
                abortFiles: abortFilesCurl
            }
        }];
    });

})();

/**
 * @file Feedbacks data model
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipFeedbacksData', ['pipRest', 'pipDataModel']);

    thisModule.provider('pipFeedbacksData', function() {

        this.readFeedbacksResolver = function () {
            return /* @ngInject */ ['$stateParams', 'pipRest', function ($stateParams, pipRest) {
                return pipRest.feedbacks().query().$promise;
            }];
        };

        this.readFeedbackResolver = function () {
            return /* @ngInject */ ['$stateParams', 'pipRest', function ($stateParams, pipRest) {
                return pipRest.feedbacks().get({
                    id: $stateParams.id
                }).$promise;
            }];
        };

        this.$get = ['$stateParams', 'pipRest', 'pipDataModel', function($stateParams, pipRest, pipDataModel) {
            return {

                sendFeedback: function(params, successCallback, errorCallback) {
                    params.resource = 'feedbacks';
                    pipDataModel.create(params, successCallback, errorCallback);
                },

                createFeedbackWithFiles: function(params, successCallback, errorCallback) {
                    params.skipTransactionEnd = true;
                    pipDataModel.saveFiles(params, function() {
                        params.resource = 'feedbacks';
                        params.skipTransactionBegin = true;
                        params.skipTransactionEnd = false;
                        pipDataModel.create(params, successCallback, errorCallback);
                    });
                },

                updateFeedback: function (params, successCallback, errorCallback) {
                    params.resource = 'feedbacks';
                    params.skipTransactionBegin = true;
                    params.skipTransactionEnd = false;
                    pipDataModel.update(
                        params,
                        successCallback,
                        errorCallback
                    );
                },

                deleteFeedback: function(params, successCallback, errorCallback) {
                    params.resource = 'feedbacks';
                    pipDataModel.remove(params, successCallback, errorCallback);
                }
            };
        }];
    });

})();

/**
 * @file Guides data model
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global angular */
 
(function () {
    'use strict';

    var thisModule = angular.module('pipGuidesData', ['pipRest', 'pipDataModel']);

    thisModule.provider('pipGuidesData', function () {
        var PAGE_SIZE = 5;

        // Read all guides
        this.readGuidesResolver = function () {
            return /* @ngInject */ ['$stateParams', 'pipRest', function ($stateParams, pipRest) {
                return pipRest.guides().query().$promise;
            }];
        };
        
        this.readIntroGuidesResolver = function () {
            return /* @ngInject */ ['$stateParams', 'pipRest', function ($stateParams, pipRest) {
                return pipRest.guides().query({
                        type: 'intro',
                        status : 'completed'
                }).$promise;
            }];
        };

        this.readGuideResolver = function () {
            return /* @ngInject */ ['$stateParams', 'pipRest', function ($stateParams, pipRest) {
                return pipRest.guides().get({
                    id: $stateParams.id || '55bf23d3bb22aa175c3e498e'
                }).$promise;
            }];
        };

        // CRUD operations and other business methods
        this.$get = ['pipRest', '$stateParams', 'pipDataModel', 'pipGuidesCache', function (pipRest, $stateParams, pipDataModel, pipGuidesCache) {
            return {
                partyId: pipRest.partyId,

                readGuides: function(params, successCallback, errorCallback) {
                    params.resource = 'guides';
                    params.party_id = pipRest.partyId($stateParams);
                    return pipGuidesCache.readGuides(params, successCallback, errorCallback);
                },

                readIntroGuides: function(params, successCallback, errorCallback) {
                    params.resource = 'guides';
                    params.party_id = pipRest.partyId($stateParams);
                    params.type = 'intro';
                    params.status = 'completed';
                    return pipGuidesCache.readGuides(params, successCallback, errorCallback);
                },

                readGuide: function (params, successCallback, errorCallback) {
                    params.resource = 'guides';
                    params.item = params.item || {};
                    params.item.party_id = pipRest.partyId($stateParams);
                    params.item.id = params.item.id || $stateParams.id;
                    return pipDataModel.readOne(params, pipGuidesCache.onGuideUpdate(params, successCallback), errorCallback);
                },

                createGuide: function (params, successCallback, errorCallback) {
                    params.resource =  'guides';
                    params.item = params.item || {};
                    params.item.party_id = pipRest.partyId($stateParams);
                    pipDataModel.create(
                        params,
                        pipGuidesCache.onGuideCreate(params, successCallback),
                        errorCallback
                    );
                },

                createGuideWithFiles: function(params, successCallback, errorCallback) {
                    params.skipTransactionEnd = true;
                    pipDataModel.saveFiles(params, function() {
                        params.resource = 'guides';
                        params.skipTransactionBegin = true;
                        params.skipTransactionEnd = false;
                        pipDataModel.create(
                            params,
                            pipGuidesCache.onGuideCreate(params, successCallback),
                            errorCallback
                        );
                    });
                },

                updateGuide: function (params, successCallback, errorCallback) {
                    params.resource = 'guides';
                    params.skipTransactionBegin = true;
                    params.skipTransactionEnd = false;
                    pipDataModel.update(
                        params,
                        pipGuidesCache.onGuideUpdate(params, successCallback),
                        errorCallback
                    );
                },
                
                updateGuideWithFiles: function(params, successCallback, errorCallback) {
                    params.skipTransactionEnd = true;
                    pipDataModel.saveFiles(params, function() {
                        params.resource = 'guides';
                        params.skipTransactionBegin = true;
                        params.skipTransactionEnd = false;
                        pipDataModel.update(
                            params,
                            pipGuidesCache.onGuideUpdate(params, successCallback),
                            errorCallback
                        );
                    });
                },

                
                deleteGuide: function(params, successCallback, errorCallback) {
                    params.resource = 'guides';
                    pipDataModel.remove(params, pipGuidesCache.onGuideDelete(params, successCallback),  errorCallback);
                }

            }
        }];
    });

})();
/**
 * @file Image sets data model
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global angular */
 
(function () {
    'use strict';
    
    var thisModule = angular.module('pipImageSetsData', ['pipRest', 'pipDataModel', 'pipImageSetsCache']);

    thisModule.provider('pipImageSetsData', function () {
        var PAGE_SIZE = 15;

        // Read all image sets
        this.readImageSetsResolver = function () {
            return /* @ngInject */ ['$stateParams', 'pipRest', function ($stateParams, pipRest) {
                return pipRest.image_sets().get({
                    paging: 1,
                    skip: 0,
                    take: PAGE_SIZE,
                    search: $stateParams.search,
                    //tags: $stateParams.search
                }).$promise;
            }];
        };

        this.readImageSetResolver = function () {
            return /* @ngInject */ ['$stateParams', 'pipRest', function ($stateParams, pipRest) {
                return pipRest.image_sets().get({
                    id: $stateParams.id
                }).$promise;
            }];
        };

        // CRUD operations and other business methods
        this.$get = ['pipRest', '$stateParams', 'pipDataModel', 'pipImageSetsCache', function (pipRest, $stateParams, pipDataModel, pipImageSetsCache) {

            return {
                partyId: pipRest.partyId,

                readImageSets: function (params, transaction, successCallback, errorCallback) {
                    params.resource = 'image_sets';

                    params.skipTransactionBegin = true;
                    params.skipTransactionEnd = false;
                    
                    params.item = params.item || {};
                    params.item.skip = params.item.skip || 0;
                    params.item.search = $stateParams.search || params.item.search;
                   // params.item.tags = $stateParams.search || params.item.search;
                    params.item.party_id = pipRest.partyId($stateParams);
                    params.item.take = PAGE_SIZE;
                    params.item.paging = 1;

                    return pipDataModel.page(
                        params,
                        successCallback,
                        errorCallback
                    );
                },

                readImageSet: function (params, successCallback, errorCallback) {
                    params.resource = 'image_sets';
                    params.item = params.item || {};
                    params.item.party_id = pipRest.partyId($stateParams);
                    params.item.id = params.item.id || $stateParams.id;
                    return pipDataModel.readOne(params, pipImageSetsCache.onImageSetUpdate(params, successCallback), errorCallback);
                },

                updateImageSet: function (params, successCallback, errorCallback) {
                    params.resource = 'image_sets';
                    params.skipTransactionBegin = true;
                    params.skipTransactionEnd = false;
                    return pipDataModel.update(
                        params,
                        successCallback,
                        errorCallback
                    );
                },

                createImageSet: function (params, successCallback, errorCallback) {
                    params.resource = 'image_sets';
                    params.skipTransactionBegin = true;
                    params.skipTransactionEnd = false;
                    pipDataModel.create(
                        params,
                        pipImageSetsCache.onImageSetCreate(params, successCallback),
                        errorCallback
                    );
                },

                createImageSetWithFiles: function(params, successCallback, errorCallback) {
                    params.skipTransactionEnd = true;
                    pipDataModel.saveFiles(params, function() {
                        params.resource = 'image_sets';
                        params.skipTransactionBegin = true;
                        params.skipTransactionEnd = false;
                        pipDataModel.create(
                            params,
                            pipImageSetsCache.onImageSetCreate(params, successCallback),
                            errorCallback
                        );
                    });
                },

                updateImageSetWithFiles: function(params, successCallback, errorCallback) {
                    params.skipTransactionEnd = true;
                    pipDataModel.saveFiles(params, function() {
                        params.resource = 'image_sets';
                        params.skipTransactionBegin = true;
                        params.skipTransactionEnd = false;
                        pipDataModel.update(
                            params,
                            successCallback,
                            errorCallback
                        );
                    });
                },

                deleteImageSet: function(params, successCallback, errorCallback) {
                    params.resource = 'image_sets';
                    pipDataModel.remove(params, successCallback, errorCallback);
                }
            }
        }];
    });

})();

/**
 * @file Session data model
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipSessionData', ['pipRest', 'pipSessionCache']);

    thisModule.provider('pipSessionData', function() {

        readUserResolver.$inject = ['pipSessionCache'];
        readPartyResolver.$inject = ['pipSessionCache', '$stateParams'];
        readConnectionResolver.$inject = ['pipSessionCache', '$stateParams'];
        readSettingsResolver.$inject = ['pipSessionCache'];
        readSessionsUserResolver.$inject = ['$stateParams', 'pipRest', '$rootScope'];
        readSessionIdResolver.$inject = ['$stateParams', 'pipSession'];
        this.readUserResolver = /* @ngInject */ readUserResolver;
        this.readPartyResolver = /* @ngInject */ readPartyResolver;
        this.readConnectionResolver = /* @ngInject */ readConnectionResolver;
        this.readSettingsResolver = /* @ngInject */ readSettingsResolver;

        this.readSessionsUserResolver = /* @ngInject */ readSessionsUserResolver;
        this.readSessionIdResolver = /* @ngInject */ readSessionIdResolver;

        this.$get = ['$rootScope', '$stateParams', 'pipRest', function($rootScope, $stateParams, pipRest) {
            return {
                getSessionId: getSessionId,
                removeSession: removeSession
            };

            function getSessionId(pipSession){
                return function () {
                    return pipSession.sessionId();
                };
            };

            function removeSession(transaction, session, successCallback, errorCallback) {
                var tid = transaction.begin('REMOVING');
                if (!tid) return;

                pipRest.userSessions().remove(
                    {
                        id: session.id,
                        party_id: $stateParams.id
                    },
                    function (removedSession) {
                        if (transaction.aborted(tid)) return;
                        else transaction.end();

                        if (successCallback) successCallback(removedSession);
                    },
                    function (error) {
                        transaction.end(error);
                        if (errorCallback) errorCallback(error);
                    }
                );
            };
            
        }];
        //--------------

        function readUserResolver(pipSessionCache) {
            return pipSessionCache.readUser();                             
        };

        function readPartyResolver(pipSessionCache, $stateParams) {
            return pipSessionCache.readParty($stateParams);
        };

        function readConnectionResolver(pipSessionCache, $stateParams) {
            return pipSessionCache.readConnection($stateParams);
        };

        function readSettingsResolver(pipSessionCache) {
            return pipSessionCache.readSettings();                             
        };

        function readSessionsUserResolver($stateParams, pipRest, $rootScope) {
            return pipRest.userSessions().query({
                party_id: $stateParams.id
            }).$promise;
        };

        function readSessionIdResolver($stateParams, pipSession) {
            return pipSession.sessionId();
        };
        
    });

})();

/**
 * @file Settings data model
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo Rewrite, use cached settings, remove unrelated methods
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipSettingsData', ['pipRest', 'pipSessionData', 'pipSessionCache', 'pipDataModel']);

    thisModule.provider('pipSettingsData', ['pipSessionDataProvider', function (pipSessionDataProvider) {

        this.readSettingsResolver = pipSessionDataProvider.readSettingsResolver;

        this.$get = ['$rootScope', '$stateParams', 'pipRest', 'pipSessionCache', 'pipSession', 'pipDataModel', function ($rootScope, $stateParams, pipRest, pipSessionCache, pipSession, pipDataModel) {
            return {
                // Saving generic settings
                saveSettings: saveSettings,
                readSettings: readSettings,
                reReadSettings: reReadSettings

            };

            function readSettings(successCallback, errorCallback) {
                return pipSessionCache.readSettings(successCallback, errorCallback)
            };

            // force read settings from server and update cache
            function reReadSettings(successCallback, errorCallback) {
                return pipRest.partySettings().get(
                    {
                        party_id: pipSession.userId()
                    },
                    function (settings) {
                        settings = settings || {};
                        pipSessionCache.onSettingsUpdate(settings);
                        if (successCallback) successCallback(settings);
                    },
                    errorCallback
                ).$promise;
            };

            function saveSettings(settings, keys, successCallback, errorCallback) {
                // Extract specific keys
                settings = keys ? _.pick(settings, keys) : settings;
                settings.party_id = pipSession.userId();
                var oldSettings = _.cloneDeep($rootScope.$settings);
                pipSessionCache.onSettingsUpdate(settings);

                var params = {};
                params.resource = 'partySettings';
                params.item = settings;
                params.item.creator_id = pipSession.userId();

                pipDataModel.create(
                    params,
                    successCallback,
                    function (error) {
                        pipSessionCache.onSettingsUpdate(oldSettings);

                        if (errorCallback) errorCallback(error);
                    }
                );
            };
        }];
    }]);

})();

/**
 * @file Tags data model
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTagsData', ['pipRest' , 'pipDataModel', 'pipTagsCache']);

    thisModule.provider('pipTagsData', function() {
        
        this.readTagsResolver = function() {
            return /* @ngInject */ ['$stateParams', 'pipRest', 'pipTagsCache', function($stateParams, pipRest, pipTagsCache) {
                return pipTagsCache.readTags({
                    item: { party_id: pipRest.partyId($stateParams) }
                });
            }];
        };

        this.$get = ['$stateParams', '$state', 'pipRest', 'pipDataModel', 'pipTagsCache', function($stateParams, $state, pipRest, pipDataModel, pipTagsCache) {
            return {
                partyId: pipRest.partyId,
                
                readTags: function(params, successCallback, errorCallback) {
                    params = params || {};
                    params.item = params.item || {};
                    if(params.item.party_id == null) {
                        params.item.party_id = pipRest.partyId($stateParams);
                    }
                    return pipTagsCache.readTags(params, successCallback, errorCallback);
                }
            }
        }];
    });

})();

/**
 * @file Tips data model
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTipsData', ['pipRest', 'pipDataModel']);

    thisModule.provider('pipTipsData', function () {
        var PAGE_SIZE = 100;

        // Read all tips
        this.readTipsResolver = function () {
            return /* @ngInject */ ['$stateParams', 'pipRest', function ($stateParams, pipRest) {
                return pipRest.tips().query().$promise;
            }];
        };

        this.readTipResolver = function () {
            return /* @ngInject */ ['$stateParams', 'pipRest', function ($stateParams, pipRest) {
                return pipRest.tips().get({
                    id: $stateParams.id
                }).$promise;
            }];
        };

        // CRUD operations and other business methods
        this.$get = ['pipRest', '$stateParams', 'pipDataModel', 'pipTipsCache', function (pipRest, $stateParams, pipDataModel, pipTipsCache) {

            return {
                partyId: pipRest.partyId,

// todo update after optimization rezolver
                readTips: function (params, successCallback, errorCallback) {
                    params.resource = 'tips';
                    params.item = params.item || {};
                    params.item.search = $stateParams.search;
                    params.item.tags = $stateParams.search;
                    params.item.party_id = pipRest.partyId($stateParams);
                    return pipTipsCache.readTips(params, successCallback, errorCallback);
                },

                readTip: function (params, successCallback, errorCallback) {
                    params.resource = 'tips';
                    params.item = params.item || {};
                    params.item.party_id = pipRest.partyId($stateParams);
                    params.item.id = params.item.id || $stateParams.id;
                    return pipDataModel.readOne(params, pipTipsCache.onTipsUpdate(params, successCallback), errorCallback);
                },

                createTip: function (params, successCallback, errorCallback) {
                    params.resource = 'tips';
                    params.item = params.item || {};
                    params.item.party_id = pipRest.partyId($stateParams);
                    pipDataModel.create(
                        params,
                        pipTipsCache.onTipCreate(params, successCallback),
                        errorCallback
                    );
                },
                
                createTipWithFiles: function(params, successCallback, errorCallback) {
                    params.skipTransactionEnd = true;
                    params.item = params.item || {};
                    params.item.party_id = pipRest.partyId($stateParams);
                    pipDataModel.saveFiles(params, function() {
                        params.resource = 'tips';
                        params.skipTransactionBegin = true;
                        params.skipTransactionEnd = false;
                        
                        params.item.party_id = pipRest.partyId($stateParams);
                        pipDataModel.create(
                            params,
                            pipTipsCache.onTipCreate(params, successCallback),
                            errorCallback
                        );
                    }, errorCallback);
                },

                updateTip: function (params, successCallback, errorCallback) {
                    params.resource = 'tips';
                    params.item = params.item || {};
                    params.item.party_id = pipRest.partyId($stateParams);
                    pipDataModel.update(
                        params,
                        pipTipsCache.onTipUpdate(params, successCallback),
                        errorCallback
                    );
                },
                
                updateTipWithFiles: function(params, successCallback, errorCallback) {
                    params.skipTransactionEnd = true;
                    params.item = params.item || {};
                    params.item.party_id = pipRest.partyId($stateParams);
                    pipDataModel.saveFiles(params, function() {
                        params.resource = 'tips';
                        params.skipTransactionBegin = true;
                        params.skipTransactionEnd = false;
                        
                        params.item.party_id = pipRest.partyId($stateParams);
                        pipDataModel.update(
                            params,
                            pipTipsCache.onTipUpdate(params, successCallback),
                            errorCallback
                        );
                    });
                },

                deleteTip: function(params, successCallback, errorCallback) {
                    params.resource = 'tips';
                    pipDataModel.remove(params, pipTipsCache.onTipDelete(params, successCallback), errorCallback);
                }
            }
        }];
    });

})();

/**
 * @file Users data model
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipUsersData', ['pipRest']);

    thisModule.provider('pipUsersData', function () {

        this.readUsersResolver = function () {
            return /* @ngInject */ ['$stateParams', 'pipRest', function ($stateParams, pipRest) {
                return pipRest.users().page({
                    party_id: $stateParams.id,
                    paging: $stateParams.paging || 1,
                    skip: $stateParams.skip || 0,
                    take: $stateParams.take || 15
                }).$promise;
            }];
        };

        this.readUserResolver = function () {
            return /* @ngInject */ ['$stateParams', 'pipRest', function ($stateParams, pipRest) {
                return pipRest.users().get({
                    id: $stateParams.id,
                    party_id: pipRest.partyId($stateParams)
                }).$promise;

            }];
        };

        this.readActivitiesUserResolver = /* @ngInject */
            ['$stateParams', 'pipRest', '$rootScope', function ($stateParams, pipRest, $rootScope) {
                return pipRest.partyActivities().page({
                    party_id: $rootScope.$user.id,
                    paging: 1,
                    skip: 0,
                    take: 25
                }).$promise;
            }];

        // CRUD operations and other business methods
        this.$get = ['pipRest', '$stateParams', function (pipRest, $stateParams) {   
            return {
                partyId: pipRest.partyId,

                readUsers: function (params, transaction, successCallback, errorCallback) {
                    pipRest.users().page(
                        {
                            party_id: pipRest.partyId($stateParams),
                            paging: 1,
                            skip: params.start,
                            search: params.item.search ,
                            active: params.item.active,
                            paid: params.item.paid,
                            admin: params.item.admin,
                            take: 15
                        },
                        function (pagedUsers) {
                            if (successCallback) successCallback(pagedUsers);
                        },
                        function (error) {
                            errorCallback(error);
                        }
                    );
                },
                
                updateUser: function (item, transaction, successCallback, errorCallback) {
                    pipRest.users().update(
                        item.item,
                        function (updatedItem) {
                            if (successCallback) successCallback(updatedItem);
                        },
                        function (error) {
                            errorCallback(error);
                        }
                    );
                }

            }
        }];
    });

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
        'pipLayout.Tiles', 'pipLayout.Dialog', 'pipLayout.Split'
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

    var thisModule = angular.module('pipLayout.Split', []);

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
                        if (pipSplit.forwardTransition(toState, fromState))
                            splitElements.addClass('pip-transition-forward');
                        else
                            splitElements.addClass('pip-transition-back');
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
            if (!_.isArray(sequence) || sequence.length == 0)
                throw new Error('Transition sequence must be an array of state names');

            transitionSequences.push(sequence);
        }

        function forwardTransition(toState, fromState) {
            for (var i = 0; i < transitionSequences.length; i++) {
                var toIndex = transitionSequences[i].indexOf(toState.name);
                var fromIndex = transitionSequences[i].indexOf(fromState.name);

                if (toIndex > -1)
                    return toIndex > fromIndex;
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

        'pipDate',
        'pipDateRange',
        'pipTimeRangeEdit',
        'pipTimeRange',

        'pipInformationDialog',
        'pipConfirmationDialog',
        'pipOptionsDialog',
        'pipOptionsBigDialog',
        'pipErrorDetailsDialog'
    ]);

    angular.module('pipBasicControls', ['pipControls']);

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
  $templateCache.put('confirmation_dialog/confirmation_dialog.html',
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
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
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
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('error_details_dialog/error_details_dialog.html',
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
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
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
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('information_dialog/information_dialog.html',
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
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('options_dialog/options_dialog.html',
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
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('options_dialog/options_dialog_big.html',
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
    '                              ng-repeat="option in options" ng-click="onOptionSelect($event, option)">\n' +
    '\n' +
    '                    <div class="pip-content  line-height-string  max-w100-stretch">\n' +
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

(function(module) {
try {
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('progress/routing_progress.html',
    '<div class="pip-routing-progress layout-column layout-align-center-center"\n' +
    '     ng-show="$routing || $reset || toolInitialized">\n' +
    '    <div class="loader">\n' +
    '        <svg class="circular" viewBox="25 25 50 50">\n' +
    '            <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>\n' +
    '        </svg>\n' +
    '    </div>\n' +
    '\n' +
    '    <img src="images/Logo_animation.svg"  height="40" width="40" class="pip-img">\n' +
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
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
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
 * @file Confirmation dialog
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipConfirmationDialog',
        ['ngMaterial', 'pipUtils', 'pipTranslate', 'pipBasicControls.Templates']);

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
                        templateUrl: 'confirmation_dialog/confirmation_dialog.html',
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
    var thisModule = angular.module('pipDateRange', []);

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
 * @file Date control
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve samples int sampler app
 * - Optimize. It is way to slow on samples
 */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipDate', ['pipBasicControls.Templates']);

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
 * @file Confirmation dialog
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve sample in sampler app
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipErrorDetailsDialog',
        ['ngMaterial', 'pipUtils', 'pipTranslate', 'pipBasicControls.Templates']);

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
                        templateUrl: 'error_details_dialog/error_details_dialog.html',
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
        ['ngMaterial', 'pipUtils', 'pipTranslate', 'pipBasicControls.Templates']);

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
                        templateUrl: 'information_dialog/information_dialog.html',
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
 * @file Options dialog
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve sample in sampler app
 * - Remove deleted hack in the controller
 */

(function (angular, $, _) {
    'use strict';

    var thisModule = angular.module('pipOptionsDialog',
        ['ngMaterial', 'pipUtils', 'pipTranslate', 'pipBasicControls.Templates']);

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
                        templateUrl: 'options_dialog/options_dialog.html',
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
        ['ngMaterial', 'pipUtils', 'pipTranslate', 'pipBasicControls.Templates']);

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
                        templateUrl: 'options_dialog/options_dialog_big.html',
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
            templateUrl: 'progress/routing_progress.html'
        };
    });

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

    var thisModule = angular.module('pipTagList', ['pipCore']);

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
 * @file Toasts management service
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo Replace ngAudio with alternative service
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
  $templateCache.put('appbar/appbar.html',
    '<!--\n' +
    '@file App Bar component\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-toolbar md-theme-watch="true" ng-if="!$partialReset" ng-class="config.ngClasses" class="{{ config.cssClass }}">\n' +
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
    '            <pip-avatar ng-if="config.navIconType==\'menu\' && (getParty() && !getUser(\'owner\'))"\n' +
    '                        pip-rebind-avatar="true"\n' +
    '                        pip-rebind="true"\n' +
    '                        pip-party-id="getParty(\'id\')" class="pip-face"\n' +
    '                        pip-party-name="getParty(\'name\')">\n' +
    '            </pip-avatar>\n' +
    '            <!-- Back icon -->\n' +
    '            <md-icon ng-if="config.navIconType==\'back\'"\n' +
    '                md-svg-icon="icons:arrow-left"></md-icon>\n' +
    '        </md-button>\n' +
    '        \n' +
    '        <!-- Title -->            \n' +
    '        <div class="flex-var text-overflow">\n' +
    '            <!-- Logo -->\n' +
    '            <img class="pip-appbar-logo" \n' +
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
  $templateCache.put('dropdown/dropdown.html',
    '<md-content class="md-subhead md-hue-1 {{class}}" ng-if="show()" ng-class="{\'md-whiteframe-3dp\': $mdMedia(\'xs\')}">\n' +
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
  $templateCache.put('sidenav/sidenav.html',
    '<!--\n' +
    '@file Side Nav component\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-sidenav class="md-sidenav-left md-whiteframe-z2 pip-sidenav" \n' +
    '    md-component-id="pip-sidenav" \n' +
    '    ng-if="!$partialReset" \n' +
    '    pip-focused>\n' +
    '\n' +
    '    <md-toolbar class="pip-sidenav-header"\n' +
    '                ng-class="{\'pip-sidenav-owner\': $user.owner}"\n' +
    '                md-theme="{{ $theme|| $user.theme || config.theme }}"\n' +
    '                ng-hide="!$party">\n' +
    '\n' +
    '            <md-button class="pip-sidenav-party md-icon-button"\n' +
    '                       ng-click="onPartyClick()"\n' +
    '                       aria-label="current party">\n' +
    '                <pip-avatar ng-if="!$avatarReset"\n' +
    '                            pip-party-id="$party.id"\n' +
    '                            pip-default-icon="icon-person"\n' +
    '                            pip-party-name="$party.name"\n' +
    '                            pip-rebind-avatar="true"\n' +
    '                            pip-rebind="true">\n' +
    '                </pip-avatar>\n' +
    '            </md-button>\n' +
    '\n' +
    '            <md-button class="pip-sidenav-user md-icon-button"\n' +
    '                       ng-click="onUserClick()"\n' +
    '                       ng-hide="$user.owner"\n' +
    '                       aria-label="current user">\n' +
    '                <pip-avatar class="pic-pic pip-face-ld"\n' +
    '                            ng-if="!$avatarReset"\n' +
    '                            pip-default-icon="icon-person"\n' +
    '                            pip-rebind="true"\n' +
    '                            pip-rebind-avatar="true"\n' +
    '                            pip-party-id="$user.id"\n' +
    '                            pip-party-name="$user.name">\n' +
    '                </pip-avatar>\n' +
    '            </md-button>\n' +
    '        \n' +
    '        <div class="pip-sidenav-party-text">\n' +
    '            <a class="pip-sidenav-party-pri cursor-pointer"\n' +
    '                ng-click="onPartyClick()">{{$party.name}}</a>\n' +
    '            <div class="pip-sidenav-party-sec"\n' +
    '                ng-show="$connection && !$user.owner">\n' +
    '                {{$connection.relation | translate}}\n' +
    '                <span ng-show="$connection.relation_since">\n' +
    '                    {{::\'SIDENAV_SINCE\' | translate}}\n' +
    '                    {{$connection.relation_since | formatLongDate}}\n' +
    '                </span>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </md-toolbar>\n' +
    '\n' +
    '    <md-list>\n' +
    '        <div class="pip-section" ng-repeat="section in config.sections"\n' +
    '            ng-hide="section.access && !section.access($party, $user, section)">\n' +
    '            \n' +
    '            <md-divider ng-show="$index > 0 && !isSectionEmpty(section.links)"></md-divider>\n' +
    '            <md-subheader ng-show="section.title">{{::section.title | translate}}</md-subheader>\n' +
    '            \n' +
    '            <md-list-item class="pip-focusable no-border" \n' +
    '                ng-repeat="link in section.links"\n' +
    '                ng-click="onLinkClick($event, link)"\n' +
    '                ng-hide="link.access && !link.access($party, $user, link)">\n' +
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
    '    <md-content class="md-subhead md-hue-1" ng-if="$mdMedia(\'xs\')">\n' +
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
                globalActions: '=pipGlobalActions'
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

            $scope.getParty = getParty;
            $scope.getUser = getUser;

            $scope.openMenu = openMenu;

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
                    config.navIconType = config.navIconType === 'none' ? 'back' : config.navIconType;
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
           scope: false,
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

            return;
            
            //------------------------

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
 * @file Registration of location WebUI controls
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    angular.module('pipLocations', [        
        'pipLocation',
        'pipLocationMap',
        'pipLocationIp',
        'pipLocationEdit',
        'pipLocationEditDialog'
    ]);
    
})();



(function(module) {
try {
  module = angular.module('pipLocations.Templates');
} catch (e) {
  module = angular.module('pipLocations.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('location_dialog/location_dialog.html',
    '<!--\n' +
    '@file Location edit dialog content\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-dialog pip-location-edit-dialog layout-column"md-theme="{{theme}}">\n' +
    '\n' +
    '    <div class="pip-header layout-column layout-align-start-start">\n' +
    '        <md-progress-linear ng-show="transaction.busy()" md-mode="indeterminate" class="pip-progress-top">\n' +
    '        </md-progress-linear>\n' +
    '        <h3 class="m0 w-stretch flex">{{ \'LOCATION_SET_LOCATION\' | translate }}</h3>\n' +
    '    </div>\n' +
    '    <div class="pip-footer">\n' +
    '        <div class="layout-row layout-align-start-center">\n' +
    '            <md-button class="md-accent" ng-click="onAddPin()" ng-show="locationPos == null"\n' +
    '                ng-disabled="transaction.busy()" aria-label="{{ ::\'LOCATION_ADD_PIN\' | translate }}">\n' +
    '                {{ ::\'LOCATION_ADD_PIN\' | translate }}\n' +
    '            </md-button>\n' +
    '            <md-button class="md-accent" ng-click="onRemovePin()" ng-show="locationPos != null"\n' +
    '                ng-disabled="transaction.busy()" aria-label="{{ ::\'LOCATION_REMOVE_PIN\' | translate }}">\n' +
    '                {{ ::\'LOCATION_REMOVE_PIN\' | translate }}\n' +
    '            </md-button>\n' +
    '        </div>\n' +
    '        <div class="flex"></div>\n' +
    '        <div class="layout-row layout-align-end-center">\n' +
    '            <md-button ng-click="onCancel()" aria-label="{{ ::\'CANCEL\' | translate }}">\n' +
    '                {{ ::\'CANCEL\' | translate }}\n' +
    '            </md-button>\n' +
    '            <md-button class="md-accent" ng-click="onApply()" ng-disabled="transaction.busy()"\n' +
    '                aria-label="{{ ::\'APPLY\' | translate }}">\n' +
    '                {{ ::\'APPLY\' | translate }}\n' +
    '            </md-button>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="pip-body">\n' +
    '        <div class="pip-location-container"></div>\n' +
    '        <md-button class="md-icon-button md-fab pip-zoom-in" ng-click="onZoomIn()"\n' +
    '                   aria-label="{{ ::\'LOCATION_ZOOM_IN\' | translate }}">\n' +
    '            <!--span class="icon-plus"></span-->\n' +
    '            <md-icon md-svg-icon="icons:plus"></md-icon>\n' +
    '        </md-button>\n' +
    '        <md-button class="md-icon-button md-fab pip-zoom-out" ng-click="onZoomOut()"\n' +
    '                   aria-label="{{ ::\'LOCATION_ZOOM_OUT\' | translate }}">\n' +
    '            <!--span class="icon-minus"></span-->\n' +
    '            <md-icon md-svg-icon="icons:minus"></md-icon>\n' +
    '        </md-button>\n' +
    '        <md-button class="md-icon-button md-fab pip-set-location" ng-click="onSetLocation()"\n' +
    '                   aria-label="{{ ::\'LOCATION_SET_LOCATION\' | translate }}"\n' +
    '                   ng-show="supportSet" ng-disabled="transaction.busy()">\n' +
    '            <!--span class="icon-target"></span-->\n' +
    '            <md-icon md-svg-icon="icons:target"></md-icon>\n' +
    '        </md-button>\n' +
    '    </div>\n' +
    '</md-dialog>\n' +
    '');
}]);
})();

/**
 * @file Location control
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve samples in sampler app
 */

/* global angular, google */

(function () {
    'use strict';

    var thisModule = angular.module("pipLocation", ['pipUtils']);

    thisModule.directive('pipLocation', 
        ['pipUtils', function (pipUtils) {
            return {
                restrict: 'EA',
                scope: {
                    pipLocationName: '&',
                    pipLocationPos: '&',
                    pipLocationResize: '&',
                    pipShowLocationIcon: '='
                },
                template: 
                    function($element, $attrs) {
                        if (pipUtils.toBoolean($attrs.pipCollapse)) {
                            return String()
                                + '<div class="pip-location-name bm0" ng-click="pipLocationResize()" ng-hide="!pipLocationName()"'
                                + 'ng-class="pipShowLocationIcon ? \'lp24-flex rp16\' : \'\'">'
                                + '<md-icon md-svg-icon="icons:location" class="flex-fixed pip-icon" ng-if="pipShowLocationIcon"></md-icon>'
                                + '<span class="pip-location-text">{{pipLocationName()}}</span> '
                                + '</div>'
                                + '<div class="pip-location-container bm8" ng-hide="!pipLocationPos()"></div>';
                        } else {
                            return String()
                                + '<md-button class="pip-location-name" ng-click="pipLocationResize()" '
                                + 'ng-class="pipShowLocationIcon ? \'lp24-flex rp16\' : \'\'">'
                                + '<div class="layout-align-start-center layout-row w-stretch">'
                                + '<md-icon md-svg-icon="icons:location" class="flex-fixed pip-icon" ng-if="pipShowLocationIcon"></md-icon>'
                                + '<span class="pip-location-text flex">{{pipLocationName()}}</span>'
                                + '<md-icon md-svg-icon="icons:triangle-down" class="flex-fixed" ng-if="!showMap"></md-icon>'
                                + '<md-icon md-svg-icon="icons:triangle-up" class="flex-fixed" ng-if="showMap"></md-icon>'
                                + '</div></md-button>'
                                + '<div class="pip-location-container bm8"'
                                + 'ng-class="pipShowLocationIcon ? \'lm24-flex rm24-flex\' : \'\'"></div>';
                        }
                    },
                controller: 'pipLocationController'
            }
        }]
    );

    thisModule.controller('pipLocationController',
        ['$scope', '$element', '$attrs', 'pipUtils', function ($scope, $element, $attrs, pipUtils) {
            var 
                $name = $element.children('.pip-location-name'),
                $mapContainer = $element.children('.pip-location-container'),
                $mapControl = null,
                $up = $element.find('.icon-up'),
                $down = $element.find('.icon-down'),
                collapsable = pipUtils.toBoolean($attrs.pipCollapse);

            function clearMap() {
                // Remove map control
                if ($mapControl) $mapControl.remove();
                $mapControl = null;
                $mapContainer.hide();
            };

            function generateMap() {
                var location = $scope.pipLocationPos();
                
                // Safeguard for bad coordinates
                if ($scope.showMap == false || location == null
                    || location.coordinates == null
                    || location.coordinates.length < 0) {
                    clearMap();
                    return;
                }

                // Determine map coordinates
                var coordinates = new google.maps.LatLng(
                    location.coordinates[0],
                    location.coordinates[1]
                );

                // Clean up the control
                if ($mapControl) $mapControl.remove();
                $mapControl = $('<div></div>');
                $mapContainer.show();
                $mapControl.appendTo($mapContainer);

                // Create the map with point marker
                var 
                    mapOptions = {
                        center: coordinates,
                        zoom: 12,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        disableDefaultUI: true,
                        disableDoubleClickZoom: true,
                        scrollwheel: false,
                        draggable: false
                    },
                    map = new google.maps.Map($mapControl[0], mapOptions);
                    
                new google.maps.Marker({
                    position: coordinates,
                    map: map
                });
            };

            // Process user actions
            if (!collapsable) {
                $scope.showMap = false;
                $up.hide();
                $mapContainer.hide();

                $name.click(function (event) {
                    event.stopPropagation();
                    if ($attrs.disabled) return;
                    $scope.showMap = !$scope.showMap;
                    $up[$scope.showMap ? 'show' : 'hide']();
                    $down[!$scope.showMap ? 'show' : 'hide']();
                    generateMap();
                });
            }

            // Watch for location changes
            if (pipUtils.toBoolean($attrs.pipRebind)) {
                $scope.$watch($scope.pipLocationPos,
                    function (newValue) {
                        generateMap();
                    }
                );
            }

            // Add class
            $element.addClass('pip-location');

            // Visualize map
            if ($scope.pipLocationPos()) generateMap();
            else clearMap();
        }]    
    );

})();

/**
 * @file Location edit dialog
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve sample in sampler app
 */
 
/* global angular, google */

(function () {
    'use strict';

    var thisModule = angular.module('pipLocationEditDialog', 
        ['ngMaterial', 'pipTranslate', 'pipTransactions', 'pipLocations.Templates']);

    thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'LOCATION_ADD_LOCATION': 'Add location',
            'LOCATION_SET_LOCATION': 'Set location',
            'LOCATION_ADD_PIN': 'Add pin',
            'LOCATION_REMOVE_PIN': 'Remove pin'
        });
        pipTranslateProvider.translations('ru', {
            'LOCATION_ADD_LOCATION': 'Добавить местоположение',
            'LOCATION_SET_LOCATION': 'Определить положение',
            'LOCATION_ADD_PIN': 'Добавить точку',
            'LOCATION_REMOVE_PIN': 'Убрать точку'
        });
    }]);

    thisModule.factory('pipLocationEditDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    $mdDialog.show({
                        controller: 'pipLocationEditDialogController',
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
                }
            };
        }]
    );

    thisModule.controller('pipLocationEditDialogController', 
        ['$scope', '$rootScope', '$timeout', '$mdDialog', 'pipTransaction', 'locationPos', 'locationName', function ($scope, $rootScope, $timeout, $mdDialog, pipTransaction, locationPos, locationName) {
            $scope.theme = $rootScope.$theme;
            $scope.locationPos = locationPos && locationPos.type == 'Point'
                && locationPos.coordinates && locationPos.coordinates.length == 2
                ? locationPos : null;
            $scope.locationName = locationName;
            $scope.supportSet = navigator.geolocation != null;

            $scope.transaction = pipTransaction('location_edit_dialog', $scope);

            var map = null, marker = null;

            var createMarker = function(coordinates) {
                if (marker) marker.setMap(null);
                
                if (coordinates) {
                    marker = new google.maps.Marker({ 
                        position: coordinates, 
                        map: map,
                        draggable: true,
                        animation: google.maps.Animation.DROP
                    });

                    var thisMarker = marker;
                    google.maps.event.addListener(thisMarker, 'dragend', function() {
                       var coordinates = thisMarker.getPosition(); 
                       changeLocation(coordinates);
                    });
                } else {
                    marker = null;
                }

                return marker;
            };

            var changeLocation = function(coordinates, tid) {
                $scope.locationPos = {
                    type: 'Point',
                    coordinates: [coordinates.lat(), coordinates.lng()]
                };
                $scope.locationName = null;

                if (tid == null) {
                    tid = $scope.transaction.begin();
                    if (tid == null) return;
                }

                // Read address
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: coordinates }, function(results, status) {
                    if ($scope.transaction.aborted(tid)) return;

                    // Process positive response
                    if (status == google.maps.GeocoderStatus.OK
                        && results && results.length > 0) {
                        $scope.locationName = results[0].formatted_address;
                    }

                    $scope.transaction.end();
                    $scope.$apply();
                });
            };

            // Wait until dialog is initialized
            $timeout(function () {
                var mapContainer = $('.pip-location-edit-dialog .pip-location-container');

                // Calculate coordinate of the center
                var coordinates = $scope.locationPos ?
                    new google.maps.LatLng(
                        $scope.locationPos.coordinates[0],
                        $scope.locationPos.coordinates[1]
                    ) : null;

                // Create the map with point marker
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

                map = new google.maps.Map(mapContainer[0], mapOptions);
                marker = createMarker(coordinates);

                // Fix resizing issue
                setTimeout(function () {
                    google.maps.event.trigger(map, 'resize');
                }, 1000);
            }, 0);

            $scope.$on('pipLayoutResized', function (event) {
                if (map == null) return;
                google.maps.event.trigger(map, 'resize');
            });

            $scope.onAddPin = function () {
                if (map == null) return;

                var coordinates = map.getCenter();
                marker = createMarker(coordinates);
                changeLocation(coordinates);
            };

            $scope.onRemovePin = function () {
                if (map == null) return;
                marker = createMarker(null);
                $scope.locationPos = null;
                $scope.locationName = null;
            };

            $scope.onZoomIn = function () {
                if (map == null) return;
                var zoom = map.getZoom();
                map.setZoom(zoom + 1);
            };

            $scope.onZoomOut = function () {
                if (map == null) return;
                var zoom = map.getZoom();
                map.setZoom(zoom > 1 ? zoom - 1 : zoom);
            };

            $scope.onSetLocation = function () {
                if (map == null) return;

                var tid = $scope.transaction.begin();
                if (tid == null) return;

                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        if ($scope.transaction.aborted(tid)) return;

                        var coordinates = new google.maps.LatLng(
                            position.coords.latitude, position.coords.longitude);

                        marker = createMarker(coordinates);
                        map.setCenter(coordinates);
                        map.setZoom(12);

                        changeLocation(coordinates, tid);
                    },
                    function () {
                        $scope.transaction.end();
                        $scope.$apply();
                    },
                    {
                        maximumAge: 0,
                        enableHighAccuracy: true,
                        timeout: 5000
                    }
                );
            };

            $scope.onCancel = function () {
                $mdDialog.cancel();
            };

            $scope.onApply = function () {
                $mdDialog.hide({
                    location: $scope.locationPos,
                    locationPos: $scope.locationPos,
                    locationName: $scope.locationName   
                });
            };
        }]
    );

})();

/**
 * @file Location IP control
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve samples in sampler app
 */
 
/* global angular, google */

(function () {
    'use strict';

    var thisModule = angular.module("pipLocationIp", ['pipUtils']);

    thisModule.directive('pipLocationIp',
        function () {
            return {
                restrict: 'EA',
                scope: {
                    pipIpaddress: '&',
                    pipExtraInfo: '&'
                },
                template: '<div class="pip-location-container"></div>',
                controller: 'pipLocationIpController'
            }
        }
    );

    thisModule.controller('pipLocationIpController',
        ['$scope', '$element', '$attrs', '$http', 'pipUtils', function ($scope, $element, $attrs, $http, pipUtils) {
            var 
                $mapContainer = $element.children('.pip-location-container'),
                $mapControl = null;

            function clearMap() {
                // Remove map control
                if ($mapControl) $mapControl.remove();
                $mapControl = null;
            };

            function generateMap(latitude, longitude) {
                // Safeguard for bad coordinates
                if (latitude == null || longitude == null) {
                    clearMap();
                    return;
                }

                // Determine map coordinates
                var coordinates = new google.maps.LatLng(
                    latitude,
                    longitude
                );

                // Clean up the control
                if ($mapControl) $mapControl.remove();
                $mapControl = $('<div></div>');
                $mapControl.appendTo($mapContainer);

                // Create the map with point marker
                var 
                    mapOptions = {
                        center: coordinates,
                        zoom: 12,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        disableDefaultUI: true,
                        disableDoubleClickZoom: true,
                        scrollwheel: false,
                        draggable: false
                    },
                    map = new google.maps.Map($mapControl[0], mapOptions);
                    
                new google.maps.Marker({
                    position: coordinates,
                    map: map
                });
            };

            function defineCoordinates() {
                var ipAddress = $scope.pipIpaddress();

                if (ipAddress == '') {
                    clearMap();
                    return;
                }

                // Todo: Find more reliable geocoding service to locate ip addresses
                $http.jsonp('http://www.geoplugin.net/json.gp?ip=' + ipAddress + '&jsoncallback=JSON_CALLBACK')
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
                    } else {
                        clearMap();
                    }
                })
                .error(function (response) {
                    console.error(response);
                    clearMap();
                });
            };

            // Watch for location changes
            if (pipUtils.toBoolean($attrs.pipRebind)) {
                $scope.$watch(
                    function () {
                        return $scope.pipIpaddress()
                    },
                    function (newValue) {
                        defineCoordinates();
                    }
                );
            }

            // Add class
            $element.addClass('pip-location-ip');

            // Visualize map
            defineCoordinates();
        }]        
    );

})();


/**
 * @file Location map control
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular, google */

(function () {
    'use strict';

    var thisModule = angular.module("pipLocationMap", ['pipUtils']);

    thisModule.directive('pipLocationMap',
        function () {
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
            }
        }
    );

    thisModule.controller('pipLocationMapController',
        ['$scope', '$element', '$attrs', '$parse', 'pipUtils', function ($scope, $element, $attrs, $parse, pipUtils) {
            var
                $mapContainer = $element.children('.pip-location-container'),
                $mapControl = null,
                stretchMap = $scope.pipStretch() || false,
                iconPath = $scope.pipIconPath();

            function clearMap() {
                // Remove map control
                if ($mapControl) $mapControl.remove();
                $mapControl = null;
            }

            function checkLocation (loc) {
                return !(loc == null
                || loc.coordinates == null
                || loc.coordinates.length < 0);
            }

            function determineCoordinates(loc) {
                var point = new google.maps.LatLng(
                    loc.coordinates[0],
                    loc.coordinates[1]
                );

                point.fill = loc.fill;
                point.stroke = loc.stroke;

                return point;
            }

            function generateMap() {
                var location = $scope.pipLocationPos(),
                    locations = $scope.pipLocationPositions(),
                    points = [],
                    draggable = $scope.pipDraggable() || false;

                // Safeguard for bad coordinates
                if (checkLocation(location)) {
                    points.push(determineCoordinates(location));
                } else {
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

                // Clean up the control
                if ($mapControl) $mapControl.remove();
                $mapControl = $('<div></div>');
                $mapControl.appendTo($mapContainer);

                // Create the map
                var
                    mapOptions = {
                        center: points[0],
                        zoom: 12,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        disableDefaultUI: true,
                        disableDoubleClickZoom: true,
                        scrollwheel: draggable,
                        draggable: draggable
                    },
                    map = new google.maps.Map($mapControl[0], mapOptions),
                    bounds = new google.maps.LatLngBounds();

                // Create markers
                points.forEach(function(point) {
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

                // Auto-config of zoom and center
                if (points.length > 1) map.fitBounds(bounds);
            }

            // Watch for location changes
            if (pipUtils.toBoolean($attrs.pipRebind)) {
                $scope.$watch(
                    function () {
                        return $scope.pipLocationPos()
                    },
                    function () {
                        generateMap();
                    }
                );
            }

            // Add class
            $element.addClass('pip-location-map');
            if (stretchMap) $mapContainer.addClass('stretch');

            // Visualize map
            if ($scope.pipLocationPos() || $scope.pipLocationPositions()) generateMap();
            else clearMap();
        }]
    );

})();


/**
 * @file Location edit control
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve samples in sampler app
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipLocationEdit", ['pipLocationEditDialog']);

    thisModule.directive('pipLocationEdit',
        ['$parse', '$http', 'pipLocationEditDialog', function ($parse, $http, pipLocationEditDialog) {
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
                    + '<span class="icon-location"></span> {{::\'LOCATION_ADD_LOCATION\' | translate}}'
                    + '</md-button></div>'
                    + '<div class="pip-location-container" tabindex="{{ ngDisabled() ? -1 : 0 }}"'
                    + ' ng-click="onMapClick($event)" ng-keypress=""onMapKeyPress($event)"></div>',
                controller: ['$scope', '$element', function ($scope, $element) {
                    $element.find('md-input-container').attr('md-no-float', !!$scope.pipLocationHolder);
                }],
                link: function ($scope, $element) {

                    var 
                        $empty = $element.children('.pip-location-empty'),
                        $mapContainer = $element.children('.pip-location-container'),
                        $mapControl = null;

                    var clearMap = function () {
                        // Remove map control
                        if ($mapControl) $mapControl.remove();
                        $mapControl = null;

                        // Toggle control visibility
                        $mapContainer.hide();
                        $empty.show();
                    };

                    var generateMap = function () {
                        // Safeguard for bad coordinates
                        var location = $scope.pipLocationPos;
                        if (location == null || location.coordinates == null || location.coordinates.length < 0) {
                            clearMap();
                            return;
                        }

                        // Determine map coordinates
                        var coordinates = new google.maps.LatLng(
                            location.coordinates[0],
                            location.coordinates[1]
                        );

                        // Clean up the control
                        if ($mapControl) $mapControl.remove();

                        // Toggle control visibility
                        $mapContainer.show();
                        $empty.hide();

                        // Add a new map
                        $mapControl = $('<div></div>');
                        $mapControl.appendTo($mapContainer);

                        // Create the map with point marker
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
                    };

                    var defineCoordinates = function () {
                        var locationName = $scope.pipLocationName;

                        if (locationName == '') {
                            $scope.pipLocationPos = null;
                            clearMap();
                            $scope.$apply();
                            return;
                        }

                    //    $http.get('http://maps.googleapis.com/maps/api/geocode/json?address=' + locationName)
                    //    .success(function (response) { ... })
                    //    .error(function (response) {... });

                        var geocoder = new google.maps.Geocoder();
                        geocoder.geocode({ address: locationName }, function(results, status) {
                            $scope.$apply(function() {
                                // Process response
                                if (status == google.maps.GeocoderStatus.OK) {
                                    // Check for empty results
                                    if (results == null || results.length == 0) {
                                        $scope.pipLocationPos = null;
                                        clearMap();
                                        return;
                                    }

                                    var 
                                        geometry = results[0].geometry || {},
                                        location = geometry.location || {};

                                    // Check for empty results again
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

                                    //generateMap();                                
                                } 
                                // Process error...
                                else {
                                    console.error(response);
                                    $scope.pipLocationPos = null;
                                    //clearMap();                                
                                }
                            });
                        });

                    };
                    var defineCoordinatesDebounced = _.debounce(defineCoordinates, 2000);

                    // Process user actions
                    
                    $scope.onSetLocation = function() {
                        if ($scope.ngDisabled()) return;
                          
                        pipLocationEditDialog.show(
                            {
                                locationName: $scope.pipLocationName,
                                locationPos: $scope.pipLocationPos
                            },
                            function (result) {
                                var 
                                    location = result.location,
                                    locationName = result.locationName;

                                // Do not change anything if location is about the same
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
                            }
                        );
                    };

                    $scope.onMapClick = function ($event) {
                        if ($scope.ngDisabled()) return;

                        $mapContainer[0].focus();
                        $scope.onSetLocation();
                        //$event.stopPropagation();
                    };

                    $scope.onMapKeyPress = function($event) {
                        if ($scope.ngDisabled()) return;

                        if ($event.keyCode == 13 || $event.keyCode == 32) {
                            $scope.onSetLocation();
                            //$event.stopPropagation();
                        }  
                    };

                    // Watch for location name changes
                    $scope.$watch(
                        function () {
                            return $scope.pipLocationName
                        },
                        function (newValue, oldValue) {
                            if (newValue != oldValue)
                                defineCoordinatesDebounced();
                        }
                    );

                    $scope.$watch(
                        function () {
                            return $scope.pipLocationPos
                        },
                        function () {
                            generateMap();
                        }
                    );

                    // Add class
                    $element.addClass('pip-location-edit');

                    // Visualize map
                    if ($scope.pipLocationPos) generateMap();
                    else clearMap();
                }
            }
        }]
    );

})();



/**
 * @file Registration of WebUI documents controls
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
    'use strict';

    angular.module('pipDocuments', [
        'pipDocumentList',
        'pipDocumentListEdit'
    ]);

})(window.angular);

(function(module) {
try {
  module = angular.module('pipDocuments.Templates');
} catch (e) {
  module = angular.module('pipDocuments.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('document_list/document_list.html',
    '<!--\n' +
    '@file Document list control content\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-button class="pip-documents-name"\n' +
    '           ng-class="{\'lp24-flex rp16\': pipDocumentIcon}"\n' +
    '           ng-click="onTitleClick($event); onResize()"\n' +
    '           aria-label="RESIZE">\n' +
    '\n' +
    '    <div class="layout-align-start-center layout-row w-stretch">\n' +
    '        <md-icon md-svg-icon="icons:document" ng-class="{\'pip-icon\': pipDocumentIcon}" ng-if="pipDocumentIcon"></md-icon>\n' +
    '        <span class="pip-documents-text">\n' +
    '            {{documents.length}} {{::\'DOCUMENTS_ATTACHED\' | translate}}\n' +
    '        </span>\n' +
    '\n' +
    '        <md-icon class="icon-up" md-svg-icon="icons:triangle-up"></md-icon>\n' +
    '        <md-icon class="icon-down" md-svg-icon="icons:triangle-down"></md-icon>\n' +
    '    </div>\n' +
    '</md-button>\n' +
    '<div pip-focused class="pip-documents-container bm8"  ng-class="{\'lp24-flex rp24-flex\': pipDocumentIcon}">\n' +
    '    <md-button class="pip-document-download md-primary"\n' +
    '               ng-class="{\'pip-focusable\' : !ngDisabled()}"\n' +
    '               href="{{::documentUrl(document)}}"\n' +
    '               target="_blank"\n' +
    '               ng-disabled="ngDisabled() || document.error"\n' +
    '               ng-repeat="document in documents track by document.file_id"\n' +
    '               aria-label="DOCUMENT">\n' +
    '\n' +
    '        <div class="pip-default-icon">\n' +
    '            <md-icon md-svg-icon="icons:{{::documentList.icon}}"></md-icon>\n' +
    '        </div>\n' +
    '        <div class="pip-document-title">\n' +
    '            {{::document.file_name}}\n' +
    '        </div>\n' +
    '    </md-button>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDocuments.Templates');
} catch (e) {
  module = angular.module('pipDocuments.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('document_list/document_list_collapse.html',
    '<!--\n' +
    '@file Document list control content (collapsable version)\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<div class="pip-documents-name" ng-click="onTitleClick($event); onResize()">\n' +
    '    <span class="pip-documents-text">\n' +
    '        {{documents.length}} {{::\'DOCUMENTS_ATTACHED\' | translate}}\n' +
    '    </span>\n' +
    '\n' +
    '    <md-icon class="icon-up" md-svg-icon="icons:triangle-up"></md-icon>\n' +
    '    <md-icon class="icon-down" md-svg-icon="icons:triangle-down"></md-icon>\n' +
    '</div>\n' +
    '<div pip-focused class="pip-documents-container bm8">\n' +
    '    <md-button class="pip-document-download pip-focusable md-primary"\n' +
    '               href="{{::document.url}}"\n' +
    '               target="_blank"\n' +
    '               ng-repeat="document in documents track by document.file_id"\n' +
    '               aria-label="DOCUMENT">\n' +
    '        <div class="pip-default-icon">\n' +
    '            <md-icon md-svg-icon="icons:{{::icon}}"></md-icon>\n' +
    '        </div>\n' +
    '        <div class="pip-document-title">\n' +
    '            {{::document.file_name}}\n' +
    '        </div>\n' +
    '    </md-button>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDocuments.Templates');
} catch (e) {
  module = angular.module('pipDocuments.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('document_list_edit/document_list_edit.html',
    '<!--\n' +
    '@file Document list edit control content\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '<div pip-focusable>\n' +
    '	<div class="pip-document-upload pointer md-primary "\n' +
    '		 ng-class="{\'pip-focusable\' : !ngDisabled(), \'pip-item-error\' : item.state == \'error\'}"\n' +
    '		 ng-keydown="onKeyDown($event, item)"\n' +
    '		 tabindex="{{ ngDisabled() ? -1 : 0 }}"\n' +
    '		 ng-repeat="item in control.items | filter: filterItem">\n' +
    '\n' +
    '		<div class="pip-default-icon"\n' +
    '			 ng-class="{ \'pip-document-new\': item.id == null }">\n' +
    '			<md-icon pip-cancel-drag="true" class="md-primary" ng-if="item.state == \'original\' || item.state == \'added\'"\n' +
    '					 md-svg-icon="icons:{{::documentList.icon}}">\n' +
    '			</md-icon>\n' +
    '			<md-icon pip-cancel-drag="true" class="md-warn" ng-if="item.state == \'error\'"\n' +
    '					 md-svg-icon="icons:{{::documentList.iconError}}">\n' +
    '			</md-icon>\n' +
    '		</div>\n' +
    '\n' +
    '		<div class="pip-document-title" pip-cancel-drag="true">\n' +
    '			{{::item.name}}\n' +
    '		</div>\n' +
    '		<md-button ng-click="onDelete(item)"\n' +
    '				   ng-disabled="ngDisabled() || control.uploading"\n' +
    '				   tabindex="-1"\n' +
    '				   ng-hide="ngDisabled()"\n' +
    '				   class="md-icon-button" aria-label="DELETE">\n' +
    '\n' +
    '			<md-icon md-svg-icon="icons:cross" pip-cancel-drag="true"></md-icon>\n' +
    '		</md-button>\n' +
    '		<md-progress-linear ng-show="item.uploading" ng-value="item.progress"></md-progress-linear>\n' +
    '	</div>\n' +
    '	\n' +
    '	<button class="pip-document-upload pip-document-drop "\n' +
    '			ng-class="{\'pip-focusable\' : !ngDisabled()}"\n' +
    '			ng-keydown="onKeyDown($event)" tabindex="0"\n' +
    '			ng-file-drop ng-file-select ng-file-change="onSelect($files)"\n' +
    '			ng-multiple="true"\n' +
    '			ng-disabled="ngDisabled() || control.uploading"\n' +
    '			aria-label="UPLOAD">\n' +
    '\n' +
    '		<div class="pip-default-icon">\n' +
    '			<md-icon pip-cancel-drag="true" md-svg-icon="icons:{{::documentList.icon}}"></md-icon>\n' +
    '		</div>\n' +
    '		<div class="pip-default-text">\n' +
    '			<span>\n' +
    '				{{documentList.text | translate}}\n' +
    '			</span>\n' +
    '		</div>\n' +
    '	</button>\n' +
    '	<div class="clearfix"></div>\n' +
    '</div>\n' +
    '');
}]);
})();

/**
 * @file Document list control
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve samples in sampler app
 */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipDocumentList', ['pipCore', 'pipRest', 'pipFocused', 'pipDocuments.Templates']);

    thisModule.config(['pipTranslateProvider', function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            DOCUMENTS_ATTACHED: 'document(s) attached',
            ERROR_DOCUMENTS_LOADED: 'Error: <%= error_number %> document(s) are not loaded'
        });
        pipTranslateProvider.translations('ru', {
            DOCUMENTS_ATTACHED: 'документов добавлено',
            ERROR_DOCUMENTS_LOADED: 'Ошибка: <%= error_number %> документ(ов) не загружено'
        });
    }]);

    thisModule.directive('pipDocumentList',
        ['$parse', '$rootScope', 'pipUtils', 'pipRest', 'pipToasts', 'pipTranslate', function ($parse, $rootScope, pipUtils, pipRest, pipToasts, pipTranslate) {  // eslint-disable-line no-unused-vars
            return {
                restrict: 'EA',
                scope: true,
                templateUrl: 'document_list/document_list.html',
                link: function ($scope, $element, $attrs) {
                    var documentsGetter = $parse($attrs.pipDocuments),
                        $documentsContainer = $element.children('.pip-documents-container'),
                        $up = $element.find('.icon-up'),
                        $down = $element.find('.icon-down'),
                        collapsable = pipUtils.toBoolean($attrs.pipCollapse);

                    $scope.documentList = {};
                    $scope.documentList.icon = 'document';
                    $scope.documents = documentsGetter($scope);

                    if ($attrs.pipDocumentIcon) {
                        $scope.pipDocumentIcon = true;
                    }

                    $scope.showDocuments = collapsable;

                    if (!collapsable) {
                        $up.hide();
                        $documentsContainer.hide();
                    } else {
                        $down.hide();
                    }

                    if ($attrs.disabled) {
                        $up.hide();
                        $down.hide();
                    }

                    // Also optimization to avoid watch if it is unnecessary
                    if (pipUtils.toBoolean($attrs.pipRebind)) {
                        $scope.$watch(documentsGetter, function (newValue) {
                            if (differentDocumentList(newValue)) {
                                $scope.documents = newValue;
                            }
                        });
                    }

                    $scope.onTitleClick = onTitleClick;
                    $scope.documentUrl = documentUrl;

                    // Add class
                    $element.addClass('pip-document-list');

                    function differentDocumentList(newList) {
                        var i, obj;

                        if (!$scope.documents && newList) { return true; }
                        if ($scope.documents && !newList) { return true; }
                        if ($scope.documents.length !== newList.length) { return true; }

                        for (i = 0; i < newList.length; i++) {
                            obj = _.find($scope.documents, {file_id: newList[i].file_id});

                            if (obj === undefined) { return true; }
                        }

                        return false;
                    }

                    function onTitleClick(event) {
                        if (event) { event.stopPropagation(); }

                        if ($attrs.disabled) { return; }

                        $scope.showDocuments = !$scope.showDocuments;
                        $up[$scope.showDocuments ? 'show' : 'hide']();
                        $down[!$scope.showDocuments ? 'show' : 'hide']();
                        $documentsContainer[$scope.showDocuments ? 'show' : 'hide']();
                    }

                    function documentUrl(document) {
                        var
                            serverUrl = pipRest.serverUrl(),
                            userId = ($rootScope.$user || {}).id,
                            partyId = ($rootScope.$party || {}).id || userId;

                        return serverUrl + '/api/parties/' + partyId + '/files/' + document.file_id + '/content';
                    }
                }
            };
        }]
    );

})(window.angular, window._);


/**
 * @file Document list edit control
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve samples in sampler app
 * - Add add/remove/hover animations
 */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipDocumentListEdit',
        ['ui.event', 'angularFileUpload', 'pipCore', 'pipFocused', 'pipRest', 'pipDocuments.Templates']);

    thisModule.config(['pipTranslateProvider', function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            DOCUMENT_LIST_EDIT_TEXT: 'Click here to add a document',
            ERROR_TRANSACTION_IN_PROGRESS: 'Transaction is in progress. Please, wait until it\'s finished or abort'
        });
        pipTranslateProvider.translations('ru', {
            DOCUMENT_LIST_EDIT_TEXT: 'Нажмите сюда, чтобы добавить документ',
            ERROR_TRANSACTION_IN_PROGRESS: 'Транзакция еще не завершена. Подождите окончания или прервите её'
        });
    }]);

    thisModule.directive('pipDocumentListEdit',
        function () {
            return {
                restrict: 'EA',
                scope: {
                    pipDocuments: '=',
                    pipAddedDocument: '=',
                    ngDisabled: '&',
                    pipCreated: '&',
                    pipChanged: '&'
                },
                templateUrl: 'document_list_edit/document_list_edit.html',
                controller: 'pipDocumentListEditController'
            };
        }
    );

    thisModule.controller('pipDocumentListEditController',
        ['$scope', '$rootScope', '$element', '$attrs', '$parse', '$http', '$upload', '$timeout', 'pipRest', 'pipUtils', function ($scope, $rootScope, $element, $attrs, $parse, $http, $upload, $timeout, pipRest, pipUtils) {
            var
                $control = $element.children('.pip-picture-drop'),
                itemPin = 0;

            $scope.documentList = {};
            $scope.documentList.text = $attrs.pipDefaultText || 'DOCUMENT_LIST_EDIT_TEXT';
            $scope.documentList.icon = $attrs.pipDefaultIcon || 'document';
            $scope.documentList.iconError = 'warn-circle';
            $scope.documentStartState = pipUtils.toBoolean($scope.pipAddedDocument) ? 'copied' : 'original';
            $scope.cancelDrag = pipUtils.toBoolean($attrs.pipCanselDrag) === true;

            $scope.control = {
                uploading: 0,
                items: getItems(),
                reset: resetDocument,
                save: saveDocument,
                abort: onAbort
            };

            $scope.filterItem = filterItem;
            $scope.onDelete = onDelete;
            $scope.onKeyDown = onKeyDown;
            $scope.onChange = onChange;
            $scope.onSelect = onSelect;

            // Add class
            $element.addClass('pip-document-list-edit');

            // Initialize control
            $scope.control.reset();

            executeCallback();

            // Watch for changes
            $scope.$watchCollection(
                function () {
                    // Todo: Optimize change tracking
                    return $scope.pipDocuments;
                },
                function (newValue) {
                    if (!_.isEqual(newValue, $scope.pipDocuments)) {
                        $scope.control.reset();
                    }
                }
            );

            function getItems() {
                var
                    documents = $scope.pipDocuments,
                    items = [],
                    i;

                if (documents === null || documents.length === 0) {
                    return items;
                }

                for (i = 0; i < documents.length; i++) {
                    items.push({
                        pin: itemPin++,
                        id: documents[i].file_id,
                        name: documents[i].file_name,
                        uploading: false,
                        uploaded: false,
                        progress: 0,
                        file: null,
                        state: $scope.documentStartState // 'original'
                    });
                }

                return items;
            }

            function setItems() {
                var item, i;

                // Clean the array
                if ($scope.pipDocuments && $scope.pipDocuments.length > 0) {
                    $scope.pipDocuments.splice(0, $scope.pipDocuments.length);
                }

                for (i = 0; i < $scope.control.items.length; i++) {
                    item = $scope.control.items[i];

                    if (item.id) {
                        $scope.pipDocuments.push({
                            file_id: item.id,
                            file_name: item.name
                        });
                    }
                }
            }

            function resetDocument() {
                $scope.control.uploading = 0;
                $scope.control.items = getItems();
            }

            function getItemIdUrl(item) {
                var
                    serverUrl = pipRest.serverUrl(),
                    partyId = $rootScope.$party ? $rootScope.$party.id : pipRest.userId();

                return serverUrl + '/api/parties/' + partyId + '/files/' + item.id;
            }

            function addItemUrl(item) {
                var
                    serverUrl = pipRest.serverUrl(),
                    partyId = $rootScope.$party ? $rootScope.$party.id : pipRest.userId();

                return serverUrl + '/api/parties/' + partyId + '/files?name=' + item.file.name;
            }

            function addItem(item, callback) {
                var
                    file = item.file,
                    fileReader = new FileReader();

                // Avoid double transactions
                if (item.uploading || item.file === null || item.state !== 'added') { return; }

                fileReader.onload = function (e) {
                    if (item.uploading) { return; }

                    item.uploading = true;

                    item.upload = $upload.http({
                        url: addItemUrl(item),
                        headers: { 'Content-Type': file.type },
                        data: e.target.result
                    })
                    .then(
                        function (response) {
                            item.id = response.data.id;
                            item.name = response.data.filename || item.name;
                            item.uploaded = true;
                            item.uploading = false;
                            item.progress = 0;
                            item.upload = null;
                            item.file = null;
                            item.state = 'original';
                            callback();
                        },
                        function () {
                            item.uploaded = false;
                            item.uploading = false;
                            item.progress = 0;
                            item.upload = null;
                            item.state = 'error';
                            callback();
                        },
                        function (e) {
                            // Math.min is to fix IE which reports 200% sometimes
                            item.progress = Math.min(100, parseInt(100.0 * e.loaded / e.total));
                        }
                    );
                };

                fileReader.readAsArrayBuffer(file);
            }

            function deleteItem(item, callback) {
                var control = $scope.control;

                // Avoid double transactions
                if (item.upload) {
                    item.upload.abort();
                    item.upload = null;
                }

                if (item.state !== 'deleted') { return; }

                $http['delete'](getItemIdUrl(item))
                .success(function () {
                    _.remove(control.items, {pin: item.pin});
                    callback();
                })
                .error(function (data) {
                    // Todo: perform a better processing
                    if (data == null) {
                        _.remove(control.items, {pin: item.pin});
                    } else {
                        item.uploaded = false;
                        item.uploading = false;
                        item.progress = 0;
                        item.upload = null;
                    }

                    callback(data);
                });
            }

            function saveDocument(successCallback, errorCallback) {
                var control = $scope.control,
                    onItemCallback,
                    item,
                    i;

                if (control.uploading) {
                    if (errorCallback) {
                        errorCallback('ERROR_TRANSACTION_IN_PROGRESS');
                    }

                    return;
                }

                control.error = null;
                control.uploading = 0;

                onItemCallback = function (error) {
                    // Storing only the first error
                    if (error && !control.error) {
                        control.error = error;
                    }

                    control.uploading--;

                    // Finished uploading
                    if (control.uploading == 0) {
                        if (control.error) {
                            if (errorCallback) {
                                errorCallback(control.error);
                            } else {
                                console.error(control.error);   // eslint-disable-line no-console
                            }
                        } else {
                            setItems();
                            if (successCallback) {
                                successCallback();
                            }
                        }
                    }
                };

                for (i = 0; i < control.items.length; i++) {
                    item = control.items[i];

                    if (item.state === 'added') {
                        control.uploading++;
                        addItem(item, onItemCallback);
                    } else if (item.state === 'deleted') {
                        control.uploading++;
                        deleteItem(item, onItemCallback);
                    }
                }

                // Nothing was uploaded
                if (control.uploading == 0) {
                    if (successCallback) {
                        successCallback();
                    }
                }
            }

            function onAbort() {
                var control = $scope.control,
                    item,
                    i;

                for (i = 0; i < control.items.length; i++) {
                    item = control.items[i];

                    if (item.uploading) {
                        if (item.upload) {
                            item.upload.abort();
                        }

                        item.uploaded = false;
                        item.uploading = false;
                        item.progress = 0;
                        item.upload = null;
                    }
                }

                // Abort transaction
                control.uploading = 0;
            }

            // Visualization functions

            function filterItem(item) {
                return item.state !== 'deleted';
            }

            // Process user actions
            function onSelect($files) {
                var file,
                    i;

                $control.focus();

                if ($files == null || $files.length === 0) { return; }

                for (i = 0; i < $files.length; i++) {
                    file = $files[i];

                    $scope.control.items.push({
                        pin: itemPin++,
                        id: null,
                        name: file.name,
                        uploading: false,
                        uploaded: false,
                        progress: 0,
                        file: file,
                        state: 'added'
                    });
                }

                $scope.onChange();
            }

            function onDelete(item) {
                if (item.state === 'added' || item.state === 'copied') {
                    _.remove($scope.control.items, {pin: item.pin});
                } else {
                    item.state = 'deleted';
                }

                $scope.onChange();
            }

            function onKeyDown($event, item) {
                if (item) {
                    if ($event.keyCode === 46 || $event.keyCode === 8) {
                        if (item.state === 'added') {
                            _.remove($scope.control.items, { pin: item.pin });
                        } else {
                            item.state = 'deleted';
                        }

                        $scope.onChange();
                    }
                } else if ($event.keyCode === 13 || $event.keyCode === 32) {
                    // !! Avoid clash with $apply()
                    setTimeout(function () {
                        $control.trigger('click');
                    }, 0);
                }
            }

            // On change event
            function onChange() {
                if ($scope.pipChanged) {
                    $scope.pipChanged({
                        $event: { sender: $scope.control },
                        $control: $scope.control
                    });
                }
            }

            function executeCallback() {
                // Execute callback
                if ($scope.pipCreated) {
                    $scope.pipCreated({
                        $event: { sender: $scope.control },
                        $control: $scope.control
                    });
                }
            }

        }]
    );

})(window.angular, window._);




/**
 * @file Registration of pictures WebUI controls
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';

    angular.module('pipPictures', [        
        'pipAddImage',
        'pipAvatar',
        'pipAvatarEdit',
        'pipPicture',
        'pipPictureEdit',
        'pipCollage',
        'pipPictureListEdit',        
        'pipCameraDialog',        
        'pipPictureUrlDialog'
    ]);
    
})();



(function(module) {
try {
  module = angular.module('pipPictures.Templates');
} catch (e) {
  module = angular.module('pipPictures.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('add_image/add_image.html',
    ' <!--\n' +
    '@file Add image directive content\n' +
    '@copyright Digital Living Software Corp. 2014-2015\n' +
    '-->\n' +
    '\n' +
    '<md-menu>\n' +
    '        <ng-transclude class="pip-add-image-open-button" ng-click="ngDisabled() ? \'\' : $mdOpenMenu()"></ng-transclude>\n' +
    '        <md-menu-content width="4">\n' +
    '            <md-menu-item>\n' +
    '                <md-button class="layout-row layout-align-start-center" accept="image/*"\n' +
    '                           ng-keydown="onKeyDown($event)" ng-multiple="isMulti()"\n' +
    '                           ng-file-select ng-file-change="onFileChange($files)" ng-click="hideMenu()" ng-file-drop>\n' +
    '\n' +
    '                    <md-icon class="text-headline text-grey rm24-flex" md-svg-icon="icons:folder"></md-icon>\n' +
    '                    <!--<span class="icon-folder text-headline text-grey tp8 rm24-flex"></span>-->\n' +
    '                    <span class="text-grey">{{::\'FILE\' | translate}}</span>\n' +
    '                </md-button>\n' +
    '            </md-menu-item>\n' +
    '            <md-menu-item>\n' +
    '                <md-button class="layout-row layout-align-start-center" ng-click="onWebLinkClick()">\n' +
    '                    <md-icon class="text-headline text-grey rm24-flex" md-svg-icon="icons:weblink"></md-icon>\n' +
    '                    <!--<span class="icon-weblink text-headline text-grey tp8 rm24-flex"></span>-->\n' +
    '                    <span class="text-grey">{{::\'WEB_LINK\' | translate}}</span>\n' +
    '                </md-button>\n' +
    '            </md-menu-item>\n' +
    '            <md-menu-item>\n' +
    '                <md-button class="layout-row layout-align-start-center" ng-click="onCameraClick()">\n' +
    '                    <md-icon class="text-headline text-grey rm24-flex" md-svg-icon="icons:camera"></md-icon>\n' +
    '                    <!--<span class="icon-camera text-headline text-grey tp8 rm24-flex"></span>-->\n' +
    '                    <span class="text-grey">{{::\'CAMERA\' | translate}}</span>\n' +
    '                </md-button>\n' +
    '            </md-menu-item>\n' +
    '            <md-menu-item>\n' +
    '                <md-button class="layout-row layout-align-start-center" ng-click="onGalleryClick()">\n' +
    '                    <md-icon class="text-headline text-grey rm24-flex" md-svg-icon="icons:images"></md-icon>\n' +
    '                    <!--<span class="icon-images text-headline text-grey tp8 rm24-flex"></span>-->\n' +
    '                    <span class="text-grey">{{::\'IMAGE_GALLERY\' | translate}}</span>\n' +
    '                </md-button>\n' +
    '            </md-menu-item>\n' +
    '        </md-menu-content>\n' +
    '    </md-menu>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipPictures.Templates');
} catch (e) {
  module = angular.module('pipPictures.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('camera_dialog/camera_dialog.html',
    '<!--\n' +
    '@file Camera dialog content\n' +
    '@copyright Digital Living Software Corp. 2014-2015\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-dialog pip-picture-dialog pip-camera-dialog layout-column" md-theme="{{theme}}"\n' +
    '           ng-show="browser != \'android\'"\n' +
    '        ng-class="{\'pip-android-dialog\': browser == \'android\' || !browser}">\n' +
    '    <div class="pip-header" class="layout-row layout-align-start-center">\n' +
    '        <md-button  ng-click="onCancelClick()" class="md-icon-button"\n' +
    '                    aria-label="{{ ::\'CANCEL\' | translate }}">\n' +
    '            <md-icon class="text-grey" md-svg-icon="icons:arrow-left"></md-icon>\n' +
    '        </md-button>\n' +
    '        <h3 class="m0 text-title">{{ ::\'TAKE_PICTURE\' | translate }}</h3>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="pip-body">\n' +
    '        <div class="camera-stream" ng-hide="webCamError || browser == \'android\'"></div>\n' +
    '        <div class="camera-error"\n' +
    '             ng-show="webCamError || browser == \'android\'"\n' +
    '             class="layout-row layout-align-center-center">\n' +
    '            <span>{{ ::\'WEB_CAM_ERROR\' | translate }}</span>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="pip-footer">\n' +
    '        <div class="w48">\n' +
    '            <md-button ng-click="onResetPicture()"\n' +
    '                       ng-hide="!$freeze || webCamError"\n' +
    '                       class="md-icon-button"\n' +
    '                       ng-disabled="transaction.busy()"\n' +
    '                       aria-label="{{ ::\'REMOVE_PICTURE\' | translate }}">\n' +
    '                <md-icon class="text-grey" md-svg-icon="icons:refresh"></md-icon>\n' +
    '            </md-button>\n' +
    '        </div>\n' +
    '        <div class="flex"></div>\n' +
    '        <div class="w48">\n' +
    '            <md-button ng-click="onTakePictureClick()"\n' +
    '                       ng-hide="webCamError"\n' +
    '                       class="md-icon-button"\n' +
    '                       aria-label="{{ ::\'TAKE_PICTURE\' | translate }}">\n' +
    '                <md-icon class="text-grey icon-button" md-svg-icon="icons:{{$freeze ? \'check\' : \'camera\'}}"></md-icon>\n' +
    '            </md-button>\n' +
    '\n' +
    '        </div>\n' +
    '        <div class="flex"></div>\n' +
    '        <div class="w48">\n' +
    '            <md-button  ng-click="onCancelClick()" class="md-icon-button"\n' +
    '                        aria-label="{{ ::\'CANCEL\' | translate }}">\n' +
    '                <md-icon class="text-grey" md-svg-icon="icons:cross"></md-icon>\n' +
    '            </md-button>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '</md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipPictures.Templates');
} catch (e) {
  module = angular.module('pipPictures.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('gallery_search_dialog/gallery_search_dialog.html',
    '<md-dialog class="pip-dialog pip-gallery-search-dialog pip-picture-dialog layout-column"\n' +
    '           md-theme="{{theme}}">\n' +
    '    <md-progress-linear\n' +
    '            ng-show="transaction.busy()" md-mode="indeterminate">\n' +
    '    </md-progress-linear>\n' +
    '\n' +
    '    <md-dialog-content class="pip-body lp0 rp0 tp0 pip-scroll flex layout-row">\n' +
    '        <div class="layout-column layout-align-start-start flex">\n' +
    '            <div class="pip-header w-stretch layout-column layout-align-start-start">\n' +
    '                <h3 class="w-stretch text-title m0 bp8">\n' +
    '                    <md-button  class="md-icon-button m0"\n' +
    '                                ng-click="onCancelClick()"\n' +
    '                                aria-label="{{ ::\'CANCEL\' | translate }}">\n' +
    '                        <md-icon class="text-grey" md-svg-icon="icons:arrow-left"></md-icon>\n' +
    '                    </md-button>\n' +
    '                    {{::\'IMAGE_GALLERY\' | translate}}\n' +
    '                </h3>\n' +
    '                <div class="w-stretch divider-bottom layout-row layout-start-center">\n' +
    '                    <input class="no-divider rm8 text-subhead1 flex"\n' +
    '                           ng-disabled="transaction.busy()"\n' +
    '                           ng-model="$search" ng-keypress="onKeyPress($event)"\n' +
    '                           placeholder="{{::\'SEARCH_PICTURES\' | translate}}"\n' +
    '                           type="text" tabindex="1">\n' +
    '\n' +
    '                    <md-button class="md-icon-button md-icon-button-square p0 pip-search-button md-primary"\n' +
    '                               ng-click="onSearchClick()"\n' +
    '                               ng-hide="optionDefault"\n' +
    '                               tabindex="-1" aria-label="SEARCH">\n' +
    '                        <md-icon class="text-opacity md-primary" md-svg-icon="icons:search-square "></md-icon>\n' +
    '                    </md-button>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="pip-content flex"\n' +
    '                 ng-show="$images.length > 0">\n' +
    '                <div class="pip-image-container"\n' +
    '                     ng-click="onImageClick(image)"\n' +
    '                     ng-repeat="image in $images track by $index"\n' +
    '                     ng-class="{\'checked\': image.checked}"\n' +
    '                     tabindex="{{ $index + 2 }}">\n' +
    '\n' +
    '                    <pip-picture pip-src="image.thumbnail"\n' +
    '                                 pip-default-icon="icon-images"\n' +
    '                                 pip-rebind="true">\n' +
    '                    </pip-picture>\n' +
    '                    <div class="pip-checked-cover"></div>\n' +
    '                    <div class="pip-checkbox-backdrop">\n' +
    '                        <md-checkbox md-no-ink\n' +
    '                                     ng-model="image.checked"\n' +
    '                                     ng-click="image.checked = !image.checked"\n' +
    '                                     aria-label="CHECKED">\n' +
    '                        </md-checkbox>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="pip-no-images w-stretch layout-column layout-align-center-center flex"\n' +
    '                 ng-show="$images.length == 0">\n' +
    '                <img src="images/add_from_image_library.svg" width="200" height="200">\n' +
    '                <p class="text-secondary opacity-secondary text-center">{{\'IMAGE_START_SEARCH\' | translate}}</p>\n' +
    '                <!--<md-icon class="text-grey" md-svg-icon="icons:images"></md-icon> -->\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </md-dialog-content>\n' +
    '    <div class="pip-footer">\n' +
    '        <md-button  ng-click="onCancelClick()"\n' +
    '                    ng-hide="transaction.busy()"\n' +
    '                    aria-label="{{ ::\'CANCEL\' | translate }}"\n' +
    '                    tabindex="{{ $images.length + 3 }}">\n' +
    '                <span class="text-grey">\n' +
    '                    {{ ::\'CANCEL\' | translate }}\n' +
    '                </span>\n' +
    '        </md-button>\n' +
    '        <md-button ng-if="transaction.busy()" ng-click="onStopSearchClick()" class="md-raised md-warn m0"\n' +
    '                   tabindex="5" aria-label="ABORT"\n' +
    '                   pip-test="button-cancel">\n' +
    '            {{::\'CANCEL\' | translate}}\n' +
    '        </md-button>\n' +
    '        <md-button  class="md-accent"\n' +
    '                    ng-hide="transaction.busy()"\n' +
    '                    ng-disabled="addButtonDisabled()"\n' +
    '                    ng-click="onAddClick()"\n' +
    '                    aria-label="{{ ::\'ADD\' | translate }}"\n' +
    '                    tabindex="{{ $images.length + 4 }}">\n' +
    '\n' +
    '            {{ ::\'ADD\' | translate }}\n' +
    '        </md-button>\n' +
    '    </div>\n' +
    '</md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipPictures.Templates');
} catch (e) {
  module = angular.module('pipPictures.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('picture_edit/picture_edit.html',
    '<div class="pip-picture-upload pip-picture-drop md-focused"\n' +
    '	 ng-keydown="onKeyDown($event)"\n' +
    ' 	 tabindex="{{ ngDisabled() || control.uploading ? -1 : 0 }}"\n' +
    '	 pip-changed="readItemLocally(url, file)"\n' +
    '	 ng-disabled="ngDisabled()"\n' +
    '	 pip-multi="false"\n' +
    '	 ng-focus="onFocus()"\n' +
    '	 ng-blur="onBlur()"\n' +
    '	 pip-add-image>\n' +
    '\n' +
    '	<div class="pip-default-icon" ng-show="empty()">\n' +
    '		<md-icon  class="pip-picture-icon" md-svg-icon="icons:{{icon}}"></md-icon>\n' +
    '	</div>\n' +
    '	<div class="pip-default-text" ng-show="empty()">\n' +
    '		<span>{{text | translate}}</span>\n' +
    '	</div>\n' +
    '\n' +
    '	<img class="pip-picture-image"\n' +
    '		 ng-src="{{control.url}}"\n' +
    '		 ng-show="!empty()"\n' +
    '		 ng-class="{ \'pip-image-new\': isUpdated(), \'cursor-default\' : ngDisabled() || control.uploading }"\n' +
    ' 		 ui-event="{ error: \'onImageError($event)\', load: \'onImageLoad($event)\' }">\n' +
    '\n' +
    '	<md-button class="md-icon-button"\n' +
    '			   ng-click="onDeleteClick($event)"\n' +
    '			   tabindex="-1" aria-label="delete"\n' +
    '			   ng-hide="empty() || ngDisabled()"\n' +
    '			   ng-disabled="ngDisabled() || control.uploading">\n' +
    '		<md-icon  md-svg-icon="icons:cross"></md-icon>\n' +
    '	</md-button>\n' +
    '\n' +
    '	<md-progress-linear ng-show="control.uploading"\n' +
    '						ng-value="control.progress">\n' +
    '	</md-progress-linear>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipPictures.Templates');
} catch (e) {
  module = angular.module('pipPictures.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('picture_list_edit/picture_list_edit.html',
    '<div pip-focused>\n' +
    '	<div class="pip-picture-upload pointer pip-focusable"\n' +
    '		 ng-class="{\'pip-picture-error\': item.error}"\n' +
    '		 ng-keydown="onKeyDown($event, item)"\n' +
    '		 tabindex="{{ ngDisabled() ? -1 : 0 }}"\n' +
    '		 ng-repeat="item in control.items | filter: filterItem">\n' +
    '\n' +
    '		<div class="pip-default-icon" ng-hide="item.loaded || item.error">\n' +
    '			<md-icon  pip-cancel-drag="true" class="pip-picture-icon" md-svg-icon="icons:{{icon}}"></md-icon>\n' +
    '		</div>\n' +
    '		<div class="pip-default-text" ng-show="item.error">\n' +
    '			<!--span style="color: red">{{ \'ERROR_IMAGE_PRELOADING\' | translate}}</span-->\n' +
    '			<md-icon  pip-cancel-drag="true" md-svg-icon="icons:warn-circle"></md-icon>\n' +
    '		</div>\n' +
    '		<img ng-src="{{::item.url}}"\n' +
    '			 pip-cancel-drag="true"\n' +
    '			 ng-hide="item.error"\n' +
    '			 ng-class="{ \'pip-image-new\': item.state == \'added\' }"\n' +
    '			 ui-event="{ error: \'onImageError($event, item)\', load: \'onImageLoad($event, item)\' }">\n' +
    '\n' +
    '		<md-button ng-click="onDeleteClick(item)"\n' +
    '				   ng-disabled="ngDisabled() || control.uploading" tabindex="-1"\n' +
    '				   aria-label="delete"\n' +
    '				   class="md-icon-button">\n' +
    '\n' +
    '			<md-icon  pip-cancel-drag="true" md-svg-icon="icons:cross"></md-icon>\n' +
    '		</md-button>\n' +
    '		<md-progress-linear md-mode="indeterminate" ng-show="item.uploading" value="{{ item.progress }}">\n' +
    '		</md-progress-linear>\n' +
    '	</div>\n' +
    '\n' +
    '	<button class="pip-picture-upload pip-picture-drop pip-focusable"\n' +
    '			pip-add-image\n' +
    '		    ng-focus="onFocus()"\n' +
    '	        ng-blur="onBlur()"\n' +
    '			pip-changed="readItemLocally(url, file)"\n' +
    '			ng-disabled="ngDisabled() || control.uploading">\n' +
    '\n' +
    '		<div class="pip-default-icon">\n' +
    '			<md-icon  pip-cancel-drag="true" class="pip-picture-icon" md-svg-icon="icons:{{icon}}"></md-icon>\n' +
    '		</div>\n' +
    '		<div class="pip-default-text">\n' +
    '			<span>{{text | translate}}</span>\n' +
    '		</div>\n' +
    '	</button>\n' +
    '	<div class="clearfix"></div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipPictures.Templates');
} catch (e) {
  module = angular.module('pipPictures.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('picture_url_dialog/picture_url_dialog.html',
    '<!--\n' +
    '@file Picture URL dialog content\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-dialog pip-picture-url-dialog pip-picture-dialog layout-column"\n' +
    '           md-theme="{{theme}}">\n' +
    '\n' +
    '    <md-dialog-content class="pip-body lp0 rp0 tp0 pip-scroll">\n' +
    '        <div class="pip-header bm16 layout-row layout-align-start-center">\n' +
    '            <md-button  ng-click="onCancelClick()" class="md-icon-button lm0"\n' +
    '                        aria-label="{{ ::\'CANCEL\' | translate }}">\n' +
    '                <md-icon class="text-grey" md-svg-icon="icons:arrow-left"></md-icon>\n' +
    '            </md-button>\n' +
    '            <h3 class="text-title m0">\n' +
    '                {{ ::\'PICTURE_FROM_WEBLINK\' | translate}}\n' +
    '            </h3>\n' +
    '        </div>\n' +
    '\n' +
    '        <div class="pip-content">\n' +
    '            <md-input-container md-no-float class="w-stretch text-subhead1">\n' +
    '                <input type="text" ng-model="url" ng-change="checkUrl()" placeholder="{{:: \'LINK_PICTURE\' | translate}}"/>\n' +
    '            </md-input-container>\n' +
    '\n' +
    '            <div class="w-stretch layout-row layout-align-center-center"\n' +
    '                 ng-hide="invalid">\n' +
    '                <img id="url_image"/>\n' +
    '            </div>\n' +
    '\n' +
    '            <div class="pip-no-images layout-row layout-align-center-center" ng-show="invalid">\n' +
    '                <md-icon class="text-grey" md-svg-icon="icons:images"></md-icon>\n' +
    '            </div>\n' +
    '\n' +
    '        </div>\n' +
    '    </md-dialog-content>\n' +
    '    <div class="pip-footer">\n' +
    '        <md-button ng-click="onCancelClick()" aria-label="{{ ::\'CANCEL\' | translate }}">\n' +
    '            {{ ::\'CANCEL\' | translate }}\n' +
    '        </md-button>\n' +
    '\n' +
    '        <md-button class="md-accent" ng-click="onAddClick()" ng-disabled="invalid"\n' +
    '                   aria-label="{{ ::\'ADD\' | translate }}">\n' +
    '            {{ ::\'ADD\' | translate }}\n' +
    '        </md-button>\n' +
    '    </div>\n' +
    '</md-dialog>');
}]);
})();

/**
 * @file Add image control
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipAddImage", ['pipCameraDialog', 'pipPictureUrlDialog', 'pipGallerySearchDialog', 'pipCore']);

    thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'FILE' : 'Upload pictures',
            'WEB_LINK' : 'Use web link',
            'CAMERA' : 'Take photo',
            'IMAGE_GALLERY': 'Use image library',
        });
        pipTranslateProvider.translations('ru', {
            'FILE' : 'Загрузить картинку',
            'WEB_LINK' : 'Вставить веб ссылка',
            'CAMERA' : 'Использовать камеру',
            'IMAGE_GALLERY': 'Открыть галерею изображений'
        });
    }]);

    thisModule.directive('pipAddImage', 
        function() {
            return {
                restrict: 'AC',
                scope: {
                    $images: '=pipImages',
                    onChange: '&pipChanged',
                    multi: '&pipMulti',
                    ngDisabled: '&'
                },
                transclude: true,
                templateUrl: 'add_image/add_image.html',
                controller: 'pipAddImageController'
            }
        }
    );

    thisModule.controller('pipAddImageController',
        ['$scope', '$element', '$mdMenu', '$timeout', 'pipCameraDialog', 'pipPictureUrlDialog', 'pipGallerySearchDialog', 'pipUtils', function ($scope, $element, $mdMenu, $timeout, pipCameraDialog, pipPictureUrlDialog, pipGallerySearchDialog, pipUtils) {

            $scope.hideMenu = hideMenu;
            $scope.onFileChange = onFileChange;
            $scope.onWebLinkClick = onWebLinkClick;
            $scope.onCameraClick = onCameraClick;
            $scope.onGalleryClick = onGalleryClick;
            $scope.isMulti = isMulti;

            $element.click(function () {
                if (!$scope.ngDisabled()) openMenu();
            });

            return;

            function openMenu() {
                $($element).find('.pip-add-image-open-button').scope().$mdOpenMenu();
            }

            function isMulti() {
                if ($scope.multi() !== undefined)
                    return  pipUtils.toBoolean($scope.multi());
                else return true;
            }

            function hideMenu () {
                $mdMenu.hide();
            }

            function dataURItoBlob(dataURI) {
                var byteString;
                
                if (dataURI.split(',')[0].indexOf('base64') >= 0)
                    byteString = atob(dataURI.split(',')[1]);
                else
                    byteString = unescape(dataURI.split(',')[1]);

                var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

                var ia = new Uint8Array(byteString.length);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }

                return new Blob([ia], {type:mimeString});
            }

            function addImages(images) {

                if (images === undefined) return;

                if (Array.isArray(images)) {
                    images.forEach(function (img) {
                        if ($scope.onChange)
                            $scope.onChange({url: img.url, file: img.file});
                    });
                } else {
                    if ($scope.onChange)
                        $scope.onChange({url: images.url, file: images.file});
                }

                if ($scope.$images === undefined || !Array.isArray($scope.$images))
                    return;

                if (Array.isArray(images)) {
                    images.forEach(function (img) {
                        $scope.$images.push(img.url);
                    });
                } else {
                    $scope.$images.push(images.url);
                }
            }

            // Process user actions

            function onFileChange ($files) {
                if ($files == null || $files.length == 0)
                    return;

                $files.forEach(function (file) {
                    if (file.type.indexOf('image') > -1) {
                        $timeout(function() {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL(file);
                            fileReader.onload = function(e) {
                                $timeout(function() {
                                    addImages({url: e.target.result, file: file});
                                });
                            }
                        });
                    }
                });

            }

            function onWebLinkClick () {
                pipPictureUrlDialog.show(function (result) {
                    var blob = null;
                    if (result.substring(0, 10) == 'data:image') {
                        blob = dataURItoBlob(result);
                        blob.name = result.slice(result.lastIndexOf('/') + 1, result.length).split('?')[0];
                    }
                    addImages({url: result, file: blob});
                });
            }

            function onCameraClick () {
                pipCameraDialog.show(function (result) {
                  var blob = dataURItoBlob(result);

                    blob.name = 'camera';
                    addImages({url: result, file: blob});
                });
            }

            function onGalleryClick () {
                pipGallerySearchDialog.show(function (result) {
                    var imgs = [];
                    result.forEach(function (url) {
                        imgs.push({url: url, file: null});
                    });
                    addImages(imgs);
                }, $scope.isMulti());
            }
    }]);

})();



/**
 * @file Avatar control
 * @copyright Digital Living Software Corp. 2014-2015
 * @todo
 * - Improve samples in sampler app
 * - Replace placeholder with default image generated on server
 * - Generate file url based on entity type, do not set it as full url via pipSrc
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipAvatarEdit", ['ui.event', 'angularFileUpload', 'pipPicturePaste', 'pipRest',
        'pipImageUtils', 'pipPictures.Templates']);

    thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'PICTURE_EDIT_TEXT': 'Click here to upload a picture'
        });
        pipTranslateProvider.translations('ru', {
            'PICTURE_EDIT_TEXT': 'Нажмите сюда для загрузки картинки'
        });
    }]);

    thisModule.directive('pipAvatarEdit',
        function() {
            return {
                restrict: 'EA',
                scope: {
                    ngDisabled: '&',
                    pipPartyId: '&',
                    pipEntityType: '&',
                    pipId: '&',
                    pipCreated: '&',
                    pipChanged: '&',
                    pipReset: '&'
                },
                templateUrl: 'picture_edit/picture_edit.html',
                controller: 'pipAvatarEditController' 
            };
        }
    );

    thisModule.controller('pipAvatarEditController',
        ['$scope', '$element', '$attrs', '$http', '$upload', '$rootScope', 'pipPicturePaste', 'pipRest', 'pipImageUtils', function($scope, $element, $attrs, $http, $upload, $rootScope, pipPicturePaste, pipRest, pipImageUtils) {
            var 
                $control = $element.children('.pip-picture-upload'),
                $input = $control.children('input[type=file]'),
                entityTypes = pipImageUtils.getEntityTypes(),
                serverUrl = pipRest.serverUrl();
            
            $scope.text = $attrs.pipDefaultText || 'PICTURE_EDIT_TEXT'; 
            $scope.icon = $attrs.pipDefaultIcon || 'picture-no-border';
            $scope.control = {
                url: '',
                progress: 0,
                uploaded: false,
                uploading: false,
                loaded: false,

                file: null,
                state: 'original'
            };

            $scope.control.reset = reset;
            $scope.control.save = save;
            $scope.empty = empty;
            $scope.isUpdated = isUpdated;
            $scope.readItemLocally = readItemLocally;
            $scope.onDeleteClick = onDeleteClick;
            $scope.onKeyDown = onKeyDown;
            $scope.onImageError = onImageError;
            $scope.onImageLoad = onImageLoad;
            $scope.onChange = onChange;

            // Watching for changes
            $scope.$watch($scope.pipId, function(newValue) {
                if ($scope.pipReset() !== false)
                    $scope.control.reset();
            });

            $scope.$watch($scope.pipPartyId, function(newValue) {
                if ($scope.pipReset() !== false)
                    $scope.control.reset();
            });

            $scope.$watch($scope.ngDisabled, function(newValue) {
                $input.attr('disabled', $scope.control.disabled);
            });

            // Add paste listener
            $element.children('.pip-picture-upload').focus(function () {
                pipPicturePaste.addPasteListener(function (item) {
                    $scope.readItemLocally(item.url, item.file);
                });
            });

            $element.children('.pip-picture-upload').blur(function () {
                pipPicturePaste.removePasteListener();
            });

            // Add class
            $element.addClass('pip-picture-edit');

            // Execute callback
            if ($scope.pipCreated) {
                $scope.pipCreated({
                    $event: { sender: $scope.control },
                    $control: $scope.control
                });
            }

            // Initialize control
            $scope.control.reset();

            return;

            // --------------------------------

            // Utility functions

            function reset(afterDeleting) {
                $scope.control.progress = 0;
                $scope.control.uploading = false;
                $scope.control.uploaded = false;

                $scope.control.file = null;
                $scope.control.state = 'original';
                $scope.control.url = '';

                if (!afterDeleting) {
                    var url = pipImageUtils.getAvatarUrl($scope.pipPartyId(), '',
                        $scope.pipId(), $scope.pipEntityType(), false, true);

                    if (!url) return;

                    //pipImageUtils.addHttpHeaders();
                    $scope.control.progress = 0;

                    $scope.control.url = url;
                    $scope.control.uploaded = $scope.control.url != '';
                    $scope.onChange();

                } else $scope.onChange();
            };

            function generateUrl() {
                if ($scope.pipEntityType() && $scope.pipId() && $scope.pipPartyId()) {
                    return serverUrl + '/api/parties/' + $scope.pipPartyId() + '/'
                        + entityTypes[$scope.pipEntityType()] + '/' + $scope.pipId() + '/avatar';
                } else {
                    if ($scope.pipPartyId() && !$scope.pipEntityType()) {
                        if ($attrs.pipEntityType || $attrs.pipId)
                            return '';
                        return serverUrl + '/api/parties/' + $scope.pipPartyId()
                            + '/avatar';
                    }
                }

                return '';
            }

            function saveItemUrl() {
                var url = $scope.control.url,
                    FILE_URL = generateUrl();
                var name = url.slice(url.lastIndexOf('/') + 1, url.length).split('?')[0];

                return FILE_URL + '?name=' + name + '&url=' + url
            };

            function savePicture(successCallback, errorCallback) {
                var
                    control = $scope.control,
                    file = control.file;

                if ($scope.control.file !== null) {
                    var 
                        fileReader = new FileReader(),
                        FILE_URL = generateUrl();
                        
                    fileReader.onload = function (e) {
                        control.uploading = true;
                        var upload = $upload.http({
                                url: FILE_URL + '?name=' + file.name,
                                headers: { 'Content-Type': file.type },
                                data: e.target.result
                            })
                            .then(
                            function (response) {
                                control.reset();
                                if (successCallback) successCallback(response);
                            },
                            function (error) {
                                control.uploading = false;
                                control.upload = false;
                                control.progress = 0;

                                if (errorCallback) errorCallback(error);
                                else console.error(error);
                            },
                            function (e) {
                                // Math.min is to fix IE which reports 200% sometimes
                                control.progress = Math.min(100, parseInt(100.0 * e.loaded / e.total));
                            }
                        );
                    };

                    fileReader.readAsArrayBuffer(file);
                } else {
                     var url = saveItemUrl();
                     control.uploading = true;

                     $http['post'](url)
                         .success(function (response) {
                             control.reset();
 
                             if (successCallback) successCallback(response);
                         })
                         .error(function (error) {
                             control.uploading = false;
                             control.upload = false;

                             if (errorCallback) errorCallback(error);
                             else console.error(error);
                         });
                }
            };

            function deletePicture(successCallback, errorCallback) {
                var control = $scope.control;
                $http['delete'](generateUrl())
                .success(function (data) {
                    control.reset(true);

                    if (successCallback) successCallback();
                })
                .error(function (error) {
                    control.uploading = false;
                    control.upload = false;
                    control.progress = 0;
                    //$scope.$apply();

                    if (errorCallback) errorCallback(error);
                    else console.error(error);
                });
            };

            function save(successCallback, errorCallback) {
                // Process changes of the image
                if ($scope.control.state == 'changed') {
                    savePicture(successCallback, errorCallback);
                } 
                // Process deletion of the image
                else if ($scope.control.state == 'deleted') {
                    deletePicture(successCallback, errorCallback);
                }
                // Process if no changes were made 
                else {
                    if (successCallback) successCallback();                            
                }
            };


            // Visual functions
            function empty() {
                return $scope.control.url == '' && !$scope.control.uploading;
            };

            function isUpdated() {
                return $scope.control.state != 'original';
            };

            // Process user events

            function readItemLocally(url, file) {
                $scope.control.file = file;
                $scope.control.url = url;
                $scope.control.state = 'changed';
                $scope.onChange();
            };

            function onDeleteClick($event) {
                $event.stopPropagation();

                $control.focus();

                $scope.control.file = null;
                $scope.control.url = '';
                $scope.control.state = 'deleted';

                $scope.onChange();
            };

            function onKeyDown($event) {
                if ($event.keyCode == 13 || $event.keyCode == 32) {
                    setTimeout(function() {
                        $control.trigger('click');
                    }, 0);
                } else if ($event.keyCode == 46 || $event.keyCode == 8) {
                    $scope.control.file = null;
                    $scope.control.url = '';

                    $scope.control.state = 'deleted';

                    $scope.onChange();
                } else if ($event.keyCode == 27) {
                    $scope.control.reset();
                }
            };

            // Clean up url to remove broken icon
            function onImageError($event) {
                $scope.$apply(function() {
                    $scope.control.url = '';
                    var image = $($event.target);

                    pipImageUtils.setErrorImageCSS(image, {width: 'auto', height: '100%'});
                });
            };

            // When image is loaded resize/reposition it
            function onImageLoad($event) {
                var image = $($event.target);
                pipImageUtils.setImageMarginCSS({clientWidth: 80, clientHeight: 80}, image);
                $scope.control.uploading = false;
            };

            // On change event
            function onChange() {
                if ($scope.pipChanged) {
                    $scope.pipChanged({
                        $event: { sender: $scope.control },
                        $control: $scope.control
                    });
                }
            };
        }]        
    );
    
})();


/**
 * @file Avatar control
 * @copyright Digital Living Software Corp. 2014-2015
 * @todo
 * - Improve samples in sampler app
 * - Replace placeholder with default image generated on server
 * - Fix resizing problem
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipAvatar", ['pipCore', 'pipRest', 'pipImageUtils']);

    thisModule.directive('pipAvatar',
        function () {
            return {
                restrict: 'EA',
                scope: false,
                template: '<md-icon></md-icon><img/>'
                + '<div><md-icon class="default_icon" id="icon-film" md-svg-icon="icons:film"></md-icon>'
                + '<md-icon class="default_icon" id="icon-task" md-svg-icon="icons:task"></md-icon>'
                + '<md-icon class="default_icon" id="icon-folder" md-svg-icon="icons:folder"></md-icon></div>',
                controller: 'pipAvatarController'
            }
        }
    );

    thisModule.controller('pipAvatarController',
        ['$scope', '$rootScope', '$element', '$attrs', '$parse', 'pipUtils', 'pipStrings', 'pipRest', '$http', 'pipImageUtils', function ($scope, $rootScope, $element, $attrs, $parse, pipUtils, pipStrings, pipRest, $http, pipImageUtils) {
            var
                $svg = $element.children('md-icon'),
                $image = $element.children('img'),
                $defaultBlock = $element.children('div'),
                $iconFilm = $element.find('#icon-film'),
                $iconTask = $element.find('#icon-task'),
                $iconFolder = $element.find('#icon-folder'),
                image = null,

                partyIdGetter = $parse($attrs.pipPartyId),
                partyNameGetter = $parse($attrs.pipPartyName),
                typeGetter = $parse($attrs.pipEntityType),
                idGetter = $parse($attrs.pipId),

                colors = pipImageUtils.getAvatarColors(),
                colorClasses = pipImageUtils.getColorClasses(),
                entityTypes = pipImageUtils.getEntityTypes();

            // When image is loaded resize/reposition it
            $image.load(function ($event) {
                image = $($event.target);
                pipImageUtils.setImageMarginCSS($element, image);
            });

            // Add class
            $element.addClass('pip-avatar flex-fixed');

            if ($attrs.ngClass) {
                $scope.$watch($attrs.ngClass, function () {
                    setTimeout(function () {
                        pipImageUtils.setImageMarginCSS($element, image);
                    }, 50);
                });
            }

            // Optimization to avoid binding
            bindControl();

            if (pipUtils.toBoolean($attrs.pipRebindAvatar)) {
                $rootScope.$on('pipPartyAvatarUpdated', refreshAvatar);
            }

            // Also optimization to avoid watch if it is unnecessary
            if (pipUtils.toBoolean($attrs.pipRebind)) {
                $scope.$watch(partyIdGetter, function (newValue, oldValue) {
                    if (oldValue !== newValue)
                        bindControl();
                });

                $scope.$watch(idGetter, function (newValue, oldValue) {
                    if (oldValue !== newValue)
                        bindControl();
                });
            }

            return;

            function refreshAvatar() {
                $iconTask.css('display', 'none');
                $iconFilm.css('display', 'none');
                $iconFolder.css('display', 'none');
                $defaultBlock.css('display', 'none');
                $image.attr('src', '');
                $svg.css('display', 'none');
                $image.css('display', 'inline-block');
                bindControl();
            };

            function bindControl() {
                var
                    partyName = partyNameGetter($scope),
                    partyId = partyIdGetter($scope),
                    id = idGetter($scope),
                    type = typeGetter($scope);

                $iconTask.css('display', 'none');
                $iconFilm.css('display', 'none');
                $iconFolder.css('display', 'none');
                $defaultBlock.css('display', 'none');

                // Timestamp to avoid caching images for too long
                var url = pipImageUtils.getAvatarUrl(partyId, partyName, id, type, false, false);

                if ((type && id && partyId) || (partyId && partyName)) {
                    if (type && id && partyId) {
                        if (type == 'category') return;

                        if (entityTypes[type] == 'goals' || entityTypes[type] == 'areas' ) {
                            $image.attr('src', url);
                            $svg.css('display', 'none');
                            $image.css('display', 'inline-block');
                        } else {
                            $defaultBlock.css('display', 'block');
                            var colorClassIndex = pipStrings.hashCode(id) % colors.length;
                            $element.addClass(colorClasses[colorClassIndex]);
                            switch(type) {
                                case 'vision':
                                    $svg.css('display', 'none');
                                    $iconFilm.css('display', 'inline-block');
                                    $iconTask.css('display', 'none');
                                    $iconFolder.css('display', 'none');
                                    $image.css('display', 'none');
                                    break;
                                case 'event':
                                    $svg.css('display', 'none');
                                    $iconTask.css('display', 'inline-block');
                                    $iconFilm.css('display', 'none');
                                    $iconFolder.css('display', 'none');
                                    $image.css('display', 'none');
                                    break;
                                case 'note':
                                    $svg.css('display', 'none');
                                    $iconFolder.css('display', 'inline-block');
                                    $iconTask.css('display', 'none');
                                    $iconFilm.css('display', 'none');
                                    $image.css('display', 'none');
                                    break;
                            }
                        }
                    } else {
                        $image.attr('src', url);
                        $svg.css('display', 'none');
                        $image.css('display', 'inline-block');
                    }
                }
            };

        }]
    );

})();


/**
 * @file Camera dialog
 * @copyright Digital Living Software Corp. 2014-2015
 * @todo
 * - Add sample to sampler app
 */

/* global angular, Webcam */

(function () {
    'use strict';

    var thisModule = angular.module('pipCameraDialog',
        ['ngMaterial', 'pipCore', 'pipPictures.Templates']);

    thisModule.config(['pipTranslateProvider', function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'TAKE_PICTURE': 'Take a picture',
            'WEB_CAM_ERROR': 'Webcam is missing or was not found'
        });
        pipTranslateProvider.translations('ru', {
            'TAKE_PICTURE': 'Сделать фото',
            'WEB_CAM_ERROR': 'Web-камера отсутствует или не найдена'
        });
    }]);

    thisModule.factory('pipCameraDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (successCallback) {
                    $mdDialog.show({
                        templateUrl: 'camera_dialog/camera_dialog.html',
                        clickOutsideToClose: true,
                        controller: 'pipCameraController'
                    }).then(function (result) {
                        Webcam.reset();
                        console.log(result);
                        if (successCallback) {
                            successCallback(result);
                        }
                    }, function () {
                        Webcam.reset();
                    });
                }
            };
        }]);

    thisModule.controller('pipCameraController',
        ['$scope', '$rootScope', '$timeout', '$mdMenu', '$mdDialog', 'pipUtils', function ($scope, $rootScope, $timeout, $mdMenu, $mdDialog, pipUtils) { // $cordovaCamera
            $scope.browser = pipUtils.getBrowser().os;
            $scope.theme = $rootScope.$theme;

            if ($scope.browser !== 'android') {
                console.log('webcam');
                Webcam.init();

                setTimeout(function () {
                    Webcam.attach('.camera-stream');
                }, 0);

                Webcam.on('error', function (err) {
                    $scope.webCamError = true;
                    console.error(err);
                });

                Webcam.set({
                    width: 400,
                    height: 300,

                    dest_width: 400,
                    dest_height: 300,

                    crop_width: 400,
                    crop_height: 300,

                    image_format: 'jpeg',
                    jpeg_quality: 90
                });

                //Webcam.setSWFLocation('../../../dist/webcam.swf');
                Webcam.setSWFLocation('webcam.swf');

            } else {
                document.addEventListener("deviceready",onDeviceReady,false);

            }
            // todo add logic in callbacks
            function onDeviceReady() {
                navigator.camera.getPicture(onSuccess, onFail,
                    {
                        sourceType: Camera.PictureSourceType.CAMERA,
                        correctOrientation: true,
                        quality: 75,
                        targetWidth: 200,
                        destinationType: Camera.DestinationType.DATA_URL
                    });
            }


            function onSuccess(imageData) {
                var picture = imageData;
                var picture = 'data:image/jpeg;base64,' + imageData;
                $mdDialog.hide(picture);
            }

            function onFail(message) {
                alert('Failed because: ' + message);
                $mdDialog.hide();
            }

            $scope.$freeze = false;

            $scope.onTakePictureClick = onTakePictureClick;
            $scope.onResetPicture = onResetPicture;
            $scope.onCancelClick = onCancelClick;

            return;

            function onTakePictureClick() {
                if (Webcam) {
                    if ($scope.$freeze) {
                        Webcam.snap(function (dataUri) {
                            $scope.$freeze = false;
                            $mdDialog.hide(dataUri);
                        });
                    } else {
                        $scope.$freeze = true;
                        Webcam.freeze();
                    }
                }
            };

            function onResetPicture() {
                $scope.$freeze = false;
                Webcam.unfreeze();
            };

            function onCancelClick() {
                $mdDialog.cancel();
            };
        }]
    );

})();
/**
 * @file Collage control
 * @copyright Digital Living Software Corp. 2014-2015
 * @todo
 * - Improve samples in sampler app
 * - Replace placeholder with default image generated on server
 * - Fix resizing problem
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipCollage", ['pipCore', 'pipRest']);

    thisModule.directive('pipCollage',
        function () {
            return {
                restrict: 'EA',
                scope: false,
                controller: 'pipCollageController' 
            }
        }
    );

    thisModule.controller('pipCollageController',
        ['$scope', '$element', '$attrs', '$parse', '$rootScope', 'pipUtils', 'pipStrings', 'pipRest', 'pipImageUtils', function ($scope, $element, $attrs, $parse, $rootScope, pipUtils, pipStrings, pipRest, pipImageUtils) {
            var                         
                pictureIdsGetter = $attrs.pipPictureIds ? $parse($attrs.pipPictureIds) : null,
                srcsGetter = $attrs.pipSrcs ? $parse($attrs.pipSrcs) : null,
                uniqueCodeGetter = $attrs.pipUniqueCode ? $parse($attrs.pipUniqueCode) : null,
                multipleGetter = $attrs.pipMultiple ? $parse($attrs.pipMultiple) : null,
                allowOpen = pipUtils.toBoolean($attrs.pipOpen),
                collageSchemes = pipImageUtils.getCollageSchemes(),
                resized = 0,
                $svgData = '<?xml version="1.0" encoding="utf-8"?>'+
                    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'+
                    '<svg version="1.1"'+
                    'xmlns="http://www.w3.org/2000/svg"'+
                    'xmlns:xlink="http://www.w3.org/1999/xlink"'+
                    'x="0px" y="0px"'+
                    'viewBox="0 0 510 510"'+
                    'style="enable-background:new 0 0 515 515;"'+
                    'xml:space="preserve">'+
                    '<defs>'+
                    '<style type="text/css"><![CDATA['+
                    '#symbol-picture-no-border {'+
                    '        transform-origin: 50% 50%;'+
                    '        transform: scale(0.6, -0.6);'+
                    '    }'+
                    '        ]]></style>'+
                    '        </defs>'+
                    '<rect x="0" width="515" height="515"/>'+
                    '<path id="symbol-picture-no-border" d="M120 325l136-102 69 33 136-82 0-54-410 0 0 136z m341 15c0-28-23-51-51-51-29 0-52 23-52 51 0 29 23 52 52 52 28 0 51-23 51-52z" />'+
                    '</svg>';

            // Add class
            $element.addClass('pip-collage');

            // Also optimization to avoid watch if it is unnecessary
            if (pipUtils.toBoolean($attrs.pipRebind)) {
                if (srcsGetter) {
                    $scope.$watch(srcsGetter, function (newValue) {
                        //getImageUrls();
                        generateContent();
                    });
                    $scope.$watchCollection(srcsGetter, function (newValue) {
                        //getImageUrls();
                        generateContent();
                    });
                }
                else if (pictureIdsGetter) {
                    $scope.$watch(pictureIdsGetter, function (newValue) {
                        //getImageUrls();
                        generateContent();
                    });
                }
            }

            $scope.getElementDimensions = getElementDimensions;

            var update = _.debounce(calculateResize, 50);

            function calculateResize() {
                var ims = $element.find('img');
                var i = 0;
                for ( i; i < ims.length; i++ ) {
                    var container = angular.element(ims[i].parentElement),
                        image = angular.element(ims[i]);

                    if (image.css('display') != 'none')
                        pipImageUtils.setImageMarginCSS(container, image);
                }

                var icns = $element.find('md-icon');

                var i = 0;
                for ( i; i < icns.length; i++ ) {
                    var container = angular.element(icns[i].parentElement),
                        icn = angular.element(icns[i]);
                    if (container.css('display') != 'none') {
                        pipImageUtils.setIconMarginCSS(container[0], icn);
                    }

                }
            };

            $scope.$watch($scope.getElementDimensions, function (newValue, oldValue) {
                if (newValue && oldValue && oldValue.h == newValue.h && oldValue.w == newValue.w) return;
                calculateResize();
            }, true);

            generateContent();
            //getImageUrls();

            return;

            function getElementDimensions() {
                var dimension = {
                    'h': $element.height(),
                    'w': $element.width()
                };

                return dimension;
            };

            // Clean up url to remove broken icon
            function onImageError(event) {
                var 
                    image = $(event.target),
                    container = image.parent(),
                    defaultBlock = container.children('div'),
                    defaultIcon = image.parent().find('md-icon');

                defaultBlock.css('display', 'block');
                image.css('display', 'none');
                pipImageUtils.setIconMarginCSS(container[0], defaultIcon);
                defaultIcon.empty().append($svgData);
            };

            // When image is loaded resize/reposition it
            function onImageLoad($event) {
                var image = $($event.target),
                    container =  image.parent(),
                    defaultBlock = container.children('div');

                pipImageUtils.setImageMarginCSS(container, image);

                defaultBlock.css('display', 'none');
            };

            function getScheme(count) {
                var schemes = collageSchemes[count - 1];

                // If nothing to choose from then return
                if (schemes.length == 1) return schemes[0];

                // Calculate unique had code
                var uniqueCode = uniqueCodeGetter ? '' + uniqueCodeGetter($scope) : '';
                var hash = pipStrings.hashCode(uniqueCode);

                // Return reproducable scheme by hashcode
                return schemes[hash % schemes.length];
            };

            function getImageUrls() {
                // Simply return sources
                if (srcsGetter) {
                    var srcs = srcsGetter($scope);
                    //generateContent();
                    return _.clone(srcs);
                }

                // Calculate urls if picture ids are specified
                if (pictureIdsGetter) {
                    var
                        ids = pictureIdsGetter($scope) || [],
                        serverUrl = pipRest.serverUrl(),
                        userId = ($rootScope.$user || {}).id,
                        partyId = ($rootScope.$party || {}).id || userId,
                        result = [];

                    for (var i = 0; i < ids.length; i++) {
                        result.push(
                            serverUrl + '/api/parties/' + partyId + '/files/' + ids[i] + '/content'
                        );
                    }

                    return result;
                }

                // Return an empty array otherwise
                return [];
            };

            function generatePicture(urls, scheme) {
                var 
                    url = urls[0],
                    containerClasses = '',
                    pictureClasses = '';

                urls.splice(0, 1);

                containerClasses += scheme.fullWidth ? ' pip-full-width' : '';
                containerClasses += scheme.fullHeight ? ' pip-full-height' : '';
                containerClasses += ' flex-' + scheme.flex;

                pictureClasses += scheme.leftPadding ? ' pip-left' : '';
                pictureClasses += scheme.rightPadding ? ' pip-right' : '';
                pictureClasses += scheme.topPadding ? ' pip-top' : '';
                pictureClasses += scheme.bottomPadding ? ' pip-bottom' : '';

                if (allowOpen) {
                    return '<a class="pip-picture-container' + containerClasses + '" flex="' + scheme.flex + '" '
                        + 'href="' + url + '"  target="_blank">'
                        + '<div class="pip-picture' + pictureClasses + '"><img src="' + url + '"/>'
                        + '<div><md-icon></md-icon></div></div></a>';
                }

                return '<div class="pip-picture-container' + containerClasses + '" flex="' + scheme.flex + '">'
                    + '<div class="pip-picture' + pictureClasses + '"><img src="' + url + '"/>'
                    + '<div><md-icon></md-icon></div></div></div>';
            };

            function generatePictureGroup(urls, scheme) {
                var classes = '', result;

                classes += scheme.fullWidth ? ' pip-full-width' : '';
                classes += scheme.fullHeight ? ' pip-full-height' : '';
                classes += ' flex-' + scheme.flex;
                classes += ' layout-' + scheme.layout;

                result = '<div class="pip-picture-group layout' + classes + '" flex="'
                    + scheme.flex + '" layout="' + scheme.layout + '">';

                // Generate content for children recursively
                for (var i = 0; i < scheme.children.length; i++) {
                    result += generate(urls, scheme.children[i]);
                }

                result += '</div>';
                return result;
            };

            function generate(urls, scheme) {
                if (scheme.group)
                    return generatePictureGroup(urls, scheme);
                return generatePicture(urls, scheme);
            };

            function generateContent(urls) {
                // Unbind previously defined actions handlers
                $element.find('img')
                    .unbind('error')
                    .unbind('load');

                // Clean up content
                $element.empty();

                // Calculate list of image urls
                var urls = getImageUrls();

                // And exit if nothing to show
                if (urls.length == 0) {
                    $element.hide();
                    return;
                }

                // Limit collage only to one element if not specified otherwise
                if (urls.length > 8) {
                    var multiple = multipleGetter ? multipleGetter($scope) : false;

                    if (!multiple) {
                        urls.length = 8;
                    }
                }

                if (urls.length <= 8) {
                    // Get scheme for visualization
                    var scheme = getScheme(urls.length);

                    // Generate and add content
                    var html = '<div class="pip-collage-section">' + generate(urls, scheme) + '</div>';
                    html += '<div class="clearfix"></div>';
                    $element.html(html);
                } else {
                    var html = '';

                    while (urls.length > 0) {
                        var partialUrls = urls.splice(0, 8);

                        // Get scheme for visualization
                        var scheme = getScheme(partialUrls.length);

                        // Generate and add content
                        html += '<div class="pip-collage-section">' + generate(partialUrls, scheme) + '</div>';
                    }

                    html += '<div class="clearfix"></div>';
                    $element.html(html);
                }

                // Bind events to images...
                $element.find('img')
                    .bind('error', onImageError)
                    .bind('load', onImageLoad);

                // Show the new element
                $element.show();
            };

        }]

    );

})();


/**
 * @file Picture control
 * @copyright Digital Living Software Corp. 2014-2015
 * @todo
 * - Improve samples in sampler app
 * - Replace placeholder with default image generated on server
 * - Fix resizing problem
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipPicture", ['pipCore']);

    thisModule.directive('pipPicture', 
        function() {
            return {
                restrict: 'EA',
                scope: {
                    src: '&pipSrc',
                    pictureId: '=pipPictureId',
                    defaultIcon: '=pipDefaultIcon'
                },
                template: '<img ui-event="{ error: \'onImageError($event)\', load: \'onImageLoad($event)\' }"/>'
                          + '<div><span></span></div>',
                controller: 'pipPictureController' 
            }
        }
    );

    thisModule.controller('pipPictureController',
        ['$scope', '$element', '$attrs', '$rootScope', 'pipUtils', 'pipImageUtils', 'pipRest', function ($scope, $element, $attrs, $rootScope, pipUtils, pipImageUtils, pipRest) {
            var 
                image = $element.children('img'),
                defaultBlock = $element.children('div');

            $scope.onImageError = onImageError;
            $scope.onImageLoad = onImageLoad;

            // Add class
            $element.addClass('pip-picture');

            bindControl();

            // Also optimization to avoid watch if it is unnecessary
            if (pipUtils.toBoolean($attrs.pipRebind)) {
                $scope.$watch($scope.pictureId, function(newValue) {
                    if ($scope.pictureId != newValue) bindControl();
                });
            }

            if (pipUtils.toBoolean($attrs.pipRebind)) {
                $scope.$watch($scope.src, function(newValue) {
                    if ($scope.src != newValue)
                      bindControl();
                });
            }

            return;

            // Clean up url to remove broken icon
            function onImageError($event) {
                $scope.$apply(function() {
                    var image = $($event.target);

                    pipImageUtils.setErrorImageCSS(image);
                    defaultBlock.css('display', 'block');
                });
            };

            // When image is loaded resize/reposition it
            function onImageLoad($event) {
                var image = $($event.target);
                pipImageUtils.setImageMarginCSS($element, image);
                defaultBlock.css('display', 'none');
            };

            function bindControl() {
                if ($scope.pictureId) {
                    var serverUrl = pipRest.serverUrl(),
                        userId = ($rootScope.$user || {}).id,
                        partyId = ($rootScope.$party || {}).id || userId,
                        url = serverUrl + '/api/parties/' + partyId + '/files/' + $scope.pictureId + '/content';

                    image.attr('src', url);
                } else {
                    if ($scope.src) image.attr('src', $scope.src());
                    else image.attr('src', '');
                }
            };
        }]        
    ); 

})();


/**
 * @file Camera dialog
 * @copyright Digital Living Software Corp. 2014-2015
 * @todo
 * - Add sample to sampler app
 */

/* global angular, Webcam */

(function () {
    'use strict';

    var thisModule = angular.module('pipGallerySearchDialog',
        ['ngMaterial', 'pipCore', 'pipPictures.Templates', 'pipRest']);

    thisModule.config(['pipTranslateProvider', function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'IMAGE_GALLERY': 'Add from image gallery',
            'SEARCH_PICTURES': 'Search for pictures...',
            'IMAGE_START_SEARCH': 'Images will appear here once you start searching'
        });
        pipTranslateProvider.translations('ru', {
            'IMAGE_GALLERY': 'Добавить из галереи изображений',
            'SEARCH_PICTURES': 'Поиск изображений...',
            'IMAGE_START_SEARCH': 'Картинки появятся после начала поиска'
        });
    }]);

    thisModule.factory('pipGallerySearchDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (successCallback, multiple) {
                    $mdDialog.show({
                        templateUrl: 'gallery_search_dialog/gallery_search_dialog.html',
                        clickOutsideToClose: true,
                        controller: 'pipGallerySearchController',
                        locals: {
                            multiple: multiple
                        }
                    }).then(function (result) {
                        if (successCallback) {
                            successCallback(result);
                        }
                    }, function () {

                    });
                }
            };
        }]);

    thisModule.controller('pipGallerySearchController',
        ['$scope', '$rootScope', '$timeout', '$mdMenu', '$mdDialog', '$http', 'pipRest', 'multiple', 'pipTransaction', function ($scope, $rootScope, $timeout, $mdMenu, $mdDialog, $http, pipRest, multiple, pipTransaction) {

            var prevSearch = '',
                url = pipRest.serverUrl() + '/api/images/search',
                images = [];

            $scope.theme = $rootScope.$theme;
            $scope.$serverUrl = pipRest.serverUrl();
            $scope.$search = '';
            $scope.$images = [];
            $scope.transaction = pipTransaction('search', $scope);

            $scope.onSearchClick = onSearchClick;
            $scope.onKeyPress = onKeyPress;
            $scope.onImageClick = onImageClick;
            $scope.onAddClick = onAddClick;
            $scope.onCancelClick = onCancelClick;
            $scope.addButtonDisabled = addButtonDisabled;
            $scope.onStopSearchClick = onStopSearchClick;

            focusSearchText();

            return;

            function onSearchClick() {
                if ($scope.transaction.busy()) return;

                if ($scope.$search == '' || $scope.$search == prevSearch) return;

                prevSearch = $scope.$search;
                $scope.$images = [];
                $scope.stop = null;
                var requestUrl = url + '?q=' + $scope.$search;

                var transactionId = $scope.transaction.begin('ENTERING');
                if (!transactionId) return;

                $http['get'](requestUrl)
                    .success(function (results) {
                        if ($scope.transaction.aborted(transactionId))return;


                        for (var i = 0; i < results.length; i++) {
                            $scope.$images.push({
                                checked: false,
                                url: results[i].link,
                                thumbnail: results[i].thumbnail
                            });
                        }
                        $scope.transaction.end();


                    }).
                    error(function (error) {
                        console.error(error)
                    });
            }

            function onStopSearchClick() {
                $scope.transaction.abort();
                prevSearch = '';
            }

            function onKeyPress($event) {
                if ($event.keyCode === 13)
                    $scope.onSearchClick();
            }

            function onImageClick(image) {
                if ($scope.transaction.busy()) return;

                image.checked = !image.checked;

                if (multiple) {
                    if (image.checked) {
                        images.push(image);
                    } else {
                        _.remove(images, {url: image.url});
                    }
                } else {
                    if (image.checked) {
                        if (images.length > 0) {
                            images[0].checked = false;
                            images[0] = image;
                        } else {
                            images.push(image);
                        }
                    } else {
                        images = [];
                    }
                }
            }

            function onAddClick() {
                if ($scope.transaction.busy()) return;

                var result = [];
                images.forEach(function (image) {
                    if (image.checked)
                        result.push(image.url);
                });
                $mdDialog.hide(result);
            }

            function onCancelClick() {
                $mdDialog.cancel();
            }

            function addButtonDisabled() {
                return images.length == 0 || $scope.transaction.busy();
            }

            function focusSearchText() {
                setTimeout(function () {
                    var element = $('.pip-gallery-search-dialog .search-images');
                    if (element.length > 0)
                        element.focus();
                }, 0);
            }

        }]
    );

})();
/**
 * @file Picture control
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipPictureEdit', ['ui.event', 'angularFileUpload', 'pipRest', 'pipPicturePaste',
        'pipTranslate', 'pipPictures.Templates']);

    thisModule.config(['pipTranslateProvider', function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            ERROR_WRONG_IMAGE_FILE: 'Incorrect image file. Please, choose another one',
            PICTURE_EDIT_TEXT: 'Click here to upload a picture'
        });
        pipTranslateProvider.translations('ru', {
            ERROR_WRONG_IMAGE_FILE: 'Неправильный файл с изображением. Выберете другой файл',
            PICTURE_EDIT_TEXT: 'Нажмите сюда для загрузки картинки'
        });
    }]);

    thisModule.directive('pipPictureEdit',
        function () {
            return {
                restrict: 'EA',
                scope: {
                    ngDisabled: '&',
                    pipCreated: '&',
                    pipChanged: '&',
                    pipReset: '&',
                    pipPictureId: '=',
                    pipPartyId: '=',
                    pipAddedPicture: '='
                },
                templateUrl: 'picture_edit/picture_edit.html',
                controller: 'pipPictureEditController'
            };
        }
    );

    thisModule.controller('pipPictureEditController',
        ['$scope', '$element', '$attrs', '$http', '$upload', '$timeout', '$rootScope', '$parse', 'pipRest', 'pipPicturePaste', 'pipImageUtils', 'pipUtils', function ($scope, $element, $attrs, $http, $upload, $timeout, $rootScope, $parse, pipRest, pipPicturePaste,
                  pipImageUtils, pipUtils) {
            var
                $control = $element.children('.pip-picture-upload'),
                $input = $control.children('input[type=file]'),
                serverUrl = pipRest.serverUrl(),
                fileUrl = serverUrl + '/api/parties/' + $scope.pipPartyId + '/files';

            $scope.text = $attrs.pipDefaultText || 'PICTURE_EDIT_TEXT';
            $scope.icon = $attrs.pipDefaultIcon || 'picture-no-border';
            $scope.pictureStartState = pipUtils.toBoolean($scope.pipAddedPicture) ? 'copied' : 'original';

            $scope.control = {
                url: '',
                progress: 0,
                uploaded: false,
                uploading: false,
                loaded: false,
                file: null,
                state: $scope.pictureStartState //'original'
            };

            $scope.control.reset = resetImage;
            $scope.control.save = saveImage;
            $scope.empty = empty;
            $scope.isUpdated = isUpdated;
            $scope.readItemLocally = readItemLocally;
            $scope.onDeleteClick = onDeleteClick;
            $scope.onKeyDown = onKeyDown;
            $scope.onImageError = onImageError;
            $scope.onImageLoad = onImageLoad;
            $scope.onChange = onChange;
            $scope.onBlur = onBlur;
            $scope.onFocus = onFocus;

            // Also optimization to avoid watch if it is unnecessary
            if (pipUtils.toBoolean($attrs.pipRebind)) {
                $scope.$watch('pipPictureId', function (newValue) {
                    $scope.control.reset();
                });
            }

            $scope.$watch($scope.ngDisabled, function (newValue) {
                $input.attr('disabled', $scope.control.disabled);
            });

            //// Add paste listener
            //$element.children('.pip-picture-upload').focus(function () {
            //    console.log('addPasteListener');
            //    pipPicturePaste.addPasteListener(function (item) {
            //        $scope.readItemLocally(item.url, item.file);
            //    });
            //});

            //$element.children('.pip-picture-upload').blur(function () {
            //    pipPicturePaste.removePasteListener();
            //});

            // Add class
            $element.addClass('pip-picture-edit');

            // Initialize control
            $scope.control.reset();

            // Execute callback
            if ($scope.pipCreated) {
                $scope.pipCreated({
                    $event: {sender: $scope.control},
                    $control: $scope.control
                });
            }

            return;

            function resetImage(afterDeleting) {
                $scope.control.progress = 0;
                $scope.control.uploading = false;
                $scope.control.uploaded = false;
                $scope.control.file = null;
                $scope.control.state = $scope.pictureStartState; //'original';
                $scope.control.url = '';
                var url = '';

                if (!afterDeleting) {
                    if ($rootScope.$party && $rootScope.$party.id && $scope.pipPictureId) {
                        url = fileUrl + '/' + $scope.pipPictureId + '/content';
                    }
                    if (!url) return;

                    $scope.control.url = url;
                    $scope.control.uploaded = true;
                    $scope.onChange();
                } else $scope.onChange();
            };

            function saveItemUrl() {
                var
                    url = $scope.control.url,
                    name = url.slice(url.lastIndexOf('/') + 1, url.length).split('?')[0];
                return fileUrl + '?name=' + name + '&url=' + url;
            };

            function onFocus() {
                pipPicturePaste.addPasteListener(function (item) {
                    $scope.readItemLocally(item.url, item.file);
                });
            };

            function onBlur() {
                pipPicturePaste.removePasteListener();
            };

            function savePicture(successCallback, errorCallback) {
                var
                    control = $scope.control,
                    file = control.file;

                if ($scope.control.file !== null) {
                    var fileReader = new FileReader();

                    fileReader.onload = function (e) {
                        control.uploading = true;
                        //        pipImageUtils.addHttpHeaders();
                        var upload = $upload.http({
                            url: fileUrl + '?name=' + file.name,
                            headers: {'Content-Type': file.type},
                            data: e.target.result
                        })
                            .then(
                                function (response) {
                                    $scope.pipPictureId = response.data.id;
                                    control.reset();
                                    if (successCallback) successCallback(response);
                                },
                                function (error) {
                                    control.uploading = false;
                                    control.upload = false;
                                    control.progress = 0;

                                    if (errorCallback) errorCallback(error);
                                    else console.error(error);
                                },
                                function (e) {
                                    // Math.min is to fix IE which reports 200% sometimes
                                    control.progress = Math.min(100, parseInt(100.0 * e.loaded / e.total));
                                }
                            );
                    };

                    fileReader.readAsArrayBuffer(file);
                } else {
                    var url = saveItemUrl();
                    control.uploading = true;

                    //               pipImageUtils.addHttpHeaders();
                    $http['post'](url)
                        .success(function (response) {
                            $scope.pipPictureId = response.id;
                            control.reset();

                            if (successCallback) successCallback(response);
                        })
                        .error(function (error) {
                            control.uploading = false;
                            control.upload = false;

                            if (errorCallback) errorCallback(error);
                            else console.error(error);
                        });
                }

            };

            function deletePicture(successCallback, errorCallback) {
                var control = $scope.control;
                $http['delete'](fileUrl + '/' + $scope.pipPictureId)
                    .success(function (data) {
                        $scope.pipPictureId = null;
                        control.reset(true);

                        if (successCallback) successCallback();
                    })
                    .error(function (error) {
                        control.uploading = false;
                        control.upload = false;
                        control.progress = 0;

                        if (errorCallback) errorCallback(error);
                        else console.error(error);
                    });
            };

            function saveImage(successCallback, errorCallback) {
                // Process changes of the image
                if ($scope.control.state == 'changed') {
                    savePicture(successCallback, errorCallback);
                }
                // Process deletion of the image
                else if ($scope.control.state == 'deleted') {
                    deletePicture(successCallback, errorCallback);
                }
                // Process if no changes were made
                else {
                    if (successCallback) successCallback();
                }
            };

            // Visual functions
            function empty() {
                return $scope.control.url == '' && !$scope.control.uploading;
            };

            function isUpdated() {
                return $scope.control.state != 'original';
            };

            // Process user events
            function readItemLocally(url, file) {
                $scope.control.file = file;
                $scope.control.url = url;
                $scope.control.state = 'changed';
                $scope.onChange();
            };

            function onDeleteClick($event) {
                $event.stopPropagation();

                $control.focus();

                $scope.control.file = null;
                $scope.control.url = '';
                if ($scope.control.state != 'copied') $scope.control.state = 'deleted';

                $scope.onChange();
            };

            function onKeyDown($event) {
                if ($event.keyCode == 13 || $event.keyCode == 32) {
                    // !! Avoid clash with $apply()
                    setTimeout(function () {
                        $control.trigger('click');
                    }, 0);
                } else if ($event.keyCode == 46 || $event.keyCode == 8) {
                    $scope.control.file = null;
                    $scope.control.url = '';

                    $scope.control.state = 'deleted';

                    $scope.onChange();
                } else if ($event.keyCode == 27) {
                    $scope.control.reset();
                }
            };

            // Clean up url to remove broken icon
            function onImageError($event) {
                $scope.$apply(function () {
                    $scope.control.url = '';

                    var image = $($event.target);

                    pipImageUtils.setErrorImageCSS(image, {width: 'auto', height: '100%'});
                });
            };

            // When image is loaded resize/reposition it
            function onImageLoad($event) {
                var image = $($event.target);
                pipImageUtils.setImageMarginCSS({clientWidth: 80, clientHeight: 80}, image);
                $scope.control.uploading = false;
            };

            // On change event
            function onChange() {
                if ($scope.pipChanged) {
                    $scope.pipChanged({
                        $event: {sender: $scope.control},
                        $control: $scope.control
                    });
                }
            };

        }]
    );

})();


/**
 * @file Picture URL dialog
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Add sample to sampler app
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipPictureUrlDialog',
        ['ngMaterial', 'pipCore', 'pipPictures.Templates']);

    thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'PICTURE_FROM_WEBLINK': 'Add from web link',
            'LINK_PICTURE': 'Link to the picture...'
        });
        pipTranslateProvider.translations('ru', {
            'PICTURE_FROM_WEBLINK': 'Добавить из веб ссылки',
            'LINK_PICTURE': 'Ссылка на изображение...'
        });
    }]);

    thisModule.factory('pipPictureUrlDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (successCallback) {
                    $mdDialog.show({
                        templateUrl: 'picture_url_dialog/picture_url_dialog.html',
                        clickOutsideToClose: true,
                        controller: 'pipPictureUrlDialogController'
                    }).then(function (result) {
                        if (successCallback) {
                            successCallback(result);
                        }
                    });
                }
            };
    }]);

    thisModule.controller('pipPictureUrlDialogController', 
        ['$scope', '$rootScope', '$timeout', '$mdMenu', '$mdDialog', 'pipImageUtils', function ($scope, $rootScope, $timeout, $mdMenu, $mdDialog, pipImageUtils) {
            $scope.url = '';
            $scope.invalid = true;
            $scope.theme = $rootScope.$theme;
            $scope.checkUrl = checkUrl;
            $scope.onCancelClick = onCancelClick;
            $scope.onAddClick = onAddClick;

            return;

            function setImageSize(img) {
                var imageWidth = img.width(),
                    imageHeight = img.height();

                var cssParams = {};

                if ((imageWidth) > (imageHeight)) {
                    cssParams['width'] = '250px';
                    cssParams['height'] = 'auto';
                } else {
                    cssParams['width'] = 'auto';
                    cssParams['height'] = '250px';
                }

                img.css(cssParams);
            }

            function checkUrl() {
                var img = $("img#url_image")
                    .on('error', function () {
                        $scope.invalid = true;
                        $scope.$apply();
                    })
                    .on('load', function () {
                        $scope.invalid = false;
                        setImageSize(img);
                        $scope.$apply();
                    })
                    .attr("src", $scope.url);
            };
            
            function onCancelClick() {
                $mdDialog.cancel();
            };
            
            function onAddClick() {
                $mdDialog.hide($scope.url);
            };
        }]
    );

})();
/**
 * @file Picture list edit control
 * @copyright Digital Living Software Corp. 2014-2015
 * @todo
 * - Improve samples in sampler app
 * - Add animations to add/remove pictures
 * - ?? Replace placeholder with default image generated on server?
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipPictureListEdit", 
        ['ui.event', 'angularFileUpload', 'pipCore', 'pipFocused', 'pipRest', 'pipPicturePaste']);

    thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'PICTURE_LIST_EDIT_TEXT': 'Click here to add a picture',
            'ERROR_TRANSACTION_IN_PROGRESS': 'Transaction is in progress. Please, wait until it is finished or abort',
            'ERROR_IMAGE_PRELOADING': 'Image loading error. The picture can not be saved'
        });
        pipTranslateProvider.translations('ru', {
            'PICTURE_LIST_EDIT_TEXT': 'Нажмите сюда чтобы добавить картинку',
            'ERROR_TRANSACTION_IN_PROGRESS': 'Транзакция еще не завершена. Подождите окончания или прервите её',
            'ERROR_IMAGE_PRELOADING': 'Ошибка при загрузки картинки. Картинка не сохранена.'
        });
    }]);

    thisModule.directive('pipPictureListEdit', 
        function() {
            return {
                restrict: 'EA',
                scope: {
                    pipPictureIds: '=',
                    pipAddedPicture: '=',
                    ngDisabled: '&',
                    pipCreated: '&',
                    pipChanged: '&'
                },
                templateUrl: 'picture_list_edit/picture_list_edit.html',
                controller: 'pipPictureListEditController' 
            };
        }
    );

    thisModule.controller('pipPictureListEditController',
        ['$scope', '$rootScope', '$element', '$attrs', '$parse', '$http', '$upload', '$timeout', 'pipUtils', 'pipRest', 'pipPicturePaste', 'pipImageUtils', function($scope, $rootScope, $element, $attrs, $parse, $http, $upload, $timeout, pipUtils,
                 pipRest, pipPicturePaste, pipImageUtils) {
                
            var
                $control = $element.children('.pip-picture-drop'),
                itemPin = 0;

            $scope.text = $attrs.pipDefaultText || 'PICTURE_LIST_EDIT_TEXT';
            $scope.icon = $attrs.pipDefaultIcon || 'picture-no-border';
            $scope.pipRebind = pipUtils.toBoolean($attrs.pipRebind);
            $scope.pictureStartState = pipUtils.toBoolean($scope.pipAddedPicture) ? 'copied' : 'original';

            $scope.control = {
                uploading: 0,
                items: []
            };

            $scope.control.reset = reset;
            $scope.control.save = save;
            $scope.control.abort = abort;
            $scope.filterItem = function(item) {
                return item.state != 'deleted';
            };
            $scope.readItemLocally = readItemLocally;
            $scope.onSelectClick = onSelectClick;
            $scope.onDeleteClick = onDeleteClick;
            $scope.onKeyDown = onKeyDown;
            $scope.onImageError = onImageError;
            $scope.onImageLoad = onImageLoad;
            $scope.onChange = onChange;
            $scope.onBlur = onBlur;
            $scope.onFocus = onFocus;
            
            // Watch for changes
            if ($scope.pipRebind) {
                $scope.$watch(
                    function () {
                        // Todo: Optimize change tracking
                        return $scope.pipPictureIds;
                    },
                    function (newValue) {
                        $scope.control.reset();
                    }
                );
            }

            // // Add paste listeners
            // $element.find('.pip-picture-upload').focus(function () {
            //     pipPicturePaste.addPasteListener(function (item) {
            //         $scope.readItemLocally(item.url, item.file);
            //     });
            // });
            // $element.find('.pip-picture-upload').blur(function () {
            //     pipPicturePaste.removePasteListener();
            // });

            // Add class
            $element.addClass('pip-picture-list-edit');

            // Initialize control
            $scope.control.reset();

            // Execute callback
            if ($scope.pipCreated) {
                $scope.pipCreated({
                    $event: { sender: $scope.control },
                    $control: $scope.control
                });
            }

            return;

            function contentUrl(id) {
                var
                    serverUrl = pipRest.serverUrl(),
                    partyId = $scope.$party ? $scope.$party.id : pipRest.userId();

                return serverUrl + '/api/parties/' + partyId + '/files/' + id + '/content';
            }

            function onImageError($event, item) {
                item.error = true;
            };
            
            function onFocus(a) {
                pipPicturePaste.addPasteListener(function (item) {
                    $scope.readItemLocally(item.url, item.file);
                });
            };

            function onBlur () {
                pipPicturePaste.removePasteListener();
            };

            function getItems() {
                var
                    pictureIds = $scope.pipPictureIds,
                    items = [];

                if (pictureIds == null || pictureIds.length == 0)
                    return items;

                for (var i = 0; i < pictureIds.length; i++) {
                    items.push({
                        pin: itemPin++,
                        id: pictureIds[i],
                        uploading: false,
                        uploaded: false,
                        progress: 0,
                        file: null,
                        url: contentUrl(pictureIds[i]),
                        state: $scope.pictureStartState //'original'
                    });
                }

                return items;
            }

            function setItems() {
                // Clean the array
                if ($scope.pipPictureIds && $scope.pipPictureIds.length > 0)
                    $scope.pipPictureIds.splice(0, $scope.pipPictureIds.length);

                for (var i = 0; i < $scope.control.items.length; i++) {
                    var item = $scope.control.items[i];
                    if (item.id)
                        $scope.pipPictureIds.push(item.id);
                }
            }

            function reset() {
                $scope.control.uploading = 0;
                $scope.control.items = getItems();

            }

            function addItemUrl(item) {
                var name = item.url.slice(item.url.lastIndexOf('/') + 1, item.url.length).split('?')[0];
                var
                    serverUrl = pipRest.serverUrl(),
                    partyId = $scope.$party ? $scope.$party.id : pipRest.userId();

                return serverUrl + '/api/parties/' + partyId + '/files?name=' + name + '&url=' + item.url
            }

            function addItemUrlWithFile(item) {
                var
                    serverUrl = pipRest.serverUrl(),
                    partyId = $scope.$party ? $scope.$party.id : pipRest.userId();

                return serverUrl + '/api/parties/' + partyId + '/files?name=' + item.file.name
            }

            function addItem(item, callback) {
                if (item.file !== null) {
                    var file = item.file;

                    var fileReader = new FileReader();
                    fileReader.onload = function (e) {
                        if (item.uploading) return;
                        item.uploading = true;
                        item.upload = $upload.http({
                            url: addItemUrlWithFile(item),
                            headers: {'Content-Type': file.type},
                            data: e.target.result
                        })
                            .then(
                            function (response) {
                                item.id = response.data ? response.data.id : null;
                                item.uploaded = true;
                                item.uploading = false;
                                item.progress = 0;
                                item.upload = null;
                                item.file = null;
                                item.url = contentUrl(item.id);
                                item.state = 'original';

                                callback();
                            },
                            function (error) {
                                item.uploaded = false;
                                item.uploading = false;
                                item.progress = 0;
                                item.upload = null;
                                //$scope.$apply();
//
                                callback(error);
                            },
                            function (e) {
                                // Math.min is to fix IE which reports 200% sometimes
                                item.progress = Math.min(100, parseInt(100.0 * e.loaded / e.total));
                            }
                        );
                    };

                    fileReader.readAsArrayBuffer(file);
                } else {
                    var url = addItemUrl(item);
                    item.uploading = true;
                    $http['post'](url)
                        .success(function (response) {
                            item.id = response.data ? response.data.id : response.id || null;
                            item.uploaded = true;
                            item.uploading = false;
                            item.progress = 0;
                            item.upload = null;
                            item.file = null;
                            item.url = contentUrl(item.id);
                            item.state = 'original';

                            callback();
                        })
                        .error(function (error) {
                            item.uploaded = false;
                            item.uploading = false;
                            item.progress = 0;
                            item.upload = null;

                            callback();
                        });
                }
            }

            function deleteItemUrl(item) {
                var
                    serverUrl = pipRest.serverUrl(),
                    partyId = $scope.$party ? $scope.$party.id : pipRest.userId();

                return serverUrl + '/api/parties/' + partyId + '/files/' + item.id;
            }

            function deleteItem(item, callback) {
                var control = $scope.control;

                // Avoid double transactions
                if (item.upload) {
                    item.upload.abort();
                    item.upload = null;
                }

                if (item.state != 'deleted')
                    return;

                //pipImageUtils.addHttpHeaders();
                $http['delete'](deleteItemUrl(item))
                .success(function (data) {
                    _.remove(control.items, {pin: item.pin});
                    callback();
                })
                .error(function (data, status) {
                    // Todo: perform a better processing
                    if (data == null) {
                        _.remove(control.items, {pin: item.pin});
                    } else {
                        item.uploaded = false;
                        item.uploading = false;
                        item.progress = 0;
                        item.upload = null;
                    }

                    callback(data);
                });
            }

            function save(successCallback, errorCallback) {
                var control = $scope.control;

                if (control.uploading) {
                    if (errorCallback) errorCallback('ERROR_TRANSACTION_IN_PROGRESS');
                    return;
                }

                control.error = null;
                control.uploading = 0;

                var onItemCallback = function(error) {
                    // Storing only the first error
                    if (error && !control.error) {
                        control.error = error;
                    }

                    control.uploading--;

                    // Finished uploading
                    if (control.uploading == 0) {
                        if (control.error) {
                            if (errorCallback) errorCallback(control.error);
                            else console.error(control.error);
                        } else {
                            setItems();
                            if (successCallback) successCallback();
                        }
                    }
                };

                for (var i = 0; i < control.items.length; i++) {
                    var item = control.items[i];
                    if (item.state == 'added' && !item.error) {
                        control.uploading++;
                        addItem(item, onItemCallback);
                    } else if (item.state == 'deleted') {
                        control.uploading++;
                        deleteItem(item, onItemCallback);
                    }
                }

                // Nothing was uploaded
                if (control.uploading == 0) {
                    if (successCallback) successCallback();
                }
            }

            function abort() {
                var control = $scope.control;

                for (var i = 0; i < control.items.length; i++) {
                    var item = control.items[i];

                    if (item.uploading) {
                        if (item.upload) item.upload.abort();

                        item.uploaded = false;
                        item.uploading = false;
                        item.progress = 0;
                        item.upload = null;
                    }
                }

                // Abort transaction
                control.uploading = 0;
            }

            function readItemLocally(url, file) {
                $scope.control.items.push({
                    pin: itemPin++,
                    id: null,
                    uploading: false,
                    uploaded: false,
                    progress: 0,
                    file: file,
                    url: url,
                    state: 'added'
                });

                $scope.onChange();
            }

            function onSelectClick($files) {
                $control.focus();

                if ($files == null || $files.length == 0)
                    return;
                for (var i = 0; i < $files.length; i++) {
                    var file = $files[i];

                    if (file.type.indexOf('image') > -1) {
                        readItemLocally(file);
                    }
                }
            }

            function onDeleteClick(item) {
                if (item.state == 'added' || item.state == 'copied') {
                    _.remove($scope.control.items, {pin: item.pin});
                } else {
                    item.state = 'deleted';
                }

                $scope.onChange();
            }

            function onKeyDown($event, item) {
                if (item) {
                    if ($event.keyCode == 46 || $event.keyCode == 8) {
                        if (item.state == 'added') {
                            _.remove($scope.control.items, {pin: item.pin});
                        } else {
                            item.state = 'deleted';
                        }

                        $scope.onChange();
                    }
                } else {
                    if ($event.keyCode == 13 || $event.keyCode == 32) {
                        // !! Avoid clash with $apply()
                        setTimeout(function() {
                            $control.trigger('click');
                        }, 0);
                    }
                }
            }

            function onImageLoad($event, item) {
                item.error = false;
                setTimeout(function () {
                    var image = $($event.target);
                    pipImageUtils.setImageMarginCSS({clientWidth: 80, clientHeight: 80}, image);
                }, 250);

                item.loaded = true;
            }

            // On change event
            function onChange() {
                if ($scope.pipChanged) {
                    $scope.pipChanged({
                        $event: { sender: $scope.control },
                        $control: $scope.control
                    });
                }
            }
        }]
        
    ); 

})();


/**
 * @file Picture paste service
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global $, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipPicturePaste', []);

    thisModule.factory('pipPicturePaste', ['$timeout', function ($timeout) {
        var paste = {};
        var pasteCatcher = null;

        paste.addPasteListener = function (onPaste) {
            if (!window.Clipboard) {
                if (pasteCatcher !== null) this.removePasteElement();

                pasteCatcher = document.createElement("div");

                // Firefox allows images to be pasted into contenteditable elements
                pasteCatcher.setAttribute("contenteditable", "true");

                // We can hide the element and append it to the body,
                //pasteCatcher.style.opacity = 0;
                $(pasteCatcher).css({
                    "position": "absolute",
                    "left": "-999",
                    width: "0",
                    height: "0",
                    "overflow": "hidden",
                    outline: 0
                });

                document.body.appendChild(pasteCatcher);
            }

            $(document).on('paste', function (event) {
                if (event.clipboardData == null && event.originalEvent) {
                    event = event.originalEvent;
                }

                // Paste for chrome
                if (event.clipboardData) {
                    var items = event.clipboardData.items;

                    _.each(items, function (item) {
                        if (item.type.indexOf("image") != -1) {
                            var file = item.getAsFile();

                            var fileReader = new FileReader();
                            fileReader.onload = function (e) {
                                $timeout(function () {
                                    onPaste({url: e.target.result, file: file});
                                });
                            };
                            fileReader.readAsDataURL(file);
                        }
                    });
                }
                // Paste for IE
                else if (window.clipboardData && window.clipboardData.files) {
                    _.each(window.clipboardData.files, function (file) {
                        var fileReader = new FileReader();
                        fileReader.onload = function (e) {
                            $timeout(function () {
                                onPaste({url: e.target.result, file: file});
                            });
                        };
                        fileReader.readAsDataURL(file);
                    });
                }
            });
        };

        paste.removePasteListener = function () {
            if (!window.Clipboard) {
                if (pasteCatcher !== null) {
                    document.body.removeChild(pasteCatcher);
                    pasteCatcher = null;
                }
            }
            $(document).off('paste');
        };

        return paste;
    }]);

})();

/**
 * @file Areas data cache
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipImageUtils', []);

    thisModule.service('pipImageUtils',
        ['$http', 'pipStrings', '$rootScope', 'pipRest', function($http, pipStrings, $rootScope, pipRest) {

            var
                colorClasses = [
                    'pip-avatar-color-0', 'pip-avatar-color-1', 'pip-avatar-color-2', 'pip-avatar-color-3',
                    'pip-avatar-color-4', 'pip-avatar-color-5', 'pip-avatar-color-6', 'pip-avatar-color-7',
                    'pip-avatar-color-8', 'pip-avatar-color-9', 'pip-avatar-color-10', 'pip-avatar-color-11',
                    'pip-avatar-color-12', 'pip-avatar-color-13', 'pip-avatar-color-14', 'pip-avatar-color-15'
                ],

                colors = [
                    'rgba(239,83,80,1)', 'rgba(236,64,122,1)', 'rgba(171,71,188,1)',
                    'rgba(126,87,194,1)', 'rgba(92,107,192,1)', 'rgba(3,169,244,1)',
                    'rgba(0,188,212,1)', 'rgba(0,150,136,1)', 'rgba(76,175,80,1)',
                    'rgba(139,195,74,1)', 'rgba(205,220,57,1)', 'rgba(255,193,7,1)',
                    'rgba(255,152,0,1)', 'rgba(255,87,34,1)', 'rgba(121,85,72,1)',
                    'rgba(96,125,139,1)'
                ],

                entityTypes = {
                    goal: 'goals',
                    objective: 'goals',
                    dream: 'goals',
                    accomplishment: 'goals',
                    area: 'areas',
                    overall: 'visions',
                    vision: 'visions',
                    event: 'events',
                    instance: 'events'
                },

                collageSchemes = [
                    // 1
                    [
                        { flex: 100, fullWidth: true, fullHeight: true }
                    ],
                    // 2
                    [
                        {
                            group: true,
                            layout: 'row',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                { flex: 50, fullHeight: true, rightPadding: true },
                                { flex: 50, fullHeight: true, leftPadding: true }
                            ]
                        }
                    ],
                    // 3
                    [
                        {
                            group: true,
                            layout: 'row',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                { flex: 33, fullHeight: true, rightPadding: true },
                                { flex: 33, fullHeight: true, leftPadding: true, rightPadding: true },
                                { flex: 33, fullHeight: true, leftPadding: true }
                            ]
                        },
                        {
                            group: true,
                            layout: 'row',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                { flex: 50, fullHeight: true, rightPadding: true },
                                {
                                    group: true,
                                    layout: 'column',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 50, leftPadding: true, bottomPadding: true },
                                        { flex: 50, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'row',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                { flex: 70, fullHeight: true, rightPadding: true },
                                {
                                    group: true,
                                    layout: 'column',
                                    flex: 30,
                                    fullHeight: true,
                                    children: [
                                        { flex: 50, leftPadding: true, bottomPadding: true },
                                        { flex: 50, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'column',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                { flex: 50, fullWidth: true, bottomPadding: true },
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 50, rightPadding: true, topPadding: true },
                                        { flex: 50, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        }
                    ],
                    // 4
                    [
                        {
                            group: true,
                            layout: 'column',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 50, fullWidth: true, rightPadding: true, bottomPadding: true },
                                        { flex: 50, fullWidth: true, leftPadding: true, bottomPadding: true }
                                    ]
                                },
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 50, fullWidth: true, rightPadding: true, topPadding: true },
                                        { flex: 50, fullWidth: true, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'row',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                { flex: 50, fullWidth: true, rightPadding: true },
                                {
                                    group: true,
                                    layout: 'column',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 50, fullWidth: true, leftPadding: true, bottomPadding: true },
                                        {
                                            group: true,
                                            layout: 'row',
                                            flex: 50,
                                            fullHeight: true,
                                            children: [
                                                { flex: 50, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                                { flex: 50, fullWidth: true, leftPadding: true, topPadding: true }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'row',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                { flex: 30, fullWidth: true, rightPadding: true },
                                {
                                    group: true,
                                    layout: 'column',
                                    flex: 70,
                                    fullHeight: true,
                                    children: [
                                        { flex: 50, fullWidth: true, leftPadding: true, bottomPadding: true },
                                        {
                                            group: true,
                                            layout: 'row',
                                            flex: 50,
                                            fullHeight: true,
                                            children: [
                                                { flex: 50, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                                { flex: 50, fullWidth: true, leftPadding: true, topPadding: true }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'column',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 100, fullWidth: true, bottomPadding: true }
                                    ]
                                },
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 33, fullWidth: true, rightPadding: true, topPadding: true },
                                        { flex: 33, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 33, fullWidth: true, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        }
                    ],
                    // 5
                    [
                        {
                            group: true,
                            layout: 'column',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 50, fullWidth: true, rightPadding: true, bottomPadding: true },
                                        { flex: 50, fullWidth: true, leftPadding: true, bottomPadding: true }
                                    ]
                                },
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 33, fullWidth: true, rightPadding: true, topPadding: true },
                                        { flex: 33, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 33, fullWidth: true, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'row',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                { flex: 50, fullWidth: true, rightPadding: true },
                                {
                                    group: true,
                                    layout: 'column',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        {
                                            group: true,
                                            layout: 'row',
                                            flex: 50,
                                            fullHeight: true,
                                            children: [
                                                { flex: 50, fullWidth: true, leftPadding: true, rightPadding: true, bottomPadding: true },
                                                { flex: 50, fullWidth: true, leftPadding: true, bottomPadding: true }
                                            ]
                                        },
                                        {
                                            group: true,
                                            layout: 'row',
                                            flex: 50,
                                            fullHeight: true,
                                            children: [
                                                { flex: 50, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                                { flex: 50, fullWidth: true, leftPadding: true, topPadding: true }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'row',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                { flex: 33, fullWidth: true, rightPadding: true },
                                {
                                    group: true,
                                    layout: 'column',
                                    flex: 67,
                                    fullHeight: true,
                                    children: [
                                        {
                                            group: true,
                                            layout: 'row',
                                            flex: 50,
                                            fullHeight: true,
                                            children: [
                                                { flex: 50, fullWidth: true, leftPadding: true, rightPadding: true, bottomPadding: true },
                                                { flex: 50, fullWidth: true, leftPadding: true, bottomPadding: true }
                                            ]
                                        },
                                        {
                                            group: true,
                                            layout: 'row',
                                            flex: 50,
                                            fullHeight: true,
                                            children: [
                                                { flex: 50, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                                { flex: 50, fullWidth: true, leftPadding: true, topPadding: true }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'column',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 100, fullWidth: true, bottomPadding: true }
                                    ]
                                },
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 25, fullWidth: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        }
                    ],
                    // 6
                    [
                        {
                            group: true,
                            layout: 'column',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 33, fullWidth: true, rightPadding: true, bottomPadding: true },
                                        { flex: 33, fullWidth: true, leftPadding: true, rightPadding: true, bottomPadding: true },
                                        { flex: 33, fullWidth: true, leftPadding: true, bottomPadding: true }
                                    ]
                                },
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 33, fullWidth: true, rightPadding: true, topPadding: true },
                                        { flex: 33, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 33, fullWidth: true, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'column',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 50, fullWidth: true, rightPadding: true, bottomPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, bottomPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, bottomPadding: true }
                                    ]
                                },
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 50, fullWidth: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'row',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                { flex: 33, fullWidth: true, rightPadding: true },
                                {
                                    group: true,
                                    layout: 'column',
                                    flex: 67,
                                    fullHeight: true,
                                    children: [
                                        {
                                            group: true,
                                            layout: 'row',
                                            flex: 50,
                                            fullHeight: true,
                                            children: [
                                                { flex: 50, fullWidth: true, leftPadding: true, rightPadding: true, bottomPadding: true },
                                                { flex: 50, fullWidth: true, leftPadding: true, bottomPadding: true }
                                            ]
                                        },
                                        {
                                            group: true,
                                            layout: 'row',
                                            flex: 50,
                                            fullHeight: true,
                                            children: [
                                                { flex: 33, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                                { flex: 33, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                                { flex: 33, fullWidth: true, leftPadding: true, topPadding: true }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'column',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 50, fullWidth: true, rightPadding: true, bottomPadding: true },
                                        { flex: 50, fullWidth: true, leftPadding: true, bottomPadding: true }
                                    ]
                                },
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 25, fullWidth: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        }
                    ],
                    // 7
                    [
                        {
                            group: true,
                            layout: 'column',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 33, fullWidth: true, rightPadding: true, bottomPadding: true },
                                        { flex: 33, fullWidth: true, leftPadding: true, rightPadding: true, bottomPadding: true },
                                        { flex: 33, fullWidth: true, leftPadding: true, bottomPadding: true }
                                    ]
                                },
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 25, fullWidth: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'column',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 50, fullWidth: true, rightPadding: true, bottomPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, bottomPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, bottomPadding: true }
                                    ]
                                },
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 25, fullWidth: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'row',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                { flex: 25, fullWidth: true, rightPadding: true },
                                {
                                    group: true,
                                    layout: 'column',
                                    flex: 75,
                                    fullHeight: true,
                                    children: [
                                        {
                                            group: true,
                                            layout: 'row',
                                            flex: 50,
                                            fullHeight: true,
                                            children: [
                                                { flex: 33, fullWidth: true, leftPadding: true, rightPadding: true, bottomPadding: true },
                                                { flex: 33, fullWidth: true, leftPadding: true, rightPadding: true, bottomPadding: true },
                                                { flex: 33, fullWidth: true, leftPadding: true, bottomPadding: true }
                                            ]
                                        },
                                        {
                                            group: true,
                                            layout: 'row',
                                            flex: 50,
                                            fullHeight: true,
                                            children: [
                                                { flex: 33, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                                { flex: 33, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                                { flex: 33, fullWidth: true, leftPadding: true, topPadding: true }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    // 8
                    [
                        {
                            group: true,
                            layout: 'column',
                            flex: 100,
                            fullHeight: true,
                            fullWidth: true,
                            children: [
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullWidth: true,
                                    children: [
                                        { flex: 25, fullWidth: true, rightPadding: true, bottomPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, bottomPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, bottomPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, bottomPadding: true }
                                    ]
                                },
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullWidth: true,
                                    children: [
                                        { flex: 25, fullWidth: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        }
                    ]
                ];


            return {
                getColorClasses: getColorClasses,
                getAvatarColors: getAvatarColors,
                getEntityTypes: getEntityTypes,
                setErrorImageCSS: setErrorImageCSS,
                setImageMarginCSS: setImageMarginCSS,
                setIconMarginCSS: setIconMarginCSS,
                getAvatarUrl: getAvatarUrl,
                bindFile: bindFile,
                getCollageSchemes: getCollageSchemes
            };

            function getEntityTypes() {
                return entityTypes;
            };

            function getColorClasses() {
                return colorClasses;
            };

            function getAvatarColors() {
                return colors;
            };

            function getCollageSchemes() {
                return collageSchemes;
            };

            function getAvatarUrl(partyId, partyName, id, type, noRedirect, noDefault) {
                var
                    timestamp = Math.floor(new Date().getTime() / 1000) * 1000,
                    colorClassIndex = pipStrings.hashCode(id) % colors.length,
                    chr = null,
                    url = null, default_template = '',
                    serverUrl = pipRest.serverUrl();

                noRedirect = noRedirect && noRedirect === true ? '&no_redirect=true' : '';
                if ((type && id && partyId) || (partyId)) {
                    if (type && id && partyId) {
                        if (type == 'category') return;
                        if (!noDefault) default_template = 'default_template='
                        + type + '&bg=' + colors[colorClassIndex]
                        + '&fg=white&';
                        if (entityTypes[type] == 'goals' || entityTypes[type] == 'areas' ) {
                            url = serverUrl + '/api/parties/' + partyId + '/' + entityTypes[type]
                            + '/' + id + '/avatar?' + default_template + 'timestamp=' + timestamp
                            + '&obj_id=' + id + noRedirect;
                        }
                    } else if (partyId && partyName) {
                        colorClassIndex = pipStrings.hashCode(partyId) % colors.length;
                        chr = (partyName[0] || '?').toUpperCase();
                        if (!noDefault) default_template = 'default_template=letter&bg=' + colors[colorClassIndex]
                        + '&fg=white&chr=' + chr + '&';
                        url = serverUrl + '/api/parties/' + partyId
                        + '/avatar?' + default_template + 'timestamp=' + timestamp + '&obj_id=' + partyId + noRedirect;
                    } else if (partyId && (!type && !id)) {
                        url = serverUrl + '/api/parties/' + partyId
                        + '/avatar?timestamp=' + timestamp + '&obj_id=' + partyId + noRedirect;
                    }
                }

                return url;
            };

            function bindFile(imageId, successCallback, errorCallback) {
                var url,
                    userId = ($rootScope.$user || {}).id,
                    partyId = ($rootScope.$party || {}).id || userId,
                    fileUrl = pipRest.serverUrl() + "/api/parties/" + partyId + "/files/" + imageId;

                //if (addHttpHeaders() && fileUrl)
                if (fileUrl)
                    $http.get(fileUrl)
                        .success(function (response) {
                            url = response && response.url ? response.url : '';

                            if (successCallback) successCallback(url);
                        })
                        .error(function (error) {
                            if (errorCallback) errorCallback(error);
                        });
            };

            function setErrorImageCSS(image, params) {
                var cssParams = {
                    'width': '',
                    'margin-left': '',
                    'height': '',
                    'margin-top': ''
                };

                if (params) cssParams = _.assign(cssParams, params);

                if (image)  image.css(cssParams);
            };

            function setImageMarginCSS($element, image, params) {
                var
                    containerWidth = $element.width ? $element.width() : $element.clientWidth, // || 80,
                    //containerWidth = $element.clientWidth ? $element.clientWidth : $element.width, // || 80,
                    //containerHeight = $element.clientHeight ? $element.clientHeight : $element.height, // || 80,
                    containerHeight = $element.height ? $element.height() : $element.clientHeight, // || 80,
                    imageWidth = image[0].naturalWidth || image.width,
                    imageHeight = image[0].naturalHeight || image.height,
                    margin = 0;
                var cssParams = {};

                if ((imageWidth / containerWidth) > (imageHeight / containerHeight)) {
                    margin = -((imageWidth / imageHeight * containerHeight - containerWidth) / 2);
                    cssParams['margin-left'] = '' + margin + 'px';
                    cssParams['height'] = '' + containerHeight + 'px';//'100%';
                    cssParams['width'] = '' + imageWidth * containerHeight/imageHeight + 'px';//'100%';
                    cssParams['margin-top'] = '';
                } else {
                    margin = -((imageHeight / imageWidth * containerWidth - containerHeight) / 2);
                    cssParams['margin-top'] = '' + margin + 'px';
                    cssParams['height'] = '' + imageHeight * containerWidth/imageWidth + 'px';//'100%';
                    cssParams['width'] = '' + containerWidth + 'px';//'100%';
                    cssParams['margin-left'] = '';
                }

                if (params) cssParams = _.assign(cssParams, params);

                image.css(cssParams);
            };

            function setIconMarginCSS(container, icon) {
                var
                    containerWidth = container.clientWidth ? container.clientWidth : container.width,
                    containerHeight = container.clientHeight ? container.clientHeight : container.height,
                    margin = 0,
                    iconSize = containerWidth > containerHeight ? containerHeight : containerWidth;

                var cssParams = {
                    'width': '' + iconSize + 'px',
                    'margin-left': '',
                    'height': '' + iconSize + 'px',
                    'margin-top': ''
                };

                if ((containerWidth) > (containerHeight)) {
                    margin = ((containerWidth - containerHeight) / 2);
                    cssParams['margin-left'] = '' + margin + 'px';
                } else {
                    margin = ((containerHeight - containerWidth) / 2);
                    cssParams['margin-top'] = '' + margin + 'px';
                }

                icon.css(cssParams);
            };

        }]
    );

})();




/**
 * @file Registration of composite WebUI controls
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    angular.module('pipComposite', [        
        'pipContentSwitch',
        'pipChecklistEdit',
        'pipChecklistView',
        'pipCompositeEdit',
        'pipCompositeView',
        'pipCompositeSummary',
        'pipCompositeToolbar',
        'pipCompositeFocused',

        'pipMobileMouseup',
        'pipMobileMousedown'
    ]);
    
})();



(function(module) {
try {
  module = angular.module('pipComposite.Templates');
} catch (e) {
  module = angular.module('pipComposite.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('checklist_edit/checklist_edit.html',
    '<!--\n' +
    '@file Checklist edit control content\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<div ng-class="{\'pip-checklist-draggable\': selected.drag}" id="{{\'checklist-\'  + selected.id}}">\n' +
    '    <div ng-repeat="item in checklistContent"\n' +
    '         ng-mousedown="onClick($event, $index)"\n' +
    '         class="pip-checklist-item"\n' +
    '         id="{{\'check-item-\'  + selected.id + \'-\' +  $index}}"\n' +
    '         pip-drag="checklistContent.length > 1 && selected.drag && !item.empty"\n' +
    '         pip-drag-data="item"\n' +
    '         pip-force-touch = "true"\n' +
    '         pip-touch-delay="30"\n' +
    '         pip-drop="true"\n' +
    '         pip-drag-stop="onStop(selected.id)"\n' +
    '         pip-drag-start="onStart(selected.id)"\n' +
    '         pip-scroll-container="pipScrollContainer"\n' +
    '         pip-drop-success="onDropComplete($index, $data, $event, selected.id)">\n' +
    '\n' +
    '        <div ng-class="{\'put_place\': selected.drag}"></div>\n' +
    '        <div class="pip-checklist-item-body layout-row layout-align-start-start"\n' +
    '             pip-cancel-drag="true"\n' +
    '             ng-class="{ \'select-active-item\': isSelectedItem($index) }">\n' +
    '\n' +
    '            <div class="pip-checklist-button"  pip-cancel-drag="true">\n' +
    '                <md-button pip-drag-handle\n' +
    '                           class="pip-icon-checklist-button md-icon-button no-ripple-container"\n' +
    '                           aria-label="REARRANGE"\n' +
    '                           tabindex="-1"\n' +
    '                           pip-mobile-mousedown="onDownDragg(item)"\n' +
    '                           pip-mobile-mouseup="onDraggEnd()"\n' +
    '                           ng-if="pipDraggable && checklistContent.length > 2 && !item.empty"\n' +
    '                           ng-class="checklistContent.length > 1 ? \'cursor-move\' : \'cursor-default\'"\n' +
    '                           ng-disabled="ngDisabled()">\n' +
    '                    <md-icon class="text-grey" md-svg-icon="icons:vhandle"></md-icon>\n' +
    '                </md-button>\n' +
    '            </div>\n' +
    '            <div class="pip-checklist-button" style="overflow: hidden"  pip-cancel-drag="true">\n' +
    '                <div class="pip-checklist-button-container">\n' +
    '                    <md-button class="pip-icon-checklist-button md-icon-button"\n' +
    '                               ng-show="item.empty"\n' +
    '                               ng-disabled="ngDisabled()"\n' +
    '                               md-ink-ripple\n' +
    '                               ng-click="onAddItem()"\n' +
    '                               tabindex="-1"\n' +
    '                               aria-label="PLUS">\n' +
    '                        <md-icon class="text-grey" md-svg-icon="icons:plus"></md-icon>\n' +
    '                    </md-button>\n' +
    '                    <md-checkbox ng-model="item.checked"\n' +
    '                                 ng-show="!item.empty"\n' +
    '                                 aria-label="COMPLETE"\n' +
    '                                 pip-cancel-drag="true"\n' +
    '                                 ng-focus="onItemFocus($index)"\n' +
    '                                 ng-change="onChecked(item)"\n' +
    '                                 ng-disabled="ngDisabled()">\n' +
    '                    </md-checkbox>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="pip-checklist-text flex " pip-cancel-drag="true">\n' +
    '                <md-input-container md-no-float class="flex" >\n' +
    '                    <textarea ng-model="item.text"\n' +
    '                              name="{{\'text\' + $index}}"\n' +
    '                              aria-label="TEXT"\n' +
    '                              class="pip-text-checkbox"\n' +
    '                              ng-focus="onItemFocus($index)"\n' +
    '                              ng-change="onChangeItem($index)"\n' +
    '                              ng-keydown="onTextareaKeyDown($event, $index, item)"\n' +
    '                              placeholder="{{::\'TEXT\' | translate}}"\n' +
    '                              id="{{\'check-item-text-\' + selected.id + \'-\' + $index}}"\n' +
    '                              ng-disabled="ngDisabled()">\n' +
    '                    </textarea>\n' +
    '                </md-input-container>\n' +
    '            </div>\n' +
    '            <div class="pip-checklist-button"  pip-cancel-drag="true">\n' +
    '                <md-button class="pip-icon-checklist-button md-icon-button" md-ink-ripple\n' +
    '                           ng-click="onDeleteItem($index, item)"\n' +
    '                           ng-disabled="ngDisabled()"\n' +
    '                           tabindex="-1"\n' +
    '                           ng-focus="onItemFocus($index)"\n' +
    '                           ng-show="isSelectedItem($index)"\n' +
    '                           aria-label="DELETE-ITEM">\n' +
    '                    <md-icon class="text-grey" md-svg-icon="icons:cross-circle"></md-icon>\n' +
    '                </md-button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '\n' +
    '    <div id="{{\'check-item-empty-\' + selected.id}}"\n' +
    '         class="pip-empty-text"\n' +
    '         pip-drag="false"\n' +
    '         pip-drop="true"\n' +
    '         pip-drop-success="onDropComplete(checklistContent.length, $data, $event, selected.id)">\n' +
    '        <div ng-class="{\'put_place\': selected.drag}"></div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipComposite.Templates');
} catch (e) {
  module = angular.module('pipComposite.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('checklist_view/checklist_view.html',
    '<div ng-repeat="item in checklistContent track by $index">\n' +
    '    <div class="pip-checklist-item layout-row layout-align-start-start">\n' +
    '        <div class="pip-checklist-icon">\n' +
    '            <md-checkbox  ng-model="item.checked"\n' +
    '                          ng-click="onClick($event, item)"\n' +
    '                          aria-label="COMPLETE"\n' +
    '                          ng-disabled="ngDisabled()">\n' +
    '            </md-checkbox>\n' +
    '        </div>\n' +
    '        <div class="pip-checklist-text flex">\n' +
    '            <pip-markdown pip-text="item.text"\n' +
    '                          pip-rebind="true"\n' +
    '                          ng-disabled="true">\n' +
    '            </pip-markdown>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipComposite.Templates');
} catch (e) {
  module = angular.module('pipComposite.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('composite_summary/composite_summary.html',
    '<div ng-repeat="item in compositeContent track by $index">\n' +
    '\n' +
    '    <!-- for text -->\n' +
    '    <div class="pip-composite-text" ng-if="item.type == \'text\' && item.text">\n' +
    '        <pip-markdown pip-text="item.text"\n' +
    '                      pip-line-count="{{textSize}}"\n' +
    '                      pip-rebind="true"\n' +
    '                      ng-disabled="true">\n' +
    '        </pip-markdown>\n' +
    '    </div>\n' +
    '    <!-- for pictures -->\n' +
    '    <div ng-if="item.type == \'pictures\' && item.pic_ids.length > 0"\n' +
    '         ng-class=" compositeContent[$index - 1].type != \'pictures\' ?\n' +
    '                    compositeContent[$index + 1].type != \'pictures\' ? \'tm16 bm16\' : \'tm16 bm0\' :\n' +
    '                    compositeContent[$index + 1].type != \'pictures\' ? \'tm8 bm16\' : \'tm8 bm0\' "\n' +
    '         class="pip-composite-pictures">\n' +
    '        <pip-collage ng-if="rebind"\n' +
    '                     pip-picture-ids="item.pic_ids"\n' +
    '                     pip-unique-code="item.id"\n' +
    '                     pip-multiple="true"\n' +
    '                     pip-open="disableControl"\n' +
    '                     pip-rebind="true"\n' +
    '                     ng-disabled="disableControl">\n' +
    '        </pip-collage>\n' +
    '    </div>\n' +
    '\n' +
    '    <!-- for documents -->\n' +
    '    <div ng-if="item.type == \'documents\' && item.docs.length > 0"\n' +
    '         class="pip-composite-documents layout-row flex">\n' +
    '        <pip-document-list class="flex"\n' +
    '                           pip-documents="item.docs"\n' +
    '                           pip-rebind="true"\n' +
    '                           pip-document-icon="true"\n' +
    '                           pip-collapse="true"\n' +
    '                           ng-disabled="disableControl">\n' +
    '        </pip-document-list>\n' +
    '    </div>\n' +
    '\n' +
    '    <!--for checklist -->\n' +
    '    <div ng-if="item.type == \'checklist\' && item.checklist.length > 0"\n' +
    '         class="pip-composite-checklist">\n' +
    '        <pip-checklist-view pip-options="item.checklist"\n' +
    '                            pip-changed="onContentChange()"\n' +
    '                            pip-rebind="true"\n' +
    '                            pip-collapse="true"\n' +
    '                            ng-disabled="disabledChecklist">\n' +
    '        </pip-checklist-view>\n' +
    '    </div>\n' +
    '\n' +
    '    <!--for location -->\n' +
    '    <div class="pip-composite-location layout-row layout-align-start-center flex"\n' +
    '         ng-if="item.type == \'location\' && (item.loc_pos || item.loc_name)">\n' +
    '\n' +
    '        <pip-location class="flex"\n' +
    '                      pip-location-name="item.loc_name"\n' +
    '                      pip-location-pos="item.loc_pos"\n' +
    '                      pip-collapse="true"\n' +
    '                      pip-show-location-icon="true"\n' +
    '                      ng-disabled="disableControl"\n' +
    '                      pip-rebind="true">\n' +
    '        </pip-location>\n' +
    '    </div>\n' +
    '\n' +
    '    <!-- for time -->\n' +
    '    <div class="pip-composite-time layout-row layout-align-start-center flex"\n' +
    '         ng-if="item.type == \'time\' && (item.start || item.end)">\n' +
    '\n' +
    '        <md-icon md-svg-icon="icons:time" class="rm24 lm0"></md-icon>\n' +
    '        <pip-time-range\n' +
    '                pip-start-date="item.start"\n' +
    '                pip-end-date="item.end"\n' +
    '                pip-rebind="true"\n' +
    '                ng-disabled="disableControl">\n' +
    '        </pip-time-range>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipComposite.Templates');
} catch (e) {
  module = angular.module('pipComposite.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('composite_edit/composite_edit.html',
    '<!--\n' +
    '@file Composite edit control content\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<div class="divider-top">\n' +
    '    <div class="pip-composite-body"\n' +
    '         ng-show="compositeContent.length != 0"\n' +
    '         ng-class="{\'drag-active\': selected.drag}">\n' +
    '\n' +
    '        <div class="pip-composite-item"\n' +
    '             ng-repeat="obj in compositeContent track by obj.id"\n' +
    '             ng-mousedown="onClick($event, $index, obj)"\n' +
    '             ng-class="{\'selected-content\': isSelectedSection($index, obj),\n' +
    '                        \'composite-animate\': !obj.empty && compositeContent.length > 1}"\n' +
    '             ng-keyup="onKeyUp($event)"\n' +
    '             ng-keydown="onKeyDown($event, $index, obj)"\n' +
    '             pip-drag="compositeContent.length > 1 && selected.drag"\n' +
    '             pip-touch-delay="10"\n' +
    '             pip-drag-data="obj"\n' +
    '             pip-scroll-container="pipScrollContainer"\n' +
    '             pip-drop="true"\n' +
    '             pip-force-touch = "true"\n' +
    '             pip-drag-stop="onStop(selected.id)"\n' +
    '             pip-drag-start="onStart(selected.id)"\n' +
    '             pip-drop-success="onDropComplete($index, $data, $event, selected.id)"\n' +
    '             id="{{\'composite-item-\' + selected.id + \'-\' + $index}}">\n' +
    '\n' +
    '            <!--<div ng-class="{\'putt_box\': selected.drag}"></div>-->\n' +
    '            <div class="putt_box"></div>\n' +
    '            <div class="pip-section-header layout-row layout-align-start-center"\n' +
    '                 ng-if="!obj.empty">\n' +
    '                <div class="w38"></div>\n' +
    '                <md-button class="md-icon-button md-icon-button-little icon-rearrange-btn no-ripple-container rm8 cursor-move"\n' +
    '                           ng-if="!ngDisabled() && compositeContent.length > 1"\n' +
    '                           pip-drag-handle\n' +
    '                           pip-mobile-mousedown="onDownDragg($event, obj)"\n' +
    '                           pip-mobile-mouseup="onDraggEnd()"\n' +
    '                           tabindex="-1"\n' +
    '                           aria-label="COMPOSITE-DRAGG"\n' +
    '                           ng-hide="compositeContent.length == 1">\n' +
    '                    <md-icon class="composite-icon cursor-move" md-svg-icon="icons:handle"></md-icon>\n' +
    '                </md-button>\n' +
    '                <div>\n' +
    '                    <md-button class="md-icon-button md-icon-button-little rm8"\n' +
    '                               ng-click="onDeleteItem($index)"\n' +
    '                               ng-disabled="ngDisabled()"\n' +
    '                               aria-label="COMPOSITE-DELETE">\n' +
    '                        <md-icon class="composite-icon" md-svg-icon="icons:cross"></md-icon>\n' +
    '                    </md-button>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <!--pip-prevent-drag-->\n' +
    '            <!-- for text -->\n' +
    '            <div class="pip-section-content rp24-flex lp24-flex tp16 bp16"\n' +
    '                 ng-if="obj.type == \'text\'" pip-cancel-drag="true">\n' +
    '                <md-input-container class="p0 m0 w-stretch" md-no-float>\n' +
    '                            <textarea ng-model="obj.text" aria-label="text"\n' +
    '                                      placeholder="{{ isFirst ? compositePlaceholder : \'TEXT\' | translate}}"\n' +
    '                                      id="{{\'composite-item-text-\' + selected.id + \'-\' + $index}}"\n' +
    '                                      ng-change="onContentChange(obj)"\n' +
    '                                      pip-cancel-drag="true"\n' +
    '                                      ng-disabled="ngDisabled()">\n' +
    '                            </textarea>\n' +
    '                </md-input-container>\n' +
    '            </div>\n' +
    '            <!-- -->\n' +
    '            <div class="pip-section-content rp24-flex lp24-flex vp20"\n' +
    '                 ng-if="obj.type == \'pictures\'" pip-cancel-drag="true">\n' +
    '                <pip-picture-list-edit class="w-stretch"\n' +
    '                                       pip-cancel-drag="true"\n' +
    '                                       pip-picture-ids="obj.pic_ids"\n' +
    '                                       pip-changed="onContentChange(obj)"\n' +
    '                                       pip-created="obj.pictures = $event.sender"\n' +
    '                                       pip-cancel-drag="true"\n' +
    '                                       pip-added-picture="addedContent"\n' +
    '                                       ng-disabled="ngDisabled()">\n' +
    '                </pip-picture-list-edit>\n' +
    '            </div>\n' +
    '            <!-- -->\n' +
    '            <div class="pip-section-content rp24-flex lp24-flex vp20"\n' +
    '                 ng-if="obj.type == \'documents\'" pip-cancel-drag="true">\n' +
    '                <pip-document-list-edit class="w-stretch"\n' +
    '                                        pip-documents="obj.docs"\n' +
    '                                        pip-cancel-drag="true"\n' +
    '                                        pip-changed="onContentChange(obj)"\n' +
    '                                        pip-cancel-drag="true"\n' +
    '                                        pip-created="obj.documents = $event.sender"\n' +
    '                                        pip-added-document="addedContent"\n' +
    '                                        ng-disabled="ngDisabled()">\n' +
    '                </pip-document-list-edit>\n' +
    '            </div>\n' +
    '\n' +
    '            <div class="pip-section-content layout-row layout-align-start-center"\n' +
    '                 ng-if="obj.type == \'checklist\'" pip-cancel-drag="true">\n' +
    '                <pip-checklist-edit pip-options="obj.checklist"\n' +
    '                                    pip-draggable="isActiveChecklist(obj)"\n' +
    '                                    pip-changed="onContentChange(obj)"\n' +
    '                                    ng-disabled="ngDisabled()"\n' +
    '                                    pip-scroll-container="{{pipScrollContainer}}"\n' +
    '                                    pip-rebind="true">\n' +
    '                </pip-checklist-edit>\n' +
    '            </div>\n' +
    '\n' +
    '            <div class="pip-section-content vp20 rp24-flex lp24-flex"\n' +
    '                 ng-if="obj.type == \'location\'" pip-cancel-drag="true">\n' +
    '                <pip-location-edit class="pip-location-attachments w-stretch"\n' +
    '                                   pip-location-name="obj.loc_name"\n' +
    '                                   pip-location-pos="obj.loc_pos"\n' +
    '                                   pip-cancel-drag="true"\n' +
    '                                   pip-location-holder="pipLocationHolder"\n' +
    '                                   pip-changed="onContentChange(obj)"\n' +
    '                                   ng-disabled="ngDisabled()">\n' +
    '                </pip-location-edit>\n' +
    '            </div>\n' +
    '            <!-- -->\n' +
    '            <div class="pip-section-content bp16-flex rp24-flex lp24-flex tp20"\n' +
    '                 ng-if="obj.type == \'time\'" pip-cancel-drag="true">\n' +
    '                <pip-time-range-edit class="w-stretch"\n' +
    '                               pip-start-date="obj.start"\n' +
    '                               pip-end-date="obj.end"\n' +
    '                               pip-size="$sizeGtSmall"\n' +
    '                               pip-changed="onContentChange(obj)"\n' +
    '                               ng-disabled="ngDisabled()"\n' +
    '                               pip-start-label="{{ \'COMPOSITE_START_TIME\' | translate }}"\n' +
    '                               pip-end-label="{{ \'COMPOSITE_END_TIME\' | translate }}">\n' +
    '                </pip-time-range-edit>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="pip-composite-item w-stretch"\n' +
    '             pip-drag="false"\n' +
    '             pip-drop="true"\n' +
    '             pip-drop-success="onDropComplete(compositeContent.length, $data, $event, selected.id)"\n' +
    '             pip-drag-stop="onStop(selected.id)"\n' +
    '             pip-drag-start="onStart(selected.id)"\n' +
    '             id="{{\'pip-composite-last-\' + selected.id}}">\n' +
    '\n' +
    '            <!--<div ng-class="{\'putt_box\': selected.drag}"></div>-->\n' +
    '            <div class="putt_box"></div>\n' +
    '            <div class="pip-section-content h24" style="border: 0px!important;">\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipComposite.Templates');
} catch (e) {
  module = angular.module('pipComposite.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('composite_view/composite_view.html',
    '<div ng-repeat="item in compositeContent track by $index">\n' +
    '\n' +
    '    <!-- for text -->\n' +
    '    <div class="pip-composite-text lp24-flex rp24-flex" ng-if="item.type == \'text\' && item.text" ng-class="{\'bm16\': $last}">\n' +
    '        <pip-markdown pip-text="item.text"\n' +
    '                      pip-rebind="true"\n' +
    '                      ng-disabled="true">\n' +
    '        </pip-markdown>\n' +
    '    </div>\n' +
    '    <!-- for pictures -->\n' +
    '    <div ng-if="item.type == \'pictures\' && item.pic_ids.length > 0"\n' +
    '         ng-class=" compositeContent[$index - 1].type != \'pictures\' ?\n' +
    '                    compositeContent[$index + 1].type != \'pictures\' ? \'tm16 bm16\' : \'tm16 bm0\' :\n' +
    '                    compositeContent[$index + 1].type != \'pictures\' ? \'tm8 bm16\' : \'tm8 bm0\' "\n' +
    '         class="pip-composite-pictures lp24-flex rp24-flex">\n' +
    '        <pip-collage ng-if="rebind"\n' +
    '                pip-picture-ids="item.pic_ids"\n' +
    '                pip-unique-code="item.id"\n' +
    '                pip-multiple="true"\n' +
    '                pip-open="true"\n' +
    '                pip-rebind="true"\n' +
    '                ng-disabled="ngDisabled()">\n' +
    '        </pip-collage>\n' +
    '    </div>\n' +
    '\n' +
    '    <!-- for documents -->\n' +
    '    <div ng-if="item.type == \'documents\' && item.docs.length > 0"\n' +
    '         class="pip-composite-documents layout-row layout-align-start-start flex">\n' +
    '        <pip-document-list pip-documents="item.docs"\n' +
    '                           pip-document-icon="true"\n' +
    '                           pip-rebind="true"\n' +
    '                           ng-disabled="ngDisabled()">\n' +
    '        </pip-document-list>\n' +
    '    </div>\n' +
    '\n' +
    '    <!--for checklist -->\n' +
    '    <div ng-if="item.type == \'checklist\' && item.checklist.length > 0"\n' +
    '         class="pip-composite-checklist lp24-flex rp24-flex">\n' +
    '        <pip-checklist-view pip-options="item.checklist"\n' +
    '                            pip-changed="onContentChange()"\n' +
    '                            pip-rebind="true"\n' +
    '                            ng-disabled="isDisabled()">\n' +
    '        </pip-checklist-view>\n' +
    '    </div>\n' +
    '\n' +
    '    <!--for location -->\n' +
    '    <div class="pip-composite-location layout-row layout-align-start-start flex"\n' +
    '         ng-if="item.type == \'location\' && (item.loc_pos || item.loc_name)">\n' +
    '\n' +
    '        <pip-location class="flex"\n' +
    '                      pip-location-name="item.loc_name"\n' +
    '                      pip-location-pos="item.loc_pos"\n' +
    '                      pip-show-location-icon="true"\n' +
    '                      pip-collapse="false"\n' +
    '                      ng-disabled="ngDisabled()"\n' +
    '                      pip-rebind="true">\n' +
    '        </pip-location>\n' +
    '    </div>\n' +
    '\n' +
    '    <!-- for time -->\n' +
    '    <div class="pip-composite-time lp24-flex rp24-flex layout-row layout-align-start-center  flex"\n' +
    '         ng-if="item.type == \'time\'">\n' +
    '\n' +
    '        <md-icon md-svg-icon="icons:time" class="lm0"></md-icon>\n' +
    '        <pip-time-range\n' +
    '                pip-start-date="item.start"\n' +
    '                pip-end-date="item.end"\n' +
    '                pip-rebind="true"\n' +
    '                ng-disabled="ngDisabled()">\n' +
    '        </pip-time-range>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipComposite.Templates');
} catch (e) {
  module = angular.module('pipComposite.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('composite_toolbar/composite_toolbar.html',
    '<!--\n' +
    '@file Composite toolbar control content\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<div class="layout-row layout-align-start-start flex">\n' +
    '    <md-button class="pip-composite-button"\n' +
    '               ng-if="!emptyState"\n' +
    '               ng-class="{ \'remove-item\': !emptyState ,\n' +
    '                                \'new-item\': !emptyState }"\n' +
    '               ng-click="onAddItem(\'text\');"\n' +
    '               aria-label="COMPOSITE-BUTTON-TEXT"\n' +
    '               ng-disabled="ngDisabled()">\n' +
    '        <md-icon class="icon-text-block" md-svg-icon="icons:text"></md-icon>\n' +
    '        <md-tooltip>{{::\'TEXT\'| translate}}</md-tooltip>\n' +
    '    </md-button>\n' +
    '    <md-button ng-if="toolbarButton.checklist"\n' +
    '               ng-click="onAddItem(\'checklist\')"\n' +
    '               ng-disabled="ngDisabled()"\n' +
    '               class="pip-composite-button"\n' +
    '               aria-label="COMPOSITE-BUTTON-CHECKLIST">\n' +
    '        <md-icon class="icon-checkbox-on" md-svg-icon="icons:checkbox-on"></md-icon>\n' +
    '        <md-tooltip>{{::\'CHECKLIST\'| translate}}</md-tooltip>\n' +
    '    </md-button>\n' +
    '    <md-button ng-if="toolbarButton.picture"\n' +
    '               ng-click="onAddItem(\'pictures\')"\n' +
    '               ng-disabled="ngDisabled()"\n' +
    '               class="pip-composite-button"\n' +
    '               aria-label="COMPOSITE-BUTTON-PICTURES">\n' +
    '        <md-icon class="icon-camera" md-svg-icon="icons:camera"></md-icon>\n' +
    '        <md-tooltip>{{::\'PICTURE\'| translate}}</md-tooltip>\n' +
    '    </md-button>\n' +
    '    <md-button ng-click="onAddItem(\'documents\')"\n' +
    '               ng-if="toolbarButton.document"\n' +
    '               ng-disabled="ngDisabled()"\n' +
    '               class="pip-composite-button"\n' +
    '               aria-label="COMPOSITE-BUTTON-DOCUMENTS">\n' +
    '        <md-icon class="icon-document" md-svg-icon="icons:document"></md-icon>\n' +
    '        <md-tooltip>{{::\'DOCUMENT\'| translate}}</md-tooltip>\n' +
    '    </md-button>\n' +
    '    <md-button ng-click="onAddItem(\'location\')"\n' +
    '               ng-if="toolbarButton.location"\n' +
    '               ng-disabled="ngDisabled()"\n' +
    '               class="pip-composite-button"\n' +
    '               aria-label="COMPOSITE-BUTTON-LOCATIONS">\n' +
    '        <md-icon class="icon-location" md-svg-icon="icons:location"></md-icon>\n' +
    '        <md-tooltip>{{::\'LOCATION\'| translate}}</md-tooltip>\n' +
    '    </md-button>\n' +
    '    <md-button ng-click="onAddItem(\'time\')"\n' +
    '               ng-if="toolbarButton.event"\n' +
    '               ng-disabled="ngDisabled()"\n' +
    '               class="pip-composite-button"\n' +
    '               aria-label="COMPOSITE-BUTTON-TIME">\n' +
    '        <md-icon class="icon-time" md-svg-icon="icons:time"></md-icon>\n' +
    '        <md-tooltip>{{::\'TIME\'| translate}}</md-tooltip>\n' +
    '    </md-button>\n' +
    '\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipComposite.Templates');
} catch (e) {
  module = angular.module('pipComposite.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('content_switch/content_switch.html',
    '<!--\n' +
    '@file Content switch control content\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-button ng-click="showPictures = !showPictures; onButtonClick(\'pictures\')"\n' +
    '           aria-label="showPictures"\n' +
    '           class="md-icon-button"\n' +
    '           ng-show="showIconPicture"\n' +
    '           ng-disabled="transaction.busy()">\n' +
    '        <md-icon class="active-camera"\n' +
    '                 ng-class="{ \'active-camera\': showPictures }"\n' +
    '                 md-svg-icon="icons:camera"></md-icon>\n' +
    '</md-button>\n' +
    '<md-button ng-click="showDocuments = !showDocuments; onButtonClick(\'documents\')"\n' +
    '           aria-label="showDocuments"\n' +
    '           class="md-icon-button"\n' +
    '           ng-show="showIconDocument"\n' +
    '           ng-disabled="transaction.busy()">\n' +
    '    <md-icon ng-class="{ \'active-document\': showDocuments }" md-svg-icon="icons:document"></md-icon>\n' +
    '</md-button>\n' +
    '<md-button ng-click="showEvent = !showEvent; onButtonClick(\'event\')"\n' +
    '           aria-label="showEvent"\n' +
    '           class="md-icon-button"\n' +
    '           ng-show="showIconEvent"\n' +
    '           ng-disabled="transaction.busy()">\n' +
    '    <md-icon ng-class="{ \'active-time\': showEvent }" md-svg-icon="icons:time"></md-icon>\n' +
    '</md-button>\n' +
    '<md-button ng-click="showLocation = !showLocation; onButtonClick(\'location\')"\n' +
    '           aria-label="showLocation"\n' +
    '           class="md-icon-button"\n' +
    '           ng-show="showIconLocation"\n' +
    '           ng-disabled="transaction.busy()">\n' +
    '    <md-icon ng-class="{ \'active-location\': showLocation }" md-svg-icon="icons:location"></md-icon>\n' +
    '</md-button>');
}]);
})();

/**
 * @file Checklist edit control
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * + Improve samples in sampler app
 * + Renamed to pip-checklist-edit and implement pip-checklist (pip-checklist-view) control
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipChecklistEdit", ['pipCore', 'pipComposite.Templates']);

    /**
     * ngDisabled: '&',
     * pipChanged: '=',
     * pipDraggable: '=',
     * pipOptions: '=',
     * pipScrollContainer: '@'
     */
    thisModule.directive('pipChecklistEdit',
        function () {
            return {
                restrict: 'EA',
                replace: false,
                scope: {
                    ngDisabled: '&',
                    pipChanged: '=',
                    pipDraggable: '=',
                    pipOptions: '=',
                    pipScrollContainer: '@'
                },
                templateUrl: 'checklist_edit/checklist_edit.html',
                controller: 'pipChecklistEditController'
            }
        }
    );

    thisModule.controller('pipChecklistEditController',
        ['$scope', '$element', '$attrs', '$document', 'pipUtils', '$rootScope', function ($scope, $element, $attrs, $document,pipUtils, $rootScope) {

            $scope.selected = {};
            $scope.selected.index = 0;
            $scope.selected.drag = $scope.pipDraggable;
            $scope.selected.dragInit = $scope.pipDraggable;
            $scope.selected.dragId = 0;
            $scope.selected.id = now();
            $scope.selected.isChanged = false;

            generateList($scope.pipOptions);

            $scope.onTextareaKeyDown = onTextareaKeyDown;
            $scope.onAddItem = onAddItem;
            $scope.onChangeItem = onChangeItem;
            $scope.onClick = onClick;
            $scope.onTextAreaClick = onTextAreaClick;
            $scope.onDropComplete = onDropComplete;
            $scope.onDeleteItem = onDeleteItem;
            $scope.onChecked = onChecked;
            $scope.updateContents = updateContents;
            $scope.onItemFocus = onItemFocus;
            $scope.onMove = onMove;
            $scope.onStart = onStart;
            $scope.onStop = onStop;
            $scope.isDisabled = isDisabled;
            $scope.onDownDragg = onDownDragg;

            $scope.isSelectedItem = isSelectedItem;

            // Watch for options changes
            if (pipUtils.toBoolean($attrs.pipRebind)) {
                $scope.$watchCollection('pipOptions', function (newValue) {
                    if (!$scope.selected.isChanged) {
                        generateList($scope.pipOptions);
                    } else {
                        $scope.selected.isChanged = false;
                    }
                });
            }

            if (pipUtils.toBoolean($attrs.pipRebind)) {
                $scope.$watchCollection('pipDraggable', function (newValue) {
                    $scope.pipDraggable = newValue;
                });
            }

            $scope.onChecklistChange = _.debounce(onChecklistChange , 200);

            // Add class
            $element.addClass('pip-checklist-edit');

            return;

            function getCaret(el) {
                if (el.selectionStart) {
                    return el.selectionStart;
                } else if ($document.selection) {
                    el.focus();

                    var r = $document.selection.createRange();
                    if (r == null) {
                        return 0;
                    }

                    var re = el.createTextRange(),
                        rc = re.duplicate();
                    re.moveToBookmark(r.getBookmark());
                    rc.setEndPoint('EndToStart', re);

                    return rc.text.length;
                }
                return 0;
            }

            function isDisabled() {
                if ($scope.ngDisabled) {
                    return $scope.ngDisabled();
                } else {
                    return false;
                }
            };

            function onItemFocus(index) {
                if (isDisabled()) return;
                $scope.selected.index = index;
            };

            function isSelectedItem(index) {
                var empty;
                try {
                    empty = $scope.checklistContent[index].empty;
                } catch (err) {
                    empty = true;
                }

                return $scope.selected.index == index && $scope.pipDraggable && !empty;
            };

            function setSelectionRange(input, selectionStart, selectionEnd) {
                if (input.setSelectionRange) {
                    input.focus();
                    input.setSelectionRange(selectionStart, selectionEnd);
                }
                else if (input.createTextRange) {
                    var range = input.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', selectionEnd);
                    range.moveStart('character', selectionStart);
                    range.select();
                }
            }

            function setCaretToPos (input, pos) {
                setSelectionRange(input, pos, pos);
            }

            function onTextareaKeyDown($event, index, item) {
                if (isDisabled()) return;
                if ($scope.selected.index == -1) return;


                if ($event && $event.target) {
                    // calculate caret position
                    var posCaret = getCaret($event.target);
                    // calculate textarea length
                    if ($event.target.value !== undefined)
                        var textareaLength = $event.target.value.length;
                }
                
                // delete empty item after backspace or del
                if ($scope.selected.index > 0 && item.text != '' && posCaret == 0 && $event.keyCode == 8  && !$event.ctrlKey && !$event.shiftKey) {
                    if (!item.empty) {
                        var position = $scope.checklistContent[$scope.selected.index - 1].text.length;
                        $scope.checklistContent[$scope.selected.index - 1].text = $scope.checklistContent[$scope.selected.index - 1].text + item.text;
                        $scope.selected.index -= 1;
                        $scope.checklistContent.splice($scope.selected.index + 1, 1);
                        $scope.onChecklistChange();
                        
                        setFocus($scope.selected.index, position);
                    }
                    if ($event) $event.stopPropagation();
                    return false;
                }
                
                if (item.text == '' && ($event.keyCode == 8 || $event.keyCode == 46) && !$event.ctrlKey && !$event.shiftKey) {
                    if (!item.empty) onDeleteItem(index, item);
                    if ($event) $event.stopPropagation();
                    return false;
                }

                //press enter - create new item
                if (($event.keyCode == 13 || $event.keyCode == 45) && !$event.ctrlKey && !$event.shiftKey) {  // insert
                    if (posCaret !== undefined && posCaret == 0) {
                        // add item before current item
                        if ($scope.selected.index > 0) addItem('', $scope.selected.index - 1);
                        else  {
                            $scope.selected.index = -1;
                            addItem('', -1);
                        }
                        if ($event) $event.stopPropagation();
                        if ($event) $event.preventDefault();

                        return false;
                    }

                    if (textareaLength && posCaret && textareaLength == posCaret) {
                        // add item after current item
                        if (!item.empty) {
                            addItem('', $scope.selected.index);
                        }
                        if ($event) $event.stopPropagation();
                        if ($event) $event.preventDefault();
                        return false;
                    } 
                    
                     if (textareaLength && posCaret && textareaLength > posCaret) {
                        // divide current item 
                        if (!item.empty) {
                            var valueCurrent, newItem;
                            valueCurrent = item.text.substring(0, posCaret);
                            newItem = item.text.substring(posCaret);
                            item.text = valueCurrent;
                            addItem(newItem, $scope.selected.index);
                            
                            setFocus($scope.selected.index, 0);
                        }
                        if ($event) $event.stopPropagation();
                        if ($event) $event.preventDefault();
                        return false;
                    } 

                    if ($event) $event.preventDefault();
                    return false;
                }

                // move cursor up
                if ((posCaret === 0 || posCaret == textareaLength) && $scope.checklistContent.length > 1 && $event.keyCode == 38 && !$event.ctrlKey && !$event.shiftKey) {  // insert
                    if ($event) $event.stopPropagation();
                    if ($event) $event.preventDefault();

                    if (posCaret !== undefined && textareaLength !== undefined && posCaret == 0) {
                        // move to new item
                        if ($scope.selected.index == 0) {
                            $scope.selected.index = $scope.checklistContent.length - 1;
                            var position =  $scope.checklistContent[$scope.selected.index].text.length;
                            setFocus($scope.selected.index, position);
                        } else {
                            $scope.selected.index -= 1;
                            var position =  $scope.checklistContent[$scope.selected.index].text.length;
                            setFocus($scope.selected.index, position);
                        }
                    } else {
                        // move caret to text end
                        setFocus($scope.selected.index, 0);
                    }

                    return false;
                }

                // move cursor down
                if ((posCaret === 0 || posCaret == textareaLength) && $scope.checklistContent.length > 1 && $event.keyCode == 40 && !$event.ctrlKey && !$event.shiftKey) {  // insert
                    if ($event) $event.stopPropagation();
                    if ($event) $event.preventDefault();

                    if (posCaret !== undefined && textareaLength !== undefined && posCaret == textareaLength) {
                        // move to new item
                        if ($scope.selected.index >= $scope.checklistContent.length - 1) {
                            $scope.selected.index = 0;
                            setFocus($scope.selected.index, 0);
                        } else {
                            $scope.selected.index += 1;
                            setFocus($scope.selected.index, 0);
                        }
                    } else {
                        // move caret to text end
                        setFocus($scope.selected.index, textareaLength);
                    }

                    return false;
                }

                // delete item
                if (!item.empty && $event.keyCode == 46 && $event.ctrlKey && !$event.shiftKey) {
                    if ($event) $event.stopPropagation();
                    if ($event) $event.preventDefault();
                    onDeleteItem(index, item);
                    return false;
                }

                // check/uncheck item
                if ($event.keyCode == 32 && $event.ctrlKey && !$event.shiftKey) {
                    if ($event) $event.stopPropagation();
                    if ($event) $event.preventDefault();
                    if (item) {
                        item.checked = !item.checked
                        $scope.onChecklistChange();
                    }
                    return false;
                }
            }


            function onAddItem() {
                addItem('', $scope.selected.index - 1);
            };

            function onChangeItem(index) {
                if (index > -1 && $scope.checklistContent[index] && $scope.checklistContent[index].empty) {
                    if ($scope.checklistContent[index].empty) {
                        $scope.checklistContent[index].empty = false;
                        $scope.checklistContent.push(getNewItem('', true));
                    }
                }
                $scope.onChecklistChange();
            };

            function onClick($event, index) {
                if (isDisabled()) return;
                $scope.selected.index = index;

               // if ($event) $event.preventDefault();
            };

            function onTextAreaClick($event, index) {
                if (isDisabled()) return;
                $scope.selected.index = index;
              //  if ($event) $event.stopPropagation();
            };

            function onDropComplete(placeIndex, obj, event, componentId) {
                if ($scope.selected.id != componentId) return;
                if (!$scope.selected.drag) return;
                var index = placeIndex;

                var tmpIndex = $scope.selected.index;

                var checklist = _.cloneDeep($scope.checklistContent);

                if (!(tmpIndex == 0 && placeIndex == 1)) {
                    if (tmpIndex > index) {
                        if (index > checklist.length - 1) index = checklist.length - 1;
                        // move up
                        for (var i = 0; i < tmpIndex - index; i++) {
                            checklist[tmpIndex - i] = checklist[tmpIndex - i - 1];
                        }
                        checklist[index] = obj;
                    }
                    if (tmpIndex < index) {
                        index -= 1;
                        //move down
                        for (var i = 0; i < index - tmpIndex; i++) {
                            checklist[tmpIndex + i] = checklist[tmpIndex + i + 1];
                        }
                        checklist[index] = obj;
                    }

                    $scope.selected.index = index;
                }

                $scope.checklistContent = checklist;

                $scope.onChecklistChange();
            };

            function onMove() {
                setWidth();
                $scope.isWidth = true;
            };


            function onStop(id) {
                setTimeout(function () {
                    $scope.selected.drag = $scope.selected.dragInit;
                    $scope.selected.dragId = 0;
                    $scope.$apply();
                },  50);

                if($scope.isWidth) {
                    setWidth100();
                    $scope.isWidth  = false;
                }
            };

            function onStart(id) {
                $scope.selected.isChanged = true;
                if (id && id != $scope.selected.dragId) $scope.selected.drag = false;
            };

            function onDownDragg(item) {
                if ($scope.pipDraggable && $scope.checklistContent.length > 2 && !item.empty) {
                    $rootScope.$broadcast('onChecklistDrag');
                    $scope.selected.dragId = $scope.selected.id;
                }
            };
            
            function onDeleteItem(index, item) {
              
                if ($scope.checklistContent.length == 1) {
                    $scope.checklistContent[0].text = '';
                    $scope.checklistContent[0].checked = false;
                    $scope.checklistContent[0].empty = true;
                    $scope.selected.index = 0;
                } else {
                    if (index >= 0 && index <= $scope.checklistContent.length)
                        $scope.checklistContent.splice(index, 1);
                    else return;
                }

                if ($scope.selected.index >= $scope.checklistContent.length)
                    $scope.selected.index = $scope.checklistContent.length - 1;

                setFocus($scope.selected.index, 0);
                
                $scope.onChecklistChange();
            };

            function onChecked(item) {
                $scope.onChecklistChange();
            };

            function updateContents() {
                $scope.selected.isChanged = true;
                var content = [], i;
                for (i = 0; i < $scope.checklistContent.length; i++) {
                    if ($scope.checklistContent[i] && !$scope.checklistContent[i].empty) content.push({
                        checked: $scope.checklistContent[i].checked,
                        text: $scope.checklistContent[i].text
                    })
                }
                $scope.pipOptions = content;
            };

            function onChecklistChange() {
                updateContents();
                if ($scope.pipChanged) {
                    $scope.pipChanged();
                }
            };

            function setFocus(index, toPos) {
                if (index > -1) {
                    setTimeout(function () {
                        var nextElement = angular.element('#check-item-text-' + $scope.selected.id + '-' + index);
                        if (nextElement) {
                            nextElement.focus();
                            if (toPos !== undefined && nextElement[0]) setCaretToPos(nextElement[0], toPos);
                        }
                    },  50);
                }
            };

            function addItem(text, index) {
                var newItem = getNewItem(text, false);
                if (index > -1) $scope.selected.index = index;

                if ($scope.checklistContent.length < 2) {
                    $scope.checklistContent.unshift(newItem);
                }
                else {
                    $scope.checklistContent.splice($scope.selected.index + 1, 0, newItem);
                }
                $scope.selected.index += 1;
                setFocus($scope.selected.index);

                $scope.onChecklistChange();
            }

            function getNewItem(text, isEmpty) {
                return {
                    checked: false,
                    text: text || '',
                    empty: isEmpty
                }
            };

            function now(){
                return +new Date;
            }

            function clearList() {
                $scope.selected.index = 0;
                $scope.checklistContent = [];
                // push empty item
                $scope.checklistContent.push(getNewItem('', true));
            };

            function generateList(content) {
                if (!content ||  content.length < 1) {
                    clearList();
                } else {
                    $scope.checklistContent = [];
                    _.each(content, function(item){
                        $scope.checklistContent.push(item);
                    });
                    // push empty item
                    $scope.checklistContent.push(getNewItem('', true));
                }
            };

            function setWidth100() {
                var element = angular.element('#check-item-' + + $scope.selected.id + '-' + $scope.selected.index);
                element.css( "width", 'none');
                element.css( "max-width", 'none');
            };

            function setWidth() {
                if ($scope.isWidth) return;

                var elementEtalon = angular.element('#check-item-empty-' + $scope.selected.id);
                var value = elementEtalon.width();
                var element = angular.element('#check-item-' + $scope.selected.id + '-' + $scope.selected.index);
                if (element) {
                    element.css("width", value + 'px');
                    element.css("max-width", value + 'px');
                }
            };

        }]
    );

})();
/**
 * @file Checklist view control
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipChecklistView", ['pipCore', 'pipComposite.Templates']);

    thisModule.directive('pipChecklistView',
        function () {
            return {
                restrict: 'EA',
                replace: false,
                scope: {
                    ngDisabled: '&',
                    pipChanged: '&',
                    pipOptions: '='
                },
                templateUrl: 'checklist_view/checklist_view.html',
                controller: 'pipChecklistViewController'
            }
        }
    );

    thisModule.controller('pipChecklistViewController',
        ['$scope', '$element', '$attrs', 'pipUtils', function ($scope, $element, $attrs, pipUtils) {

            $scope.disableControl = pipUtils.toBoolean($scope.ngDisabled()) != false;
            $scope.rebind = pipUtils.toBoolean($attrs.pipRebind);
            $scope.selected = {};
            $scope.selected.isChanged = false;

            generateList($scope.pipOptions);

            // Add class
            $element.addClass('pip-checklist-view');

            // Watch for options changes
            if (pipUtils.toBoolean($attrs.pipRebind)) {
                $scope.$watchCollection('pipOptions', function (newValue) {
                    if (!$scope.selected.isChanged) {
                        generateList($scope.pipOptions);
                    } else {
                        $scope.selected.isChanged = false;
                    }
                });
            }

            $scope.updateContents = updateContents;
            $scope.onClick = onClick;

            return;

            function updateContents() {
                $scope.selected.isChanged = true;
                $scope.pipOptions = $scope.checklistContent;
            };

            function onChecklistChange() {
                updateContents();
                if ($scope.pipChanged) {
                    $scope.pipChanged();
                }
            };

            function clearList() {
                $scope.checklistContent = [];
            };

            function generateList(content) {
                if (!content ||  content.length < 1) {
                    clearList();
                    return;
                } else {
                    $scope.checklistContent = [];
                    _.each(content, function(item){
                        $scope.checklistContent.push(item);
                    });
                }
            };

            function onClick($event, item) {
                if ($event) $event.stopPropagation();
                if ($scope.ngDisabled && $scope.ngDisabled()) return;

                onChecklistChange();
            };

        }]
    );

})();

/**
 * @file Composite edit control
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipCompositeEdit", [
        'pipCore', 'pipDocuments', 'pipLocations', 'pipPictures', 'pipComposite.Templates']);

    thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'COMPOSITE_TITLE': 'What\'s on your mind?',
            'COMPOSITE_PLACEHOLDER': 'Type text ...',
            'COMPOSITE_START_TIME': 'Start time',
            'COMPOSITE_END_TIME': 'End time'
        });
        pipTranslateProvider.translations('ru', {
            'COMPOSITE_TITLE': 'Что у вас на уме?',
            'COMPOSITE_PLACEHOLDER': 'Введите текст ...',
            'COMPOSITE_START_TIME': 'Время начала',
            'COMPOSITE_END_TIME': 'Время окончания'
        });
    }]);

    thisModule.directive('pipCompositeEdit',
        function () {
            return {
                restrict: 'EA',
                replace: false,
                scope: {
                    ngDisabled: '&',
                    pipChanged: '&',
                    pipContents: '=',
                    compositeId: '=pipCompositeId',
                    pipCompositePlaceholder: '=',
                    pipScrollContainer: '@',
                    pipAddedContent: '&'
                },
                templateUrl: 'composite_edit/composite_edit.html',
                controller: 'pipCompositeEditController'
            }
        }
    );

    thisModule.controller('pipCompositeEditController',
        ['$scope', '$element', '$attrs', '$rootScope', 'pipUtils', 'pipTranslate', '$document', function ($scope, $element, $attrs, $rootScope, pipUtils, pipTranslate, $document) {

            var CONTENT_TYPES = ['time', 'text', 'pictures', 'documents', 'checklist', 'location'];

            $scope.selected = {};
            $scope.selected.id = now();
            $scope.selected.index = 0;
            $scope.selected.drag = true;
            $scope.selected.dragId = 0;

            $scope.selected.isChanged = false;
            $scope.toolbarButton = {};
            $scope.rebind = pipUtils.toBoolean($attrs.pipRebind);
            $scope.disableControl = pipUtils.toBoolean($scope.ngDisabled()) != false;
            $scope.addedContent = pipUtils.toBoolean($scope.pipAddedContent()) == true;

            generateList($scope.pipContents);
            setPlaceholder();

            $rootScope.$on('pipAddCompositeItem', function(event, args) {
                if ($scope.compositeId) {
                    if (args.id && args.id == $scope.compositeId) addItem(args.type);
                } else addItem(args.type);
            });

            // Watch for options changes
            if (pipUtils.toBoolean($attrs.pipRebind)) {
                $scope.$watchCollection('pipContents', function (newValue, oldValue) {
                    if (!$scope.selected.isChanged || ($scope.pipContents
                        && $scope.pipContents.length != $scope.compositeContent.length)) {
                        generateList($scope.pipContents);
                        $scope.selected.isChanged = false;
                    }
                });

                $scope.$watch('pipCompositePlaceholder', function (newValue, oldValue) {
                    if ( newValue !== oldValue ) {
                        setPlaceholder();
                    }
                });
            }

            $element.addClass('pip-composite-edit');

            $scope.onDeleteItem = onDeleteItem;
            $scope.onContentChange = onContentChange;
            $scope.isSelectedSection = isSelectedSection;
            $scope.onClick = onClick;
            $scope.onDownDragg = onDownDragg;
            $scope.onDraggEnd = onDraggEnd;
            $scope.onDropComplete = onDropComplete;
            $scope.onKeyUp = onKeyUp;
            $scope.onKeyDown = onKeyDown;
            $scope.onStart = onStart;
            $scope.onStop = onStop;

            $scope.isActiveChecklist = isActiveChecklist;

            $rootScope.$on('onChecklistDrag', function () {
                $scope.selected.drag = false;
                setTimeout(function () {
                    $scope.selected.drag = false;
                    $scope.$apply();
                },  0);
            });

            $rootScope.$on('focusedComposite', function () {
                if ($scope.isFirst) {
                    setTimeout(function () {
                        var nextElement = angular.element('#composite-item-text-' + $scope.selected.id + '-0');
                        if (nextElement && !nextElement.is(':focus')) nextElement.focus();
                    },  50);
                }
            });

            $scope.onCompositeChange = _.debounce(onCompositeChange , 200);

            return;

            function isActiveChecklist(obj) {
                //return obj.id == $scope.selected.index  && !$scope.selected.drag;
                return obj.id == $scope.selected.index;
            };

            function updateContents() {
                $scope.selected.isChanged = true;
                $scope.pipContents = $scope.compositeContent;
            };

            function getParentIndex(el) {
                if (el.length < 1) return null;
                var elParent = el.parent();
                if (elParent[0] && elParent[0].id && elParent[0].id.indexOf('composite-item-' + $scope.selected.id) > -1) {
                    var strs = elParent[0].id.split('-');

                    var parentIndex = parseInt(strs[strs.length - 1], 10);
                    return parentIndex;
                } else return getParentIndex(elParent);
            };

            function onKeyUp($event) {
                if ($event.keyCode == 9) {
                    setTimeout(function () {
                        var focusedElement = angular.element($document[0].activeElement);
                        var parentIndex = getParentIndex(focusedElement);
                        if (parentIndex != null) $scope.selected.index = parentIndex;
                        $scope.$apply($scope.selected.index = $scope.compositeContent[parentIndex].id);
                    },  50);
                }
            };

            function onKeyDown($event, index, item) {
                if ($scope.ngDisabled()) return;
                // delete item
                if (item && !item.empty && $event.keyCode == 46 && !$event.ctrlKey && $event.shiftKey) {
                    if ($event) $event.stopPropagation();
                    if ($event) $event.preventDefault();
                    if (index > -1) {
                        onDeleteItem(index);
                    }

                    return false;
                }
            }

            function onCompositeChange() {
                updateContents();
                if ($scope.pipChanged) $scope.pipChanged();
            };

            function onDeleteItem(index) {
                if (index < 0 || $scope.compositeContent.length == 0) return;

                // delete last element in composite
                if ($scope.compositeContent.length == 1) {
                    $scope.compositeContent[0] = {
                        empty: true,
                        id: getId(),
                        type: 'text',
                        text: '', docs: [], pic_ids: [], loc_pos: null, loc_name: '',
                        start: null, end: null, checklist: []
                    };
                    $scope.selected.index = $scope.compositeContent[0].id;
                    onSelect(0);
                    $scope.isFirst = true;
                    setToolbar();
                } else {
                    if (index >= 0 && index < $scope.compositeContent.length)
                        $scope.compositeContent.splice(index, 1);

                    if (index == $scope.compositeContent.length)
                        $scope.selected.index = $scope.compositeContent[$scope.compositeContent.length - 1].id;
                    else
                        $scope.selected.index = $scope.compositeContent[index].id;

                    onSelect();
                }

                setToolbar();
                $scope.onCompositeChange();
            };

            function onContentChange(obj) {
                if (obj && obj.empty && obj.text) {
                    obj.empty = false;
                    $scope.isFirst = false;
                    setToolbar();
                }
                if (!$scope.ngDisabled()) $scope.onCompositeChange();
            };

            function isSelectedSection(index, obj) {
                return $scope.selected.index == obj.id && !obj.empty;// && $scope.compositeContent.length > 1;
            };

            function onDraggEnd() {
                $scope.selected.drag = true;
            };

            function onStart(id) {
                if (id && id != $scope.selected.dragId) $scope.selected.drag = false;
            };

            function onStop(id) {
                setTimeout(function () {
                    $scope.selected.drag = true;
                    $scope.selected.dragId = 0;
                    $scope.$apply();
                },  500);
            };

            function onDownDragg($event, obj) {
                if ($scope.ngDisabled && $scope.ngDisabled()) return;
                $scope.selected.dragId = $scope.selected.id;
                $scope.selected.drag = true;
                $scope.selected.index = obj.id;
            };

            function onClick($event, index, obj) {
                if ($scope.ngDisabled && $scope.ngDisabled()) return;
                $scope.selected.event = 'onClick';
                if ($event && $event.target && $event.target.tagName &&
                    ($event.target.tagName == 'INPUT' || $event.target.tagName == 'TEXTAREA' )) {
                    $scope.selected.index = obj.id;
                    return;
                }

                if ( $scope.selected.index == obj.id && obj.type == 'checklist' && obj.checklist.length > 0) return;
                if ( $scope.selected.index == obj.id && obj.type == 'location' ) return;

                $scope.selected.index = obj.id;
                onSelect();
            };

            function onDropComplete(placeIndex, obj, event, componentId) {
                if (componentId != $scope.selected.id || !obj || !obj.type) {
                    $scope.compositeContent = _.cloneDeep($scope.pipContents);
                    return;
                }

                var index = placeIndex;
                var tmpIndex = _.findIndex($scope.compositeContent, {id: obj.id}); //$scope.selected.index});

                if (!(tmpIndex == 0 && placeIndex == 1)) {
                    if (tmpIndex > index) {
                        if (index > $scope.compositeContent.length - 1) index = $scope.compositeContent.length - 1;
                        // move up
                        for (var i = 0; i < tmpIndex - index; i++) {
                            $scope.compositeContent[tmpIndex - i] = $scope.compositeContent[tmpIndex - i - 1];
                        }
                        $scope.compositeContent[index] = obj;
                    }
                    if (tmpIndex < index) {
                        index -= 1;
                        //move down
                        for (var i = 0; i < index - tmpIndex; i++) {
                            $scope.compositeContent[tmpIndex + i] = $scope.compositeContent[tmpIndex + i + 1];
                        }
                        $scope.compositeContent[index] = obj;
                    }
                    $scope.selected.index = $scope.compositeContent[index].id;
                }

                onSelect();
                $scope.onCompositeChange();
            };

            function onSelect(index) {
                if (!index) index = _.findIndex($scope.compositeContent, {id: $scope.selected.index});
                if (index < 0) return;

                var item = $scope.compositeContent[index];
                if (_.isEmpty(item)) return;

                switch (item.type) {
                    //case 'text':
                    //        setTimeout(function () {
                    //            var nextElement = angular.element('#composite-item-text-' + $scope.selected.id + '-' + index);
                    //            //var nextElement = angular.element('#composite-item-text-' + $scope.selected.id + '-' + $scope.selected.index);
                    //            if (nextElement && !nextElement.is(':focus')) nextElement.focus();
                    //            //$scope.selected.stopKey = false;
                    //        },  50);
                    //    break;
                    case 'pictures':
                            setTimeout(function () {
                                var nextElement = angular.element(
                                    '#composite-item-' + $scope.selected.id + '-' + index + ' button.pip-picture-upload');
                                if (nextElement && !nextElement.is(':focus')) nextElement.focus();
                                //$scope.selected.stopKey = false;
                            },  50);
                        break;
                    case 'documents':
                            setTimeout(function () {
                                var nextElement = angular.element(
                                    '#composite-item-' + $scope.selected.id + '-' + index + ' button.pip-document-upload');
                                if (nextElement && !nextElement.is(':focus')) nextElement.focus();
                                //$scope.selected.stopKey = false;
                            },  50);
                        break;
                    //case 'checklist':
                    //        setTimeout(function () {
                    //            var nextElement = angular.element(
                    //                '#composite-item-' + $scope.selected.id + '-' + index + ' textarea[id^=\'empty-item-\'');
                    //            if (nextElement && !nextElement.is(':focus')) nextElement.focus();
                    //            //$scope.selected.stopKey = false;
                    //        },  50);
                    //    break;
                    case 'location':
                        setTimeout(function () {
                            var nextElement = angular.element(
                                '#composite-item-' + $scope.selected.id + '-' + index + ' .pip-location-empty  button');
                            if (nextElement && !nextElement.is(':focus')) nextElement.focus();
                            //$scope.selected.stopKey = false;
                        },  50);
                        break;
                    case 'time':
                        break;
                }
            };

            // set element responsive width when element places
            //function setWidth100(index) {
            //    var element = angular.element('#composite-item-' + $scope.selected.id + '-' + index);
            //    element.css( "width", 'none');
            //    element.css( "max-width", 'none');
            //};
            //
            //// set draggable element width when your dragg
            //function setWidth(index) {
            //    if ($scope.selected.isWidth) return;
            //    var elementEtalon = angular.element('#pip-composite-last-' + + $scope.selected.id);
            //    var value = elementEtalon.width();
            //    var element = angular.element('#composite-item-' + $scope.selected.id + '-' + index);
            //    if (element) {
            //        element.css("width", value + 'px');
            //        element.css("max-width", value + 'px');
            //    }
            //};

            function setPlaceholder() {
                $scope.compositePlaceholder =
                    ($scope.pipCompositePlaceholder === undefined || $scope.pipCompositePlaceholder ===  null) ?
                            pipTranslate.translate('COMPOSITE_PLACEHOLDER') :
                            pipTranslate.translate($scope.pipCompositePlaceholder);
            };

            function addItem (contentType, value) {
                if (_.indexOf(CONTENT_TYPES, contentType) < 0) return;

                // generate new item
                var newItem = {
                    id: getId(),
                    type: contentType,
                    text: contentType == 'text' ? value : '',
                    docs: contentType == 'documents' && value ? value : [],
                    pic_ids: contentType == 'pictures' && value ? value : [],
                    loc_pos: contentType == 'location' && value ? value.loc_pos : null,
                    loc_name: contentType == 'location' && value ? value.loc_name : '',
                    start: contentType == 'time' && value ? value.start : null,
                    end: contentType == 'time' && value ? value.end : null,
                    checklist: contentType == 'checklist' && value ? value : []
                };

                // calculate current index
                var index = _.findIndex($scope.compositeContent, {id: $scope.selected.index});
                index = index < 0 ? 0 : index;

                // insert new element and select it
                if ($scope.compositeContent.length == 1 && $scope.compositeContent[0].empty) {
                    //newItem.id = $scope.compositeContent[0].id;
                    $scope.compositeContent[0] = newItem;
                } else {
                    $scope.compositeContent.splice(index + 1, 0, newItem);
                    index += 1;
                }

                // insert new element and select it
                $scope.selected.index = newItem.id;
                onSelect();

                // focus to new element
                setTimeout(scrollTo($scope.pipScrollContainer, '#composite-item-' + $scope.selected.id + '-' + index), 1000);

                // set toolbar
                $scope.isFirst = false;
                setToolbar();
                $scope.onCompositeChange();
            };

            function getId() {
                var id = -1;
                _.each($scope.compositeContent, function(item) {
                    if ( id < item.id ) id = item.id;
                });
                return id + 1;
            };

            function scrollTo(parentElement, childElement) {
                if(!parentElement || !childElement) return;
                setTimeout(function () {
                    if (!$(childElement).position()) return;
                    var modDiff= Math.abs($(parentElement).scrollTop() - $(childElement).position().top);
                    if (modDiff < 20) return;
                    var scrollTo = $(parentElement).scrollTop() + ($(childElement).position().top - 20);
                    $(parentElement).animate({
                        scrollTop: scrollTo + 'px'
                    }, 300);
                }, 100);
            };

            function generateList(content) {
                if (!content ||  content.length < 1) {
                    clearList();
                    return;
                } else {
                    $scope.compositeContent = [];
                    _.each(content, function(item){
                        item.id = getId();
                        $scope.compositeContent.push(item);
                    });
                    $scope.isFirst = false;
                }

                setToolbar();
            };

            function setToolbar(){
                if ($scope.compositeContent.length > 2) return;
                $rootScope.$emit('pipCompositeNotEmpty', !$scope.isFirst);
            };

            function clearList() {
                $scope.compositeContent = [];
                $scope.compositeContent.push({
                    empty: true,
                    id: getId(),
                    type: 'text',
                    text: '', docs: [], pic_ids: [], loc_pos: null, loc_name: '',
                    start: null, end: null, checklist: []
                });
                $scope.isFirst = true;
            };

            function now(){
                return +new Date;
            }
        }]
    );

})();
/**
 * @file Composite summary control
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipCompositeSummary", [
        'pipCore', 'pipDocuments', 'pipLocations', 'pipPictures', 'pipComposite.Templates']);

    thisModule.directive('pipCompositeSummary',
        function () {
            return {
                restrict: 'EA',
                scope: {
                    pipContents: '=',
                    pipChecklistSize: '=',
                    pipTextSize: '=',
                    pipPrimaryBlockLimit: '=',
                    pipSecondaryBlockLimit: '=',
                    pipSecondaryBlockTypes: '='
                },
                templateUrl: 'composite_summary/composite_summary.html',
                controller: 'pipCompositeSummaryController'
            }
        }
    );

    thisModule.controller('pipCompositeSummaryController',
        ['$scope', '$element', '$attrs', 'pipUtils', function ($scope, $element, $attrs, pipUtils) {

            $scope.rebind = pipUtils.toBoolean($attrs.pipRebind);
            $scope.disableControl = true;
            $scope.disabledChecklist = true;

            $scope.secondaryBlockTypes = $scope.pipSecondaryBlockTypes !== undefined &&
                Array.isArray($scope.pipSecondaryBlockTypes) ? $scope.pipSecondaryBlockTypes :
                 ['checklist', 'documents', 'location', 'time'];
            $scope.textSize = $scope.pipTextSize !== undefined && $scope.pipTextSize > 0 ? $scope.pipTextSize : 0;
            $scope.secondaryBlockLimit = $scope.pipSecondaryBlockLimit !== undefined && $scope.pipSecondaryBlockLimit > 0 ? $scope.pipSecondaryBlockLimit : -1;
            $scope.checklistSize = $scope.pipChecklistSize !== undefined && $scope.pipChecklistSize > 0 ? $scope.pipChecklistSize : 0;
            $scope.primaryBlockLimit = $scope.pipPrimaryBlockLimit !== undefined ? $scope.pipPrimaryBlockLimit : -1;

            generateList($scope.pipContents);

            // Watch for options changes
            if (pipUtils.toBoolean($attrs.pipRebind)) {
                $scope.$watchCollection('pipContents', function (newValue) {
                    if (!Array.isArray($scope.pipContents)) {
                        throw new Error('Error: Attribute pip-contents must be array!');
                    }
                    generateList($scope.pipContents);
                });
            }

            // Add class
            $element.addClass('pip-composite-summary');

            return;

            // усекаем чеклист до 3
            function limitChecklist(content, val) {
                if (!val) return;
                _.each(content, function(item) {
                    if (item && item.type == 'checklist') {
                        var checklistLength = item.checklist.length;
                        item.checklist =_.take(item.checklist, val);
                        if (checklistLength > val) item.checklist.push({
                            text: '...',
                             checked: false
                        });
                    }
                });
            };

            // отбираем текст и картинки
            function selectSummary(content) {
                var result = [],
                    i = 0;

                _.each(content, function(item) {
                    if ($scope.primaryBlockLimit >= 0 && i >= $scope.primaryBlockLimit) return result;

                    //if (item.type == 'text' || item.type == 'pictures' ) {
                    if ($scope.secondaryBlockTypes.indexOf(item.type) < 0) {
                        result.push(item);
                        i += 1;
                    }
                });

                return result;
            };

            // отбираем остальные блоки если они есть
            function selectSummarySecondary(content, types) {
                var i, limit =  $scope.secondaryBlockLimit < 0 ? content.length : $scope.secondaryBlockLimit;
                var result = [];

                for (i = 0; i < content.length; i++ ) {
                    if (types.indexOf(content[i].type) > -1) {
                        result.push(content[i]);
                        if (result.length >= limit) break;
                    }
                }

                return result;
            };

            function generateList(content) {
                if (!content ||  content.length < 1) {
                    clearList();
                    return;
                } else {
                     var summaryContent = _.cloneDeep(content);
                    var result = selectSummary(summaryContent);
                    if (result.length == 0) {
                        result = selectSummarySecondary(summaryContent, $scope.secondaryBlockTypes);
                    }

                    limitChecklist(result, $scope.checklistSize);

                    var id = 0;
                    _.each(result, function(item){
                        item.id = id;
                        id ++;
                    });
                    $scope.compositeContent = result;
                }
            };

            function clearList() {
                $scope.compositeContent = [];
            };

        }]
    );

})();

/**
 * @file Composite toolbar control
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipCompositeToolbar", ['pipCore', 'pipComposite.Templates']);

    thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'TEXT':'Text',
            'CHECKLIST':'Checklist',
            'LOCATION':'Location',
            'PICTURE':'Picture',
            'TIME':'Time',
            'DOCUMENT':'Document'
        });

        pipTranslateProvider.translations('ru', {
            'TEXT':'Текст',
            'CHECKLIST':'Список',
            'LOCATION':'Локация',
            'PICTURE':'Изображение',
            'TIME':'Время',
            'DOCUMENT':'Document'
        });
    }]);

    thisModule.directive('pipCompositeToolbar',
        function () {
            return {
                restrict: 'EA',
                replace: false,
                scope: {
                    ngDisabled: '&',
                    pipCompositeEmpty: '&',  // set init state of toolbar
                    pipToolbarButton: '=',  // set visibility toolbar button, true by default
                    compositeId: '=pipCompositeId' // set pip-composite-id, for some composite in one scope
                },
                templateUrl: 'composite_toolbar/composite_toolbar.html',
                controller: 'pipCompositeToolbarController'
            }
        }
    );

    thisModule.controller('pipCompositeToolbarController',
        ['$scope', '$element', '$attrs', '$rootScope', 'pipUtils', function ($scope, $element, $attrs, $rootScope, pipUtils) {

            $scope.toolbarButton = {};
            $scope.emptyState = pipUtils.toBoolean($scope.pipCompositeEmpty()) != false;
            $scope.disableControl = pipUtils.toBoolean($scope.ngDisabled()) != false;

            setOption();

            $scope.onAddItem = onAddItem;

            $rootScope.$on('pipCompositeNotEmpty', function(event, value) {
                $scope.emptyState = !value;
            });

            // Add class
            $element.addClass('pip-composite-toolbar');

            return;

            function onAddItem(contentType) {
                $rootScope.$emit('pipAddCompositeItem', {type: contentType, id: $scope.compositeId});
            };

            function setOption() {
                if ($scope.pipToolbarButton !== null && $scope.pipToolbarButton !== undefined) {
                    $scope.toolbarButton.picture = $scope.pipToolbarButton.picture === false ? $scope.pipToolbarButton.picture : true;
                    $scope.toolbarButton.document = $scope.pipToolbarButton.document === false ? $scope.pipToolbarButton.document : true;
                    $scope.toolbarButton.location = $scope.pipToolbarButton.location === false ? $scope.pipToolbarButton.location : true;
                    $scope.toolbarButton.event = $scope.pipToolbarButton.event === false ? $scope.pipToolbarButton.event : true;
                    $scope.toolbarButton.checklist = $scope.pipToolbarButton.checklist === false ? $scope.pipToolbarButton.checklist : true;
                } else {
                    $scope.toolbarButton.picture = true;
                    $scope.toolbarButton.document = true;
                    $scope.toolbarButton.location = true;
                    $scope.toolbarButton.event = true;
                    $scope.toolbarButton.checklist = true;
                }
                $scope.toolbarButton.text = true;
            };

        }]
    );

})();
/**
 * @file Composite view control
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipCompositeView", [
        'pipCore', 'pipDocuments', 'pipLocations', 'pipPictures', 'pipComposite.Templates']);

    thisModule.directive('pipCompositeView',
        function () {
            return {
                restrict: 'EA',
                scope: {
                    ngDisabled: '&',
                    pipDisabledChecklist: '&',
                    pipChanged: '&',
                    pipContents: '='
                },
                templateUrl: 'composite_view/composite_view.html',
                controller: 'pipCompositeViewController'
            }
        }
    );

    thisModule.controller('pipCompositeViewController',
        ['$scope', '$element', '$attrs', 'pipUtils', function ($scope, $element, $attrs, pipUtils) {

            $scope.rebind = pipUtils.toBoolean($attrs.pipRebind);
            $scope.disableControl = pipUtils.toBoolean($scope.ngDisabled()) != false;
            $scope.disabledChecklist = pipUtils.toBoolean($scope.pipDisabledChecklist()) != false;
            $scope.selected = {};
            $scope.selected.isChanged = false;
            generateList($scope.pipContents);

            $scope.onContentChange = onContentChange;
            $scope.isDisabled = isDisabled;

            // Watch for options changes
            if (pipUtils.toBoolean($attrs.pipRebind)) {
                $scope.$watchCollection('pipContents', function (newValue) {
                    if (!Array.isArray($scope.pipContents)) {
                        // throw new Error('Error: Attribute pip-contents must be array!');
                        return;
                    }
                    if (!$scope.selected.isChanged) {
                        generateList($scope.pipContents);
                    } else {
                        $scope.selected.isChanged = false;
                    }
                });
            }

            // Add class
            $element.addClass('pip-composite-view');

            return;

            function isDisabled() {
                return pipUtils.toBoolean($scope.pipDisabledChecklist()) == true ||
                    pipUtils.toBoolean($scope.ngDisabled()) == true;
            };

            function updateContents() {
                $scope.selected.isChanged = true;
                $scope.pipContents = $scope.compositeContent;
            };

            function onContentChange() {
                onCompositeChange();
            };

            function onCompositeChange() {
                updateContents();
                if ($scope.pipChanged)
                    $scope.pipChanged();
            };

            function generateList(content) {
                if (!content ||  content.length < 1) {
                    clearList();
                    return;
                } else {
                    $scope.compositeContent = [];
                    var id = 0;
                    _.each(content, function(item){
                        if (typeof(item) != 'object' || item == null) {
                            throw new Error('Error: content error!');
                        }
                        item.id = id;
                        id ++;
                        $scope.compositeContent.push(item);
                    });
                }
            };

            function clearList() {
                $scope.compositeContent = [];
            };

        }]
    );

})();

/**
 * @file Content switch control
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Remove after composite content control is ready
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipContentSwitch", ['pipComposite.Templates']);

    thisModule.directive('pipContentSwitch', 
        ['$parse', function($parse) {
            return {
                restrict: 'EA',
                scope: false,
                templateUrl: 'content_switch/content_switch.html',
                link: function($scope, $element, $attrs) {
    
                    var parentElementNameGetter = $parse($attrs.pipParentElementName);
                    var parentElement = parentElementNameGetter($scope);

                    $scope.onButtonClick = onButtonClick;

                    // Initialization
                    setOption();
                    $element.addClass('pip-content-switch');

                    return ;

                    function scrollTo(childElement) {
                        setTimeout(function () {
                            var modDiff= Math.abs($(parentElement).scrollTop() - $(childElement).position().top);
                            if (modDiff < 20) return;
                            var scrollTo = $(parentElement).scrollTop() + ($(childElement).position().top - 20);
                            $(parentElement).animate({
                                scrollTop: scrollTo + 'px'
                            }, 300);
                        }, 100);
                    };
    
                    function setOption() {
                        if ($scope.contentSwitchOption !== null && $scope.contentSwitchOption !== undefined) {
                            $scope.showIconPicture = $scope.contentSwitchOption.picture ? $scope.contentSwitchOption.picture : $scope.showIconPicture;
                            $scope.showIconDocument = $scope.contentSwitchOption.document ? $scope.contentSwitchOption.document : $scope.showIconDocument;
                            $scope.showIconLocation = $scope.contentSwitchOption.location ? $scope.contentSwitchOption.location : $scope.showIconLocation;
                            $scope.showIconEvent = $scope.contentSwitchOption.event ? $scope.contentSwitchOption.event : $scope.showIconEvent;
                        } else {
                            $scope.showIconPicture = true;
                            $scope.showIconDocument = true;
                            $scope.showIconLocation = true;
                            $scope.showIconEvent = true;
                        }
                    };
    
                    function onButtonClick(type) {
                        if (!parentElement) return;
    
                        switch(type){
                            case 'event':
                                // On Event click action
                                if ($scope.showEvent)
                                    scrollTo('.event-edit');
                                break;
                            case 'documents':
                                // On Documents click action
                                if ($scope.showDocuments)
                                    scrollTo('.pip-document-list-edit');
                                break;
                            case 'pictures':
                                // On Pictures click action
                                if ($scope.showPictures)
                                    scrollTo('.pip-picture-list-edit');
                                break;
                            case 'location':
                                // On Location click action
                                if ($scope.showLocation)
                                    scrollTo('.pip-location-edit');
                                break;
                        };
                    };

                }
            };
        }]
    );

})();

/**
 * @file Touch start control
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipMobileMousedown", []);

    thisModule.directive('pipMobileMousedown',
        function () {
            return function (scope, elem, attrs) {
                elem.bind("touchstart mousedown", function (e) {
            //        e.preventDefault();
            //        e.stopPropagation();
                    scope.$apply(attrs["pipMobileMousedown"]);
            //        e.preventDefault();
                });
            }
        }
    );

})();

/**
 * @file Touch start control
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipMobileMouseup", []);

    thisModule.directive('pipMobileMouseup',
        function () {
            return function (scope, elem, attrs) {
                elem.bind("touchend mouseup", function (e) {
                //    e.preventDefault();
         //           e.stopPropagation();
                    scope.$apply(attrs["pipMobileMouseup"]);
                });
            }
        }
    );

})();

/**
 * @file Keyboard navigation with scrolling over non-focusable controls
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipCompositeFocused", []);

    thisModule.directive('pipCompositeFocused', function () {
        return {
            restrict: 'A',
            scope: false,
            controller: 'pipCompositeFocusedController'
        };
    });

    thisModule.controller('pipCompositeFocusedController',
        ['$scope', '$element', '$rootScope', function ($scope, $element, $rootScope) {
            $element.bind("touchstart mousedown", function (e) {
                $rootScope.$broadcast('focusedComposite');
            });
        }]
    );

})();




/**
 * @file Entry pages (signin, signup) logic
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry', 
        [
            'ui.router', 'ngMessages', 
            
            'pipCore', 'pipRest', 'pipBasicControls', 'pipLocations', 'pipPictures', 'pipRest.State',
            'pipEntry.Strings', 'pipEntry.Common', 'pipEntry.Signin', 'pipEntry.Signup', 'pipEntry.PostSignup', 
            'pipEntry.RecoverPassword', 'pipEntry.ResetPassword', 'pipEntry.VerifyEmail', 'pipEntry.Templates'
        ]);

    thisModule.config(
        ['$stateProvider', '$locationProvider', '$httpProvider', 'pipAuthStateProvider', function ($stateProvider, $locationProvider, $httpProvider, pipAuthStateProvider) {

            // Switch to HTML5 routing mode
            //$locationProvider.html5Mode(true);


            // Configure module routes for all users
            $stateProvider
                .state('signin', {
                    url: '/signin?email&server_url&redirect_to',
                    auth: false,
                    controller: 'pipSigninController',
                    templateUrl: 'signin/signin.html'
                })
                .state('recover_password', {
                    url: '/recover_password?server_url&email',
                    auth: false,
                    controller: 'pipRecoverPasswordController',
                    templateUrl: 'recover_password/recover_password.html'
                })
                .state('reset_password', {
                    url: '/reset_password?server_url&email&code',
                    auth: false,
                    controller: 'pipResetPasswordController',
                    templateUrl: 'reset_password/reset_password.html'
                })
                .state('signout', { 
                    url: '/signout',
                    auth: false
                })
                .state('signup', {
                    url: '/signup?name&email&server_url',
                    auth: false,
                    controller: 'pipSignupController',
                    templateUrl: 'signup/signup.html'
                })
                .state('post_signup', {
                    url: '/post_signup?party_id',
                    auth: false,
                    controller: 'pipPostSignupController',
                    templateUrl: 'post_signup/post_signup.html',
                    resolve: {
                        $party: /* @ngInject */ ['$rootScope', '$stateParams', 'pipRest', 'pipSession', function ($rootScope, $stateParams, pipRest, pipSession) {
                            var userId = pipSession.userId();
                            var partyId = $stateParams.party_id || userId;

                            if (partyId != userId)
                                throw('ERROR_NOT_ALLOWED');
                            return pipRest.parties().get({ id: partyId }).$promise;
                        }]
                    }
                })
                .state('verify_email', {
                    url: '/verify_email?server_url&email&code',
                    auth: false,
                    controller: 'pipVerifyEmailController',
                    templateUrl: 'verify_email/verify_email.html'
                })
                .state('verify_email_success', {
                    url: '/verify_email_success',
                    auth: false,
                    controller: 'pipVerifyEmailSuccessController',
                    templateUrl: 'verify_email/verify_email_success.html'
                });

            // Set default paths and states
            pipAuthStateProvider.signinState('signin');
            pipAuthStateProvider.signoutState('signout');
        }]
    );
    
})();
(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('post_signup/post_signup.html',
    '<!--\n' +
    '@file Post-signup page\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<div class="pip-card-container pip-outer-scroll pip-entry">\n' +
    '    <pip-card width="400">\n' +
    '        <pip-post-signup-panel\n' +
    '                pip-data="data"\n' +
    '                pip-created="$panel = $control"\n' +
    '                pip-party="$party">\n' +
    '\n' +
    '        </pip-post-signup-panel>\n' +
    '        <div class="pip-footer">\n' +
    '            <md-button ng-hide="transaction.busy()" class="md-accent"\n' +
    '                       ng-click="onPostSignupSubmit()" aria-label="CONTINUE">\n' +
    '                {{::\'CONTINUE\' | translate}}\n' +
    '            </md-button>\n' +
    '\n' +
    '            <md-button ng-show="transaction.busy()" class="md-warn"\n' +
    '                       ng-click="transaction.abort()" aria-label="ABORT">\n' +
    '                {{::\'CANCEL\' | translate}}\n' +
    '            </md-button>\n' +
    '        </div>\n' +
    '    </pip-card>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('post_signup/post_signup_dialog.html',
    '<!--\n' +
    '@file Post signup dialog\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-entry lp0 rp0">\n' +
    '    <md-dialog-content>\n' +
    '        <pip-post-signup-panel\n' +
    '                pip-data="data"\n' +
    '                pip-created="$panel = $control"\n' +
    '                pip-party="$party">\n' +
    '\n' +
    '        </pip-post-signup-panel>\n' +
    '    </md-dialog-content>\n' +
    '    <md-dialog-actions class="layout-row layout-align-end-center">\n' +
    '        <md-button ng-hide="transaction.busy()" class="md-accent"\n' +
    '                   ng-click="onPostSignupSubmit()" aria-label="CONTINUE">\n' +
    '            {{::\'CONTINUE\' | translate}}\n' +
    '        </md-button>\n' +
    '\n' +
    '        <md-button ng-show="transaction.busy()" class="md-warn"\n' +
    '                   ng-click="transaction.abort()" aria-label="ABORT">\n' +
    '            {{::\'CANCEL\' | translate}}\n' +
    '        </md-button>\n' +
    '    </md-dialog-actions>\n' +
    '</md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('post_signup/post_signup_panel.html',
    '<div class="pip-body">\n' +
    '    <div class="pip-content">\n' +
    '        <md-progress-linear ng-show="transaction.busy()" md-mode="indeterminate" class="pip-progress-top">\n' +
    '        </md-progress-linear>\n' +
    '\n' +
    '        <h2 class="text-overflow">{{\'POST_SIGNUP_TITLE\' | translate}}</h2>\n' +
    '\n' +
    '        <p class="bm0 line-height-string">\n' +
    '            {{\'POST_SIGNUP_TEXT_1\' | translate}}\n' +
    '        </p>\n' +
    '\n' +
    '        <p class="line-height-string m0">\n' +
    '            {{\'POST_SIGNUP_TEXT_2\' | translate}}\n' +
    '        </p>\n' +
    '\n' +
    '        <form name="form" novalidate>\n' +
    '            <div ng-messages="form.$serverError" class="text-error bm8"  md-auto-hide="false">\n' +
    '                <div ng-message="ERROR_1000">{{::\'ERROR_1000\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1110">{{::\'ERROR_1110\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1111">{{::\'ERROR_1111\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1112">{{::\'ERROR_1112\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1002">{{::\'ERROR_1002\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_-1">{{::\'ERROR_SERVER\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_UNKNOWN">\n' +
    '                    {{ form.$serverError.ERROR_UNKNOWN | translate }}\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '            <div class="pip-ref-item">\n' +
    '                <pip-avatar-edit ng-disabled="transaction.busy()"\n' +
    '                                 pip-reset="false" pip-party-id="data.id"\n' +
    '                                 pip-created="onPictureCreated($event)"\n' +
    '                                 pip-changed="onPictureChanged($control, $event)"\n' +
    '                                 class="rm16 flex-fixed">\n' +
    '                </pip-avatar-edit>\n' +
    '\n' +
    '                <div class="pip-content">\n' +
    '                    <p class="pip-title">{{data.name}}</p>\n' +
    '                    <p class="pip-subtitle">{{data.email}}</p>\n' +
    '                </div>\n' +
    '\n' +
    '            </div>\n' +
    '\n' +
    '            <md-input-container class="pip-no-hint bp4">\n' +
    '                <label>{{\'HINT_ABOUT\' | translate}}</label>\n' +
    '                        <textarea ng-model="data.about"  ng-initial ng-disabled="transaction.busy()" pip-clear-errors>\n' +
    '                        </textarea>\n' +
    '            </md-input-container>\n' +
    '\n' +
    '            <div class="tm2">\n' +
    '                <p class="text-caption bm0">{{\'GENDER\' | translate}}</p>\n' +
    '                <md-select class="w-stretch tm0 tp0 bp8" ng-disabled="transaction.busy()"\n' +
    '                           ng-model="data.gender" label="{{\'GENDER\' | translate}}"\n' +
    '                           ng-change="onStatusChange(data)" pip-clear-errors>\n' +
    '                    <md-option ng-value="opt.id" ng-repeat="opt in genders track by opt.id">\n' +
    '                        {{ opt.name }}\n' +
    '                    </md-option>\n' +
    '                </md-select>\n' +
    '            </div>\n' +
    '\n' +
    '            <div class="tm2">\n' +
    '                <p class="text-caption bm0">{{::\'BIRTHDAY\' | translate}}</p>\n' +
    '                <pip-date ng-disabled="transaction.busy()"\n' +
    '                          ng-model="data.birthday"\n' +
    '                          pip-time-mode="past"\n' +
    '                          pip-clear-errors time-mode="past">\n' +
    '                </pip-date>\n' +
    '            </div>\n' +
    '           <md-input-container>\n' +
    '               <label>{{::\'LANGUAGE\' | translate}}</label>\n' +
    '               <md-select class="w-stretch tm0 tp0  bp16" ng-disabled="transaction.busy()"\n' +
    '                          ng-model="data.language"\n' +
    '                          ng-change="onStatusChange(data)" pip-clear-errors>\n' +
    '                   <md-option ng-value="opt.id" ng-repeat="opt in languages track by opt.id">\n' +
    '                       {{ opt.name }}\n' +
    '                   </md-option>\n' +
    '               </md-select>\n' +
    '           </md-input-container>\n' +
    '\n' +
    '\n' +
    '        </form>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('recover_password/recover_password.html',
    '<!--\n' +
    '@file Password recovery page\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<div class="pip-card-container pip-outer-scroll pip-entry">\n' +
    '    <pip-card width="400">\n' +
    '        <pip-recover-password-panel\n' +
    '                pip-data="data"\n' +
    '                pip-created="$panel = $control">\n' +
    '\n' +
    '        </pip-recover-password-panel>\n' +
    '        <div class="pip-footer">\n' +
    '            <md-button ng-hide="transaction.busy()" ng-click="goBack()" class="rm8" aria-label="CANCEL">\n' +
    '                {{::\'CANCEL\' | translate}}\n' +
    '            </md-button>\n' +
    '\n' +
    '            <md-button ng-hide="transaction.busy()" class="md-accent" ng-click="onRecover()"\n' +
    '                       aria-label="RECOVER_PWD_RECOVER"\n' +
    '                       ng-disabled="(form.$pristine && !data.email) || data.serverUrl.length == 0 || data.email.length == 0">\n' +
    '                {{::\'RECOVER_PWD_RECOVER\' | translate}}\n' +
    '            </md-button>\n' +
    '\n' +
    '            <md-button ng-show="transaction.busy()" class="md-warn" ng-click="transaction.abort()" aria-label="ABORT">\n' +
    '                {{::\'CANCEL\' | translate}}\n' +
    '            </md-button>\n' +
    '        </div>\n' +
    '    </pip-card>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('recover_password/recover_password_dialog.html',
    '<!--\n' +
    '@file Recover password dialog\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-entry lp0 rp0">\n' +
    '    <md-dialog-content>\n' +
    '        <pip-recover-password-panel\n' +
    '                pip-data="data"\n' +
    '                pip-created="$panel = $control"\n' +
    '                pip-goto-reset="pipGotoReset">\n' +
    '\n' +
    '        </pip-recover-password-panel>\n' +
    '    </md-dialog-content>\n' +
    '\n' +
    '    <md-dialog-actions class="layout-row layout-align-end-center">\n' +
    '        <md-button ng-hide="transaction.busy()" ng-click="goBack()" class="rm8" aria-label="CANCEL">\n' +
    '            {{::\'CANCEL\' | translate}}\n' +
    '        </md-button>\n' +
    '\n' +
    '        <md-button ng-hide="transaction.busy()" class="md-accent" ng-click="onRecover()"\n' +
    '                   aria-label="RECOVER_PWD_RECOVER"\n' +
    '                   ng-disabled="(form.$pristine && !data.email) || data.email== undefined ||\n' +
    '                           || data.serverUrl.length == 0 || data.email.length == 0">\n' +
    '            {{::\'RECOVER_PWD_RECOVER\' | translate}}\n' +
    '        </md-button>\n' +
    '\n' +
    '        <md-button ng-show="transaction.busy()" class="md-warn" ng-click="transaction.abort()" aria-label="ABORT">\n' +
    '            {{::\'CANCEL\' | translate}}\n' +
    '        </md-button>\n' +
    '    </md-dialog-actions>\n' +
    '</md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('recover_password/recover_password_panel.html',
    '<div class="pip-body">\n' +
    '    <div class="pip-content">\n' +
    '        <md-progress-linear ng-show="transaction.busy()" md-mode="indeterminate" class="pip-progress-top">\n' +
    '        </md-progress-linear>\n' +
    '\n' +
    '        <h2>{{\'RECOVER_PWD_TITLE\' | translate}}</h2>\n' +
    '\n' +
    '        <p class="text-primary tm0 bm16">{{\'RECOVER_PWD_TEXT_1\' | translate}} </p>\n' +
    '\n' +
    '        <p class="text-primary tm0 bm16">{{\'RECOVER_PWD_TEXT_2\' | translate}}</p>\n' +
    '\n' +
    '        <form name="form" novalidate>\n' +
    '            <div ng-messages="form.$serverError" class="text-error bm8"  md-auto-hide="false">\n' +
    '                <div ng-message="ERROR_1000">{{::\'ERROR_1000\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1110">{{::\'ERROR_1110\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1111">{{::\'ERROR_1111\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1112">{{::\'ERROR_1112\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_-1">{{::\'ERROR_SERVER\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_UNKNOWN">\n' +
    '                    {{ form.$serverError.ERROR_UNKNOWN | translate }}\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '            <a ng-hide="showServerUrl || fixedServerUrl" ng-click="showServerUrl = true" href="">\n' +
    '                {{\'ENTRY_CHANGE_SERVER\' | translate}}\n' +
    '            </a>\n' +
    '\n' +
    '            <div ng-show="showServerUrl">\n' +
    '                <md-autocomplete\n' +
    '                        ng-initial autofocus tabindex="1"\n' +
    '                        class="pip-combobox w-stretch bm8"\n' +
    '                        name="server"\n' +
    '                        ng-enabled="!transaction.busy()"\n' +
    '                        placeholder="{{::\'ENTRY_SERVER_URL\' | translate}}"\n' +
    '                        md-no-cache="true"\n' +
    '                        md-selected-item="data.serverUrl"\n' +
    '                        md-search-text="selected.searchURLs"\n' +
    '                        md-items="item in getMatches()"\n' +
    '                        md-item-text="item"\n' +
    '                        md-selected-item-change="onServerUrlChanged()"\n' +
    '                        md-delay="200"\n' +
    '                        ng-model="data.serverUrl"\n' +
    '                        pip-clear-errors>\n' +
    '                    <span md-highlight-text="selected.searchURLs">{{item}}</span>\n' +
    '                </md-autocomplete>\n' +
    '            </div>\n' +
    '            <md-input-container class="pip-no-hint" style="padding-bottom: 4px!important;">\n' +
    '                <label>{{::\'EMAIL\' | translate}}</label>\n' +
    '                <input name="email" type="email"\n' +
    '                       ng-model="data.email"\n' +
    '                       pip-email-unique="data.email"\n' +
    '                       required step="any" pip-clear-errors\n' +
    '                       ng-disabled="transaction.busy()" tabindex="2"/>\n' +
    '\n' +
    '                <div class="hint" ng-if="touchedErrorsWithHint(form, form.email).hint">\n' +
    '                    {{::\'HINT_EMAIL\' | translate}}\n' +
    '                </div>\n' +
    '                <div ng-messages="touchedErrorsWithHint(form, form.email)"\n' +
    '                     class="md-input-error"  md-auto-hide="false">\n' +
    '                    <div ng-message="required">{{::\'ERROR_EMAIL_INVALID\' | translate }}</div>\n' +
    '                    <div ng-message="email">{{::\'ERROR_EMAIL_INVALID\' | translate }}</div>\n' +
    '                    <div ng-message="emailUnique">{{::\'ERROR_1104\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1100">{{::\'ERROR_1100\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1106">{{::\'ERROR_1106\' | translate}}</div>\n' +
    '                </div>\n' +
    '            </md-input-container>\n' +
    '        </form>\n' +
    '\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('reset_password/reset_password.html',
    '<!--\n' +
    '@file Password reset page\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<div class="pip-card-container pip-outer-scroll pip-entry">\n' +
    '    <pip-card width="400">\n' +
    '\n' +
    '        <pip-reset-password-panel\n' +
    '                pip-data="data"\n' +
    '                pip-created="$panel = $control">\n' +
    '\n' +
    '        </pip-reset-password-panel>\n' +
    '        <div class="pip-footer">\n' +
    '            <md-button ng-hide="transaction.busy()" ng-click="goBack()" class="rm8" aria-label="CANCEL">\n' +
    '                {{::\'CANCEL\' | translate}}\n' +
    '            </md-button>\n' +
    '            <md-button ng-hide="transaction.busy()" ng-click="onReset()" aria-label="ENTRY_SET_PASSWORD"\n' +
    '                       ng-disabled="(form.$pristine && !data.email) || data.serverUrl.length == 0 ||\n' +
    '                       data.email.length == 0 || data.code.length == 0 || data.password.length < 6"\n' +
    '                       class="md-accent" type="submit">\n' +
    '                {{::\'ENTRY_SET_PASSWORD\' | translate}}\n' +
    '            </md-button>\n' +
    '            <md-button class="md-warn" ng-show="transaction.busy()" ng-click="transaction.abort()" aria-label="ABORT">\n' +
    '                {{::\'CANCEL\' | translate}}\n' +
    '            </md-button>\n' +
    '        </div>\n' +
    '    </pip-card>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('reset_password/reset_password_dialog.html',
    '<!--\n' +
    '@file Reset password\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-entry  lp0 rp0">\n' +
    '    <md-dialog-content>\n' +
    '        <pip-reset-password-panel\n' +
    '                pip-data="data"\n' +
    '                pip-created="$panel = $control">\n' +
    '\n' +
    '        </pip-reset-password-panel>\n' +
    '    </md-dialog-content>\n' +
    '\n' +
    '    <md-dialog-actions class="layout-row layout-align-end-center">\n' +
    '        <md-button ng-hide="transaction.busy()" ng-click="goBack()" class="rm8" aria-label="CANCEL">\n' +
    '            {{::\'CANCEL\' | translate}}\n' +
    '        </md-button>\n' +
    '        <md-button ng-hide="transaction.busy()" ng-click="onReset()" aria-label="ENTRY_SET_PASSWORD"\n' +
    '                   ng-disabled="(form.$pristine && !data.email) || data.serverUrl.length == 0 ||\n' +
    '                       data.email.length == 0 || data.code.length == 0 || data.password.length < 6"\n' +
    '                   class="md-accent" type="submit">\n' +
    '            {{::\'ENTRY_SET_PASSWORD\' | translate}}\n' +
    '        </md-button>\n' +
    '        <md-button class="md-warn" ng-show="transaction.busy()" ng-click="transaction.abort()" aria-label="ABORT">\n' +
    '            {{::\'CANCEL\' | translate}}\n' +
    '        </md-button>\n' +
    '    </md-dialog-actions>\n' +
    '</md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('reset_password/reset_password_panel.html',
    '<div class="pip-body">\n' +
    '    <div class="pip-content">\n' +
    '        <md-progress-linear ng-show="transaction.busy()  && showServerError" md-mode="indeterminate"\n' +
    '                            class="pip-progress-top">\n' +
    '        </md-progress-linear>\n' +
    '\n' +
    '        <h2>{{::\'RESET_PWD_PASSWORD\' | translate}}</h2>\n' +
    '\n' +
    '        <p class="title-padding bm16">\n' +
    '            {{::\'RESET_PWD_TEXT\' | translate}}\n' +
    '        </p>\n' +
    '\n' +
    '        <form name="form" novalidate>\n' +
    '            <div ng-messages="form.$serverError" class="text-error bm8"  md-auto-hide="false">\n' +
    '                <div ng-message="ERROR_1000">{{::\'ERROR_1000\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1110">{{::\'ERROR_1110\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1111">{{::\'ERROR_1111\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1112">{{::\'ERROR_1112\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_-1">{{::\'ERROR_SERVER\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_UNKNOWN">\n' +
    '                    {{ form.$serverError.ERROR_UNKNOWN | translate }}\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '            <a ng-hide="showServerUrl || fixedServerUrl" ng-click="showServerUrl = true" href="">\n' +
    '                {{::\'ENTRY_CHANGE_SERVER\' | translate}}\n' +
    '            </a>\n' +
    '\n' +
    '            <div ng-show="showServerUrl">\n' +
    '                <md-autocomplete\n' +
    '                        ng-initial autofocus tabindex="1"\n' +
    '                        class="pip-combobox w-stretch bm8"\n' +
    '                        name="server"\n' +
    '                        ng-enabled="!transaction.busy()"\n' +
    '                        placeholder="{{::\'ENTRY_SERVER_URL\' | translate}}"\n' +
    '                        md-no-cache="true"\n' +
    '                        md-selected-item="data.serverUrl"\n' +
    '                        md-search-text="selected.searchURLs"\n' +
    '                        md-items="item in getMatches()"\n' +
    '                        md-item-text="item"\n' +
    '                        md-selected-item-change="onServerUrlChanged()"\n' +
    '                        md-delay="200"\n' +
    '                        ng-model="data.serverUrl"\n' +
    '                        pip-clear-errors>\n' +
    '                    <span md-highlight-text="selected.searchURLs">{{item}}</span>\n' +
    '                </md-autocomplete>\n' +
    '            </div>\n' +
    '\n' +
    '            <md-input-container class="pip-no-hint" style="padding-bottom: 4px!important;">\n' +
    '                <label>{{::\'EMAIL\' | translate}}</label>\n' +
    '                <input name="email" type="email" ng-model="data.email" required step="any" pip-clear-errors\n' +
    '                       ng-disabled="transaction.busy()" tabindex="2" pip-email-unique="data.email"/>\n' +
    '\n' +
    '                <div class="hint" ng-if="touchedErrorsWithHint(form, form.email).hint">\n' +
    '                    {{::\'HINT_EMAIL\' | translate}}\n' +
    '                </div>\n' +
    '                <div ng-messages="touchedErrorsWithHint(form, form.email)" class="md-input-error"  md-auto-hide="false">\n' +
    '\n' +
    '                    <div ng-message="required">{{::\'ERROR_EMAIL_INVALID\' | translate }}</div>\n' +
    '                    <div ng-message="email">{{::\'ERROR_EMAIL_INVALID\' | translate }}</div>\n' +
    '                    <div ng-message="emailUnique">{{::\'ERROR_1104\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1100">{{::\'ERROR_1100\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1106">{{::\'ERROR_1106\' | translate}}</div>\n' +
    '                </div>\n' +
    '            </md-input-container>\n' +
    '\n' +
    '            <md-input-container class="pip-no-hint">\n' +
    '                <label>{{::\'ENTRY_RESET_CODE\' | translate}}</label>\n' +
    '                <input name="code" ng-disabled="transaction.busy()"\n' +
    '                       ng-model="data.code" required tabindex="3" pip-clear-errors/>\n' +
    '\n' +
    '                <div class="hint" ng-if="touchedErrorsWithHint(form, form.code).hint">\n' +
    '                    {{::\'ENTRY_RESET_CODE\' | translate}}\n' +
    '                </div>\n' +
    '                <div ng-messages="touchedErrorsWithHint(form, form.code)" class="md-input-error"  md-auto-hide="false">\n' +
    '                    <div ng-message="required">{{::\'ERROR_CODE_INVALID\' | translate }}</div>\n' +
    '                    <div ng-message="ERROR_1108">{{::\'ERROR_1108\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1109">{{::\'ERROR_1109\' | translate}}</div>\n' +
    '                </div>\n' +
    '            </md-input-container>\n' +
    '\n' +
    '            <md-input-container class="pip-no-hint" style="padding-bottom: 4px!important;">\n' +
    '                <label>{{::\'PASSWORD\' | translate}}</label>\n' +
    '                <input name="password" ng-disabled="transaction.busy()" pip-clear-errors\n' +
    '                       type="password" tabindex="4" ng-model="data.password"\n' +
    '                       required minlength="6"/>\n' +
    '                <div class="hint" ng-if="touchedErrorsWithHint(form, form.password).hint">\n' +
    '                    {{::\'HINT_PASSWORD\' | translate}}\n' +
    '                </div>\n' +
    '                <div ng-messages="touchedErrorsWithHint(form, form.password)"\n' +
    '                     class="md-input-error"  md-auto-hide="false">\n' +
    '                    <div ng-message="required">{{::\'MINLENGTH_PASSWORD\' | translate}}</div>\n' +
    '                    <div ng-message="minlength">{{::\'MINLENGTH_PASSWORD\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1102">{{::\'ERROR_1102\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1103">{{::\'ERROR_1103\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1105">{{::\'ERROR_1105\' | translate}}</div>\n' +
    '                </div>\n' +
    '            </md-input-container>\n' +
    '\n' +
    '        </form>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('signin/signin.html',
    '<!--\n' +
    '@file Signin page\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<div class="pip-card-container pip-outer-scroll pip-entry">\n' +
    '    <pip-card width="400">\n' +
    '        <pip-signin-panel pipfixedServerUrl="fixedServerUrl"></pip-signin-panel>\n' +
    '    </pip-card>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('signin/signin_dialog.html',
    '<!--\n' +
    '@file Signin dialog\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-entry">\n' +
    '    <md-dialog-content>\n' +
    '        <pip-signin-panel pip-goto-signup-dialog="pipGotoSignupDialog"\n' +
    '                          pip-goto-recover-password-dialog="pipGotoRecoverPasswordDialog">\n' +
    '        </pip-signin-panel>\n' +
    '    </md-dialog-content>\n' +
    '</md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('signin/signin_panel.html',
    '<div class="pip-body">\n' +
    '    <div class="pip-content">\n' +
    '        <md-progress-linear ng-show="transaction.busy()" md-mode="indeterminate" class="pip-progress-top">\n' +
    '        </md-progress-linear>\n' +
    '\n' +
    '        <h2 pip-translate="SIGNIN_TITLE"></h2>\n' +
    '\n' +
    '        <form name="form" novalidate>\n' +
    '            <div ng-messages="form.$serverError" class="text-error bm8 color-error"  md-auto-hide="false">\n' +
    '                <div ng-message="ERROR_1000">{{::\'ERROR_1000\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1110">{{::\'ERROR_1110\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1111">{{::\'ERROR_1111\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1112">{{::\'ERROR_1112\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_-1">{{::\'ERROR_SERVER\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_UNKNOWN">\n' +
    '                    {{ form.$serverError.ERROR_UNKNOWN | translate }}\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '            <a ng-hide="showServerUrl || fixedServerUrl"\n' +
    '               ng-click="showServerUrl = true" href=""\n' +
    '               id="link-server-url"\n' +
    '               pip-test="link-server-url">\n' +
    '                {{::\'ENTRY_CHANGE_SERVER\' | translate}}\n' +
    '            </a>\n' +
    '\n' +
    '            <div ng-show="showServerUrl">\n' +
    '                <md-autocomplete\n' +
    '                        ng-initial autofocus tabindex="1"\n' +
    '                        class="pip-combobox w-stretch bm8"\n' +
    '                        name="server"\n' +
    '                        placeholder="{{::\'ENTRY_SERVER_URL\' | translate}}"\n' +
    '                        md-no-cache="true"\n' +
    '                        md-selected-item="data.serverUrl"\n' +
    '                        md-search-text="selected.searchURLs"\n' +
    '                        md-items="item in getMatches()"\n' +
    '                        md-item-text="item"\n' +
    '                        md-selected-item-change="onServerUrlChanged()"\n' +
    '                        md-delay="200"\n' +
    '                        ng-model="data.serverUrl"\n' +
    '                        ng-disabled="transaction.busy()"\n' +
    '                        pip-clear-errors\n' +
    '                        pip-test="autocomplete-server">\n' +
    '                    <span md-highlight-text="selected.searchURLs">{{item}}</span>\n' +
    '                </md-autocomplete>\n' +
    '            </div>\n' +
    '\n' +
    '            <md-input-container class="display  bp4">\n' +
    '                <label>{{::\'EMAIL\' | translate}}</label>\n' +
    '                <input name="email" type="email" ng-model="data.email" required step="any"\n' +
    '                       ng-keypress="onEnter($event)"\n' +
    '                       pip-clear-errors\n' +
    '                       ng-disabled="transaction.busy()" tabindex="2"\n' +
    '                       pip-test="input-email"/>\n' +
    '\n' +
    '                <div class="hint" ng-if="touchedErrorsWithHint(form, form.email).hint">\n' +
    '                    {{::\'HINT_EMAIL\' | translate}}\n' +
    '                </div>\n' +
    '                <div ng-messages="touchedErrorsWithHint(form, form.email)" md-auto-hide="false">\n' +
    '                    <div ng-message="required">{{::\'ERROR_EMAIL_INVALID\' | translate }}</div>\n' +
    '                    <div ng-message="email">{{::\'ERROR_EMAIL_INVALID\' | translate }}</div>\n' +
    '                    <div ng-message="ERROR_1100">{{::\'ERROR_1100\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1106">{{::\'ERROR_1106\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1114">{{::\'ERROR_1114\' | translate}}</div>\n' +
    '                </div>\n' +
    '            </md-input-container>\n' +
    '            <md-input-container class="display bp4">\n' +
    '                <label>{{::\'PASSWORD\' | translate}}</label>\n' +
    '                <input name="password" ng-disabled="transaction.busy()" pip-clear-errors\n' +
    '                       type="password" tabindex="3" ng-model="data.password"\n' +
    '                       ng-keypress="onEnter($event)"\n' +
    '                       required minlength="6"\n' +
    '                       pip-test="input-password"/>\n' +
    '\n' +
    '                <div class="hint" ng-if="touchedErrorsWithHint(form, form.password).hint">\n' +
    '                    {{::\'HINT_PASSWORD\' | translate}}\n' +
    '                </div>\n' +
    '                <div ng-messages="touchedErrorsWithHint(form, form.password)"  md-auto-hide="false">\n' +
    '                    <div ng-message="required">{{::\'HINT_PASSWORD\' | translate}}</div>\n' +
    '                    <div ng-message="minlength">{{::\'HINT_PASSWORD\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1102">{{::\'ERROR_1102\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1107">{{::\'ERROR_1107\' | translate}}</div>\n' +
    '                </div>\n' +
    '            </md-input-container>\n' +
    '            <a href="" class="display bm16"\n' +
    '               ng-click="gotoRecoverPassword()"\n' +
    '               tabindex="4">\n' +
    '                {{::\'SIGNIN_FORGOT_PASSWORD\' | translate}}</a>\n' +
    '\n' +
    '            <md-checkbox ng-disabled="transaction.busy()" md-no-ink class="lm0"\n' +
    '                         aria-label="{{\'SIGNIN_REMEMBER\' | translate}}" tabindex="5"\n' +
    '                         ng-model="data.remember"\n' +
    '                         pip-test-checkbox="remember">\n' +
    '                <label class="label-check">{{::\'SIGNIN_REMEMBER\' | translate}}</label>\n' +
    '            </md-checkbox>\n' +
    '\n' +
    '            <div style="height: 36px; overflow: hidden;">\n' +
    '                <md-button ng-if="!transaction.busy()" ng-click="onSignin()" aria-label="SIGNIN"\n' +
    '                           class="md-raised md-accent w-stretch m0" tabindex="6"\n' +
    '                           ng-disabled="(data.email == undefined) || data.email.length == 0 || data.serverUrl == \'\' ||\n' +
    '                                   data.serverUrl == undefined || data.serverUrl.length == 0 || (data.password == undefined)"\n' +
    '                           pip-test="button-signin">\n' +
    '                    {{::\'SIGNIN_TITLE\' | translate}}\n' +
    '                </md-button>\n' +
    '                <md-button ng-if="transaction.busy()" ng-click="transaction.abort()" class="md-raised md-warn m0 w-stretch"\n' +
    '                           tabindex="5" aria-label="ABORT"\n' +
    '                           pip-test="button-cancel">\n' +
    '                    {{::\'CANCEL\' | translate}}\n' +
    '                </md-button>\n' +
    '            </div>\n' +
    '            <div class="tm24 layout-row" ng-if="!adminOnly && $mdMedia(\'gt-xs\')">\n' +
    '                <p class="m0 text-small"> <!--  <p class="a-question-text">  -->\n' +
    '                    {{::\'SIGNIN_NOT_MEMBER\' | translate}}\n' +
    '                    <a href=""\n' +
    '                       ng-click="gotoSignup()"\n' +
    '                       tabindex="6">\n' +
    '                        {{::\'SIGNIN_SIGNUP_HERE\' | translate}}\n' +
    '                    </a>\n' +
    '                </p>\n' +
    '            </div>\n' +
    '\n' +
    '            <div class="tm24 divider-top"\n' +
    '                 style="margin-right: -16px; margin-left: -16px; background-color: rgb(238, 238, 238);"\n' +
    '                 ng-if="!adminOnly && $mdMedia(\'xs\')">\n' +
    '                <div class="h48 layout-row layout-align-center-end">\n' +
    '                    <p class="m0 text-small">{{::\'SIGNIN_NOT_MEMBER\' | translate}}</p>\n' +
    '                </div>\n' +
    '                <div class="h48 layout-row layout-align-center -start">\n' +
    '                    <a class="text-small" ng-click="gotoSignup()" href="" tabindex="6">\n' +
    '                        {{::\'SIGNIN_SIGNUP_HERE\' | translate}}\n' +
    '                    </a>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </form>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('verify_email/verify_email.html',
    '<!--\n' +
    '@file Verify email page\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<div class="pip-card-container pip-outer-scroll pip-entry">\n' +
    '    <pip-card width="400">\n' +
    '        <div class="pip-body">\n' +
    '            <div class="pip-content">\n' +
    '                <md-progress-linear ng-show="transaction.busy()" md-mode="indeterminate" class="pip-progress-top" >\n' +
    '                </md-progress-linear>\n' +
    '\n' +
    '                <h2>{{\'VERIFY_EMAIL_TITLE\' | translate}}</h2>\n' +
    '\n' +
    '                <p class="title-padding">{{\'VERIFY_EMAIL_TEXT_1\' | translate}} </p>\n' +
    '\n' +
    '                <form name=\'form\' novalidate>\n' +
    '                    <div ng-messages="form.$serverError" class="text-error bm8">\n' +
    '                        <div ng-message="ERROR_1000">{{::\'ERROR_1000\' | translate}}</div>\n' +
    '                        <div ng-message="ERROR_1110">{{::\'ERROR_1110\' | translate}}</div>\n' +
    '                        <div ng-message="ERROR_1111">{{::\'ERROR_1111\' | translate}}</div>\n' +
    '                        <div ng-message="ERROR_1112">{{::\'ERROR_1112\' | translate}}</div>\n' +
    '                        <div ng-message="ERROR_-1">{{::\'ERROR_SERVER\' | translate}}</div>\n' +
    '                        <div ng-message="ERROR_UNKNOWN">\n' +
    '                            {{ form.$serverError.ERROR_UNKNOWN | translate }}\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '\n' +
    '                    <a ng-hide="showServerUrl || fixedServerUrl" ng-click="showServerUrl = true" href="">      \n' +
    '                        {{\'ENTRY_CHANGE_SERVER\' | translate}}\n' +
    '                    </a>\n' +
    '                    <div ng-show="showServerUrl">\n' +
    '                        <md-autocomplete\n' +
    '                                ng-initial autofocus tabindex="1"\n' +
    '                                class="pip-combobox w-stretch bm8"\n' +
    '                                name="server"\n' +
    '                                ng-enabled="!transaction.busy()"\n' +
    '                                placeholder="{{::\'ENTRY_SERVER_URL\' | translate}}"\n' +
    '                                md-no-cache="true"\n' +
    '                                md-selected-item="data.serverUrl"\n' +
    '                                md-search-text="selected.searchURLs"\n' +
    '                                md-items="item in getMatches()"\n' +
    '                                md-item-text="item"\n' +
    '                                md-selected-item-change="onServerUrlChanged()"\n' +
    '                                md-delay="200"\n' +
    '                                ng-model="data.serverUrl"\n' +
    '                                pip-clear-errors>\n' +
    '                            <span md-highlight-text="selected.searchURLs">{{item}}</span>\n' +
    '                        </md-autocomplete>\n' +
    '                    </div>\n' +
    '\n' +
    '                    <md-input-container class="pip-no-hint" style="padding-bottom: 4px!important;">\n' +
    '                        <label>{{::\'EMAIL\' | translate}}</label>\n' +
    '                        <input name="email" type="email" ng-model="data.email" required step="any"  pip-clear-errors\n' +
    '                               ng-disabled="transaction.busy()" tabindex="2" />\n' +
    '\n' +
    '                        <div ng-messages="touchedErrorsWithHint(form, form.email)" ng-if="!form.email.$pristine" class="md-input-error">\n' +
    '                            <div ng-message="hint" class="pip-input-hint">{{::\'HINT_EMAIL\' | translate}}</div>\n' +
    '                            <div ng-message="required">{{::\'ERROR_EMAIL_INVALID\' | translate }}</div>\n' +
    '                            <div ng-message="email">{{::\'ERROR_EMAIL_INVALID\' | translate }}</div>\n' +
    '                            <div ng-message="ERROR_1100">{{::\'ERROR_1100\' | translate}}</div>\n' +
    '                            <div ng-message="ERROR_1104">{{::\'ERROR_1104\' | translate}}</div>\n' +
    '                            <div ng-message="ERROR_1305">{{::\'ERROR_1305\' | translate}}</div>\n' +
    '                            <div ng-message="ERROR_1106">{{::\'ERROR_1106\' | translate}}</div>\n' +
    '                        </div>\n' +
    '                    </md-input-container>\n' +
    '\n' +
    '                    <md-input-container class="pip-no-hint">\n' +
    '                        <label>{{::\'ENTRY_RESET_CODE\' | translate}}</label>\n' +
    '                        <input name="code" ng-disabled="transaction.busy()"\n' +
    '                               ng-model="data.code" required tabindex="3" />\n' +
    '\n' +
    '                        <div ng-messages="touchedErrorsWithHint(form, form.code)" ng-if="!form.fullName.$pristine" class="md-input-error">\n' +
    '                            <div ng-message="hint" class="pip-input-hint">{{::\'ENTRY_RESET_CODE\' | translate}}</div>\n' +
    '                            <div ng-message="required">{{::\'ERROR_CODE_INVALID\' | translate }}</div>\n' +
    '                            <div ng-message="ERROR_1108">{{::\'ERROR_1108\' | translate}}</div>\n' +
    '                        </div>\n' +
    '                    </md-input-container>\n' +
    '\n' +
    '                    <p> \n' +
    '                        {{\'VERIFY_EMAIL_TEXT_21\' | translate}} \n' +
    '                        <a ng-click="onRecover()" class="pointer" href="">{{\'VERIFY_EMAIL_RESEND\' | translate}}</a>\n' +
    '                        {{\'VERIFY_EMAIL_TEXT_22\' | translate}} \n' +
    '                    </p>\n' +
    '                </form>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="pip-footer">\n' +
    '            <md-button ng-click="goBack()" ng-hide="transaction.busy()" class="rm8" aria-label="CANCEL">\n' +
    '                {{::\'CANCEL\' | translate}}\n' +
    '            </md-button>\n' +
    '            <md-button class="md-accent" ng-click="onVerify()" ng-hide="transaction.busy()" aria-label="VERIFY"\n' +
    '                ng-disabled="data.code.length == 0 || data.email.length == 0 || (!data.email && form.$pristine) || (!data.code)">\n' +
    '                {{::\'VERIFY\' | translate}}\n' +
    '            </md-button>\n' +
    '            <md-button class="md-warn " ng-show="transaction.busy()" ng-click="transaction.abort()" aria-label="ABORT">\n' +
    '                {{::\'CANCEL\' | translate}}\n' +
    '            </md-button>\n' +
    '        </div>\n' +
    '    </pip-card>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('verify_email/verify_email_success.html',
    '<!--\n' +
    '@file Email verification success page\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<div class="pip-card-container pip-outer-scroll pip-entry">\n' +
    '    <pip-card width="400">\n' +
    '        <div class="pip-footer">\n' +
    '            <md-button ng-click="onContinue()" class="md-accent">\n' +
    '                {{\'CONTINUE\' | translate}} \n' +
    '            </md-button>\n' +
    '        </div>\n' +
    '        <div class="pip-body">\n' +
    '            <div class="pip-content">\n' +
    '                <h2>{{\'VERIFY_EMAIL_TITLE\' | translate}}</h2>\n' +
    '\n' +
    '                <p class="title-padding">\n' +
    '                    {{\'VERIFY_EMAIL_SUCCESS_TEXT\' | translate}} \n' +
    '                </p>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </pip-card>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('signup/signup.html',
    '<!--\n' +
    '@file Signup page\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<div class="pip-card-container pip-outer-scroll pip-entry">\n' +
    '    <pip-card width="400">\n' +
    '        <pip-signup-panel>\n' +
    '        </pip-signup-panel>\n' +
    '    </pip-card>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('signup/signup_dialog.html',
    '<!--\n' +
    '@file Signup page\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-entry">\n' +
    '    <md-dialog-content>\n' +
    '        <pip-signup-panel pip-goto-signin-dialog="pipGotoSigninDialog"\n' +
    '                          pip-post-signup="pipPostSignup"></pip-signup-panel>\n' +
    '    </md-dialog-content>\n' +
    '</md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('signup/signup_panel.html',
    '<div class="pip-body ">\n' +
    '    <div class="pip-content">\n' +
    '        <md-progress-linear ng-show="transaction.busy()" md-mode="indeterminate" class="pip-progress-top">\n' +
    '        </md-progress-linear>\n' +
    '\n' +
    '        <h2 pip-translate="SIGNUP_TITLE"></h2>\n' +
    '\n' +
    '        <form name="form" novalidate autocomplete="off">\n' +
    '            <input type="email" style="display:none">\n' +
    '            <input type="password" style="display:none">\n' +
    '\n' +
    '            <div ng-messages="form.$serverError" class="text-error bm8"  md-auto-hide="false">\n' +
    '                <div ng-message="ERROR_1000">{{::\'ERROR_1000\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1110">{{::\'ERROR_1110\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1111">{{::\'ERROR_1111\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1112">{{::\'ERROR_1112\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_-1">{{::\'ERROR_SERVER\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_UNKNOWN">\n' +
    '                    {{ form.$serverError.ERROR_UNKNOWN | translate }}\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '            <a ng-hide="showServerUrl || fixedServerUrl" ng-click="showServerUrl = true" href="">\n' +
    '                {{::\'ENTRY_CHANGE_SERVER\' | translate}}\n' +
    '            </a>\n' +
    '\n' +
    '            <div ng-show="showServerUrl">\n' +
    '                <md-autocomplete\n' +
    '                        ng-initial autofocus tabindex="1"\n' +
    '                        class="pip-combobox w-stretch bm8"\n' +
    '                        name="server"\n' +
    '                        ng-enabled="!transaction.busy()"\n' +
    '                        placeholder="{{::\'ENTRY_SERVER_URL\' | translate}}"\n' +
    '                        md-no-cache="true"\n' +
    '                        md-selected-item="data.serverUrl"\n' +
    '                        md-search-text="selected.searchURLs"\n' +
    '                        md-items="item in getMatches()"\n' +
    '                        md-item-text="item"\n' +
    '                        md-selected-item-change="onServerUrlChanged()"\n' +
    '                        md-delay="200"\n' +
    '                        ng-model="data.serverUrl"\n' +
    '                        ng-disabled="transaction.busy()"\n' +
    '                        pip-clear-errors>\n' +
    '                    <span md-highlight-text="selected.searchURLs">{{item}}</span>\n' +
    '                </md-autocomplete>\n' +
    '            </div>\n' +
    '\n' +
    '\n' +
    '            <md-input-container class="display bp4">\n' +
    '                <label>{{::\'FULLNAME\' | translate}}</label>\n' +
    '                <input name="signupFullName"\n' +
    '                       ng-disabled="transaction.busy()" autocomplete="off"\n' +
    '                       ng-model="data.name" ng-init="data.name = \'\'"\n' +
    '                       required tabindex="2" pip-clear-errors\n' +
    '                       ng-keypress="onEnter($event)">\n' +
    '\n' +
    '                <div class="hint text-overflow w-stretch"\n' +
    '                     ng-if="touchedErrorsWithHint(form, form.signupFullName).hint">\n' +
    '                    {{::\'HINT_FULLNAME\' | translate}}\n' +
    '                </div>\n' +
    '                <div ng-messages="touchedErrorsWithHint(form, form.signupFullName)"  md-auto-hide="false">\n' +
    '                    <div ng-message="required">\n' +
    '                        {{::\'HINT_FULLNAME\' | translate}} {{::\'ERROR_FULLNAME_INVALID\' | translate }}\n' +
    '                    </div>\n' +
    '                    <div ng-message="ERROR_1101">{{::\'ERROR_1101\' | translate}}</div>\n' +
    '                </div>\n' +
    '            </md-input-container>\n' +
    '\n' +
    '            <md-input-container class="display bp4">\n' +
    '                <label>{{::\'EMAIL\' | translate}}</label>\n' +
    '                <input name="userEmail" ng-disabled="transaction.busy()" pip-clear-errors\n' +
    '                       type="email" tabindex="3" ng-model="data.email"\n' +
    '                       xxng-pattern="/^[_a-z0-9]+(\\.[_a-z0-9]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*(\\.[a-z]{2,4})$/"\n' +
    '                       required\n' +
    '                       pip-email-unique="data.email"\n' +
    '                       ng-keypress="onEnter($event)"\n' +
    '                       pip-test="input-password"/>\n' +
    '\n' +
    '                <div class="hint" ng-if="touchedErrorsWithHint(form, form.userEmail).hint">\n' +
    '                    {{::\'HINT_EMAIL\' | translate}}\n' +
    '                </div>\n' +
    '                <div ng-messages="touchedErrorsWithHint(form, form.userEmail)" md-auto-hide="false"  md-auto-hide="false">\n' +
    '                    <div ng-message="required">{{::\'ERROR_EMAIL_INVALID\' | translate }}</div>\n' +
    '                    <div ng-message="email">{{::\'ERROR_EMAIL_INVALID\' | translate }}</div>\n' +
    '                    <div ng-message="emailUnique">{{::\'ERROR_1104\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1100">{{::\'ERROR_1100\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1106">{{::\'ERROR_1106\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1104">{{::\'ERROR_1104\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1300">{{::\'ERROR_1300\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1305">{{::\'ERROR_1305\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1301">{{::\'ERROR_1301\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1114">{{::\'ERROR_1114\' | translate}}</div>\n' +
    '                </div>\n' +
    '            </md-input-container>\n' +
    '\n' +
    '            <md-input-container class="display bp4">\n' +
    '                <label>{{::\'PASSWORD_SET\' | translate}}</label>\n' +
    '                <input name="password" ng-disabled="transaction.busy()" pip-clear-errors\n' +
    '                       type="password" tabindex="4" ng-model="data.password"\n' +
    '                       required minlength="6"\n' +
    '                       ng-keypress="onEnter($event)"\n' +
    '                       pip-test="input-password"/>\n' +
    '\n' +
    '                <div class="hint" ng-if="touchedErrorsWithHint(form, form.password).hint">\n' +
    '                    {{::\'HINT_PASSWORD\' | translate}}\n' +
    '                </div>\n' +
    '                <div ng-messages="touchedErrorsWithHint(form, form.password)"  md-auto-hide="false">\n' +
    '                    <div ng-message="required">\n' +
    '                        {{::\'HINT_PASSWORD\' | translate}}\n' +
    '                    </div>\n' +
    '                    <div ng-message="minlength">\n' +
    '                        {{::\'HINT_PASSWORD\' | translate}}\n' +
    '                    </div>\n' +
    '                    <div ng-message="ERROR_1102" ng-if="!form.password.$pristine">\n' +
    '                        {{::\'ERROR_1102\' | translate}}\n' +
    '                    </div>\n' +
    '                    <div ng-message="ERROR_1107" ng-if="!form.password.$pristine">\n' +
    '                        {{::\'ERROR_1107\' | translate}}\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </md-input-container>\n' +
    '\n' +
    '            <md-input-container class="display bp4">\n' +
    '                <label>{{::\'PASSWORD_CONFIRM\' | translate}}</label>\n' +
    '                <input name="passwordConfirm"\n' +
    '                       type="password" tabindex="4"\n' +
    '                       required minlength="6"\n' +
    '                       ng-model="confirmPassword"\n' +
    '                       ng-disabled="transaction.busy()" pip-clear-errors\n' +
    '                       compare-to="data.password"\n' +
    '                       ng-keypress="onEnter($event)"\n' +
    '                       pip-test="input-password"/>\n' +
    '\n' +
    '                <div class="hint" ng-if="touchedErrorsWithHint(form, form.passwordConfirm).hint">\n' +
    '                    {{::\'HINT_PASSWORD\' | translate}}\n' +
    '                </div>\n' +
    '                <div ng-messages="touchedErrorsWithHint(form, form.passwordConfirm)"  md-auto-hide="false">\n' +
    '                    <div ng-message="compareTo">\n' +
    '                        {{::\'PASSWORD_MATCH\' | translate}}\n' +
    '                    </div>\n' +
    '                    <div ng-message="required">\n' +
    '                        {{::\'HINT_PASSWORD\' | translate}}\n' +
    '                    </div>\n' +
    '                    <div ng-message="minlength">\n' +
    '                        {{::\'HINT_PASSWORD\' | translate}}\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </md-input-container>\n' +
    '\n' +
    '            <p class="text-small-secondary">\n' +
    '                {{::\'SIGNUP_TEXT_11\' | translate}}\n' +
    '                <a href="#/legal/privacy">{{::\'SIGNUP_PRIVACY\' | translate}}</a>\n' +
    '                {{::\'SIGNUP_TEXT_12\' | translate}}\n' +
    '                <a href="#/legal/services">{{::\'SIGNUP_SERVICES\' | translate}}</a>\n' +
    '            </p>\n' +
    '\n' +
    '            <md-button ng-hide="transaction.busy()" class="md-raised m0  md-accent w-stretch"\n' +
    '                       ng-click="onSignup()" aria-label="SIGNUP"\n' +
    '                       ng-disabled="form.$invalid || (form.$pristine && !data.email) || data.serverUrl.length == 0\n' +
    '                               || data.email.length == 0 || (!data.password)\n' +
    '                               || (!data.name) || data.name.length == 0 || data.password.length == 0">\n' +
    '                {{::\'SIGNUP_TITLE\' | translate}}\n' +
    '            </md-button>\n' +
    '\n' +
    '            <md-button ng-show="transaction.busy()" ng-click="transaction.abort()"\n' +
    '                       class="md-raised md-warn m0 w-stretch" aria-label="ABORT">\n' +
    '                {{::\'CANCEL\' | translate}}\n' +
    '            </md-button>\n' +
    '\n' +
    '            <div class="tm24 layout-row" ng-if="$mdMedia(\'gt-xs\')">\n' +
    '                <p class="text-small m0">\n' +
    '                    {{::\'SIGNUP_TEXT_2\' | translate}}\n' +
    '                    <a href="" ng-click="gotoSignin()">\n' +
    '                        {{::\'SIGNUP_SIGNIN_HERE\' | translate}}\n' +
    '                    </a>\n' +
    '                </p>\n' +
    '            </div>\n' +
    '            <div class="tm24 divider-top" ng-if="$mdMedia(\'xs\')"\n' +
    '                 style="margin-right: -16px; margin-left: -16px; background-color: rgb(238, 238, 238);">\n' +
    '                <div class="h48 layout-row layout-align-center-end">\n' +
    '                    <p class="bm0 text-small">{{::\'SIGNUP_TEXT_2\' | translate}}</p>\n' +
    '                </div>\n' +
    '                <div class="h48 layout-row layout-align-center-start">\n' +
    '                    <p class="bm0 text-small"><a href="" ng-click="gotoSignin()">\n' +
    '                        {{::\'SIGNUP_SIGNIN_HERE\' | translate}}</a></p>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </form>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

/**
 * @file Checking uniqueness of email in input control
 * @description
 * Email validation is performed on server via /api/signup_validate REST operation
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEmailUnique', ['ngResource', 'pipRest']);

    thisModule.directive('pipEmailUnique',
        ['$http', 'pipRest', function ($http, pipRest) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function ($scope, $element, $attrs, ngModel) {
                    var oldEmail = $attrs.pipEmailUnique;

                    $scope.$watch($attrs.ngModel, _.throttle(function (newValue) {
                        var oldHint = ngModel.$validators.emailUnique;
                        if (!newValue || newValue.length == 0 || oldEmail == newValue) {
                            ngModel.$setValidity('emailUnique', oldHint);
                            return;
                        }

                        if (!newValue) ngModel.$setValidity('emailUnique', true);

                        pipRest.signupValidate().call(
                            {
                                email: newValue
                            },
                            function (data) {
                                ngModel.$setValidity('emailUnique', true);
                            },
                            function (err) {
                                ngModel.$setValidity('emailUnique', false);
                            }
                        );
                    }, 500));
                }
            };
        }]
    );

})();
/**
 * @file Entry common logic
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.Common', []);

    thisModule.provider('pipEntry', function() {
        var
            adminOnly = false,
            fixedServerUrl = null;
        
        this.adminOnly = function(newAdminOnly) {
            adminOnly = newAdminOnly;  
        };

        this.fixedServerUrl = function(newFixedServerUrl) {
            fixedServerUrl  = newFixedServerUrl; 
        };

        this.$get = function () {
            return {
                adminOnly: function() {
                    return adminOnly;
                },
                
                fixedServerUrl: function() {
                    return fixedServerUrl;
                }
            };
        }
    });

    thisModule.factory('pipEntryCommon',
        ['$rootScope', '$state', '$window', 'pipAppBar', 'pipSession', 'pipRest', 'pipEntry', 'pipFormErrors', function ($rootScope, $state, $window, pipAppBar, pipSession, pipRest, pipEntry, pipFormErrors) {
            return {
                configureAppBar: configureAppBar,
                initScope: initScope
            };
            
            //---------------------
            
            function configureAppBar() {
                pipAppBar.hideNavIcon();
                if (pipAppBar.config().appTitleLogo) {
                    pipAppBar.showTitleLogo(pipAppBar.config().appTitleLogo);
                }
                else {
                    pipAppBar.showTitleLogo('images/piplife_logo.svg');
                }
                pipAppBar.showLanguage();
                pipAppBar.showShadow();
                pipAppBar.hideSearch();
            };

            function initScope($scope) {
                $scope.adminOnly = pipEntry.adminOnly();
                $scope.data = {
                    serverUrl: pipRest.serverUrl(), //$state.params.server_url || 'http://alpha.pipservices.net',
                    email: ($state.name != 'signup' && $state.params.email) ? $state.params.email : null,
                    password: '',
                    remember: false,
                    adminOnly: $scope.adminOnly,
                    name: $state.params.name || null, // signout
                    code: $state.params.code || null
                };
        
                $scope.showServerUrl = false;
                $scope.fixedServerUrl = false;
                $scope.data.serverUrl = $scope.data.serverUrl || pipSession.usedServerUrls();
        
                // Fixed server url shall disable changing URL by the user
                if (pipEntry.fixedServerUrl()) {
                    $scope.data.serverUrl = pipRest.serverUrl();
                    $scope.fixedServerUrl = true;  
                }
                        
                if ($state.name != 'signup') {
                    $scope.data.email = $scope.data.email || pipSession.lastUsedEmail($scope.data.serverUrl);
                    // $scope.data.password = $scope.data.password || pipSession.lastUsedPassword($scope.data.serverUrl);
                }
                $scope.serverUrls = pipSession.usedServerUrls();
                $scope.servers = pipSession.usedServers();
        
                $scope.selected = {};
                $scope.selected.searchURLs = $scope.data.serverUrl;
        
                // Set email from history
                if ($scope.data.serverUrl && !$scope.data.email && $state.name != 'signup') {
                    var server = $scope.servers[$scope.data.serverUrl];
                    $scope.data.email = (server || {}).email;
                }

                $scope.filterItem = filterItem;
                $scope.getMatches = getMatches;
                $scope.onServerUrlChanged = onServerUrlChanged;
                $scope.isEmpty = _.isEmpty;

                return;
                
                //---------------------------
        
                function filterItem(item) {
                    var result = ($scope.selected.searchURLs
                        && item
                        && item.toLowerCase().indexOf($scope.selected.searchURLs.toLowerCase()) >= 0);
                    return result;
                };
        
                function getMatches() {
                    if (!$scope.selected.searchURLs)
                        return $scope.showServerUrl;
                    $scope.data.serverUrl = $scope.selected.searchURLs;
                    return _.filter($scope.serverUrls, $scope.filterItem);
                };
        
                function onServerUrlChanged() {
                    // Change server url for REST API
                    pipRest.serverUrl($scope.data.serverUrl);
                    
                    if (!$scope.selected.searchURLs) return;
                    var server = $scope.servers[$scope.data.serverUrl];
        
                    if (server && $state.name != 'signup') {
                        $scope.data.email = server.email;
                        $scope.data.password = server.password;
                    }
                    
                    pipFormErrors.resetFormErrors($scope.form, false);
                    pipFormErrors.resetFieldsErrors($scope.form);
                    // if ($scope.form) {
                    //     for (var prop in $scope.form) {
                    //         if ($scope.form[prop] && $scope.form[prop].$error) {
                    //             console.log('prop error cleared', prop);
                    //             $scope.form[prop].$error = {};
                    //         };
                    //     }
                    // }
                    // if ($scope.form && $scope.form.$error) $scope.form.$error = {};
                };
            };            
        }]
    );
   
})();
/**
 * @file String resources for entry pages
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';
    
    var thisModule = angular.module('pipEntry.Strings', []);

    thisModule.config(['pipTranslateProvider', function (pipTranslateProvider) {

        // Set translation strings for the module
        pipTranslateProvider.translations('en', {
            // Common labels
            'FULLNAME': 'First and last name',
            'EMAIL': 'Email',
            'PASSWORD': 'Password',
            'LANGUAGE': 'Language',
            'GENDER': 'Gender',
            'BIRTHDAY': 'Birthday',
            'LOCATION': 'Location',

            // Common hints
            'HINT_FULLNAME': "Use your real name, so others know who you are",
            'HINT_PASSWORD': 'Minimum 6 characters',
            'HINT_ABOUT': 'Few words about yourself',
            'VERIFY_EMAIL': 'Please, verify your email address. ',
            'HINT_EMAIL': 'Please, type your email address.',

            // Sign In page
            'SIGNIN_TITLE': 'Sign in',
            'SIGNIN_NOT_MEMBER': 'Not a member?',
            'SIGNIN_REMEMBER': 'Remember',
            'SIGNIN_FORGOT_PASSWORD': 'Forgot password?',
            'SIGNIN_SIGNUP_HERE': ' Sign up here',

            // Sign Up page
            'SIGNUP_TITLE': 'Sign up',
            'SIGNUP_NOT_MEMBER': 'Not a member? Sign up now',
            'SIGNUP_TEXT_11': 'By clicking Sign up, you agree to the',
            'SIGNUP_PRIVACY': 'privacy statement',
            'SIGNUP_TEXT_12': 'and',
            'SIGNUP_SERVICES': 'services agreement',
            'SIGNUP_TEXT_2': 'Do you have an account?',
            'SIGNUP_SIGNIN_HERE': ' Sign in here',
            'SIGNUP_EMAIL_REGISTERED': 'This email is already registered',
            'SIGNUP_FULLNAME_WRONG': 'xxxx',
            'SIGNUP_EMAIL_WRONG': 'xxxx',

            // Sign Up Details page
            'POST_SIGNUP_TITLE': 'Welcome to Pip.Life',
            'POST_SIGNUP_TEXT_1': 'Your account was successfully created.',
            'POST_SIGNUP_TEXT_2': 'Tell us some more about yourself.',

            // Recover Password page
            'RECOVER_PWD_TITLE': 'Forgot password?',
            'RECOVER_PWD_TEXT_1': "Enter the email address you used when you joined and we'll send you instructions to reset your password.",
            'RECOVER_PWD_TEXT_2': 'For security reasons, we do NOT store your password. So rest assured that we will never send your password via email.',
            'RECOVER_PWD_RECOVER': 'Recover password',

            // Reset Password page
            'RESET_PWD_PASSWORD': 'Reset password',
            'RESET_PWD_TEXT': 'Enter the email address together with the reset code you received in email from PipLife. Remember the code is only active for 24 hours.',
            'RESET_PWD_SUCCESS_TEXT': 'Your password was successfully changed',

            // Verify Email page
            'VERIFY_EMAIL_TITLE': 'Email verification',
            'VERIFY_EMAIL_TEXT_1': 'Confirm your email address using verification code',
            'VERIFY_EMAIL_TEXT_21': "If you haven't received the code, press ",
            'VERIFY_EMAIL_RESEND': 'resend',
            'VERIFY_EMAIL_TEXT_22': 'to send it again.',
            'VERIFY_EMAIL_SUCCESS_TEXT': 'Your email address was successfully verified. Thank you!',

            'PASSWORD_MATCH': 'Passwords don\'t match',
            'PASSWORD_CONFIRM': 'Confirm the password',
            'PASSWORD_SET': 'Set a password',

            // Common entry resources
            'ENTRY_CHANGE_SERVER': 'Change server',
            'ENTRY_SERVER_URL': 'Server URL',
            'ENTRY_RESET_CODE': 'Reset code',
            'ENTRY_VERIFICATION_CODE': 'Verification code',
            'ENTRY_NEW_PASSWORD': 'New password',
            'ENTRY_SET_PASSWORD': 'Set Password',
            'ENTRY_FREE': 'Free',
            'ENTRY_REPEAT': 'Repeat',

            // Validation errors
            'ERROR_EMAIL_INVALID': 'Enter a valid email',
            'ERROR_PASSWORD_INVALID': 'Enter a valid password',
            'ERROR_FULLNAME_INVALID': 'Enter full name',
            'ERROR_CODE_INVALID': 'Enter a code from mail',
            'ERROR_ACCOUNT_NOT_FOUND': 'User name or password are incorrect',
            'ERROR_WRONG_PASSWORD': 'User name or password are incorrect', //'Wrong password',
            'ERROR_CODE_WRONG': 'Wrong recovery code',
            'ERROR_SERVER': 'Server is not responding',
            'ERROR_SERVER_INVALID': 'Enter server URL',

            //Languages
            'LANGUAGE_RUSSIAN': 'Russian',
            'LANGUAGE_ENGLISH': 'English'
        });

        pipTranslateProvider.translations('ru', {
            // Common labels
            'FULLNAME': 'Имя и фамилия',
            'EMAIL': 'Адрес эл.почты',
            'PASSWORD': 'Пароль',
            'LANGUAGE': 'Язык',
            'GENDER': 'Пол',
            'BIRTHDAY': 'Дата рождения',
            'LOCATION': 'Местонахождение',

            // Common hints
            'HINT_FULLNAME': "Используйте своё настоящее имя, чтобы другие знали с кем имеют дело",
            'HINT_PASSWORD': 'Минимум 6 символов',
            'HINT_ABOUT': 'Несколько слов о себе',
            'VERIFY_EMAIL': 'Подтвердите адрес своей эл.почты',
            'HINT_EMAIL': 'Введите адрес своей эл.почты',

            // Sign In page
            'SIGNIN_TITLE': 'Вход в систему',
            'SIGNIN_NOT_MEMBER': 'Еще не зарегистрировались?',
            'SIGNIN_REMEMBER': 'Запомнить',
            'SIGNIN_FORGOT_PASSWORD': 'Забыли пароль?',
            'SIGNIN_SIGNUP_HERE': ' Зарегистрироваться здесь',

            // Sign Up page
            'SIGNUP_TITLE': 'Регистрация',
            'SIGNUP_NOT_MEMBER': 'Новенький? Зарегистрируйтесь сейчас',
            'SIGNUP_TEXT_11': 'Нажимая кнопку регистрация, я соглашаюсь с',
            'SIGNUP_SERVICES': 'договором об услугах',
            'SIGNUP_TEXT_12': 'и',
            'SIGNUP_PRIVACY': 'соглашением о личных данных',
            'SIGNUP_TEXT_2': 'Уже зарегистрировались?',
            'SIGNUP_SIGNIN_HERE': ' Вход здесь',
            'SIGNUP_EMAIL_REGISTERED': 'Данный адрес эл.почты уже занят',

            // Sign Up Details page
            'POST_SIGNUP_TITLE': 'Добро пожаловать в Pip.Life',
            'POST_SIGNUP_TEXT_1': 'Ваша учетная запись создана.',
            'POST_SIGNUP_TEXT_2': 'Несклько слов о о себе',

            // Recover Password page
            'RECOVER_PWD_TITLE': 'Забыли пароль?',
            'RECOVER_PWD_TEXT_1': 'Введите адрес эл.почты, который вы использовали при регистрации и мы вышлем вам инструкции как изменить пароль.',
            'RECOVER_PWD_TEXT_2': 'По соображениям безопасности мы НЕ храним пароли. Таким образом, мы никогда не пошлем ваш пароль по электронной почте.',
            'RECOVER_PWD_RECOVER': 'Восстановить пароль',

            // Reset Password page
            'RESET_PWD_PASSWORD': 'Изменить пароль',
            'RESET_PWD_TEXT': 'Введите адрес эл.почты вместе с кодом, который вы получили в почтовом сообщении от PipLife. Помните, что код действителен только 24 часа.',
            'RESET_PWD_SUCCESS_TEXT': 'Ваш пароль успешно изменён',

            // Verify Email page
            'VERIFY_EMAIL_TITLE': 'Подтверждение адреса эл.почты',
            'VERIFY_EMAIL_TEXT_1': 'Введите код, который вы получили по эл.почте',
            'VERIFY_EMAIL_TEXT_21': "Если вы не получили почтовое сообщение с кодом, нажмите ",
            'VERIFY_EMAIL_RESEND': 'отправить снова',
            'VERIFY_EMAIL_TEXT_22': '.',
            'VERIFY_EMAIL_SUCCESS_TEXT': 'Адрес вашей электронной почты успешно подтвержден. Спасибо!',

            'PASSWORD_MATCH': 'Пароли не совпадают',
            'PASSWORD_CONFIRM': 'Подтвердите пароль',
            'PASSWORD_SET': 'Задайте пароль',

            // Common entry resources
            'ENTRY_CHANGE_SERVER': 'Изменить сервер',
            'ENTRY_SERVER_URL': 'URL сервера',
            'ENTRY_RESET_CODE': 'Код подтверждения',
            'ENTRY_VERIFICATION_CODE': 'Код проверки',
            'ENTRY_NEW_PASSWORD': 'Новый пароль',
            'ENTRY_SET_PASSWORD': 'Изменить пароль',
            'ENTRY_FREE': 'бесплатно',
            'ENTRY_REPEAT': 'Повторить',

            // Validation errors
            'ERROR_EMAIL_INVALID': 'Введите адрес электронной почты',
            'ERROR_PASSWORD_INVALID': 'Введите пароль',
            'ERROR_FULLNAME_INVALID': 'Введите полное имя',
            'ERROR_CODE_INVALID': 'Введите код',
            'ERROR_ACCOUNT_NOT_FOUND': 'Введено неверное имя пользователя или пароль',//'Такой пользователь не зарегистрирован',
            'ERROR_WRONG_PASSWORD': 'Введено неверное имя пользователя или пароль', //'Неправильный пароль',
            'ERROR_CODE_WRONG': 'Неправильный код',
            'ERROR_SERVER': 'Сервер не отвечает. Проверьте URL сервера.',
            'ERROR_SERVER_INVALID': 'Введите URL сервера',

            //Languages
            'LANGUAGE_RUSSIAN': 'Русский',
            'LANGUAGE_ENGLISH': 'Английский'
        });

    }]);

})();
/**
 * @file Checking uniqueness of email in input control
 * @description
 * Email validation is performed on server via /api/signup_validate REST operation
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipPasswordMatch', []);

    thisModule.directive('compareTo',function() {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function(modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function() {
                    ngModel.$validate();
                });
            }
        };
    });

})();

/**
 * @file Entry post signup controller
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Fix error handling
 * - Make a better post-signup. Redo it with document layout
 */

/* global angular */

(function () {
    'use strict';



    var thisModule = angular.module('pipEntry.PostSignup', ['pipEntry.Common', "pipPostSignupPanel"]);

    thisModule.controller('pipPostSignupController',
        ['$scope', '$rootScope', 'pipAuthState', '$party', function ($scope, $rootScope, pipAuthState, $party) {

            $scope.$party = $party;
            $scope.onPostSignupSubmit = onPostSignupSubmit;

            if ($scope.$panel) $scope.transaction = $scope.$panel.transacton;

            return

            function onPostSignupSubmit() {
                if ($scope.$panel)  $scope.$panel.onPostSignupSubmit();
            }
        }]
    );

})();
/**
 * @file Post signup dialog
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.PostSignupDialog', ['pipEntry.Common', "pipPostSignupPanel"]);

    thisModule.factory('pipPostSignupDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'post_signup/post_signup_dialog.html',
                        controller: 'pipPostSignupDialogController',
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

    thisModule.controller('pipPostSignupDialogController',
        ['$scope', '$rootScope', '$location', 'pipSession', 'params', function ($scope, $rootScope, $location, pipSession, params) {
            $scope.$party = params.$party;

            $scope.onPostSignupSubmit = onPostSignupSubmit;

            if ($scope.$panel) $scope.transaction = $scope.$panel.transacton;

            return

            function onPostSignupSubmit() {
                if ($scope.$panel)  $scope.$panel.onPostSignupSubmit();
            }
        }]
    );

})();
/**
 * @file Post signup panel
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipPostSignupPanel", ['pipUtils', 'pipFocused', 'pipEntry.Strings']);

    thisModule.directive('pipPostSignupPanel',
        function () {
            return {
                restrict: 'EA',
                replace: true,
                scope: {
                    data:'=pipData',
                    created:'&pipCreated',
                    $party:'=pipParty'

                },
                templateUrl: 'post_signup/post_signup_panel.html',
                controller: 'pipPostSignupPanelController'

            };
        }
    );
    thisModule.controller('pipPostSignupPanelController',
        ['$scope', '$rootScope', '$location', 'pipTransaction', 'pipAuthState', 'pipSession', 'pipFormErrors', 'pipEntryCommon', '$state', '$mdMedia', 'pipTranslate', 'pipEnums', 'pipRest', 'pipUtils', function ($scope, $rootScope, $location, pipTransaction, pipAuthState, pipSession,
                  pipFormErrors, pipEntryCommon, $state, $mdMedia, pipTranslate, pipEnums, pipRest, pipUtils) {

            $scope.$mdMedia = $mdMedia;

            pipEntryCommon.initScope($scope);
            $scope.showServerError = true;
            $scope.genders = pipTranslate.translateSet(pipEnums.GENDERS);
            $scope.languages = pipTranslate.translateSet(pipEnums.LANGUAGES);

            $scope.data = {
                id: $scope.$party.id,
                name: $scope.$party.name,
                email: $scope.$party.email,
                about: $scope.$party.about,
                language: pipTranslate.use(),
                birthday: $scope.$party.birthday,
                gender: $scope.$party.gender || pipEnums.GENDER.NOT_SPECIFIED,
                location: $scope.$party.location
            };

            $scope.transaction = pipTransaction('entry.post_signup', $scope);

            $scope.$control = {};
            $scope.$control.onPostSignupSubmit = onPostSignupSubmit;
            $scope.$control.transaction =  $scope.transaction;

            if ($scope.created){
                $scope.created({
                    $control: $scope.$control
                });
            }

            $scope.onPictureChanged = onPictureChanged;
            $scope.onPictureCreated = onPictureCreated;
            $scope.onPostSignupSubmit = onPostSignupSubmit;

            return;

            //---------------------------

            function onPictureChanged($control) {
                if($scope.picture)
                    $scope.picture.save(
                        // Success callback
                        function() {},
                        // Error callback
                        function(error) {
                            console.error(error);
                        }
                    );
            };

            function onPictureCreated($event) {
                $scope.picture = $event.sender;
            };

            function onPostSignupSubmit() {
                if ($scope.form.$invalid) {
                    pipFormErrors.resetFormErrors($scope.form, true);
                    return;
                }

                var transactionId = $scope.transaction.begin('PROCESSING');
                if (!transactionId) return;

                pipRest.parties().update(
                    $scope.data,

                    function (party) {
                        pipFormErrors.resetFormErrors($scope.form, false);
                        if ($scope.transaction.aborted(transactionId)) return;

                        $scope.transaction.end();

                        if (!pipUtils.checkSupported()) {
                            pipSession.signout();
                            $state.go('errors_unsupported');
                            return ;
                        }

                        pipAuthState.goToAuthorized({ party_id: party.id });
                    },
                    function (error) {
                        $scope.error = error;
                        $scope.transaction.end($scope.error);
                        pipFormErrors.resetFormErrors($scope.form, true);
                        pipFormErrors.setFormError(
                            $scope.form, error,
                            {
                                1000 : 'form', // Unknown error
                                1110 : 'form', // Account is locked
                                1111 : 'form', // Number of attempts exceeded. Account was locked
                                1112 : 'form', // Account is not active
                                '-1' : 'form' // server not response
                            }
                        );
                    }
                );
            };

        }])

})();
/**
 * @file Entry recover password controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.RecoverPassword', ['pipEntry.Common', "pipRecoverPasswordPanel"]);

    thisModule.controller('pipRecoverPasswordController',
        ['$scope', '$rootScope', 'pipUtils', 'pipAuthState', 'pipTransaction', 'pipRest', 'pipFormErrors', 'pipEntryCommon', '$window', function ($scope, $rootScope, pipUtils, pipAuthState, pipTransaction, pipRest, 
            pipFormErrors, pipEntryCommon, $window) {

            pipEntryCommon.configureAppBar();
            $scope.goBack = goBack;

            $scope.onRecover = onRecover;

            $scope.transaction = pipTransaction('entry.recover_password', $scope);

            return

            function goBack(){
                $window.history.back();
            }
            function onRecover() {
                if ($scope.$panel)  $scope.$panel.onRecover();
            }

        }]
    );

})();
/**
 * @file Recover password dialog
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.RecoverPasswordDialog', ['pipEntry.Common', "pipRecoverPasswordPanel",
        'pipEntry.ResetPasswordDialog']);

    thisModule.factory('pipRecoverPasswordDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'recover_password/recover_password_dialog.html',
                        controller: 'pipRecoverPasswordDialogController',
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

    thisModule.controller('pipRecoverPasswordDialogController',
        ['$scope', '$rootScope', '$location', 'pipSession', 'params', '$mdDialog', 'pipResetPasswordDialog', function ($scope, $rootScope, $location, pipSession, params, $mdDialog, pipResetPasswordDialog){

            $scope.onRecover = onRecover;

            if ($scope.$panel) $scope.transaction = $scope.$panel.transacton;

            $scope.goBack = $mdDialog.cancel;
            $scope.pipGotoReset = pipGotoResetPasswordDialog;

            return;

            function onRecover() {
                if ($scope.$panel)  $scope.$panel.onRecover();
            }

            function pipGotoResetPasswordDialog(){
                pipResetPasswordDialog.show({});
            }
        }]
    );

})();
/**
 * @file Recover password panel
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipRecoverPasswordPanel", ['pipUtils', 'pipFocused', 'pipEntry.Strings']);

    thisModule.directive('pipRecoverPasswordPanel',
        function () {
            return {
                restrict: 'EA',
                replace: true,
                scope: {
                    data: '=pipData',
                    created: '&pipCreated',
                    gotoReset: '=pipGotoReset'

                },
                templateUrl: 'recover_password/recover_password_panel.html',
                controller: 'pipRecoverPasswordPanelController'

            };
        }
    );
    thisModule.controller('pipRecoverPasswordPanelController',
        ['$scope', '$rootScope', '$location', 'pipTransaction', 'pipAuthState', 'pipSession', 'pipFormErrors', 'pipEntryCommon', '$state', '$mdMedia', 'pipTranslate', 'pipEnums', 'pipRest', 'pipUtils', function ($scope, $rootScope, $location, pipTransaction, pipAuthState, pipSession,
                  pipFormErrors, pipEntryCommon, $state, $mdMedia, pipTranslate, pipEnums, pipRest, pipUtils) {

            $scope.$mdMedia = $mdMedia;

            pipEntryCommon.initScope($scope);

            $scope.showServerError = true;

            $scope.touchedErrorsWithHint = pipFormErrors.touchedErrorsWithHint;
            $scope.onRecover = onRecover;
            $scope.transaction = pipTransaction('entry.recover_password', $scope);

            $scope.$control = {};
            $scope.$control.onRecover = onRecover;

            if ($scope.created) {
                $scope.created({
                    $control: $scope.$control
                });
            }

            return;

            //-----------------------------

            function onRecover() {
                if ($scope.form.$invalid) {
                    pipFormErrors.resetFormErrors($scope.form, true);
                    return;
                }

                var transactionId = $scope.transaction.begin('PROCESSING');
                if (!transactionId) return;

                pipRest.recoverPassword($scope.data.serverUrl).call(
                    {
                        email: $scope.data.email
                    },
                    function (data) {
                        pipFormErrors.resetFormErrors($scope.form, false);
                        if ($scope.transaction.aborted(transactionId)) return;

                        $scope.transaction.end();
                        if (!$scope.gotoReset)
                            pipAuthState.go('reset_password', {
                                server_url: $scope.data.serverUrl,
                                email: $scope.data.email
                            });
                        else
                            $scope.gotoReset();
                    },
                    function (error) {
                        $scope.error = error;
                        $scope.transaction.end($scope.error);
                        pipFormErrors.setFormError(
                            $scope.form, $scope.error,
                            {
                                1100: 'email', // Missing email
                                1106: 'email', // User was not found
                                1000: 'form', // Unknown error
                                1110: 'form', // Account is locked
                                1111: 'form', // Number of attempts exceeded. Account was locked
                                1112: 'form', // Account is not active
                                '-1' : 'form' // server not response
                            }
                        );
                        pipFormErrors.resetFormErrors($scope.form, true);
                    }
                );
            };

        }])

})();
/**
 * @file Entry signin controller
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Remove hack with guide_intro redirect
 * - Fix error handling
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.Signin', ['pipEntry.Common', "pipSigninPanel"]);

    thisModule.controller('pipSigninController',
        ['$scope', '$rootScope', '$location', 'pipTransaction', 'pipAuthState', 'pipSession', 'pipFormErrors', 'pipEntryCommon', function ($scope, $rootScope, $location, pipTransaction, pipAuthState, pipSession,
            pipFormErrors, pipEntryCommon) {

            pipEntryCommon.configureAppBar();
            if (!$rootScope.isSignin) pipSession.signout(); // hak for set language

            $rootScope.isSignin = false;
            return;


        }]
    );

})();
/**
 * @file Entry signin dialog
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.SigninDialog', ['pipEntry.Common', "pipSigninPanel",  'pipEntry.SignupDialog',
        'pipEntry.RecoverPasswordDialog']);

    thisModule.factory('pipSigninDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'signin/signin_dialog.html',
                        controller: 'pipSigninDialogController',
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

    thisModule.controller('pipSigninDialogController',
        ['$scope', '$rootScope', '$location', 'pipSession', 'pipSignupDialog', 'pipRecoverPasswordDialog', function ($scope, $rootScope, $location, pipSession,  pipSignupDialog, pipRecoverPasswordDialog) {

            //pipEntryCommon.configureAppBar();
            pipSession.signout();

            $scope.pipGotoSignupDialog = pipGotoSignupDialog;
            $scope.pipGotoRecoverPasswordDialog = pipGotoRecoverPasswordDialog;

            return;

            function pipGotoSignupDialog(){
                pipSignupDialog.show({});
            }

            function pipGotoRecoverPasswordDialog(){
                pipRecoverPasswordDialog.show({});
            }

        }]
    );

})();
/**
 * @file Signin panel
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipSigninPanel", ['pipUtils', 'pipFocused', 'pipEntry.Strings']);

    thisModule.directive('pipSigninPanel',
        function () {
            return {
                restrict: 'EA',
                replace: true,
                scope: {
                    gotoSignupPage: '=pipGotoSignupPage',
                    gotoSignupDialog: '=pipGotoSignupDialog',
                    gotoRecoverPasswordDialog:'=pipGotoRecoverPasswordDialog'
                },
                templateUrl: 'signin/signin_panel.html',
                controller: 'pipSigninPanelController'

            };
        }
    );
    thisModule.controller('pipSigninPanelController',
        ['$scope', '$rootScope', '$location', 'pipTransaction', 'pipAuthState', 'pipSession', 'pipFormErrors', 'pipEntryCommon', '$state', '$mdMedia', 'pipTheme', 'pipUtils', function ($scope, $rootScope, $location, pipTransaction, pipAuthState, pipSession,
                  pipFormErrors, pipEntryCommon, $state, $mdMedia, pipTheme, pipUtils) {

            $scope.$mdMedia = $mdMedia;


            $scope.showServerError = true;
            $scope.transaction = pipTransaction('entry.signin', $scope);

            $scope.touchedErrorsWithHint = pipFormErrors.touchedErrorsWithHint;

            $scope.onSignin = onSignin;
            $scope.gotoSignup = gotoSignup;
            $scope.gotoRecoverPassword = gotoRecoverPassword;
            $scope.onEnter = onEnter;

            pipEntryCommon.initScope($scope);

            return;

            function gotoSignup(){
                if(!$scope.gotoSignupPage &&  !$scope.gotoSignupDialog){
                    $state.go('signup',{ server_url: $scope.data.serverUrl, email: $scope.data.email });
                    return;
                }
                if($scope.gotoSignupPage){
                    $state.go($scope.gotoSignupPage);
                    return;
                }
                if($scope.gotoSignupDialog){
                    $scope.gotoSignupDialog();
                    return;
                }
            }

            function gotoRecoverPassword(){

                if(!$scope.gotoRecoverPasswordDialog){
                    $state.go('recover_password',{ server_url: $scope.data.serverUrl, email: $scope.data.email });
                    return;
                }
                if($scope.gotoRecoverPasswordDialog){
                    $scope.gotoRecoverPasswordDialog();
                    return;
                }
            }
  
            function onSignin() {
                if ($scope.form.$invalid) {
                    pipFormErrors.resetFormErrors($scope.form, true);
                    return;
                }

                var transactionId = $scope.transaction.begin('ENTERING');
                if (!transactionId) return;

                $rootScope.isSignin = true;
                pipSession.signin($scope.data,
                    function (user) {
                        pipFormErrors.resetFormErrors($scope.form, false);
                        if ($scope.transaction.aborted(transactionId))return;
                        $scope.transaction.end();

                        if (!pipUtils.checkSupported()) {
                            pipSession.signout();
                            $state.go('errors_unsupported');
                            return ;
                        }

                        if (pipAuthState.params.redirect_to) {
                            $location.url(pipAuthState.params.redirect_to);

                        } else {
                            pipAuthState.goToAuthorized();
                        }


                    },
                    function (error) {
                        $rootScope.isSignin = false;
                        pipFormErrors.resetFormErrors($scope.form, true);
                        pipFormErrors.setFormError(
                            $scope.form, error,
                            {
                                1100 : 'email', // Missing email
                                1106 : 'email', // User was not found
                                1114 : 'email', // Invalid email
                                1102 : 'password', // Missing password
                                1107 : 'password', // Invalid password
                                1000 : 'form', // Unknown error
                                1110 : 'form', // Account is locked
                                1111 : 'form', // Number of attempts exceeded. Account was locked
                                1112 : 'form', // Account is not active
                                '-1' : 'form' // server not response
                            }
                        );
                        $scope.transaction.end({message:error});

                    }
                );
            };

            function onEnter(event) {
                if(event.keyCode === 13) {
                    onSignin();
                }
            }

        }])

})();
/**
 * @file Entry reset password controller
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Fix error handling
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.ResetPassword', ['pipEntry.Common', 'pipResetPasswordPanel',
        'pipEmailUnique']);

    thisModule.controller('pipResetPasswordController',
        ['$scope', '$rootScope', 'pipUtils', 'pipAuthState', 'pipTransaction', 'pipRest', 'pipToasts', 'pipTranslate', 'pipFormErrors', 'pipEntryCommon', '$window', function ($scope, $rootScope, pipUtils, pipAuthState, pipTransaction, pipRest, pipToasts, 
            pipTranslate, pipFormErrors, pipEntryCommon, $window) {

            pipEntryCommon.configureAppBar();
            $scope.goBack = goBack;

            $scope.onReset = onReset;

            $scope.transaction = pipTransaction('entry.reset_password', $scope);

            return


            function goBack(){
                $window.history.back();
            }

            function onReset() {
                if ($scope.$panel)  $scope.$panel.onReset();
            }



        }]
    );

})();
/**
 * @file Reset password dialog
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.ResetPasswordDialog', ['pipEntry.Common', "pipResetPasswordPanel"]);

    thisModule.factory('pipResetPasswordDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'entry/dialogs/reset_password.html',
                        controller: 'pipResetPasswordDialogController',
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

    thisModule.controller('pipResetPasswordDialogController',
        ['$scope', '$rootScope', '$location', 'pipSession', 'params', '$mdDialog', function ($scope, $rootScope, $location, pipSession, params, $mdDialog){

            $scope.onReset = onReset;

            if ($scope.$panel) $scope.transaction = $scope.$panel.transacton;

            $scope.goBack = $mdDialog.cancel;


            return

            function onReset() {
                if ($scope.$panel)  $scope.$panel.onReset();
            }
        }]
    );

})();
/**
 * @file Reset password panel
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipResetPasswordPanel", ['pipUtils', 'pipFocused', 'pipEntry.Strings']);

    thisModule.directive('pipResetPasswordPanel',
        function () {
            return {
                restrict: 'EA',
                replace: true,
                scope: {
                    data: '=pipData',
                    created: '&pipCreated'

                },
                templateUrl: 'reset_password/reset_password_panel.html',
                controller: 'pipResetPasswordPanelController'

            };
        }
    );
    thisModule.controller('pipResetPasswordPanelController',
        ['$scope', '$rootScope', '$location', 'pipTransaction', 'pipAuthState', 'pipSession', 'pipToasts', 'pipFormErrors', 'pipEntryCommon', '$state', '$mdMedia', 'pipTranslate', 'pipEnums', 'pipRest', 'pipUtils', function ($scope, $rootScope, $location, pipTransaction, pipAuthState, pipSession, pipToasts,
                  pipFormErrors, pipEntryCommon, $state, $mdMedia, pipTranslate, pipEnums, pipRest, pipUtils) {

            $scope.$mdMedia = $mdMedia;

            pipEntryCommon.initScope($scope);

            $scope.showServerError = true;

            $scope.touchedErrorsWithHint = pipFormErrors.touchedErrorsWithHint;
            $scope.onReset = onReset;
            $scope.transaction = pipTransaction('entry.recover_password', $scope);

            $scope.$control = {};
            $scope.$control.onReset = onReset;

            if ($scope.created) {
                $scope.created({
                    $control: $scope.$control
                });
            }

            return;

            //-----------------------------

            function onShowToast(message, type) {
                if (!message) return;
                message = pipTranslate.translate(message);
                type = type || 'message';

                if (type == 'message') {
                    pipToasts.showMessage(message);
                    return;
                }
                if (type == 'error') {
                    pipToasts.showError(message);
                    return;
                }
            };

            function onReset() {
                if ($scope.form.$invalid) {
                    pipFormErrors.resetFormErrors($scope.form, true);
                    return;
                }

                var transactionId = $scope.transaction.begin('PROCESSING');
                if (!transactionId) return;

                pipRest.resetPassword($scope.data.serverUrl).call(
                    {
                        email: $scope.data.email,
                        code: $scope.data.code,
                        password: $scope.data.password
                    },
                    function (data) {
                        pipFormErrors.resetFormErrors($scope.form, false);
                        if ($scope.transaction.aborted(transactionId)) return;

                        var message = String() + 'RESET_PWD_SUCCESS_TEXT';
                        onShowToast(message, 'message');
                        $scope.transaction.end();
                        pipAuthState.go('signin', {
                            server_url: $scope.data.serverUrl,
                            email: $scope.data.email
                        });
                    },
                    function (error) {
                        $scope.error = error;
                        $scope.transaction.end($scope.error);
                        pipFormErrors.resetFormErrors($scope.form, true);
                        pipFormErrors.setFormError(
                            $scope.form, error,
                            {
                                1100 : 'email', // Missing email
                                1106 : 'email', // User was not found
                                1102 : 'password', // Missing password
                                1103 : 'password', // Password should be 5 to 20 symbols long
                                1105 : 'password', // Old and new passwords are identical
                                1108 : 'code', // Invalid password recovery code
                                1109 : 'code', // Password recovery code expired
                                1000 : 'form', // Unknown error
                                1110 : 'form', // Account is locked
                                1111 : 'form', // Number of attempts exceeded. Account was locked
                                1112 : 'form', // Account is not active
                                '-1' : 'form' // server not response
                            }
                        );
                    }
                );
            };

        }])

})();
/**
 * @file Entry signup controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.Signup', ['pipEntry.Common', 'pipEmailUnique',  'pipSignupPanel',
        'pipPasswordMatch']);

    thisModule.controller('pipSignupController',
        ['$scope', '$rootScope', 'pipAuthState', 'pipTransaction', 'pipRest', 'pipSession', 'pipFormErrors', 'pipEntryCommon', function ($scope, $rootScope, pipAuthState, pipTransaction, pipRest, pipSession, //pipAuth,
            pipFormErrors, pipEntryCommon) {

            pipEntryCommon.configureAppBar();

        }]
    );

})();
/**
 * @file Entry signup controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.SignupDialog', ['pipEntry.Common', "pipSignupPanel", 'pipEntry.SigninDialog',
        'pipEntry.PostSignupDialog']);

    thisModule.factory('pipSignupDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'signup/signup_dialog.html',
                        controller: 'pipSignupDialogController',
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

    thisModule.controller('pipSignupDialogController',
        ['$scope', '$rootScope', '$location', 'pipSession', 'pipSigninDialog', 'pipPostSignupDialog', function ($scope, $rootScope, $location, pipSession, pipSigninDialog, pipPostSignupDialog) {

            pipSession.signout();
            $scope.pipGotoSigninDialog = pipGotoSigninDialog;
            $scope.pipPostSignup = pipPostSignup;

            return;

            function pipGotoSigninDialog(){
                pipSigninDialog.show({});
            }

            function pipPostSignup(user){
                pipPostSignupDialog.show({
                    $party:user
                });
            }


        }]
    );

})();
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipSignupPanel", ['pipUtils', 'pipFocused', 'pipEntry.Strings']);

    thisModule.directive('pipSignupPanel',
        function () {
            return {
                restrict: 'EA',
                replace: true,
                scope: {
                    gotoPostSignup:'=pipPostSignup',
                    gotoSigninPage:'=pipGotoSigninPage',
                    gotoSigninDialog:'=pipGotoSigninDialog'
                },
                templateUrl: 'signup/signup_panel.html',
                controller: 'pipSignupPanelController'

            };
        }
    );
    thisModule.controller('pipSignupPanelController',
        ['$scope', '$rootScope', '$location', 'pipTransaction', 'pipAuthState', 'pipSession', 'pipFormErrors', 'pipEntryCommon', 'pipRest', '$mdMedia', '$state', function ($scope, $rootScope, $location, pipTransaction, pipAuthState, pipSession,
                  pipFormErrors, pipEntryCommon, pipRest, $mdMedia, $state) {

            $scope.$mdMedia = $mdMedia;


            pipEntryCommon.initScope($scope);

            $scope.confirmPassword = '';

            $scope.isEmpty = _.isEmpty;
            $scope.onEnter = onEnter;
            $scope.showServerError = true;
            $scope.transaction = pipTransaction('entry.signup', $scope);

            // фильтр по серверам
            $scope.filterItem = filterItem;
            $scope.getMatches = getMatches;
            $scope.touchedErrorsWithHint = pipFormErrors.touchedErrorsWithHint;
            $scope.onServerUrlChanged = function () {};
            $scope.onSignup = onSignup;
            $scope.gotoSignin =  gotoSignin;

            return;

            function gotoSignin(){
                if(!$scope.gotoSigninPage &&  !$scope.gotoSigninDialog){
                    $state.go('signin',{});
                    return;
                }
                if($scope.gotoSigninPage){
                    $state.go($scope.gotoSigninPage);
                    return;
                }
                if($scope.gotoSigninDialog){
                    $scope.gotoSigninDialog();
                    return;
                }
            }

            function filterItem(item) {
                var result = ($scope.selected.searchURLs
                && item
                && item.toLowerCase().indexOf($scope.selected.searchURLs.toLowerCase()) >= 0);
                return result;
            };

            function getMatches() {
                if (!$scope.selected.searchURLs)
                    return $scope.showServerUrl;
                $scope.data.serverUrl = $scope.selected.searchURLs;
                return _.filter($scope.serverUrls, $scope.filterItem);
            };

            function onSignup() {
                if ($scope.form.$invalid) {
                    pipFormErrors.resetFormErrors($scope.form, true);
                    return;
                }
                var transactionId = $scope.transaction.begin('PROCESSING');
                if (!transactionId) return;
                pipRest.signup($scope.data.serverUrl).call(
                    {
                        name: $scope.data.name,
                        email: $scope.data.email,
                        password: $scope.data.password,
                        language: $rootScope.$language || 'en',
                        theme: $rootScope.theme || 'blue'
                    },
                    function (user) {
                        pipFormErrors.resetFormErrors($scope.form, false);
                        if ($scope.transaction.aborted(transactionId)) return;
                        $scope.transaction.end();

                        pipSession.open($scope.data.serverUrl, user, $scope.data.password, false);
                        if(!$scope.gotoPostSignup)
                            pipAuthState.go('post_signup', { party_id: user.id });
                        else
                            $scope.gotoPostSignup(user);

                    },
                    function (error) {
                        $scope.error = error;
                        pipFormErrors.resetFormErrors($scope.form, true);
                        pipFormErrors.setFormError(
                            $scope.form, error,
                            {
                                1101 : 'signupFullName', // Missing name
                                1100 : 'userEmail', // Missing email
                                1106 : 'userEmail', // User was not found
                                1104 : 'userEmail', // Email is already registered
                                1305 : 'userEmail', // Email is already registered
                                1114 : 'userEmail', // Invalid email
                                1301 : 'userEmail', // Invalid email
                                1300 : 'userEmail', // Missing email
                                1102 : 'password', // Missing password
                                1103 : 'password', // Password should be 5 to 20 symbols long
                                1000 : 'form', // Unknown error
                                1110 : 'form', // Account is locked
                                1111 : 'form', // Number of attempts exceeded. Account was locked
                                1112 : 'form', // Account is not active
                                '-1' : 'form' // server not response
                            }
                        );
                        $scope.transaction.end(error);
                    }
                );
            };

            function onEnter(event) {
                if(event.keyCode === 13) {
                    onSignup();
                }
            }

        }])

})();
/**
 * @file Entry verify email controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.VerifyEmail', ['pipEntry.Common']);

    thisModule.controller('pipVerifyEmailController',
        ['$scope', '$rootScope', 'pipAuthState', 'pipTransaction', 'pipRest', 'pipFormErrors', 'pipEntryCommon', function ($scope, $rootScope, pipAuthState, pipTransaction, pipRest, 
            pipFormErrors, pipEntryCommon) {

            pipEntryCommon.configureAppBar();
            pipEntryCommon.initScope($scope);

            $scope.showServerError = true;
            $scope.transaction = pipTransaction('entry.verify_email', $scope);

            $scope.touchedErrorsWithHint = pipFormErrors.touchedErrorsWithHint;
            $scope.onVerify = onVerify;
            $scope.onRecover = onRecover;

            return;

            //-----------------------------

            function onVerify() {
                if ($scope.form.$invalid) {
                    pipFormErrors.resetFormErrors($scope.form, true);
                    return;
                }

                var transactionId = $scope.transaction.begin('PROCESSING');
                if (!transactionId) return;

                pipRest.verifyEmail($scope.data.serverUrl).call(
                    {
                        email: $scope.data.email,
                        code: $scope.data.code
                    },
                    function (data) {
                        pipFormErrors.resetFormErrors($scope.form, false);
                        if ($scope.transaction.aborted(transactionId)) return;

                        $scope.transaction.end();
                        pipAuthState.go('verify_email_success', {});
                    },
                    function (error) {
                        $scope.error = error;
                        $scope.transaction.end($scope.error);
                        pipFormErrors.resetFormErrors($scope.form, true);
                        pipFormErrors.setFormError(
                            $scope.form, $scope.error,
                            {
                                1100 : 'email', // Missing email
                                1106 : 'email', // User was not found
                                1104 : 'email', // Email is already registered
                                1305 : 'email', // Email is already registered
                                1108 : 'code', // Invalid password recovery code
                                1000 : 'form', // Unknown error
                                1110 : 'form', // Account is locked
                                1111 : 'form', // Number of attempts exceeded. Account was locked
                                1112 : 'form', // Account is not active
                                '-1' : 'form' // server not response
                            }
                        );
                    }
                );
            };

            function onRecover() {
                if (!$rootScope.$user || !$rootScope.$user.id) {
                    return ;
                }

                var tid = $scope.transaction.begin('PROCESSING');
                if (!tid) return;
                pipRest.requestEmailVerification($scope.data.serverUrl).get(
                    {
                        party_id: $rootScope.$user.id,
                        email: $scope.data.email
                    },
                    function (data) {
                        if ($scope.transaction.aborted(tid)) return;

                        $scope.transaction.end();
                        pipAuthState.go('reset_password', {
                            server_url: $scope.data.serverUrl,
                            email: $scope.data.email
                        });
                    },
                    function (error) {
                        $scope.transaction.end(error);
                    }
                );
            };
        }]
    );

    thisModule.controller('pipVerifyEmailSuccessController',
        ['$scope', 'pipAuthState', 'pipEntryCommon', function ($scope, pipAuthState, pipEntryCommon) {

            pipEntryCommon.configureAppBar();

            $scope.onContinue = onContinue;

            return;
            
            //-----------------------------

            function onContinue() {
                pipAuthState.goToAuthorized({});
            };
        }]
    );

})();


/**
 * @file Registration of all error handling components
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    angular.module('pipErrorHandling', [
        'pipErrors.Pages',
        'pipNoConnectionPanel'
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
        'pipAppBar', 'pipRest.State', 'pipTransactions', 'pipRest', 'ngMaterial', 
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
 * @file Registration of all guidance components
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function () {
    'use strict';

    angular.module('pipGuidance', [
        'pipTips.Service',
        'pipIntroGuidance.Service',
        'pipGuidance.Dialog',
        'pipReleaseIntroDialog'
    ]);

})(window.angular);

(function(module) {
try {
  module = angular.module('pipGuidance.Templates');
} catch (e) {
  module = angular.module('pipGuidance.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('guidance/guidance_dialog.html',
    '<!--\n' +
    '@file Guidance dialog content\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-dialog pip-guidance-dialog layout-column" width="768" md-theme="{{theme}}">\n' +
    '    <div class="pip-header layout-row">\n' +
    '        <h3 class="rm16 flex">{{title | translate}}</h3>\n' +
    '        <md-button class="pip-dialog-close" ng-click="onCancel()" \n' +
    '            aria-label="{{::\'CLOSE\' | translate}}">\n' +
    '            <span class="icon-cross"></span>\n' +
    '        </md-button>\n' +
    '    </div>\n' +
    '    <div class="pip-body">\n' +
    '        <div class="pip-content">\n' +
    '            <pip-picture pip-src="imageUrl" ng-hide="!imageUrl || imageUrl == \'\'" class="bm16 center-block"\n' +
    '                ng-style="{ width: imageWidth, height: imageHeight, display: \'block\' }">\n' +
    '            </pip-picture>\n' +
    '\n' +
    '            <div class="bm16" pip-translate-html="{{::content}}"></div>\n' +
    '\n' +
    '            <md-button class="md-raised md-accent w-stretch" ng-click="onAction()"\n' +
    '                       ng-hide="!action || action==\'\'"\n' +
    '                       arial-label="{{::action | translate}}">\n' +
    '                {{::action | translate}}\n' +
    '            </md-button>\n' +
    '\n' +
    '            <md-checkbox aria-label="{{\'DO_NOT_SHOW\' | translate}}" class="w-stretch m0 tm16 regular_14"\n' +
    '                         ng-model="hideToggle" ng-change="onHideToggle()" ng-show="showHideToggle"\n' +
    '                         aria-label="{{::\'GUIDANCE_DO_NOT_SHOW\' | translate}}">\n' +
    '                {{::\'GUIDANCE_DO_NOT_SHOW\' | translate}}\n' +
    '            </md-checkbox>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    </div>\n' +
    '</md-dialog>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipGuidance.Templates');
} catch (e) {
  module = angular.module('pipGuidance.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('intro_guidance/intro_guidance_dialog.html',
    '<md-dialog class="pip-dialog pip-guidance-dialog pip-guide-preview layout-column" md-theme="{{theme}}">\n' +
    '    <div ng-if="!$routing" ng-swipe-left="onNextPage()" ng-swipe-right="onBackPage()"\n' +
    '         class="h-stretch flex layout layout-column {{\'bg-\' + data.pages[number].color}} ">\n' +
    '        <div class="layout layout-row layout-align-space-between-center layout-align-xs-center-center w-stretch pip-guide-page">\n' +
    '            <md-button ng-click="onBackPage()" class=" lm16 hide-xs" aria-label="BACK"\n' +
    '                       ng-disabled="transaction.busy() || number == 0">\n' +
    '                <md-icon md-svg-icon="icons:arrow-left" class="pip-arrow-button"\n' +
    '                         ng-class="{\'opacity-disabled\' :number == 0}"></md-icon>\n' +
    '            </md-button>\n' +
    '            <div class="layout layout-column layout-align-center-center bm16">\n' +
    '                <pip-collage class="flex-fixed" ng-if="data.pages[number].pic_id && (!data.pictures || !data.pictures[number])"\n' +
    '                             pip-picture-ids="data.pages[number].picId" pip-unique-code="data.id"\n' +
    '                             pip-multiple="false" pip-open="false" pip-rebind="true">\n' +
    '                </pip-collage>\n' +
    '                <div class="pip-pic" ng-if="!data.pages[number].pic_id || data.pictures[number]"\n' +
    '                     style="background-image: url({{data.pictures[number]}})"></div>\n' +
    '\n' +
    '                <div class="layout layout-column layout-align-center-center pip-text">\n' +
    '                    <p class="pip-preview-title" ng-if="data.pages[number].title[ln]">\n' +
    '                        {{data.pages[number].title[ln]}}</p>\n' +
    '\n' +
    '                    <p class="pip-preview-content" ng-if="data.pages[number].content[ln]">\n' +
    '                        {{data.pages[number].content[ln]}}</p>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <md-button ng-click="onNextPage()" class="rm16 hide-xs" aria-label="DOWN"\n' +
    '                       ng-disabled="transaction.busy() || number == data.pages.length - 1">\n' +
    '                <md-icon md-svg-icon="icons:arrow-right" class="pip-arrow-button"\n' +
    '                         ng-class="{\'opacity-disabled\' : number == data.pages.length - 1}"></md-icon>\n' +
    '            </md-button>\n' +
    '        </div>\n' +
    '\n' +
    '        <div class=" flex-fixed flex w-stretch pip-guide-page-footer">\n' +
    '\n' +
    '\n' +
    '            <div  class="layout-row layout-align-center-center" ng-if="data.pages.length > 1">\n' +
    '                <md-icon ng-repeat="radio in data.pages" ng-click="onChangePage($index)" class="pip-radio-button "\n' +
    '                         md-svg-icon="{{radio != data.pages[number] ? \'icons:radio-off\' : \'icons:circle\'}}">\n' +
    '                </md-icon>\n' +
    '            </div>\n' +
    '\n' +
    '            <div class="h64 layout-row layout-align-xs-space-between-center layout-align-center-center">\n' +
    '\n' +
    '                <md-button ng-click="onBackPage()" class="lm16" ng-if="$mdMedia(\'xs\')" aria-label="BACK"\n' +
    '                           ng-disabled="transaction.busy() || number == 0">\n' +
    '                    <md-icon md-svg-icon="icons:arrow-left" class="pip-arrow-button"\n' +
    '                             ng-class="{\'opacity-disabled\' :number == 0}"></md-icon>\n' +
    '                </md-button>\n' +
    '\n' +
    '                <md-button ng-click="onClose()"\n' +
    '                           class="pip-button-got rm8 lm8\n' +
    '                                       {{number == data.pages.length - 1  ? \'fg-\' + data.pages[number].color : \'bg-\' + data.pages[number].color}}"\n' +
    '                           ng-class="{\'md-raised\':  number == data.pages.length - 1}"\n' +
    '                           aria-label="NEXT"\n' +
    '                           ng-disabled="transaction.busy()">\n' +
    '                    GOT IT !\n' +
    '                </md-button>\n' +
    '\n' +
    '                <md-button ng-click="onNextPage()" class="rm16 "  ng-if="$mdMedia(\'xs\')"  aria-label="DOWN"\n' +
    '                           ng-disabled="transaction.busy() || number == data.pages.length - 1">\n' +
    '                    <md-icon md-svg-icon="icons:arrow-right" class="pip-arrow-button"\n' +
    '                             ng-class="{\'opacity-disabled\' : number == data.pages.length - 1}"></md-icon>\n' +
    '                </md-button>\n' +
    '            </div>\n' +
    '\n' +
    '\n' +
    '        </div>\n' +
    '\n' +
    '    </div>\n' +
    '</md-dialog>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipGuidance.Templates');
} catch (e) {
  module = angular.module('pipGuidance.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('tips/tip.template.html',
    '<div ng-if="title" class=\'pip-title p24-flex flex-fixed bp16\'>\n' +
    '    {{ title | translate }}\n' +
    '</div>\n' +
    '\n' +
    '<div class=\'pip-content pip-popover-content lp24-flex rp24-flex text-body1 bm64 pip-scroll\'\n' +
    '     ng-class="{\'tm24\' : !title }">\n' +
    '    <div ng-if="image && $mdMedia(\'gt-xs\')" class="pip-pic"></div>\n' +
    '    <pip-markdown pip-text="content" pip-rebind="true"></pip-markdown>\n' +
    '</div>\n' +
    '\n' +
    '<div class="pip-footer lm24-flex rm24-flex position-bottom layout-row layout-align-start-center">\n' +
    '    <a ng-if="link" target="_blank" href="{{ link }}" class="text-body2 flex">\n' +
    '        {{:: \'MORE_URL\' | translate }}\n' +
    '    </a>\n' +
    '    <div  ng-if="!link" class="flex"></div>\n' +
    '\n' +
    '    <md-button ng-click=\'onNextClick()\' class="rm0">\n' +
    '        {{:: \'NEXT\' | translate }}\n' +
    '    </md-button>\n' +
    '\n' +
    '</div>');
}]);
})();

/**
 * @file Guidance dialog
 * @copyright Digital Living Software Corp. 2014-2015
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipGuidance.Dialog', ['ngMaterial', 'pipTranslate', 'pipGuidance.Templates']);

    thisModule.config(['pipTranslateProvider', function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            GUIDANCE_TITLE: 'What should you do here?',
            GUIDANCE_ACTION: 'Do it now!',
            GUIDANCE_DO_NOT_SHOW: "Don't show it again"
        });
        pipTranslateProvider.translations('ru', {
            GUIDANCE_TITLE: 'Что здесь делать?',
            GUIDANCE_ACTION: 'Сделать это сейчас!',
            GUIDANCE_DO_NOT_SHOW: 'Не показывать это снова'
        });
    }]);

    /**
     * @ngdoc service
     * @name pipGuidance.Dialog:pipGuidanceDialog
     *
     * @description
     * Reproduced API to show guidance dialog stretched out on a whole screen.
     * It is included a navigation and allows users to go back through guide.
     */
    thisModule.factory('pipGuidanceDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                /**
                 * @ngdoc method
                 * @methodOf pipGuidance.Dialog:pipGuidanceDialog
                 * @name pipGuidance.Dialog.pipGuidanceDialog:show
                 *
                 * @description
                 * Shows guidance panel. Shown guidance can be close by click on backdrop space. Into callback function is
                 * passed nothing data.
                 *
                 * {@link https://github.com/pip-webui/pip-webui-guidance/blob/master/src/guidance/guidance_dialog.js#L50 View source}
                 *
                 * @param {Object} params   Options for dialog panel.
                 * @param {Function=} successCallback   Callback function is invoked on success dialog close.
                 * @param {Function=} cancelCallback    Callback function is invoked on error event.
                 */
                show: function (params, successCallback, cancelCallback) {
                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'guidance/guidance_dialog.html',
                        controller: 'pipGuidanceDialogController',
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

    thisModule.controller('pipGuidanceDialogController',
        ['$scope', '$rootScope', '$mdDialog', 'params', function ($scope, $rootScope, $mdDialog, params) {
            $scope.theme = $rootScope.$theme;
            $scope.title = params.title || 'GUIDANCE_TITLE';

            $scope.imageUrl = params.imageUrl || '';
            $scope.imageWidth = params.imageWidth || '100%';
            $scope.imageHeight = params.imageHeight || '150px';

            $scope.content = params.content;
            $scope.action = params.action || 'GUIDANCE_ACTION';
            $scope.hideToggle = params.hideToggle;
            $scope.showHideToggle = params.hideToggleCallback != null;

            $scope.onCancel = function () {
                $mdDialog.cancel();
            };

            $scope.onAction = function () {
                $mdDialog.hide();
            };

            $scope.onHideToggle = function () {
                if (params.hideToggleCallback) {
                    params.hideToggleCallback($scope.hideToggle);
                }
            };
        }]);

})(window.angular);

/**
 * @file Tips service
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global $ */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipTips.Service', ['pipGuidance.Templates']);

    /**
     * @ngdoc service
     * @name pipTips.Service.pipTips
     *
     * @description
     * Service provides an interface to manage tips state.
     * The service is available only on run phase.
     */
    thisModule.factory('pipTips', ['$timeout', '$rootScope', '$pipPopover', 'pipTipsData', 'pipRest', 'pipSettingsData', function ($timeout, $rootScope, $pipPopover, pipTipsData, pipRest, pipSettingsData) {
        var tips;

        return {
            /** @see getTips */
            getTips: getTips,
            /** @see filterTips */
            filterTips: filterTips,
            /** @see showTips */
            showTips: showTips,
            /** @see firstShowTips */
            firstShowTips: firstShowTips
        };

        function checkStatus(item) {
            return item.status === 'completed';
        }

        function compareRandom() {
            return Math.random() - 0.5;
        }

        /**
         * @ngdoc method
         * @methodOf pipTips.Service.pipTips
         * @name pipTips.Service.pipTips:filterTips
         *
         * @description
         * Filters passed tips by passed topic and sorts result collection.
         *
         * {@link https://github.com/pip-webui/pip-webui-guidance/blob/master/src/tips/tips_service.js#L63 View source}
         *
         * @param {Array} data  Source array of tips entities
         * @param {string} topic    Name of topic to filter by it
         *
         * @returns {Array} Filtered and sorted collection.
         *
         * @example
         * <pre>
         *     pipTips.filterTips(tips, 'goals');
         * </pre>
         */
        function filterTips(data, topic) {
            tips = [];
            var tipsCollection = _.filter(data, checkStatus),
                index;

            for (index = 0; index < tipsCollection.length; index++) {
                var topic = _.find(tipsCollection[index].topics, function (t) { return t == topic; });

                if (topic) {
                    tips.push(tipsCollection[index]);
                }
            }

            tips.sort(compareRandom);

            return tips;
        }

        function tipController($scope, $timeout, $mdMedia) {

            $scope.index = 0;

            $scope.$mdMedia = $mdMedia;

            init();

            $scope.onNextClick = function () {
                $scope.index++;

                if ($scope.index === $scope.locals.tips.length) {
                    $pipPopover.hide();
                } else {
                    init();
                    $pipPopover.resize();
                    // $rootScope.$broadcast('pipWindowResized');
                }
            };

            $scope.$on('pipWindowResized', init);

            function init() {

                $scope.title = $scope.locals.tips[$scope.index].title[$scope.locals.ln];
                $scope.content = $scope.locals.tips[$scope.index].content[$scope.locals.ln];
                if ($scope.locals.tips[$scope.index].pic_id) {
                    $scope.image = pipRest.serverUrl() + '/api/parties/' + $scope.locals.tips[$scope.index].creator_id
                        + '/files/' + $scope.locals.tips[$scope.index].pic_id + '/content';
                }

                $scope.link = $scope.locals.tips[$scope.index].more_url;

                if ($scope.image) {
                    $timeout(function () {
                        var backdropElement = $('.pip-popover-backdrop'),
                            popover = backdropElement.find('.pip-popover');

                        popover.find('.pip-pic').css('background-image', 'url(' + $scope.image + ')');
                    }, 100);
                }
            }
        }

        /**
         * @ngdoc method
         * @methodOf pipTips.Service.pipTips
         * @name pipTips.Service.pipTips:showTips
         *
         * @description
         * Shows tip to user.
         *
         * {@link https://github.com/pip-webui/pip-webui-guidance/blob/master/src/tips/tips_service.js#L144 View source}
         *
         * @param {Array} tips  Array of tips
         * @param {string} ln   Chosen language
         * @param {Object=} [$event=null]    Event object
         *
         * @example
         * <pre>
         *      pipTips.showTips(tips, 'en');
         * </pre>
         */
        function showTips(tips, ln, $event) {

            if (tips && tips.length > 0) {
                $pipPopover.hide();
                $pipPopover.show({
                    element: $event ? $event.currentTarget : null,
                    class: 'pip-tip',
                    cancelCallback: function () {
                        return false;
                    },
                    locals: {
                        tips: tips,
                        ln: ln || 'en'
                    },
                    controller: ['$scope', '$timeout', '$mdMedia', tipController],
                    templateUrl: 'tips/tip.template.html'
                });
            }

        }

        /**
         * @ngdoc method
         * @methodOf pipTips.Service.pipTips
         * @name pipTips.Service.pipTips:firstShowTips
         *
         * @description
         * Shows a tip
         *
         * {@link https://github.com/pip-webui/pip-webui-guidance/blob/master/src/tips/tips_service.js#L181 View source}
         *
         * @param {Array} tips  Collection of tips
         * @param {string} [ln='en']   Language for tip content
         * @param {string} topic    Name of needed topic
         * @param {Object} settings Settings object
         * @param {Object} [kolDay=2]   Days amount throughout tips should be shown
         */
        function firstShowTips(tips, ln, topic, settings, kolDay) {
            var ln = ln || 'en',
                kolDay = kolDay || 2,
                now = new Date(),
                show;

            if (settings && settings[topic].tips) {
                show = (now.getTime() - new Date(settings[topic].tips).getTime()) / (1000 * 60 * 60 * 24);

                // TODO [apidhirnyi] Extract the same code part into the function
                if (show > kolDay) {
                    $pipPopover.hide();
                    showTips(tips, ln);
                    settings[topic].tips = new Date();
                    pipSettingsData.saveSettings(settings, topic);
                }
            } else if (settings[topic]) {
                $pipPopover.hide();
                showTips(tips, ln);
                settings[topic].tips = new Date();
                pipSettingsData.saveSettings(settings, topic);
            }
        }

        /**
         * @ngdoc method
         * @methodOf pipTips.Service.pipTips
         * @name pipTips.Service.pipTips:getTips
         *
         * @description
         * Returns tips collection according to topic.
         *
         * {@link https://github.com/pip-webui/pip-webui-guidance/blob/master/src/tips/tips_service.js#L220 View source}
         *
         * @param {Object} party    User's party object
         * @param {string} ln       Language for tip content
         * @param {string} topic    Name of needed topic
         * @param {Function} callback   Callback function. It gets tips collection as argument.
         */
        function getTips(party, ln, topic, callback) {

            pipTipsData.readTips(
                {item: {}},
                null,
                function (result) {
                    filterTips(result.data, topic);

                    if (callback) { callback(tips); }

                    return tips;
                },
                function () {
                    return null;
                }
            );
        }

    }]);

})(window.angular);

/**
 * @file Guidance dialog
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipReleaseIntroDialog', ['ngMaterial', 'pipTranslate', 'pipGuidance.Templates']);

    thisModule.config(['pipTranslateProvider', function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            GUIDANCE_TITLE: 'What should you do here?',
            GUIDANCE_ACTION: 'Do it now!',
            GUIDANCE_DO_NOT_SHOW: "Don't show it again"
        });
        pipTranslateProvider.translations('ru', {
            GUIDANCE_TITLE: 'Что здесь делать?',
            GUIDANCE_ACTION: 'Сделать это сейчас!',
            GUIDANCE_DO_NOT_SHOW: 'Не показывать это снова'
        });
    }]);

    /**
     * @ngdoc service
     * @name pipReleaseIntroDialog.pipReleaseIntroDialog
     *
     * @description
     * Provides API to show intro dialog.
     */
    thisModule.factory('pipReleaseIntroDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                /**
                 * @ngdoc method
                 * @methodOf pipReleaseIntroDialog.pipReleaseIntroDialog
                 * @name pipReleaseIntroDialog.pipReleaseIntroDialog:show
                 *
                 * @description
                 * Shows dialog panel. Shown dialog can be close by click on backdrop space. Into callback function is
                 * passed nothing data.
                 *
                 * {@link https://github.com/pip-webui/pip-webui-guidance/blob/master/src/intro_guidance/intro_guidance_dialog.js#L50 View source}
                 * 
                 * @param {Object} params   Options for dialog panel.
                 * @param {Function=} successCallback   Callback function is invoked on success dialog close.
                 * @param {Function=} cancelCallback    Callback function is invoked on error event.
                 *
                 */
                show: function (params, successCallback, cancelCallback) {
                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'intro_guidance/intro_guidance_dialog.html',
                        controller: 'pipReleaseIntroDialogController',
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

    thisModule.controller('pipReleaseIntroDialogController',
        ['$scope', '$rootScope', '$mdDialog', '$mdMedia', 'params', function ($scope, $rootScope, $mdDialog, $mdMedia, params) {
            $scope.theme = $rootScope.$theme;
            $scope.settings = params.settings;
            $scope.admin = params.admin;
            $scope.$mdMedia = $mdMedia;

            var guide = params.guide;

            if (!$scope.admin && $scope.settings[params.settingsName] && $scope.settings[params.settingsName].lastId) {
                params.settingsName = 'release';
            }

            $scope.number = 0;
            $scope.ln = params.ln || $rootScope.$language || 'en';
            $scope.data = guide;

            _.each($scope.data.pages, function (page) {
                if (page.pic_id) {
                    var picId = page.pic_id;

                    page.picId = [];
                    page.picId.push(picId);
                }
            });

            // Process user actions
            // --------------------

            $scope.onChangePage = function (newNumber) {
                $scope.number = newNumber;
            };

            $scope.onBackPage = function () {
                if ($scope.number !== 0) {
                    $scope.number -= 1;
                }
            };

            $scope.onNextPage = function () {
                if ($scope.number !== $scope.data.pages.length - 1) {
                    $scope.number += 1;
                }
            };

            $scope.onClose = function () {
                if (!$scope.admin) {
                    $scope.settings[params.settingsName].lastId = $scope.data.id;
                    $scope.settings[params.settingsName].date = new Date();

                    params.pipSettingsData.saveSettings($scope.settings, params.settingsName);
                }

                $mdDialog.cancel();
            };
        }]
    );

})(window.angular, window._);

/**
 * @file Guidance service
 * @copyright Digital Living Software Corp. 2014-2015
 */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipIntroGuidance.Service', ['pipReleaseIntroDialog']);

    /**
     * @ngdoc service
     * @name pipIntroGuidance.Service.pipGuidance
     *
     * @description
     * Service provides an interface to show introduction guide.
     *
     * @requires pipReleaseIntroDialog
     */
    thisModule.factory('pipGuidance', ['pipReleaseIntroDialog', 'pipSettingsData', 'pipGuidesData', '$rootScope', function (pipReleaseIntroDialog, pipSettingsData, pipGuidesData, $rootScope) {

        return {
            /** @see showIntroReleaseGuide */
            showIntroReleaseGuide: showIntroReleaseGuide,
            /** @see findIntroReleaseGuide */
            findIntroReleaseGuide: findIntroReleaseGuide,
            /** @see showIntroGuidance */
            showIntroGuidance: showIntroGuidance,
            /** @see showReleaseGuidance*/
            showReleaseGuidance: showReleaseGuidance
        };

        function showReleaseGuidance(filter) {
            pipGuidesData.readGuides({filter: filter}, function (guides) {
                guides = _.filter(guides, function (guide) {
                    return guide.type = 'new release' && guide.status === 'completed';
                });
                if (guides.length > 0) {
                    pipReleaseIntroDialog.show({
                        guide: guides[0],
                        settings: {},
                        settingsName: 'new release',
                        pipSettingsData: null,
                        admin: true,
                        ln: $rootScope.$language
                    });
                }
            })
        }

        function showIntroGuidance(filter) {
            pipGuidesData.readIntroGuides({filter: filter}, function (guides) {
                guides = _.filter(guides, function (guide) {
                    return guide.type = 'intro' && guide.status === 'completed';
                });
                if (guides.length > 0) {
                    pipReleaseIntroDialog.show({
                        guide: guides[0],
                        settings: {},
                        settingsName: 'intro',
                        pipSettingsData: null,
                        admin: true,
                        ln: $rootScope.$language
                    });
                }
            })
        }

        /**
         * @ngdoc method
         * @methodOf pipIntroGuidance.Service.pipGuidance
         * @name pipIntroGuidance.Service.pipGuidance:showIntroReleaseGuide
         *
         * @description
         * Shows introduction guide
         *
         * {@link https://github.com/pip-webui/pip-webui-guidance/blob/master/src/intro_guidance/intro_guidance_service.js#L51 View source}
         *
         * @param {Object} guide    Collection with intro information
         * @param {Object} settings Settings object
         * @param {boolean} admin   It is true when user has admin role
         * @param {string} ln       Tips content language
         * @param {Object} party    User's party object
         * @param {Object} user     User's profile
         *
         * @example
         * <pre>
         *     pipGuidance.showIntroReleaseGuide($scope.guide, $scope.settings, null, 'en', $rootScope.$party, $rootScope.$user);
         * </pre>
         */
        function showIntroReleaseGuide(guide, settings, admin, ln, party, user) {
            if (guide && party.id === user.id) {
                pipReleaseIntroDialog.show({
                    guide: guide,
                    settings: settings,
                    settingsName: guide.type === 'intro' ? 'intro' : 'release',
                    pipSettingsData: pipSettingsData,
                    admin: admin,
                    ln: ln
                });
            }
        }

        /**
         * @ngdoc method
         * @methodOf pipIntroGuidance.Service.pipGuidance
         * @name  pipIntroGuidance.Service.pipGuidance:findIntroReleaseGuide
         *
         * @description
         * Finds guideline due to passed settings options.
         *
         * {@link https://github.com/pip-webui/pip-webui-guidance/blob/master/src/intro_guidance/intro_guidance_service.js#80 View source}
         *
         * @param {Object} guides   Collection of guides
         * @param {Object} settings Guide options.
         *
         * @return {Object} Sorted guideline. Result is dependece on 'settings.intro' field. If it is existed than it returns
         * intro guide with 'completed' status.
         */
        function findIntroReleaseGuide(guides, settings) {
            var guidesSort;

            if (!settings.intro || !settings.intro.lastId) {
                // TODO [apidhirnyi] Make chaining for filter and sortBy
                guidesSort = _.filter(guides, function (guide) {
                    return guide.type === 'intro' && guide.status === 'completed';
                });

                guidesSort = _.sortBy(guidesSort, function (guide) {
                    return -new Date(guide.created).getTime();
                });

                return guidesSort[0];
            }

            guidesSort = _.filter(guides, function (guide) {
                return guide.type === 'new release' && guide.status === 'completed';
            });

            guidesSort = _.sortBy(guidesSort, function (guide) {
                return -new Date(guide.created).getTime();
            });

            if (!settings.intro.date || (guidesSort.length > 0 &&
                new Date(settings.intro.date) < new Date(guidesSort[0].created) &&
                guidesSort[0].id != settings.release.lastId)) {
                return guidesSort[0];
            }

            return null;
        }
    }]);

})(window.angular, window._);



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

    config.$inject = ['pipStateProvider'];
    HelpPageController.$inject = ['$rootScope', '$scope', '$state', 'pipAppBar', 'pipHelp'];
    angular.module('pipHelp.Page', ['pipState', 'pipHelp.Service', 'pipAppBar', 'pipSelected', 'pipTranslate',
        'pipHelp.Templates'])
        .config(config)
        .controller('pipHelpPageController', HelpPageController);

    function config(pipStateProvider) {
        pipStateProvider.state('help', {
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
     * This module requires the 'pipState' module.
     *
     * @requires pipState
     */
    angular.module('pipHelp.Service', ['pipState'])
        .provider('pipHelp',
            ['pipAuthStateProvider', function (pipAuthStateProvider) {
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

                    pipAuthStateProvider.state(getFullStateName(tabObj.state), tabObj.stateConfig);

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

                    pipAuthStateProvider.redirect('help', getFullStateName(name));
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
