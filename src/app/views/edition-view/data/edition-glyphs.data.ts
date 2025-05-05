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
     * Cf. https://w3c.github.io/smufl/latest/tables/standard-accidentals-12-edo.html
     */
    DOUBLE_FLAT: {
        alt: '[bb]',
        hex: '\uE264',
    },

    /**
     * The glyph of a music double sharp sign.
     * Cf. https://w3c.github.io/smufl/latest/tables/standard-accidentals-12-edo.html
     */
    DOUBLE_SHARP: {
        alt: '[x]',
        hex: '\uE263',
    },

    /**
     * The glyph of a music flat sign.
     * Cf. https://w3c.github.io/smufl/latest/tables/standard-accidentals-12-edo.html
     */
    FLAT: {
        alt: '[b]',
        hex: '\uE260',
    },

    /**
     * The glyph of a music natural sign.
     * Cf. https://w3c.github.io/smufl/latest/tables/standard-accidentals-12-edo.html
     */
    NATURAL: {
        alt: '[a]',
        hex: '\uE261',
    },

    /**
     * The glyph of a music sharp sign.
     * Cf. https://w3c.github.io/smufl/latest/tables/standard-accidentals-12-edo.html
     */
    SHARP: {
        alt: '[#]',
        hex: '\uE262',
    },

    /** ********************************/
    /**            DYNAMICS             /
    /** ********************************/
    /**
     * The glyph of a musical forte symbol.
     * Cf. https://w3c.github.io/smufl/latest/tables/dynamics.html
     */
    FORTE: {
        alt: '[f]',
        hex: '\uE522',
    },

    /**
     * The glyph of a musical fortissimo (double forte) symbol.
     * Cf. https://w3c.github.io/smufl/latest/tables/dynamics.html
     */
    FORTISSIMO: {
        alt: '[ff]',
        hex: '\uE52F',
    },

    /**
     * The glyph of a musical triple forte symbol.
     * Cf. https://w3c.github.io/smufl/latest/tables/dynamics.html
     */
    FORTISSIMO3: {
        alt: '[fff]',
        hex: '\uE530',
    },

    /**
     * The glyph of a musical quadruple forte symbol.
     * Cf. https://w3c.github.io/smufl/latest/tables/dynamics.html
     */
    FORTISSIMO4: {
        alt: '[ffff]',
        hex: '\uE531',
    },

    /**
     * The glyph of a musical mezzo forte symbol.
     * Cf. https://w3c.github.io/smufl/latest/tables/dynamics.html
     */
    MEZZOFORTE: {
        alt: '[mf]',
        hex: '\uE52D',
    },

    /**
     * The glyph of a musical mezzo piano symbol.
     * Cf. https://w3c.github.io/smufl/latest/tables/dynamics.html
     */
    MEZZOPIANO: {
        alt: '[mp]',
        hex: '\uE52C',
    },

    /**
     * The glyph of a musical pianissimo (double piano) symbol.
     * Cf. https://w3c.github.io/smufl/latest/tables/dynamics.html
     */
    PIANISSIMO: {
        alt: '[pp]',
        hex: '\uE52B',
    },

    /**
     * The glyph of a musical triple piano symbol.
     * Cf. https://w3c.github.io/smufl/latest/tables/dynamics.html
     */
    PIANISSIMO3: {
        alt: '[ppp]',
        hex: '\uE52A',
    },

    /**
     * The glyph of a musical quadruple piano symbol.
     * Cf. https://w3c.github.io/smufl/latest/tables/dynamics.html
     */
    PIANISSIMO4: {
        alt: '[pppp]',
        hex: '\uE529',
    },

    /**
     * The glyph of a musical piano symbol.
     * Cf. https://w3c.github.io/smufl/latest/tables/dynamics.html
     */
    PIANO: {
        alt: '[p]',
        hex: '\uE520',
    },

    /**
     * The glyph of a musical subito forte symbol.
     * Cf. https://w3c.github.io/smufl/latest/tables/dynamics.html
     */
    SUBITO_FORTE: {
        alt: '[sf]',
        hex: '\uE536',
    },

    /**
     * The glyph of a musical sforzando symbol.
     * Cf. https://w3c.github.io/smufl/latest/tables/dynamics.html
     */
    SFORZANDO: {
        alt: '[sfz]',
        hex: '\uE539',
    },

    /**
     * The glyph of a musical subito piano symbol.
     * Cf. https://w3c.github.io/smufl/latest/tables/dynamics.html
     */
    SUBITO_PIANO: {
        alt: '[sp]',
        hex: '\uE524\uE520',
    },

    /** ***********************************/
    /**            NOTE VALUES             /
    /** ***********************************/
    /**
     * The glyph of a musical eighth note symbol.
     * Cf. https://w3c.github.io/smufl/latest/tables/individual-notes.html
     */
    NOTE_EIGHTH: {
        alt: '[Achtelnote]',
        hex: '\uE1D7',
    },

    /**
     * The glyph of a musical half note symbol.
     * Cf. https://w3c.github.io/smufl/latest/tables/individual-notes.html
     */
    NOTE_HALF: {
        alt: '[Halbe Note]',
        hex: '\uE1D3',
    },

    /**
     * The glyph of a musical half note with dot symbol.
     * Cf. https://w3c.github.io/smufl/latest/tables/individual-notes.html
     */
    NOTE_HALF_DOTTED: {
        alt: '[Punktierte Halbe Note]',
        hex: '\uE1D3 \uE1E7',
    },

    /**
     * The glyph of a musical quarter note symbol.
     * Cf. https://w3c.github.io/smufl/latest/tables/individual-notes.html
     */
    NOTE_QUARTER: {
        alt: '[Viertelnote]',
        hex: '\uE1D5',
    },

    /**
     * The glyph of a musical sixteenth note symbol.
     * Cf. https://w3c.github.io/smufl/latest/tables/individual-notes.html
     */
    NOTE_SIXTEENTH: {
        alt: '[Sechzehntelnote]',
        hex: '\uE1D9',
    },

    /**
     * The glyph of a musical whole note symbol.
     * Cf. https://w3c.github.io/smufl/latest/tables/individual-notes.html
     */
    NOTE_WHOLE: {
        alt: '[Ganze Note]',
        hex: '\uE1D2',
    },

    /** ***********************************/
    /**         PLAYING TECHNIQUES         /
    /** ***********************************/
    /**
     * The glyph of a musical pedal symbol.
     * Cf. https://w3c.github.io/smufl/latest/tables/keyboard-techniques.html
     */
    PEDAL: {
        alt: '[ped]',
        hex: '\uE650',
    },
} as const;
