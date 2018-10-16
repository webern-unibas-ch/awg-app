/* tslint:disable:no-input-rename */
import { Component, Directive, HostListener, Injectable, Input, NgModule } from '@angular/core';
import { NavigationExtras } from '@angular/router';

import { AppModule } from '@awg-app/app.module';

export { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';

// #docregion router-link
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
// #enddocregion router-link

@Component({
    selector: 'router-outlet',
    template: ''
})
export class RouterOutletStubComponent {}

@Injectable()
export class RouterStub {
    navigate(commands: any[], extras?: NavigationExtras) {}
}

// Only implements params and part of snapshot.params
// #docregion activated-route-stub
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ActivatedRouteStub {
    // ActivatedRoute.params is Observable
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
}

/**
 * Needed so that `aot` build is working. But it isn't used throughout our tests and/or app.
 */
@NgModule({
    imports: [AppModule],
    declarations: [RouterLinkStubDirective, RouterOutletStubComponent]
})
export class FakeRouterModule {}
