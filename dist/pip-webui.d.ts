declare module pip.services {

export let IdentityRootVar: string;
export let IdentityChangedEvent: string;
export interface IIdentity {
    id: string;
    full_name: string;
    details: string;
    email: string;
    photo_url: string;
    groups: string[];
}
export interface IIdentityService {
    identity: any;
}
export interface IIdentityProvider extends ng.IServiceProvider {
    setRootVar: boolean;
    identity: any;
}


export const SessionRootVar = "$session";
export const SessionOpenedEvent = "pipSessionOpened";
export const SessionClosedEvent = "pipSessionClosed";
export interface ISessionService {
    session: any;
    isOpened(): boolean;
    open(session: any): void;
    close(): void;
}
export interface ISessionProvider extends ng.IServiceProvider {
    setRootVar: boolean;
    session: any;
}

export let CurrentState: any;
export let PreviousState: any;


let RedirectedStates: any;
function decorateRedirectStateProvider($delegate: any): any;
function addRedirectStateProviderDecorator($provide: any): void;
function decorateRedirectStateService($delegate: any, $timeout: any): any;
function addRedirectStateDecorator($provide: any): void;

export let RoutingVar: string;


function translateDirective(pipTranslate: any): ng.IDirective;
function translateHtmlDirective(pipTranslate: any): ng.IDirective;

function translateFilter(pipTranslate: any): (key: any) => any;
function optionalTranslateFilter($injector: any): (key: any) => any;

export let LanguageRootVar: string;
export let LanguageChangedEvent: string;
export interface ITranslateService {
    language: string;
    use(language: string): string;
    setTranslations(language: string, translations: any): void;
    translations(language: string, translations: any): void;
    translate(key: string): string;
    translateArray(keys: string[]): string[];
    translateSet(keys: string[], keyProp: string, valueProp: string): any[];
    translateObjects(items: any[], keyProp: string, valueProp: string): any[];
    translateWithPrefix(prefix: string, key: string): any;
    translateSetWithPrefix(prefix: string, keys: string[], keyProp: string, valueProp: string): any;
    translateSetWithPrefix2(prefix: string, keys: string[], keyProp: string, valueProp: string): any;
}
export interface ITranslateProvider extends ITranslateService, ng.IServiceProvider {
}

export class Translation {
    protected _language: string;
    protected _translations: {
        en: {
            'en': string;
            'ru': string;
            'es': string;
            'pt': string;
            'de': string;
            'fr': string;
        };
        ru: {
            'en': string;
            'ru': string;
            'es': string;
            'pt': string;
            'de': string;
            'fr': string;
        };
    };
    constructor();
    language: string;
    use(language: string): string;
    setTranslations(language: string, translations: any): void;
    translations(language: string, translations: any): void;
    translate(key: string): string;
    translateArray(keys: string[]): string[];
    translateSet(keys: string[], keyProp: string, valueProp: string): any[];
    translateObjects(items: any[], keyProp: string, valueProp: string): any[];
    translateWithPrefix(prefix: string, key: string): any;
    translateSetWithPrefix(prefix: string, keys: string[], keyProp: string, valueProp: string): any[];
    translateSetWithPrefix2(prefix: string, keys: string[], keyProp: string, valueProp: string): any[];
}


export class Transaction {
    private _scope;
    private _id;
    private _operation;
    private _error;
    private _progress;
    constructor(scope: string);
    readonly scope: string;
    readonly id: string;
    readonly operation: string;
    readonly progress: number;
    readonly error: TransactionError;
    readonly errorMessage: string;
    reset(): void;
    busy(): boolean;
    failed(): boolean;
    aborted(id: string): boolean;
    begin(operation: string): string;
    update(progress: number): void;
    abort(): void;
    end(error?: any): void;
}

export class TransactionError {
    code: string;
    message: string;
    details: any;
    cause: string;
    stack_trace: string;
    constructor(error?: any);
    reset(): void;
    empty(): boolean;
    decode(error: any): void;
}

export interface ITransactionService {
    create(scope?: string): Transaction;
    get(scope?: string): Transaction;
}

function configureTransactionStrings($injector: any): void;

export interface ICodes {
    hash(value: string): number;
    verification(): string;
}

export interface IFormat {
    sample(value: string, maxLength: number): string;
    sprintf(message: string, ...args: any[]): string;
}


export let ResetPageEvent: string;
export let ResetAreaEvent: string;
export let ResetRootVar: string;
export let ResetAreaRootVar: string;
export interface IPageResetService {
    reset(): void;
    resetArea(area: string): void;
}

export interface IScrollService {
    scrollTo(parentElement: any, childElement: any, animationDuration: any): void;
}

export interface ISystemInfo {
    browserName: string;
    browserVersion: string;
    platform: string;
    os: string;
    isDesktop(): boolean;
    isMobile(): boolean;
    isCordova(): boolean;
    isSupported(supported?: any): boolean;
}

export interface ITags {
    normalizeOne(tag: string): string;
    compressOne(tag: string): string;
    equal(tag1: string, tag2: string): boolean;
    normalizeAll(tags: any): string[];
    compressAll(tags: any): string[];
    extract(entity: any, searchFields?: string[]): string[];
}

export interface ITimerService {
    isStarted(): boolean;
    addEvent(event: string, timeout: number): void;
    removeEvent(event: string): void;
    clearEvents(): void;
    start(): void;
    stop(): void;
}

}

declare module pip.buttons {

class FabTooltipVisibilityController {
    private _element;
    private _scope;
    private _timeout;
    constructor($mdMedia: angular.material.IMedia, $element: any, $attrs: angular.IAttributes, $scope: angular.IScope, $timeout: ng.ITimeoutService, $parse: any);
}




}

declare module pip.landing {

}

