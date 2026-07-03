import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MetaContact, MetaPage } from '@awg-core/models/meta.model';

/**
 * The ContactAddress component.
 *
 * It contains an address field to be
 * filled from metadata information.
 */
@Component({
    selector: 'awg-contact-address',
    templateUrl: './contact-address.component.html',
    styleUrls: ['./contact-address.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactAddressComponent {
    /**
     * Readonly input signal: pageMetaData.
     *
     * It holds the page metadata for the contact address.
     */
    readonly pageMetaData = input.required<MetaPage>();

    /**
     * Readonly nput signal: contactMetaData.
     *
     * It holds the contact metadata for the contact address.
     */
    readonly contactMetaData = input.required<MetaContact>();
}
