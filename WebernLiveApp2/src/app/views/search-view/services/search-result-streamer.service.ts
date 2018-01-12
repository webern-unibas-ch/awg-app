import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/combineLatest';

import { SearchResponseJson } from '../../../shared/api-objects';


@Injectable()
export class SearchResultStreamerService {

    /*
     * ReplaySubjects that are used to stream the data
     */
    bufferSize: number = 5;
    private queryStreamSource = new ReplaySubject<string>(this.bufferSize);
    private searchResultStreamSource = new ReplaySubject<SearchResponseJson>(this.bufferSize);

    private queryStream$ = this.queryStreamSource.asObservable();
    private searchResultStream$ = this.searchResultStreamSource.asObservable();


    /*
     * SEARCHRESULTS
     */
    public getSearchResults(): Observable<SearchResponseJson> {
        return this.searchResultStream$;
    }

    public updateSearchResultStream(results: SearchResponseJson): void {
        this.searchResultStreamSource.next(results);
        console.info('StreamerService# results: ', results);
    }

    public clearSearchResults(): void {
        this.searchResultStreamSource.next(undefined);
    }


    /*
     * QUERY
     */
    public getQuery(): Observable<string> {
        return this.queryStream$;
    }

    public updateQuery(query) {
        console.info('StreamerService# query: ', query);
        this.queryStreamSource.next(query);
    }

    public clearQuery(): void {
        this.queryStreamSource.next('');
    }


}
