declare module pip.services {

export let StateVar: string;
export let PrevStateVar: string;


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
    addOpenListener(listener: any): void;
    addCloseListener(listener: any): void;
    removeOpenListener(listener: any): void;
    removeCloseListener(listener: any): void;
    open(session: any, decorator?: (callback: () => void) => void): void;
    close(): void;
}
export interface ISessionProvider extends ng.IServiceProvider {
    setRootVar: boolean;
    session: any;
}

export const SessionRootVar = "$session";
export const SessionOpenedEvent = "pipSessionOpened";
export const SessionClosedEvent = "pipSessionClosed";


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
    setRootVar: boolean;
    persist: boolean;
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



export interface ICodes {
    hash(value: string): number;
    verification(): string;
}

export interface IFormat {
    sample(value: string, maxLength: number): string;
    sprintf(message: string, ...args: any[]): string;
    filterToString(filter: any): string;
    arrayToString(array: string[]): string;
    enumToArray(obj: any): any[];
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

declare module pip.layouts {




export const AuxPanelChangedEvent = "pipAuxPanelChanged";
export const AuxPanelStateChangedEvent = "pipAuxPanelStateChanged";
export const OpenAuxPanelEvent = "pipOpenAuxPanel";
export const CloseAuxPanelEvent = "pipCloseAuxPanel";
export const AuxPanelOpenedEvent = "pipAuxPanelOpened";
export const AuxPanelClosedEvent = "pipAuxPanelClosed";
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


export const MainResizedEvent = "pipMainResized";
export const LayoutResizedEvent = "pipLayoutResized";
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
export interface IMediaService {
    (breakpoint: string): boolean;
    breakpoints: MediaBreakpoints;
    width: number;
}
export interface IMediaProvider extends ng.IServiceProvider {
    breakpoints: MediaBreakpoints;
}


export let MainBreakpoints: MediaBreakpoints;
export const MainBreakpointStatuses: MediaBreakpointStatuses;

export function addResizeListener(element: any, listener: any): void;
export function removeResizeListener(element: any, listener: any): void;







}

declare module pip.behaviors {




export interface IDraggableService {
    inputEvent(event: any): any;
}








export interface IKeyboardShortcuts {
    [key: string]: Shortcut;
}
export interface IShortcutBindingService {
    shortcuts: IKeyboardShortcuts;
    add(shortcut: string, callback: () => void, options: ShortcutOptions): void;
    remove(shortcut: string): void;
}
export interface IShortcutBindingProvider extends ng.IServiceProvider {
    option: ShortcutOptions;
}

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
    options?: ShortcutOptions;
}
export class ShortcutsConfig {
    globalShortcuts: ShortcutItem[];
    localShortcuts: ShortcutItem[];
    defaultOptions: ShortcutOptions;
}
export interface IShortcutsService {
    readonly config: ShortcutsConfig;
    globalShortcuts: ShortcutItem[];
    localShortcuts: ShortcutItem[];
}
export interface IShortcutsProvider extends ng.IServiceProvider {
    config: ShortcutsConfig;
    globalShortcuts: ShortcutItem[];
    defaultOptions: ShortcutOptions;
}

export class KeyboardEvent {
    static Keydown: string;
    static Keyup: string;
    static Keypress: string;
}
export class ShortcutOptions {
    Type: KeyboardEvent;
    Propagate: boolean;
    DisableInInput: boolean;
    Target: any;
    Keycode: number;
}
export class Shortcut {
    private shift_nums;
    private special_keys;
    private modifiers;
    eventCallback: Function;
    target: any;
    event: KeyboardEvent;
    option: ShortcutOptions;
    shorcut: string;
    callback: Function;
    constructor(element: any, shorcutCombination: string, option: ShortcutOptions, callback: (e?: JQueryEventObject) => void);
}



export let ShortcutsChangedEvent: string;

}

declare module pip.controls {



export interface IImageSliderService {
    registerSlider(sliderId: string, sliderScope: any): void;
    removeSlider(sliderId: string): void;
    getSliderScope(sliderId: string): any;
    nextCarousel(nextBlock: any, prevBlock: any): void;
    prevCarousel(nextBlock: any, prevBlock: any): void;
    toBlock(type: string, blocks: any[], oldIndex: number, nextIndex: number, direction: string): void;
}






var marked: any;



export interface IPopoverService {
    show(p: Object): void;
    hide(): void;
    resize(): void;
}




export interface IToastService {
    showNextToast(): void;
    showToast(toast: Toast): void;
    addToast(toast: any): void;
    removeToasts(type: string): void;
    getToastById(id: string): Toast;
    removeToastsById(id: string): void;
    onClearToasts(): void;
    showNotification(message: string, actions: string[], successCallback: any, cancelCallback: any, id: string): any;
    showMessage(message: string, successCallback: any, cancelCallback: any, id?: string): any;
    showError(message: string, successCallback: any, cancelCallback: any, id: string, error: any): any;
    hideAllToasts(): void;
    clearToasts(type?: string): any;
}

export class Toast {
    type: string;
    id: string;
    error: any;
    message: string;
    actions: string[];
    duration: number;
    successCallback: Function;
    cancelCallback: Function;
}


}

