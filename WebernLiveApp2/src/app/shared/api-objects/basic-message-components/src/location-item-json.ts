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
import { ProtocolOptions } from './basic-type-aliases';

/**
 * Binary representation of a resource (location)
 * @used by ContextJson, PropertyJson, ResinfoJson
 */
@JsonObject
export class LocationItemJson {

    /**
     * Duration of a movie or an audio file
     * @param duration: number
     */
    @JsonProperty('duration', Number)
    public duration: number = undefined;

    /**
     * Format of the binary representation
     * @format_name: string
     */
    @JsonProperty('format_name', String)
    public format_name: string = undefined;

    /**
     * Frames per second (movie)
     * @fps: number
     */
    @JsonProperty('fps', Number)
    public fps: number = undefined;

    /**
     * X dimension of an image representation
     * @param nx: number
     * TODO: compare thumb_max-json
     */
    @JsonProperty('nx', Number)
    public nx: number = undefined;

    /**
     * Y dimension of an image representation
     * @param ny: number
     */
    @JsonProperty('ny', Number)
    public ny: number = undefined;

    /**
     * Original file name of the binary representation
     * (before import to Knora)
     * @param origname: string
     */
    @JsonProperty('origname', String)
    public origname: string = undefined;

    /**
     * Path to the binary representation
     * @param path: string
     */
    @JsonProperty('path', String)
    public path: string = undefined;

    /**
     * Protocol used
     * @param protocol: protocolOptions
     */
    @JsonProperty('protocol', String)
    public protocol: ProtocolOptions = undefined;
}

