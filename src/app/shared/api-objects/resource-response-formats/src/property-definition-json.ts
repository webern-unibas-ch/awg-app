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

/**
 * Represents information about a property type
 * @used by PropertyTypesInResourceClassJson, RestypeJson
 */
@JsonObject
export class PropertyDefinitionJson {
    /**
     * GUI attributes (HTML) of the property type
     * @param attributes: string | null
     */
    @JsonProperty('attributes', String)
    public attributes: string = undefined;

    /**
     * Description of the property type
     * @param description: string
     */
    @JsonProperty('description', String)
    public description: string = undefined;

    /**
     * Name of the GUI element used for the property type
     * @param gui_name: string | null
     */
    @JsonProperty('gui_name', String)
    public gui_name: string = undefined;

    /**
     * IRI of the property type
     * @param id: KnoraIRI
     */
    @JsonProperty('id', String)
    public id: KnoraIRI = undefined;

    /**
     * Label of the property type
     * @param label: string
     */
    @JsonProperty('label', String)
    public label: string = undefined;

    /**
     * IRI of the property type
     * @param name: KnoraIRI
     * TODO: difference to id<KnoraIRI> ??
     */
    @JsonProperty('name', String)
    public name: KnoraIRI = undefined;

    /**
     * Cardinality of the property type for the requested resource class
     * (not given if property type is requested for a vocabulary)
     * @param occurence: string
     */
    @JsonProperty('occurence', String, true)
    public occurence: string = undefined;

    /**
     * IRI of the property type's value
     * @param valuetype_id: KnoraIRI
     */
    @JsonProperty('valuetype_id', String)
    public valuetype_id: KnoraIRI = undefined;

    /**
     * IRI of the vocabulary the property type belongs to
     * @param vocabulary: KnoraIRI
     */
    @JsonProperty('vocabulary', String)
    public vocabulary: KnoraIRI = undefined;
}
