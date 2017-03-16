import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';

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
        private metaService: MetaService,
        private menuService: MenuService,
        private router: Router
    ) {
        router.events
            .filter(event => event instanceof NavigationEnd)
            .subscribe((event) => {
                let path = event['urlAfterRedirects'];
                this.provideActiveMenu(path);
            });
    }

    ngOnInit() {
        this.provideMenu();
        this.provideMetaData();
    }

   private provideMenu(): void {
        this.menu = this.menuService.getMenu();
        this.provideActiveMenu();
    }

    private provideMetaData(): void {
        this.metaData = this.metaService.getMetaData();
    }

    private provideActiveMenu(path?: string): void {
        this.selectedMenu = this.menuService.getActiveMenuItem(this.menu, path);
    }
}
