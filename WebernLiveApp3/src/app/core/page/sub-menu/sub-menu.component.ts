import { Component, Input, OnInit} from '@angular/core';
import { Menu } from '../../models';

@Component({
    selector: 'awg-sub-menu',
    templateUrl: './sub-menu.component.html',
    styleUrls: ['./sub-menu.component.css']
})
export class SubMenuComponent implements OnInit {
    @Input('selectedMenu') selectedMenu: Menu;

    constructor() { }

    ngOnInit() {
    }

}
