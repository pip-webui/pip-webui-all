/// <reference path="../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />
declare module pip.routing {
    let CurrentState: any;
    let PreviousState: any;
}

/// <reference path="../../typings/tsd.d.ts" />
declare module pip.routing {
    let RedirectedStates: any;
}

/// <reference path="../../typings/tsd.d.ts" />
declare module pip.routing {
}

/// <reference path="../../typings/tsd.d.ts" />
declare module pip.routing {
    let RoutingVar: string;
}

/// <reference path="../../typings/tsd.d.ts" />
declare module pip.session {
    const IdentityRootVar: string;
    const IdentityChangedEvent: string;
    interface IIdentity {
        id: string;
        full_name: string;
        details: string;
        email: string;
        photo_url: string;
    }
    interface IIdentityService {
        identity: IIdentity;
    }
    interface IIdentityProvider extends ng.IServiceProvider {
        setRootVar: boolean;
        identity: IIdentity;
    }
}

/// <reference path="../../typings/tsd.d.ts" />
declare module pip.session {
    const SessionRootVar: string;
    const SessionOpenedEvent: string;
    const SessionClosedEvent: string;
    interface ISessionService {
        session: any;
        isOpened: boolean;
        open(session: any): void;
        close(): void;
    }
    interface ISessionProvider extends ng.IServiceProvider {
        setRootVar: boolean;
        session: any;
    }
}

/// <reference path="../../typings/tsd.d.ts" />
declare module pip.scope {
}

/// <reference path="../../typings/tsd.d.ts" />
declare module pip.scope {
}

/// <reference path="../../typings/tsd.d.ts" />
declare module pip.scope {
}

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />
declare module pip.utilities {
    interface ITimerService {
        isStarted: boolean;
        addEvent(event: string, timeout: number): void;
        removeEvent(event: string): void;
        clearEvents(): void;
        start(): void;
        stop(): void;
    }
}

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />
declare module pip.translate {
}

/// <reference path="../../typings/tsd.d.ts" />
declare module pip.translate {
}

/// <reference path="../../typings/tsd.d.ts" />
declare module pip.translate {
}

/// <reference path="../../typings/tsd.d.ts" />
declare module pip.translate {
    const LanguageRootVar: string;
    const LanguageChangedEvent: string;
    interface ITranslateService {
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
    interface ITranslateProvider extends ITranslateService, ng.IServiceProvider {
    }
}

/// <reference path="../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />









declare var Masonry: any;



/// <reference path="../../typings/tsd.d.ts" />




/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />
declare var marked: any;

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />




/// <reference path="../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />
declare module pip.datetime {
}

/// <reference path="../../typings/tsd.d.ts" />
declare module pip.datetime {
}

/// <reference path="../../typings/tsd.d.ts" />
declare module pip.datetime {
    interface IDateTimeService {
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
    interface IDateTimeProvider extends IDateTimeService, ng.IServiceProvider {
    }
}

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />








/// <reference path="../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="breadcrumb_service.d.ts" />
declare module pip.nav {
}

/// <reference path="../../typings/tsd.d.ts" />
declare module pip.nav {
    let BreadcrumbChangedEvent: string;
    let BreadcrumbBackEvent: string;
    class BreadcrumbItem {
        title: string;
        click: () => void;
    }
    class BreadcrumbConfig {
        text: string;
        items: BreadcrumbItem[];
        criteria: string;
    }
    interface IBreadcrumbService {
        config: BreadcrumbConfig;
        text: string;
        items: BreadcrumbItem[];
        criteria: string;
    }
    interface IBreadcrumbProvider extends ng.IServiceProvider {
        text: string;
    }
}

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />
declare module pip.nav {
}

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />











































