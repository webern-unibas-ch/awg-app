import { DebugElement, DOCUMENT, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { faArrowUp, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { ScrollToTopButtonComponent } from './scroll-to-top-button.component';

describe('ScrollToTopButtonComponent (DONE)', () => {
    let component: ScrollToTopButtonComponent;
    let fixture: ComponentFixture<ScrollToTopButtonComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;
    let mockWindow: Window;

    let windowScrollToSpy: Spy;
    let windowScrollYSpy: Spy;
    let scrollToTopSpy: Spy;

    let expectedScrollThreshold: number;
    let expectedArrowIcon: IconDefinition;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ScrollToTopButtonComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        mockDocument = TestBed.inject(DOCUMENT);
        mockWindow = mockDocument.defaultView || window;

        // Spies
        windowScrollToSpy = vi.spyOn(mockWindow, 'scrollTo').mockImplementation(() => undefined);
        windowScrollYSpy = vi.spyOn(mockWindow, 'scrollY', 'get');

        // Test data
        expectedScrollThreshold = 300;
        expectedArrowIcon = faArrowUp;

        // Create component fixture
        fixture = TestBed.createComponent(ScrollToTopButtonComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Component spies
        scrollToTopSpy = vi.spyOn(component as any, 'scrollToTop');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have `faArrowUp`', () => {
            expectToEqual(component.faArrowUp, faArrowUp);
        });

        it('... should have signal `showScrollButton` to hold false', () => {
            expectToBe(isSignal(component.showScrollButton), true);

            expectToBe(component.showScrollButton(), false);
        });

        describe('#VIEW', () => {
            it('... should contain no scroll-to-top button', () => {
                getAndExpectDebugElementByCss(compDe, 'button.awg-scroll-to-top-btn', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('#VIEW', () => {
            describe('... with `showScrollButton` signal set to false', () => {
                it('... should contain no scroll-to-top button', () => {
                    getAndExpectDebugElementByCss(compDe, 'button.awg-scroll-to-top-btn', 0, 0);
                });
            });

            describe('... with `showScrollButton` signal set to true', () => {
                beforeEach(() => {
                    component.showScrollButton.set(true);

                    fixture.detectChanges();
                });

                it('... should contain one button.awg-scroll-to-top if isScrolled is true', () => {
                    getAndExpectDebugElementByCss(compDe, 'button.awg-scroll-to-top-btn', 1, 1);
                });

                it('... should display arrow icon in scroll button ', () => {
                    const btnDes = getAndExpectDebugElementByCss(compDe, 'button.awg-scroll-to-top-btn', 1, 1);
                    const faIconDes = getAndExpectDebugElementByCss(btnDes[0], 'fa-icon', 1, 1);
                    const faIconIns = faIconDes[0].componentInstance.icon;

                    expectToEqual(faIconIns(), expectedArrowIcon);
                });

                it('... should trigger `scrollToTop` method on button click', async () => {
                    const btnDes = getAndExpectDebugElementByCss(compDe, 'button.awg-scroll-to-top-btn', 1, 1);

                    await clickAndAwaitChanges(btnDes[0], fixture);

                    expectSpyCall(scrollToTopSpy, 1);
                });
            });
        });

        describe('METHODS', () => {
            describe('#onWindowScroll()', () => {
                it('... should have a method `onWindowScroll`', () => {
                    expect((component as any).onWindowScroll).toBeDefined();
                });

                describe('... should set `showScrollButton` signal based on scrollY position if ...', () => {
                    it.each([
                        { desc: 'window.scrollY is undefined', offset: undefined, expected: false },
                        { desc: 'scrollY is below threshold', offset: -1, expected: false },
                        { desc: 'scrollY is above threshold', offset: 1, expected: true },
                    ])('... $desc ($expected)', ({ offset, expected }) => {
                        const scrollY = offset === undefined ? undefined : expectedScrollThreshold + offset;

                        windowScrollYSpy.mockReturnValue(scrollY as any);

                        (component as any).onWindowScroll();

                        expectToBe(component.showScrollButton(), expected);
                    });
                });

                it('... should toggle `showScrollButton` based on scrollY position of scroll event', () => {
                    windowScrollYSpy.mockReturnValue(expectedScrollThreshold - 1);

                    (component as any).onWindowScroll();

                    expectToBe(component.showScrollButton(), false);

                    windowScrollYSpy.mockReturnValue(expectedScrollThreshold + 1);

                    (component as any).onWindowScroll();

                    expectToBe(component.showScrollButton(), true);
                });
            });

            describe('#scrollToTop()', () => {
                it('... should have a method `scrollToTop`', () => {
                    expect((component as any).scrollToTop).toBeDefined();
                });

                it('... should trigger window:scrollTo with correct parameters', () => {
                    (component as any).scrollToTop();

                    expectSpyCall(windowScrollToSpy, 1, { top: 0, behavior: 'smooth' });
                });

                it('... should request scrolling to top of page', () => {
                    const baselineCallCount = windowScrollToSpy.mock.calls.length;

                    windowScrollYSpy.mockReturnValue(expectedScrollThreshold + 1);

                    (component as any).onWindowScroll();

                    expectToBe(component.showScrollButton(), true);

                    (component as any).scrollToTop();

                    expectSpyCall(windowScrollToSpy, baselineCallCount + 1, { top: 0, behavior: 'smooth' });
                });
            });
        });
    });
});
