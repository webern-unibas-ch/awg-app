/* eslint-disable @typescript-eslint/no-unused-vars */
import { Location } from '@angular/common';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { AnalyticsService } from '@awg-core/services';

import { AppComponent } from './app.component';

// Mock components
@Component({ selector: 'awg-navbar', template: '' })
class NavbarStubComponent {}

@Component({ selector: 'awg-view-container', template: '' })
class ViewContainerStubComponent {}

@Component({ selector: 'awg-footer', template: '' })
class FooterStubComponent {}

@Component({ selector: 'awg-test', template: 'test' })
export class RoutedTestMockComponent {}

@Component({ selector: 'awg-test2', template: 'test2' })
export class RoutedTest2MockComponent {}

export const MOCK_ROUTES: Routes = [
    { path: '', redirectTo: 'test', pathMatch: 'full' },
    { path: 'test', component: RoutedTestMockComponent },
    { path: 'test2', component: RoutedTest2MockComponent },
];

describe('AppComponent (DONE)', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let compDe: DebugElement;

    let router: Router;
    let location: Location;

    let mockAnalyticsService: Partial<AnalyticsService>;
    let initialzeAnalyticsSpy: Spy;
    let trackpageViewSpy: Spy;

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

        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes(MOCK_ROUTES)],
            declarations: [
                AppComponent,
                FooterStubComponent,
                NavbarStubComponent,
                ViewContainerStubComponent,
                RoutedTestMockComponent,
                RoutedTest2MockComponent,
            ],
            providers: [{ provide: AnalyticsService, useValue: mockAnalyticsService }],
        }).compileComponents();

        // Spies for service methods
        initialzeAnalyticsSpy = spyOn(mockAnalyticsService, 'initializeAnalytics').and.callThrough();
        trackpageViewSpy = spyOn(mockAnalyticsService, 'trackPageView').and.callThrough();
    }));

    beforeEach(() => {
        // Window spy object (Analytics)
        (window as any).gtag = jasmine.createSpy('gtag');

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        router = TestBed.inject(Router);
        location = TestBed.inject(Location);

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

    it('... injected service should use provided mockValue', () => {
        const analyticsService = TestBed.inject(AnalyticsService);
        expect(analyticsService === mockAnalyticsService).toBe(true);
    });

    describe('router setup (self-test)', () => {
        it("... initial navigation should have detected empty route ''", waitForAsync(() => {
            expect(location.path()).withContext("should be ''").toBe('');
            expect(location.path()).withContext("should be ''").toBe('');
        }));

        it("... should redirect to /test from '' redirect", waitForAsync(() => {
            fixture.ngZone.run(() => {
                router.navigate(['']).then(() => {
                    expect(location.path()).withContext('should be /test').toBe('/test');
                });
            });
        }));

        it("... should navigate to 'test' from /test", waitForAsync(() => {
            fixture.ngZone.run(() => {
                router.navigate(['/test']).then(() => {
                    expect(location.path()).withContext('should be /test').toBe('/test');
                });
            });
        }));

        it("... should navigate to 'test2' from /test2", waitForAsync(() => {
            fixture.ngZone.run(() => {
                router.navigate(['/test2']).then(() => {
                    expect(location.path()).withContext('should be /test2').toBe('/test2');
                });
            });
        }));
    });

    describe('BEFORE initial data binding', () => {
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
                        expectSpyCall(trackpageViewSpy, 1, '/test');
                    });
                });
            }));

            it('... should call AnalyticsService to track page view after navigation changed', waitForAsync(() => {
                fixture.ngZone.run(() => {
                    router.navigate(['']).then(() => {
                        expectSpyCall(trackpageViewSpy, 1, '/test');

                        router.navigate(['test2']).then(() => {
                            expectSpyCall(trackpageViewSpy, 2, '/test2');

                            router.navigate(['test']).then(() => {
                                expectSpyCall(trackpageViewSpy, 3, '/test');
                            });
                        });
                    });
                });
            }));
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
