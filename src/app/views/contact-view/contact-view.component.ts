import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ButtonScrollToTopComponent } from '@awg-shared/button-scroll-to-top/button-scroll-to-top.component';
import { ExternalLinkDirective } from '@awg-shared/external-link/external-link.directive';
import { HeadingComponent } from '@awg-shared/heading/heading.component';
import { MetaIdentifierBadgesComponent } from '@awg-shared/meta/meta-identifier-badges/meta-identifier-badges.component';
import { META_DATA } from '@awg-shared/meta/meta.data';
import { MetaSectionTypes } from '@awg-shared/meta/meta.model';

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
    styleUrl: './contact-view.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ButtonScrollToTopComponent,
        DatePipe,
        ExternalLinkDirective,
        HeadingComponent,
        MetaIdentifierBadgesComponent,
    ],
})
export class ContactViewComponent {
    /**
     * Readonly variable: citationId.
     *
     * It keeps the id of the citation section.
     */
    readonly citationId = 'awg-citation';

    /**
     * Readonly variable: citationTitle.
     *
     * It keeps the title of the citation section.
     */
    readonly citationTitle = 'Zitation';

    /**
     * Readonly variable: imprintId.
     *
     * It keeps the id of the imprint section.
     */
    readonly imprintId = 'awg-imprint';

    /**
     * Readonly variable: imprintTitle.
     *
     * It keeps the title of the imprint section.
     */
    readonly imprintTitle = 'Impressum';

    /**
     * Readonly variable: documentationId.
     *
     * It keeps the id of the documentation section.
     */
    readonly documentationId = 'awg-documentation';

    /**
     * Readonly variable: documentationTitle.
     *
     * It keeps the title of the documentation section.
     */
    readonly documentationTitle = 'Dokumentation';

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
