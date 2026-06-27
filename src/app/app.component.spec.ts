import { Location } from '@angular/common';
import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, Router, RouterModule, Routes } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, expectToBe, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { AnalyticsService, EditionInitService } from '@awg-core/services';

import { AppComponent } from './app.component';

// Mock components
@Component({
    selector: 'awg-navbar',
    template: '',
    standalone: false,
})
class NavbarStubComponent {}

@Component({
    selector: 'awg-view-container',
    template: '',
    standalone: false,
})
class ViewContainerStubComponent {
    @Input()
    activateSideOutlet: boolean;
}

@Component({
    selector: 'awg-footer',
    template: '',
    standalone: false,
})
class FooterStubComponent {}

@Component({
    selector: 'awg-test',
    template: 'test',
    standalone: false,
})
export class RoutedTestMockComponent {}

@Component({
    selector: 'awg-test2',
    template: 'test2',
    standalone: false,
})
export class RoutedTest2MockComponent {}

@Component({
    selector: 'awg-side',
    template: 'test',
    standalone: false,
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
    let mockEditionInitService: Partial<EditionInitService>;
    let mockTitleService: Partial<Title>;

    let getTitleSpy: Spy;
    let setTitleSpy: Spy;
    let initialzeAnalyticsSpy: Spy;
    let trackpageViewSpy: Spy;
    let initializeEditionSpy: Spy;

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

        // Create a mocked EditionInitService with an `initializeEdition` spy
        mockEditionInitService = {
            initializeEdition: (): void => {
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

        await TestBed.configureTestingModule({
            imports: [RouterModule.forRoot(MOCK_ROUTES)],
            declarations: [
                AppComponent,
                FooterStubComponent,
                NavbarStubComponent,
                ViewContainerStubComponent,
                RoutedTestMockComponent,
                RoutedTest2MockComponent,
                RoutedSideMockComponent,
            ],
            providers: [
                { provide: AnalyticsService, useValue: mockAnalyticsService },
                { provide: EditionInitService, useValue: mockEditionInitService },
                { provide: Title, useValue: mockTitleService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Window spy object (Analytics)
        (window as any).gtag = vi.fn();

        // Spies for service methods (need to be created before component creation)
        getTitleSpy = vi.spyOn(mockTitleService, 'getTitle').mockReturnValue('Default Page Title');
        setTitleSpy = vi.spyOn(mockTitleService, 'setTitle');
        initialzeAnalyticsSpy = vi.spyOn(mockAnalyticsService, 'initializeAnalytics');
        initializeEditionSpy = vi.spyOn(mockEditionInitService, 'initializeEdition');
        trackpageViewSpy = vi.spyOn(mockAnalyticsService, 'trackPageView');

        // Create component and test fixture
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        location = TestBed.inject(Location);
        router = TestBed.inject(Router);

        // Test data
        expectedActivateSideOutlet = true;
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

        const editionInitService = TestBed.inject(EditionInitService);
        expectToBe(editionInitService === mockEditionInitService, true);

        const titleService = TestBed.inject(Title);
        expectToBe(titleService === mockTitleService, true);
    });

    describe('router setup (self-test)', () => {
        it('... should start with empty route before navigation', () => {
            expectToBe(location.path(), '');
        });

        it("... should redirect to /test1 from '' redirect", async () => {
            const success = await fixture.ngZone.run(() => router.navigate(['']));
            expect(success).toBeTruthy();
            expectToBe(location.path(), '/test1');
        });

        it("... should navigate to 'test1' from /test1", async () => {
            const success = await fixture.ngZone.run(() => router.navigate(['/test1']));
            expect(success).toBeTruthy();
            expectToBe(location.path(), '/test1');
        });

        it("... should navigate to 'test2' from /test2", async () => {
            const success = await fixture.ngZone.run(() => router.navigate(['/test2']));
            expect(success).toBeTruthy();
            expectToBe(location.path(), '/test2');
        });

        it("... should navigate to 'test2' with outlet from /test2", async () => {
            const success = await fixture.ngZone.run(() =>
                router.navigate([{ outlets: { primary: 'test2', side: 'test2' } }])
            );
            expect(success).toBeTruthy();
            expectToBe(location.path(), '/test2(side:test2)');
        });

        it("... should navigate to '/test2/test3' from /test2/test3", async () => {
            const success = await fixture.ngZone.run(() => router.navigate(['/test2/test3']));
            expect(success).toBeTruthy();
            expectToBe(location.path(), '/test2/test3');
        });

        it("... should navigate to '/test2/test3' with outlet from /test2/test3", async () => {
            const success = await fixture.ngZone.run(() =>
                router.navigate([{ outlets: { primary: 'test2/test3', side: 'test2' } }])
            );
            expect(success).toBeTruthy();
            expectToBe(location.path(), '/test2/test3(side:test2)');
        });
    });

    describe('BEFORE initial data binding', () => {
        it('... should have `activateSideOutlet=false`', () => {
            expectToBe(component.activateSideOutlet, false);
        });

        describe('VIEW', () => {
            it('... should contain one header component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, NavbarStubComponent, 1, 1);
            });

            it('... should contain one view container component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, ViewContainerStubComponent, 1, 1);
            });

            it('... should not pass down `showSideOutlet` to view container component yet', () => {
                const viewContainerDes = getAndExpectDebugElementByDirective(compDe, ViewContainerStubComponent, 1, 1);
                const viewContainerCmp = viewContainerDes[0].injector.get(
                    ViewContainerStubComponent
                ) as ViewContainerStubComponent;

                expect(viewContainerCmp.activateSideOutlet).toBeUndefined();
            });

            it('... should contain one footer component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, FooterStubComponent, 1, 1);
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
                await fixture.ngZone.run(() => router.navigate(['']));

                expectSpyCall(trackpageViewSpy, 1, '/test1');
            });

            it('... should call AnalyticsService to track page view after navigation changed', async () => {
                await fixture.ngZone.run(() => router.navigate(['']));
                expectSpyCall(trackpageViewSpy, 1, '/test1');

                await fixture.ngZone.run(() => router.navigate(['/test2']));
                expectSpyCall(trackpageViewSpy, 2, '/test2');

                await fixture.ngZone.run(() => router.navigate(['/test1']));
                expectSpyCall(trackpageViewSpy, 3, '/test1');
            });
        });

        describe('EditionInit', () => {
            it('... should call EditionInitService to initialize edition', () => {
                expectSpyCall(initializeEditionSpy, 1);
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
                await fixture.ngZone.run(() => router.navigate(['/test1']));
                expectSpyCall(setTitleSpy, 1, 'Custom Page Title 1');

                await fixture.ngZone.run(() => router.navigate(['/test2/test3']));
                expectSpyCall(setTitleSpy, 2, 'Custom Page Title 3');
            });

            it('... should set the default page title if route data title is not available', async () => {
                await fixture.ngZone.run(() => router.navigate(['/test2']));

                expectSpyCall(setTitleSpy, 1, 'Default Page Title');
            });
        });

        describe('SideOutlet', () => {
            it('... should set `activateSideOutlet` to false if not given in route data', async () => {
                const success = await fixture.ngZone.run(() => router.navigate(['/test1']));
                expect(success).toBeTruthy();
                expectToBe(component.activateSideOutlet, false);
            });

            it('... should set `activateSideOutlet` to true if given in route data', async () => {
                const success = await fixture.ngZone.run(() =>
                    router.navigate([{ outlets: { primary: 'test2', side: 'test2' } }])
                );
                expect(success).toBeTruthy();
                expectToBe(component.activateSideOutlet, true);
            });

            it('... should set `activateSideOutlet` to true if given in parent route data', async () => {
                const success = await fixture.ngZone.run(() =>
                    router.navigate([{ outlets: { primary: 'test2/test3', side: 'test2' } }])
                );
                expect(success).toBeTruthy();
                expectToBe(component.activateSideOutlet, true);
            });

            it('... should set `activateSideOutlet` to false if not given in parent route data', async () => {
                const success = await fixture.ngZone.run(() => router.navigate(['/test2/test3']));
                expect(success).toBeTruthy();
                expectToBe(component.activateSideOutlet, false);
            });

            it('... should set `activateSideOutlet` back to false if navigating back to route without side outlet', async () => {
                const success = await fixture.ngZone.run(() =>
                    router.navigate([{ outlets: { primary: 'test2/test3', side: 'test2' } }])
                );
                expect(success).toBeTruthy();
                expectToBe(component.activateSideOutlet, true);

                const success2 = await fixture.ngZone.run(() =>
                    router.navigate([{ outlets: { primary: 'test1', side: null } }])
                );
                expect(success2).toBeTruthy();
                expectToBe(component.activateSideOutlet, false);
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
                const success = await fixture.ngZone.run(() =>
                    router.navigate([{ outlets: { primary: 'test2/test3', side: 'test2' } }])
                );
                expect(success).toBeTruthy();

                await detectChangesOnPush(fixture);

                const viewContainerDes = getAndExpectDebugElementByDirective(compDe, ViewContainerStubComponent, 1, 1);
                const viewContainerCmp = viewContainerDes[0].injector.get(
                    ViewContainerStubComponent
                ) as ViewContainerStubComponent;

                expectToBe(viewContainerCmp.activateSideOutlet, expectedActivateSideOutlet);
            });
        });

        describe('#_hasSideOutlet()', () => {
            it('... should have a method `_hasSideOutlet`', () => {
                expect((component as any)._hasSideOutlet).toBeDefined();
            });

            it('... should return true if route has side outlet', () => {
                const mockRoute: ActivatedRouteSnapshot = {
                    outlet: 'side',
                    children: [],
                } as any;

                expectToBe((component as any)._hasSideOutlet(mockRoute), true);
            });

            it('... should return true if any child route has side outlet', () => {
                const mockRoute: ActivatedRouteSnapshot = {
                    outlet: 'primary',
                    children: [
                        {
                            outlet: 'side',
                            children: [],
                        } as any,
                    ],
                } as any;

                expectToBe((component as any)._hasSideOutlet(mockRoute), true);
            });

            it('... should return false if route has no side outlet', () => {
                const mockRoute: ActivatedRouteSnapshot = {
                    outlet: 'primary',
                    children: [
                        {
                            outlet: 'primary',
                            children: [],
                        } as any,
                    ],
                } as any;

                expectToBe((component as any)._hasSideOutlet(mockRoute), false);
            });
        });
    });
});
