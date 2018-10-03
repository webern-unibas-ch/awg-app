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
import { PropJson } from './prop-json';

/**
 * Represents the regions attached to a resource
 *
 * A map of property types to property values and res_id and iconsrc
 * @param indexable: [index:string]: prop | str
 * @used by ResinfoJson
 */
@JsonObject
export class RegionJson {

    /**
     * ...
     * @param [index: KnoraIRI]: prop
     */
    @JsonProperty('http://www.knora.org/ontology/knora-base#hasComment', PropJson)
    public hasComment: PropJson = undefined;

    /**
     * ...
     * @param [index: KnoraIRI]: prop
     */
    @JsonProperty('http://www.knora.org/ontology/knora-base#hasColor', PropJson)
    public hasColor: PropJson = undefined;


    /**
     * ...
     * @param iconsrc: string
     */
    @JsonProperty('iconsrc', String)
    public iconsrc: string = undefined;

    /**
     * ...
     * @param res_id: KnoraIRI
     */
    @JsonProperty('res_id', String)
    public res_id: KnoraIRI = undefined;

    /**
     * ...
     * @param [index: KnoraIRI]: prop
     */
    @JsonProperty('http://www.knora.org/ontology/knora-base#isRegionOf', PropJson)
    public isRegionOf: PropJson = undefined;

    /**
     * ...
     * @param [index: KnoraIRI]: prop
     */
    @JsonProperty('http://www.knora.org/ontology/knora-base#hasGeometry', PropJson)
    public hasGeometry: PropJson = undefined;
}
