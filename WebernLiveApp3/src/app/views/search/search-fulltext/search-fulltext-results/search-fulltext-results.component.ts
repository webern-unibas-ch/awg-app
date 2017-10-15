import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';


import { SearchResponseJson, SubjectItemJson } from '../../../../shared/api-objects';

@Component({
    selector: 'awg-search-fulltext-results',
    templateUrl: './search-fulltext-results.component.html',
    styleUrls: ['./search-fulltext-results.component.css']
})
export class SearchFulltextResultsComponent implements OnInit {
    @Input() searchData: SearchResponseJson;

    displayedColumns = ['category', 'entry'];
    searchResultDataSource: SearchResultDataSource;

    curId: string;
    resText: string;

    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    ref: SearchFulltextResultsComponent;

    constructor() {
        this.ref = this;
    }

    ngOnInit() {
        // shortcut
        let subjects = this.searchData.subjects;
        // alternative text
        this.resText = (subjects.length === 1) ? 'zugängliches Resultat von' : 'zugängliche Resultate von';
        // init dataSource for table
        this.searchResultDataSource = new SearchResultDataSource(subjects, this.paginator, this.sort);
        // Observable for table filter
        Observable.fromEvent(this.filter.nativeElement, 'keyup')
            .debounceTime(150)
            .distinctUntilChanged()
            .subscribe(() => {
                if (!this.searchResultDataSource) { return; }
                this.searchResultDataSource.filter = this.filter.nativeElement.value;
            });
    }

    activeObject(id: string) {
        return this.curId === id;
    };

    showObject(id: string) {
        this.curId = id;
        // TODO: remove
        console.info('SearchResults#showObject: called id: ', id);
    }

}

/**
 *
 * Table with sorting, filtering and pagination functionality
 * Credits: Lakston, July 26, 2017, 13:15; https://stackoverflow.com/a/45328140
 * Plunkr: https://plnkr.co/edit/EU3BBlViWpPf2NJW4PXx?p=preview
 *
 **/
export class SearchResultDataSource extends DataSource<any> {

    // Observable for data
    _dataChange: BehaviorSubject<SubjectItemJson[]> = new BehaviorSubject<SubjectItemJson[]>([]);
    get data(): SubjectItemJson[] { return this._dataChange.value; }

    // Observable for filter
    _filterChange = new BehaviorSubject('');
    get filter(): string { return this._filterChange.value; }
    set filter(filter: string) { this._filterChange.next(filter); }

    filteredData: SubjectItemJson[] = [];
    renderedData: SubjectItemJson[] = [];

    constructor(private _searchResults: SubjectItemJson[],
                private _paginator: MatPaginator,
                private _sort: MatSort) {
        super();
        // reset paginator when filter changes
        // TODO: get correct array length in _paginator.length
        this._filterChange.subscribe(() => {
            console.log('lengthData', this.filteredData.length);
            this._paginator.pageIndex = 0;
            // this._paginator.length = this.data.length;
        });
        this._dataChange.next(this._searchResults);
    }

    /* Connect function called by the table to retrieve one stream containing the data to render */
    connect(): Observable<SubjectItemJson[]> {
        // push searchResults into BehaviorSubject
        // this._dataChange.next(this._searchResults);

        // Array for observed table data changes
        const displayDataChanges = [
            this._dataChange,
            this._filterChange,
            this._paginator.page,
            this._sort.sortChange,
        ];

        // Observable with mapped table data
        return Observable.merge(...displayDataChanges).map(() => {
            // filter data
            this.filteredData = this.getFilteredData(this.data);

            // sort filtered data
            const sortedData = this.getSortedData(this.filteredData);
            console.log('sortedData:', sortedData);

            // grab the page's slice of the filtered sorted data
            this.renderedData = this.getPaginatedData(sortedData);
            console.log('pageLength:', this._paginator.length);
            console.log('renderedData:', this.renderedData);

            return this.renderedData;
        });
    }

    disconnect() {}

    /** Returns a paginated copy of the database data */
    private getPaginatedData(data: SubjectItemJson[]): SubjectItemJson[] {
        // Grab the page's slice of data
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        return data.splice(startIndex, this._paginator.pageSize);
    }

    /** Returns a filtered copy of the database data */
    private getFilteredData(data: SubjectItemJson[]): SubjectItemJson[] {
        return data.slice().filter((result: SubjectItemJson) => {
            let searchStr = (result.iconlabel + result.valuelabel[0] + result.value[0]).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) != -1;
        });
    }

    /** Returns a sorted copy of the database data */
    private getSortedData(data: SubjectItemJson[]): SubjectItemJson[] {
        if (!this._sort.active || this._sort.direction == '') { return data; }

        return data.sort((a, b) => {
            let propertyA: number|string = '';
            let propertyB: number|string = '';

            switch (this._sort.active) {
                case 'category': [propertyA, propertyB] = [a.iconlabel, b.iconlabel]; break;
                case 'entry': [propertyA, propertyB] = [a.valuelabel[0], b.valuelabel[0]]; break;
            }

            let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
        });
    }
}

