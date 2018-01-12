import { ResourceDetail } from './resource-detail.model';
import { ResourceFullResponseJson } from '../../../shared/api-objects/index';

export class ResourceData {
    jsonConverted: ResourceDetail;
    jsonRaw: ResourceFullResponseJson;
    html: ResourceDetail;
}
