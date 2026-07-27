import { EditionDataAssetsKeys } from '../models/edition-data.model';
import { EditionSvgSheetList } from '../models/edition-svg-sheet.model';
import { FolioConvoluteList } from '../models/folio.model';
import { GraphList } from '../models/graph.model';
import { IntroList } from '../models/intro.model';
import { PrefaceList } from '../models/preface.model';
import { RowtablesList } from '../models/rowtables.model';
import { SourceDescriptionList } from '../models/source-description.model';
import { SourceEvaluationList } from '../models/source-evaluation.model';
import { SourceList } from '../models/source-list.model';
import { TextcriticsList } from '../models/textcritics.model';

/**
 * Object constant: EDITION_ASSETS_FILES.
 *
 * It is used in the context of the edition view
 * to store the names of the edition assets JSON files.
 */
const EDITION_ASSETS_FILES = {
    folioConvoluteFile: 'folio-convolute.json',
    graphFile: 'graph.json',
    introFile: 'intro.json',
    prefaceFile: 'preface.json',
    rowtablesFile: 'rowtables.json',
    sourceListFile: 'source-list.json',
    sourceDescriptionListFile: 'source-description.json',
    sourceEvaluationListFile: 'source-evaluation.json',
    svgSheetsFile: 'svg-sheets.json',
    textcriticsFile: 'textcritics.json',
};

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
    BASE_ROUTE: 'assets/data',

    /**
     * The names of the edition assets JSON files.
     */

    /**
     * Configuration object for the edition assets data.
     */
    CONFIG: {
        folioConvolute: { file: EDITION_ASSETS_FILES.folioConvoluteFile, fallback: new FolioConvoluteList() },
        graph: { file: EDITION_ASSETS_FILES.graphFile, fallback: new GraphList() },
        intro: { file: EDITION_ASSETS_FILES.introFile, fallback: new IntroList() },
        sourceList: { file: EDITION_ASSETS_FILES.sourceListFile, fallback: new SourceList() },
        sourceDescription: {
            file: EDITION_ASSETS_FILES.sourceDescriptionListFile,
            fallback: new SourceDescriptionList(),
        },
        sourceEvaluation: {
            file: EDITION_ASSETS_FILES.sourceEvaluationListFile,
            fallback: new SourceEvaluationList(),
        },
        svgSheets: { file: EDITION_ASSETS_FILES.svgSheetsFile, fallback: new EditionSvgSheetList() },
        textcritics: { file: EDITION_ASSETS_FILES.textcriticsFile, fallback: new TextcriticsList() },
        preface: { file: EDITION_ASSETS_FILES.prefaceFile, fallback: new PrefaceList() },
        rowtables: { file: EDITION_ASSETS_FILES.rowtablesFile, fallback: new RowtablesList() },
    } as Record<EditionDataAssetsKeys, { file: string; fallback: any }>,
};
