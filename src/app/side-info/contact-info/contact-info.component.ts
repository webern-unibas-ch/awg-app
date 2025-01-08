import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AppConfig } from '@awg-app/app.config';
import { MetaContact, MetaPage, MetaSectionTypes } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

/**
 * The ContactInfo component.
 *
 * It contains the side-info section of the contact view
 * showing contact information and an Open Street Map (OSM).
 */
@Component({
    selector: 'awg-contact-info',
    templateUrl: './contact-info.component.html',
    styleUrls: ['./contact-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class ContactInfoComponent implements OnInit {
    /**
     * Public variable: contactInfoHeader.
     *
     * It keeps the header for the contact-info.
     */
    contactInfoHeader = 'Kontakt';

    /**
     * Public variable: contactMetaData.
     *
     * It keeps the contact metadata for the contact-info.
     */
    contactMetaData: MetaContact;

    /**
     * Public variable: pageMetaData.
     *
     * It keeps the page metadata for the contact-info.
     */
    pageMetaData: MetaPage;

    /**
     * Public variable: osmEmbedUrl.
     *
     * It keeps the sanitized link to embed the OSM map.
     */
    osmEmbedUrl: SafeResourceUrl;

    /**
     * Public variable: osmLinkUrl.
     *
     * It keeps the link to the OSM page.
     */
    osmLinkUrl: string;

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
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.provideMetaData();
        this.provideOSMUrls();
    }

    /**
     * Public method: provideMetaData.
     *
     * It calls the CoreService to provide
     * the metadata for the contact-info.
     *
     * @returns {void} Sets the pageMetaData variable.
     */
    provideMetaData(): void {
        this.pageMetaData = this._coreService.getMetaDataSection(MetaSectionTypes.page);
        this.contactMetaData = this._coreService.getMetaDataSection(MetaSectionTypes.contact);
    }

    /**
     * Public method: provideOSMUrls.
     *
     * It provides the URLs and links for the OpenStreetMap
     * using the Angular DomSanitizer.
     *
     * @returns {void} Provides the URLs.
     */
    provideOSMUrls(): void {
        this.osmEmbedUrl = this._sanitizer.bypassSecurityTrustResourceUrl(AppConfig.UNSAFE_OSM_EMBED_URL);
        this.osmLinkUrl = AppConfig.OSM_LINK_URL;
    }
}
