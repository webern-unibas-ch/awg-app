import { Injectable } from '@angular/core';

import { EDITION_GLYPHS_DATA } from '@awg-views/edition-view/data';

/**
 * The EditionGlyph service.
 *
 * It provides methods to get
 * the hex value of a musical glyph.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class EditionGlyphService {
    /**
     * Readonly variable: GLYPHS.
     *
     * It keeps the data for musical glyphs.
     */
    readonly GLYPHS = EDITION_GLYPHS_DATA;

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
}