declare module pip.layouts {



export let AuxPanelChangedEvent: string;
export let AuxPanelStateChangedEvent: string;
export let OpenAuxPanelEvent: string;
export let CloseAuxPanelEvent: string;
export class AuxPanelConfig {
    parts: any;
    classes: string[];
    state: any;
    type: string;
}
export interface IAuxPanelService {
    readonly config: AuxPanelConfig;
    readonly classes: string[];
    parts: any;
    state: any;
    isOpen(): boolean;
    open(): void;
    close(): void;
    toggle(): void;
    addClass(...classes: string[]): void;
    removeClass(...classes: string[]): void;
    part(part: string, value: any): void;
}
export interface IAuxPanelProvider extends ng.IServiceProvider {
    config: AuxPanelConfig;
    parts: any;
    type: string;
    classes: string[];
    open(): void;
    close(): void;
    toggle(): void;
    addClass(...classes: string[]): void;
    removeClass(...classes: string[]): void;
    part(part: string, value: any): void;
}









export class MediaBreakpoints {
    constructor(xs: number, sm: number, md: number, lg: number);
    xs: number;
    sm: number;
    md: number;
    lg: number;
}
export class MediaBreakpointStatuses {
    width: number;
    'xs': boolean;
    'gt-xs': boolean;
    'sm': boolean;
    'gt-sm': boolean;
    'md': boolean;
    'gt-md': boolean;
    'lg': boolean;
    'gt-lg': boolean;
    'xl': boolean;
    update(breakpoints: MediaBreakpoints, width: number): void;
}
export let MainResizedEvent: string;
export let LayoutResizedEvent: string;
export let MainBreakpoints: MediaBreakpoints;
export let MainBreakpointStatuses: MediaBreakpointStatuses;
export interface IMediaService {
    (breakpoint: string): boolean;
    breakpoints: MediaBreakpoints;
    width: number;
}
export interface IMediaProvider extends ng.IServiceProvider {
    breakpoints: MediaBreakpoints;
}

export function addResizeListener(element: any, listener: any): void;
export function removeResizeListener(element: any, listener: any): void;

}

declare module pip.split {

}

declare module pip.behaviors {






export class ShortcutOption {
    Type: KeyboardEvent;
    Propagate: boolean;
    DisableInInput: boolean;
    Target: any;
    Keycode: number;
}
export class KeyboardEvent {
    static Keydown: string;
    static Keyup: string;
    static Keypress: string;
}
export class KeyboardShortcut {
    private shift_nums;
    private special_keys;
    private modifiers;
    eventCallback: Function;
    target: any;
    event: KeyboardEvent;
    option: ShortcutOption;
    shorcut: string;
    callback: Function;
    constructor(element: any, shorcutCombination: string, option: ShortcutOption, callback: (e?: JQueryEventObject) => void);
}

export interface IKeyboardShortcuts {
    [key: string]: KeyboardShortcut;
}
export interface IShortcutsRegisterService {
    add(shorcutName: string, callback: () => void, options: ShortcutOption): void;
    remove(shorcutName: string): void;
    shorcuts: IKeyboardShortcuts;
}
export interface IShortcutsRegisterProvider extends ng.IServiceProvider {
    option: ShortcutOption;
}
export class ShortcutsRegister implements IShortcutsRegisterService {
    private _log;
    private _defaultOption;
    private _shortcuts;
    constructor($log: ng.ILogService, option: ShortcutOption);
    private getDefaultOption();
    private checkAddShortcut(element, shorcutCombination, callback);
    readonly shorcuts: IKeyboardShortcuts;
    add(shorcutName: string, callback: (e: JQueryEventObject) => void, option: ShortcutOption): void;
    remove(shorcutName: string): void;
}


export let ShortcutsChangedEvent: string;
export class ShortcutItem {
    shortcut: string;
    target?: any;
    targetId?: string;
    access?: (event: JQueryEventObject) => boolean;
    href?: string;
    url?: string;
    state?: string;
    stateParams?: any;
    event?: string;
    keypress?: (event: JQueryEventObject) => void;
    options?: ShortcutOption;
}
export class ShortcutsConfig {
    globalShortcuts: ShortcutItem[];
    localShortcuts: ShortcutItem[];
    defaultOptions: ShortcutOption;
}
export interface IShortcutsService {
    readonly config: ShortcutsConfig;
    globalShortcuts: ShortcutItem[];
    localShortcuts: ShortcutItem[];
    on(globalShortcuts?: ShortcutItem[], localShortcuts?: ShortcutItem[]): void;
    onLocal(localShortcuts?: ShortcutItem[]): void;
    off(): void;
}
export interface IShortcutsProvider extends ng.IServiceProvider {
    config: ShortcutsConfig;
    globalShortcuts: ShortcutItem[];
    localShortcuts: ShortcutItem[];
    defaultOptions: ShortcutOption;
}


}

