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
import { KnoraIRI, KnoraValue } from '@awg-shared/api-objects/basic-message-components';

/**
 * Represents a property value (no parallel arrays)
 * @used by PropJson
 */
@JsonObject('PropvalJson')
export class PropvalJson {
    /**
     * Comment on the value
     * @param comment: string | null
     */
    @JsonProperty('comment', String)
    public comment: string = undefined;

    /**
     * IRI of the value
     * @param id: KnoraIRI
     */
    @JsonProperty('id', String)
    public id: KnoraIRI = undefined;

    /**
     * Date of last modification of the value
     * @param lastmod: string | null
     */
    @JsonProperty('lastmod', String, true)
    public lastmod: string = undefined;

    /**
     * Date of last modification of the value as UTC
     * @param lastmod_utc: string | null
     */
    @JsonProperty('lastmod_utc', String, true)
    public lastmod_utc: string = undefined;

    /**
     * Owner of the value
     * @param person_id: string | null
     */
    @JsonProperty('person_id', String, true)
    public person_id: string = undefined;

    /**
     * Textual representation of the value
     * @param textval: string
     */
    @JsonProperty('textval', String)
    public textval: string = undefined;

    /**
     * Typed representation of the value
     * @param value: KnoraValue
     * TODO: check if it is possible to use a ValueJson class instead of undefine ??
     */
    @JsonProperty('value', Any)
    public value: KnoraValue = undefined;
}
