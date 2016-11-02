declare module pip.services {











export let CurrentState: any;
export let PreviousState: any;







let RedirectedStates: any;
function decorateRedirectStateProvider($delegate: any): any;
function addRedirectStateProviderDecorator($provide: any): void;
function decorateRedirectStateService($delegate: any, $timeout: any): any;
function addRedirectStateDecorator($provide: any): void;

export let RoutingVar: string;

export let IdentityRootVar: string;
export let IdentityChangedEvent: string;
export interface IIdentity {
    id: string;
    full_name: string;
    details: string;
    email: string;
    photo_url: string;
}
export interface IIdentityService {
    identity: IIdentity;
}
export interface IIdentityProvider extends ng.IServiceProvider {
    setRootVar: boolean;
    identity: IIdentity;
}






export const SessionRootVar: string;
export const SessionOpenedEvent: string;
export const SessionClosedEvent: string;
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


<<<<<<< HEAD




=======








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
>>>>>>> 8f8b6f729670d1c73b770e2b6c9dfafb956b8a84




<<<<<<< HEAD
=======





function translateDirective(pipTranslate: any): ng.IDirective;
function translateHtmlDirective(pipTranslate: any): ng.IDirective;

function translateFilter(pipTranslate: any): (key: any) => any;
function optionalTranslateFilter($injector: any): (key: any) => any;

>>>>>>> 8f8b6f729670d1c73b770e2b6c9dfafb956b8a84
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










}

declare module pip.landing {

}

declare module pip.layouts {







<<<<<<< HEAD




export const __: any;

export const __: any;

export const __: any;

export const __: any;

function simpleDirective(): {
    restrict: string;
    link: ($scope: any, $element: any, $attrs: any) => void;
};

export const __: any;

=======
>>>>>>> 8f8b6f729670d1c73b770e2b6c9dfafb956b8a84
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








}

declare module pip.controls {





















var marked: any;



}

declare module pip.lists {



}

