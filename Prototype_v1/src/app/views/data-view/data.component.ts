import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'awg-data',
    templateUrl: './data.component.html',
    styleUrls: ['./data.component.css']
})
export class DataViewComponent implements OnInit {

    public searchTitle = 'Suche';
    public searchId = 'search';

    constructor(private router: Router) { }

    ngOnInit() {
        this.routeToSidenav();
    }

    public routeToSidenav(): void {
        this.router.navigate([{ outlets: { side: 'searchInfo' }}]);
    }

}
