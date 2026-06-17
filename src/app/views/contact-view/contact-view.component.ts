import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { MetaContact, MetaPage, MetaSectionTypes } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';
import { HeadingComponent } from '@awg-shared/heading/heading.component';
import { MetaIdentifierBadgesComponent } from '@awg-shared/meta-identifier-badges/meta-identifier-badges.component';

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
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePipe, HeadingComponent, MetaIdentifierBadgesComponent],
})
export class ContactViewComponent {
    /**
     * Private readonly injection variable: _coreService.
     *
     * It keeps the instance of the injected CoreService.
     */
    private readonly _coreService = inject(CoreService);

    /**
     * Public readonly variable: CITATION_ID.
     *
     * It keeps the id of the citation section.
     */
    readonly CITATION_ID = 'awg-citation';

    /**
     * Public readonly variable: CITATION_TITLE.
     *
     * It keeps the title of the citation section.
     */
    readonly CITATION_TITLE = 'Zitation';

    /**
     * Public readonly variable: IMPRINT_ID.
     *
     * It keeps the id of the imprint section.
     */
    readonly IMPRINT_ID = 'awg-imprint';

    /**
     * Public readonly variable: IMPRINT_TITLE.
     *
     * It keeps the title of the imprint section.
     */
    readonly IMPRINT_TITLE = 'Impressum';

    /**
     * Public readonly variable: DOCUMENTATION_ID.
     *
     * It keeps the id of the documentation section.
     */
    readonly DOCUMENTATION_ID = 'awg-documentation';

    /**
     * Public readonly variable: DOCUMENTATION_TITLE.
     *
     * It keeps the title of the documentation section.
     */
    readonly DOCUMENTATION_TITLE = 'Dokumentation';

    /**
     * Public readonly signal: contactMetaData.
     *
     * It holds the contact metadata for the contact view via the injected CoreService.
     */
    contactMetaData = signal<MetaContact>(this._coreService.getMetaDataSection(MetaSectionTypes.contact)).asReadonly();

    /**
     * Public readonly signal: pageMetaData.
     *
     * It holds the page metadata for the contact view via the injected CoreService.
     */
    pageMetaData = signal<MetaPage>(this._coreService.getMetaDataSection(MetaSectionTypes.page)).asReadonly();

    /**
     * Public readonly signal: today.
     *
     * It holds the current date for the contact view.
     */
    today = signal<number>(Date.now()).asReadonly();
}
