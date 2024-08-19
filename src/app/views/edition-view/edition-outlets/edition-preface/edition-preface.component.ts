import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { EDITION_GLYPHS_DATA } from '@awg-views/edition-view/data';
import { PrefaceList } from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';

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
     * Readonly variable: GLYPHS.
     *
     * It keeps the data for musical glyphs.
     */
    readonly GLYPHS = EDITION_GLYPHS_DATA;

    /**
     * Self-referring variable needed for CompileHtml library.
     */
    ref: EditionPrefaceComponent;

    /**
     * Constructor of the EditionPrefaceComponent.
     *
     * It declares private instances of the EditionService and EditionDataService
     * and the self-referring ref variable needed for CompileHtml library.
     *
     * @param {EditionService} editionService Instance of the EditionService.
     * @param {EditionDataService} editionDataService Instance of the EditionDataService.
     */
    constructor(
        private editionService: EditionService,
        private editionDataService: EditionDataService
    ) {
        this.ref = this;
    }

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit(): void {
        this.editionService.updateIsPrefaceView(true);
        this.prefaceData$ = this.editionDataService.getEditionPrefaceData();
    }

    /**
     * Public method: getGlyph.
     *
     * It returns the hex value string for a glyph referenced by the given glyph string.
     *
     * @param {string} glyphString The given glyph string.
     * @returns {string} The hex value string of the given glyph string or empty string.
     */
    getGlyph(glyphString: string): string {
        const glyph = Object.values(this.GLYPHS).find(g => g.alt === glyphString);
        return glyph ? glyph.hex : '';
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
        this.editionService.clearIsPrefaceView();
    }
}
