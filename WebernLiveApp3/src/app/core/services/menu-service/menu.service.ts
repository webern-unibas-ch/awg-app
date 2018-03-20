import { Injectable } from '@angular/core';

import { Menu } from '../../models';
import { MENUDATA } from '../../mock-data';

@Injectable()
export class MenuService {

    constructor() { }

    /********************************
     *
     * get MenuData
     *
     ********************************/
    public getMenu(): Menu[] {
        return MENUDATA;
    }

    /********************************
     *
     * get active item of menu
     *
     * @returns activeItem<Menu>
     *
     ********************************/
    public getActiveMenuItem(menu: Menu[], path?: string) {
        let activeItem: Menu;
        const home: string = '/home';
        const re = /(\/[\w:]+)/;
        let url: string = (path) ? path : home;
        // extract single paths via regex and filter empty results
        let splitUrl: string[] = url.split(re).filter(n => n);
        // get first path
        let activeRoot: string = ((splitUrl[0] !== '') ? splitUrl[0] : splitUrl [1]);
        // find this path in menu to identify the active menuItem
        menu.forEach(menuItem => {
            if (menuItem.linkTo === activeRoot) {
                activeItem = menuItem;
            }
        });
        return activeItem;
    }

}
