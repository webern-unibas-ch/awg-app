import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';

import { EditionGlyphService, EditionStateService } from '@awg-views/edition-view/services';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

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
    standalone: false,
})
export class EditionPrefaceComponent {
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
     * Private readonly injection variable: _editionViewService.
     *
     * It keeps the instance of the injected EditionViewService.
     */
    private readonly _editionViewService = inject(EditionViewService);

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
     * Readonly signal: viewData.
     *
     * It holds the state of the preface view data.
     */
    readonly viewData = this._editionViewService.prefaceViewData;

    /**
     * Constructor of the EditionPrefaceComponent.
     *
     * It updates the edition state to indicate if the preface view is active
     * and declares the self-referring ref variable needed for CompileHtml library.
     *
     */
    constructor() {
        this._editionStateService.updateIsPrefaceView(true);
        this.ref = this;

        inject(DestroyRef).onDestroy(() => {
            this._editionStateService.updateIsPrefaceView(false);
        });
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
}
