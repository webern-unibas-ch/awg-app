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
import { KnoraIRI } from '@awg-shared/api-objects/basic-message-components';

/**
 * Represents a vocabulary
 * @used by VocabularyResponseJson
 */
@JsonObject('VocabularyItemJson')
export class VocabularyItemJson {
    /**
     * Indicates if this is the vocabulary the user's project belongs to
     * @param active: Boolean
     */
    @JsonProperty('active', Boolean)
    public active: boolean = undefined;

    /**
     * Description of the vocbulary
     * @param description: string
     */
    @JsonProperty('description', String)
    public description: string = undefined;

    /**
     * The vocabulary's IRI
     * @param id: KnoraIRI
     */
    @JsonProperty('id', String)
    public id: KnoraIRI = undefined;

    /**
     * The vocabulary's long name
     * @param longname: string
     */
    @JsonProperty('longname', String)
    public longname: string = undefined;

    /**
     * The project the vocabulary belongs to
     * @param project_id: KnoraIRI
     */
    @JsonProperty('project_id', String)
    public project_id: KnoraIRI = undefined;

    /**
     * The vocabulary's short name
     * @param shortname: string
     */
    @JsonProperty('shortname', String)
    public shortname: string = undefined;

    /**
     * The vocabulary's IRI
     * @param uri: KnoraIRI
     */
    @JsonProperty('uri', String)
    public uri: KnoraIRI = undefined;
}
