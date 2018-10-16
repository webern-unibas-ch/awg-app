import { Injectable } from '@angular/core';

import { Meta } from '@awg-core/core-models';
import { METADATA } from '@awg-core/mock-data';

@Injectable({
    providedIn: 'root'
})
export class MetaService {
    constructor() {}

    /********************************
     *
     * get MetaData
     *
     ********************************/
    public getMetaData(): Meta {
        return METADATA[0];
    }
}
