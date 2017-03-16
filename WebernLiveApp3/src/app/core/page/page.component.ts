import { Component, Input, OnInit } from '@angular/core';

import { Menu } from '../models';

@Component({
    selector: 'awg-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
    @Input('menu') menu: [Menu];
    @Input('selectedMenu') selectedMenu: Menu;

    constructor() { }

    ngOnInit() {

    }

}
