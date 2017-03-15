import { Component, OnInit } from '@angular/core';

import { Menu } from './core/models/menu.model';
import { Meta } from './core/models/meta.model';
import { MenuService } from './core/menu.service';
import { MetaService } from './core/meta.service';

@Component({
    selector: 'awg-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public metaData: Meta;
    public menu: Menu[];
    public selectedMenu: Menu;

    constructor(
        private menuService: MenuService,
        private metaService: MetaService
    ) { }

    ngOnInit() {
        this.provideMenu();
        this.provideMetaData();
    }

    public onMenuSelect(menuItem: Menu): void {
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
