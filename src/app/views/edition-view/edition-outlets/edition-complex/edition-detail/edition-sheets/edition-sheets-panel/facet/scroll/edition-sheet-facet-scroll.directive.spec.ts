import { Component, DebugElement, isSignal, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { EditionSheetFacetScrollDirective } from './edition-sheet-facet-scroll.directive';

// Test host component
@Component({
    template: `
        <div
            class="test-list"
            [awgEditionSheetFacetScroll]="trigger()"
            [activeSelector]="activeSelector()"
            [itemSelector]="itemSelector()">
            <a class="test-link" [class.active]="activeIndex() === 0">Link 0</a>
            <a class="test-link" [class.active]="activeIndex() === 1">Link 1</a>
            <a class="test-link" [class.active]="activeIndex() === 2">Link 2</a>
        </div>
    `,
    imports: [EditionSheetFacetScrollDirective],
})
class TestEditionSheetFacetScrollComponent {
    trigger = signal<unknown>('initial');
    activeIndex = signal<number | null>(null);
    activeSelector = signal('.test-link.active');
    itemSelector = signal('.test-link');
}

describe('EditionSheetFacetScrollDirective (DONE)', () => {
    let hostComponent: TestEditionSheetFacetScrollComponent;
    let fixture: ComponentFixture<TestEditionSheetFacetScrollComponent>;
    let compDe: DebugElement;

    let listEl: HTMLElement;

    const getDirective = () =>
        getAndExpectDebugElementByDirective(compDe, EditionSheetFacetScrollDirective, 1, 1)[0].injector.get(
            EditionSheetFacetScrollDirective
        );
    const mockRect = (top: number, height: number) => ({ top, height }) as DOMRect;
    const mockLayout = (activeTop: number, activeHeight: number) => {
        // List: visible area of 100px, starting at 0
        Object.defineProperty(listEl, 'clientHeight', { configurable: true, value: 100 });
        vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
            return this === listEl ? mockRect(0, 100) : mockRect(activeTop, activeHeight);
        });
    };
    const activateLink = async (index: number, trigger: unknown) => {
        hostComponent.activeIndex.set(index);
        hostComponent.trigger.set(trigger);
        await detectChangesOnPush(fixture);
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestEditionSheetFacetScrollComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestEditionSheetFacetScrollComponent);
        hostComponent = fixture.componentInstance;
        compDe = fixture.debugElement;

        fixture.detectChanges();

        listEl = getAndExpectDebugElementByCss(compDe, 'div.test-list', 1, 1)[0].nativeElement;

        // Mock scrollTop: real browsers clamp it to the (here tiny) scrollable height, jsdom does not
        let mockScrollTop = 0;
        Object.defineProperty(listEl, 'scrollTop', {
            configurable: true,
            get: () => mockScrollTop,
            set: (value: number) => {
                mockScrollTop = value;
            },
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create the host with one directive instance', () => {
        expect(hostComponent).toBeTruthy();
        expect(getDirective()).toBeTruthy();
    });

    it('... should have input signal `trigger` to hold the provided value', () => {
        expectToBe(isSignal(getDirective().trigger), true);

        expectToBe(getDirective().trigger(), 'initial');
    });

    it('... should have input signal `activeSelector` to hold the provided selector', () => {
        expectToBe(isSignal(getDirective().activeSelector), true);

        expectToBe(getDirective().activeSelector(), '.test-link.active');
    });

    it('... should have input signal `itemSelector` to hold the provided selector', () => {
        expectToBe(isSignal(getDirective().itemSelector), true);

        expectToBe(getDirective().itemSelector(), '.test-link');
    });

    it('... should have signal `visibleRange` to hold null if the list does not scroll', () => {
        expectToBe(isSignal(getDirective().visibleRange), true);

        expectToBe(getDirective().visibleRange(), null);
    });

    describe('METHODS', () => {
        describe('#scrollActiveItemIntoView()', () => {
            it('... should have a method `scrollActiveItemIntoView`', () => {
                expect(getDirective().scrollActiveItemIntoView).toBeDefined();
            });

            it('... should be called when the trigger changes', async () => {
                const scrollSpy = vi.spyOn(getDirective(), 'scrollActiveItemIntoView');

                hostComponent.trigger.set('next');
                await detectChangesOnPush(fixture);

                expectSpyCall(scrollSpy, 1);
            });

            it('... should scroll the active item into the visible area if it is below', async () => {
                mockLayout(250, 30);

                await activateLink(1, 'next');

                expectToBe(listEl.scrollTop, 180);
            });

            it('... should scroll the active item into the visible area if it is above', async () => {
                listEl.scrollTop = 200;
                // Relative to the list: 200 - 150 = 50
                mockLayout(-150, 30);

                await activateLink(0, 'next');

                expectToBe(listEl.scrollTop, 50);
            });

            it('... should scroll the active item into the visible area if it is below in an already scrolled list', async () => {
                listEl.scrollTop = 100;
                // Relative to the list: 100 + 250 = 350 (bottom 380), visible area 100–200
                mockLayout(250, 30);

                await activateLink(1, 'next');

                expectToBe(listEl.scrollTop, 280);
            });

            it('... should not change the scroll position if the active item is visible', async () => {
                mockLayout(20, 30);

                await activateLink(0, 'next');

                expectToBe(listEl.scrollTop, 0);
            });

            it('... should not change the scroll position if the active item exactly fills the visible area', async () => {
                mockLayout(0, 100);

                await activateLink(0, 'next');

                expectToBe(listEl.scrollTop, 0);
            });

            it('... should not change the scroll position if there is no active item', async () => {
                const rectSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect');

                hostComponent.trigger.set('next');
                await detectChangesOnPush(fixture);

                expectToBe(listEl.scrollTop, 0);
                expectSpyCall(rectSpy, 0);
            });

            it('... should use the provided `activeSelector` to find the active item', async () => {
                const rectSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect');
                hostComponent.activeSelector.set('.not-existing.active');

                await activateLink(1, 'next');

                expectSpyCall(rectSpy, 0);
            });
        });

        describe('#updateVisibleRange()', () => {
            let linkEls: HTMLElement[];

            // List: visible area of 100px (0–100), scrollable content of 300px
            const mockScrollableLayout = (linkTops: number[]) => {
                Object.defineProperty(listEl, 'clientHeight', { configurable: true, value: 100 });
                Object.defineProperty(listEl, 'scrollHeight', { configurable: true, value: 300 });
                vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
                    this: HTMLElement
                ) {
                    const linkIndex = linkEls.indexOf(this);
                    return linkIndex >= 0 ? mockRect(linkTops[linkIndex], 30) : mockRect(0, 100);
                });
            };

            beforeEach(() => {
                linkEls = getAndExpectDebugElementByCss(compDe, 'a.test-link', 3, 3).map(de => de.nativeElement);
            });

            it('... should have a method `updateVisibleRange`', () => {
                expect(getDirective().updateVisibleRange).toBeDefined();
            });

            it('... should be called when the trigger changes', async () => {
                const updateSpy = vi.spyOn(getDirective(), 'updateVisibleRange');

                hostComponent.trigger.set('next');
                await detectChangesOnPush(fixture);

                expectSpyCall(updateSpy, 1);
            });

            it('... should be called on scroll of the list', () => {
                const updateSpy = vi.spyOn(getDirective(), 'updateVisibleRange');

                listEl.dispatchEvent(new Event('scroll'));

                expectSpyCall(updateSpy, 1);
            });

            it('... should be called on resize of the window', () => {
                const updateSpy = vi.spyOn(getDirective(), 'updateVisibleRange');

                window.dispatchEvent(new Event('resize'));

                expectSpyCall(updateSpy, 1);
            });

            it('... should set `visibleRange` to the (partly) visible items', () => {
                // Link 0 above (-50 to -20), link 1 partly visible (80–110), link 2 below (150–180)
                mockScrollableLayout([-50, 80, 150]);

                getDirective().updateVisibleRange();

                expectToEqual(getDirective().visibleRange(), { first: 2, last: 2 });
            });

            it('... should set `visibleRange` to the first and last visible item', () => {
                // Link 0 partly visible (-10 to 20), link 1 visible (30–60), link 2 partly visible (90–120)
                mockScrollableLayout([-10, 30, 90]);

                getDirective().updateVisibleRange();

                expectToEqual(getDirective().visibleRange(), { first: 1, last: 3 });
            });

            it('... should set `visibleRange` to null if no item is visible', () => {
                mockScrollableLayout([-100, -60, 200]);

                getDirective().updateVisibleRange();

                expectToBe(getDirective().visibleRange(), null);
            });

            it('... should set `visibleRange` to null if the list does not scroll', () => {
                mockScrollableLayout([-10, 30, 90]);
                Object.defineProperty(listEl, 'scrollHeight', { configurable: true, value: 100 });

                getDirective().updateVisibleRange();

                expectToBe(getDirective().visibleRange(), null);
            });

            it('... should set `visibleRange` to null if the list contains no items', async () => {
                mockScrollableLayout([-10, 30, 90]);
                hostComponent.itemSelector.set('.not-existing');
                await detectChangesOnPush(fixture);

                getDirective().updateVisibleRange();

                expectToBe(getDirective().visibleRange(), null);
            });

            it('... should keep the same `visibleRange` value if the range does not change', () => {
                mockScrollableLayout([-10, 30, 90]);
                getDirective().updateVisibleRange();
                const firstRange = getDirective().visibleRange();

                getDirective().updateVisibleRange();

                expectToBe(getDirective().visibleRange(), firstRange);
            });

            it('... should update `visibleRange` on scroll of the list', () => {
                mockScrollableLayout([-10, 30, 90]);

                listEl.dispatchEvent(new Event('scroll'));

                expectToEqual(getDirective().visibleRange(), { first: 1, last: 3 });
            });
        });
    });
});
