import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Sheet, Source, Textcritics } from './models';
import { DialogService } from '../../core/dialog/dialog.service';

@Injectable()
export class EditionService {

    private BASE: string = 'assets/data/';

    constructor(
        private http: Http,
        private dialogService: DialogService
    ) { }


    /********************************
     *
     * open edition dialog
     *
     * calls DialogService with identifier
     *
     ********************************/
    public openEditionDialog(identifier: string): void {
        this.dialogService.openEditionDialog(identifier);
    }


    /*********************************
     *
     * get data from JSON files
     *
     * returns array of Observables,
     * e.g. [Observable<Sheets[]>, Observable<Textcritics[]>]
     *
     *********************************/
    public getSheetsAndCommentsData(): Observable<any> {
        return Observable.forkJoin(
            this.getSheetsData(),
            this.getCommentsData()
        );
    }

    public getSourceListAndCommentsData(): Observable<any> {
        return Observable.forkJoin(
            this.getSourceListData(),
            this.getCommentsData()
        );
    }
            /*
             * private functions to prepare http request
             */
            private getCommentsData(): Observable<Textcritics[]> {
                const file = 'textcritics.json';
                const url = `${this.BASE}/${file}`;
                return this.getJsonData(url);
            }

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


    /********************************
     *
     * get comments for selected item
     *
     * returns array with comments<Textcritics[]>
     *     and selectedItem<string>
     *
     ********************************/
    public getCommentsForItem(item: Textcritics[], type: string, typeId: string): [Textcritics[], string] {
        let comments = [];
        let selectedItem: string = '';
        switch (type) {
            case 'measure':
                selectedItem = 'm' + typeId;
                comments = this.getCommentsValues(item, type, typeId);
                break;
            case 'system':
                selectedItem = 's' + typeId;
                comments = this.getCommentsValues(item, type, typeId);
                break;
            case 'single':
                selectedItem = typeId;
                comments.push(item[typeId]);
                break;
        }
        return [comments, selectedItem];
    }

            /*
             * private function to prepare values
             */
            private getCommentsValues(item: Textcritics[], type: string, typeId: string): Textcritics[] {
                let arr = [];
                item.forEach((comment) => {
                    // trim existing values
                    let tkaValue: string = comment[type] ? comment[type].replace("[", "").replace("]", "") : null;
                    // check if value matches id
                    if (tkaValue == typeId) {
                        arr.push(comment);
                    }
                });
                return arr;
            }

}
