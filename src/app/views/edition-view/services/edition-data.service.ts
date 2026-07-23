import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { Observable, forkJoin as observableForkJoin, of as observableOf } from 'rxjs';
import { catchError, defaultIfEmpty, map, startWith, switchMap } from 'rxjs/operators';

import { LoadingService } from '@awg-shared/loading/loading.service';
import { EDITION_ASSETS_DATA } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import {
    EditionComplex,
    EditionOutlineSection,
    EditionOutlineSeries,
    EditionSvgSheetList,
    FolioConvoluteList,
    GraphList,
    IntroList,
    PrefaceList,
    RowTablesList,
    SourceDescriptionList,
    SourceEvaluationList,
    SourceList,
    TextcriticsList,
} from '@awg-views/edition-view/models';

import { EditionStateService } from './edition-state.service';

/**
 * The EditionComplexDataOperationKeys type.
 *
 * * It defines the valid keys for the complex data operations used in the EditionDataService.
 */
export type EditionComplexDataOperationKeys =
    | 'folioConvolute'
    | 'graph'
    | 'intro'
    | 'sourceList'
    | 'sourceDescription'
    | 'sourceEvaluation'
    | 'svgSheets'
    | 'textcritics';

/**
 * The EditionStaticDataOperationKeys type.
 *
 * * It defines the valid keys for the static data operations used in the EditionDataService.
 */
export type EditionStaticDataOperationKeys = 'preface' | 'rowTables';

/**
 * The EditionDataOperationKeys type.
 *
 * * It defines the valid keys for any data operations used in the EditionDataService.
 */
export type EditionDataOperationKeys = EditionStaticDataOperationKeys | EditionComplexDataOperationKeys;

/**
 * Configuration object for the edition complex data operations.
 */
const COMPLEX_DATA_CONFIG: Record<EditionComplexDataOperationKeys, { file: string; fallback: any }> = {
    folioConvolute: { file: EDITION_ASSETS_DATA.FILES.folioConvoluteFile, fallback: new FolioConvoluteList() },
    graph: { file: EDITION_ASSETS_DATA.FILES.graphFile, fallback: new GraphList() },
    intro: { file: EDITION_ASSETS_DATA.FILES.introFile, fallback: new IntroList() },
    sourceList: { file: EDITION_ASSETS_DATA.FILES.sourceListFile, fallback: new SourceList() },
    sourceDescription: {
        file: EDITION_ASSETS_DATA.FILES.sourceDescriptionListFile,
        fallback: new SourceDescriptionList(),
    },
    sourceEvaluation: {
        file: EDITION_ASSETS_DATA.FILES.sourceEvaluationListFile,
        fallback: new SourceEvaluationList(),
    },
    svgSheets: { file: EDITION_ASSETS_DATA.FILES.svgSheetsFile, fallback: new EditionSvgSheetList() },
    textcritics: { file: EDITION_ASSETS_DATA.FILES.textcriticsFile, fallback: new TextcriticsList() },
};

/**
 * Configuration object for the edition static data operations.
 */
const STATIC_DATA_CONFIG: Record<EditionStaticDataOperationKeys, { file: string; fallback: any }> = {
    preface: { file: EDITION_ASSETS_DATA.FILES.prefaceFile, fallback: new PrefaceList() },
    rowTables: { file: EDITION_ASSETS_DATA.FILES.rowTablesFile, fallback: new RowTablesList() },
};

