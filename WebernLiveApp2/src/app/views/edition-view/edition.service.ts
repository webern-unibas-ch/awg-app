import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class EditionService {

    constructor(
        private _http: Http
    ) { }

    getJsonData(url: string): Observable<any> {
        let data: string = 'assets/data' + url;
        return this._http.get(data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        try {
            // console.log(res.json());
            return res.json();
        } catch (e) {
            // console.log(e);
            return Observable.throw('Data error in edition service.');
        }
    }

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Observable.throw(errMsg);
    }

}
