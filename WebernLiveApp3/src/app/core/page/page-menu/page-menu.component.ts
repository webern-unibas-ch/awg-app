import { Component, Input, OnInit } from '@angular/core';

import { Menu } from '../../models';

@Component({
    selector: 'awg-page-menu',
    templateUrl: './page-menu.component.html',
    styleUrls: ['./page-menu.component.css']
})
export class PageMenuComponent implements OnInit {
    @Input('menu') menu: [Menu];

    constructor() { }

    ngOnInit() {
    }

}
