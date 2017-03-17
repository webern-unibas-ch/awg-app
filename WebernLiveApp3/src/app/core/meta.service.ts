import { Injectable } from '@angular/core';

import { Meta } from './models';
import { METADATA } from './data';


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
