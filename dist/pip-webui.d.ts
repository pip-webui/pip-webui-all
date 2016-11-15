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
}
export class ConfirmationDialogController {
    $mdDialog: any;
    theme: any;
    config: ConfirmationParams;
    constructor($mdDialog: any, $injector: any, $rootScope: any, params: ConfirmationParams);
    onOk(): void;
    onCancel(): void;
}

class ConfirmationService {
    _mdDialog: any;
    constructor($mdDialog: any);
    show(params: any, successCallback: any, cancelCallback: any): void;
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
    $mdDialog: any;
    theme: any;
    config: InformationStrings;
    constructor($mdDialog: any, $injector: any, $rootScope: any, params: InformationParams);
    onOk(): void;
    onCancel(): void;
}

class InformationService {
    _mdDialog: any;
    constructor($mdDialog: any);
    show(params: any, successCallback: any, cancelCallback: any): void;
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
    _mdDialog: any;
    constructor($mdDialog: any);
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
export class OptionsBigDialogController {
    $mdDialog: any;
    theme: any;
    config: OptionsBigParams;
    constructor($mdDialog: any, $injector: any, $rootScope: any, params: OptionsBigParams);
    onOk(): void;
    onCancel(): void;
    onOptionSelect(event: any, option: any): void;
    onSelected(): void;
    onKeyUp(event: any, index: any): void;
    onSelect: () => void;
    private focusInput();
}

class OptionsBigService {
    _mdDialog: any;
    constructor($mdDialog: any);
    show(params: any, successCallback: any, cancelCallback: any): void;
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
    $mdDialog: any;
    theme: any;
    config: OptionsParams;
    constructor($mdDialog: any, $injector: any, $rootScope: any, params: OptionsParams);
    onOk(): void;
    onCancel(): void;
    onOptionSelect(event: any, option: OptionsData): void;
    onKeyPress(event: any): void;
    onSelect(): void;
    private focusInput();
}

class OptionsService {
    _mdDialog: any;
    constructor($mdDialog: any);
    show(params: any, successCallback: any, cancelCallback: any): void;
}

}

declare module pip.nav {

export let ActionsChangedEvent: string;
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
    showText(text: string, criteria?: string): any;
    showItems(items: BreadcrumbItem[], criteria?: string): any;
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
    icon?: string;
    count?: number;
    access?: (link: NavMenuLink) => boolean;
    href?: string;
    url?: string;
    state?: string;
    stateParams?: any;
    event?: string;
    click?: (link: NavMenuLink) => void;
}
export class NavMenuSection {
    name: string;
    title?: string;
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












}

declare module pip.charts {





}

declare module pip.settings {



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
    showNavIcon(value: any): any;
    getTabs(): any;
}
export interface ISettingsProvider extends ng.IServiceProvider {
    getDefaultTab(): any;
    addTab(tabObj: any): any;
}
export class SettingsConfig {
    defaultTab: string;
    tabs: SettingsTab[];
    titleText: string;
    titleLogo: boolean;
    isNavIcon: boolean;
}



function configureSettingsPageRoutes($stateProvider: any): void;








}

declare module pip.help {



}
