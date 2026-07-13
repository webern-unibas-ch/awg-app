import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ExternalLinkDirective } from '@awg-shared/external-link/external-link.directive';
import { HeadingComponent } from '@awg-shared/heading/heading.component';
import { MetaIdentifierBadgesComponent } from '@awg-shared/meta/meta-identifier-badges/meta-identifier-badges.component';
import { META_DATA } from '@awg-shared/meta/meta.data';
import { MetaSectionTypes } from '@awg-shared/meta/meta.model';
import { ScrollToTopButtonComponent } from '@awg-shared/scroll-to-top-button/scroll-to-top-button.component';

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
    imports: [
        DatePipe,
        ExternalLinkDirective,
        HeadingComponent,
        MetaIdentifierBadgesComponent,
        ScrollToTopButtonComponent,
    ],
})
export class ContactViewComponent {
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
     * Readonly variable: contactMetaData.
     *
     * It keeps the contact metadata for the contact view.
     */
    readonly contactMetaData = META_DATA[MetaSectionTypes.contact];

    /**
     * Readonly variable: pageMetaData.
     *
     * It keeps the page metadata for the contact view.
     */
    readonly pageMetaData = META_DATA[MetaSectionTypes.page];

    /**
     * Readonly signal: today.
     *
     * It holds the current date for the contact view.
     */
    readonly today = signal<number>(Date.now()).asReadonly();
}
