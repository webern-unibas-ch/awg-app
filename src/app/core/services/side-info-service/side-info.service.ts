import { Injectable } from '@angular/core';

import { Subject, Observable, BehaviorSubject } from 'rxjs';

import { SearchInfo } from '@awg-side-info/side-info-models';

/**
 * The SideInfo service.
 *
 * It handles the provision of data and
 * titles for the side info components.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root'
})
export class SideInfoService {
    /**
     * Private subject to handle search info data.
     */
    private searchInfoDataSubject: Subject<SearchInfo> = new BehaviorSubject<SearchInfo>(new SearchInfo('---', '---'));

    /**
     * Readonly search info data stream as observable (`Subject`).
     */
    readonly searchInfoDataStream$ = this.searchInfoDataSubject.asObservable();

    /**
     * Private behavior subject to handle search info title.
     */
    private searchInfoTitleSubject: Subject<string> = new BehaviorSubject<string>('');

    /**
     * Readonly search info title stream as observable (`BehaviorSubject`).
     */
    readonly searchInfoTitleStream$ = this.searchInfoTitleSubject.asObservable();

    /**
     * Public method: getSearchInfoData.
     *
     * It provides the latest data from the search info data stream.
     *
     * @returns {Observable<SearchInfo>} The search info data stream as observable.
     */
    getSearchInfoData(): Observable<SearchInfo> {
        return this.searchInfoDataStream$;
    }

    /**
     * Public method: getSearchInfoTitle.
     *
     * It provides the latest title from the search info title stream.
     *
     * @returns {Observable<string>} The search info title stream as observable.
     */
    getSearchInfoTitle(): Observable<string> {
        return this.searchInfoTitleStream$;
    }

    /**
     * Public method: updateSearchInfoData.
     *
     * It updates the side info data stream with the given data (`searchInfo`).
     *
     * @returns {void} Sets the next searchInfo to the side info data stream.
     */
    updateSearchInfoData(searchInfo: SearchInfo): void {
        this.searchInfoDataSubject.next(searchInfo);
    }

    /**
     * Public method: updateSearchInfoTitle.
     *
     * It updates the search info title stream with the given title.
     *
     * @returns {void} Sets the next title to the search info title stream.
     */
    updateSearchInfoTitle(title: string): void {
        this.searchInfoTitleSubject.next(title);
    }

    /**
     * Public method: clearSearchInfoData.
     *
     * It clears the search info data stream.
     *
     * @returns {void} Clears the search info data stream.
     */
    clearSearchInfoData(): void {
        this.searchInfoDataSubject.next(undefined);
    }

    /**
     * Public method: clearSearchInfoTitle.
     *
     * It clears the search info title stream.
     *
     * @returns {void} Clears the search info title stream.
     */
    clearSearchInfoTitle(): void {
        this.searchInfoTitleSubject.next('');
    }
}
