import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { forkJoin as observableForkJoin, Observable, of as observableOf } from 'rxjs';
import { catchError, defaultIfEmpty, take } from 'rxjs/operators';

import {
    EditionConstants,
    EditionWork,
    EditionSvgSheetList,
    FolioConvoluteList,
    GraphList,
    IntroList,
    SourceList,
    SourceDescriptionList,
    SourceEvaluationList,
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
     * Private variable: _assetWorkPath.
     *
     * It keeps the asset path to the JSON files of a work.
     */
    private _assetWorkPath = '';

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
     * for the current composition of the edition sheets view
     * (folio convolute, edition svg sheets and textcritics list)
     * as a fork-joined observable array.
     *
     * @param {EditionWork} editionWork The current composition input.
     *
     * @returns {Observable<[FolioConvoluteList, EditionSvgSheetList, TextcriticsList]>}
     * The fork-joined observable array with the FolioConvoluteList,
     * EditionSvgSheetList and TextcriticsList data.
     * Only the first emit is needed.
     */
    getEditionSheetsData(
        editionWork: EditionWork
    ): Observable<(FolioConvoluteList | EditionSvgSheetList | TextcriticsList)[]> {
        this._setAssetWorkPath(editionWork);

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
     * @param {EditionWork} editionWork The current composition input.
     *
     * @returns {Observable<GraphList>} The observable with the GraphList data.
     */
    getEditionGraphData(editionWork: EditionWork): Observable<GraphList> {
        this._setAssetWorkPath(editionWork);
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
     * @param {EditionWork} editionWork The current composition input.
     *
     * @returns {Observable<IntroList>} The observable with the IntroList data.
     */
    getEditionIntroData(editionWork: EditionWork): Observable<IntroList> {
        this._setAssetWorkPath(editionWork);
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
     * It provides the data from a JSON file
     * for the edition report view
     * (source list, source description list,
     * source evaluation list and textcritics list)
     * as a fork-joined observable array.
     *
     * @param {EditionWork} editionWork The current composition input.
     *
     * @returns {Observable<[SourceList, SourceDescriptionList, SourceEvaluationList, TextcriticsList]>}
     * The fork-joined observable array with the SourceList, SourceDescriptionList, SourceEvaluationList,
     * and TextcriticsList data. Only the first emit is needed.
     */
    getEditionReportData(
        editionWork: EditionWork
    ): Observable<(SourceList | SourceDescriptionList | SourceEvaluationList | TextcriticsList)[]> {
        this._setAssetWorkPath(editionWork);
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
     * Private method: _setAssetWorkPath.
     *
     * It sets the path to correct assets folder of a given work.
     *
     * @param {EditionWork} editionWork The current composition input.
     *
     * @returns {void} It sets the asset path.
     */
    private _setAssetWorkPath(editionWork: EditionWork): void {
        const workRoute =
            EditionConstants.SERIES.route +
            editionWork.series.route +
            EditionConstants.SECTION.route +
            editionWork.section.route +
            editionWork.work.route;
        this._assetWorkPath = EditionConstants.EDITION_ASSETS.baseRoute + workRoute;
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
        const file = EditionConstants.EDITION_ASSETS.folioConvoluteFile;
        const url = `${this._assetWorkPath}/${file}`;
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
        const file = EditionConstants.EDITION_ASSETS.graphFile;
        const url = `${this._assetWorkPath}/${file}`;
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
        const file = EditionConstants.EDITION_ASSETS.introFile;
        const url = `${this._assetWorkPath}/${file}`;
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
        const file = EditionConstants.EDITION_ASSETS.sourceListFile;
        const url = `${this._assetWorkPath}/${file}`;
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
        const file = EditionConstants.EDITION_ASSETS.sourceDescriptionListFile;
        const url = `${this._assetWorkPath}/${file}`;
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
        const file = EditionConstants.EDITION_ASSETS.sourceEvaluationListFile;
        const url = `${this._assetWorkPath}/${file}`;
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
        const file = EditionConstants.EDITION_ASSETS.svgSheetsFile;
        const url = `${this._assetWorkPath}/${file}`;
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
        const file = EditionConstants.EDITION_ASSETS.textcriticsFile;
        const url = `${this._assetWorkPath}/${file}`;
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
            // Tap(res => this._logError(`fetched jsonData with url=${url}`)),
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
