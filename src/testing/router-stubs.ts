import { ParamMap, Params, convertToParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

/**
 * Interface for a UrlSegmentStub.
 */
export interface UrlSegmentStub {
    /**
     * Path of a UrlSegment.
     */
    path: string;
}

// #docregion activated-route-stub
/**
 * An ActivatedRoute test double (stub) with a `paramMap` observable.
 *
 * Use the `testParamMap()` method to add the next `paramMap` value.
 *
 * Inspired by https://remypenchenat.blogspot.com/2018/02/angular-testing-activatedroute.html
 */
export class ActivatedRouteStub {
    /**
     * Private readonly BehaviorSubject to handle test route parameters.
     */
    private readonly _paramSubject = new BehaviorSubject(this.testParams);

    /**
     * Readonly ActivatedRoute.params test double (stub)
     * as observable (`BehaviorSubject`).
     */
    readonly params = this._paramSubject.asObservable();

    /**
     * Private variable for test parameters.
     */
    private _testParams: {} = {};

    /**
     * Private readonly ReplaySubject to handle route paramMaps.
     */
    private readonly _paramMapSubject = new BehaviorSubject(convertToParamMap({}));

    /**
     * Observable that contains a map of the test parameters
     */
    readonly paramMap = this._paramMapSubject.asObservable();

    /**
     * Private variable: _testParamMap
     */
    private _testParamMap: ParamMap | undefined;

    /**
     * Private readonly BehaviourSubject to handle query parameters.
     */
    private readonly _queryParamMapSubject = new BehaviorSubject(convertToParamMap({}));

    /**
     * Observable that contains a map of the query parameters
     */
    readonly queryParamMap = this._queryParamMapSubject.asObservable();

    /**
     * Private variable: _testQueryParamMap
     */
    private _testQueryParamMap: ParamMap | undefined;

    /**
     * Private readonly BehaviourSubject to handle children parameters.
     */
    private readonly _childrenSubject = new BehaviorSubject(this.testChildren);

    /**
     * Observable that contains a map of the children parameters
     */
    readonly children = this._childrenSubject.asObservable();

    /**
     * Private variable: _testChildren
     */
    private _testChildren: Params | undefined;

    /**
     * Private readonly BehaviorSubject to handle test route url.
     */
    private readonly _urlSubject = new BehaviorSubject(this.testUrl);

    /**
     * Observable that contains a map of the urls
     */
    readonly url = this._urlSubject.asObservable();

    /**
     * Private variable: _testUrl
     */
    private _testUrl: UrlSegmentStub[] = [];

    /**
     * Constructor for the ActivatedRouteStub (stub).
     *
     * @param {Params} [initialParams] The optional initial route parameters.
     */
    // eslint-disable-next-line @angular-eslint/prefer-inject
    constructor(initialParams: Params = {}) {
        this.testParamMap = initialParams;
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
    get testParamMap(): ParamMap | undefined {
        return this._testParamMap;
    }

    /**
     * Getter for the test route queryParamMap.
     *
     * @returns The latest test route queryParamMap.
     */
    get testQueryParamMap(): ParamMap | undefined {
        return this._testQueryParamMap;
    }

    /**
     * Getter for the test route queryParamMap.
     *
     * @returns The latest test route children.
     */
    get testChildren(): Params | undefined {
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
