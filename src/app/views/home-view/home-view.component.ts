import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Meta } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

@Component({
    selector: 'awg-home-view',
    templateUrl: './home-view.component.html',
    styleUrls: ['./home-view.component.css']
})
export class HomeViewComponent implements OnInit {
    metaData: Meta;

    constructor(private router: Router, private coreService: CoreService) {}

    ngOnInit() {
        this.routeToSidenav();
        this.provideMetaData();
    }

    provideMetaData(): void {
        this.metaData = this.coreService.getMetaData();
    }

    routeToSidenav(): void {
        // opens the side-info outlet while preserving the router fragment for scrolling
        this.router.navigate([{ outlets: { side: 'editionInfo' } }], {
            preserveFragment: true,
            queryParamsHandling: 'preserve'
        });
    }
}
