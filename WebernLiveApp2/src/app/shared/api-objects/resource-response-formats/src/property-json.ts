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

import { Any, JsonConvert, JsonObject, JsonProperty} from 'json2typescript';
import { KnoraIRI, KnoraRights, LocationItemJson, StringOrNumber } from '../../basic-message-components';


@JsonObject
export class PropertyJsonValue {
    @JsonProperty('utf8str', String)
    public utf8str: string = undefined;

    @JsonProperty('textattr', String)
    public textattr: string = undefined;

    @JsonProperty('resource_reference', [String])
    public resource_reference: string[] = undefined;
}


/**
 * Represents a property (parallel arrays)
 * @used by ResourceFullResponseJson
 */
@JsonObject
export class PropertyJson {

    /**
     * HTML attributes for the GUI element used to render this property
     * @param attributes: string | null
     */
    @JsonProperty('attributes', String, true)
    public attributes: string = undefined;

    /**
     * Comments on the property's values
     * @param comments: Array<string | number | null> OPTIONAL
     */
    @JsonProperty('comments', [Any], true)
    public comments: StringOrNumber[] = null;

    /**
     * The type of GUI element used to render this property
     * @param guielement: string | null
     */
    @JsonProperty('guielement', String, true)
    public guielement: string = undefined;

    /**
     * Order of property type in GUI
     * @param guiorder: number | null
     */
    @JsonProperty('guiorder', Number, true)
    public guiorder: number = undefined;

    /**
     * Obsolete
     * @param is_annotation: string
     */
    @JsonProperty('is_annotation', Any)
    public is_annotation: StringOrNumber = undefined;

    /**
     * The label of this property type
     * (null if the property is locations)
     * @param label: string | null
     */
    @JsonProperty('label', String, true)
    public label: string = undefined;

    /**
     * List of binary representations
     * attached to the requested resource
     * (when doing a full resource request)
     * @param locations: Array<locationItem> OPTIONAL
     */
    @JsonProperty('locations', [LocationItemJson], true)
    public locations: LocationItemJson[] = undefined;

    /**
     * The cardinality of this property type
     * for the given resource class
     * (null if the property is locations)
     * @param occurence: string | null
     */
    @JsonProperty('occurrence', String, true)
    public occurrence: string = undefined;

    /**
     * The IRI of the property type
     * @param pid: KnoraIRI
     */
    @JsonProperty('pid', String, true)
    public pid: KnoraIRI = undefined;

    /**
     * Obsolete
     * @param regular_property: number
     */
    @JsonProperty('regular_property', Number, true)
    public regular_property: number = undefined;

    /**
     * If the property's value is another resource,
     * contains the rdfs:label of each resource referred to.
     * @param value_firstprops: Array<string | null> OPTIONAL
     */
    @JsonProperty('value_firstprops', [String], true)
    public value_firstprops: string[] = undefined;

    /**
     * If the property's value is another resource,
     * contains the icon representing the OWL class
     * of each resource referred to.
     * @param value_iconsrcs: Array<string | null> OPTIONAL
     */
    @JsonProperty('value_iconsrcs', [String], true)
    public value_iconsrcs: string[] = undefined;

    /**
     * The IRIs of the value objects representing
     * the property's values for this resource
     * @param value_ids: Array<KnoraIRI> OPTIONAL
     */
    @JsonProperty('value_ids', [String], true)
    public value_ids: KnoraIRI[] = undefined;

    /**
     * If the property's value is another resource,
     * contains the rdfs:label of the OWL class
     * of each resource referred to.
     * @param value_restype: Array<string | null> OPTIONAL
     */
    @JsonProperty('value_restype', [String], true)
    public value_restype: string[] = undefined;

    /**
     * The given user's permissions on the value objects.
     * @param value_rights: Array<KnoraRights> OPTIONAL
     */
    @JsonProperty('value_rights', [Any], true)
    public value_rights: KnoraRights[] = undefined;

    /**
     * The property's values
     * @param values: Array<KnoraValues> OPTIONAL
     * TODO
     */
    @JsonProperty('values', Any, true)
    public values: any = undefined;

    /**
     * The type of this property's values
     * @param valuetype_id: string
     */
    @JsonProperty('valuetype_id', String)
    public valuetype_id: string = undefined;


    public getValuesAsPropertyJsonValues(): PropertyJsonValue[] {
        try {
            let jsonConvert: JsonConvert = new JsonConvert();
            return jsonConvert.deserializeArray(this.values, PropertyJsonValue);
        } catch (e) {
            return [];
        }
    }
    public getValuesAsStrings(): string[] {
        try {
            let jsonConvert: JsonConvert = new JsonConvert();
            return jsonConvert.deserializeArray(this.values, String);
        } catch (e) {
            return [];
        }
    }
    public getValuesAsNumbers(): number[] {
        try {
            let jsonConvert: JsonConvert = new JsonConvert();
            return jsonConvert.deserializeArray(this.values, Number);
        } catch (e) {
            return [];
        }
    }

}
