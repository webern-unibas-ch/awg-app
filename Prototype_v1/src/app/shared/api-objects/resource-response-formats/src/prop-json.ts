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
import { PropvalJson } from './propval-json';

/**
 * Represents a property (no parallel arrays)
 * @used by RegionJson, ResourcePropertiesResponseJson
 */
@JsonObject
export class PropJson {

    /**
     * HTML attributes for the GUI element
     * used to render this property
     * @param attributes: string | null
     */
    @JsonProperty('attributes', String)
    public attributes: string = undefined;

    /**
     * GUI element of the property
     * @param guielement: string | null
     */
    @JsonProperty('guielement', String)
    public guielement: string = undefined;

    /**
     * Obsolete
     * @param is_annotation: string
     */
    @JsonProperty('is_annotation', String)
    public is_annotation: string = undefined;

    /**
     * Label of the property type
     * @param label: string
     */
    @JsonProperty('label', String)
    public label: string = undefined;

    /**
     * IRI of the property type
     * @param pid: KnoraIRI
     */
    @JsonProperty('pid', String)
    public pid: KnoraIRI = undefined;

    /**
     * The property's values if given. If an instance
     * of this property type does not exist for
     * the requested resource, only the information
     * about the property type is returned.
     * @param values: Array<propval> OPTIONAL
     */
    @JsonProperty('values', [PropvalJson], true)
    public values: PropvalJson[] = undefined;

    /**
     * Type of the value as a string
     * @param valuetype: string
     */
    @JsonProperty('valuetype', String)
    public valuetype: string = undefined;

    /**
     * IRI of the value type
     * @param valuetype_id: KnoraIRI
     */
    @JsonProperty('valuetype_id', String)
    public valuetype_id: KnoraIRI = undefined;
}
