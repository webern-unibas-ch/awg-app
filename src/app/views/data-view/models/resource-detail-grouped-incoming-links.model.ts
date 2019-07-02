import { ResourceDetailIncomingLink } from './resource-detail-incoming-link.model';

/**
 * The ResourceDetailGroupedIncomingLinks class.
 *
 * It is used in the context of the resource detail view
 * to store the data for incoming links.
 */
export class ResourceDetailGroupedIncomingLinks {
    [key: string]: ResourceDetailIncomingLink[];
}
