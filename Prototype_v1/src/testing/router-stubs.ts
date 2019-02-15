/* tslint:disable:no-input-rename */
import { Component, Directive, HostListener, Injectable, Input, NgModule } from '@angular/core';
import { NavigationExtras } from '@angular/router';

import { AppModule } from '@awg-app/app.module';

// export { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';

// #docregion router-link-stub
@Directive({
    selector: '[routerLink]'
})
export class RouterLinkStubDirective {
    @Input('routerLink')
    linkParams: any;
    navigatedTo: any = null;

    @HostListener('click')
    onClick() {
        this.navigatedTo = this.linkParams;
    }
}
// #enddocregion router-link-stub

// #docregion router-outlet-stub
@Component({
    selector: 'router-outlet',
    template: ''
})
export class RouterOutletStubComponent {}
// #enddocregion router-outlet-stub

// #docregion router-stub
@Injectable()
export class RouterStub {
    navigate(commands: any[], extras?: NavigationExtras) {}
}
// #enddocregion router-stub

// #docregion activated-route-stub
import { convertToParamMap, ParamMap, Params } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
/**
 * An ActivateRoute test double with a `paramMap` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 */
export class ActivatedRouteStub {
    // Use a ReplaySubject to share previous values with subscribers
    // and pump new values into the `paramMap` observable

    // ActivatedRoute.params
    private subject = new BehaviorSubject(this.testParams);
    params = this.subject.asObservable();

    // Test parameters
    private _testParams: {};

    get testParams() {
        return this._testParams;
    }

    set testParams(params: {}) {
        this._testParams = params;
        this.subject.next(params);
    }

    // ActivatedRoute.snapshot.params
    get snapshot() {
        return { params: this.testParams };
    }

    // ActivatedRoute.paramMap
    private paramMapSubject = new ReplaySubject<ParamMap>();

    constructor(initialParams?: Params) {
        this.setParamMap(initialParams);
    }

    /** The mock paramMap observable */
    readonly paramMap = this.paramMapSubject.asObservable();

    /** Set the paramMap observables's next value */
    setParamMap(params?: Params) {
        this.subject.next(convertToParamMap(params));
    }
}
// #enddocregion activated-route-stub

/**
 * Needed so that `aot` build is working. But it isn't used throughout our tests and/or app.
 */
@NgModule({
    imports: [AppModule],
    declarations: [RouterLinkStubDirective, RouterOutletStubComponent, ActivatedRouteStub]
})
export class FakeRouterModule {}
