/* eslint-disable @typescript-eslint/no-unused-vars */
import { Location } from '@angular/common';
import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router, RouterModule, Routes } from '@angular/router';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall, expectToBe, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { AnalyticsService, EditionInitService } from '@awg-core/services';

import { AppComponent } from './app.component';

// Mock components
@Component({ selector: 'awg-navbar', template: '' })
class NavbarStubComponent {}

@Component({ selector: 'awg-view-container', template: '' })
class ViewContainerStubComponent {
    @Input() showSideOutlet: boolean;
}

@Component({ selector: 'awg-footer', template: '' })
class FooterStubComponent {}

@Component({ selector: 'awg-test', template: 'test' })
export class RoutedTestMockComponent {}

@Component({ selector: 'awg-test2', template: 'test2' })
export class RoutedTest2MockComponent {}

export const MOCK_ROUTES: Routes = [
    { path: '', redirectTo: 'test1', pathMatch: 'full' },
    {
        path: 'test1',
        component: RoutedTestMockComponent,
        data: { title: 'Custom Page Title 1', showSideOutlet: undefined },
    },
    {
        path: 'test2',
        component: RoutedTest2MockComponent,
        data: {},
        children: [
            {
                path: 'test3',
                component: RoutedTestMockComponent,
                data: { title: 'Custom Page Title 3', showSideOutlet: false },
            },
        ],
    },
];

