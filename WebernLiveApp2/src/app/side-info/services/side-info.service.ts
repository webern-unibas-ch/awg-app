import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SideInfoService {

    private sideInfoData: Subject<any> = new Subject<any>();   // observable string source

    /**********************************
     **
     **  share data for sideInfo
     **
     **********************************/
        // Observable string stream for subscription
    public sideInfoData$ = this.sideInfoData.asObservable();

    // share function for setting next data input
    public shareSideInfoData(data) {
        this.sideInfoData.next(data);
    }

}
