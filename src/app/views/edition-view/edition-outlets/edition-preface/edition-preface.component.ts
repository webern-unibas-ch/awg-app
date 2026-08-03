import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { LanguageId } from '@awg-shared/language-switcher/language.model';

import { EditionGlyphService } from '@awg-views/edition-view/services/edition-glyph.service';
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
     * Readonly signal: viewData.
     *
     * It holds the state of the preface view data.
     */
    readonly viewData = inject(EditionViewService).prefaceViewData;

    /**
     * Public signal: selectedLanguage.
     *
     * It holds the selected language of the edition preface.
     */
    selectedLanguage = signal<LanguageId>(LanguageId.DE);

    /**
     * Self-referring variable needed for CompileHtml library.
     */
    ref: EditionPrefaceComponent = this;

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
}