describe('AppComponent (DONE)', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let compDe: DebugElement;

    let location: Location;
    let router: Router;
    let titleService: Title;

    let mockAnalyticsService: Partial<AnalyticsService>;
    let mockEditionInitService: Partial<EditionInitService>;

    let getTitleSpy: Spy;
    let setTitleSpy: Spy;
    let initialzeAnalyticsSpy: Spy;
    let trackpageViewSpy: Spy;
    let initializeEditionSpy: Spy;

    let expectedShowSideOutlet: boolean;

    beforeEach(waitForAsync(() => {
        // Create a mocked AnalyticsService  with an `initializeAnalytics` and `trackPageView` spy
        mockAnalyticsService = {
            initializeAnalytics: (): void => {
                // Intentional empty test override
            },
            trackPageView: (page: string): void => {
                // Intentional empty test override
            },
        };

        // Create a mocked EditionInitService with an `initializeEdition` spy
        mockEditionInitService = {
            initializeEdition: (): void => {
                // Intentional empty test override
            },
        };

        TestBed.configureTestingModule({
            imports: [RouterModule.forRoot(MOCK_ROUTES)],
            declarations: [
                AppComponent,
                FooterStubComponent,
                NavbarStubComponent,
                ViewContainerStubComponent,
                RoutedTestMockComponent,
                RoutedTest2MockComponent,
            ],
            providers: [
                { provide: AnalyticsService, useValue: mockAnalyticsService },
                { provide: EditionInitService, useValue: mockEditionInitService },
                Title,
            ],
        }).compileComponents();

        // Spies for service methods
        getTitleSpy = spyOn(Title.prototype, 'getTitle').and.returnValue('Default Page Title');
        setTitleSpy = spyOn(Title.prototype, 'setTitle').and.callThrough();
        initialzeAnalyticsSpy = spyOn(mockAnalyticsService, 'initializeAnalytics').and.callThrough();
        initializeEditionSpy = spyOn(mockEditionInitService, 'initializeEdition').and.callThrough();
        trackpageViewSpy = spyOn(mockAnalyticsService, 'trackPageView').and.callThrough();
    }));

    beforeEach(() => {
        // Window spy object (Analytics)
        (window as any).gtag = jasmine.createSpy('gtag');

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        location = TestBed.inject(Location);
        router = TestBed.inject(Router);
        titleService = TestBed.inject(Title);

        // Test data
        expectedShowSideOutlet = true;

        // Workaround for ngZone issue;
        // Cf. https://github.com/angular/angular/issues/25837
        // Cf. https://github.com/ngneat/spectator/pull/334/files
        fixture.ngZone.run(() => {
            // Initial navigation
            router.initialNavigation();
        });
    });

    afterEach(() => {
        // Remove global spy object
        (window as any).gtag = undefined;
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create the app', waitForAsync(() => {
        expect(component).toBeTruthy();
    }));

    it('... injected services should use provided mockValues', () => {
        const analyticsService = TestBed.inject(AnalyticsService);
        expectToBe(analyticsService === mockAnalyticsService, true);

        const editionInitService = TestBed.inject(EditionInitService);
        expectToBe(editionInitService === mockEditionInitService, true);
    });

    describe('router setup (self-test)', () => {
        it("... initial navigation should have detected empty route ''", waitForAsync(() => {
            expectToBe(location.path(), '');
        }));

        it("... should redirect to /test1 from '' redirect", waitForAsync(() => {
            fixture.ngZone.run(() => {
                router.navigate(['']).then(() => {
                    expectToBe(location.path(), '/test1');
                });
            });
        }));

        it("... should navigate to 'test1' from /test1", waitForAsync(() => {
            fixture.ngZone.run(() => {
                router.navigate(['/test1']).then(() => {
                    expectToBe(location.path(), '/test1');
                });
            });
        }));

        it("... should navigate to 'test2' from /test2", waitForAsync(() => {
            fixture.ngZone.run(() => {
                router.navigate(['/test2']).then(() => {
                    expectToBe(location.path(), '/test2');
                });
            });
        }));

        it("... should navigate to '/test2/test3' from /test2/test3", waitForAsync(() => {
            fixture.ngZone.run(() => {
                router.navigate(['/test2/test3']).then(() => {
                    expectToBe(location.path(), '/test2/test3');
                });
            });
        }));
    });

    describe('BEFORE initial data binding', () => {
        it('... should have `showSideOutlet=true`', () => {
            expectToBe(component.showSideOutlet, true);
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

                expect(viewContainerCmp.showSideOutlet).toBeUndefined();
            });

            it('... should contain one footer component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, FooterStubComponent, 1, 1);
            });
        });

        describe('Analytics', () => {
            it('... should call AnalyticsService to initialize Analytics', waitForAsync(() => {
                expectSpyCall(initialzeAnalyticsSpy, 1);
            }));

            it('... should not call AnalyticsService to track page view without navigation', waitForAsync(() => {
                expectSpyCall(trackpageViewSpy, 0);
            }));

            it('... should call AnalyticsService to track page view after navigation', waitForAsync(() => {
                fixture.ngZone.run(() => {
                    router.navigate(['']).then(() => {
                        expectSpyCall(trackpageViewSpy, 1, '/test1');
                    });
                });
            }));

            it('... should call AnalyticsService to track page view after navigation changed', waitForAsync(() => {
                fixture.ngZone.run(() => {
                    router.navigate(['']).then(() => {
                        expectSpyCall(trackpageViewSpy, 1, '/test1');

                        router.navigate(['/test2']).then(() => {
                            expectSpyCall(trackpageViewSpy, 2, '/test2');

                            router.navigate(['/test1']).then(() => {
                                expectSpyCall(trackpageViewSpy, 3, '/test1');
                            });
                        });
                    });
                });
            }));
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

            it('... should set the custom page title from route data if available', waitForAsync(() => {
                fixture.ngZone.run(() => {
                    router.navigate(['/test1']).then(() => {
                        expectSpyCall(setTitleSpy, 1, 'Custom Page Title 1');

                        router.navigate(['/test2/test3']).then(() => {
                            expectSpyCall(setTitleSpy, 2, 'Custom Page Title 3');
                        });
                    });
                });
            }));

            it('... should set the default page title if route data title is not available', waitForAsync(() => {
                fixture.ngZone.run(() => {
                    router.navigate(['/test2']).then(() => {
                        expectSpyCall(setTitleSpy, 1, 'Default Page Title');
                    });
                });
            }));
        });

        describe('SideOutlet', () => {
            it('... should set showSideOutlet to true if undefined in route data', waitForAsync(() => {
                fixture.ngZone.run(() => {
                    router.navigate(['/test1']).then(() => {
                        expectToBe(component.showSideOutlet, true);
                    });
                });
            }));

            it('... should set showSideOutlet to true if not given in route data', waitForAsync(() => {
                fixture.ngZone.run(() => {
                    router.navigate(['/test2']).then(() => {
                        expectToBe(component.showSideOutlet, true);
                    });
                });
            }));

            it('... should set showSideOutlet to false if given so in route data', waitForAsync(() => {
                fixture.ngZone.run(() => {
                    router.navigate(['/test2/test3']).then(() => {
                        expectToBe(component.showSideOutlet, false);
                    });
                });
            }));
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should pass down `showSideOutlet` to view container component', () => {
                const viewContainerDes = getAndExpectDebugElementByDirective(compDe, ViewContainerStubComponent, 1, 1);
                const viewContainerCmp = viewContainerDes[0].injector.get(
                    ViewContainerStubComponent
                ) as ViewContainerStubComponent;

                expect(viewContainerCmp.showSideOutlet).toBeDefined();
                expect(viewContainerCmp.showSideOutlet).toBe(expectedShowSideOutlet);
            });
        });
    });
});
