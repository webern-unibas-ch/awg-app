import { Component, OnInit } from '@angular/core';

import { RouterLinkButton } from '../../../shared/router-link-button-group/router-link-button.model';

import { SideInfoService } from '../../../core/services';


@Component({
    selector: 'awg-search-overview',
    templateUrl: './search-overview.component.html',
    styleUrls: ['./search-overview.component.css']
})
export class SearchOverviewComponent implements OnInit {

    buttonArray: RouterLinkButton[] = [
        {
            root: '/data/search',
            link: 'fulltext',
            label: 'Volltext-Suche',
            disabled: false
        },
        {
            root: '/data/search',
            link: 'timeline',
            label: 'Timeline',
            disabled: true
        },
        {
            root: '/data/search',
            link: 'bibliography',
            label: 'Bibliographie',
            disabled: true
        }
    ];

    constructor(private sideInfoService: SideInfoService) { }

    ngOnInit() {
    }

    onButtonSelect(title: string) {
        this.updateSearchInfoTitle(title);
    }

    private updateSearchInfoTitle(title: string) {
        this.sideInfoService.updateSearchInfoTitle(title);
    }

}
