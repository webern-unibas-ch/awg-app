import { Injectable } from '@angular/core';

import { Meta } from './models';
import { METADATA } from './meta.data';


@Injectable()
export class MetaService {

    constructor() { }

    public getMetaData(): Meta {
        return METADATA[0];
    }

}
