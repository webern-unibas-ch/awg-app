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
import { KnoraIRI } from '../../basic-message-components';
import { PropertyDefinitionJson } from './property-definition-json';

/**
 * Represents information about the requested resource class
 * @used by ResourceTypeResponseJson
 */
@JsonObject
export class RestypeJson {

    /**
     * Description of the resource class
     * @param description: string
     */
    @JsonProperty('description', String)
    public description: string = undefined;

    /**
     * Path to the resource class icon
     * @param iconsrc: string
     */
    @JsonProperty('iconsrc', String)
    public iconsrc: string = undefined;

    /**
     * Label of the resource class
     * @param label: string
     */
    @JsonProperty('label', String)
    public label: string = undefined;

    /**
     * IRI of the resource class
     * @param name: KnoraIRI
     */
    @JsonProperty('name', String)
    public name: KnoraIRI = undefined;

    /**
     * Property types that the resource class may have
     * @param properties: Array<propertyDefinition>
     */
    @JsonProperty('properties', [PropertyDefinitionJson])
    public properties: PropertyDefinitionJson[] = undefined;
}
