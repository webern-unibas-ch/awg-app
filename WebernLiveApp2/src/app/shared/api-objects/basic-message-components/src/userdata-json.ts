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
import { ProjectItemJson } from './project-item-json';

/**
 * Represents the current user's data
 * @used by BasicResponseJson
 */
@JsonObject
export class UserdataJson {

    /*
     * User's active project
     * @param active_project: string | null
     */
    @JsonProperty('active_project', null)
    public active_project: string = undefined;

    /**
     * User's email adress
     * @param email: string | null
     */
    @JsonProperty('email', null)
    public email: string = null;

    /**
     * User's first name
     * @param firstname: string | null
     */
    @JsonProperty('firstname', null)
    public firstname: string = undefined;

    /**
     * User's preferred language
     * @param lang: string
     */
    @JsonProperty('lang', String)
    public lang: string = undefined;

    /**
     * User's last name
     * @param lastname: string | null
     */
    @JsonProperty('lastname', null)
    public lastname: string = undefined;

    /**
     * obsolete
     * @param password: string | null
     */
    @JsonProperty('password', null)
    public password: string = undefined;

    /**
     * List of project IRIs the user is member of
     * @param projects: Array<string> | null
     */
    /*
    @JsonProperty('projects', null)
    public projects: string[] = undefined;
    */

    /*
     * List of project descriptions the user is member of
     * @param projects: Array<projectItem> | null
     * TODO
     */
    /*
    @JsonProperty('projects_info', [ProjectItemJson])
    public projects_info: ProjectItemJson[] = undefined;
    */

    /**
     * Session token
     * @param token: string | null
     */
    @JsonProperty('token', null)
    public token: string = undefined;

    /**
     * User's IRI
     * @param user_id: string | null
     */
    @JsonProperty('user_id', null)
    public user_id: string = undefined;

    /**
     * User's unique name
     * @param username: string | null
     */
    /*
    @JsonProperty('username', null)
    public username: string = null;
    */

}
