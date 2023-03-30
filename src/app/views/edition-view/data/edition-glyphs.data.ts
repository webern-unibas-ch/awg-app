/**
 * Object constant: EDITION_GLYPHS_DATA.
 *
 * It is used in the context of the edition view
 * to store glyph data.
 */
export const EDITION_GLYPHS_DATA = {
    /**
     * The glyph of a music double flat sign.
     * Cf. https://graphemica.com/%F0%9D%84%AB
     */
    DOUBLE_FLAT: {
        alt: '[bb]',
        hex: '\uD834\uDD2B',
    },

    /**
     * The glyph of a music double sharp sign.
     * Cf. https://graphemica.com/%F0%9D%84%AA
     */
    DOUBLE_SHARP: {
        alt: '[x]',
        hex: '\uD834\uDD2A',
    },

    /**
     * The glyph of a music flat sign.
     * Cf. https://graphemica.com/%E2%99%AD
     */
    FLAT: {
        alt: '[b]',
        hex: '\u266D',
    },

    /**
     * The glyph of a music natural sign.
     * Cf. https://graphemica.com/%E2%99%AE
     */
    NATURAL: {
        alt: '[a]',
        hex: '\u266E',
    },

    /**
     * The glyph of a music sharp sign.
     * Cf. https://graphemica.com/%E2%99%AF
     */
    SHARP: {
        alt: '[#]',
        hex: '\u266F',
    },

    /**
     * The glyph of a musical forte symbol.
     * Cf. https://graphemica.com/%F0%9D%86%91
     */
    FORTE: {
        alt: '[f]',
        hex: '\uD834\uDD91',
    },

    /**
     * The glyph of a musical fortissimo (double forte) symbol.
     * Cf. https://graphemica.com/%F0%9D%86%91
     */
    FORTISSIMO: {
        alt: '[ff]',
        hex: '\uD834\uDD91\uD834\uDD91',
    },

    /**
     * The glyph of a musical piano symbol.
     * Cf. https://graphemica.com/%F0%9D%86%8F
     */
    PIANO: {
        alt: '[p]',
        hex: '\uD834\uDD8F',
    },

    /**
     * The glyph of a musical pianissimo (double piano) symbol.
     * Cf. https://graphemica.com/%F0%9D%86%8F
     */
    PIANISSIMO: {
        alt: '[pp]',
        hex: '\uD834\uDD8F\uD834\uDD8F',
    },
} as const;
