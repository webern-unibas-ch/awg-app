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
import { BasicResponseJson, KnoraRights } from '@awg-shared/api-objects/basic-message-components';
import { ResinfoJson } from './resinfo-json';

/**
 * Represents the Knora API V1 response to a resource info request
 * (reqtype=info)
 *
 * HTTP GET to http://host/v1/resources/resourceIRI?reqtype=info
 */
@JsonObject('ResourceInfoResponseJson')
export class ResourceInfoResponseJson extends BasicResponseJson {
    /**
     * Description of the resource and its class
     * @param resource_info: resinfo
     */
    @JsonProperty('resource_info', ResinfoJson)
    public resource_info: ResinfoJson = undefined;

    /**
     * The current user's permissions on the resource
     * @param rights: KnoraRights
     */
    @JsonProperty('rights', Number)
    public rights: KnoraRights = undefined;
}
