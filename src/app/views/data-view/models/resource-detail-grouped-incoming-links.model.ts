import { ResourceDetailIncomingLink } from './resource-detail-incoming-link.model';

/**
 * The ResourceDetailGroupedIncomingLinks class.
 *
 * It is used in the context of the resource detail view
 * to store and group arrays of resource detail incoming links.
 */
export class ResourceDetailGroupedIncomingLinks {
    /**
     * The label of the resource type to be grouped.
     */
    restypeLabel: string;

    /**
     * The array of incoming links.
     */
    links: ResourceDetailIncomingLink[];
}
