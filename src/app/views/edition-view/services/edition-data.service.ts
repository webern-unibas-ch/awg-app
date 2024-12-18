import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

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
    PrefaceList,
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
     * Private readonly injection variable: _http.
     *
     * It keeps the instance of the Angular HttpClient.
     */
    private readonly _http = inject(HttpClient);

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
     * Public method: getEditionComplexIntroData.
     *
     * It provides the data from a JSON file
     * for the intro of an edition complex of the edition view.
     *
     * @param {EditionComplex} editionComplex The current edition complex.
     *
     * @returns {Observable<IntroList>} The observable with the IntroList data.
     */
    getEditionComplexIntroData(editionComplex: EditionComplex): Observable<IntroList> {
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
     * Public method: getEditionSectionIntroData.
     *
     * It provides the data from a JSON file
     * for the intro of an edition section of the edition view.
     *
     * @param {string} seriesRoute The current series route.
     * @param {string} sectionRoute The current section route.
     *
     * @returns {Observable<IntroList>} The observable with the IntroList data.
     */
    getEditionSectionIntroData(seriesRoute: string, sectionRoute: string): Observable<IntroList> {
        this._assetPath = this._setAssetPathForSectionIntro(seriesRoute, sectionRoute);
        const introData$: Observable<IntroList> = this._getIntroData();

        return introData$.pipe(
            // Default empty value
            defaultIfEmpty(new IntroList()),
            // Take only first request (JSON fetch)
            take(1)
        );
    }

    /**
     * Public method: getEditionPrefaceData.
     *
     * It provides the data from a JSON file
     * for the preface of the edition view.
     *
     * @returns {Observable<PrefaceList>} The observable with the PrefaceList data.
     */
    getEditionPrefaceData(): Observable<PrefaceList> {
        this._assetPath = EDITION_ASSETS_DATA.BASE_ROUTE;
        const prefaceData$: Observable<PrefaceList> = this._getPrefaceData();

        return prefaceData$.pipe(
            // Default empty value
            defaultIfEmpty(new PrefaceList()),
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
     * Protected method: _setAssetPathForEditionComplex.
     *
     * It sets the path to correct assets folder of a given edition complex.
     *
     * @param {EditionComplex} editionComplex The current edition complex.
     *
     * @returns {string} The path to the correct assets folder of a given edition complex.
     */
    protected _setAssetPathForEditionComplex(editionComplex: EditionComplex): string {
        return this._generateAssetPath(
            editionComplex.pubStatement.series.route,
            editionComplex.pubStatement.section.route,
            editionComplex.complexId.route
        );
    }

    /**
     * Private method: _generateAssetPath.
     *
     * It generates the path to the correct assets folder
     * of a given edition complex or section.
     *
     * @param {string} seriesRoute The current series route.
     * @param {string} sectionRoute The current section route.
     * @param {string} [complexIdRoute] The current complex id route.
     *
     * @returns {string} The path to the correct assets folder of a given edition complex or section.
     */
    private _generateAssetPath(seriesRoute: string, sectionRoute: string, complexIdRoute?: string): string {
        const delimiter = '/';
        let route =
            delimiter +
            EDITION_ROUTE_CONSTANTS.SERIES.route +
            delimiter +
            seriesRoute +
            delimiter +
            EDITION_ROUTE_CONSTANTS.SECTION.route +
            delimiter +
            sectionRoute;
        if (complexIdRoute) {
            route += complexIdRoute;
        }
        return EDITION_ASSETS_DATA.BASE_ROUTE + route;
    }

    /**
     * Private method: _setAssetPathForSectionIntro.
     *
     * It sets the path to correct assets folder of an intro of a given edition section.
     *
     * @param {string} seriesRoute The current series route.
     * @param {string} sectionRoute The current section route.
     *
     * @returns {string} The path to the correct assets folder of an intro of a given edition section.
     */
    private _setAssetPathForSectionIntro(seriesRoute: string, sectionRoute: string): string {
        return this._generateAssetPath(seriesRoute, sectionRoute);
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
     * Private method: _getPrefaceData.
     *
     * It sets the path to the JSON file with
     * the preface data and triggers
     * the method to get the JSON data.
     *
     * @returns {Observable<PrefaceList>} The observable with the Preface data.
     */
    private _getPrefaceData(): Observable<PrefaceList> {
        const file = EDITION_ASSETS_DATA.FILES.prefaceFile;
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
        return this._http.get(path).pipe(
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
