import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MetaContact, MetaPage } from '@awg-core/core-models';

/**
 * The Address component.
 *
 * It contains an address field to be
 * filled from meta data information and to be
 * provided via the {@link SharedModule}.
 */
@Component({
    selector: 'awg-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent {
    /**
     * Input variable: pageMetaData.
     *
     * It keeps the page meta data for the address.
     */
    @Input()
    pageMetaData: MetaPage;

    /**
     * Input variable: contactMetaData.
     *
     * It keeps the contact meta data for the address.
     */
    @Input()
    contactMetaData: MetaContact;
}
