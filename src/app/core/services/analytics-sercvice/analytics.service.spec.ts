import { TestBed } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall } from '@testing/expect-helper';

import { AnalyticsConfig, AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
    let analyticsService: AnalyticsService;

    let gaSpy: Spy;
    let initializeAnalyticsSpy: Spy;

    const expectedAnalyticsConfig = { trackingId: 'UA-XXXXX-Y' };

    const expectedPage = '/test';
    const otherPage = '/test2';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AnalyticsService]
        });
        // inject service
        analyticsService = TestBed.inject(AnalyticsService);

        // set analyticsConfig variable
        (analyticsService as any).analyticsConfig = expectedAnalyticsConfig;

        // spy on global ga object
        gaSpy = spyOn(window as any, 'ga').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should be created', () => {
        expect(analyticsService).toBeTruthy();
    });
    describe('#initializeAnalytics', () => {
        beforeEach(() => {
            // spy on private service methods
            initializeAnalyticsSpy = spyOn<any>(analyticsService, 'initializeAnalytics').and.callThrough();
        });

        it(`... should not init the analytics tracker without config`, () => {
            // no config provided
            const config: AnalyticsConfig = null;

            (analyticsService as any).initializeAnalytics(config);

            expectSpyCall(initializeAnalyticsSpy, 1, config);
            expect((analyticsService as any).isInitialized).toBeFalse();
        });

        it(`... should not init the analytics tracker without config.trackingId`, () => {
            // no tracking id provided
            const config = { trackingId: null };

            (analyticsService as any).initializeAnalytics(config);

            expectSpyCall(initializeAnalyticsSpy, 1, config);
            expect((analyticsService as any).isInitialized).toBeFalse();
        });

        it(`... should successfully init the analytics tracker with given config.trackingId`, () => {
            const config: AnalyticsConfig = expectedAnalyticsConfig;

            (analyticsService as any).initializeAnalytics(expectedAnalyticsConfig);

            expectSpyCall(initializeAnalyticsSpy, 1, config);
            expect(analyticsService['isInitialized']).toBeTruthy();
        });

        it(`... should init the tracker in debug mode if config.debug = true`, () => {
            const config: AnalyticsConfig = expectedAnalyticsConfig;
            config.debug = true;

            (analyticsService as any).initializeAnalytics(config);

            expectSpyCall(initializeAnalyticsSpy, 1, config);
            expectSpyCall(gaSpy, 2, ['set', 'sendHitTask', null]);

            expect(gaSpy.calls.any()).toBeTruthy();
            expect(gaSpy.calls.count()).toBe(2);
            expect(gaSpy.calls.first().args).toEqual(['create', config.trackingId, 'auto']);
            expect(gaSpy.calls.mostRecent().args).toEqual(['set', 'sendHitTask', null]);

            expect((analyticsService as any).isInitialized).toBeTruthy();
        });

        it(`... should use a custom domain if config.cookieDomain is set`, () => {
            const config: AnalyticsConfig = expectedAnalyticsConfig;
            config.cookieDomain = 'none';

            (analyticsService as any).initializeAnalytics(config);

            expectSpyCall(initializeAnalyticsSpy, 1, config);
            expectSpyCall(gaSpy, 2, ['set', 'sendHitTask', null]);

            expect(gaSpy.calls.any()).toBeTruthy();
            expect(gaSpy.calls.count()).toBe(2);
            expect(gaSpy.calls.first().args).toEqual([
                'create',
                config.trackingId,
                { cookieDomain: config.cookieDomain }
            ]);
            expect(gaSpy.calls.mostRecent().args).toEqual(['set', 'sendHitTask', null]);

            expect((analyticsService as any).isInitialized).toBeTruthy();
        });
    });

    describe('#trackPageView', () => {
        it(`... should track the given page`, () => {
            analyticsService.trackPageView(expectedPage);

            expectSpyCall(gaSpy, 2, ['send', 'pageview']);

            expect(gaSpy.calls.any()).toBeTruthy();
            expect(gaSpy.calls.count()).toBe(2);
            expect(gaSpy.calls.first().args).toEqual(['set', 'page', expectedPage]);
            expect(gaSpy.calls.mostRecent().args).toEqual(['send', 'pageview']);
        });

        it(`... should track page changes`, () => {
            analyticsService.trackPageView(expectedPage);
            analyticsService.trackPageView(otherPage);

            expectSpyCall(gaSpy, 4, ['send', 'pageview']);

            expect(gaSpy.calls.any()).toBeTruthy();
            expect(gaSpy.calls.count()).toBe(4);
            expect(gaSpy.calls.first().args).toEqual(['set', 'page', expectedPage]);
            expect(gaSpy.calls.allArgs()[0]).toEqual(['set', 'page', expectedPage]);
            expect(gaSpy.calls.allArgs()[2]).toEqual(['set', 'page', otherPage]);
            expect(gaSpy.calls.allArgs()[1]).toEqual(['send', 'pageview']);
            expect(gaSpy.calls.allArgs()[3]).toEqual(['send', 'pageview']);
            expect(gaSpy.calls.mostRecent().args).toEqual(['send', 'pageview']);
        });

        it(`... should do nothing if analytics tracker is not initialized successfully`, () => {
            (analyticsService as any).isInitialized = false;

            analyticsService.trackPageView(expectedPage);

            expectSpyCall(gaSpy, 0, null);
            expect(gaSpy.calls.any()).toBeFalse();
        });
    });
});