declare module pip.controls {

export interface IColorPicker {
    class: string;
    colors: string[];
    currentColor: string;
    currentColorIndex: number;
    ngDisabled: Function;
    colorChange: Function;
    enterSpacePress(event: any): void;
    disabled(): boolean;
    selectColor(index: number): any;
}
export class ColorPickerController implements IColorPicker {
    private _$timeout;
    private _$scope;
    class: string;
    colors: string[];
    currentColor: string;
    currentColorIndex: number;
    ngDisabled: Function;
    colorChange: Function;
    constructor($scope: ng.IScope, $element: any, $attrs: any, $timeout: any);
    disabled(): boolean;
    selectColor(index: number): void;
    enterSpacePress(event: any): void;
}


class pipImageSliderController {
    private _$attrs;
    private _$interval;
    private _blocks;
    private _index;
    private _newIndex;
    private _direction;
    private _type;
    private DEFAULT_INTERVAL;
    private _interval;
    private _timePromises;
    private _throttled;
    swipeStart: number;
    sliderIndex: number;
    slideTo: Function;
    constructor($scope: ng.IScope, $element: any, $attrs: any, $parse: ng.IParseService, $timeout: angular.ITimeoutService, $interval: angular.IIntervalService, $pipImageSlider: any);
    nextBlock(): void;
    prevBlock(): void;
    slideToPrivate(nextIndex: number): void;
    private setIndex();
    private startInterval();
    private stopInterval();
    private restartInterval();
}

interface IImageSliderService {
    registerSlider(sliderId: string, sliderScope: any): void;
    removeSlider(sliderId: string): void;
    getSliderScope(sliderId: string): any;
    nextCarousel(nextBlock: any, prevBlock: any): void;
    prevCarousel(nextBlock: any, prevBlock: any): void;
    toBlock(type: string, blocks: any[], oldIndex: number, nextIndex: number, direction: string): void;
}
class ImageSliderService {
    private _$timeout;
    private ANIMATION_DURATION;
    private _sliders;
    constructor($timeout: angular.ITimeoutService);
    registerSlider(sliderId: string, sliderScope: any): void;
    removeSlider(sliderId: string): void;
    getSliderScope(sliderId: string): any;
    nextCarousel(nextBlock: any, prevBlock: any): void;
    prevCarousel(nextBlock: any, prevBlock: any): void;
    toBlock(type: string, blocks: any[], oldIndex: number, nextIndex: number, direction: string): void;
}



var marked: any;

export class PopoverController {
    private _$timeout;
    private _$scope;
    timeout: any;
    backdropElement: any;
    content: any;
    element: any;
    calcH: boolean;
    templateUrl: any;
    template: any;
    cancelCallback: Function;
    constructor($scope: ng.IScope, $rootScope: any, $element: any, $timeout: any, $compile: any);
    backdropClick(): void;
    closePopover(): void;
    onPopoverClick($e: any): void;
    private init();
    private position();
    private onResize();
    private calcHeight();
}

export class PopoverService {
    private _$timeout;
    private _$scope;
    private _$compile;
    private _$rootScope;
    popoverTemplate: string;
    constructor($compile: any, $rootScope: any, $timeout: any);
    show(p: any): void;
    hide(): void;
    resize(): void;
}

class RoutingController {
    private _image;
    logoUrl: string;
    showProgress: Function;
    constructor($scope: ng.IScope, $element: any);
    loadProgressImage(): void;
}

interface IPipToast {
    type: string;
    id: string;
    error: any;
    message: string;
    actions: string[];
    duration: number;
    successCallback: Function;
    cancelCallback: Function;
}
class ToastController {
    private _$mdToast;
    private _pipErrorDetailsDialog;
    message: string;
    actions: string[];
    toast: IPipToast;
    actionLenght: number;
    showDetails: boolean;
    constructor($mdToast: angular.material.IToastService, toast: IPipToast, $injector: any);
    onDetails(): void;
    onAction(action: any): void;
}
interface IToastService {
    showNextToast(): void;
    showToast(toast: IPipToast): void;
    addToast(toast: any): void;
    removeToasts(type: string): void;
    getToastById(id: string): IPipToast;
    removeToastsById(id: string): void;
    onClearToasts(): void;
    showNotification(message: string, actions: string[], successCallback: any, cancelCallback: any, id: string): any;
    showMessage(message: string, successCallback: any, cancelCallback: any, id?: string): any;
    showError(message: string, successCallback: any, cancelCallback: any, id: string, error: any): any;
    hideAllToasts(): void;
    clearToasts(type?: string): any;
}
class ToastService implements IToastService {
    private SHOW_TIMEOUT;
    private SHOW_TIMEOUT_NOTIFICATIONS;
    private toasts;
    private currentToast;
    private sounds;
    private _$mdToast;
    constructor($rootScope: ng.IRootScopeService, $mdToast: angular.material.IToastService);
    showNextToast(): void;
    showToast(toast: IPipToast): void;
    private showToastCancelResult(action);
    private showToastOkResult(action);
    addToast(toast: any): void;
    removeToasts(type: string): void;
    removeToastsById(id: string): void;
    getToastById(id: string): IPipToast;
    onStateChangeSuccess(): void;
    onClearToasts(): void;
    showNotification(message: string, actions: string[], successCallback: any, cancelCallback: any, id: string): void;
    showMessage(message: string, successCallback: any, cancelCallback: any, id?: string): void;
    showError(message: string, successCallback: any, cancelCallback: any, id: string, error: any): void;
    hideAllToasts(): void;
    clearToasts(type?: string): void;
}

}

declare module pip.lists {



}

