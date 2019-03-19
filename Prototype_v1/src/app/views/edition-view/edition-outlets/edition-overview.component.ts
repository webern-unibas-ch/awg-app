import { Component, OnInit } from '@angular/core';

import { RouterLinkButton } from '@awg-shared/router-link-button-group/router-link-button.model';

@Component({
    selector: 'awg-edition-overview',
    templateUrl: './edition-overview.component.html',
    styleUrls: ['./edition-overview.component.css']
})
export class EditionOverviewComponent implements OnInit {
    editionButtonArray: RouterLinkButton[];

    constructor() {}

    ngOnInit() {
        this.editionButtonArray = [
            new RouterLinkButton('/edition', 'intro', 'Einleitung', false),
            new RouterLinkButton('/edition', 'detail', 'Edierter Notentext', false),
            new RouterLinkButton('/edition', 'report', 'Kritischer Bericht', false)
        ];
    }
}
