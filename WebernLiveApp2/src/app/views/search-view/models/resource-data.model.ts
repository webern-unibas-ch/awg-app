import { ResourceDetail } from './resource-detail.model';
import { ResourceFullResponseJson } from '../../../shared/api-objects';

export class ResourceData {
    jsonConverted: ResourceDetail;
    jsonRaw: ResourceFullResponseJson;
    html: ResourceDetail;
}
