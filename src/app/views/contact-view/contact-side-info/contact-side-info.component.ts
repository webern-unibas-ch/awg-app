import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AppConfig } from '@awg-app/app.config';
import { META_DATA } from '@awg-shared/meta/meta.data';
import { MetaSectionTypes } from '@awg-shared/meta/meta.model';

import { ContactAddressComponent } from '../contact-address/contact-address.component';
import { ContactMapComponent } from '../contact-map/contact-map.component';

/**
 * The ContactSideInfo component.
 *
 * It contains the side-info section of the contact view
 * showing contact information and a map.
 */
@Component({
    selector: 'awg-contact-side-info',
    templateUrl: './contact-side-info.component.html',
    styleUrls: ['./contact-side-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ContactAddressComponent, ContactMapComponent],
})
export class ContactSideInfoComponent {
    /**
     * Private readonly injection variable: _sanitizer.
     *
     * It keeps the instance of the injected Angular DomSanitizer.
     */
    private readonly _sanitizer = inject(DomSanitizer);

    /**
     * Readonly variable: CONTACT_SIDE_INFO_HEADER.
     *
     * It keeps the header for the contact side info.
     */
    readonly CONTACT_SIDE_INFO_HEADER = 'Kontakt';

    /**
     * Readonly variable: contactMetaData.
     *
     * It keeps the contact metadata for the contact side info.
     */
    readonly contactMetaData = META_DATA[MetaSectionTypes.contact];

    /**
     * Readonly variable: pageMetaData.
     *
     * It holds the page metadata for the contact side info.
     */
    readonly pageMetaData = META_DATA[MetaSectionTypes.page];

    /**
     * Readonly variable: mapEmbedUrl.
     *
     * It keeps the sanitized link to embed the map.
     */
    // Prettier-ignore
    readonly mapEmbedUrl: SafeResourceUrl = this._sanitizer.bypassSecurityTrustResourceUrl( AppConfig.CONTACT_MAP_UNSAFE_EMBED_URL); // NOSONAR: URL is a static, trusted source

    /**
     * Readonly variable: mapLinkUrl.
     *
     * It keeps the link to the external map page.
     */
    readonly mapLinkUrl = AppConfig.CONTACT_MAP_LINK_URL;
}
