import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
     * Private readonly variable: osmRoot.
     *
     * The root of the OSM embed link.
     */
    private readonly osmRoot = 'https://www.openstreetmap.org/export/embed.html';

    /**
     * Private readonly variable: osmId.
     *
     * The id of the OSM embed link.
     */
    private readonly osmId =
        '?bbox=7.582175731658936%2C47.55789611508066%2C7.586840093135835%2C47.56003739001212&amp;layer=mapnik&amp;marker=47.55896585846639%2C7.584506571292877';

    /**
     * Private readonly variable: osmLinkRoot.
     *
     * The root of the OSM external link.
     */
    private readonly osmLinkRoot = 'https://www.openstreetmap.org/';

    /**
     * Private readonly variable: osmLinkId.
     *
     * The id of the OSM external link.
     */
    private readonly osmLinkId = '?mlat=47.55897&amp;mlon=7.58451#map=19/47.55897/7.58451';

    /**
     * Getter for the unsanitized OSM embed link.
     */
    get unsafeOsmUrl() {
        return this.osmRoot + this.osmId;
    }

    /**
     * Getter for the unsanitized OSM external link.
     */
    get unsafeOsmLinkUrl() {
        return this.osmLinkRoot + this.osmLinkId;
    }

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
        this.sanitizeUrls();
        this.provideMetaData();
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
        this.osmEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.unsafeOsmUrl);
        this.osmLinkUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.unsafeOsmLinkUrl);
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
}
