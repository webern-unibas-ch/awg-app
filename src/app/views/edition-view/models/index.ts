/**
 *
 *              EditionModels
 *
 * This file exports models that are used
 * for the Edition view.
 *
 */

import { EditionConstants } from './edition-constants';

import { EditionSvgOverlay, EditionSvgOverlayTypes } from './edition-svg-overlay.model';
import { EditionSvgSheet, EditionSvgSheetList } from './edition-svg-sheet.model';

import { EditionWork } from './edition-work.model';
import { EditionWorks } from './edition-works';

import { FolioConvoluteList, FolioConvolute, Folio, FolioFormat, FolioContent, FolioSection } from './folio.model';
import { FolioCalculation, FolioCalculationLine, FolioCalculationPoint } from './folio-calculation.model';
import { FolioSettings } from './folio-settings.model';
import { FolioSvgData } from './folio-svg-data.model';

import { Graph, GraphList } from './graph.model';
import { Intro, IntroList } from './intro.model';

import { Source, SourceList } from './source-list.model';
import { SourceDescription, SourceDescriptionList } from './source-description.model';
import { SourceEvaluation, SourceEvaluationList } from './source-evaluation.model';

import { Textcritics, TextcriticsList } from './textcritics.model';
import { ViewBox } from './view-box.model';

export {
    EditionConstants,
    EditionWork,
    EditionSvgOverlay,
    EditionSvgOverlayTypes,
    EditionSvgSheet,
    EditionSvgSheetList,
    EditionWorks,
    FolioConvoluteList,
    FolioConvolute,
    Folio,
    FolioFormat,
    FolioContent,
    FolioSection,
    FolioCalculation,
    FolioCalculationLine,
    FolioCalculationPoint,
    FolioSettings,
    FolioSvgData,
    Graph,
    GraphList,
    Intro,
    IntroList,
    Source,
    SourceList,
    SourceDescription,
    SourceDescriptionList,
    SourceEvaluation,
    SourceEvaluationList,
    Textcritics,
    TextcriticsList,
    ViewBox
};
