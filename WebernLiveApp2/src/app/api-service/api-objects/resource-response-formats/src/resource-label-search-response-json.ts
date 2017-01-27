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
import { BasicResponseJson } from '../../basic-message-components';
import { ResourceLabelSearchItemJson } from './resource-label-search-item-json';

/**
 * Represents resources that matched the search term in their label.
 * The search can be restricted to resource classes and a limit
 * can be defined for the results to be returned.
 * The amount of values to be returned for each retrieved resource
 * can also be defined.
 *
 * HTTP GET to http://host/v1/resources?searchstr=searchValue
 * [&restype_id=resourceClassIRI][&numprops=Integer][&limit=Integer]
 */
@JsonObject
export class ResourceLabelSearchResponseJson extends BasicResponseJson {

    /**
     * ...
     * @param resources: Array<ResourceLabelSearchItem>
     */
    @JsonProperty('resources', [ResourceLabelSearchItemJson])
    public resources: ResourceLabelSearchItemJson[] = undefined;


}
