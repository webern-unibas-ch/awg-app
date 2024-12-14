import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { PrefaceList } from '@awg-views/edition-view/models';
import { EditionDataService, EditionGlyphService, EditionStateService } from '@awg-views/edition-view/services';

/**
 * The EditionPreface component.
 *
 * It contains the preface section
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-preface',
    templateUrl: './edition-preface.component.html',
    styleUrls: ['./edition-preface.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditionPrefaceComponent implements OnInit, OnDestroy {
    /**
     * Public variable: prefaceData$.
     *
     * It keeps an observable of the data of the edition preface.
     */
    prefaceData$: Observable<PrefaceList>;

    /**
     * Public variable: currentLanguage.
     *
     * It keeps the current language of the edition preface: 0 for German, 1 for English.
     */
    currentLanguage = 0;

    /**
     * Self-referring variable needed for CompileHtml library.
     */
    ref: EditionPrefaceComponent;

    /**
     * Private readonly injection variable: _editionDataService.
     *
     * It keeps the instance of the injected EditionDataService.
     */
    private readonly _editionDataService = inject(EditionDataService);

    /**
     * Private readonly injection variable: _editionGlyphService.
     *
     * It keeps the instance of the injected EditionGlyphService.
     */
    private readonly _editionGlyphService = inject(EditionGlyphService);

    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Constructor of the EditionPrefaceComponent.
     *
     * It declares the self-referring ref variable needed for CompileHtml library.
     *
     */
    constructor() {
        this.ref = this;
    }

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit(): void {
        this._editionStateService.updateIsPrefaceView(true);
        this.prefaceData$ = this._editionDataService.getEditionPrefaceData();
    }

    /**
     * Public method: getGlyph.
     *
     * It returns the hex value string for a glyph referenced by the given glyph string
     * via the EditionGlyphService.
     *
     * @param {string} glyphString The given glyph string.
     * @returns {string} The hex value string of the given glyph string or empty string.
     */
    getGlyph(glyphString: string): string {
        return this._editionGlyphService.getGlyph(glyphString);
    }

    /**
     * Public method: setLanguage.
     *
     * It sets the current language of the edition preface.
     *
     * @param {number} language The given language number.
     * @returns {void} Sets the current language.
     */
    setLanguage(language: number): void {
        this.currentLanguage = language;
    }

    /**
     * Angular life cycle hook: ngOnDestroy.
     *
     * It calls the containing methods
     * when destroying the component.
     *
     * Destroys subscriptions.
     */
    ngOnDestroy() {
        this._editionStateService.clearIsPrefaceView();
    }
}
