import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';
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

    let mockDocument: Document;

    let gtagSpy: Spy;
    let initializeAnalyticsSpy: Spy;
    let consoleSpy: Spy;

    const expectedAnalyticsEndpoint = 'https://example.com/endpoint/';
    const expectedAnalyticsId = 'G-XXXXXXXXXX';
    const expectedSendPageView = false;

    const expectedPage = '/test';
    const otherPage = '/test2';

    const expectedLogMessage = 'Running non-production analytics replacement now';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AnalyticsService],
        });

        // Inject service
        analyticsService = TestBed.inject(AnalyticsService);
        mockDocument = TestBed.inject(DOCUMENT);

        // Set global gtag function
        (window as any).gtag = () => {
            // Intentional empty test override
        };

        // Spy on service methods
        initializeAnalyticsSpy = vi.spyOn(analyticsService, 'initializeAnalytics');

        gtagSpy = vi.spyOn(window as any, 'gtag').mockImplementation(mockAnalytics.gtag);
        consoleSpy = vi.spyOn(console, 'info').mockImplementation(mockConsole.log);
    });

    afterEach(() => {
        // Clear mock stores after each test
        mockAnalytics.clear();
        mockConsole.clear();
        vi.clearAllMocks();

        // Remove global function
        (window as any).gtag = undefined;
    });

    it('... should create', () => {
        expect(analyticsService).toBeTruthy();
    });

    describe('mock test objects (self-test)', () => {
        it('... should use mock console', () => {
            console.info('Test');

            expectToBe(mockConsole.get(0), 'Test');
        });

        it('... should clear mock console after each run', () => {
            expect(mockConsole.get(0)).toBeUndefined();
        });

        it('... should use mock analytics', () => {
            (window as any).gtag('test', 'analytics', {});

            expectToEqual(mockAnalytics.getGtag(0), ['test', 'analytics', {}]);
        });

        it('... should clear mock analytics store after each run', () => {
            expectToBe(mockAnalytics.getGtag(0), null);
        });
    });

    describe('#initializeAnalytics()', () => {
        it('... should have a method `initializeAnalytics`', () => {
            expect(analyticsService.initializeAnalytics).toBeDefined();
        });

        it('... should not initialize the analytics tracker without endpoint', () => {
            // No endpoint provided
            setupAnalytics(analyticsService, null, expectedAnalyticsId);

            expectSpyCall(initializeAnalyticsSpy, 1);
            expectToBe((analyticsService as any)._isInitialized, false);
        });

        it('... should not initialize the analytics tracker without analyticsId', () => {
            // No id provided
            setupAnalytics(analyticsService, expectedAnalyticsEndpoint, null);

            expectSpyCall(initializeAnalyticsSpy, 1);
            expectToBe((analyticsService as any)._isInitialized, false);
        });

        it('... should initialize the analytics tracker with given endpoint and id', () => {
            setupAnalytics(analyticsService, expectedAnalyticsEndpoint, expectedAnalyticsId);

            expectSpyCall(initializeAnalyticsSpy, 1);
            expectToBe((analyticsService as any)._isInitialized, true);
        });

        it('... should log a replacement message in develop mode', () => {
            expectSpyCall(consoleSpy, 0);
            expect(mockConsole.get(0)).toBeUndefined();

            setupAnalytics(analyticsService, expectedAnalyticsEndpoint, expectedAnalyticsId, false);

            expectSpyCall(consoleSpy, 1, expectedLogMessage);
            expectToBe(mockConsole.get(0), expectedLogMessage);
        });

        it('... should not log a replacement message in production mode', () => {
            expectSpyCall(consoleSpy, 0);
            expect(mockConsole.get(0)).toBeUndefined();

            // Prevent setting of real gtag script to document head
            vi.spyOn(mockDocument.head, 'prepend').mockImplementation(() => {
                // Intentional empty test override
            });

            setupAnalytics(analyticsService, expectedAnalyticsEndpoint, expectedAnalyticsId, true);

            expectSpyCall(consoleSpy, 0);
            expect(mockConsole.get(0)).toBeUndefined();
        });

        it('... should prepend analytics script in production mode', () => {
            const expectedScript: HTMLScriptElement = mockDocument.createElement('script');
            expectedScript.async = true;
            expectedScript.src = `${expectedAnalyticsEndpoint}?id=${expectedAnalyticsId}`;

            // Prevent setting of real gtag script to document head
            const prependSpy = vi.spyOn(mockDocument.head, 'prepend').mockImplementation(() => {
                // Intentional empty test override
            });
            const scriptSpy = vi.spyOn(analyticsService as any, '_prependAnalyticsScript');

            setupAnalytics(analyticsService, expectedAnalyticsEndpoint, expectedAnalyticsId, true);

            expectSpyCall(scriptSpy, 1);
            expectSpyCall(prependSpy, 1, expectedScript);
        });
    });

    describe('#trackPageView()', () => {
        it('... should have a method `trackPageView`', () => {
            expect(analyticsService.trackPageView).toBeDefined();
        });

        it('... should do nothing if analytics is not initialized successfully', () => {
            // Init analytics
            setupAnalytics(analyticsService, null, expectedAnalyticsId);

            analyticsService.trackPageView(expectedPage);

            expectSpyCall(gtagSpy, 0, null);
            expectToBe(vi.mocked(gtagSpy).mock.calls.length > 0, false);
        });

        it('... should do nothing if isInitialized is set to false', () => {
            (analyticsService as any).isInitialized = false;

            analyticsService.trackPageView(expectedPage);

            expectSpyCall(gtagSpy, 0, null);
            expectToBe(vi.mocked(gtagSpy).mock.calls.length > 0, false);
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
            expectToBe(vi.mocked(gtagSpy).mock.calls.length > 0, false);
        });

        it('... should track the given page', () => {
            const expectedAnalyticsEvent = [
                'config',
                expectedAnalyticsId,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                { page_path: expectedPage, send_page_view: expectedSendPageView },
            ];

            // Init analytics
            setupAnalytics(analyticsService, expectedAnalyticsEndpoint, expectedAnalyticsId);

            analyticsService.trackPageView(expectedPage);

            expectSpyCall(gtagSpy, 1, expectedAnalyticsEvent);
            expectToEqual(mockAnalytics.getGtag(0), expectedAnalyticsEvent);
        });

        it('... should track page changes', () => {
            const expectedAnalyticsEvent = [
                'config',
                expectedAnalyticsId,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                { page_path: expectedPage, send_page_view: expectedSendPageView },
            ];
            const otherAnalyticsEvent = [
                'config',
                expectedAnalyticsId,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                { page_path: otherPage, send_page_view: expectedSendPageView },
            ];

            // Init analytics
            setupAnalytics(analyticsService, expectedAnalyticsEndpoint, expectedAnalyticsId);

            analyticsService.trackPageView(expectedPage);
            analyticsService.trackPageView(otherPage);

            expectSpyCall(gtagSpy, 2, otherAnalyticsEvent);
            expect(vi.mocked(gtagSpy).mock.calls.length > 0).toBeTruthy();
            expectToBe(vi.mocked(gtagSpy).mock.calls.length, 2);
            expectToEqual(vi.mocked(gtagSpy).mock.calls[0], expectedAnalyticsEvent);
            expectToEqual(vi.mocked(gtagSpy).mock.calls[0], expectedAnalyticsEvent);
            expectToEqual(vi.mocked(gtagSpy).mock.calls[1], otherAnalyticsEvent);
            expectToEqual(vi.mocked(gtagSpy).mock.lastCall, otherAnalyticsEvent);

            expectToEqual(mockAnalytics.getGtag(0), expectedAnalyticsEvent);
            expectToEqual(mockAnalytics.getGtag(1), otherAnalyticsEvent);
        });
    });
});
