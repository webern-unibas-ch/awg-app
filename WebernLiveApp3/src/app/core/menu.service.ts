import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

import { MenuModel } from './menu.model';
import { MENUDATA } from './menu-data';

@Injectable()
export class MenuService {

    constructor(private location: Location) { }

    public getMenu(): MenuModel[] {
        return MENUDATA;
    }

    public getActiveMenuItem(menu: MenuModel[]) {
        let activeItem: MenuModel;
        const home: string = '/project';
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