declare module pip.lists {



}

declare module pip.dates {





export class DateRangeType {
    static Year: string;
    static Month: string;
    static Week: string;
    static WeekFromSunday: string;
    static Day: string;
    static All: string[];
}
export interface IDateConvertService {
    defaultTimeZoneOffset: number;
    toJson(date: any): string;
    toNextRange(date: any, type: string): Date;
    toPrevRange(date: any, type: string): Date;
    toCurrentRange(type: string): Date;
    addHours(date: any, hours: number): Date;
    toStartDay(date: any): Date;
    toEndDay(date: any, offset?: number): Date;
    toStartWeek(date: any): Date;
    toEndWeek(date: any, offset?: number): Date;
    toStartMonth(date: any): Date;
    toEndMonth(date: any, offset?: number): Date;
    toStartYear(date: any): Date;
    toEndYear(date: any, offset?: number): Date;
}
export interface IDateConvertProvider extends IDateConvertService, ng.IServiceProvider {
}

export interface IDateFormatService {
    defaultTimeZoneOffset: number;
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
    formatRange(value1: any, value2: any, basicFormat: string): string;
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
    formatShortElapsed(value: any, hours?: number, start?: any): string;
    formatMiddleElapsed(value: any, hours?: number, start?: any): string;
    formatLongElapsed(value: any, hours?: number, start?: any): string;
    formatTimeShort(value: number): string;
    formatTimeLong(value: number): string;
}
export interface IDateFormatProvider extends IDateFormatService, ng.IServiceProvider {
}





export const IntervalTimeRange = 30;
export const MinutesInHour = 60;
export const HoursInDay = 24;
export const MillisecondsInSecond = 1000;

}

declare module pip.dialogs {


export class ConfirmationDialogParams {
    event?: MouseEvent;
    ok?: string;
    title?: string;
    cancel?: string;
}


export interface IConfirmationDialogService {
    show(params: ConfirmationDialogParams, successCallback?: () => void, cancelCallback?: () => void): any;
}




export class ErrorDetailsDialogParams {
    event?: MouseEvent;
    dismissButton?: string;
    error: any;
}


export interface IErrorDetailsDialogService {
    show(params: ErrorDetailsDialogParams, successCallback?: () => void, cancelCallback?: () => void): any;
}



export interface IOptionsDialogService {
    show(params: OptionsDialogParams, successCallback?: (result: OptionsDialogResult) => void, cancelCallback?: () => void): any;
}


export class OptionsDialogData {
    icon: string;
    name: string;
    title: string;
    active: boolean;
}

export class OptionsDialogParams {
    event?: MouseEvent;
    title?: string;
    ok?: string;
    cancel?: string;
    options?: OptionsDialogData[];
    selectedOption?: OptionsDialogData;
    selectedOptionName?: string;
    isCheckboxOption?: boolean;
    checkboxOptionCaption?: string;
}

export class OptionsDialogResult {
    option: OptionsDialogData;
    isCheckboxOption: boolean;
}


export interface IInformationDialogService {
    show(params: InformationDialogParams, successCallback?: () => void, cancelCallback?: () => void): any;
}



export class InformationDialogParams {
    event?: MouseEvent;
    ok?: string;
    title?: string;
    message: string;
    item?: any;
}



export interface IOptionsBigDialogService {
    show(params: OptionsBigDialogParams, successCallback?: (result: OptionsBigDialogResult) => void, cancelCallback?: () => void): any;
}


export class OptionsBigDialogData {
    name: string;
    title: string;
    subtitle: string;
}

export class OptionsBigDialogParams {
    event?: MouseEvent;
    title?: string;
    ok?: string;
    cancel?: string;
    options?: OptionsBigDialogData[];
    selectedOption?: OptionsBigDialogData;
    selectedOptionName?: string;
    hint?: string;
    noTitle: any;
    noActions: any;
}

export class OptionsBigDialogResult {
    option: OptionsBigDialogData;
    isCheckboxOption: boolean;
}


}

