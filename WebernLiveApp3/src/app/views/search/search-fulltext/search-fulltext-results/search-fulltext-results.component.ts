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

export class SearchResultDataSource extends DataSource<any> {

    // Observable for data
    _dataChange: BehaviorSubject<SubjectItemJson[]> = new BehaviorSubject<SubjectItemJson[]>([]);
    get data(): SubjectItemJson[] { return this._dataChange.value; }

    // Observable for filter
    _filterChange = new BehaviorSubject('');
    get filter(): string { return this._filterChange.value; }
    set filter(filter: string) { this._filterChange.next(filter); }

    constructor(private _searchResults: SubjectItemJson[], private _paginator: MatPaginator, private _sort: MatSort) {
        super();
    }

    /**
     * Connect function called by the table to retrieve
     * one stream containing the data to render.
     **/
    connect(): Observable<SubjectItemJson[]> {
        // push searchResults into BehaviorSubject
        this._dataChange.next(this._searchResults);

        // Array for observed table data changes
        const displayDataChanges = [
            this._dataChange,
            this._filterChange,
            this._paginator.page,
            this._sort.sortChange,
        ];



        // Observable
        return Observable.merge(...displayDataChanges).map(() => {
            const data = this.data.slice();

            // Grab the page's slice of data.
            const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
            return data.splice(startIndex, this._paginator.pageSize);
        });
        /*
            return this.data.slice().filter((result: SubjectItemJson) => {
                let searchStr = (result.iconlabel + result.valuelabel[0] + result.value[0]).toLowerCase();
                return searchStr.indexOf(this.filter.toLowerCase()) != -1;
            });
        });

        */
    }

    disconnect() {}

    /** Returns a sorted copy of the database data. */
    getSortedData(): SubjectItemJson[] {
        const data = this.data.slice();
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

