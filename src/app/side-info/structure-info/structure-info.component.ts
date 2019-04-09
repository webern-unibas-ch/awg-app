import { Component, OnInit } from '@angular/core';

import { Meta } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

@Component({
    selector: 'awg-structure-info',
    templateUrl: './structure-info.component.html',
    styleUrls: ['./structure-info.component.css']
})
export class StructureInfoComponent implements OnInit {
    meta: Meta;
    author: string;
    lastModified: string;

    constructor(private coreService: CoreService) {}

    ngOnInit() {
        this.provideMetaData();
    }

    provideMetaData(): void {
        this.meta = this.coreService.getMetaData();
        this.author = this.meta.structure.author;
        this.lastModified = this.meta.structure.lastModified;
    }
}
