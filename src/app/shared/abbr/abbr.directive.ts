import { Directive, effect, ElementRef, inject, input } from '@angular/core';

import abbreviationsData from 'assets/data/edition/abbreviations.json';

/**
 * Object constant: ABBREVIATIONS.
 *
 * It keeps a map of abbreviations and their full forms.
 */
const ABBREVIATIONS = new Map<string, string>(Object.entries(abbreviationsData.abbreviations));

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
     * Private readonly injection variable: _el.
     *
     * It keeps the instance of the injected Angular ElementRef.
     */
    private readonly _el = inject(ElementRef<HTMLElement>);

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
        let innerHTML = this.text();

        if (!innerHTML) {
            this._el.nativeElement.innerHTML = '';
            return;
        }

        // Construct a single regular expression to match any abbreviation
        const abbreviationsPattern = Array.from(ABBREVIATIONS.keys())
            .sort((left, right) => right.length - left.length)
            .map(key => key.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'))
            .join('|');
        const regex = new RegExp(String.raw`(?<!\w)(${abbreviationsPattern})(?!\w)`, 'g');

        // Replace abbreviations with <abbr> elements
        innerHTML = innerHTML.replace(regex, match => {
            const full = ABBREVIATIONS.get(match);
            return `<abbr title="${full}">${match}</abbr>`;
        });

        this._el.nativeElement.innerHTML = innerHTML;
    }
}
