import { ResourceDetailImage } from './resource-detail-image.model';
import { ResourceDetailGroupedIncomingLinks } from './resource-detail-grouped-incoming-links.model';
import { ResourceDetailProperty } from './resource-detail-property.model';
import { NgxGalleryImage } from '@kolkov/ngx-gallery';

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
     * The images of the resource content.
     */
    images: NgxGalleryImage[];

    /**
     * The grouped incoming links of the resource content.
     */
    incoming: ResourceDetailGroupedIncomingLinks[];

    /**
     * Constructor of the ResourceDetailContent class.
     *
     * It initializes the class with values from
     * given properties, images and grouped incoming links.
     *
     * @param {ResourceDetailProperty[]} props The given resource detail properties array.
     * @param {NgxGalleryImage[]} images The given resource detail image array.
     * @param {ResourceDetailGroupedIncomingLinks[]} incoming
     * The given resource detail grouped incoming links array.
     */
    constructor(
        props: ResourceDetailProperty[],
        images: NgxGalleryImage[],
        incoming: ResourceDetailGroupedIncomingLinks[]
    ) {
        this.props = props;
        this.images = images;
        this.incoming = incoming;
    }
}
