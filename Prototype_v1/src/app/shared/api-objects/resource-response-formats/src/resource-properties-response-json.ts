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
import { BasicResponseJson } from '../../basic-message-components';
import { PropJson } from './prop-json';

/**
 * Represents the Knora API V1 response to a properties request for
 * a resource. This response just returns a resource's properties.
 *
 * HTTP GET to http://host/v1/properties/resourceIRI
 */
@JsonObject
export class ResourcePropertiesResponseJson extends BasicResponseJson {

    /**
     * A map of property type IRIs to property instances
     * @param properties: object
     * * @type [index: string]: prop
     * TODO
     */
    @JsonProperty('properties', [PropJson])
    public properties: IndexedPropJson[] = undefined;
}

interface IndexedPropJson {
    [index: string]: PropJson;
}
