import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { SearchInfo } from '../side-info-models';

@Injectable()
export class SideInfoService {

    private sideInfoData: Subject<any> = new Subject<any>();   // observable string source
    private sideInfoData$ = this.sideInfoData.asObservable();   // Observable string stream for subscription

    public searchInfo: SearchInfo;

    /**********************************
     **
     **  share data for sideInfo
     **
     **********************************/

    public getSideInfoData(): Observable<any> {
        return this.sideInfoData$;
    }

    // share function for setting next data input
    public shareSideInfoData(data: any): void {
        this.sideInfoData.next(data);
    }

    // TODO: refactor
    public shareSearchInfoQuery(query: string) {
        this.searchInfo.query = query;
        this.sideInfoData.next(this.searchInfo);
    }

    public shareSearchInfoTitle(title: string) {
        this.searchInfo.title = title;
        this.sideInfoData.next(this.searchInfo);
    }

}
