import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SearchResponseJson } from '../../../../../shared/api-objects';


@Component({
    selector: 'awg-search-result-list',
    templateUrl: './search-result-list.component.html',
    styleUrls: ['./search-result-list.component.css']
})
export class SearchResultListComponent implements OnInit {
    @Input() searchData: SearchResponseJson;

    public curId: string;
    public resText: string;

    ref: SearchResultListComponent;

    constructor(
        private router: Router
    ) {
        this.ref = this;
    }

    ngOnInit() {
        this.resText = (this.searchData.subjects.length === 1) ? 'zugängliches Resultat von' : 'zugängliche Resultate von';
    }

    activeDetail(id: string) {
        return this.curId === id;
    }

    showDetail(id: string) {
        this.curId = id;
        this.router.navigate(['/search/detail', this.curId]);
    }

}
