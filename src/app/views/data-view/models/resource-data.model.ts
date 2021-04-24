import { ResourceDetail } from './resource-detail.model';

import { ResourceContextResponseJson, ResourceFullResponseJson } from '@awg-shared/api-objects/index';

/**
 * The IResourceDataResponse interface.
 *
 * It represents the interface array
 * for a resource data response
 * of a resource detail.
 */
export interface IResourceDataResponse extends Array<ResourceFullResponseJson | ResourceContextResponseJson> {
    /**
     * The ResourceFullResponseJson data of a resource detail.
     */
    0: ResourceFullResponseJson;

    /**
     * The ResourceContextResponseJson data of a resource detail.
     */
    1: ResourceContextResponseJson;
}

/**
 * The ResourceData class.
 *
 * It is used in the context of the resource detail view
 * to store the data for the resource data.
 */
export class ResourceData {
    /**
     * The json response of the html converted resource data.
     */
    jsonConverted: ResourceDetail;

    /**
     * The raw json response of the resource data.
     */
    jsonRaw: ResourceFullResponseJson;

    /**
     * The html converted resource data.
     */
    detail: ResourceDetail;

    /**
     * Constructor of the ResourceData class.
     *
     * It initializes the class with values
     * from a given ResourceFullResponseJson
     * and its html representation (resource detail).
     *
     * @param {ResourceFullResponseJson} resourceFullResponse The given ResourceFullResponseJson.
     * @param {ResourceDetail} detail The given resource detail.
     */
    constructor(resourceFullResponse: ResourceFullResponseJson, detail: ResourceDetail) {
        // Snapshot of raw json response
        this.jsonRaw = JSON.parse(JSON.stringify(resourceFullResponse));

        // Converted html data
        this.detail = detail;

        // Snapshot of json response from converted html data
        this.jsonConverted = JSON.parse(JSON.stringify(detail));
    }
}
