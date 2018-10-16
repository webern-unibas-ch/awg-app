import { Component, OnInit } from '@angular/core';

import { Meta } from '@awg-core/core-models';
import { MetaService } from '@awg-core/services';

@Component({
    selector: 'awg-edition-info',
    templateUrl: './edition-info.component.html',
    styleUrls: ['./edition-info.component.css']
})
export class EditionInfoComponent implements OnInit {
    public meta: Meta;
    public editors: string;
    public lastModified: string;

    constructor(private metaService: MetaService) {}

    ngOnInit() {
        this.provideMetaData();
    }

    public provideMetaData(): void {
        this.meta = this.metaService.getMetaData();
        this.editors = this.meta.edition.editors;
        this.lastModified = this.meta.edition.lastModified;
    }
}