declare module pip.dates {


function formatTimeFilter(pipDateTime: any): (value: any, format: string) => string;
function formatDateOptionalFilter(pipDateTime: any): (value: any, format: string) => string;
function formatLongDateFilter(pipDateTime: any): (value: any) => string;
function formatShortDateFilter(pipDateTime: any): (value: any) => string;
function formatMonthFilter(pipDateTime: any): (value: any) => any;
function formatLongMonthFilter(pipDateTime: any): (value: any) => string;
function formatYearFilter(pipDateTime: any): (value: any) => string;
function formatWeekFilter(pipDateTime: any): (value: any) => string;
function formatShortWeekFilter(pipDateTime: any): (value: any) => string;
function formatShortDateTimeFilter(pipDateTime: any): (value: any) => string;
function formatLongDateTimeFilter(pipDateTime: any): (value: any) => string;
function formatShortTimeFilter(pipDateTime: any): (value: any) => string;
function formatLongTimeFilter(pipDateTime: any): (value: any) => string;
function formatShortDayOfWeekFilter(pipDateTime: any): (value: any) => string;
function formatLongDayOfWeekFilter(pipDateTime: any): (value: any) => string;
function formatDateNumberFilter(pipDateTime: any): (value: any) => string;
function formatLongDateNumberFilter(pipDateTime: any): (value: any) => string;
function formatTimeNumberFilter(pipDateTime: any): (value: any) => string;
function formatLongTimeNumberFilter(pipDateTime: any): (value: any) => string;
function formatLongMonthDayFilter(pipDateTime: any): (value: any) => string;
function formatShortMonthDayFilter(pipDateTime: any): (value: any) => string;
function formatDateRangeFilter(pipDateTime: any): (value1: any, value2: any) => string;
function formatDateTimeRangeFilter(pipDateTime: any): (value1: any, value2: any) => string;
function formatISOWeekFilter(pipDateTime: any): (value: any) => string;
function formatShortISOWeekFilter(pipDateTime: any): (value: any) => string;
function formatISOWeekOrdinalFilter(pipDateTime: any): (value: any) => string;
function formatDateYFilter(pipDateTime: any): (value: any) => string;
function formatLongDateYFilter(pipDateTime: any): (value: any) => string;
function formatMillisecondsToSecondsFilter(pipDateTime: any): (value: any) => string;
function formatElapsedIntervalFilter(pipDateTime: any): (value: any, start: any) => string;
function getDateJSONFilter(pipDateTime: any): (value: any) => string;

export interface IDateTimeService {
    formatTime(value: any, format: string): string;
    formatDateOptional(value: any, format: string): string;
    formatShortDate(value: any): string;
    formatLongDate(value: any): string;
    formatMonth(value: any): string;
    formatLongMonth(value: any): string;
    formatYear(value: any): string;
    formatWeek(value: any): string;
    formatShortWeek(value: any): string;
    formatShortDateTime(value: any): string;
    formatLongDateTime(value: any): string;
    formatShortTime(value: any): string;
    formatLongTime(value: any): string;
    formatShortDayOfWeek(value: any): string;
    formatLongDayOfWeek(value: any): string;
    formatDateNumber(value: any): string;
    formatLongDateNumber(value: any): string;
    formatTimeNumber(value: any): string;
    formatLongTimeNumber(value: any): string;
    formatLongMonthDay(value: any): string;
    formatShortMonthDay(value: any): string;
    formatDateRange(value1: any, value2: any): string;
    formatDateTimeRange(value1: any, value2: any): string;
    formatISOWeek(value: any): string;
    formatShortISOWeek(value: any): string;
    formatISOWeekOrdinal(value: any): string;
    formatDateY(value: any): string;
    formatLongDateY(value: any): string;
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







}

declare module pip.nav {



export interface INavService {
    appBar: any;
    navIcon: any;
    breadcrumb: IBreadcrumbService;
    actions: any;
    search: ISearchService;
    sideNav: any;
    navHeader: any;
    navMenu: any;
}
export class NavService implements INavService {
    constructor($injector: any);
    appBar: any;
    navIcon: any;
    breadcrumb: IBreadcrumbService;
    actions: any;
    search: ISearchService;
    sideNav: any;
    navHeader: any;
    navMenu: any;
}

var thisModule: ng.IModule;











function translateFilter($injector: any): (key: any) => any;




export class BreadcrumbController {
    private _rootScope;
    private _window;
    config: BreadcrumbConfig;
    constructor($element: any, $rootScope: ng.IRootScopeService, $window: ng.IWindowService, $state: ng.ui.IStateService, pipBreadcrumb: IBreadcrumbService);
    private onBreadcrumbChanged(event, config);
    private onBreadcrumbBack();
    onClick(item: BreadcrumbItem): void;
    openSearch(): void;
}


export function breadcrumbDirective(): {
    restrict: string;
    scope: {};
    replace: boolean;
    templateUrl: string;
    controller: typeof BreadcrumbController;
    controllerAs: string;
};


export interface IBreadcrumbProvider extends ng.IServiceProvider {
    text: string;
}
export class BreadcrumbProvider implements IBreadcrumbProvider {
    private _config;
    private _service;
    text: string;
    $get($rootScope: ng.IRootScopeService): any;
}

export let BreadcrumbChangedEvent: string;
export let BreadcrumbBackEvent: string;
export class BreadcrumbItem {
    title: string;
    click: (item: BreadcrumbItem) => void;
    constructor(title?: string, click?: (item: BreadcrumbItem) => void);
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
}
export class BreadcrumbService implements IBreadcrumbService {
    private _config;
    private _rootScope;
    constructor(config: BreadcrumbConfig, $rootScope: ng.IRootScopeService);
    readonly config: BreadcrumbConfig;
    text: string;
    items: BreadcrumbItem[];
    criteria: string;
    sendEvent(): void;
}




module pip.nav {
}



















export class SearchBarController {
    private _rootScope;
    config: SearchConfig;
    enabled: boolean;
    search: any;
    constructor($element: any, $rootScope: ng.IRootScopeService, pipSearch: ISearchService);
    private onSearchChanged(event, config);
    private focusText();
    enable(): void;
    onClick(): void;
    clear(): void;
    onKeyDown(event: any): void;
}


export function searchBarDirective(): {
    restrict: string;
    scope: {};
    replace: boolean;
    templateUrl: string;
    controller: typeof SearchBarController;
    controllerAs: string;
};



export interface ISearchProvider extends ng.IServiceProvider {
}
export class SearchProvider implements ISearchProvider {
    private _config;
    private _service;
    $get($rootScope: ng.IRootScopeService): SearchService;
}

export let OpenSearchEvent: string;
export let CloseSearchEvent: string;
export let SearchChangedEvent: string;
export let SearchActivatedEvent: string;
export class SearchConfig {
    visible: boolean;
    criteria: string;
    history: string[];
    callback: (criteria: string) => void;
}
export interface ISearchService {
    config: SearchConfig;
    set(callback: (criteria: string) => void, criteria?: string, history?: string[]): void;
    criteria(value: string): void;
    history(history: string[]): void;
    clear(): void;
    open(): void;
    close(): void;
    toggle(): void;
}
export class SearchService implements ISearchService {
    private _config;
    private _rootScope;
    constructor(config: SearchConfig, $rootScope: ng.IRootScopeService);
    readonly config: SearchConfig;
    set(callback: (criteria: string) => void, criteria?: string, history?: string[]): void;
    clear(): void;
    open(): void;
    close(): void;
    toggle(): void;
    criteria(value: string): void;
    history(history: string[]): void;
    private sendConfigEvent();
}











}

declare module pip.themes {





function configureBootBarnCoolTheme($mdThemingProvider: ng.material.IThemingProvider): void;

function configureBootBarnMonochromeTheme($mdThemingProvider: ng.material.IThemingProvider): void;

function configureBootBarnWarmTheme($mdThemingProvider: any): void;








export let ThemeRootVar: string;
export let ThemeChangedEvent: string;
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












}

declare module pip.charts {





}

declare module pip.settings {









}

declare module pip.help {



}
