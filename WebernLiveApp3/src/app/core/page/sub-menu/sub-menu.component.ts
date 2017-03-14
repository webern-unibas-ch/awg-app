import { Component, Input, OnInit} from '@angular/core';
import { MenuModel } from '../../menu.model';

@Component({
    selector: 'awg-sub-menu',
    templateUrl: './sub-menu.component.html',
    styleUrls: ['./sub-menu.component.css']
})
export class SubMenuComponent implements OnInit {
    @Input('selectedMenu') selectedMenu: MenuModel;

    constructor() { }

    ngOnInit() {
    }

}