/**
 * The EditionData service.
 *
 * It handles the calls to local JSON files vai HTTP
 * and provides the data response for the edition sheets
 * and edition report view.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class EditionDataService {
    /**
     * Private readonly injection variable: _http.
     *
     * It keeps the instance of the Angular HttpClient.
     */
    private readonly _http = inject(HttpClient);

    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Private readonly injection variable: _loadingService.
     *
     * It keeps the instance of the injected LoadingService.
     */
    private readonly _loadingService = inject(LoadingService);

    /**
     * Private readonly signal holding the data error state.
     */
    private readonly _dataError = signal<{ operation: EditionDataOperationKeys; error: any } | null>(null);

    /**
     * Readonly signal: dataError.
     *
     * It holds the state of the data error as readonly signal.
     */
    readonly dataError = this._dataError.asReadonly();

    /**
     * Readonly signal: folioConvoluteData.
     *
     * It holds the state of the folio convolute data.
     */
    readonly folioConvoluteData = this._getEditionDataByKey<FolioConvoluteList>('folioConvolute');

    /**
     * Readonly signal: graphData.
     *
     * It holds the state of the graph data.
     */
    readonly graphData = this._getEditionDataByKey<GraphList>('graph');

    /**
     * Readonly signal: introData.
     *
     * It holds the state of the intro data.
     */
    readonly introData = toSignal(
        toObservable(
            computed(() => ({
                series: this._editionStateService.selectedEditionSeries(),
                section: this._editionStateService.selectedEditionSection(),
                complex: this._editionStateService.selectedEditionComplex(),
            }))
        ).pipe(switchMap(state => this._getIntroDataStream(state))),
        { initialValue: new IntroList() }
    );

    /**
     * Readonly signal: prefaceData.
     *
     * It holds the state of the preface data.
     */
    readonly prefaceData = this._getStaticEditionData<PrefaceList>('preface');

    /**
     * Readonly signal: rowTablesData.
     *
     * It holds the state of the row tables data.
     */
    readonly rowTablesData = this._getStaticEditionData<RowTablesList>('rowTables');

    /**
     * Readonly signal: sourceListData.
     *
     * It holds the state of the source list data.
     */
    readonly sourceListData = this._getEditionDataByKey<SourceList>('sourceList');

    /**
     * Readonly signal: sourceDescriptionListData.
     *
     * It holds the state of the source description list data.
     */
    readonly sourceDescriptionListData = this._getEditionDataByKey<SourceDescriptionList>('sourceDescription');

    /**
     * Readonly signal: sourceEvaluationListData.
     *
     * It holds the state of the source evaluation list data.
     */
    readonly sourceEvaluationListData = this._getEditionDataByKey<SourceEvaluationList>('sourceEvaluation');

    /**
     * Readonly signal: svgSheetsData.
     *
     * It holds the state of the svg sheet list data.
     * */
    readonly svgSheetsData = this._getEditionDataByKey<EditionSvgSheetList>('svgSheets');

    /**
     * Readonly signal: textcriticsListData.
     *
     * It holds the state of the textcritics list data.
     */
    readonly textcriticsListData = this._getEditionDataByKey<TextcriticsList>('textcritics');

    /**
     * Readonly signal: isIntroDataLoaded.
     *
     * It computes a flag indicating if the intro data is loaded.
     */
    readonly isIntroDataLoaded = computed(() => {
        if (this._loadingService.isLoading()) {return false;}
        return this.introData().intro?.length > 0;
    });

    /**
     * Readonly signal: isGraphDataLoaded.
     *
     * It computes a flag indicating if the graph data is loaded.
     */
    readonly isGraphDataLoaded = computed(() => {
        if (this._loadingService.isLoading()) {return false;}
        return this.graphData().graph?.length > 0;
    });

    /**
     * Readonly signal: isReportDataLoaded.
     *
     * It computes a flag indicating if the report data is loaded.
     */
    readonly isReportDataLoaded = computed(() => {
        if (this._loadingService.isLoading()) {return false;}
        return (
            this.sourceListData().sources?.length > 0 &&
            this.sourceDescriptionListData().sources?.length > 0 &&
            this.sourceEvaluationListData().sources?.length > 0 &&
            this.textcriticsListData().textcritics?.length > 0
        );
    });

    /**
     * Readonly signal: isSheetsDataLoaded.
     *
     * It computes a flag indicating if the sheets data is loaded.
     */
    readonly isSheetsDataLoaded = computed(() => {
        if (this._loadingService.isLoading()) {return false;}

        const svg = this.svgSheetsData();
        const hasSvgSheets =
            svg.sheets &&
            (svg.sheets.workEditions?.length > 0 ||
                svg.sheets.textEditions?.length > 0 ||
                svg.sheets.sketchEditions?.length > 0);

        return (
            this.folioConvoluteData().convolutes?.length > 0 &&
            hasSvgSheets &&
            this.textcriticsListData().textcritics?.length > 0
        );
    });

    /**
     * TODO
     */
    readonly reportViewState = computed(() => {
        const sourceList = this.sourceListData();
        const sourceDescription = this.sourceDescriptionListData();
        const sourceEvaluation = this.sourceEvaluationListData();
        const textcritics = this.textcriticsListData();

        const isLoaded =
            !this._loadingService.isLoading() &&
            sourceList.sources?.length > 0 &&
            sourceDescription.sources?.length > 0 &&
            sourceEvaluation.sources?.length > 0 &&
            textcritics.textcritics?.length > 0;

        return {
            data: { sourceList, sourceDescription, sourceEvaluation, textcritics },
            isLoaded,
        };
    });

    /**
     * TODO
     */
    readonly sheetsViewState = computed(() => {
        const folio = this.folioConvoluteData();
        const svg = this.svgSheetsData();
        const textcritics = this.textcriticsListData();

        const hasSvgSheets =
            svg.sheets &&
            (svg.sheets.workEditions?.length > 0 ||
                svg.sheets.textEditions?.length > 0 ||
                svg.sheets.sketchEditions?.length > 0);

        const isLoaded =
            !this._loadingService.isLoading() &&
            folio.convolutes?.length > 0 &&
            hasSvgSheets &&
            textcritics.textcritics?.length > 0;

        return {
            data: { folio, svg, textcritics },
            isLoaded,
        };
    });

    /**
     * Public method: getErrorForDataOperations.
     *
     * It computes an errorObject for the service calls
     * for the given data operations.
     *
     * @param {EditionDataOperationKeys[]} operations The given data operations to check for errors.
     * @returns {Signal<any | null>} The computed errorObject for the given data operations.
     */
    getErrorForDataOperations(operations: EditionDataOperationKeys[]): Signal<any | null> {
        return computed(() => {
            const errState = this._dataError();

            if (!errState) {
                return null;
            }

            return operations.includes(errState.operation) ? errState.error : null;
        });
    }

    /**
     * Private readonly signal: _getEditionDataByKey.
     *
     * It gets the data for the given data operation key.
     *
     * @param {EditionComplexDataOperationKeys} key The given data operation key.
     * @returns {Signal<T>} The signal with the requested data.
     */
    private _getEditionDataByKey<T>(key: EditionComplexDataOperationKeys): Signal<T> {
        const config = COMPLEX_DATA_CONFIG[key];
        const fallback = config.fallback as T;

        return this._getEditionDataByComplex<T>(config.file, fallback, key);
    }

    /**
     * Private method: _getEditionDataByComplex.
     *
     * It sets the path to the JSON file with
     * the given data for the selected edition complex
     * and triggers the method to get the JSON data.
     *
     * @param {string} file The name of the JSON file.
     * @param {T} fallback An optional empty result to let the app keep running.
     * @param {EditionComplexDataOperationKeys} opName Name of the requested data operation.
     * @returns {Signal<T>} The signal with the requested data.
     */
    private _getEditionDataByComplex<T>(file: string, fallback: T, opName: EditionComplexDataOperationKeys): Signal<T> {
        return toSignal(
            toObservable(this._editionStateService.selectedEditionComplex).pipe(
                switchMap(complex => {
                    this._clearErrorFor(opName);

                    if (!complex) {return observableOf(fallback);}

                    const assetPath = this._getAssetPathForEditionComplex(complex);
                    return this._fetchJsonData<T>(assetPath, file, fallback, opName).pipe(
                        // ObserveOn(asyncScheduler),
                        startWith(fallback)
                    );
                })
            ),
            { initialValue: fallback }
        );
    }

    /**
     * Private method: _getStaticEditionData.
     *
     * It sets the path to the JSON file with
     * the given data and triggers
     * the method to get the JSON data.
     *
     * @param {EditionStaticDataOperationKeys} key The given static data operation key.
     * @returns {Signal<T>} The signal with the requested data.
     */
    private _getStaticEditionData<T>(key: EditionStaticDataOperationKeys): Signal<T> {
        const assetPath = EDITION_ASSETS_DATA.BASE_ROUTE + EDITION_ROUTE_CONSTANTS.EDITION.route;
        const config = STATIC_DATA_CONFIG[key];
        const fallback = config.fallback as T;

        return toSignal(this._fetchJsonData<T>(assetPath, config.file, fallback, key), { initialValue: fallback });
    }

    /**
     * Private method: _getAssetPathForEditionComplex.
     *
     * It gets the path to correct assets folder of a given edition complex.
     *
     * @param {EditionComplex} complex The current edition complex.
     * @returns {string} The path to the correct assets folder of a given edition complex.
     */
    private _getAssetPathForEditionComplex(complex: EditionComplex): string {
        return (
            EDITION_ASSETS_DATA.BASE_ROUTE +
            complex.pubStatement.labeledSectionRoute.route.join('/') +
            complex.complexId.route
        );
    }

    /**
     * Private method: _getIntroDataStream.
     *
     * It provides the data from a JSON file for the edition intro view as stream.
     *
     * @param {{series: EditionOutlineSeries | null, section: EditionOutlineSection | null, complex: EditionComplex | null}} state The current state of the edition view.
     * @returns {Observable<IntroList>} The observable with the IntroList data.
     */
    private _getIntroDataStream(state: {
        series: EditionOutlineSeries | null;
        section: EditionOutlineSection | null;
        complex: EditionComplex | null;
    }): Observable<IntroList> {
        this._clearErrorFor('intro');
        const fallbackValue = new IntroList();

        if (!state.series || !state.section) {
            return observableOf(fallbackValue);
        }

        const sectionPath = EDITION_ASSETS_DATA.BASE_ROUTE + state.section.labeledRoute.route.join('/');
        const file = EDITION_ASSETS_DATA.FILES.introFile;
        const sectionStream$ = this._fetchJsonData<IntroList>(sectionPath, file, fallbackValue, 'intro');

        const isComplexValid =
            state.complex &&
            state.complex.pubStatement?.series?.route === state.series.series.route &&
            state.complex.pubStatement?.section?.route === state.section.section.route;

        if (isComplexValid && state.complex) {
            const complexPath = this._getAssetPathForEditionComplex(state.complex);
            const complexStream$ = this._fetchJsonData<IntroList>(complexPath, file, fallbackValue, 'intro');

            return observableForkJoin([sectionStream$, complexStream$]).pipe(
                map(([sectionIntroData, complexIntroData]) => {
                    if (complexIntroData?.intro?.length > 0) {
                        const blockId = complexIntroData.intro[0].id;
                        return this._filterSectionIntroDataByBlockId(sectionIntroData, blockId);
                    }
                    return sectionIntroData;
                })
            );
        }

        return sectionStream$;
    }

    /**
     * Private method: _filterSectionIntroDataByBlockId.
     *
     * It filters the section intro data by a given block id.
     *
     * @param {IntroList} sectionIntroData The given section intro data.
     * @param {string} blockId The given block id.
     * @returns {IntroList} The filtered section intro data.
     */
    private _filterSectionIntroDataByBlockId(sectionIntroData: IntroList, blockId: string): IntroList {
        return {
            ...sectionIntroData,
            intro: sectionIntroData.intro.map(section => ({
                ...section,
                content: section.content.filter(contentBlock => contentBlock.blockId === blockId),
            })),
        };
    }

    /**
     * Private method: _fetchJsonData.
     *
     * It sets the path to the JSON file with
     * the given data and triggers
     * the method to fetch the JSON data.
     *
     * @param {string} assetPath The path to the assets folder.
     * @param {string} file The name of the JSON file.
     * @param {T} fallbackValue An optional empty result to let the app keep running.
     * @param {EditionDataOperationKeys} opName Name of the requested data operation.
     * @returns {Observable<T>} The observable with the requested data.
     */
    private _fetchJsonData<T>(
        assetPath: string,
        file: string,
        fallbackValue: T,
        opName: EditionDataOperationKeys
    ): Observable<T> {
        const url = `${assetPath}/${file}`;

        return this._http
            .get<T>(url)
            .pipe(catchError(this._handleError<T>(opName, fallbackValue)), defaultIfEmpty(fallbackValue));
    }

    /**
     * Private method: _handleError.
     *
     * It handles errors, if any, of the HTTP request.
     *
     * @param {EditionDataOperationKeys} opName Name of the requested data operation.
     * @param {T} [result] An optional empty result to let the app keep running.
     * @returns An observable of the error.
     */
    private _handleError<T>(opName: EditionDataOperationKeys, result?: T) {
        return (error: HttpErrorResponse): Observable<T> => {
            this._logError(`${opName} failed: ${error.message}`);

            this._dataError.set({ operation: opName, error });

            // Let the app keep running by returning an empty result.
            return observableOf(result as T);
        };
    }

    /**
     * Private method: _clearErrorFor.
     *
     * It clears the error state for a given operation.
     *
     * @param {EditionDataOperationKeys} opName Name of the requested data operation.
     * @returns {void} Clears the error state for the given operation.
     */
    private _clearErrorFor(opName: EditionDataOperationKeys): void {
        const current = this._dataError();
        if (current?.operation === opName) {
            this._dataError.set(null);
        }
    }

    /**
     * Private method: _logError.
     *
     * It logs an error message to the console.
     *
     * @param {string} message The given error message to be logged.
     *
     * @returns {void} Logs the error message to the console.
     */
    private _logError(message: string): void {
        console.error(message);
    }
}
