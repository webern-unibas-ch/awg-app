import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';


import { SearchResponseJson } from '../../../../shared/api-objects';

@Component({
    selector: 'awg-search-fulltext-results',
    templateUrl: './search-fulltext-results.component.html',
    styleUrls: ['./search-fulltext-results.component.css']
})
export class SearchFulltextResultsComponent implements OnInit {
    @Input() searchData: SearchResponseJson;

    displayedColumns = ['category', 'entry'];
    dataSource: ExampleDataSource;

    curId: string;
    resText: string;

    // @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor() { }

    ngOnInit() {
        let subjects = this.searchData.subjects;
        console.log('length results: ', subjects.length);
        console.log('results: ', subjects);
        this.resText = (subjects.length === 1) ? 'zugängliches Resultat von' : 'zugängliche Resultate von';
        this.dataSource = new ExampleDataSource(subjects);
    }

    activeObject(id: string){
        return this.curId === id;
    };

    showObject(id: string){
        this.curId = id;
        // TODO: remove
        console.info('SearchResults#showObject: called id: ', id);
    }

}

export class ExampleDataSource extends DataSource<any> {

    constructor(private subjects: any) {
        super();
        console.log('subjectsDataSource: ', subjects);
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]> {
        console.log('subjectsObserv: ', this.subjects);
        return Observable.of(this.subjects);
    }

    disconnect() {}
}

