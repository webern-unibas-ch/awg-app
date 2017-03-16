import { Component, Input, OnInit} from '@angular/core';
import { Menu } from '../../models';

@Component({
    selector: 'awg-page-sub-menu',
    templateUrl: './page-sub-menu.component.html',
    styleUrls: ['./page-sub-menu.component.css']
})
export class PageSubMenuComponent implements OnInit {
    @Input('selectedMenu') selectedMenu: Menu;

    constructor() { }

    ngOnInit() {
    }

}
