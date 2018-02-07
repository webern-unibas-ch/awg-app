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
import { PropItemForResTypeJson } from './prop-item-for-res-type-json';

/**
 * Represents a resource class.
 * @used by ResourceTypesInVocabularyResponseJson
 */
@JsonObject
export class ResTypeItemJson {

    /**
     * IRI of the resource class
     * @param id: KnoraIRI
     */
    @JsonProperty('id', String)
    public id: KnoraIRI = undefined;

    /**
     * Label of the resource class
     * @param label: string
     */
    @JsonProperty('label', String)
    public label: string = undefined;

    /**
     * Property Types that this resource class may have
     * @param properties: Array<propItemForResType>
     */
    @JsonProperty('properties', [PropItemForResTypeJson])
    public properties: PropItemForResTypeJson[] = undefined;
}
