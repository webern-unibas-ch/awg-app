import { Directive, effect, ElementRef, inject, input } from '@angular/core';

import { ABBR_UTILS } from './abbr.utils';

/**
 * The abbr directive.
 *
 * It is used to create an abbreviation element.
 */
@Directive({
    selector: '[awgAbbr]',
})
export class AbbrDirective {
    /**
     * Private readonly injection variable: _elementRef.
     *
     * It keeps the reference to the host element.
     */
    private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    /**
     * Readonly input signal: text.
     *
     * It holds the text value with a possible abbreviation.
     */
    readonly text = input<string>('', { alias: 'awgAbbr' });

    /**
     * The constructor of the AbbrDirective.
     *
     * It holds an effect that registers a dependency on `this.text()` and re-runs
     * automatically whenever the input signal updates.
     */
    constructor() {
        effect(() => {
            this._replaceAbbreviations();
        });
    }

    /**
     * Private method: _replaceAbbreviations.
     *
     * It replaces abbreviations in the text with abbreviation elements
     * containing the full form as title.
     *
     * @returns {void} Replaces abbreviations in the text.
     */
    private _replaceAbbreviations(): void {
        const text = this.text() || '';
        const element = this._elementRef.nativeElement;
        element.innerHTML = text;

        if (!text) {
            return;
        }

        ABBR_UTILS.applyAbbreviations(element);
    }
}
