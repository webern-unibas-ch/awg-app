import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { MetaContact, MetaPage, MetaSectionTypes } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

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
    styleUrls: ['./contact-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: false,
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
     * It keeps the contact metadata for the contact view.
     */
    contactMetaData: MetaContact;

    /**
     * Public variable: pageMetaData.
     *
     * It keeps the page metadata for the contact view.
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
     * Private readonly injection variable: _coreService.
     *
     * It keeps the instance of the injected CoreService.
     */
    private readonly _coreService = inject(CoreService);

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.provideMetaData();
        this.today = Date.now();
    }

    /**
     * Public method: provideMetaData.
     *
     * It calls the CoreService to provide
     * the metadata for the contact view.
     *
     * @returns {void} Sets the pageMetaData variable.
     */
    provideMetaData(): void {
        this.pageMetaData = this._coreService.getMetaDataSection(MetaSectionTypes.page);
        this.contactMetaData = this._coreService.getMetaDataSection(MetaSectionTypes.contact);
    }
}
