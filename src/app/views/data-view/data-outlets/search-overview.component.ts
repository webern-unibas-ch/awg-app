import { Component, OnInit } from '@angular/core';

import { RouterLinkButton } from '@awg-shared/router-link-button-group/router-link-button.model';

import { SideInfoService } from '@awg-core/services';

@Component({
    selector: 'awg-search-overview',
    templateUrl: './search-overview.component.html',
    styleUrls: ['./search-overview.component.css']
})
export class SearchOverviewComponent implements OnInit {
    searchButtonArray: RouterLinkButton[];

    constructor(private sideInfoService: SideInfoService) {}

    ngOnInit() {
        this.searchButtonArray = [
            new RouterLinkButton('/data/search', 'fulltext', 'Volltext-Suche', false),
            new RouterLinkButton('/data/search', 'timeline', 'Timeline', true),
            new RouterLinkButton('/data/search', 'bibliography', 'Bibliographie', true)
        ];
    }

    onButtonSelect(routerLinkButton: RouterLinkButton) {
        if (routerLinkButton && routerLinkButton instanceof RouterLinkButton) {
            this.updateSearchInfoTitle(routerLinkButton.label);
        } else {
            return;
        }
    }

    private updateSearchInfoTitle(title: string) {
        this.sideInfoService.updateSearchInfoTitle(title);
    }
}