declare module pip.dates {



function formatTimeFilter(pipDateTime: any): (value: any, format: string) => string;
function formatDateOptionalFilter(pipDateTime: any): (value: any, format: string) => string;
function formatLongDateFilter(pipDateTime: any): (value: any) => string;
function formatShortDateFilter(pipDateTime: any): (value: any) => string;
function formatMiddleDateFilter(pipDateTime: any): (value: any) => string;
function formatMonthFilter(pipDateTime: any): (value: any) => any;
function formatLongMonthFilter(pipDateTime: any): (value: any) => string;
function formatYearFilter(pipDateTime: any): (value: any) => string;
function formatWeekFilter(pipDateTime: any): (value: any) => string;
function formatShortWeekFilter(pipDateTime: any): (value: any) => string;
function formatShortDateTimeFilter(pipDateTime: any): (value: any) => string;
function formatMiddleDateTimeFilter(pipDateTime: any): (value: any) => string;
function formatLongDateTimeFilter(pipDateTime: any): (value: any) => string;
function formatShortDateLongTimeFilter(pipDateTime: any): (value: any, firstTime: boolean) => string;
function formatMiddleDateLongTimeFilter(pipDateTime: any): (value: any, firstTime: boolean) => string;
function formatLongDateLongTimeFilter(pipDateTime: any): (value: any, firstTime: boolean) => string;
function bbFormatDateLongTimeFilter(pipDateTime: any): (value: any, firstTime: boolean) => string;
function formatFullDateTimeFilter(pipDateTime: any): (value: any) => string;
function formatShortTimeFilter(pipDateTime: any): (value: any) => string;
function formatLongTimeFilter(pipDateTime: any): (value: any) => string;
function formatShortDayOfWeekFilter(pipDateTime: any): (value: any) => string;
function formatLongDayOfWeekFilter(pipDateTime: any): (value: any) => string;
function formatLongMonthDayFilter(pipDateTime: any): (value: any) => string;
function formatShortMonthDayFilter(pipDateTime: any): (value: any) => string;
function formatDateRangeFilter(pipDateTime: any): (value1: any, value2: any) => string;
function formatDateTimeRangeFilter(pipDateTime: any): (value1: any, value2: any) => string;
function formatISOWeekFilter(pipDateTime: any): (value: any) => string;
function formatShortISOWeekFilter(pipDateTime: any): (value: any) => string;
function formatISOWeekOrdinalFilter(pipDateTime: any): (value: any) => string;
function formatDateYFilter(pipDateTime: any): (value: any) => string;
function formatLongDateYFilter(pipDateTime: any): (value: any) => string;
function formatTodayDateLongTimeLongFilter(pipDateTime: any): (value: any) => string;
function formatTodayDateShortTimeLongFilter(pipDateTime: any): (value: any) => string;
function formatTodayDateLongTimeShortFilter(pipDateTime: any): (value: any) => string;
function formatTodayDateShortTimeShortFilter(pipDateTime: any): (value: any) => string;
function formatMillisecondsToSecondsFilter(pipDateTime: any): (value: any) => string;
function formatElapsedIntervalFilter(pipDateTime: any): (value: any, start: any) => string;
function getDateJSONFilter(pipDateTime: any): (value: any) => string;

export class DateTimeConfig {
    timeZone: number;
}
export interface IDateTimeService {
    readonly config: DateTimeConfig;
    useTimeZone(offset: number): any;
    bbFormatDateLongTime(value: any, firstTime?: boolean): string;
    formatTime(value: any, format: string): string;
    formatDateOptional(value: any, format: string): string;
    formatShortDate(value: any): string;
    formatMiddleDate(value: any): string;
    formatLongDate(value: any): string;
    formatMonth(value: any): string;
    formatLongMonth(value: any): string;
    formatYear(value: any): string;
    formatWeek(value: any): string;
    formatShortWeek(value: any): string;
    formatShortDateTime(value: any): string;
    formatMiddleDateTime(value: any): string;
    formatLongDateTime(value: any): string;
    formatFullDateTime(value: any): string;
    formatShortDateLongTime(value: any, firstTime?: boolean): string;
    formatMiddleDateLongTime(value: any, firstTime?: boolean): string;
    formatLongDateLongTime(value: any, firstTime?: boolean): string;
    formatShortTime(value: any): string;
    formatLongTime(value: any): string;
    formatShortDayOfWeek(value: any): string;
    formatLongDayOfWeek(value: any): string;
    formatLongMonthDay(value: any): string;
    formatShortMonthDay(value: any): string;
    formatDateRange(value1: any, value2: any): string;
    formatDateTimeRange(value1: any, value2: any): string;
    formatISOWeek(value: any): string;
    formatShortISOWeek(value: any): string;
    formatISOWeekOrdinal(value: any): string;
    formatDateY(value: any): string;
    formatLongDateY(value: any): string;
    formatTodayDateLongTimeLong(value: any): string;
    formatTodayDateShortTimeLong(value: any): string;
    formatTodayDateLongTimeShort(value: any): string;
    formatTodayDateShortTimeShort(value: any): string;
    formatMillisecondsToSeconds(value: any): string;
    formatElapsedInterval(value: any, start: any): string;
    getDateJSON(date: any): string;
    getNextStart(value: any, category: string): any;
    getPrevStart(value: any, category: string): any;
    getNowStart(category: string): any;
    addHours(value: any, hours: number): any;
    toStartDay(value: any): any;
    toEndDay(value: any, offset: number): any;
    toStartWeek(value: any): any;
    toEndWeek(value: any, offset: number): any;
    toStartMonth(value: any): any;
    toEndMonth(value: any, offset: number): any;
    toStartYear(value: any): any;
    toEndYear(value: any, offset: number): any;
}
export interface IDateTimeProvider extends IDateTimeService, ng.IServiceProvider {
}




}

