import { ResourceInfoResource } from './resource-info-resources.model';
import { SearchResponseWithQuery } from '@awg-views/data-view/models';

/**
 * The ResourceInfo class.
 *
 * It is used in the context of the resource info
 * to store the data of the search results.
 */
export class ResourceInfo {
    /**
     * The list of results of a search.
     */
    searchResults: SearchResponseWithQuery;

    /**
     * The actually displayed resources.
     */
    resources: IResourceInfoResources;
}

export interface IResourceInfoResources {
    /**
     * The current resource.
     */
    current: ResourceInfoResource;

    /**
     * The next resource.
     */
    next: ResourceInfoResource;

    /**
     * The previous resource.
     */
    previous: ResourceInfoResource;
}
