import { Directive, effect, ElementRef, inject, input } from '@angular/core';

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
     * Private readonly variable: _abbreviations.
     *
     * It keeps a list of abbreviations and their full forms.
     */
    private readonly _abbreviations = new Map<string, string>([
        // General
        ['Bl.', 'Blatt (r - recto, v - verso)'],
        ['S.', 'Seite'],
        ['T.', 'Takt'],
        // Instrumentations
        ['Ges.', 'Gesang'],
        ['Klav. o.', 'Klavier oben'],
        ['Klav. u.', 'Klavier unten'],
        ['Klav.', 'Klavier'],
        // RISM-IDs
        ['A-Was', 'Arnold Schönberg Center, Wien'],
        ['A-Wn', 'Österreichische Nationalbibliothek, Musiksammlung, Wien'],
        ['A-Wst', 'Wienbibliothek im Rathaus, Musiksammlung, Wien'],
        ['A-Wue', 'Universal Edition, Historisches Archiv, Wien'],
        ['CH-Bps', 'Paul Sacher Stiftung, Basel'],
        ['CH-END', 'Dokumentationsbibliothek Walter Labhart, Endingen'],
        ['GB-Lbl', 'The Britisch Library, London'],
        ['US-NH', 'Yale University, Irving S. Gilmore Music Library, New Haven, CT'],
        ['US-NYpm', 'The Morgan Library & Museum, New York City, NY'],
        ['US-Wc', 'The Library of Congress, Music Division, Washington, D.C.'],
    ]);

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
        const abbreviationsPattern = Array.from(this._abbreviations.keys())
            .map(key => key.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'))
            .join('|');
        const regex = new RegExp(String.raw`(?<!\w)(${abbreviationsPattern})(?!\w)`, 'g');

        // Replace abbreviations with <abbr> elements
        innerHTML = innerHTML.replace(regex, match => {
            const full = this._abbreviations.get(match);
            return `<abbr title="${full}">${match}</abbr>`;
        });

        this._el.nativeElement.innerHTML = innerHTML;
    }
}
