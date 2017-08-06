import { Component, OnInit } from '@angular/core';

import { RouterLinkButton } from '../../../shared/router-link-button-group/router-link-button.model';

import { SearchService } from '../services/search.service';

@Component({
    selector: 'awg-search-overview',
    templateUrl: './search-overview.component.html',
    styleUrls: ['./search-overview.component.css']
})
export class SearchOverviewComponent implements OnInit {

    public buttonArray: RouterLinkButton[] = [
        {
            root: '/search',
            link: 'fulltext',
            label: 'Volltext-Suche'
        },
        {
            root: '/search',
            link: 'timeline',
            label: 'Timeline'
        },
        {
            root: '/search',
            link: 'bibliography',
            label: 'Bibliographie'
        }
    ];

    constructor(private searchService: SearchService) { }

    ngOnInit() {
    }

    onButtonSelect(event: RouterLinkButton) {
        //  console.log('event: ', event);
        this.searchService.shareSideInfoData(event);
    }

}
