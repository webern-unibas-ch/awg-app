import { ResourceDetailHeader } from './resource-detail-header.model';
import { ResourceDetailContent } from './resource-detail-content.model';

/**
 * The ResourceDetail class.
 *
 * It is used in the context of the resource detail view
 * to store the data for a resource detail.
 */
export class ResourceDetail {
    /**
     * The header of the resource detail.
     */
    header: ResourceDetailHeader;

    /**
     * The content of the resource detail.
     */
    content: ResourceDetailContent;

    /**
     * Constructor of the ResourceDetail class.
     *
     * It initializes the class with values
     * from a given header and content.
     *
     * @param {ResourceDetailHeader} header The given header.
     * @param {ResourceDetailContent} content The given content.
     */
    constructor(header: ResourceDetailHeader, content: ResourceDetailContent) {
        this.header = header;
        this.content = content;
    }
}
