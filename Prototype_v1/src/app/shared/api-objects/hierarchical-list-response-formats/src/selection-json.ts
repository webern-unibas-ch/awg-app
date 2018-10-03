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
import { NodeItemJson } from './node-item-json';


/**
 * Represents a selection item
 * @used by SelectionJson
 */
@JsonObject
export class SelectionItemJson extends NodeItemJson {

    /**
     * The label_ok value
     * @param label_ok: boolean
     */
    @JsonProperty('label_ok', Boolean)
    public label_ok: boolean = undefined;

    /**
     * The selection order
     * @param order: string
     */
    @JsonProperty('order', String)
    public order: string = undefined;
}


/**
 * Represents a selection response
 * @used by ---
 */
@JsonObject
export class SelectionJson extends BasicResponseJson {

    /**
     * The selection array
     * @param selection: SelectionItemJson[]
     */
    @JsonProperty('selection', [SelectionItemJson])
    public selection: SelectionItemJson[] = undefined;
}
