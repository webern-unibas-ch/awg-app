import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { Observable, forkJoin as observableForkJoin, of as observableOf } from 'rxjs';
import { catchError, defaultIfEmpty, map, startWith, switchMap } from 'rxjs/operators';

import { LoadingService } from '@awg-shared/loading/loading.service';

import { EDITION_ASSETS_DATA } from '../data';
import { EDITION_ROUTE_CONSTANTS } from '../edition-routes.constants';
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
} from '../models';
import {
    EditionComplexDataAssetsKeys,
    EditionDataAssetsError,
    EditionDataAssetsKeys,
    EditionStaticDataAssetsKeys,
    EditionViewData,
} from '../models/edition-data.model';

import { EditionStateService } from './edition-state.service';

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
    private readonly _dataError = signal<EditionDataAssetsError | null>(null);

    /**
     * Readonly signal holding the preface data state.
     */
    private readonly _prefaceData = this._getStaticEditionDataByKey<PrefaceList>('preface');

    /**
     * Private readonly signal holding the row tables data state.
     */
    private readonly _rowTablesData = this._getStaticEditionDataByKey<RowTablesList>('rowTables');

    /**
     * Private readonly signal holding the intro data state.
     */
    private readonly _introData = this._getIntroData();

    /**
     * Private readonly signal holding the folio convolute data state.
     */
    private readonly _folioConvoluteData = this._getComplexEditionDataByKey<FolioConvoluteList>('folioConvolute');

    /**
     * Private readonly signal holding the graph data state.
     */
    private readonly _graphData = this._getComplexEditionDataByKey<GraphList>('graph');

    /**
     * Private readonly signal holding the source list data state.
     */
    private readonly _sourceListData = this._getComplexEditionDataByKey<SourceList>('sourceList');

    /**
     * Private readonly signal holding the source description data state.
     */
    private readonly _sourceDescriptionData =
        this._getComplexEditionDataByKey<SourceDescriptionList>('sourceDescription');

    /**
     * Private readonly signal holding the source evaluation data state.
     */
    private readonly _sourceEvaluationData = this._getComplexEditionDataByKey<SourceEvaluationList>('sourceEvaluation');

    /**
     * Private readonly signal holding the svg sheets data state.
     * */
    private readonly _svgSheetsData = this._getComplexEditionDataByKey<EditionSvgSheetList>('svgSheets');

    /**
     * Private readonly signal holding the textcritics list data state.
     */
    private readonly _textcriticsData = this._getComplexEditionDataByKey<TextcriticsList>('textcritics');

    /**
     * Readonly signal: prefaceViewData.
     *
     * It holds the state of the preface view data.
     */
    readonly prefaceViewData = computed(() => {
        const prefaceData = this._prefaceData();
        const isLoading = this._loadingService.isLoading() || !prefaceData?.preface?.length;

        const keys: EditionDataAssetsKeys[] = ['preface'];
        const error = this._getErrorForDataAssets(keys)();

        return { data: { prefaceData }, isLoading, error } satisfies EditionViewData<{ prefaceData: PrefaceList }>;
    });

    /**
     * Readonly signal: rowTablesViewData.
     *
     * It holds the state of the row tables view data.
     */
    readonly rowTablesViewData = computed(() => {
        const rowTablesData = this._rowTablesData();
        const isLoading = this._loadingService.isLoading() || !rowTablesData?.rowTables?.length;

        const keys: EditionDataAssetsKeys[] = ['rowTables'];
        const error = this._getErrorForDataAssets(keys)();

        return { data: { rowTablesData }, isLoading, error } satisfies EditionViewData<{
            rowTablesData: RowTablesList;
        }>;
    });

    /**
     * Readonly signal: introViewData.
     *
     * It holds the state of the intro view data.
     */
    readonly introViewData = computed(() => {
        const introData = this._introData();
        const isLoading = this._loadingService.isLoading() || !introData?.intro?.length;

        const keys: EditionDataAssetsKeys[] = ['intro'];
        const error = this._getErrorForDataAssets(keys)();

        return { data: { introData }, isLoading, error } satisfies EditionViewData<{ introData: IntroList }>;
    });

    /**
     * Readonly signal: graphViewData.
     *
     * It holds the state of the graph view data.
     */
    readonly graphViewData = computed(() => {
        const graphData = this._graphData();
        const isLoading = this._loadingService.isLoading() || !graphData?.graph?.length;

        const keys: EditionDataAssetsKeys[] = ['graph'];
        const error = this._getErrorForDataAssets(keys)();

        return { data: { graphData }, isLoading, error } satisfies EditionViewData<{ graphData: GraphList }>;
    });

    /**
     * Readonly signal: sheetsViewData.
     *
     * It holds the state of the sheets view data.
     */
    readonly sheetsViewData = computed(() => {
        const folioConvoluteData = this._folioConvoluteData();
        const svgSheetsData = this._svgSheetsData();
        const textcriticsData = this._textcriticsData();

        const missingSvgSheets =
            !svgSheetsData.sheets ||
            (!svgSheetsData.sheets.workEditions?.length &&
                !svgSheetsData.sheets.textEditions?.length &&
                !svgSheetsData.sheets.sketchEditions?.length);

        const isLoading =
            this._loadingService.isLoading() ||
            !folioConvoluteData.convolutes?.length ||
            missingSvgSheets ||
            !textcriticsData.textcritics?.length;

        const keys: EditionDataAssetsKeys[] = ['folioConvolute', 'svgSheets', 'textcritics'];
        const error = this._getErrorForDataAssets(keys)();

        return {
            data: { folioConvoluteData, svgSheetsData, textcriticsData },
            isLoading,
            error,
        } satisfies EditionViewData<{
            folioConvoluteData: FolioConvoluteList;
            svgSheetsData: EditionSvgSheetList;
            textcriticsData: TextcriticsList;
        }>;
    });

    /**
     * Readonly signal: reportViewData.
     *
     * It holds the state of the report view data.
     */
    readonly reportViewData = computed(() => {
        const sourceListData = this._sourceListData();
        const sourceDescriptionData = this._sourceDescriptionData();
        const sourceEvaluationData = this._sourceEvaluationData();
        const textcriticsData = this._textcriticsData();

        const isLoading =
            this._loadingService.isLoading() ||
            !sourceListData.sources?.length ||
            !sourceDescriptionData.sources?.length ||
            !sourceEvaluationData.sources?.length ||
            !textcriticsData.textcritics?.length;

        const keys: EditionDataAssetsKeys[] = ['sourceList', 'sourceDescription', 'sourceEvaluation', 'textcritics'];
        const error = this._getErrorForDataAssets(keys)();

        return {
            data: { sourceListData, sourceDescriptionData, sourceEvaluationData, textcriticsData },
            isLoading,
            error,
        } satisfies EditionViewData<{
            sourceListData: SourceList;
            sourceDescriptionData: SourceDescriptionList;
            sourceEvaluationData: SourceEvaluationList;
            textcriticsData: TextcriticsList;
        }>;
    });

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
     * Private method: _getStaticEditionDataByKey.
     *
     * It sets the path to the JSON file with
     * the given data and triggers
     * the method to get the JSON data.
     *
     * @param {EditionStaticDataAssetsKeys} assetsKey The given static data assets key.
     * @returns {Signal<T>} The signal with the requested data.
     */
    private _getStaticEditionDataByKey<T>(assetsKey: EditionStaticDataAssetsKeys): Signal<T> {
        const assetPath = EDITION_ASSETS_DATA.BASE_ROUTE + EDITION_ROUTE_CONSTANTS.EDITION.route;
        const config = EDITION_ASSETS_DATA.CONFIG[assetsKey];
        const fallback = config.fallback as T;

        return toSignal(this._fetchJsonData<T>(assetPath, config.file, fallback, assetsKey), {
            initialValue: fallback,
        });
    }

    /**
     * Private readonly signal: _getComplexEditionDataByKey.
     *
     * It gets the complex related data for the given data assets key.
     *
     * @param {EditionComplexDataAssetsKeys} assetsKey The given complex data assets key.
     * @returns {Signal<T>} The signal with the requested data.
     */
    private _getComplexEditionDataByKey<T>(assetsKey: EditionComplexDataAssetsKeys): Signal<T> {
        const config = EDITION_ASSETS_DATA.CONFIG[assetsKey];
        const fallback = config.fallback as T;

        return this._getEditionDataByComplex<T>(config.file, fallback, assetsKey);
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
     * @param {EditionComplexDataAssetsKeys} assetsKey The given complex data assets key.
     * @returns {Signal<T>} The signal with the requested data.
     */
    private _getEditionDataByComplex<T>(file: string, fallback: T, assetsKey: EditionComplexDataAssetsKeys): Signal<T> {
        return toSignal(
            toObservable(this._editionStateService.selectedEditionComplex).pipe(
                switchMap(complex => {
                    this._clearErrorFor(assetsKey);

                    if (!complex) {
                        return observableOf(fallback);
                    }

                    const assetPath = this._getAssetPathForEditionComplex(complex);
                    return this._fetchJsonData<T>(assetPath, file, fallback, assetsKey).pipe(startWith(fallback));
                })
            ),
            { initialValue: fallback }
        );
    }

    /**
     * Private method: _getIntroEditionData.
     *
     * It gets the intro data for the selected edition series and section.
     *
     * @returns {Signal<IntroList>} The signal with the requested intro data.
     */
    private _getIntroData(): Signal<IntroList> {
        return toSignal(
            toObservable(
                computed(() => ({
                    series: this._editionStateService.selectedEditionSeries(),
                    section: this._editionStateService.selectedEditionSection(),
                    complex: this._editionStateService.selectedEditionComplex(),
                }))
            ).pipe(switchMap(state => this._getIntroDataStream(state))),
            { initialValue: new IntroList() }
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
        const assetsKey: EditionComplexDataAssetsKeys = 'intro';
        this._clearErrorFor(assetsKey);

        const fallbackValue = new IntroList();
        if (!state?.series || !state?.section) {
            return observableOf(fallbackValue);
        }

        const sectionPath = EDITION_ASSETS_DATA.BASE_ROUTE + state.section.labeledRoute?.route.join('/');
        const file = EDITION_ASSETS_DATA.CONFIG[assetsKey].file;
        const sectionIntroStream$ = this._fetchJsonData<IntroList>(sectionPath, file, fallbackValue, assetsKey);

        const isComplexValid =
            state.complex?.pubStatement?.series?.route === state.series.series?.route &&
            state.complex?.pubStatement?.section?.route === state.section.section?.route;

        if (isComplexValid) {
            const complexPath = this._getAssetPathForEditionComplex(state.complex);
            const complexIntroStream$ = this._fetchJsonData<IntroList>(complexPath, file, fallbackValue, assetsKey);

            return observableForkJoin([sectionIntroStream$, complexIntroStream$]).pipe(
                map(([sectionIntroData, complexIntroData]) => {
                    if (complexIntroData?.intro?.length > 0) {
                        const blockId = complexIntroData.intro[0].id;
                        return this._filterSectionIntroDataByBlockId(sectionIntroData, blockId);
                    }
                    return sectionIntroData;
                })
            );
        }

        return sectionIntroStream$;
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
        if (!sectionIntroData?.intro) {
            return sectionIntroData;
        }

        return {
            ...sectionIntroData,
            intro: sectionIntroData.intro.map(section => ({
                ...section,
                content: section.content
                    ? section.content.filter(contentBlock => contentBlock.blockId === blockId)
                    : [],
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
     * @param {T} fallbackValue An empty result to let the app keep running.
     * @param {EditionDataAssetsKeys} assetsKey The given data assets key.
     * @returns {Observable<T>} The observable with the requested data.
     */
    private _fetchJsonData<T>(
        assetPath: string,
        file: string,
        fallbackValue: T,
        assetsKey: EditionDataAssetsKeys
    ): Observable<T> {
        const url = `${assetPath}/${file}`;

        return this._http
            .get<T>(url)
            .pipe(catchError(this._handleError<T>(assetsKey, fallbackValue)), defaultIfEmpty(fallbackValue));
    }

    /**
     * Private method: _handleError.
     *
     * It handles errors, if any, of the HTTP request.
     *
     * @param {EditionDataAssetsKeys} assetsKey The given data assets key.
     * @param {T} fallbackValue An empty result to let the app keep running.
     * @returns An observable of the error.
     */
    private _handleError<T>(
        assetsKey: EditionDataAssetsKeys,
        fallbackValue: T
    ): (error: HttpErrorResponse) => Observable<T> {
        return (error: HttpErrorResponse): Observable<T> => {
            this._logError(`${assetsKey} failed: ${error.message}`);

            this._dataError.set({ key: assetsKey, error });

            // Let the app keep running by returning the empty fallback.
            return observableOf(fallbackValue as T);
        };
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

    /**
     * Private method: _getErrorForDataAssets.
     *
     * It computes an errorObject for the service calls
     * for the given data assets.
     *
     * @param {EditionDataAssetsKeys[]} assetsKeys The given data assets keys to check for errors.
     * @returns {Signal<any | null>} The computed errorObject for the given data asset keys.
     */
    private _getErrorForDataAssets(assetsKeys: EditionDataAssetsKeys[]): Signal<any | null> {
        return computed(() => {
            const errState = this._dataError();

            if (!errState) {
                return null;
            }

            return assetsKeys.includes(errState.key) ? errState.error : null;
        });
    }

    /**
     * Private method: _clearErrorFor.
     *
     * It clears the error state for a given data assets key.
     *
     * @param {EditionDataAssetsKeys} assetsKey The given data assets key for which the error state should be cleared.
     * @returns {void} Clears the error state for the given data assets key.
     */
    private _clearErrorFor(assetsKey: EditionDataAssetsKeys): void {
        const current = this._dataError();
        if (current?.key === assetsKey) {
            this._dataError.set(null);
        }
    }
}
