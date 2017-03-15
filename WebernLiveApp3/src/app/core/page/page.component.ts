import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Menu } from '../models';

@Component({
    selector: 'awg-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
    @Input('menu') menu: [Menu];
    @Input('selectedMenu') selectedMenu: Menu;
    @Output() selectMenuItemRequest: EventEmitter<Menu> = new EventEmitter();

    constructor() { }

    ngOnInit() {

    }

    onMenuItemSelect(menuItem: Menu) {
        this.selectMenuItemRequest.emit(menuItem);
    }

}
