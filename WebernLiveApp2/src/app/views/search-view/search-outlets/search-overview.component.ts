import { Component, OnInit } from '@angular/core';

import { RouterLinkButton } from '../../../shared/router-link-button-group/router-link-button.model';

import { SideInfoService } from '../../../side-info/side-info-services/side-info.service';

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
            label: 'Volltext-Suche',
            disabled: false
        },
        {
            root: '/search',
            link: 'timeline',
            label: 'Timeline',
            disabled: true
        },
        {
            root: '/search',
            link: 'bibliography',
            label: 'Bibliographie',
            disabled: false
        }
    ];

    constructor(private sideInfoService: SideInfoService) { }

    ngOnInit() {
    }

    onButtonSelect(event: string) {
        this.sideInfoService.shareSearchInfoTitle(event);
    }

}
