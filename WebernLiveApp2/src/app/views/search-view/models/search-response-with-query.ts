import { SearchResponseJson } from '../../../shared/api-objects/index';

export class SearchResponseWithQuery {
    data: SearchResponseJson;
    query: string;

    constructor(data: SearchResponseJson, query: string) {
        this.data = data;
        this.query = query;
    }
}
