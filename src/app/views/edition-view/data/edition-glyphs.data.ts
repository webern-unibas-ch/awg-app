/**
 * Object constant: EDITION_GLYPHS_DATA.
 *
 * It is used in the context of the edition view
 * to store glyph data.
 */
export const EDITION_GLYPHS_DATA = {
    /** ***********************************/
    /**            ACCIDENTALS             /
    /** ***********************************/
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

    /** ********************************/
    /**            DYNAMICS             /
    /** ********************************/
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
     * The glyph of a musical triple forte symbol.
     * Cf. https://graphemica.com/%F0%9D%86%91
     */
    FORTISSIMO3: {
        alt: '[fff]',
        hex: '\uD834\uDD91\uD834\uDD91\uD834\uDD91',
    },

    /**
     * The glyph of a musical quadruple forte symbol.
     * Cf. https://graphemica.com/%F0%9D%86%91
     */
    FORTISSIMO4: {
        alt: '[ffff]',
        hex: '\uD834\uDD91\uD834\uDD91\uD834\uDD91\uD834\uDD91',
    },

    /**
     * The glyph of a musical mezzo forte symbol.
     * Cf. https://graphemica.com/%F0%9D%86%90
     */
    MEZZOFORTE: {
        alt: '[mf]',
        hex: '\uD834\uDD90\uD834\uDD91',
    },

    /**
     * The glyph of a musical mezzo piano symbol.
     * Cf. https://graphemica.com/%F0%9D%86%90
     */
    MEZZOPIANO: {
        alt: '[mp]',
        hex: '\uD834\uDD90\uD834\uDD8F',
    },

    /**
     * The glyph of a musical pianissimo (double piano) symbol.
     * Cf. https://graphemica.com/%F0%9D%86%8F
     */
    PIANISSIMO: {
        alt: '[pp]',
        hex: '\uD834\uDD8F\uD834\uDD8F',
    },

    /**
     * The glyph of a musical triple piano symbol.
     * Cf. https://graphemica.com/%F0%9D%86%8F
     */
    PIANISSIMO3: {
        alt: '[ppp]',
        hex: '\uD834\uDD8F\uD834\uDD8F\uD834\uDD8F',
    },

    /**
     * The glyph of a musical quadruple piano symbol.
     * Cf. https://graphemica.com/%F0%9D%86%8F
     */
    PIANISSIMO4: {
        alt: '[pppp]',
        hex: '\uD834\uDD8F\uD834\uDD8F\uD834\uDD8F\uD834\uDD8F',
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
     * The glyph of a musical subito forte symbol.
     * Cf. https://graphemica.com/%F0%9D%86%8D
     */
    SUBITO_FORTE: {
        alt: '[sf]',
        hex: '\uD834\uDD8D\uD834\uDD91',
    },

    /**
     * The glyph of a musical sforzando symbol.
     * Cf. https://graphemica.com/%F0%9D%86%8D
     */
    SFORZANDO: {
        alt: '[sfz]',
        hex: '\uD834\uDD8D\uD834\uDD91\uD834\uDD8E',
    },

    /**
     * The glyph of a musical subito piano symbol.
     * Cf. https://graphemica.com/%F0%9D%86%8D
     */
    SUBITO_PIANO: {
        alt: '[sp]',
        hex: '\uD834\uDD8D\uD834\uDD8F',
    },

    /** ***********************************/
    /**            NOTE VALUES             /
    /** ***********************************/
    /**
     * The glyph of a musical eighth note symbol.
     * Cf. https://graphemica.com/%F0%9D%85%A0
     */
    NOTE_EIGHTH: {
        alt: '[Achtelnote]',
        hex: '\uD834\uDD60',
    },

    /**
     * The glyph of a musical half note symbol.
     * Cf. https://graphemica.com/%F0%9D%85%9E
     */
    NOTE_HALF: {
        alt: '[Halbe Note]',
        hex: '\uD834\uDD5E',
    },

    /**
     * The glyph of a musical quarter note symbol.
     * Cf. https://graphemica.com/%F0%9D%85%9F
     */
    NOTE_QUARTER: {
        alt: '[Viertelnote]',
        hex: '\uD834\uDD5F',
    },

    /**
     * The glyph of a musical sixteenth note symbol.
     * Cf. https://graphemica.com/%F0%9D%85%A1
     */
    NOTE_SIXTEENTH: {
        alt: '[Sechzehntelnote]',
        hex: '\uD834\uDD61',
    },

    /**
     * The glyph of a musical whole note symbol.
     * Cf. https://graphemica.com/%F0%9D%85%9D
     */
    NOTE_WHOLE: {
        alt: '[Ganze Note]',
        hex: '\uD834\uDD5D',
    },

    /** ***********************************/
    /**         PLAYING TECHNIQUES         /
    /** ***********************************/
    /**
     * The glyph of a musical pedal symbol.
     * Cf. https://graphemica.com/%F0%9D%86%AE
     */
    PEDAL: {
        alt: '[ped]',
        hex: '\uD834\uDDAE',
    },
} as const;
