import { Component, OnInit } from '@angular/core';

import { RouterLinkButton } from '@awg-shared/router-link-button-group/router-link-button.model';

/**
 * The EditionOverview component.
 *
 * It contains the overview section
 * of the edition view of the app
 * with a {@link RouterLinkButtonGroupComponent} and
 * another router outlet for the edition routes.
 */
@Component({
    selector: 'awg-edition-overview',
    templateUrl: './edition-overview.component.html',
    styleUrls: ['./edition-overview.component.css']
})
export class EditionOverviewComponent implements OnInit {
    /**
     * Public variable: editionButtonArray.
     *
     * It keeps the array for the edition router link buttons.
     */
    editionButtonArray: RouterLinkButton[];

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.setButtons();
    }

    /**
     * Public method: setButtons.
     *
     * It initializes the editionButtonArray.
     *
     * @returns {void} Sets the editionButtonArray.
     */
    setButtons(): void {
        this.editionButtonArray = [
            new RouterLinkButton('/edition', 'intro', 'Einleitung', false),
            new RouterLinkButton('/edition', 'detail', 'Edierter Notentext', false),
            new RouterLinkButton('/edition', 'report', 'Kritischer Bericht', false)
        ];
    }
}
