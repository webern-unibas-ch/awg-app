import { ResourceDetailHeader } from './resource-detail-header.model';
import { ResourceDetailProps } from './resource-detail-props.model';
import { ResourceDetailIncomingLinks } from './resource-detail-incoming-links.model';

export class ResourceDetail {
    header: ResourceDetailHeader;
    image: any[];
    props: ResourceDetailProps[];
    incoming: ResourceDetailIncomingLinks[];
}
