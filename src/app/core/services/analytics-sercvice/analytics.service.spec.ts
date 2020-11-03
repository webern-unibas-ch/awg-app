import { TestBed } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall } from '@testing/expect-helper';
import { mockAnalytics, mockConsole } from '@testing/mock-helper';

import { AnalyticsService } from './analytics.service';

describe('AnalyticsService (DONE)', () => {
    let analyticsService: AnalyticsService;

    let gtagSpy: Spy;
    let initializeAnalyticsSpy: Spy;
    let consoleSpy: Spy;

    const expectedAnalyticsEndpoint = 'https://example.com/endpoint/';
    const expectedAnalyticsId = 'UA-XXXXX-Y';
    const expectecdSendPageView = false;

    const expectedPage = '/test';
    const otherPage = '/test2';

    const expectedLogMessage = 'Running non-production analytics replacement now';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AnalyticsService]
        });
        // inject service
        analyticsService = TestBed.inject(AnalyticsService);

        // set global gtag function
        (window as any).gtag = () => {};

        // spy on service methods
        initializeAnalyticsSpy = spyOn(analyticsService, 'initializeAnalytics').and.callThrough();
        gtagSpy = spyOn(window as any, 'gtag').and.callFake(mockAnalytics.gtag);
        consoleSpy = spyOn(console, 'log').and.callFake(mockConsole.log);
    });

    afterEach(() => {
        // clear mock stores after each test
        mockAnalytics.clear();
        mockConsole.clear();

        // remove global function
        (window as any).gtag = undefined;
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should be created', () => {
        expect(analyticsService).toBeTruthy();
    });

    describe('mock test objects (self-test)', () => {
        it('... should use mock console', () => {
            console.log('Test');

            expect(mockConsole.get(0)).toBe('Test');
        });

        it('... should clear mock console after each run', () => {
            expect(mockConsole.get(0)).toBeUndefined(`should be undefined`);
        });

        it('... should use mock analytics', () => {
            (window as any).gtag('test', 'analytics', {});

            expect(mockAnalytics.getGtag(0)).toEqual(['test', 'analytics', {}], `should be '[test', 'analytics', {}]`);
        });

        it('... should clear mock analytics store after each run', () => {
            expect(mockAnalytics.getGtag(0)).toBeNull(`should be null`);
        });
    });

    describe('#initializeAnalytics', () => {
        it(`... should not initialize the analytics tracker without endpoint`, () => {
            // no endpoint provided
            (analyticsService as any).analyticsEndpoint = null;
            (analyticsService as any).analyticsId = expectedAnalyticsId;

            analyticsService.initializeAnalytics();

            expectSpyCall(initializeAnalyticsSpy, 1);
            expect((analyticsService as any).isInitialized).toBeFalse();
        });

        it(`... should not initialize the analytics tracker without analyticsId`, () => {
            // no id provided
            (analyticsService as any).analyticsEndpoint = expectedAnalyticsEndpoint;
            (analyticsService as any).analyticsId = null;

            analyticsService.initializeAnalytics();

            expectSpyCall(initializeAnalyticsSpy, 1);
            expect((analyticsService as any).isInitialized).toBeFalse();
        });

        it(`... should initialize the analytics tracker with given endpoint and id`, () => {
            (analyticsService as any).analyticsEndpoint = expectedAnalyticsEndpoint;
            (analyticsService as any).analyticsId = expectedAnalyticsId;

            analyticsService.initializeAnalytics();

            expectSpyCall(initializeAnalyticsSpy, 1);
            expect(analyticsService['isInitialized']).toBeTruthy();
        });

        it(`... should log a replacement message in develop mode`, () => {
            expectSpyCall(consoleSpy, 0);
            expect(mockConsole.get(0)).toBeUndefined(`should be undefined`);

            (analyticsService as any).analyticsEndpoint = expectedAnalyticsEndpoint;
            (analyticsService as any).analyticsId = expectedAnalyticsId;
            (analyticsService as any).sendPageView = false;

            analyticsService.initializeAnalytics();

            expectSpyCall(consoleSpy, 1, expectedLogMessage);
            expect(mockConsole.get(0)).toBe(expectedLogMessage, `should be ${expectedLogMessage}`);
        });

        it(`... should not log a replacement message in production mode`, () => {
            expectSpyCall(consoleSpy, 0);
            expect(mockConsole.get(0)).toBeUndefined(`should be undefined`);

            (analyticsService as any).analyticsEndpoint = expectedAnalyticsEndpoint;
            (analyticsService as any).analyticsId = expectedAnalyticsId;
            (analyticsService as any).sendPageView = true;

            analyticsService.initializeAnalytics();

            expectSpyCall(consoleSpy, 0);
            expect(mockConsole.get(0)).toBeUndefined(`should be undefined`);
        });

        it(`... should prepend analytics script in production mode`, () => {
            const scriptSpy = spyOn<any>(analyticsService, 'prependAnalyticsScript');

            (analyticsService as any).analyticsEndpoint = expectedAnalyticsEndpoint;
            (analyticsService as any).analyticsId = expectedAnalyticsId;
            (analyticsService as any).sendPageView = true;

            analyticsService.initializeAnalytics();

            expectSpyCall(scriptSpy, 1);
        });
    });

    describe('#trackPageView', () => {
        it(`... should do nothing if analytics is not initialized successfully`, () => {
            // init analytics
            (analyticsService as any).analyticsEndpoint = null;
            (analyticsService as any).analyticsId = expectedAnalyticsId;
            analyticsService.initializeAnalytics();

            analyticsService.trackPageView(expectedPage);

            expectSpyCall(gtagSpy, 0, null);
            expect(gtagSpy.calls.any()).toBeFalse();
        });

        it(`... should do nothing if isInitialized is set to false`, () => {
            (analyticsService as any).isInitialized = false;

            analyticsService.trackPageView(expectedPage);

            expectSpyCall(gtagSpy, 0, null);
            expect(gtagSpy.calls.any()).toBeFalse();
        });

        it(`... should run if analytics is initialized successfully`, () => {
            // init analytics
            (analyticsService as any).analyticsEndpoint = expectedAnalyticsEndpoint;
            (analyticsService as any).analyticsId = expectedAnalyticsId;
            analyticsService.initializeAnalytics();

            analyticsService.trackPageView(expectedPage);

            expectSpyCall(gtagSpy, 1);
        });

        it(`... should run if isInitialized is set to true`, () => {
            (analyticsService as any).isInitialized = true;

            analyticsService.trackPageView(expectedPage);

            expectSpyCall(gtagSpy, 1);
        });

        it(`... should not track if no page is given`, () => {
            // init analytics
            (analyticsService as any).analyticsEndpoint = expectedAnalyticsEndpoint;
            (analyticsService as any).analyticsId = expectedAnalyticsId;
            analyticsService.initializeAnalytics();

            analyticsService.trackPageView(null);

            expectSpyCall(gtagSpy, 0, null);
            expect(gtagSpy.calls.any()).toBeFalse();
        });

        it(`... should track the given page`, () => {
            const expectedAnalyticsEvent = [
                'config',
                expectedAnalyticsId,
                { page_path: expectedPage, anonymize_ip: true, send_page_view: expectecdSendPageView }
            ];

            // init analytics
            (analyticsService as any).analyticsEndpoint = expectedAnalyticsEndpoint;
            (analyticsService as any).analyticsId = expectedAnalyticsId;
            analyticsService.initializeAnalytics();

            analyticsService.trackPageView(expectedPage);

            expectSpyCall(gtagSpy, 1, expectedAnalyticsEvent);
            expect(mockAnalytics.getGtag(0)).toEqual(expectedAnalyticsEvent, `should be ${expectedAnalyticsEvent}`);
        });

        it(`... should track page changes`, () => {
            const expectedAnalyticsEvent = [
                'config',
                expectedAnalyticsId,
                { page_path: expectedPage, anonymize_ip: true, send_page_view: expectecdSendPageView }
            ];
            const otherAnalyticsEvent = [
                'config',
                expectedAnalyticsId,
                { page_path: otherPage, anonymize_ip: true, send_page_view: expectecdSendPageView }
            ];

            // init analytics
            (analyticsService as any).analyticsEndpoint = expectedAnalyticsEndpoint;
            (analyticsService as any).analyticsId = expectedAnalyticsId;
            analyticsService.initializeAnalytics();

            analyticsService.trackPageView(expectedPage);
            analyticsService.trackPageView(otherPage);

            expectSpyCall(gtagSpy, 2, otherAnalyticsEvent);
            expect(gtagSpy.calls.any()).toBeTruthy();
            expect(gtagSpy.calls.count()).toBe(2);
            expect(gtagSpy.calls.first().args).toEqual(expectedAnalyticsEvent);
            expect(gtagSpy.calls.allArgs()[0]).toEqual(expectedAnalyticsEvent);
            expect(gtagSpy.calls.allArgs()[1]).toEqual(otherAnalyticsEvent);
            expect(gtagSpy.calls.mostRecent().args).toEqual(otherAnalyticsEvent);

            expect(mockAnalytics.getGtag(0)).toEqual(expectedAnalyticsEvent, `should be ${expectedAnalyticsEvent}`);
            expect(mockAnalytics.getGtag(1)).toEqual(otherAnalyticsEvent, `should be ${otherAnalyticsEvent}`);
        });
    });
});
