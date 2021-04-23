import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall } from '@testing/expect-helper';
import { mockAnalytics, mockConsole } from '@testing/mock-helper';

import { AnalyticsService } from './analytics.service';

// Helper functions for  Analytics setup
function setupAnalytics(service: AnalyticsService, endpoint: string, id: string, pageView?: boolean) {
    (service as any)._analyticsEndpoint = endpoint;
    (service as any)._analyticsId = id;
    if (pageView) {
        (service as any)._sendPageView = pageView;
    }

    return service.initializeAnalytics();
}

describe('AnalyticsService (DONE)', () => {
    let analyticsService: AnalyticsService;
    let doc: any;

    let gtagSpy: Spy;
    let initializeAnalyticsSpy: Spy;
    let consoleSpy: Spy;

    const expectedAnalyticsEndpoint = 'https://example.com/endpoint/';
    const expectedAnalyticsId = 'UA-XXXXX-Y';
    const expectedSendPageView = false;

    const expectedPage = '/test';
    const otherPage = '/test2';

    const expectedLogMessage = 'Running non-production analytics replacement now';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AnalyticsService]
        });

        // Inject service
        analyticsService = TestBed.inject(AnalyticsService);
        doc = TestBed.inject(DOCUMENT);

        // Set global gtag function
        (window as any).gtag = () => {};

        // Spy on service methods
        initializeAnalyticsSpy = spyOn(analyticsService, 'initializeAnalytics').and.callThrough();

        gtagSpy = spyOn(window as any, 'gtag').and.callFake(mockAnalytics.gtag);
        consoleSpy = spyOn(console, 'info').and.callFake(mockConsole.log);
    });

    afterEach(() => {
        // Clear mock stores after each test
        mockAnalytics.clear();
        mockConsole.clear();

        // Remove global function
        (window as any).gtag = undefined;
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should be created', () => {
        expect(analyticsService).toBeTruthy();
    });

    describe('mock test objects (self-test)', () => {
        it('... should use mock console', () => {
            console.info('Test');

            expect(mockConsole.get(0)).toBe('Test');
        });

        it('... should clear mock console after each run', () => {
            expect(mockConsole.get(0)).toBeUndefined('should be undefined');
        });

        it('... should use mock analytics', () => {
            (window as any).gtag('test', 'analytics', {});

            expect(mockAnalytics.getGtag(0)).toEqual(['test', 'analytics', {}], "should be '[test', 'analytics', {}]");
        });

        it('... should clear mock analytics store after each run', () => {
            expect(mockAnalytics.getGtag(0)).toBeNull('should be null');
        });
    });

    describe('#initializeAnalytics', () => {
        it('... should not initialize the analytics tracker without endpoint', () => {
            // No endpoint provided
            setupAnalytics(analyticsService, null, expectedAnalyticsId);

            expectSpyCall(initializeAnalyticsSpy, 1);
            expect((analyticsService as any)._isInitialized).toBeFalse();
        });

        it('... should not initialize the analytics tracker without analyticsId', () => {
            // No id provided
            setupAnalytics(analyticsService, expectedAnalyticsEndpoint, null);

            expectSpyCall(initializeAnalyticsSpy, 1);
            expect((analyticsService as any)._isInitialized).toBeFalse();
        });

        it('... should initialize the analytics tracker with given endpoint and id', () => {
            setupAnalytics(analyticsService, expectedAnalyticsEndpoint, expectedAnalyticsId);

            expectSpyCall(initializeAnalyticsSpy, 1);
            expect((analyticsService as any)._isInitialized).toBeTrue();
        });

        it('... should log a replacement message in develop mode', () => {
            expectSpyCall(consoleSpy, 0);
            expect(mockConsole.get(0)).toBeUndefined('should be undefined');

            setupAnalytics(analyticsService, expectedAnalyticsEndpoint, expectedAnalyticsId, false);

            expectSpyCall(consoleSpy, 1, expectedLogMessage);
            expect(mockConsole.get(0)).toBe(expectedLogMessage, `should be ${expectedLogMessage}`);
        });

        it('... should not log a replacement message in production mode', () => {
            expectSpyCall(consoleSpy, 0);
            expect(mockConsole.get(0)).toBeUndefined('should be undefined');

            // Prevent setting of real gtag script to document head
            spyOn<any>(doc.head, 'prepend').and.callFake(() => {});

            setupAnalytics(analyticsService, expectedAnalyticsEndpoint, expectedAnalyticsId, true);

            expectSpyCall(consoleSpy, 0);
            expect(mockConsole.get(0)).toBeUndefined('should be undefined');
        });

        it('... should prepend analytics script in production mode', () => {
            const expectedScript: HTMLScriptElement = doc.createElement('script');
            expectedScript.async = true;
            expectedScript.src = `${expectedAnalyticsEndpoint}?id=${expectedAnalyticsId}`;

            // Prevent setting of real gtag script to document head
            const prependSpy = spyOn<any>(doc.head, 'prepend').and.callFake(() => {});
            const scriptSpy = spyOn<any>(analyticsService, '_prependAnalyticsScript').and.callThrough();

            setupAnalytics(analyticsService, expectedAnalyticsEndpoint, expectedAnalyticsId, true);

            expectSpyCall(scriptSpy, 1);
            expectSpyCall(prependSpy, 1, expectedScript);
        });
    });

    describe('#trackPageView', () => {
        it('... should do nothing if analytics is not initialized successfully', () => {
            // Init analytics
            setupAnalytics(analyticsService, null, expectedAnalyticsId);

            analyticsService.trackPageView(expectedPage);

            expectSpyCall(gtagSpy, 0, null);
            expect(gtagSpy.calls.any()).toBeFalse();
        });

        it('... should do nothing if isInitialized is set to false', () => {
            (analyticsService as any).isInitialized = false;

            analyticsService.trackPageView(expectedPage);

            expectSpyCall(gtagSpy, 0, null);
            expect(gtagSpy.calls.any()).toBeFalse();
        });

        it('... should run if analytics is initialized successfully', () => {
            // Init analytics
            setupAnalytics(analyticsService, expectedAnalyticsEndpoint, expectedAnalyticsId);

            analyticsService.trackPageView(expectedPage);

            expectSpyCall(gtagSpy, 1);
        });

        it('... should run if isInitialized is set to true', () => {
            (analyticsService as any)._isInitialized = true;

            analyticsService.trackPageView(expectedPage);

            expectSpyCall(gtagSpy, 1);
        });

        it('... should not track if no page is given', () => {
            // Init analytics
            setupAnalytics(analyticsService, expectedAnalyticsEndpoint, expectedAnalyticsId);

            analyticsService.trackPageView(null);

            expectSpyCall(gtagSpy, 0, null);
            expect(gtagSpy.calls.any()).toBeFalse();
        });

        it('... should track the given page', () => {
            const expectedAnalyticsEvent = [
                'config',
                expectedAnalyticsId,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                { page_path: expectedPage, anonymize_ip: true, send_page_view: expectedSendPageView }
            ];

            // Init analytics
            setupAnalytics(analyticsService, expectedAnalyticsEndpoint, expectedAnalyticsId);

            analyticsService.trackPageView(expectedPage);

            expectSpyCall(gtagSpy, 1, expectedAnalyticsEvent);
            expect(mockAnalytics.getGtag(0)).toEqual(expectedAnalyticsEvent, `should be ${expectedAnalyticsEvent}`);
        });

        it('... should track page changes', () => {
            const expectedAnalyticsEvent = [
                'config',
                expectedAnalyticsId,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                { page_path: expectedPage, anonymize_ip: true, send_page_view: expectedSendPageView }
            ];
            const otherAnalyticsEvent = [
                'config',
                expectedAnalyticsId,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                { page_path: otherPage, anonymize_ip: true, send_page_view: expectedSendPageView }
            ];

            // Init analytics
            setupAnalytics(analyticsService, expectedAnalyticsEndpoint, expectedAnalyticsId);

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
