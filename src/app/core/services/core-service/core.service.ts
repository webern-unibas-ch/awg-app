import { Injectable } from '@angular/core';

import { Logos, Meta } from '@awg-core/core-models';
import { LOGOSDATA, METADATA } from '@awg-core/mock-data';

@Injectable({
    providedIn: 'root'
})
export class CoreService {
    constructor() {}

    /********************************
     *
     * get MetaData
     *
     ********************************/
    getMetaData(): Meta {
        return METADATA;
    }

    /********************************
     *
     * get Logos
     *
     ********************************/
    getLogos(): Logos {
        return LOGOSDATA;
    }
}
