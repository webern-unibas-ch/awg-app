import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

import { Menu } from './models';
import { MENUDATA } from './menu.data';

@Injectable()
export class MenuService {

    constructor(private location: Location) { }

    public getMenu(): Menu[] {
        return MENUDATA;
    }

    public getActiveMenuItem(menu: Menu[]) {
        let activeItem: Menu;
        const home: string = '/home';
        let url: string = (this.location.path()) ? this.location.path() : home;
        let splitUrl: string[] = url.split('/');
        let activeRoot: string = '/' + ((splitUrl[0] !== '') ? splitUrl[0] : splitUrl [1]);
        menu.forEach(menuItem => {
            if (menuItem.linkTo === activeRoot) {
                activeItem = menuItem;
            }
        });
        return activeItem;
    }

}
