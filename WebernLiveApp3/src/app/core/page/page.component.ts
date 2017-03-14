import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MenuModel } from '../menu.model';

@Component({
    selector: 'awg-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
    @Input('menu') menu: [MenuModel];
    @Input('selectedMenu') selectedMenu: MenuModel;
    @Output() selectMenuItemRequest: EventEmitter<MenuModel> = new EventEmitter();

    constructor() { }

    ngOnInit() {

    }

    onMenuItemSelect(menuItem: MenuModel) {
        this.selectMenuItemRequest.emit(menuItem);
    }

}
