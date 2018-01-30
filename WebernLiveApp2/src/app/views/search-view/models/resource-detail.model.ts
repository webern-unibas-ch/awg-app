import { ResourceDetailHeader } from './resource-detail-header.model';
import { ResourceDetailContent } from './resource-detail-content.model';

export class ResourceDetail {
    header: ResourceDetailHeader;
    content: ResourceDetailContent;

    constructor(header: ResourceDetailHeader, content: ResourceDetailContent) {
        this.header = header;
        this.content = content;
    }
}
