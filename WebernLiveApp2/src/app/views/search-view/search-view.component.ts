import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'awg-search-view',
    templateUrl: './search-view.component.html',
    styleUrls: ['./search-view.component.css']
})
export class SearchViewComponent implements OnInit {

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
