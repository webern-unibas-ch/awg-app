import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CoreService } from '@awg-core/services';
import { Meta } from '@awg-core/core-models';

@Component({
    selector: 'awg-contact-view',
    templateUrl: './contact-view.component.html',
    styleUrls: ['./contact-view.component.css']
})
export class ContactViewComponent implements OnInit {
    /**
     * Public variable: mastHeadTitle.
     *
     * It keeps the title of the masthead section.
     */
    mastHeadTitle = 'Impressum';

    /**
     * Public variable: mastHeadId.
     *
     * It keeps the id of the masthead section.
     */
    mastHeadId = 'awg-masthead';

    /**
     * Public variable: citationTitle.
     *
     * It keeps the title of the citation section.
     */
    citationTitle = 'Zitation';
    /**
     * Public variable: citationId.
     *
     * It keeps the id of the citation section.
     */
    citationId = 'awg-citation';

    /**
     * Public variable: documentationTitle.
     *
     * It keeps the title of the documentation section.
     */
    documentationTitle = 'Dokumentation';

    /**
     * Public variable: documentationId.
     *
     * It keeps the id of the documentation section.
     */
    documentationId = 'awg-documentation';

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
