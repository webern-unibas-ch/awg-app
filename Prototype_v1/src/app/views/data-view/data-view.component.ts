import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'awg-data',
    templateUrl: './data-view.component.html',
    styleUrls: ['./data-view.component.css']
})
export class DataViewComponent implements OnInit {
    public searchTitle = 'Suche';
    public searchId = 'search';

    constructor(private router: Router) {}

    ngOnInit() {
        this.routeToSidenav();
    }

    routeToSidenav(): void {
        // opens the side-info outlet while preserving the router fragment for scrolling
        this.router.navigate([{ outlets: { side: 'searchInfo' } }], {
            preserveFragment: true,
            queryParamsHandling: 'preserve'
        });
    }
}
