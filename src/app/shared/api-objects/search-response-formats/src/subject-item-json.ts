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
import { KnoraIRI, KnoraRights } from '@awg-shared/api-objects/basic-message-components';

/**
 * Represents a search result item
 * @used by SearchResponseJson
 */
@JsonObject('SubjectItemJson')
export class SubjectItemJson {
    /**
     * Description of the resource's class
     * @param iconlabel: string
     */
    @JsonProperty('iconlabel', String)
    public iconlabel: string = undefined;

    /**
     * Icon representing the resource's class
     * @param iconsrc: string
     */
    @JsonProperty('iconsrc', String)
    public iconsrc: string = undefined;

    /**
     * Description of the resource's class
     * @param icontitle: string
     */
    @JsonProperty('icontitle', String)
    public icontitle: string = undefined;

    /**
     * IRI of the retrieved resource
     * @param obj_id: KnoraIRI
     */
    @JsonProperty('obj_id', String)
    public obj_id: KnoraIRI = undefined;

    /**
     * X dimension of the preview representation
     * @param preview_nx: number
     */
    @JsonProperty('preview_nx', Number, true)
    public preview_nx: number = undefined;

    /**
     * Y dimension of the preview representation
     * @param preview_ny: number
     */
    @JsonProperty('preview_ny', Number, true)
    public preview_ny: number = undefined;

    /**
     * Path to a preview representation
     * @param preview_path: string
     */
    @JsonProperty('preview_path', String)
    public preview_path: string = undefined;

    /**
     * The user's permission on the retrieved resource
     * @param rights: KnoraRights
     */
    @JsonProperty('rights', Number, true)
    public rights: KnoraRights = undefined;

    /**
     * Values of the retrieved resource
     * @param value: Array<string>
     */
    @JsonProperty('value', [Any])
    public value: any[] = undefined;

    /**
     * Labels of the retrieved resource's values
     * @param valuelabel: Array<string>
     */
    @JsonProperty('valuelabel', [String])
    public valuelabel: string[] = undefined;

    /**
     * IRIs of the value types of the resource's values
     * @param valuetype_id: Array<KnoraIRI>
     */
    @JsonProperty('valuetype_id', [String])
    public valuetype_id: KnoraIRI[] = undefined;
}
