/**
 * Table with sorting, filtering and pagination functionality
 * Credits: Lakston, July 26, 2017, 13:15; https://stackoverflow.com/a/45328140
 * Plunkr: https://plnkr.co/edit/EU3BBlViWpPf2NJW4PXx?p=preview
 **/

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, PageEvent } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';


import { SearchResponseJson, SubjectItemJson } from '../../../../shared/api-objects';

@Component({
    selector: 'awg-search-fulltext-results',
    templateUrl: './search-fulltext-results.component.html',
    styleUrls: ['./search-fulltext-results.component.css']
})
export class SearchFulltextResultsComponent implements OnInit {
    @Input() searchData: SearchResponseJson;

    curId: string;
    resText: string;

    displayedColumns = ['checkBox', 'category', 'entry'];
    searchResultDatabase: SearchResultDatabase | null;
    searchResultDataSource: SearchResultDataSource | null;
    selection = new SelectionModel<string>(true, []);
    pageEvent: PageEvent;

    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    ref: SearchFulltextResultsComponent;

    constructor() {
        this.ref = this;
    }

    ngOnInit() {
        // shortcut
        const subjects = this.searchData.subjects;
        // alternative text
        this.resText = (subjects.length === 1) ? 'zugängliches Resultat von' : 'zugängliche Resultate von';
        // init dataSource for table
        this.searchResultDatabase = new SearchResultDatabase(subjects);
        this.searchResultDataSource = new SearchResultDataSource(this.searchResultDatabase, this.paginator, this.sort);
        // get filter from user input
        this.getFilter();
    }

    getFilter() {
        // Observable for table filter
        return Observable.fromEvent(this.filter.nativeElement, 'keyup')
            .debounceTime(150)
            .distinctUntilChanged()
            .subscribe(() => {
                if (!this.searchResultDataSource) { return; }
                return this.searchResultDataSource.filter = this.filter.nativeElement.value;
            });
    }

    isAllSelected(): boolean {
        if (!this.searchResultDataSource) { return false; }
        if (this.selection.isEmpty()) { return false; }

        if (this.filter.nativeElement.value) {
            return this.selection.selected.length == this.searchResultDataSource.renderedData.length;
        } else {
            return this.selection.selected.length == this.searchResultDatabase.data.length;
        }
    }

    masterToggle() {
        if (!this.searchResultDataSource) { return; }

        if (this.isAllSelected()) {
            console.log('is all selected: CLEAR');
            this.selection.clear();
        } else if (this.filter.nativeElement.value) {
            this.searchResultDataSource.renderedData.forEach(data => this.selection.select(data.obj_id));
        } else {
            this.searchResultDatabase.data.forEach(data => this.selection.select(data.obj_id));
        }
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


export class SearchResultDatabase {
    // Observable stream for data that emits whenever the data has been modified
    dataChange: BehaviorSubject<SubjectItemJson[]> = new BehaviorSubject<SubjectItemJson[]>([]);
    get data(): SubjectItemJson[] { return this.dataChange.value; }

    constructor(private _data: SubjectItemJson[]) {
        this.addData();
    }

    // push data into BehaviorSubject
    addData() {
        this.dataChange.next(this._data);
    }
}


export class SearchResultDataSource extends DataSource<any> {

    // Observable for filter
    _filterChange = new BehaviorSubject('');
    get filter(): string { return this._filterChange.value; }
    set filter(filter: string) { this._filterChange.next(filter); }

    filteredData: SubjectItemJson[] = [];
    renderedData: SubjectItemJson[] = [];

    constructor(private _searchResultDatabase: SearchResultDatabase,
                private _paginator: MatPaginator,
                private _sort: MatSort) {
        super();

        // reset paginator when filter changes
        this._filterChange.subscribe(() => { this._paginator.pageIndex = 0; });
    }

    /* Connect function called by the table to retrieve one stream containing the data to render */
    connect(): Observable<SubjectItemJson[]> {

        // Array for observed table data changes
        const displayDataChanges = [
            this._searchResultDatabase.dataChange,
            this._sort.sortChange,
            this._filterChange,
            this._paginator.page,
        ];

        // Observable with mapped table data
        return Observable.merge(...displayDataChanges).map(() => {
            // filter data
            this.filteredData = this.getFilteredData(this._searchResultDatabase.data);
            console.log('filteredData :', this.filteredData );
            console.log('filteredData.length:', this.filteredData.length);

            // sort filtered data
            const sortedData = this.getSortedData(this.filteredData);

            // grab the page's slice of the filtered sorted data
            this.renderedData = this.getPaginatedData(sortedData);
            console.log('renderedData:', this.renderedData);
            console.log('renderedData.length:', this.renderedData.length);
            console.log('pageChanges', this._paginator.page);

            return this.renderedData;
        });
    }

    disconnect() {}


    /** Returns a filtered copy of the database data */
    private getFilteredData(data: SubjectItemJson[]): SubjectItemJson[] {
        return data.slice().filter((result: SubjectItemJson) => {
            const searchStr = (result.iconlabel + result.valuelabel[0] + result.value[0]).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });
    }

    /** Returns a paginated copy of the database data */
    private getPaginatedData(data: SubjectItemJson[]): SubjectItemJson[] {
        // Grab the page's slice of data
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        return data.splice(startIndex, this._paginator.pageSize);
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
