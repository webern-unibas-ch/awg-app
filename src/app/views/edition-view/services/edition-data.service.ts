import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { forkJoin as observableForkJoin, Observable, of as observableOf } from 'rxjs';
import { catchError, defaultIfEmpty, take } from 'rxjs/operators';

import {
    EditionConstants,
    EditionWork,
    EditionSvgSheetList,
    FolioConvoluteList,
    IntroList,
    SourceList,
    TextcriticsList
} from '@awg-views/edition-view/models';

/**
 * The EditionData service.
 *
 * It handles the calls to local JSON files vai HTTP
 * and provides the data response for the edition detail
 * and edition report view.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root'
})
export class EditionDataService {
    /**
     * Private variable: BASE.
     *
     * It keeps the base path to the JSON files.
     */
    private BASE = '';

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
     * Public method: getEditionDetailData.
     *
     * It provides the data from a JSON file
     * for the current composition of the edition detail view
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
    getEditionDetailData(
        editionWork: EditionWork
    ): Observable<[FolioConvoluteList, EditionSvgSheetList, TextcriticsList]> {
        this.setBasePath(editionWork);
        const folioData$: Observable<FolioConvoluteList> = this.getFolioConvoluteData();
        const svgSheetsData$: Observable<EditionSvgSheetList> = this.getSvgSheetsData();
        const textciticsListData$: Observable<TextcriticsList> = this.getTextcriticsListData();

        return observableForkJoin([folioData$, svgSheetsData$, textciticsListData$]).pipe(
            // default empty value
            defaultIfEmpty([new FolioConvoluteList(), new EditionSvgSheetList(), new TextcriticsList()]),
            // take only first request (JSON fetch)
            take(1)
        );
    }

    /**
     * Public method: getEditionIntroData.
     *
     * It provides the data from a JSON file
     * for the intro of the edition detail view.
     *
     * @param {EditionWork} editionWork The current composition input.
     *
     * @returns {Observable<IntroList>}
     * The fork-joined observable array with the FolioConvoluteList,
     * EditionSvgSheetList and TextcriticsList data.
     * Only the first emit is needed.
     */
    getEditionIntroData(editionWork: EditionWork): Observable<IntroList> {
        this.setBasePath(editionWork);
        const introData$: Observable<IntroList> = this.getIntroData();

        return introData$.pipe(
            // default empty value
            defaultIfEmpty(new IntroList()),
            // take only first request (JSON fetch)
            take(1)
        );
    }

    /**
     * Public method: getEditionReportData.
     *
     * It provides the data from a JSON file
     * for the edition report view
     * (source list and textcritics list)
     * as a fork-joined observable array.
     *
     * @returns {Observable<[SourceList, TextcriticsList]>}
     * The fork-joined observable array with the SourceList
     * and TextcriticsList data. Only the first emit is needed.
     */
    getEditionReportData(editionWork: EditionWork): Observable<[SourceList, TextcriticsList]> {
        this.setBasePath(editionWork);
        const sourceListData$: Observable<SourceList> = this.getSourceListData();
        const textciticsListData$: Observable<TextcriticsList> = this.getTextcriticsListData();

        return observableForkJoin([sourceListData$, textciticsListData$]).pipe(
            // default empty value
            defaultIfEmpty([new SourceList(), new TextcriticsList()]),
            // take only first request (JSON fetch)
            take(1)
        );
    }

    /**
     * Private method: setBasePath.
     *
     * It sets the base path to correct assets folder.
     *
     * @returns {void} It sets the BASE path.
     */
    private setBasePath(editionWork: EditionWork): void {
        const workRoute = editionWork.series.route + editionWork.section.route + editionWork.work.route;
        this.BASE = EditionConstants.editionAssets.baseRoute + workRoute;
    }

    /**
     * Private method: getFolioConvoluteData.
     *
     * It sets the path to the JSON file with
     * the folio convolute data and triggers
     * the method to get the JSON data.
     *
     * @returns {Observable<FolioConvoluteList>} The observable with the FolioConvolute data.
     */
    private getFolioConvoluteData(): Observable<FolioConvoluteList> {
        const file = EditionConstants.editionAssets.folioConvoluteFile;
        const url = `${this.BASE}/${file}`;
        return this.getJsonData(url);
    }

    /**
     * Private method: getIntroData.
     *
     * It sets the path to the JSON file with
     * the intro data and triggers
     * the method to get the JSON data.
     *
     * @returns {Observable<IntroList>} The observable with the Intro data.
     */
    private getIntroData(): Observable<IntroList> {
        const file = EditionConstants.editionAssets.introFile;
        const url = `${this.BASE}/${file}`;
        return this.getJsonData(url);
    }

    /**
     * Private method: getSourceListData.
     *
     * It sets the path to the JSON file with
     * the source list data and triggers
     * the method to get the JSON data.
     *
     * @returns {Observable<SourceList>} The observable with the SourceList data.
     */
    private getSourceListData(): Observable<SourceList> {
        const file = EditionConstants.editionAssets.sourcelistFile;
        const url = `${this.BASE}/${file}`;
        return this.getJsonData(url);
    }

    /**
     * Private method: getSvgSheetsData.
     *
     * It sets the path to the JSON file with
     * the svg sheets data and triggers
     * the method to get the JSON data.
     *
     * @returns {Observable<EditionSvgSheetList>} The observable with the EditionSvgSheet data.
     */
    private getSvgSheetsData(): Observable<EditionSvgSheetList> {
        const file = EditionConstants.editionAssets.svgSheetsFile;
        const url = `${this.BASE}/${file}`;
        return this.getJsonData(url);
    }

    /**
     * Private method: getTextcriticsListData.
     *
     * It sets the path to the JSON file with
     * the textcritics list data and triggers
     * the method to get the JSON data.
     *
     * @returns {Observable<TextcriticsList>} The observable with the TextcriticsList data.
     */
    private getTextcriticsListData(): Observable<TextcriticsList> {
        const file = EditionConstants.editionAssets.textcriticsFile;
        const url = `${this.BASE}/${file}`;
        return this.getJsonData(url);
    }

    /**
     * Private method: getJsonData.
     *
     * It fetches the given JSON file (path) via HTTP request.
     *
     * @param {string} path The path to the JSON file.
     * @returns {Observable<any>} The observable with the requested data.
     */
    private getJsonData(path: string): Observable<any> {
        return this.http.get(path).pipe(
            // tap(res => this.log(`fetched jsonData with url=${url}`)),
            catchError(this.handleError(`getJsonData`, []))
        );
    }

    /**
     * Private method: handleError.
     *
     * It handles errors, if any, of the HTTP request.
     *
     * @param {string} operation Name of the requested operation.
     * @param {T} [result] An optional empty result to let the app keep running.
     * @returns An observable of the error.
     */
    private handleError<T>(operation: string, result?: T) {
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return observableOf(result as T);
        };
    }

    /**
     * Private method: log.
     *
     * It logs a message to the console.
     *
     * @param {string} message The given message to be logged.
     * @returns {void} Logs the message to the console.
     */
    private log(message: string): void {
        console.log(message);
    }
}
