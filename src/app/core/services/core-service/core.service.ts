import { Injectable } from '@angular/core';

import { Logos, Meta, MetaSectionKey } from '@awg-core/core-models';
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
     * Public method: getMetaDataSection.
     *
     * It provides a section of the meta data object.
     *
     * @params {<K extends MetaSectionKey>} [section] The given section.
     * @returns {Meta[K]} The section K of the metadata object.
     */
    getMetaDataSection<K extends MetaSectionKey>(section?: K): Meta[K] {
        return METADATA[section];
    }

    /**
     * Public method: getMetaData.
     *
     * It provides the complete metadata object.
     *
     * @returns {Meta} The complete metadata object.
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
