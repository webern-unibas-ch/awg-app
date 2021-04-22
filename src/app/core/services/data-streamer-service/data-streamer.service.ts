import { Injectable } from '@angular/core';

import { Observable, ReplaySubject } from 'rxjs';

import { SearchResponseJson } from '@awg-shared/api-objects';
import { SearchResponseWithQuery } from '@awg-views/data-view/models';

/**
 * The DataStreamer service.
 *
 * It handles the provision of search responses with queries
 * and resource ids for the search components.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root'
})
export class DataStreamerService {
    /**
     * Private variable for the replay subject´s buffer size.
     */
    private _bufferSize = 1;

    /**
     * Private replay subject to handle search response with query.
     */
    private _searchResponseWithQuerySubject = new ReplaySubject<SearchResponseWithQuery>(this._bufferSize);

    /**
     * Private readonly search response with query stream as observable (`ReplaySubject`).
     */
    private readonly _searchResponseWithQueryStream$ = this._searchResponseWithQuerySubject.asObservable();

    /**
     * Private replay subject to handle resource id.
     */
    private _resourceIdSubject = new ReplaySubject<string>(this._bufferSize);

    /**
     * Private readonly resource id stream as observable (`ReplaySubject`).
     */
    private readonly _resourceIdStream$ = this._resourceIdSubject.asObservable();

    /**
     * Public method: getSearchResponseWithQuery.
     *
     * It provides the latest search response with query
     * from the search response with query stream.
     *
     * @returns {Observable<SearchResponseWithQuery>}
     * The search response with query stream as observable.
     */
    getSearchResponseWithQuery(): Observable<SearchResponseWithQuery> {
        return this._searchResponseWithQueryStream$;
    }

    /**
     * Public method: getResourceId.
     *
     * It provides the latest resource id from the resource id stream.
     *
     * @returns {Observable<string>} The resource id stream as observable.
     */
    getResourceId(): Observable<string> {
        return this._resourceIdStream$;
    }

    /**
     * Public method: updateSearchResponseWithQuery.
     *
     * It updates the search response with query stream
     * with the given searchResponseWithQuery.
     *
     * @returns {void} Sets the next search response with query to the stream.
     */
    updateSearchResponseWithQuery(searchResponseWithQuery: SearchResponseWithQuery): void {
        this._searchResponseWithQuerySubject.next(searchResponseWithQuery);
    }

    /**
     * Public method: updateResourceId.
     *
     * It updates the resource id stream with the given id.
     *
     * @returns {void} Sets the next resource id to the stream.
     */
    updateResourceId(id: string): void {
        this._resourceIdSubject.next(id);
    }

    /**
     * Public method: clearSearchResults.
     *
     * It clears the search results with query stream.
     *
     * @returns {void} Clears the search results with query stream.
     */
    clearSearchResults(): void {
        this._searchResponseWithQuerySubject.next(new SearchResponseWithQuery(new SearchResponseJson(), ''));
    }

    /**
     * Public method: clearResourceId.
     *
     * It clears the resource id stream.
     *
     * @returns {void} Clears the resource id stream.
     */
    clearResourceId(): void {
        this._resourceIdSubject.next('');
    }
}
