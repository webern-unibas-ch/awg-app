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
 * Represents the current user's data
 * @used by BasicResponseJson
 */
@JsonObject('UserDataJson')
export class UserDataJson {
    /**
     * Email of a user
     * @param email: string | null
     */
    @JsonProperty('email', String, true)
    public email: string = undefined;

    /**
     * First name of a user
     * @param givenName: string | null
     */
    @JsonProperty('firstname', String, true)
    public givenName: string = undefined;

    /**
     * Last name of a user
     * @param familyName: string | null
     */
    @JsonProperty('lastname', String, true)
    public familyName: string = undefined;

    /**
     * Default language for a user
     * @param lang: string | null
     */
    @JsonProperty('lang', String, true)
    public lang: string = undefined;

    /**
     * Password of a user
     * @param password: string | null
     */
    @JsonProperty('password', String, true)
    public password: string = undefined;

    /**
     * Status of a user
     * @param status: boolean | null
     */
    @JsonProperty('status', Boolean, true)
    public status: boolean = undefined;

    /**
     * Token for a user
     * @param token: string | null
     */
    @JsonProperty('token', String, true)
    public token: string = undefined;

    /**
     * Id of a user
     * @param user_id: string | null
     */
    @JsonProperty('user_id', String, true)
    public user_id: string = undefined;
}
