import { ResourceDetail } from './resource-detail.model';
import { ResourceFullResponseJson } from '../../../shared/api-objects/index';

export class ResourceData {
    jsonConverted: ResourceDetail;
    jsonRaw: ResourceFullResponseJson;
    html: ResourceDetail;

    constructor(body: ResourceFullResponseJson, html: ResourceDetail) {

        // snapshot of raw json response
        this.jsonRaw = JSON.parse(JSON.stringify(body));

        // converted html data
        this.html = html;

        // snapshot of converted json response
        this.jsonConverted = JSON.parse(JSON.stringify(html))
    }
}
