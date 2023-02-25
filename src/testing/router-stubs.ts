/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/directive-selector, @angular-eslint/component-selector */
import { Component, Directive, HostListener, Injectable, Input, NgModule } from '@angular/core';
import { convertToParamMap, ParamMap, Params, QueryParamsHandling } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { AppModule } from '@awg-app/app.module';

/**
 * Interface for a UrlSegmentStub.
 */
export interface UrlSegmentStub {
    /**
     * Path of a UrlSegment.
     */
    path: string;
}

// #docregion router-link-stub
/**
 * A RouterLink test double (stub) with a `click` listener.
 *
 * Use the `routerLink` input to set the `navigatedTo` value
 * after click.
 */
@Directive({
    selector: '[routerLink]',
})
export class RouterLinkStubDirective {
    /**
     * Input with navigation parameters.
     */
    @Input('routerLink')
    linkParams: any;

    /**
     * Input with query parameters.
     */
    @Input('queryParams')
    queryParams?: any;

    /**
     * Input with query param handling option.
     */
    @Input('queryParamsHandling')
    queryParamsHandling?: QueryParamsHandling = '';

    /**
     * Input with fragment option.
     */
    @Input('fragment')
    fragment?: string = '';

    /**
     * The router params after navigation.
     */
    navigatedTo: any = null;

    /**
     * The router fragment after navigation.
     */
    navigatedToFragment: string = null;

    /**
     * Listener that sets the navigation target after click.
     */
    @HostListener('click')
    onClick() {
        this.navigatedTo = this.linkParams;
        this.navigatedToFragment = this.fragment;
    }
}
// #enddocregion router-link-stub

// #docregion router-outlet-stub
/**
 * A RouterOutlet test double (stub).
 */
@Component({
    selector: 'router-outlet',
    template: '',
})
export class RouterOutletStubComponent {}
// #enddocregion router-outlet-stub

// #docregion activated-route-stub
/**
 * An ActivatedRoute test double (stub) with a `paramMap` observable.
 *
 * Use the `testParamMap()` method to add the next `paramMap` value.
 *
 * Inspired by https://remypenchenat.blogspot.com/2018/02/angular-testing-activatedroute.html
 */
@Injectable()
export class ActivatedRouteStub {
    /**
     * Private BehaviorSubject to handle test route parameters.
     */
    private _paramSubject = new BehaviorSubject(this.testParams);

    /**
     * Readonly ActivatedRoute.params test double (stub)
     * as observable (`BehaviorSubject`).
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering, @typescript-eslint/naming-convention
    readonly params = this._paramSubject.asObservable();

    /**
     * Private variable for test parameters.
     */
    private _testParams: {};

    /**
     * Private ReplaySubject to handle route paramMaps.
     */
    private _paramMapSubject = new BehaviorSubject(convertToParamMap(this.testParamMap));

    /**
     * Observable that contains a map of the test parameters
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering, @typescript-eslint/naming-convention
    readonly paramMap = this._paramMapSubject.asObservable();

    /**
     * Private variable: _testParamMap
     */
    private _testParamMap: ParamMap;

    /**
     * Private BehaviourSubject to handle query parameters.
     */
    private _queryParamMapSubject = new BehaviorSubject(convertToParamMap(this.testQueryParamMap));

    /**
     * Observable that contains a map of the query parameters
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering, @typescript-eslint/naming-convention
    readonly queryParamMap = this._queryParamMapSubject.asObservable();

    /**
     * Private variable: _testQueryParamMap
     */
    private _testQueryParamMap: ParamMap;

    /**
     * Private BehaviourSubject to handle children parameters.
     */
    private _childrenSubject = new BehaviorSubject(this.testChildren);

    /**
     * Observable that contains a map of the children parameters
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering, @typescript-eslint/naming-convention
    readonly children = this._childrenSubject.asObservable();

    /**
     * Private variable: _testChildren
     */
    private _testChildren: Params;

    /**
     * Private BehaviorSubject to handle test route url.
     */
    private _urlSubject = new BehaviorSubject(this.testUrl);

    /**
     * Observable that contains a map of the urls
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering, @typescript-eslint/naming-convention
    readonly url = this._urlSubject.asObservable();

    /**
     * Private variable: _testUrl
     */
    private _testUrl: UrlSegmentStub[];

    /**
     * Constructor for the ActivatedRouteStub (stub).
     *
     * @param {Params} [initialParams] The optional initial route parameters.
     */
    constructor(initialParams?: Params) {
        if (initialParams) {
            this.testParamMap = initialParams;
        } else {
            this.testParamMap = {};
        }
    }

    /**
     * Getter for test route parameters.
     * @returns The latest test route parameters.
     */
    get testParams() {
        return this._testParams;
    }

    /**
     * Getter for the test route paramMap.
     *
     * @returns The latest test route paramMap.
     */
    get testParamMap() {
        return this._testParamMap;
    }

    /**
     * Getter for the test route queryParamMap.
     *
     * @returns The latest test route queryParamMap.
     */
    get testQueryParamMap() {
        return this._testQueryParamMap;
    }

    /**
     * Getter for the test route queryParamMap.
     *
     * @returns The latest test route children.
     */
    get testChildren() {
        return this._testChildren;
    }

    /**
     * Getter for the test route url.
     *
     * @returns The latest test route url.
     */
    get testUrl() {
        return this._testUrl;
    }

    /**
     * Getter for the ActivatedRoute.snapshot.params/paramMap/queryParamMap.
     *
     * @returns Snapshot of the test route parameters.
     */
    get snapshot() {
        return {
            children: this.testChildren,
            queryParamMap: this.testQueryParamMap,
            params: this.testParams,
            paramMap: this.testParamMap,
            url: this.testUrl,
        };
    }

    /**
     * Setter for test route parameters.
     *
     * @param params The test route parameters to be set.
     */
    set testParams(params: {}) {
        this._testParams = params;
        this._paramSubject.next(params);
    }

    /**
     * Setter for the test route paramMap.
     *
     * @param {} params The route parameters to be set.
     */
    set testParamMap(params: {}) {
        this._testParamMap = convertToParamMap(params);
        this._paramMapSubject.next(this._testParamMap);
    }

    /**
     * Setter for the test route queryParamMap.
     *
     * @param {Params} params The route queryParameters to be set.
     */
    set testQueryParamMap(params: {}) {
        this._testQueryParamMap = convertToParamMap(params);
        this._queryParamMapSubject.next(this._testQueryParamMap);
    }

    /**
     * Setter for the test route children.
     *
     * @param {Params} params The route children to be set.
     */
    set testChildren(params: {}) {
        this._testChildren = params;
        this._childrenSubject.next(this._testChildren);
    }

    /**
     * Setter for the test route url.
     *
     * @param {Params} params The route url to be set.
     */
    set testUrl(params: UrlSegmentStub[]) {
        this._testUrl = params;
        this._urlSubject.next(this._testUrl);
    }
}
// #enddocregion activated-route-stub

/**
 * A fake router module.
 *
 * Needed so that `aot` build is working. But it isn't used throughout our tests and/or app.
 */
@NgModule({
    imports: [AppModule],
    declarations: [RouterLinkStubDirective, RouterOutletStubComponent],
    exports: [RouterOutletStubComponent],
})
export class FakeRouterModule {}
