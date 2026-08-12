import { EditionSvgSheetsList } from './edition-svg-sheets.model';
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
    error: unknown;
}

/**
 * The EditionViewDataTypeMapping type.
 *
 * * It defines the mapping of edition view keys to their corresponding data types.
 */
export interface EditionViewDataTypeMapping {
    /**
     * The data structure for the 'graph' view.
     */
    graph: {
        graphData: GraphList;
    };

    /**
     * The data structure for the 'intro' view.
     */
    intro: {
        introData: IntroList;
    };

    /**
     * The data structure for the 'preface' view.
     */
    preface: {
        prefaceData: PrefaceList;
    };

    /**
     * The data structure for the 'rowtables' view.
     */
    rowtables: {
        rowtablesData: RowtablesList;
    };

    /**
     * The data structure for the 'report' view.
     */
    report: {
        sourceListData: SourceList;
        sourceDescriptionData: SourceDescriptionList;
        sourceEvaluationData: SourceEvaluationList;
        textcriticsData: TextcriticsList;
    };

    /**
     * The data structure for the 'sheets' view.
     */
    sheets: {
        folioConvoluteData: FolioConvoluteList;
        svgSheetsData: EditionSvgSheetsList;
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
     * A flag indicating whether the data is loading.
     */
    isLoading: boolean;

    /**
     * An optional error object if there was an error loading the data.
     */
    error: EditionDataAssetsError | null;
}

/**
 * The KnownViewContexts type.
 *
 * It defines the structure of the known contexts for edition views.
 */
type KnownViewContexts =
    | { name: 'intro'; isIntro: true; isPreface: false; isRowtables: false }
    | { name: 'preface'; isIntro: false; isPreface: true; isRowtables: false }
    | { name: 'rowtables'; isIntro: false; isPreface: false; isRowtables: true };

/**
 * The DynamicViewContexts type.
 *
 * It defines the structure of the dynamic contexts for edition views.
 */
interface DynamicViewContexts {
    /**
     * The name of the current edition view, excluding KnownViewContexts, or any string.
     */
    name: Exclude<EditionViewKey, 'intro' | 'preface' | 'rowtables'> | (string & {});
    /**
     * A flag indicating whether the current view is the intro view.
     */
    isIntro: false;

    /**
     * A flag indicating whether the current view is the preface view.
     */
    isPreface: false;

    /**
     * A flag indicating whether the current view is the rowtables view.
     */
    isRowtables: false;
}

/**
 * The EditionViewContext type.
 *
 * It defines the structure of the context for the edition view.
 */
export type EditionViewContext = KnownViewContexts | DynamicViewContexts;
