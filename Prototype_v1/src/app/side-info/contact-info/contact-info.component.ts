import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Meta } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

@Component({
    selector: 'awg-contact-info',
    templateUrl: './contact-info.component.html',
    styleUrls: ['./contact-info.component.css']
})
export class ContactInfoComponent implements OnInit {
    private osmRoot = 'https://www.openstreetmap.org/export/embed.html';
    private osmId =
        '?bbox=7.582175731658936%2C47.55789611508066%2C7.586840093135835%2C47.56003739001212&amp;layer=mapnik&amp;marker=47.55896585846639%2C7.584506571292877';
    private osmLinkRoot = 'https://www.openstreetmap.org/';
    private osmLinkId = '?mlat=47.55897&amp;mlon=7.58451#map=19/47.55897/7.58451';

    unsafeOsmUrl: string;
    unsafeOsmLinkUrl: string;
    osmUrl: SafeResourceUrl;
    osmLinkUrl: SafeResourceUrl;

    metaData: Meta;

    constructor(private coreService: CoreService, private sanitizer: DomSanitizer) {}

    ngOnInit() {
        this.unsafeOsmUrl = this.osmRoot + this.osmId;
        this.unsafeOsmLinkUrl = this.osmLinkRoot + this.osmLinkId;
        this.osmUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.unsafeOsmUrl);
        this.osmLinkUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.unsafeOsmLinkUrl);

        this.provideMetaData();
    }

    provideMetaData(): void {
        this.metaData = this.coreService.getMetaData();
    }
}
