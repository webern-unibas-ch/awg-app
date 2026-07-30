import { EditionSvgSheetList } from './edition-svg-sheet.model';
import { FolioConvoluteList } from './folio.model';
import { GraphList } from './graph.model';
import { IntroList } from './intro.model';
import { PrefaceList } from './preface.model';
import { RowtablesList } from './rowtables.model';
import { SourceDescriptionList } from './source-description.model';
import { SourceEvaluationList } from './source-evaluation.model';
import { SourceList } from './source-list.model';
import { TextcriticsList } from './textcritics.model';

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
export type EditionStaticDataAssetsKeys = 'preface' | 'rowtables';

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
 * The EditionViewDataTypeMapping type.
 *
 * * It defines the mapping of edition view keys to their corresponding data types.
 */
export interface EditionViewDataTypeMapping {
    graph: {
        graphData: GraphList;
    };
    intro: {
        introData: IntroList;
    };
    preface: {
        prefaceData: PrefaceList;
    };
    report: {
        sourceListData: SourceList;
        sourceDescriptionData: SourceDescriptionList;
        sourceEvaluationData: SourceEvaluationList;
        textcriticsData: TextcriticsList;
    };
    rowtables: {
        rowtablesData: RowtablesList;
    };
    sheets: {
        folioConvoluteData: FolioConvoluteList;
        svgSheetsData: EditionSvgSheetList;
        textcriticsData: TextcriticsList;
    };
}

/**
 * The EditionViewKey type.
 *
 * * It defines the valid keys for the edition view data.
 */
export type EditionViewKey = keyof EditionViewDataTypeMapping;

/**
 * The EditionViewDataContent type.
 *
 * It defines the structure of the data content for a specific edition view key.
 */
export type EditionViewDataContent<K extends EditionViewKey> = {
    [P in keyof EditionViewDataTypeMapping[K]]: EditionViewDataTypeMapping[K][P] | null;
};

/**
 * The EditionViewData interface.
 *
 * It defines the structure of the data used for the different edition views.
 */
export interface EditionViewData<K extends EditionViewKey> {
    /**
     * The data of the edition view.
     */
    data: EditionViewDataContent<K>;

    /**
     * Indicates whether the data is loading.
     */
    isLoading: boolean;

    /**
     * An optional error object if there was an error loading the data.
     */
    error: EditionDataAssetsError | null;
}
