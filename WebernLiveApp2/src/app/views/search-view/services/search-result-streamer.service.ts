import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/combineLatest';

import { SearchResponseWithQuery } from '../models';


@Injectable()
export class SearchResultStreamerService {

    /*
     * ReplaySubjects that are used to stream the data
     */
    private bufferSize: number = 1;

    private searchResponseStreamSource = new ReplaySubject<SearchResponseWithQuery>(this.bufferSize);
    private searchResponseStream$ = this.searchResponseStreamSource.asObservable();


    /**********************************
     **
     **  request data
     **
     **********************************/
    public getSearchResponse(): Observable<SearchResponseWithQuery> {
        return this.searchResponseStream$;
    }


    /**********************************
     **
     **  request data
     **
     **********************************/
    public updateSearchResponseStream(results: SearchResponseWithQuery): void {
        this.searchResponseStreamSource.next(results);
        console.info('StreamerService# results: ', results);
    }


    /**********************************
     **
     **  reset data
     **
     **********************************/
    public clearSearchResults(): void {
        this.searchResponseStreamSource.next(undefined);
    }


}