declare module pip.nav {


export const ActionsChangedEvent: string;
export const SecondaryActionsOpenEvent: string;
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
    subActions?: SimpleActionItem[];
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



export class AppBarConfig {
    visible: boolean;
    parts: any;
    classes: string[];
}


export const AppBarChangedEvent: string;

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



export class BreadcrumbItem {
    title: string;
    click?: (item: BreadcrumbItem) => void;
    subActions?: SimpleActionItem[];
}
export class BreadcrumbConfig {
    text: string;
    items: BreadcrumbItem[];
    criteria: string;
    breakpoint: string;
}

export const BreadcrumbChangedEvent: string;
export const BreadcrumbBackEvent: string;

export interface IBreadcrumbService {
    config: BreadcrumbConfig;
    text: string;
    items: BreadcrumbItem[];
    criteria: string;
    breakpoint: string;
    showText(text: string, criteria?: string): void;
    showItems(items: BreadcrumbItem[], criteria?: string): void;
}
export interface IBreadcrumbProvider extends ng.IServiceProvider {
    text: string;
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



export class NavIconConfig {
    type: string;
    imageUrl: string;
    icon: string;
    click: () => void;
    event: string;
}

export const NavIconClickedEvent: string;
export const NavIconChangedEvent: string;



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



export class NavHeaderConfig {
    imageUrl: string;
    defaultImageUrl: string;
    title: string;
    subtitle: string;
    imageCss: string;
    click: () => void;
    event: string;
}

export let NavHeaderChangedEvent: string;


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

export const NavMenuChangedEvent = "pipNavMenuChanged";


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


export class SearchConfig {
    visible: boolean;
    criteria: string;
    params: any;
    history: string[];
    callback: (criteria: string) => void;
}

export const OpenSearchEvent = "pipOpenSearch";
export const CloseSearchEvent = "pipCloseSearch";
export const SearchChangedEvent = "pipSearchChanged";
export const SearchActivatedEvent = "pipSearchActivated";


export interface ISideNavService {
    readonly config: SideNavConfig;
    readonly classes: string[];
    parts: any;
    state: any;
    type: string;
    backdrop: boolean;
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
    backdrop: boolean;
    visible: boolean;
    classes: string[];
    addClass(...classes: string[]): void;
    removeClass(...classes: string[]): void;
    part(part: string, value: any): void;
}



export const SideNavChangedEvent = "pipSideNavChanged";
export const SideNavStateChangedEvent = "pipSideNavStateChanged";
export const OpenSideNavEvent = "pipOpenSideNav";
export const CloseSideNavEvent = "pipCloseSideNav";

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
export class SideNavConfig {
    parts: any;
    classes: string[];
    state: SideNavState;
    type: string;
    backdrop: boolean;
    visible: boolean;
}

export class PipTab {
    id: string;
    name?: string;
    count: number;
    title: string;
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


export class ErrorPageConfig {
    Active: boolean;
    Name: string;
    Event: string;
    Title: string;
    SubTitle: String;
    Breadcrumb: string;
    Image: string;
    Params?: any;
    RedirectSateDefault?: string;
    StateIgnored?: string[];
}
export class ErrorPageConfigs {
    Maintenance: ErrorPageConfig;
    MissingRoute: ErrorPageConfig;
    NoConnection: ErrorPageConfig;
    Unknown: ErrorPageConfig;
    Unsupported: ErrorPageConfig;
}
export class SupportedBrowsers {
    edge: number;
    ie: number;
    firefox: number;
    opera: number;
    chrome: number;
}


export interface IErrorPageConfigService {
    getErrorPageConfig(pageName: string): ErrorPageConfig;
    configs: ErrorPageConfigs;
}
export interface IErrorPageConfigProvider extends ng.IServiceProvider {
    setErrorPageConfig(pageName: string, config: ErrorPageConfig): void;
    setAllErrorPageConfigs(configs: ErrorPageConfigs): void;
    setSupportedBrowsers(browsers: SupportedBrowsers): void;
    configs: ErrorPageConfigs;
}

class HttpResponseInterceptor implements ng.IHttpInterceptor {
    private $q;
    private $location;
    private $rootScope;
    constructor($q: ng.IQService, $location: ng.ILocationService, $rootScope: ng.IRootScopeService);
    responseError: (rejection: any) => ng.IPromise<any>;
}
function configureHttpInterceptor($stateProvider: ng.ui.IStateProvider, $httpProvider: ng.IHttpProvider): void;



export interface IFormErrorsService {
    errorsWithHint(field: any): any;
    touchedErrorsWithHint(form: ng.IFormController, field: any): any;
    resetFormErrors(form: ng.IFormController, errors?: boolean): void;
    resetFieldsErrors(form: ng.IFormController, field: any): void;
    setFormError(form: ng.IFormController, error: any, errorFieldMap: any): void;
    goToUnhandledErrorPage(error: any): any;
}

export let ErrorsMaintenanceState: string;
export let MaintenanceErrorEvent: string;

export let ErrorsMissingRouteState: string;
export let StateNotFoundEvent: string;

export let ErrorsConnectionState: string;
export let ErrorsConnectionEvent: string;


export let ErrorsUnknownState: string;
export let ErrorsUnknownEvent: string;

export let ErrorsUnsupportedState: string;
export let ErrorsUnsupportedEvent: string;

}

declare module pip.charts {


export interface IChartColorsService {
    getMaterialColor(index: number, colors: string[]): string;
    materialColorToRgba(color: string): string;
    generateMaterialColors(): string[];
}





}

declare module pip.locations {


export interface ILocationDialogService {
    show(params: LocationDialogParams, successCallback?: any, cancelCallback?: any): void;
}



export class LocationDialogParams {
    locationPos: any;
    locationName: string;
}


let google: any;



}

declare module pip.files {

export class ButtonsUpload {
    title: string;
    click: Function;
}






export enum FileUploadState {
    Uploading = 0,
    Completed = 1,
    Failed = 2,
}

export interface IFileUploadService {
    upload(file: any, url: string, resultCallback?: (data: any, err: any) => void, progressCallback?: (state: FileUploadState, progress: number) => void): any;
    multiUpload(uploadedUrl: string, collections: any[], oneFileResultCallback: (index: number, data: any, err: any) => void, oneFileProgressCallback: (index: number, state: FileUploadState, progress: number) => void, successCallback: (error: any, result: any, res: MultiuploadResult[]) => void, abortCallback?: (cancelQuery: any) => void, breakOnFirstError?: boolean, idField?: string): void;
}

export class MultiuploadResult {
    index: number;
    data: any;
    error: any;
    id: string;
}




}

declare module pip.dashboard {

export class AddTileDialog {
    title: string;
    icon: string;
    name: string;
    amount: number;
}
export class AddTileDialogController implements ng.IController {
    activeGroupIndex: number;
    $mdDialog: angular.material.IDialogService;
    defaultTiles: [AddTileDialog[]];
    groups: any;
    totalTiles: number;
    constructor(groups: any, activeGroupIndex: number, widgetList: [AddTileDialog[]], $mdDialog: angular.material.IDialogService);
    add(): void;
    cancel(): void;
    encrease(groupIndex: number, widgetIndex: number): void;
    decrease(groupIndex: number, widgetIndex: number): void;
}

export interface IAddTileDialogService {
    show(groups: any, activeGroupIndex: any): angular.IPromise<any>;
}
export interface IAddTileDialogprovider {
    configWidgetList(list: [AddTileDialog[]]): void;
}



export interface IDashboardTile {
    options: any;
    color: string;
    size: Object | string | number;
}
export class DashboardTile implements IDashboardTile {
    options: any;
    color: string;
    size: Object | string | number;
    constructor();
}


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



export class TileConfigDialogController {
    params: any;
    extensionUrl: any;
    $mdDialog: angular.material.IDialogService;
    colors: string[];
    sizes: any;
    sizeId: string;
    onCancel: Function;
    constructor(params: any, extensionUrl: any, $mdDialog: angular.material.IDialogService);
    onApply(updatedData: any): void;
}


export interface ITileConfigService {
    show(params: ITileConfigDialogOptions, successCallback?: (key) => void, cancelCallback?: () => void): any;
}
export interface ITileConfigDialogOptions extends angular.material.IDialogOptions {
    dialogClass?: string;
    extensionUrl?: string;
    event?: any;
}




export class MenuTileService extends DashboardTile {
    menu: any;
    constructor();
    callAction(actionName: any, params: any, item: any): void;
    changeSize(params: any): void;
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

export interface ITileTemplateService {
    getTemplate(source: any, tpl?: any, tileScope?: any, strictCompile?: any): any;
    setImageMarginCSS($element: any, image: any): void;
}

}

declare module pip.settings {





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

export class SettingsPageSelectedTab {
    tab: SettingsTab;
    tabIndex: number;
    tabId: string;
}


export class SettingsStateConfig {
    url: string;
    auth: boolean;
    templateUrl?: string;
    template?: string;
}

export class SettingsTab {
    state: string;
    title: string;
    icon?: string;
    iconClass?: string;
    index: number;
    access: Function;
    visible: boolean;
    stateConfig: SettingsStateConfig;
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

export interface IHelpService {
    getDefaultTab(): HelpTab;
    showTitleText(newTitleText: string): string;
    showTitleLogo(newTitleLogo: string): any;
    setDefaultTab(name: string): void;
    showNavIcon(value: boolean): boolean;
    getTabs(): HelpTab[];
}
export interface IHelpProvider extends ng.IServiceProvider {
    getDefaultTab(): HelpTab;
    addTab(tabObj: HelpTab): void;
    setDefaultTab(name: string): void;
    getFullStateName(state: string): string;
}





}
