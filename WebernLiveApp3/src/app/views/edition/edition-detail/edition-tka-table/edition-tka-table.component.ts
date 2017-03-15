import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'awg-edition-tka-table',
    templateUrl: './edition-tka-table.component.html',
    styleUrls: ['./edition-tka-table.component.css']
})
export class EditionTkaTableComponent implements OnInit {
    @Input() items: string[];

    constructor() { }

    ngOnInit() {
    }

}
