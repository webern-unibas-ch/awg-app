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

import { JsonObject, JsonProperty } from 'json2typescript';
import { BasicResponseJson } from '@awg-shared/api-objects/basic-message-components';
import { RestypeJson } from './restype-json';

/**
 * Represents the Knora API V1 response to a resource type request.
 *
 * HTTP GET to http://host/v1/resourcetypes/resourceClassIRI
 */
@JsonObject
export class ResourceTypeResponseJson extends BasicResponseJson {
    /**
     * Represents information about the requested resource class
     * @param restype_info: restype
     */
    @JsonProperty('restype_info', RestypeJson)
    public restype_info: RestypeJson = undefined;
}
