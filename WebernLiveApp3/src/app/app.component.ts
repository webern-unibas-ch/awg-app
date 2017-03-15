import { Component, OnInit } from '@angular/core';

import { MenuModel } from './core/menu.model';
import { MetaModel } from './core/meta.model';
import { MenuService } from './core/menu.service';
import { MetaService } from './core/meta.service';

@Component({
    selector: 'awg-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public metaData: MetaModel;
    public menu: MenuModel[];
    public selectedMenu: MenuModel;

    constructor(
        private menuService: MenuService,
        private metaService: MetaService
    ) { }

    ngOnInit() {
        this.provideMenu();
        this.provideMetaData();
    }

    public onMenuSelect(menuItem: MenuModel): void {
        this.selectedMenu = menuItem;
    }

    private provideMenu(): void {
        this.menu = this.menuService.getMenu();
        this.selectedMenu = this.menuService.getActiveMenuItem(this.menu);
    }

    private provideMetaData(): void {
        this.metaData = this.metaService.getMetaData();
    }
}
