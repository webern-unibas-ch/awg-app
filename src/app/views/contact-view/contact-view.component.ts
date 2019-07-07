import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CoreService } from '@awg-core/services';
import { MetaContact, MetaPage, MetaSectionKey } from '@awg-core/core-models';

/**
 * The ContactView component.
 *
 * It contains the contact view section of the app
 * with multiple  {@link HeadingComponent}s and
 * sections for citation, documentation and imprint.
 */
@Component({
    selector: 'awg-contact-view',
    templateUrl: './contact-view.component.html',
    styleUrls: ['./contact-view.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactViewComponent implements OnInit {
    /**
     * Public variable: imprintTitle.
     *
     * It keeps the title of the imprint section.
     */
    imprintTitle = 'Impressum';

    /**
     * Public variable: imprintId.
     *
     * It keeps the id of the imprint section.
     */
    imprintId = 'awg-imprint';

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

    /**
     * Public variable: contactMetaData.
     *
     * It keeps the contact meta data for the contact view.
     */
    contactMetaData: MetaContact;

    /**
     * Public variable: pageMetaData.
     *
     * It keeps the page meta data for the contact view.
     */
    pageMetaData: MetaPage;

    /**
     * Public variable: today.
     *
     * It keeps the current date for the contact view.
     */
    today: number;

    /**
     * Public variable: dateFormat.
     *
     * It keeps the date format for the contact view.
     */
    dateFormat = 'd. MMMM yyyy';

    /**
     * Constructor of the ContactViewComponent.
     *
     * It declares a private CoreService instance
     * to get the meta data and a private Router instance.
     *
     * @param {CoreService} coreService Instance of the CoreService.
     * @param {Router} router Instance of the Angular router.
     */
    constructor(private coreService: CoreService, private router: Router) {}

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.routeToSidenav();
        this.provideMetaData();
        this.today = Date.now();
    }

    /**
     * Public method: provideMetaData.
     *
     * It calls the CoreService to provide
     * the meta data for the contact view.
     *
     * @returns {void} Sets the pageMetaData variable.
     */
    provideMetaData(): void {
        this.pageMetaData = this.coreService.getMetaDataSection(MetaSectionKey.page);
        this.contactMetaData = this.coreService.getMetaDataSection(MetaSectionKey.contact);
    }

    /**
     * Public method: routeToSidenav.
     *
     * It activates the secondary outlet with the contact-info.
     *
     * @returns {void} Activates the contact-info side outlet.
     */
    routeToSidenav(): void {
        // opens the side-info outlet while preserving the router fragment for scrolling
        this.router.navigate([{ outlets: { side: 'contactInfo' } }], {
            preserveFragment: true,
            queryParamsHandling: 'preserve'
        });
    }
}
