import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'awg-structure-view',
    templateUrl: './structure-view.component.html',
    styleUrls: ['./structure-view.component.css']
})
export class StructureViewComponent implements OnInit {
    structureTitle = 'Datenstrukturmodell';
    structureId = 'structure';

    constructor(private router: Router) {}

    ngOnInit() {
        this.routeToSidenav();
    }

    routeToSidenav(): void {
        // opens the side-info outlet while preserving the router fragment for scrolling
        this.router.navigate([{ outlets: { side: 'structureInfo' } }], {
            preserveFragment: true,
            queryParamsHandling: 'preserve'
        });
    }
}
