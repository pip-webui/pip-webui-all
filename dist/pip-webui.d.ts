declare module pip.services {

export let CurrentState: any;
export let PreviousState: any;

let RedirectedStates: any;
function decorateRedirectStateProvider($delegate: any): any;
function addRedirectStateProviderDecorator($provide: any): void;
function decorateRedirectStateService($delegate: any, $timeout: any): any;
function addRedirectStateDecorator($provide: any): void;

export let RoutingVar: string;


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

export let IdentityRootVar: string;
export let IdentityChangedEvent: string;

export const SessionRootVar = "$session";
export const SessionOpenedEvent = "pipSessionOpened";
export const SessionClosedEvent = "pipSessionClosed";


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



export let LanguageRootVar: string;
export let LanguageChangedEvent: string;

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


export interface ITransactionService {
    create(scope?: string): Transaction;
    get(scope?: string): Transaction;
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






export interface ICodes {
    hash(value: string): number;
    verification(): string;
}

export interface IFormat {
    sample(value: string, maxLength: number): string;
    sprintf(message: string, ...args: any[]): string;
}

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

export let ResetPageEvent: string;
export let ResetAreaEvent: string;
export let ResetRootVar: string;
export let ResetAreaRootVar: string;






}

declare module pip.buttons {





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
    $onChanges(changes: any): void;
    disabled(): boolean;
    selectColor(index: number): void;
    enterSpacePress(event: any): void;
}


class pipImageSliderController {
    private _$attrs;
    private _$interval;
    private _$scope;
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
    constructor($scope: ng.IScope, $element: any, $attrs: any, $parse: ng.IParseService, $timeout: angular.ITimeoutService, $interval: angular.IIntervalService, pipImageSlider: any);
    nextBlock(): void;
    prevBlock(): void;
    private slideToPrivate(nextIndex);
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
    private _$element;
    logoUrl: string;
    showProgress: Function;
    constructor($scope: ng.IScope, $element: any);
    $postLink(): void;
    loadProgressImage(): void;
}

var marked: any;
function Config($injector: any): void;
class MarkdownController {
    private _pipTranslate;
    private _$parse;
    private _$scope;
    private _$injector;
    private _$element;
    private _$attrs;
    private _text;
    private _isList;
    private _clamp;
    private _rebind;
    constructor($scope: angular.IScope, $parse: angular.IParseService, $attrs: any, $element: any, $injector: any);
    $postLink(): void;
    $onChanges(changes: any): void;
    private describeAttachments(array);
    private bindText(value);
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

export class ConfirmationDialogController {
    private _injector;
    $mdDialog: angular.material.IDialogService;
    theme: string;
    config: ConfirmationParams;
    constructor($mdDialog: angular.material.IDialogService, $injector: ng.auto.IInjectorService, $rootScope: ng.IRootScopeService, params: ConfirmationParams);
    private initTranslate(params);
    onOk(): void;
    onCancel(): void;
}

export class ConfirmationParams {
    ok: string;
    title?: string;
    cancel: string;
    event?: MouseEvent;
}

export interface IConfirmationService {
    show(params: ConfirmationParams, successCallback?: () => void, cancelCallback?: () => void): any;
}



export class ErrorDetailsDialogController {
    private _injector;
    $mdDialog: ng.material.IDialogService;
    theme: string;
    config: ErrorStrings;
    constructor($mdDialog: ng.material.IDialogService, $injector: ng.auto.IInjectorService, $rootScope: ng.IRootScopeService, params: ErrorParams);
    private initTranslate(params);
    onOk(): void;
    onCancel(): void;
}

class ErrorDetailsService {
    _mdDialog: angular.material.IDialogService;
    constructor($mdDialog: angular.material.IDialogService);
    show(params: any, successCallback: any, cancelCallback: any): void;
}

export class ErrorParams {
    ok: string;
    cancel: string;
    error: string;
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


export class InformationDialogController {
    private _injector;
    $mdDialog: angular.material.IDialogService;
    theme: string;
    config: InformationStrings;
    constructor($mdDialog: angular.material.IDialogService, $injector: ng.auto.IInjectorService, $rootScope: ng.IRootScopeService, params: InformationParams);
    private initTranslate(params);
    onOk(): void;
    onCancel(): void;
}

export class InformationParams {
    ok: string;
    title?: string;
    message?: string;
    error?: string;
    item: any;
}

export interface IInformationService {
    show(params: any, successCallback?: () => void, cancelCallback?: () => void): any;
}

export class InformationStrings {
    ok: string;
    title: string;
    message: string;
    error: string;
    content: any;
}


export interface IOptionsBigDialogController {
    onOk(): void;
    onCancel(): void;
    onKeyUp(event: JQueryKeyEventObject, index: number): void;
    onOptionSelect(event: ng.IAngularEvent, option: OptionsBigData): any;
    onSelected(): void;
    onSelect: Function;
    config: OptionsBigParams;
    theme: string;
}

export class OptionsBigDialogController implements IOptionsBigDialogController {
    private _injector;
    private $mdDialog;
    theme: string;
    config: OptionsBigParams;
    constructor($mdDialog: angular.material.IDialogService, $injector: ng.auto.IInjectorService, $rootScope: ng.IRootScopeService, params: OptionsBigParams);
    private initTranslate(params);
    onOk(): void;
    onCancel(): void;
    onOptionSelect(event: ng.IAngularEvent, option: OptionsBigData): void;
    onSelected(): void;
    onKeyUp(event: JQueryKeyEventObject, index: number): void;
    onSelect: () => void;
    private focusInput();
}

export class OptionsBigData {
    name: string;
    title: string;
    subtitle: string;
}

export class OptionsBigParams {
    title?: string;
    applyButtonTitle?: string;
    options?: OptionsBigData[];
    selectedOption?: OptionsBigData;
    deleted?: boolean;
    selectedOptionName?: string;
    deletedTitle?: string;
    hint?: string;
    noTitle: boolean;
    noActions: boolean;
    optionIndex: number;
}

export interface IOptionsBigService {
    show(params: any, successCallback?: (option) => void, cancelCallback?: () => void): any;
}

export class OptionsDialogController {
    $mdDialog: angular.material.IDialogService;
    theme: string;
    config: OptionsParams;
    constructor($mdDialog: angular.material.IDialogService, $injector: ng.auto.IInjectorService, $rootScope: ng.IRootScopeService, params: OptionsParams);
    onOk(): void;
    onCancel(): void;
    onOptionSelect(event: ng.IAngularEvent, option: OptionsData): void;
    onKeyPress(event: JQueryKeyEventObject): void;
    onSelect(): void;
    private focusInput();
}

export class OptionsData {
    icon: string;
    name: string;
    title: string;
    active: boolean;
}

export class OptionsParams {
    title?: string;
    applyButtonTitle?: string;
    options?: OptionsData[];
    selectedOption?: OptionsData;
    deleted?: boolean;
    selectedOptionName?: string;
    deletedTitle?: string;
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
    showText(text: string, criteria?: string): void;
    showItems(items: BreadcrumbItem[], criteria?: string): void;
}
export interface IBreadcrumbProvider extends ng.IServiceProvider {
    text: string;
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


class DropdownDirectiveController {
    private _element;
    private _attrs;
    private _injector;
    private _scope;
    private _log;
    private _rootScope;
    private _pipTranslate;
    private _pipTheme;
    private _pipMedia;
    private _timeout;
    themeClass: string;
    media: any;
    actions: any;
    activeIndex: number;
    selectedIndex: number;
    currentTheme: string;
    constructor($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes, $injector: ng.auto.IInjectorService, $scope: angular.IScope, $log: ng.ILogService, $rootScope: ng.IRootScopeService, $mdMedia: angular.material.IMedia, $timeout: ng.ITimeoutService);
    disabled(): boolean;
    onSelect(index: number): void;
    show(): boolean;
}


export let NavHeaderChangedEvent: string;
export class NavHeaderConfig {
    imageUrl: string;
    defaultImageUrl: string;
    title: string;
    subtitle: string;
    imageCss: string;
    click: () => void;
    event: string;
}
export interface INavHeaderService {
    readonly config: NavHeaderConfig;
    imageUrl: string;
    title: string;
    subtitle: string;
    event: string;
    show(title: string, subtitle: string, imageUrl: string, callbackOrEvent?: any): void;
    hide(): void;
    click: () => void;
}
export interface INavHeaderProvider extends ng.IServiceProvider {
    config: NavHeaderConfig;
    defaultImageUrl: string;
    imageUrl: string;
    title: string;
    subtitle: string;
    event: string;
    set(title: string, subtitle: string, imageUrl: string, callbackOrEvent?: any): void;
    clear(): void;
    click: () => void;
}


export let NavIconClickedEvent: string;

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


class LanguagePickerDirectiveController {
    private _element;
    private _attrs;
    private _injector;
    private _scope;
    private _log;
    private _rootScope;
    private _translate;
    private _timeout;
    languages: string[];
    selectedLanguage: string;
    constructor($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes, $injector: ng.auto.IInjectorService, $scope: ng.IScope, $log: ng.ILogService, $rootScope: ng.IRootScopeService, $timeout: ng.ITimeoutService);
    readonly language: string;
    setLanguages(languages: string[]): void;
    onLanguageClick(language: string): void;
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

export class SideNavStateNames {
    static Toggle: string;
    static Small: string;
    static Large: string;
    static XLarge: string;
}
export class SideNavState {
    id: SideNavStateNames;
    addClass: string;
    isLockedOpen: boolean;
    showHeader: boolean;
    expandedButton: boolean;
    isExpanded: boolean;
    expand: boolean;
    showIconTooltype: boolean;
}
export class SideNavStateConfig {
    toggle: SideNavState;
    small: SideNavState;
    large: SideNavState;
    xlarge: SideNavState;
}


class Selected {
    activeIndex: number;
    activeTab: number;
}
class TabsDirectiveController {
    private _element;
    private _attrs;
    private _injector;
    private _scope;
    private _log;
    private _rootScope;
    private _pipTranslate;
    private _pipTheme;
    private _pipMedia;
    private _timeout;
    themeClass: string;
    media: any;
    pipTabIndex: number;
    selected: Selected;
    tabs: any[];
    currentTheme: string;
    breakpoints: string;
    constructor($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes, $injector: ng.auto.IInjectorService, $scope: angular.IScope, $log: ng.ILogService, $rootScope: ng.IRootScopeService, $mdMedia: angular.material.IMedia, $timeout: ng.ITimeoutService, navConstant: any);
    private setTheme();
    private setMedia($mdMedia);
    private setTranslate();
    private initTabs();
    disabled(): boolean;
    tabDisabled(index: number): boolean;
    onSelect(index: number): void;
    showShadow(): boolean;
    show(): boolean;
    toBoolean(value: any): boolean;
}

}

declare module pip.themes {





export interface IThemeService {
    theme: string;
    use(language: string): string;
}
export interface IThemeProvider extends IThemeService, ng.IServiceProvider {
    setRootVar: boolean;
    persist: boolean;
}

export let ThemeRootVar: string;
export let ThemeChangedEvent: string;
export let ThemeResetPage: string;











}

declare module pip.errors {



class ClearErrorsLink {
    private _fieldController;
    private _formController;
    constructor($scope: ng.IScope, $element: ng.IRootElementService, $attrs: ng.IAttributes, $ctrls: any);
    private clearFieldErrors();
    private clearFormErrors();
}

class FormErrors {
    private $rootScope;
    constructor($rootScope: ng.IRootScopeService);
    errorsWithHint(field: any): any;
    touchedErrorsWithHint(form: ng.IFormController, field: any): any;
    resetFormErrors(form: ng.IFormController, errors?: boolean): void;
    resetFieldsErrors(form: ng.IFormController, field: any): void;
    setFormError(form: ng.IFormController, error: any, errorFieldMap: any): void;
    private goToUnhandledErrorPage(error);
}



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
export class ErrorsConfig {
    Maintenance: ErrorStateItem;
    MissingRoute: ErrorStateItem;
    NoConnection: ErrorStateItem;
    Unknown: ErrorStateItem;
    Unsupported: ErrorStateItem;
}
export interface IErrorsService {
    getErrorItemByKey(errorName: string): ErrorStateItem;
    config: ErrorsConfig;
}
export interface IErrorsProvider extends ng.IServiceProvider {
    configureErrorByKey(errorName: string, errorParams: ErrorStateItem): void;
    configureErrors(value: ErrorsConfig): void;
    config: ErrorsConfig;
}

export class PipMaintenanceError {
    config?: PipMaintenanceErrorConfig;
}
export class PipMaintenanceErrorConfig {
    params?: PipMaintenanceErrorParams;
}
export class PipMaintenanceErrorParams {
    interval?: number;
}
export class ErrorMaintenanceController {
    private _errorKey;
    private pipNavService;
    errorConfig: ErrorStateItem;
    isCordova: boolean;
    media: any;
    error: PipMaintenanceError;
    timeoutInterval: number;
    constructor($scope: ng.IScope, $state: ng.ui.IStateService, $rootScope: ng.IRootScopeService, $mdMedia: angular.material.IMedia, $injector: angular.auto.IInjectorService, pipErrorsService: IErrorsService);
    private appHeader();
}


export class PipNoConnectionError {
    config?: any;
}
export class ErrorNoConnectionController {
    private $window;
    private _errorKey;
    private pipNavService;
    errorConfig: ErrorStateItem;
    isCordova: boolean;
    media: any;
    error: PipNoConnectionError;
    constructor($window: ng.IWindowService, $scope: ng.IScope, $state: ng.ui.IStateService, $rootScope: ng.IRootScopeService, $mdMedia: angular.material.IMedia, $injector: angular.auto.IInjectorService, pipErrorsService: IErrorsService);
    private appHeader();
    onRetry(): void;
}

class NoConnectionPanelController {
    private _retry;
    constructor($scope: ng.IScope);
    onRetry(): void;
}

export class PipUnknownErrorDetails {
    code: number;
    message: string;
    status: string;
    server_stacktrace: Function;
    client_stacktrace: Function;
}
export class ErrorUnknownController {
    private _errorKey;
    private pipNavService;
    errorConfig: ErrorStateItem;
    isCordova: boolean;
    media: any;
    error: PipUnknownErrorDetails;
    error_details: PipUnknownErrorDetails;
    showError: boolean;
    constructor($scope: ng.IScope, $state: ng.ui.IStateService, $rootScope: ng.IRootScopeService, $mdMedia: angular.material.IMedia, $injector: angular.auto.IInjectorService, pipErrorsService: IErrorsService);
    private appHeader();
    private parseError();
    onDetails(): void;
}

export class PipUnsupportedError {
    config?: any;
}
export class ErrorUnsupportedController {
    private _errorKey;
    private pipNavService;
    errorConfig: ErrorStateItem;
    isCordova: boolean;
    media: any;
    error: PipUnsupportedError;
    constructor($scope: ng.IScope, $state: ng.ui.IStateService, $rootScope: ng.IRootScopeService, $mdMedia: angular.material.IMedia, $injector: angular.auto.IInjectorService, pipErrorsService: IErrorsService);
    private appHeader();
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

export class ButtonsUpload {
    title: string;
    click: Function;
}

export interface IFileFailController {
    name: string;
    type: string;
    error: string;
    buttons: ButtonsUpload[];
}
export class FileFailController implements IFileFailController {
    name: string;
    type: string;
    error: string;
    buttons: ButtonsUpload[];
    constructor($scope: ng.IScope);
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

export class FileUploadState {
    static All: string[];
    static Start: string;
    static Upload: string;
    static Fail: string;
}
export interface IFileUploadService {
    progress: number;
    state: string;
    error: string;
    upload(url: string, file: any, transaction: any, callback?: (data: any, err: any) => void): void;
}
export class FileUploadService implements IFileUploadService {
    private $http;
    progress: number;
    state: string;
    error: string;
    constructor($http: ng.IHttpService);
    upload(url: string, file: any, callback?: (data: any, err: any) => void): void;
}

export interface IFileStartController {
    name: string;
    type: string;
    progress: number;
    buttons: ButtonsUpload[];
}
export class FileStartController implements IFileStartController {
    name: string;
    progress: number;
    type: string;
    buttons: ButtonsUpload[];
    constructor($scope: ng.IScope);
}


export interface IFileSuccessController {
    name: string;
    type: string;
    buttons: ButtonsUpload[];
}
export class FileSuccessController implements IFileSuccessController, IFileSuccessBindings {
    name: string;
    type: string;
    buttons: ButtonsUpload[];
    constructor();
    $onChanges(changes: any): void;
}

export interface IFileSuccessBindings {
    [key: string]: any;
    type: any;
    buttons: any;
    name: any;
}

export interface IFileUploadController {
    name: string;
    type: string;
    state: string;
    progress: number;
    onCancel(): void;
    onRetry(): void;
    onAbort(): void;
}
export class FileUploadButtons {
    retry: Function;
    cancel: Function;
    abort: Function;
}
export class FileUploadController implements IFileUploadController {
    buttonFunction: FileUploadButtons;
    uploadButtons: ButtonsUpload[];
    failButtons: ButtonsUpload[];
    startButtons: ButtonsUpload[];
    name: string;
    type: string;
    state: string;
    progress: number;
    buttons: boolean;
    error: string;
    constructor($scope: ng.IScope);
    $onChanges(changes: FileUploadChanges): void;
    onCancel(): void;
    onRetry(): void;
    onAbort(): void;
}

export interface IFileUploadBindings {
    [key: string]: any;
    buttonFunction: any;
    buttons: any;
    error: any;
    name: any;
    state: any;
    type: any;
    progress: any;
}
export class FileUploadChanges implements ng.IOnChangesObject, IFileUploadBindings {
    [key: string]: ng.IChangesObject<any>;
    buttonFunction: ng.IChangesObject<FileUploadButtons>;
    buttons: ng.IChangesObject<boolean>;
    error: ng.IChangesObject<string>;
    name: ng.IChangesObject<string>;
    state: ng.IChangesObject<string>;
    type: ng.IChangesObject<string>;
    progress: ng.IChangesObject<number>;
}

}

declare module pip.dashboard {




export const DEFAULT_TILE_WIDTH: number;
export const DEFAULT_TILE_HEIGHT: number;
export const UPDATE_GROUPS_EVENT = "pipUpdateDashboardGroupsConfig";

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

export class widget {
    title: string;
    icon: string;
    name: string;
    amount: number;
}
export class AddComponentDialogController implements ng.IController {
    activeGroupIndex: number;
    $mdDialog: angular.material.IDialogService;
    defaultWidgets: [widget[]];
    groups: any;
    totalWidgets: number;
    constructor(groups: any, activeGroupIndex: number, widgetList: [widget[]], $mdDialog: angular.material.IDialogService);
    add(): void;
    cancel(): void;
    encrease(groupIndex: number, widgetIndex: number): void;
    decrease(groupIndex: number, widgetIndex: number): void;
}

export interface IAddComponentDialogService {
    show(groups: any, activeGroupIndex: any): angular.IPromise<any>;
}
export interface IAddComponentDialogprovider {
    configWidgetList(list: [widget[]]): void;
}

export class WidgetConfigDialogController {
    params: any;
    $mdDialog: angular.material.IDialogService;
    colors: string[];
    sizes: any;
    sizeId: string;
    onCancel: Function;
    constructor(params: any, $mdDialog: angular.material.IDialogService);
    onApply(updatedData: any): void;
}


export interface IWidgetConfigService {
    show(params: any, successCallback?: (key) => void, cancelCallback?: () => void): any;
}


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

export class SettingsPageSelectedTab {
    tab: SettingsTab;
    tabIndex: number;
    tabId: string;
}

function configureSettingsPageRoutes($stateProvider: any): void;



export class SettingsTab {
    state: string;
    title: string;
    index: number;
    access: Function;
    visible: boolean;
    stateConfig: SettingsStateConfig;
}
export class SettingsStateConfig {
    url: string;
    auth: boolean;
    templateUrl?: string;
    template?: string;
}
export interface ISettingsService {
    getDefaultTab(): SettingsTab;
    showTitleText(newTitleText: string): void;
    showTitleLogo(newTitleLogo: any): any;
    setDefaultTab(name: string): void;
    showNavIcon(value: boolean): boolean;
    getTabs(): SettingsTab[];
}
export interface ISettingsProvider extends ng.IServiceProvider {
    getDefaultTab(): SettingsTab;
    addTab(tabObj: SettingsTab): void;
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


export class HelpConfig {
    defaultTab: string;
    tabs: HelpTab[];
    titleText: string;
    titleLogo: string;
    isNavIcon: boolean;
}

export class HelpPageSelectedTab {
    tab: HelpTab;
    tabIndex: number;
    tabId: string;
}

export class HelpStateConfig {
    url: string;
    auth: boolean;
    templateUrl?: string;
    template?: string;
}

export class HelpTab {
    state: string;
    title: string;
    index: number;
    access: Function;
    visible: boolean;
    stateConfig: HelpStateConfig;
}



export interface IHelpProvider extends ng.IServiceProvider {
    getDefaultTab(): HelpTab;
    addTab(tabObj: HelpTab): void;
    setDefaultTab(name: string): void;
    getFullStateName(state: string): string;
}

export interface IHelpService {
    getDefaultTab(): HelpTab;
    showTitleText(newTitleText: string): string;
    showTitleLogo(newTitleLogo: string): any;
    setDefaultTab(name: string): void;
    showNavIcon(value: boolean): boolean;
    getTabs(): HelpTab[];
}
export class HelpService implements IHelpService {
    private _config;
    constructor(_config: HelpConfig);
    private getFullStateName(state);
    setDefaultTab(name: string): void;
    getDefaultTab(): HelpTab;
    showTitleText(newTitleText: string): string;
    showTitleLogo(newTitleLogo: string): string;
    showNavIcon(value: boolean): boolean;
    getTabs(): HelpTab[];
}

}
