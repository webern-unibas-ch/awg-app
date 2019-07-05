import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AppConfig } from '@awg-app/app.config';
import { MetaContact, MetaPage, MetaSectionKey } from '@awg-core/core-models';
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
    styleUrls: ['./contact-info.component.css']
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
     * It keeps the contact meta data for the contact-info.
     */
    contactMetaData: MetaContact;

    /**
     * Public variable: pageMetaData.
     *
     * It keeps the page meta data for the contact-info.
     */
    pageMetaData: MetaPage;

    /**
     * Private variable: _osmEmbedUrl.
     *
     * It keeps the sanitized link to embed the OSM map.
     */
    private _osmEmbedUrl: SafeResourceUrl;

    /**
     * Private variable: _osmLinkUrl.
     *
     * It keeps the sanitized link to the OSM page.
     */
    private _osmLinkUrl: SafeResourceUrl;

    /**
     * Getter for the sanitized OSM embed link.
     */
    get osmEmbedUrl() {
        return this._osmEmbedUrl;
    }

    /**
     * Setter for the sanitized OSM embed link.
     */
    set osmEmbedUrl(url: SafeResourceUrl) {
        this._osmEmbedUrl = url;
    }

    /**
     * Getter for the sanitized OSM external link.
     */
    get osmLinkUrl() {
        return this._osmLinkUrl;
    }

    /**
     * Setter for the sanitized OSM external link.
     */
    set osmLinkUrl(url: SafeResourceUrl) {
        this._osmLinkUrl = url;
    }

    /**
     * Constructor of the ContactInfoComponent.
     *
     * It declares a private CoreService instance
     * to get the meta data and a private DomSanitizer instance.
     *
     * @param {CoreService} coreService Instance of the CoreService.
     * @param {DomSanitizer} sanitizer Instance of the Angular DomSanitizer.
     */
    constructor(private coreService: CoreService, private sanitizer: DomSanitizer) {}

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.provideMetaData();
        this.sanitizeUrls();
    }

    /**
     * Public method: provideMetaData.
     *
     * It calls the CoreService to provide
     * the meta data for the contact-info.
     *
     * @returns {void} Sets the pageMetaData variable.
     */
    provideMetaData(): void {
        this.pageMetaData = this.coreService.getMetaDataSection(MetaSectionKey.page);
        this.contactMetaData = this.coreService.getMetaDataSection(MetaSectionKey.contact);
    }

    /**
     * Public method: sanitizeUrls.
     *
     * It sanitizes the URLs and links
     * for the OpenStreetMap
     * using the Angular DomSanitizer.
     *
     * @returns {void} Sanitizes the URLs.
     */
    sanitizeUrls(): void {
        this.osmEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(AppConfig.UNSAFE_OSM_EMBED_URL);
        this.osmLinkUrl = this.sanitizer.bypassSecurityTrustResourceUrl(AppConfig.UNSAFE_OSM_LINK_URL);
    }
}
