import { Component, OnInit } from '@angular/core';

import { Logos, Meta } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

@Component({
    selector: 'awg-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
    metaData: Meta;
    logos: Logos;

    constructor(private coreService: CoreService) {}

    ngOnInit() {
        this.provideMetaData();
    }

    provideMetaData(): void {
        this.metaData = this.coreService.getMetaData();
        this.logos = this.coreService.getLogos();
    }
}
