import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SideInfoService } from '@awg-core/services';
import { RouterLinkButton } from '@awg-shared/router-link-button-group/router-link-button.model';

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
    styleUrls: ['./search-overview.component.scss'],
    standalone: false,
})
export class SearchOverviewComponent implements OnInit {
    /**
     * Public variable: searchRouterLinkButtons.
     *
     * It keeps the array for the search router link buttons.
     */
    searchRouterLinkButtons: RouterLinkButton[];

    /**
     * Private readonly injection variable: _sideInfoService.
     *
     * It keeps the instance of the injected SideInfoService.
     */
    private readonly _sideInfoService = inject(SideInfoService);

    /**
     * Private readonly injection variable: _route.
     *
     * It keeps the instance of the injected Angular ActivatedRoute.
     */
    private readonly _route = inject(ActivatedRoute);

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.setButtons();
        this.updateSearchInfoTitleFromPath();
    }

    /**
     * Public method: setButtons.
     *
     * It initializes the searchRouterLinkButtons.
     *
     * @returns {void} Sets the searchRouterLinkButtons.
     */
    setButtons(): void {
        this.searchRouterLinkButtons = [
            new RouterLinkButton('/data', 'search', 'Suche', false),
            new RouterLinkButton('/data', 'timeline', 'Timeline', true),
            new RouterLinkButton('/data', 'bibliography', 'Bibliographie', true),
        ];
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
        // Get snapshot from current url path
        const path = this._route.snapshot.url[0].path;

        // Filter searchButtonArray
        const selectedButton = this.searchRouterLinkButtons.filter(button => button.link === path);

        // Update side info title if path is in array
        if (selectedButton.length === 1) {
            this._sideInfoService.updateSearchInfoTitle(selectedButton[0].label);
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
        this._sideInfoService.clearSearchInfoData();
        this._sideInfoService.updateSearchInfoTitle(routerLinkButton.label);
    }
}
