/**
 * Object constant: EDITION_ASSETS_DATA.
 *
 * It is used in the context of the edition view
 * to store data of the edition assets.
 */
export const EDITION_ASSETS_DATA = {
    /**
     * The base route to the edition assets JSON files.
     */
    BASE_ROUTE: 'assets/data/edition',

    /**
     * The names of the edition assets JSON files.
     */
    FILES: {
        folioConvoluteFile: 'folio-convolute.json',
        graphFile: 'graph.json',
        introFile: 'intro.json',
        svgSheetsFile: 'svg-sheets.json',
        sourceListFile: 'source-list.json',
        sourceDescriptionListFile: 'source-description.json',
        sourceEvaluationListFile: 'source-evaluation.json',
        textcriticsFile: 'textcritics.json',
    },
} as const;
