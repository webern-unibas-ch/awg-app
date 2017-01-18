import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Sheet } from './sheet';
import { Source } from './source';
import { Textcritics } from './textcritics';

@Injectable()
export class EditionService {

    BASE: string = 'assets/data/';

    constructor(
        private _http: Http
    ) { }

    getCommentsData(): Promise<Textcritics[]> {
        let file = 'textcritics.json';
        const url = `${this.BASE}/${file}`;
        return this.getJsonData(url);
    }

    getSheetsData(): Promise<Sheet[]> {
        let file = 'sheets.json';
        const url = `${this.BASE}/${file}`;
        return this.getJsonData(url);
    }

    getSourceListData(): Promise<Source[]> {
        let file = 'sourcelist.json';
        const url = `${this.BASE}/${file}`;
        return this.getJsonData(url);
    }


    getJsonData(url: string): Promise<Sheet[] | Source[] | Textcritics[]> {
        return this._http.get(url)
            .toPromise()
            .then(response => response.json() as Sheet[] | Source[] | Textcritics[])
            .catch(this.handleError);
    }

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Promise.reject(errMsg);
    }

}
