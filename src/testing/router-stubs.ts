/* tslint:disable:no-input-rename */
/* tslint:disable:directive-selector component-selector */
import { Component, Directive, HostListener, Injectable, Input, NgModule } from '@angular/core';
import { NavigationExtras, QueryParamsHandling } from '@angular/router';

import { AppModule } from '@awg-app/app.module';

// #docregion router-link-stub
/**
 * A RouterLink test double (stub) with a `click` listener.
 *
 * Use the `routerLink` input to set the `navigatedTo` value
 * after click.
 */
@Directive({
    selector: '[routerLink]'
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
     * The router params after navigation.
     */
    navigatedTo: any = null;

    /**
     * Listener that sets the navigation target after click.
     */
    @HostListener('click')
    onClick() {
        this.navigatedTo = this.linkParams;
    }
}
// #enddocregion router-link-stub

// #docregion router-outlet-stub
/**
 * A RouterOutlet test double (stub).
 */
@Component({
    selector: 'router-outlet',
    template: ''
})
export class RouterOutletStubComponent {}
// #enddocregion router-outlet-stub

// #docregion activated-route-stub
import { convertToParamMap, ParamMap, Params } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

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
    private paramSubject = new BehaviorSubject(this.testParams);

    /**
     * Readonly ActivatedRoute.params test double (stub)
     * as observable (`BehaviorSubject`).
     */
    readonly params = this.paramSubject.asObservable();

    /**
     * Private variable for test parameters.
     */
    private _testParams: {};

    /**
     * Getter for test route parameters.
     * @returns The latest test route parameters.
     */
    get testParams() {
        return this._testParams;
    }

    /**
     * Setter for test route parameters.
     * @param params The test route parameters to be set.
     */
    set testParams(params: {}) {
        this._testParams = params;
        this.paramSubject.next(params);
    }

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
     * Private ReplaySubject to handle route paramMaps.
     */
    private paramMapSubject = new BehaviorSubject(convertToParamMap(this.testParamMap));

    /**
     * Observable that contains a map of the test parameters
     */
    readonly paramMap = this.paramMapSubject.asObservable();

    /**
     * Private variable: _testParamMap
     */
    private _testParamMap: ParamMap;
    /**
     * Getter for the test route paramMap.
     *
     * @returns The latest test route paramMap.
     */
    get testParamMap() {
        return this._testParamMap;
    }
    /**
     * Setter for the test route paramMap
     *
     * @param {} params The route parameters to be set.
     */
    set testParamMap(params: {}) {
        this._testParamMap = convertToParamMap(params);
        this.paramMapSubject.next(this._testParamMap);
    }

    /**
     * Private BehaviourSubject to handle query parameters.
     */
    private queryParamMapSubject = new BehaviorSubject(convertToParamMap(this.testQueryParamMap));

    /**
     * Observable that contains a map of the query parameters
     */
    readonly queryParamMap = this.queryParamMapSubject.asObservable();

    /**
     * Private variable: _testQueryParamMap
     */
    private _testQueryParamMap: ParamMap;
    /**
     * Getter for the test route queryÜaramMap.
     *
     * @returns The latest test route queryParamMap.
     */
    get testQueryParamMap() {
        return this._testQueryParamMap;
    }
    /**
     * Setter for the test route queryParamMap
     *
     * @param {Params} params The route queryParameters to be set.
     */
    set testQueryParamMap(params: {}) {
        this._testQueryParamMap = convertToParamMap(params);
        this.queryParamMapSubject.next(this._testQueryParamMap);
    }

    /**
     * Getter for the ActivatedRoute.snapshot.params/paramMap/queryParamMap.
     *
     * @returns Snapshot of the test route parameters.
     */
    get snapshot() {
        return { params: this.testParams, paramMap: this.testParamMap, queryParamMap: this.testQueryParamMap };
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
    declarations: [RouterLinkStubDirective, RouterOutletStubComponent]
})
export class FakeRouterModule {}
