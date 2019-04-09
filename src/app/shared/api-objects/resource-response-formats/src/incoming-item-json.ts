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
import { KnoraIRI } from '@awg-shared/api-objects/basic-message-components';
import { ResinfoJson } from './resinfo-json';

/**
 * Representation of the referring resource
 * @param ext_res_id: Object<id: KnoraIRI, pid: KnoraIRI>
 * @used by IncomingItemJson
 */
@JsonObject
export class ExtResIdJson {
    /**
     * The IRI of the referring resource
     * @param id: KnoraIRI
     */
    @JsonProperty('id', String)
    public id: KnoraIRI = undefined;

    /**
     * The IRI of the referring property type
     * @param pid: KnoraIRI
     */
    @JsonProperty('pid', String)
    public pid: KnoraIRI = undefined;
}

/**
 * Represents a resource referring to the requested resource.
 * @used by ResourceFullResponseJson
 */
@JsonObject
export class IncomingItemJson {
    /**
     * Representation of the referring resource
     * @param ext_res_id: Object<id: KnoraIRI, pid: KnoraIRI>
     */
    @JsonProperty('ext_res_id', ExtResIdJson)
    public ext_res_id: ExtResIdJson = undefined;

    /**
     * Description of the resource and its class
     * @param resinfo: resinfo
     */
    @JsonProperty('resinfo', ResinfoJson)
    public resinfo: ResinfoJson = undefined;

    /**
     * First property of the referring resource
     * @param value: string
     */
    @JsonProperty('value', String)
    public value: string = undefined;
}
