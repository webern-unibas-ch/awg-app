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

import { JsonObject, JsonProperty } from 'json2typescript';

/**
 * Represents a page in a collection of pages.
 * @used by SearchResponseJson
 */
@JsonObject('PagingItemJson')
export class PagingItemJson {
    /**
     * True if this item represents the current page of search results
     * @param current: Boolean
     */
    @JsonProperty('current', Boolean)
    public current: boolean = undefined;

    /**
     * The number of results shown on the page
     * @param show_nrows: number
     */
    @JsonProperty('show_nrows', Number)
    public show_nrows: number = undefined;

    /**
     * The index of the first search result on the page
     * @param start_at: number
     */
    @JsonProperty('start_at', Number)
    public start_at: number = undefined;
}
