import { Component, OnInit } from '@angular/core';

import { Meta } from '../../core/core-models';
import { MetaService } from '../../core/services';

@Component({
    selector: 'awg-structure-info',
    templateUrl: './structure-info.component.html',
    styleUrls: ['./structure-info.component.css']
})
export class StructureInfoComponent implements OnInit {

    public meta: Meta;
    public author: string;
    public lastModified: string;

    constructor(private metaService: MetaService) { }

    ngOnInit() {
        this.provideMetaData();
    }

    public provideMetaData(): void {
        this.meta = this.metaService.getMetaData();
        this.author = this.meta.structure.author;
        this.lastModified = this.meta.structure.lastModified;
    }
}
