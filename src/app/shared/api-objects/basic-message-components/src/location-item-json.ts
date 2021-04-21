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
import { ProtocolOptions, StringOrNumber } from './basic-type-aliases';

/**
 * Binary representation of a resource (location)
 * @used by ContextJson, PropertyJson, ResinfoJson
 */
@JsonObject('LocationItemJson')
export class LocationItemJson {
    /**
     * Duration of a movie or an audio file
     * @param duration: number | string
     */
    @JsonProperty('duration', Any)
    public duration: StringOrNumber = undefined;

    /**
     * Format of the binary representation
     * @format_name: string
     */
    @JsonProperty('format_name', String)
    public format_name: string = undefined;

    /**
     * Frames per second (movie)
     * @fps: number | string
     */
    @JsonProperty('fps', Any)
    public fps: StringOrNumber = undefined;

    /**
     * X dimension of an image representation
     * @param nx: number | string
     * TODO: compare thumb_max-json
     */
    @JsonProperty('nx', Any)
    public nx: StringOrNumber = undefined;

    /**
     * Y dimension of an image representation
     * @param ny: number | string
     */
    @JsonProperty('ny', Any)
    public ny: StringOrNumber = undefined;

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
