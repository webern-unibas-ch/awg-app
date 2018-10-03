import { SearchResponseJson } from '@awg-shared/api-objects';

export class SearchResponseWithQuery {
    data: SearchResponseJson;
    query: string;

    constructor(data: SearchResponseJson, query: string) {
        this.data = data;
        this.query = query;
    }
}
