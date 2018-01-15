import { SearchResponseJson } from '../../../shared/api-objects/index';

export class SearchResponseWithQuery {
    query: string;
    data: SearchResponseJson;
}
