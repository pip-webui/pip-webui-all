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
declare module pip.scope {
}

/// <reference path="../../typings/tsd.d.ts" />
declare module pip.scope {
}

/// <reference path="../../typings/tsd.d.ts" />
declare module pip.scope {
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

/// <reference path="../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="../../typings/tsd.d.ts" />
declare module pip.nav {
}

/// <reference path="../../typings/tsd.d.ts" />
declare module pip.nav {
    let BreadcrumbChangedEvent: string;
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

/// <reference path="../../typings/tsd.d.ts" />
