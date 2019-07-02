import { ResourceInfoResource } from './resource-info-resources.model';
import { ResourceInfoSearchResults } from './resource-info-search-results.model';

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
    searchResults: ResourceInfoSearchResults;

    /**
     * The actually displayed resources.
     */
    resources: {
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
    };
}
