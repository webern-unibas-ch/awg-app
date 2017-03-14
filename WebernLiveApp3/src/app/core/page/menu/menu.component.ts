import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuModel } from '../../menu.model';

@Component({
    selector: 'awg-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
    @Input('menu') menu: [MenuModel];
    @Output() selectMenuItemRequest: EventEmitter<MenuModel> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    onMenuItemSelect(menuItem: MenuModel) {
        this.selectMenuItemRequest.emit(menuItem);
    }

}
