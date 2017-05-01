import { Injectable } from '@angular/core';

import { Meta } from '../../core-models';
import { METADATA } from '../../mock-data';


@Injectable()
export class MetaService {

    constructor() { }

    /********************************
     *
     * get MetaData
     *
     ********************************/
    public getMetaData(): Meta {
        return METADATA[0];
    }

}
