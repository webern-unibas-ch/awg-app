import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MetaContact, MetaPage } from '@awg-core/core-models';

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
     * Input signal: pageMetaData.
     *
     * It holds the page metadata for the contact address.
     */
    pageMetaData = input<MetaPage>({} as MetaPage);

    /**
     * Input signal: contactMetaData.
     *
     * It holds the contact metadata for the contact address.
     */
    contactMetaData = input<MetaContact>({} as MetaContact);
}
