import { ResourceDetailHeader } from './resource-detail-header.model';
import { ResourceDetailProps } from './resource-detail-props.model';
import { ResourceDetailGroupedIncomingLinks } from './resource-detail-grouped-incoming-links';

export class ResourceDetail {
    header: ResourceDetailHeader;
    image: any[];
    props: ResourceDetailProps[];
    incoming: ResourceDetailGroupedIncomingLinks;
}
