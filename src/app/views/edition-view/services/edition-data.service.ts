import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { forkJoin as observableForkJoin, Observable, of as observableOf } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Folio, EditionSvgSheet, SourceList, TextcriticsList } from '@awg-views/edition-view/models';

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
    private BASE = 'assets/data';

    /**
     * Private variable: folioFile.
     *
     * It keeps the path to the folio JSON file.
     */
    private folioFile = 'folio.json';

    /**
     * Private variable: svgSheetsFile.
     *
     * It keeps the path to the svgSheets JSON file.
     */
    private svgSheetsFile = 'svg-sheets.json';

    /**
     * Private variable: sourcelistFile.
     *
     * It keeps the path to the sourcelist JSON file.
     */
    private sourcelistFile = 'sourcelist.json';

    /**
     * Private variable: textcriticsFile.
     *
     * It keeps the path to the textcritics JSON file.
     */
    private textcriticsFile = 'textcritics.json';

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
     * for the edition detail view
     * (folios, edition svg sheets and textcritics list)
     * as a fork-joined observable array.
     *
     * @returns {Observable<[Folio[], EditionSvgSheet[], TextcriticsList]>}
     * The fork-joined observable array with the Folio, EditionSvgSheet and TextcriticsList data.
     */
    getEditionDetailData(): Observable<[Folio[], EditionSvgSheet[], TextcriticsList]> {
        return observableForkJoin([this.getFolioData(), this.getSvgSheetsData(), this.getTextcriticsListData()]);
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
     * The fork-joined observable array with the SourceList and TextcriticsList data.
     */
    getEditionReportData(): Observable<[SourceList, TextcriticsList]> {
        return observableForkJoin([this.getSourceListData(), this.getTextcriticsListData()]);
    }

    /**
     * Private method: getFolioData.
     *
     * It sets the path to the JSON file with
     * the folio data and triggers
     * the method to get the JSON data.
     *
     * @returns {Observable<Folio[]>} The observable with the Folio data.
     */
    private getFolioData(): Observable<Folio[]> {
        const file = this.folioFile;
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
     * @returns {Observable<EditionSvgSheet[]>} The observable with the EditionSvgSheet data.
     */
    private getSvgSheetsData(): Observable<EditionSvgSheet[]> {
        const file = this.svgSheetsFile;
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
        const file = this.sourcelistFile;
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
        const file = this.textcriticsFile;
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
