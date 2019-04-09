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
import { NodeItemJson } from './node-item-json';

/**
 * Represents a geodata item
 * @used by GeoDataJson
 */
@JsonObject
export class GeoDataItemJson extends NodeItemJson {
    /**
     * The geodata latitude
     * @param lat: string
     */
    @JsonProperty('lat', String, true)
    public lat: string = undefined;

    /**
     * The geodata longitude
     * @param lng: string
     */
    @JsonProperty('lng', String, true)
    public lng: string = undefined;

    /**
     * The geodata wikipedia link
     * @param wikipedia: string
     */
    @JsonProperty('wikipedia', String, true)
    public wikipedia: string = undefined;
}

/**
 * Represents a Geodata response
 * @used by ---
 */
@JsonObject
export class GeoDataJson extends BasicResponseJson {
    /**
     * The geodata array
     * @param nodelist: GeoDataItemJson[]
     */
    @JsonProperty('nodelist', [GeoDataItemJson])
    public nodelist: GeoDataItemJson[] = undefined;
}
