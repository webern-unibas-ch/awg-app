import { Service } from '@angular/core';

import { EDITION_GLYPHS_DATA } from '../data/edition-glyphs.data';

/**
 * The EditionGlyph service.
 *
 * It provides methods to get
 * the hex value of a musical glyph.
 */
@Service()
export class EditionGlyphService {
    /**
     * Public method: getGlyph.
     *
     * It returns the hex value string for a glyph referenced by the given glyph string.
     *
     * @param {string} glyphString The given glyph string.
     * @returns {string} The hex value string of the given glyph string or empty string.
     */
    getGlyph(glyphString: string): string {
        const glyph = Object.values(EDITION_GLYPHS_DATA).find(g => g.alt === glyphString);
        return glyph ? glyph.hex : '';
    }
}
