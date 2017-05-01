import { Component, Input, OnInit } from '@angular/core';
import { Meta } from '../core-models/meta.model';

@Component({
    selector: 'awg-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
    @Input() meta: Meta;
    private editors: string;
    private lastModified: string;

    constructor() { }

    ngOnInit() {
        this.editors = this.meta.edition.editors;
        this.lastModified = this.meta.edition.lastModified;
    }

}
