import { ResourceDetail } from './resource-detail.model';
import { ResourceFullResponseJson } from '@awg-shared/api-objects/index';

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
    html: ResourceDetail;

    /**
     * Constructor of the ResourceData class.
     *
     * It initializes the class with values
     * from a given ResourceFullResponseJson
     * and its html representation (resource detail).
     *
     * @param {ResourceFullResponseJson} body The given ResourceFullResponseJson.
     * @param {ResourceDetail} html The given resource detail html.
     */
    constructor(body: ResourceFullResponseJson, html: ResourceDetail) {
        // snapshot of raw json response
        this.jsonRaw = JSON.parse(JSON.stringify(body));

        // converted html data
        this.html = html;

        // snapshot of json response from converted html data
        this.jsonConverted = JSON.parse(JSON.stringify(html));
    }
}
