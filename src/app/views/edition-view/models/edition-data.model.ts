/**
 * The EditionComplexDataAssetsKeys type.
 *
 * * It defines the valid keys for the complex data assets used in the EditionDataService.
 */
export type EditionComplexDataAssetsKeys =
    | 'folioConvolute'
    | 'graph'
    | 'intro'
    | 'sourceList'
    | 'sourceDescription'
    | 'sourceEvaluation'
    | 'svgSheets'
    | 'textcritics';

/**
 * The EditionStaticDataAssetsKeys type.
 *
 * * It defines the valid keys for the static data assets used in the EditionDataService.
 */
export type EditionStaticDataAssetsKeys = 'preface' | 'rowTables';

/**
 * The EditionDataAssetsKeys type.
 *
 * * It defines the valid keys for any data assets used in the EditionDataService.
 */
export type EditionDataAssetsKeys = EditionStaticDataAssetsKeys | EditionComplexDataAssetsKeys;

/**
 * The EditionDataAssetsError interface.
 *
 * It defines the structure of an error object for data assets.
 */
export interface EditionDataAssetsError {
    /**
     * The key of the data asset that caused the error.
     */
    key: EditionDataAssetsKeys;

    /**
     * The error object associated with the data asset.
     */
    error: any;
}

/**
 * The EditionViewData interface.
 *
 * It defines the structure of the data used for the different edition views.
 */
export interface EditionViewData<T> {
    /**
     * The data of the edition view.
     */
    data: T;

    /**
     * Indicates whether the data is loading.
     */
    isLoading: boolean;

    /**
     * An optional error object if there was an error loading the data.
     */
    error: EditionDataAssetsError | null;
}
