import { Component, Input, OnInit } from '@angular/core';

import { Menu } from '../../models';

@Component({
    selector: 'awg-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
    @Input('menu') menu: [Menu];

    constructor() { }

    ngOnInit() {
    }

}