declare module pip.dialogs {

export class ConfirmationParams {
    ok: string;
    title: string;
    cancel: string;
    event: any;
}
export class ConfirmationDialogController {
    $mdDialog: angular.material.IDialogService;
    theme: string;
    config: ConfirmationParams;
    constructor($mdDialog: angular.material.IDialogService, $injector: any, $rootScope: ng.IRootScopeService, params: ConfirmationParams);
    onOk(): void;
    onCancel(): void;
}

export interface IConfirmationService {
    show(params: ConfirmationParams, successCallback?: () => void, cancelCallback?: () => void): any;
}




export class InformationStrings {
    ok: string;
    title: string;
    message: string;
    error: string;
    content: any;
}
export class InformationParams {
    ok: string;
    title: string;
    message: string;
    error: string;
    item: any;
}
export class InformationDialogController {
    $mdDialog: angular.material.IDialogService;
    theme: string;
    config: InformationStrings;
    constructor($mdDialog: angular.material.IDialogService, $injector: any, $rootScope: ng.IRootScopeService, params: InformationParams);
    onOk(): void;
    onCancel(): void;
}

export interface IInformationService {
    show(params: any, successCallback?: () => void, cancelCallback?: () => void): any;
}

export class ErrorStrings {
    ok: string;
    cancel: string;
    errorDetails: string;
    dismissButton: string;
    errorMessage: string;
    errorCode: string;
    errorMethod: string;
    errorPath: string;
    error: string;
    errorText: string;
}
export class ErrorParams {
    ok: string;
    cancel: string;
    error: string;
}
export class ErrorDetailsDialogController {
    $mdDialog: any;
    theme: any;
    config: ErrorStrings;
    constructor($mdDialog: any, $injector: any, $rootScope: any, params: ErrorParams);
    onOk(): void;
    onCancel(): void;
}

class ErrorDetailsService {
    _mdDialog: angular.material.IDialogService;
    constructor($mdDialog: angular.material.IDialogService);
    show(params: any, successCallback: any, cancelCallback: any): void;
}



export class OptionsBigData {
    name: string;
    title: string;
    subtitle: string;
}
export class OptionsBigParams {
    title: string;
    applyButtonTitle: string;
    options: OptionsBigData[];
    selectedOption: OptionsBigData;
    deleted: any;
    selectedOptionName: string;
    deletedTitle: string;
    hint: string;
    noTitle: boolean;
    noActions: boolean;
    optionIndex: number;
}
export interface IOptionsBigDialogController {
    onOk(): void;
    onCancel(): void;
    onKeyUp(event: any, index: any): void;
    onOptionSelect(event: any, option: any): any;
    onSelected(): void;
    onSelect: Function;
    config: OptionsBigParams;
    theme: string;
}
export class OptionsBigDialogController implements IOptionsBigDialogController {
    private $mdDialog;
    theme: string;
    config: OptionsBigParams;
    constructor($mdDialog: angular.material.IDialogService, $injector: any, $rootScope: ng.IRootScopeService, params: OptionsBigParams);
    onOk(): void;
    onCancel(): void;
    onOptionSelect(event: any, option: any): void;
    onSelected(): void;
    onKeyUp(event: any, index: any): void;
    onSelect: () => void;
    private focusInput();
}

export interface IOptionsBigService {
    show(params: any, successCallback?: (option) => void, cancelCallback?: () => void): any;
}

export class OptionsData {
    icon: string;
    name: string;
    title: string;
    active: boolean;
}
export class OptionsParams {
    title: string;
    applyButtonTitle: string;
    options: OptionsData[];
    selectedOption: OptionsData;
    deleted: any;
    selectedOptionName: string;
    deletedTitle: string;
}
export class OptionsDialogController {
    $mdDialog: angular.material.IDialogService;
    theme: string;
    config: OptionsParams;
    constructor($mdDialog: angular.material.IDialogService, $injector: any, $rootScope: ng.IRootScopeService, params: OptionsParams);
    onOk(): void;
    onCancel(): void;
    onOptionSelect(event: any, option: OptionsData): void;
    onKeyPress(event: any): void;
    onSelect(): void;
    private focusInput();
}

export interface IOptionsService {
    show(params: any, successCallback?: (option) => void, cancelCallback?: () => void): any;
}

}

