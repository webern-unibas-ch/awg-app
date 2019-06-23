import { Injectable } from '@angular/core';

import { Logos, Meta } from '@awg-core/core-models';
import { LOGOSDATA, METADATA } from '@awg-core/mock-data';

/**
 * The Core service.
 *
 * It handles the provision of app's metadata and logos objects.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root'
})
export class CoreService {
    /**
     * Public method: getMetaData.
     *
     * It provides the app-wide metadata object.
     *
     * @returns {Meta} The app-wide metadata object.
     */
    getMetaData(): Meta {
        return METADATA;
    }

    /**
     * Public method: getLogos.
     *
     * It provides the app-wide logos object.
     *
     * @returns {Logos} The app-wide logos object.
     */
    getLogos(): Logos {
        return LOGOSDATA;
    }
}
