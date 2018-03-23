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
    @Input() searchResultText: string;

    currentId: string;

    constructor(
        private router: Router
    ) { }

    ngOnInit() {

    }

    isActiveResource(id: string) {
        return this.currentId === id;
    }

    navigateToResource(id: string) {
        this.currentId = id;
        this.router.navigate(['/data/resource', this.currentId]);
    }

}
