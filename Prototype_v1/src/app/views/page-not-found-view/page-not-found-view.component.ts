import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'awg-page-not-found-view',
    templateUrl: './page-not-found-view.component.html',
    styleUrls: ['./page-not-found-view.component.css']
})
export class PageNotFoundViewComponent implements OnInit {
    title = 'Page not found';

    constructor() {}

    ngOnInit() {}
}
