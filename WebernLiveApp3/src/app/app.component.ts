import { Component, OnInit } from '@angular/core';

import { MenuModel } from './core/menu.model';
import { MenuService } from './core/menu.service';

@Component({
    selector: 'awg-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    selectedMenu: MenuModel;
    menu: MenuModel[];

    constructor(
        private menuService: MenuService
    ) { }

    ngOnInit() {
        this.prepareMenu();
    }

    prepareMenu(): void {
        this.menu = this.menuService.getMenu();
        this.selectedMenu = this.menuService.getActiveMenuItem(this.menu);
    }

    onMenuSelect(menuItem: MenuModel): void {
        this.selectedMenu = menuItem;
    }
}
