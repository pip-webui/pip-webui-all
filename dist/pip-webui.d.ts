declare module pip {





export let CurrentState: any;
export let PreviousState: any;

export let RedirectedStates: any;


export let RoutingVar: string;


var thisModule: ng.IModule;

var thisModule: ng.IModule;

export const IdentityRootVar: string;
export const IdentityChangedEvent: string;
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
    isOpened: boolean;
    open(session: any): void;
    close(): void;
}
export interface ISessionProvider extends ng.IServiceProvider {
    setRootVar: boolean;
    session: any;
}


function pipTranslateDirective(pipTranslate: any): ng.IDirective;
function pipTranslateHtmlDirective(pipTranslate: any): ng.IDirective;

function translateFilter(pipTranslate: any): (key: any) => any;
function optionalTranslateFilter($injector: any): (key: any) => any;

export const LanguageRootVar: string;
export const LanguageChangedEvent: string;
export interface ITranslateService {
    language: string;
    use(language: string): string;
    setTranslations(language: string, translations: any): void;
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

var thisModule: ng.IModule;



var thisModule: ng.IModule;



var thisModule: ng.IModule;

var thisModule: ng.IModule;

var thisModule: ng.IModule;

var thisModule: ng.IModule;

export interface ITimerService {
    isStarted: boolean;
    addEvent(event: string, timeout: number): void;
    removeEvent(event: string): void;
    clearEvents(): void;
    start(): void;
    stop(): void;
}



}

declare module pip {










}

declare module pip {

}

declare module pip {







var Masonry: any;

}

declare module pip {

}

declare module pip {








}

declare module pip {















var marked: any;









}

declare module pip {



}

declare module pip {


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

declare module pip {







}

declare module pip {

module pip.nav {
}


export interface INavService {
    appBar: any;
    navIcon: any;
    breadcrumb: IBreadcrumbService;
    actions: any;
    search: any;
    sideNav: any;
    navHeader: any;
    navMenu: any;
}

var thisModule: ng.IModule;












export let BreadcrumbChangedEvent: string;
export let BreadcrumbBackEvent: string;
export class BreadcrumbItem {
    title: string;
    click: () => void;
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
export interface IBreadcrumbProvider extends ng.IServiceProvider {
    text: string;
}



function translateFilter($injector: any): (key: any) => any;


module pip.nav {
}































}

declare module pip {














}

declare module pip {












}

declare module pip {





}

declare module pip {









}

declare module pip {



}
