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
import { BasicResponseJson, ProjectItemJson } from '@awg-shared/api-objects/basic-message-components';

/**
 * Represents a knora project
 *
 * HTTP GET to http://host/v1/projects/projectIRI
 *
 */

@JsonObject
export class ProjectJson extends BasicResponseJson {
    /**
     * List of search project items
     * @param projects: Array<projectItem>
     */
    @JsonProperty('project_info', ProjectItemJson)
    public project_info: ProjectItemJson = undefined;
}
