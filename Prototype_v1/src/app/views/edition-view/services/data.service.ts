import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/observable/forkJoin';
import { catchError, map, tap } from 'rxjs/operators';

import { ConvoluteFolio, EditionSvgFile, Source, TextcriticsList } from '@awg-views/edition-view/models';


@Injectable()
export class DataService {

    private BASE = 'assets/data';

    constructor(
        private http: HttpClient
    ) { }


    /*********************************
     *
     * get data from JSON files
     *
     * returns array of Observables,
     * e.g. [Observable<Sheets[]>, Observable<Textcritics[]>]
     *
     *********************************/
    public getEditionDetailData(): Observable<[ConvoluteFolio[], EditionSvgFile[], TextcriticsList]> {
        return Observable.forkJoin(
            this.getFolioData(),
            this.getSheetsData(),
            this.getTextcriticsData()
        );
    }


    public getEditionReportData(): Observable<[Source[], TextcriticsList]> {
        return Observable.forkJoin(
            this.getSourceListData(),
            this.getTextcriticsData()
        );
    }


    /*
     * private functions to prepare http request
     */
    private getFolioData(): Observable<ConvoluteFolio[]> {
        const file = 'convolute.json';
        const url = `${this.BASE}/${file}`;
        return this.getJsonData(url);
    }


    private getSheetsData(): Observable<EditionSvgFile[]> {
        const file = 'sheets.json';
        const url = `${this.BASE}/${file}`;
        return this.getJsonData(url);
    }


    private getSourceListData(): Observable<Source[]> {
        const file = 'sourcelist.json';
        const url = `${this.BASE}/${file}`;
        return this.getJsonData(url);
    }


    private getTextcriticsData(): Observable<TextcriticsList> {
        const file = 'textcritics.json';
        const url = `${this.BASE}/${file}`;
        return this.getJsonData(url);
    }


    /*
     * http request to fetch json files
     */
    private getJsonData(url: string): Observable<any> {
        return this.http.get(url)
            .pipe(
                // tap(res => this.log(`fetched jsonData with url=${url}`)),
                catchError(this.handleError(`getJsonData`, []))
            );
    }


    /*
     * error handling
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }


    private log(message: string) {
        console.log(message);
    }

}
