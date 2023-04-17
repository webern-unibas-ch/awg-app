import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, forkJoin as observableForkJoin, of as observableOf } from 'rxjs';
import { catchError, defaultIfEmpty, take } from 'rxjs/operators';

import { EDITION_ASSETS_DATA } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import {
    EditionComplex,
    EditionRowTablesList,
    EditionSvgSheetList,
    FolioConvoluteList,
    GraphList,
    IntroList,
    SourceDescriptionList,
    SourceEvaluationList,
    SourceList,
    TextcriticsList,
} from '@awg-views/edition-view/models';

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
     * Private variable: _assetPath.
     *
     * It keeps the asset path to the JSON files of an edition complex.
     */
    private _assetPath = '';

    /**
     * Constructor of the EditionDataService.
     *
     * It declares a private {@link HttpClient} instance
     * to handle http requests.
     *
     * @param {HttpClient} http Instance of the HttpClient.
     */
    constructor(private http: HttpClient) {}

    /**
     * Public method: getEditionSheetsData.
     *
     * It provides the data from a JSON file
     * for the current edition complex of the edition sheets view
     * (folio convolute, edition svg sheets and textcritics list)
     * as a fork-joined observable array.
     *
     * @param {EditionComplex} editionComplex The current edition complex.
     *
     * @returns {Observable<[FolioConvoluteList, EditionSvgSheetList, TextcriticsList]>}
     * The fork-joined observable array with the FolioConvoluteList,
     * EditionSvgSheetList and TextcriticsList data.
     * Only the first emit is needed.
     */
    getEditionSheetsData(
        editionComplex: EditionComplex
    ): Observable<(FolioConvoluteList | EditionSvgSheetList | TextcriticsList)[]> {
        this._assetPath = this._setAssetPathForEditionComplex(editionComplex);
        const folioData$: Observable<FolioConvoluteList> = this._getFolioConvoluteData();
        const svgSheetsData$: Observable<EditionSvgSheetList> = this._getSvgSheetsData();
        const textciticsListData$: Observable<TextcriticsList> = this._getTextcriticsListData();

        return observableForkJoin([folioData$, svgSheetsData$, textciticsListData$]).pipe(
            // Default empty value
            defaultIfEmpty([new FolioConvoluteList(), new EditionSvgSheetList(), new TextcriticsList()]),
            // Take only first request (JSON fetch)
            take(1)
        );
    }

    /**
     * Public method: getEditionGraphData.
     *
     * It provides the data from a JSON file
     * for the graph of the edition view.
     *
     * @param {EditionComplex} editionComplex The current edition complex.
     *
     * @returns {Observable<GraphList>} The observable with the GraphList data.
     */
    getEditionGraphData(editionComplex: EditionComplex): Observable<GraphList> {
        this._assetPath = this._setAssetPathForEditionComplex(editionComplex);
        const graphData$: Observable<GraphList> = this._getGraphData();

        return graphData$.pipe(
            // Default empty value
            defaultIfEmpty(new GraphList()),
            // Take only first request (JSON fetch)
            take(1)
        );
    }

    /**
     * Public method: getEditionIntroData.
     *
     * It provides the data from a JSON file
     * for the intro of the edition view.
     *
     * @param {EditionComplex} editionComplex The current edition complex.
     *
     * @returns {Observable<IntroList>} The observable with the IntroList data.
     */
    getEditionIntroData(editionComplex: EditionComplex): Observable<IntroList> {
        this._assetPath = this._setAssetPathForEditionComplex(editionComplex);
        const introData$: Observable<IntroList> = this._getIntroData();

        return introData$.pipe(
            // Default empty value
            defaultIfEmpty(new IntroList()),
            // Take only first request (JSON fetch)
            take(1)
        );
    }

    /**
     * Public method: getEditionReportData.
     *
     * It provides the data from a JSON file for the edition report view
     * (source list, source description list, source evaluation list and textcritics list)
     * as a fork-joined observable array.
     *
     * @param {EditionComplex} editionComplex The current edition complex.
     *
     * @returns {Observable<[SourceList, SourceDescriptionList, SourceEvaluationList, TextcriticsList]>}
     * The fork-joined observable array with the SourceList, SourceDescriptionList, SourceEvaluationList,
     * and TextcriticsList data. Only the first emit is needed.
     */
    getEditionReportData(
        editionComplex: EditionComplex
    ): Observable<(SourceList | SourceDescriptionList | SourceEvaluationList | TextcriticsList)[]> {
        this._assetPath = this._setAssetPathForEditionComplex(editionComplex);
        const sourceListData$: Observable<SourceList> = this._getSourceListData();
        const sourceDescriptionListData$: Observable<SourceDescriptionList> = this._getSourceDescriptionListData();
        const sourceEvaluationListData$: Observable<SourceEvaluationList> = this._getSourceEvaluationListData();
        const textciticsListData$: Observable<TextcriticsList> = this._getTextcriticsListData();

        return observableForkJoin([
            sourceListData$,
            sourceDescriptionListData$,
            sourceEvaluationListData$,
            textciticsListData$,
        ]).pipe(
            // Default empty value
            defaultIfEmpty([
                new SourceList(),
                new SourceDescriptionList(),
                new SourceEvaluationList(),
                new TextcriticsList(),
            ]),
            // Take only first request (JSON fetch)
            take(1)
        );
    }

    /**
     * Public method: getRowTablesData.
     *
     * It provides the data from a JSON file
     * for the row tables of the edition view.
     *
     * @returns {Observable<EditionRowTablesList>} The observable with the EditionRowTablesList data.
     */
    getEditionRowTablesData(): Observable<EditionRowTablesList> {
        this._assetPath = EDITION_ASSETS_DATA.BASE_ROUTE;
        const rowTablesData$: Observable<EditionRowTablesList> = this._getRowTablesData();

        return rowTablesData$.pipe(
            // Default empty value
            defaultIfEmpty(new EditionRowTablesList()),
            // Take only first request (JSON fetch)
            take(1)
        );
    }

    /**
     * Private method: _setAssetPathForEditionComplex.
     *
     * It sets the path to correct assets folder of a given edition complex.
     *
     * @param {EditionComplex} editionComplex The current edition complex.
     *
     * @returns {string} The path to the correct assets folder of a given edition complex.
     */
    private _setAssetPathForEditionComplex(editionComplex: EditionComplex): string {
        const delimiter = '/';
        const complexRoute =
            delimiter +
            EDITION_ROUTE_CONSTANTS.SERIES.route +
            delimiter +
            editionComplex.series.route +
            EDITION_ROUTE_CONSTANTS.SECTION.route +
            editionComplex.section.route +
            editionComplex.complexId.route;
        return EDITION_ASSETS_DATA.BASE_ROUTE + complexRoute;
    }

    /**
     * Private method: _getFolioConvoluteData.
     *
     * It sets the path to the JSON file with
     * the folio convolute data and triggers
     * the method to get the JSON data.
     *
     * @returns {Observable<FolioConvoluteList>} The observable with the FolioConvolute data.
     */
    private _getFolioConvoluteData(): Observable<FolioConvoluteList> {
        const file = EDITION_ASSETS_DATA.FILES.folioConvoluteFile;
        const url = `${this._assetPath}/${file}`;
        return this._getJsonData(url);
    }

    /**
     * Private method: _getGraphData.
     *
     * It sets the path to the JSON file with
     * the graph data and triggers
     * the method to get the JSON data.
     *
     * @returns {Observable<GraphList>} The observable with the Graph data.
     */
    private _getGraphData(): Observable<GraphList> {
        const file = EDITION_ASSETS_DATA.FILES.graphFile;
        const url = `${this._assetPath}/${file}`;
        return this._getJsonData(url);
    }

    /**
     * Private method: _getIntroData.
     *
     * It sets the path to the JSON file with
     * the intro data and triggers
     * the method to get the JSON data.
     *
     * @returns {Observable<IntroList>} The observable with the Intro data.
     */
    private _getIntroData(): Observable<IntroList> {
        const file = EDITION_ASSETS_DATA.FILES.introFile;
        const url = `${this._assetPath}/${file}`;
        return this._getJsonData(url);
    }

    /**
     * Private method: _getRowTablesData.
     *
     * It sets the path to the JSON file with
     * the row tables data and triggers
     * the method to get the JSON data.
     *
     * @returns {Observable<EditionRowTablesList>} The observable with the EditionRowTablesList data.
     */
    private _getRowTablesData(): Observable<EditionRowTablesList> {
        const file = EDITION_ASSETS_DATA.FILES.rowTablesFile;
        const url = `${this._assetPath}/${file}`;
        return this._getJsonData(url);
    }

    /**
     * Private method: _getSourceListData.
     *
     * It sets the path to the JSON file with
     * the source list data and triggers
     * the method to get the JSON data.
     *
     * @returns {Observable<SourceList>} The observable with the SourceList data.
     */
    private _getSourceListData(): Observable<SourceList> {
        const file = EDITION_ASSETS_DATA.FILES.sourceListFile;
        const url = `${this._assetPath}/${file}`;
        return this._getJsonData(url);
    }

    /**
     * Private method: _getSourceDescriptionListData.
     *
     * It sets the path to the JSON file with
     * the source description list data and triggers
     * the method to get the JSON data.
     *
     * @returns {Observable<SourceDescriptionList>} The observable with the SourceDescriptionList data.
     */
    private _getSourceDescriptionListData(): Observable<SourceDescriptionList> {
        const file = EDITION_ASSETS_DATA.FILES.sourceDescriptionListFile;
        const url = `${this._assetPath}/${file}`;
        return this._getJsonData(url);
    }

    /**
     * Private method: _getSourceEvaluationListData.
     *
     * It sets the path to the JSON file with
     * the source evaluation list data and triggers
     * the method to get the JSON data.
     *
     * @returns {Observable<SourceEvaluationList>} The observable with the SourceEvaluationList data.
     */
    private _getSourceEvaluationListData(): Observable<SourceEvaluationList> {
        const file = EDITION_ASSETS_DATA.FILES.sourceEvaluationListFile;
        const url = `${this._assetPath}/${file}`;
        return this._getJsonData(url);
    }

    /**
     * Private method: _getSvgSheetsData.
     *
     * It sets the path to the JSON file with
     * the svg sheets data and triggers
     * the method to get the JSON data.
     *
     * @returns {Observable<EditionSvgSheetList>} The observable with the EditionSvgSheet data.
     */
    private _getSvgSheetsData(): Observable<EditionSvgSheetList> {
        const file = EDITION_ASSETS_DATA.FILES.svgSheetsFile;
        const url = `${this._assetPath}/${file}`;
        return this._getJsonData(url);
    }

    /**
     * Private method: _getTextcriticsListData.
     *
     * It sets the path to the JSON file with
     * the textcritics list data and triggers
     * the method to get the JSON data.
     *
     * @returns {Observable<TextcriticsList>} The observable with the TextcriticsList data.
     */
    private _getTextcriticsListData(): Observable<TextcriticsList> {
        const file = EDITION_ASSETS_DATA.FILES.textcriticsFile;
        const url = `${this._assetPath}/${file}`;
        return this._getJsonData(url);
    }

    /**
     * Private method: _getJsonData.
     *
     * It fetches the given JSON file (path) via HTTP request.
     *
     * @param {string} path The path to the JSON file.
     * @returns {Observable<any>} The observable with the requested data.
     */
    private _getJsonData(path: string): Observable<any> {
        return this.http.get(path).pipe(
            // Tap(_res => console.log(`fetched jsonData with path=${path}`)),
            catchError(this._handleError('_getJsonData', []))
        );
    }

    /**
     * Private method: _handleError.
     *
     * It handles errors, if any, of the HTTP request.
     *
     * @param {string} operation Name of the requested operation.
     * @param {T} [result] An optional empty result to let the app keep running.
     * @returns An observable of the error.
     */
    private _handleError<T>(operation: string, result?: T) {
        return (error: HttpErrorResponse): Observable<T> => {
            this._logError(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return observableOf(result as T);
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
}
