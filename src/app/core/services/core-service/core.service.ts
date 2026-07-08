import { Injectable } from '@angular/core';

import { META_DATA } from '../../data/meta.data';
import { Meta, MetaSectionTypes } from '../../models/meta.model';

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
     * It provides a section of the metadata object.
     *
     * @params {<S extends MetaSectionTypes>S} [sectionType] The given sectionType.
     *
     * @returns {Meta[S]} The sectionType S of the metadata object.
     */
    getMetaDataSection<S extends MetaSectionTypes>(sectionType: S): Meta[S] {
        return META_DATA[sectionType];
    }

    /**
     * Public method: getMetaData.
     *
     * It provides the complete metadata object.
     *
     * @returns {Meta} The complete metadata object.
     */
    getMetaData(): Meta {
        return META_DATA;
    }
}
