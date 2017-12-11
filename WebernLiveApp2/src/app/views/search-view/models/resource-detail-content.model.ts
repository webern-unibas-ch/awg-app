import { ResourceDetailGroupedIncomingLinks } from './resource-detail-grouped-incoming-links';
import { ResourceDetailProps } from './resource-detail-props.model';

export class ResourceDetailContent {
    props: ResourceDetailProps[];
    image: any[];
    incoming: ResourceDetailGroupedIncomingLinks;
}
