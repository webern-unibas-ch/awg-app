import { Component, OnInit } from '@angular/core';

import { Meta } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

@Component({
    selector: 'awg-edition-info',
    templateUrl: './edition-info.component.html',
    styleUrls: ['./edition-info.component.css']
})
export class EditionInfoComponent implements OnInit {
    metaData: Meta;

    constructor(private coreService: CoreService) {}

    ngOnInit() {
        this.provideMetaData();
    }

    provideMetaData(): void {
        this.metaData = this.coreService.getMetaData();
    }
}
