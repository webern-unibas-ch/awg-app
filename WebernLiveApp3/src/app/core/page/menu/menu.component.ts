import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Menu } from '../../models';

@Component({
    selector: 'awg-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
    @Input('menu') menu: [Menu];
    @Output() selectMenuItemRequest: EventEmitter<Menu> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    onMenuItemSelect(menuItem: Menu) {
        this.selectMenuItemRequest.emit(menuItem);
    }

}
