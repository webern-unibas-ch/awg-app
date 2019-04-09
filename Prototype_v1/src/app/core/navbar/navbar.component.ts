import { Component, OnInit } from '@angular/core';

import { faFileAlt, faEnvelope, faHome, faNetworkWired, faSearch } from '@fortawesome/free-solid-svg-icons';

import { Meta } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

@Component({
    selector: 'awg-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    isCollapsed = true;

    metaData: Meta;

    // fontawesome icons
    faEnvelope = faEnvelope;
    faFileAlt = faFileAlt;
    faHome = faHome;
    faNetworkWired = faNetworkWired;
    faSearch = faSearch;

    constructor(private coreService: CoreService) {}

    ngOnInit() {
        this.provideMetaData();
    }

    provideMetaData(): void {
        this.metaData = this.coreService.getMetaData();
    }

    toggleNav(): boolean {
        return (this.isCollapsed = !this.isCollapsed);
    }
}
