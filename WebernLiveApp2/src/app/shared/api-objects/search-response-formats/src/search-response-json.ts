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
import { BasicResponseJson, StringOrNumber } from '../../basic-message-components';
import { PagingItemJson } from './paging-item-json';
import { SubjectItemJson } from './subject-item-json';
import { ThumbMaxJson } from './thumb-max-json';

/**
 * Represents the response to a fulltext or an extended search
 *
 * HTTP GET to http://host/v1/search/searchTerm?searchtype=fulltext
 * [&filter_by_restype=resourceClassIRI][&filter_by_project=projectIRI][&show_nrows=Integer]{[&start_at=Integer]
 *
 * HTTP GET to http://host/v1/search/?searchtype=extended
 * [&filter_by_restype=resourceClassIRI][&filter_by_project=projectIRI][&filter_by_owner=userIRI]
 * (&property_id=propertyTypeIRI&compop=comparisonOperator&searchval=searchValue)+[&show_nrows=Integer]{[&start_at=Integer]
 */
@JsonObject
export class SearchResponseJson extends BasicResponseJson {

    /**
     * Total number of hits
     * @param nhits: string | number
     */
    @JsonProperty('nhits', Any)
    public nhits: StringOrNumber = undefined;

    /**
     * Represents Information for paging.
     * Go through all the results page by page
     * (by going through the items of the array).
     * @param paging: Array<pagingItem>
     */
    @JsonProperty('paging', [PagingItemJson])
    public paging: PagingItemJson[] = undefined;

    /**
     * List of search result items
     * @param subjects: Array<subjectItem>
     */
    @JsonProperty('subjects', [SubjectItemJson])
    public subjects: SubjectItemJson[] = undefined;

    /**
     * maximal dimensions of preview representations
     * @param thumb_max: object
     */
    @JsonProperty('thumb_max', ThumbMaxJson)
    public thumb_max: ThumbMaxJson = undefined;
}
