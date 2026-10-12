import { Location } from '@angular/common';
import { Component, DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, provideRouter, Router, Routes } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, expectToBe, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { AnalyticsService } from '@awg-core/services/analytics.service';

import { AppComponent } from './app.component';
import { FooterComponent } from './core/footer/footer.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { ViewContainerComponent } from './core/view-container/view-container.component';

// Mock components
@Component({
    selector: 'awg-test',
    template: 'test',
})
export class RoutedTestMockComponent {}

@Component({
    selector: 'awg-test2',
    template: 'test2',
})
export class RoutedTest2MockComponent {}

@Component({
    selector: 'awg-side',
    template: 'test',
})
export class RoutedSideMockComponent {}

export const MOCK_ROUTES: Routes = [
    { path: '', redirectTo: 'test1', pathMatch: 'full' },
    { path: 'test1', component: RoutedTestMockComponent, data: { title: 'Custom Page Title 1' } },
    {
        path: 'test2',
        outlet: 'side',
        component: RoutedSideMockComponent,
    },
    {
        path: 'test2',
        component: RoutedTest2MockComponent,
        data: {},
        children: [{ path: 'test3', component: RoutedTestMockComponent, data: { title: 'Custom Page Title 3' } }],
    },
];

describe('AppComponent (DONE)', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let compDe: DebugElement;

    let location: Location;
    let router: Router;

    let mockAnalyticsService: Partial<AnalyticsService>;
    let mockTitleService: Partial<Title>;

    let getTitleSpy: Spy;
    let setTitleSpy: Spy;
    let initialzeAnalyticsSpy: Spy;
    let trackpageViewSpy: Spy;

    let expectedActivateSideOutlet: boolean;

    beforeEach(async () => {
        // Create a mocked AnalyticsService  with an `initializeAnalytics` and `trackPageView` spy
        mockAnalyticsService = {
            initializeAnalytics: (): void => {
                // Intentional empty test override
            },
            trackPageView: (): void => {
                // Intentional empty test override
            },
        };

        // Create a mocked Title with a `getTitle` and `setTitle` spy
        mockTitleService = {
            getTitle: (): string => 'Default Page Title',
            setTitle: (): void => {
                // Intentional empty test override
            },
        };

        // Hollow out the direct child components
        TestBed.overrideComponent(FooterComponent, { set: { template: '', imports: [] } });
        TestBed.overrideComponent(NavbarComponent, { set: { template: '', imports: [] } });
        TestBed.overrideComponent(ViewContainerComponent, { set: { template: '', imports: [] } });

        await TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [
                provideRouter(MOCK_ROUTES),
                { provide: AnalyticsService, useValue: mockAnalyticsService },
                { provide: Title, useValue: mockTitleService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Window spy object (Analytics)
        (window as any).gtag = vi.fn();

        // Inject services
        location = TestBed.inject(Location);
        router = TestBed.inject(Router);

        // Service spies
        getTitleSpy = vi.spyOn(mockTitleService, 'getTitle').mockReturnValue('Default Page Title');
        setTitleSpy = vi.spyOn(mockTitleService, 'setTitle');
        initialzeAnalyticsSpy = vi.spyOn(mockAnalyticsService, 'initializeAnalytics');
        trackpageViewSpy = vi.spyOn(mockAnalyticsService, 'trackPageView');

        // Test data
        expectedActivateSideOutlet = true;

        // Create component fixture
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    afterEach(() => {
        // Remove global spy object
        (window as any).gtag = undefined;

        vi.restoreAllMocks();
    });

    it('... should create the app', () => {
        expect(component).toBeTruthy();
    });

    it('... injected services should use provided mockValues', () => {
        const analyticsService = TestBed.inject(AnalyticsService);
        expectToBe(analyticsService === mockAnalyticsService, true);

        const titleService = TestBed.inject(Title);
        expectToBe(titleService === mockTitleService, true);
    });

    describe('router setup (self-test)', () => {
        it('... should start with empty route before navigation', () => {
            expectToBe(location.path(), '');
        });

        describe('... should navigate to', () => {
            it.each([
                { desc: '`/test1` from empty redirect', commands: [''], expectedPath: '/test1' },
                { desc: '`test1` from `/test1`', commands: ['/test1'], expectedPath: '/test1' },
                { desc: '`test2` from `/test2`', commands: ['/test2'], expectedPath: '/test2' },
                {
                    desc: '`/test2/test3` from `/test2/test3`',
                    commands: ['/test2/test3'],
                    expectedPath: '/test2/test3',
                },
                {
                    desc: '`test2` with outlet from `/test2`',
                    commands: [{ outlets: { primary: 'test2', side: 'test2' } }],
                    expectedPath: '/test2(side:test2)',
                },
                {
                    desc: '`/test2/test3` with outlet from `/test2/test3`',
                    commands: [{ outlets: { primary: 'test2/test3', side: 'test2' } }],
                    expectedPath: '/test2/test3(side:test2)',
                },
            ])('... $desc', async ({ commands, expectedPath }) => {
                const success = await router.navigate(commands);

                expect(success).toBeTruthy();
                expectToBe(location.path(), expectedPath);
            });
        });
    });

    describe('BEFORE initial data binding', () => {
        it('... should have signal `activateSideOutlet` to hold false', () => {
            expectToBe(isSignal(component.activateSideOutlet), true);

            expectToBe(component.activateSideOutlet(), false);
        });

        describe('VIEW', () => {
            it('... should contain one NavbarComponent (hollow)', () => {
                getAndExpectDebugElementByDirective(compDe, NavbarComponent, 1, 1);
            });

            it('... should contain one ViewContainerComponent (hollow)', () => {
                getAndExpectDebugElementByDirective(compDe, ViewContainerComponent, 1, 1);
            });

            it('... should throw due to missing required values for ViewContainerComponent', () => {
                const viewContainerDes = getAndExpectDebugElementByDirective(compDe, ViewContainerComponent, 1, 1);
                const viewContainerCmp = viewContainerDes[0].injector.get(
                    ViewContainerComponent
                ) as ViewContainerComponent;

                // Expect the required inputs to throw if not provided
                expect(() => viewContainerCmp.activateSideOutlet()).toThrow();
            });

            it('... should contain one FooterComponent (hollow)', () => {
                getAndExpectDebugElementByDirective(compDe, FooterComponent, 1, 1);
            });
        });

        describe('Analytics', () => {
            it('... should call AnalyticsService to initialize Analytics', () => {
                expectSpyCall(initialzeAnalyticsSpy, 1);
            });

            it('... should not call AnalyticsService to track page view without navigation', () => {
                expectSpyCall(trackpageViewSpy, 0);
            });

            it('... should call AnalyticsService to track page view after navigation', async () => {
                await router.navigate(['']);

                expectSpyCall(trackpageViewSpy, 1, '/test1');
            });

            it('... should call AnalyticsService to track page view after navigation changed', async () => {
                await router.navigate(['']);
                expectSpyCall(trackpageViewSpy, 1, '/test1');

                await router.navigate(['/test2']);
                expectSpyCall(trackpageViewSpy, 2, '/test2');

                await router.navigate(['/test1']);
                expectSpyCall(trackpageViewSpy, 3, '/test1');
            });
        });

        describe('Title', () => {
            it('... should have called getTitle', () => {
                expectSpyCall(getTitleSpy, 1);
            });

            it('... should not have called setTitle', () => {
                expectSpyCall(setTitleSpy, 0);
            });

            it('... should set the custom page title from route data if available', async () => {
                await router.navigate(['/test1']);
                expectSpyCall(setTitleSpy, 1, 'Custom Page Title 1');

                await router.navigate(['/test2/test3']);
                expectSpyCall(setTitleSpy, 2, 'Custom Page Title 3');
            });

            it('... should set the default page title if route data title is not available', async () => {
                await router.navigate(['/test2']);

                expectSpyCall(setTitleSpy, 1, 'Default Page Title');
            });
        });

        describe('SideOutlet', () => {
            it('... should have signal `activateSideOutlet` to hold false if not given in route data', async () => {
                const success = await router.navigate(['/test1']);

                expect(success).toBeTruthy();
                expectToBe(component.activateSideOutlet(), false);
            });

            it('... should have signal `activateSideOutlet` to hold true if given in route data', async () => {
                const success = await router.navigate([{ outlets: { primary: 'test2', side: 'test2' } }]);

                expect(success).toBeTruthy();
                expectToBe(component.activateSideOutlet(), true);
            });

            it('... should have signal `activateSideOutlet` to hold true if given in parent route data', async () => {
                const success = await router.navigate([{ outlets: { primary: 'test2/test3', side: 'test2' } }]);

                expect(success).toBeTruthy();
                expectToBe(component.activateSideOutlet(), true);
            });

            it('... should have signal `activateSideOutlet` to hold false if not given in parent route data', async () => {
                const success = await router.navigate(['/test2/test3']);

                expect(success).toBeTruthy();
                expectToBe(component.activateSideOutlet(), false);
            });

            it('... should have signal `activateSideOutlet` to hold false again if navigating back to route without side outlet', async () => {
                const success = await router.navigate([{ outlets: { primary: 'test2/test3', side: 'test2' } }]);

                expect(success).toBeTruthy();
                expectToBe(component.activateSideOutlet(), true);

                const success2 = await router.navigate([{ outlets: { primary: 'test1', side: null } }]);

                expect(success2).toBeTruthy();
                expectToBe(component.activateSideOutlet(), false);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should pass down `activateSideOutlet` to view container component', async () => {
                const success = await router.navigate([{ outlets: { primary: 'test2/test3', side: 'test2' } }]);

                expect(success).toBeTruthy();

                await detectChangesOnPush(fixture);

                const viewContainerDes = getAndExpectDebugElementByDirective(compDe, ViewContainerComponent, 1, 1);
                const viewContainerCmp = viewContainerDes[0].injector.get(
                    ViewContainerComponent
                ) as ViewContainerComponent;

                expectToBe(viewContainerCmp.activateSideOutlet(), expectedActivateSideOutlet);
            });
        });

        describe('METHODS', () => {
            describe('#_hasSideOutlet()', () => {
                it('... should have a method `_hasSideOutlet`', () => {
                    expect(component['_hasSideOutlet']).toBeDefined();
                });

                it('... should detect a side outlet in the route itself', () => {
                    const mockRoute: ActivatedRouteSnapshot = {
                        outlet: 'side',
                        children: [],
                    } as any;

                    expectToBe(component['_hasSideOutlet'](mockRoute), true);
                });

                it('... should detect a side outlet in any child route', () => {
                    const mockRoute: ActivatedRouteSnapshot = {
                        outlet: 'primary',
                        children: [
                            {
                                outlet: 'side',
                                children: [],
                            } as any,
                        ],
                    } as any;

                    expectToBe(component['_hasSideOutlet'](mockRoute), true);
                });

                it('... should not detect a side outlet if there is none', () => {
                    const mockRoute: ActivatedRouteSnapshot = {
                        outlet: 'primary',
                        children: [
                            {
                                outlet: 'primary',
                                children: [],
                            } as any,
                        ],
                    } as any;

                    expectToBe(component['_hasSideOutlet'](mockRoute), false);
                });
            });
        });
    });
});
