import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Sheet, Source, Textcritics } from '../models';

@Injectable()
export class DataService {

    private BASE = 'assets/data';

    constructor(
        private http: Http
    ) { }

    /*********************************
     *
     * get data from JSON files
     *
     * returns array of Observables,
     * e.g. [Observable<Sheets[]>, Observable<Textcritics[]>]
     *
     *********************************/
    public getEditionDetailData(): Observable<any> {
        return Observable.forkJoin(
            this.getSheetsData(),
            this.getTextcriticsData()
        );
    }

    public getEditionReportData(): Observable<any> {
        return Observable.forkJoin(
            this.getSourceListData(),
            this.getTextcriticsData()
        );
    }


    /*
     * private functions to prepare http request
     */
    private getSheetsData(): Observable<Sheet[]> {
        const file = 'sheets.json';
        const url = `${this.BASE}/${file}`;
        return this.getJsonData(url);
    }

    private getSourceListData(): Observable<Source[]> {
        const file = 'sourcelist.json';
        const url = `${this.BASE}/${file}`;
        return this.getJsonData(url);
    }

    private getTextcriticsData(): Observable<Textcritics[]> {
        const file = 'textcritics.json';
        const url = `${this.BASE}/${file}`;
        return this.getJsonData(url);
    }

    /*
     * http request
     */
    private getJsonData(url: string): Observable<Sheet[] | Source[] | Textcritics[]> {
        return this.http.get(url)
            .map((res: Response) => res.json() as Sheet[] | Source[] | Textcritics[])
            .catch(this.handleError);
    }

    /*
     * error handling
     */
    private handleError (error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}
