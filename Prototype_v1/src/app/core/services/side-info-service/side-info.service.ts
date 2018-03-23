import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { SearchInfo } from '../../../side-info/side-info-models/index';

@Injectable()
export class SideInfoService {

    private sideInfoData: Subject<any> = new Subject<any>();   // observable string source
    private sideInfoData$ = this.sideInfoData.asObservable();   // Observable string stream for subscription

    private searchInfoTitle: Subject<any> = new Subject<string>();   // observable string source
    private searchInfoTitle$ = this.searchInfoTitle.asObservable();   // Observable string stream for subscription

    /**********************************
     **
     **  get data from sideInfo
     **
     **********************************/
    public getSideInfoData(): Observable<any> {
        return this.sideInfoData$;
    }

    public getSearchInfoTitle(): Observable<string> {
        return this.searchInfoTitle$;
    }


    /**********************************
     **
     **  update sideInfo data
     **
     **********************************/
    public updateSideInfoData(data: any): void {
        this.sideInfoData.next(data);
    }

    public updateSearchInfoData(searchInfo: SearchInfo) {
        this.sideInfoData.next(searchInfo);
    }

    public updateSearchInfoTitle(title: string) {
        console.log('updateSearchInfoTitle: title: ', title);
        this.searchInfoTitle.next(title);
    }

}
