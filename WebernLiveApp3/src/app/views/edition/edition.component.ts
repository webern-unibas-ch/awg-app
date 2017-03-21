import { Component, OnInit } from '@angular/core';

import { Meta } from '../../core/models';
import { MetaService } from '../../core/services';

@Component({
    selector: 'awg-edition',
    templateUrl: './edition.component.html',
    styleUrls: ['./edition.component.css']
})
export class EditionComponent implements OnInit {

    public metaData: Meta;

    constructor(
        private metaService: MetaService
    ) { }

    ngOnInit() {
        this.getMetaData();
    }

    getMetaData(): void {
        this.metaData = this.metaService.getMetaData();
    }

}
