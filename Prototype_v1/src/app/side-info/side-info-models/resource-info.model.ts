import { CurrentResource, NextResource, PreviousResource, ResourceInfoResource } from './resource-info-resources.model';
import { ResourceInfoSearchResults } from './resource-info-search-results.model';

export class ResourceInfo {
    searchResults: ResourceInfoSearchResults;
    resources: {
        current: ResourceInfoResource;
        next: ResourceInfoResource;
        previous: ResourceInfoResource;
    };

}