declare module pip.nav {

export let ActionsChangedEvent: string;
export let SecondaryActionsOpenEvent: string;
export class SimpleActionItem {
    name: string;
    title?: string;
    divider?: boolean;
    icon?: string;
    count?: number;
    access?: (action: SimpleActionItem) => boolean;
    breakpoints?: string[];
    href?: string;
    url?: string;
    state?: string;
    stateParams?: any;
    event?: string;
    click?: (action: SimpleActionItem) => void;
}
export class ActionItem extends SimpleActionItem {
    subActions: SimpleActionItem[];
}
export class ActionsConfig {
    primaryGlobalActions: ActionItem[];
    primaryLocalActions: ActionItem[];
    secondaryGlobalActions: ActionItem[];
    secondaryLocalActions: ActionItem[];
}
export interface IActionsService {
    readonly config: ActionsConfig;
    primaryGlobalActions: ActionItem[];
    primaryLocalActions: ActionItem[];
    secondaryGlobalActions: ActionItem[];
    secondaryLocalActions: ActionItem[];
    show(primaryActions?: ActionItem[], secondaryActions?: ActionItem[]): void;
    hide(): void;
    updateCount(link: string, count: number): void;
    clearCounts(): void;
    openMenuEvent(): void;
}
export interface IActionsProvider extends ng.IServiceProvider {
    config: ActionsConfig;
    primaryGlobalActions: ActionItem[];
    primaryLocalActions: ActionItem[];
    secondaryGlobalActions: ActionItem[];
    secondaryLocalActions: ActionItem[];
}





export let BreadcrumbChangedEvent: string;
export let BreadcrumbBackEvent: string;
export class BreadcrumbItem {
    title: string;
    click?: (item: BreadcrumbItem) => void;
    subActions?: SimpleActionItem[];
}
export class BreadcrumbConfig {
    text: string;
    items: BreadcrumbItem[];
    criteria: string;
}
export interface IBreadcrumbService {
    config: BreadcrumbConfig;
    text: string;
    items: BreadcrumbItem[];
    criteria: string;
    showText(text: string, criteria?: string): any;
    showItems(items: BreadcrumbItem[], criteria?: string): any;
}
export interface IBreadcrumbProvider extends ng.IServiceProvider {
    text: string;
}




export let AppBarChangedEvent: string;
export class AppBarConfig {
    visible: boolean;
    parts: any;
    classes: string[];
}
export interface IAppBarService {
    readonly config: AppBarConfig;
    readonly classes: string[];
    parts: any;
    show(parts?: any, classes?: string[], shadowBreakpoints?: string[]): void;
    hide(): void;
    addShadow(...breakpoints: string[]): void;
    removeShadow(): void;
    addClass(...classes: string[]): void;
    removeClass(...classes: string[]): void;
    part(part: string, value: any): void;
}
export interface IAppBarProvider extends ng.IServiceProvider {
    config: AppBarConfig;
    parts: any;
    classes: string[];
    addClass(...classes: string[]): void;
    removeClass(...classes: string[]): void;
    part(part: string, value: any): void;
}


export interface INavService {
    appbar: IAppBarService;
    icon: INavIconService;
    breadcrumb: IBreadcrumbService;
    actions: IActionsService;
    search: ISearchService;
    sidenav: ISideNavService;
    header: INavHeaderService;
    menu: INavMenuService;
    reset(): void;
}





export let NavHeaderChangedEvent: string;
export class NavHeaderConfig {
    imageUrl: string;
    defaultImageUrl: string;
    title: string;
    subtitle: string;
    click: () => void;
    event: string;
}
export interface INavHeaderService {
    readonly config: NavHeaderConfig;
    imageUrl: string;
    title: string;
    subtitle: string;
    click: () => void;
    event: string;
    show(title: string, subtitle: string, imageUrl: string, callbackOrEvent?: any): void;
    hide(): void;
}
export interface INavHeaderProvider extends ng.IServiceProvider {
    config: NavHeaderConfig;
    defaultImageUrl: string;
    imageUrl: string;
    title: string;
    subtitle: string;
    click: () => void;
    event: string;
    set(title: string, subtitle: string, imageUrl: string, callbackOrEvent?: any): void;
    clear(): void;
}



export let NavIconChangedEvent: string;
export class NavIconConfig {
    type: string;
    imageUrl: string;
    icon: string;
    click: () => void;
    event: string;
}
export interface INavIconService {
    readonly config: NavIconConfig;
    showMenu(callbackOrEvent?: any): void;
    showIcon(icon: string, callbackOrEvent?: any): void;
    showBack(callbackOrEvent?: any): void;
    showImage(imageUrl: string, callbackOrEvent?: any): void;
    hide(): void;
}
export interface INavIconProvider extends ng.IServiceProvider {
    config: NavIconConfig;
    setMenu(callbackOrEvent?: any): void;
    setIcon(icon: string, callbackOrEvent?: any): void;
    setBack(callbackOrEvent?: any): void;
    setImage(imageUrl: string, callbackOrEvent?: any): void;
    clear(): void;
}



export let NavMenuChangedEvent: string;
export class NavMenuLink {
    name: string;
    title: string;
    tooltipText?: string;
    icon?: string;
    count?: number;
    badgeStyle?: string;
    access?: (link: NavMenuLink) => boolean;
    href?: string;
    url?: string;
    state?: string;
    stateParams?: any;
    parentState?: string;
    event?: string;
    click?: (link: NavMenuLink) => void;
}
export class NavMenuSection {
    name: string;
    title?: string;
    tooltipText?: string;
    icon?: string;
    links: NavMenuLink[];
    access?: (section: NavMenuSection) => boolean;
}
export class NavMenuConfig {
    sections: NavMenuSection[];
    defaultIcon: string;
}
export interface INavMenuService {
    sections: NavMenuSection[];
    defaultIcon: string;
    updateCount(link: string, count: number): void;
    updateBadgeStyle(link: string, style: string): void;
    clearCounts(): void;
}
export interface INavMenuProvider extends ng.IServiceProvider {
    sections: NavMenuSection[];
    defaultIcon: string;
}




export let OpenSearchEvent: string;
export let CloseSearchEvent: string;
export let SearchChangedEvent: string;
export let SearchActivatedEvent: string;
export class SearchConfig {
    visible: boolean;
    criteria: string;
    params: any;
    history: string[];
    callback: (criteria: string) => void;
}
export interface ISearchService {
    config: SearchConfig;
    criteria: string;
    params: any;
    history: string[];
    callback: (criteria: string) => void;
    set(callback: (criteria: string) => void, criteria?: string, params?: any, history?: string[]): void;
    clear(): void;
    open(): void;
    close(): void;
    toggle(): void;
}
export interface ISearchProvider extends ng.IServiceProvider {
}




export let SideNavChangedEvent: string;
export let SideNavStateChangedEvent: string;
export let OpenSideNavEvent: string;
export let CloseSideNavEvent: string;
export class SideNavConfig {
    parts: any;
    classes: string[];
    state: any;
    type: string;
    visible: boolean;
}
export interface ISideNavService {
    readonly config: SideNavConfig;
    readonly classes: string[];
    parts: any;
    state: any;
    open(): void;
    close(): void;
    toggle(): void;
    show(): void;
    hide(): void;
    addClass(...classes: string[]): void;
    removeClass(...classes: string[]): void;
    part(part: string, value: any): void;
}
export interface ISideNavProvider extends ng.IServiceProvider {
    config: SideNavConfig;
    parts: any;
    type: string;
    visible: boolean;
    classes: string[];
    addClass(...classes: string[]): void;
    removeClass(...classes: string[]): void;
    part(part: string, value: any): void;
}


}

declare module pip.themes {

function configureBootBarnCoolTheme($mdThemingProvider: ng.material.IThemingProvider): void;

function configureBootBarnMonochromeTheme($mdThemingProvider: ng.material.IThemingProvider): void;

function configureBootBarnWarmTheme($mdThemingProvider: any): void;



export let ThemeRootVar: string;
export let ThemeChangedEvent: string;
export let ThemeResetPage: string;
export interface IThemeService {
    theme: string;
    use(language: string): string;
}
export interface IThemeProvider extends IThemeService, ng.IServiceProvider {
    setRootVar: boolean;
    persist: boolean;
}

function configureDefaultAmberTheme($mdThemingProvider: ng.material.IThemingProvider): void;

function configureDefaultBlackTheme($mdThemingProvider: ng.material.IThemingProvider): void;

function configureDefaultBlueTheme($mdThemingProvider: ng.material.IThemingProvider): void;

function configureDefaultGreenTheme($mdThemingProvider: ng.material.IThemingProvider): void;

function configureDefaultGreyTheme($mdThemingProvider: ng.material.IThemingProvider): void;

function configureDefaultNavyTheme($mdThemingProvider: ng.material.IThemingProvider): void;

function configureDefaultOrangeTheme($mdThemingProvider: ng.material.IThemingProvider): void;

function configureDefaultPinkTheme($mdThemingProvider: ng.material.IThemingProvider): void;


}

