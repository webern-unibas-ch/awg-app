import { ResourceDetailImage } from './resource-detail-image.model';
import { ResourceDetailGroupedIncomingLinks } from './resource-detail-grouped-incoming-links';
import { ResourceDetailProps } from './resource-detail-props.model';

export class ResourceDetailContent {
    props: ResourceDetailProps[];
    images: ResourceDetailImage[];
    incoming: ResourceDetailGroupedIncomingLinks;
}
