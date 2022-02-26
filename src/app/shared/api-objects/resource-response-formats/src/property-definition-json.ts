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

import { Any, JsonObject, JsonProperty } from 'json2typescript';
import { KnoraIRI, StringOrNumber } from '@awg-shared/api-objects/basic-message-components';

/**
 * Represents information about a property type
 * @used by PropertyTypesInResourceClassJson, RestypeJson
 */
@JsonObject('PropertyDefinitionJson')
export class PropertyDefinitionJson {
    /**
     * IRI of the property type
     * @param id: KnoraIRI
     */
    @JsonProperty('id', String)
    public id: KnoraIRI = undefined;

    /**
     * IRI of the property type
     * @param name: KnoraIRI
     */
    @JsonProperty('name', String)
    public name: KnoraIRI = undefined;

    /**
     * IRI of the property type's value
     * @param valuetype_id: KnoraIRI
     */
    @JsonProperty('valuetype_id', String)
    public valuetype_id: KnoraIRI = undefined;

    /**
     * GUI attributes (HTML) of the property type
     * @param attributes: string | null
     */
    @JsonProperty('attributes', String, true)
    public attributes: string = undefined;

    /**
     * IRI of the vocabulary the property type belongs to
     * @param vocabulary_id: KnoraIRI
     */
    @JsonProperty('vocabulary_id', String)
    public vocabulary_id: KnoraIRI = undefined;

    /**
     * IRI of the GUI element used for the property type
     * @param guielement_id: KnoraIRI
     */
    @JsonProperty('guielement_id', String)
    public guielement_id: KnoraIRI = undefined;

    /**
     * Flag to indicate if a property is an annotation property
     * @param is_annotation: string
     */
    @JsonProperty('is_annotation', Any)
    public is_annotation: StringOrNumber = undefined;

    /**
     * Owner of the value
     * @param person_id: string | null
     */
    @JsonProperty('person_id', String, true)
    public person_id: string = undefined;

    /**
     * The vocabulary's short name
     * @param shortname: string
     */
    @JsonProperty('shortname', String)
    public shortname: string = undefined;

    /**
     * The vocabulary's long name
     * @param longname: string
     */
    @JsonProperty('longname', String)
    public longname: string = undefined;

    /**
     * Label of the property type
     * @param label: string
     */
    @JsonProperty('label', String)
    public label: string = undefined;
}
