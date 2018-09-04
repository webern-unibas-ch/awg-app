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
import { KnoraIRI, KnoraRights } from '@awg-shared/api-objects/basic-message-components';

/**
 * Represents a retrieved resource when doing a label search
 * @used by ResourceLabelSearchResponseJson
 */
@JsonObject
export class ResourceLabelSearchItemJson {

    /**
     * The IRI of the retrieved resource
     * @param id: KnoraIRI
     */
    @JsonProperty('id', String)
    public id: KnoraIRI = undefined;

    /**
     * The user's permissions on the retrieved resource
     * @param rights: KnoraRights
     */
    @JsonProperty('rights', Number)
    public rights: KnoraRights = undefined;

    /**
     * Values representing the retrieved resource
     * @param value: Array<string>
     */
    @JsonProperty('value', [String])
    public value: string[] = undefined;
}
