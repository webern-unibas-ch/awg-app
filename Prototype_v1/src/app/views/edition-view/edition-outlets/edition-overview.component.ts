import { Component, OnInit } from '@angular/core';

import { RouterLinkButton } from '@awg-shared/router-link-button-group/router-link-button.model';

@Component({
    selector: 'awg-edition-overview',
    templateUrl: './edition-overview.component.html',
    styleUrls: ['./edition-overview.component.css']
})
export class EditionOverviewComponent implements OnInit {

    public buttonArray: RouterLinkButton[] = [
        {
            root: '/edition',
            link: 'intro',
            label: 'Einleitung',
            disabled: false
        },
        {
            root: '/edition',
            link: 'detail',
            label: 'Edierter Notentext',
            disabled: false
        },
        {
            root: '/edition',
            link: 'report',
            label: 'Kritischer Bericht',
            disabled: false
        }
    ];

    constructor( ) { }

    ngOnInit() {
    }

}