declare module pip.errors {







export class ErrorStateItem {
    Active: boolean;
    Name: string;
    Event: string;
    Title: string;
    SubTitle: String;
    Breadcrumb: string;
    Image: string;
    Params?: any;
}
export class pipErrorsConfig {
    Maintenance: ErrorStateItem;
    MissingRoute: ErrorStateItem;
    NoConnection: ErrorStateItem;
    Unknown: ErrorStateItem;
    Unsupported: ErrorStateItem;
}
export interface IpipErrorsService {
    getErrorItemByKey(errorName: string): ErrorStateItem;
    config: pipErrorsConfig;
}
export interface IpipErrorsProvider extends ng.IServiceProvider {
    configureErrorByKey(errorName: string, errorParams: ErrorStateItem): void;
    configureErrors(value: pipErrorsConfig): void;
}







}

declare module pip.charts {





}

declare module pip.locations {



class LocationDialogService {
    private _$mdDialog;
    constructor($mdDialog: angular.material.IDialogService);
    show(params: any, successCallback: any, cancelCallback: any): void;
}
class LocationEditDialogController {
    private _map;
    private _marker;
    private _$scope;
    private _$mdDialog;
    theme: string;
    locationPos: any;
    locationName: any;
    supportSet: boolean;
    constructor($scope: ng.IScope, $rootScope: ng.IRootScopeService, $timeout: angular.ITimeoutService, $mdDialog: angular.material.IDialogService, locationPos: any, locationName: any);
    createMarker(coordinates: any): any;
    changeLocation(coordinates: any, tid: any): void;
    onAddPin(): void;
    onRemovePin(): void;
    onZoomIn(): void;
    onZoomOut(): void;
    onSetLocation: () => void;
    onCancel(): void;
    onApply(): void;
}

let google: any;



}

declare module pip.files {


export interface IFileProgressController {
    name: string;
    type: string;
    globalProgress(): string;
    localProgress(): number;
    onCancel(): void;
    onCancel(): void;
    abort(): void;
}
export class FileProgressController implements IFileProgressController {
    private _service;
    private _cancel;
    private _retry;
    name: string;
    type: string;
    constructor($scope: ng.IScope, pipFileSelect: IFileSelectService);
    globalProgress(): string;
    errorFail(): string;
    localProgress(): number;
    onCancel(): void;
    onRetry(): void;
    abort(): void;
}

export interface IFileSelectController {
    localFile: any;
    onUploadButtonClick(): void;
    onDeleteButtonClick(): void;
}
export class FileSelectController implements IFileSelectController {
    localFile: any;
    constructor($scope: ng.IScope);
    onUploadButtonClick(): void;
    onDeleteButtonClick(): void;
}

export class GlobalProgress {
    static All: string[];
    static Start: string;
    static Upload: string;
    static Fail: string;
}
export interface IFileSelectService {
    progress: number;
    globalProgress: string;
    error: string;
    transaction: any;
    upload(url: string, file: any, callback?: (data: any, err: any) => void): void;
    abort(): void;
}
export class FileSelectService implements IFileSelectService {
    private _http;
    progress: number;
    globalProgress: string;
    error: string;
    transaction: any;
    constructor($http: ng.IHttpService, pipTransaction: any);
    upload(url: string, file: any, callback?: (data: any, err: any) => void): void;
    abort(): void;
}

}

