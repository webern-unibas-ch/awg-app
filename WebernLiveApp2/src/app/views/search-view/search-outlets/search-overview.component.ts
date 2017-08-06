import { Component, OnInit } from '@angular/core';

import { RouterLinkButton } from '../../../shared/router-link-button-group/router-link-button.model';

import { SideInfoService } from '../../../side-info/services/side-info.service';

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

    constructor(private sideInfoService: SideInfoService) { }

    ngOnInit() {
    }

    onButtonSelect(event: RouterLinkButton) {
        this.sideInfoService.shareSideInfoData(event);
    }

}
