import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { MetaContact, MetaPage, MetaSectionTypes } from '@awg-core/models/meta.model';
import { CoreService } from '@awg-core/services/core-service/core.service';
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
     * Readonly variable: CITATION_ID.
     *
     * It keeps the id of the citation section.
     */
    readonly CITATION_ID = 'awg-citation';

    /**
     * Readonly variable: CITATION_TITLE.
     *
     * It keeps the title of the citation section.
     */
    readonly CITATION_TITLE = 'Zitation';

    /**
     * Readonly variable: IMPRINT_ID.
     *
     * It keeps the id of the imprint section.
     */
    readonly IMPRINT_ID = 'awg-imprint';

    /**
     * Readonly variable: IMPRINT_TITLE.
     *
     * It keeps the title of the imprint section.
     */
    readonly IMPRINT_TITLE = 'Impressum';

    /**
     * Readonly variable: DOCUMENTATION_ID.
     *
     * It keeps the id of the documentation section.
     */
    readonly DOCUMENTATION_ID = 'awg-documentation';

    /**
     * Readonly variable: DOCUMENTATION_TITLE.
     *
     * It keeps the title of the documentation section.
     */
    readonly DOCUMENTATION_TITLE = 'Dokumentation';

    /**
     * Readonly signal: contactMetaData.
     *
     * It holds the contact metadata for the contact view via the injected CoreService.
     */
    readonly contactMetaData = signal<MetaContact>(
        this._coreService.getMetaDataSection(MetaSectionTypes.contact)
    ).asReadonly();

    /**
     * Readonly signal: pageMetaData.
     *
     * It holds the page metadata for the contact view via the injected CoreService.
     */
    readonly pageMetaData = signal<MetaPage>(this._coreService.getMetaDataSection(MetaSectionTypes.page)).asReadonly();

    /**
     * Readonly signal: today.
     *
     * It holds the current date for the contact view.
     */
    readonly today = signal<number>(Date.now()).asReadonly();
}
