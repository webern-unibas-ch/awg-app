import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/combineLatest';

import { SearchResponseWithQuery } from '../models';


@Injectable()
export class SearchResultStreamerService {

    /**************************************************
     * ReplaySubjects that are used to stream the data
     **************************************************/
    private bufferSize: number = 1;

    private searchResponseStreamSource = new ReplaySubject<SearchResponseWithQuery>(this.bufferSize);
    private searchResponseStream$ = this.searchResponseStreamSource.asObservable();

    private currentResourceIdStreamSource = new ReplaySubject<string>(this.bufferSize);
    private currentResourceIdStream$ = this.currentResourceIdStreamSource.asObservable();


    /****************
     *  request data
     ****************/
    public getCurrentSearchResults(): Observable<SearchResponseWithQuery> {
        return this.searchResponseStream$;
    }

    public getCurrentResourceId(): Observable<string> {
        return this.currentResourceIdStream$;
    }


    /***************
     *  update data
     ***************/
    public updateSearchResponseStream(results: SearchResponseWithQuery): void {
        this.searchResponseStreamSource.next(results);
    }

    public updateCurrentResourceIdStream(id: string): void {
        this.currentResourceIdStreamSource.next(id);
    }

    /**************
     *  reset data
     **************/
    public clearSearchResults(): void {
        this.searchResponseStreamSource.next(undefined);
    }

    public clearResourceId(): void {
        this.currentResourceIdStreamSource.next('');
    }


}
