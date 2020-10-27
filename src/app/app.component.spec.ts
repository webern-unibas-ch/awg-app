/* tslint:disable:no-unused-variable */
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement, NgZone } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { AnalyticsService } from '@awg-core/services';

import { AppComponent } from './app.component';

// mock components
@Component({ selector: 'awg-navbar', template: '' })
class NavbarStubComponent {}

@Component({ selector: 'awg-view-container', template: '' })
class ViewContainerStubComponent {}

@Component({ selector: 'awg-footer', template: '' })
class FooterStubComponent {}

@Component({
    template: `test`
})
export class TestMockComponent {}

@Component({
    template: `test2`
})
export class Test2MockComponent {}

export const mockRoutes: Routes = [
    { path: '', redirectTo: 'test', pathMatch: 'full' },
    { path: 'test', component: TestMockComponent },
    { path: 'test2', component: Test2MockComponent }
];

describe('AppComponent (DONE)', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let router: Router;
    let ngZone: NgZone;

    let initialzeAnalyticsSpy: Spy;
    let trackpageViewSpy: Spy;

    beforeEach(async(() => {
        // create a fake AnalyticsService  with a `initializeAnalytics` and `trackPageView` spy
        const mockAnalyticsService = jasmine.createSpyObj('AnalyticsService', ['initializeAnalytics', 'trackPageView']);

        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes(mockRoutes)],
            declarations: [
                AppComponent,
                FooterStubComponent,
                NavbarStubComponent,
                ViewContainerStubComponent,
                TestMockComponent,
                Test2MockComponent
            ],
            providers: [
                // { provide: Router, useValue: RouterStub },
                { provide: AnalyticsService, useValue: mockAnalyticsService }
            ]
        }).compileComponents();

        // spies for service methods
        initialzeAnalyticsSpy = mockAnalyticsService.initializeAnalytics.and.callThrough();
        trackpageViewSpy = mockAnalyticsService.trackPageView.and.callThrough();
    }));

    beforeEach(() => {
        // window spy object (Analytics)
        (window as any).gtag = jasmine.createSpy('gtag');

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        router = TestBed.inject(Router);

        // workaround for ngZone issue;
        // cf. https://github.com/angular/angular/issues/25837
        // cf. https://github.com/ngneat/spectator/pull/334/files
        ngZone = TestBed.inject(NgZone);
        fixture.ngZone.run(() => {
            router.initialNavigation();
        });
    });

    afterEach(() => {
        // remove global function
        (window as any).gtag = undefined;
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create the app', async(() => {
        expect(component).toBeTruthy();
    }));

    describe('BEFORE initial data binding', () => {
        describe('Analytics', () => {
            it('... should call AnalyticsService to initialize Analytics', () => {
                expectSpyCall(initialzeAnalyticsSpy, 1);
            });

            it('... should not call AnalyticsService to track page view without navigation', async () => {
                expectSpyCall(trackpageViewSpy, 0);
            });

            it('... should call AnalyticsService to track page view after navigation', async () => {
                // workaround for ngZone issue; see above
                await ngZone.run(async () => {
                    await router.navigate(['']);
                });
                expectSpyCall(trackpageViewSpy, 1, '/test');
            });

            it('... should call AnalyticsService to track page view after navigation changed', async () => {
                // workaround for ngZone issue; see above
                await ngZone.run(async () => {
                    await router.navigate(['']);
                });
                expectSpyCall(trackpageViewSpy, 1, '/test');

                // workaround for ngZone issue; see above
                await ngZone.run(async () => {
                    await router.navigate(['test2']);
                });
                expectSpyCall(trackpageViewSpy, 2, '/test2');
            });
        });

        describe('VIEW', () => {
            it('... should contain one header component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, NavbarStubComponent, 1, 1);
            });

            it('... should contain one view container component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, ViewContainerStubComponent, 1, 1);
            });

            it('... should contain one footer component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, FooterStubComponent, 1, 1);
            });
        });
    });
});
