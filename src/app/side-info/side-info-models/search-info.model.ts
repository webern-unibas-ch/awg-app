export class SearchInfo {
    query: string;
    nhits: string;

    constructor(query: string, nhits: string) {
        this.query = query;
        this.nhits = nhits;
    }
}
