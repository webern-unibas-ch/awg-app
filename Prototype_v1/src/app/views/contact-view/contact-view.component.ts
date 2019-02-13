import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CoreService } from '@awg-core/services';
import { Meta } from '@awg-core/core-models';

@Component({
    selector: 'awg-contact-view',
    templateUrl: './contact-view.component.html',
    styleUrls: ['./contact-view.component.css']
})
export class ContactViewComponent implements OnInit {
    mastHeadTitle = 'Impressum';
    mastHeadId = 'awg-masthead';

    citationTitle = 'Zitation';
    citationId = 'awg-citation';

    metaData: Meta;
    today: number;
    dateFormat = 'd. MMMM yyyy';

    constructor(private coreService: CoreService, private router: Router) {}

    ngOnInit() {
        this.routeToSidenav();
        this.provideMetaData();
        this.today = Date.now();
    }

    provideMetaData(): void {
        this.metaData = this.coreService.getMetaData();
    }

    routeToSidenav(): void {
        // opens the side-info outlet while preserving the router fragment for scrolling
        this.router.navigate([{ outlets: { side: 'contactInfo' } }], {
            preserveFragment: true,
            queryParamsHandling: 'preserve'
        });
    }
}
