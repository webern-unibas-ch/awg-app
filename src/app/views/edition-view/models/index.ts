/**
 *
 *              EditionModels
 *
 * This file exports models that are used
 * for the Edition view.
 *
 */

import { D3Selection } from './d3-selection.model';
import { D3ZoomBehaviour } from './d3-zoom-behaviour.model';

import {
    EditionComplex,
    EditionComplexesJsonData,
    EditionComplexesList,
    EditionComplexJsonData,
    EditionComplexTitleStatement,
} from './edition-complex.model';
import {
    EditionOutline,
    EditionOutlineComplexItem,
    EditionOutlineJsonData,
    EditionOutlineSection,
    EditionOutlineSeries,
} from './edition-outline.model';
import { EditionRouteConstant } from './edition-route-constant.model';
import { EditionRowTables, EditionRowTablesList } from './edition-row-tables.model';
import { EditionSvgLinkBox } from './edition-svg-link-box.model';
import { EditionSvgOverlay, EditionSvgOverlayActionTypes, EditionSvgOverlayTypes } from './edition-svg-overlay.model';
import { EditionSvgSheet, EditionSvgSheetList } from './edition-svg-sheet.model';

import { FolioCalculation, FolioCalculationLine, FolioCalculationPoint } from './folio-calculation.model';
import { FolioSettings } from './folio-settings.model';
import { FolioSvgContentSegment, FolioSvgData } from './folio-svg-data.model';
import { Folio, FolioContent, FolioConvolute, FolioConvoluteList, FolioFormat, FolioSection } from './folio.model';

import { Graph, GraphList, GraphRDFData, GraphSparqlQuery } from './graph.model';
import { Intro, IntroBlock, IntroList } from './intro.model';
import { Preface, PrefaceList } from './preface.model';

import {
    SourceDescription,
    SourceDescriptionList,
    SourceDescriptionWritingInstruments,
    SourceDescriptionWritingMaterialDimension,
    SourceDescriptionWritingMaterialFormat,
    SourceDescriptionWritingMaterialItemLocation,
    SourceDescriptionWritingMaterialSystems,
} from './source-description.model';
import { SourceEvaluation, SourceEvaluationList } from './source-evaluation.model';
import { Source, SourceList } from './source-list.model';

import {
    TextcriticalComment,
    TextcriticalCommentary,
    TextcriticalCommentBlock,
    Textcritics,
    TextcriticsList,
} from './textcritics.model';
import { TkaTableHeaderColumn } from './tka-table-header.model';
import { ViewBox } from './view-box.model';

export {
    D3Selection,
    D3ZoomBehaviour,
    EditionComplex,
    EditionComplexesJsonData,
    EditionComplexesList,
    EditionComplexJsonData,
    EditionComplexTitleStatement,
    EditionOutline,
    EditionOutlineComplexItem,
    EditionOutlineJsonData,
    EditionOutlineSection,
    EditionOutlineSeries,
    EditionRouteConstant,
    EditionRowTables,
    EditionRowTablesList,
    EditionSvgLinkBox,
    EditionSvgOverlay,
    EditionSvgOverlayActionTypes,
    EditionSvgOverlayTypes,
    EditionSvgSheet,
    EditionSvgSheetList,
    Folio,
    FolioCalculation,
    FolioCalculationLine,
    FolioCalculationPoint,
    FolioContent,
    FolioConvolute,
    FolioConvoluteList,
    FolioFormat,
    FolioSection,
    FolioSettings,
    FolioSvgContentSegment,
    FolioSvgData,
    Graph,
    GraphList,
    GraphRDFData,
    GraphSparqlQuery,
    Intro,
    IntroBlock,
    IntroList,
    Preface,
    PrefaceList,
    Source,
    SourceDescription,
    SourceDescriptionList,
    SourceDescriptionWritingInstruments,
    SourceDescriptionWritingMaterialDimension,
    SourceDescriptionWritingMaterialFormat,
    SourceDescriptionWritingMaterialItemLocation,
    SourceDescriptionWritingMaterialSystems,
    SourceEvaluation,
    SourceEvaluationList,
    SourceList,
    TextcriticalComment,
    TextcriticalCommentary,
    TextcriticalCommentBlock,
    Textcritics,
    TextcriticsList,
    TkaTableHeaderColumn,
    ViewBox,
};
