/**
 *
 *              ResourceDetailModels
 *
 * This file exports models that are used
 * for the resource detail view.
 *
 */

import { ResourceData, IResourceDataResponse } from './resource-data.model';
import { ResourceDetail } from './resource-detail.model';
import { ResourceDetailContent } from './resource-detail-content.model';
import { ResourceDetailHeader } from './resource-detail-header.model';
import { ResourceDetailImage } from './resource-detail-image.model';
import { ResourceDetailIncomingLink } from './resource-detail-incoming-link.model';
import { ResourceDetailProperty } from './resource-detail-property.model';
import { ResourceDetailGroupedIncomingLinks } from './resource-detail-grouped-incoming-links.model';
import { ExtendedSearchParams, SearchQuery, SearchParams, SearchResultsViewTypes } from './search-params.model';
import { SearchResponseWithQuery } from './search-response-with-query.model';
import { SearchCompop, SEARCH_COMPOP_SETS_LIST } from './search-compop.model';
import { VALUETYPE_LIST } from './value-type.model';

export {
    ExtendedSearchParams,
    IResourceDataResponse,
    ResourceData,
    ResourceDetail,
    ResourceDetailContent,
    ResourceDetailHeader,
    ResourceDetailImage,
    ResourceDetailIncomingLink,
    ResourceDetailProperty,
    ResourceDetailGroupedIncomingLinks,
    SearchQuery,
    SearchParams,
    SearchResultsViewTypes,
    SearchResponseWithQuery,
    SearchCompop,
    SEARCH_COMPOP_SETS_LIST,
    VALUETYPE_LIST,
};
