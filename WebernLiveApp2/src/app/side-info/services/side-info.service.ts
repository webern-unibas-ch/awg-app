import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SideInfoService {

    private sideInfoData: Subject<any> = new Subject<any>();   // observable string source
    public sideInfoData$ = this.sideInfoData.asObservable();   // Observable string stream for subscription

    /**********************************
     **
     **  share data for sideInfo
     **
     **********************************/

    // share function for setting next data input
    public shareSideInfoData(data) {
        this.sideInfoData.next(data);
    }

}
