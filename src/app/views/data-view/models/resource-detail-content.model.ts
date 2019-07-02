import { ResourceDetailImage } from './resource-detail-image.model';
import { ResourceDetailGroupedIncomingLinks } from './resource-detail-grouped-incoming-links.model';
import { ResourceDetailProperty } from './resource-detail-property.model';

/**
 * The ResourceDetailContent class.
 *
 * It is used in the context of the resource detail view
 * to store the data for a resource detail content.
 */
export class ResourceDetailContent {
    /**
     * The properties of the resource content.
     */
    props: ResourceDetailProperty[];

    /**
     * The image of the resource content.
     */
    images: ResourceDetailImage[];

    /**
     * The grouped incoming links of the resource content.
     */
    incoming: ResourceDetailGroupedIncomingLinks;

    /**
     * @todo: use constructor to initialize class
     */
}
