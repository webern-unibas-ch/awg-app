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
import { PropertyDefinitionJson } from './property-definition-json';

/**
 * Represents a list of property types
 * for the requested resource class or vocabulary.
 *
 * HTTP GET to http://host/v1/propertylists?restype=resourceClassIRI
 */
@JsonObject
export class PropertyTypesInResourceClassResponseJson extends BasicResponseJson {
    /**
     * Lists the property types the indicated resource class
     * or vocabulary may have.
     * @param properties: Array<propertyDefinition>
     */
    @JsonProperty('properties', [PropertyDefinitionJson])
    public properties: PropertyDefinitionJson[] = undefined;
}
