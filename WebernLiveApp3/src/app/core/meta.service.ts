import { Injectable } from '@angular/core';

import { MetaModel } from './meta.model';
import { METADATA } from './meta.data';


@Injectable()
export class MetaService {

    constructor() { }

    public getMetaData(): MetaModel {
        return METADATA[0];
    }

}
