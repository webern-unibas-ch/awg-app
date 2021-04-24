import { Injectable } from '@angular/core';

import { Logos, Meta, MetaSectionTypes } from '@awg-core/core-models';
import { LOGOSDATA, METADATA } from '@awg-core/mock-data';

/**
 * The Core service.
 *
 * It handles the provision of app's metadata and logos objects.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class CoreService {
    /**
     * Public method: getMetaDataSection.
     *
     * It provides a section of the meta data object.
     *
     * @params {<S extends MetaSectionTypes>S} [sectionType] The given sectionType.
     *
     * @returns {Meta[S]} The sectionType S of the metadata object.
     */
    getMetaDataSection<S extends MetaSectionTypes>(sectionType: S): Meta[S] {
        return METADATA[sectionType];
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