declare module pip.dashboard {




export let DEFAULT_TILE_WIDTH: number;
export let DEFAULT_TILE_HEIGHT: number;
export let UPDATE_GROUPS_EVENT: string;

function DragDirective(): {
    restrict: string;
    scope: {
        tilesTemplates: string;
        tilesContext: string;
        options: string;
        groupMenuActions: string;
    };
    templateUrl: string;
    bindToController: boolean;
    controllerAs: string;
    controller: string;
    link: ($scope: any, $elem: any) => void;
};

export interface DragTileConstructor {
    new (options: any): any;
}
export function IDragTileConstructor(constructor: DragTileConstructor, options: any): IDragTileService;
export interface IDragTileService {
    tpl: any;
    opts: any;
    size: any;
    elem: any;
    preview: any;
    getSize(): any;
    setSize(width: any, height: any): any;
    setPosition(left: any, top: any): any;
    getCompiledTemplate(): any;
    updateElem(parent: any): any;
    getElem(): any;
    startDrag(): any;
    stopDrag(isAnimate: any): any;
    setPreviewPosition(coords: any): void;
    getOptions(): any;
    setOptions(options: any): any;
}
export class DragTileService implements IDragTileService {
    tpl: any;
    opts: any;
    size: any;
    elem: any;
    preview: any;
    constructor(options: any);
    getSize(): any;
    setSize(width: any, height: any): any;
    setPosition(left: any, top: any): any;
    getCompiledTemplate(): any;
    updateElem(parent: any): any;
    getElem(): any;
    startDrag(): any;
    stopDrag(isAnimate: any): any;
    setPreviewPosition(coords: any): void;
    getOptions(): any;
    setOptions(options: any): any;
}

export interface IWidgetTemplateService {
    getTemplate(source: any, tpl?: any, tileScope?: any, strictCompile?: any): any;
    setImageMarginCSS($element: any, image: any): void;
}


export class AddComponentDialogController {
    _mdDialog: angular.material.IDialogService;
    activeGroupIndex: number;
    defaultWidgets: any;
    groups: any;
    constructor(groups: any, activeGroupIndex: any, widgetList: any, $mdDialog: angular.material.IDialogService);
    add(): void;
    cancel(): void;
    encrease(groupIndex: any, widgetIndex: any): void;
    decrease(groupIndex: any, widgetIndex: any): void;
}

export interface IAddComponentDialogService {
    show(groups: any, activeGroupIndex: any): any;
}

export class WidgetConfigDialogController {
    dialogTitle: string;
    $mdDialog: angular.material.IDialogService;
    transclude: any;
    params: any;
    colors: string[];
    sizes: any;
    sizeId: string;
    private _$element;
    private _$timeout;
    constructor(params: any, $mdDialog: angular.material.IDialogService, $compile: angular.ICompileService, $timeout: angular.ITimeoutService, $injector: any, $scope: angular.IScope, $rootScope: any);
    onApply(): void;
    onCancel(): void;
}


export interface IWidgetConfigService {
    show(params: any, successCallback?: (key) => void, cancelCallback?: () => void): any;
}

function DraggableTile(): {
    restrict: string;
    link: ($scope: any, $elem: any, $attr: any) => void;
};

export interface TilesGridConstructor {
    new (tiles: any, options: any, columns: any, elem: any): any;
}
export function ITilesGridConstructor(constructor: TilesGridConstructor, tiles: any, options: any, columns: any, elem: any): ITilesGridService;
export interface ITilesGridService {
    tiles: any;
    opts: any;
    columns: any;
    elem: any;
    gridCells: any;
    inline: boolean;
    isMobileLayout: boolean;
    addTile(tile: any): any;
    getCellByPosition(row: any, col: any): any;
    getCells(prevCell: any, rowSpan: any, colSpan: any): any;
    getAvailableCellsDesktop(prevCell: any, rowSpan: any, colSpan: any): any;
    getCell(src: any, basicRow: any, basicCol: any, columns: any): any;
    getAvailableCellsMobile(prevCell: any, rowSpan: any, colSpan: any): any;
    getBasicRow(prevCell: any): any;
    isCellFree(row: any, col: any): any;
    getCellIndex(srcCell: any): any;
    reserveCells(start: any, end: any, elem: any): void;
    clearElements(): void;
    setAvailableColumns(columns: any): any;
    generateGrid(singleTileWidth?: any): any;
    setTilesDimensions(onlyPosition: any, draggedTile: any): any;
    calcContainerHeight(): any;
    getTileByNode(node: any): any;
    getTileByCoordinates(coords: any, draggedTile: any): any;
    getTileIndex(tile: any): any;
    swapTiles(movedTile: any, beforeTile: any): any;
    removeTile(removeTile: any): any;
    updateTileOptions(opts: any): any;
}
export class TilesGridService implements ITilesGridService {
    tiles: any;
    opts: any;
    columns: any;
    elem: any;
    gridCells: any;
    inline: boolean;
    isMobileLayout: boolean;
    constructor(tiles: any, options: any, columns: any, elem: any);
    addTile(tile: any): any;
    getCellByPosition(row: any, col: any): any;
    getCells(prevCell: any, rowSpan: any, colSpan: any): any;
    getAvailableCellsDesktop(prevCell: any, rowSpan: any, colSpan: any): any;
    getCell(src: any, basicRow: any, basicCol: any, columns: any): any;
    getAvailableCellsMobile(prevCell: any, rowSpan: any, colSpan: any): any;
    getBasicRow(prevCell: any): any;
    isCellFree(row: any, col: any): any;
    getCellIndex(srcCell: any): any;
    reserveCells(start: any, end: any, elem: any): void;
    clearElements(): void;
    setAvailableColumns(columns: any): any;
    generateGrid(singleTileWidth?: any): any;
    setTilesDimensions(onlyPosition: any, draggedTile: any): any;
    calcContainerHeight(): any;
    getTileByNode(node: any): any;
    getTileByCoordinates(coords: any, draggedTile: any): any;
    getTileIndex(tile: any): any;
    swapTiles(movedTile: any, beforeTile: any): any;
    removeTile(removeTile: any): any;
    updateTileOptions(opts: any): any;
}


export class MenuWidgetService {
    menu: any;
    constructor();
    callAction(actionName: any, params: any, item: any): void;
    changeSize(params: any): void;
}







}

declare module pip.settings {




function configureSettingsPageRoutes($stateProvider: any): void;









export class SettingsTab {
    state: string;
    title: string;
    index: string;
    access: boolean;
    visible: boolean;
    stateConfig: any;
}
export interface ISettingsService {
    getDefaultTab(): any;
    showTitleText(newTitleText: any): any;
    showTitleLogo(newTitleLogo: any): any;
    setDefaultTab(name: string): any;
    showNavIcon(value: any): any;
    getTabs(): any;
}
export interface ISettingsProvider extends ng.IServiceProvider {
    getDefaultTab(): SettingsTab;
    addTab(tabObj: any): any;
    setDefaultTab(name: string): void;
    getFullStateName(state: string): string;
}
export class SettingsConfig {
    defaultTab: string;
    tabs: SettingsTab[];
    titleText: string;
    titleLogo: boolean;
    isNavIcon: boolean;
}

}

declare module pip.help {



function configureHelpPageRoutes($stateProvider: any): void;

export class HelpTab {
    state: string;
    title: string;
    index: string;
    access: boolean;
    visible: boolean;
    stateConfig: any;
}
export interface IHelpService {
    getDefaultTab(): any;
    showTitleText(newTitleText: any): any;
    showTitleLogo(newTitleLogo: any): any;
    setDefaultTab(name: string): any;
    showNavIcon(value: any): any;
    getTabs(): any;
}
export interface IHelpProvider extends ng.IServiceProvider {
    getDefaultTab(): HelpTab;
    addTab(tabObj: any): any;
    setDefaultTab(name: string): void;
    getFullStateName(state: string): string;
}
export class HelpConfig {
    defaultTab: string;
    tabs: HelpTab[];
    titleText: string;
    titleLogo: boolean;
    isNavIcon: boolean;
}

}
