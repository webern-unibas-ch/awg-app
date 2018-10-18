import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Meta } from '@awg-core/core-models';
import { MetaService } from '@awg-core/services';

@Component({
    selector: 'awg-home-view',
    templateUrl: './home-view.component.html',
    styleUrls: ['./home-view.component.css']
})
export class HomeViewComponent implements OnInit {
    metaData: Meta;

    constructor(private router: Router, private metaService: MetaService) {}

    ngOnInit() {
        this.routeToSidenav();
        this.provideMetaData();
    }

    provideMetaData(): void {
        this.metaData = this.metaService.getMetaData();
    }

    routeToSidenav(): void {
        // opens the side-info outlet while preserving the router fragment for scrolling
        this.router.navigate([{ outlets: { side: 'editionInfo' } }], { preserveFragment: true });
    }
}
