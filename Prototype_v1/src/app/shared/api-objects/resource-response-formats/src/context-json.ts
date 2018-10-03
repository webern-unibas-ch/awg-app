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
import { KnoraIRI, LocationItemJson } from '@awg-shared/api-objects/basic-message-components';
import { ResinfoJson } from './resinfo-json';

/**
 * Represents the context of a resource
 * @used by ResourceContextResponseJson
 */
@JsonObject
export class ContextJson {

    /**
     * The IRI of the resource
     * @param canonical_res_id: KnoraIRI
     */
    @JsonProperty('canonical_res_id', String)
    public canonical_res_id: KnoraIRI = undefined;

    /**
     * Context code:
     *      0 for none,
     *      1 for is partOf (e.g. a page of a book),
     *      2 for isCompound (e.g. a book that has pages)
     * TODO: aliasing type as KnoraContextCode ??
     * @param context: number
     */
    @JsonProperty('context', Number)
    public context: number = undefined;

    /**
     * First properties of depending resources
     * (e.g. of pages of a book)
     * @param firstprop: Array<string> OPTIONAL
     */
    @JsonProperty('firstprop', [String], true)
    public firstprop: string = undefined;

    /**
     * Locations of depending resources
     * (e.g. representation of pages of a book)
     * @param locations: Array<Array<locationItem>> OPTIONAL
     */
    @JsonProperty('locations', [[LocationItemJson]], true)
    public locations: [LocationItemJson[]] = undefined;

    /**
     * The IRI of the parent resource
     * @param parent_res_id: KnoraIRI OPTIONAL
     */
    @JsonProperty('parent_res_id', String, true)
    public parent_res_id: KnoraIRI = undefined;

    /**
     * Resinfo of the parent resource
     * (if the requested resource is a dependent resource
     * like a page that belongs to a book)
     * @param parent_resinfo: resinfo OPTIONAL
     */
    @JsonProperty('parent_resinfo', ResinfoJson, true)
    public parent_resinfo: ResinfoJson = undefined;

    /**
     * Preview locations of depending resources
     * (e.g. representation of pages of a book)
     * @param preview: Array<locationItem> OPTIONAL
     */
    @JsonProperty('preview', [LocationItemJson], true)
    public preview: LocationItemJson[] = undefined;

    /**
     * Obsolete
     * @param region: Array<string | null> OPTIONAL
     */
    @JsonProperty('region', [String], true)
    public region: string[] = undefined;

    /**
     * IRIs of dependent resources
     * (e.g. pages of a book)
     * @param res_id: Array<KnoraIRI> OPTIONAL
     */
    @JsonProperty('res_id', [String], true)
    public res_id: KnoraIRI[] = undefined;

    /**
     * Obsolete
     * @param resclass_name: string OPTIONAL
     */
    @JsonProperty('resclass_name', String, true)
    public resclass_name: string = undefined;

    /**
     * Resinfo of the requested resource
     * (if requested: resinfo=true)
     * @param resinfo: resinfo OPTIONAL
     */
    @JsonProperty('resinfo', ResinfoJson, true)
    public resinfo: ResinfoJson = undefined;
}
