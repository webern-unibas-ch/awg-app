import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'awg-edition-detail-tka-table',
    templateUrl: './edition-detail-tka-table.component.html',
    styleUrls: ['./edition-detail-tka-table.component.css']
})
export class EditionDetailTkaTableComponent implements OnInit {
    @Input() items: string[];

    constructor() { }

    ngOnInit() {
    }

}
