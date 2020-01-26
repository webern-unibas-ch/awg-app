import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouterLinkButton } from '@awg-shared/router-link-button-group/router-link-button.model';
import { SideInfoService } from '@awg-core/services';

/**
 * The SearchOverview component.
 *
 * It contains the overview section
 * of the data (search) view of the app
 * with a {@link RouterLinkButtonGroupComponent} and
 * another router outlet for the data (search) routes.
 */
@Component({
    selector: 'awg-search-overview',
    templateUrl: './search-overview.component.html',
    styleUrls: ['./search-overview.component.css']
})
export class SearchOverviewComponent implements OnInit {
    /**
     * Public variable: searchButtonArray.
     *
     * It keeps the array for the search router link buttons.
     */
    searchButtonArray: RouterLinkButton[] = [
        new RouterLinkButton('/data/search', 'fulltext', 'Volltext-Suche', false),
        new RouterLinkButton('/data/search', 'timeline', 'Timeline', true),
        new RouterLinkButton('/data/search', 'bibliography', 'Bibliographie', true)
    ];

    /**
     * Constructor of the SearchOverviewComponent.
     *
     * It declares a private SideInfoService instance
     * to update the search info title and a private
     * ActivatedRoute instance.
     *
     * @param {SideInfoService} sideInfoService Instance of the SideInfoService.
     * @param {ActivatedRoute} route Instance of the ActivatedRoute.
     */
    constructor(private sideInfoService: SideInfoService, private route: ActivatedRoute) {}

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.updateSearchInfoTitleFromPath();
    }

    /**
     * Public method: updateSearchInfoTitleFromPath.
     *
     * It gets the current url path
     * and sets  the search info title
     * from it via the SideInfoService.
     *
     * @returns {void} Updates the search info title.
     */
    updateSearchInfoTitleFromPath(): void {
        // get snapshot from current url path
        const path = this.route.snapshot.children[0].url[0].path;

        // filter searchButtonArray
        const selectedButton = this.searchButtonArray.filter(button => {
            return button.link === path;
        });

        // update side info title if path is in array
        if (selectedButton.length === 1) {
            this.sideInfoService.updateSearchInfoTitle(selectedButton[0].label);
        }
    }

    /**
     * Public method: onButtonSelect.
     *
     * It calls the updateSearchInfoTitle method to emit
     * a selected button label to the SideInfoService.
     *
     * @param {RouterLinkButton} routerLinkButton
     * The given router link button.
     *
     * @returns {void} Updates the search info title.
     */
    onButtonSelect(routerLinkButton: RouterLinkButton): void {
        const isButton = routerLinkButton instanceof RouterLinkButton;

        if (!routerLinkButton || !isButton || !routerLinkButton.label) {
            return;
        }
        this.sideInfoService.clearSearchInfoData();
        this.sideInfoService.updateSearchInfoTitle(routerLinkButton.label);
    }
}
