/* eslint-disable @typescript-eslint/naming-convention */

/* Copyright © 2016 Lukas Rosenthaler, André Kilchenmann, Andreas Aeschlimann,
 * Sofia Georgakopoulou, Ivan Subotic, Benjamin Geer, Tobias Schweizer.
 * This file is part of SALSAH.
 * SALSAH is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * SALSAH is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * You should have received a copy of the GNU Affero General Public
 * License along with SALSAH.  If not, see <http://www.gnu.org/licenses/>.
 * */

import { KnoraIRI, KnoraRights } from '@awg-shared/api-objects/basic-message-components';
import { Any, JsonObject, JsonProperty } from 'json2typescript';

/**
 * Represents information about a resource.
 * @used by ResourceFullResponseJson
 */
@JsonObject('ResdataJson')
export class ResdataJson {
    /**
     * Icon of the resource's class
     * @param iconsrc: string
     */
    @JsonProperty('iconsrc', String)
    public iconsrc: string = undefined;

    /**
     * IRI of the resource
     * @param res_id: KnoraIRI
     */
    @JsonProperty('res_id', String)
    public res_id: KnoraIRI = undefined;

    /**
     * Label of the resource's class
     * @param restype_label: string
     */
    @JsonProperty('restype_label', String)
    public restype_label: string = undefined;

    /**
     * IRI of the resource's class
     * @param restype_name: KnoraIRI
     */
    @JsonProperty('restype_name', String)
    public restype_name: KnoraIRI = undefined;

    /**
     * The given user's permissions on the resource
     * @param rights: KnoraRights
     */
    @JsonProperty('rights', Any)
    public rights: KnoraRights = undefined;
}
