import { afterRenderEffect, Directive, ElementRef, inject, input, signal } from '@angular/core';

import { EditionSheetFacetVisibleRange } from '../edition-sheet-facet.model';

/**
 * The EditionSheetFacetScroll directive.
 *
 * It keeps the active facet item visible inside a scrollable
 * facet list by adjusting the scroll position of the list
 * (without scrolling the page) whenever the trigger changes.
 * It also provides the range of the currently visible facet items.
 */
@Directive({
    selector: '[awgEditionSheetFacetScroll]',
    exportAs: 'awgEditionSheetFacetScroll',
    host: {
        '(scroll)': 'updateVisibleRange()',
        '(window:resize)': 'updateVisibleRange()',
    },
})
export class EditionSheetFacetScrollDirective {
    /**
     * Private readonly injection variable: _elementRef.
     *
     * It keeps the reference to the host element (the scrollable list).
     */
    private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    /**
     * Readonly input signal: trigger.
     *
     * It holds the value that triggers a new scroll check when it changes
     * (e.g. the selected sheet id and the open state of the facet group).
     */
    readonly trigger = input.required<unknown>({ alias: 'awgEditionSheetFacetScroll' });

    /**
     * Readonly input signal: activeSelector.
     *
     * It holds the css selector of the active facet item inside the list.
     * @default the active facet item link or dropdown toggle
     */
    readonly activeSelector = input<string>(
        '.awg-edition-sheet-facet-item-link.active, .awg-edition-sheet-facet-item-link-dropdown-toggle.active'
    );

    /**
     * Readonly input signal: itemSelector.
     *
     * It holds the css selector of the facet items inside the list
     * that are counted for the visible range.
     * @default the facet item components
     */
    readonly itemSelector = input<string>('awg-edition-sheet-facet-item');

    /**
     * Readonly signal: visibleRange.
     *
     * It holds the range of the (at least partly) visible facet items,
     * or null if the list does not scroll or contains no items.
     * Equal ranges do not notify (avoids change detection on every scroll event).
     */
    readonly visibleRange = signal<EditionSheetFacetVisibleRange | null>(null, {
        equal: (a, b) => a?.first === b?.first && a?.last === b?.last,
    });

    /**
     * Constructor of the EditionSheetFacetScrollDirective.
     *
     * It registers an effect to scroll the active facet item
     * into the visible area of the list after each relevant render
     * and to update the visible range afterwards.
     */
    constructor() {
        afterRenderEffect(() => {
            this.trigger();
            this.scrollActiveItemIntoView();
            this.updateVisibleRange();
        });
    }

    /**
     * Public method: updateVisibleRange.
     *
     * It updates the {@link visibleRange} with the range of the
     * (at least partly) visible facet items of the host list.
     *
     * @returns {void} Sets the visible range.
     */
    updateVisibleRange(): void {
        const listEl = this._elementRef.nativeElement;
        const itemEls = Array.from(listEl.querySelectorAll<HTMLElement>(this.itemSelector()));

        if (!itemEls.length || listEl.scrollHeight <= listEl.clientHeight) {
            this.visibleRange.set(null);
            return;
        }

        const listRect = listEl.getBoundingClientRect();
        const itemRects = itemEls.map(itemEl => itemEl.getBoundingClientRect());

        this.visibleRange.set(this._getVisibleRange(listRect.top, listEl.clientHeight, itemRects));
    }

    /**
     * Public method: scrollActiveItemIntoView.
     *
     * It adjusts the scroll position of the host list
     * so that the active facet item is fully visible.
     *
     * @returns {void} Sets the scroll position of the host list.
     */
    scrollActiveItemIntoView(): void {
        const listEl = this._elementRef.nativeElement;
        const activeEl = listEl.querySelector<HTMLElement>(this.activeSelector());

        if (!activeEl) {
            return;
        }

        const listRect = listEl.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();
        const activeTop = activeRect.top - listRect.top + listEl.scrollTop;

        listEl.scrollTop = this._getScrollTopForVisibleChild(
            listEl.scrollTop,
            listEl.clientHeight,
            activeTop,
            activeRect.height
        );
    }

    /**
     * Private method: _getScrollTopForVisibleChild.
     *
     * It calculates the scroll position of the list
     * that makes the given child fully visible.
     * The scroll position only changes if the child is (partly) outside the visible area.
     *
     * @param {number} scrollTop The current scroll position of the list.
     * @param {number} viewportHeight The visible height of the list.
     * @param {number} childTop The top position of the child relative to the content of the list.
     * @param {number} childHeight The height of the child.
     * @returns {number} The scroll position that makes the child visible.
     */
    private _getScrollTopForVisibleChild(
        scrollTop: number,
        viewportHeight: number,
        childTop: number,
        childHeight: number
    ): number {
        if (childTop < scrollTop) {
            return childTop;
        }

        const childBottom = childTop + childHeight;
        if (childBottom > scrollTop + viewportHeight) {
            return childBottom - viewportHeight;
        }

        return scrollTop;
    }

    /**
     * Private method: _getVisibleRange.
     *
     * It calculates the (1-based) positions of the first and last item
     * that are at least partly inside the visible area of the list.
     *
     * @param {number} listTop The top position of the visible area of the list.
     * @param {number} viewportHeight The visible height of the list.
     * @param {DOMRect[]} itemRects The bounding rects of the items.
     * @returns {EditionSheetFacetVisibleRange | null} The visible range, or null if no item is visible.
     */
    private _getVisibleRange(
        listTop: number,
        viewportHeight: number,
        itemRects: DOMRect[]
    ): EditionSheetFacetVisibleRange | null {
        const listBottom = listTop + viewportHeight;
        const visibleIndexes = itemRects
            .map((rect, index) => (rect.top + rect.height > listTop && rect.top < listBottom ? index : -1))
            .filter(index => index >= 0);

        if (!visibleIndexes.length) {
            return null;
        }

        return { first: visibleIndexes[0] + 1, last: visibleIndexes[visibleIndexes.length - 1] + 1 };
    }
}
