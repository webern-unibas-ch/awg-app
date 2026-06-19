import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AppConfig } from '@awg-app/app.config';
import { MetaContact, MetaPage, MetaSectionTypes } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

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
     * Private readonly injection variable: _coreService.
     *
     * It keeps the instance of the injected CoreService.
     */
    private readonly _coreService = inject(CoreService);

    /**
     * Private readonly injection variable: _sanitizer.
     *
     * It keeps the instance of the injected Angular DomSanitizer.
     */
    private readonly _sanitizer = inject(DomSanitizer);

    /**
     * Public readonly variable: CONTACT_SIDE_INFO_HEADER.
     *
     * It keeps the header for the contact side info.
     */
    readonly CONTACT_SIDE_INFO_HEADER = 'Kontakt';

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
     * Public readonly signal: mapEmbedUrl.
     *
     * It holds the sanitized link to embed the map.
     */
    mapEmbedUrl = signal<SafeResourceUrl>(
        this._sanitizer.bypassSecurityTrustResourceUrl(AppConfig.CONTACT_MAP_UNSAFE_EMBED_URL) // NOSONAR: URL is a static, trusted source
    ).asReadonly();

    /**
     * Public readonly signal: mapLinkUrl.
     *
     * It holds the link to the external map page.
     */
    mapLinkUrl = signal<string>(AppConfig.CONTACT_MAP_LINK_URL).asReadonly();
}
