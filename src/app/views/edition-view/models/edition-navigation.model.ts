/**
 * The EditionNavigationFragmentTarget interface.
 *
 * It is used in the context of the edition view
 * to store the target of a navigation to a fragment
 * (of the intro or the report) of an edition complex.
 */
export interface EditionNavigationFragmentTarget {
    /**
     * The id of the target edition complex
     * (empty string for the current complex).
     */
    complexId: string;

    /**
     * The id of the target fragment.
     */
    fragmentId: string;
}

/**
 * The EditionNavigationSheetTarget interface.
 *
 * It is used in the context of the edition view
 * to store the target of a navigation to a svg sheet
 * of an edition complex.
 */
export interface EditionNavigationSheetTarget {
    /**
     * The id of the target edition complex
     * (empty string for the current complex).
     */
    complexId: string;

    /**
     * The full id (incl. partial) of the target svg sheet.
     */
    sheetId: string;
}
